import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, ArrowLeft, X, Gift } from "lucide-react";
import { usePosts } from "@/hooks/usePosts";

const tabs = [
  { to: "/", label: "Início" },
  { to: "/noticias", label: "Notícias" },
  { to: "/showcases", label: "Showcases" },
  { to: "/parceiros", label: "Parceiros" },
  { to: "/faqs", label: "FAQs" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { posts } = usePosts();

  const isHome = pathname === "/";

  const [nearLogo, setNearLogo] = useState(true);

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      setNearLogo(false);
      return;
    }
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight - 80);
      // Esconde a busca enquanto a logo do hero ainda estiver visível
      setNearLogo(window.scrollY < window.innerHeight * 0.55);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [searchOpen]);

  // Close search on route change
  useEffect(() => {
    setSearchOpen(false);
  }, [pathname]);

  // Fecha a busca automaticamente ao voltar para a área da logo
  useEffect(() => {
    if (nearLogo) setSearchOpen(false);
  }, [nearLogo]);

  const transparent = isHome && !scrolled && !searchOpen;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return posts
      .filter((p) =>
        [p.title, p.description, p.tag, p.author]
          .filter(Boolean)
          .some((s) => s.toLowerCase().includes(q))
      )
      .slice(0, 6);
  }, [query, posts]);

  const goToPost = (slug: string) => {
    if (!slug) return;
    setSearchOpen(false);
    navigate(`/${slug}`);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        transparent
          ? "bg-transparent backdrop-blur-0 border-b border-transparent"
          : "backdrop-blur-xl bg-background/60 border-b border-border/50"
      }`}
    >
      <nav
        className={`container mx-auto px-4 py-3 flex items-center relative transition-opacity duration-500 ${
          isHome && !scrolled && !searchOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {/* Left: Gift icon (far left) + back arrow when search is open */}
        <div className="flex items-center gap-2 w-auto">
          {!searchOpen && (
            <Link
              to="/sorteios"
              aria-label="Sorteios Realizados"
              title="Sorteios Realizados"
              className={`relative inline-flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-300 hover:-translate-y-0.5 hover:scale-110 ${
                pathname === "/sorteios"
                  ? "bg-primary text-primary-foreground border-primary-glow shadow-[0_0_22px_hsl(var(--primary-glow)/0.8)]"
                  : "bg-background/40 text-foreground/80 border-border hover:border-primary-glow hover:text-primary-glow hover:shadow-[0_0_18px_hsl(var(--primary-glow)/0.55)]"
              }`}
            >
              <Gift className="w-4 h-4" />
            </Link>
          )}
          {searchOpen && (
            <button
              onClick={() => setSearchOpen(false)}
              aria-label="Voltar"
              className="p-2 rounded-full border border-border/60 text-foreground/90 hover:text-primary-glow hover:border-primary-glow transition-all duration-300 hover:-translate-x-0.5 hover:shadow-[0_0_18px_hsl(var(--primary-glow)/0.5)] animate-fade-in"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Center: tabs OR search input */}
        <div className="flex-1 flex justify-center">
          {!searchOpen ? (
            <ul className="hidden md:flex items-center gap-3">
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
          ) : (
            <div className="w-full max-w-2xl relative animate-fade-in">
              <div className="flex items-center gap-3 px-4 py-2 rounded-full border border-border/60 bg-background/60 backdrop-blur-xl focus-within:border-primary-glow focus-within:shadow-[0_0_24px_hsl(var(--primary-glow)/0.4)] transition-all">
                <Search className="w-4 h-4 text-primary-glow shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Pesquisar postagens..."
                  className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Limpar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {query.trim() && (
                <div className="absolute left-0 right-0 mt-2 rounded-2xl border border-border/60 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-fade-in">
                  {results.length === 0 ? (
                    <div className="px-4 py-6 text-sm text-muted-foreground text-center">
                      Nenhuma postagem encontrada.
                    </div>
                  ) : (
                    <ul className="max-h-[60vh] overflow-y-auto divide-y divide-border/40">
                      {results.map((p) => (
                        <li key={p.id}>
                          <button
                            onClick={() => goToPost(p.slug)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-primary/10 transition-colors"
                          >
                            {p.image && (
                              <img
                                src={p.image}
                                alt=""
                                className="w-12 h-12 rounded-md object-cover shrink-0"
                                loading="lazy"
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold text-foreground truncate">
                                {p.title}
                              </div>
                              <div className="text-[11px] uppercase tracking-widest text-primary-glow truncate">
                                {p.tag}
                              </div>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: search icon (always far right) + mobile menu */}
        <div className="flex items-center gap-2 ml-auto">
          {!searchOpen && (
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Pesquisar"
              className={`p-2 rounded-full border border-border/60 text-foreground/90 hover:text-primary-glow hover:border-primary-glow transition-all duration-300 hover:scale-110 hover:shadow-[0_0_18px_hsl(var(--primary-glow)/0.5)] ${
                nearLogo ? "opacity-0 pointer-events-none scale-90" : "opacity-100 scale-100"
              }`}
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {!searchOpen && (
            <button
              onClick={() => setOpen((o) => !o)}
              className="md:hidden p-2 rounded-lg border border-border text-foreground"
              aria-label="Abrir menu"
            >
              <div className="w-5 h-0.5 bg-foreground mb-1" />
              <div className="w-5 h-0.5 bg-foreground mb-1" />
              <div className="w-5 h-0.5 bg-foreground" />
            </button>
          )}
        </div>
      </nav>

      {open && !searchOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/90 backdrop-blur-xl animate-fade-up">
          <ul className="flex flex-col p-4 gap-3">
            <li>
              <Link
                to="/sorteios"
                onClick={() => setOpen(false)}
                data-active={pathname === "/sorteios"}
                className="nav-link flex items-center gap-2 py-2 text-sm uppercase tracking-widest font-semibold"
              >
                <Gift className="w-4 h-4" />
                Sorteios Realizados
              </Link>
            </li>
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