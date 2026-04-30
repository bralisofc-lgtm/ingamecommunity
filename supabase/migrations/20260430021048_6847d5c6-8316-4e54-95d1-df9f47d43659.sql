-- Tabela para armazenar subscriptions de push notifications dos visitantes
CREATE TABLE public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Qualquer visitante (mesmo anônimo) pode se inscrever
CREATE POLICY "Anyone can subscribe to push"
ON public.push_subscriptions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Qualquer visitante pode remover sua subscription pelo endpoint
CREATE POLICY "Anyone can unsubscribe by endpoint"
ON public.push_subscriptions
FOR DELETE
TO anon, authenticated
USING (true);

-- Apenas admins podem listar (proteger dados de endpoints)
CREATE POLICY "Admins can view subscriptions"
ON public.push_subscriptions
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_push_subscriptions_endpoint ON public.push_subscriptions(endpoint);