import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  children: React.ReactNode;
}

const RequireAdmin = ({ children }: Props) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm uppercase tracking-widest text-muted-foreground animate-pulse">
          Carregando...
        </p>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-primary-glow uppercase tracking-[0.3em] text-xs font-bold">
          Acesso negado
        </p>
        <h1 className="text-3xl font-black">Você não é administrador</h1>
        <p className="text-muted-foreground max-w-md text-sm">
          Sua conta está autenticada, mas não possui permissão de administrador.
          Peça a um admin para conceder acesso.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireAdmin;
