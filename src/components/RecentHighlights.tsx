import { Zap } from "lucide-react";
import type { Post } from "@/hooks/usePosts";
import Reveal from "@/components/Reveal";

interface Props {
  posts: Post[];
}

const RecentHighlights = ({ posts }: Props) => {
  const items = posts.slice(0, 3);
  if (items.length === 0) return null;

  return (
    <section className="relative py-20 md:py-24 px-4 overflow-hidden">
      {/* Fundo gradiente roxo neon */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, hsl(270 90% 18%) 0%, hsl(280 95% 32%) 45%, hsl(265 90% 22%) 100%)",
        }}
        aria-hidden
      />
      {/* Pattern sutil */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.07] mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(hsl(0 0% 100%) 1px, transparent 1px), radial-gradient(hsl(0 0% 100%) 1px, transparent 1px)",
          backgroundSize: "28px 28px, 28px 28px",
          backgroundPosition: "0 0, 14px 14px",
        }}
        aria-hidden
      />
      {/* Glows */}
      <div
        className="pointer-events-none absolute -top-32 -left-20 w-[420px] h-[420px] rounded-full blur-3xl opacity-40"
        style={{ background: "hsl(285 100% 65%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-10 w-[480px] h-[480px] rounded-full blur-3xl opacity-30"
        style={{ background: "hsl(270 100% 55%)" }}
        aria-hidden
      />

      <div className="container mx-auto relative">
        <Reveal className="flex items-center gap-3 mb-8 md:mb-10">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-yellow-300 text-[hsl(270_90%_15%)] shadow-[0_0_24px_hsl(50_100%_70%/0.7)]">
            <Zap className="w-4 h-4 fill-current" />
          </span>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white drop-shadow-[0_2px_8px_hsl(270_90%_15%/0.6)]">
            Destaques recentes
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {items.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.1}>
              <a
                href={p.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block rounded-2xl overflow-hidden border border-white/15 bg-black/30 backdrop-blur-sm shadow-[0_10px_40px_-10px_hsl(270_90%_10%/0.7)] hover:border-white/40 hover:-translate-y-1 transition-all duration-500"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-glow" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  {p.tag && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded bg-yellow-300 text-[hsl(270_90%_15%)]">
                      {p.tag}
                    </span>
                  )}
                </div>
                <div className="p-4 md:p-5">
                  <h3 className="text-base md:text-lg font-bold text-white leading-snug line-clamp-2 group-hover:text-yellow-200 transition-colors">
                    {p.title}
                  </h3>
                  {p.description && (
                    <p className="mt-2 text-xs md:text-sm text-white/70 line-clamp-2">
                      {p.description}
                    </p>
                  )}
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentHighlights;
