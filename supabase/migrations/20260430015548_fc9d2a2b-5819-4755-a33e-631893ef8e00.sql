
-- Tabela FAQS
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view faqs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Admins can create faqs" ON public.faqs FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update faqs" ON public.faqs FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete faqs" ON public.faqs FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed FAQs com os atuais
INSERT INTO public.faqs (question, answer, position) VALUES
('🔍 : Como Funciona o Jogo Misterioso',
'O Jogo Misterioso é uma forma de manter a comunidade sempre ativa e envolvida. De tempos em tempos, ele é sorteado de forma inesperada, geralmente durante a madrugada como uma maneira de valorizar quem está presente e participando.

Não existe uma data fixa para esses sorteios, eles acontecem de forma totalmente surpresa, então quanto mais você acompanha e interage, maiores são as chances de não perder quando acontecer.

Após o encerramento do sorteio, o jogo é revelado para todos, mostrando qual título estava sendo distribuído naquele momento.', 1),
('🎁 : Sobre Sorteios',
'No momento, todos os jogos distribuídos nos sorteios são resgatáveis exclusivamente na Steam.', 2),
('💬 : Sua Participação na Comunidade',
'Com a sua participação, através de interações, opiniões e experiências, ajudamos a construir um espaço mais ativo e significativo para todos, que ao longo do tempo, também serão realizados sorteios de jogos indie, como forma de valorizar e engajar ainda mais quem faz parte da comunidade.

Portanto, precisamos manter sempre o respeito ao próximo e evitar qualquer tipo de toxicidade, focando em discussões saudáveis e construtivas.', 3),
('📌 : Proposta da Comunidade',
'A comunidade tem como objetivo trazer informações, possíveis reviews e análises sobre jogos independentes, criando um espaço de descoberta e discussão.

A ideia é dar mais visibilidade a projetos que muitas vezes passam despercebidos, valorizando não só o jogo em si mas também o trabalho por trás dele.', 4);

-- Tabela PARCEIROS
CREATE TABLE public.parceiros (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  link TEXT NOT NULL DEFAULT '',
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.parceiros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view parceiros" ON public.parceiros FOR SELECT USING (true);
CREATE POLICY "Admins can create parceiros" ON public.parceiros FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update parceiros" ON public.parceiros FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete parceiros" ON public.parceiros FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_parceiros_updated_at BEFORE UPDATE ON public.parceiros FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.faqs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.parceiros;

-- Storage bucket público para imagens de parceiros
INSERT INTO storage.buckets (id, name, public) VALUES ('parceiros', 'parceiros', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read parceiros bucket" ON storage.objects FOR SELECT USING (bucket_id = 'parceiros');
CREATE POLICY "Admins upload parceiros" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'parceiros' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins update parceiros" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'parceiros' AND has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete parceiros" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'parceiros' AND has_role(auth.uid(), 'admin'::app_role));

-- Conceder admin para bralisofc@gmail.com (se já existir como usuário)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM auth.users WHERE email = 'bralisofc@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
