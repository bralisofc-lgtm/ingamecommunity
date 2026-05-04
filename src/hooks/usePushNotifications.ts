import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const SEEN_KEY = "ingame:push:lastSeenPostId";
const ASKED_KEY = "ingame:push:asked";

type Permission = "default" | "granted" | "denied" | "unsupported";

export const usePushNotifications = () => {
  const [permission, setPermission] = useState<Permission>(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
    return Notification.permission as Permission;
  });
  const lastSeenRef = useRef<string | null>(localStorage.getItem(SEEN_KEY));

  // Pede permissão automaticamente uma vez (após pequeno atraso para não atrapalhar UX).
  useEffect(() => {
    if (permission !== "default") return;
    if (localStorage.getItem(ASKED_KEY)) return;
    const t = setTimeout(() => {
      localStorage.setItem(ASKED_KEY, "1");
      Notification.requestPermission().then((p) => setPermission(p as Permission));
    }, 4000);
    return () => clearTimeout(t);
  }, [permission]);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return;
    const p = await Notification.requestPermission();
    localStorage.setItem(ASKED_KEY, "1");
    setPermission(p as Permission);
  }, []);

  const notify = useCallback(
    (title: string, body: string, url?: string) => {
      if (permission !== "granted") return;
      try {
        const n = new Notification(title, {
          body,
          icon: "/favicon.ico",
          badge: "/favicon.ico",
          tag: "ingame-new-post",
        });
        n.onclick = () => {
          window.focus();
          if (url) window.open(url, "_blank", "noopener,noreferrer");
          n.close();
        };
      } catch {
        /* noop */
      }
    },
    [permission]
  );

  // Escuta novas postagens em tempo real e dispara notificação.
  useEffect(() => {
    const channel = supabase
      .channel("posts-push")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => {
          const post = payload.new as {
            id: string;
            title?: string;
            description?: string;
            link?: string;
          };
          if (!post?.id) return;
          if (lastSeenRef.current === post.id) return;
          lastSeenRef.current = post.id;
          localStorage.setItem(SEEN_KEY, post.id);
          notify(
            `Nova postagem: ${post.title ?? "In Game"}`,
            post.description?.slice(0, 140) || "Confira agora na comunidade.",
            post.link
          );
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [notify]);

  return { permission, requestPermission };
};
