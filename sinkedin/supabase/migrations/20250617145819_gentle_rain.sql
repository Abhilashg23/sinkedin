/*
  # Create stories and comments tables

  1. New Tables
    - `stories`
      - `id` (uuid, primary key)
      - `title` (text)
      - `story` (text)
      - `lesson` (text)
      - `author_id` (uuid, references auth.users)
      - `created_at` (timestamp)
    - `comments`
      - `id` (uuid, primary key)
      - `story_id` (uuid, references stories)
      - `user_id` (uuid, references auth.users)
      - `comment` (text)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read all data
    - Add policies for authenticated users to insert their own data
*/

-- Create stories table
CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  story text NOT NULL,
  lesson text NOT NULL,
  author_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid REFERENCES stories(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  comment text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Stories policies
CREATE POLICY "Anyone can read stories"
  ON stories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert stories"
  ON stories
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own stories"
  ON stories
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

-- Comments policies
CREATE POLICY "Anyone can read comments"
  ON comments
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert comments"
  ON comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert sample data for demonstration
INSERT INTO stories (title, story, lesson, author_id, created_at) VALUES
  (
    'How I Lost My Dream Job in 24 Hours',
    'I thought I had made it. After months of interviews, I finally landed my dream position at a top tech company. But on my second day, everything fell apart when I accidentally deleted the production database during what I thought was a routine maintenance task. The panic, the emergency meetings, the disappointed faces of my new colleagues - it was devastating. I was let go immediately, and I felt like my career was over before it even began.',
    'This experience taught me the critical importance of understanding systems before making changes, no matter how routine they seem. I learned to always ask questions, double-check procedures, and never assume I know what I''m doing in a new environment. Most importantly, I learned that one mistake doesn''t define your entire career - it''s how you bounce back that matters.',
    '00000000-0000-0000-0000-000000000001',
    now() - interval '2 days'
  ),
  (
    'The Startup That Taught Me Everything About Failure',
    'Three years, $2M in funding, and a team of 15 people. Our startup was going to revolutionize how people shop online. We had the perfect product, the perfect team, and what we thought was the perfect market timing. But we never actually talked to our customers. We built what we wanted to build, not what people needed. When we finally launched, crickets. Absolute silence. We burned through our funding trying to pivot, but it was too late. The company folded, and I had to lay off people I considered family.',
    'Product-market fit isn''t just a buzzword - it''s everything. You can have the best technology, the smartest team, and all the funding in the world, but if you''re not solving a real problem for real people, you''re building a very expensive hobby. I learned to validate ideas early, talk to customers constantly, and be willing to kill your darlings if they''re not working.',
    '00000000-0000-0000-0000-000000000002',
    now() - interval '5 days'
  ),
  (
    'From CEO to Unemployed: My Humbling Journey',
    'Being fired from the company I founded was the most painful experience of my career. I had grown the business from my garage to 200 employees, but somewhere along the way, I lost sight of what made us successful. I became disconnected from my team, made decisions in isolation, and ignored warning signs that our culture was toxic. The board voted me out unanimously. Walking out of my own company for the last time was surreal and heartbreaking.',
    'Leadership isn''t about being the smartest person in the room - it''s about creating an environment where everyone can do their best work. I learned that success can be just as dangerous as failure if it makes you stop listening and learning. Now I prioritize relationships over results, knowing that sustainable success comes from empowering others, not controlling them.',
    '00000000-0000-0000-0000-000000000003',
    now() - interval '1 week'
  );

-- Insert sample comments
INSERT INTO comments (story_id, user_id, comment, created_at) VALUES
  (
    (SELECT id FROM stories WHERE title = 'How I Lost My Dream Job in 24 Hours'),
    '00000000-0000-0000-0000-000000000002',
    'Thank you for sharing this. I had a similar experience early in my career and felt so alone. It''s comforting to know others have been through this and come out stronger.',
    now() - interval '1 day'
  ),
  (
    (SELECT id FROM stories WHERE title = 'How I Lost My Dream Job in 24 Hours'),
    '00000000-0000-0000-0000-000000000003',
    'The part about asking questions really resonates. I''ve learned that admitting you don''t know something is a sign of wisdom, not weakness.',
    now() - interval '12 hours'
  ),
  (
    (SELECT id FROM stories WHERE title = 'The Startup That Taught Me Everything About Failure'),
    '00000000-0000-0000-0000-000000000001',
    'This is why I always tell founders to fall in love with the problem, not the solution. Your story is a perfect example of what happens when we get it backwards.',
    now() - interval '3 days'
  );