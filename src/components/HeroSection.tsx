import logo from "@/assets/ingame-logo.png";

interface Post {
  id: string;
  title: string;
  excerpt: string;
  tag: string;
  link: string;
}

const posts: Post[] = [
  {
    id: "1",
    title: "Hollow Knight: Silksong finalmente chegou",
    excerpt: "Mergulhamos no aguardado novo capítulo do universo Hallownest. Veja nossas primeiras impressões.",
    tag: "Análise",
    link: "#",
  },
  {
    id: "2",
    title: "Sorteio: 3 chaves de Hades II",
    excerpt: "Estamos sorteando chaves para a comunidade. Confira como participar e boa sorte a todos!",
    tag: "Sorteio",
    link: "#",
  },
  {
    id: "3",
    title: "5 indies brasileiros para ficar de olho",
    excerpt: "A cena indie nacional está fervendo. Selecionamos cinco projetos imperdíveis feitos por aqui.",
    tag: "Lista",
    link: "#",
  },
  {
    id: "4",
    title: "Entrevista com a dev de Pequenos Mundos",
    excerpt: "Conversamos com a criadora sobre processo criativo, inspirações e os bastidores do desenvolvimento.",
    tag: "Entrevista",
    link: "#",
  },
];

const HeroSection = () => {
  return (
    <section id="inicio" className="relative min-h-screen pt-32 pb-20 px-4">
      <div className="container mx-auto">
        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto animate-fade-up">
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
              href="#sobre"
              className="btn-glow inline-flex items-center gap-2 px-8 py-4 rounded-full text-primary-foreground font-bold uppercase tracking-wider text-sm"
            >
              Conhecer a comunidade
            </a>
            <a
              href="#apoiar"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-primary/60 text-foreground font-bold uppercase tracking-wider text-sm hover:border-primary hover:bg-primary/10 transition-all"
            >
              Apoiar
            </a>
          </div>
        </div>

        {/* Posts */}
        <div className="mt-32">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <p className="text-primary-glow uppercase tracking-[0.3em] text-xs font-bold mb-2">Da comunidade</p>
              <h2 className="text-4xl md:text-5xl font-black">
                Postagens <span className="text-gradient">recentes</span>
              </h2>
            </div>
            <p className="text-muted-foreground max-w-md">
              Conteúdos, análises e novidades feitos pela comunidade In Game.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {posts.map((post, i) => (
              <article
                key={post.id}
                className="indie-card p-6 md:p-8 group animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-primary/20 text-primary-glow border border-primary/40">
                    {post.tag}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
                </div>

                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary-glow transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{post.excerpt}</p>

                <a
                  href={post.link}
                  className="inline-flex items-center gap-2 text-primary-glow font-semibold text-sm uppercase tracking-wider group/btn"
                >
                  Ler postagem
                  <span className="transition-transform group-hover/btn:translate-x-1">→</span>
                </a>
              </article>
            ))}
          </div>

          {/* Embed area */}
          <div className="mt-16 indie-card p-8 md:p-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-primary-glow animate-pulse-glow" />
              <p className="text-primary-glow uppercase tracking-[0.3em] text-xs font-bold">Em destaque</p>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-3">Postagens da comunidade</h3>
            <p className="text-muted-foreground mb-6">
              Embeds, vídeos e links favoritos compartilhados por quem faz parte da In Game.
            </p>

            <div className="aspect-video rounded-xl border-2 border-dashed border-primary/40 bg-secondary/40 flex flex-col items-center justify-center text-center p-6">
              <svg width="48" height="48" viewBox="0 0 32 32" className="mb-3 animate-ghost-bob">
                <path
                  d="M16 4 C9 4 5 9 5 16 L5 27 L8 24 L11 27 L14 24 L17 27 L20 24 L23 27 L26 24 L26 16 C26 9 22 4 16 4 Z"
                  fill="hsl(var(--primary-glow) / 0.9)"
                />
                <circle cx="12" cy="14" r="2" fill="hsl(var(--background))" />
                <circle cx="20" cy="14" r="2" fill="hsl(var(--background))" />
              </svg>
              <p className="text-muted-foreground text-sm">
                Espaço reservado para embeds — cole aqui um link, vídeo ou postagem da comunidade.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
