import { Link } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import SectionDivider from "@/components/SectionDivider";
import PostCard from "@/components/PostCard";
import { usePosts } from "@/hooks/usePosts";


const miniFeatures = [
  {
    title: "Descobrir indies",
    desc: "Curadoria constante de jogos independentes que merecem atenção.",
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="14" cy="14" r="8" />
        <path d="M20 20 L26 26" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Sorteios",
    desc: "Chaves, brindes e oportunidades exclusivas para a comunidade.",
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="10" width="24" height="18" rx="2" />
        <path d="M4 16 L28 16 M16 10 L16 28" />
      </svg>
    ),
  },
  {
    title: "Compartilhar",
    desc: "Conte histórias, recomende jogos e troque impressões.",
    icon: (
      <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 8 L26 8 L26 22 L18 22 L12 28 L12 22 L6 22 Z" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const RECENT_COUNT = 3;

const Index = () => {
  const { posts } = usePosts();

  // Ordena por data desc (mais recentes primeiro). Em empate, mantém ordem original.
  const sortedPosts = [...posts].sort((a, b) => {
    const da = a.date ? new Date(a.date).getTime() : 0;
    const db = b.date ? new Date(b.date).getTime() : 0;
    return db - da;
  });

  return (
    <SiteLayout
      title="In Game — Comunidade de jogos indies"
      description="In Game é uma comunidade feita por quem ama jogos indies. Descubra novos títulos, participe de sorteios e compartilhe experiências."
    >
      {/* 1. HERO — estilo indie game */}
      <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Ambient gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-deep/20 via-transparent to-background" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 md:px-10 pt-32 pb-20">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            {/* Stamp-style title */}
            <h1
              className="uppercase leading-[0.85] tracking-tight text-foreground mb-10"
              style={{
                fontFamily: '"Permanent Marker", "Caveat Brush", cursive',
                fontSize: "clamp(5rem, 16vw, 13rem)",
                textShadow: "5px 5px 0 hsl(var(--primary-deep)), 0 0 35px hsl(var(--primary-glow) / 0.45)",
                WebkitTextStroke: "1px hsl(var(--primary-glow) / 0.35)",
                transform: "rotate(-2deg)",
              }}
            >
              In<br />Game
            </h1>

            {/* Flat purple buttons with hard shadow */}
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="#postagens"
                className="group inline-flex items-center gap-2 px-7 py-4 bg-primary border-2 border-primary-glow text-primary-foreground font-black uppercase tracking-widest text-sm shadow-[6px_6px_0_hsl(var(--primary-deep))] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_hsl(var(--primary-deep))] transition-all"
              >
                Explorar postagens
              </a>
              <Link
                to="/apoiar"
                className="group inline-flex items-center gap-2 px-7 py-4 bg-background border-2 border-primary text-foreground font-black uppercase tracking-widest text-sm shadow-[6px_6px_0_hsl(var(--primary)/0.6)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_hsl(var(--primary)/0.6)] transition-all"
              >
                Apoiar comunidade
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* 2. SOBRE (resumo) */}
      <section className="relative py-24 px-4 bg-background/40 backdrop-blur-sm">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 animate-fade-up">
            <p className="text-primary-glow uppercase tracking-[0.3em] text-xs font-bold mb-3">A comunidade</p>
            <h2 className="text-4xl md:text-5xl font-black mb-5">
              Um espaço que <span className="text-gradient">respira indie</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A In Game reúne pessoas que enxergam beleza em pequenos mundos — jogos feitos com alma,
              criados por times pequenos e cheios de coragem.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            {miniFeatures.map((f, i) => (
              <div
                key={f.title}
                className="indie-card p-5 text-center animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/15 border border-primary/40 flex items-center justify-center text-primary-glow">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/sobre"
              className="inline-flex items-center gap-2 text-primary-glow font-semibold text-sm uppercase tracking-wider group"
            >
              Saber mais sobre nós
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* 3. POSTAGENS RECENTES */}
      <section id="postagens" className="relative py-24 px-4">
        <div className="container mx-auto">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4 animate-fade-up">
            <div>
              <p className="text-primary-glow uppercase tracking-[0.3em] text-xs font-bold mb-2">Da comunidade</p>
              <h2 className="text-4xl md:text-5xl font-black">
                Postagens <span className="text-gradient">recentes</span>
              </h2>
            </div>
            <p className="text-muted-foreground max-w-md">
              Conteúdos, análises e novidades feitos por quem faz parte da In Game.
            </p>
          </div>

          {sortedPosts.length === 0 ? (
            <div className="indie-card p-10 text-center text-muted-foreground">
              Nenhuma postagem por aqui ainda. Volte em breve! ✦
            </div>
          ) : (
            <div className="flex flex-col gap-8 max-w-5xl mx-auto">
              {sortedPosts.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} isRecent={i < RECENT_COUNT} />
              ))}
            </div>
          )}
        </div>
      </section>

    </SiteLayout>
  );
};

export default Index;
