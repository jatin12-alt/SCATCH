import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { signIn, resetAuthError } from '../../store/authSlice';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // naming matches our refactored store
  const { isAuthenticating, authError } = useAppSelector((state) => state.auth);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // reset any previous errors before trying again
    dispatch(resetAuthError());

    try {
      const result = await dispatch(signIn({ email, password }));

      if (signIn.fulfilled.match(result)) {
        // successful login, push to home
        navigate('/');
      }
    } catch (err) {
      console.error('Login action crashed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-bold text-stone-900 tracking-tight">Welcome Back</h1>
          <p className="text-stone-500 mt-2">Access your SCATCH dashboard</p>
        </div>

        {authError && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 text-sm font-medium animate-pulse-once">
            {authError}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Email
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

          <button
            type="submit"
            disabled={isAuthenticating}
            className="w-full bg-stone-900 text-white py-3 rounded font-serif font-bold text-lg hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isAuthenticating ? (
              'Checking credentials...'
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Login
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-stone-100 text-center text-sm text-stone-500">
          New here?{' '}
          <Link to="/register" className="text-stone-900 font-bold hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
