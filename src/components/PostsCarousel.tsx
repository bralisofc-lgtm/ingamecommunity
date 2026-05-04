import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Eye,
  Sparkles,
  BookOpen,
  Newspaper,
  Handshake,
  Zap,
} from "lucide-react";
import type { Post } from "@/hooks/usePosts";
import Reveal from "@/components/Reveal";

interface Props {
  posts: Post[];
}

const FILTER_GROUPS: Array<{
  label: string;
  items: Array<{ tag: string; icon: React.ComponentType<{ className?: string }> }>;
}> = [
  {
    label: "Categorias",
    items: [
      { tag: "Comunidade", icon: Users },
      { tag: "Indie Misterioso", icon: Eye },
      { tag: "Indies Recomendação", icon: Sparkles },
    ],
  },
  {
    label: "Tipo de conteúdo",
    items: [
      { tag: "Introdução", icon: BookOpen },
      { tag: "Notícias", icon: Newspaper },
      { tag: "Parcerias", icon: Handshake },
    ],
  },
];

const SPEED = 0.4; // px/frame ≈ 24px/s

const PostsCarousel = ({ posts }: Props) => {
  const [activeTag, setActiveTag] = useState<string>("Todas");

  const filtered =
    activeTag === "Todas" ? posts : posts.filter((p) => p.tag === activeTag);

  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);
  const rafRef = useRef<number>();

  // Auto-scroll contínuo
  useEffect(() => {
    if (filtered.length === 0) return;
    const track = trackRef.current;
    if (!track) return;

    const tick = () => {
      if (!pausedRef.current) {
        offsetRef.current -= SPEED;
        const half = track.scrollWidth / 2;
        if (Math.abs(offsetRef.current) >= half) {
          offsetRef.current += half;
        }
        track.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [filtered.length]);

  const nudge = (dir: -1 | 1) => {
    offsetRef.current += dir * -320;
    if (trackRef.current) {
      trackRef.current.style.transition = "transform 0.4s cubic-bezier(0.22,1,0.36,1)";
      trackRef.current.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
      window.setTimeout(() => {
        if (trackRef.current) trackRef.current.style.transition = "";
      }, 420);
    }
  };

  // Duplicado para loop infinito
  const loop = filtered.length > 0 ? [...filtered, ...filtered] : [];

  return (
    <section className="relative py-20 md:py-24 px-4">
      <div className="container mx-auto">
        <Reveal className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/20 border border-primary-glow text-primary-glow shadow-[0_0_20px_hsl(var(--primary-glow)/0.5)]">
              <Zap className="w-4 h-4 fill-current" />
            </span>
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-wider">
              Postagens da <span className="text-gradient">Comunidade</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md text-sm">
            Conteúdos, análises e novidades feitos por quem faz parte da In Game.
          </p>
        </Reveal>

        {/* Filtros — duas seções */}
        <div className="space-y-4 mb-10">
          {FILTER_GROUPS.map((group) => (
            <Reveal key={group.label}>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground/70 mr-1">
                  {group.label}
                </span>
                {group.items.map(({ tag, icon: Icon }) => {
                  const active = activeTag === tag;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setActiveTag(active ? "Todas" : tag)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-300 hover:-translate-y-0.5 ${
                        active
                          ? "bg-primary text-primary-foreground border-primary-glow shadow-[0_0_22px_hsl(var(--primary-glow)/0.7)]"
                          : "bg-background/40 text-foreground/85 border-primary/40 hover:border-primary-glow hover:text-primary-glow hover:shadow-[0_0_18px_hsl(var(--primary-glow)/0.45)]"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {tag}
                    </button>
                  );
                })}
              </div>
            </Reveal>
          ))}
        </div>

        {/* Carrossel */}
        {filtered.length === 0 ? (
          <div className="indie-card p-10 text-center text-muted-foreground">
            Nenhuma postagem com a categoria "{activeTag}".
          </div>
        ) : (
          <div className="relative">
            {/* Setas */}
            <button
              type="button"
              aria-label="Voltar"
              onClick={() => nudge(-1)}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-background/70 backdrop-blur border border-primary/40 text-primary-glow flex items-center justify-center hover:border-primary-glow hover:bg-background hover:scale-110 active:scale-95 transition-all shadow-[0_0_18px_hsl(var(--primary)/0.4)]"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Avançar"
              onClick={() => nudge(1)}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-background/70 backdrop-blur border border-primary/40 text-primary-glow flex items-center justify-center hover:border-primary-glow hover:bg-background hover:scale-110 active:scale-95 transition-all shadow-[0_0_18px_hsl(var(--primary)/0.4)]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Fade nas bordas */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-20 z-10"
              style={{
                background:
                  "linear-gradient(to right, hsl(var(--background)) 0%, transparent 100%)",
              }}
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-20 z-10"
              style={{
                background:
                  "linear-gradient(to left, hsl(var(--background)) 0%, transparent 100%)",
              }}
              aria-hidden
            />

            <div
              className="overflow-hidden px-12"
              onMouseEnter={() => (pausedRef.current = true)}
              onMouseLeave={() => (pausedRef.current = false)}
              onTouchStart={() => (pausedRef.current = true)}
              onTouchEnd={() => (pausedRef.current = false)}
            >
              <div
                ref={trackRef}
                className="flex gap-5 will-change-transform"
                style={{ transform: "translate3d(0,0,0)" }}
              >
                {loop.map((post, i) => (
                  <a
                    key={`${post.id}-${i}`}
                    href={post.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group shrink-0 w-[280px] md:w-[320px] rounded-2xl overflow-hidden bg-card border border-border hover:border-primary-glow transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.6)] active:scale-[0.98]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {post.image ? (
                        <img
                          src={post.image}
                          alt={post.title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-glow" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
                      {post.tag && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded bg-yellow-300 text-[hsl(270_90%_15%)]">
                          {post.tag}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm md:text-base font-bold leading-snug line-clamp-2 group-hover:text-primary-glow transition-colors">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-[11px] uppercase tracking-widest text-muted-foreground">
                        {post.date
                          ? new Date(post.date).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : ""}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PostsCarousel;
