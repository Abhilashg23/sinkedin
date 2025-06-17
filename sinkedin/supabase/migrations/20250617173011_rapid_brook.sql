/*
  # Setup Profile Pictures Storage

  1. Storage Setup
    - Create profile-pictures bucket with public access
    - Configure storage policies for authenticated users

  2. Security
    - Allow authenticated users to upload their own profile pictures
    - Allow public read access to profile pictures
    - Allow users to manage their own files

  Note: This migration uses Supabase's storage policy functions instead of direct table modifications
*/

-- Create the profile-pictures bucket if it doesn't exist
-- Using DO block to handle potential errors gracefully
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'profile-pictures', 
    'profile-pictures', 
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  );
EXCEPTION
  WHEN unique_violation THEN
    -- Bucket already exists, update its properties
    UPDATE storage.buckets 
    SET 
      public = true,
      file_size_limit = 5242880,
      allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    WHERE id = 'profile-pictures';
END $$;

-- Create storage policies using Supabase's policy creation approach
-- These policies will be created through the storage schema functions

-- Policy for uploading profile pictures (authenticated users only, own folder)
CREATE POLICY IF NOT EXISTS "Users can upload profile pictures"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-pictures' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy for viewing profile pictures (public access)
CREATE POLICY IF NOT EXISTS "Anyone can view profile pictures"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-pictures');

-- Policy for updating profile pictures (own files only)
CREATE POLICY IF NOT EXISTS "Users can update own profile pictures"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-pictures' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'profile-pictures' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy for deleting profile pictures (own files only)
CREATE POLICY IF NOT EXISTS "Users can delete own profile pictures"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-pictures' AND
  (storage.foldername(name))[1] = auth.uid()::text
);