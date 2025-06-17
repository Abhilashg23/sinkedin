import React, { useState } from 'react'
import { ArrowLeft, Mail, MessageCircle, HelpCircle, Send, CheckCircle, AlertCircle, Book, Users, Shield } from 'lucide-react'

// Support page component with enhanced professional styling
// Features FAQ section, contact form, and updated support email
const Support: React.FC = () => {
  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  // Handle back navigation
  const handleBack = () => {
    window.history.back()
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle form submission (simulated - in production, this would send to a backend)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setSubmitError('Please fill in all fields')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Simulate form submission delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In production, you would send this data to your backend or email service
      console.log('Support form submitted:', formData)
      
      setSubmitSuccess(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      // Hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000)
      
    } catch (err) {
      setSubmitError('Failed to send message. Please try again or email us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // FAQ data with common questions and answers
  const faqData = [
    {
      question: "How do I create an account on SinkedIn?",
      answer: "Click the 'Login' button in the top navigation, then select 'Create an account'. You'll need to provide your email address, create a password, and enter your full name. After submitting, you can start sharing your career stories immediately."
    },
    {
      question: "Is my personal information safe on SinkedIn?",
      answer: "Yes, we take your privacy seriously. We use industry-standard encryption and security measures to protect your data. Your email address is never shared publicly, and you control what information appears on your profile. Read our Privacy Policy for complete details."
    },
    {
      question: "Can I edit or delete my stories after posting?",
      answer: "Currently, you can view all your stories in your profile, but editing and deletion features are coming soon. If you need to modify or remove a story urgently, please contact our support team and we'll help you."
    },
    {
      question: "How do I support other users' stories?",
      answer: "You can show support by clicking the heart icon on any story. This lets the author know their story resonated with you and helps build a supportive community. You can also leave encouraging comments."
    },
    {
      question: "What should I include in my career story?",
      answer: "Share authentic experiences about career setbacks, challenges, or learning moments. Include what happened, how it affected you, and most importantly, what you learned from the experience. Your vulnerability helps others feel less alone in their struggles."
    },
    {
      question: "Can I remain anonymous when sharing stories?",
      answer: "Currently, all stories are associated with your profile name. However, you can use a pseudonym when creating your account if you prefer more privacy. We're considering additional privacy options for future updates."
    },
    {
      question: "How do I report inappropriate content?",
      answer: "If you encounter content that violates our community guidelines, please contact us immediately at abhilashabhi2324@gmail.com with details about the content and where you found it. We review all reports promptly."
    },
    {
      question: "Is SinkedIn free to use?",
      answer: "Yes, SinkedIn is completely free to use. Our mission is to create a supportive community for career growth, and we believe this should be accessible to everyone regardless of their financial situation."
    }
  ]

  // Toggle FAQ item open/closed
  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
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
              <HelpCircle className="text-primary-600" size={28} />
            </div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">
              Support Center
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              We're here to help you make the most of SinkedIn. Find answers to common questions or get in touch with our support team.
            </p>
          </div>
        </div>

        {/* Quick help cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card text-center animate-scale-in" style={{animationDelay: '0.1s'}}>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4 hover-scale">
              <Book className="text-primary-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Getting Started</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              New to SinkedIn? Learn how to create your profile and share your first career story.
            </p>
          </div>
          
          <div className="card text-center animate-scale-in" style={{animationDelay: '0.2s'}}>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4 hover-scale">
              <Users className="text-primary-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Community Guidelines</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              Learn about our community standards and how to create a supportive environment for everyone.
            </p>
          </div>
          
          <div className="card text-center animate-scale-in" style={{animationDelay: '0.3s'}}>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4 hover-scale">
              <Shield className="text-primary-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Privacy & Security</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              Understand how we protect your data and what privacy controls are available to you.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="card mb-12 animate-slide-up" style={{animationDelay: '0.4s'}}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="text-primary-600" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div key={index} className="border border-neutral-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 text-left bg-white hover:bg-neutral-50 transition-colors duration-200 flex items-center justify-between"
                >
                  <span className="font-bold text-neutral-900">{faq.question}</span>
                  <span className={`transform transition-transform duration-200 ${openFaqIndex === index ? 'rotate-180' : ''}`}>
                    ↓
                  </span>
                </button>
                {openFaqIndex === index && (
                  <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200 animate-fade-in">
                    <p className="text-neutral-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="card animate-slide-up" style={{animationDelay: '0.5s'}}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Mail className="text-primary-600" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900">Contact Support</h2>
          </div>

          {/* Success message */}
          {submitSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 animate-scale-in">
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-green-600" size={20} />
                <div>
                  <h3 className="font-bold text-green-800 text-sm">Message Sent Successfully!</h3>
                  <p className="text-green-700 text-sm">
                    We've received your message and will respond within 24 hours. You can also reach us directly at{' '}
                    <a 
                      href="mailto:abhilashabhi2324@gmail.com" 
                      className="font-bold underline"
                    >
                      abhilashabhi2324@gmail.com
                    </a>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 animate-scale-in">
              <div className="flex items-center space-x-3">
                <AlertCircle className="text-red-600" size={20} />
                <p className="text-red-700 font-medium">{submitError}</p>
              </div>
            </div>
          )}

          {/* Direct contact info */}
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mb-6">
            <h3 className="font-bold text-neutral-900 mb-3">Prefer to email us directly?</h3>
            <div className="flex items-center space-x-3">
              <Mail className="text-primary-600" size={20} />
              <div>
                <p className="font-bold text-neutral-900">Support Email</p>
                <a 
                  href="mailto:abhilashabhi2324@gmail.com" 
                  className="text-primary-600 hover:text-primary-700 font-bold underline"
                >
                  abhilashabhi2324@gmail.com
                </a>
              </div>
            </div>
            <p className="text-sm text-neutral-600 mt-3">
              We typically respond to all support emails within 24 hours during business days.
            </p>
          </div>

          {/* Contact form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-neutral-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your full name"
                  disabled={isSubmitting}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-neutral-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Enter your email address"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-bold text-neutral-700 mb-2">
                Subject *
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="input-field"
                disabled={isSubmitting}
                required
              >
                <option value="">Select a topic</option>
                <option value="account">Account Issues</option>
                <option value="technical">Technical Problems</option>
                <option value="content">Content Questions</option>
                <option value="privacy">Privacy Concerns</option>
                <option value="feature">Feature Request</option>
                <option value="report">Report Content</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-bold text-neutral-700 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={6}
                className="input-field resize-none"
                placeholder="Please describe your question or issue in detail. The more information you provide, the better we can help you."
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary min-w-[140px] justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Additional help section */}
        <div className="text-center mt-12 animate-fade-in" style={{animationDelay: '0.6s'}}>
          <h3 className="text-lg font-bold text-neutral-800 mb-4">
            Still need help?
          </h3>
          <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
            Our support team is committed to helping you have the best possible experience on SinkedIn. 
            Don't hesitate to reach out with any questions, no matter how small.
          </p>
          <a 
            href="mailto:abhilashabhi2324@gmail.com" 
            className="btn-primary"
          >
            <Mail size={18} />
            <span>Email Support Directly</span>
          </a>
        </div>
      </div>
    </main>
  )
}

export default Support