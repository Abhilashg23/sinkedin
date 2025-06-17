import React from 'react'
import { ArrowLeft, Mail, Shield, Eye, Lock, Database, Users } from 'lucide-react'

// Privacy Policy page component with enhanced professional styling
// Features comprehensive privacy information with the updated support email
const PrivacyPolicy: React.FC = () => {
  // Handle back navigation
  const handleBack = () => {
    window.history.back()
  }

  return (
    <main className="min-h-screen bg-primary-50 py-8 animate-fade-in">
      <div className="page-container">
        {/* Header section with navigation */}
        <div className="mb-8 animate-slide-up">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-neutral-600 hover:text-primary-500 transform hover:scale-105 transition-all duration-200 font-medium mb-6"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 hover-scale">
              <Shield className="text-primary-600" size={28} />
            </div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information on SinkedIn.
            </p>
            <p className="text-sm text-neutral-500 mt-4">
              Last updated: January 17, 2025
            </p>
          </div>
        </div>

        {/* Privacy policy content */}
        <div className="card animate-slide-up" style={{animationDelay: '0.2s'}}>
          <div className="prose prose-lg max-w-none">
            
            {/* Information We Collect */}
            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Database className="text-primary-600" size={20} />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-0">Information We Collect</h2>
              </div>
              
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <h3 className="text-lg font-bold text-neutral-800">Account Information</h3>
                <p>
                  When you create an account on SinkedIn, we collect your email address, full name, and password. 
                  You may also choose to provide additional information such as a bio, profile picture, and social media links.
                </p>
                
                <h3 className="text-lg font-bold text-neutral-800">Content You Share</h3>
                <p>
                  We collect and store the career stories, comments, and other content you choose to share on our platform. 
                  This includes the text of your stories, lessons learned, and any interactions with other users' content.
                </p>
                
                <h3 className="text-lg font-bold text-neutral-800">Usage Information</h3>
                <p>
                  We automatically collect information about how you use SinkedIn, including your IP address, 
                  browser type, device information, and pages visited. This helps us improve our service and user experience.
                </p>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Users className="text-primary-600" size={20} />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-0">How We Use Your Information</h2>
              </div>
              
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <ul className="list-disc list-inside space-y-2">
                  <li>To provide and maintain the SinkedIn platform and its features</li>
                  <li>To authenticate your identity and manage your account</li>
                  <li>To display your profile information and shared content to other users</li>
                  <li>To send you important updates about our service (with your consent)</li>
                  <li>To improve our platform based on usage patterns and feedback</li>
                  <li>To ensure the security and integrity of our platform</li>
                  <li>To comply with legal obligations and protect our rights</li>
                </ul>
              </div>
            </section>

            {/* Information Sharing */}
            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Eye className="text-primary-600" size={20} />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-0">Information Sharing</h2>
              </div>
              
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <h3 className="text-lg font-bold text-neutral-800">Public Information</h3>
                <p>
                  Your profile information (name, bio, profile picture) and the stories you share are publicly visible 
                  to all users of SinkedIn. Comments you make on stories are also publicly visible.
                </p>
                
                <h3 className="text-lg font-bold text-neutral-800">We Do Not Sell Your Data</h3>
                <p>
                  We do not sell, rent, or trade your personal information to third parties for marketing purposes. 
                  Your privacy and trust are fundamental to our mission.
                </p>
                
                <h3 className="text-lg font-bold text-neutral-800">Service Providers</h3>
                <p>
                  We may share your information with trusted service providers who help us operate SinkedIn, 
                  such as hosting services and analytics providers. These providers are bound by strict confidentiality agreements.
                </p>
              </div>
            </section>

            {/* Data Security */}
            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Lock className="text-primary-600" size={20} />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-0">Data Security</h2>
              </div>
              
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  We implement industry-standard security measures to protect your personal information, including:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security audits and monitoring</li>
                  <li>Access controls and authentication requirements</li>
                  <li>Secure hosting infrastructure with Supabase</li>
                </ul>
                <p>
                  While we strive to protect your information, no method of transmission over the internet 
                  is 100% secure. We encourage you to use strong passwords and keep your account information confidential.
                </p>
              </div>
            </section>

            {/* Your Rights */}
            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Shield className="text-primary-600" size={20} />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-0">Your Rights</h2>
              </div>
              
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Access and review your personal information</li>
                  <li>Update or correct your profile information</li>
                  <li>Delete your account and associated data</li>
                  <li>Export your data in a portable format</li>
                  <li>Opt out of non-essential communications</li>
                  <li>Request clarification about our data practices</li>
                </ul>
                <p>
                  To exercise these rights or if you have questions about your data, 
                  please contact us at{' '}
                  <a 
                    href="mailto:abhilashabhi2324@gmail.com" 
                    className="text-primary-600 hover:text-primary-700 font-bold underline"
                  >
                    abhilashabhi2324@gmail.com
                  </a>.
                </p>
              </div>
            </section>

            {/* Cookies and Tracking */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Cookies and Tracking</h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  We use cookies and similar technologies to enhance your experience on SinkedIn. 
                  These help us remember your preferences, keep you logged in, and analyze how our platform is used.
                </p>
                <p>
                  You can control cookie settings through your browser, but disabling certain cookies 
                  may affect the functionality of our platform.
                </p>
              </div>
            </section>

            {/* Children's Privacy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Children's Privacy</h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  SinkedIn is intended for users who are at least 18 years old or have entered the workforce. 
                  We do not knowingly collect personal information from children under 13. 
                  If we become aware that we have collected such information, we will take steps to delete it promptly.
                </p>
              </div>
            </section>

            {/* Changes to This Policy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Changes to This Policy</h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices 
                  or for legal and regulatory reasons. We will notify you of any material changes by 
                  posting the updated policy on this page and updating the "Last updated" date.
                </p>
                <p>
                  We encourage you to review this policy periodically to stay informed about how we protect your information.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Mail className="text-primary-600" size={20} />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-0">Contact Us</h2>
              </div>
              
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
                <p className="text-neutral-700 leading-relaxed mb-4">
                  If you have any questions, concerns, or requests regarding this Privacy Policy 
                  or our data practices, please don't hesitate to contact us:
                </p>
                <div className="flex items-center space-x-3">
                  <Mail className="text-primary-600" size={20} />
                  <div>
                    <p className="font-bold text-neutral-900">Email Support</p>
                    <a 
                      href="mailto:abhilashabhi2324@gmail.com" 
                      className="text-primary-600 hover:text-primary-700 font-bold underline"
                    >
                      abhilashabhi2324@gmail.com
                    </a>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 mt-4">
                  We aim to respond to all privacy-related inquiries within 48 hours.
                </p>
              </div>
            </section>

          </div>
        </div>

        {/* Back to top button */}
        <div className="text-center mt-8 animate-fade-in" style={{animationDelay: '0.4s'}}>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-primary-600 hover:text-primary-700 transform hover:scale-105 transition-all duration-200 font-bold"
          >
            ↑ Back to Top
          </button>
        </div>
      </div>
    </main>
  )
}

export default PrivacyPolicy