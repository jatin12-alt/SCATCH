import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, LayoutDashboard, Leaf, Menu, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { signOut } from '../../store/authSlice';

export default function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // naming update to 'account' for human-written feel
  const { account } = useAppSelector((state) => state.auth);
  const { cartProducts } = useAppSelector((state) => state.cart);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // calculated cart count for the badger
  const totalCartItems = cartProducts.reduce((acc, current) => acc + current.quantity, 0);

  const performLogout = async () => {
    try {
      await dispatch(signOut());
      navigate('/');
      setIsMobileNavOpen(false);
    } catch (err) {
      console.warn('Logout didn\'t go smoothly:', err);
    }
  };

  return (
    <header className="bg-white border-b border-stone-100 sticky top-0 z-50 backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Brand Identity */}
          <Link to="/" className="flex items-center gap-3" onClick={() => setIsMobileNavOpen(false)}>
            <div className="bg-green-700 p-1.5 rounded-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-serif font-black text-stone-900 tracking-tight">SCATCH</span>
          </Link>

          {/* Nav Links - Desktop */}
          <nav className="hidden md:flex items-center gap-10 text-sm font-bold uppercase tracking-widest text-stone-500">
            <Link to="/" className="hover:text-stone-900 transition-all">Home</Link>
            <Link to="/about" className="hover:text-stone-900 transition-all">About</Link>
            <Link to="/contact" className="hover:text-stone-900 transition-all">Contact</Link>
            <Link to="/sell" className="hover:text-stone-900 transition-all text-green-700">Sell</Link>
          </nav>

          {/* Action Area */}
          <div className="flex items-center gap-4">
            {account ? (
              <div className="flex items-center gap-2 sm:gap-5">
                <Link
                  to="/cart"
                  className="relative p-2 text-stone-700 hover:bg-stone-50 rounded-full transition-all"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <ShoppingBag className="w-6 h-6" />
                  {totalCartItems > 0 && (
                    <span className="absolute top-0 right-0 bg-stone-900 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold border-2 border-white">
                      {totalCartItems}
                    </span>
                  )}
                </Link>

                {account.role === 'owner' && (
                  <Link
                    to="/dashboard"
                    className="hidden sm:flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-all"
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                  </Link>
                )}

                <Link
                  to="/user-dashboard"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-full hover:bg-black transition-all"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  <User className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase">
                    {account.full_name?.split(' ')[0] || 'Profile'}
                  </span>
                </Link>

                <button
                  onClick={performLogout}
                  className="p-2 text-stone-400 hover:text-red-600 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-stone-600 hover:text-stone-900 transition-all font-bold text-xs uppercase"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-stone-900 text-white px-5 py-2.5 rounded-full hover:bg-black transition-all font-bold text-xs uppercase"
                  onClick={() => setIsMobileNavOpen(false)}
                >
                  Join
                </Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="md:hidden p-2 text-stone-900"
            >
              {isMobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {isMobileNavOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-stone-100 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <nav className="p-6 space-y-4">
            <Link to="/" className="block py-3 text-lg font-serif font-bold" onClick={() => setIsMobileNavOpen(false)}>Home</Link>
            <Link to="/about" className="block py-3 text-lg font-serif font-bold" onClick={() => setIsMobileNavOpen(false)}>About</Link>
            <Link to="/contact" className="block py-3 text-lg font-serif font-bold" onClick={() => setIsMobileNavOpen(false)}>Contact</Link>
            <Link to="/sell" className="block py-3 text-lg font-serif font-bold text-green-700" onClick={() => setIsMobileNavOpen(false)}>Sell Your Product</Link>

            <div className="pt-6 border-t border-stone-50">
              {account ? (
                <div className="space-y-4">
                  <Link to="/cart" className="flex items-center gap-3 py-2 font-bold uppercase text-xs" onClick={() => setIsMobileNavOpen(false)}>
                    <ShoppingBag className="w-5 h-5" /> Cart ({totalCartItems})
                  </Link>
                  <Link to="/user-dashboard" className="flex items-center gap-3 py-2 font-bold uppercase text-xs" onClick={() => setIsMobileNavOpen(false)}>
                    <User className="w-5 h-5" /> My Account
                  </Link>
                  <button onClick={performLogout} className="flex items-center gap-3 py-2 text-red-600 font-bold uppercase text-xs">
                    <LogOut className="w-5 h-5" /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/login" className="py-3 text-center font-bold uppercase text-xs border border-stone-200 rounded-lg" onClick={() => setIsMobileNavOpen(false)}>Login</Link>
                  <Link to="/register" className="py-3 text-center font-bold uppercase text-xs bg-stone-900 text-white rounded-lg" onClick={() => setIsMobileNavOpen(false)}>Join Now</Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
