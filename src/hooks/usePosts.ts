import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Post {
  id: string;
  title: string;
  tag: string;
  date: string; // ISO yyyy-mm-dd
  image: string;
  description: string;
  link: string;
  author: string;
  pinned: boolean;
  position: number;
  slug: string;
  subtitle: string;
  content: string;
  featured: boolean;
  review_grade: string;
  review_note: string;
  review_summary: string;
  review_game_name: string;
  review_tech_info: Record<string, string>;
  author_socials: string[];
}

const defaultPostBase = { slug: "", subtitle: "", content: "", featured: false, review_grade: "", review_note: "", review_summary: "", review_game_name: "", review_tech_info: {} as Record<string, string>, author_socials: [] as string[] };
const defaultPosts: Omit<Post, "id">[] = ([
  {
    title: "Hollow Knight: Silksong finalmente chegou",
    tag: "Review",
    date: "2026-04-20",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    description:
      "Mergulhamos no aguardado novo capítulo do universo Hallownest. Confira nossas primeiras impressões.",
    link: "https://example.com/silksong",
    author: "In Game",
    pinned: false,
    position: 0,
  },
  {
    title: "Sorteio: 3 chaves de Hades II",
    tag: "Comunidade",
    date: "2026-04-18",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
    description:
      "Estamos sorteando chaves para a comunidade. Veja como participar e boa sorte a todos!",
    link: "https://example.com/sorteio",
    author: "In Game",
    pinned: false,
    position: 0,
  },
  {
    title: "5 indies brasileiros para ficar de olho",
    tag: "Indies Recomendação",
    date: "2026-04-12",
    image:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80",
    description:
      "A cena indie nacional está fervendo. Selecionamos cinco projetos imperdíveis feitos por aqui.",
    link: "https://example.com/indies-br",
    author: "In Game",
    pinned: false,
    position: 0,
  },
] as Omit<Post, "id" | keyof typeof defaultPostBase>[]).map((p) => ({ ...p, ...defaultPostBase }));

async function fetchPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("pinned", { ascending: false })
    .order("position", { ascending: true })
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
  return (data ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    tag: p.tag ?? "",
    date: p.date,
    image: p.image ?? "",
    description: p.description ?? "",
    link: p.link ?? "",
    author: p.author ?? "In Game",
    pinned: !!p.pinned,
    position: p.position ?? 0,
    slug: p.slug ?? "",
    subtitle: p.subtitle ?? "",
    content: p.content ?? "",
    featured: !!p.featured,
    review_grade: p.review_grade ?? "",
    review_note: p.review_note ?? "",
    review_summary: (p as any).review_summary ?? "",
    review_game_name: (p as any).review_game_name ?? "",
    review_tech_info: ((p as any).review_tech_info ?? {}) as Record<string, string>,
    author_socials: Array.isArray((p as any).author_socials) ? ((p as any).author_socials as string[]).filter(Boolean) : [],
  }));
}

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const refresh = useCallback(async () => {
    const data = await fetchPosts();
    setPosts(data);
  }, []);

  useEffect(() => {
    refresh();
    const channel = supabase
      .channel(`posts-changes-${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        () => refresh()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refresh]);

  const create = useCallback(async (post: Omit<Post, "id">) => {
    const { error } = await supabase.from("posts").insert([post]);
    if (error) {
      console.error("Failed to create post:", error);
      throw error;
    }
    await refresh();
  }, [refresh]);

  const update = useCallback(async (id: string, patch: Partial<Post>) => {
    const { error } = await supabase.from("posts").update(patch).eq("id", id);
    if (error) {
      console.error("Failed to update post:", error);
      throw error;
    }
    await refresh();
  }, [refresh]);

  const remove = useCallback(async (id: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      console.error("Failed to delete post:", error);
      throw error;
    }
    await refresh();
  }, [refresh]);

  const resetToDefaults = useCallback(async () => {
    await supabase.from("posts").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    const { error } = await supabase.from("posts").insert(defaultPosts);
    if (error) {
      console.error("Failed to reset posts:", error);
      throw error;
    }
    await refresh();
  }, [refresh]);

  return { posts, create, update, remove, resetToDefaults };
};
