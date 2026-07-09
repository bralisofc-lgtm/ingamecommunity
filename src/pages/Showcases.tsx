import { useMemo } from "react";
import { CalendarDays, Star, ExternalLink } from "lucide-react";
import SiteLayout from "@/components/SiteLayout";
import { useLancamentos, type Evento } from "@/hooks/useLancamentos";

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'>
      <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='#1a0b2e'/><stop offset='1' stop-color='#3b0f6b'/>
      </linearGradient></defs>
      <rect width='800' height='450' fill='url(#g)'/>
      <text x='50%' y='50%' fill='#a78bfa' font-family='Inter,sans-serif' font-size='36' font-weight='700'
        text-anchor='middle' dominant-baseline='middle'>SHOWCASE</text>
    </svg>`,
  );

const fmtDate = (d: string) =>
  new Date(d + "T00:00:00").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

function EventCard({ e }: { e: Evento }) {
  const hasLink = !!e.link;
  const Tag: any = hasLink ? "a" : "div";
  const props = hasLink
    ? { href: e.link!, target: "_blank", rel: "noopener noreferrer" }
    : {};
  return (
    <Tag
      {...props}
      className={`group relative block overflow-hidden rounded-2xl bg-black/40 ring-1 ring-white/[0.06] transition-all ${
        hasLink ? "hover:ring-primary/50 hover:shadow-[0_0_40px_rgba(147,51,234,0.35)]" : ""
      }`}
    >
      <div className="aspect-[16/9] w-full overflow-hidden">
        <img
          src={e.banner_url || PLACEHOLDER}
          alt={e.nome}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          onError={(ev) => ((ev.currentTarget as HTMLImageElement).src = PLACEHOLDER)}
        />
      </div>
      {e.destaque && (
        <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary backdrop-blur-md">
          <Star className="h-2.5 w-2.5 fill-primary" /> Destaque
        </div>
      )}
      <div className="p-4 md:p-5">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-primary/80">
          <CalendarDays className="h-3.5 w-3.5" />
          {fmtDate(e.data)}
          {e.horario ? ` · ${e.horario.slice(0, 5)}` : ""}
        </div>
        <h3 className="mt-2 text-lg font-black tracking-tight text-white md:text-xl">
          {e.nome}
        </h3>
        {e.descricao && (
          <p className="mt-2 line-clamp-3 text-sm text-white/60">{e.descricao}</p>
        )}
        {hasLink && (
          <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary-glow">
            Saiba mais <ExternalLink className="h-3 w-3" />
          </span>
        )}
      </div>
    </Tag>
  );
}

const Showcases = () => {
  const { eventos, loading } = useLancamentos();
  const today = new Date().toISOString().slice(0, 10);

  const { proximos, passados } = useMemo(() => {
    const sorted = [...eventos].sort((a, b) => a.data.localeCompare(b.data));
    return {
      proximos: sorted.filter((e) => e.data >= today),
      passados: sorted.filter((e) => e.data < today).reverse(),
    };
  }, [eventos, today]);

  return (
    <SiteLayout
      title="Eventos e Showcases — In Game"
      description="Acompanhe os principais eventos e showcases de jogos indies selecionados pela In Game."
      canonical="https://ingamecommunity.site/showcases"
    >
      <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-primary/10 via-background to-background pt-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.25),transparent_60%)]" />
        <div className="container relative mx-auto px-4 py-14 text-center md:py-20">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em] text-primary/80">
            Hub Indies
          </p>
          <h1 className="mb-3 text-4xl font-black tracking-tight text-white md:text-6xl">
            Eventos & Showcases
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-white/60 md:text-base">
            Uma seleção curada dos eventos e showcases indies mais relevantes.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-10">
        {loading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[16/11] animate-pulse rounded-2xl bg-white/5" />
            ))}
          </div>
        ) : eventos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center">
            <CalendarDays className="mx-auto mb-3 h-8 w-8 text-white/30" />
            <p className="text-sm text-white/60">
              Nenhum evento no momento. Volte em breve.
            </p>
          </div>
        ) : (
          <div className="space-y-14">
            {proximos.length > 0 && (
              <section>
                <h2 className="mb-5 text-xl font-black text-white md:text-2xl">
                  Próximos
                </h2>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {proximos.map((e) => (
                    <EventCard key={e.id} e={e} />
                  ))}
                </div>
              </section>
            )}
            {passados.length > 0 && (
              <section>
                <h2 className="mb-5 text-xl font-black text-white/80 md:text-2xl">
                  Realizados
                </h2>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 opacity-80">
                  {passados.map((e) => (
                    <EventCard key={e.id} e={e} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </SiteLayout>
  );
};

export default Showcases;
