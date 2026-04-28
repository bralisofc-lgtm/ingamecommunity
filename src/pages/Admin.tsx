import { useState } from "react";
import { Link } from "react-router-dom";
import SiteLayout from "@/components/SiteLayout";
import { usePosts, type Post } from "@/hooks/usePosts";
import { toast } from "@/hooks/use-toast";

const emptyForm: Omit<Post, "id"> = {
  title: "",
  tag: "",
  date: new Date().toISOString().slice(0, 10),
  image: "",
  description: "",
  link: "",
};

const Admin = () => {
  const { posts, create, update, remove, resetToDefaults } = usePosts();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Post, "id">>(emptyForm);

  const startEdit = (p: Post) => {
    setEditingId(p.id);
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast({ title: "Título obrigatório", description: "Preencha pelo menos o título da postagem." });
      return;
    }
    if (editingId) {
      update(editingId, form);
      toast({ title: "Postagem atualizada", description: form.title });
    } else {
      create(form);
      toast({ title: "Postagem criada", description: form.title });
    }
    resetForm();
  };

  const handleDelete = (p: Post) => {
    if (confirm(`Remover "${p.title}"?`)) {
      remove(p.id);
      if (editingId === p.id) resetForm();
      toast({ title: "Postagem removida" });
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-secondary/60 border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition text-foreground placeholder:text-muted-foreground";
  const labelClass = "block text-xs font-bold uppercase tracking-widest text-primary-glow mb-2";

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
                Crie, edite e remova postagens. Tudo é salvo neste navegador (localStorage).
              </p>
            </div>
            <Link
              to="/"
              className="text-sm uppercase tracking-widest font-semibold text-muted-foreground hover:text-primary-glow"
            >
              ← Voltar ao site
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="indie-card p-6 md:p-8 mb-12 animate-fade-up">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? "Editar postagem" : "Nova postagem"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className={labelClass}>Título</label>
                <input
                  className={inputClass}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Título da postagem"
                />
              </div>

              <div>
                <label className={labelClass}>Tag / Categoria</label>
                <input
                  className={inputClass}
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  placeholder="Análise, Sorteio, Lista..."
                />
              </div>

              <div>
                <label className={labelClass}>Data</label>
                <input
                  type="date"
                  className={inputClass}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Imagem (URL)</label>
                <input
                  className={inputClass}
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Descrição curta</label>
                <textarea
                  className={inputClass + " min-h-[100px] resize-y"}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Pequeno resumo da postagem..."
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Link externo</label>
                <input
                  className={inputClass}
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="https://..."
                />
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
              onClick={() => {
                if (confirm("Restaurar postagens de exemplo? Isso substitui as atuais.")) {
                  resetToDefaults();
                  toast({ title: "Postagens restauradas" });
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
