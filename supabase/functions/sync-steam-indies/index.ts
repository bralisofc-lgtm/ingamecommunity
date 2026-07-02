// Cron-friendly: pesquisa próximos indies na Steam, filtra com IA (Lovable AI Gateway)
// e sincroniza a tabela public.lancamentos.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const CDN = "https://cdn.cloudflare.steamstatic.com/steam/apps";
const cover = (id: number) => `${CDN}/${id}/library_600x900_2x.jpg`;
const AI_MIN_SCORE = 60; // Rigor 3 (permissivo=40, top-tier=80)
const MAX_NEW_PER_RUN = 40; // limite de novos itens por execução (custo IA)
const MAX_SEARCH_ITEMS = 200;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ---------- Steam ----------
async function fetchUpcomingIndies(): Promise<number[]> {
  // category1=998 (Games) + tag 492 (Indie) + coming_soon
  const url = `https://store.steampowered.com/search/results/?category1=998&tags=492&filter=comingsoon&supportedlang=english&ndl=1&json=1&count=${MAX_SEARCH_ITEMS}&start=0`;
  const r = await fetch(url, { headers: { "Accept-Language": "en" } });
  if (!r.ok) return [];
  const j = await r.json().catch(() => null) as any;
  const items = j?.items ?? [];
  return items
    .map((it: any) => Number(it?.logo?.match(/\/apps\/(\d+)\//)?.[1] ?? 0))
    .filter((n: number) => n > 0);
}

async function fetchAppDetails(appid: number): Promise<any | null> {
  const url = `https://store.steampowered.com/api/appdetails?appids=${appid}&l=english&cc=us`;
  const r = await fetch(url);
  if (!r.ok) return null;
  const j = await r.json().catch(() => null) as any;
  const entry = j?.[String(appid)];
  if (!entry?.success) return null;
  return entry.data;
}

function extractGame(appid: number, d: any) {
  const genres = (d.genres ?? []).map((g: any) => g.description);
  const isIndie = genres.includes("Indie");
  const platforms: string[] = [];
  if (d.platforms?.windows) platforms.push("PC");
  if (d.platforms?.mac) platforms.push("Mac");
  if (d.platforms?.linux) platforms.push("Linux");
  let release: string | null = null;
  if (d.release_date?.date) {
    const t = Date.parse(d.release_date.date);
    if (!Number.isNaN(t)) release = new Date(t).toISOString().slice(0, 10);
  }
  return {
    appid,
    name: d.name as string,
    isIndie,
    isAdult: !!d.required_age && Number(d.required_age) >= 18,
    isFree: !!d.is_free,
    cover_url: cover(appid),
    header_url: d.header_image ?? null,
    short_description: (d.short_description ?? "").slice(0, 400),
    genres,
    tags: (d.categories ?? []).map((c: any) => c.description).slice(0, 10),
    platforms,
    release,
    comingSoon: !!d.release_date?.coming_soon,
    url: `https://store.steampowered.com/app/${appid}/`,
  };
}

// ---------- IA ----------
async function scoreGame(g: any): Promise<{ score: number; verdict: string }> {
  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!key) return { score: 70, verdict: "sem IA" };
  const prompt = `Analise este jogo indie e devolva JSON {"score": 0-100, "verdict": "1 frase curta"}.
Critérios: originalidade, qualidade artística aparente, gênero, apelo à comunidade indie.
Rejeite (score < 40): shovelware, asset flip, clones genéricos, adult-only, jogos hentai, jogos claramente low-effort.
Dados:
Nome: ${g.name}
Gêneros: ${g.genres.join(", ")}
Categorias: ${g.tags.join(", ")}
Descrição: ${g.short_description}
Grátis: ${g.isFree}
Retorne SOMENTE o JSON.`;
  try {
    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });
    if (!r.ok) return { score: 50, verdict: `ai_${r.status}` };
    const j = await r.json();
    const content = j?.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content);
    const score = Math.max(0, Math.min(100, Number(parsed.score) || 0));
    const verdict = String(parsed.verdict ?? "").slice(0, 200);
    return { score, verdict };
  } catch (e) {
    return { score: 50, verdict: `ai_err` };
  }
}

// ---------- Handler ----------
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supaUrl = Deno.env.get("SUPABASE_URL")!;
  const svcKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const sb = createClient(supaUrl, svcKey);

  const report = { scanned: 0, new_added: 0, updated: 0, removed: 0, rejected: 0, errors: [] as string[] };

  try {
    // 1) Puxa próximos indies
    const appids = await fetchUpcomingIndies();
    report.scanned = appids.length;

    // 2) Carrega existentes
    const { data: existing } = await sb
      .from("lancamentos")
      .select("id, steam_appid, name:nome, data_lancamento, cover_url, status, auto")
      .not("steam_appid", "is", null);
    const bySteamId = new Map<number, any>(
      (existing ?? []).map((r: any) => [Number(r.steam_appid), r]),
    );

    // 3) Descobre quais são novos
    const newIds = appids.filter((id) => !bySteamId.has(id)).slice(0, MAX_NEW_PER_RUN);

    // 4) Processa novos: detalhes → IA → insere
    for (const appid of newIds) {
      try {
        const d = await fetchAppDetails(appid);
        await sleep(150); // gentileza com a Steam
        if (!d) continue;
        const g = extractGame(appid, d);
        if (!g.isIndie || g.isAdult) {
          report.rejected++;
          continue;
        }
        const { score, verdict } = await scoreGame(g);
        if (score < AI_MIN_SCORE) {
          report.rejected++;
          continue;
        }
        const { error } = await sb.from("lancamentos").insert({
          nome: g.name,
          data_lancamento: g.release ?? new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
          plataformas: g.platforms,
          link: g.url,
          cover_url: g.cover_url,
          steam_appid: appid,
          igdb_id: appid, // legado (usado como appid pelo painel antigo)
          status: g.comingSoon ? "coming_soon" : "released",
          ai_score: score,
          ai_verdict: verdict,
          auto: true,
          destaque: score >= 85,
          last_synced_at: new Date().toISOString(),
        });
        if (error) report.errors.push(`insert ${appid}: ${error.message}`);
        else report.new_added++;
      } catch (e) {
        report.errors.push(`new ${appid}: ${String(e)}`);
      }
    }

    // 5) Atualiza itens automáticos existentes (status/cover/nome, remove delisted)
    const autoExisting = (existing ?? []).filter((r: any) => r.auto);
    for (const row of autoExisting.slice(0, 60)) {
      try {
        const appid = Number(row.steam_appid);
        const d = await fetchAppDetails(appid);
        await sleep(120);
        if (!d) {
          // delisted → remove
          await sb.from("lancamentos").delete().eq("id", row.id);
          report.removed++;
          continue;
        }
        const g = extractGame(appid, d);
        const patch: any = {
          cover_url: g.cover_url,
          nome: g.name,
          plataformas: g.platforms,
          status: g.comingSoon ? "coming_soon" : "released",
          last_synced_at: new Date().toISOString(),
        };
        if (g.release) patch.data_lancamento = g.release;
        const { error } = await sb.from("lancamentos").update(patch).eq("id", row.id);
        if (error) report.errors.push(`upd ${appid}: ${error.message}`);
        else report.updated++;
      } catch (e) {
        report.errors.push(`upd ${row.steam_appid}: ${String(e)}`);
      }
    }

    return new Response(JSON.stringify(report), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: String(e), report }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
