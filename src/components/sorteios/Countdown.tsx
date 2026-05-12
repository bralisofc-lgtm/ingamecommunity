import { useEffect, useState } from "react";

interface Props {
  target: string | null;
}

const pad = (n: number) => String(n).padStart(2, "0");

const Countdown = ({ target }: Props) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!target) {
    return (
      <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
        Em breve — fique atento.
      </p>
    );
  }

  const diff = Math.max(0, new Date(target).getTime() - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  const parts: { v: string; l: string }[] = [
    { v: pad(days), l: "Dias" },
    { v: pad(hours), l: "Horas" },
    { v: pad(mins), l: "Min" },
    { v: pad(secs), l: "Seg" },
  ];

  return (
    <div className="flex flex-wrap items-end justify-center gap-4 md:gap-8">
      {parts.map((p) => (
        <div key={p.l} className="text-center">
          <div className="countdown-digit text-5xl md:text-7xl lg:text-8xl leading-none">{p.v}</div>
          <div className="mt-2 text-[10px] md:text-xs uppercase tracking-[0.4em] text-muted-foreground">
            {p.l}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Countdown;
