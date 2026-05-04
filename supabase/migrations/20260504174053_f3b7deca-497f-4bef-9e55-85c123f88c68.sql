
-- Restrict listing of objects in the public 'parceiros' bucket to admins.
-- Public direct URLs continue to work (they bypass RLS via the public endpoint).
DROP POLICY IF EXISTS "Public read parceiros bucket" ON storage.objects;

CREATE POLICY "Admins can list parceiros bucket"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'parceiros' AND has_role(auth.uid(), 'admin'::app_role));
