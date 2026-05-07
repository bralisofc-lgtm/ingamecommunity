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

const ReviewVerdict = ({ grade, note, summary, gameName, techInfo }: Props) => {
  if (!grade && !summary && !gameName && !techInfo) return null;
  const techEntries = TECH_FIELDS.filter((f) => (techInfo?.[f.key] || "").trim().length > 0);

  return (
    <section
      className="relative my-14 overflow-hidden rounded-3xl border border-primary/40 shadow-[0_30px_80px_-30px_hsl(var(--primary)/0.7)]"
      aria-label="Veredicto da review"
    >
      {/* Fundo roxo premium */}
      <div className="absolute inset-0 bg-[hsl(270_55%_9%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary-glow)/0.25),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(var(--primary-deep)/0.35),transparent_60%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-glow/70 to-transparent" />

      <div className="relative p-6 md:p-10">
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-block w-2 h-2 rounded-full bg-primary-glow shadow-[0_0_10px_hsl(var(--primary-glow))]" />
          <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.35em] text-primary-glow">Veredicto final</p>
          <div className="flex-1 h-px bg-gradient-to-r from-primary-glow/40 to-transparent" />
        </div>

        {summary && (
          <p className="text-base md:text-lg text-white/90 leading-relaxed mb-6 italic">
            {summary}
          </p>
        )}

        {gameName && (
          <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white mb-6">
            {gameName}
          </h3>
        )}

        {grade && <ReviewBadge grade={grade} note={note} />}

        {techEntries.length > 0 && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-glow mb-4">Ficha técnica</p>
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
