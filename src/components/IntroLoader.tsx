import { useEffect, useState } from "react";
import character from "@/assets/loader-character.png";
import logo from "@/assets/ingame-logo.png";

type Phase = "loading" | "doors" | "logo" | "done";

const STORAGE_KEY = "ingame_intro_seen";

const IntroLoader = ({ onFinish }: { onFinish: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<Phase>("loading");

  // Progress bar
  useEffect(() => {
    if (phase !== "loading") return;
    let raf: number;
    const start = performance.now();
    const duration = 2800;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out
      const eased = 1 - Math.pow(1 - t, 2.2);
      setProgress(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setPhase("doors"), 350);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // Sequence: doors → logo → done
  useEffect(() => {
    if (phase === "doors") {
      const t = setTimeout(() => setPhase("logo"), 1100);
      return () => clearTimeout(t);
    }
    if (phase === "logo") {
      const t = setTimeout(() => setPhase("done"), 1600);
      return () => clearTimeout(t);
    }
    if (phase === "done") {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {}
      const t = setTimeout(onFinish, 700);
      return () => clearTimeout(t);
    }
  }, [phase, onFinish]);

  const doorsOpening = phase === "doors" || phase === "logo" || phase === "done";
  const fadingOut = phase === "done";

  return (
    <div
      className={`fixed inset-0 z-[9999] overflow-hidden bg-background transition-opacity duration-700 ${
        fadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vmin] h-[80vmin] rounded-full bg-primary/20 blur-[120px]" />
      </div>

      {/* DOORS */}
      <div className="absolute inset-0 flex pointer-events-none">
        <div
          className={`relative h-full w-1/2 bg-gradient-to-r from-background via-background to-[hsl(var(--primary)/0.08)] border-r-2 border-primary/40 transition-transform duration-[1100ms] ease-[cubic-bezier(0.83,0,0.17,1)] ${
            doorsOpening ? "-translate-x-full" : "translate-x-0"
          }`}
          style={{
            boxShadow: doorsOpening
              ? "20px 0 60px hsl(var(--primary) / 0.4)"
              : "inset -2px 0 30px hsl(var(--primary) / 0.25)",
          }}
        >
          {/* Door panel detail */}
          <div className="absolute inset-6 border border-primary/20 rounded-sm" />
          <div className="absolute inset-10 border border-primary/10 rounded-sm" />
          <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-primary-glow/60 to-transparent" />
        </div>
        <div
          className={`relative h-full w-1/2 bg-gradient-to-l from-background via-background to-[hsl(var(--primary)/0.08)] border-l-2 border-primary/40 transition-transform duration-[1100ms] ease-[cubic-bezier(0.83,0,0.17,1)] ${
            doorsOpening ? "translate-x-full" : "translate-x-0"
          }`}
          style={{
            boxShadow: doorsOpening
              ? "-20px 0 60px hsl(var(--primary) / 0.4)"
              : "inset 2px 0 30px hsl(var(--primary) / 0.25)",
          }}
        >
          <div className="absolute inset-6 border border-primary/20 rounded-sm" />
          <div className="absolute inset-10 border border-primary/10 rounded-sm" />
          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-primary-glow/60 to-transparent" />
        </div>
      </div>

      {/* LOADING CONTENT (character + bar) */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center px-6 transition-opacity duration-500 ${
          phase === "loading" ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="relative flex flex-col items-center">
          <img
            src={character}
            alt=""
            width={1024}
            height={1024}
            className="h-[52vh] max-h-[480px] w-auto object-contain drop-shadow-[0_20px_50px_hsl(var(--primary)/0.45)] animate-[float_3s_ease-in-out_infinite]"
            style={{ imageRendering: "auto" }}
          />

          <div className="mt-8 w-[min(420px,80vw)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] tracking-[0.4em] uppercase text-primary-glow font-bold">
                Carregando
              </span>
              <span className="text-[10px] tracking-[0.2em] text-muted-foreground font-mono">
                {progress.toString().padStart(3, "0")}%
              </span>
            </div>
            <div className="relative h-[6px] w-full rounded-full bg-primary/10 overflow-hidden border border-primary/30">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary via-primary-glow to-primary transition-[width] duration-150 ease-out"
                style={{
                  width: `${progress}%`,
                  boxShadow:
                    "0 0 12px hsl(var(--primary-glow) / 0.9), 0 0 24px hsl(var(--primary) / 0.6)",
                }}
              />
              <div
                className="absolute inset-y-0 w-12 bg-white/30 blur-sm transition-[left] duration-150"
                style={{ left: `calc(${progress}% - 3rem)` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* LOGO REVEAL */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-700 ${
          phase === "logo" || phase === "done"
            ? "opacity-100 scale-100"
            : "opacity-0 scale-90"
        }`}
      >
        <div className="relative">
          <div className="absolute inset-0 -m-10 rounded-full bg-primary/30 blur-3xl animate-pulse" />
          <img
            src={logo}
            alt="In Game"
            width={909}
            height={469}
            className="relative h-[28vh] max-h-[260px] w-auto object-contain drop-shadow-[0_0_40px_hsl(var(--primary-glow)/0.8)]"
          />
        </div>
      </div>

      {/* Local keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default IntroLoader;
