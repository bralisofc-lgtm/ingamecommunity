// Proxy público para a Steam Store API.
// Não requer secrets: usa endpoints públicos da Steam.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const CDN = "https://cdn.cloudflare.steamstatic.com/steam/apps";
const portraitCover = (appid: number) => `${CDN}/${appid}/library_600x900_2x.jpg`;

function platformsFromObj(p: any): string[] {
  if (!p) return [];
  const out: string[] = [];
  if (p.windows) out.push("PC");
  if (p.mac) out.push("Mac");
  if (p.linux) out.push("Linux");
  return out;
}

async function fetchDetails(appid: number) {
  const url = `https://store.steampowered.com/api/appdetails?appids=${appid}&l=portuguese&cc=br`;
  const r = await fetch(url, { headers: { "Accept-Language": "pt-BR" } });
  if (!r.ok) return null;
  const j = await r.json();
  const entry = j?.[String(appid)];
  if (!entry?.success) return null;
  const d = entry.data;
  let release: string | null = null;
  if (d?.release_date?.date) {
    // Steam devolve strings tipo "24 Oct, 2024" — tenta parsear
    const t = Date.parse(d.release_date.date);
    if (!Number.isNaN(t)) release = new Date(t).toISOString().slice(0, 10);
  }
  return {
    id: appid,
    name: d.name as string,
    first_release_date: release,
    cover_url: portraitCover(appid),
    header_url: d.header_image ?? null,
    platforms: platformsFromObj(d.platforms),
    url: `https://store.steampowered.com/app/${appid}/`,
    coming_soon: !!d?.release_date?.coming_soon,
    short_description: d.short_description ?? null,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const mode = String(body?.mode ?? "search");
    const query = String(body?.query ?? "").trim();
    const id = Number(body?.id ?? 0);

    if (mode === "by_id" && id) {
      const d = await fetchDetails(id);
      return new Response(JSON.stringify({ results: d ? [d] : [] }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!query) {
      return new Response(JSON.stringify({ results: [] }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(query)}&l=portuguese&cc=br`;
    const r = await fetch(url);
    if (!r.ok) {
      return new Response(
        JSON.stringify({ error: `steam_${r.status}`, results: [] }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const j = await r.json();
    const items = (j?.items ?? []) as any[];

    const results = items.slice(0, 10).map((it) => ({
      id: it.id,
      name: it.name,
      first_release_date: null,
      cover_url: portraitCover(it.id),
      header_url: it.tiny_image ? `${it.tiny_image}_292x136.jpg` : null,
      platforms: platformsFromObj(it.platforms),
      url: `https://store.steampowered.com/app/${it.id}/`,
      price: it?.price?.final ? (it.price.final / 100).toFixed(2) : null,
    }));

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "unexpected", message: String(e), results: [] }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
