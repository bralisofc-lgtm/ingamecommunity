/**
 * Auto-select an editorial emoji based on title/tag/description.
 * Order matters: the first matching keyword wins.
 */
const RULES: Array<{ emoji: string; words: string[] }> = [
  { emoji: "👻", words: ["terror", "horror", "assombr", "fantasma", "medo", "sombr"] },
  { emoji: "🩸", words: ["sangue", "gore", "violent", "brutal"] },
  { emoji: "⚔️", words: ["soulslike", "souls", "elden", "dark souls", "boss", "rpg de ação"] },
  { emoji: "🚀", words: ["sci-fi", "ficção", "ficcao", "espacial", "espaço", "futurista", "cyber"] },
  { emoji: "🏆", words: ["review", "análise", "analise", "veredicto"] },
  { emoji: "🧠", words: ["reflex", "puzzle", "quebra-cabeça", "ensaio"] },
  { emoji: "🌌", words: ["explor", "mundo aberto", "open world", "aventura"] },
  { emoji: "🎭", words: ["narrativ", "história", "historia", "drama", "roteiro"] },
  { emoji: "🎵", words: ["trilha", "soundtrack", "música", "musica", "ost"] },
  { emoji: "📸", words: ["fotografia", "foto", "screenshot"] },
  { emoji: "💜", words: ["indie emocional", "emocional", "comov"] },
  { emoji: "📰", words: ["notícia", "noticia", "anúncio", "anuncio", "lançamento"] },
  { emoji: "🔥", words: ["ação", "acao", "intens", "frenét", "frenet"] },
  { emoji: "🤝", words: ["parceria", "colab"] },
  { emoji: "🧩", words: ["indie misterioso", "misterio", "mistério", "enigma"] },
  { emoji: "🎮", words: ["game", "jogo", "indie", "comunidade"] },
];

export function pickPostEmoji(input: {
  title?: string;
  tag?: string;
  description?: string;
}): string {
  const haystack = `${input.title ?? ""} ${input.tag ?? ""} ${input.description ?? ""}`.toLowerCase();
  for (const rule of RULES) {
    if (rule.words.some((w) => haystack.includes(w))) return rule.emoji;
  }
  return "🎮";
}
