ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS author text NOT NULL DEFAULT 'In Game',
  ADD COLUMN IF NOT EXISTS pinned boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS position integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_posts_pinned_position_date
  ON public.posts (pinned DESC, position ASC, date DESC, created_at DESC);