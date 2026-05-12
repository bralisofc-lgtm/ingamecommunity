import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type Phase = "idle" | "covering" | "switch" | "revealing";

interface Ctx {
  trigger: (onMidpoint: () => void) => Promise<void>;
  phase: Phase;
}

const DimensionContext = createContext<Ctx | null>(null);

/**
 * Cinematic transition: organic horizontal stripes sweep across the screen,
 * cover the UI, fire a callback at the midpoint (e.g. navigate), and then
 * reveal the new content.
 *
 * Total duration ~1800ms (cover 900 + reveal 900).
 */
export const DimensionTransitionProvider = ({ children }: { children: React.ReactNode }) => {
  const [phase, setPhase] = useState<Phase>("idle");
  const busy = useRef(false);

  const trigger = useCallback((onMidpoint: () => void) => {
    return new Promise<void>((resolve) => {
      if (busy.current) {
        onMidpoint();
        resolve();
        return;
      }
      busy.current = true;
      setPhase("covering");
      // Mid-point: swap content under the curtain
      window.setTimeout(() => {
        onMidpoint();
        setPhase("switch");
        // After tiny tick, reveal
        window.setTimeout(() => {
          setPhase("revealing");
          window.setTimeout(() => {
            setPhase("idle");
            busy.current = false;
            resolve();
          }, 1000);
        }, 60);
      }, 900);
    });
  }, []);

  // lock scroll while transitioning
  useEffect(() => {
    if (phase !== "idle") {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [phase]);

  const visible = phase !== "idle";

  return (
    <DimensionContext.Provider value={{ trigger, phase }}>
      {children}
      <div
        aria-hidden
        className={`fixed inset-0 z-[200] pointer-events-none ${visible ? "" : "hidden"}`}
      >
        {/* Backdrop blur to deepen the dimensional shift */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            phase === "covering" || phase === "switch" ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "radial-gradient(ellipse at center, hsl(270 60% 4% / 0.35), hsl(270 80% 2% / 0.85))",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        />

        {/* Organic stripes */}
        <div className="absolute inset-0 overflow-hidden">
          {STRIPES.map((s, i) => (
            <span
              key={i}
              className={`dim-stripe ${
                phase === "covering"
                  ? "dim-stripe-in"
                  : phase === "switch"
                    ? "dim-stripe-hold"
                    : phase === "revealing"
                      ? "dim-stripe-out"
                      : ""
              }`}
              style={{
                top: s.top,
                height: s.height,
                background: s.bg,
                filter: `blur(${s.blur}px)`,
                animationDelay: `${s.delay}ms`,
                animationDuration: `${s.duration}ms`,
                opacity: s.opacity,
              }}
            />
          ))}
        </div>
      </div>
    </DimensionContext.Provider>
  );
};

const STRIPES = [
  { top: "-10%", height: "28vh", bg: "linear-gradient(90deg, hsl(280 90% 60%/0.0), hsl(280 90% 60%/0.9), hsl(190 100% 60%/0.9), hsl(280 90% 60%/0.0))", blur: 28, delay: 0, duration: 900, opacity: 0.95 },
  { top: "12%", height: "22vh", bg: "linear-gradient(90deg, hsl(190 100% 55%/0.0), hsl(280 100% 65%/0.85), hsl(310 100% 65%/0.85), hsl(190 100% 55%/0.0))", blur: 22, delay: 90, duration: 950, opacity: 0.9 },
  { top: "32%", height: "32vh", bg: "linear-gradient(90deg, hsl(260 90% 30%/0.0), hsl(260 90% 30%/0.95), hsl(285 100% 60%/0.95), hsl(260 90% 30%/0.0))", blur: 36, delay: 60, duration: 1000, opacity: 1 },
  { top: "52%", height: "20vh", bg: "linear-gradient(90deg, hsl(310 100% 60%/0.0), hsl(310 100% 60%/0.9), hsl(200 100% 60%/0.9), hsl(310 100% 60%/0.0))", blur: 20, delay: 150, duration: 900, opacity: 0.9 },
  { top: "70%", height: "26vh", bg: "linear-gradient(90deg, hsl(270 80% 35%/0.0), hsl(270 80% 35%/0.95), hsl(290 100% 60%/0.95), hsl(270 80% 35%/0.0))", blur: 30, delay: 30, duration: 950, opacity: 0.95 },
  { top: "88%", height: "24vh", bg: "linear-gradient(90deg, hsl(200 100% 55%/0.0), hsl(200 100% 55%/0.9), hsl(280 100% 65%/0.9), hsl(200 100% 55%/0.0))", blur: 26, delay: 120, duration: 900, opacity: 0.9 },
];

export const useDimensionTransition = () => {
  const ctx = useContext(DimensionContext);
  if (!ctx) throw new Error("useDimensionTransition outside provider");
  return ctx;
};
