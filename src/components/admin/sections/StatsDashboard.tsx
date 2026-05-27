import { useEffect, useMemo, useState } from "react";
import { Eye, MousePointerClick, FileText, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Post } from "@/hooks/usePosts";

interface Props {
  posts: Post[];
}

interface StatRow {
  post_id: string;
  views: number;
  clicks: number;
}

const StatsDashboard = ({ posts }: Props) => {
  const [stats, setStats] = useState<StatRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase
        .from("post_stats")
        .select("post_id, views, clicks");
      if (!alive) return;
      setStats(((data as any[]) ?? []).map((r) => ({
        post_id: r.post_id,
        views: Number(r.views ?? 0),
        clicks: Number(r.clicks ?? 0),
      })));
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const byPost = useMemo(() => {
    const map = new Map<string, StatRow>();
    for (const s of stats) map.set(s.post_id, s);
    return posts
      .map((p) => ({
        post: p,
        views: map.get(p.id)?.views ?? 0,
        clicks: map.get(p.id)?.clicks ?? 0,
      }))
      .sort((a, b) => b.views + b.clicks - (a.views + a.clicks));
  }, [stats, posts]);

  const totals = useMemo(() => {
    return stats.reduce(
      (acc, s) => ({ views: acc.views + s.views, clicks: acc.clicks + s.clicks }),
      { views: 0, clicks: 0 },
    );
  }, [stats]);

  return (
    <div className="admin-section-anim space-y-6">
      <div>
        <p className="admin-h-eyebrow mb-1.5">Visão geral</p>
        <h1 className="admin-h-title">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Postagens" value={posts.length} icon={FileText} />
        <StatCard label="Views totais" value={totals.views} icon={Eye} />
        <StatCard label="Cliques totais" value={totals.clicks} icon={MousePointerClick} />
        <StatCard
          label="CTR médio"
          value={totals.views > 0 ? `${((totals.clicks / totals.views) * 100).toFixed(1)}%` : "—"}
          icon={TrendingUp}
        />
      </div>

      <div className="admin-card overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.25em] text-white/60 font-bold">
            Desempenho por postagem
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
            {byPost.length} {byPost.length === 1 ? "post" : "posts"}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-[0.2em] text-white/40 border-b border-white/[0.05]">
                <th className="px-5 py-2.5 font-semibold">Postagem</th>
                <th className="px-3 py-2.5 font-semibold w-[100px]">Tag</th>
                <th className="px-3 py-2.5 font-semibold text-right w-[100px]">Views</th>
                <th className="px-3 py-2.5 font-semibold text-right w-[100px]">Cliques</th>
                <th className="px-5 py-2.5 font-semibold text-right w-[80px]">CTR</th>
              </tr>
            </thead>
            <tbody>
              {loading && byPost.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-white/40 text-xs">
                    Carregando estatísticas…
                  </td>
                </tr>
              ) : byPost.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-white/40 text-xs">
                    Nenhuma postagem ainda.
                  </td>
                </tr>
              ) : (
                byPost.map(({ post, views, clicks }) => {
                  const ctr = views > 0 ? (clicks / views) * 100 : 0;
                  return (
                    <tr
                      key={post.id}
                      className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-3">
                        <p className="text-white font-medium truncate max-w-[420px]">{post.title}</p>
                        <p className="text-[10px] uppercase tracking-widest text-white/30 mt-0.5">
                          {post.author}
                        </p>
                      </td>
                      <td className="px-3 py-3">
                        {post.tag && <span className="admin-chip">{post.tag}</span>}
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-white/90 tabular-nums">
                        {views.toLocaleString("pt-BR")}
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-white/90 tabular-nums">
                        {clicks.toLocaleString("pt-BR")}
                      </td>
                      <td className="px-5 py-3 text-right text-white/60 text-xs tabular-nums">
                        {views > 0 ? `${ctr.toFixed(1)}%` : "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
}) => (
  <div className="admin-card p-5 relative overflow-hidden">
    <div className="flex items-start justify-between mb-3">
      <p className="admin-h-eyebrow">{label}</p>
      <Icon className="w-4 h-4 text-white/30" />
    </div>
    <p className="text-3xl font-bold text-white tracking-tight tabular-nums">
      {typeof value === "number" ? value.toLocaleString("pt-BR") : value}
    </p>
  </div>
);

export default StatsDashboard;
