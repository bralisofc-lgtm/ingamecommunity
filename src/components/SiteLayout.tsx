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
    </div>
  );
};

export default SiteLayout;
