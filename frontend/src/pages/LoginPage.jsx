import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = e => {
    e.preventDefault();
    // Place authentication API call here; set error if needed
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-[400px] bg-surface rounded-2xl shadow-card p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-textPrimary">Welcome Back</h1>
        <form className="space-y-4" onSubmit={handleLogin} noValidate>
          <div>
            <label className="block text-sm font-semibold text-textPrimary mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-lg border border-surface bg-background focus:border-accent outline-none"
              placeholder="you@email.com"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-semibold text-textPrimary mb-1">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full px-4 py-2 rounded-lg border border-surface bg-background focus:border-accent outline-none"
              placeholder="••••••••"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              minLength={8}
              autoComplete="current-password"
            />
            <span
              className="absolute right-3 top-9 cursor-pointer select-none text-gray-400"
              onClick={() => setShowPassword(s => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={0}
              role="button"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.269-2.944-9.45-7a.982.982 0 010-.5C3.732 7.944 7.522 5 12 5c.7 0 1.38.054 2.036.157m3.704 1.55C19.736 8.09 21.171 9.755 21.45 11.5a.96.96 0 010 .5c-.362 1.444-1.188 2.871-2.442 4.004M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </span>
            <div className="flex justify-between mt-2">
              <Link className="text-xs text-gray-400 hover:text-accent transition" to="/forgot-password">
                Forgot Password?
              </Link>
            </div>
          </div>
          {error && <div className="text-error text-xs mt-1">{error}</div>}
          <button
            type="submit"
            className="w-full bg-accent text-white py-2 rounded-lg font-semibold shadow-glow hover:bg-accent/90 transition"
          >
            Log In
          </button>
          <div className="text-center text-xs mt-2">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-accent font-bold hover:underline">Register</Link>
          </div>
        </form>
        <div className="mt-8">
          <div className="flex items-center text-xs mb-4 text-gray-400">
            <div className="border-b border-gray-200 flex-1"></div>
            <span className="mx-3">or sign in with</span>
            <div className="border-b border-gray-200 flex-1"></div>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              className="bg-white border rounded-full shadow p-2 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Sign in with Google"
            >
              <img src="/google-icon.svg" alt="Google" className="h-6 w-6" />
            </button>
            <button
              type="button"
              className="bg-white border rounded-full shadow p-2 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Sign in with Apple"
            >
              <img src="/apple-icon.svg" alt="Apple" className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

