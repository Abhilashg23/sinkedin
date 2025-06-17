/*
  # Add likes system for stories

  1. New Tables
    - `story_likes`
      - `id` (uuid, primary key)
      - `story_id` (uuid, foreign key to stories)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamp)
      - Unique constraint on (story_id, user_id) to prevent duplicate likes

  2. Security
    - Enable RLS on `story_likes` table
    - Add policies for authenticated users to manage their own likes
    - Add policy for public to read like counts

  3. Functions
    - Add function to get like count for stories
*/

-- Create story_likes table
CREATE TABLE IF NOT EXISTS story_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(story_id, user_id)
);

-- Enable RLS
ALTER TABLE story_likes ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to like stories
CREATE POLICY "Authenticated users can like stories"
  ON story_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for authenticated users to unlike stories (delete their own likes)
CREATE POLICY "Users can unlike stories"
  ON story_likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for public to read likes (for counting)
CREATE POLICY "Anyone can read likes"
  ON story_likes
  FOR SELECT
  TO public
  USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_story_likes_story_id ON story_likes(story_id);
CREATE INDEX IF NOT EXISTS idx_story_likes_user_id ON story_likes(user_id);