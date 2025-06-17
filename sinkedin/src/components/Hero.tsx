import React from 'react'
import { PenSquare, Users, Heart } from 'lucide-react'

// Props interface for Hero component to receive navigation handler
interface HeroProps {
  onNavigate?: (page: 'home' | 'post' | 'login' | 'profile') => void
}

// Hero section component with enhanced professional styling
// Uses warm colors and encouraging copy with smooth animations
const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  // Handle navigation to different pages
  const handleNavigation = (page: 'home' | 'post' | 'login' | 'profile') => {
    if (onNavigate) {
      onNavigate(page)
    }
  }

  // Scroll to stories section
  const scrollToStories = () => {
    const storiesSection = document.querySelector('[data-stories-section]')
    if (storiesSection) {
      storiesSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="bg-gradient-to-br from-primary-50 to-white py-16 lg:py-24 animate-fade-in">
      <div className="page-container">
        <div className="text-center">
          {/* Main headline with enhanced typography and gradient effect */}
          <h1 className="text-4xl lg:text-6xl font-bold text-neutral-900 mb-6 animate-slide-up">
            Every Career Has
            <span className="text-gradient block mt-2">Plot Twists</span>
          </h1>
          
          {/* Supporting text with improved readability */}
          <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{animationDelay: '0.1s'}}>
            Share your career setbacks, learn from others' journeys, and discover that failure 
            is just another step toward success. You're not alone in this.
          </p>

          {/* Call-to-action buttons with enhanced styling and working navigation */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <button 
              onClick={() => handleNavigation('post')}
              className="btn-primary text-lg px-8 py-4"
            >
              <PenSquare size={20} />
              <span>Share Your Story</span>
            </button>
            <button 
              onClick={scrollToStories}
              className="text-primary-600 hover:text-primary-700 transform hover:scale-105 transition-all duration-200 font-bold text-lg"
            >
              Read Stories →
            </button>
          </div>

          {/* Feature highlights with enhanced cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="card text-center animate-scale-in" style={{animationDelay: '0.3s'}}>
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 hover-scale">
                <Users className="text-primary-600" size={28} />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Safe Community</h3>
              <p className="text-neutral-600 leading-relaxed">
                A judgment-free space where professionals support each other through career challenges.
              </p>
            </div>
            
            <div className="card text-center animate-scale-in" style={{animationDelay: '0.4s'}}>
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 hover-scale">
                <Heart className="text-primary-600" size={28} />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Real Stories</h3>
              <p className="text-neutral-600 leading-relaxed">
                Authentic experiences from real people, not polished success stories from social media.
              </p>
            </div>
            
            <div className="card text-center animate-scale-in" style={{animationDelay: '0.5s'}}>
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 hover-scale">
                <PenSquare className="text-primary-600" size={28} />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Growth Mindset</h3>
              <p className="text-neutral-600 leading-relaxed">
                Turn setbacks into comebacks by learning from every experience, both good and bad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero