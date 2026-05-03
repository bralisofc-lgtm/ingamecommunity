import { useEffect, useState } from "react";
import { useDevicePerf } from "@/hooks/useDevicePerf";

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
  const { tier, scale } = useDevicePerf();

  useEffect(() => {
    if (tier === "low") {
      setParticles([]);
      return;
    }
    const count = Math.max(4, Math.round(20 * scale));
    const arr: Particle[] = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 4 + Math.random() * 8,
      duration: 18 + Math.random() * 18,
      delay: Math.random() * 20,
      type: Math.random() > 0.5 ? "pixel" : "dot",
    }));
    setParticles(arr);
  }, [tier, scale]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Static gradient overlay (lighter on perf) */}
      <div className="absolute inset-0 opacity-50" style={{ background: "linear-gradient(135deg, hsl(270 80% 8%), hsl(280 70% 14%), hsl(265 90% 6%))" }} />

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
        </div>
      ))}

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(var(--background))_100%)]" />
    </div>
  );
};

export default ParticlesBackground;
