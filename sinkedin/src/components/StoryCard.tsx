import React, { useState, useEffect } from 'react'
import { Heart, MessageCircle, Calendar, User } from 'lucide-react'
import { Comment, commentService, authService, likeService } from '../services/supabase'

// Props interface for StoryCard component
interface StoryCardProps {
  id: string
  title: string
  story: string
  lesson: string
  author: {
    id: string
    display_name: string
    created_at: string
  } | null
  createdAt: string
  initialLikeCount?: number
  initialUserHasLiked?: boolean
  onCommentAdded?: () => void
}

// Individual story card component with enhanced professional styling
// Features smooth hover effects, expandable content, real-time comment system, and genuine like system
const StoryCard: React.FC<StoryCardProps> = ({ 
  id, 
  title, 
  story, 
  lesson, 
  author, 
  createdAt,
  initialLikeCount = 0,
  initialUserHasLiked = false,
  onCommentAdded 
}) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  
  // Genuine like system state
  const [isLiked, setIsLiked] = useState(initialUserHasLiked)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showFloatingHeart, setShowFloatingHeart] = useState(false)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isLikeLoading, setIsLikeLoading] = useState(false)

  // Load current user and comments on component mount
  useEffect(() => {
    loadCurrentUser()
    loadComments()
  }, [id, author])

  // Update like state when props change
  useEffect(() => {
    setLikeCount(initialLikeCount)
    setIsLiked(initialUserHasLiked)
  }, [initialLikeCount, initialUserHasLiked])

  // Load current authenticated user
  const loadCurrentUser = async () => {
    try {
      const user = await authService.getCurrentUser()
      setCurrentUser(user)
    } catch (err) {
      console.error('Error loading current user:', err)
    }
  }

  // Load comments for this story from Supabase
  const loadComments = async () => {
    try {
      const fetchedComments = await commentService.getCommentsByStory(id)
      setComments(fetchedComments)
    } catch (err) {
      console.error('Error loading comments:', err)
      setError('Failed to load comments')
    }
  }

  // Handle comment submission with error handling and optimistic updates
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentUser) {
      setError('Please log in to comment')
      return
    }

    if (!newComment.trim()) {
      setError('Comment cannot be empty')
      return
    }

    setIsSubmittingComment(true)
    setError(null)

    try {
      const comment = await commentService.createComment({
        story_id: id,
        user_id: currentUser.id,
        comment: newComment.trim()
      })

      // Add the new comment to the local state for immediate UI update
      setComments(prev => [...prev, comment])
      setNewComment('')
      
      // Notify parent component if callback provided
      if (onCommentAdded) {
        onCommentAdded()
      }
    } catch (err) {
      console.error('Error submitting comment:', err)
      setError('Failed to submit comment. Please try again.')
    } finally {
      setIsSubmittingComment(false)
    }
  }

  // Handle genuine like/unlike with database persistence
  const handleLikeClick = async () => {
    if (!currentUser) {
      setError('Please log in to support stories')
      return
    }

    if (isAnimating || isLikeLoading) return // Prevent multiple clicks during animation/loading
    
    setIsLikeLoading(true)
    setIsAnimating(true)
    setError(null)

    try {
      const result = await likeService.toggleStoryLike(id)
      
      // Update local state with real data from database
      setIsLiked(result.liked)
      setLikeCount(result.likeCount)
      
      // Show floating heart effect only when liking (not unliking)
      if (result.liked) {
        setShowFloatingHeart(true)
        setTimeout(() => setShowFloatingHeart(false), 1000)
      }
      
    } catch (err: any) {
      console.error('Error toggling like:', err)
      setError(err.message || 'Failed to update support. Please try again.')
    } finally {
      setIsLikeLoading(false)
      // Reset animation state
      setTimeout(() => setIsAnimating(false), 300)
    }
  }

  // Get display name for user (now using the display_name from the database)
  const getDisplayName = (user: any) => {
    if (!user) return 'Anonymous'
    return user.display_name || 'Anonymous'
  }

  // Get display name for current user (from auth metadata)
  const getCurrentUserDisplayName = (user: any) => {
    if (!user) return 'Anonymous'
    return user.user_metadata?.full_name || 
           user.user_metadata?.name || 
           user.email?.split('@')[0] || 
           'Anonymous'
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <article className="card animate-fade-in relative overflow-hidden">
      {/* Floating heart animation */}
      {showFloatingHeart && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
          <Heart 
            className="text-red-500 animate-float-heart" 
            size={60} 
            fill="currentColor"
          />
        </div>
      )}

      {/* Story header with author info and enhanced styling */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center hover-scale overflow-hidden">
          <User className="text-primary-600" size={20} />
        </div>
        <div>
          <h3 className="font-bold text-neutral-800">
            {getDisplayName(author)}
          </h3>
          <div className="flex items-center space-x-1 text-neutral-500 text-sm">
            <Calendar size={14} />
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Story content with improved typography */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-neutral-900 mb-3 leading-tight">
          {title}
        </h2>
        
        {/* Story text with expand/collapse functionality */}
        <div className="space-y-4">
          <div>
            <p className={`text-neutral-700 leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''}`}>
              {story}
            </p>
          </div>
          
          {/* Lesson learned section with enhanced styling */}
          {isExpanded && (
            <div className="bg-primary-50 border-l-4 border-primary-500 p-4 rounded-r-lg animate-fade-in">
              <h4 className="font-bold text-primary-800 mb-2">💡 Lesson Learned:</h4>
              <p className="text-primary-700 leading-relaxed">
                {lesson}
              </p>
            </div>
          )}
        </div>

        {/* Expand/collapse button with enhanced styling */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-primary-500 hover:text-primary-600 transform hover:scale-105 transition-all duration-200 text-sm font-bold mt-3"
        >
          {isExpanded ? '← Show Less' : 'Read Full Story →'}
        </button>
      </div>

      {/* Interaction buttons with genuine like system */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-100 mb-4">
        <button 
          onClick={handleLikeClick}
          disabled={isLikeLoading}
          className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
            isLiked 
              ? 'text-red-500 bg-red-50' 
              : 'text-neutral-600 hover:text-red-500 hover:bg-red-50'
          } ${isAnimating ? 'animate-heart-beat' : ''}`}
        >
          <Heart 
            size={18} 
            fill={isLiked ? 'currentColor' : 'none'}
            className={`transition-all duration-200 ${isAnimating ? 'animate-heart-pop' : ''}`}
          />
          <span className="text-sm font-medium">
            {likeCount} {likeCount === 1 ? 'Support' : 'Supports'}
          </span>
        </button>
        
        <button 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 text-neutral-600 hover:text-primary-500 transform hover:scale-105 transition-all duration-200 px-3 py-2 rounded-md hover:bg-primary-50"
        >
          <MessageCircle size={18} />
          <span className="text-sm font-medium">{comments.length} Comments</span>
        </button>
      </div>

      {/* Comments section with enhanced styling */}
      {showComments && (
        <div className="border-t border-neutral-100 pt-4 space-y-4 animate-fade-in">
          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Existing comments with improved styling and profile pictures */}
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-neutral-50 rounded-md p-3 hover:bg-neutral-100 transition-colors duration-200">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
                    <span className="text-primary-600 font-bold text-xs">
                      {getDisplayName(comment.user_details).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-bold text-neutral-800 text-sm">
                    {getDisplayName(comment.user_details)}
                  </span>
                  <span className="text-neutral-500 text-xs">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                <p className="text-neutral-700 text-sm leading-relaxed">
                  {comment.comment}
                </p>
              </div>
            ))}
          </div>

          {/* Comment form with enhanced styling */}
          <form onSubmit={handleCommentSubmit} className="space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={currentUser ? "Share your thoughts or support..." : "Please log in to comment"}
              disabled={!currentUser || isSubmittingComment}
              className="input-field resize-none text-sm"
              rows={3}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!currentUser || isSubmittingComment || !newComment.trim()}
                className="btn-primary text-sm px-4 py-2"
              >
                {isSubmittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        </div>
      )}
    </article>
  )
}

export default StoryCard