import { useEffect, useState } from "react";
import { Calendar, ExternalLink } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { useSorteios } from "@/hooks/useSorteios";

const formatDate = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const SorteiosRealizados = () => {
  const { sorteios, loading } = useSorteios({ onlyActive: true });
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    document.title = "Sorteios Realizados — In Game";
  }, []);

  return (
    <SiteLayout>
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4">
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
                Nenhum sorteio realizado ainda. Volte em breve!
              </p>
            </div>
          )}

          <div className="space-y-10 max-w-6xl mx-auto">
            {sorteios.map((s, i) => {
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
                    <div className="relative w-full overflow-hidden" style={{ aspectRatio: "auto" }}>
                      {s.banner_image ? (
                        <img
                          src={s.banner_image}
                          alt={s.title || "Sorteio realizado"}
                          loading="lazy"
                          className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/30 via-background to-primary/10" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/20 to-transparent opacity-90" />
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
