import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { signUp, resetAuthError } from '../../store/authSlice';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Use the humanized names from our auth slice
  const { isAuthenticating, authError } = useAppSelector((state) => state.auth);
  const [formValidationError, setFormValidationError] = useState('');

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear old errors
    dispatch(resetAuthError());
    setFormValidationError('');

    // Basic client-side validation logic
    if (password !== confirmPassword) {
      setFormValidationError('Wait, passwords do not match!');
      return;
    }

    if (password.length < 6) {
      setFormValidationError('Password should be at least 6 characters long.');
      return;
    }

    try {
      const result = await dispatch(signUp({ email, password, fullName }));
      if (signUp.fulfilled.match(result)) {
        // success - head home
        navigate('/');
      }
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-stone-900 tracking-tight">Join SCATCH</h1>
          <p className="text-stone-500 mt-2">Create your account to start shopping premium vegan wear.</p>
        </div>

        {(authError || formValidationError) && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 text-sm font-medium">
            {authError || formValidationError}
          </div>
        )}

        <form onSubmit={handleRegisterSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded focus:border-stone-500 outline-none transition-all"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded focus:border-stone-500 outline-none transition-all"
              placeholder="name@email.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded focus:border-stone-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Confirm
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded focus:border-stone-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full bg-stone-900 text-white py-3 rounded font-serif font-bold text-lg hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
          >
            {isAuthenticating ? (
              'Creating your account...'
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Register
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-stone-100 text-center text-sm text-stone-500">
          Already a member?{' '}
          <Link to="/login" className="text-stone-900 font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
