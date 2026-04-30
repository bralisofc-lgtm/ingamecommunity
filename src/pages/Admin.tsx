import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import SiteLayout from "@/components/SiteLayout";
import { usePosts, type Post } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { POST_TAGS } from "@/lib/tags";
import FaqAdminPanel from "@/components/admin/FaqAdminPanel";
import ParceirosAdminPanel from "@/components/admin/ParceirosAdminPanel";

type AdminTab = "posts" | "faqs" | "parceiros";

const postSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "Título precisa ter pelo menos 3 caracteres." })
    .max(120, { message: "Título deve ter no máximo 120 caracteres." }),
  tag: z
    .enum(POST_TAGS, { message: "Selecione uma tag válida." })
    .or(z.literal(""))
    .optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Data inválida (use AAAA-MM-DD)." }),
  image: z
    .string()
    .trim()
    .max(2000, { message: "URL da imagem muito longa." })
    .url({ message: "URL da imagem inválida." })
    .optional()
    .or(z.literal("")),
  description: z
    .string()
    .trim()
    .max(500, { message: "Descrição deve ter no máximo 500 caracteres." })
    .optional()
    .or(z.literal("")),
  link: z
    .string()
    .trim()
    .max(2000, { message: "Link muito longo." })
    .url({ message: "Link externo inválido." })
    .optional()
    .or(z.literal("")),
});

type FormState = Omit<Post, "id">;
type FieldErrors = Partial<Record<keyof FormState, string>>;

const emptyForm: FormState = {
  title: "",
  tag: "",
  date: new Date().toISOString().slice(0, 10),
  image: "",
  description: "",
  link: "",
};

const Admin = () => {
  const { posts, create, update, remove, resetToDefaults } = usePosts();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<AdminTab>("posts");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };


  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const startEdit = (p: Post) => {
    setEditingId(p.id);
    setErrors({});
    setForm({
      title: p.title,
      tag: p.tag,
      date: p.date,
      image: p.image,
      description: p.description,
      link: p.link,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = postSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FormState;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      toast({
        title: "Verifique os campos",
        description: "Há erros de validação no formulário.",
        variant: "destructive",
      });
      return;
    }
    const clean: FormState = {
      title: result.data.title,
      tag: result.data.tag ?? "",
      date: result.data.date,
      image: result.data.image ?? "",
      description: result.data.description ?? "",
      link: result.data.link ?? "",
    };
    try {
      if (editingId) {
        await update(editingId, clean);
        toast({ title: "Postagem atualizada", description: clean.title });
      } else {
        await create(clean);
        toast({ title: "Postagem publicada", description: clean.title });
      }
      resetForm();
    } catch (err) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a postagem. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (p: Post) => {
    if (confirm(`Remover "${p.title}"?`)) {
      try {
        await remove(p.id);
        if (editingId === p.id) resetForm();
        toast({ title: "Postagem removida" });
      } catch {
        toast({ title: "Erro ao remover", variant: "destructive" });
      }
    }
  };

  const inputBase =
    "w-full px-4 py-3 rounded-xl bg-secondary/60 border focus:outline-none focus:ring-2 transition text-foreground placeholder:text-muted-foreground";
  const inputClass = (field: keyof FormState) =>
    `${inputBase} ${
      errors[field]
        ? "border-destructive focus:ring-destructive/30"
        : "border-border focus:border-primary focus:ring-primary/30"
    }`;
  const labelClass = "block text-xs font-bold uppercase tracking-widest text-primary-glow mb-2";
  const errorClass = "mt-1.5 text-xs text-destructive font-medium";

  return (
    <SiteLayout title="Admin — In Game" description="Painel de administração das postagens da In Game.">
      <section className="pt-28 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8 animate-fade-up">
            <div>
              <p className="text-primary-glow uppercase tracking-[0.3em] text-xs font-bold mb-2">Painel oculto</p>
              <h1 className="text-4xl md:text-5xl font-black">
                Gerenciar <span className="text-gradient">postagens</span>
              </h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Crie, edite e remova postagens. Todas ficam visíveis para qualquer visitante do site.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              {user?.email && (
                <span className="text-xs text-muted-foreground">
                  Logado como <span className="text-primary-glow font-semibold">{user.email}</span>
                </span>
              )}
              <div className="flex items-center gap-4">
                <Link
                  to="/"
                  className="text-sm uppercase tracking-widest font-semibold text-muted-foreground hover:text-primary-glow"
                >
                  ← Voltar ao site
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm uppercase tracking-widest font-semibold text-destructive hover:text-destructive/80"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>


          {/* Form */}
          <form onSubmit={handleSubmit} className="indie-card p-6 md:p-8 mb-12 animate-fade-up">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? "Editar postagem" : "Nova postagem"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className={labelClass}>Título *</label>
                <input
                  className={inputClass("title")}
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Título da postagem"
                  maxLength={120}
                />
                {errors.title && <p className={errorClass}>{errors.title}</p>}
              </div>

              <div>
                <label className={labelClass}>Tag / Categoria</label>
                <select
                  className={inputClass("tag")}
                  value={form.tag}
                  onChange={(e) => updateField("tag", e.target.value)}
                >
                  <option value="">Selecione uma tag...</option>
                  {POST_TAGS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                {errors.tag && <p className={errorClass}>{errors.tag}</p>}
              </div>

              <div>
                <label className={labelClass}>Data</label>
                <input
                  type="date"
                  className={inputClass("date")}
                  value={form.date}
                  onChange={(e) => updateField("date", e.target.value)}
                />
                {errors.date && <p className={errorClass}>{errors.date}</p>}
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Imagem (URL)</label>
                <input
                  className={inputClass("image")}
                  value={form.image}
                  onChange={(e) => updateField("image", e.target.value)}
                  placeholder="https://..."
                  maxLength={2000}
                />
                {errors.image && <p className={errorClass}>{errors.image}</p>}
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Descrição curta</label>
                <textarea
                  className={`${inputClass("description")} min-h-[100px] resize-y`}
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Pequeno resumo da postagem..."
                  maxLength={500}
                />
                <div className="flex justify-between mt-1">
                  {errors.description ? (
                    <p className={errorClass}>{errors.description}</p>
                  ) : <span />}
                  <span className="text-xs text-muted-foreground">
                    {form.description.length}/500
                  </span>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Link externo</label>
                <input
                  className={inputClass("link")}
                  value={form.link}
                  onChange={(e) => updateField("link", e.target.value)}
                  placeholder="https://..."
                  maxLength={2000}
                />
                {errors.link && <p className={errorClass}>{errors.link}</p>}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                type="submit"
                className="btn-glow px-6 py-3 rounded-full text-primary-foreground font-bold uppercase tracking-wider text-xs"
              >
                {editingId ? "Salvar alterações" : "Publicar postagem"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded-full border border-border font-bold uppercase tracking-wider text-xs hover:border-primary transition"
                >
                  Cancelar edição
                </button>
              )}
            </div>
          </form>

          {/* List */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Postagens publicadas ({posts.length})</h2>
            <button
              onClick={async () => {
                if (confirm("Restaurar postagens de exemplo? Isso substitui as atuais.")) {
                  try {
                    await resetToDefaults();
                    toast({ title: "Postagens restauradas" });
                  } catch {
                    toast({ title: "Erro ao restaurar", variant: "destructive" });
                  }
                }
              }}
              className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary-glow"
            >
              Restaurar exemplos
            </button>
          </div>

          <div className="space-y-3">
            {posts.length === 0 && (
              <p className="text-muted-foreground text-center py-10">Nenhuma postagem cadastrada.</p>
            )}
            {posts.map((p) => (
              <div
                key={p.id}
                className="indie-card p-4 md:p-5 flex flex-col md:flex-row gap-4 items-start md:items-center"
              >
                {p.image && (
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full md:w-32 h-24 object-cover rounded-lg border border-border"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {p.tag && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-primary/20 text-primary-glow border border-primary/40">
                        {p.tag}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">{p.date}</span>
                  </div>
                  <h3 className="font-bold truncate">{p.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                </div>
                <div className="flex gap-2 self-stretch md:self-center">
                  <button
                    onClick={() => startEdit(p)}
                    className="px-4 py-2 rounded-lg border border-primary/50 text-primary-glow font-semibold text-xs uppercase tracking-wider hover:bg-primary/10 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(p)}
                    className="px-4 py-2 rounded-lg border border-destructive/50 text-destructive font-semibold text-xs uppercase tracking-wider hover:bg-destructive/10 transition"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Admin;
