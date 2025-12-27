-- ============================================
-- Supabase Storage Policies for Image Uploads
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- IMPORTANT: Run this AFTER creating the 'case-studies' bucket

-- First, make sure the bucket exists and is public
-- Go to: Storage > New bucket > name: "case-studies" > Public: ON

-- ============================================
-- Storage Policies
-- ============================================

-- 1. Allow anyone to view images (public read)
CREATE POLICY "Public can view uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'case-studies');

-- 2. Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'case-studies');

-- 3. Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'case-studies');

-- 4. Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'case-studies');
