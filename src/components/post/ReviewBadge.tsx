interface Props {
  grade: string;
  note?: string;
}

/**
 * Selo de classificação para posts de Review.
 * O CARD em si é estático (sem fade-in / sem hover animado).
 * APENAS a letra/grade tem animação interna (carregando ↑ p/ notas altas, descarregando ↓ p/ negativas).
 */
const ReviewBadge = ({ grade, note }: Props) => {
  const g = (grade || "").trim().toUpperCase();
  if (!g) return null;

  const isNegative = /-$/.test(g) || /^D/.test(g);
  const isCritical = /^D/.test(g);
  const tier = g[0]; // S, A, B, C, D

  // animação interna da letra
  let fillClass = "";
  let textGlowClass = "text-primary-glow";
  if (isCritical) {
    fillClass = "review-fill-down review-fill-red-strong";
    textGlowClass = "text-[hsl(0_90%_65%)]";
  } else if (isNegative) {
    fillClass = "review-fill-down review-fill-red";
    textGlowClass = "text-[hsl(0_85%_68%)]";
  } else if (tier === "S") {
    fillClass = "review-fill-up review-fill-purple-strong";
  } else if (tier === "A") {
    fillClass = "review-fill-up review-fill-purple";
  } else if (tier === "B") {
    fillClass = "review-fill-up review-fill-purple-soft";
  } else {
    // C+, C
    fillClass = "review-fill-up review-fill-purple-cool";
  }

  const borderColor = isNegative
    ? "border-[hsl(0_70%_45%/0.6)] shadow-[0_0_30px_-5px_hsl(0_85%_55%/0.45)]"
    : "border-primary/40 shadow-[0_0_30px_-5px_hsl(var(--primary-glow)/0.5)]";

  return (
    <aside
      // SEM animações de entrada / hover no container
      className={`relative my-10 rounded-2xl border ${borderColor} bg-[hsl(270_45%_7%)] overflow-hidden`}
      aria-label={`Classificação da review: ${g}`}
    >
      <div className="flex flex-col md:flex-row items-stretch">
        {/* Selo da nota */}
        <div className="relative shrink-0 flex items-center justify-center px-8 py-8 md:py-10 md:w-56 border-b md:border-b-0 md:border-r border-white/5 bg-black/40">
          <div
            className={`relative font-black tracking-tight leading-none select-none ${textGlowClass}`}
            style={{ fontSize: "clamp(4.5rem, 14vw, 7rem)" }}
          >
            <span className="relative inline-block">
              {/* Letra base (contorno discreto) */}
              <span className="block opacity-30">{g}</span>
              {/* Camada animada — preenchimento sobe ou desce */}
              <span
                aria-hidden
                className={`absolute inset-0 block ${fillClass}`}
                style={{
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {g}
              </span>
            </span>
          </div>
        </div>

        {/* Texto explicativo */}
        <div className="flex-1 px-6 md:px-8 py-6 md:py-8 flex flex-col justify-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-glow mb-2">
            Nota Final
          </p>
          <p className="text-base md:text-lg text-white/90 leading-relaxed">
            {note?.trim() || "Confira a nota completa desta análise."}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default ReviewBadge;
