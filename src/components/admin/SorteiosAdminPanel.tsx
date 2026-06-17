import { useRef, useState } from "react";
import { z } from "zod";
import { ArrowDown, ArrowUp, Calendar, Eye, EyeOff } from "lucide-react";
import { useSorteios, type Sorteio, type SorteioStatus } from "@/hooks/useSorteios";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  title: z.string().trim().max(120).or(z.literal("")),
  banner_image: z.string().trim().url("URL inválida"),
  event_date: z.string().min(1, "Informe a data do sorteio"),
  end_date: z.string().optional().or(z.literal("")),
  participate_link: z.string().trim().url("URL inválida").or(z.literal("")),
  active: z.boolean(),
  position: z.number().int().min(0).max(9999),
  status: z.enum(["ativo", "realizado"]),
});

type FormState = {
  title: string;
  banner_image: string;
  event_date: string;
  end_date: string; // datetime-local string
  participate_link: string;
  active: boolean;
  position: number;
  status: SorteioStatus;
};

const empty: FormState = {
  title: "",
  banner_image: "",
  event_date: new Date().toISOString().slice(0, 10),
  end_date: "",
  participate_link: "",
  active: true,
  position: 0,
  status: "ativo",
};

const toFormDate = (iso: string | null) => {
  if (!iso) return "";
  return new Date(iso).toISOString().slice(0, 10);
};

const formatDate = (iso: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const SorteiosAdminPanel = () => {
  const { sorteios, loading, create, update, remove, uploadBanner } = useSorteios();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const startEdit = (s: Sorteio) => {
    setEditingId(s.id);
    setErrors({});
    setForm({
      title: s.title,
      banner_image: s.banner_image,
      event_date: toFormDate(s.event_date) || empty.event_date,
      participate_link: s.participate_link,
      active: s.active,
      position: s.position,
      status: s.status,
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
    if (file.size > 8 * 1024 * 1024) {
      toast({ title: "Imagem muito grande", description: "Máximo 8 MB", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const url = await uploadBanner(file);
      setForm((f) => ({ ...f, banner_image: url }));
      toast({ title: "Banner enviado" });
    } catch {
      toast({ title: "Erro ao enviar banner", variant: "destructive" });
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
    const eventIso = new Date(`${r.data.event_date}T12:00:00Z`).toISOString();
    const payload = {
      title: r.data.title || "",
      banner_image: r.data.banner_image,
      event_date: eventIso,
      participate_link: r.data.participate_link || "",
      active: r.data.active,
      position: r.data.position,
      status: r.data.status,
    };
    try {
      if (editingId) {
        await update(editingId, payload);
        toast({ title: "Sorteio atualizado" });
      } else {
        await create(payload);
        toast({ title: "Sorteio adicionado" });
      }
      reset();
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err?.message, variant: "destructive" });
    }
  };

  const handleDelete = async (s: Sorteio) => {
    if (!confirm(`Remover sorteio "${s.title || formatDate(s.event_date)}"?`)) return;
    try {
      await remove(s.id);
      if (editingId === s.id) reset();
      toast({ title: "Sorteio removido" });
    } catch {
      toast({ title: "Erro ao remover", variant: "destructive" });
    }
  };

  const toggleActive = async (s: Sorteio) => {
    try {
      await update(s.id, { active: !s.active });
    } catch {
      toast({ title: "Erro ao atualizar", variant: "destructive" });
    }
  };

  const move = async (s: Sorteio, dir: -1 | 1) => {
    try {
      await update(s.id, { position: Math.max(0, (s.position ?? 0) + dir) });
    } catch {
      toast({ title: "Erro ao reordenar", variant: "destructive" });
    }
  };

  const inputBase =
    "w-full px-3.5 py-2.5 rounded-lg bg-white/[0.03] border text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 transition";
  const inputCls = (k: keyof FormState) =>
    `${inputBase} ${
      errors[k]
        ? "border-red-500/60 focus:ring-red-500/30"
        : "border-white/[0.08] focus:border-white/30 focus:ring-white/10"
    }`;
  const lbl = "block text-[10px] font-bold uppercase tracking-[0.22em] text-white/50 mb-1.5";

  return (
    <div className="admin-section-anim space-y-5">
      <div>
        <p className="admin-h-eyebrow mb-1.5">Conteúdo</p>
        <h1 className="admin-h-title">Sorteios</h1>
        <p className="text-sm text-white/50 mt-1">
          Defina o sorteio em destaque (ativo) e gerencie o histórico (realizados).
        </p>
      </div>

      <form onSubmit={onSubmit} className="admin-card p-5 md:p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-base font-semibold text-white">
            {editingId ? "Editar sorteio" : "Novo sorteio"}
          </h2>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="sr-only peer"
            />
            <span className="relative w-9 h-5 rounded-full bg-white/10 peer-checked:bg-white/80 transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:rounded-full after:bg-black after:transition-transform peer-checked:after:translate-x-4" />
            <span className="text-xs text-white/70">
              {form.active ? "Visível no site" : "Oculto"}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-4">
            <label className={lbl}>Título / Nome do jogo</label>
            <input
              className={inputCls("title")}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Sorteio Cyberpunk 2077"
              maxLength={120}
            />
          </div>
          <div className="md:col-span-2">
            <label className={lbl}>Ordem</label>
            <input
              type="number"
              min={0}
              className={inputCls("position")}
              value={form.position}
              onChange={(e) => setForm({ ...form, position: Number(e.target.value) || 0 })}
            />
          </div>

          <div className="md:col-span-3">
            <label className={lbl}>Status do sorteio *</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setForm({ ...form, status: "ativo" })}
                className={`flex-1 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition ${
                  form.status === "ativo"
                    ? "bg-emerald-500/20 border-emerald-400/60 text-emerald-200 shadow-[0_0_18px_hsl(var(--primary-glow)/0.35)]"
                    : "bg-white/[0.03] border-white/10 text-white/50 hover:border-white/25"
                }`}
              >
                Ativo (Hero)
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, status: "realizado" })}
                className={`flex-1 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition ${
                  form.status === "realizado"
                    ? "bg-red-500/20 border-red-400/60 text-red-200"
                    : "bg-white/[0.03] border-white/10 text-white/50 hover:border-white/25"
                }`}
              >
                Realizado
              </button>
            </div>
          </div>

          <div className="md:col-span-3">
            <label className={lbl}>Data do sorteio *</label>
            <input
              type="date"
              className={inputCls("event_date")}
              value={form.event_date}
              onChange={(e) => setForm({ ...form, event_date: e.target.value })}
            />
            {errors.event_date && (
              <p className="mt-1 text-[11px] text-red-400">{errors.event_date}</p>
            )}
          </div>

          <div className="md:col-span-6">
            <label className={lbl}>
              Link de participação {form.status === "ativo" && "(botão Participar Agora)"}
            </label>
            <input
              className={inputCls("participate_link")}
              value={form.participate_link}
              onChange={(e) => setForm({ ...form, participate_link: e.target.value })}
              placeholder="https://..."
            />
            {errors.participate_link && (
              <p className="mt-1 text-[11px] text-red-400">{errors.participate_link}</p>
            )}
          </div>

          <div className="md:col-span-6">
            <label className={lbl}>Banner (1400 × 300 recomendado)</label>
            <div className="flex flex-col gap-3">
              {form.banner_image && (
                <div className="rounded-xl overflow-hidden border border-white/10 bg-black">
                  <img
                    src={form.banner_image}
                    alt="preview"
                    className="w-full aspect-[1400/300] object-cover"
                  />
                </div>
              )}
              <div className="flex flex-col md:flex-row gap-3 md:items-center">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  disabled={uploading}
                  className="block flex-1 text-xs text-white/60 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-wider file:bg-white/10 file:text-white hover:file:bg-white/20 cursor-pointer"
                />
                {uploading && (
                  <span className="text-xs text-white/60 animate-pulse">Enviando...</span>
                )}
              </div>
              <input
                className={inputCls("banner_image")}
                value={form.banner_image}
                onChange={(e) => setForm({ ...form, banner_image: e.target.value })}
                placeholder="ou cole uma URL: https://..."
              />
              {errors.banner_image && (
                <p className="text-[11px] text-red-400">{errors.banner_image}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button type="submit" disabled={uploading} className="admin-btn admin-btn-primary">
            {editingId ? "Salvar alterações" : "Adicionar sorteio"}
          </button>
          {editingId && (
            <button type="button" onClick={reset} className="admin-btn admin-btn-ghost">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="admin-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">
            Sorteios cadastrados{" "}
            <span className="text-white/40 font-normal">({sorteios.length})</span>
          </h2>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[0, 1].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-white/[0.03] animate-pulse" />
            ))}
          </div>
        ) : sorteios.length === 0 ? (
          <p className="text-sm text-white/40 text-center py-10">
            Nenhum sorteio cadastrado ainda.
          </p>
        ) : (
          <ul className="space-y-3">
            {sorteios.map((s) => (
              <li
                key={s.id}
                className="flex flex-col md:flex-row gap-4 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/15 transition-colors"
              >
                <div className="w-full md:w-44 shrink-0 aspect-[1400/300] md:aspect-auto md:h-20 rounded-lg overflow-hidden bg-black/40 border border-white/5">
                  {s.banner_image ? (
                    <img
                      src={s.banner_image}
                      alt={s.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-white/30 text-xs">
                      sem banner
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-white/10 text-white/70">
                      #{s.position}
                    </span>
                    {s.status === "ativo" ? (
                      <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        Ativo
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-red-500/15 text-red-300 border border-red-500/40">
                        Realizado
                      </span>
                    )}
                    {!s.active && (
                      <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-white/5 text-white/40 border border-white/10">
                        Oculto
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-white truncate">
                    {s.title || "Sorteio sem título"}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-white/50 mt-0.5">
                    <Calendar className="w-3 h-3" />
                    {formatDate(s.event_date)}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 self-stretch md:self-center">
                  <button
                    type="button"
                    onClick={() => move(s, -1)}
                    className="admin-btn admin-btn-ghost !px-2"
                    title="Subir"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(s, 1)}
                    className="admin-btn admin-btn-ghost !px-2"
                    title="Descer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleActive(s)}
                    className="admin-btn admin-btn-ghost !px-2"
                    title={s.active ? "Ocultar" : "Mostrar"}
                  >
                    {s.active ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(s)}
                    className="admin-btn admin-btn-ghost"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(s)}
                    className="admin-btn admin-btn-ghost admin-btn-danger"
                  >
                    Remover
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SorteiosAdminPanel;
