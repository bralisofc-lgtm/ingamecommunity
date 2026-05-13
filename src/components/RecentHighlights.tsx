import { Zap, Pin } from "lucide-react";
import type { Post } from "@/hooks/usePosts";
import Reveal from "@/components/Reveal";

interface Props {
  posts: Post[];
  loading?: boolean;
}

const RecentHighlights = ({ posts, loading = false }: Props) => {
  const items = posts.slice(0, 3);
  const showSkeleton = loading && items.length === 0;
  if (items.length === 0 && !showSkeleton) return null;

  return (
    <section className="relative py-20 md:py-28 px-4 overflow-hidden">
      {/* Fundo gradiente roxo neon vibrante */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, hsl(270 90% 16%) 0%, hsl(285 95% 32%) 45%, hsl(265 90% 20%) 100%)",
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
        <Reveal className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-300 text-[hsl(270_90%_15%)] text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-[0_0_24px_hsl(50_100%_70%/0.6)]">
            <Zap className="w-3 h-3 fill-current" /> Em destaque
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wider text-white drop-shadow-[0_2px_12px_hsl(270_90%_10%/0.8)]">
            Destaques recentes
          </h2>
          <p className="mt-3 text-white/80 text-sm md:text-base">
            As três últimas publicações da comunidade, atualizadas automaticamente.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-7 pt-6">
          {showSkeleton
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={`sk-${i}`}
                  className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/30 backdrop-blur-sm shadow-[0_10px_40px_-10px_hsl(270_90%_10%/0.7)] animate-pulse"
                >
                  <div className="aspect-[16/10] bg-white/5" />
                  <div className="p-5 space-y-3">
                    <div className="h-2.5 w-1/3 rounded bg-white/10" />
                    <div className="h-4 w-5/6 rounded bg-white/15" />
                    <div className="h-3 w-full rounded bg-white/10" />
                    <div className="h-3 w-4/6 rounded bg-white/10" />
                  </div>
                </div>
              ))
            : items.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.1}>
              <div className="relative">
                {/* Tag "Recente" — fora da borda no canto superior direito */}
                <span className="absolute -top-3 -right-2 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-300 text-[hsl(270_90%_15%)] text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_22px_hsl(50_100%_70%/0.85)] border border-yellow-200 animate-recent-pulse animate-recent-float">
                  <span className="w-1.5 h-1.5 rounded-full bg-[hsl(270_90%_15%)]" />
                  Recente
                </span>

                <a
                  href={p.slug ? `/post/${p.slug}` : p.link || "#"}
                  {...(p.slug ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                  className="group relative block rounded-2xl overflow-hidden border border-white/15 bg-black/30 backdrop-blur-sm shadow-[0_10px_40px_-10px_hsl(270_90%_10%/0.7)] hover:border-white/40 hover:-translate-y-1 transition-all duration-500 h-full"
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
                      <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded bg-black/60 text-yellow-200 border border-yellow-300/40 backdrop-blur-sm">
                        {p.tag}
                      </span>
                    )}
                    {p.pinned && (
                      <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full bg-white/15 text-white border border-white/30">
                        <Pin className="w-3 h-3" /> Fixo
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-yellow-200 font-bold mb-2">
                      Por {p.author || "In Game"}
                    </p>
                    <h3 className="text-base md:text-lg font-bold text-white leading-snug line-clamp-2 group-hover:text-yellow-200 transition-colors">
                      {p.title}
                    </h3>
                    {p.description && (
                      <p className="mt-2 text-sm text-white/75 leading-relaxed line-clamp-3">
                        {p.description}
                      </p>
                    )}
                  </div>
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentHighlights;
