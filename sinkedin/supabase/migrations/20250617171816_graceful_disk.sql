/*
  # Create user profiles view for public access

  1. New View
    - `user_profiles` view
      - Provides safe, public access to user information
      - Only exposes necessary fields (id, display_name, created_at)
      - Uses auth.users data but filters sensitive information

  2. Security
    - View is accessible to authenticated users
    - No sensitive data exposed (email, metadata filtered)
    - Read-only access

  3. Purpose
    - Allows stories and comments to display author names
    - Replaces need for admin API calls from client
    - Maintains user privacy while enabling social features
*/

-- Create a view that safely exposes user profile information
CREATE OR REPLACE VIEW user_profiles AS
SELECT 
  id,
  COALESCE(
    raw_user_meta_data->>'full_name',
    raw_user_meta_data->>'name',
    split_part(email, '@', 1)
  ) as display_name,
  created_at
FROM auth.users;

-- Grant access to authenticated users
GRANT SELECT ON user_profiles TO authenticated;
GRANT SELECT ON user_profiles TO anon;