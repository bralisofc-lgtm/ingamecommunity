import { useRef, useState } from "react";
import { z } from "zod";
import { useSorteios, type Sorteio } from "@/hooks/useSorteios";
import { toast } from "@/hooks/use-toast";
import { ArrowUp, ArrowDown, Star } from "lucide-react";

const schema = z.object({
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().max(800).or(z.literal("")),
  banner_image: z.string().trim().url().or(z.literal("")),
  game_logo: z.string().trim().url().or(z.literal("")),
  youtube_trailer: z.string().trim().max(500).or(z.literal("")),
  event_date: z.string().or(z.literal("")),
  participate_link: z.string().trim().url().or(z.literal("")),
  participants_count: z.number().int().min(0).max(9999999),
  active: z.boolean(),
  featured_next: z.boolean(),
  position: z.number().int().min(0).max(9999),
});

type FormState = Omit<Sorteio, "id" | "event_date"> & { event_date: string };

const empty: FormState = {
  title: "",
  description: "",
  banner_image: "",
  game_logo: "",
  youtube_trailer: "",
  event_date: "",
  participate_link: "",
  participants_count: 0,
  active: true,
  featured_next: false,
  position: 0,
};

const toDatetimeLocal = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const SorteiosAdminPanel = () => {
  const { sorteios, create, update, remove, uploadImage } = useSorteios();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const bannerRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  const startEdit = (s: Sorteio) => {
    setEditingId(s.id);
    setErrors({});
    setForm({
      title: s.title,
      description: s.description,
      banner_image: s.banner_image,
      game_logo: s.game_logo,
      youtube_trailer: s.youtube_trailer,
      event_date: toDatetimeLocal(s.event_date),
      participate_link: s.participate_link,
      participants_count: s.participants_count,
      active: s.active,
      featured_next: s.featured_next,
      position: s.position,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reset = () => {
    setEditingId(null);
    setForm(empty);
    setErrors({});
    if (bannerRef.current) bannerRef.current.value = "";
    if (logoRef.current) logoRef.current.value = "";
  };

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "banner_image" | "game_logo",
    setBusy: (v: boolean) => void,
    prefix: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 8 * 1024 * 1024) {
      toast({ title: "Arquivo muito grande", description: "Máximo 8 MB", variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      const url = await uploadImage(file, prefix);
      setForm((f) => ({ ...f, [field]: url }));
      toast({ title: "Imagem enviada" });
    } catch {
      toast({ title: "Erro ao enviar", variant: "destructive" });
    } finally {
      setBusy(false);
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
    const payload = {
      title: r.data.title,
      description: r.data.description ?? "",
      banner_image: r.data.banner_image ?? "",
      game_logo: r.data.game_logo ?? "",
      youtube_trailer: r.data.youtube_trailer ?? "",
      event_date: r.data.event_date ? new Date(r.data.event_date).toISOString() : null,
      participate_link: r.data.participate_link ?? "",
      participants_count: r.data.participants_count,
      active: r.data.active,
      featured_next: r.data.featured_next,
      position: r.data.position,
    };
    try {
      if (editingId) {
        await update(editingId, payload);
        toast({ title: "Sorteio atualizado" });
      } else {
        await create(payload);
        toast({ title: "Sorteio criado" });
      }
      reset();
    } catch (err) {
      console.error(err);
      toast({ title: "Erro ao salvar", variant: "destructive" });
    }
  };

  const handleDelete = async (s: Sorteio) => {
    if (!confirm(`Remover "${s.title}"?`)) return;
    try {
      await remove(s.id);
      if (editingId === s.id) reset();
      toast({ title: "Sorteio removido" });
    } catch {
      toast({ title: "Erro ao remover", variant: "destructive" });
    }
  };

  const move = async (s: Sorteio, dir: -1 | 1) => {
    try {
      await update(s.id, { position: (s.position ?? 0) + dir });
    } catch {
      toast({ title: "Erro ao reordenar", variant: "destructive" });
    }
  };

  const toggleFeatured = async (s: Sorteio) => {
    try {
      await update(s.id, { featured_next: !s.featured_next });
    } catch {
      toast({ title: "Erro", variant: "destructive" });
    }
  };

  const toggleActive = async (s: Sorteio) => {
    try {
      await update(s.id, { active: !s.active });
    } catch {
      toast({ title: "Erro", variant: "destructive" });
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
        <h2 className="text-2xl font-bold mb-6">{editingId ? "Editar sorteio" : "Novo sorteio"}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className={lbl}>Título do sorteio *</label>
            <input
              className={inputCls("title")}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              maxLength={160}
            />
            {errors.title && <p className="mt-1.5 text-xs text-destructive">{errors.title}</p>}
          </div>

          <div className="md:col-span-2">
            <label className={lbl}>Descrição</label>
            <textarea
              className={`${inputCls("description")} min-h-[100px] resize-y`}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              maxLength={800}
            />
          </div>

          <div className="md:col-span-2">
            <label className={lbl}>Banner / Wallpaper cinematográfico</label>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              {form.banner_image && (
                <img
                  src={form.banner_image}
                  alt="preview"
                  className="w-40 h-24 object-cover rounded-lg border-2 border-primary/50"
                />
              )}
              <div className="flex-1 w-full space-y-2">
                <input
                  ref={bannerRef}
                  type="file"
                  accept="image/*"
                  disabled={uploadingBanner}
                  onChange={(e) => handleUpload(e, "banner_image", setUploadingBanner, "banner")}
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-primary/20 file:text-primary-glow hover:file:bg-primary/30 cursor-pointer"
                />
                {uploadingBanner && <p className="text-xs text-primary-glow animate-pulse">Enviando...</p>}
                <input
                  className={inputCls("banner_image")}
                  value={form.banner_image}
                  onChange={(e) => setForm({ ...form, banner_image: e.target.value })}
                  placeholder="ou cole uma URL"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className={lbl}>Logo do jogo</label>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              {form.game_logo && (
                <img
                  src={form.game_logo}
                  alt="preview"
                  className="w-24 h-24 object-contain rounded-lg border border-primary/40 bg-black/40 p-2"
                />
              )}
              <div className="flex-1 w-full space-y-2">
                <input
                  ref={logoRef}
                  type="file"
                  accept="image/*"
                  disabled={uploadingLogo}
                  onChange={(e) => handleUpload(e, "game_logo", setUploadingLogo, "logo")}
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-wider file:bg-primary/20 file:text-primary-glow hover:file:bg-primary/30 cursor-pointer"
                />
                {uploadingLogo && <p className="text-xs text-primary-glow animate-pulse">Enviando...</p>}
                <input
                  className={inputCls("game_logo")}
                  value={form.game_logo}
                  onChange={(e) => setForm({ ...form, game_logo: e.target.value })}
                  placeholder="ou cole uma URL"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className={lbl}>Trailer YouTube (URL)</label>
            <input
              className={inputCls("youtube_trailer")}
              value={form.youtube_trailer}
              onChange={(e) => setForm({ ...form, youtube_trailer: e.target.value })}
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>

          <div>
            <label className={lbl}>Data do evento</label>
            <input
              type="datetime-local"
              className={inputCls("event_date")}
              value={form.event_date}
              onChange={(e) => setForm({ ...form, event_date: e.target.value })}
            />
          </div>

          <div>
            <label className={lbl}>Participantes</label>
            <input
              type="number"
              min={0}
              className={inputCls("participants_count")}
              value={form.participants_count}
              onChange={(e) =>
                setForm({ ...form, participants_count: Number(e.target.value) || 0 })
              }
            />
          </div>

          <div className="md:col-span-2">
            <label className={lbl}>Link "Participar"</label>
            <input
              className={inputCls("participate_link")}
              value={form.participate_link}
              onChange={(e) => setForm({ ...form, participate_link: e.target.value })}
              placeholder="https://..."
            />
            {errors.participate_link && (
              <p className="mt-1.5 text-xs text-destructive">{errors.participate_link}</p>
            )}
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

          <div className="flex flex-wrap items-center gap-6 md:pt-7">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm font-bold uppercase tracking-widest text-primary-glow">
                Ativo
              </span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured_next}
                onChange={(e) => setForm({ ...form, featured_next: e.target.checked })}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm font-bold uppercase tracking-widest text-primary-glow">
                Próximo em destaque
              </span>
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            type="submit"
            disabled={uploadingBanner || uploadingLogo}
            className="btn-glow px-6 py-3 rounded-full text-primary-foreground font-bold uppercase tracking-wider text-xs disabled:opacity-50"
          >
            {editingId ? "Salvar alterações" : "Criar sorteio"}
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

      <h2 className="text-2xl font-bold mb-6">Sorteios ({sorteios.length})</h2>
      <div className="space-y-3">
        {sorteios.length === 0 && (
          <p className="text-muted-foreground text-center py-10">Nenhum sorteio cadastrado.</p>
        )}
        {sorteios.map((s) => (
          <div
            key={s.id}
            className="indie-card p-4 md:p-5 flex flex-col md:flex-row gap-4 items-start md:items-center"
          >
            {s.banner_image && (
              <img
                src={s.banner_image}
                alt={s.title}
                className="w-full md:w-40 h-24 object-cover rounded-lg border border-border"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-primary/20 text-primary-glow border border-primary/40">
                  #{s.position}
                </span>
                {!s.active && (
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-muted text-muted-foreground border border-border">
                    inativo
                  </span>
                )}
                {s.featured_next && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-primary text-primary-foreground">
                    <Star className="w-3 h-3" /> Próximo
                  </span>
                )}
              </div>
              <h3 className="font-bold truncate">{s.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{s.description}</p>
            </div>
            <div className="flex flex-wrap gap-2 self-stretch md:self-center">
              <button
                onClick={() => move(s, -1)}
                className="px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-primary-glow hover:border-primary-glow transition"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => move(s, 1)}
                className="px-3 py-2 rounded-lg border border-border text-muted-foreground hover:text-primary-glow hover:border-primary-glow transition"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => toggleFeatured(s)}
                className={`px-3 py-2 rounded-lg border font-semibold text-xs uppercase transition ${
                  s.featured_next
                    ? "bg-primary text-primary-foreground border-primary-glow"
                    : "border-primary/40 text-primary-glow hover:bg-primary/10"
                }`}
                title="Próximo em destaque"
              >
                <Star className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => toggleActive(s)}
                className="px-3 py-2 rounded-lg border border-border text-xs uppercase font-semibold tracking-wider hover:border-primary-glow hover:text-primary-glow transition"
              >
                {s.active ? "Desativar" : "Ativar"}
              </button>
              <button
                onClick={() => startEdit(s)}
                className="px-4 py-2 rounded-lg border border-primary/50 text-primary-glow font-semibold text-xs uppercase tracking-wider hover:bg-primary/10 transition"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(s)}
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

export default SorteiosAdminPanel;
