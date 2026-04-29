
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  tag TEXT NOT NULL DEFAULT '',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  image TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  link TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view posts"
  ON public.posts FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create posts"
  ON public.posts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update posts"
  ON public.posts FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can delete posts"
  ON public.posts FOR DELETE
  USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
ALTER TABLE public.posts REPLICA IDENTITY FULL;
