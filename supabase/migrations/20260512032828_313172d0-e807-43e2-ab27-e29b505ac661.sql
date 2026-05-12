-- Tabela sorteios
CREATE TABLE public.sorteios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  banner_image TEXT NOT NULL DEFAULT '',
  game_logo TEXT NOT NULL DEFAULT '',
  youtube_trailer TEXT NOT NULL DEFAULT '',
  event_date TIMESTAMPTZ,
  participate_link TEXT NOT NULL DEFAULT '',
  participants_count INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  featured_next BOOLEAN NOT NULL DEFAULT false,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sorteios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sorteios" ON public.sorteios FOR SELECT USING (true);
CREATE POLICY "Admins can create sorteios" ON public.sorteios FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update sorteios" ON public.sorteios FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete sorteios" ON public.sorteios FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_sorteios_updated_at
BEFORE UPDATE ON public.sorteios
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Garante apenas um featured_next via índice parcial único
CREATE UNIQUE INDEX sorteios_only_one_featured_next ON public.sorteios (featured_next) WHERE featured_next = true;

-- Bucket de storage para sorteios
INSERT INTO storage.buckets (id, name, public) VALUES ('sorteios', 'sorteios', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read sorteios bucket" ON storage.objects FOR SELECT USING (bucket_id = 'sorteios');
CREATE POLICY "Admins upload sorteios" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'sorteios' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update sorteios files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'sorteios' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete sorteios files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'sorteios' AND has_role(auth.uid(), 'admin'::app_role));