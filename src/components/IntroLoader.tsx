import { useEffect, useMemo, useState } from "react";
import logo from "@/assets/ingame-logo.png";
import RunnerCharacter from "./RunnerCharacter";

type Phase = "loading" | "doors" | "logo" | "done";

const STORAGE_KEY = "ingame_intro_seen";
const THEME_KEY = "ingame_loader_last_theme";

type LoaderTheme = {
  name: string;
  // HSL raw triplets ("H S% L%")
  barFrom: string;
  barMid: string;
  barTo: string;
  glow: string;
  glowSoft: string;
  dust: string;
  doorBorder: string;
  bobMs: number;
  shadowAlpha: number; // 0–1
};

const THEMES: LoaderTheme[] = [
  {
    name: "Roxo Neon",
    barFrom: "270 80% 55%",
    barMid: "280 95% 70%",
    barTo: "270 80% 55%",
    glow: "280 95% 70%",
    glowSoft: "270 80% 55%",
    dust: "280 95% 70%",
    doorBorder: "270 80% 55%",
    bobMs: 320,
    shadowAlpha: 0.7,
  },
  {
    name: "Magenta Arcade",
    barFrom: "320 85% 55%",
    barMid: "330 95% 70%",
    barTo: "290 80% 60%",
    glow: "325 95% 68%",
    glowSoft: "300 80% 55%",
    dust: "330 95% 72%",
    doorBorder: "315 80% 55%",
    bobMs: 280,
    shadowAlpha: 0.85,
  },
  {
    name: "Ciano Glitch",
    barFrom: "190 90% 55%",
    barMid: "180 95% 65%",
    barTo: "260 70% 60%",
    glow: "185 95% 65%",
    glowSoft: "260 70% 55%",
    dust: "185 95% 70%",
    doorBorder: "200 80% 55%",
    bobMs: 300,
    shadowAlpha: 0.65,
  },
  {
    name: "Verde Indie",
    barFrom: "140 70% 50%",
    barMid: "120 80% 60%",
    barTo: "270 70% 55%",
    glow: "130 85% 60%",
    glowSoft: "270 60% 50%",
    dust: "130 80% 65%",
    doorBorder: "270 70% 50%",
    bobMs: 340,
    shadowAlpha: 0.55,
  },
  {
    name: "Âmbar Crepúsculo",
    barFrom: "30 90% 55%",
    barMid: "20 95% 60%",
    barTo: "280 70% 55%",
    glow: "25 95% 62%",
    glowSoft: "280 70% 50%",
    dust: "30 95% 65%",
    doorBorder: "270 70% 55%",
    bobMs: 360,
    shadowAlpha: 0.7,
  },
  {
    name: "Branco Etéreo",
    barFrom: "270 30% 90%",
    barMid: "0 0% 100%",
    barTo: "270 60% 80%",
    glow: "270 40% 92%",
    glowSoft: "270 60% 70%",
    dust: "0 0% 100%",
    doorBorder: "270 50% 70%",
    bobMs: 400,
    shadowAlpha: 0.8,
  },
];

const pickTheme = (): LoaderTheme => {
  let last = -1;
  try {
    const raw = sessionStorage.getItem(THEME_KEY);
    if (raw !== null) last = parseInt(raw, 10);
  } catch {}
  let idx = Math.floor(Math.random() * THEMES.length);
  if (THEMES.length > 1 && idx === last) {
    idx = (idx + 1) % THEMES.length;
  }
  try {
    sessionStorage.setItem(THEME_KEY, String(idx));
  } catch {}
  return THEMES[idx];
};

const IntroLoader = ({ onFinish }: { onFinish: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<Phase>("loading");
  const theme = useMemo(pickTheme, []);

  // Progress bar
  useEffect(() => {
    if (phase !== "loading") return;
    let raf: number;
    const start = performance.now();
    const duration = 2800;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
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

  const glow = `hsl(${theme.glow})`;
  const glowSoft = `hsl(${theme.glowSoft})`;
  const dust = `hsl(${theme.dust})`;
  const doorBorder = `hsl(${theme.doorBorder} / 0.45)`;
  const doorEdge = `hsl(${theme.glow} / 0.6)`;
  const doorShadow = `hsl(${theme.glowSoft} / 0.4)`;

  return (
    <div
      className={`fixed inset-0 z-[9999] overflow-hidden transition-opacity duration-700 ${
        fadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ background: "#000" }}
      aria-hidden="true"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vmin] h-[80vmin] rounded-full blur-[120px]"
          style={{ background: `hsl(${theme.glowSoft} / 0.18)` }}
        />
      </div>

      {/* DOORS */}
      <div className="absolute inset-0 flex pointer-events-none">
        <div
          className={`relative h-full w-1/2 transition-transform duration-[1100ms] ease-[cubic-bezier(0.83,0,0.17,1)] ${
            doorsOpening ? "-translate-x-full" : "translate-x-0"
          }`}
          style={{
            background: `linear-gradient(to right, #000, #000, hsl(${theme.glowSoft} / 0.08))`,
            borderRight: `2px solid ${doorBorder}`,
            boxShadow: doorsOpening
              ? `20px 0 60px ${doorShadow}`
              : `inset -2px 0 30px hsl(${theme.glowSoft} / 0.25)`,
          }}
        >
          <div
            className="absolute inset-6 rounded-sm"
            style={{ border: `1px solid hsl(${theme.doorBorder} / 0.25)` }}
          />
          <div
            className="absolute inset-10 rounded-sm"
            style={{ border: `1px solid hsl(${theme.doorBorder} / 0.12)` }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-[2px]"
            style={{
              background: `linear-gradient(to bottom, transparent, ${doorEdge}, transparent)`,
            }}
          />
        </div>
        <div
          className={`relative h-full w-1/2 transition-transform duration-[1100ms] ease-[cubic-bezier(0.83,0,0.17,1)] ${
            doorsOpening ? "translate-x-full" : "translate-x-0"
          }`}
          style={{
            background: `linear-gradient(to left, #000, #000, hsl(${theme.glowSoft} / 0.08))`,
            borderLeft: `2px solid ${doorBorder}`,
            boxShadow: doorsOpening
              ? `-20px 0 60px ${doorShadow}`
              : `inset 2px 0 30px hsl(${theme.glowSoft} / 0.25)`,
          }}
        >
          <div
            className="absolute inset-6 rounded-sm"
            style={{ border: `1px solid hsl(${theme.doorBorder} / 0.25)` }}
          />
          <div
            className="absolute inset-10 rounded-sm"
            style={{ border: `1px solid hsl(${theme.doorBorder} / 0.12)` }}
          />
          <div
            className="absolute left-0 top-0 bottom-0 w-[2px]"
            style={{
              background: `linear-gradient(to bottom, transparent, ${doorEdge}, transparent)`,
            }}
          />
        </div>
      </div>

      {/* LOADING CONTENT (running character + bar) */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center px-6 transition-opacity duration-500 ${
          phase === "loading" ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="relative flex flex-col items-center">
          <p
            className="text-[11px] tracking-[0.5em] uppercase font-bold mb-10 animate-pulse"
            style={{ color: glow }}
          >
            Entrando no jogo
          </p>

          <div className="relative w-[min(520px,85vw)]">
            {/* Character running on top of the bar */}
            <div
              className="absolute -top-[72px] left-0 will-change-transform transition-[transform] duration-150 ease-out"
              style={{
                transform: `translateX(calc(${progress}% - 50%))`,
              }}
            >
              <div className="relative">
                <RunnerCharacter
                  size={64}
                  bodyColor="hsl(0 0% 8%)"
                  accentColor="hsl(0 0% 96%)"
                  glow={`hsl(${theme.glow} / ${theme.shadowAlpha})`}
                  speedMs={theme.bobMs}
                />
                {/* Dust puffs */}
                <span
                  className="absolute -bottom-1 left-3 w-2 h-2 rounded-full blur-[2px]"
                  style={{
                    background: `hsl(${theme.dust} / 0.7)`,
                    animation: "runner-dust 0.6s ease-out infinite",
                  }}
                />
                <span
                  className="absolute -bottom-1 left-6 w-1.5 h-1.5 rounded-full blur-[2px]"
                  style={{
                    background: `hsl(${theme.glowSoft} / 0.6)`,
                    animation: "runner-dust 0.6s ease-out infinite",
                    animationDelay: "0.15s",
                  }}
                />
              </div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-[10px] tracking-[0.4em] uppercase font-bold"
                style={{ color: glow }}
              >
                Carregando
              </span>
              <span className="text-[10px] tracking-[0.2em] text-muted-foreground font-mono">
                {progress.toString().padStart(3, "0")}%
              </span>
            </div>

            {/* Bar */}
            <div
              className="relative h-[6px] w-full rounded-full overflow-hidden"
              style={{
                background: `hsl(${theme.glowSoft} / 0.12)`,
                border: `1px solid hsl(${theme.glowSoft} / 0.35)`,
              }}
            >
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-150 ease-out"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(to right, hsl(${theme.barFrom}), hsl(${theme.barMid}), hsl(${theme.barTo}))`,
                  boxShadow: `0 0 12px hsl(${theme.glow} / 0.9), 0 0 24px hsl(${theme.glowSoft} / 0.6)`,
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

      {/* LOGO REVEAL — sempre com glow roxo neon */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-700 ${
          phase === "logo" || phase === "done"
            ? "opacity-100 scale-100"
            : "opacity-0 scale-90"
        }`}
      >
        <div className="relative">
          {/* Halo grande pulsando */}
          <div
            className="absolute inset-0 -m-24 rounded-full blur-[80px]"
            style={{
              background:
                "radial-gradient(circle, hsl(280 95% 65% / 0.55), hsl(270 80% 50% / 0.35) 45%, transparent 70%)",
              animation: "logo-glow-pulse 2.2s ease-in-out infinite",
            }}
          />
          {/* Halo interno mais intenso */}
          <div
            className="absolute inset-0 -m-10 rounded-full blur-3xl"
            style={{
              background: "hsl(280 95% 70% / 0.55)",
              animation: "logo-glow-pulse 1.6s ease-in-out infinite",
            }}
          />
          {/* Raios sutis girando */}
          <div
            className="absolute inset-0 -m-32 rounded-full opacity-60"
            style={{
              background:
                "conic-gradient(from 0deg, transparent, hsl(280 95% 70% / 0.25), transparent, hsl(270 80% 55% / 0.2), transparent)",
              filter: "blur(40px)",
              animation: "logo-rays-spin 8s linear infinite",
            }}
          />
          <img
            src={logo}
            alt="In Game"
            width={909}
            height={469}
            className="relative h-[28vh] max-h-[260px] w-auto object-contain"
            style={{
              filter:
                "drop-shadow(0 0 30px hsl(280 95% 70% / 0.95)) drop-shadow(0 0 60px hsl(270 80% 55% / 0.7))",
            }}
          />
        </div>
      </div>

      {/* Local keyframes */}
      <style>{`
        /* runner-bob: agora está dentro do RunnerCharacter */
        @keyframes runner-dust {
          0% { opacity: 0.9; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(-14px, 4px) scale(0.3); }
        }
      `}</style>
    </div>
  );
};

export default IntroLoader;
