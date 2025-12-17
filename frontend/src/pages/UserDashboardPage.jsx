import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { User, ShoppingBag, Settings, LogOut, Package, CreditCard, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client';
import { logout } from '../store/slices/authSlice';
import { useUserAuth } from '../hooks/useUserAuth';
import SkeletonGrid from '../components/SkeletonGrid';

const fetchDashboardData = async () => {
  const { data } = await api.get('/users/dashboard');
  return data;
};

const UserDashboardPage = () => {
  useUserAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState('overview');

  const { data: dashboardData, isLoading, refetch } = useQuery({
    queryKey: ['user-dashboard'],
    queryFn: fetchDashboardData
  });

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const orderStats = useMemo(() => {
    if (!dashboardData?.orders) return { total: 0, pending: 0, completed: 0 };

    const orders = dashboardData.orders;
    return {
      total: orders.length,
      pending: orders.filter(order => ['pending', 'processing'].includes(order.orderStatus)).length,
      completed: orders.filter(order => order.orderStatus === 'delivered').length
    };
  }, [dashboardData?.orders]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Dashboard</p>
            <h1 className="text-3xl font-semibold">Loading...</h1>
          </div>
        </div>
        <SkeletonGrid />
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'profile', label: 'Profile', icon: Settings }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Dashboard</p>
          <h1 className="text-3xl font-semibold">Welcome back, {dashboardData?.user?.fullName || user?.fullName}!</h1>
          <p className="text-sm text-slate-400">Manage your account and view your orders</p>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-full border border-red-500/40 px-4 py-2 text-sm text-red-400 hover:border-red-400 hover:bg-red-500/10 transition"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-surface">
        <div className="flex gap-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? 'border-b-2 border-accent text-accent'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-surface bg-surface/60 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-blue-500/20 p-2">
                    <Package className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">{orderStats.total}</p>
                    <p className="text-sm text-slate-400">Total Orders</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-surface bg-surface/60 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-yellow-500/20 p-2">
                    <ShoppingBag className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">{orderStats.pending}</p>
                    <p className="text-sm text-slate-400">Pending Orders</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-surface bg-surface/60 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-500/20 p-2">
                    <CreditCard className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold">{orderStats.completed}</p>
                    <p className="text-sm text-slate-400">Completed Orders</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="rounded-xl border border-surface bg-surface/60 p-5">
              <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
              {dashboardData?.orders?.slice(0, 3).length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.orders.slice(0, 3).map((order) => (
                    <div key={order._id} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium">#{order._id.slice(-8)}</p>
                        <p className="text-slate-400 capitalize">{order.orderStatus}</p>
                      </div>
                      <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">No orders yet</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Order History</h2>
            {dashboardData?.orders?.length > 0 ? (
              <div className="grid gap-4">
                {dashboardData.orders.map((order) => (
                  <div key={order._id} className="rounded-xl border border-surface bg-surface/60 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <p className="font-semibold">Order #{order._id.slice(-8)}</p>
                          <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                            order.orderStatus === 'delivered' ? 'bg-green-500/20 text-green-400' :
                            order.orderStatus === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {order.orderStatus}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          <span>{order.items.length} items</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">${order.totalAmount.toFixed(2)}</p>
                        <p className="text-sm text-slate-400">Total</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg overflow-hidden bg-background">
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.name}</p>
                            <p className="text-xs text-slate-400">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address */}
                    <div className="mt-4 pt-4 border-t border-surface">
                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                        <div className="text-slate-400">
                          <p className="font-medium text-slate-300">{order.shippingAddress.fullName}</p>
                          <p>{order.shippingAddress.address}</p>
                          <p>{order.shippingAddress.city}, {order.shippingAddress.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-surface bg-surface/60 p-8 text-center">
                <ShoppingBag className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                <p className="text-slate-400 mb-4">Start shopping to see your orders here</p>
                <Link
                  to="/shop"
                  className="inline-block rounded-full bg-accent text-background px-6 py-3 font-semibold shadow-glow hover:brightness-110 transition"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Information */}
            <div className="rounded-xl border border-surface bg-surface/60 p-5 space-y-4">
              <h3 className="text-lg font-semibold">Profile Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                  <p className="text-slate-300">{dashboardData?.user?.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                  <p className="text-slate-300">{dashboardData?.user?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Phone</label>
                  <p className="text-slate-300">{dashboardData?.user?.contact || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Account Status</label>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      dashboardData?.user?.isVerified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {dashboardData?.user?.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Member Since</label>
                  <p className="text-slate-300">
                    {dashboardData?.user?.createdAt ? new Date(dashboardData.user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl border border-surface bg-surface/60 p-5 space-y-4">
              <h3 className="text-lg font-semibold">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/profile"
                  className="block w-full text-left rounded-lg border border-surface p-3 hover:border-accent transition"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="font-medium">Edit Profile</p>
                      <p className="text-sm text-slate-400">Update your personal information</p>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/cart"
                  className="block w-full text-left rounded-lg border border-surface p-3 hover:border-accent transition"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="font-medium">View Cart</p>
                      <p className="text-sm text-slate-400">Check your shopping cart</p>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/settings"
                  className="block w-full text-left rounded-lg border border-surface p-3 hover:border-accent transition"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="font-medium">Settings</p>
                      <p className="text-sm text-slate-400">App preferences and settings</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboardPage;