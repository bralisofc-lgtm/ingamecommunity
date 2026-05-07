import { Link } from "react-router-dom";
import type { Post } from "@/hooks/usePosts";
import { pickPostEmoji } from "@/lib/postEmoji";
import { useIsMobile } from "@/hooks/use-mobile";

interface Props {
  posts: Post[];
}

const ReadMore = ({ posts }: Props) => {
  const isMobile = useIsMobile();
  if (posts.length === 0) return null;

  return (
    <section className="relative mt-20 pt-14 border-t border-primary/20">
      <div className="flex items-center gap-4 mb-8">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary/15 border border-primary/40 text-primary-glow">
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-glow">Continue lendo</p>
          <h2 className="text-2xl md:text-3xl font-black">
            Leia <span className="text-gradient">mais</span>
          </h2>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-primary/50 via-primary/20 to-transparent" />
      </div>

      {/* MOBILE: lista editorial minimalista, com emoji e SEM imagem */}
      {isMobile ? (
        <ul className="divide-y divide-primary/10 rounded-2xl border border-primary/15 bg-card/40 overflow-hidden">
          {posts.map((p) => {
            const emoji = pickPostEmoji({ title: p.title, tag: p.tag, description: p.description });
            return (
              <li key={p.id}>
                <Link
                  to={`/post/${p.slug}`}
                  className="flex items-start gap-3 px-4 py-4 active:bg-primary/10 transition-colors"
                >
                  <span
                    aria-hidden
                    className="text-2xl leading-none mt-0.5 select-none drop-shadow-[0_0_10px_hsl(var(--primary-glow)/0.45)]"
                  >
                    {emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-bold leading-snug text-foreground line-clamp-2">
                      {p.title}
                    </h3>
                    {p.description && (
                      <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed line-clamp-2">
                        {p.description}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        // DESKTOP / TABLET: cards grandes premium com parallax leve no hover
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((p) => (
            <Link
              key={p.id}
              to={`/post/${p.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card/60 hover:border-primary-glow hover:shadow-[0_25px_70px_-25px_hsl(var(--primary)/0.7)] hover:-translate-y-1 transition-all duration-500"
            >
              <div className="relative w-full aspect-[16/9] overflow-hidden">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-glow" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_center,hsl(var(--primary-glow)/0.18),transparent_60%)]" />
                {p.tag && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-black/70 backdrop-blur text-primary-glow border border-primary/40">
                    {p.tag}
                  </span>
                )}
              </div>

              <div className="relative flex flex-col flex-1 px-5 pt-4 pb-5">
                <h3 className="text-lg md:text-xl font-bold leading-snug line-clamp-2 group-hover:text-primary-glow transition-colors">
                  {p.title}
                </h3>
                {p.description && (
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                )}
                <span className="mt-4 inline-flex items-center gap-2 self-start px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/15 text-primary-glow border border-primary/40 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary-glow transition-all">
                  Ler postagem <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default ReadMore;
