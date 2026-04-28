const SupportSection = () => {
  // Replace this with your community's external form URL
  const supportUrl = "https://forms.gle/your-community-form";

  return (
    <section id="apoiar" className="relative py-24 md:py-32 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="indie-card p-8 md:p-16 text-center relative overflow-hidden animate-fade-up">
          {/* Floating decorative ghosts */}
          <div className="absolute top-6 left-6 opacity-30 animate-drift">
            <svg width="40" height="40" viewBox="0 0 32 32">
              <path
                d="M16 4 C9 4 5 9 5 16 L5 27 L8 24 L11 27 L14 24 L17 27 L20 24 L23 27 L26 24 L26 16 C26 9 22 4 16 4 Z"
                fill="hsl(var(--primary-glow))"
              />
            </svg>
          </div>
          <div className="absolute bottom-8 right-8 opacity-30 animate-drift" style={{ animationDelay: "2s" }}>
            <svg width="32" height="32" viewBox="0 0 32 32">
              <path
                d="M16 4 C9 4 5 9 5 16 L5 27 L8 24 L11 27 L14 24 L17 27 L20 24 L23 27 L26 24 L26 16 C26 9 22 4 16 4 Z"
                fill="hsl(var(--accent))"
              />
            </svg>
          </div>

          <p className="text-primary-glow uppercase tracking-[0.3em] text-xs font-bold mb-4 relative z-10">
            Apoie a In Game
          </p>

          <h2 className="text-4xl md:text-6xl font-black mb-6 relative z-10">
            Faça parte do <br />
            <span className="text-gradient glow-text">crescimento</span> da comunidade
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed relative z-10">
            Toda comunidade vive da energia das pessoas que acreditam nela. Seu apoio ajuda a manter
            <span className="text-primary-glow font-semibold"> sorteios</span>,
            <span className="text-primary-glow font-semibold"> conteúdos</span>,
            <span className="text-primary-glow font-semibold"> postagens</span> e novas iniciativas
            criativas para todos que amam jogos indies.
          </p>

          <a
            href={supportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glow inline-flex items-center gap-3 px-10 md:px-14 py-5 md:py-6 rounded-full text-primary-foreground font-black uppercase tracking-widest text-base md:text-lg relative z-10 animate-pulse-glow"
          >
            <span>★</span>
            Apoiar a In Game
            <span>★</span>
          </a>

          <p className="mt-8 text-sm text-muted-foreground relative z-10">
            Cada apoio é um passo a mais para manter a chama indie acesa. ✦
          </p>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
