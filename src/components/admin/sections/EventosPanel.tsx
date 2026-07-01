import { useRef, useState } from "react";
import { Plus, Trash2, Star, StarOff, Loader2, Save, X, Upload } from "lucide-react";
import { useLancamentos, type Evento } from "@/hooks/useLancamentos";
import { toast } from "@/hooks/use-toast";

type Form = Omit<Evento, "id">;
const empty: Form = {
  nome: "",
  data: new Date().toISOString().slice(0, 10),
  horario: null,
  banner_url: "",
  descricao: "",
  link: "",
  destaque: false,
};

const EventosPanel = () => {
  const { eventos, createEvento, updateEvento, deleteEvento, uploadEventoBanner } =
    useLancamentos();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Form>(empty);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const cancel = () => {
    setEditingId(null);
    setForm(empty);
  };
  const startEdit = (e: Evento) => {
    setEditingId(e.id);
    setForm({
      nome: e.nome,
      data: e.data,
      horario: e.horario,
      banner_url: e.banner_url ?? "",
      descricao: e.descricao ?? "",
      link: e.link ?? "",
      destaque: e.destaque,
    });
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setSaving(true);
    try {
      const payload: Form = {
        ...form,
        horario: form.horario || null,
        banner_url: form.banner_url || null,
        descricao: form.descricao || null,
        link: form.link || null,
      };
      if (editingId) await updateEvento(editingId, payload);
      else await createEvento(payload);
      toast({ title: editingId ? "Evento atualizado" : "Evento adicionado" });
      cancel();
    } catch (e: any) {
      toast({ title: "Erro ao salvar", description: e.message, variant: "destructive" });
    }
    setSaving(false);
  };

  const onFile = async (f: File | null) => {
    if (!f) return;
    setUploading(true);
    try {
      const url = await uploadEventoBanner(f);
      setForm((x) => ({ ...x, banner_url: url }));
      toast({ title: "Banner enviado" });
    } catch (e: any) {
      toast({ title: "Erro no upload", description: e.message, variant: "destructive" });
    }
    setUploading(false);
  };

  const toggleDestaque = async (e: Evento) => {
    try {
      await updateEvento(e.id, { destaque: !e.destaque });
    } catch {}
  };

  const onDelete = async (e: Evento) => {
    if (!confirm(`Remover "${e.nome}"?`)) return;
    try {
      await deleteEvento(e.id);
      toast({ title: "Removido" });
    } catch {}
  };

  return (
    <div className="admin-section-anim space-y-5">
      <div>
        <p className="admin-h-eyebrow mb-1.5">Hub Indies</p>
        <h1 className="admin-h-title">Eventos e Showcases</h1>
      </div>

      <form onSubmit={submit} className="admin-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-white">
            {editingId ? "Editar evento" : "Novo evento"}
          </p>
          {editingId && (
            <button type="button" className="admin-btn admin-btn-ghost !p-2" onClick={cancel}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="block md:col-span-2">
            <span className="text-[11px] text-white/60 font-semibold">Nome *</span>
            <input
              required
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="admin-input"
            />
          </label>
          <label className="block">
            <span className="text-[11px] text-white/60 font-semibold">Data *</span>
            <input
              type="date"
              required
              value={form.data}
              onChange={(e) => setForm({ ...form, data: e.target.value })}
              className="admin-input"
            />
          </label>
          <label className="block">
            <span className="text-[11px] text-white/60 font-semibold">Horário</span>
            <input
              type="time"
              value={form.horario ?? ""}
              onChange={(e) => setForm({ ...form, horario: e.target.value || null })}
              className="admin-input"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="text-[11px] text-white/60 font-semibold">Descrição</span>
            <textarea
              rows={3}
              value={form.descricao ?? ""}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              className="admin-input"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="text-[11px] text-white/60 font-semibold">Link externo</span>
            <input
              value={form.link ?? ""}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className="admin-input"
            />
          </label>
          <div className="md:col-span-2 space-y-2">
            <span className="text-[11px] text-white/60 font-semibold">Banner</span>
            <div className="flex items-center gap-3">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={(e) => onFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
              <button
                type="button"
                className="admin-btn admin-btn-ghost"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                Enviar imagem
              </button>
              {form.banner_url && (
                <img src={form.banner_url} alt="" className="h-12 rounded border border-white/10" />
              )}
            </div>
            <input
              value={form.banner_url ?? ""}
              onChange={(e) => setForm({ ...form, banner_url: e.target.value })}
              placeholder="Ou cole uma URL"
              className="admin-input"
            />
          </div>
          <label className="flex items-center gap-2 md:col-span-2">
            <input
              type="checkbox"
              checked={form.destaque}
              onChange={(e) => setForm({ ...form, destaque: e.target.checked })}
            />
            <span className="text-xs text-white/80">Marcar como destaque</span>
          </label>
        </div>
        <div className="flex gap-2 justify-end">
          {editingId && (
            <button type="button" className="admin-btn admin-btn-ghost" onClick={cancel}>
              Cancelar
            </button>
          )}
          <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {editingId ? "Salvar" : "Adicionar"}
          </button>
        </div>
      </form>

      <div className="admin-card p-4">
        <p className="text-xs uppercase tracking-widest text-white/50 font-bold mb-3">
          {eventos.length} cadastrados
        </p>
        <div className="divide-y divide-white/[0.05]">
          {eventos.map((e) => (
            <div key={e.id} className="flex items-center gap-3 py-2.5">
              {e.banner_url ? (
                <img
                  src={e.banner_url}
                  alt=""
                  className="w-16 h-10 object-cover rounded bg-black/40 flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-10 rounded bg-black/40 flex-shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate flex items-center gap-2">
                  {e.nome}
                  {e.destaque && <Star className="w-3.5 h-3.5 text-primary fill-primary" />}
                </p>
                <p className="text-[11px] text-white/50 truncate">
                  {e.data}
                  {e.horario ? ` · ${e.horario.slice(0, 5)}` : ""}
                </p>
              </div>
              <button
                type="button"
                className="admin-btn admin-btn-ghost !p-2"
                onClick={() => toggleDestaque(e)}
              >
                {e.destaque ? <StarOff className="w-4 h-4" /> : <Star className="w-4 h-4" />}
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-ghost !p-2"
                onClick={() => startEdit(e)}
              >
                Editar
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-ghost admin-btn-danger !p-2"
                onClick={() => onDelete(e)}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {eventos.length === 0 && (
            <p className="text-sm text-white/50 py-6 text-center">Nenhum evento cadastrado.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventosPanel;
