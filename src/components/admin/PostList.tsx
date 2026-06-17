import { useMemo, useState } from "react";
import {
  Pencil,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Plus,
  Search as SearchIcon,
  ExternalLink,
} from "lucide-react";
import type { Post } from "@/hooks/usePosts";
import { POST_TAGS } from "@/lib/tags";

interface Props {
  posts: Post[];
  loading: boolean;
  search: string;
  onSearch: (s: string) => void;
  onNew: () => void;
  onEdit: (p: Post) => void;
  onDuplicate: (p: Post) => void;
  onDelete: (p: Post) => void;
  onMove: (p: Post, dir: -1 | 1) => void;
  filter?: (p: Post) => boolean;
  title: string;
  eyebrow: string;
}

const PostList = ({
  posts,
  loading,
  search,
  onSearch,
  onNew,
  onEdit,
  onDuplicate,
  onDelete,
  onMove,
  filter,
  title,
  eyebrow,
}: Props) => {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = posts;
    if (filter) list = list.filter(filter);
    if (activeTag) list = list.filter((p) => p.tag === activeTag);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q) ||
          p.tag.toLowerCase().includes(q)
      );
    }
    return list;
  }, [posts, filter, activeTag, search]);

  return (
    <div className="admin-section-anim space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-3 md:gap-4">
        <div>
          <p className="admin-h-eyebrow mb-1.5">{eyebrow}</p>
          <h1 className="admin-h-title">{title}</h1>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] focus-within:border-white/30 transition-colors flex-1 sm:flex-initial">
            <SearchIcon className="w-3.5 h-3.5 text-white/40 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Filtrar…"
              className="bg-transparent outline-none text-sm text-white placeholder:text-white/30 w-full sm:w-[180px]"
            />
          </div>
          <button type="button" onClick={onNew} className="admin-btn admin-btn-primary shrink-0">
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nova postagem</span>
            <span className="sm:hidden">Nova</span>
          </button>
        </div>
      </div>

      {/* Tag chips */}
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setActiveTag(null)}
          className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] border transition-all ${
            !activeTag
              ? "bg-white/10 text-white border-white/30 shadow-[0_0_18px_-4px_rgba(255,255,255,0.4)]"
              : "border-white/[0.08] text-white/50 hover:text-white hover:border-white/20"
          }`}
        >
          Todas
        </button>
        {POST_TAGS.map((t) => {
          const active = activeTag === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setActiveTag(active ? null : t)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.18em] border transition-all ${
                active
                  ? "bg-white/10 text-white border-white/30 shadow-[0_0_18px_-4px_rgba(255,255,255,0.4)]"
                  : "border-white/[0.08] text-white/50 hover:text-white hover:border-white/20"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {loading && posts.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="admin-card overflow-hidden">
              <div className="admin-skeleton h-36" />
              <div className="p-4 space-y-3">
                <div className="admin-skeleton h-3 w-1/3" />
                <div className="admin-skeleton h-4 w-5/6" />
                <div className="admin-skeleton h-3 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-card admin-glass p-10 text-center">
          <p className="text-white/50 text-sm">
            {search || activeTag
              ? "Nenhuma postagem corresponde aos filtros."
              : "Nenhuma postagem cadastrada ainda. Crie a primeira clicando em \"Nova postagem\"."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <article
              key={p.id}
              className="admin-card is-hover overflow-hidden flex flex-col group"
            >
              <div className="relative aspect-[16/9] bg-white/[0.03] overflow-hidden">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-white/20 text-xs uppercase tracking-widest">
                    sem imagem
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
                  {p.tag && <span className="admin-chip">{p.tag}</span>}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col gap-2">
                <h3 className="font-bold text-white text-sm leading-snug line-clamp-2">
                  {p.title}
                </h3>
                <p className="text-xs text-white/45 line-clamp-2 flex-1">
                  {p.description || "—"}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-white/35 uppercase tracking-widest mt-1">
                  <span>{p.author}</span>
                  <span>•</span>
                  <span>{p.date}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-t border-white/[0.05]">
                <button
                  type="button"
                  onClick={() => onEdit(p)}
                  className="admin-btn admin-btn-ghost flex-1"
                  title="Editar"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => onDuplicate(p)}
                  className="admin-btn admin-btn-ghost"
                  title="Duplicar"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onMove(p, -1)}
                  className="admin-btn admin-btn-ghost"
                  title="Subir"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onMove(p, 1)}
                  className="admin-btn admin-btn-ghost"
                  title="Descer"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                {p.slug && (
                  <a
                    href={`/post/${p.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-btn admin-btn-ghost"
                    title="Abrir no site"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => onDelete(p)}
                  className="admin-btn admin-btn-ghost admin-btn-danger"
                  title="Remover"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;
