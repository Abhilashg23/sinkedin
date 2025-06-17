import React from 'react'
import { ArrowLeft, FileText, Users, Shield, AlertTriangle, Scale, Gavel } from 'lucide-react'

// Terms of Service page component with enhanced professional styling
// Features comprehensive terms tailored for career story sharing platform
const TermsOfService: React.FC = () => {
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
              <FileText className="text-primary-600" size={28} />
            </div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              These terms govern your use of SinkedIn, a platform for sharing career experiences and supporting professional growth.
            </p>
            <p className="text-sm text-neutral-500 mt-4">
              Last updated: January 17, 2025
            </p>
          </div>
        </div>

        {/* Terms of service content */}
        <div className="card animate-slide-up" style={{animationDelay: '0.2s'}}>
          <div className="prose prose-lg max-w-none">
            
            {/* Acceptance of Terms */}
            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Scale className="text-primary-600" size={20} />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-0">Acceptance of Terms</h2>
              </div>
              
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  By accessing and using SinkedIn, you accept and agree to be bound by the terms and provision of this agreement. 
                  If you do not agree to abide by the above, please do not use this service.
                </p>
                <p>
                  SinkedIn is a platform designed to help professionals share their career setbacks, learn from others' experiences, 
                  and build a supportive community around professional growth and resilience.
                </p>
              </div>
            </section>

            {/* User Responsibilities */}
            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Users className="text-primary-600" size={20} />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-0">User Responsibilities</h2>
              </div>
              
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <h3 className="text-lg font-bold text-neutral-800">Authentic Content</h3>
                <p>
                  You agree to share authentic, truthful career experiences and stories. While we understand that perspectives 
                  may vary, deliberately false or misleading content undermines the trust and support that our community is built upon.
                </p>
                
                <h3 className="text-lg font-bold text-neutral-800">Respectful Communication</h3>
                <p>
                  You must treat all community members with respect and empathy. This includes:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>No harassment, bullying, or personal attacks in comments or interactions</li>
                  <li>No discriminatory language based on race, gender, religion, sexual orientation, or other protected characteristics</li>
                  <li>Constructive and supportive feedback when commenting on others' stories</li>
                  <li>Respecting others' vulnerability when they share difficult experiences</li>
                </ul>
                
                <h3 className="text-lg font-bold text-neutral-800">Account Security</h3>
                <p>
                  You are responsible for maintaining the confidentiality of your account credentials and for all activities 
                  that occur under your account. You must notify us immediately of any unauthorized use of your account.
                </p>
                
                <h3 className="text-lg font-bold text-neutral-800">Prohibited Content</h3>
                <p>
                  You may not post content that:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Contains spam, promotional material, or commercial solicitations</li>
                  <li>Violates any applicable laws or regulations</li>
                  <li>Infringes on intellectual property rights of others</li>
                  <li>Contains malicious code, viruses, or other harmful software</li>
                  <li>Includes personal information of others without their consent</li>
                </ul>
              </div>
            </section>

            {/* Content Ownership */}
            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Shield className="text-primary-600" size={20} />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-0">Content Ownership</h2>
              </div>
              
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <h3 className="text-lg font-bold text-neutral-800">Your Content</h3>
                <p>
                  You retain full ownership of the stories, comments, and other content you create and share on SinkedIn. 
                  Your career experiences and insights belong to you, and we respect your intellectual property rights.
                </p>
                
                <h3 className="text-lg font-bold text-neutral-800">License to SinkedIn</h3>
                <p>
                  By posting content on SinkedIn, you grant us a non-exclusive, royalty-free license to display, 
                  distribute, and promote your content within the platform. This license allows us to:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Display your stories and comments to other users</li>
                  <li>Include your content in platform features like trending stories or recommendations</li>
                  <li>Use aggregated, anonymized data for platform improvement and research</li>
                </ul>
                
                <h3 className="text-lg font-bold text-neutral-800">Platform Content</h3>
                <p>
                  SinkedIn owns all rights to the platform itself, including the website design, features, 
                  branding, and underlying technology. This does not include user-generated content.
                </p>
              </div>
            </section>

            {/* Account Termination */}
            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="text-primary-600" size={20} />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-0">Account Termination</h2>
              </div>
              
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <h3 className="text-lg font-bold text-neutral-800">Termination by You</h3>
                <p>
                  You may terminate your account at any time by contacting us at{' '}
                  <a 
                    href="mailto:abhilashabhi2324@gmail.com" 
                    className="text-primary-600 hover:text-primary-700 font-bold underline"
                  >
                    abhilashabhi2324@gmail.com
                  </a>. 
                  Upon termination, your account and associated data will be deleted according to our data retention policies.
                </p>
                
                <h3 className="text-lg font-bold text-neutral-800">Termination by SinkedIn</h3>
                <p>
                  We reserve the right to suspend or terminate accounts that violate these terms, including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Repeated harassment or abusive behavior toward other users</li>
                  <li>Posting deliberately false or misleading content</li>
                  <li>Attempting to circumvent platform security measures</li>
                  <li>Using the platform for commercial purposes without authorization</li>
                  <li>Violating applicable laws or regulations</li>
                </ul>
                
                <h3 className="text-lg font-bold text-neutral-800">Appeal Process</h3>
                <p>
                  If your account is terminated, you may appeal the decision by contacting us with details about your situation. 
                  We will review appeals fairly and respond within a reasonable timeframe.
                </p>
              </div>
            </section>

            {/* Platform Availability */}
            <section className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Gavel className="text-primary-600" size={20} />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-0">Platform Availability</h2>
              </div>
              
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <h3 className="text-lg font-bold text-neutral-800">Hackathon Demo Status</h3>
                <p>
                  SinkedIn is currently provided as a demonstration platform developed for educational and hackathon purposes. 
                  While we strive to maintain reliable service, the platform is provided "as is" without warranties of 
                  continuous availability or data persistence.
                </p>
                
                <h3 className="text-lg font-bold text-neutral-800">Service Modifications</h3>
                <p>
                  We reserve the right to modify, suspend, or discontinue any aspect of the service at any time. 
                  We will provide reasonable notice of significant changes when possible.
                </p>
                
                <h3 className="text-lg font-bold text-neutral-800">Data Backup</h3>
                <p>
                  While we implement reasonable data protection measures, we recommend that users keep copies of 
                  important content they share on the platform, especially during this demonstration phase.
                </p>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Limitation of Liability</h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  SinkedIn and its creators shall not be liable for any indirect, incidental, special, consequential, 
                  or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other 
                  intangible losses, resulting from your use of the service.
                </p>
                <p>
                  The platform is designed to facilitate supportive professional discussions, but we cannot guarantee 
                  the accuracy, completeness, or usefulness of any content shared by users.
                </p>
              </div>
            </section>

            {/* Privacy and Data Protection */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Privacy and Data Protection</h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  Your privacy is important to us. Our collection and use of personal information is governed by our 
                  Privacy Policy, which is incorporated into these terms by reference. Please review our Privacy Policy 
                  to understand our data practices.
                </p>
                <p>
                  By using SinkedIn, you consent to the collection and use of your information as described in our Privacy Policy.
                </p>
              </div>
            </section>

            {/* Governing Law */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Governing Law</h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  These terms shall be governed by and construed in accordance with applicable laws. 
                  Any disputes arising from these terms or your use of SinkedIn shall be resolved through 
                  good faith negotiation or appropriate legal channels.
                </p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Changes to These Terms</h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  We may update these Terms of Service from time to time to reflect changes in our practices, 
                  legal requirements, or platform features. We will notify users of material changes by posting 
                  the updated terms on this page and updating the "Last updated" date.
                </p>
                <p>
                  Your continued use of SinkedIn after any changes constitutes acceptance of the new terms.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Contact Us</h2>
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
                <p className="text-neutral-700 leading-relaxed mb-4">
                  If you have any questions about these Terms of Service or need clarification about 
                  any aspect of using SinkedIn, please contact us:
                </p>
                <div className="flex items-center space-x-3">
                  <FileText className="text-primary-600" size={20} />
                  <div>
                    <p className="font-bold text-neutral-900">Legal & Terms Support</p>
                    <a 
                      href="mailto:abhilashabhi2324@gmail.com" 
                      className="text-primary-600 hover:text-primary-700 font-bold underline"
                    >
                      abhilashabhi2324@gmail.com
                    </a>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 mt-4">
                  We aim to respond to all terms-related inquiries within 48 hours.
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

export default TermsOfService