import { useEffect, useState } from "react";
import { Calendar, ExternalLink, Gift, Sparkles } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { useSorteios, type Sorteio } from "@/hooks/useSorteios";

const formatDate = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const HeroSorteio = ({ s }: { s: Sorteio }) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative w-screen left-1/2 -translate-x-1/2 h-[100vh] min-h-[640px] overflow-hidden -mt-px">
      {/* Background image */}
      {s.banner_image && (
        <div
          className={`absolute inset-0 bg-center bg-cover transition-all duration-[1400ms] ease-out ${
            loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
          style={{ backgroundImage: `url(${s.banner_image})` }}
          aria-hidden
        />
      )}

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/20 to-background/60" aria-hidden />
      <div className="absolute inset-0 pointer-events-none [box-shadow:inset_0_0_180px_60px_hsl(var(--background))]" aria-hidden />
      {/* Ambient glow */}
      <div className="absolute -top-40 -right-40 w-[60vw] h-[60vw] rounded-full bg-primary-glow/15 blur-3xl pointer-events-none" aria-hidden />
      <div className="absolute -bottom-40 -left-40 w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-3xl pointer-events-none" aria-hidden />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 md:px-8">
          <div
            className={`max-w-2xl transition-all duration-1000 ease-out ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 backdrop-blur-md mb-5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-200">
                Sorteio ativo
              </span>
            </div>

            <p className="text-xs uppercase tracking-[0.4em] text-primary-glow font-bold mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> Em destaque
            </p>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-5 leading-[1.05] drop-shadow-[0_4px_30px_hsl(var(--background))]">
              {s.title || "Sorteio em andamento"}
            </h1>

            {s.event_date && (
              <div className="flex items-center gap-2 text-sm md:text-base text-foreground/80 mb-8">
                <Calendar className="w-4 h-4 text-primary-glow" />
                <span>
                  Sorteio em{" "}
                  <span className="font-semibold text-foreground">
                    {formatDate(s.event_date)}
                  </span>
                </span>
              </div>
            )}

            {s.participate_link && (
              <a
                href={s.participate_link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 rounded-2xl bg-gradient-to-r from-primary via-primary-glow to-primary text-primary-foreground font-bold text-base md:text-lg tracking-wide uppercase shadow-[0_10px_50px_-10px_hsl(var(--primary-glow)/0.8)] hover:shadow-[0_18px_70px_-10px_hsl(var(--primary-glow))] hover:-translate-y-1 transition-all duration-500 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                <Gift className="w-5 h-5 md:w-6 md:h-6 relative z-10" />
                <span className="relative z-10">Participar Agora</span>
                <ExternalLink className="w-4 h-4 md:w-5 md:h-5 relative z-10 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-foreground/50 animate-pulse">
        <span>Sorteios anteriores</span>
        <span className="w-px h-8 bg-gradient-to-b from-foreground/50 to-transparent" />
      </div>
    </section>
  );
};

const SorteiosRealizados = () => {
  const { sorteios, loading } = useSorteios({ onlyActive: true });
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    document.title = "Sorteios — In Game";
  }, []);

  const hero = sorteios.find((s) => s.status === "ativo") ?? null;
  const history = sorteios.filter((s) => s.id !== hero?.id);

  return (
    <SiteLayout>
      {hero && <HeroSorteio s={hero} />}

      <section className={hero ? "pt-20 pb-20" : "pt-32 pb-20"}>
        <div className="container mx-auto px-4">
          {!hero && (
            <header className="text-center max-w-2xl mx-auto mb-12 animate-fade-in">
              <p className="text-xs uppercase tracking-[0.4em] text-primary-glow font-bold mb-3">
                Histórico
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                Sorteios Realizados
              </h1>
              <p className="text-muted-foreground">
                Confira aqui todos os sorteios que já aconteceram na comunidade.
              </p>
            </header>
          )}

          {hero && history.length > 0 && (
            <header className="text-center max-w-2xl mx-auto mb-12 animate-fade-in">
              <p className="text-xs uppercase tracking-[0.4em] text-primary-glow font-bold mb-3">
                Histórico
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
                Sorteios Anteriores
              </h2>
              <p className="text-muted-foreground text-sm">
                Todos os sorteios já realizados pela comunidade.
              </p>
            </header>
          )}

          {loading && (
            <div className="space-y-8 max-w-6xl mx-auto">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="w-full rounded-3xl bg-secondary/40 animate-pulse"
                  style={{ aspectRatio: "16 / 5" }}
                />
              ))}
            </div>
          )}

          {!loading && sorteios.length === 0 && (
            <div className="max-w-xl mx-auto text-center py-20 px-6 rounded-3xl border border-dashed border-border/60 bg-background/40">
              <p className="text-muted-foreground">
                Nenhum sorteio cadastrado ainda. Volte em breve!
              </p>
            </div>
          )}

          <div className="space-y-10 max-w-6xl mx-auto">
            {history.map((s, i) => {
              const dateStr = formatDate(s.event_date);
              const hasLink = !!s.participate_link;
              const Wrapper: any = hasLink ? "a" : "div";
              const wrapperProps = hasLink
                ? {
                    href: s.participate_link,
                    target: "_blank",
                    rel: "noopener noreferrer",
                  }
                : {};
              return (
                <article
                  key={s.id}
                  style={{
                    transitionDelay: `${Math.min(i * 80, 400)}ms`,
                    transform: mounted ? "translateY(0)" : "translateY(24px)",
                    opacity: mounted ? 1 : 0,
                  }}
                  className="transition-all duration-700 ease-out"
                >
                  <Wrapper
                    {...wrapperProps}
                    className={`group block relative overflow-hidden rounded-3xl border border-border/60 bg-background/60 backdrop-blur-sm shadow-[0_8px_40px_-12px_hsl(var(--primary)/0.25)] ${
                      hasLink
                        ? "cursor-pointer hover:border-primary-glow hover:shadow-[0_18px_60px_-12px_hsl(var(--primary-glow)/0.55)] hover:-translate-y-1 transition-all duration-500"
                        : ""
                    }`}
                  >
                    <div className="relative w-full overflow-hidden aspect-[1400/300]">
                      {s.banner_image ? (
                        <img
                          src={s.banner_image}
                          alt={s.title || "Sorteio realizado"}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/30 via-background to-primary/10" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/20 to-transparent opacity-90" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-primary/15 via-transparent to-primary-glow/15" />
                      <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-red-500/20 border border-red-400/50 backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.2em] text-red-200">
                        Realizado
                      </div>
                      {hasLink && (
                        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-md border border-primary-glow/40 text-[10px] uppercase tracking-widest font-bold text-primary-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <ExternalLink className="w-3 h-3" />
                          Ver resultado
                        </div>
                      )}
                    </div>
                  </Wrapper>

                  <div className="mt-4 flex items-center justify-between gap-3 px-1">
                    <div className="flex items-center gap-2 text-sm text-foreground/80">
                      <Calendar className="w-4 h-4 text-primary-glow" />
                      <span>
                        Sorteio realizado dia{" "}
                        <span className="font-semibold text-foreground">
                          {dateStr || "—"}
                        </span>
                      </span>
                    </div>
                    {s.title && (
                      <span className="text-xs uppercase tracking-widest text-muted-foreground truncate max-w-[40%]">
                        {s.title}
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default SorteiosRealizados;
