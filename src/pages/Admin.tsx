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
import { Pin, ArrowUp, ArrowDown } from "lucide-react";

type AdminTab = "posts" | "faqs" | "parceiros";

const postSchema = z.object({
  title: z.string().trim().min(3, { message: "Título precisa ter pelo menos 3 caracteres." }).max(120),
  tag: z.enum(POST_TAGS, { message: "Selecione uma tag válida." }),
  author: z.string().trim().min(2, { message: "Informe o autor." }).max(80),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Data inválida." }),
  image: z.string().trim().max(2000).url({ message: "URL da imagem inválida." }).optional().or(z.literal("")),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  link: z.string().trim().max(2000).url({ message: "Link inválido." }).optional().or(z.literal("")),
  pinned: z.boolean(),
  position: z.number().int(),
  slug: z.string().trim().max(160).optional().or(z.literal("")),
  subtitle: z.string().trim().max(200).optional().or(z.literal("")),
  content: z.string().max(50000).optional().or(z.literal("")),
  featured: z.boolean(),
  review_grade: z.string().trim().max(3).optional().or(z.literal("")),
  review_note: z.string().trim().max(500).optional().or(z.literal("")),
  review_summary: z.string().trim().max(800).optional().or(z.literal("")),
  review_game_name: z.string().trim().max(160).optional().or(z.literal("")),
  review_tech_info: z.record(z.string(), z.string()).optional(),
  author_socials: z.array(z.string().trim().max(2000)).max(3).optional(),
});

type FormState = Omit<Post, "id">;
type FieldErrors = Partial<Record<keyof FormState, string>>;

const TECH_FIELDS: { key: string; label: string }[] = [
  { key: "publisher", label: "Publisher" },
  { key: "developer", label: "Desenvolvedora" },
  { key: "platforms", label: "Plataformas" },
  { key: "release_date", label: "Data de lançamento" },
  { key: "play_time", label: "Tempo jogado/review" },
  { key: "category", label: "Categoria" },
  { key: "status", label: "Status" },
  { key: "engine", label: "Engine" },
  { key: "mode", label: "Multi/Singleplayer" },
];

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
      toast({ title: "Verifique os campos", description: "Há erros de validação.", variant: "destructive" });
      return;
    }
    const clean: FormState = {
      title: result.data.title,
      tag: result.data.tag,
      author: result.data.author,
      date: result.data.date,
      image: result.data.image ?? "",
      description: result.data.description ?? "",
      link: result.data.link ?? "",
      pinned: result.data.pinned,
      position: result.data.position,
      slug: result.data.slug ?? "",
      subtitle: result.data.subtitle ?? "",
      content: result.data.content ?? "",
      featured: result.data.featured,
      review_grade: (result.data.review_grade ?? "").toUpperCase(),
      review_note: result.data.review_note ?? "",
      review_summary: result.data.review_summary ?? "",
      review_game_name: result.data.review_game_name ?? "",
      review_tech_info: (result.data.review_tech_info ?? {}) as Record<string, string>,
      author_socials: (result.data.author_socials ?? []).map((s) => s.trim()).filter(Boolean).slice(0, 3),
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
    } catch {
      toast({ title: "Erro ao salvar", variant: "destructive" });
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

  const togglePin = async (p: Post) => {
    try {
      await update(p.id, { pinned: !p.pinned });
    } catch {
      toast({ title: "Erro ao fixar", variant: "destructive" });
    }
  };

  const move = async (p: Post, dir: -1 | 1) => {
    try {
      await update(p.id, { position: (p.position ?? 0) + dir });
    } catch {
      toast({ title: "Erro ao reordenar", variant: "destructive" });
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
            </div>
            <div className="flex flex-col items-end gap-2">
              {user?.email && (
                <span className="text-xs text-muted-foreground">
                  Logado como <span className="text-primary-glow font-semibold">{user.email}</span>
                </span>
              )}
              <div className="flex items-center gap-4">
                <Link to="/" className="text-sm uppercase tracking-widest font-semibold text-muted-foreground hover:text-primary-glow">
                  ← Voltar ao site
                </Link>
                <button onClick={handleSignOut} className="text-sm uppercase tracking-widest font-semibold text-destructive hover:text-destructive/80">
                  Sair
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-10 border-b border-border/50 pb-2">
            {([
              { id: "posts", label: "Postagens" },
              { id: "faqs", label: "FAQs" },
              { id: "parceiros", label: "Parceiros" },
            ] as { id: AdminTab; label: string }[]).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all ${
                  tab === t.id
                    ? "bg-primary text-primary-foreground border-primary-glow shadow-[0_0_20px_hsl(var(--primary-glow)/0.7)]"
                    : "border-border text-muted-foreground hover:border-primary-glow hover:text-primary-glow"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "posts" && (<>
          <form onSubmit={handleSubmit} className="indie-card p-6 md:p-8 mb-12 animate-fade-up">
            <h2 className="text-2xl font-bold mb-6">{editingId ? "Editar postagem" : "Nova postagem"}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className={labelClass}>Título *</label>
                <input className={inputClass("title")} value={form.title} onChange={(e) => updateField("title", e.target.value)} placeholder="Título da postagem" maxLength={120} />
                {errors.title && <p className={errorClass}>{errors.title}</p>}
              </div>

              <div>
                <label className={labelClass}>Categoria *</label>
                <select className={inputClass("tag")} value={form.tag} onChange={(e) => updateField("tag", e.target.value)}>
                  <option value="">Selecione...</option>
                  {POST_TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.tag && <p className={errorClass}>{errors.tag}</p>}
              </div>

              <div>
                <label className={labelClass}>Autor *</label>
                <input className={inputClass("author")} value={form.author} onChange={(e) => updateField("author", e.target.value)} placeholder="Nome do autor" maxLength={80} />
                {errors.author && <p className={errorClass}>{errors.author}</p>}
              </div>

              <div>
                <label className={labelClass}>Data</label>
                <input type="date" className={inputClass("date")} value={form.date} onChange={(e) => updateField("date", e.target.value)} />
                {errors.date && <p className={errorClass}>{errors.date}</p>}
              </div>

              <div>
                <label className={labelClass}>Posição (ordem manual)</label>
                <input type="number" className={inputClass("position")} value={form.position} onChange={(e) => updateField("position", Number(e.target.value) || 0)} />
                <p className="mt-1 text-[11px] text-muted-foreground">Menor = aparece primeiro. Use 0 para ordenar pela data.</p>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Imagem (URL)</label>
                <input className={inputClass("image")} value={form.image} onChange={(e) => updateField("image", e.target.value)} placeholder="https://..." maxLength={2000} />
                {errors.image && <p className={errorClass}>{errors.image}</p>}
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Descrição curta</label>
                <textarea className={`${inputClass("description")} min-h-[100px] resize-y`} value={form.description} onChange={(e) => updateField("description", e.target.value)} maxLength={500} />
                {errors.description && <p className={errorClass}>{errors.description}</p>}
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Link externo</label>
                <input className={inputClass("link")} value={form.link} onChange={(e) => updateField("link", e.target.value)} placeholder="https://..." maxLength={2000} />
                {errors.link && <p className={errorClass}>{errors.link}</p>}
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Subtítulo (opcional)</label>
                <input className={inputClass("subtitle")} value={form.subtitle} onChange={(e) => updateField("subtitle", e.target.value)} placeholder="Ex: Análise completa após 40 horas" maxLength={200} />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Slug (URL)</label>
                <input className={inputClass("slug")} value={form.slug} onChange={(e) => updateField("slug", e.target.value)} placeholder="deixe vazio para gerar automaticamente" maxLength={160} />
                <p className="mt-1 text-[11px] text-muted-foreground">URL final: /post/{form.slug || "(gerado-do-titulo)"}</p>
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Conteúdo do artigo (Markdown)</label>
                <textarea
                  className={`${inputClass("content")} min-h-[280px] resize-y font-mono text-sm leading-relaxed`}
                  value={form.content}
                  onChange={(e) => updateField("content", e.target.value)}
                  maxLength={50000}
                  placeholder={`# Título\n\nParágrafo normal com **negrito** e *itálico*.\n\n![](https://link-da-imagem.jpg)\n\n" Esta é uma citação destacada "\n\n- item de lista\n- outro item`}
                />
                <p className="mt-1 text-[11px] text-muted-foreground">Use <code>![](url)</code> para imagens e <code>" texto "</code> para citações.</p>
              </div>

              {form.tag === "Review" && (
                <>
                  <div className="md:col-span-2 mt-2 p-5 rounded-2xl border border-primary/30 bg-primary/5 space-y-5">
                    <div className="flex items-center gap-3">
                      <span className="inline-block w-2 h-2 rounded-full bg-primary-glow shadow-[0_0_10px_hsl(var(--primary-glow))]" />
                      <h3 className="text-sm font-black uppercase tracking-[0.25em] text-primary-glow">Bloco de Nota Final da Review</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>Classificação</label>
                        <select
                          className={inputClass("review_grade")}
                          value={form.review_grade}
                          onChange={(e) => updateField("review_grade", e.target.value)}
                        >
                          <option value="">— sem classificação —</option>
                          {["S+","S","S-","A+","A","A-","B+","B","B-","C+","C","C-","D+","D","D-"].map(g => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Nome do jogo / expansão</label>
                        <input
                          className={inputClass("review_game_name")}
                          value={form.review_game_name}
                          onChange={(e) => updateField("review_game_name", e.target.value)}
                          placeholder="Ex: Diablo IV — Lord of Hatred"
                          maxLength={160}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Conclusão / opinião final</label>
                      <textarea
                        className={`${inputClass("review_summary")} min-h-[100px] resize-y`}
                        value={form.review_summary}
                        onChange={(e) => updateField("review_summary", e.target.value)}
                        maxLength={800}
                        placeholder="Uma breve conclusão sobre o jogo, expansão ou experiência analisada."
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Texto curto ao lado da nota</label>
                      <textarea
                        className={`${inputClass("review_note")} min-h-[80px] resize-y`}
                        value={form.review_note}
                        onChange={(e) => updateField("review_note", e.target.value)}
                        maxLength={500}
                        placeholder="Frase curta de impacto exibida ao lado da nota."
                      />
                    </div>

                    <div>
                      <p className={labelClass}>Informações técnicas (deixe vazio para ocultar)</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {TECH_FIELDS.map((f) => (
                          <div key={f.key}>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">{f.label}</label>
                            <input
                              className={`${inputBase} border-border focus:border-primary focus:ring-primary/30`}
                              value={form.review_tech_info?.[f.key] || ""}
                              onChange={(e) => updateField("review_tech_info", { ...(form.review_tech_info || {}), [f.key]: e.target.value })}
                              placeholder={f.label}
                              maxLength={120}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="md:col-span-2 flex flex-wrap gap-6">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.pinned} onChange={(e) => updateField("pinned", e.target.checked)} className="w-4 h-4 accent-primary" />
                  <span className="text-sm font-bold uppercase tracking-widest text-primary-glow">Fixar postagem</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => updateField("featured", e.target.checked)} className="w-4 h-4 accent-primary" />
                  <span className="text-sm font-bold uppercase tracking-widest text-primary-glow">Destaque</span>
                </label>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <button type="submit" className="btn-glow px-6 py-3 rounded-full text-primary-foreground font-bold uppercase tracking-wider text-xs">
                {editingId ? "Salvar alterações" : "Publicar postagem"}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="px-6 py-3 rounded-full border border-border font-bold uppercase tracking-wider text-xs hover:border-primary transition">
                  Cancelar edição
                </button>
              )}
            </div>
          </form>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Postagens publicadas ({posts.length})</h2>
            <button
              onClick={async () => {
                if (confirm("Restaurar postagens de exemplo?")) {
                  try { await resetToDefaults(); toast({ title: "Restauradas" }); }
                  catch { toast({ title: "Erro", variant: "destructive" }); }
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
              <div key={p.id} className="indie-card p-4 md:p-5 flex flex-col md:flex-row gap-4 items-start md:items-center">
                {p.image && (
                  <img src={p.image} alt={p.title} className="w-full md:w-32 h-24 object-cover rounded-lg border border-border" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {p.tag && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-primary/20 text-primary-glow border border-primary/40">
                        {p.tag}
                      </span>
                    )}
                    {p.pinned && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-primary text-primary-foreground">
                        <Pin className="w-3 h-3" /> Fixo
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">por {p.author}</span>
                    <span className="text-xs text-muted-foreground">• pos {p.position}</span>
                  </div>
                  <h3 className="font-bold truncate">{p.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                </div>
                <div className="flex flex-wrap gap-2 self-stretch md:self-center">
                  <button onClick={() => move(p, -1)} title="Subir" className="px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-primary-glow hover:border-primary-glow transition">
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => move(p, 1)} title="Descer" className="px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-primary-glow hover:border-primary-glow transition">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => togglePin(p)} title={p.pinned ? "Desfixar" : "Fixar"} className={`px-3 py-2 rounded-lg border font-semibold text-xs uppercase transition ${p.pinned ? "bg-primary text-primary-foreground border-primary-glow" : "border-primary/40 text-primary-glow hover:bg-primary/10"}`}>
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => startEdit(p)} className="px-4 py-2 rounded-lg border border-primary/50 text-primary-glow font-semibold text-xs uppercase tracking-wider hover:bg-primary/10 transition">
                    Editar
                  </button>
                  <button onClick={() => handleDelete(p)} className="px-4 py-2 rounded-lg border border-destructive/50 text-destructive font-semibold text-xs uppercase tracking-wider hover:bg-destructive/10 transition">
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
          </>)}

          {tab === "faqs" && <FaqAdminPanel />}
          {tab === "parceiros" && <ParceirosAdminPanel />}
        </div>
      </section>
    </SiteLayout>
  );
};

export default Admin;
