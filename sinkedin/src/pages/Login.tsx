import React, { useState, useEffect } from 'react'
import { Mail, Lock, User, AlertCircle, CheckCircle, Loader, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { authService } from '../services/supabase'

// Login page component with enhanced professional styling
// Features form validation, error handling, responsive design, and password visibility toggle
const Login: React.FC = () => {
  // Form state management
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSignUp, setIsSignUp] = useState(false) // Toggle between sign up and sign in
  
  // Password visibility state
  const [showPassword, setShowPassword] = useState(false)
  
  // UI state for feedback
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // Form validation state
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string
    password?: string
    fullName?: string
  }>({})

  // Check if user is already authenticated on component mount
  useEffect(() => {
    checkExistingAuth()
  }, [])

  // Check for existing authentication and redirect if already logged in
  const checkExistingAuth = async () => {
    try {
      setIsLoading(true)
      const user = await authService.getCurrentUser()
      
      if (user) {
        // User is already authenticated, show success and redirect
        setSuccess(true)
        setTimeout(() => {
          // In a real app, you'd use a router to navigate
          // For now, we'll trigger a page refresh to update the app state
          window.location.reload()
        }, 1500)
        return
      }
    } catch (err) {
      console.error('Error checking existing auth:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Validate form fields before submission
  const validateForm = (): boolean => {
    const errors: typeof fieldErrors = {}
    
    if (!email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address'
    }
    
    if (!password.trim()) {
      errors.password = 'Password is required'
    } else if (password.trim().length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    if (isSignUp) {
      if (!fullName.trim()) {
        errors.fullName = 'Full name is required'
      } else if (fullName.trim().length < 2) {
        errors.fullName = 'Full name must be at least 2 characters'
      }
    }
    
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form submission with comprehensive error handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear previous errors and success states
    setError(null)
    setSuccess(false)
    
    // Validate form
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      if (isSignUp) {
        // Sign up new user
        await authService.signUp(email.trim(), password.trim(), fullName.trim())
        
        // Show success message for sign up
        setSuccess(true)
        setError(null)
        
        // Clear form
        setEmail('')
        setPassword('')
        setFullName('')
        setFieldErrors({})
        
        // Show confirmation message and switch to sign in
        setTimeout(() => {
          setSuccess(false)
          setIsSignUp(false) // Switch to sign in mode
        }, 3000)
        
      } else {
        // Sign in existing user
        await authService.signIn(email.trim(), password.trim())
        
        // Show success state
        setSuccess(true)
        
        // Clear form
        setEmail('')
        setPassword('')
        setFieldErrors({})
        
        // Redirect after successful login
        setTimeout(() => {
          // In a real app, you'd use a router to navigate
          // For now, we'll trigger a page refresh to update the app state
          window.location.reload()
        }, 1500)
      }
      
    } catch (err: any) {
      console.error('Auth error:', err)
      
      // Handle specific Supabase auth errors
      if (err.message?.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please check your credentials and try again.')
      } else if (err.message?.includes('Email not confirmed')) {
        setError('Please check your email and confirm your account before logging in.')
      } else if (err.message?.includes('User already registered')) {
        setError('An account with this email already exists. Try signing in instead.')
      } else if (err.message?.includes('Too many requests')) {
        setError('Too many attempts. Please wait a moment before trying again.')
      } else if (err.message?.includes('Signup not allowed')) {
        setError('Account creation is currently disabled. Please contact support.')
      } else {
        setError(isSignUp ? 'Failed to create account. Please try again.' : 'Login failed. Please check your credentials and try again.')
      }
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
    
    // Clear general error when user starts typing
    if (error) {
      setError(null)
    }
    
    switch (field) {
      case 'email':
        setEmail(value)
        break
      case 'password':
        setPassword(value)
        break
      case 'fullName':
        setFullName(value)
        break
    }
  }

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Loading state while checking existing authentication
  if (isLoading) {
    return (
      <main className="min-h-screen bg-primary-50 flex items-center justify-center">
        <div className="flex items-center space-x-3 text-neutral-600">
          <Loader className="animate-spin" size={24} />
          <span className="text-lg font-medium">Checking authentication...</span>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-primary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-md w-full space-y-8">
        {/* Header section with enhanced branding */}
        <div className="text-center animate-slide-up">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center shadow-md hover-scale">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <h1 className="text-3xl font-bold text-primary-500 tracking-tight">
              SinkedIn
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">
            {isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-neutral-600">
            {isSignUp 
              ? 'Join our community to share your career journey' 
              : 'Sign in to share your career journey and connect with others'
            }
          </p>
        </div>

        {/* Success message with enhanced styling */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-scale-in">
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-green-600" size={20} />
              <div>
                <h3 className="font-bold text-green-800 text-sm">
                  {isSignUp ? 'Account Created Successfully!' : 'Login Successful!'}
                </h3>
                <p className="text-green-700 text-sm">
                  {isSignUp 
                    ? 'Your account is successfully created. You can now login!' 
                    : 'Redirecting you to the platform...'
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error message with enhanced styling */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-scale-in">
            <div className="flex items-center space-x-3">
              <AlertCircle className="text-red-600" size={20} />
              <div>
                <h3 className="font-bold text-red-800 text-sm mb-1">
                  {isSignUp ? 'Account Creation Failed' : 'Login Failed'}
                </h3>
                <p className="text-red-700 text-sm">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Auth form with enhanced styling */}
        <div className="card animate-slide-up" style={{animationDelay: '0.2s'}}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name field (only for sign up) */}
            {isSignUp && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-bold text-neutral-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => handleFieldChange('fullName', e.target.value)}
                    className={`input-field pl-10 ${fieldErrors.fullName ? 'input-error' : ''}`}
                    placeholder="Enter your full name"
                    disabled={isSubmitting}
                    autoComplete="name"
                  />
                </div>
                {fieldErrors.fullName && (
                  <p className="text-red-600 text-sm mt-1 font-medium">{fieldErrors.fullName}</p>
                )}
              </div>
            )}

            {/* Email field with enhanced styling */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-neutral-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className={`input-field pl-10 ${fieldErrors.email ? 'input-error' : ''}`}
                  placeholder="Enter your email address"
                  disabled={isSubmitting}
                  autoComplete="email"
                />
              </div>
              {fieldErrors.email && (
                <p className="text-red-600 text-sm mt-1 font-medium">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password field with enhanced styling and show/hide toggle */}
            <div>
              <label htmlFor="password" className="block text-sm font-bold text-neutral-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => handleFieldChange('password', e.target.value)}
                  className={`input-field pl-10 pr-10 ${fieldErrors.password ? 'input-error' : ''}`}
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-primary-500 transition-colors duration-200"
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-neutral-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-neutral-400" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-red-600 text-sm mt-1 font-medium">{fieldErrors.password}</p>
              )}
              {isSignUp && (
                <p className="text-neutral-500 text-xs mt-1">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>

            {/* Submit button with enhanced styling */}
            <button
              type="submit"
              disabled={isSubmitting || !email.trim() || !password.trim() || (isSignUp && !fullName.trim())}
              className="btn-primary w-full justify-center text-lg py-4"
            >
              {isSubmitting ? (
                <>
                  <Loader className="animate-spin" size={18} />
                  <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                </>
              ) : (
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              )}
            </button>
          </form>

          {/* Toggle between sign up and sign in with enhanced styling */}
          <div className="mt-6 pt-6 border-t border-neutral-200 text-center">
            <p className="text-neutral-600 text-sm">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </p>
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError(null)
                setSuccess(false)
                setFieldErrors({})
                setEmail('')
                setPassword('')
                setFullName('')
                setShowPassword(false) // Reset password visibility when switching forms
              }}
              disabled={isSubmitting}
              className="text-primary-500 hover:text-primary-600 transform hover:scale-105 transition-all duration-200 font-bold text-sm mt-1 disabled:opacity-50"
            >
              {isSignUp ? 'Sign in here' : 'Create an account'}
            </button>
          </div>
        </div>

        {/* Back to home link with enhanced styling */}
        <div className="text-center animate-fade-in" style={{animationDelay: '0.3s'}}>
          <button
            onClick={() => window.history.back()}
            className="flex items-center space-x-2 text-neutral-600 hover:text-primary-500 transform hover:scale-105 transition-all duration-200 font-medium mx-auto"
            disabled={isSubmitting}
          >
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </main>
  )
}

export default Login