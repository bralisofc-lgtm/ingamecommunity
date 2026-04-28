## Objetivo

Cada nova visita ao site mostra o loader com uma "skin" diferente — paleta de cores, intensidade do glow e ritmo da corrida variam levemente. A identidade indie/roxa permanece, mas o loader nunca parece exatamente igual duas vezes seguidas.

## Como funciona

Ao montar o `IntroLoader`, sorteamos um de ~6 temas pré-definidos. O tema controla:

- Cor do glow do personagem e da barra
- Cor do gradiente da barra (de → meio → para)
- Cor das partículas de poeira
- Intensidade do `box-shadow` (sutil, médio, forte)
- Velocidade do "bob" da corrida (entre 0.26s e 0.40s)
- Cor da borda das portas

Para evitar repetir o mesmo tema duas vezes seguidas, guardamos o último índice usado em `sessionStorage` (chave `ingame_loader_last_theme`) e re-sorteamos se cair no mesmo.

## Temas (todos derivados da identidade roxa neon do site)

1. Roxo Neon (padrão atual) — glow `--primary-glow`, bob 0.32s
2. Magenta Arcade — tons mais quentes (rosa/magenta), glow forte, bob 0.28s
3. Ciano Glitch — cian frio com toque roxo, glow médio, bob 0.30s
4. Verde Indie — verde-limão suave + roxo nas bordas, glow sutil, bob 0.34s
5. Âmbar Crepúsculo — laranja-âmbar com bordas roxas, glow médio, bob 0.36s
6. Branco Etéreo — quase monocromático claro com leve violeta, glow forte, bob 0.40s

Todas as cores são definidas em HSL para combinar com a estética do site, sem quebrar o contraste no fundo escuro.

## Detalhes técnicos

Arquivo único afetado: `src/components/IntroLoader.tsx`.

- Definir `const THEMES: LoaderTheme[]` com objetos contendo:
  ```ts
  type LoaderTheme = {
    name: string;
    barFrom: string;   // ex.: "270 90% 65%"
    barMid: string;
    barTo: string;
    glow: string;      // hsl raw para box-shadow/drop-shadow
    glowSoft: string;
    dust: string;
    doorBorder: string;
    bobMs: number;     // 260–400
    shadowStrength: number; // 0.4–0.9
  };
  ```
- Sortear no `useState` inicial usando `Math.random()`, lendo `sessionStorage.getItem("ingame_loader_last_theme")` para excluir o último.
- Após escolher, salvar o índice novo em `sessionStorage`.
- Substituir as cores hardcoded (`hsl(var(--primary-glow) / 0.9)`, etc.) por valores derivados do tema, usando estilos inline e variáveis CSS locais (`style={{ ['--ldr-glow' as any]: theme.glow }}`) para serem consumidas tanto pelos elementos quanto pelos keyframes.
- A duração do `runner-bob` vira inline: `animationDuration: \`${theme.bobMs}ms\``.
- Manter a logo, o personagem, as portas e o fluxo de fases exatamente iguais — a variação é puramente visual.

## Fora do escopo

- Não muda o personagem nem a logo.
- Não muda o fluxo de fases (`loading → doors → logo → done`).
- Não persiste preferência entre sessões diferentes (apenas evita repetir dentro da mesma sessão).
- Não adiciona controles de tema visíveis ao usuário.