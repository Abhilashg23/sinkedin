import { createClient } from '@supabase/supabase-js'

// Supabase configuration
// These environment variables will be available after connecting to Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Create Supabase client instance
// This will be used throughout the app for database operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database schema
export interface Story {
  id: string
  title: string
  story: string
  lesson: string
  author_id: string
  created_at: string
  author_details?: {
    id: string
    display_name: string
    created_at: string
  }
  like_count?: number
  user_has_liked?: boolean
}

export interface Comment {
  id: string
  story_id: string
  user_id: string
  comment: string
  created_at: string
  user_details?: {
    id: string
    display_name: string
    created_at: string
  }
}

export interface StoryLike {
  id: string
  story_id: string
  user_id: string
  created_at: string
}

// API functions for story operations
export const storyService = {
  // Fetch all stories with author information and like counts
  async getStories(limit = 10, offset = 0): Promise<Story[]> {
    // Get current user to check if they've liked each story
    const { data: { user } } = await supabase.auth.getUser()
    
    // Get stories from the database with author information using the correct relationship
    const { data: stories, error: storiesError } = await supabase
      .from('stories')
      .select(`
        *,
        user_profiles!author_id (
          id,
          display_name,
          created_at
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (storiesError) {
      console.error('Error fetching stories:', storiesError)
      throw storiesError
    }

    if (!stories || stories.length === 0) {
      return []
    }

    // Get like counts and user like status for all stories
    const storyIds = stories.map(story => story.id)
    
    // Get like counts
    const { data: likeCounts, error: likeCountError } = await supabase
      .from('story_likes')
      .select('story_id')
      .in('story_id', storyIds)
    
    if (likeCountError) {
      console.error('Error fetching like counts:', likeCountError)
    }

    // Get user's likes if authenticated
    let userLikes: string[] = []
    if (user) {
      const { data: userLikesData, error: userLikesError } = await supabase
        .from('story_likes')
        .select('story_id')
        .eq('user_id', user.id)
        .in('story_id', storyIds)
      
      if (userLikesError) {
        console.error('Error fetching user likes:', userLikesError)
      } else {
        userLikes = userLikesData?.map(like => like.story_id) || []
      }
    }

    // Count likes per story
    const likeCountMap = new Map<string, number>()
    if (likeCounts) {
      likeCounts.forEach(like => {
        const count = likeCountMap.get(like.story_id) || 0
        likeCountMap.set(like.story_id, count + 1)
      })
    }

    // Transform the data to match our interface
    return stories.map(story => ({
      id: story.id,
      title: story.title,
      story: story.story,
      lesson: story.lesson,
      author_id: story.author_id,
      created_at: story.created_at,
      author_details: story.user_profiles ? {
        id: story.user_profiles.id,
        display_name: story.user_profiles.display_name,
        created_at: story.user_profiles.created_at
      } : null,
      like_count: likeCountMap.get(story.id) || 0,
      user_has_liked: userLikes.includes(story.id)
    }))
  },

  // Create a new story
  async createStory(story: Omit<Story, 'id' | 'created_at' | 'author_details' | 'like_count' | 'user_has_liked'>): Promise<Story> {
    const { data, error } = await supabase
      .from('stories')
      .insert([story])
      .select(`
        *,
        user_profiles!author_id (
          id,
          display_name,
          created_at
        )
      `)
      .single()
    
    if (error) {
      console.error('Error creating story:', error)
      throw error
    }

    // Transform the data to match our interface
    return {
      id: data.id,
      title: data.title,
      story: data.story,
      lesson: data.lesson,
      author_id: data.author_id,
      created_at: data.created_at,
      author_details: data.user_profiles ? {
        id: data.user_profiles.id,
        display_name: data.user_profiles.display_name,
        created_at: data.user_profiles.created_at
      } : null,
      like_count: 0,
      user_has_liked: false
    }
  }
}

// API functions for like operations
export const likeService = {
  // Toggle like for a story (like if not liked, unlike if already liked)
  async toggleStoryLike(storyId: string): Promise<{ liked: boolean, likeCount: number }> {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error('Authentication required to like stories')
    }

    // Check if user has already liked this story
    const { data: existingLike, error: checkError } = await supabase
      .from('story_likes')
      .select('id')
      .eq('story_id', storyId)
      .eq('user_id', user.id)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking existing like:', checkError)
      throw checkError
    }

    let liked = false

    if (existingLike) {
      // Unlike the story
      const { error: deleteError } = await supabase
        .from('story_likes')
        .delete()
        .eq('id', existingLike.id)

      if (deleteError) {
        console.error('Error removing like:', deleteError)
        throw deleteError
      }
      liked = false
    } else {
      // Like the story
      const { error: insertError } = await supabase
        .from('story_likes')
        .insert([{
          story_id: storyId,
          user_id: user.id
        }])

      if (insertError) {
        console.error('Error adding like:', insertError)
        throw insertError
      }
      liked = true
    }

    // Get updated like count
    const { count, error: countError } = await supabase
      .from('story_likes')
      .select('*', { count: 'exact', head: true })
      .eq('story_id', storyId)

    if (countError) {
      console.error('Error getting like count:', countError)
      throw countError
    }

    return {
      liked,
      likeCount: count || 0
    }
  },

  // Get like count for a story
  async getStoryLikeCount(storyId: string): Promise<number> {
    const { count, error } = await supabase
      .from('story_likes')
      .select('*', { count: 'exact', head: true })
      .eq('story_id', storyId)

    if (error) {
      console.error('Error getting like count:', error)
      throw error
    }

    return count || 0
  },

  // Check if current user has liked a story
  async hasUserLikedStory(storyId: string): Promise<boolean> {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return false
    }

    const { data, error } = await supabase
      .from('story_likes')
      .select('id')
      .eq('story_id', storyId)
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error checking user like:', error)
      return false
    }

    return !!data
  }
}

// API functions for comment operations
export const commentService = {
  // Fetch comments for a specific story with user information
  async getCommentsByStory(storyId: string): Promise<Comment[]> {
    // Get comments from the database with user information using the correct relationship
    const { data: comments, error: commentsError } = await supabase
      .from('comments')
      .select(`
        *,
        user_profiles!user_id (
          id,
          display_name,
          created_at
        )
      `)
      .eq('story_id', storyId)
      .order('created_at', { ascending: true })
    
    if (commentsError) {
      console.error('Error fetching comments:', commentsError)
      throw commentsError
    }

    if (!comments || comments.length === 0) {
      return []
    }

    // Transform the data to match our interface
    return comments.map(comment => ({
      id: comment.id,
      story_id: comment.story_id,
      user_id: comment.user_id,
      comment: comment.comment,
      created_at: comment.created_at,
      user_details: comment.user_profiles ? {
        id: comment.user_profiles.id,
        display_name: comment.user_profiles.display_name,
        created_at: comment.user_profiles.created_at
      } : null
    }))
  },

  // Create a new comment
  async createComment(comment: Omit<Comment, 'id' | 'created_at' | 'user_details'>): Promise<Comment> {
    const { data, error } = await supabase
      .from('comments')
      .insert([comment])
      .select(`
        *,
        user_profiles!user_id (
          id,
          display_name,
          created_at
        )
      `)
      .single()
    
    if (error) {
      console.error('Error creating comment:', error)
      throw error
    }

    // Transform the data to match our interface
    return {
      id: data.id,
      story_id: data.story_id,
      user_id: data.user_id,
      comment: data.comment,
      created_at: data.created_at,
      user_details: data.user_profiles ? {
        id: data.user_profiles.id,
        display_name: data.user_profiles.display_name,
        created_at: data.user_profiles.created_at
      } : null
    }
  }
}

// Authentication helper functions
export const authService = {
  // Expose supabase client for direct access when needed
  supabase,

  // Get current authenticated user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    // If there's no session, that's normal for unauthenticated users
    // Only log actual errors, not missing sessions
    if (error && error.message !== 'Auth session missing!') {
      console.error('Error getting current user:', error)
    }
    
    return user
  },

  // Sign up with email and password
  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    })
    
    if (error) {
      console.error('Error signing up:', error)
      throw error
    }
    return data
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      console.error('Error signing in:', error)
      throw error
    }
    return data
  },

  // Sign out current user
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
      throw error
    }
  },

  // Listen to auth state changes (for real-time updates)
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}