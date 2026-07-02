import { useMemo } from "react";
import { Sparkles, Clock, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import { useLancamentos, type Lancamento, type Evento } from "@/hooks/useLancamentos";

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 560'>
      <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='#1a0b2e'/><stop offset='1' stop-color='#3b0f6b'/>
      </linearGradient></defs>
      <rect width='400' height='560' fill='url(#g)'/>
      <text x='50%' y='50%' fill='#a78bfa' font-family='Inter,sans-serif' font-size='22' font-weight='700'
        text-anchor='middle' dominant-baseline='middle'>HUB INDIES</text>
    </svg>`,
  );

function badge(l: Lancamento): { label: string; icon: any; tone: string } {
  const today = new Date().toISOString().slice(0, 10);
  if (l.status === "released" || l.data_lancamento <= today) {
    return { label: "Lançado", icon: CheckCircle2, tone: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" };
  }
  if (l.destaque) {
    return { label: "Aguardado", icon: Sparkles, tone: "bg-primary/20 text-primary border-primary/40" };
  }
  return { label: "Em breve", icon: Clock, tone: "bg-white/10 text-white/70 border-white/15" };
}

function GameCard({ l }: { l: Lancamento }) {
  const b = badge(l);
  const Icon = b.icon;
  const href = l.link || (l.steam_appid ? `https://store.steampowered.com/app/${l.steam_appid}/` : "#");
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-xl bg-black/40 ring-1 ring-white/5 transition-all hover:ring-primary/50 hover:shadow-[0_0_30px_rgba(147,51,234,0.35)]"
      title={l.nome}
      aria-label={l.nome}
    >
      <div className="aspect-[2/3] w-full overflow-hidden">
        <img
          src={l.cover_url || PLACEHOLDER}
          alt={l.nome}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          onError={(e) => ((e.currentTarget as HTMLImageElement).src = PLACEHOLDER)}
        />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-start p-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md ${b.tone}`}
        >
          <Icon className="h-2.5 w-2.5" />
          {b.label}
        </span>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      <p className="pointer-events-none absolute inset-x-0 bottom-0 truncate p-2 text-[11px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
        {l.nome}
      </p>
    </a>
  );
}

function EventCard({ e }: { e: Evento }) {
  return (
    <a
      href={e.link ?? "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-xl bg-black/40 ring-1 ring-white/5 transition-all hover:ring-primary/50"
    >
      <div className="aspect-[16/9] w-full overflow-hidden">
        <img
          src={e.banner_url || PLACEHOLDER}
          alt={e.nome}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3">
        <p className="text-sm font-bold text-white">{e.nome}</p>
        <p className="text-[11px] text-white/70">{new Date(e.data + "T00:00:00").toLocaleDateString("pt-BR")}</p>
      </div>
    </a>
  );
}

const LancamentosIndies = () => {
  const { lancamentos, eventos, loading } = useLancamentos();

  const games = useMemo(() => {
    // ordena: aguardados primeiro, depois por score desc, depois por data
    return [...lancamentos].sort((a, b) => {
      if (a.destaque !== b.destaque) return a.destaque ? -1 : 1;
      const sa = (a as any).ai_score ?? 0;
      const sb = (b as any).ai_score ?? 0;
      if (sa !== sb) return sb - sa;
      return a.data_lancamento.localeCompare(b.data_lancamento);
    });
  }, [lancamentos]);

  const upcomingEvents = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return eventos.filter((e) => e.data >= today).slice(0, 6);
  }, [eventos]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.25),transparent_60%)]" />
        <div className="container relative mx-auto px-4 py-14 text-center md:py-20">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em] text-primary/80">Hub Indies</p>
          <h1 className="mb-3 text-4xl font-black tracking-tight text-white md:text-6xl">
            Lançamentos Indies
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-white/60 md:text-base">
            Uma curadoria automática dos indies mais promissores. Atualizado diariamente pela IA.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-10">
        {/* Grade minimalista */}
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] animate-pulse rounded-xl bg-white/5" />
            ))}
          </div>
        ) : games.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 p-10 text-center">
            <p className="text-sm text-white/60">
              Nenhum lançamento ainda. A sincronização automática roda diariamente.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {games.map((l) => (
              <GameCard key={l.id} l={l} />
            ))}
          </div>
        )}

        {/* Eventos */}
        {upcomingEvents.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-5 text-xl font-black text-white md:text-2xl">Próximos eventos</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((e) => (
                <EventCard key={e.id} e={e} />
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
};

export default LancamentosIndies;
