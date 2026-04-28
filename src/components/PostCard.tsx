import type { Post } from "@/hooks/usePosts";

const PostCard = ({ post, index = 0 }: { post: Post; index?: number }) => {
  const dateLabel = post.date
    ? new Date(post.date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  return (
    <article
      className="indie-card group flex flex-col overflow-hidden animate-fade-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {post.image && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
          <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-primary/90 text-primary-foreground border border-primary-glow shadow-[0_0_20px_hsl(var(--primary)/0.6)]">
            {post.tag}
          </span>
        </div>
      )}

      <div className="flex flex-col flex-1 p-6">
        {dateLabel && (
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
            {dateLabel}
          </p>
        )}
        <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary-glow transition-colors">
          {post.title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
          {post.description}
        </p>

        <a
          href={post.link || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-glow inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-primary-foreground font-bold uppercase tracking-wider text-xs self-start"
        >
          Ler postagem
          <span>→</span>
        </a>
      </div>
    </article>
  );
};

export default PostCard;
