import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCart, updateCartQuantity, removeFromCart } from '../store/cartSlice';
import Toast from '../components/Toast';

export default function Cart() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // naming update: user -> account
  const { account } = useAppSelector((state) => state.auth);
  const { cartProducts, isCartSyncing } = useAppSelector((state) => state.cart);

  const [isToastShowing, setIsToastShowing] = useState(false);
  const [toastContent, setToastContent] = useState('');

  useEffect(() => {
    if (account) {
      dispatch(fetchCart(account.id));
    }
  }, [dispatch, account]);

  const modifyQuantity = async (cartItemId: string, currentQty: number, delta: number) => {
    const targetQty = currentQty + delta;
    if (targetQty < 1) return;

    await dispatch(updateCartQuantity({ cartItemId, quantity: targetQty }));
  };

  const removeCartItem = async (cartItemId: string) => {
    await dispatch(removeFromCart(cartItemId));
    setToastContent('Item has been gracefully removed.');
    setIsToastShowing(true);
  };

  const cartSubtotal = cartProducts.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const courierFee = cartSubtotal > 150 ? 0 : 12; // Adjusted thresholds for character
  const grandTotalValue = cartSubtotal + courierFee;

  if (isCartSyncing && cartProducts.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-900 rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Inventory Sync...</p>
        </div>
      </div>
    );
  }

  if (cartProducts.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm border border-stone-100">
            <ShoppingBag className="w-10 h-10 text-stone-200" />
          </div>
          <h2 className="text-3xl font-serif font-black text-stone-900 mb-4 tracking-tighter">Your Bag is Empty</h2>
          <p className="text-stone-500 font-medium mb-10 leading-relaxed">
            It looks like you haven't curated your collection yet. Start browsing our ethical essentials.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-stone-900 text-white px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-stone-200"
          >
            Start Curating
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">

        <header className="mb-16 border-b border-stone-100 pb-10">
          <h1 className="text-5xl font-serif font-black text-stone-900 tracking-tighter">Your Collection</h1>
          <p className="text-[10px] uppercase font-black tracking-[0.3em] text-stone-400 mt-2">
            Selected Pieces ({cartProducts.length})
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Main List */}
          <div className="lg:col-span-8 space-y-8">
            {cartProducts.map((item) => (
              <div key={item.id} className="group relative bg-white rounded-[2rem] p-8 border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-500">
                <div className="flex flex-col sm:flex-row gap-8">
                  <div className="relative aspect-square w-full sm:w-40 bg-stone-50 rounded-2xl overflow-hidden shrink-0">
                    <img
                      src={item.product.image_url || 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&q=80'}
                      alt={item.product.name}
                      className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-green-600 block mb-1">
                          {item.product.category}
                        </span>
                        <h3 className="text-2xl font-serif font-black text-stone-900 line-clamp-1">{item.product.name}</h3>
                        <p className="text-xs font-medium text-stone-400 mt-1">{item.product.material_type}</p>
                      </div>
                      <button
                        onClick={() => removeCartItem(item.id)}
                        className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-6 pt-6 mt-6 border-t border-stone-50">
                      <div className="flex items-center bg-stone-50 rounded-xl p-1 gap-1">
                        <button
                          onClick={() => modifyQuantity(item.id, item.quantity, -1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-900 disabled:opacity-30"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-serif font-black text-stone-900 w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => modifyQuantity(item.id, item.quantity, 1)}
                          disabled={item.quantity >= item.product.stock_count}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-900 disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-stone-400 block -mb-1">Investment</span>
                        <span className="text-2xl font-serif font-black text-stone-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Logic */}
          <div className="lg:col-span-4">
            <div className="bg-stone-900 text-white rounded-[2.5rem] p-10 sticky top-24 shadow-2xl shadow-stone-300">
              <h2 className="text-3xl font-serif font-black mb-10 tracking-tighter">Inventory Summary</h2>

              <div className="space-y-6 mb-12">
                <div className="flex justify-between text-stone-400 font-medium">
                  <span className="text-xs uppercase tracking-widest">Subtotal</span>
                  <span className="font-serif text-lg">${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-400 font-medium">
                  <span className="text-xs uppercase tracking-widest">Courier</span>
                  <span className="font-serif text-lg">{courierFee === 0 ? 'Complimentary' : `$${courierFee.toFixed(2)}`}</span>
                </div>

                {cartSubtotal < 150 && (
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-green-400 font-bold uppercase tracking-wider leading-relaxed">
                      Invest ${(150 - cartSubtotal).toFixed(2)} more for complimentary shipping.
                    </p>
                  </div>
                )}

                <div className="h-[1px] bg-stone-800 my-8"></div>

                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 mb-1">Total Balance</span>
                  <span className="text-5xl font-serif font-black text-white">
                    ${grandTotalValue.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-white text-stone-900 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-stone-100 transition-all flex items-center justify-center gap-3"
                >
                  Secure Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-transparent text-stone-500 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:text-white transition-all"
                >
                  Keep Browsing
                </button>
              </div>

              <div className="mt-12 flex items-center gap-3 text-stone-600">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Encrypted Checkout Process</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {isToastShowing && <Toast message={toastContent} type="success" onClose={() => setIsToastShowing(false)} />}
    </div>
  );
}
