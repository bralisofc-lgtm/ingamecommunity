import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/ingame-logo.png";

const tabs = [
  { to: "/", label: "Início" },
  { to: "/sobre", label: "Sobre a Comunidade" },
  { to: "/apoiar", label: "Apoiar a Comunidade" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/50">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <img
            src={logo}
            alt="In Game logo"
            className="h-10 w-auto transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-3deg]"
            style={{ filter: "drop-shadow(0 0 12px hsl(var(--primary) / 0.5))" }}
          />
        </Link>

        <ul className="hidden md:flex items-center gap-10">
          {tabs.map((t) => (
            <li key={t.to}>
              <Link
                to={t.to}
                data-active={pathname === t.to}
                className="nav-link text-sm uppercase tracking-widest font-semibold text-foreground/80 hover:text-primary-glow"
              >
                {t.label}
              </Link>
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
              <li key={t.to}>
                <Link
                  to={t.to}
                  onClick={() => setOpen(false)}
                  data-active={pathname === t.to}
                  className="nav-link block py-2 text-sm uppercase tracking-widest font-semibold"
                >
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
