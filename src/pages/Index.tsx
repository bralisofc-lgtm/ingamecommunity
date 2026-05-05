import { Link } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import SectionDivider from "@/components/SectionDivider";
import PostCard from "@/components/PostCard";
import { usePosts } from "@/hooks/usePosts";
import ingameLogo from "@/assets/ingame-logo.png";
import Reveal from "@/components/Reveal";
import HeroParticles from "@/components/HeroParticles";
import HeroCoverWall from "@/components/HeroCoverWall";
import { POST_TAGS } from "@/lib/tags";
import PostsCarousel from "@/components/PostsCarousel";


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
      {/* 1. HERO — paisagem indie com logo integrada */}
      <section className="relative min-h-[100svh] w-full overflow-hidden flex items-start justify-center pt-[clamp(3rem,7vh,5rem)] pb-24 bg-[hsl(270_80%_5%)]">
        {/* Parede animada de capas indies (4 colunas alternando direção) */}
        <HeroCoverWall />

        {/* Atmospheric haze that breathes */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-deep/30 via-transparent to-transparent animate-hero-haze pointer-events-none" aria-hidden />

        {/* Partículas e ícones indies flutuando sobre a paisagem */}
        <HeroParticles />

        {/* Content */}
        <div className="relative z-10 w-full container mx-auto px-6 md:px-10 flex justify-center">
          <div className="w-full max-w-3xl mx-auto text-center flex flex-col items-center animate-fade-up">
            {/* Logo art — integrada como parte da paisagem */}
            <h1 className="relative mb-3 md:mb-5 flex justify-center w-full max-w-[820px] aspect-[909/469]">
              <span className="sr-only">In Game</span>
              <img
                src={ingameLogo}
                alt="In Game"
                width={820}
                height={300}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="absolute left-[-5.5%] top-[-56.7%] w-[110%] max-w-none h-auto select-none mix-blend-screen drop-shadow-[0_8px_25px_hsl(270_80%_8%/0.8)] animate-logo-float"
                draggable={false}
              />
            </h1>

            {/* Botões integrados como tótens da paisagem */}
            <div className="flex flex-wrap gap-4 justify-center animate-buttons-rise">
              <a
                href="https://yourgamerprofile.com/community/in-game"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-7 py-4 bg-primary/90 backdrop-blur-sm border-2 border-primary-glow text-primary-foreground font-black uppercase tracking-widest text-sm shadow-[6px_6px_0_hsl(var(--primary-deep)),0_0_30px_hsl(var(--primary-glow)/0.5)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_hsl(var(--primary-deep)),0_0_40px_hsl(var(--primary-glow)/0.8)] transition-all"
              >
                Explorar postagens
              </a>
              <a
                href="https://forms.gle/kX4vtVjzZQpgk97M7"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden inline-flex items-center gap-2 px-7 py-4 bg-background/60 backdrop-blur-sm border-2 border-primary text-foreground font-black uppercase tracking-widest text-sm shadow-[6px_6px_0_hsl(var(--primary)/0.6),0_0_25px_hsl(var(--primary)/0.4)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_hsl(var(--primary)/0.6),0_0_35px_hsl(var(--primary)/0.7)] transition-all"
              >
                {/* Partículas internas */}
                <span className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
                  {Array.from({ length: 8 }).map((_, i) => {
                    const left = (i * 13.7) % 100;
                    const size = 2 + ((i * 5) % 4);
                    const delay = (i * 0.4) % 3;
                    const duration = 3 + ((i * 0.9) % 3);
                    return (
                      <span
                        key={i}
                        className="absolute rounded-full bg-primary-glow shadow-[0_0_8px_hsl(var(--primary-glow))] animate-btn-particle"
                        style={{
                          left: `${left}%`,
                          bottom: `-${size}px`,
                          width: `${size}px`,
                          height: `${size}px`,
                          animationDelay: `${delay}s`,
                          animationDuration: `${duration}s`,
                        }}
                      />
                    );
                  })}
                </span>
                <span className="relative">Apoiar comunidade</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bridge: degradê roxo profundo + névoa + partículas → conecta hero ao próximo bloco sem flash preto */}
        <div className="pointer-events-none absolute -bottom-2 left-0 right-0 h-[40vh] z-[5]" aria-hidden>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(270_70%_8%/0.55)] to-background" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(ellipse_at_center_bottom,hsl(var(--primary)/0.35),transparent_70%)] animate-hero-haze" />
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 7 }).map((_, i) => {
              const left = (i * 7.3) % 100;
              const size = 3 + ((i * 13) % 6);
              const delay = (i * 0.45) % 5;
              const duration = 6 + ((i * 1.7) % 5);
              return (
                <span
                  key={i}
                  className="absolute rounded-full bg-primary-glow/70 shadow-[0_0_12px_hsl(var(--primary-glow)/0.9)] animate-particle-rise"
                  style={{
                    left: `${left}%`,
                    bottom: `-${size}px`,
                    width: `${size}px`,
                    height: `${size}px`,
                    animationDelay: `${delay}s`,
                    animationDuration: `${duration}s`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. DESTAQUES RECENTES (fundo roxo neon) */}
      <RecentHighlights posts={sortedPosts} />

      {/* 3. POSTAGENS DA COMUNIDADE — carrossel auto-scroll com filtros */}
      <PostsCarousel posts={sortedPosts} />

      {/* 4. POSTAGENS RECENTES (grid clássico com filtro) */}
      <section id="postagens" className="relative py-24 px-4">
        <div className="container mx-auto">
          <Reveal className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <p className="text-primary-glow uppercase tracking-[0.3em] text-xs font-bold mb-2">Da comunidade</p>
              <h2 className="text-4xl md:text-5xl font-black">
                Postagens <span className="text-gradient">recentes</span>
              </h2>
            </div>
            <p className="text-muted-foreground max-w-md">
              Conteúdos, análises e novidades feitos por quem faz parte da In Game.
            </p>
          </Reveal>

          {/* Filtro de tags (botão expansível) */}
          <Reveal className="mb-10">
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => setFilterOpen((o) => !o)}
                aria-expanded={filterOpen}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                  filterOpen || activeTag !== "Todas"
                    ? "bg-primary/15 text-primary-glow border-primary/60 shadow-[0_0_18px_hsl(var(--primary-glow)/0.3)]"
                    : "bg-secondary/40 text-muted-foreground border-border hover:border-primary/60 hover:text-primary-glow"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtros
                {activeTag !== "Todas" && (
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px]">
                    1
                  </span>
                )}
              </button>

              {activeTag !== "Todas" && (
                <button
                  type="button"
                  onClick={() => setActiveTag("Todas")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition"
                >
                  <X className="w-3 h-3" />
                  Limpar ({activeTag})
                </button>
              )}
            </div>

            {filterOpen && (
              <div className="mt-4 indie-card p-4 animate-fade-in">
                <div className="flex flex-wrap gap-2">
                  {(["Todas", ...POST_TAGS] as const).map((tag) => {
                    const active = activeTag === tag;
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setActiveTag(tag);
                          setFilterOpen(false);
                        }}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                          active
                            ? "bg-primary text-primary-foreground border-primary-glow shadow-[0_0_18px_hsl(var(--primary-glow)/0.6)]"
                            : "bg-secondary/40 text-muted-foreground border-border hover:border-primary/60 hover:text-primary-glow"
                        }`}
                      >
                        {active && <Check className="w-3 h-3" />}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </Reveal>

          {filteredPosts.length === 0 ? (
            <div className="indie-card p-10 text-center text-muted-foreground">
              {sortedPosts.length === 0
                ? "Nenhuma postagem por aqui ainda. Volte em breve! ✦"
                : `Nenhuma postagem com a tag "${activeTag}".`}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, i) => (
                <Reveal key={post.id} delay={Math.min(i * 0.1, 0.5)}>
                  <PostCard post={post} index={i} isRecent={i < RECENT_COUNT} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <SectionDivider />

      {/* 3. SOBRE (resumo) — agora no final */}
      <section className="relative py-24 px-4 bg-gradient-to-b from-background via-[hsl(270_60%_6%)] to-background overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 -top-20 h-40 bg-[radial-gradient(ellipse_at_center_top,hsl(var(--primary)/0.25),transparent_70%)]" aria-hidden />
        <div className="container mx-auto max-w-5xl relative">
          <Reveal className="text-center mb-12">
            <p className="text-primary-glow uppercase tracking-[0.3em] text-xs font-bold mb-3">A comunidade</p>
            <h2 className="text-4xl md:text-5xl font-black mb-5">
              Um espaço que <span className="text-gradient">respira indie</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A In Game reúne pessoas que enxergam beleza em pequenos mundos — jogos feitos com alma,
              criados por times pequenos e cheios de coragem.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            {miniFeatures.map((f, i) => (
              <Reveal key={f.title} delay={0.12 + i * 0.12} className="indie-card p-5 text-center">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/15 border border-primary/40 flex items-center justify-center text-primary-glow">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3} className="text-center">
            <Link
              to="/sobre"
              className="inline-flex items-center gap-2 text-primary-glow font-semibold text-sm uppercase tracking-wider group"
            >
              Saber mais sobre nós
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

    </SiteLayout>
  );
};

export default Index;
