import { useState, useMemo } from "react";
import { Pin } from "lucide-react";
import type { Post } from "@/hooks/usePosts";
import { TAB_GROUPS, type TabGroupId } from "@/lib/tags";
import Reveal from "@/components/Reveal";
import MobilePostsCarousel from "@/components/MobilePostsCarousel";

interface Props {
  posts: Post[];
  excludeIds?: string[];
}

const PostCardMini = ({ post }: { post: Post }) => (
  <a
    href={post.slug ? `/post/${post.slug}` : post.link || "#"}
    {...(post.slug ? {} : { target: "_blank", rel: "noopener noreferrer" })}
    className="group block rounded-2xl overflow-hidden bg-card border border-border hover:border-primary-glow transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.6)] h-full"
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
        <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-primary/90 text-primary-foreground border border-primary-glow shadow-[0_0_18px_hsl(var(--primary-glow)/0.6)]">
          {post.tag}
        </span>
      )}
      {post.pinned && (
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-background/80 text-primary-glow border border-primary-glow">
          <Pin className="w-3 h-3" /> Fixo
        </span>
      )}
    </div>
    <div className="p-5 flex flex-col">
      <p className="text-[10px] uppercase tracking-[0.25em] text-primary-glow font-bold mb-2">
        Por {post.author || "In Game"}
      </p>
      <h3 className="text-base md:text-lg font-bold leading-snug line-clamp-2 group-hover:text-primary-glow transition-colors">
        {post.title}
      </h3>
      {post.description && (
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {post.description}
        </p>
      )}
    </div>
  </a>
);

const PostsCarousel = ({ posts, excludeIds = [] }: Props) => {
  const [activeGroup, setActiveGroup] = useState<TabGroupId>("games-comunidade");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const groupTags = TAB_GROUPS[activeGroup].tags as readonly string[];

  const groupPosts = useMemo(
    () =>
      posts.filter(
        (p) => groupTags.includes(p.tag) && !excludeIds.includes(p.id)
      ),
    [posts, groupTags, excludeIds]
  );

  const sortedGroup = useMemo(
    () =>
      [...groupPosts].sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        const da = a.date ? new Date(a.date).getTime() : 0;
        const db = b.date ? new Date(b.date).getTime() : 0;
        return db - da;
      }),
    [groupPosts]
  );

  const filteredPosts = useMemo(() => {
    if (!activeTag) return sortedGroup;
    return sortedGroup.filter((p) => p.tag === activeTag);
  }, [sortedGroup, activeTag]);

  const isMarquee = !activeTag;
  // Para o marquee precisamos duplicar a lista para o loop infinito
  const marqueeItems = useMemo(() => [...sortedGroup, ...sortedGroup], [sortedGroup]);

  return (
    <section id="postagens" className="relative py-20 md:py-24 px-4">
      <div className="container mx-auto">
        {/* Topo limpo */}
        <Reveal className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-primary-glow uppercase tracking-[0.35em] text-[11px] font-bold mb-3">
            Da Comunidade
          </p>
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Postagens <span className="text-gradient">recentes</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Conteúdos, análises e novidades feitos por quem faz parte da In Game.
          </p>
        </Reveal>

        {/* Tabs principais — Games e Comunidade vs Review e Notícias */}
        <Reveal className="flex justify-center mb-8">
          <div className="inline-flex p-1 rounded-full border border-primary/30 bg-background/60 backdrop-blur">
            {(Object.entries(TAB_GROUPS) as [TabGroupId, typeof TAB_GROUPS[TabGroupId]][]).map(
              ([id, g]) => {
                const active = activeGroup === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setActiveGroup(id);
                      setActiveTag(null);
                    }}
                    className={`px-5 py-2 rounded-full text-[11px] md:text-xs font-bold uppercase tracking-widest transition-all ${
                      active
                        ? "bg-primary text-primary-foreground shadow-[0_0_22px_hsl(var(--primary-glow)/0.7)]"
                        : "text-muted-foreground hover:text-primary-glow"
                    }`}
                  >
                    {g.label}
                  </button>
                );
              }
            )}
          </div>
        </Reveal>

        {/* Categorias da aba ativa — sem "Todas" */}
        <Reveal className="flex justify-center flex-wrap gap-2 mb-10">
          {groupTags.map((tag) => {
            const active = activeTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(active ? null : tag)}
                className={`px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider border transition-all duration-300 hover:-translate-y-0.5 ${
                  active
                    ? "bg-primary/20 text-primary-glow border-primary-glow shadow-[0_0_22px_hsl(var(--primary-glow)/0.6)]"
                    : "bg-background/40 text-foreground/80 border-primary/40 hover:border-primary-glow hover:text-primary-glow hover:shadow-[0_0_18px_hsl(var(--primary-glow)/0.45)]"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </Reveal>

        {/* Lista */}
        {sortedGroup.length === 0 ? (
          <div className="indie-card p-10 text-center text-muted-foreground">
            Nenhuma postagem nesta categoria ainda.
          </div>
        ) : (
          <>
            {/* MOBILE — carrossel premium estilo Steam/Netflix */}
            <MobilePostsCarousel posts={isMarquee ? sortedGroup : filteredPosts} />

            {/* DESKTOP/TABLET */}
            {isMarquee ? (
              <div
                className="relative overflow-hidden hidden md:block"
                style={{
                  maskImage:
                    "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
                }}
              >
                <div className="flex gap-6 w-max animate-marquee">
                  {marqueeItems.map((post, i) => (
                    <div
                      key={`${post.id}-${i}`}
                      className="w-[280px] sm:w-[320px] md:w-[360px] shrink-0"
                    >
                      <PostCardMini post={post} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <PostCardMini key={post.id} post={post} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default PostsCarousel;
