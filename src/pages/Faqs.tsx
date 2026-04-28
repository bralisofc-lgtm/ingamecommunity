import { useState } from "react";
import SiteLayout from "@/components/SiteLayout";
import SectionDivider from "@/components/SectionDivider";
import faqBanner from "@/assets/faq-banner.png";

const faqs = [
  {
    q: "🔍 : Como Funciona o Jogo Misterioso",
    a: "O Jogo Misterioso é uma forma de manter a comunidade sempre ativa e envolvida. De tempos em tempos, ele é sorteado de forma inesperada, geralmente durante a madrugada como uma maneira de valorizar quem está presente e participando.\n\nNão existe uma data fixa para esses sorteios, eles acontecem de forma totalmente surpresa, então quanto mais você acompanha e interage, maiores são as chances de não perder quando acontecer.\n\nApós o encerramento do sorteio, o jogo é revelado para todos, mostrando qual título estava sendo distribuído naquele momento.",
  },
  {
    q: "🎁 : Sobre Sorteios",
    a: "No momento, todos os jogos distribuídos nos sorteios são resgatáveis exclusivamente na Steam.",
  },
  {
    q: "💬 : Sua Participação na Comunidade",
    a: "Com a sua participação, através de interações, opiniões e experiências, ajudamos a construir um espaço mais ativo e significativo para todos, que ao longo do tempo, também serão realizados sorteios de jogos indie, como forma de valorizar e engajar ainda mais quem faz parte da comunidade.\n\nPortanto, precisamos manter sempre o respeito ao próximo e evitar qualquer tipo de toxicidade, focando em discussões saudáveis e construtivas.",
  },
  {
    q: "📌 : Proposta da Comunidade",
    a: "A comunidade tem como objetivo trazer informações, possíveis reviews e análises sobre jogos independentes, criando um espaço de descoberta e discussão.\n\nA ideia é dar mais visibilidade a projetos que muitas vezes passam despercebidos, valorizando não só o jogo em si mas também o trabalho por trás dele.",
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
      <section className="relative pt-28 pb-8 px-4">
        <div className="container mx-auto max-w-5xl animate-fade-up">
          <img
            src={faqBanner}
            alt="Ajude nossa comunidade — In Game"
            className="w-full h-auto object-contain mx-auto drop-shadow-[0_0_40px_hsl(var(--primary)/0.35)]"
            loading="eager"
          />
        </div>
      </section>

      <section className="relative pb-12 px-4">
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
