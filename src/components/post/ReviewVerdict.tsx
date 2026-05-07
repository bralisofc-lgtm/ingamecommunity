import ReviewBadge from "./ReviewBadge";

interface TechItem { key: string; label: string }
const TECH_FIELDS: TechItem[] = [
  { key: "publisher", label: "Publisher" },
  { key: "developer", label: "Desenvolvedora" },
  { key: "platforms", label: "Plataformas" },
  { key: "release_date", label: "Lançamento" },
  { key: "play_time", label: "Tempo jogado" },
  { key: "category", label: "Categoria" },
  { key: "status", label: "Status" },
  { key: "engine", label: "Engine" },
  { key: "mode", label: "Modo" },
];

interface Props {
  grade?: string;
  note?: string;
  summary?: string;
  gameName?: string;
  techInfo?: Record<string, string>;
}

const isNeg = (g: string) => /-$/.test(g) || /^D/i.test(g);

const GradeLetter = ({ grade }: { grade: string }) => {
  const g = grade.trim().toUpperCase();
  const negative = isNeg(g);
  const tier = g[0];
  let fillClass = "review-fill-up review-fill-purple";
  let textGlowClass = "text-primary-glow";
  if (/^D/.test(g)) {
    fillClass = "review-fill-down review-fill-red-strong";
    textGlowClass = "text-[hsl(0_90%_65%)]";
  } else if (negative) {
    fillClass = "review-fill-down review-fill-red";
    textGlowClass = "text-[hsl(0_85%_68%)]";
  } else if (tier === "S") fillClass = "review-fill-up review-fill-purple-strong";
  else if (tier === "A") fillClass = "review-fill-up review-fill-purple";
  else if (tier === "B") fillClass = "review-fill-up review-fill-purple-soft";
  else fillClass = "review-fill-up review-fill-purple-cool";

  return (
    <div
      className={`relative font-black tracking-tight leading-none select-none ${textGlowClass}`}
      style={{ fontSize: "clamp(4.5rem, 18vw, 7.5rem)" }}
    >
      <span className="relative inline-block">
        <span className="block opacity-30">{g}</span>
        <span
          aria-hidden
          className={`absolute inset-0 block ${fillClass}`}
          style={{ WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}
        >
          {g}
        </span>
      </span>
    </div>
  );
};

const ReviewVerdict = ({ grade, note, summary, gameName, techInfo }: Props) => {
  if (!grade && !summary && !gameName && !techInfo) return null;
  const techEntries = TECH_FIELDS.filter((f) => (techInfo?.[f.key] || "").trim().length > 0);
  const verdictText = (note || summary || "").trim();

  return (
    <section className="relative my-10" aria-label="Nota final da review">
      {/* bloco externo com borda arredondada e tag flutuante */}
      <div className="relative rounded-[28px] border border-primary/35 bg-[hsl(270_50%_7%)] shadow-[0_30px_80px_-30px_hsl(var(--primary)/0.7)] px-4 sm:px-6 md:px-8 pt-10 pb-6 md:pt-12 md:pb-8">
        {/* Tag NOTA FINAL no canto superior direito, fora do card interno */}
        <div className="absolute -top-3 right-5 md:right-7 flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-primary-glow/70 shadow-[0_0_18px_hsl(var(--primary-glow)/0.55)]">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-glow shadow-[0_0_8px_hsl(var(--primary-glow))]" />
          <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-primary-glow">
            Nota Final
          </span>
        </div>

        {gameName && (
          <h3 className="text-xl md:text-2xl font-black tracking-tight text-white mb-5">
            {gameName}
          </h3>
        )}

        {/* Card interno: letra + texto */}
        {(grade || verdictText) && (
          <div className="rounded-2xl bg-black/50 border border-white/5 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-stretch">
              {grade && (
                <div className="shrink-0 flex items-center justify-center px-8 py-8 sm:py-10 sm:w-52 border-b sm:border-b-0 sm:border-r border-white/5 bg-black/40">
                  <GradeLetter grade={grade} />
                </div>
              )}
              <div className="flex-1 px-5 sm:px-7 py-6 sm:py-8 flex flex-col justify-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-glow mb-3">
                  Nota Final
                </p>
                <p className="text-[15px] md:text-base text-white/90 leading-relaxed">
                  {verdictText || "Confira a nota completa desta análise."}
                </p>
              </div>
            </div>
          </div>
        )}

        {summary && verdictText !== summary && (
          <p className="mt-6 text-sm md:text-base text-white/80 leading-relaxed italic">
            {summary}
          </p>
        )}

        {techEntries.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-glow mb-4">
              Ficha técnica
            </p>
            <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
              {techEntries.map((f) => (
                <div key={f.key} className="border-l-2 border-primary/40 pl-3">
                  <dt className="text-[10px] font-bold uppercase tracking-widest text-primary-glow/80">{f.label}</dt>
                  <dd className="text-sm md:text-base text-white/90 font-medium mt-0.5">{techInfo?.[f.key]}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewVerdict;
