import { useState } from 'react';
import { Mail, Send, MessageSquare, Globe, Clock } from 'lucide-react';
import Toast from '../components/Toast';

export default function Contact() {
  const [supportInquiry, setSupportInquiry] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [showToast, setShowToast] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const sendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSending(false);
      setShowToast(true);
      setSupportInquiry({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      {/* Narrative Header */}
      <section className="bg-stone-900 text-white py-24 px-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-green-500/5 blur-[120px] rounded-full -mr-20 -mt-20"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-500 block mb-6 px-4">Direct Connection</span>
          <h1 className="text-5xl md:text-7xl font-serif font-black tracking-tighter mb-8 italic">Let's start a conversation.</h1>
          <p className="text-lg md:text-xl text-stone-400 max-w-2xl mx-auto leading-relaxed">
            Whether it's a specific question about our materials or a collaborative vision, we're here to listen and respond.
          </p>
        </div>
      </section>

      {/* Interactive Contact Map */}
      <section className="max-w-7xl mx-auto px-6 -mt-16 relative z-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Contact Details Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-stone-200 border border-stone-100">
              <h2 className="text-2xl font-serif font-black text-stone-900 mb-10">Reach Out</h2>

              <div className="space-y-10">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-stone-900" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Electronic Mail</p>
                    <p className="text-stone-900 font-bold">concierge@scatch.com</p>
                    <p className="text-stone-500 text-xs">Expected response within 24h</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 text-stone-900" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Studio HQ</p>
                    <p className="text-stone-900 font-bold">123 Industrial Ave, Arts District</p>
                    <p className="text-stone-500 text-xs">London, UK</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-stone-900" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Availability</p>
                    <p className="text-stone-900 font-bold">Mon — Fri, 10:00 — 18:00</p>
                    <p className="text-stone-500 text-xs">GMT Zone</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-800 text-white rounded-[2.5rem] p-10 shadow-2xl shadow-green-900/20">
              <MessageSquare className="w-8 h-8 mb-6 text-green-300" />
              <h3 className="text-xl font-serif font-bold mb-4">Urgent Matters?</h3>
              <p className="text-green-100/80 text-sm leading-relaxed mb-6">If you need immediate assistance regarding an active order, please include your Order ID.</p>
              <p className="font-mono text-sm font-black">+44 (0) 20 7946 0123</p>
            </div>
          </div>

          {/* Contact Form Area */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl shadow-stone-200 border border-stone-100">
              <form onSubmit={sendInquiry} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 ml-1">Your Identity</label>
                    <input
                      type="text"
                      value={supportInquiry.name}
                      onChange={(e) => setSupportInquiry({ ...supportInquiry, name: e.target.value })}
                      required
                      placeholder="Full Name"
                      className="w-full bg-stone-50/50 px-8 py-5 rounded-2xl border border-stone-100 focus:bg-white focus:border-stone-900 outline-none transition-all placeholder:text-stone-300"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 ml-1">Email Address</label>
                    <input
                      type="email"
                      value={supportInquiry.email}
                      onChange={(e) => setSupportInquiry({ ...supportInquiry, email: e.target.value })}
                      required
                      placeholder="email@example.com"
                      className="w-full bg-stone-50/50 px-8 py-5 rounded-2xl border border-stone-100 focus:bg-white focus:border-stone-900 outline-none transition-all placeholder:text-stone-300"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 ml-1">Inquiry Nature</label>
                  <input
                    type="text"
                    value={supportInquiry.subject}
                    onChange={(e) => setSupportInquiry({ ...supportInquiry, subject: e.target.value })}
                    required
                    placeholder="Subject of your message"
                    className="w-full bg-stone-50/50 px-8 py-5 rounded-2xl border border-stone-100 focus:bg-white focus:border-stone-900 outline-none transition-all placeholder:text-stone-300"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 ml-1">The Message</label>
                  <textarea
                    value={supportInquiry.message}
                    onChange={(e) => setSupportInquiry({ ...supportInquiry, message: e.target.value })}
                    required
                    rows={6}
                    placeholder="How can we assist you today?"
                    className="w-full bg-stone-50/50 px-8 py-5 rounded-2xl border border-stone-100 focus:bg-white focus:border-stone-900 outline-none transition-all resize-none placeholder:text-stone-300"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full bg-stone-900 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-black transition-all flex items-center justify-center gap-4 shadow-xl shadow-stone-200 disabled:opacity-50"
                >
                  {isSending ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Dispatch Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {showToast && (
        <Toast
          message="Inquiry received. We'll be in touch shortly."
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}

