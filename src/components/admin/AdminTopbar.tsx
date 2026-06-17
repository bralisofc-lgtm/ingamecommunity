import { Search, ExternalLink, LogOut, ChevronRight, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { SECTION_LABELS, type AdminSection } from "./AdminSidebar";

interface Props {
  section: AdminSection;
  email?: string;
  search: string;
  onSearch: (s: string) => void;
  onSignOut: () => void;
  onOpenMobileMenu: () => void;
}

const AdminTopbar = ({
  section,
  email,
  search,
  onSearch,
  onSignOut,
  onOpenMobileMenu,
}: Props) => {
  return (
    <header className="sticky top-0 z-20 admin-glass border-b border-white/[0.06]">
      <div className="flex items-center gap-2 md:gap-3 px-3 md:px-5 py-2.5 md:py-3">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden admin-btn admin-btn-ghost !p-2"
          aria-label="Abrir menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[10px] md:text-[11px] uppercase tracking-[0.18em] md:tracking-[0.2em] min-w-0">
          <span className="text-white/40 hidden sm:inline">Admin</span>
          <ChevronRight className="w-3 h-3 text-white/20 hidden sm:inline" />
          <span className="text-white font-semibold truncate">{SECTION_LABELS[section]}</span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] focus-within:border-white/30 transition-colors min-w-[220px] lg:min-w-[260px]">
          <Search className="w-3.5 h-3.5 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Buscar conteúdo…"
            className="bg-transparent outline-none text-sm text-white placeholder:text-white/30 w-full"
          />
          <kbd className="hidden lg:inline text-[10px] text-white/30 px-1.5 py-0.5 rounded border border-white/10">
            ⌘K
          </kbd>
        </div>

        {/* Site link */}
        <Link to="/" className="admin-btn admin-btn-ghost !px-2 md:!px-3" title="Abrir site">
          <ExternalLink className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Site</span>
        </Link>

        {/* User */}
        <div className="hidden lg:flex items-center gap-2 pl-3 ml-1 border-l border-white/[0.06]">
          <div className="w-7 h-7 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-[11px] font-bold text-white">
            {(email?.[0] ?? "A").toUpperCase()}
          </div>
          {email && (
            <span className="text-xs text-white/60 truncate max-w-[180px]">{email}</span>
          )}
        </div>

        <button
          type="button"
          onClick={onSignOut}
          className="admin-btn admin-btn-ghost admin-btn-danger !px-2 md:!px-3"
          title="Sair"
          aria-label="Sair"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  );
};

export default AdminTopbar;
