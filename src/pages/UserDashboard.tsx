import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUserOrders } from '../store/ordersSlice';
import { signOut } from '../store/authSlice';
import { LogOut, Package, MapPin, Phone, Mail, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';

export default function UserDashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // naming update: user -> account
  const { account } = useAppSelector((state) => state.auth);
  const { orderList: orders, isFetchingOrders } = useAppSelector((state) => state.orders);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage] = useState('');
  const [currentTab, setCurrentTab] = useState<'profile' | 'orders'>('profile');

  useEffect(() => {
    if (account) {
      dispatch(fetchUserOrders(account.id));
    }
  }, [account, dispatch]);

  const handleLogoutAction = async () => {
    dispatch(signOut());
    navigate('/');
  };

  const getBadgeStyle = (status: string) => {
    const base = "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ";
    switch (status.toLowerCase()) {
      case 'pending': return base + 'bg-orange-50 text-orange-600 border border-orange-100';
      case 'confirmed': return base + 'bg-sky-50 text-sky-600 border border-sky-100';
      case 'shipped': return base + 'bg-indigo-50 text-indigo-600 border border-indigo-100';
      case 'delivered': return base + 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'cancelled': return base + 'bg-rose-50 text-rose-600 border border-rose-100';
      default: return base + 'bg-stone-50 text-stone-600 border border-stone-100';
    }
  };

  if (isFetchingOrders && orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-stone-200 border-t-stone-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-stone-200 pb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 mb-2 block">Personal Dashboard</span>
            <h1 className="text-4xl md:text-5xl font-serif font-black text-stone-900">
              Hey, {account?.full_name?.split(' ')[0] || 'Member'}
            </h1>
          </div>
          <button
            onClick={handleLogoutAction}
            className="flex items-center justify-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-full hover:bg-black transition-all text-sm font-bold uppercase tracking-wider shadow-lg shadow-stone-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* Sidebar Nav */}
          <aside className="w-full lg:w-64 space-y-2">
            <button
              onClick={() => setCurrentTab('profile')}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-xl transition-all ${currentTab === 'profile' ? 'bg-white shadow-sm ring-1 ring-stone-200 text-stone-900 font-bold' : 'text-stone-500 hover:text-stone-900'
                }`}
            >
              <span>Profile Info</span>
              <ChevronRight className={`w-4 h-4 transition-transform ${currentTab === 'profile' ? 'rotate-90' : ''}`} />
            </button>
            <button
              onClick={() => setCurrentTab('orders')}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-xl transition-all ${currentTab === 'orders' ? 'bg-white shadow-sm ring-1 ring-stone-200 text-stone-900 font-bold' : 'text-stone-500 hover:text-stone-900'
                }`}
            >
              <span>Order History</span>
              <ChevronRight className={`w-4 h-4 transition-transform ${currentTab === 'orders' ? 'rotate-90' : ''}`} />
            </button>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 bg-white p-8 lg:p-12 rounded-3xl shadow-sm border border-stone-100">
            {currentTab === 'profile' && account && (
              <div className="max-w-xl animate-in fade-in duration-500">
                <h2 className="text-2xl font-serif font-bold text-stone-900 mb-8">Your Information</h2>

                <div className="grid gap-6">
                  <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mb-2">Registered Email</label>
                    <div className="flex items-center gap-3 text-stone-900 font-medium">
                      <Mail className="w-4 h-4 text-stone-400" />
                      {account.email}
                    </div>
                  </div>

                  <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mb-2">Activity</label>
                    <div className="flex items-center gap-3 text-stone-900 font-bold text-xl">
                      <Package className="w-5 h-5 text-stone-400" />
                      {orders.length} Total Orders
                    </div>
                  </div>

                  {orders.length > 0 && (
                    <div className="p-6 bg-stone-50 rounded-2xl border border-stone-100">
                      <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block mb-4">Saved Shipping Contact</label>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-stone-900">
                          <MapPin className="w-4 h-4 text-stone-400" />
                          <div className="text-sm">
                            <p className="font-bold">{orders[0].shipping_name}</p>
                            <p className="text-stone-500">{orders[0].shipping_address}</p>
                            <p className="text-stone-500">{orders[0].shipping_city}, {orders[0].shipping_postal_code}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-stone-500 text-sm italic">
                          <Phone className="w-4 h-4 text-stone-400" />
                          {orders[0].shipping_phone}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentTab === 'orders' && (
              <div className="animate-in fade-in duration-500">
                <h2 className="text-2xl font-serif font-bold text-stone-900 mb-8">Previous Purchases</h2>

                {orders.length === 0 ? (
                  <div className="text-center py-20 border-2 border-dashed border-stone-100 rounded-3xl">
                    <Package className="w-16 h-16 text-stone-200 mx-auto mb-4" />
                    <p className="text-stone-400 font-medium mb-6">Your order history is currently empty.</p>
                    <button
                      onClick={() => navigate('/')}
                      className="text-stone-900 font-black text-xs uppercase underline tracking-widest hover:text-stone-500 transition-colors"
                    >
                      Browse Boutique
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {orders.map((order) => (
                      <div key={order.id} className="group border border-stone-100 rounded-2xl p-6 hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300">
                        <div className="flex flex-wrap justify-between items-start gap-4 mb-6 pb-6 border-b border-stone-50">
                          <div>
                            <span className="text-[10px] font-mono text-stone-400">REF: {order.id.slice(0, 8).toUpperCase()}</span>
                            <p className="text-sm font-bold text-stone-900">
                              Placed on {new Date(order.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                          <span className={getBadgeStyle(order.status)}>
                            {order.status}
                          </span>
                        </div>

                        <div className="space-y-4 mb-8">
                          {order.order_items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center bg-[#fafafa] p-3 rounded-xl border border-white group-hover:border-stone-100 transition-colors">
                              <div className="flex items-center gap-4">
                                <img
                                  src={item.product.image_url || 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=100&q=80'}
                                  alt={item.product.name}
                                  className="w-12 h-12 object-cover rounded-lg shadow-sm grayscale-[0.5] group-hover:grayscale-0 transition-all"
                                />
                                <div>
                                  <p className="text-sm font-bold text-stone-800">{item.product.name}</p>
                                  <p className="text-xs text-stone-400">Quantity: {item.quantity}</p>
                                </div>
                              </div>
                              <span className="text-sm font-serif font-black text-stone-900">
                                ${(item.price_at_purchase * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <div className="text-[10px] font-black uppercase text-stone-400 tracking-widest">Grand Total</div>
                          <div className="text-2xl font-serif font-black text-stone-900">${order.total_amount.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {showToast && <Toast message={toastMessage} type="success" onClose={() => setShowToast(false)} />}
    </div>
  );
}
