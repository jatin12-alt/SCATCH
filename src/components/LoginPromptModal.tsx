import { X, LogIn, UserPlus, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export default function LoginPromptModal({ isOpen, onClose, message = 'Authenticate to continue your journey.' }: LoginPromptModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-4">
      {/* Premium Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Elegant Modal */}
      <div className="relative bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-10 md:p-12 animate-in zoom-in-95 duration-300 border border-stone-100">
        {/* Subtle Close Button */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-stone-300 hover:text-stone-900 transition-all transform hover:rotate-90"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Iconography */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-[2rem] bg-stone-50 border border-stone-100 mb-8 shadow-sm">
            <Sparkles className="w-8 h-8 text-stone-900" />
          </div>

          <h2 className="text-3xl font-serif font-black text-stone-900 mb-4 tracking-tight">
            Exclusive Access
          </h2>

          <p className="text-stone-500 font-medium mb-10 leading-relaxed text-sm">
            {message}
          </p>

          <div className="flex flex-col gap-4">
            <Link
              to="/login"
              onClick={onClose}
              className="bg-stone-900 text-white px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-stone-200 flex items-center justify-center gap-3"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={onClose}
              className="border border-stone-200 text-stone-900 px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-stone-50 transition-all flex items-center justify-center gap-3"
            >
              <UserPlus className="w-4 h-4" />
              Join the Registry
            </Link>
          </div>

          <p className="text-[10px] text-stone-400 mt-8 font-black uppercase tracking-widest">
            PartOfTheChange — SCATCH
          </p>
        </div>
      </div>
    </div>
  );
}

