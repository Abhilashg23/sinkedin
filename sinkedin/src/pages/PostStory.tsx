import React, { useState, useEffect } from 'react'
import { Send, AlertCircle, CheckCircle, ArrowLeft, Loader } from 'lucide-react'
import { storyService, authService } from '../services/supabase'

// PostStory page component with enhanced professional styling
// Features form validation, authentication protection, and Supabase integration
const PostStory: React.FC = () => {
  // Form state management
  const [title, setTitle] = useState('')
  const [story, setStory] = useState('')
  const [lesson, setLesson] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Authentication and UI state
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // Form validation state
  const [fieldErrors, setFieldErrors] = useState<{
    title?: string
    story?: string
    lesson?: string
  }>({})

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  // Verify user authentication and load user data
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true)
      const user = await authService.getCurrentUser()
      
      if (!user) {
        // Redirect to login if not authenticated
        setError('Please log in to share your story')
        return
      }
      
      setCurrentUser(user)
    } catch (err) {
      console.error('Error checking auth status:', err)
      setError('Authentication error. Please try logging in again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Validate form fields before submission
  const validateForm = (): boolean => {
    const errors: typeof fieldErrors = {}
    
    if (!title.trim()) {
      errors.title = 'Title is required'
    } else if (title.trim().length < 5) {
      errors.title = 'Title must be at least 5 characters'
    } else if (title.trim().length > 100) {
      errors.title = 'Title must be less than 100 characters'
    }
    
    if (!story.trim()) {
      errors.story = 'Story is required'
    } else if (story.trim().length < 50) {
      errors.story = 'Story must be at least 50 characters'
    } else if (story.trim().length > 2000) {
      errors.story = 'Story must be less than 2000 characters'
    }
    
    if (!lesson.trim()) {
      errors.lesson = 'Lesson learned is required'
    } else if (lesson.trim().length < 20) {
      errors.lesson = 'Lesson must be at least 20 characters'
    } else if (lesson.trim().length > 500) {
      errors.lesson = 'Lesson must be less than 500 characters'
    }
    
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission with validation and error handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear previous errors
    setError(null)
    setSuccess(false)
    
    // Validate form
    if (!validateForm()) {
      return
    }
    
    if (!currentUser) {
      setError('You must be logged in to share a story')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Create story object for Supabase
      const storyData = {
        title: title.trim(),
        story: story.trim(),
        lesson: lesson.trim(),
        author_id: currentUser.id
      }
      
      // Submit to Supabase
      await storyService.createStory(storyData)
      
      // Show success state
      setSuccess(true)
      
      // Reset form after successful submission
      setTitle('')
      setStory('')
      setLesson('')
      setFieldErrors({})
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 5000)
      
    } catch (err) {
      console.error('Error submitting story:', err)
      setError('Failed to submit your story. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Clear field error when user starts typing
  const handleFieldChange = (field: string, value: string) => {
    if (fieldErrors[field as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
    
    switch (field) {
      case 'title':
        setTitle(value)
        break
      case 'story':
        setStory(value)
        break
      case 'lesson':
        setLesson(value)
        break
    }
  }

  // Loading state while checking authentication
  if (isLoading) {
    return (
      <main className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-neutral-600">
          <Loader className="animate-spin" size={24} />
          <span className="text-lg font-medium">Loading...</span>
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
            {error || 'Please log in to share your career story with the community.'}
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
        {/* Page header with enhanced typography and encouraging messaging */}
        <div className="text-center section-spacing animate-slide-up">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Share Your Story
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Your career setback could be someone else's breakthrough. Share your experience 
            and help others feel less alone in their journey.
          </p>
          <div className="mt-4 text-sm text-neutral-500">
            Logged in as: <span className="font-bold">{currentUser.email}</span>
          </div>
        </div>

        {/* Success message with enhanced styling */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 animate-scale-in">
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-green-600" size={24} />
              <div>
                <h3 className="font-bold text-green-800 mb-1">
                  Story Shared Successfully! 🎉
                </h3>
                <p className="text-green-700">
                  Thank you for sharing your experience. Your story will help inspire others 
                  facing similar challenges.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error message with enhanced styling */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 animate-scale-in">
            <div className="flex items-center space-x-3">
              <AlertCircle className="text-red-600" size={24} />
              <div>
                <h3 className="font-bold text-red-800 mb-1">
                  Submission Failed
                </h3>
                <p className="text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Story submission form with enhanced styling */}
        <div className="card animate-slide-up" style={{animationDelay: '0.2s'}}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Story title field with enhanced styling */}
            <div>
              <label htmlFor="title" className="block text-sm font-bold text-neutral-700 mb-2">
                Story Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className={`input-field ${fieldErrors.title ? 'input-error' : ''}`}
                placeholder="Give your story a compelling title..."
                maxLength={100}
                disabled={isSubmitting}
              />
              {fieldErrors.title && (
                <p className="text-red-600 text-sm mt-1 font-medium">{fieldErrors.title}</p>
              )}
              <p className="text-sm text-neutral-500 mt-1">
                {title.length}/100 characters
              </p>
            </div>

            {/* Story content field with enhanced styling */}
            <div>
              <label htmlFor="story" className="block text-sm font-bold text-neutral-700 mb-2">
                Your Story *
              </label>
              <textarea
                id="story"
                value={story}
                onChange={(e) => handleFieldChange('story', e.target.value)}
                rows={8}
                className={`input-field resize-none ${fieldErrors.story ? 'input-error' : ''}`}
                placeholder="Share your career setback in detail. What happened? How did it feel? What was the impact? Be honest and vulnerable - your authenticity will help others."
                maxLength={2000}
                disabled={isSubmitting}
              />
              {fieldErrors.story && (
                <p className="text-red-600 text-sm mt-1 font-medium">{fieldErrors.story}</p>
              )}
              <p className="text-sm text-neutral-500 mt-1">
                {story.length}/2000 characters
              </p>
            </div>

            {/* Lesson learned field with enhanced styling */}
            <div>
              <label htmlFor="lesson" className="block text-sm font-bold text-neutral-700 mb-2">
                Lesson Learned *
              </label>
              <textarea
                id="lesson"
                value={lesson}
                onChange={(e) => handleFieldChange('lesson', e.target.value)}
                rows={4}
                className={`input-field resize-none ${fieldErrors.lesson ? 'input-error' : ''}`}
                placeholder="What did you learn from this experience? How did it change your approach or perspective? What advice would you give to others facing similar challenges?"
                maxLength={500}
                disabled={isSubmitting}
              />
              {fieldErrors.lesson && (
                <p className="text-red-600 text-sm mt-1 font-medium">{fieldErrors.lesson}</p>
              )}
              <p className="text-sm text-neutral-500 mt-1">
                {lesson.length}/500 characters
              </p>
            </div>

            {/* Encouraging message with enhanced styling */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="text-primary-600 mt-0.5 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-bold text-primary-800 mb-1">
                  💪 Remember: You're helping others
                </h4>
                <p className="text-primary-700 text-sm leading-relaxed">
                  Your story of resilience and growth will inspire others facing similar challenges. 
                  Thank you for your courage in sharing your experience with the community.
                </p>
              </div>
            </div>

            {/* Form actions with enhanced styling */}
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 pt-6 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex items-center space-x-2 text-neutral-600 hover:text-primary-500 transform hover:scale-105 transition-all duration-200 font-medium"
                disabled={isSubmitting}
              >
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !story.trim() || !lesson.trim()}
                className="btn-primary min-w-[140px] justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="animate-spin" size={18} />
                    <span>Sharing...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Share Story</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Additional encouragement section with enhanced styling */}
        <div className="mt-12 text-center animate-fade-in" style={{animationDelay: '0.4s'}}>
          <h3 className="text-lg font-bold text-neutral-800 mb-6">
            Why Share Your Story?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 hover-scale">
                <span className="text-primary-600 font-bold">1</span>
              </div>
              <p className="text-neutral-600 text-sm font-medium">
                Help others feel less alone in their struggles
              </p>
            </div>
            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 hover-scale">
                <span className="text-primary-600 font-bold">2</span>
              </div>
              <p className="text-neutral-600 text-sm font-medium">
                Process your own experience through reflection
              </p>
            </div>
            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 hover-scale">
                <span className="text-primary-600 font-bold">3</span>
              </div>
              <p className="text-neutral-600 text-sm font-medium">
                Build a supportive community of professionals
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default PostStory