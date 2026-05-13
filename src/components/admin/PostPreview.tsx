import { useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import MarkdownRenderer from "@/components/post/MarkdownRenderer";
import ReviewVerdict from "@/components/post/ReviewVerdict";
import AuthorSocials from "@/components/post/AuthorSocials";
import type { Post } from "@/hooks/usePosts";

interface Props {
  post: Omit<Post, "id">;
}

const formatDate = (iso: string) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

const isRecent = (iso: string) => {
  if (!iso) return false;
  const d = new Date(iso).getTime();
  if (Number.isNaN(d)) return false;
  return Date.now() - d <= 7 * 24 * 60 * 60 * 1000;
};

const PostPreview = ({ post }: Props) => {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const recent = isRecent(post.date);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Preview header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
          <span className="text-[11px] uppercase tracking-[0.25em] text-white/60 font-semibold">
            Preview ao vivo
          </span>
        </div>
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`px-2.5 py-1.5 rounded-md transition-all ${
              device === "desktop"
                ? "bg-white/10 text-white shadow-[0_0_12px_-4px_rgba(255,255,255,0.4)]"
                : "text-white/40 hover:text-white/70"
            }`}
            aria-label="Desktop"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`px-2.5 py-1.5 rounded-md transition-all ${
              device === "mobile"
                ? "bg-white/10 text-white shadow-[0_0_12px_-4px_rgba(255,255,255,0.4)]"
                : "text-white/40 hover:text-white/70"
            }`}
            aria-label="Mobile"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scroll container */}
      <div className="flex-1 overflow-y-auto bg-[hsl(270_40%_4%)]">
        <div
          className={`mx-auto transition-[max-width] duration-300 ${
            device === "mobile" ? "max-w-[420px]" : "max-w-full"
          }`}
        >
          {/* Hero */}
          <section className="relative w-full overflow-hidden" style={{ height: device === "mobile" ? 260 : 340 }}>
            {post.image ? (
              <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[hsl(265_80%_35%)] via-[hsl(270_40%_8%)] to-[hsl(270_90%_25%)]" />
            )}
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[hsl(270_40%_4%)]" />

            <div className="relative z-10 h-full flex items-end justify-center px-4 pb-6">
              <div className="text-center w-full max-w-3xl">
                <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                  {post.tag && (
                    <span className="inline-block px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] rounded-full bg-[hsl(270_90%_65%/0.9)] text-white border border-[hsl(280_95%_72%)] shadow-[0_0_18px_hsl(280_95%_72%/0.6)]">
                      {post.tag}
                    </span>
                  )}
                  {recent && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] rounded-full bg-yellow-300 text-[hsl(270_90%_15%)] border border-yellow-200 shadow-[0_0_18px_hsl(50_100%_70%/0.6)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[hsl(270_90%_15%)]" />
                      Recente
                    </span>
                  )}
                </div>
                <h1
                  className={`font-black leading-tight text-white drop-shadow-[0_2px_12px_hsl(270_90%_5%/0.95)] ${
                    device === "mobile" ? "text-2xl" : "text-3xl md:text-4xl"
                  }`}
                >
                  {post.title || "Título da postagem"}
                </h1>
              </div>
            </div>
          </section>

          {/* Body */}
          <article className="relative px-4 pb-10 mt-6">
            <div className="mx-auto max-w-3xl">
              {/* Authoring */}
              <div className="flex items-center gap-4 mb-6 flex-wrap text-[hsl(270_20%_96%)]">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[hsl(280_95%_72%)]">
                    Publicado por
                  </span>
                  <span className="mt-1 text-sm font-bold">{post.author || "In Game"}</span>
                </div>
                {post.date && (
                  <>
                    <span className="h-7 w-px bg-[hsl(270_90%_65%/0.25)]" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[hsl(280_95%_72%/0.8)]">
                        Data
                      </span>
                      <span className="mt-1 text-xs">{formatDate(post.date)}</span>
                    </div>
                  </>
                )}
                {post.author_socials?.length > 0 && (
                  <>
                    <span className="h-7 w-px bg-[hsl(270_90%_65%/0.25)]" />
                    <AuthorSocials links={post.author_socials} size="sm" />
                  </>
                )}
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-[hsl(270_90%_65%/0.3)] to-transparent mb-6" />

              {/* Description */}
              {post.description && (
                <p className="text-base md:text-lg italic leading-relaxed text-[hsl(270_20%_96%/0.85)] mb-6 pb-5 border-b border-[hsl(270_90%_65%/0.15)]">
                  {post.description}
                </p>
              )}

              {/* Content */}
              {post.content ? (
                <div className="text-[hsl(270_20%_96%)]">
                  <MarkdownRenderer content={post.content} />
                </div>
              ) : (
                <p className="text-white/40 italic text-sm">
                  Comece a escrever o conteúdo da postagem para vê-lo aparecer aqui em tempo real…
                </p>
              )}

              {/* Review verdict */}
              {post.tag === "Review" &&
                (post.review_grade ||
                  post.review_summary ||
                  post.review_game_name ||
                  (post.review_tech_info &&
                    Object.keys(post.review_tech_info).length > 0)) && (
                  <ReviewVerdict
                    grade={post.review_grade}
                    note={post.review_note}
                    summary={post.review_summary}
                    gameName={post.review_game_name}
                    techInfo={post.review_tech_info}
                  />
                )}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default PostPreview;
