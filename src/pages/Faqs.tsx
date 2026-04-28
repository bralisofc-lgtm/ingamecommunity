import { useState } from "react";
import SiteLayout from "@/components/SiteLayout";
import SectionDivider from "@/components/SectionDivider";

const faqs = [
  {
    q: "O que é a In Game?",
    a: "A In Game é uma comunidade dedicada a quem ama jogos indies — um espaço para descobrir novos títulos, compartilhar experiências e participar de sorteios.",
  },
  {
    q: "Como faço para participar da comunidade?",
    a: "É só acompanhar nossas postagens, interagir com o conteúdo e ficar de olho nos canais oficiais. A entrada é livre e gratuita.",
  },
  {
    q: "Como funcionam os sorteios?",
    a: "De tempos em tempos publicamos sorteios de chaves, brindes e oportunidades exclusivas. Cada sorteio tem suas próprias regras descritas no post.",
  },
  {
    q: "Posso indicar um jogo indie para a comunidade?",
    a: "Com certeza! Adoramos descobrir novos jogos por indicação da comunidade. Mande seu indie favorito pelos canais oficiais.",
  },
  {
    q: "Sou desenvolvedor indie. Posso divulgar meu jogo?",
    a: "Sim. A In Game existe também para apoiar quem cria. Entre em contato e converse com a gente sobre seu projeto.",
  },
  {
    q: "Como posso apoiar a In Game?",
    a: "Você pode apoiar preenchendo o formulário disponível na página de apoio. Cada apoio ajuda a manter sorteios, conteúdos e novas iniciativas vivas.",
  },
];

const FaqItem = ({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="indie-card overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left group"
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
          <p className="px-5 md:px-6 pb-6 text-muted-foreground leading-relaxed">{a}</p>
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
              <FaqItem q={f.q} a={f.a} defaultOpen={i === 0} />
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
};

export default Faqs;
