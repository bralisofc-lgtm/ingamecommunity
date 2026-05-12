# Plano: Skeletons suaves + Experiência "Sorteios"

## 1. Skeletons suaves no refresh em background
- Em `usePosts.ts`, expor flag `isRefreshing` (true quando há cache + fetch em andamento).
- Em `Index.tsx` / componentes que listam posts: quando `isRefreshing && posts.length > 0`, manter os posts visíveis e mostrar uma fina barra/overlay shimmer no topo da seção (sem trocar conteúdo). Quando não há cache, manter skeletons atuais.

## 2. Nova seção `/sorteios`

### Banco de dados (nova tabela `sorteios`)
Campos: `title`, `description`, `banner_image`, `game_logo`, `youtube_trailer`, `event_date`, `participate_link`, `participants_count`, `active`, `featured_next` (bool, único), `position`. RLS: leitura pública, escrita só admin (mesmo padrão de `posts`).

### Rotas e navegação
- Nova rota `/sorteios` em `App.tsx`.
- Ícone de presente (`Gift` do lucide) isolado no canto superior esquerdo da `Navbar`, com hover glow suave. Ao clicar, dispara transição e navega para `/sorteios`.

### Transição cinematográfica (`DimensionTransition.tsx`)
- Overlay full-screen com 5–6 faixas SVG orgânicas (paths curvos) atravessando horizontalmente em velocidades diferentes, blur + gradientes + sombras.
- Fase 1 (cobrir, ~900ms): faixas entram da esquerda, cobrem a tela.
- Fase 2 (revelar, ~900ms): faixas saem pela direita revelando o novo conteúdo.
- Usado tanto na entrada quanto na saída. Provider via contexto para dispar de qualquer botão.

### Página Sorteios (`pages/Sorteios.tsx`)
- Paleta exclusiva: fundo escuro profundo (`#070611` style), accent violeta/ciano, glow ambiente.
- Partículas leves reaproveitando `ParticlesBackground` com config mais sutil.
- Logo do site centralizada no topo em moldura com borda iluminada (gradient border + backdrop-blur).
- Lista de sorteios ativos como showcases cinematográficos:
  - Banner grande com parallax sutil no scroll, overlay escuro.
  - Logo do jogo posicionada bottom-left, título, data, participantes, descrição.
  - Botão "Participar" premium com hover (glow, scale, shimmer).
  - Trailer YouTube embed responsivo com bordas arredondadas e sombra.
- Seção "Próximo Sorteio" (item com `featured_next=true`):
  - Tipografia gigante, countdown animado até `event_date`, fades por scroll, partículas extras, efeitos de profundidade.
- Footer da página: seção preta minimalista com botão central "Voltar à Página Inicial" que dispara a mesma transição inversa rumo a `/`.

### Mobile
- Banners full-width, trailer 16:9 responsivo, stack vertical, sem parallax pesado em mobile (detectar via `useDevicePerf`/`useIsMobile`).

## 3. Painel Admin
- Novo `SorteiosAdminPanel.tsx` em `Admin.tsx` (nova aba).
- CRUD: upload de banner e logo do jogo (bucket `sorteios` público, criado via migration), campos de texto, data, link, participantes, toggle ativo, toggle "próximo em destaque" (garante apenas um), drag-handle simples para ordem (ou input de position).

## Detalhes técnicos
- Animações: CSS keyframes + `framer-motion`-style com transform/opacity (sem libs novas; usar Tailwind + CSS puro para performance).
- Todas as cores via tokens HSL no `index.css` (escopo `.sorteios-theme` para sobrescrever variáveis dentro da página).
- Performance: `will-change`, `transform: translateZ(0)`, reduzir partículas em devices fracos.
- SEO: title/meta dedicados em `/sorteios`.

## Arquivos criados/editados
- Migration: tabela `sorteios` + bucket de storage + policies.
- `src/hooks/usePosts.ts` (flag isRefreshing).
- `src/hooks/useSorteios.ts` (novo).
- `src/components/Navbar.tsx` (ícone presente isolado).
- `src/components/DimensionTransition.tsx` (novo, com provider).
- `src/pages/Sorteios.tsx` (novo).
- `src/components/sorteios/SorteioCard.tsx`, `NextSorteioHero.tsx`, `Countdown.tsx` (novos).
- `src/components/admin/SorteiosAdminPanel.tsx` (novo) + entrada em `Admin.tsx`.
- `src/App.tsx` (rota).
- `src/index.css` + `tailwind.config.ts` (tokens da paleta sorteios, keyframes).
- Skeleton shimmer leve em `Index.tsx`/lista existente.

Confirma para eu seguir?