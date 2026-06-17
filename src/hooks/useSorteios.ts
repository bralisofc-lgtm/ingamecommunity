import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SorteioStatus = "ativo" | "realizado";

export interface Sorteio {
  id: string;
  title: string;
  banner_image: string;
  event_date: string | null; // ISO datetime
  participate_link: string;
  active: boolean;
  position: number;
  status: SorteioStatus;
}

const mapRow = (r: any): Sorteio => ({
  id: r.id,
  title: r.title ?? "",
  banner_image: r.banner_image ?? "",
  event_date: r.event_date ?? null,
  participate_link: r.participate_link ?? "",
  active: !!r.active,
  position: r.position ?? 0,
  status: (r.status === "ativo" ? "ativo" : "realizado"),
});

export const useSorteios = (opts?: { onlyActive?: boolean }) => {
  const onlyActive = opts?.onlyActive ?? false;
  const [sorteios, setSorteios] = useState<Sorteio[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    let query = supabase
      .from("sorteios")
      .select("*")
      .order("position", { ascending: true })
      .order("event_date", { ascending: false });
    if (onlyActive) query = query.eq("active", true);
    const { data, error } = await query;
    if (error) {
      console.error("Failed to fetch sorteios:", error);
      setSorteios([]);
    } else {
      setSorteios((data ?? []).map(mapRow));
    }
    setLoading(false);
  }, [onlyActive]);

  useEffect(() => {
    refresh();
    const channel = supabase
      .channel("sorteios-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sorteios" },
        () => refresh()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refresh]);

  const create = useCallback(
    async (s: Omit<Sorteio, "id">) => {
      const { error } = await supabase.from("sorteios").insert([{
        title: s.title,
        banner_image: s.banner_image,
        event_date: s.event_date,
        participate_link: s.participate_link,
        active: s.active,
        position: s.position,
      }]);
      if (error) throw error;
      await refresh();
    },
    [refresh]
  );

  const update = useCallback(
    async (id: string, patch: Partial<Omit<Sorteio, "id">>) => {
      const { error } = await supabase.from("sorteios").update(patch).eq("id", id);
      if (error) throw error;
      await refresh();
    },
    [refresh]
  );

  const remove = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("sorteios").delete().eq("id", id);
      if (error) throw error;
      await refresh();
    },
    [refresh]
  );

  const uploadBanner = useCallback(async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `banners/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("sorteios").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });
    if (error) throw error;
    const { data } = supabase.storage.from("sorteios").getPublicUrl(path);
    return data.publicUrl;
  }, []);

  return { sorteios, loading, create, update, remove, uploadBanner, refresh };
};
