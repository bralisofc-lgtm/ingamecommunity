import {
  LayoutDashboard,
  FileText,
  Gift,
  Star,
  HelpCircle,
  Users,
  Shield,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  X,
  Gamepad2,
  CalendarDays,
} from "lucide-react";

export type AdminSection =
  | "dashboard"
  | "posts"
  | "sorteios"
  | "reviews"
  | "lancamentos"
  | "eventos"
  | "faqs"
  | "parceiros"
  | "admins"
  | "configuracoes";

export const SECTION_LABELS: Record<AdminSection, string> = {
  dashboard: "Dashboard",
  posts: "Posts",
  sorteios: "Sorteios",
  reviews: "Reviews",
  lancamentos: "Lançamentos",
  eventos: "Eventos",
  faqs: "FAQs",
  parceiros: "Parceiros",
  admins: "Administradores",
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
  { id: "lancamentos", icon: Gamepad2, group: "Hub Indies" },
  { id: "eventos", icon: CalendarDays, group: "Hub Indies" },
  { id: "faqs", icon: HelpCircle, group: "Conteúdo" },
  { id: "parceiros", icon: Users, group: "Conteúdo" },
  { id: "admins", icon: Shield, group: "Sistema" },
  { id: "configuracoes", icon: Settings, group: "Sistema" },
];

interface Props {
  active: AdminSection;
  onChange: (s: AdminSection) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const AdminSidebar = ({
  active,
  onChange,
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
}: Props) => {
  const groups: { name: string; items: NavItem[] }[] = [];
  for (const item of NAV) {
    const g = item.group ?? "";
    const last = groups[groups.length - 1];
    if (!last || last.name !== g) groups.push({ name: g, items: [item] });
    else last.items.push(item);
  }

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onCloseMobile}
        aria-hidden
      />

      <aside
        className={`admin-glass border-r border-white/[0.06] flex flex-col
          fixed lg:sticky top-0 left-0 z-50 h-screen lg:h-screen
          transition-transform duration-300 ease-out lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${collapsed ? "lg:w-[68px]" : "lg:w-[244px]"}
          w-[260px] shrink-0`}
        style={{ transitionProperty: "transform, width" }}
      >
        <div className="relative flex items-center justify-between px-3 py-4 border-b border-white/[0.05] h-[65px]">
          {!collapsed && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-white/40 font-semibold">
                In Game
              </p>
              <p className="text-sm font-bold tracking-tight text-white truncate">Admin Studio</p>
            </div>
          )}
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden admin-btn admin-btn-ghost !p-2"
            aria-label="Fechar menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

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
                        onClick={() => {
                          onChange(item.id);
                          onCloseMobile();
                        }}
                        className={`admin-nav-item w-full ${isActive ? "is-active" : ""} ${
                          collapsed ? "lg:justify-center lg:!px-0" : ""
                        }`}
                        title={collapsed ? SECTION_LABELS[item.id] : undefined}
                        aria-label={SECTION_LABELS[item.id]}
                      >
                        <Icon className="w-[18px] h-[18px] shrink-0" />
                        <span className={`truncate ${collapsed ? "lg:hidden" : ""}`}>
                          {SECTION_LABELS[item.id]}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/[0.05] p-2 hidden lg:block">
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
    </>
  );
};

export default AdminSidebar;
