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
      className="relative block aspect-[3/4] w-full rounded-[28px] overflow-hidden bg-card ring-1 ring-white/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)]"
    >
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

      {/* Vinheta cinematográfica */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_30%,rgba(0,0,0,0.55)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-black/95 via-black/65 to-transparent" />

      {/* Tag */}
      {post.tag && (
        <span className="absolute top-3.5 left-3.5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded-full bg-primary/85 text-primary-foreground border border-primary-glow/60 backdrop-blur-md shadow-[0_4px_18px_hsl(var(--primary)/0.5)]">
          {post.tag}
        </span>
      )}
      {post.pinned && (
        <span className="absolute top-3.5 right-3.5 inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full bg-black/60 text-primary-glow border border-primary-glow/50 backdrop-blur-md">
          <Pin className="w-3 h-3" /> Fixo
        </span>
      )}

      {/* Conteúdo editorial */}
      <div className="absolute inset-x-0 bottom-0 p-5 pb-6">
        <p className="text-[10px] uppercase tracking-[0.3em] text-primary-glow font-black mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          Por {post.author || "In Game"}
        </p>
        <h3 className="text-[20px] leading-[1.15] font-black text-white line-clamp-3 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
          {post.title}
        </h3>
        {post.description && (
          <p className="mt-2 text-[12.5px] leading-snug text-white/80 line-clamp-2">
            {post.description}
          </p>
        )}
        <span className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.18em] bg-primary-glow/15 text-primary-glow border border-primary-glow/40">
          Ler agora <span aria-hidden>→</span>
        </span>
      </div>
    </a>
  );
};

const MobilePostsCarousel = ({ posts }: Props) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const userInteracted = useRef(false);

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
    const markInteract = () => (userInteracted.current = true);
    el.addEventListener("touchstart", markInteract, { passive: true });
    el.addEventListener("pointerdown", markInteract, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("touchstart", markInteract);
      el.removeEventListener("pointerdown", markInteract);
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

  // Autoplay suave: avança a cada 5s enquanto o usuário não interagir
  useEffect(() => {
    if (posts.length <= 1) return;
    const id = window.setInterval(() => {
      if (userInteracted.current) return;
      const next = (active + 1) % posts.length;
      goTo(next);
    }, 5000);
    return () => clearInterval(id);
  }, [active, posts.length]);

  if (posts.length === 0) return null;

  return (
    <div className="md:hidden -mx-4">
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 px-[8%]"
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
            className="snap-center shrink-0 w-[84%]"
            style={{ scrollSnapAlign: "center" }}
          >
            <MobilePostCard post={p} active={i === active} />
          </div>
        ))}
      </div>

      {/* Indicador refinado */}
      <div className="mt-5 flex justify-center items-center gap-1.5 px-4">
        {posts.map((_, i) => {
          const isActive = i === active;
          return (
            <button
              key={i}
              type="button"
              aria-label={`Ir para card ${i + 1}`}
              onClick={() => {
                userInteracted.current = true;
                goTo(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                isActive
                  ? "w-7 bg-primary-glow shadow-[0_0_14px_hsl(var(--primary-glow)/0.9)]"
                  : "w-1.5 bg-white/20 hover:bg-white/45"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default MobilePostsCarousel;
