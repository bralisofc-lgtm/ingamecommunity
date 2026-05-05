export const POST_TAGS = [
  "Comunidade",
  "Indie Misterioso",
  "Indies Recomendação",
  "Review",
  "Notícias",
  "Parcerias",
] as const;

export type PostTag = (typeof POST_TAGS)[number];

export const TAB_GROUPS = {
  "games-comunidade": {
    label: "Games e Comunidade",
    tags: ["Comunidade", "Indie Misterioso", "Indies Recomendação"] as const,
  },
  "review-noticias": {
    label: "Review e Notícias",
    tags: ["Review", "Notícias", "Parcerias"] as const,
  },
} as const;

export type TabGroupId = keyof typeof TAB_GROUPS;
