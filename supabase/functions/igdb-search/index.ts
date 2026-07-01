// Proxy público para a API do IGDB (Twitch).
// Requer as secrets TWITCH_CLIENT_ID e TWITCH_CLIENT_SECRET configuradas
// em Lovable Cloud (Edge Functions > Secrets).

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(clientId: string, clientSecret: string) {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token;
  }
  const res = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    { method: "POST" },
  );
  if (!res.ok) throw new Error(`twitch_auth_${res.status}`);
  const json = await res.json();
  cachedToken = {
    token: json.access_token,
    expiresAt: Date.now() + (json.expires_in ?? 3600) * 1000,
  };
  return cachedToken.token;
}

function coverUrl(imageId: string | null | undefined) {
  if (!imageId) return null;
  return `https://images.igdb.com/igdb/image/upload/t_cover_big/${imageId}.jpg`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const clientId = Deno.env.get("TWITCH_CLIENT_ID");
    const clientSecret = Deno.env.get("TWITCH_CLIENT_SECRET");

    if (!clientId || !clientSecret) {
      return new Response(
        JSON.stringify({
          error: "IGDB não configurado",
          details:
            "Adicione as secrets TWITCH_CLIENT_ID e TWITCH_CLIENT_SECRET em Edge Functions.",
          results: [],
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const body = await req.json().catch(() => ({}));
    const mode = String(body?.mode ?? "search"); // "search" | "by_id"
    const query = String(body?.query ?? "").trim();
    const id = Number(body?.id ?? 0);

    const token = await getAccessToken(clientId, clientSecret);

    const igdbHeaders = {
      "Client-ID": clientId,
      Authorization: `Bearer ${token}`,
      "Content-Type": "text/plain",
    };

    let apicalypse = "";
    if (mode === "by_id" && id) {
      apicalypse = `fields id,name,first_release_date,cover.image_id,platforms.abbreviation,platforms.name,url,hypes,rating; where id = ${id}; limit 1;`;
    } else {
      if (!query) {
        return new Response(
          JSON.stringify({ results: [] }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      const safe = query.replace(/"/g, "");
      apicalypse = `search "${safe}"; fields id,name,first_release_date,cover.image_id,platforms.abbreviation,platforms.name,url,hypes,rating; limit 10;`;
    }

    const r = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: igdbHeaders,
      body: apicalypse,
    });

    if (!r.ok) {
      const text = await r.text();
      return new Response(
        JSON.stringify({ error: `igdb_${r.status}`, details: text, results: [] }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const raw = await r.json();
    const results = (raw as any[]).map((g) => ({
      id: g.id,
      name: g.name,
      first_release_date: g.first_release_date
        ? new Date(g.first_release_date * 1000).toISOString().slice(0, 10)
        : null,
      cover_url: coverUrl(g.cover?.image_id),
      platforms: Array.isArray(g.platforms)
        ? g.platforms.map((p: any) => p.abbreviation || p.name).filter(Boolean)
        : [],
      url: g.url,
      hypes: g.hypes ?? 0,
      rating: g.rating ?? null,
    }));

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "unexpected", message: String(e), results: [] }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
