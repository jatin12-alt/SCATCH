import { useState } from 'react';
import { Package, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import { useAppSelector } from '../store/hooks';
import { Link } from 'react-router-dom';
import Toast from '../components/Toast';

export default function Sell() {
  // naming update: user -> account
  const { account } = useAppSelector((state) => state.auth);

  const [submissionForm, setSubmissionForm] = useState({
    brandName: '',
    productType: '',
    material: '',
    description: '',
    website: '',
    email: '',
    phone: '',
  });

  const [showConfirmationToast, setShowConfirmationToast] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Mocking an API call for the form submission
    setTimeout(() => {
      setIsProcessing(false);
      setShowConfirmationToast(true);
      setSubmissionForm({
        brandName: '',
        productType: '',
        material: '',
        description: '',
        website: '',
        email: '',
        phone: '',
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">

      {/* Dynamic Hero Section */}
      <section className="bg-stone-900 text-white py-24 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-green-500/10 rounded-2xl mb-8">
            <Package className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-black mb-8 tracking-tighter">
            Showcase Your <span className="text-green-500">Craft</span>
          </h1>
          <p className="text-xl text-stone-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Join the SCATCH ecosystem and put your ethical creations in front of
            the world's most conscious shoppers.
          </p>
        </div>
      </section>

      {/* Structured Content Area */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-20">

        {/* Value Prop Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-stone-100 transition-transform hover:-translate-y-1">
            <h2 className="text-3xl font-serif font-bold text-stone-900 mb-8">Why Partner?</h2>
            <div className="space-y-6">
              {[
                "Targeted ethical consumer reach",
                "Seamless vendor onboarding",
                "Strategic marketing placements",
                "Transparent revenue sharing"
              ].map((benefit, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <div className="bg-green-50 p-1 rounded-full">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-stone-600 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-stone-950 p-10 rounded-[2.5rem] text-white shadow-xl shadow-stone-200">
            <div className="flex items-center gap-3 mb-8">
              <AlertCircle className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold uppercase tracking-widest text-stone-400">Our Standards</h3>
            </div>
            <ul className="space-y-4 text-stone-300 font-medium">
              <li className="border-b border-stone-800 pb-3">100% Vegan materials only</li>
              <li className="border-b border-stone-800 pb-3">Eco-friendly supply chain</li>
              <li className="border-b border-stone-800 pb-3">Premium quality assurance</li>
              <li>Ethical production certification</li>
            </ul>
          </div>
        </div>

        {/* The Actual Form */}
        <div id="apply" className="bg-white rounded-[3rem] shadow-2xl shadow-stone-200/50 p-8 md:p-16 border border-stone-100 overflow-hidden relative">

          {/* Subtle Form Background Decal */}
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] select-none pointer-events-none">
            <Upload className="w-64 h-64 rotate-12" />
          </div>

          <div className="relative z-10">
            <div className="mb-12">
              <h2 className="text-4xl font-serif font-bold text-stone-900">Application Entry</h2>
              <p className="text-stone-400 font-bold uppercase text-[10px] tracking-widest mt-2">Start your journey here</p>
            </div>

            {!account && (
              <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-6 mb-12 flex items-center gap-4">
                <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0" />
                <p className="text-stone-700 text-sm font-medium">
                  Authentication required: please{' '}
                  <Link to="/register" className="text-stone-900 font-black underline decoration-green-500 underline-offset-4">register</Link>
                  {' '}to start an application.
                </p>
              </div>
            )}

            <form onSubmit={handleApplicationSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-stone-400 ml-1">Brand Identity</label>
                  <input
                    type="text"
                    value={submissionForm.brandName}
                    onChange={(e) => setSubmissionForm({ ...submissionForm, brandName: e.target.value })}
                    required
                    className="w-full bg-stone-50/50 px-6 py-4 rounded-2xl border border-stone-100 focus:bg-white focus:border-stone-900 outline-none transition-all placeholder:text-stone-300"
                    placeholder="e.g. EcoLux"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-stone-400 ml-1">Category Focus</label>
                  <select
                    value={submissionForm.productType}
                    onChange={(e) => setSubmissionForm({ ...submissionForm, productType: e.target.value })}
                    required
                    className="w-full bg-stone-50/50 px-6 py-4 rounded-2xl border border-stone-100 focus:bg-white focus:border-stone-900 outline-none transition-all"
                  >
                    <option value="">Select Specialty</option>
                    <option value="Tote">Tote Bags</option>
                    <option value="Backpack">Backpacks</option>
                    <option value="Clutches">Clutches</option>
                    <option value="Other">Lifestyle / Misc</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-stone-400 ml-1">Core Materials</label>
                <input
                  type="text"
                  value={submissionForm.material}
                  onChange={(e) => setSubmissionForm({ ...submissionForm, material: e.target.value })}
                  required
                  className="w-full bg-stone-50/50 px-6 py-4 rounded-2xl border border-stone-100 focus:bg-white focus:border-stone-900 outline-none transition-all placeholder:text-stone-300"
                  placeholder="Cork leather, organic cotton, ocean plastic..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-stone-400 ml-1">Your Story</label>
                <textarea
                  value={submissionForm.description}
                  onChange={(e) => setSubmissionForm({ ...submissionForm, description: e.target.value })}
                  required
                  rows={4}
                  className="w-full bg-stone-50/50 px-6 py-4 rounded-2xl border border-stone-100 focus:bg-white focus:border-stone-900 outline-none transition-all resize-none placeholder:text-stone-300"
                  placeholder="Share your brand's mission with us..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-stone-400 ml-1">Contact Email</label>
                  <input
                    type="email"
                    value={submissionForm.email}
                    onChange={(e) => setSubmissionForm({ ...submissionForm, email: e.target.value })}
                    required
                    className="w-full bg-stone-50/50 px-6 py-4 rounded-2xl border border-stone-100 focus:bg-white focus:border-stone-900 outline-none transition-all placeholder:text-stone-300"
                    placeholder="partner@you.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-stone-400 ml-1">Digital Presence</label>
                  <input
                    type="url"
                    value={submissionForm.website}
                    onChange={(e) => setSubmissionForm({ ...submissionForm, website: e.target.value })}
                    className="w-full bg-stone-50/50 px-6 py-4 rounded-2xl border border-stone-100 focus:bg-white focus:border-stone-900 outline-none transition-all placeholder:text-stone-300"
                    placeholder="Website or Social link"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing || !account}
                className="w-full bg-stone-900 text-white py-6 rounded-2xl font-serif font-black text-lg hover:bg-green-700 transition-all disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-4 relative overflow-hidden"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Send Application
                  </>
                )}
              </button>
            </form>

            <span className="block text-center text-stone-300 text-[10px] font-bold uppercase tracking-[0.3em] mt-12">
              Curated by SCATCH Partnerships
            </span>
          </div>
        </div>
      </div>

      {showConfirmationToast && (
        <Toast
          message="Submission received! Our partners team will be in touch soon."
          type="success"
          onClose={() => setShowConfirmationToast(false)}
        />
      )}
    </div>
  );
}


