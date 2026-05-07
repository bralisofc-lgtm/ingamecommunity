import { useEffect, useRef, useState } from "react";
import { Pin } from "lucide-react";
import type { Post } from "@/hooks/usePosts";

interface Props {
  posts: Post[];
}

const MobilePostCard = ({ post, active }: { post: Post; active: boolean }) => {
  const href = post.slug ? `/post/${post.slug}` : post.link || "#";
  const external = !post.slug;

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`relative block aspect-[4/5] w-full rounded-3xl overflow-hidden border bg-card transition-all duration-500 ease-out ${
        active
          ? "border-primary-glow/80 shadow-[0_18px_50px_-12px_hsl(var(--primary-glow)/0.65),0_0_0_1px_hsl(var(--primary-glow)/0.35)] scale-[1.02] opacity-100"
          : "border-border/60 opacity-60 scale-[0.96]"
      }`}
    >
      {/* Imagem 55% topo */}
      {post.image ? (
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-glow" />
      )}

      {/* Overlay só na metade inferior */}
      <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-black/95 via-black/70 to-transparent" />

      {/* Tag minimal no topo */}
      {post.tag && (
        <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-black/55 text-white/90 border border-white/15 backdrop-blur-md">
          {post.tag}
        </span>
      )}
      {post.pinned && (
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-primary/80 text-primary-foreground backdrop-blur-md">
          <Pin className="w-3 h-3" /> Fixo
        </span>
      )}

      {/* Conteúdo editorial sobreposto */}
      <div className="absolute inset-x-0 bottom-0 p-4 pb-5">
        <h3 className="text-[19px] leading-tight font-bold text-white line-clamp-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          {post.title}
        </h3>
        {post.description && (
          <p className="mt-1.5 text-[13px] leading-snug text-white/75 line-clamp-2">
            {post.description}
          </p>
        )}
        <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-primary-glow/90 font-bold">
          Por {post.author || "In Game"}
        </p>
      </div>

      {/* Glow edge quando ativo */}
      {active && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-primary-glow/40"
        />
      )}
    </a>
  );
};

const MobilePostsCarousel = ({ posts }: Props) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const center = el.scrollLeft + el.clientWidth / 2;
        const children = Array.from(el.children) as HTMLElement[];
        let bestIdx = 0;
        let bestDist = Infinity;
        children.forEach((c, i) => {
          const cardCenter = c.offsetLeft + c.offsetWidth / 2;
          const d = Math.abs(cardCenter - center);
          if (d < bestDist) {
            bestDist = d;
            bestIdx = i;
          }
        });
        setActive(bestIdx);
      });
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [posts.length]);

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const child = el.children[i] as HTMLElement | undefined;
    if (!child) return;
    const left = child.offsetLeft - (el.clientWidth - child.offsetWidth) / 2;
    el.scrollTo({ left, behavior: "smooth" });
  };

  if (posts.length === 0) return null;

  return (
    <div className="md:hidden -mx-4">
      <div
        ref={trackRef}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 px-[7.5%]"
        style={{
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-x",
        }}
      >
        <style>{`.mobile-track::-webkit-scrollbar{display:none}`}</style>
        {posts.map((p, i) => (
          <div
            key={p.id}
            className="snap-center shrink-0 w-[85%]"
            style={{ scrollSnapAlign: "center" }}
          >
            <MobilePostCard post={p} active={i === active} />
          </div>
        ))}
      </div>

      {/* Indicador */}
      <div className="mt-4 flex justify-center items-center gap-1.5 px-4">
        {posts.map((_, i) => {
          const isActive = i === active;
          return (
            <button
              key={i}
              type="button"
              aria-label={`Ir para card ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                isActive
                  ? "w-6 bg-primary-glow shadow-[0_0_12px_hsl(var(--primary-glow)/0.8)]"
                  : "w-1.5 bg-white/25 hover:bg-white/50"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MobilePostsCarousel;
