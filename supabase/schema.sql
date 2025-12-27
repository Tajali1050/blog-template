-- ============================================
-- Supabase Database Schema for Case Studies
-- ============================================
-- Run this SQL in your Supabase SQL Editor

-- Case Studies Table
CREATE TABLE IF NOT EXISTS case_studies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  read_time TEXT,
  author TEXT,
  thumbnail TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

-- Public read access policy (anyone can view case studies)
CREATE POLICY "Public can view case studies" ON case_studies
  FOR SELECT USING (true);

-- Authenticated users can insert
CREATE POLICY "Authenticated users can insert" ON case_studies
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Authenticated users can update
CREATE POLICY "Authenticated users can update" ON case_studies
  FOR UPDATE TO authenticated
  USING (true);

-- Authenticated users can delete
CREATE POLICY "Authenticated users can delete" ON case_studies
  FOR DELETE TO authenticated
  USING (true);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_case_studies_updated_at
  BEFORE UPDATE ON case_studies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster slug lookups
CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies(slug);

-- Create index for date ordering
CREATE INDEX IF NOT EXISTS idx_case_studies_date ON case_studies(date DESC);


-- ============================================
-- Supabase Storage Bucket for Thumbnails
-- ============================================
-- Note: You need to create this bucket manually in the Supabase dashboard
-- or run this if you have storage schema access:

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('case-studies', 'case-studies', true)
-- ON CONFLICT (id) DO NOTHING;

-- Storage policy for public read access
-- CREATE POLICY "Public can view thumbnails" ON storage.objects
--   FOR SELECT USING (bucket_id = 'case-studies');

-- Storage policy for authenticated upload
-- CREATE POLICY "Authenticated can upload thumbnails" ON storage.objects
--   FOR INSERT TO authenticated
--   WITH CHECK (bucket_id = 'case-studies');
