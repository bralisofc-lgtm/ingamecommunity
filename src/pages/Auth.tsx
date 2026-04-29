import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import SiteLayout from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  email: z.string().trim().email({ message: "Email inválido." }).max(254),
  password: z.string().min(6, { message: "Mínimo 6 caracteres." }).max(72),
});

const Auth = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      if (isAdmin) navigate("/lugar-de-post", { replace: true });
      else navigate("/", { replace: true });
    }
  }, [user, isAdmin, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast({
        title: "Verifique os campos",
        description: parsed.error.issues[0]?.message ?? "Dados inválidos.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "signup") {
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: redirectUrl },
        });
        if (error) throw error;
        toast({ title: "Conta criada", description: "Você já pode entrar." });
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        toast({ title: "Bem-vindo!" });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro inesperado.";
      toast({
        title: "Não foi possível continuar",
        description:
          message.includes("Invalid login")
            ? "Email ou senha incorretos."
            : message.includes("already registered")
            ? "Este email já está cadastrado. Faça login."
            : message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SiteLayout title="Acesso — In Game" description="Acesse o painel da comunidade In Game.">
      <section className="pt-28 pb-20 px-4 min-h-screen">
        <div className="container mx-auto max-w-md">
          <div className="mb-8 text-center animate-fade-up">
            <p className="text-primary-glow uppercase tracking-[0.3em] text-xs font-bold mb-2">
              Acesso restrito
            </p>
            <h1 className="text-4xl font-black">
              {mode === "signin" ? "Entrar" : "Criar conta"}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              {mode === "signin"
                ? "Acesse com sua conta de administrador."
                : "Crie sua conta. O acesso ao painel é concedido pelo administrador."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="indie-card p-6 md:p-8 space-y-5 animate-fade-up">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-primary-glow mb-2">
                Email
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-secondary/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none text-foreground"
                placeholder="voce@exemplo.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-primary-glow mb-2">
                Senha
              </label>
              <input
                type="password"
                required
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-secondary/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none text-foreground"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-glow w-full px-6 py-3 rounded-full text-primary-foreground font-bold uppercase tracking-wider text-xs disabled:opacity-60"
            >
              {submitting ? "Aguarde..." : mode === "signin" ? "Entrar" : "Criar conta"}
            </button>

            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="block w-full text-center text-xs uppercase tracking-widest text-muted-foreground hover:text-primary-glow"
            >
              {mode === "signin"
                ? "Não tem conta? Criar conta"
                : "Já tem conta? Entrar"}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link to="/" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary-glow">
              ← Voltar ao site
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Auth;
