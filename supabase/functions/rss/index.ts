import { createClient } from "npm:@supabase/supabase-js@2";

const SITE = "https://ingamecommunity.site";

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data } = await supabase
    .from("posts")
    .select("id,title,description,slug,date,author,tag,image")
    .order("date", { ascending: false })
    .limit(50);

  const items = (data ?? []).map((p: any) => {
    const url = `${SITE}/${p.slug ?? p.id}`;
    const pub = p.date ? new Date(p.date).toUTCString() : new Date().toUTCString();
    return `<item>
  <title>${escape(p.title ?? "")}</title>
  <link>${url}</link>
  <guid isPermaLink="true">${url}</guid>
  <pubDate>${pub}</pubDate>
  <author>${escape(p.author ?? "In Game")}</author>
  <category>${escape(p.tag ?? "")}</category>
  <description>${escape(p.description ?? "")}</description>
</item>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>In Game — Catálogo de Notícias</title>
<link>${SITE}/noticias</link>
<description>Notícias indies catalogadas por assunto, data e relevância.</description>
<language>pt-BR</language>
<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
</channel></rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=600",
      "Access-Control-Allow-Origin": "*",
    },
  });
});
