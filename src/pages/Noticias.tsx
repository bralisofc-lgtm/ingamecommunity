import { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, TrendingUp, Clock, Flame, Tag as TagIcon, ArrowRight, Calendar, X, Eye } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { usePosts, type Post } from "@/hooks/usePosts";
import { POST_TAGS } from "@/lib/tags";

const PAGE_SIZE = 9;

type SortKey = "recent" | "trending" | "most-read";

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
};

const NewsCardLarge = ({ post }: { post: Post }) => (
  <Link
    to={post.slug ? `/${post.slug}` : "#"}
    className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl transition-all duration-500 hover:border-primary-glow/60 hover:shadow-[0_20px_60px_-20px_hsl(var(--primary-glow)/0.6)] hover:-translate-y-1"
  >
    {post.image && (
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        {post.tag && (
          <span className="absolute top-4 left-4 rounded-full border border-primary-glow/60 bg-background/70 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary-glow">
            {post.tag}
          </span>
        )}
      </div>
    )}
    <div className="flex flex-col gap-3 p-6">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        <Calendar className="h-3 w-3" />
        {formatDate(post.date)}
        <span className="opacity-40">•</span>
        <span className="text-primary-glow">{post.author}</span>
      </div>
      <h3 className="text-xl md:text-2xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary-glow">
        {post.title}
      </h3>
      <p className="text-sm text-muted-foreground line-clamp-3">{post.description}</p>
      <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-primary-glow">
        Ler <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
      </span>
    </div>
  </Link>
);

const NewsCardCompact = ({ post, index }: { post: Post; index?: number }) => (
  <Link
    to={post.slug ? `/${post.slug}` : "#"}
    className="group flex items-start gap-4 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-md p-4 transition-all duration-300 hover:border-primary-glow/50 hover:bg-card/60"
  >
    {typeof index === "number" && (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-lg font-black text-primary-glow">
        {index + 1}
      </div>
    )}
    {post.image && !("index" in { index }) && (
      <img src={post.image} alt="" loading="lazy" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
    )}
    <div className="min-w-0 flex-1">
      <div className="mb-1 text-[10px] uppercase tracking-widest text-primary-glow/80">{post.tag}</div>
      <h4 className="text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary-glow line-clamp-2">
        {post.title}
      </h4>
      <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">{formatDate(post.date)}</div>
    </div>
  </Link>
);

const Noticias = () => {
  const { posts, loading } = usePosts();
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("recent");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Split hero + slider from the rest
  const featured = useMemo(() => {
    const pinned = posts.filter((p) => p.pinned);
    const featuredMark = posts.filter((p) => p.featured && !p.pinned);
    return [...pinned, ...featuredMark].slice(0, 5);
  }, [posts]);

  const hero = featured[0] ?? posts[0];
  const slider = featured.slice(1, 5);

  const tagCounts = useMemo(() => {
    const m = new Map<string, number>();
    posts.forEach((p) => { if (p.tag) m.set(p.tag, (m.get(p.tag) ?? 0) + 1); });
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = posts.filter((p) => {
      if (activeTag && p.tag !== activeTag) return false;
      if (!q) return true;
      return [p.title, p.description, p.tag, p.author].filter(Boolean).some((s) => s.toLowerCase().includes(q));
    });
    if (sort === "recent") {
      list = [...list].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    } else if (sort === "trending" || sort === "most-read") {
      // No stats client-side — approximate: featured/pinned first, then recent
      list = [...list].sort((a, b) => {
        const aw = (a.pinned ? 2 : 0) + (a.featured ? 1 : 0);
        const bw = (b.pinned ? 2 : 0) + (b.featured ? 1 : 0);
        if (aw !== bw) return bw - aw;
        return (b.date || "").localeCompare(a.date || "");
      });
    }
    return list;
  }, [posts, query, activeTag, sort]);

  // Timeline groups by month
  const timeline = useMemo(() => {
    const groups = new Map<string, Post[]>();
    [...posts]
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
      .forEach((p) => {
        const d = new Date(p.date);
        const key = isNaN(d.getTime()) ? "—" : d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(p);
      });
    return Array.from(groups.entries()).slice(0, 4);
  }, [posts]);

  // Infinite scroll
  useEffect(() => { setVisible(PAGE_SIZE); }, [query, activeTag, sort]);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setVisible((v) => Math.min(v + PAGE_SIZE, filtered.length));
    }, { rootMargin: "400px" });
    io.observe(el);
    return () => io.disconnect();
  }, [filtered.length]);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  return (
    <SiteLayout
      title="Catálogo de Notícias — In Game"
      description="Biblioteca de notícias indies organizada por assunto, data, relevância e tendências. Descubra, filtre e leia."
      canonical="https://ingamecommunity.site/noticias"
    >
      {/* HERO */}
      <section className="relative pt-28 md:pt-36 pb-16 px-4">
        <div className="container mx-auto">
          <div className="mb-10 flex flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-primary-glow">
              <TagIcon className="h-3 w-3" /> Catálogo de Notícias
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
              Biblioteca de <span className="bg-gradient-to-r from-primary-glow to-accent bg-clip-text text-transparent">notícias indies</span>
            </h1>
            <p className="max-w-2xl text-base md:text-lg text-muted-foreground">
              Descubra, organize e leia. Filtre por tag, ordene por relevância e navegue por linha do tempo.
            </p>
          </div>

          {/* Search + sort */}
          <div className="mb-10 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-glow" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pesquisar notícias, autores, tags..."
                className="w-full rounded-full border border-border/60 bg-card/40 backdrop-blur-xl py-3.5 pl-11 pr-11 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary-glow focus:shadow-[0_0_30px_hsl(var(--primary-glow)/0.35)]"
              />
              {query && (
                <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex gap-2 rounded-full border border-border/60 bg-card/40 backdrop-blur-xl p-1">
              {([
                { k: "recent" as SortKey, l: "Recentes", i: Clock },
                { k: "trending" as SortKey, l: "Em alta", i: Flame },
                { k: "most-read" as SortKey, l: "Mais lidas", i: TrendingUp },
              ]).map(({ k, l, i: Icon }) => (
                <button
                  key={k}
                  onClick={() => setSort(k)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                    sort === k
                      ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary-glow)/0.6)]"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3 w-3" /> {l}
                </button>
              ))}
            </div>
          </div>

          {/* Tag chips */}
          {tagCounts.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTag(null)}
                className={`rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest transition-all ${
                  !activeTag
                    ? "border-primary-glow bg-primary/20 text-primary-glow"
                    : "border-border/60 text-muted-foreground hover:text-foreground hover:border-primary-glow/60"
                }`}
              >
                Todas
              </button>
              {tagCounts.map(([tag, count]) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                  className={`rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest transition-all ${
                    activeTag === tag
                      ? "border-primary-glow bg-primary/20 text-primary-glow"
                      : "border-border/60 text-muted-foreground hover:text-foreground hover:border-primary-glow/60"
                  }`}
                >
                  {tag} <span className="ml-1 opacity-60">{count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* HERO NEWS + SLIDER */}
      {hero && (
        <section className="px-4 pb-16">
          <div className="container mx-auto grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Link
                to={hero.slug ? `/${hero.slug}` : "#"}
                className="group relative block overflow-hidden rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl transition-all duration-500 hover:border-primary-glow/60 hover:shadow-[0_30px_80px_-20px_hsl(var(--primary-glow)/0.5)]"
              >
                {hero.image && (
                  <div className="relative aspect-[16/9] lg:aspect-[16/10] overflow-hidden">
                    <img src={hero.image} alt={hero.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                  <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-primary-glow">
                    <span className="rounded-full bg-primary/20 border border-primary-glow/50 px-3 py-1">Destaque</span>
                    {hero.tag && <span>{hero.tag}</span>}
                    <span className="opacity-40">•</span>
                    <span className="text-muted-foreground">{formatDate(hero.date)}</span>
                  </div>
                  <h2 className="text-2xl md:text-4xl lg:text-5xl font-black leading-tight text-foreground transition-colors group-hover:text-primary-glow max-w-3xl">
                    {hero.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm md:text-base text-muted-foreground line-clamp-2">{hero.description}</p>
                </div>
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="mb-1 text-xs font-bold uppercase tracking-[0.3em] text-primary-glow">Importantes</h3>
              {slider.length === 0 && !loading && (
                <p className="text-sm text-muted-foreground">Marque posts como fixados ou em destaque no admin.</p>
              )}
              {slider.map((p) => <NewsCardCompact key={p.id} post={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* GRID + SIDEBAR */}
      <section className="px-4 pb-24">
        <div className="container mx-auto grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="text-2xl md:text-3xl font-black text-foreground">
                {activeTag ? activeTag : sort === "recent" ? "Recentes" : sort === "trending" ? "Em alta" : "Mais lidas"}
              </h2>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">{filtered.length} notícias</span>
            </div>

            {loading && shown.length === 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-80 rounded-3xl border border-border/40 bg-card/20 animate-pulse" />
                ))}
              </div>
            ) : shown.length === 0 ? (
              <div className="rounded-3xl border border-border/40 bg-card/20 p-12 text-center">
                <p className="text-muted-foreground">Nenhuma notícia encontrada.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {shown.map((p) => <NewsCardLarge key={p.id} post={p} />)}
              </div>
            )}

            {hasMore && (
              <div ref={sentinelRef} className="mt-10 flex justify-center">
                <button
                  onClick={() => setVisible((v) => Math.min(v + PAGE_SIZE, filtered.length))}
                  className="rounded-full border border-primary/50 bg-primary/10 backdrop-blur-md px-6 py-3 text-xs font-bold uppercase tracking-widest text-primary-glow transition-all hover:bg-primary/20 hover:border-primary-glow"
                >
                  Carregar mais
                </button>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="flex flex-col gap-8">
            {/* Most read */}
            <div className="rounded-3xl border border-border/50 bg-card/30 backdrop-blur-xl p-5">
              <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-primary-glow">
                <Eye className="h-3 w-3" /> Mais lidas
              </h3>
              <div className="flex flex-col gap-2">
                {posts.slice(0, 5).map((p, i) => <NewsCardCompact key={p.id} post={p} index={i} />)}
              </div>
            </div>

            {/* Trending */}
            <div className="rounded-3xl border border-border/50 bg-card/30 backdrop-blur-xl p-5">
              <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-primary-glow">
                <Flame className="h-3 w-3" /> Em alta agora
              </h3>
              <div className="flex flex-col gap-2">
                {posts.filter((p) => p.featured || p.pinned).slice(0, 4).map((p) => <NewsCardCompact key={p.id} post={p} />)}
                {posts.filter((p) => p.featured || p.pinned).length === 0 && (
                  <p className="text-xs text-muted-foreground">Marque como destaque no admin.</p>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="rounded-3xl border border-border/50 bg-card/30 backdrop-blur-xl p-5">
              <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-primary-glow">
                <TagIcon className="h-3 w-3" /> Categorias populares
              </h3>
              <div className="flex flex-col gap-1">
                {tagCounts.slice(0, 8).map(([tag, count]) => (
                  <button
                    key={tag}
                    onClick={() => { setActiveTag(tag); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-foreground transition-all hover:bg-primary/10 hover:text-primary-glow"
                  >
                    <span>{tag}</span>
                    <span className="text-xs text-muted-foreground">{count}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* TIMELINE */}
      {timeline.length > 0 && (
        <section className="px-4 pb-24">
          <div className="container mx-auto">
            <h2 className="mb-10 text-2xl md:text-3xl font-black text-foreground flex items-center gap-3">
              <Clock className="h-6 w-6 text-primary-glow" /> Linha do tempo
            </h2>
            <div className="relative border-l border-primary/30 pl-6 md:pl-10">
              {timeline.map(([month, items]) => (
                <div key={month} className="mb-12 last:mb-0">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="absolute -left-[7px] h-3.5 w-3.5 rounded-full border-2 border-primary-glow bg-background shadow-[0_0_20px_hsl(var(--primary-glow)/0.8)]" />
                    <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-primary-glow capitalize">{month}</h3>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {items.slice(0, 4).map((p) => (
                      <Link
                        key={p.id}
                        to={p.slug ? `/${p.slug}` : "#"}
                        className="group flex items-center gap-4 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-md p-4 transition-all hover:border-primary-glow/60 hover:bg-card/60"
                      >
                        <div className="text-xs uppercase tracking-widest text-muted-foreground shrink-0 w-16">{formatDate(p.date)}</div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[10px] uppercase tracking-widest text-primary-glow">{p.tag}</div>
                          <h4 className="text-sm font-semibold text-foreground group-hover:text-primary-glow line-clamp-1">{p.title}</h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  );
};

export default Noticias;
