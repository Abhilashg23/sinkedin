import React, { useState, useEffect } from 'react'
import StoryCard from './StoryCard'
import { TrendingUp, Clock, Star, AlertCircle, Loader } from 'lucide-react'
import { Story, storyService } from '../services/supabase'

// Story feed component with enhanced professional styling
// Features loading states, error handling, responsive design, and genuine like counts
const StoryFeed: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<'trending' | 'recent' | 'top'>('recent')

  // Load stories on component mount
  useEffect(() => {
    loadStories()
  }, [])

  // Fetch stories from Supabase with error handling and like counts
  const loadStories = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedStories = await storyService.getStories(20, 0)
      setStories(fetchedStories)
    } catch (err) {
      console.error('Error loading stories:', err)
      setError('Failed to load stories. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  // Handle comment addition (refresh stories to update comment counts)
  const handleCommentAdded = () => {
    // In a production app, you might want to update just the specific story
    // For now, we'll reload all stories to ensure data consistency
    loadStories()
  }

  // Filter button component with enhanced styling
  const FilterButton: React.FC<{
    filter: 'trending' | 'recent' | 'top'
    icon: React.ReactNode
    label: string
  }> = ({ filter, icon, label }) => (
    <button
      onClick={() => setActiveFilter(filter)}
      className={`flex items-center space-x-2 pb-3 border-b-2 transition-all duration-200 font-bold transform hover:scale-105 ${
        activeFilter === filter
          ? 'border-primary-500 text-primary-600'
          : 'border-transparent text-neutral-600 hover:text-primary-500'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )

  return (
    <div className="page-container" data-stories-section>
      {/* Feed header with enhanced typography and filtering options */}
      <div className="section-spacing">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2 animate-fade-in">
          Career Stories
        </h1>
        <p className="text-neutral-600 mb-6 animate-fade-in" style={{animationDelay: '0.1s'}}>
          Real stories from professionals who've been there, done that, and learned from it.
        </p>
        
        {/* Filter tabs with enhanced hover effects */}
        <div className="flex space-x-6 border-b border-neutral-200 animate-fade-in" style={{animationDelay: '0.2s'}}>
          <FilterButton
            filter="recent"
            icon={<Clock size={18} />}
            label="Recent"
          />
          <FilterButton
            filter="trending"
            icon={<TrendingUp size={18} />}
            label="Trending"
          />
          <FilterButton
            filter="top"
            icon={<Star size={18} />}
            label="Top Rated"
          />
        </div>
      </div>

      {/* Loading state with enhanced styling */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3 text-neutral-600">
            <Loader className="animate-spin" size={24} />
            <span className="text-lg font-medium">Loading stories...</span>
          </div>
        </div>
      )}

      {/* Error state with enhanced styling */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8 animate-fade-in">
          <div className="flex items-center space-x-3">
            <AlertCircle className="text-red-600" size={24} />
            <div>
              <h3 className="font-bold text-red-800 mb-1">
                Unable to Load Stories
              </h3>
              <p className="text-red-700 mb-3">
                {error}
              </p>
              <button
                onClick={loadStories}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transform hover:scale-105 transition-all duration-200 font-bold"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty state with enhanced styling */}
      {!loading && !error && stories.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 hover-scale">
            <Star className="text-primary-600" size={28} />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">
            No Stories Yet
          </h3>
          <p className="text-neutral-600 mb-6">
            Be the first to share your career journey and inspire others.
          </p>
          <button className="btn-primary">
            Share Your Story
          </button>
        </div>
      )}

      {/* Story grid with enhanced responsive layout and genuine like data */}
      {!loading && !error && stories.length > 0 && (
        <div className="space-y-6">
          {stories.map((story, index) => (
            <div key={story.id} style={{animationDelay: `${index * 0.1}s`}}>
              <StoryCard
                id={story.id}
                title={story.title}
                story={story.story}
                lesson={story.lesson}
                author={story.author_details || null}
                createdAt={story.created_at}
                initialLikeCount={story.like_count || 0}
                initialUserHasLiked={story.user_has_liked || false}
                onCommentAdded={handleCommentAdded}
              />
            </div>
          ))}
        </div>
      )}

      {/* Load more button with enhanced styling */}
      {!loading && !error && stories.length > 0 && (
        <div className="mt-12 text-center animate-fade-in">
          <button className="btn-secondary px-8 py-3">
            Load More Stories
          </button>
        </div>
      )}
    </div>
  )
}

export default StoryFeed