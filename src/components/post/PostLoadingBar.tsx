import { useEffect, useState } from "react";

/**
 * Barra de progresso de carregamento.
 * - Modo padrão: fixa no topo da tela (page-load global).
 * - Modo inline: aparece no fluxo do conteúdo (substituindo um placeholder).
 */
const PostLoadingBar = ({
  trigger,
  inline = false,
}: {
  trigger?: string;
  inline?: boolean;
}) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    setProgress(0);

    const t1 = window.setTimeout(() => setProgress(35), 50);
    const t2 = window.setTimeout(() => setProgress(70), 220);
    const t3 = window.setTimeout(() => setProgress(92), 480);
    const t4 = window.setTimeout(() => setProgress(100), 780);
    const t5 = window.setTimeout(() => setVisible(false), 1100);

    return () => {
      [t1, t2, t3, t4, t5].forEach((t) => window.clearTimeout(t));
    };
  }, [trigger]);

  if (inline) {
    return (
      <div
        aria-hidden
        className={`w-full max-w-md h-[3px] rounded-full overflow-hidden bg-white/5 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className="h-full bg-gradient-to-r from-primary via-primary-glow to-primary shadow-[0_0_14px_hsl(var(--primary-glow)/0.9)] transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className={`fixed top-0 left-0 right-0 z-[100] h-[3px] pointer-events-none transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="h-full bg-gradient-to-r from-primary via-primary-glow to-primary shadow-[0_0_14px_hsl(var(--primary-glow)/0.9)] transition-[width] duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default PostLoadingBar;
