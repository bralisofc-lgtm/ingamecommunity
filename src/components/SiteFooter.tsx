import { Bell, BellRing, BellOff, Compass, CalendarDays, Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";
import { usePushNotifications } from "@/hooks/usePushNotifications";

type HubLink = { label: string; to: string };
type HubColumn = { title: string; icon: React.ComponentType<{ className?: string }>; links: HubLink[] };

const columns: HubColumn[] = [
  {
    title: "EXPLORAR",
    icon: Compass,
    links: [
      { label: "Catálogo de Notícias", to: "/" },
      { label: "Novos Lançamentos", to: "/" },
      { label: "Comunidade", to: "/" },
    ],
  },
  {
    title: "EVENTOS",
    icon: CalendarDays,
    links: [
      { label: "Sorteios", to: "/sorteios" },
      { label: "Eventos", to: "/" },
    ],
  },
  {
    title: "HUB INDIES",
    icon: Gamepad2,
    links: [
      { label: "Sobre Nós", to: "/sobre" },
      { label: "Entrevistas", to: "/" },
    ],
  },
];

const SiteFooter = () => {
  const { permission, requestPermission } = usePushNotifications();

  const label =
    permission === "granted"
      ? "Notificações ativadas"
      : permission === "denied"
        ? "Notificações bloqueadas"
        : permission === "unsupported"
          ? "Não suportado"
          : "Ativar notificações";

  const Icon =
    permission === "granted" ? BellRing : permission === "denied" ? BellOff : Bell;

  const disabled = permission === "granted" || permission === "denied" || permission === "unsupported";

  return (
    <footer className="relative mt-16 overflow-hidden border-t border-border/50">
      {/* Background atmospherics */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-background to-background/80" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 30%, hsl(var(--primary-glow)) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, hsl(var(--primary)) 0%, transparent 55%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
      />

      <div className="relative container mx-auto px-6 md:px-10 lg:px-16 pt-16 pb-10">
        {/* HUB */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 lg:gap-20">
          {columns.map((col) => {
            const ColIcon = col.icon;
            return (
              <div key={col.title} className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/30 shadow-[0_0_24px_hsl(var(--primary-glow)/0.25)]">
                    <ColIcon className="w-5 h-5 text-primary" />
                  </span>
                  <h3 className="text-base md:text-lg font-extrabold uppercase tracking-[0.18em] text-foreground">
                    {col.title}
                  </h3>
                </div>
                <div
                  aria-hidden
                  className="h-px w-12 bg-gradient-to-r from-primary/70 to-transparent"
                />
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-all duration-300 hover:text-primary hover:translate-x-1"
                      >
                        <span
                          aria-hidden
                          className="h-1.5 w-1.5 rounded-full bg-primary/0 group-hover:bg-primary group-hover:shadow-[0_0_8px_hsl(var(--primary-glow))] transition-all duration-300"
                        />
                        <span className="tracking-wide">{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
          <p className="text-xs md:text-sm text-muted-foreground">
            © 2026 In Game Community. Todos os direitos reservados.
          </p>

          <button
            type="button"
            onClick={requestPermission}
            disabled={disabled}
            className="relative group inline-flex items-center gap-2 rounded-full p-[2px] disabled:opacity-70 disabled:cursor-not-allowed"
            style={{
              background:
                "linear-gradient(135deg, hsl(0 0% 100%) 0%, hsl(280 95% 72%) 50%, hsl(0 0% 100%) 100%)",
            }}
            aria-label={label}
            title={label}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-primary-foreground font-bold uppercase tracking-wider text-xs shadow-[0_0_20px_hsl(var(--primary-glow)/0.5)] group-hover:shadow-[0_0_28px_hsl(var(--primary-glow)/0.8)] transition-shadow">
              <Icon className="w-4 h-4" />
              {label}
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
