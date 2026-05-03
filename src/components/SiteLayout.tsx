import { ReactNode, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ParticlesBackground from "@/components/ParticlesBackground";
import ygpLogo from "@/assets/ygp-logo.png";


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
    <div className="relative min-h-screen overflow-x-hidden w-full max-w-[100vw]">
      <ParticlesBackground />
      <Navbar />
      <div className="fixed top-3 right-3 md:top-4 md:right-5 z-[60] flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/20 backdrop-blur-md border border-foreground/10 opacity-60 hover:opacity-100 transition-opacity pointer-events-none select-none">
        <img src={ygpLogo} alt="YGP" className="h-5 w-5 md:h-6 md:w-6 object-contain opacity-80" />
        <span className="text-[10px] md:text-xs uppercase tracking-widest text-foreground/70 font-medium">
          Comunidade original do YGP
        </span>
      </div>
      <main className="relative z-10 overflow-x-hidden w-full max-w-[100vw]">{children}</main>
    </div>
  );
};

export default SiteLayout;
