import React, { useState, useEffect } from 'react'
import { User, PenSquare, Home, LogOut, Loader } from 'lucide-react'
import { authService } from '../services/supabase'

// Navigation component with professional styling and smooth animations
// Features sticky positioning, hover effects, and authentication-aware content
const Navigation: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [profilePicture, setProfilePicture] = useState<string | null>(null)

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus()
    
    // Listen for auth state changes with periodic checks
    const interval = setInterval(checkAuthStatus, 30000) // Check every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  // Load current user authentication status and profile picture
  const checkAuthStatus = async () => {
    try {
      const user = await authService.getCurrentUser()
      setCurrentUser(user)
      
      // Load profile picture from user metadata
      if (user?.user_metadata?.profile_picture_url) {
        setProfilePicture(user.user_metadata.profile_picture_url)
      } else {
        setProfilePicture(null)
      }
    } catch (err) {
      console.error('Error checking auth status:', err)
      setCurrentUser(null)
      setProfilePicture(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle user logout with smooth loading state
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await authService.signOut()
      setCurrentUser(null)
      setProfilePicture(null)
      
      // Refresh the page to reset app state
      window.location.reload()
    } catch (err) {
      console.error('Error logging out:', err)
      // Still try to clear local state even if logout fails
      setCurrentUser(null)
      setProfilePicture(null)
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Get display name for current user with fallbacks
  const getDisplayName = (user: any) => {
    if (!user) return ''
    return user.user_metadata?.full_name || 
           user.user_metadata?.name || 
           user.email?.split('@')[0] || 
           'User'
  }

  // User avatar component with profile picture support
  const UserAvatar: React.FC<{ user: any, size?: 'sm' | 'md', className?: string }> = ({ 
    user, 
    size = 'md', 
    className = '' 
  }) => {
    const sizeClasses = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10'
    }
    
    return (
      <div className={`${sizeClasses[size]} bg-primary-100 rounded-full flex items-center justify-center overflow-hidden hover-scale ${className}`}>
        {profilePicture ? (
          <img 
            src={profilePicture} 
            alt={`${getDisplayName(user)}'s profile`}
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="text-primary-600" size={size === 'sm' ? 16 : 20} />
        )}
      </div>
    )
  }

  return (
    <nav className="bg-white shadow-md border-b border-neutral-200 sticky top-0 z-50 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo section with brand colors and hover effect */}
          <div className="flex items-center space-x-3 hover-scale cursor-pointer">
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <h1 className="text-2xl font-bold text-primary-500 tracking-tight">
              SinkedIn
            </h1>
          </div>

          {/* Desktop navigation with enhanced hover effects */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#home" 
              className="nav-link"
            >
              <Home size={20} />
              <span>Home</span>
            </a>
            
            {/* Show Post Story link only for authenticated users */}
            {currentUser && (
              <a 
                href="#post" 
                className="nav-link"
              >
                <PenSquare size={20} />
                <span>Share Story</span>
              </a>
            )}

            {/* Authentication section with smooth transitions */}
            {isLoading ? (
              <div className="flex items-center space-x-2 text-neutral-500">
                <Loader className="animate-spin" size={16} />
                <span className="text-sm">Loading...</span>
              </div>
            ) : currentUser ? (
              /* Logged in state - show profile link and logout with enhanced styling */
              <div className="flex items-center space-x-4">
                <a
                  href="#profile"
                  className="flex items-center space-x-2 nav-link bg-primary-50 px-3 py-2 rounded-md hover:bg-primary-100"
                >
                  <UserAvatar user={currentUser} size="sm" />
                  <span>{getDisplayName(currentUser)}</span>
                </a>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transform hover:scale-105 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                  {isLoggingOut ? (
                    <>
                      <Loader className="animate-spin" size={16} />
                      <span>Logging out...</span>
                    </>
                  ) : (
                    <>
                      <LogOut size={16} />
                      <span>Logout</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Logged out state - show login button with enhanced styling */
              <a
                href="#login"
                className="btn-primary"
              >
                <User size={20} />
                <span>Login</span>
              </a>
            )}
          </div>

          {/* Mobile menu button with smooth animation */}
          <div className="md:hidden">
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-neutral-700 hover:text-primary-500 transform hover:scale-110 transition-all duration-200 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation menu with slide animation */}
      <div className={`md:hidden bg-white border-t border-neutral-200 shadow-lg transition-all duration-300 ${showMobileMenu ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-4 py-4 space-y-3">
          <a 
            href="#home" 
            className="nav-link py-3 border-b border-neutral-100"
            onClick={() => setShowMobileMenu(false)}
          >
            <Home size={20} />
            <span>Home</span>
          </a>
          
          {/* Show Post Story link only for authenticated users */}
          {currentUser && (
            <a 
              href="#post" 
              className="nav-link py-3 border-b border-neutral-100"
              onClick={() => setShowMobileMenu(false)}
            >
              <PenSquare size={20} />
              <span>Share Story</span>
            </a>
          )}

          {/* Authentication section for mobile */}
          {isLoading ? (
            <div className="flex items-center space-x-2 text-neutral-500 py-3">
              <Loader className="animate-spin" size={16} />
              <span className="text-sm">Loading...</span>
            </div>
          ) : currentUser ? (
            /* Logged in state - show profile link and logout */
            <div className="py-2 space-y-3">
              <a
                href="#profile"
                className="flex items-center space-x-2 nav-link py-3 bg-primary-50 rounded-md px-3"
                onClick={() => setShowMobileMenu(false)}
              >
                <UserAvatar user={currentUser} size="sm" />
                <span>{getDisplayName(currentUser)}</span>
              </a>
              <button
                onClick={() => {
                  handleLogout()
                  setShowMobileMenu(false)
                }}
                disabled={isLoggingOut}
                className="flex items-center space-x-2 bg-red-500 text-white px-4 py-3 rounded-md hover:bg-red-600 transition-colors duration-200 font-medium w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? (
                  <>
                    <Loader className="animate-spin" size={16} />
                    <span>Logging out...</span>
                  </>
                ) : (
                  <>
                    <LogOut size={16} />
                    <span>Logout</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Logged out state - show login button */
            <a 
              href="#login" 
              className="btn-primary w-full justify-center"
              onClick={() => setShowMobileMenu(false)}
            >
              <User size={20} />
              <span>Login</span>
            </a>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navigation