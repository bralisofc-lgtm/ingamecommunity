import { ReactNode, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ParticlesBackground from "@/components/ParticlesBackground";
import logo from "@/assets/ingame-logo.png";

interface Props {
  children: ReactNode;
  title?: string;
  description?: string;
}

const SiteLayout = ({ children, title, description }: Props) => {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description);
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [title, description]);

  return (
    <div className="relative min-h-screen">
      <ParticlesBackground />
      <Navbar />
      <main className="relative z-10">{children}</main>

      <footer className="relative z-10 py-10 px-4 border-t border-border/40 mt-10 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="In Game" className="h-9 w-auto" />
            <div>
              <p className="font-bold">In Game</p>
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} — feito com ♥ pela comunidade.
              </p>
            </div>
          </div>

          <ul className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <li><a href="/" className="hover:text-primary-glow transition-colors">Início</a></li>
            <li><a href="/sobre" className="hover:text-primary-glow transition-colors">Sobre</a></li>
            <li><a href="/apoiar" className="hover:text-primary-glow transition-colors">Apoiar</a></li>
          </ul>

          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            Indie • Criativo • Comunitário
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SiteLayout;
