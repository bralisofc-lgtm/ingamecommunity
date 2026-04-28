import { Link } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import SectionDivider from "@/components/SectionDivider";
import PostCard from "@/components/PostCard";
import { usePosts } from "@/hooks/usePosts";
import logo from "@/assets/ingame-logo.png";

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

const Index = () => {
  const { posts } = usePosts();

  return (
    <SiteLayout
      title="In Game — Comunidade de jogos indies"
      description="In Game é uma comunidade feita por quem ama jogos indies. Descubra novos títulos, participe de sorteios e compartilhe experiências."
    >
      {/* 1. HERO */}
      <section className="relative pt-32 pb-24 px-4 min-h-[90vh] flex items-center">
        <div className="container mx-auto text-center max-w-4xl animate-fade-up">
          <div className="flex justify-center mb-8 animate-ghost-bob">
            <img
              src={logo}
              alt="In Game"
              className="h-40 md:h-56 w-auto"
              style={{ filter: "drop-shadow(0 0 40px hsl(var(--primary) / 0.6))" }}
            />
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6">
            <span className="text-gradient glow-text">In Game</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground font-light mb-10 max-w-2xl mx-auto">
            Uma comunidade feita por <span className="text-primary-glow font-medium">quem ama jogos indies</span>.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#postagens"
              className="btn-glow inline-flex items-center gap-2 px-8 py-4 rounded-full text-primary-foreground font-bold uppercase tracking-wider text-sm"
            >
              Explorar postagens
            </a>
            <Link
              to="/apoiar"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-primary/60 text-foreground font-bold uppercase tracking-wider text-sm hover:border-primary hover:bg-primary/10 transition-all"
            >
              Apoiar comunidade
            </Link>
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

          {posts.length === 0 ? (
            <div className="indie-card p-10 text-center text-muted-foreground">
              Nenhuma postagem por aqui ainda. Volte em breve! ✦
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <SectionDivider />

      {/* 4. CTA APOIAR */}
      <section className="relative py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="indie-card p-10 md:p-14 text-center relative overflow-hidden animate-fade-up">
            <p className="text-primary-glow uppercase tracking-[0.3em] text-xs font-bold mb-3">Apoie a In Game</p>
            <h2 className="text-3xl md:text-5xl font-black mb-5">
              Ajude a comunidade a <span className="text-gradient">crescer</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Seu apoio mantém os sorteios, conteúdos e novas iniciativas vivas para todos que amam jogos indies.
            </p>
            <Link
              to="/apoiar"
              className="btn-glow inline-flex items-center gap-3 px-10 py-5 rounded-full text-primary-foreground font-black uppercase tracking-widest text-sm md:text-base animate-pulse-glow"
            >
              <span>★</span>
              Apoiar a In Game
              <span>★</span>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Index;
