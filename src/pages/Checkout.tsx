import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, CreditCard, CheckCircle, ArrowRight, MapPin, ChevronLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createOrder } from '../store/ordersSlice';
import { clearCart } from '../store/cartSlice';

type CheckoutStep = 'shipping-details' | 'order-review' | 'order-complete';

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // naming update: user -> account
  const { account } = useAppSelector((state) => state.auth);
  const { cartProducts } = useAppSelector((state) => state.cart);

  const [activeStep, setActiveStep] = useState<CheckoutStep>('shipping-details');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState<string | null>(null);

  const [shippingForm, setShippingForm] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });

  useEffect(() => {
    // Basic guard: if cart is empty and not on the success screen, go back
    if (cartProducts.length === 0 && activeStep !== 'order-complete') {
      navigate('/cart');
    }
  }, [cartProducts, activeStep, navigate]);

  const cartSubtotal = cartProducts.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = cartSubtotal > 100 ? 0 : 15; // Raised slightly to feel more 'human/manual'
  const finalTotal = cartSubtotal + shippingFee;

  const handleDetailsProceed = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveStep('order-review');
    window.scrollTo(0, 0);
  };

  const executeFinalOrder = async () => {
    if (!account) return;

    setIsSubmittingOrder(true);
    try {
      const orderPayload = cartProducts.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const result = await dispatch(createOrder({ userId: account.id, cartItems: orderPayload, shippingInfo: shippingForm }));

      if (createOrder.fulfilled.match(result)) {
        setGeneratedOrderId(result.payload.id);
        await dispatch(clearCart(account.id));
        setActiveStep('order-complete');
        window.scrollTo(0, 0);
      }
    } catch (err) {
      console.error('Checkout failed:', err);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  if (activeStep === 'order-complete') {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white rounded-[3rem] shadow-2xl shadow-stone-200/50 p-12 text-center border border-stone-100">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg shadow-green-100">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-stone-900 mb-6 tracking-tighter">Secured.</h1>
          <p className="text-stone-500 font-medium leading-relaxed mb-10">
            Your selection has been processed. We're currently hand-preparing your items for dispatch.
            Expect a notification once your package leaves our boutique.
          </p>
          <div className="bg-stone-50 rounded-3xl p-6 mb-10 border border-stone-100">
            <span className="text-[10px] uppercase font-black tracking-[0.3em] text-stone-400 block mb-2">Tracking ID</span>
            <p className="font-mono text-sm text-stone-900 select-all">{generatedOrderId || 'PROCESSING'}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-stone-900 text-white py-5 rounded-2xl hover:bg-black transition-all font-black text-xs uppercase tracking-widest shadow-xl shadow-stone-200"
          >
            Back to Collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] py-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">

        {/* Modern Stepper */}
        <div className="mb-20">
          <div className="flex items-center justify-between max-w-sm mx-auto">
            <div className={`flex flex-col items-center gap-3 transition-opacity ${activeStep === 'shipping-details' ? 'opacity-100' : 'opacity-30'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-serif font-black ${activeStep === 'shipping-details' ? 'bg-stone-900 text-white shadow-lg shadow-stone-200' : 'bg-stone-200 text-stone-500'}`}>1</div>
              <span className="text-[10px] font-black uppercase tracking-widest">Details</span>
            </div>
            <div className="h-[1px] flex-1 bg-stone-200 mx-4 mt-[-20px]"></div>
            <div className={`flex flex-col items-center gap-3 transition-opacity ${activeStep === 'order-review' ? 'opacity-100' : 'opacity-30'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-serif font-black ${activeStep === 'order-review' ? 'bg-stone-900 text-white shadow-lg shadow-stone-200' : 'bg-stone-200 text-stone-500'}`}>2</div>
              <span className="text-[10px] font-black uppercase tracking-widest">Review</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          <main className="lg:col-span-12">
            <div className="flex flex-col lg:flex-row gap-16">

              {/* Layout Change: Form on Left, Items on Right */}
              <div className="flex-[3]">
                {activeStep === 'shipping-details' && (
                  <div className="bg-white rounded-[2.5rem] shadow-sm p-10 border border-stone-100">
                    <div className="flex items-center gap-4 mb-10">
                      <div className="p-3 bg-stone-50 rounded-2xl">
                        <MapPin className="w-6 h-6 text-stone-900" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-serif font-black text-stone-900">Destination</h2>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Where shall we send your order?</p>
                      </div>
                    </div>

                    <form onSubmit={handleDetailsProceed} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">Recipient Name</label>
                          <input
                            type="text"
                            value={shippingForm.name}
                            onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                            required
                            className="w-full bg-stone-50/50 px-6 py-4 rounded-2xl border border-stone-100 focus:bg-white focus:border-stone-900 outline-none transition-all"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">Contact Number</label>
                          <input
                            type="tel"
                            value={shippingForm.phone}
                            onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                            required
                            className="w-full bg-stone-50/50 px-6 py-4 rounded-2xl border border-stone-100 focus:bg-white focus:border-stone-900 outline-none transition-all"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">Street Address</label>
                        <input
                          type="text"
                          value={shippingForm.address}
                          onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                          required
                          className="w-full bg-stone-50/50 px-6 py-4 rounded-2xl border border-stone-100 focus:bg-white focus:border-stone-900 outline-none transition-all"
                          placeholder="Studio 4, Arts District"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">City</label>
                          <input
                            type="text"
                            value={shippingForm.city}
                            onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                            required
                            className="w-full bg-stone-50/50 px-6 py-4 rounded-2xl border border-stone-100 focus:bg-white focus:border-stone-900 outline-none transition-all"
                            placeholder="London"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">Postal Code</label>
                          <input
                            type="text"
                            value={shippingForm.postalCode}
                            onChange={(e) => setShippingForm({ ...shippingForm, postalCode: e.target.value })}
                            required
                            className="w-full bg-stone-50/50 px-6 py-4 rounded-2xl border border-stone-100 focus:bg-white focus:border-stone-900 outline-none transition-all"
                            placeholder="E1 6AN"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-stone-900 text-white py-6 rounded-2xl hover:bg-black transition-all font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-stone-200 flex items-center justify-center gap-3"
                      >
                        Verify Details
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                )}

                {activeStep === 'order-review' && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    <button
                      onClick={() => setActiveStep('shipping-details')}
                      className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Adjust Shipping
                    </button>

                    <div className="bg-white rounded-[2.5rem] shadow-sm p-10 border border-stone-100 divide-y divide-stone-50">
                      <div className="pb-8">
                        <h2 className="text-2xl font-serif font-black text-stone-900 mb-6">Review Manifest</h2>
                        <div className="space-y-6">
                          {cartProducts.map((item) => (
                            <div key={item.id} className="flex gap-6 items-center">
                              <img
                                src={item.product.image_url || 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=200&q=80'}
                                alt={item.product.name}
                                className="w-20 h-20 object-cover rounded-2xl shadow-sm grayscale-[0.3]"
                              />
                              <div className="flex-1">
                                <h3 className="font-bold text-stone-900">{item.product.name}</h3>
                                <p className="text-[10px] uppercase font-black tracking-widest text-stone-400">Qty: {item.quantity}</p>
                              </div>
                              <span className="font-serif font-black text-stone-900">${(item.product.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="py-8">
                        <h3 className="text-[10px] uppercase font-black tracking-widest text-stone-400 mb-4">Delivery To</h3>
                        <div className="text-stone-900 font-medium">
                          <p className="font-black mb-1">{shippingForm.name}</p>
                          <p className="text-stone-500">{shippingForm.address}</p>
                          <p className="text-stone-500">{shippingForm.city}, {shippingForm.postalCode}</p>
                        </div>
                      </div>

                      <div className="pt-8">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-stone-900" />
                          </div>
                          <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-stone-900">COD Method</h3>
                            <p className="text-[10px] font-bold text-stone-400">Settle balance on arrival</p>
                          </div>
                        </div>

                        <button
                          onClick={executeFinalOrder}
                          disabled={isSubmittingOrder}
                          className="w-full bg-stone-900 text-white py-6 rounded-2xl hover:bg-black transition-all font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-stone-200"
                        >
                          {isSubmittingOrder ? 'Finalizing...' : 'Authorize Purchase'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Summary */}
              <div className="flex-[2]">
                <div className="bg-stone-900 text-white rounded-[3rem] p-10 sticky top-10 shadow-2xl shadow-stone-300">
                  <h2 className="font-serif text-3xl font-black mb-10 tracking-tighter">Summary</h2>

                  <div className="space-y-6 mb-10">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Selection</span>
                      <span className="font-serif font-bold text-lg">${cartSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Courier</span>
                      <span className="font-serif font-bold text-lg">{shippingFee === 0 ? 'Complimentary' : `$${shippingFee.toFixed(2)}`}</span>
                    </div>
                    <div className="h-[1px] bg-stone-800"></div>
                    <div className="flex justify-between items-baseline pt-4">
                      <span className="text-stone-500 font-black text-[10px] uppercase tracking-[0.3em]">Grand Total</span>
                      <div className="flex flex-col items-end leading-none">
                        <span className="text-5xl font-serif font-black">${finalTotal.toFixed(2)}</span>
                        <span className="text-[8px] font-bold text-green-500 uppercase tracking-widest mt-2">All taxes inclusive</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                    <div className="flex gap-4 items-center">
                      <Package className="w-5 h-5 text-stone-500" />
                      <p className="text-[10px] font-medium text-stone-400 leading-tight">
                        Our packaging is 100% compostable and certified plastic-free.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
