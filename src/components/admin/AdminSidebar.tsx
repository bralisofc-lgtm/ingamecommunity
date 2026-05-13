import {
  LayoutDashboard,
  FileText,
  Gift,
  Star,
  Sparkles,
  Search,
  Image as ImageIcon,
  BarChart3,
  Palette,
  Settings,
  HelpCircle,
  Users,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import ingameLogo from "@/assets/ingame-logo.png";

export type AdminSection =
  | "dashboard"
  | "posts"
  | "sorteios"
  | "reviews"
  | "destaques"
  | "midias"
  | "seo"
  | "estatisticas"
  | "aparencia"
  | "faqs"
  | "parceiros"
  | "configuracoes";

export const SECTION_LABELS: Record<AdminSection, string> = {
  dashboard: "Dashboard",
  posts: "Posts",
  sorteios: "Sorteios",
  reviews: "Reviews",
  destaques: "Destaques",
  midias: "Mídias",
  seo: "SEO",
  estatisticas: "Estatísticas",
  aparencia: "Aparência",
  faqs: "FAQs",
  parceiros: "Parceiros",
  configuracoes: "Configurações",
};

interface NavItem {
  id: AdminSection;
  icon: React.ComponentType<{ className?: string }>;
  group?: string;
}

const NAV: NavItem[] = [
  { id: "dashboard", icon: LayoutDashboard, group: "Visão geral" },
  { id: "posts", icon: FileText, group: "Conteúdo" },
  { id: "sorteios", icon: Gift, group: "Conteúdo" },
  { id: "reviews", icon: Star, group: "Conteúdo" },
  { id: "destaques", icon: Sparkles, group: "Conteúdo" },
  { id: "faqs", icon: HelpCircle, group: "Conteúdo" },
  { id: "parceiros", icon: Users, group: "Conteúdo" },
  { id: "midias", icon: ImageIcon, group: "Recursos" },
  { id: "seo", icon: Search, group: "Recursos" },
  { id: "estatisticas", icon: BarChart3, group: "Recursos" },
  { id: "aparencia", icon: Palette, group: "Recursos" },
  { id: "configuracoes", icon: Settings, group: "Sistema" },
];

interface Props {
  active: AdminSection;
  onChange: (s: AdminSection) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

const AdminSidebar = ({ active, onChange, collapsed, onToggleCollapsed }: Props) => {
  // Group items preserving order
  const groups: { name: string; items: NavItem[] }[] = [];
  for (const item of NAV) {
    const g = item.group ?? "";
    const last = groups[groups.length - 1];
    if (!last || last.name !== g) groups.push({ name: g, items: [item] });
    else last.items.push(item);
  }

  return (
    <aside
      className={`relative z-10 shrink-0 h-screen sticky top-0 admin-glass border-r border-white/[0.06] flex flex-col transition-[width] duration-300 ease-out ${
        collapsed ? "w-[68px]" : "w-[244px]"
      }`}
    >
      {/* Brand */}
      <div className="relative flex items-center gap-2 px-3 py-4 border-b border-white/[0.05]">
        <div className="relative w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
          <img
            src={ingameLogo}
            alt="In Game"
            className="absolute scale-[2.6] -translate-y-[2px] mix-blend-screen drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
            draggable={false}
          />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-[10px] uppercase tracking-[0.32em] text-white/40 font-semibold">
              In Game
            </p>
            <p className="text-sm font-bold tracking-tight text-white truncate">Admin Studio</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-5">
        {groups.map((g) => (
          <div key={g.name}>
            {!collapsed && g.name && (
              <p className="px-2 mb-1.5 text-[9px] uppercase tracking-[0.3em] text-white/30 font-bold">
                {g.name}
              </p>
            )}
            <ul className="space-y-0.5">
              {g.items.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onChange(item.id)}
                      className={`admin-nav-item w-full ${isActive ? "is-active" : ""} ${
                        collapsed ? "justify-center !px-0" : ""
                      }`}
                      title={collapsed ? SECTION_LABELS[item.id] : undefined}
                      aria-label={SECTION_LABELS[item.id]}
                    >
                      <Icon className="w-[18px] h-[18px] shrink-0" />
                      {!collapsed && <span className="truncate">{SECTION_LABELS[item.id]}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-white/[0.05] p-2">
        <button
          type="button"
          onClick={onToggleCollapsed}
          className={`admin-btn admin-btn-ghost w-full ${collapsed ? "!px-0 justify-center" : ""}`}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? (
            <ChevronsRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronsLeft className="w-4 h-4" />
              <span className="text-[11px]">Recolher</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
