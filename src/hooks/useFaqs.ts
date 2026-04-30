import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Faq {
  id: string;
  question: string;
  answer: string;
  position: number;
}

export const useFaqs = () => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) {
      console.error("Failed to fetch faqs:", error);
      setFaqs([]);
    } else {
      setFaqs(
        (data ?? []).map((f) => ({
          id: f.id,
          question: f.question,
          answer: f.answer,
          position: f.position,
        }))
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const channel = supabase
      .channel("faqs-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "faqs" }, () => refresh())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refresh]);

  const create = useCallback(
    async (faq: Omit<Faq, "id">) => {
      const { error } = await supabase.from("faqs").insert([faq]);
      if (error) throw error;
      await refresh();
    },
    [refresh]
  );

  const update = useCallback(
    async (id: string, patch: Partial<Omit<Faq, "id">>) => {
      const { error } = await supabase.from("faqs").update(patch).eq("id", id);
      if (error) throw error;
      await refresh();
    },
    [refresh]
  );

  const remove = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("faqs").delete().eq("id", id);
      if (error) throw error;
      await refresh();
    },
    [refresh]
  );

  return { faqs, loading, create, update, remove };
};
