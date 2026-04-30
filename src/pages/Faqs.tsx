import { useState } from "react";
import SiteLayout from "@/components/SiteLayout";
import SectionDivider from "@/components/SectionDivider";
import ajudeBanner from "@/assets/ajude-comunidade.png";
import { useFaqs } from "@/hooks/useFaqs";

const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="indie-card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left group"
        aria-expanded={open}
      >
        <span className="font-bold text-base md:text-lg group-hover:text-primary-glow transition-colors">
          {q}
        </span>
        <span
          className={`shrink-0 w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center text-primary-glow font-black transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-5 md:px-6 pb-6 text-muted-foreground leading-relaxed whitespace-pre-line">{a}</p>
        </div>
      </div>
    </div>
  );
};

const Faqs = () => {
  return (
    <SiteLayout
      title="FAQs — In Game"
      description="Perguntas frequentes sobre a comunidade In Game, sorteios, divulgação de jogos indies e como participar."
    >
      <section className="relative pt-32 pb-12 px-4">
        <div className="container mx-auto max-w-4xl text-center animate-fade-up">
          <p className="text-primary-glow uppercase tracking-[0.3em] text-xs font-bold mb-3">Dúvidas frequentes</p>
          <h1 className="text-5xl md:text-7xl font-black mb-5">
            FAQ<span className="text-gradient">s</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Respostas rápidas para as perguntas mais comuns sobre a comunidade In Game.
          </p>
        </div>
      </section>

      <SectionDivider />

      <section className="relative py-16 px-4">
        <div className="container mx-auto max-w-3xl space-y-4">
          {faqs.map((f, i) => (
            <div key={f.q} className="animate-fade-up" style={{ animationDelay: `${i * 0.06}s` }}>
              <FaqItem q={f.q} a={f.a} />
            </div>
          ))}
        </div>
      </section>

      {/* Apoiar comunidade — banner + CTA no fim do FAQ */}
      <section className="relative pt-4 pb-24 px-4">
        <div className="container mx-auto max-w-3xl flex flex-col items-center gap-8 text-center animate-fade-up">
          <img
            src={ajudeBanner}
            alt="Ajude nossa comunidade"
            className="w-full max-w-2xl h-auto select-none drop-shadow-[0_8px_25px_hsl(270_80%_8%/0.6)]"
            draggable={false}
          />
          <a
            href="https://forms.gle/kX4vtVjzZQpgk97M7"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden inline-flex items-center gap-2 px-5 py-3 bg-background/60 backdrop-blur-sm border-2 border-primary text-foreground font-black uppercase tracking-widest text-xs shadow-[4px_4px_0_hsl(var(--primary)/0.6),0_0_20px_hsl(var(--primary)/0.4)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_hsl(var(--primary)/0.6),0_0_28px_hsl(var(--primary)/0.7)] transition-all"
          >
            <span className="relative">Apoiar comunidade</span>
          </a>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Faqs;
