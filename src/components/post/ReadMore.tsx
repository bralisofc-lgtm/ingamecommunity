import { Link } from "react-router-dom";
import type { Post } from "@/hooks/usePosts";

interface Props {
  posts: Post[];
}

const ReadMore = ({ posts }: Props) => {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {posts.map((p) => (
          <Link
            key={p.id}
            to={`/post/${p.slug}`}
            className="group flex flex-col sm:flex-row gap-4 p-3 rounded-2xl border border-border bg-card/60 hover:border-primary-glow hover:shadow-[0_10px_40px_-15px_hsl(var(--primary)/0.6)] hover:-translate-y-0.5 transition-all duration-500"
          >
            <div className="relative w-full sm:w-44 aspect-[16/10] sm:aspect-square shrink-0 overflow-hidden rounded-xl">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <div className="flex flex-col flex-1 min-w-0 py-1 pr-2">
              {p.tag && (
                <span className="self-start mb-2 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-primary/20 text-primary-glow border border-primary/40">
                  {p.tag}
                </span>
              )}
              <h3 className="text-base md:text-lg font-bold leading-snug line-clamp-2 group-hover:text-primary-glow transition-colors">
                {p.title}
              </h3>
              {p.description && (
                <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{p.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ReadMore;
