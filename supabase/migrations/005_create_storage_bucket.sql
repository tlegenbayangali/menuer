-- Create storage bucket for dish images
INSERT INTO storage.buckets (id, name, public)
VALUES ('dish-images', 'dish-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for dish images
CREATE POLICY "Users can upload dish images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'dish-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Anyone can view dish images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'dish-images');

CREATE POLICY "Users can update their own dish images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'dish-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'dish-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own dish images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'dish-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);