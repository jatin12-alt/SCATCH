import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { addItem, hideFlyout } from '../store/slices/cartSlice';

const fallbackRecommendations = [
  {
    _id: 'rec-1',
    name: 'Slim Tech Pouch',
    price: 59,
    description: 'Organize chargers and cables in a compact shell.',
    category: 'Accessory',
    material: 'Nylon',
    color: 'Black',
    images: ['/files/images/4bag.png']
  },
  {
    _id: 'rec-2',
    name: 'Travel Dopp Kit',
    price: 72,
    description: 'Water-resistant toiletry kit with wide opening.',
    category: 'Accessory',
    material: 'Canvas',
    color: 'Navy',
    images: ['/files/images/5bag.png']
  },
  {
    _id: 'rec-3',
    name: 'Mini Crossbody',
    price: 98,
    description: 'Hands-free essentials with magnetic flap.',
    category: 'Crossbody',
    material: 'Leather',
    color: 'Brown',
    images: ['/files/images/6bag.png']
  }
];

const fetchRecommendations = async (id) => {
  if (!id) return fallbackRecommendations;
  try {
    const { data } = await api.get(`/products/recommendations/${id}`);
    if (Array.isArray(data) && data.length) return data;
    return fallbackRecommendations;
  } catch {
    return fallbackRecommendations;
  }
};

const MiniCartFlyout = () => {
  const dispatch = useDispatch();
  const { items, showFlyout, lastAddedId } = useSelector((state) => state.cart);

  const lastAddedItem = items.find((i) => i._id === lastAddedId) || items[items.length - 1];
  const subtotal = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const { data: recommendations = [] } = useQuery({
    queryKey: ['recommendations', lastAddedId],
    queryFn: () => fetchRecommendations(lastAddedId),
    enabled: showFlyout
  });

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === 'Escape') dispatch(hideFlyout());
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [dispatch]);

  if (!showFlyout) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={() => dispatch(hideFlyout())} />
      <aside className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-surface border-l border-accent/40 shadow-glow shadow-card flex flex-col">
        <header className="flex items-center justify-between px-5 py-4 border-b border-surface">
          <div>
            <p className="text-sm font-semibold">Added to bag</p>
            <p className="text-xs text-slate-400">Your item has been added</p>
          </div>
          <button
            onClick={() => dispatch(hideFlyout())}
            className="p-2 rounded-full hover:bg-background text-slate-300"
            aria-label="Close mini cart"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {lastAddedItem ? (
            <div className="rounded-xl border border-surface bg-background p-4 flex gap-3">
              <div className="h-16 w-16 rounded-lg overflow-hidden bg-surface">
                <img
                  src={lastAddedItem.images?.[0] || lastAddedItem.image}
                  alt={lastAddedItem.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase text-slate-400">{lastAddedItem.category}</p>
                <p className="text-sm font-semibold">{lastAddedItem.name}</p>
                <p className="text-xs text-slate-400">
                  Qty: {lastAddedItem.quantity} · ${lastAddedItem.price?.toFixed(2)}
                </p>
              </div>
            </div>
          ) : null}

          <div className="rounded-xl border border-surface bg-background p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">Subtotal</span>
              <span className="text-lg font-semibold text-accent">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex gap-3">
              <Link
                to="/cart"
                onClick={() => dispatch(hideFlyout())}
                className="flex-1 text-center rounded-full border border-accent/60 text-accent px-4 py-2.5 font-semibold hover:bg-accent/10 transition"
              >
                View Cart
              </Link>
              <Link
                to="/checkout"
                onClick={() => dispatch(hideFlyout())}
                className="flex-1 text-center rounded-full bg-accent text-background px-4 py-2.5 font-semibold shadow-glow hover:brightness-110 transition"
              >
                Checkout Now
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Complete your look</p>
              <span className="text-xs text-slate-400">Recommended</span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {recommendations.map((rec) => (
                <button
                  key={rec._id}
                  onClick={() => dispatch(addItem({ ...rec, quantity: 1 }))}
                  className="flex items-center gap-3 rounded-lg border border-surface bg-background p-3 text-left hover:border-accent transition"
                >
                  <div className="h-14 w-14 rounded-lg overflow-hidden bg-surface">
                    <img src={rec.images?.[0] || rec.image} alt={rec.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{rec.name}</p>
                    <p className="text-xs text-slate-400">${rec.price?.toFixed(2)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default MiniCartFlyout;

