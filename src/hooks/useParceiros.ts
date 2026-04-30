import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Parceiro {
  id: string;
  name: string;
  image: string;
  description: string;
  link: string;
  position: number;
}

export const useParceiros = () => {
  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from("parceiros")
      .select("*")
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) {
      console.error("Failed to fetch parceiros:", error);
      setParceiros([]);
    } else {
      setParceiros(
        (data ?? []).map((p) => ({
          id: p.id,
          name: p.name,
          image: p.image ?? "",
          description: p.description ?? "",
          link: p.link ?? "",
          position: p.position,
        }))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const channel = supabase
      .channel("parceiros-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "parceiros" }, () => refresh())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refresh]);

  const create = useCallback(
    async (p: Omit<Parceiro, "id">) => {
      const { error } = await supabase.from("parceiros").insert([p]);
      if (error) throw error;
      await refresh();
    },
    [refresh]
  );

  const update = useCallback(
    async (id: string, patch: Partial<Omit<Parceiro, "id">>) => {
      const { error } = await supabase.from("parceiros").update(patch).eq("id", id);
      if (error) throw error;
      await refresh();
    },
    [refresh]
  );

  const remove = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("parceiros").delete().eq("id", id);
      if (error) throw error;
      await refresh();
    },
    [refresh]
  );

  const uploadImage = useCallback(async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("parceiros").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });
    if (error) throw error;
    const { data } = supabase.storage.from("parceiros").getPublicUrl(path);
    return data.publicUrl;
  }, []);

  return { parceiros, loading, create, update, remove, uploadImage };
};
