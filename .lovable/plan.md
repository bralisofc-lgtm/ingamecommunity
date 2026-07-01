## Lançamentos Indies — Nova seção substituindo "Sobre a Comunidade"

Substituir completamente a página/seção "Sobre a Comunidade" por um hub de lançamentos indies com calendário, eventos/showcases e integração IGDB + painel admin.

### 1. Backend (Lovable Cloud)

**Novas tabelas:**

- `lancamentos`
  - `nome` (text), `data_lancamento` (date), `plataformas` (text[]), `link` (text), `igdb_id` (bigint), `cover_url` (text), `destaque` (bool), `created_at`, `updated_at`
- `eventos`
  - `nome` (text), `data` (date), `horario` (time), `banner_url` (text), `descricao` (text), `link` (text), `destaque` (bool), `created_at`, `updated_at`

**RLS:**
- SELECT público (anon + authenticated)
- INSERT/UPDATE/DELETE apenas para `admin` via `has_role(auth.uid(), 'admin')`
- GRANT padrão (anon SELECT, authenticated CRUD, service_role ALL)

**Storage:** reaproveitar bucket `sorteios` já existente para banners de eventos (ou criar `eventos` se preferir — vou criar `eventos` público).

**Edge Function `igdb-sync`:**
- Autentica em `https://id.twitch.tv/oauth2/token` com `TWITCH_CLIENT_ID` + `TWITCH_CLIENT_SECRET`
- Consulta IGDB `/games` filtrando `category = 0` + `themes` indie + `first_release_date >= now()`
- Pode ser chamada manualmente pelo admin ("Sincronizar IGDB") para popular `lancamentos`
- Também usada para buscar capa por `igdb_id` ao editar lançamento manual

> Vou pedir as credenciais Twitch/IGDB (`TWITCH_CLIENT_ID`, `TWITCH_CLIENT_SECRET`) via `add_secret` numa mensagem seguinte. Enquanto não houver credenciais, a sincronização IGDB fica desativada e o calendário usa apenas os lançamentos cadastrados manualmente + placeholder.

### 2. Frontend público

**Substituir `src/pages/Sobre.tsx`** pela página `LancamentosIndies`:

- Header: título "Lançamentos Indies" + subtítulo, no estilo visual atual (dark + roxo + glow sutil).
- **Calendário semanal**
  - Desktop: 7 colunas (dia da semana + data) com cards verticais (cover, nome, data, plataformas, link).
  - Tablet: 3–4 colunas com scroll horizontal.
  - Mobile: timeline vertical.
  - Navegação ‹ semana anterior › / próxima semana › / mês.
  - Badge "Esta semana" para lançamentos nos próximos 7 dias.
  - Badge "Aguardado" quando `destaque = true`.
  - Lançamentos com `data_lancamento < hoje` aparecem em sub-seção "Lançamentos Recentes" (últimos 30 dias).
- **Próximos Eventos e Showcases**
  - Grid de cards (banner, nome, data, horário, descrição, link).
  - Eventos nos próximos 30 dias recebem destaque + contagem regressiva ao vivo.
- Tudo usando tokens do design system (sem cores azuis/claras, paleta roxa escura existente).

**Rota:** manter `/sobre` apontando para a nova página (e atualizar o link "Comunidade" do footer para refletir o novo nome) — ou criar `/lancamentos` e redirecionar `/sobre` → `/lancamentos`. Vou usar `/lancamentos` e atualizar o footer.

### 3. Painel Admin

Em `src/pages/Admin*` adicionar duas abas:

- **Lançamentos**: listar/criar/editar/excluir/destacar + botão "Buscar do IGDB por ID" (chama edge function) + botão "Sincronizar próximos lançamentos indies".
- **Eventos**: listar/criar/editar/excluir/destacar, upload de banner via Storage.

### 4. Arquivos afetados

```text
supabase/migrations/<novo>.sql          (tabelas + RLS + grants)
supabase/functions/igdb-sync/index.ts   (nova edge function)
src/pages/LancamentosIndies.tsx         (nova, substitui Sobre)
src/components/lancamentos/Calendar.tsx
src/components/lancamentos/GameCard.tsx
src/components/lancamentos/EventCard.tsx
src/components/lancamentos/Countdown.tsx
src/pages/AdminLancamentos.tsx          (nova)
src/pages/AdminEventos.tsx              (nova)
src/components/SiteFooter.tsx           (atualizar link)
src/App.tsx                             (rotas)
```

### 5. Ordem de execução

1. Migration (tabelas + RLS + bucket).
2. Pedir secrets Twitch/IGDB e criar edge function `igdb-sync`.
3. Página pública + componentes.
4. Telas admin.
5. Atualizar rotas e link do footer; remover página `Sobre`.

Confirma? Em especial: (a) ok criar bucket `eventos` público? (b) ok usar a rota `/lancamentos` e remover `/sobre`? (c) você tem `TWITCH_CLIENT_ID`/`SECRET` em mãos para a integração IGDB, ou prefere que eu já entregue tudo manual e ligamos o IGDB depois?