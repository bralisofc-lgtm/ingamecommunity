/**
 * RunnerCharacter — personagem desenhado em SVG inspirado em Hollow Knight.
 * Animado por CSS: pernas alternam o passo, capa balança, cabeça oscila.
 * As cores podem ser ajustadas via props para combinar com a skin do loader.
 */
type Props = {
  size?: number;
  bodyColor?: string;     // corpo (capa/cabeça escura)
  accentColor?: string;   // detalhes (chifres, olhos vazados)
  glow?: string;          // halo
  speedMs?: number;       // velocidade da corrida (mais baixo = mais rápido)
  className?: string;
};

const RunnerCharacter = ({
  size = 64,
  bodyColor = "hsl(0 0% 8%)",
  accentColor = "hsl(0 0% 96%)",
  glow = "hsl(280 95% 70%)",
  speedMs = 320,
  className = "",
}: Props) => {
  // Garantimos um id único para evitar colisões caso múltiplas instâncias coexistam
  const uid = `rc-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{
        width: size,
        height: size,
        // Variáveis consumidas pelos keyframes
        // @ts-expect-error CSS vars
        "--rc-speed": `${speedMs}ms`,
        "--rc-glow": glow,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: `drop-shadow(0 4px 10px ${glow})`,
          overflow: "visible",
        }}
      >
        {/* CAPA (atrás) — balança levemente */}
        <g className={`${uid}-cape`} style={{ transformOrigin: "50px 38px" }}>
          <path
            d="M28 38 Q22 60 30 78 L40 70 Q38 55 40 42 Z"
            fill={bodyColor}
            opacity="0.95"
          />
          <path
            d="M72 38 Q78 60 70 78 L60 70 Q62 55 60 42 Z"
            fill={bodyColor}
            opacity="0.95"
          />
        </g>

        {/* CORPO + CABEÇA — oscila no ritmo do passo */}
        <g className={`${uid}-body`} style={{ transformOrigin: "50px 60px" }}>
          {/* Tronco */}
          <path
            d="M38 48 Q36 64 40 76 L60 76 Q64 64 62 48 Z"
            fill={bodyColor}
          />

          {/* Cabeça (formato característico — Vessel) */}
          <g>
            {/* máscara/cabeça */}
            <path
              d="M34 32 Q34 18 50 16 Q66 18 66 32 Q66 42 60 46 L40 46 Q34 42 34 32 Z"
              fill={accentColor}
            />
            {/* chifres */}
            <path
              d="M36 22 Q30 12 32 6 Q38 14 40 22 Z"
              fill={accentColor}
            />
            <path
              d="M64 22 Q70 12 68 6 Q62 14 60 22 Z"
              fill={accentColor}
            />
            {/* olhos vazados */}
            <ellipse cx="44" cy="32" rx="3" ry="5" fill={bodyColor} />
            <ellipse cx="56" cy="32" rx="3" ry="5" fill={bodyColor} />
          </g>

          {/* Capa frontal sobre os ombros */}
          <path
            d="M34 44 Q30 56 36 70 L48 60 L52 60 L64 70 Q70 56 66 44 Z"
            fill={bodyColor}
          />
        </g>

        {/* PERNAS — alternam o passo */}
        <g>
          <g
            className={`${uid}-leg-front`}
            style={{ transformOrigin: "46px 76px" }}
          >
            <rect x="42" y="76" width="8" height="14" rx="2" fill={bodyColor} />
            <ellipse cx="46" cy="92" rx="6" ry="2.5" fill={bodyColor} />
          </g>
          <g
            className={`${uid}-leg-back`}
            style={{ transformOrigin: "54px 76px" }}
          >
            <rect x="50" y="76" width="8" height="14" rx="2" fill={bodyColor} />
            <ellipse cx="54" cy="92" rx="6" ry="2.5" fill={bodyColor} />
          </g>
        </g>

        {/* BRAÇOS — pequeno balanço */}
        <g
          className={`${uid}-arm-front`}
          style={{ transformOrigin: "38px 54px" }}
        >
          <path
            d="M34 52 Q30 60 32 68 L36 68 Q38 60 40 54 Z"
            fill={bodyColor}
          />
        </g>
        <g
          className={`${uid}-arm-back`}
          style={{ transformOrigin: "62px 54px" }}
        >
          <path
            d="M66 52 Q70 60 68 68 L64 68 Q62 60 60 54 Z"
            fill={bodyColor}
          />
        </g>
      </svg>

      <style>{`
        .${uid}-leg-front {
          animation: ${uid}-step var(--rc-speed) ease-in-out infinite;
        }
        .${uid}-leg-back {
          animation: ${uid}-step var(--rc-speed) ease-in-out infinite reverse;
        }
        .${uid}-arm-front {
          animation: ${uid}-arm var(--rc-speed) ease-in-out infinite reverse;
        }
        .${uid}-arm-back {
          animation: ${uid}-arm var(--rc-speed) ease-in-out infinite;
        }
        .${uid}-body {
          animation: ${uid}-bob calc(var(--rc-speed) / 2) ease-in-out infinite;
        }
        .${uid}-cape {
          animation: ${uid}-cape calc(var(--rc-speed) * 1.4) ease-in-out infinite;
        }

        @keyframes ${uid}-step {
          0%   { transform: rotate(-35deg) translateY(-2px); }
          50%  { transform: rotate(35deg)  translateY(0); }
          100% { transform: rotate(-35deg) translateY(-2px); }
        }
        @keyframes ${uid}-arm {
          0%   { transform: rotate(-25deg); }
          50%  { transform: rotate(25deg); }
          100% { transform: rotate(-25deg); }
        }
        @keyframes ${uid}-bob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-2px); }
        }
        @keyframes ${uid}-cape {
          0%, 100% { transform: skewX(-3deg) translateX(-1px); }
          50%      { transform: skewX(3deg)  translateX(1px); }
        }
      `}</style>
    </div>
  );
};

export default RunnerCharacter;
