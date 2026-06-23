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

      </div>
    </footer>
  );
};

export default SiteFooter;
