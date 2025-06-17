import React from 'react'
import { Heart } from 'lucide-react'

// Footer component with professional styling and brand consistency
// Provides site information and maintains visual hierarchy
const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-200 border-t border-neutral-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Brand and copyright */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <p className="text-neutral-800 font-semibold">
                SinkedIn © 2025
              </p>
              <p className="text-neutral-600 text-sm">
                Empowering career resilience through shared stories
              </p>
            </div>
          </div>

          {/* Mission statement */}
          <div className="flex items-center space-x-2 text-neutral-600">
            <span className="text-sm">Made with</span>
            <Heart className="text-primary-500" size={16} />
            <span className="text-sm">for career growth</span>
          </div>
        </div>

        {/* Additional footer links with updated support email */}
        <div className="mt-6 pt-6 border-t border-neutral-300">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="flex items-center space-x-6 text-sm text-neutral-600">
              <a href="#privacy" className="hover:text-primary-500 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-primary-500 transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#support" className="hover:text-primary-500 transition-colors duration-200">
                Support
              </a>
            </div>
            <div className="text-sm text-neutral-500 text-center md:text-right">
              <p>Building a supportive professional community</p>
              <p className="mt-1">
                Questions? Email us at{' '}
                <a 
                  href="mailto:abhilashabhi2324@gmail.com" 
                  className="text-primary-600 hover:text-primary-700 font-bold"
                >
                  abhilashabhi2324@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer