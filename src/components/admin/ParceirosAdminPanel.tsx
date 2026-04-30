import { useRef, useState } from "react";
import { z } from "zod";
import { useParceiros, type Parceiro } from "@/hooks/useParceiros";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().trim().min(2, "Nome muito curto").max(120),
  image: z.string().trim().url("URL inválida").or(z.literal("")),
  description: z.string().trim().max(500).or(z.literal("")),
  link: z.string().trim().url("URL inválida").or(z.literal("")),
  position: z.number().int().min(0).max(9999),
});

type FormState = {
  name: string;
  image: string;
  description: string;
  link: string;
  position: number;
};
const empty: FormState = { name: "", image: "", description: "", link: "", position: 0 };

const ParceirosAdminPanel = () => {
  const { parceiros, create, update, remove, uploadImage } = useParceiros();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const startEdit = (p: Parceiro) => {
    setEditingId(p.id);
    setErrors({});
    setForm({
      name: p.name,
      image: p.image,
      description: p.description,
      link: p.link,
      position: p.position,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setEditingId(null);
    setForm(empty);
    setErrors({});
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Imagem muito grande", description: "Máximo 5 MB", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((f) => ({ ...f, image: url }));
      toast({ title: "Foto enviada" });
    } catch {
      toast({ title: "Erro ao enviar foto", variant: "destructive" });
    } finally {
      setUploading(false);
    }
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
        toast({ title: "Parceiro atualizado" });
      } else {
        await create(r.data);
        toast({ title: "Parceiro adicionado" });
      }
      reset();
    } catch {
      toast({ title: "Erro ao salvar", variant: "destructive" });
    }
  };

  const handleDelete = async (p: Parceiro) => {
    if (!confirm(`Remover "${p.name}"?`)) return;
    try {
      await remove(p.id);
      if (editingId === p.id) reset();
      toast({ title: "Parceiro removido" });
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
          {editingId ? "Editar parceiro" : "Novo parceiro"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2">
            <label className={lbl}>Nome do parceiro *</label>
            <input
              className={inputCls("name")}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex: Studio Indie XYZ"
              maxLength={120}
            />
            {errors.name && <p className="mt-1.5 text-xs text-destructive">{errors.name}</p>}
          </div>

          <div>
            <label className={lbl}>Posição</label>
            <input
              type="number"
              min={0}
              className={inputCls("position")}
              value={form.position}
              onChange={(e) => setForm({ ...form, position: Number(e.target.value) || 0 })}
            />
          </div>

          <div className="md:col-span-3">
            <label className={lbl}>Foto do parceiro</label>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              {form.image && (
                <img
                  src={form.image}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded-full border-2 border-primary/50 shadow-[0_0_20px_hsl(var(--primary-glow)/0.5)]"
                />
              )}
              <div className="flex-1 w-full space-y-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  disabled={uploading}
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-primary/20 file:text-primary-glow hover:file:bg-primary/30 cursor-pointer"
                />
                {uploading && <p className="text-xs text-primary-glow animate-pulse">Enviando...</p>}
                <input
                  className={inputCls("image")}
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="ou cole uma URL: https://..."
                />
                {errors.image && <p className="mt-1 text-xs text-destructive">{errors.image}</p>}
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <label className={lbl}>Descrição</label>
            <textarea
              className={`${inputCls("description")} min-h-[100px] resize-y`}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Pequena descrição do parceiro (opcional)"
              maxLength={500}
            />
            <div className="flex justify-end mt-1">
              <span className="text-xs text-muted-foreground">{form.description.length}/500</span>
            </div>
          </div>

          <div className="md:col-span-3">
            <label className={lbl}>Link externo</label>
            <input
              className={inputCls("link")}
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="https://..."
            />
            {errors.link && <p className="mt-1 text-xs text-destructive">{errors.link}</p>}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            type="submit"
            disabled={uploading}
            className="btn-glow px-6 py-3 rounded-full text-primary-foreground font-bold uppercase tracking-wider text-xs disabled:opacity-50"
          >
            {editingId ? "Salvar alterações" : "Adicionar parceiro"}
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

      <h2 className="text-2xl font-bold mb-6">Parceiros ({parceiros.length})</h2>
      <div className="space-y-3">
        {parceiros.length === 0 && (
          <p className="text-muted-foreground text-center py-10">Nenhum parceiro cadastrado.</p>
        )}
        {parceiros.map((p) => (
          <div key={p.id} className="indie-card p-4 md:p-5 flex flex-col md:flex-row gap-4 items-start md:items-center">
            {p.image && (
              <img
                src={p.image}
                alt={p.name}
                className="w-20 h-20 object-cover rounded-full border-2 border-primary/40"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-primary/20 text-primary-glow border border-primary/40">
                  #{p.position}
                </span>
              </div>
              <h3 className="font-bold truncate">{p.name}</h3>
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
  );
};

export default ParceirosAdminPanel;
