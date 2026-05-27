
-- Stats table (one row per post)
CREATE TABLE IF NOT EXISTS public.post_stats (
  post_id uuid PRIMARY KEY,
  views bigint NOT NULL DEFAULT 0,
  clicks bigint NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.post_stats TO anon, authenticated;
GRANT ALL ON public.post_stats TO service_role;

ALTER TABLE public.post_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view post stats"
  ON public.post_stats FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage post stats"
  ON public.post_stats FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- RPC to increment (callable by anon)
CREATE OR REPLACE FUNCTION public.increment_post_stat(_post_id uuid, _kind text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _kind NOT IN ('view', 'click') THEN
    RAISE EXCEPTION 'invalid kind';
  END IF;

  INSERT INTO public.post_stats (post_id, views, clicks)
  VALUES (
    _post_id,
    CASE WHEN _kind = 'view' THEN 1 ELSE 0 END,
    CASE WHEN _kind = 'click' THEN 1 ELSE 0 END
  )
  ON CONFLICT (post_id) DO UPDATE
  SET
    views = public.post_stats.views + CASE WHEN _kind = 'view' THEN 1 ELSE 0 END,
    clicks = public.post_stats.clicks + CASE WHEN _kind = 'click' THEN 1 ELSE 0 END,
    updated_at = now();
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_post_stat(uuid, text) TO anon, authenticated;
