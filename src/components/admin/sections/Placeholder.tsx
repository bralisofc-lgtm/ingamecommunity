import { Sparkles } from "lucide-react";

interface Props {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const Placeholder = ({ title, description, icon: Icon = Sparkles }: Props) => {
  return (
    <div className="admin-section-anim flex items-center justify-center min-h-[60vh]">
      <div className="admin-card admin-glass p-10 max-w-md text-center">
        <div className="mx-auto w-14 h-14 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center mb-5 shadow-[0_0_30px_-8px_rgba(255,255,255,0.25)]">
          <Icon className="w-6 h-6 text-white/80" />
        </div>
        <p className="admin-h-eyebrow mb-2">Em construção</p>
        <h2 className="text-xl font-bold text-white mb-2 tracking-tight">{title}</h2>
        <p className="text-sm text-white/50 leading-relaxed">
          {description ??
            "Esta seção está sendo preparada e logo estará disponível com a mesma qualidade premium do restante do painel."}
        </p>
      </div>
    </div>
  );
};

export default Placeholder;
