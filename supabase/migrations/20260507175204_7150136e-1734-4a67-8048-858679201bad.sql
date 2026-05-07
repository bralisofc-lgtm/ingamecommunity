
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS review_summary text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS review_game_name text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS review_tech_info jsonb NOT NULL DEFAULT '{}'::jsonb;
