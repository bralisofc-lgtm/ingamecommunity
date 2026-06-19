import { useEffect, useMemo, useState } from "react";
import { Calendar, ExternalLink, Gift, Sparkles } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { useSorteios, type Sorteio } from "@/hooks/useSorteios";

const formatDate = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const pad2 = (n: number) => String(Math.max(0, n)).padStart(2, "0");

const useCountdown = (target: string | null) => {
  const targetTs = useMemo(() => (target ? new Date(target).getTime() : null), [target]);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!targetTs) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [targetTs]);

  if (!targetTs) return null;
  const diff = Math.max(0, targetTs - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { diff, days, hours, minutes, seconds, ended: diff === 0 };
};

const TimerCell = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center">
    <div className="relative min-w-[68px] md:min-w-[88px] px-3 md:px-4 py-3 md:py-4 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/15 shadow-[0_0_30px_-8px_hsl(var(--primary-glow)/0.55)] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-primary/10 pointer-events-none" />
      <div
        key={value}
        className="relative text-3xl md:text-5xl font-extrabold tracking-tight tabular-nums text-white animate-fade-in"
      >
        {pad2(value)}
      </div>
    </div>
    <span className="mt-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-white/60">
      {label}
    </span>
  </div>
);

const HeroSorteio = ({ s }: { s: Sorteio }) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 50);
    return () => clearTimeout(t);
  }, []);

  const countdown = useCountdown(s.end_date);

  return (
    <section className="relative w-screen left-1/2 -translate-x-1/2 h-[100vh] min-h-[640px] overflow-hidden -mt-px">
      {/* Desktop / Tablet banner */}
      {s.banner_image && (
        <div
          className={`absolute inset-0 bg-center bg-cover transition-all duration-[1400ms] ease-out hidden md:block ${
            loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
          style={{ backgroundImage: `url(${s.banner_image})` }}
          aria-hidden
        />
      )}
      {/* Mobile banner */}
      {(s.banner_image_mobile || s.banner_image) && (
        <div
          className={`absolute inset-0 bg-center bg-cover transition-all duration-[1400ms] ease-out md:hidden ${
            loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
          style={{ backgroundImage: `url(${s.banner_image_mobile || s.banner_image})` }}
          aria-hidden
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/20 to-background/60" aria-hidden />
      <div className="absolute inset-0 pointer-events-none [box-shadow:inset_0_0_180px_60px_hsl(var(--background))]" aria-hidden />
      <div className="absolute -top-40 -right-40 w-[60vw] h-[60vw] rounded-full bg-primary-glow/15 blur-3xl pointer-events-none" aria-hidden />
      <div className="absolute -bottom-40 -left-40 w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-3xl pointer-events-none" aria-hidden />

      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 md:px-8">
          <div
            className={`max-w-2xl transition-all duration-1000 ease-out ${
              loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {/* Premium Sorteio do Mês badge */}
            <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 overflow-hidden border border-purple-300/40 bg-gradient-to-r from-purple-700/60 via-purple-500/50 to-fuchsia-600/60 backdrop-blur-md shadow-[0_0_28px_-4px_hsl(280_90%_65%/0.55)]">
              <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
                <span className="absolute top-0 -left-1/2 h-full w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shine_3.5s_ease-in-out_infinite] skew-x-12" />
              </span>
              <Gift className="w-4 h-4 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)] relative z-10" />
              <span className="relative z-10 text-[11px] md:text-xs font-extrabold uppercase tracking-[0.32em] text-white">
                Sorteio do Mês
              </span>
            </div>


            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5 leading-[1.1] drop-shadow-[0_4px_30px_hsl(var(--background))]">
              {s.title || "Sorteio em andamento"}
            </h1>

            {s.event_date && (
              <div className="flex items-center gap-2 text-sm md:text-base text-foreground/80 mb-6">
                <Calendar className="w-4 h-4 text-primary-glow" />
                <span>
                  Sorteio em{" "}
                  <span className="font-semibold text-foreground">
                    {formatDate(s.event_date)}
                  </span>
                </span>
              </div>
            )}

            {countdown && !countdown.ended && (
              <div className="mb-8 animate-fade-in">
                <p className="text-[10px] md:text-xs uppercase tracking-[0.32em] text-white/60 font-bold mb-3">
                  O sorteio termina em
                </p>
                <div className="flex items-start gap-2 md:gap-4">
                  <TimerCell value={countdown.days} label="Dias" />
                  <TimerCell value={countdown.hours} label="Horas" />
                  <TimerCell value={countdown.minutes} label="Minutos" />
                  <TimerCell value={countdown.seconds} label="Seg" />
                </div>
              </div>
            )}
            {countdown?.ended && (
              <div className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-400/50 backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.3em] text-red-200">
                Sorteio encerrado
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
                    className={`group block relative overflow-hidden rounded-[1.5rem] border border-border/60 bg-background/60 backdrop-blur-sm shadow-[0_0_40px_-12px_hsl(var(--primary-glow)/0.25)] hover:shadow-[0_0_60px_-8px_hsl(var(--primary-glow)/0.45)] ${
                      hasLink
                        ? "cursor-pointer hover:border-primary-glow/50 hover:-translate-y-1 transition-all duration-500"
                        : ""
                    }`}
                  >
                    <div className="relative w-full overflow-hidden rounded-[1.5rem] bg-black/20 max-h-[300px] md:max-h-[340px]">
                      {/* Desktop/Tablet banner — mostra imagem inteira */}
                      {s.banner_image ? (
                        <img
                          src={s.banner_image}
                          alt={s.title || "Sorteio realizado"}
                          loading="lazy"
                          className="hidden md:block w-full h-full object-contain scale-[1.02] transition-transform duration-700 group-hover:scale-[1.06]"
                        />
                      ) : (
                        <div className="hidden md:block w-full h-full bg-gradient-to-br from-primary/30 via-background to-primary/10" />
                      )}
                      {/* Mobile banner */}
                      {(s.banner_image_mobile || s.banner_image) ? (
                        <img
                          src={s.banner_image_mobile || s.banner_image}
                          alt={s.title || "Sorteio realizado"}
                          loading="lazy"
                          className="md:hidden w-full h-full object-cover scale-[1.02] transition-transform duration-700 group-hover:scale-[1.12]"
                        />
                      ) : (
                        <div className="md:hidden w-full h-full bg-gradient-to-br from-primary/30 via-background to-primary/10" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-95 md:opacity-60" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-primary/15 via-transparent to-primary-glow/15" />
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
