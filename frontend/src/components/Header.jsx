import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Settings, ShoppingBag, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import SettingsPanel from './SettingsPanel';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition hover:text-accent ${isActive ? 'text-accent' : 'text-textPrimary'}`;

const Header = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + (item.quantity || 1), 0)
  );

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
          <NavLink to="/profile" className={navLinkClass}>
            Profile
          </NavLink>
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
          <NavLink to="/profile" className="inline-flex items-center p-2 rounded-full hover:bg-surface">
            <User className="h-5 w-5" />
          </NavLink>
        </div>
      </div>
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </header>
  );
};

export default Header;

