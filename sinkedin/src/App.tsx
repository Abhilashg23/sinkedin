import React, { useState } from 'react'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import Home from './pages/Home'
import PostStory from './pages/PostStory'
import Login from './pages/Login'
import Profile from './pages/Profile'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import Support from './pages/Support'

// Main App component with enhanced UI and professional styling
// Features smooth page transitions and consistent layout structure
function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'post' | 'login' | 'profile' | 'privacy' | 'terms' | 'support'>('home')

  // Navigation handler function
  const handleNavigation = (page: 'home' | 'post' | 'login' | 'profile' | 'privacy' | 'terms' | 'support') => {
    console.log('Navigating to:', page) // Debug log
    setCurrentPage(page)
  }

  // Simple page rendering with fade-in animations
  const renderPage = () => {
    const pageClass = "animate-fade-in min-h-screen"
    
    console.log('Current page:', currentPage) // Debug log
    
    switch (currentPage) {
      case 'home':
        return <div className={pageClass}><Home onNavigate={handleNavigation} /></div>
      case 'post':
        // PostStory page handles its own authentication protection
        return <div className={pageClass}><PostStory /></div>
      case 'login':
        return <div className={pageClass}><Login /></div>
      case 'profile':
        // Profile page handles its own authentication protection
        return <div className={pageClass}><Profile /></div>
      case 'privacy':
        return <div className={pageClass}><PrivacyPolicy /></div>
      case 'terms':
        return <div className={pageClass}><TermsOfService /></div>
      case 'support':
        return <div className={pageClass}><Support /></div>
      default:
        return <div className={pageClass}><Home onNavigate={handleNavigation} /></div>
    }
  }

  return (
    <div className="min-h-screen bg-primary-50 flex flex-col">
      {/* Navigation component with enhanced styling and animations */}
      <div onClick={(e) => {
        const target = e.target as HTMLElement
        const href = target.closest('a')?.getAttribute('href')
        console.log('Link clicked:', href) // Debug log
        if (href) {
          e.preventDefault()
          switch (href) {
            case '#home':
              handleNavigation('home')
              break
            case '#post':
              handleNavigation('post')
              break
            case '#login':
              handleNavigation('login')
              break
            case '#profile':
              handleNavigation('profile')
              break
            case '#privacy':
              handleNavigation('privacy')
              break
            case '#terms':
              handleNavigation('terms')
              break
            case '#support':
              handleNavigation('support')
              break
            default:
              console.log('Unknown link:', href)
          }
        }
      }}>
        <Navigation />
      </div>
      
      {/* Main content area with smooth transitions */}
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Footer component for professional appearance */}
      <Footer />
    </div>
  )
}

export default App