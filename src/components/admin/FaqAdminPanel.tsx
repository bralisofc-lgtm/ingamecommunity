import { useState } from "react";
import { z } from "zod";
import { useFaqs, type Faq } from "@/hooks/useFaqs";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  question: z.string().trim().min(3, "Pergunta muito curta").max(200),
  answer: z.string().trim().min(3, "Resposta muito curta").max(4000),
  position: z.number().int().min(0).max(9999),
});

type FormState = { question: string; answer: string; position: number };
const empty: FormState = { question: "", answer: "", position: 0 };

const FaqAdminPanel = () => {
  const { faqs, create, update, remove } = useFaqs();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const startEdit = (f: Faq) => {
    setEditingId(f.id);
    setErrors({});
    setForm({ question: f.question, answer: f.answer, position: f.position });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setEditingId(null);
    setForm(empty);
    setErrors({});
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      const fe: Partial<Record<keyof FormState, string>> = {};
      for (const i of r.error.issues) {
        const k = i.path[0] as keyof FormState;
        if (k && !fe[k]) fe[k] = i.message;
      }
      setErrors(fe);
      toast({ title: "Verifique os campos", variant: "destructive" });
      return;
    }
    try {
      if (editingId) {
        await update(editingId, r.data);
        toast({ title: "FAQ atualizada" });
      } else {
        await create(r.data);
        toast({ title: "FAQ criada" });
      }
      reset();
    } catch {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    }
  };

  const handleDelete = async (f: Faq) => {
    if (!confirm(`Remover "${f.question}"?`)) return;
    try {
      await remove(f.id);
      if (editingId === f.id) reset();
      toast({ title: "FAQ removida" });
    } catch {
      toast({ title: "Erro ao remover", variant: "destructive" });
    }
  };

  const inputBase =
    "w-full px-4 py-3 rounded-xl bg-secondary/60 border focus:outline-none focus:ring-2 transition text-foreground placeholder:text-muted-foreground";
  const inputCls = (k: keyof FormState) =>
    `${inputBase} ${errors[k] ? "border-destructive focus:ring-destructive/30" : "border-border focus:border-primary focus:ring-primary/30"}`;
  const lbl = "block text-xs font-bold uppercase tracking-widest text-primary-glow mb-2";

  return (
    <div>
      <form onSubmit={onSubmit} className="indie-card p-6 md:p-8 mb-10">
        <h2 className="text-2xl font-bold mb-6">
          {editingId ? "Editar FAQ" : "Nova FAQ"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2">
            <label className={lbl}>Pergunta *</label>
            <input
              className={inputCls("question")}
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              placeholder="Ex: 🔍 : Como funciona..."
              maxLength={200}
            />
            {errors.question && <p className="mt-1.5 text-xs text-destructive">{errors.question}</p>}
          </div>

          <div>
            <label className={lbl}>Posição (ordem)</label>
            <input
              type="number"
              min={0}
              className={inputCls("position")}
              value={form.position}
              onChange={(e) => setForm({ ...form, position: Number(e.target.value) || 0 })}
            />
          </div>

          <div className="md:col-span-3">
            <label className={lbl}>Resposta *</label>
            <textarea
              className={`${inputCls("answer")} min-h-[160px] resize-y`}
              value={form.answer}
              onChange={(e) => setForm({ ...form, answer: e.target.value })}
              placeholder="Texto completo da resposta. Você pode usar quebras de linha."
              maxLength={4000}
            />
            <div className="flex justify-between mt-1">
              {errors.answer ? (
                <p className="text-xs text-destructive">{errors.answer}</p>
              ) : <span />}
              <span className="text-xs text-muted-foreground">{form.answer.length}/4000</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            type="submit"
            className="btn-glow px-6 py-3 rounded-full text-primary-foreground font-bold uppercase tracking-wider text-xs"
          >
            {editingId ? "Salvar alterações" : "Publicar FAQ"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={reset}
              className="px-6 py-3 rounded-full border border-border font-bold uppercase tracking-wider text-xs hover:border-primary transition"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h2 className="text-2xl font-bold mb-6">FAQs publicadas ({faqs.length})</h2>
      <div className="space-y-3">
        {faqs.length === 0 && (
          <p className="text-muted-foreground text-center py-10">Nenhuma FAQ cadastrada.</p>
        )}
        {faqs.map((f) => (
          <div key={f.id} className="indie-card p-4 md:p-5 flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-primary/20 text-primary-glow border border-primary/40">
                  #{f.position}
                </span>
              </div>
              <h3 className="font-bold truncate">{f.question}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 whitespace-pre-line">{f.answer}</p>
            </div>
            <div className="flex gap-2 self-stretch md:self-center">
              <button
                onClick={() => startEdit(f)}
                className="px-4 py-2 rounded-lg border border-primary/50 text-primary-glow font-semibold text-xs uppercase tracking-wider hover:bg-primary/10 transition"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(f)}
                className="px-4 py-2 rounded-lg border border-destructive/50 text-destructive font-semibold text-xs uppercase tracking-wider hover:bg-destructive/10 transition"
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqAdminPanel;
