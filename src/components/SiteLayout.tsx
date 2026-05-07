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
  image?: string;
  canonical?: string;
}

const YGP_URL = "https://yourgamerprofile.com/community/in-game";

const upsertMeta = (selector: string, attr: "name" | "property", key: string, value: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
};

const SiteLayout = ({ children, title, description, image, canonical }: Props) => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [navbarVisible, setNavbarVisible] = useState(!isHome);

  useEffect(() => {
    if (title) {
      document.title = title;
      upsertMeta('meta[property="og:title"]', "property", "og:title", title);
      upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    }
    if (description) {
      upsertMeta('meta[name="description"]', "name", "description", description);
      upsertMeta('meta[property="og:description"]', "property", "og:description", description);
      upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    }
    if (image) {
      upsertMeta('meta[property="og:image"]', "property", "og:image", image);
      upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", image);
      upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    }
    if (canonical) {
      upsertMeta('meta[property="og:url"]', "property", "og:url", canonical);
      let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [title, description, image, canonical]);

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
