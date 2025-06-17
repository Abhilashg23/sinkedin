import React from 'react'
import Hero from '../components/Hero'
import StoryFeed from '../components/StoryFeed'

// Props interface for Home component to receive navigation handler
interface HomeProps {
  onNavigate?: (page: 'home' | 'post' | 'login' | 'profile') => void
}

// Home page component with enhanced layout and professional styling
// This is the main landing page for SinkedIn with real Supabase integration
const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <main className="bg-primary-50">
      {/* Hero section with enhanced styling and animations */}
      <Hero onNavigate={onNavigate} />
      
      {/* Dynamic story feed section with professional background */}
      <section className="bg-white">
        <StoryFeed />
      </section>
    </main>
  )
}

export default Home