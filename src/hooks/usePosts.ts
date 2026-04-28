import { useEffect, useState, useCallback } from "react";

export interface Post {
  id: string;
  title: string;
  tag: string;
  date: string; // ISO yyyy-mm-dd
  image: string;
  description: string;
  link: string;
}

const STORAGE_KEY = "ingame_posts_v1";

const defaultPosts: Post[] = [
  {
    id: "p1",
    title: "Hollow Knight: Silksong finalmente chegou",
    tag: "Análise",
    date: "2026-04-20",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    description:
      "Mergulhamos no aguardado novo capítulo do universo Hallownest. Confira nossas primeiras impressões.",
    link: "https://example.com/silksong",
  },
  {
    id: "p2",
    title: "Sorteio: 3 chaves de Hades II",
    tag: "Sorteio",
    date: "2026-04-18",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
    description:
      "Estamos sorteando chaves para a comunidade. Veja como participar e boa sorte a todos!",
    link: "https://example.com/sorteio",
  },
  {
    id: "p3",
    title: "5 indies brasileiros para ficar de olho",
    tag: "Lista",
    date: "2026-04-12",
    image:
      "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80",
    description:
      "A cena indie nacional está fervendo. Selecionamos cinco projetos imperdíveis feitos por aqui.",
    link: "https://example.com/indies-br",
  },
];

function load(): Post[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPosts;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return defaultPosts;
    return parsed as Post[];
  } catch {
    return defaultPosts;
  }
}

function save(posts: Post[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  window.dispatchEvent(new CustomEvent("ingame:posts-updated"));
}

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    setPosts(load());
    const onUpdate = () => setPosts(load());
    window.addEventListener("ingame:posts-updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("ingame:posts-updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  const create = useCallback((post: Omit<Post, "id">) => {
    const next = [{ ...post, id: crypto.randomUUID() }, ...load()];
    save(next);
  }, []);

  const update = useCallback((id: string, patch: Partial<Post>) => {
    const next = load().map((p) => (p.id === id ? { ...p, ...patch } : p));
    save(next);
  }, []);

  const remove = useCallback((id: string) => {
    save(load().filter((p) => p.id !== id));
  }, []);

  const resetToDefaults = useCallback(() => {
    save(defaultPosts);
  }, []);

  return { posts, create, update, remove, resetToDefaults };
};
