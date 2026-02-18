import { X, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

export default function LoginPromptModal({ isOpen, onClose, message = 'Please login to continue' }: LoginPromptModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-in zoom-in-95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <LogIn className="w-8 h-8 text-green-700" />
          </div>

          <h2 className="text-2xl font-serif font-bold text-stone-800 mb-2">
            Login Required
          </h2>

          <p className="text-stone-600 mb-6">
            {message}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/login"
              onClick={onClose}
              className="flex-1 bg-stone-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-stone-900 transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={onClose}
              className="flex-1 border-2 border-stone-800 text-stone-800 px-6 py-3 rounded-lg font-semibold hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Register
            </Link>
          </div>

          <p className="text-sm text-stone-500 mt-4">
            Don't have an account? Create one in seconds!
          </p>
        </div>
      </div>
    </div>
  );
}

