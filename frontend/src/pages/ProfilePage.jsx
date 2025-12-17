import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, ShoppingBag } from 'lucide-react';
import { setProfile } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    contact: user?.contact || '',
    picture: user?.picture || ''
  });

  const handleSave = () => {
    dispatch(setProfile(form));
    toast.success('Profile updated (local state)');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Heads up</p>
          <h1 className="text-3xl font-semibold">Login first, bro, then the profile vibes.</h1>
          <p className="text-sm text-slate-400">No login, no profile. Them the rules.</p>
          <Link
            to="/login"
            className="inline-block rounded-full bg-accent text-background px-6 py-3 font-semibold shadow-glow hover:brightness-110 transition"
          >
            Take me to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">Account</p>
        <h1 className="text-3xl font-semibold">Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-surface bg-surface/60 p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              className="input-dark"
              placeholder="Full name"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            <input
              className="input-dark"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              className="input-dark"
              placeholder="Contact"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
            />
            <input
              className="input-dark"
              placeholder="Profile image URL"
              value={form.picture}
              onChange={(e) => setForm({ ...form, picture: e.target.value })}
            />
          </div>
          <button
            onClick={handleSave}
            className="rounded-full bg-accent text-background py-3 font-semibold shadow-glow hover:brightness-110 transition"
          >
            Save Changes
          </button>
        </div>

        <div className="rounded-xl border border-surface bg-surface/60 p-5 space-y-3">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/dashboard"
              className="block w-full text-left rounded-lg border border-surface p-3 hover:border-accent transition"
            >
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="font-medium">View Dashboard</p>
                  <p className="text-sm text-slate-400">Check orders and account overview</p>
                </div>
              </div>
            </Link>
            <Link
              to="/cart"
              className="block w-full text-left rounded-lg border border-surface p-3 hover:border-accent transition"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="font-medium">View Cart</p>
                  <p className="text-sm text-slate-400">Check your shopping cart</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

