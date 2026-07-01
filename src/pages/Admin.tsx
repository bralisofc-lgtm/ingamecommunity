import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RotateCcw, LogOut, Sparkles } from "lucide-react";
import { usePosts, type Post } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import AdminShell from "@/components/admin/AdminShell";
import PostList from "@/components/admin/PostList";
import PostEditor from "@/components/admin/PostEditor";
import Placeholder from "@/components/admin/sections/Placeholder";
import FaqAdminPanel from "@/components/admin/FaqAdminPanel";
import ParceirosAdminPanel from "@/components/admin/ParceirosAdminPanel";
import SorteiosAdminPanel from "@/components/admin/SorteiosAdminPanel";
import AdminsPanel from "@/components/admin/sections/AdminsPanel";
import StatsDashboard from "@/components/admin/sections/StatsDashboard";
import LancamentosPanel from "@/components/admin/sections/LancamentosPanel";
import EventosPanel from "@/components/admin/sections/EventosPanel";

type FormState = Omit<Post, "id">;

const emptyForm: FormState = {
  title: "",
  tag: "",
  author: "In Game",
  date: new Date().toISOString().slice(0, 10),
  image: "",
  description: "",
  link: "",
  pinned: false,
  position: 0,
  slug: "",
  subtitle: "",
  content: "",
  featured: false,
  review_grade: "",
  review_note: "",
  review_summary: "",
  review_game_name: "",
  review_tech_info: {},
  author_socials: [],
};

const postToForm = (p: Post): FormState => ({
  title: p.title,
  tag: p.tag,
  author: p.author || "In Game",
  date: p.date,
  image: p.image,
  description: p.description,
  link: p.link,
  pinned: p.pinned,
  position: p.position,
  slug: p.slug || "",
  subtitle: p.subtitle || "",
  content: p.content || "",
  featured: !!p.featured,
  review_grade: p.review_grade || "",
  review_note: p.review_note || "",
  review_summary: p.review_summary || "",
  review_game_name: p.review_game_name || "",
  review_tech_info: p.review_tech_info || {},
  author_socials: Array.isArray(p.author_socials) ? p.author_socials : [],
});

const Admin = () => {
  const { posts, loading, create, update, remove, resetToDefaults } = usePosts();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editing, setEditing] = useState<FormState | null>(null);

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  const startNew = () => {
    setEditingId(null);
    setEditing(emptyForm);
  };
  const startEdit = (p: Post) => {
    setEditingId(p.id);
    setEditing(postToForm(p));
  };
  const startDuplicate = (p: Post) => {
    setEditingId(null);
    setEditing({ ...postToForm(p), title: `${p.title} (cópia)`, slug: "" });
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditing(null);
  };

  const handleSubmit = async (data: FormState) => {
    try {
      if (editingId) {
        await update(editingId, data);
        toast({ title: "Postagem atualizada", description: data.title });
      } else {
        await create(data);
        toast({ title: "Postagem publicada", description: data.title });
      }
      cancelEdit();
    } catch {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    }
  };

  const handleDelete = async (p: Post) => {
    if (!confirm(`Remover "${p.title}"?`)) return;
    try {
      await remove(p.id);
      if (editingId === p.id) cancelEdit();
      toast({ title: "Postagem removida" });
    } catch {
      toast({ title: "Erro ao remover", variant: "destructive" });
    }
  };

  const move = async (p: Post, dir: -1 | 1) => {
    try {
      await update(p.id, { position: (p.position ?? 0) + dir });
    } catch {
      toast({ title: "Erro ao reordenar", variant: "destructive" });
    }
  };

  return (
    <AdminShell email={user?.email ?? undefined} onSignOut={handleSignOut}>
      {({ section, search }) => {
        const editorActive =
          editing && (section === "posts" || section === "reviews");
        if (editorActive && editing) {
          return (
            <PostEditor
              initial={editing}
              editingId={editingId}
              onCancel={cancelEdit}
              onSubmit={handleSubmit}
              onDuplicate={
                editingId
                  ? () => {
                      const p = posts.find((x) => x.id === editingId);
                      if (p) startDuplicate(p);
                    }
                  : undefined
              }
            />
          );
        }

        switch (section) {
          case "dashboard":
            return <StatsDashboard posts={posts} />;

          case "posts":
            return (
              <PostList
                posts={posts}
                loading={loading}
                search={search}
                onSearch={() => {}}
                onNew={startNew}
                onEdit={startEdit}
                onDuplicate={startDuplicate}
                onDelete={handleDelete}
                onMove={move}
                eyebrow="Conteúdo"
                title="Postagens"
              />
            );

          case "reviews":
            return (
              <PostList
                posts={posts}
                loading={loading}
                search={search}
                onSearch={() => {}}
                onNew={() => {
                  setEditingId(null);
                  setEditing({ ...emptyForm, tag: "Review" });
                }}
                onEdit={startEdit}
                onDuplicate={startDuplicate}
                onDelete={handleDelete}
                onMove={move}
                filter={(p) => p.tag === "Review"}
                eyebrow="Conteúdo"
                title="Reviews"
              />
            );

          case "sorteios":
            return <SorteiosAdminPanel />;

          case "lancamentos":
            return <LancamentosPanel />;

          case "eventos":
            return <EventosPanel />;

          case "faqs":
            return (
              <div className="admin-section-anim space-y-5">
                <div>
                  <p className="admin-h-eyebrow mb-1.5">Conteúdo</p>
                  <h1 className="admin-h-title">FAQs</h1>
                </div>
                <div className="admin-card p-5">
                  <FaqAdminPanel />
                </div>
              </div>
            );

          case "parceiros":
            return (
              <div className="admin-section-anim space-y-5">
                <div>
                  <p className="admin-h-eyebrow mb-1.5">Conteúdo</p>
                  <h1 className="admin-h-title">Parceiros</h1>
                </div>
                <div className="admin-card p-5">
                  <ParceirosAdminPanel />
                </div>
              </div>
            );

          case "admins":
            return <AdminsPanel />;

          case "configuracoes":
            return (
              <div className="admin-section-anim max-w-2xl space-y-5">
                <div>
                  <p className="admin-h-eyebrow mb-1.5">Sistema</p>
                  <h1 className="admin-h-title">Configurações</h1>
                </div>
                <div className="admin-card p-5 space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-white mb-1">Conta</p>
                    <p className="text-xs text-white/50">{user?.email ?? "—"}</p>
                  </div>
                  <div className="h-px bg-white/[0.06]" />
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Restaurar postagens de exemplo
                      </p>
                      <p className="text-xs text-white/50 mt-0.5">
                        Substitui todas as postagens pelos exemplos padrão.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!confirm("Restaurar postagens de exemplo? Isso remove todas as postagens atuais.")) return;
                        try {
                          await resetToDefaults();
                          toast({ title: "Restauradas" });
                        } catch {
                          toast({ title: "Erro", variant: "destructive" });
                        }
                      }}
                      className="admin-btn admin-btn-ghost admin-btn-danger shrink-0"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Restaurar
                    </button>
                  </div>
                  <div className="h-px bg-white/[0.06]" />
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="admin-btn admin-btn-ghost admin-btn-danger w-full"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Encerrar sessão
                  </button>
                </div>
              </div>
            );

          default:
            return <Placeholder title="Em breve" icon={Sparkles} />;
        }
      }}
    </AdminShell>
  );
};

export default Admin;
