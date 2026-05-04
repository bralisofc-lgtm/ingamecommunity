
-- Tighten push_subscriptions: remove anon write access. Table is not currently
-- used by the client; restrict to admins until a server-side endpoint exists.
DROP POLICY IF EXISTS "Anyone can unsubscribe by endpoint" ON public.push_subscriptions;
DROP POLICY IF EXISTS "Anyone can subscribe to push" ON public.push_subscriptions;

CREATE POLICY "Admins can delete push subscriptions"
  ON public.push_subscriptions FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert push subscriptions"
  ON public.push_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Lock down trigger helper function (only used by triggers, not by clients).
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
