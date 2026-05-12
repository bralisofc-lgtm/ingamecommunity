import { useEffect, useRef, useState } from "react";
import { Calendar, Users, Play } from "lucide-react";
import type { Sorteio } from "@/hooks/useSorteios";

function youtubeId(url: string): string | null {
  if (!url) return null;
  const m =
    url.match(/[?&]v=([\w-]{6,})/) ||
    url.match(/youtu\.be\/([\w-]{6,})/) ||
    url.match(/youtube\.com\/embed\/([\w-]{6,})/) ||
    url.match(/youtube\.com\/shorts\/([\w-]{6,})/);
  return m ? m[1] : null;
}

interface Props {
  sorteio: Sorteio;
  index: number;
}

const SorteioCard = ({ sorteio, index }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [trailerOpen, setTrailerOpen] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (!ref.current) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = ref.current!.getBoundingClientRect();
        const center = r.top + r.height / 2 - window.innerHeight / 2;
        setOffset(Math.max(-40, Math.min(40, -center * 0.06)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const ytId = youtubeId(sorteio.youtube_trailer);
  const formattedDate = sorteio.event_date
    ? new Date(sorteio.event_date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <article
      ref={ref}
      className="sorteio-card group"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
        {sorteio.banner_image ? (
          <img
            src={sorteio.banner_image}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover bg-slow-pan"
            style={{ transform: `scale(1.1) translateY(${offset}px)` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-deep to-background" />
        )}

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

        {/* Game logo */}
        {sorteio.game_logo && (
          <img
            src={sorteio.game_logo}
            alt=""
            loading="lazy"
            className="absolute top-4 right-4 md:top-6 md:right-8 max-h-16 md:max-h-20 w-auto drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)] opacity-95"
          />
        )}

        {/* Content overlay */}
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-8 lg:p-10 z-10">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-3 mb-3 text-[11px] uppercase tracking-[0.3em] text-primary-glow">
              {formattedDate && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" /> {formattedDate}
                </span>
              )}
              {sorteio.participants_count > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <Users className="w-3 h-3" /> {sorteio.participants_count} participantes
                </span>
              )}
            </div>
            <h3 className="text-2xl md:text-4xl lg:text-5xl font-black mb-3 drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]">
              {sorteio.title}
            </h3>
            {sorteio.description && (
              <p className="text-sm md:text-base text-foreground/85 mb-5 max-w-xl leading-relaxed">
                {sorteio.description}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              {sorteio.participate_link && (
                <a
                  href={sorteio.participate_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-sorteio"
                >
                  Participar
                </a>
              )}
              {ytId && (
                <button
                  onClick={() => setTrailerOpen((v) => !v)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-primary-glow/40 text-primary-glow font-bold uppercase tracking-[0.18em] text-xs hover:bg-primary-glow/10 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Trailer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {ytId && trailerOpen && (
        <div className="p-4 md:p-6 bg-black/60 animate-fade-in">
          <div className="video-embed-wrap">
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
              title={sorteio.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </article>
  );
};

export default SorteioCard;
