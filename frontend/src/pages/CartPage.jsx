import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeItem, updateQuantity } from '../store/slices/cartSlice';
import { Trash2 } from 'lucide-react';

const CartPage = () => {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const subtotal = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Your bag</p>
          <h1 className="text-3xl font-semibold">Cart</h1>
        </div>
        <Link
          to="/shop"
          className="text-sm text-accent border border-accent/40 rounded-full px-4 py-2 hover:bg-accent/10"
        >
          Continue shopping
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-surface bg-surface/60 p-6 text-center text-slate-400">
          Your cart is empty.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex gap-4 rounded-xl border border-surface bg-surface/50 p-4 items-center"
              >
                <div className="h-24 w-24 rounded-lg overflow-hidden bg-background">
                  <img src={item.images?.[0] || item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm uppercase text-slate-400">{item.category}</p>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-slate-400">{item.material}</p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    className="w-16 rounded-lg bg-background border border-surface px-2 py-1"
                    value={item.quantity}
                    onChange={(e) => dispatch(updateQuantity({ id: item._id, quantity: Number(e.target.value) }))}
                  />
                  <p className="text-lg font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => dispatch(removeItem(item._id))}
                    className="p-2 rounded-full hover:bg-background text-slate-400 hover:text-error"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-surface bg-surface/60 p-5 space-y-4 h-fit">
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-300">
              <span>Shipping</span>
              <span className="text-accent">Calculated at checkout</span>
            </div>
            <div className="flex items-center justify-between text-base font-semibold pt-2 border-t border-surface">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              className="block text-center rounded-full bg-accent text-background py-3 font-semibold shadow-glow hover:brightness-110 transition"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;

