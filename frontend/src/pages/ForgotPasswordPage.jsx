import React, { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    // Implement API call for forgot password
    setSubmitted(true); // show notice
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-[400px] bg-surface rounded-2xl shadow-card p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-textPrimary">Reset your password</h1>
        {submitted ? (
          <div className="text-center">
            <div className="text-accent font-bold text-xl mb-2">Check your email!</div>
            <div className="text-gray-600">If an account exists, we have sent a password reset link.</div>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
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
            {error && <div className="text-error text-xs mt-1">{error}</div>}
            <button
              type="submit"
              className="w-full bg-accent text-white py-2 rounded-lg font-semibold shadow-glow hover:bg-accent/90 transition"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

