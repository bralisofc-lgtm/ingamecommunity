import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ingameLogo from "@/assets/ingame-logo.png";
import { useSorteios } from "@/hooks/useSorteios";
import { useDimensionTransition } from "@/components/DimensionTransition";
import SorteioCard from "@/components/sorteios/SorteioCard";
import NextSorteioHero from "@/components/sorteios/NextSorteioHero";

const PARTICLES = Array.from({ length: 22 }).map((_, i) => ({
  left: `${(i * 53) % 100}%`,
  top: `${(i * 37) % 100}%`,
  size: 2 + ((i * 7) % 4),
  delay: (i * 0.3) % 7,
  duration: 5 + ((i * 1.7) % 6),
}));

const Sorteios = () => {
  const { sorteios, loading, isRefreshing } = useSorteios();
  const { trigger } = useDimensionTransition();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.add("sorteios-route");
    return () => document.documentElement.classList.remove("sorteios-route");
  }, []);

  const active = useMemo(() => sorteios.filter((s) => s.active), [sorteios]);
  const featuredNext = useMemo(() => sorteios.find((s) => s.featured_next), [sorteios]);
  const recents = useMemo(
    () => active.filter((s) => !featuredNext || s.id !== featuredNext.id),
    [active, featuredNext],
  );

  const goHome = () => {
    trigger(() => navigate("/"));
  };

  return (
    <div className="sorteios-theme relative min-h-screen overflow-x-clip">
      <Helmet>
        <title>Sorteios — In Game</title>
        <meta
          name="description"
          content="Participe dos sorteios exclusivos da comunidade In Game. Chaves, brindes e oportunidades para nossos membros."
        />
      </Helmet>

      {/* Ambient particles */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="sorteios-particle"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
        <div
          className="absolute inset-x-0 top-0 h-[60vh]"
          style={{
            background:
              "radial-gradient(ellipse at top, hsl(285 100% 50% / 0.18), transparent 70%)",
          }}
        />
      </div>

      {/* Logo header */}
      <header className="relative pt-16 md:pt-24 pb-10 flex justify-center px-4 animate-fade-up">
        <div className="sorteios-logo-frame">
          <img src={ingameLogo} alt="In Game" className="h-12 md:h-16 w-auto" />
        </div>
      </header>

      <div className="text-center mb-12 md:mb-16 px-4 animate-fade-up">
        <p className="text-primary-glow uppercase tracking-[0.45em] text-[10px] md:text-xs font-bold mb-3">
          Experiência Exclusiva
        </p>
        <h1 className="text-4xl md:text-6xl font-black">
          <span className="bg-gradient-to-r from-primary-glow via-accent to-primary bg-clip-text text-transparent">
            Sorteios
          </span>
        </h1>
      </div>

      {/* Featured next */}
      {featuredNext && <NextSorteioHero sorteio={featuredNext} />}

      {/* Recent sorteios */}
      <section className="relative container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="mb-10 flex items-end justify-between flex-wrap gap-3">
          <div>
            <p className="text-primary-glow uppercase tracking-[0.4em] text-[10px] md:text-xs font-bold mb-2">
              Sorteios Recentes
            </p>
            <h2 className="text-3xl md:text-4xl font-black">Cada um, um lançamento.</h2>
          </div>
          {isRefreshing && recents.length > 0 && (
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
              atualizando...
            </span>
          )}
        </div>

        {loading && recents.length === 0 ? (
          <div className="space-y-8">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="refresh-shimmer w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl bg-muted/40 border border-border/40"
              />
            ))}
          </div>
        ) : recents.length === 0 ? (
          <p className="text-center py-20 text-muted-foreground">
            Nenhum sorteio ativo no momento. Volte em breve.
          </p>
        ) : (
          <div className="space-y-10 md:space-y-14">
            {recents.map((s, i) => (
              <SorteioCard key={s.id} sorteio={s} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* Back to home — black minimalist */}
      <section className="relative bg-black py-32 md:py-44 flex items-center justify-center">
        <button
          onClick={goHome}
          className="group relative px-10 py-5 rounded-full border border-white/20 text-white text-xs md:text-sm uppercase tracking-[0.4em] font-bold hover:border-white/60 transition-all duration-500 hover:tracking-[0.5em]"
        >
          <span className="relative z-10">Voltar à Página Inicial</span>
          <span
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background:
                "radial-gradient(circle at center, hsl(285 100% 60% / 0.35), transparent 70%)",
            }}
          />
        </button>
      </section>
    </div>
  );
};

export default Sorteios;
