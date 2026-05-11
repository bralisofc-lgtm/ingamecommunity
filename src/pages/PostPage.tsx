import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import MarkdownRenderer from "@/components/post/MarkdownRenderer";
import ReadMore from "@/components/post/ReadMore";
import ReviewVerdict from "@/components/post/ReviewVerdict";
import AuthorSocials from "@/components/post/AuthorSocials";
import PostLoadingBar from "@/components/post/PostLoadingBar";
import { usePosts, type Post } from "@/hooks/usePosts";

const formatDate = (iso: string) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

/**
 * Recomendação dinâmica e variada:
 * 1 mesma tag · 1 destaque · 1 review · 1 emocional/aleatório
 * com fallbacks para garantir 4 sempre que possível.
 */
function buildRecommendations(all: Post[], current: Post): Post[] {
  const others = all.filter((p) => p.id !== current.id);
  // Embaralhar (Fisher-Yates) para recomendações verdadeiramente aleatórias
  const shuffled = [...others];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 4);
}

const PostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { posts } = usePosts();

  const post = useMemo(
    () => posts.find((p) => p.slug === slug),
    [posts, slug]
  );

  const related = useMemo(() => (post ? buildRecommendations(posts, post) : []), [posts, post]);

  if (!posts.length) {
    return (
      <SiteLayout title="Carregando…" description="">
        <div className="pt-32 pb-24 text-center text-muted-foreground">Carregando postagem…</div>
      </SiteLayout>
    );
  }

  if (!post) {
    return (
      <SiteLayout title="Postagem não encontrada — In Game" description="">
        <section className="pt-32 pb-24 px-4 text-center">
          <p className="text-primary-glow uppercase tracking-[0.3em] text-xs font-bold mb-3">404</p>
          <h1 className="text-4xl font-black mb-4">Postagem não encontrada</h1>
          <p className="text-muted-foreground mb-8">O conteúdo que você procura pode ter sido movido ou removido.</p>
          <Link to="/" className="btn-glow inline-flex items-center gap-2 px-6 py-3 rounded-full text-primary-foreground font-bold uppercase tracking-wider text-xs">
            Voltar ao início
          </Link>
        </section>
      </SiteLayout>
    );
  }

  const shareUrl = `https://ingamecommunity.site/${post.slug}`;

  return (
    <SiteLayout
      title={`${post.title} — In Game`}
      description={post.description || `Postagem de ${post.author}`}
      image={post.image}
      canonical={shareUrl}
    >
      {/* Hero cinematográfico */}
      <section className="relative w-full h-[58vh] md:h-[70vh] min-h-[380px] md:min-h-[460px] overflow-hidden">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-deep via-background to-primary/40" />
        )}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(var(--background))_95%)]" />

        <div className="relative z-10 h-full flex items-end md:items-center justify-center px-4 pb-8 md:pb-0">
          <div className="max-w-4xl w-full text-center animate-fade-up">
            {post.tag && (
              <span className="inline-block mb-4 px-3.5 py-1 text-[10px] md:text-xs font-black uppercase tracking-[0.25em] rounded-full bg-primary/90 text-primary-foreground border border-primary-glow shadow-[0_0_24px_hsl(var(--primary-glow)/0.7)]">
                {post.tag}
              </span>
            )}
            {/* Mobile: título limpo sem caixa. Desktop: caixa premium */}
            <div className="md:hidden">
              <h1 className="text-[26px] sm:text-3xl font-black leading-[1.15] text-white drop-shadow-[0_2px_12px_hsl(270_90%_5%/0.95)] px-2">
                {post.title}
              </h1>
            </div>
            <div className="hidden md:inline-block px-10 py-7 rounded-3xl bg-black/55 backdrop-blur-md border border-white/10 shadow-[0_20px_60px_-20px_hsl(var(--primary)/0.6)]">
              <h1 className="text-5xl lg:text-6xl font-black leading-tight text-white drop-shadow-[0_2px_12px_hsl(270_90%_5%/0.9)]">
                {post.title}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Corpo do artigo — editorial premium */}
      <article className="relative px-4 sm:px-4 pb-10 mt-8 md:mt-12">
        <div className="container mx-auto max-w-3xl">
          {/* AUTORIA — TOPO DESKTOP/TABLET (oculto no mobile) */}
          <div className="hidden md:block mb-10 relative z-20">
            <div className="flex items-center gap-5 px-1 flex-wrap">
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-glow">Publicado por</span>
                <span className="mt-1 text-base font-bold text-foreground truncate">{post.author || "In Game"}</span>
              </div>
              <div className="h-8 w-px bg-primary/25" />
              {post.date && (
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-glow/80">Data</span>
                  <span className="mt-1 text-sm text-foreground/85 whitespace-nowrap">{formatDate(post.date)}</span>
                </div>
              )}
              {post.author_socials?.length > 0 && (
                <>
                  <div className="h-8 w-px bg-primary/25" />
                  <div className="relative z-30 flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-glow/80">Redes</span>
                    <div className="mt-1">
                      <AuthorSocials links={post.author_socials} size="sm" />
                    </div>
                  </div>
                </>
              )}
              {post.link && (
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto btn-glow inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-primary-foreground font-bold uppercase tracking-wider text-[11px]"
                >
                  Link relacionado <span>→</span>
                </a>
              )}
            </div>
            <div className="mt-6 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </div>

          {/* Mobile: sem card/borda — leitura editorial pura. Desktop: card premium */}
          <div className="md:indie-card md:p-14 animate-fade-up">
            {post.description && (
              <p className="text-lg md:text-2xl text-foreground/85 italic leading-relaxed mb-8 md:mb-10 pb-6 md:pb-8 border-b border-primary/15">
                {post.description}
              </p>
            )}

            {post.content ? (
              <MarkdownRenderer content={post.content} />
            ) : (
              <p className="text-muted-foreground italic">
                Esta postagem ainda não tem conteúdo escrito.
              </p>
            )}
          </div>

          {/* AUTORIA — RODAPÉ MOBILE (apenas no celular). + Link relacionado mobile */}
          <div className="md:hidden mt-8 px-1 space-y-5">
            {post.link && (
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glow inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-primary-foreground font-bold uppercase tracking-wider text-[11px]"
              >
                Link relacionado <span>→</span>
              </a>
            )}
            <div className="rounded-2xl border border-primary/20 bg-card/40 p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-glow">Publicado por</span>
                  <span className="mt-1 text-base font-bold text-foreground truncate">{post.author || "In Game"}</span>
                  {post.date && (
                    <span className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground/80">{formatDate(post.date)}</span>
                  )}
                </div>
                {post.author_socials?.length > 0 && (
                  <AuthorSocials links={post.author_socials} size="sm" />
                )}
              </div>
            </div>
          </div>


          {/* Nota Final — bloco SEPARADO, fora do artigo */}
          {post.tag === "Review" && (post.review_grade || post.review_summary || post.review_game_name || (post.review_tech_info && Object.keys(post.review_tech_info).length > 0)) && (
            <ReviewVerdict
              grade={post.review_grade}
              note={post.review_note}
              summary={post.review_summary}
              gameName={post.review_game_name}
              techInfo={post.review_tech_info}
            />
          )}
        </div>
      </article>

      {/* SEÇÃO INDEPENDENTE — Leia mais (fundo preto premium) */}
      {related.length > 0 && (
        <section className="relative mt-6 md:mt-10 py-16 md:py-24 border-t border-primary/15 bg-black">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary-glow)/0.08),transparent_70%)] pointer-events-none" />
          <div className="container mx-auto max-w-5xl px-4 relative">
            <ReadMore posts={related} />
          </div>
        </section>
      )}

      {/* Voltar ao início — fundo totalmente preto, com seta circular */}
      <div className="bg-black text-center py-16">
        <Link
          to="/"
          aria-label="Voltar ao início"
          className="group inline-flex items-center justify-center w-14 h-14 rounded-full border-2 border-primary-glow/60 bg-primary/10 text-primary-glow hover:bg-primary hover:text-primary-foreground hover:border-primary-glow hover:shadow-[0_0_30px_hsl(var(--primary-glow)/0.7)] hover:-translate-y-1 transition-all duration-300"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 transition-transform group-hover:-translate-y-0.5">
            <path d="M12 19V5" />
            <path d="m5 12 7-7 7 7" />
          </svg>
        </Link>
        <p className="mt-3 text-[10px] uppercase tracking-[0.3em] font-black text-primary-glow/80">Voltar ao início</p>
      </div>
    </SiteLayout>
  );
};

export default PostPage;
