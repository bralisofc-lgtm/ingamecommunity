import SiteLayout from "@/components/SiteLayout";
import SectionDivider from "@/components/SectionDivider";

const features = [
  {
    title: "Descobrir novos indies",
    desc: "Curadoria constante de jogos independentes que merecem atenção.",
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="14" cy="14" r="8" />
        <path d="M20 20 L26 26" strokeLinecap="round" />
        <circle cx="14" cy="14" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Participar de sorteios",
    desc: "Chaves, brindes e oportunidades exclusivas para quem está com a gente.",
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="10" width="24" height="18" rx="2" />
        <path d="M4 16 L28 16 M16 10 L16 28" />
        <path d="M11 10 C11 6, 16 6, 16 10 C16 6, 21 6, 21 10" />
      </svg>
    ),
  },
  {
    title: "Compartilhar experiências",
    desc: "Conte histórias, recomende jogos e troque impressões com outros jogadores.",
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 8 L26 8 L26 22 L18 22 L12 28 L12 22 L6 22 Z" strokeLinejoin="round" />
        <circle cx="12" cy="15" r="1.2" fill="currentColor" />
        <circle cx="16" cy="15" r="1.2" fill="currentColor" />
        <circle cx="20" cy="15" r="1.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Apoiar desenvolvedores",
    desc: "Valorize quem cria. Cada indie começa com um sonho e merece ser visto.",
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2">
        <path
          d="M16 27 C16 27 4 19 4 11 C4 7 7 4 11 4 C13 4 15 5 16 7 C17 5 19 4 21 4 C25 4 28 7 28 11 C28 19 16 27 16 27 Z"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const Sobre = () => {
  return (
    <SiteLayout
      title="Sobre a Comunidade — In Game"
      description="Conheça a história e os valores da comunidade In Game, feita por quem ama jogos indies."
    >
      <section className="relative pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl text-center animate-fade-up">
          <p className="text-primary-glow uppercase tracking-[0.3em] text-xs font-bold mb-3">Sobre nós</p>
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            Uma comunidade que <span className="text-gradient glow-text">respira indie</span>
          </h1>
          <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
            <p>
              Existe algo essencial em qualquer comunidade que realmente cresce: a interação e a presença do público.
            </p>
            <p>
              Nossa comunidade é um espaço para quem vê nos jogos indie mais do que entretenimento, mas ideias,
              sentimentos e histórias únicas feitas com amor.
            </p>
            <p className="text-foreground/90 italic">Se você ama indies, você já é parte da In Game. ✦</p>
          </div>
        </div>
      </section>

      <SectionDivider />

      <section className="relative py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="indie-card p-6 text-center animate-fade-up"
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/15 border border-primary/40 flex items-center justify-center text-primary-glow animate-pulse-glow">
                  {f.icon}
                </div>
                <h2 className="text-lg font-bold mb-2">{f.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Sobre;
