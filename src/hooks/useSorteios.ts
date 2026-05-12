import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Sorteio {
  id: string;
  title: string;
  description: string;
  banner_image: string;
  game_logo: string;
  youtube_trailer: string;
  event_date: string | null;
  participate_link: string;
  participants_count: number;
  active: boolean;
  featured_next: boolean;
  position: number;
}

const CACHE_KEY = "ingame:sorteios:v1";

function readCache(): Sorteio[] {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Sorteio[]) : [];
  } catch {
    return [];
  }
}
function writeCache(s: Sorteio[]) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

async function fetchAll(): Promise<Sorteio[]> {
  const { data, error } = await supabase
    .from("sorteios")
    .select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("fetch sorteios", error);
    return [];
  }
  return (data ?? []).map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description ?? "",
    banner_image: s.banner_image ?? "",
    game_logo: s.game_logo ?? "",
    youtube_trailer: s.youtube_trailer ?? "",
    event_date: s.event_date ?? null,
    participate_link: s.participate_link ?? "",
    participants_count: s.participants_count ?? 0,
    active: !!s.active,
    featured_next: !!s.featured_next,
    position: s.position ?? 0,
  }));
}

export const useSorteios = () => {
  const [sorteios, setSorteios] = useState<Sorteio[]>(() => readCache());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(() => readCache().length > 0);
  const [loading, setLoading] = useState<boolean>(() => readCache().length === 0);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    const data = await fetchAll();
    setSorteios(data);
    writeCache(data);
    setLoading(false);
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    refresh();
    const channel = supabase
      .channel(`sorteios-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "sorteios" }, () => refresh())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refresh]);

  const create = useCallback(
    async (s: Omit<Sorteio, "id">) => {
      if (s.featured_next) {
        await supabase.from("sorteios").update({ featured_next: false }).eq("featured_next", true);
      }
      const { error } = await supabase.from("sorteios").insert([s]);
      if (error) throw error;
      await refresh();
    },
    [refresh],
  );

  const update = useCallback(
    async (id: string, patch: Partial<Omit<Sorteio, "id">>) => {
      if (patch.featured_next === true) {
        await supabase
          .from("sorteios")
          .update({ featured_next: false })
          .eq("featured_next", true)
          .neq("id", id);
      }
      const { error } = await supabase.from("sorteios").update(patch).eq("id", id);
      if (error) throw error;
      await refresh();
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("sorteios").delete().eq("id", id);
      if (error) throw error;
      await refresh();
    },
    [refresh],
  );

  const uploadImage = useCallback(async (file: File, prefix = "asset"): Promise<string> => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const path = `${prefix}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("sorteios")
      .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
    if (error) throw error;
    const { data } = supabase.storage.from("sorteios").getPublicUrl(path);
    return data.publicUrl;
  }, []);

  return { sorteios, loading, isRefreshing, refresh, create, update, remove, uploadImage };
};
