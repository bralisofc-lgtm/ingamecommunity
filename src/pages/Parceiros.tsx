import SiteLayout from "@/components/SiteLayout";
import SectionDivider from "@/components/SectionDivider";
import HeroCoverWall from "@/components/HeroCoverWall";
import HeroParticles from "@/components/HeroParticles";
import { useParceiros } from "@/hooks/useParceiros";

const Parceiros = () => {
  const { parceiros, loading } = useParceiros();

  return (
    <SiteLayout
      title="Parceiros — In Game"
      description="Conheça os parceiros da comunidade In Game que apoiam a cena indie."
    >
      {/* Wrapper único: jogos passando + partículas como fundo contínuo */}
      <div className="relative">
        <div className="absolute inset-0 pointer-events-none">
          <HeroCoverWall />
        </div>
        <HeroParticles />

        {/* Hero */}
        <section className="relative z-10 min-h-[55vh] flex items-center justify-center pt-32 pb-16 px-4">
          <div className="text-center animate-fade-up">
            <p className="text-primary-glow uppercase tracking-[0.3em] text-xs font-bold mb-3">
              Quem caminha junto
            </p>
            <h1 className="text-5xl md:text-7xl font-black mb-5">
              Parc<span className="text-gradient">eiros</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Desenvolvedores e Comunidades que acreditaram na In Game.
            </p>
          </div>
        </section>

        <SectionDivider />

        {/* Grid de parceiros — mesmo fundo contínuo */}
        <section className="relative z-10 py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            {loading && (
              <p className="text-center text-muted-foreground animate-pulse">Carregando parceiros...</p>
            )}

            {!loading && parceiros.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8">
                {parceiros.map((p, i) => {
                  const card = (
                    <div
                      className="group relative flex flex-col items-center text-center p-5 rounded-2xl border border-primary/30 bg-background/40 backdrop-blur-md shadow-[0_0_25px_hsl(var(--primary)/0.15)] hover:border-primary-glow hover:shadow-[0_0_35px_hsl(var(--primary-glow)/0.55)] hover:-translate-y-1 transition-all duration-500"
                    >
                      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-primary/0 via-primary/0 to-primary-glow/0 group-hover:from-primary/20 group-hover:to-primary-glow/30 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />

                      <div className="relative mb-4">
                        <div className="absolute inset-0 rounded-full bg-primary/40 blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            loading="lazy"
                            className="relative w-24 h-24 md:w-28 md:h-28 object-cover rounded-full border-2 border-primary-glow/70 shadow-[0_0_20px_hsl(var(--primary-glow)/0.6)] group-hover:scale-110 group-hover:rotate-[2deg] transition-transform duration-500"
                            draggable={false}
                          />
                        ) : (
                          <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-primary/20 border-2 border-primary-glow/70 flex items-center justify-center text-3xl font-black text-primary-glow shadow-[0_0_20px_hsl(var(--primary-glow)/0.6)] group-hover:scale-110 transition-transform duration-500">
                            {p.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <h3 className="font-black text-base md:text-lg text-foreground group-hover:text-primary-glow transition-colors">
                        {p.name}
                      </h3>
                      {p.description && (
                        <p className="mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                          {p.description}
                        </p>
                      )}
                    </div>
                  );

                  return (
                    <div
                      key={p.id}
                      className="animate-fade-up"
                      style={{ animationDelay: `${i * 0.08}s` }}
                    >
                      {p.link ? (
                        <a href={p.link} target="_blank" rel="noopener noreferrer" className="block">
                          {card}
                        </a>
                      ) : (
                        card
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      <SectionDivider />

      {/* Grid de parceiros — fundo continua com jogos passando + partículas */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-50 pointer-events-none">
          <HeroCoverWall />
        </div>
        <HeroParticles />

        <div className="relative z-10 container mx-auto max-w-6xl">
          {loading && (
            <p className="text-center text-muted-foreground animate-pulse">Carregando parceiros...</p>
          )}


          {!loading && parceiros.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8">
              {parceiros.map((p, i) => {
                const card = (
                  <div
                    className="group relative flex flex-col items-center text-center p-5 rounded-2xl border border-primary/30 bg-background/40 backdrop-blur-md shadow-[0_0_25px_hsl(var(--primary)/0.15)] hover:border-primary-glow hover:shadow-[0_0_35px_hsl(var(--primary-glow)/0.55)] hover:-translate-y-1 transition-all duration-500"
                  >
                    {/* halo */}
                    <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-primary/0 via-primary/0 to-primary-glow/0 group-hover:from-primary/20 group-hover:to-primary-glow/30 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />

                    <div className="relative mb-4">
                      <div className="absolute inset-0 rounded-full bg-primary/40 blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          loading="lazy"
                          className="relative w-24 h-24 md:w-28 md:h-28 object-cover rounded-full border-2 border-primary-glow/70 shadow-[0_0_20px_hsl(var(--primary-glow)/0.6)] group-hover:scale-110 group-hover:rotate-[2deg] transition-transform duration-500"
                          draggable={false}
                        />
                      ) : (
                        <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-primary/20 border-2 border-primary-glow/70 flex items-center justify-center text-3xl font-black text-primary-glow shadow-[0_0_20px_hsl(var(--primary-glow)/0.6)] group-hover:scale-110 transition-transform duration-500">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <h3 className="font-black text-base md:text-lg text-foreground group-hover:text-primary-glow transition-colors">
                      {p.name}
                    </h3>
                    {p.description && (
                      <p className="mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                        {p.description}
                      </p>
                    )}
                  </div>
                );

                return (
                  <div
                    key={p.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    {p.link ? (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        {card}
                      </a>
                    ) : (
                      card
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
};

export default Parceiros;
