import React, { useState, useEffect } from 'react'
import { User, Mail, Calendar, Edit3, Save, X, Trash2, Eye, MessageCircle, AlertCircle, CheckCircle, Loader, Camera, ExternalLink, Linkedin, Twitter, Upload } from 'lucide-react'
import { authService, storyService, commentService, Story, Comment, supabase } from '../services/supabase'

// Enhanced interface for user profile with social links and bio
interface UserProfile {
  id: string
  email: string
  full_name?: string
  bio?: string
  linkedin_url?: string
  twitter_url?: string
  profile_picture_url?: string
  created_at: string
}

// Interface for recent activity items
interface RecentActivity {
  id: string
  type: 'comment'
  content: string
  story_title: string
  story_id: string
  created_at: string
}

// Profile page component with enhanced professional styling
// Features profile editing, story management, social links, and recent activity
const Profile: React.FC = () => {
  // User and authentication state
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Profile editing state with enhanced fields
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [editedBio, setEditedBio] = useState('')
  const [editedLinkedIn, setEditedLinkedIn] = useState('')
  const [editedTwitter, setEditedTwitter] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)
  
  // Profile picture upload state
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [isUploadingPicture, setIsUploadingPicture] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  
  // User stories and activity state
  const [userStories, setUserStories] = useState<Story[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [storiesLoading, setStoriesLoading] = useState(true)
  const [activityLoading, setActivityLoading] = useState(true)
  const [storiesError, setStoriesError] = useState<string | null>(null)
  const [activityError, setActivityError] = useState<string | null>(null)
  
  // Stats state
  const [stats, setStats] = useState({
    totalStories: 0,
    totalComments: 0,
    joinDate: ''
  })
  
  // Success/feedback state
  const [success, setSuccess] = useState<string | null>(null)

  // Load user data and related information on component mount
  useEffect(() => {
    loadUserData()
    loadUserStories()
    loadRecentActivity()
    loadUserStats()
  }, [])

  // Load current user information with enhanced profile data
  const loadUserData = async () => {
    try {
      setIsLoading(true)
      const user = await authService.getCurrentUser()
      
      if (!user) {
        setError('Please log in to view your profile')
        return
      }
      
      setCurrentUser(user)
      
      // Set form fields with user metadata
      const metadata = user.user_metadata || {}
      setEditedName(metadata.full_name || user.email?.split('@')[0] || '')
      setEditedBio(metadata.bio || '')
      setEditedLinkedIn(metadata.linkedin_url || '')
      setEditedTwitter(metadata.twitter_url || '')
      setProfilePicture(metadata.profile_picture_url || null)
      
    } catch (err) {
      console.error('Error loading user data:', err)
      setError('Failed to load profile information')
    } finally {
      setIsLoading(false)
    }
  }

  // Load user's stories with enhanced error handling
  const loadUserStories = async () => {
    try {
      setStoriesLoading(true)
      setStoriesError(null)
      
      const user = await authService.getCurrentUser()
      if (!user) return
      
      // Get all stories and filter by current user
      const allStories = await storyService.getStories(100, 0)
      const filteredStories = allStories.filter(story => story.author_id === user.id)
      
      setUserStories(filteredStories)
    } catch (err) {
      console.error('Error loading user stories:', err)
      setStoriesError('Failed to load your stories')
    } finally {
      setStoriesLoading(false)
    }
  }

  // Load user's recent activity (comments with story titles)
  const loadRecentActivity = async () => {
    try {
      setActivityLoading(true)
      setActivityError(null)
      
      const user = await authService.getCurrentUser()
      if (!user) return
      
      // Fetch user's recent comments with story information
      const { data: comments, error } = await supabase
        .from('comments')
        .select(`
          id,
          comment,
          created_at,
          story_id,
          stories!inner(title)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)
      
      if (error) {
        throw error
      }
      
      // Transform comments into recent activity format
      const activities: RecentActivity[] = (comments || []).map(comment => ({
        id: comment.id,
        type: 'comment' as const,
        content: comment.comment,
        story_title: comment.stories?.title || 'Unknown Story',
        story_id: comment.story_id,
        created_at: comment.created_at
      }))
      
      setRecentActivity(activities)
    } catch (err) {
      console.error('Error loading recent activity:', err)
      setActivityError('Failed to load recent activity')
    } finally {
      setActivityLoading(false)
    }
  }

  // Load user statistics (story count, comment count)
  const loadUserStats = async () => {
    try {
      const user = await authService.getCurrentUser()
      if (!user) return
      
      // Get story count
      const { count: storyCount, error: storyError } = await supabase
        .from('stories')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', user.id)
      
      // Get comment count
      const { count: commentCount, error: commentError } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
      
      if (storyError) console.error('Error loading story count:', storyError)
      if (commentError) console.error('Error loading comment count:', commentError)
      
      setStats({
        totalStories: storyCount || 0,
        totalComments: commentCount || 0,
        joinDate: user.created_at ? formatDate(user.created_at) : 'Unknown'
      })
    } catch (err) {
      console.error('Error loading user stats:', err)
    }
  }

  // Handle profile picture upload to Supabase Storage
  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !currentUser) return
    
    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file')
      return
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setUploadError('Image must be smaller than 5MB')
      return
    }
    
    setIsUploadingPicture(true)
    setUploadError(null)
    
    try {
      // Create unique filename with user ID prefix for RLS policy
      const fileExt = file.name.split('.').pop()
      const fileName = `${currentUser.id}/${currentUser.id}-${Date.now()}.${fileExt}`
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (uploadError) {
        throw uploadError
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName)
      
      // Update user metadata with new profile picture URL
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          ...currentUser.user_metadata,
          profile_picture_url: publicUrl
        }
      })
      
      if (updateError) {
        throw updateError
      }
      
      // Update local state
      setProfilePicture(publicUrl)
      setCurrentUser(prev => ({
        ...prev,
        user_metadata: {
          ...prev.user_metadata,
          profile_picture_url: publicUrl
        }
      }))
      
      setSuccess('Profile picture updated successfully! ✨')
      setTimeout(() => setSuccess(null), 3000)
      
    } catch (err: any) {
      console.error('Error uploading profile picture:', err)
      setUploadError(err.message || 'Failed to upload profile picture')
    } finally {
      setIsUploadingPicture(false)
    }
  }

  // Handle comprehensive profile update including social links and bio
  const handleUpdateProfile = async () => {
    if (!currentUser) return
    
    setIsUpdating(true)
    setError(null)
    
    try {
      // Validate LinkedIn URL format if provided
      if (editedLinkedIn && !editedLinkedIn.includes('linkedin.com')) {
        setError('Please enter a valid LinkedIn URL')
        return
      }
      
      // Validate Twitter URL format if provided
      if (editedTwitter && !editedTwitter.includes('twitter.com') && !editedTwitter.includes('x.com')) {
        setError('Please enter a valid Twitter/X URL')
        return
      }
      
      // Update user metadata in Supabase Auth
      const { error } = await supabase.auth.updateUser({
        data: {
          ...currentUser.user_metadata,
          full_name: editedName.trim(),
          bio: editedBio.trim(),
          linkedin_url: editedLinkedIn.trim(),
          twitter_url: editedTwitter.trim()
        }
      })
      
      if (error) throw error
      
      // Update local state
      setCurrentUser(prev => ({
        ...prev,
        user_metadata: {
          ...prev.user_metadata,
          full_name: editedName.trim(),
          bio: editedBio.trim(),
          linkedin_url: editedLinkedIn.trim(),
          twitter_url: editedTwitter.trim()
        }
      }))
      
      setIsEditing(false)
      setSuccess('Profile updated successfully! ✨')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
      
    } catch (err: any) {
      console.error('Error updating profile:', err)
      setError('Failed to update profile. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  // Cancel profile editing and reset form fields
  const handleCancelEdit = () => {
    setIsEditing(false)
    const metadata = currentUser?.user_metadata || {}
    setEditedName(metadata.full_name || currentUser?.email?.split('@')[0] || '')
    setEditedBio(metadata.bio || '')
    setEditedLinkedIn(metadata.linkedin_url || '')
    setEditedTwitter(metadata.twitter_url || '')
    setError(null)
    setUploadError(null)
  }

  // Get display name for user with fallbacks
  const getDisplayName = (user: any) => {
    if (!user) return 'User'
    return user.user_metadata?.full_name || 
           user.user_metadata?.name || 
           user.email?.split('@')[0] || 
           'User'
  }

  // Format date for display with relative time
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Format relative time for recent activity
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return formatDate(dateString)
  }

  // Loading state with enhanced styling
  if (isLoading) {
    return (
      <main className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-neutral-600">
          <Loader className="animate-spin" size={24} />
          <span className="text-lg font-medium">Loading profile...</span>
        </div>
      </main>
    )
  }

  // Authentication error state
  if (!currentUser) {
    return (
      <main className="min-h-screen bg-primary-50 flex items-center justify-center animate-fade-in">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 hover-scale">
            <AlertCircle className="text-red-600" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Authentication Required
          </h1>
          <p className="text-neutral-600 mb-6">
            {error || 'Please log in to view your profile.'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-primary-50 py-8 animate-fade-in">
      <div className="page-container">
        {/* Success message with enhanced styling */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 animate-scale-in">
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-green-600" size={20} />
              <p className="text-green-700 font-bold">{success}</p>
            </div>
          </div>
        )}

        {/* Error message with enhanced styling */}
        {(error || uploadError) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 animate-scale-in">
            <div className="flex items-center space-x-3">
              <AlertCircle className="text-red-600" size={20} />
              <p className="text-red-700 font-medium">{error || uploadError}</p>
            </div>
          </div>
        )}

        {/* Enhanced Profile Header with picture upload and social links */}
        <div className="card mb-8 animate-slide-up">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full lg:w-auto">
              {/* Enhanced Profile Avatar with upload functionality */}
              <div className="relative group">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center hover-scale overflow-hidden">
                  {profilePicture ? (
                    <img 
                      src={profilePicture} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="text-primary-600" size={36} />
                  )}
                </div>
                
                {/* Upload overlay - shows on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <label htmlFor="profile-picture-upload" className="cursor-pointer">
                    <Camera className="text-white" size={20} />
                    <input
                      id="profile-picture-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      disabled={isUploadingPicture}
                      className="hidden"
                    />
                  </label>
                </div>
                
                {/* Upload loading indicator */}
                {isUploadingPicture && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <Loader className="text-white animate-spin" size={20} />
                  </div>
                )}
              </div>
              
              {/* Enhanced Profile Info with bio and social links */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4 w-full">
                    {/* Name field */}
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="text-2xl font-bold text-neutral-900 input-field"
                      placeholder="Enter your name"
                      disabled={isUpdating}
                    />
                    
                    {/* Bio field */}
                    <textarea
                      value={editedBio}
                      onChange={(e) => setEditedBio(e.target.value)}
                      className="input-field resize-none"
                      placeholder="Tell us about yourself..."
                      rows={3}
                      maxLength={200}
                      disabled={isUpdating}
                    />
                    <p className="text-sm text-neutral-500">{editedBio.length}/200 characters</p>
                    
                    {/* Social links fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="url"
                        value={editedLinkedIn}
                        onChange={(e) => setEditedLinkedIn(e.target.value)}
                        className="input-field"
                        placeholder="LinkedIn URL"
                        disabled={isUpdating}
                      />
                      <input
                        type="url"
                        value={editedTwitter}
                        onChange={(e) => setEditedTwitter(e.target.value)}
                        className="input-field"
                        placeholder="Twitter/X URL"
                        disabled={isUpdating}
                      />
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleUpdateProfile}
                        disabled={isUpdating || !editedName.trim()}
                        className="btn-primary text-sm px-4 py-2"
                      >
                        {isUpdating ? (
                          <Loader className="animate-spin" size={14} />
                        ) : (
                          <Save size={14} />
                        )}
                        <span>{isUpdating ? 'Saving...' : 'Save Changes'}</span>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={isUpdating}
                        className="flex items-center space-x-1 text-neutral-600 hover:text-neutral-800 transform hover:scale-105 transition-all duration-200 text-sm font-medium disabled:opacity-50"
                      >
                        <X size={14} />
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                      {getDisplayName(currentUser)}
                    </h1>
                    
                    {/* Bio display */}
                    {currentUser.user_metadata?.bio && (
                      <p className="text-neutral-700 mb-3 leading-relaxed">
                        {currentUser.user_metadata.bio}
                      </p>
                    )}
                    
                    {/* User info and social links */}
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-neutral-600">
                      <div className="flex items-center space-x-1">
                        <Mail size={16} />
                        <span>{currentUser.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={16} />
                        <span>Joined {stats.joinDate}</span>
                      </div>
                    </div>
                    
                    {/* Social links display */}
                    {(currentUser.user_metadata?.linkedin_url || currentUser.user_metadata?.twitter_url) && (
                      <div className="flex items-center space-x-4 mt-3">
                        {currentUser.user_metadata?.linkedin_url && (
                          <a
                            href={currentUser.user_metadata.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 transform hover:scale-105 transition-all duration-200 font-medium"
                          >
                            <Linkedin size={16} />
                            <span>LinkedIn</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                        {currentUser.user_metadata?.twitter_url && (
                          <a
                            href={currentUser.user_metadata.twitter_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 transform hover:scale-105 transition-all duration-200 font-medium"
                          >
                            <Twitter size={16} />
                            <span>Twitter</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Edit Profile Button */}
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary whitespace-nowrap"
              >
                <Edit3 size={18} />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Statistics Cards with real data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card animate-scale-in" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center hover-scale">
                <Edit3 className="text-primary-600" size={20} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-neutral-900">{stats.totalStories}</h3>
                <p className="text-neutral-600 font-medium">Stories Shared</p>
              </div>
            </div>
          </div>
          
          <div className="card animate-scale-in" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center hover-scale">
                <MessageCircle className="text-primary-600" size={20} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-neutral-900">{stats.totalComments}</h3>
                <p className="text-neutral-600 font-medium">Comments Made</p>
              </div>
            </div>
          </div>
          
          <div className="card animate-scale-in" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center hover-scale">
                <Eye className="text-primary-600" size={20} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-neutral-900">-</h3>
                <p className="text-neutral-600 font-medium">Profile Views</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="card mb-8 animate-slide-up" style={{animationDelay: '0.4s'}}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">Recent Activity</h2>
          </div>

          {/* Activity Loading State */}
          {activityLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-3 text-neutral-600">
                <Loader className="animate-spin" size={20} />
                <span className="font-medium">Loading recent activity...</span>
              </div>
            </div>
          )}

          {/* Activity Error State */}
          {activityError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="text-red-600" size={20} />
                <p className="text-red-700 font-medium">{activityError}</p>
              </div>
            </div>
          )}

          {/* Empty Activity State */}
          {!activityLoading && !activityError && recentActivity.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 hover-scale">
                <MessageCircle className="text-primary-600" size={20} />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">
                No Recent Activity
              </h3>
              <p className="text-neutral-600">
                Start engaging with stories to see your activity here.
              </p>
            </div>
          )}

          {/* Activity List */}
          {!activityLoading && !activityError && recentActivity.length > 0 && (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={activity.id} className="border border-neutral-200 rounded-lg p-4 hover:bg-neutral-50 transition-colors duration-200 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <MessageCircle className="text-primary-600" size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-neutral-600 mb-1">
                        You commented on <span className="font-bold text-neutral-900">"{activity.story_title}"</span>
                      </p>
                      <p className="text-neutral-700 text-sm line-clamp-2 mb-2">
                        "{activity.content}"
                      </p>
                      <p className="text-xs text-neutral-500">
                        {formatRelativeTime(activity.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Stories Section with enhanced styling */}
        <div className="card animate-slide-up" style={{animationDelay: '0.5s'}}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">Your Stories</h2>
            <button className="btn-primary">
              Write New Story
            </button>
          </div>

          {/* Stories Loading State */}
          {storiesLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3 text-neutral-600">
                <Loader className="animate-spin" size={20} />
                <span className="font-medium">Loading your stories...</span>
              </div>
            </div>
          )}

          {/* Stories Error State */}
          {storiesError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <AlertCircle className="text-red-600" size={20} />
                <p className="text-red-700 font-medium">{storiesError}</p>
              </div>
            </div>
          )}

          {/* Empty Stories State */}
          {!storiesLoading && !storiesError && userStories.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 hover-scale">
                <Edit3 className="text-primary-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                No Stories Yet
              </h3>
              <p className="text-neutral-600 mb-6">
                Share your first career story and inspire others with your journey.
              </p>
              <button className="btn-primary">
                Write Your First Story
              </button>
            </div>
          )}

          {/* Stories List */}
          {!storiesLoading && !storiesError && userStories.length > 0 && (
            <div className="space-y-6">
              {userStories.map((story, index) => (
                <div key={story.id} className="border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-neutral-900 mb-2">
                        {story.title}
                      </h3>
                      <p className="text-neutral-600 text-sm mb-3 font-medium">
                        Published on {formatDate(story.created_at)}
                      </p>
                      <p className="text-neutral-700 line-clamp-3 leading-relaxed">
                        {story.story}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button className="p-2 text-neutral-600 hover:text-primary-500 transform hover:scale-110 transition-all duration-200">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-neutral-600 hover:text-primary-500 transform hover:scale-110 transition-all duration-200">
                        <Edit3 size={18} />
                      </button>
                      <button className="p-2 text-neutral-600 hover:text-red-500 transform hover:scale-110 transition-all duration-200">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Story Stats */}
                  <div className="flex items-center space-x-4 text-sm text-neutral-500 pt-4 border-t border-neutral-100">
                    <div className="flex items-center space-x-1">
                      <Eye size={14} />
                      <span className="font-medium">- views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle size={14} />
                      <span className="font-medium">- comments</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default Profile