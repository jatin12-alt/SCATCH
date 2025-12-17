import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTheme } from '../components/ThemeProvider';
import { setProfile } from '../store/slices/authSlice';

const SettingsPage = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, themePreference, setThemePreference, toggleTheme } = useTheme();

  const isAuthenticated = Boolean(user || token);

  const initialProfile = useMemo(
    () => ({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.contact || '',
      avatar: user?.picture || ''
    }),
    [user]
  );

  const [profileForm, setProfileForm] = useState(initialProfile);
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false
  });
  const [language, setLanguage] = useState('en');
  const [addresses, setAddresses] = useState([
    {
      id: 'home',
      label: 'Home',
      line1: '123 Demo Street',
      city: 'Sample City',
      country: 'Nowhere',
      postal: '00000'
    }
  ]);
  const [addressDraft, setAddressDraft] = useState({
    label: '',
    line1: '',
    city: '',
    country: '',
    postal: ''
  });
  const [editingAddressId, setEditingAddressId] = useState(null);

  useEffect(() => {
    setProfileForm(initialProfile);
  }, [initialProfile]);

  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(
        () => navigate('/login', { replace: true, state: { from: '/settings' } }),
        3200
      );
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  const handleProfileSave = () => {
    dispatch(
      setProfile({
        fullName: profileForm.fullName,
        email: profileForm.email,
        contact: profileForm.phone,
        picture: profileForm.avatar
      })
    );
    toast.success('Profile updated (temporary local state)');
  };

  const handleSecuritySave = () => {
    if (!securityForm.currentPassword || !securityForm.newPassword) {
      toast.error('Enter current and new password');
      return;
    }
    if (securityForm.newPassword.length < 8) {
      toast.error('Use at least 8 characters for a new password');
      return;
    }
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    toast.success('Password change submitted (stub)');
    setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleSaveAddress = () => {
    if (!addressDraft.line1 || !addressDraft.city || !addressDraft.country) {
      toast.error('Add street, city, and country');
      return;
    }

    const payload = {
      id: editingAddressId || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      label: addressDraft.label || 'Untitled',
      line1: addressDraft.line1,
      city: addressDraft.city,
      country: addressDraft.country,
      postal: addressDraft.postal
    };

    setAddresses((prev) =>
      editingAddressId ? prev.map((addr) => (addr.id === editingAddressId ? payload : addr)) : [...prev, payload]
    );

    setAddressDraft({ label: '', line1: '', city: '', country: '', postal: '' });
    setEditingAddressId(null);
    toast.success('Address saved locally');
  };

  const handleEditAddress = (address) => {
    setEditingAddressId(address.id);
    setAddressDraft({
      label: address.label || '',
      line1: address.line1,
      city: address.city,
      country: address.country,
      postal: address.postal || ''
    });
  };

  const handleRemoveAddress = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleDeleteAccount = () => {
    if (window.confirm('This will delete your account. Continue?')) {
      toast.success('Delete account requested (stub)');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <p className="text-xs uppercase tracking-wide text-slate-400">Settings</p>
          <h1 className="text-3xl font-semibold">Login required to manage settings.</h1>
          <p className="text-sm text-slate-400">
            You will be redirected to the login page shortly. Sign in to keep going.
          </p>
          <Link
            to="/login"
            className="inline-block rounded-full bg-accent text-background px-6 py-3 font-semibold shadow-glow hover:brightness-110 transition"
          >
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">Account</p>
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="text-sm text-slate-400">Tweak your profile, security, and preferences.</p>
      </div>

      <div className="rounded-xl border border-surface bg-surface/60 p-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Owner access</p>
          <h2 className="text-xl font-semibold">Owner dashboard</h2>
          <p className="text-sm text-slate-400">Manage products as the single owner.</p>
        </div>
        <Link
          to="/owner"
          className="rounded-full bg-accent text-background px-4 py-2 font-semibold shadow-glow hover:brightness-110 transition"
        >
          Go to owner login
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="rounded-xl border border-surface bg-surface/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Owner</p>
              <h2 className="text-xl font-semibold">Store management</h2>
            </div>
            <Link
              to="/owner"
              className="rounded-full bg-accent text-background px-4 py-2 font-semibold shadow-glow hover:brightness-110 transition"
            >
              Go to owner login
            </Link>
          </div>
          <p className="text-sm text-slate-400">
            Access the owner dashboard to add, edit, or remove products from the shop.
          </p>
        </section>

        <section className="rounded-xl border border-surface bg-surface/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Profile</p>
              <h2 className="text-xl font-semibold">Basic info</h2>
            </div>
            <button
              onClick={handleProfileSave}
              className="rounded-full bg-accent text-background px-4 py-2 font-semibold shadow-glow hover:brightness-110 transition"
            >
              Save profile
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              className="input-dark"
              placeholder="Full name"
              value={profileForm.fullName}
              onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
            />
            <input
              className="input-dark"
              placeholder="Email"
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
            />
            <input
              className="input-dark"
              placeholder="Phone"
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
            />
            <input
              className="input-dark"
              placeholder="Avatar URL"
              value={profileForm.avatar}
              onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
            />
          </div>
        </section>

        <section className="rounded-xl border border-surface bg-surface/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Security</p>
              <h2 className="text-xl font-semibold">Password & 2FA</h2>
            </div>
            <button
              onClick={handleSecuritySave}
              className="rounded-full bg-accent text-background px-4 py-2 font-semibold shadow-glow hover:brightness-110 transition"
            >
              Update security
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              className="input-dark"
              placeholder="Current password"
              type="password"
              value={securityForm.currentPassword}
              onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
            />
            <input
              className="input-dark"
              placeholder="New password"
              type="password"
              value={securityForm.newPassword}
              onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
            />
            <input
              className="input-dark"
              placeholder="Confirm new password"
              type="password"
              value={securityForm.confirmPassword}
              onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                className="accent-accent"
                checked={twoFactorEnabled}
                onChange={(e) => {
                  setTwoFactorEnabled(e.target.checked);
                  toast.success(`2FA ${e.target.checked ? 'enabled' : 'disabled'} (stub)`);
                }}
              />
              Enable two-factor authentication (placeholder)
            </label>
        </div>
        </section>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <section className="rounded-xl border border-surface bg-surface/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Theme</p>
              <h2 className="text-xl font-semibold">Appearance</h2>
            </div>
            <button
              onClick={toggleTheme}
              className="rounded-full bg-accent text-background px-4 py-2 font-semibold shadow-glow hover:brightness-110 transition"
            >
              Quick toggle
            </button>
          </div>
          <div className="flex gap-2">
            {['light', 'dark', 'system'].map((option) => (
              <button
                key={option}
                onClick={() => setThemePreference(option)}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm transition ${
                  themePreference === option
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-surface bg-surface/50 text-slate-200'
                }`}
              >
                {option === 'system' ? 'System' : option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
          <p className="text-sm text-slate-400">Current theme: {theme} (preference: {themePreference})</p>
        </section>

        <section className="rounded-xl border border-surface bg-surface/60 p-5 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Notifications</p>
            <h2 className="text-xl font-semibold">Alerts</h2>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between text-sm">
              <span>Email updates</span>
              <input
                type="checkbox"
                className="accent-accent"
                checked={notifications.email}
                onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
              />
            </label>
            <label className="flex items-center justify-between text-sm">
              <span>Push notifications</span>
              <input
                type="checkbox"
                className="accent-accent"
                checked={notifications.push}
                onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
              />
            </label>
            <p className="text-xs text-slate-400">Settings are stored locally for now.</p>
          </div>
        </section>

        <section className="rounded-xl border border-surface bg-surface/60 p-5 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Language</p>
            <h2 className="text-xl font-semibold">Regional</h2>
          </div>
          <select className="input-dark" value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
          <p className="text-xs text-slate-400">Applies to UI copy once localization is wired.</p>
        </section>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="rounded-xl border border-surface bg-surface/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Addresses</p>
              <h2 className="text-xl font-semibold">Shipping</h2>
            </div>
            <button
              onClick={handleSaveAddress}
              className="rounded-full bg-accent text-background px-4 py-2 font-semibold shadow-glow hover:brightness-110 transition"
            >
              {editingAddressId ? 'Update address' : 'Add address'}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              className="input-dark"
              placeholder="Label (Home, Office...)"
              value={addressDraft.label}
              onChange={(e) => setAddressDraft({ ...addressDraft, label: e.target.value })}
            />
            <input
              className="input-dark"
              placeholder="Address line"
              value={addressDraft.line1}
              onChange={(e) => setAddressDraft({ ...addressDraft, line1: e.target.value })}
            />
            <input
              className="input-dark"
              placeholder="City"
              value={addressDraft.city}
              onChange={(e) => setAddressDraft({ ...addressDraft, city: e.target.value })}
            />
            <input
              className="input-dark"
              placeholder="Country"
              value={addressDraft.country}
              onChange={(e) => setAddressDraft({ ...addressDraft, country: e.target.value })}
            />
            <input
              className="input-dark"
              placeholder="Postal code"
              value={addressDraft.postal}
              onChange={(e) => setAddressDraft({ ...addressDraft, postal: e.target.value })}
            />
          </div>
          <div className="space-y-3">
            {addresses.length === 0 && <p className="text-sm text-slate-400">No addresses yet.</p>}
            {addresses.map((address) => (
              <div
                key={address.id}
                className="flex items-start justify-between rounded-lg border border-surface/80 bg-surface/40 p-3"
              >
                <div className="text-sm space-y-1">
                  <p className="font-semibold">{address.label}</p>
                  <p>{address.line1}</p>
                  <p className="text-slate-400">
                    {address.city}, {address.country} {address.postal}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button className="text-xs text-accent hover:brightness-125" onClick={() => handleEditAddress(address)}>
                    Edit
                  </button>
                  <button
                    className="text-xs text-red-400 hover:text-red-300"
                    onClick={() => handleRemoveAddress(address.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-surface bg-surface/60 p-5 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Danger zone</p>
            <h2 className="text-xl font-semibold">Delete account</h2>
          </div>
          <p className="text-sm text-slate-400">
            Permanently remove your account and data. This action cannot be undone.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="rounded-full bg-red-500 text-background px-4 py-2 font-semibold hover:brightness-110 transition"
          >
            Delete account
          </button>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
