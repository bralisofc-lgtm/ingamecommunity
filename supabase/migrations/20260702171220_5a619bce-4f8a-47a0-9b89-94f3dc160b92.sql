ALTER TABLE public.lancamentos
  ADD COLUMN IF NOT EXISTS ai_score int,
  ADD COLUMN IF NOT EXISTS ai_verdict text,
  ADD COLUMN IF NOT EXISTS auto boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS steam_appid bigint,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'coming_soon',
  ADD COLUMN IF NOT EXISTS last_synced_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS lancamentos_steam_appid_key
  ON public.lancamentos (steam_appid)
  WHERE steam_appid IS NOT NULL;

CREATE INDEX IF NOT EXISTS lancamentos_status_score_idx
  ON public.lancamentos (status, ai_score DESC);