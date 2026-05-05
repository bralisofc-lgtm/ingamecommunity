import { useState, useMemo } from "react";
import { Pin } from "lucide-react";
import type { Post } from "@/hooks/usePosts";
import { TAB_GROUPS, type TabGroupId } from "@/lib/tags";
import Reveal from "@/components/Reveal";

interface Props {
  posts: Post[];
  recentLimit?: number;
}

const PostsCarousel = ({ posts, recentLimit = 3 }: Props) => {
  const [activeGroup, setActiveGroup] = useState<TabGroupId>("games-comunidade");
  const [activeTag, setActiveTag] = useState<string>("Todas");

  const groupTags = TAB_GROUPS[activeGroup].tags as readonly string[];

  // Posts dessa aba
  const groupPosts = useMemo(
    () => posts.filter((p) => groupTags.includes(p.tag)),
    [posts, groupTags]
  );

  // Recents: pinned primeiro, depois por data desc — top N.
  // Se só houver 1 post nessa aba, ele fica fixo automaticamente.
  const recents = useMemo(() => {
    const sorted = [...groupPosts].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      const da = a.date ? new Date(a.date).getTime() : 0;
      const db = b.date ? new Date(b.date).getTime() : 0;
      return db - da;
    });
    return sorted.slice(0, recentLimit);
  }, [groupPosts, recentLimit]);

  const filteredRecents =
    activeTag === "Todas" ? recents : recents.filter((p) => p.tag === activeTag);

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
                      setActiveTag("Todas");
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

        {/* Categorias da aba ativa */}
        <Reveal className="flex justify-center flex-wrap gap-2 mb-10">
          {(["Todas", ...groupTags] as string[]).map((tag) => {
            const active = activeTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
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

        {/* Cards */}
        {filteredRecents.length === 0 ? (
          <div className="indie-card p-10 text-center text-muted-foreground">
            Nenhuma postagem nesta categoria ainda.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecents.map((post, i) => (
              <Reveal key={post.id} delay={Math.min(i * 0.08, 0.4)}>
                <a
                  href={post.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-2xl overflow-hidden bg-card border border-border hover:border-primary-glow transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.6)]"
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
                  <div className="p-5">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-primary-glow font-bold mb-2">
                      Por {post.author || "In Game"}
                    </p>
                    <h3 className="text-base md:text-lg font-bold leading-snug line-clamp-2 group-hover:text-primary-glow transition-colors">
                      {post.title}
                    </h3>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PostsCarousel;
