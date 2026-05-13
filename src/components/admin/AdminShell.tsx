import { useEffect, useState } from "react";
import AdminSidebar, { type AdminSection, SECTION_LABELS } from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

interface Props {
  email?: string;
  onSignOut: () => void;
  children: (ctx: {
    section: AdminSection;
    setSection: (s: AdminSection) => void;
    search: string;
  }) => React.ReactNode;
}

const AdminShell = ({ email, onSignOut, children }: Props) => {
  const [section, setSection] = useState<AdminSection>("posts");
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    document.title = `${SECTION_LABELS[section]} — Admin In Game`;
  }, [section]);

  return (
    <div className="admin-shell relative min-h-screen w-full flex">
      <div className="admin-aurora" aria-hidden />
      <AdminSidebar
        active={section}
        onChange={(s) => {
          setSection(s);
          setSearch("");
        }}
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((v) => !v)}
      />
      <div className="relative z-10 flex-1 flex flex-col min-w-0">
        <AdminTopbar
          section={section}
          email={email}
          search={search}
          onSearch={setSearch}
          onSignOut={onSignOut}
        />
        <main className="flex-1 px-6 py-6 overflow-x-hidden">
          <div key={section} className="admin-section-anim h-full">
            {children({ section, setSection, search })}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminShell;
