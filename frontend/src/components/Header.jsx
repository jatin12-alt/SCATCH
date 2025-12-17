import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Settings, ShoppingBag, User, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import api from '../api/client';
import { logout } from '../store/slices/authSlice';
import SettingsPanel from './SettingsPanel';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition hover:text-accent ${isActive ? 'text-accent' : 'text-textPrimary'}`;

const Header = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + (item.quantity || 1), 0)
  );
  const { user, token } = useSelector((state) => state.auth);
  const isLoggedIn = user && token;

  const handleLogout = async () => {
    try {
      await api.post('/api/users/logout');
      dispatch(logout());
      toast.success('Logged out successfully');
      navigate('/shop');
    } catch (error) {
      // Even if API call fails, clear local state
      dispatch(logout());
      toast.success('Logged out successfully');
      navigate('/shop');
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur bg-background/80 border-b border-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        <Link to="/shop" className="text-xl font-semibold tracking-tight flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent font-bold">
            S
          </span>
          Scatch
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/shop" className={navLinkClass}>
            Shop
          </NavLink>
          {isLoggedIn && (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/profile" className={navLinkClass}>
                Profile
              </NavLink>
            </>
          )}
        </nav>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSettingsOpen(true)}
            className="inline-flex items-center p-2 rounded-full hover:bg-surface"
            aria-label="Open settings"
          >
            <Settings className="h-5 w-5" />
          </button>
          <NavLink to="/cart" className="relative inline-flex items-center p-2 rounded-full hover:bg-surface">
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 text-[10px] bg-accent text-background rounded-full px-1.5 py-0.5">
                {cartCount}
              </span>
            )}
          </NavLink>
          {isLoggedIn ? (
            <>
              <NavLink to="/profile" className="inline-flex items-center p-2 rounded-full hover:bg-surface">
                <User className="h-5 w-5" />
              </NavLink>
              <button
                onClick={handleLogout}
                className="inline-flex items-center p-2 rounded-full hover:bg-surface"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <NavLink to="/login" className="inline-flex items-center p-2 rounded-full hover:bg-surface">
              <User className="h-5 w-5" />
            </NavLink>
          )}
        </div>
      </div>
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </header>
  );
};

export default Header;

