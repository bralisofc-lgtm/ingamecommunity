import { useState } from "react";
import logo from "@/assets/ingame-logo.png";

interface NavbarProps {
  active: string;
  onNavigate: (id: string) => void;
}

const tabs = [
  { id: "inicio", label: "Início" },
  { id: "sobre", label: "Sobre a Comunidade" },
  { id: "apoiar", label: "Apoiar a Comunidade" },
];

const Navbar = ({ active, onNavigate }: NavbarProps) => {
  const [open, setOpen] = useState(false);

  const go = (id: string) => {
    onNavigate(id);
    setOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/50">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <button onClick={() => go("inicio")} className="flex items-center gap-2 group">
          <img
            src={logo}
            alt="In Game logo"
            className="h-10 w-auto transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-3deg]"
            style={{ filter: "drop-shadow(0 0 12px hsl(var(--primary) / 0.5))" }}
          />
        </button>

        <ul className="hidden md:flex items-center gap-10">
          {tabs.map((t) => (
            <li key={t.id}>
              <button
                onClick={() => go(t.id)}
                data-active={active === t.id}
                className="nav-link text-sm uppercase tracking-widest font-semibold text-foreground/80 hover:text-primary-glow"
              >
                {t.label}
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setOpen((o) => !o)}
          className="md:hidden p-2 rounded-lg border border-border text-foreground"
          aria-label="Abrir menu"
        >
          <div className="w-5 h-0.5 bg-foreground mb-1" />
          <div className="w-5 h-0.5 bg-foreground mb-1" />
          <div className="w-5 h-0.5 bg-foreground" />
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-border/50 bg-background/90 backdrop-blur-xl animate-fade-up">
          <ul className="flex flex-col p-4 gap-3">
            {tabs.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => go(t.id)}
                  data-active={active === t.id}
                  className="nav-link w-full text-left py-2 text-sm uppercase tracking-widest font-semibold"
                >
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
