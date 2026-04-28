import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Sobre from "./pages/Sobre.tsx";
import Admin from "./pages/Admin.tsx";
import Faqs from "./pages/Faqs.tsx";
import NotFound from "./pages/NotFound.tsx";
import IntroLoader from "./components/IntroLoader";

const queryClient = new QueryClient();

const AppShell = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const alreadySeen =
    typeof window !== "undefined" &&
    sessionStorage.getItem("ingame_intro_seen") === "1";
  const [showIntro, setShowIntro] = useState(isHome && !alreadySeen);
  const [siteVisible, setSiteVisible] = useState(!showIntro);

  return (
    <>
      {showIntro && (
        <IntroLoader
          onFinish={() => {
            setShowIntro(false);
            // small delay so site fades in after door fully opens
            setTimeout(() => setSiteVisible(true), 50);
          }}
        />
      )}
      <div
        className={`transition-opacity duration-1000 ${
          siteVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/faqs" element={<Faqs />} />
          {/* Painel oculto — não está no menu, acesse via /lugar-de-post */}
          <Route path="/lugar-de-post" element={<Admin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

