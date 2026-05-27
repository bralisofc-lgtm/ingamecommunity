import { useState } from "react";
import { Shield, UserPlus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const AdminsPanel = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || password.length < 6) {
      toast({ title: "Preencha email válido e senha (6+ caracteres)", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-create-user", {
        body: { email: email.trim(), password },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      toast({ title: "Administrador criado", description: email.trim() });
      setEmail("");
      setPassword("");
    } catch (err: any) {
      toast({
        title: "Falha ao criar admin",
        description: err?.message ?? "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-section-anim max-w-xl space-y-5">
      <div>
        <p className="admin-h-eyebrow mb-1.5">Sistema</p>
        <h1 className="admin-h-title">Administradores</h1>
        <p className="text-sm text-white/50 mt-2">
          Crie uma nova conta com acesso total ao painel administrativo.
        </p>
      </div>

      <form onSubmit={submit} className="admin-card p-6 space-y-4">
        <div className="flex items-center gap-2 text-white/70 text-xs uppercase tracking-[0.25em] font-bold">
          <Shield className="w-3.5 h-3.5" />
          Novo administrador
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-[0.2em] text-white/50 font-semibold">
            Email
          </label>
          <input
            type="email"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@exemplo.com"
            className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-white/30 outline-none rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 transition-colors"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-[0.2em] text-white/50 font-semibold">
            Senha
          </label>
          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-white/30 outline-none rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-white/30 transition-colors"
            minLength={6}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="admin-btn admin-btn-primary w-full justify-center disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
          {loading ? "Criando…" : "Criar administrador"}
        </button>

        <p className="text-[11px] text-white/40 leading-relaxed">
          A conta é criada com email já confirmado e ganha permissão de administrador
          automaticamente. Compartilhe a senha de forma segura com o novo administrador.
        </p>
      </form>
    </div>
  );
};

export default AdminsPanel;
