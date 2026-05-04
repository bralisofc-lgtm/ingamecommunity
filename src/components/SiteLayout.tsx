import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ParticlesBackground from "@/components/ParticlesBackground";
import ygpLogo from "@/assets/ygp-logo.png";
import SiteFooter from "@/components/SiteFooter";

interface Props {
  children: ReactNode;
  title?: string;
  description?: string;
}

const YGP_URL = "https://yourgamerprofile.com/community/in-game";

const SiteLayout = ({ children, title, description }: Props) => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [navbarVisible, setNavbarVisible] = useState(!isHome);

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

  useEffect(() => {
    if (!isHome) {
      setNavbarVisible(true);
      return;
    }
    const onScroll = () => setNavbarVisible(window.scrollY > window.innerHeight - 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  return (
    <div className="relative min-h-screen overflow-x-hidden w-full max-w-[100vw]">
      <ParticlesBackground />
      <Navbar />
      <a
        href={YGP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Comunidade original do YGP"
        className={`fixed top-3 right-3 md:top-4 md:right-5 z-[60] flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/20 backdrop-blur-md border border-foreground/10 hover:border-primary-glow/60 hover:bg-background/40 transition-all duration-500 ${
          navbarVisible ? "opacity-0 pointer-events-none -translate-y-2" : "opacity-70 hover:opacity-100"
        }`}
      >
        <img src={ygpLogo} alt="YGP" className="h-5 w-5 md:h-6 md:w-6 object-contain opacity-90" />
        <span className="text-[10px] md:text-xs uppercase tracking-widest text-foreground/80 font-medium">
          Comunidade original do YGP
        </span>
      </a>
      <main className="relative z-10 overflow-x-hidden w-full max-w-[100vw]">{children}</main>
      <SiteFooter />
    </div>
  );
};

export default SiteLayout;
