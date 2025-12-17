import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/client';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Email and password are required');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/admin/login', { email, password });
      if (data?.owner) {
        toast.success('Admin logged in successfully');
        navigate('/owner/dashboard');
      } else {
        toast.error('Invalid response from server');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-surface bg-surface/70 p-6 shadow-card space-y-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-slate-400">Admin</p>
          <h1 className="text-2xl font-semibold">Admin Login</h1>
          <p className="text-sm text-slate-400">Access the shop management dashboard.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-dark mt-2 w-full"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-dark mt-2 w-full"
              placeholder="Enter password"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-accent text-background py-3 font-semibold shadow-glow hover:brightness-110 transition disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;