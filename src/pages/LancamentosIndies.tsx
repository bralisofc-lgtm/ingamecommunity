import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Flame,
  Clock,
  Gamepad2,
} from "lucide-react";
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

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function startOfWeek(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - x.getDay());
  return x;
}
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function isoDay(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function fmtDay(d: Date) {
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
}
function daysUntil(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  const target = new Date(y, m - 1, d);
  return Math.round((target.getTime() - t.getTime()) / 86400000);
}

const LancamentosIndies = () => {
  const { lancamentos, eventos, loading } = useLancamentos();
  const [weekOffset, setWeekOffset] = useState(0);

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const weekStart = useMemo(
    () => addDays(startOfWeek(today), weekOffset * 7),
    [today, weekOffset],
  );
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  const byDay = useMemo(() => {
    const map = new Map<string, Lancamento[]>();
    for (const l of lancamentos) {
      const arr = map.get(l.data_lancamento) ?? [];
      arr.push(l);
      map.set(l.data_lancamento, arr);
    }
    return map;
  }, [lancamentos]);

  const recentes = useMemo(() => {
    const t = isoDay(today);
    return lancamentos
      .filter((l) => l.data_lancamento < t)
      .slice(-8)
      .reverse();
  }, [lancamentos, today]);

  const eventosDestaque = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const in30 = addDays(now, 30);
    return eventos
      .filter((e) => {
        const [y, m, d] = e.data.split("-").map(Number);
        const dt = new Date(y, m - 1, d);
        return dt >= now && dt <= in30;
      });
  }, [eventos]);

  const eventosFuturos = useMemo(() => {
    const t = isoDay(today);
    return eventos.filter((e) => e.data >= t);
  }, [eventos, today]);

  const weekLabel = `${fmtDay(weekDays[0])} — ${fmtDay(weekDays[6])} · ${MONTHS[weekDays[0].getMonth()]}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Header */}
      <section className="relative overflow-hidden pt-28 pb-10 md:pt-36 md:pb-14 border-b border-border/40">
        <div className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 20% 30%, hsl(var(--primary-glow)) 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, hsl(var(--primary)) 0%, transparent 55%)",
          }}
        />
        <div className="relative container mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/30 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-primary font-bold">
              <Gamepad2 className="w-3.5 h-3.5" />
              Hub Indies
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-white via-white to-primary bg-clip-text text-transparent">
            Lançamentos Indies
          </h1>
          <p className="mt-4 max-w-2xl text-base md:text-lg text-muted-foreground">
            Acompanhe os próximos lançamentos independentes e os principais eventos da cena indie.
          </p>
        </div>
      </section>

      {/* Calendário */}
      <section className="relative py-12 md:py-16">
        <div className="container mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-primary font-bold mb-2">
                Calendário
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Semana de {weekLabel}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setWeekOffset((w) => w - 1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/5 text-primary hover:bg-primary/15 transition"
                aria-label="Semana anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setWeekOffset(0)}
                className="rounded-xl border border-primary/25 bg-primary/5 px-4 h-10 text-sm font-semibold text-primary hover:bg-primary/15 transition"
              >
                Hoje
              </button>
              <button
                type="button"
                onClick={() => setWeekOffset((w) => w + 1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/5 text-primary hover:bg-primary/15 transition"
                aria-label="Próxima semana"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Desktop / Tablet: colunas */}
          <div className="hidden md:grid grid-cols-7 gap-3">
            {weekDays.map((d) => {
              const key = isoDay(d);
              const items = byDay.get(key) ?? [];
              const isToday = key === isoDay(today);
              return (
                <div
                  key={key}
                  className={`rounded-2xl border transition-colors ${
                    isToday
                      ? "border-primary/60 bg-primary/[0.08] shadow-[0_0_28px_hsl(var(--primary-glow)/0.25)]"
                      : "border-primary/15 bg-primary/[0.03]"
                  }`}
                >
                  <div className="px-3 py-2 border-b border-primary/15">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-primary/80 font-bold">
                      {WEEKDAYS[d.getDay()]}
                    </p>
                    <p className="text-sm font-bold text-white">
                      {String(d.getDate()).padStart(2, "0")}/{String(d.getMonth() + 1).padStart(2, "0")}
                    </p>
                  </div>
                  <div className="p-2 space-y-2 min-h-[160px]">
                    {items.length === 0 && (
                      <p className="text-[11px] text-muted-foreground/70 text-center py-6">
                        Sem lançamentos
                      </p>
                    )}
                    {items.map((g) => (
                      <GameCard key={g.id} game={g} compact />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile: timeline vertical */}
          <div className="md:hidden space-y-4">
            {weekDays.map((d) => {
              const key = isoDay(d);
              const items = byDay.get(key) ?? [];
              const isToday = key === isoDay(today);
              return (
                <div
                  key={key}
                  className={`rounded-2xl border ${
                    isToday
                      ? "border-primary/60 bg-primary/[0.08]"
                      : "border-primary/15 bg-primary/[0.03]"
                  }`}
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-primary/15">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.28em] text-primary/80 font-bold">
                        {WEEKDAYS[d.getDay()]}
                      </p>
                      <p className="text-sm font-bold text-white">
                        {String(d.getDate()).padStart(2, "0")}/{String(d.getMonth() + 1).padStart(2, "0")}
                      </p>
                    </div>
                    <span className="text-[11px] text-primary/80 font-semibold">
                      {items.length} {items.length === 1 ? "jogo" : "jogos"}
                    </span>
                  </div>
                  {items.length > 0 && (
                    <div className="p-3 grid grid-cols-2 gap-2">
                      {items.map((g) => (
                        <GameCard key={g.id} game={g} compact />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {loading && (
            <p className="text-center text-sm text-muted-foreground mt-8">
              Carregando lançamentos...
            </p>
          )}
        </div>
      </section>

      {/* Recentes */}
      {recentes.length > 0 && (
        <section className="py-10 md:py-14 border-t border-border/40">
          <div className="container mx-auto px-6 md:px-10 lg:px-16">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
                Lançamentos Recentes
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {recentes.map((g) => (
                <GameCard key={g.id} game={g} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Eventos */}
      <section className="py-12 md:py-16 border-t border-border/40">
        <div className="container mx-auto px-6 md:px-10 lg:px-16">
          <div className="flex items-center gap-3 mb-6">
            <CalendarDays className="w-5 h-5 text-primary" />
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Próximos Eventos e Showcases
            </h2>
          </div>

          {eventosFuturos.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum evento cadastrado no momento.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {eventosFuturos.map((e) => (
                <EventCard
                  key={e.id}
                  evento={e}
                  destaque={eventosDestaque.some((x) => x.id === e.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

// --------------------------------------------------

function GameCard({ game, compact }: { game: Lancamento; compact?: boolean }) {
  const dUntil = daysUntil(game.data_lancamento);
  const soon = dUntil >= 0 && dUntil <= 7;

  const Wrapper: any = game.link ? "a" : "div";
  const props = game.link
    ? { href: game.link, target: "_blank", rel: "noreferrer noopener" }
    : {};

  return (
    <Wrapper
      {...props}
      className={`group relative block overflow-hidden rounded-xl border transition-all duration-300
        ${game.destaque
          ? "border-primary/60 shadow-[0_0_18px_hsl(var(--primary-glow)/0.35)]"
          : "border-primary/20"}
        bg-gradient-to-b from-primary/[0.06] to-transparent
        hover:border-primary/70 hover:shadow-[0_0_22px_hsl(var(--primary-glow)/0.45)] hover:-translate-y-0.5`}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#1a0b2e]">
        <img
          src={game.cover_url || PLACEHOLDER}
          alt={game.nome}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = PLACEHOLDER;
          }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {game.destaque && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-primary/90 text-primary-foreground px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
            <Flame className="w-3 h-3" />
            Aguardado
          </span>
        )}
        {soon && !game.destaque && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-white/10 backdrop-blur border border-primary/40 text-primary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            Em breve
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 p-2">
          <p className={`text-white font-bold leading-tight line-clamp-2 ${compact ? "text-[11px]" : "text-xs md:text-sm"}`}>
            {game.nome}
          </p>
          {game.plataformas.length > 0 && (
            <p className="mt-0.5 text-[9px] text-primary/90 font-semibold uppercase tracking-wider truncate">
              {game.plataformas.slice(0, 3).join(" · ")}
            </p>
          )}
        </div>
      </div>
    </Wrapper>
  );
}

function EventCard({ evento, destaque }: { evento: Evento; destaque: boolean }) {
  const dUntil = daysUntil(evento.data);
  const countdown =
    dUntil > 0
      ? `em ${dUntil} ${dUntil === 1 ? "dia" : "dias"}`
      : dUntil === 0
        ? "hoje"
        : "";

  const [y, m, d] = evento.data.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const dateLabel = `${String(dt.getDate()).padStart(2, "0")} de ${MONTHS[dt.getMonth()].toLowerCase()}`;

  const Wrapper: any = evento.link ? "a" : "div";
  const props = evento.link
    ? { href: evento.link, target: "_blank", rel: "noreferrer noopener" }
    : {};

  return (
    <Wrapper
      {...props}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300
        ${destaque
          ? "border-primary/60 shadow-[0_0_28px_hsl(var(--primary-glow)/0.3)]"
          : "border-primary/20"}
        bg-gradient-to-b from-primary/[0.07] to-background/40
        hover:border-primary/70 hover:-translate-y-0.5 hover:shadow-[0_0_32px_hsl(var(--primary-glow)/0.4)]`}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-[#1a0b2e]">
        {evento.banner_url ? (
          <img
            src={evento.banner_url}
            alt={evento.nome}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-primary/60 text-xs font-bold uppercase tracking-widest">
            {evento.nome}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        {destaque && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-primary/90 text-primary-foreground px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
            <Flame className="w-3 h-3" />
            Destaque
          </span>
        )}
      </div>
      <div className="p-4 md:p-5 space-y-2 flex-1 flex flex-col">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-primary">
          <CalendarDays className="w-3.5 h-3.5" />
          {dateLabel}
          {evento.horario && <span className="text-primary/70">· {evento.horario.slice(0, 5)}</span>}
          {countdown && <span className="text-primary/60">· {countdown}</span>}
        </div>
        <h3 className="text-lg font-extrabold text-white leading-tight">{evento.nome}</h3>
        {evento.descricao && (
          <p className="text-sm text-muted-foreground line-clamp-3">{evento.descricao}</p>
        )}
        {evento.link && (
          <div className="mt-auto pt-3 flex items-center gap-1.5 text-xs text-primary font-semibold">
            Saiba mais <ExternalLink className="w-3 h-3" />
          </div>
        )}
      </div>
    </Wrapper>
  );
}

export default LancamentosIndies;
