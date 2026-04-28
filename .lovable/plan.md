## Goal

Reforçar a estética indie animada do hero adicionando uma camada de **partículas roxas brilhantes** + **pequenos ícones abstratos** (fantasmas, controles, sparkles, pixels, diamantes, corações pixel) flutuando suavemente sobre a paisagem, sem atrapalhar a leitura da logo e dos botões.

## What will be built

### 1. New component: `src/components/HeroParticles.tsx`

- Camada `pointer-events-none absolute inset-0` posicionada sobre a paisagem do hero, abaixo do conteúdo (z-index entre vinheta e logo).
- **22 partículas pontuais**: pequenos círculos roxos brilhantes (2-7px) com `box-shadow` glow, posições determinísticas (sem hidratação inconsistente), animação de "drift" orgânica (movimento lateral + vertical leve, opacidade pulsante).
- **10 ícones SVG abstratos** desenhados inline (sem dependência externa):
  - Fantasma estilo Pac-Man
  - Controle de videogame
  - Sparkle / estrela 4 pontas
  - Cluster de pixels
  - Diamante facetado
  - Coração pixel-art
- Cada ícone usa cores semânticas (`hsl(var(--primary))` / `hsl(var(--primary-glow))`) com opacidade entre 45-85% e `drop-shadow` glow.
- Cada elemento tem `delay`, `duration`, `drift` e `rotate` próprios via CSS custom properties para movimento natural e dessincronizado.

### 2. Mount no hero — `src/pages/Index.tsx`

- Importar `HeroParticles`.
- Renderizar logo após a vinheta (linha ~71), antes do bloco de conteúdo. A camada de partículas fica entre a paisagem e a logo.

### 3. Novas keyframes em `src/index.css`

- `particle-drift`: movimento orgânico XY com pulso de opacidade (0.35 → 0.9).
- `icon-float`: deriva + rotação leve + escala sutil (0.45 → 0.85 opacity).
- Ambos usam `--drift` e `--rot` como CSS variables passadas via inline style para individualizar cada partícula.

## Visual design notes

- Cores estritamente do design system (primary / primary-glow), nada hardcoded.
- Glow via `box-shadow` para dots e `filter: drop-shadow` para SVGs — mantém a vibe indie/neon coerente com o resto do site.
- Posições determinísticas (fórmulas baseadas no índice) para evitar shifts em re-renders.
- `pointer-events-none` em todo wrapper — não bloqueia clique nos botões.
- Performance: `will-change: transform, opacity`, sem `backdrop-filter`, animações puramente CSS.

## Files

- **Create**: `src/components/HeroParticles.tsx`
- **Edit**: `src/pages/Index.tsx` (1 import + 1 linha de mount)
- **Edit**: `src/index.css` (adiciona 2 keyframes + 2 classes)

## Out of scope

- Não altera logo, botões, transição de scroll ou textos.
- Não toca em outras páginas.
