import type { Sorteio } from "@/hooks/useSorteios";
import Countdown from "./Countdown";

interface Props {
  sorteio: Sorteio;
}

const NextSorteioHero = ({ sorteio }: Props) => {
  return (
    <section className="relative py-24 md:py-36 overflow-hidden">
      {/* Background image fade */}
      {sorteio.banner_image && (
        <div className="absolute inset-0 -z-10">
          <img
            src={sorteio.banner_image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-25 bg-slow-pan"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>
      )}

      {/* Floating glow orbs */}
      <div
        className="pointer-events-none absolute -left-32 top-20 w-96 h-96 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(285 100% 60% / 0.6), transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -right-40 bottom-10 w-[28rem] h-[28rem] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(195 100% 55% / 0.55), transparent 70%)" }}
      />

      <div className="relative container mx-auto px-5 text-center">
        <p className="text-primary-glow uppercase tracking-[0.45em] text-[10px] md:text-xs font-bold mb-4 animate-fade-up">
          Próximo Sorteio
        </p>
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 animate-fade-up leading-[0.95]">
          <span className="bg-gradient-to-r from-primary-glow via-accent to-primary bg-clip-text text-transparent">
            {sorteio.title}
          </span>
        </h2>
        {sorteio.description && (
          <p className="max-w-2xl mx-auto text-base md:text-lg text-muted-foreground mb-12 animate-fade-up leading-relaxed">
            {sorteio.description}
          </p>
        )}

        <div className="mb-10 animate-fade-up">
          <Countdown target={sorteio.event_date} />
        </div>

        {sorteio.participate_link && (
          <a
            href={sorteio.participate_link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-sorteio animate-fade-up"
          >
            Participar agora
          </a>
        )}
      </div>
    </section>
  );
};

export default NextSorteioHero;
