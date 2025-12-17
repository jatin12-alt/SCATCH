import { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/client';
import { clearCart } from '../store/slices/cartSlice';

const steps = ['Shipping', 'Payment', 'Review'];

const CheckoutPage = () => {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    address: ''
  });

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0), [items]);
  const shippingCost = subtotal > 100 ? 0 : 10;
  const total = subtotal + shippingCost;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const orderData = {
        shippingAddress,
        paymentMethod: 'card' // For now, assume card payment
      };

      const response = await api.post('/users/orders', orderData);

      toast.success('Order placed successfully!');
      dispatch(clearCart());
      navigate('/dashboard', { state: { newOrder: response.data.order } });
    } catch (error) {
      console.error('Order creation failed:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">Checkout</p>
        <h1 className="text-3xl font-semibold">Secure Payment</h1>
      </div>

      <div className="flex flex-wrap gap-3">
        {steps.map((step, idx) => (
          <div
            key={step}
            className={`px-4 py-2 rounded-full border text-sm ${
              idx === activeStep ? 'border-accent text-accent' : 'border-surface text-slate-300'
            }`}
          >
            {idx + 1}. {step}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-surface bg-surface/60 p-5 space-y-5">
          {activeStep === 0 && (
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                className="input-dark"
                placeholder="Full name"
                value={shippingAddress.fullName}
                onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                required
              />
              <input
                className="input-dark"
                placeholder="Email"
                type="email"
                value={shippingAddress.email}
                onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                required
              />
              <input
                className="input-dark"
                placeholder="Phone"
                value={shippingAddress.phone}
                onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                required
              />
              <input
                className="input-dark"
                placeholder="City"
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                required
              />
              <input
                className="input-dark sm:col-span-2"
                placeholder="Address line"
                value={shippingAddress.address}
                onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                disabled={!shippingAddress.fullName || !shippingAddress.email || !shippingAddress.phone || !shippingAddress.city || !shippingAddress.address}
                className="sm:col-span-2 rounded-full bg-accent text-background py-3 font-semibold shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Payment
              </button>
            </form>
          )}

          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="rounded-lg border border-surface p-4 bg-background">
                <p className="text-sm text-slate-300">Stripe Elements placeholder</p>
              </div>
              <button
                onClick={() => setActiveStep(2)}
                className="rounded-full bg-accent text-background py-3 font-semibold shadow-glow w-full"
              >
                Review Order
              </button>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="rounded-lg border border-surface p-4 bg-background/50">
                <h4 className="font-semibold mb-3">Order Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span className={shippingCost === 0 ? 'text-accent' : ''}>
                      {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t border-surface">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-surface p-4 bg-background/50">
                <h4 className="font-semibold mb-3">Shipping Address</h4>
                <div className="text-sm text-slate-300">
                  <p className="font-medium text-slate-200">{shippingAddress.fullName}</p>
                  <p>{shippingAddress.address}</p>
                  <p>{shippingAddress.city}</p>
                  <p>{shippingAddress.phone}</p>
                  <p>{shippingAddress.email}</p>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="rounded-full bg-accent text-background py-3 font-semibold shadow-glow w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          )}
        </div>

          <div className="rounded-xl border border-surface bg-surface/60 p-5 space-y-4 h-fit">
            <h3 className="text-lg font-semibold">Summary</h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item._id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">
                    {item.name} × {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-surface pt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between text-slate-300">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Shipping</span>
                <span className={shippingCost === 0 ? 'text-accent' : ''}>
                  {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

