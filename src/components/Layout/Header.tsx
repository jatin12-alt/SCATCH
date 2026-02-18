import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, LayoutDashboard, Leaf, Menu, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { signOut } from '../../store/authSlice';

export default function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSignOut = async () => {
    await dispatch(signOut());
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-6">
          {/* Left: Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0" onClick={() => setMobileMenuOpen(false)}>
            <Leaf className="w-7 h-7 text-green-700 group-hover:scale-110 transition-transform" />
            <span className="text-xl sm:text-2xl font-serif font-bold text-stone-800">SCATCH</span>
          </Link>

          {/* Center: Main navigation links (Desktop) */}
          <nav className="hidden md:flex flex-1 justify-center items-center gap-8 text-sm font-medium text-stone-700">
            <Link to="/" className="hover:text-stone-900 transition-colors">
              Home
            </Link>
            <Link to="/about" className="hover:text-stone-900 transition-colors">
              About
            </Link>
            <Link to="/contact" className="hover:text-stone-900 transition-colors">
              Contact
            </Link>
            <Link to="/sell" className="hover:text-stone-900 transition-colors">
              Sell your product
            </Link>
          </nav>

          {/* Right: Auth / cart / dashboard */}
          <nav className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
            {user ? (
              <>
                <Link
                  to="/cart"
                  className="relative hover:text-stone-600 transition-colors flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>

                {user.role === 'owner' && (
                  <Link
                    to="/dashboard"
                    className="hidden sm:flex items-center gap-2 text-stone-700 hover:text-stone-900 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </Link>
                )}

                <Link
                  to="/user-dashboard"
                  className="hidden sm:flex items-center gap-2 px-3 py-1 bg-stone-100 rounded-full hover:bg-stone-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-4 h-4 text-stone-600" />
                  <span className="text-sm font-medium text-stone-700">
                    {user.full_name || user.email.split('@')[0]}
                  </span>
                </Link>

                <button
                  onClick={handleSignOut}
                  className="text-stone-600 hover:text-stone-800 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:block text-stone-700 hover:text-stone-900 transition-colors font-medium text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:block bg-stone-800 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-stone-900 transition-colors font-medium text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-stone-700 hover:text-stone-900 transition-colors p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white">
            <nav className="px-4 py-4 space-y-3">
              <Link
                to="/"
                className="block py-2 text-stone-700 hover:text-stone-900 transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block py-2 text-stone-700 hover:text-stone-900 transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block py-2 text-stone-700 hover:text-stone-900 transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/sell"
                className="block py-2 text-stone-700 hover:text-stone-900 transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sell your product
              </Link>

              {user ? (
                <>
                  <div className="border-t border-stone-200 my-3"></div>
                  <Link
                    to="/cart"
                    className="flex items-center gap-2 py-2 text-stone-700 hover:text-stone-900 transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Cart {cartItemsCount > 0 && `(${cartItemsCount})`}
                  </Link>
                  {user.role === 'owner' && (
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 py-2 text-stone-700 hover:text-stone-900 transition-colors font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      Dashboard
                    </Link>
                  )}
                  <Link
                    to="/user-dashboard"
                    className="flex items-center gap-2 py-2 text-stone-700 hover:text-stone-900 transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    {user.full_name || user.email}
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 py-2 text-stone-700 hover:text-stone-900 transition-colors font-medium w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t border-stone-200 my-3"></div>
                  <Link
                    to="/login"
                    className="block py-2 text-stone-700 hover:text-stone-900 transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block py-2 bg-stone-800 text-white rounded-lg text-center font-medium hover:bg-stone-900 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
