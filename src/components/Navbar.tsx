import { useState } from "react";
import { Link, useLocation } from "react-router-dom";


const tabs = [
  { to: "/", label: "Início" },
  { to: "/sobre", label: "Sobre a Comunidade" },
  { to: "/faqs", label: "FAQs" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border/50">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-center relative">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="absolute left-4 text-lg font-black tracking-widest uppercase text-gradient hover:opacity-80 transition-opacity"
        >
          In Game
        </Link>

        <ul className="hidden md:flex items-center gap-4">
          {tabs.map((t) => {
            const active = pathname === t.to;
            return (
              <li key={t.to}>
                <Link
                  to={t.to}
                  className={`relative inline-flex items-center px-5 py-2 rounded-full text-xs uppercase tracking-widest font-bold border transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 ${
                    active
                      ? "bg-primary text-primary-foreground border-primary-glow shadow-[0_0_20px_hsl(var(--primary-glow)/0.7)]"
                      : "bg-background/40 text-foreground/80 border-border hover:border-primary-glow hover:text-primary-glow hover:shadow-[0_0_18px_hsl(var(--primary-glow)/0.5)]"
                  }`}
                >
                  {t.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          onClick={() => setOpen((o) => !o)}
          className="md:hidden absolute right-4 p-2 rounded-lg border border-border text-foreground"
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
