import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
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
          <h3 className="text-lg font-semibold">Orders</h3>
          <p className="text-sm text-slate-400">Past orders will appear here once connected to the API.</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

