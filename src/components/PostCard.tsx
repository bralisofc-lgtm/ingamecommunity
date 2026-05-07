import type { Post } from "@/hooks/usePosts";

interface PostCardProps {
  post: Post;
  index?: number;
  isRecent?: boolean;
  animate?: boolean;
}

const PostCard = ({ post, index = 0, isRecent = false, animate = true }: PostCardProps) => {
  return (
    <div
      className={`flex flex-col ${animate ? "animate-fade-up" : ""}`}
      style={animate ? { animationDelay: `${index * 0.1}s` } : undefined}
    >
      {isRecent && (
        <div className="flex justify-end mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full bg-primary text-primary-foreground border border-primary-glow shadow-[0_0_18px_hsl(var(--primary-glow)/0.85)] animate-recent-pulse animate-recent-float">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
            Recente
          </span>
        </div>
      )}

      <article className="indie-card group flex flex-col overflow-hidden relative">
        {post.image && (
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: "1397 / 400" }}
          >
            <img
              src={post.image}
              alt={post.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent" />
            {post.tag && (
              <span className="absolute top-4 left-4 px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full bg-primary/90 text-primary-foreground border border-primary-glow shadow-[0_0_20px_hsl(var(--primary-glow)/0.7)]">
                {post.tag}
              </span>
            )}
          </div>
        )}

        <div className="flex flex-col flex-1 p-6">
          <p className="text-[10px] uppercase tracking-[0.25em] text-primary-glow font-bold mb-2">
            Por {post.author || "In Game"}
          </p>
          <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary-glow transition-colors">
            {post.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
            {post.description}
          </p>

          <a
            href={post.slug ? `/post/${post.slug}` : post.link || "#"}
            {...(post.slug ? {} : { target: "_blank", rel: "noopener noreferrer" })}
            className="btn-glow inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-primary-foreground font-bold uppercase tracking-wider text-xs self-start"
          >
            Ler postagem
            <span>→</span>
          </a>
        </div>
      </article>
    </div>
  );
};

export default PostCard;
