import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Particle {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  type: "dot" | "pixel";
}

const ParticlesBackground = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setParticles([]);
      return;
    }
    const count = 12;
    const arr: Particle[] = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 4 + Math.random() * 8,
      duration: 18 + Math.random() * 18,
      delay: Math.random() * 20,
      type: Math.random() > 0.5 ? "pixel" : "dot",
    }));
    setParticles(arr);
  }, [isMobile]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-animated opacity-60" />

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-float-up"
          style={{
            left: `${p.left}%`,
            bottom: "-10vh",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.type === "dot" && (
            <div
              className="rounded-full bg-primary-glow"
              style={{
                width: p.size,
                height: p.size,
                boxShadow: `0 0 ${p.size * 2}px hsl(var(--primary-glow) / 0.8)`,
                background: "hsl(var(--primary-glow))",
              }}
            />
          )}
          {p.type === "pixel" && (
            <div
              style={{
                width: p.size,
                height: p.size,
                background: "hsl(var(--accent))",
                boxShadow: `0 0 ${p.size}px hsl(var(--accent) / 0.7)`,
              }}
            />
          )}
          {p.type === "ghost" && (
            <svg width={p.size * 2.4} height={p.size * 2.4} viewBox="0 0 32 32" className="animate-ghost-bob">
              <path
                d="M16 4 C9 4 5 9 5 16 L5 27 L8 24 L11 27 L14 24 L17 27 L20 24 L23 27 L26 24 L26 16 C26 9 22 4 16 4 Z"
                fill="hsl(var(--foreground) / 0.85)"
                stroke="hsl(var(--primary-glow))"
                strokeWidth="1"
              />
              <circle cx="12" cy="14" r="1.6" fill="hsl(var(--primary-deep))" />
              <circle cx="20" cy="14" r="1.6" fill="hsl(var(--primary-deep))" />
            </svg>
          )}
        </div>
      ))}

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(var(--background))_100%)]" />
    </div>
  );
};

export default ParticlesBackground;
