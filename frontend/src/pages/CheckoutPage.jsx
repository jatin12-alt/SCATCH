import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

const steps = ['Shipping', 'Payment', 'Review'];

const CheckoutPage = () => {
  const items = useSelector((state) => state.cart.items);
  const [activeStep, setActiveStep] = useState(0);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0), [items]);

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
              <input className="input-dark" placeholder="Full name" required />
              <input className="input-dark" placeholder="Email" type="email" required />
              <input className="input-dark" placeholder="Phone" required />
              <input className="input-dark" placeholder="City" required />
              <input className="input-dark sm:col-span-2" placeholder="Address line" required />
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="sm:col-span-2 rounded-full bg-accent text-background py-3 font-semibold shadow-glow"
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
            <div className="space-y-3">
              <p className="text-sm text-slate-300">
                Confirm your details and place the order. Payment will be processed securely.
              </p>
              <button className="rounded-full bg-accent text-background py-3 font-semibold shadow-glow w-full">
                Place Order
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
              <span className="text-accent">Calculated</span>
            </div>
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

