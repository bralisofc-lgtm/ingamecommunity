import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import {
  X,
  Save,
  Copy,
  Eye,
  CloudUpload,
  ChevronDown,
  Info,
  Settings as SettingsIcon,
  Star,
  AtSign,
  Search as SearchIcon,
  FileEdit,
} from "lucide-react";
import type { Post } from "@/hooks/usePosts";
import { POST_TAGS } from "@/lib/tags";
import { toast } from "@/hooks/use-toast";
import PostPreview from "./PostPreview";
import MarkdownToolbar from "./MarkdownToolbar";

type FormState = Omit<Post, "id">;

const postSchema = z.object({
  title: z.string().trim().min(3).max(120),
  tag: z.enum(POST_TAGS),
  author: z.string().trim().min(2).max(80),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  image: z.string().trim().max(2000).url().optional().or(z.literal("")),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  link: z.string().trim().max(2000).url().optional().or(z.literal("")),
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

const TECH_FIELDS: { key: string; label: string }[] = [
  { key: "publisher", label: "Publisher" },
  { key: "developer", label: "Desenvolvedora" },
  { key: "platforms", label: "Plataformas" },
  { key: "release_date", label: "Lançamento" },
  { key: "play_time", label: "Tempo de jogo" },
  { key: "category", label: "Categoria" },
  { key: "status", label: "Status" },
  { key: "engine", label: "Engine" },
  { key: "mode", label: "Multi/Single" },
];

interface Props {
  initial: FormState;
  editingId: string | null;
  onCancel: () => void;
  onSubmit: (data: FormState) => Promise<void>;
  onDuplicate?: () => void;
}

const draftKey = (id: string | null) => `ingame:admin:draft:${id ?? "new"}`;

const Section = ({
  id,
  title,
  icon: Icon,
  defaultOpen = true,
  children,
  hint,
}: {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultOpen?: boolean;
  children: React.ReactNode;
  hint?: string;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="admin-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/[0.03] transition-colors"
        aria-expanded={open}
        aria-controls={`section-${id}`}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
            <Icon className="w-3.5 h-3.5 text-white/70" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white tracking-tight">{title}</p>
            {hint && <p className="text-[10px] text-white/35 uppercase tracking-widest mt-0.5">{hint}</p>}
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-white/40 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div id={`section-${id}`} className="px-4 pb-5 pt-1 space-y-4 border-t border-white/[0.04]">
          {children}
        </div>
      )}
    </div>
  );
};

const Switch = ({
  checked,
  onChange,
  label,
  desc,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  desc?: string;
}) => (
  <label className="flex items-start justify-between gap-4 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] cursor-pointer hover:border-white/[0.12] transition-colors">
    <div className="min-w-0">
      <p className="text-sm font-medium text-white">{label}</p>
      {desc && <p className="text-[11px] text-white/40 mt-0.5">{desc}</p>}
    </div>
    <span className="admin-switch">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="admin-switch-track" />
    </span>
  </label>
);

const PostEditor = ({ initial, editingId, onCancel, onSubmit, onDuplicate }: Props) => {
  const [form, setForm] = useState<FormState>(initial);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Hydrate from local draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey(editingId));
      if (raw && !editingId) {
        const parsed = JSON.parse(raw) as FormState;
        if (parsed && typeof parsed === "object" && parsed.title !== undefined) {
          setForm((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset when editing target changes
  useEffect(() => {
    setForm(initial);
    setSavedAt(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingId]);

  // Auto-save (local) with debounce
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(draftKey(editingId), JSON.stringify(form));
        setSavedAt(Date.now());
      } catch {
        // ignore
      }
    }, 800);
    return () => clearTimeout(t);
  }, [form, editingId]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const wordCount = useMemo(() => {
    const txt = (form.content || "").replace(/[#*_`>!\[\]()]/g, " ");
    return txt.split(/\s+/).filter(Boolean).length;
  }, [form.content]);
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = postSchema.safeParse(form);
    if (!result.success) {
      const first = result.error.issues[0];
      toast({
        title: "Verifique os campos",
        description: first?.message ?? "Há campos inválidos.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    try {
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
        author_socials: (result.data.author_socials ?? [])
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 3),
      };
      await onSubmit(clean);
      try {
        localStorage.removeItem(draftKey(editingId));
      } catch {
        // ignore
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-section-anim flex flex-col h-full min-h-0">
      {/* Action bar */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onCancel}
            className="admin-btn admin-btn-ghost"
            aria-label="Voltar à lista"
          >
            <X className="w-3.5 h-3.5" />
            Voltar
          </button>
          <div className="min-w-0">
            <p className="admin-h-eyebrow">{editingId ? "Editando" : "Nova postagem"}</p>
            <p className="text-sm font-semibold text-white truncate max-w-[40ch]">
              {form.title || "Sem título"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {savedAt && (
            <span className="hidden md:inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-white/40">
              <CloudUpload className="w-3 h-3 text-emerald-400" />
              Rascunho salvo
            </span>
          )}
          {editingId && onDuplicate && (
            <button type="button" onClick={onDuplicate} className="admin-btn admin-btn-ghost">
              <Copy className="w-3.5 h-3.5" />
              Duplicar
            </button>
          )}
          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
            <Save className="w-3.5 h-3.5" />
            {saving ? "Salvando…" : editingId ? "Salvar alterações" : "Publicar"}
          </button>
        </div>
      </div>

      {/* Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        {/* Preview */}
        <div className="admin-card overflow-hidden order-2 lg:order-1 h-[60vh] lg:h-auto">
          <PostPreview post={form} />
        </div>

        {/* Editor */}
        <div className="order-1 lg:order-2 overflow-y-auto pr-1 -mr-1 space-y-3">
          <Section id="info" title="Informações principais" icon={Info}>
            <div>
              <label className="admin-label">Título *</label>
              <input
                className="admin-input"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Título da postagem"
                maxLength={120}
              />
            </div>
            <div>
              <label className="admin-label">Subtítulo</label>
              <input
                className="admin-input"
                value={form.subtitle}
                onChange={(e) => update("subtitle", e.target.value)}
                placeholder="Linha de apoio (opcional)"
                maxLength={200}
              />
            </div>
            <div>
              <label className="admin-label">Descrição curta</label>
              <textarea
                className="admin-input min-h-[80px] resize-y"
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                maxLength={500}
                placeholder="Texto que aparece nos cards e no topo do artigo"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="admin-label">Categoria *</label>
                <select
                  className="admin-input"
                  value={form.tag}
                  onChange={(e) => update("tag", e.target.value)}
                >
                  <option value="">Selecione…</option>
                  {POST_TAGS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="admin-label">Autor *</label>
                <input
                  className="admin-input"
                  value={form.author}
                  onChange={(e) => update("author", e.target.value)}
                  placeholder="Nome do autor"
                  maxLength={80}
                />
              </div>
              <div>
                <label className="admin-label">Data</label>
                <input
                  type="date"
                  className="admin-input"
                  value={form.date}
                  onChange={(e) => update("date", e.target.value)}
                />
              </div>
              <div>
                <label className="admin-label">Posição</label>
                <input
                  type="number"
                  className="admin-input"
                  value={form.position}
                  onChange={(e) => update("position", Number(e.target.value) || 0)}
                />
              </div>
            </div>
            <div>
              <label className="admin-label">Banner (URL)</label>
              <input
                className="admin-input"
                value={form.image}
                onChange={(e) => update("image", e.target.value)}
                placeholder="https://…"
                maxLength={2000}
              />
              {form.image && (
                <div className="mt-2 aspect-[16/6] rounded-lg overflow-hidden border border-white/10 bg-white/[0.03]">
                  <img src={form.image} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div>
              <label className="admin-label">Link externo</label>
              <input
                className="admin-input"
                value={form.link}
                onChange={(e) => update("link", e.target.value)}
                placeholder="https://… (opcional)"
                maxLength={2000}
              />
            </div>
          </Section>

          <Section id="content" title="Conteúdo" icon={FileEdit} hint="Markdown">
            <div className="relative pt-2">
              <MarkdownToolbar
                textareaRef={textareaRef}
                value={form.content}
                onChange={(v) => update("content", v)}
                visible={toolbarVisible}
              />
              <textarea
                ref={textareaRef}
                className="admin-input min-h-[420px] resize-y font-mono text-[13px] leading-relaxed"
                value={form.content}
                onChange={(e) => update("content", e.target.value)}
                onFocus={() => setToolbarVisible(true)}
                onMouseEnter={() => setToolbarVisible(true)}
                onBlur={() => setToolbarVisible(false)}
                onMouseLeave={() => {
                  if (document.activeElement !== textareaRef.current) setToolbarVisible(false);
                }}
                maxLength={50000}
                placeholder={"# Título\n\nParágrafo com **negrito** e *itálico*.\n\n![](https://link-da-imagem.jpg)\n\n> Citação destacada\n\n- item de lista"}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-white/40 uppercase tracking-widest">
              <span>{wordCount} palavras</span>
              <span>~{readingTime} min de leitura</span>
            </div>
          </Section>

          <Section id="settings" title="Configurações" icon={SettingsIcon} defaultOpen>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Switch
                checked={form.pinned}
                onChange={(v) => update("pinned", v)}
                label="Fixar postagem"
                desc="Aparece sempre no topo das listas"
              />
              <Switch
                checked={form.featured}
                onChange={(v) => update("featured", v)}
                label="Destaque"
                desc="Marca como conteúdo em destaque"
              />
            </div>
          </Section>

          {form.tag === "Review" && (
            <Section id="review" title="Review" icon={Star}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="admin-label">Classificação</label>
                  <select
                    className="admin-input"
                    value={form.review_grade}
                    onChange={(e) => update("review_grade", e.target.value)}
                  >
                    <option value="">— sem classificação —</option>
                    {["S+","S","S-","A+","A","A-","B+","B","B-","C+","C","C-","D+","D","D-"].map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="admin-label">Nome do jogo / expansão</label>
                  <input
                    className="admin-input"
                    value={form.review_game_name}
                    onChange={(e) => update("review_game_name", e.target.value)}
                    placeholder="Ex: Hollow Knight: Silksong"
                    maxLength={160}
                  />
                </div>
              </div>
              <div>
                <label className="admin-label">Conclusão / opinião final</label>
                <textarea
                  className="admin-input min-h-[90px] resize-y"
                  value={form.review_summary}
                  onChange={(e) => update("review_summary", e.target.value)}
                  maxLength={800}
                  placeholder="Breve conclusão sobre a experiência analisada"
                />
              </div>
              <div>
                <label className="admin-label">Texto curto ao lado da nota</label>
                <textarea
                  className="admin-input min-h-[70px] resize-y"
                  value={form.review_note}
                  onChange={(e) => update("review_note", e.target.value)}
                  maxLength={500}
                  placeholder="Frase curta de impacto ao lado da nota"
                />
              </div>
              <div>
                <p className="admin-label">Informações técnicas</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {TECH_FIELDS.map((f) => (
                    <div key={f.key}>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/35 mb-1.5">
                        {f.label}
                      </label>
                      <input
                        className="admin-input"
                        value={form.review_tech_info?.[f.key] || ""}
                        onChange={(e) =>
                          update("review_tech_info", {
                            ...(form.review_tech_info || {}),
                            [f.key]: e.target.value,
                          })
                        }
                        placeholder={f.label}
                        maxLength={120}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          )}

          <Section id="author" title="Autor & Redes" icon={AtSign} defaultOpen={false}>
            <div className="space-y-2.5">
              {[0, 1, 2].map((i) => (
                <input
                  key={i}
                  type="url"
                  className="admin-input"
                  value={form.author_socials[i] ?? ""}
                  placeholder={
                    i === 0
                      ? "https://instagram.com/…"
                      : i === 1
                      ? "https://x.com/…"
                      : "https://youtube.com/…"
                  }
                  onChange={(e) => {
                    const next = [...form.author_socials];
                    next[i] = e.target.value;
                    update("author_socials", next.slice(0, 3));
                  }}
                  maxLength={2000}
                />
              ))}
              <p className="text-[11px] text-white/40">
                O ícone é detectado automaticamente pelo link. Deixe vazio para ocultar.
              </p>
            </div>
          </Section>

          <Section id="seo" title="SEO" icon={SearchIcon} defaultOpen={false}>
            <div>
              <label className="admin-label">Slug (URL)</label>
              <input
                className="admin-input"
                value={form.slug}
                onChange={(e) => update("slug", e.target.value)}
                placeholder="deixe vazio para gerar automaticamente"
                maxLength={160}
              />
              <p className="mt-1.5 text-[11px] text-white/40">
                URL final: <span className="text-white/70">/post/{form.slug || "(gerado)"}</span>
              </p>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 flex items-center gap-1.5">
                <Eye className="w-3 h-3" /> Pré-visualização Google
              </p>
              <p className="text-sm text-[#8ab4f8] truncate">
                {form.title || "Título da postagem"}
              </p>
              <p className="text-[11px] text-emerald-400/80 truncate">
                ingamecommunity.site/post/{form.slug || "(gerado)"}
              </p>
              <p className="text-[12px] text-white/55 line-clamp-2 mt-1">
                {form.description || "Descrição que aparecerá nas buscas…"}
              </p>
            </div>
          </Section>
        </div>
      </div>
    </form>
  );
};

export default PostEditor;
