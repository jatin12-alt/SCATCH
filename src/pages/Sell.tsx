import { useState } from 'react';
import { Package, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import { useAppSelector } from '../store/hooks';
import { Link } from 'react-router-dom';
import Toast from '../components/Toast';

export default function Sell() {
  const { user } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    brandName: '',
    productType: '',
    material: '',
    description: '',
    website: '',
    email: '',
    phone: '',
  });
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission (you can integrate with backend/email service later)
    setTimeout(() => {
      setIsSubmitting(false);
      setShowToast(true);
      setFormData({
        brandName: '',
        productType: '',
        material: '',
        description: '',
        website: '',
        email: '',
        phone: '',
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-700 to-green-800 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Package className="w-12 h-12 sm:w-16 sm:h-16" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold">Sell Your Product</h1>
          </div>
          <p className="text-lg sm:text-xl text-green-50 max-w-3xl mx-auto">
            Are you a creator of vegan, sustainable products? Join SCATCH and reach thousands of 
            conscious consumers looking for ethical alternatives.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Benefits Section */}
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-800 mb-5 sm:mb-6">Why Sell with SCATCH?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-700 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-stone-800 mb-1">Reach Conscious Consumers</h3>
                <p className="text-stone-600 text-sm">
                  Connect with customers who value sustainability and ethical production.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-700 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-stone-800 mb-1">Easy Setup</h3>
                <p className="text-stone-600 text-sm">
                  Simple onboarding process to get your products listed quickly.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-700 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-stone-800 mb-1">Marketing Support</h3>
                <p className="text-stone-600 text-sm">
                  We promote your products through our marketing channels and social media.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-6 h-6 text-green-700 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-stone-800 mb-1">Fair Commission</h3>
                <p className="text-stone-600 text-sm">
                  Competitive rates that help your business grow while maintaining profitability.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-green-700 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-stone-800 mb-2">Product Requirements</h3>
              <ul className="space-y-2 text-sm text-stone-700">
                <li>• Products must be 100% vegan (no animal-derived materials)</li>
                <li>• Sustainable and eco-friendly materials preferred</li>
                <li>• High-quality craftsmanship and design</li>
                <li>• Clear product images and descriptions</li>
                <li>• Compliance with ethical production standards</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-800 mb-5 sm:mb-6">Apply to Sell</h2>
          
          {!user && (
            <div className="bg-stone-100 border border-stone-300 rounded-lg p-4 mb-6">
              <p className="text-stone-700 text-sm">
                Please{' '}
                <Link to="/register" className="text-green-700 font-semibold hover:underline">
                  create an account
                </Link>
                {' '}or{' '}
                <Link to="/login" className="text-green-700 font-semibold hover:underline">
                  sign in
                </Link>
                {' '}to submit your application.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="brandName" className="block text-sm font-medium text-stone-700 mb-2">
                  Brand Name *
                </label>
                <input
                  type="text"
                  id="brandName"
                  value={formData.brandName}
                  onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Your Brand"
                />
              </div>
              <div>
                <label htmlFor="productType" className="block text-sm font-medium text-stone-700 mb-2">
                  Product Type *
                </label>
                <select
                  id="productType"
                  value={formData.productType}
                  onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                >
                  <option value="">Select type</option>
                  <option value="Tote">Tote Bags</option>
                  <option value="Backpack">Backpacks</option>
                  <option value="Clutches">Clutches</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="material" className="block text-sm font-medium text-stone-700 mb-2">
                Materials Used *
              </label>
              <input
                type="text"
                id="material"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                required
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="e.g., Cork Leather, Recycled PET, etc."
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-stone-700 mb-2">
                Product Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                placeholder="Tell us about your products, your brand story, and why they're perfect for SCATCH..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                  Business Email *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="business@example.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-stone-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-stone-700 mb-2">
                Website / Social Media
              </label>
              <input
                type="url"
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="https://yourwebsite.com or Instagram handle"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !user}
              className="w-full bg-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </form>

          <p className="text-sm text-stone-500 mt-6 text-center">
            We review all applications within 3-5 business days. You'll receive an email notification 
            once your application has been reviewed.
          </p>
        </div>
      </div>

      {showToast && (
        <Toast
          message="Thank you! Your application has been submitted. We'll review it and get back to you soon."
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}

