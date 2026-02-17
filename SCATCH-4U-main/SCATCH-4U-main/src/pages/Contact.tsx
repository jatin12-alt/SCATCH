import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import Toast from '../components/Toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission (you can integrate with email service later)
    setTimeout(() => {
      setIsSubmitting(false);
      setShowToast(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-700 to-green-800 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-4">Get in Touch</h1>
          <p className="text-lg sm:text-xl text-green-50 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 space-y-5 sm:space-y-6">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-800 mb-5 sm:mb-6">Contact Information</h2>
              
              <div className="flex items-start gap-4">
                <div className="bg-green-100 rounded-full p-3">
                  <Mail className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-800 mb-1">Email</h3>
                  <p className="text-stone-600">support@scatch.com</p>
                  <p className="text-stone-600">info@scatch.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 rounded-full p-3">
                  <Phone className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-800 mb-1">Phone</h3>
                  <p className="text-stone-600">+1 (555) 123-4567</p>
                  <p className="text-sm text-stone-500">Mon-Fri, 9am-6pm EST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 rounded-full p-3">
                  <MapPin className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-800 mb-1">Address</h3>
                  <p className="text-stone-600">
                    123 Sustainable Street<br />
                    Green City, GC 12345<br />
                    United States
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-xl shadow-md p-5 sm:p-6 mt-5 sm:mt-6">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-800 mb-4">Quick FAQ</h2>
              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-semibold text-stone-800 mb-1">Shipping & Returns?</h3>
                  <p className="text-stone-600">
                    Free shipping on orders over $100. 30-day return policy.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-stone-800 mb-1">Product Care?</h3>
                  <p className="text-stone-600">
                    All products come with care instructions. Vegan materials are easy to maintain.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-stone-800 mb-1">Wholesale Inquiries?</h3>
                  <p className="text-stone-600">
                    Contact us at wholesale@scatch.com for bulk orders.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-800 mb-5 sm:mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-stone-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {showToast && (
        <Toast
          message="Thank you! Your message has been sent. We'll get back to you soon."
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}

