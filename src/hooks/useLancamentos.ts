import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Lancamento {
  id: string;
  nome: string;
  data_lancamento: string; // YYYY-MM-DD
  plataformas: string[];
  link: string | null;
  igdb_id: number | null;
  cover_url: string | null;
  destaque: boolean;
}

export interface Evento {
  id: string;
  nome: string;
  data: string; // YYYY-MM-DD
  horario: string | null; // HH:MM:SS
  banner_url: string | null;
  descricao: string | null;
  link: string | null;
  destaque: boolean;
}

const mapLanc = (r: any): Lancamento => ({
  id: r.id,
  nome: r.nome ?? "",
  data_lancamento: r.data_lancamento,
  plataformas: Array.isArray(r.plataformas) ? r.plataformas : [],
  link: r.link ?? null,
  igdb_id: r.igdb_id ?? null,
  cover_url: r.cover_url ?? null,
  destaque: !!r.destaque,
});

const mapEvt = (r: any): Evento => ({
  id: r.id,
  nome: r.nome ?? "",
  data: r.data,
  horario: r.horario ?? null,
  banner_url: r.banner_url ?? null,
  descricao: r.descricao ?? null,
  link: r.link ?? null,
  destaque: !!r.destaque,
});

export const useLancamentos = () => {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [l, e] = await Promise.all([
      supabase.from("lancamentos").select("*").order("data_lancamento", { ascending: true }),
      supabase.from("eventos").select("*").order("data", { ascending: true }),
    ]);
    if (!l.error) setLancamentos((l.data ?? []).map(mapLanc));
    if (!e.error) setEventos((e.data ?? []).map(mapEvt));
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const ch = supabase
      .channel("lancamentos-eventos-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "lancamentos" }, () => refresh())
      .on("postgres_changes", { event: "*", schema: "public", table: "eventos" }, () => refresh())
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [refresh]);

  // -------- Lançamentos CRUD --------
  const createLancamento = useCallback(
    async (data: Omit<Lancamento, "id">) => {
      const { error } = await supabase.from("lancamentos").insert([data as any]);
      if (error) throw error;
      await refresh();
    },
    [refresh],
  );

  const updateLancamento = useCallback(
    async (id: string, patch: Partial<Omit<Lancamento, "id">>) => {
      const { error } = await supabase.from("lancamentos").update(patch).eq("id", id);
      if (error) throw error;
      await refresh();
    },
    [refresh],
  );

  const deleteLancamento = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("lancamentos").delete().eq("id", id);
      if (error) throw error;
      await refresh();
    },
    [refresh],
  );

  // -------- Eventos CRUD --------
  const createEvento = useCallback(
    async (data: Omit<Evento, "id">) => {
      const { error } = await supabase.from("eventos").insert([data as any]);
      if (error) throw error;
      await refresh();
    },
    [refresh],
  );

  const updateEvento = useCallback(
    async (id: string, patch: Partial<Omit<Evento, "id">>) => {
      const { error } = await supabase.from("eventos").update(patch).eq("id", id);
      if (error) throw error;
      await refresh();
    },
    [refresh],
  );

  const deleteEvento = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("eventos").delete().eq("id", id);
      if (error) throw error;
      await refresh();
    },
    [refresh],
  );

  const uploadEventoBanner = useCallback(async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `banners/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("eventos").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });
    if (error) throw error;
    const { data } = supabase.storage.from("eventos").getPublicUrl(path);
    return data.publicUrl;
  }, []);

  // -------- Steam --------
  const searchSteam = useCallback(
    async (query: string): Promise<any[]> => {
      const { data, error } = await supabase.functions.invoke("steam-search", {
        body: { mode: "search", query },
      });
      if (error) return [];
      return (data as any)?.results ?? [];
    },
    [],
  );

  const fetchSteamById = useCallback(async (id: number): Promise<any | null> => {
    const { data, error } = await supabase.functions.invoke("steam-search", {
      body: { mode: "by_id", id },
    });
    if (error) return null;
    const arr = (data as any)?.results ?? [];
    return arr[0] ?? null;
  }, []);

  // Aliases legados
  const searchIgdb = searchSteam;
  const fetchIgdbById = fetchSteamById;

  return {
    lancamentos,
    eventos,
    loading,
    refresh,
    createLancamento,
    updateLancamento,
    deleteLancamento,
    createEvento,
    updateEvento,
    deleteEvento,
    uploadEventoBanner,
    searchSteam,
    fetchSteamById,
    searchIgdb,
    fetchIgdbById,
  };
};
