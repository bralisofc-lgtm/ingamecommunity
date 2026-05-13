## Visão geral

Refazer toda a área `/admin` com uma identidade **dark + neon white**: fundo preto profundo, detalhes em branco neon, glassmorphism sutil, glow discreto, animações suaves. Inspirações: Linear, Framer, Vercel, Notion.

A entrega será dividida em **fases** para manter qualidade e permitir feedback. Esta proposta cobre a Fase 1 (shell + redesign + editor de posts premium). As demais fases ficam mapeadas no fim e podem ser feitas em mensagens seguintes.

---

## Fase 1 — Shell visual + Editor de Posts (esta entrega)

### 1. Design system "Admin Neon"

Adicionar tokens dedicados em `src/index.css` (escopados em `.admin-shell` para não vazar para o site público):

- `--admin-bg`: preto profundo (`hsl(0 0% 4%)`)
- `--admin-surface` / `--admin-surface-2`: cinzas muito escuros para cards
- `--admin-border`: branco com baixíssima opacidade
- `--admin-neon`: branco neon (`hsl(0 0% 100%)`) usado em glow
- `--admin-glow`: sombra `0 0 24px hsl(0 0% 100% / 0.08)`
- Utilitários: `.admin-card`, `.admin-input`, `.admin-btn`, `.admin-glass`, `.admin-glow-hover`

Fonte: manter a stack atual (Inter/sans), apenas tracking + pesos ajustados.

### 2. Shell do admin

Novo arquivo `src/components/admin/AdminShell.tsx`:

- Layout em duas colunas: **sidebar fixa** (260px, colapsa para 64px) + **conteúdo**.
- Topbar fina: breadcrumb + busca global (placeholder por enquanto) + avatar/logout.
- Sidebar com ícones lucide neon white, hover glow, indicador da aba ativa (barra vertical + leve bg branco 4%).
- Animação de troca de aba: fade + slide-up suave (`animate-fade-in`).

Categorias na sidebar (todas roteadas, mas só algumas com conteúdo nesta fase):

```
Dashboard       (placeholder "em breve")
Posts           ✅ refeito
Sorteios        (mantém painel atual embrulhado no novo visual)
Reviews         (atalho que filtra Posts por tag=Review)
Destaques       (atalho que filtra Posts featured/pinned)
Mídias          (placeholder)
SEO             (placeholder)
Estatísticas    (placeholder)
Aparência       (placeholder)
FAQs / Parceiros (mantidos, re-skin)
Configurações   (logout + reset defaults)
```

Placeholders mostram um card "em construção" no mesmo visual, sem quebrar nada.

### 3. Editor de Posts premium

Novo `src/components/admin/PostEditor.tsx` substitui o formulário gigante atual em `Admin.tsx`.

**Layout split 50/50** (empilha em mobile):

- **Esquerda — Preview ao vivo**
  - Renderiza usando os mesmos componentes da página real (`MarkdownRenderer`, `ReviewBadge`, `ReviewVerdict`, `AuthorSocials`, `PostLoadingBar`).
  - Atualiza em tempo real conforme o form muda (estado controlado).
  - Toggle desktop/mobile (botões com largura simulada `max-w-[420px]` no modo mobile).
  - Scroll independente, borda neon white, sombra cinematográfica.
  - Selo "RECENTE" automático quando data ≤ 7 dias.

- **Direita — Editor em blocos colapsáveis** (`Accordion` shadcn, re-skinned):
  1. **Informações principais**: título, subtítulo, descrição, banner (URL), categoria (tag), autor, data, slug.
  2. **Conteúdo**: textarea markdown grande + toolbar flutuante (ver item 4) + contador de palavras + tempo de leitura estimado (200 wpm).
  3. **Configurações**: switches para `pinned`, `featured`, posição.
  4. **Review** (só aparece se tag=Review): nome do jogo, nota, grade, summary, tech info (mantém os campos existentes, layout mais limpo).
  5. **Autor & Social**: campos de socials (até 3).
  6. **SEO** (visual): slug + preview de descrição (apenas UI nesta fase, sem novos campos no banco).

- **Auto-save em rascunho local**: `localStorage` por `editingId` (ou "new"), debounce 800ms, badge "Rascunho salvo" discreto.

- **Botões de ação fixos no topo do painel direito**: Cancelar / Duplicar / Salvar (Salvar com glow neon white).

### 4. Toolbar markdown minimalista

Novo `src/components/admin/MarkdownToolbar.tsx`:

- Aparece com fade+blur ao focar/hover na textarea (opacidade 0 → 1).
- Botões: Negrito, Itálico, H2, H3, Quote, Lista, Divisor, Link, Imagem, YouTube embed, Spoiler, Emoji.
- Tooltips com atalhos (Ctrl+B, Ctrl+I, Ctrl+K para link…).
- Implementação: insere markdown na posição do cursor da textarea.
- Atalhos de teclado via `keydown` no textarea.

### 5. Lista de posts re-skinada

Substitui a tabela atual por um grid de cards admin:

- Card com thumb, título, tag, data, badges (fixo/destaque), e ações (Editar / Duplicar / Mover ↑↓ / Excluir) num menu `...`.
- Busca instantânea (filtro client-side por título/tag/autor).
- Filtros rápidos por tag (chips).
- Skeletons elegantes durante o `loading` do `usePosts`.

### 6. Limpeza

- `src/pages/Admin.tsx` vira um shell fino que renderiza `AdminShell` + roteamento interno por estado (`activeSection`).
- `FaqAdminPanel` e `ParceirosAdminPanel` recebem wrapper visual novo (sem reescrever a lógica interna).
- Nada muda no site público nem no banco de dados nesta fase.

---

## Detalhes técnicos

- **Sem novas migrations** nesta fase — features como rascunhos no servidor, histórico de edição, mídias e estatísticas exigem schema novo e ficam para fases seguintes.
- Auto-save = `localStorage` (`ingame:admin:draft:<id|new>`).
- Duplicar post = pré-popula o form com cópia do post atual + sufixo "(cópia)" no título.
- Tempo de leitura = `Math.max(1, Math.ceil(words / 200))` minutos.
- Preview usa exatamente os componentes do `PostPage` para fidelidade total (sem reimplementar markdown).
- Acessibilidade: foco visível neon, `aria-label` nos ícones da sidebar, `prefers-reduced-motion` respeitado.
- Tudo dentro de `.admin-shell` para isolar tokens — site público intocado.

### Arquivos novos
```
src/components/admin/AdminShell.tsx
src/components/admin/AdminSidebar.tsx
src/components/admin/AdminTopbar.tsx
src/components/admin/PostEditor.tsx
src/components/admin/PostPreview.tsx
src/components/admin/PostList.tsx
src/components/admin/MarkdownToolbar.tsx
src/components/admin/sections/Placeholder.tsx
```

### Arquivos modificados
```
src/index.css         (tokens .admin-shell + utilitários)
src/pages/Admin.tsx   (vira shell fino)
src/components/admin/FaqAdminPanel.tsx     (wrapper visual)
src/components/admin/ParceirosAdminPanel.tsx (wrapper visual)
```

---

## Fases futuras (não incluídas agora)

- **Fase 2 — Mídias**: bucket `posts-media`, uploader drag&drop, biblioteca, copiar URL/markdown.
- **Fase 3 — Rascunhos no servidor + histórico**: tabela `post_drafts` + `post_revisions`, restaurar versão.
- **Fase 4 — Agendamento + ocultar**: colunas `scheduled_at`, `hidden`, filtro no site público.
- **Fase 5 — Estatísticas**: tabela `post_views`, edge function de tracking, dashboard com gráficos.
- **Fase 6 — SEO avançado**: campos `meta_title`, `meta_description`, `og_image` por post + preview Google/Twitter.
- **Fase 7 — Aparência**: editor de tema (cores, hero, footer) salvando em `site_settings`.

Posso começar pela Fase 1 assim que aprovar — ou ajustar o escopo antes.
