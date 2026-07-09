import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Sobre from "./pages/Sobre.tsx";
import PostPage from "./pages/PostPage.tsx";

import Admin from "./pages/Admin.tsx";
import Faqs from "./pages/Faqs.tsx";
import Parceiros from "./pages/Parceiros.tsx";
import SorteiosRealizados from "./pages/SorteiosRealizados.tsx";
import Showcases from "./pages/Showcases.tsx";
import Auth from "./pages/Auth.tsx";
import NotFound from "./pages/NotFound.tsx";
import RequireAdmin from "./components/RequireAdmin.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/post/:slug" element={<PostPage />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/parceiros" element={<Parceiros />} />
          <Route path="/sorteios" element={<SorteiosRealizados />} />
          <Route path="/showcases" element={<Showcases />} />
          <Route path="/auth" element={<Auth />} />
          {/* Painel oculto — protegido por autenticação + role admin */}
          <Route
            path="/lugar-de-post"
            element={
              <RequireAdmin>
                <Admin />
              </RequireAdmin>
            }
          />
          {/* Compartilhamento curto: ingamecommunity.site/nome-do-post */}
          <Route path="/:slug" element={<PostPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
