import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import MarkdownRenderer from "@/components/post/MarkdownRenderer";
import ReadMore from "@/components/post/ReadMore";
import ReviewBadge from "@/components/post/ReviewBadge";
import { usePosts } from "@/hooks/usePosts";

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

const PostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { posts } = usePosts();

  const post = useMemo(
    () => posts.find((p) => p.slug === slug),
    [posts, slug]
  );

  const related = useMemo(() => {
    if (!post) return [];
    const sameTag = posts.filter((p) => p.id !== post.id && p.tag === post.tag);
    const fill = posts.filter((p) => p.id !== post.id && p.tag !== post.tag);
    return [...sameTag, ...fill].slice(0, 4);
  }, [posts, post]);

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

  return (
    <SiteLayout
      title={`${post.title} — In Game`}
      description={post.description || post.subtitle || `Postagem de ${post.author}`}
    >
      {/* Hero cinematográfico */}
      <section className="relative w-full h-[70vh] min-h-[460px] overflow-hidden">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-deep via-background to-primary/40" />
        )}
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(var(--background))_95%)]" />

        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <div className="max-w-4xl w-full text-center animate-fade-up">
            {post.tag && (
              <span className="inline-block mb-5 px-4 py-1.5 text-[10px] md:text-xs font-black uppercase tracking-[0.25em] rounded-full bg-primary/90 text-primary-foreground border border-primary-glow shadow-[0_0_24px_hsl(var(--primary-glow)/0.7)]">
                {post.tag}
              </span>
            )}
            <div className="inline-block px-6 md:px-10 py-5 md:py-7 rounded-3xl bg-black/55 backdrop-blur-md border border-white/10 shadow-[0_20px_60px_-20px_hsl(var(--primary)/0.6)]">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight text-white drop-shadow-[0_2px_12px_hsl(270_90%_5%/0.9)]">
                {post.title}
              </h1>
              {post.subtitle && (
                <p className="mt-4 text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                  {post.subtitle}
                </p>
              )}
            </div>
            <div className="mt-6 flex items-center justify-center gap-3 text-xs md:text-sm text-white/70 uppercase tracking-widest">
              <span className="font-bold text-primary-glow">{post.author || "In Game"}</span>
              {post.date && (
                <>
                  <span className="w-1 h-1 rounded-full bg-primary-glow" />
                  <span>{formatDate(post.date)}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Corpo do artigo */}
      <article className="relative px-3 sm:px-4 pb-20 -mt-10 md:-mt-16">
        <div className="container mx-auto max-w-3xl">
          <div className="indie-card p-4 sm:p-6 md:p-12 animate-fade-up">
            {post.description && (
              <p className="text-lg md:text-xl text-foreground/80 italic leading-relaxed mb-8 pb-8 border-b border-primary/15">
                {post.description}
              </p>
            )}

            {post.tag === "Review" && post.review_grade && (
              <ReviewBadge grade={post.review_grade} note={post.review_note} />
            )}

            {post.content ? (
              <MarkdownRenderer content={post.content} />
            ) : (
              <p className="text-muted-foreground italic">
                Esta postagem ainda não tem conteúdo escrito. Edite no painel admin para
                adicionar texto, imagens e citações.
              </p>
            )}

            {post.link && (
              <div className="mt-10 pt-8 border-t border-primary/15">
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glow inline-flex items-center gap-2 px-6 py-3 rounded-full text-primary-foreground font-bold uppercase tracking-wider text-xs"
                >
                  Link relacionado <span>→</span>
                </a>
              </div>
            )}

            <ReadMore posts={related} />
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-primary-glow font-semibold text-xs uppercase tracking-wider hover:gap-3 transition-all"
            >
              ← Voltar ao início
            </Link>
          </div>
        </div>
      </article>
    </SiteLayout>
  );
};

export default PostPage;
