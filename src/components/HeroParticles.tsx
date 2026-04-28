import { useMemo } from "react";

/**
 * Floating particles + abstract indie icons drifting over the hero.
 * Pure CSS animation, deterministic positions (no hydration jumps).
 */

const ICONS = [
  // Ghost
  (
    <svg key="g" viewBox="0 0 32 32" fill="currentColor" className="w-full h-full">
      <path d="M16 3C9.4 3 5 8 5 14v14l3-3 3 3 3-3 3 3 3-3 3 3 3-3V14C26 8 22.6 3 16 3z" />
      <circle cx="12" cy="13" r="2" fill="hsl(var(--background))" />
      <circle cx="20" cy="13" r="2" fill="hsl(var(--background))" />
    </svg>
  ),
  // Controller
  (
    <svg key="c" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
      <path d="M8 12 C4 12 3 16 3 19 C3 24 5 26 8 26 C10 26 11 24 13 24 H19 C21 24 22 26 24 26 C27 26 29 24 29 19 C29 16 28 12 24 12 H8z" />
      <path d="M8 18 H12 M10 16 V20" />
      <circle cx="20" cy="17" r="1.3" fill="currentColor" />
      <circle cx="23" cy="20" r="1.3" fill="currentColor" />
    </svg>
  ),
  // Sparkle / 4-point star
  (
    <svg key="s" viewBox="0 0 32 32" fill="currentColor" className="w-full h-full">
      <path d="M16 2 L18.5 13.5 L30 16 L18.5 18.5 L16 30 L13.5 18.5 L2 16 L13.5 13.5 Z" />
    </svg>
  ),
  // Pixel cluster
  (
    <svg key="p" viewBox="0 0 32 32" fill="currentColor" className="w-full h-full">
      <rect x="4" y="4" width="6" height="6" />
      <rect x="13" y="9" width="6" height="6" />
      <rect x="22" y="4" width="6" height="6" />
      <rect x="9" y="18" width="6" height="6" />
      <rect x="20" y="20" width="6" height="6" />
    </svg>
  ),
  // Diamond
  (
    <svg key="d" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" className="w-full h-full">
      <path d="M16 3 L29 14 L16 29 L3 14 Z" />
      <path d="M3 14 H29 M16 3 L11 14 L16 29 M16 3 L21 14 L16 29" />
    </svg>
  ),
  // Pixel heart
  (
    <svg key="h" viewBox="0 0 32 32" fill="currentColor" className="w-full h-full">
      <path d="M6 8h4v4H6zM10 12h4v4h-4zM14 16h4v4h-4zM18 12h4v4h-4zM22 8h4v4h-4zM6 12h4v4H6zM22 12h4v4h-4zM10 16h4v4h-4zM18 16h4v4h-4zM14 20h4v4h-4z" />
    </svg>
  ),
];

interface FloatItem {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  iconIdx: number;
  hue: number;
  rotate: number;
}

const HeroParticles = () => {
  const dots: FloatItem[] = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        left: (i * 11.37) % 100,
        top: (i * 17.91) % 100,
        size: 2 + ((i * 7) % 5),
        delay: (i * 0.37) % 6,
        duration: 7 + ((i * 1.3) % 6),
        drift: (i % 2 === 0 ? 1 : -1) * (8 + ((i * 3) % 14)),
        iconIdx: 0,
        hue: (i % 3) / 2,
        rotate: 0,
      })),
    []
  );

  const icons: FloatItem[] = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        left: 5 + ((i * 19) % 85),
        top: 8 + ((i * 23) % 75),
        size: 22 + ((i * 5) % 26),
        delay: (i * 0.7) % 7,
        duration: 11 + ((i * 1.9) % 9),
        drift: (i % 2 === 0 ? 1 : -1) * (15 + ((i * 4) % 20)),
        iconIdx: i % ICONS.length,
        hue: i % 2,
        rotate: ((i * 37) % 360) - 180,
      })),
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-[6]" aria-hidden>
      {dots.map((d, i) => (
        <span
          key={`d-${i}`}
          className="absolute rounded-full animate-particle-drift"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: `${d.size}px`,
            height: `${d.size}px`,
            background: d.hue > 0.5 ? "hsl(var(--primary-glow))" : "hsl(var(--primary))",
            boxShadow: `0 0 ${d.size * 3}px hsl(var(--primary-glow) / 0.85)`,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
            // @ts-expect-error custom CSS var
            "--drift": `${d.drift}px`,
            opacity: 0.55,
          }}
        />
      ))}

      {icons.map((it, i) => (
        <span
          key={`i-${i}`}
          className="absolute animate-icon-float"
          style={{
            left: `${it.left}%`,
            top: `${it.top}%`,
            width: `${it.size}px`,
            height: `${it.size}px`,
            color: it.hue ? "hsl(var(--primary-glow) / 0.55)" : "hsl(var(--primary) / 0.5)",
            filter: "drop-shadow(0 0 8px hsl(var(--primary-glow) / 0.55))",
            animationDelay: `${it.delay}s`,
            animationDuration: `${it.duration}s`,
            // @ts-expect-error custom CSS var
            "--drift": `${it.drift}px`,
            "--rot": `${it.rotate}deg`,
          }}
        >
          {ICONS[it.iconIdx]}
        </span>
      ))}
    </div>
  );
};

export default HeroParticles;
