import { useMemo } from "react";

/**
 * Renderizador de markdown simplificado, focado em leitura editorial.
 * Suporta:
 *  - # ## ### títulos
 *  - **negrito**, *itálico*
 *  - [texto](url) links
 *  - ![alt](url) imagens (centralizadas, com sombra)
 *  - " texto " → bloco de citação estilizado
 *  - - listas
 *  - parágrafos
 */

type Block =
  | { type: "h"; level: 1 | 2 | 3; text: string }
  | { type: "p"; text: string }
  | { type: "img"; src: string; alt: string }
  | { type: "video"; src: string }
  | { type: "quote"; text: string }
  | { type: "ul"; items: string[] };

function toEmbedUrl(raw: string): string | null {
  const url = raw.trim();
  // YouTube
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/
  );
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  // Vimeo
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  // Generic embed (already an embed URL)
  if (/^https?:\/\/.+\/embed\//.test(url)) return url;
  return null;
}

function inline(raw: string): string {
  // ordem importa
  let s = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  // links com texto
  s = s.replace(
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary-glow font-semibold no-underline hover:text-primary transition-colors">$1</a>'
  );
  // bold
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-foreground font-bold">$1</strong>');
  // italic
  s = s.replace(/\*([^*]+)\*/g, '<em class="text-foreground/90">$1</em>');
  return s;
}

function parse(md: string): Block[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  const isQuoteLine = (l: string) => /^\s*"\s.*\s"\s*$/.test(l);

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // video: @[video](url) or @[youtube](url) or [](url) or bare URL
    const vid = trimmed.match(/^@\[(?:video|youtube|vimeo)\]\(([^)\s]+)\)$/i);
    if (vid) {
      const embed = toEmbedUrl(vid[1]);
      if (embed) {
        blocks.push({ type: "video", src: embed });
        i++;
        continue;
      }
    }
    const emptyLink = trimmed.match(/^\[\s*\]\(([^)\s]+)\)$/);
    if (emptyLink) {
      const embed = toEmbedUrl(emptyLink[1]);
      if (embed) {
        blocks.push({ type: "video", src: embed });
        i++;
        continue;
      }
    }
    if (/^https?:\/\/\S+$/.test(trimmed)) {
      const embed = toEmbedUrl(trimmed);
      if (embed) {
        blocks.push({ type: "video", src: embed });
        i++;
        continue;
      }
    }

    // image: ![alt](url)
    const img = trimmed.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
    if (img) {
      blocks.push({ type: "img", alt: img[1], src: img[2] });
      i++;
      continue;
    }

    // headings
    const h = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (h) {
      blocks.push({ type: "h", level: h[1].length as 1 | 2 | 3, text: h[2] });
      i++;
      continue;
    }

    // quote: " texto "
    if (isQuoteLine(trimmed)) {
      const inner = trimmed.replace(/^"\s+/, "").replace(/\s+"$/, "");
      blocks.push({ type: "quote", text: inner });
      i++;
      continue;
    }

    // list
    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // paragraph (junta linhas até linha vazia)
    const buf: string[] = [trimmed];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^(#{1,3})\s/.test(lines[i].trim()) &&
      !/^!\[/.test(lines[i].trim()) &&
      !/^@\[/.test(lines[i].trim()) &&
      !/^\[\s*\]\(/.test(lines[i].trim()) &&
      !/^https?:\/\/\S+$/.test(lines[i].trim()) &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !isQuoteLine(lines[i].trim())
    ) {
      buf.push(lines[i].trim());
      i++;
    }
    blocks.push({ type: "p", text: buf.join(" ") });
  }

  return blocks;
}

const MarkdownRenderer = ({ content }: { content: string }) => {
  const blocks = useMemo(() => parse(content || ""), [content]);

  return (
    <div className="space-y-7 text-foreground/90 text-[18px] md:text-[19px] leading-[1.85] md:leading-[1.9] [&_strong]:text-white [&_strong]:font-bold [&_a]:no-underline">
      {blocks.map((b, idx) => {
        switch (b.type) {
          case "h":
            if (b.level === 1)
              return (
                <h2
                  key={idx}
                  className="text-3xl md:text-4xl font-black mt-10 mb-2 text-foreground tracking-tight"
                  dangerouslySetInnerHTML={{ __html: inline(b.text) }}
                />
              );
            if (b.level === 2)
              return (
                <h3
                  key={idx}
                  className="text-2xl md:text-3xl font-bold mt-8 mb-1 text-foreground"
                  dangerouslySetInnerHTML={{ __html: inline(b.text) }}
                />
              );
            return (
              <h4
                key={idx}
                className="text-xl md:text-2xl font-bold mt-6 text-primary-glow uppercase tracking-wider"
                dangerouslySetInnerHTML={{ __html: inline(b.text) }}
              />
            );
          case "p":
            return (
              <p key={idx} dangerouslySetInnerHTML={{ __html: inline(b.text) }} />
            );
          case "img":
            return (
              <figure key={idx} className="my-8 -mx-4 sm:mx-0 sm:flex sm:justify-center">
                <img
                  src={b.src}
                  alt={b.alt}
                  loading="lazy"
                  className="w-full sm:max-w-3xl sm:rounded-2xl border border-primary/20 shadow-[0_20px_60px_-20px_hsl(var(--primary)/0.6)]"
                />
              </figure>
            );
          case "video":
            return (
              <figure key={idx} className="my-8 -mx-4 sm:mx-0 sm:max-w-3xl sm:mx-auto animate-fade-in">
                <div className="video-embed-wrap sm:rounded-2xl">
                  <iframe
                    src={b.src}
                    title="Vídeo"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </figure>
            );
          case "quote":
            return (
              <blockquote
                key={idx}
                className="relative my-10 px-6 md:px-10 py-7 rounded-2xl bg-[hsl(270_50%_8%)] border-l-4 border-primary-glow shadow-[0_10px_40px_-15px_hsl(var(--primary)/0.5)]"
              >
                <span
                  aria-hidden
                  className="absolute -top-4 left-4 text-6xl font-black text-primary-glow/80 leading-none select-none"
                >
                  “
                </span>
                <p
                  className="relative text-lg md:text-xl text-white font-medium italic leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: inline(b.text) }}
                />
                <div className="mt-4 h-px w-16 bg-primary-glow/60" />
              </blockquote>
            );
          case "ul":
            return (
              <ul key={idx} className="list-disc pl-6 space-y-2 marker:text-primary-glow">
                {b.items.map((it, j) => (
                  <li key={j} dangerouslySetInnerHTML={{ __html: inline(it) }} />
                ))}
              </ul>
            );
        }
      })}
    </div>
  );
};

export default MarkdownRenderer;
