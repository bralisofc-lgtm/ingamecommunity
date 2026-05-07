ALTER TABLE public.posts 
  ADD COLUMN IF NOT EXISTS review_grade text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS review_note text NOT NULL DEFAULT '';