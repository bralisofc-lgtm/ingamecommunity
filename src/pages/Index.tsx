import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ParticlesBackground from "@/components/ParticlesBackground";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import SupportSection from "@/components/SupportSection";
import logo from "@/assets/ingame-logo.png";

const Index = () => {
  const [active, setActive] = useState("inicio");

  useEffect(() => {
    document.title = "In Game — Comunidade de jogos indies";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "In Game é uma comunidade feita por quem ama jogos indies. Descubra novos títulos, participe de sorteios e compartilhe experiências."
      );
    } else {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = "In Game é uma comunidade feita por quem ama jogos indies.";
      document.head.appendChild(m);
    }
  }, []);

  useEffect(() => {
    const sections = ["inicio", "sobre", "apoiar"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleNavigate = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen">
      <ParticlesBackground />
      <Navbar active={active} onNavigate={handleNavigate} />

      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <SupportSection />

        <footer className="relative py-10 px-4 border-t border-border/40 mt-10">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="In Game" className="h-8 w-auto" />
              <span className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} In Game — feito com ♥ pela comunidade.
              </span>
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              Indie • Criativo • Comunitário
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
