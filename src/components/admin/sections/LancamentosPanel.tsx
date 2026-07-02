import { useState } from "react";
import { Plus, Trash2, Star, StarOff, Search, Loader2, Save, X, RefreshCw } from "lucide-react";
import { useLancamentos, type Lancamento } from "@/hooks/useLancamentos";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Form = Omit<Lancamento, "id">;
const empty: Form = {
  nome: "",
  data_lancamento: new Date().toISOString().slice(0, 10),
  plataformas: [],
  link: "",
  igdb_id: null,
  cover_url: "",
  destaque: false,
};

const LancamentosPanel = () => {
  const {
    lancamentos,
    createLancamento,
    updateLancamento,
    deleteLancamento,
    searchSteam,
    fetchSteamById,
  } = useLancamentos();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Form>(empty);
  const [platformsInput, setPlatformsInput] = useState("");
  const [igdbQuery, setIgdbQuery] = useState("");
  const [igdbResults, setIgdbResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);

  const startNew = () => {
    setEditingId(null);
    setForm(empty);
    setPlatformsInput("");
  };
  const startEdit = (l: Lancamento) => {
    setEditingId(l.id);
    setForm({
      nome: l.nome,
      data_lancamento: l.data_lancamento,
      plataformas: l.plataformas,
      link: l.link ?? "",
      igdb_id: l.igdb_id,
      cover_url: l.cover_url ?? "",
      destaque: l.destaque,
    });
    setPlatformsInput(l.plataformas.join(", "));
  };
  const cancel = () => {
    setEditingId(null);
    setForm(empty);
    setPlatformsInput("");
    setIgdbResults([]);
    setIgdbQuery("");
  };

  const applyIgdb = (r: any) => {
    setForm((f) => ({
      ...f,
      nome: r.name ?? f.nome,
      data_lancamento: r.first_release_date ?? f.data_lancamento,
      plataformas: r.platforms ?? f.plataformas,
      cover_url: r.cover_url ?? f.cover_url,
      igdb_id: r.id ?? f.igdb_id,
      link: r.url ?? f.link,
    }));
    setPlatformsInput((r.platforms ?? []).join(", "));
    setIgdbResults([]);
    setIgdbQuery("");
    toast({ title: "Dados do Steam aplicados" });
  };

  const doSearch = async () => {
    if (!igdbQuery.trim()) return;
    setSearching(true);
    const r = await searchSteam(igdbQuery.trim());
    setIgdbResults(r);
    setSearching(false);
    if (r.length === 0)
      toast({ title: "Nenhum resultado", description: "Confirme as secrets a busca da Steam." });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: Form = {
        ...form,
        plataformas: platformsInput
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean),
        link: form.link || null,
        cover_url: form.cover_url || null,
      };
      if (editingId) await updateLancamento(editingId, payload);
      else await createLancamento(payload);
      toast({ title: editingId ? "Lançamento atualizado" : "Lançamento adicionado" });
      cancel();
    } catch (err: any) {
      toast({ title: "Erro ao salvar", description: err.message, variant: "destructive" });
    }
    setSaving(false);
  };

  const toggleDestaque = async (l: Lancamento) => {
    try {
      await updateLancamento(l.id, { destaque: !l.destaque });
    } catch {}
  };

  const onDelete = async (l: Lancamento) => {
    if (!confirm(`Remover "${l.nome}"?`)) return;
    try {
      await deleteLancamento(l.id);
      toast({ title: "Removido" });
    } catch {}
  };

  return (
    <div className="admin-section-anim space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="admin-h-eyebrow mb-1.5">Hub Indies</p>
          <h1 className="admin-h-title">Lançamentos</h1>
        </div>
        {editingId !== null || form !== empty ? null : (
          <button type="button" className="admin-btn admin-btn-primary" onClick={startNew}>
            <Plus className="w-3.5 h-3.5" /> Novo
          </button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={submit} className="admin-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-white">
            {editingId ? "Editar lançamento" : "Novo lançamento"}
          </p>
          {editingId && (
            <button type="button" className="admin-btn admin-btn-ghost !p-2" onClick={cancel}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Steam search */}
        <div className="rounded-lg border border-white/10 bg-black/30 p-3 space-y-2">
          <p className="text-xs font-semibold text-white/80">Buscar no Steam</p>
          <div className="flex gap-2">
            <input
              value={igdbQuery}
              onChange={(e) => setIgdbQuery(e.target.value)}
              placeholder="Nome do jogo..."
              className="admin-input flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  doSearch();
                }
              }}
            />
            <button
              type="button"
              className="admin-btn admin-btn-ghost"
              onClick={doSearch}
              disabled={searching}
            >
              {searching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              Buscar
            </button>
          </div>
          {igdbResults.length > 0 && (
            <div className="max-h-56 overflow-y-auto rounded-md border border-white/10 divide-y divide-white/5">
              {igdbResults.map((r) => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => applyIgdb(r)}
                  className="w-full flex items-center gap-3 p-2 text-left hover:bg-white/[0.04] transition"
                >
                  <img
                    src={r.cover_url || ""}
                    alt=""
                    className="w-8 h-11 object-cover rounded bg-black/40 flex-shrink-0"
                    onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0")}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white truncate">{r.name}</p>
                    <p className="text-[10px] text-white/50 truncate">
                      {r.first_release_date ?? "sem data"} · {(r.platforms ?? []).slice(0, 3).join(", ")}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-[11px] text-white/60 font-semibold">Nome *</span>
            <input
              required
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              className="admin-input"
            />
          </label>
          <label className="block">
            <span className="text-[11px] text-white/60 font-semibold">Data de lançamento *</span>
            <input
              type="date"
              required
              value={form.data_lancamento}
              onChange={(e) => setForm({ ...form, data_lancamento: e.target.value })}
              className="admin-input"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="text-[11px] text-white/60 font-semibold">Plataformas (separadas por vírgula)</span>
            <input
              value={platformsInput}
              onChange={(e) => setPlatformsInput(e.target.value)}
              placeholder="PC, PS5, Xbox, Switch"
              className="admin-input"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="text-[11px] text-white/60 font-semibold">Link (Steam, site oficial...)</span>
            <input
              value={form.link ?? ""}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className="admin-input"
            />
          </label>
          <label className="block">
            <span className="text-[11px] text-white/60 font-semibold">ID Steam (opcional)</span>
            <input
              type="number"
              value={form.igdb_id ?? ""}
              onChange={(e) => setForm({ ...form, igdb_id: e.target.value ? Number(e.target.value) : null })}
              className="admin-input"
              onBlur={async () => {
                if (form.igdb_id) {
                  const r = await fetchSteamById(form.igdb_id);
                  if (r) applyIgdb(r);
                }
              }}
            />
          </label>
          <label className="block">
            <span className="text-[11px] text-white/60 font-semibold">Cover URL</span>
            <input
              value={form.cover_url ?? ""}
              onChange={(e) => setForm({ ...form, cover_url: e.target.value })}
              className="admin-input"
            />
          </label>
          <label className="flex items-center gap-2 md:col-span-2">
            <input
              type="checkbox"
              checked={form.destaque}
              onChange={(e) => setForm({ ...form, destaque: e.target.checked })}
            />
            <span className="text-xs text-white/80">Destaque (muito aguardado)</span>
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

      {/* List */}
      <div className="admin-card p-4">
        <p className="text-xs uppercase tracking-widest text-white/50 font-bold mb-3">
          {lancamentos.length} cadastrados
        </p>
        <div className="divide-y divide-white/[0.05]">
          {lancamentos.map((l) => (
            <div key={l.id} className="flex items-center gap-3 py-2.5">
              <img
                src={l.cover_url || ""}
                alt=""
                className="w-9 h-12 object-cover rounded bg-black/40 flex-shrink-0"
                onError={(e) => ((e.currentTarget as HTMLImageElement).style.opacity = "0")}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate flex items-center gap-2">
                  {l.nome}
                  {l.destaque && <Star className="w-3.5 h-3.5 text-primary fill-primary" />}
                </p>
                <p className="text-[11px] text-white/50 truncate">
                  {l.data_lancamento} · {l.plataformas.join(", ") || "—"}
                </p>
              </div>
              <button
                type="button"
                className="admin-btn admin-btn-ghost !p-2"
                onClick={() => toggleDestaque(l)}
                title="Alternar destaque"
              >
                {l.destaque ? <StarOff className="w-4 h-4" /> : <Star className="w-4 h-4" />}
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-ghost !p-2"
                onClick={() => startEdit(l)}
              >
                Editar
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-ghost admin-btn-danger !p-2"
                onClick={() => onDelete(l)}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {lancamentos.length === 0 && (
            <p className="text-sm text-white/50 py-6 text-center">Nenhum lançamento cadastrado.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LancamentosPanel;
