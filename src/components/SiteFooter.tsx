import { Bell, BellRing, BellOff } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";

const SiteFooter = () => {
  const { permission, requestPermission } = usePushNotifications();

  const label =
    permission === "granted"
      ? "Notificações ativadas"
      : permission === "denied"
        ? "Notificações bloqueadas"
        : permission === "unsupported"
          ? "Não suportado"
          : "Ativar notificações";

  const Icon =
    permission === "granted" ? BellRing : permission === "denied" ? BellOff : Bell;

  const disabled = permission === "granted" || permission === "denied" || permission === "unsupported";

  return (
    <footer className="relative border-t border-border/50 mt-10 py-8 px-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
        <p className="text-xs md:text-sm text-muted-foreground">
          © 2026 In Game Community. Todos os direitos reservados.
        </p>

        <button
          type="button"
          onClick={requestPermission}
          disabled={disabled}
          className="relative group inline-flex items-center gap-2 rounded-full p-[2px] disabled:opacity-70 disabled:cursor-not-allowed"
          style={{
            background:
              "linear-gradient(135deg, hsl(0 0% 100%) 0%, hsl(280 95% 72%) 50%, hsl(0 0% 100%) 100%)",
          }}
          aria-label={label}
          title={label}
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-primary-foreground font-bold uppercase tracking-wider text-xs shadow-[0_0_20px_hsl(var(--primary-glow)/0.5)] group-hover:shadow-[0_0_28px_hsl(var(--primary-glow)/0.8)] transition-shadow">
            <Icon className="w-4 h-4" />
            {label}
          </span>
        </button>
      </div>
    </footer>
  );
};

export default SiteFooter;
