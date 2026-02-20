import { Leaf, Plus } from 'lucide-react';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addToCart } from '../../store/cartSlice';
import Toast from '../Toast';
import LoginPromptModal from '../LoginPromptModal';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  material_type: string;
  stock_count: number;
  image_url: string | null;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // naming update: user -> account
  const { account } = useAppSelector((state) => state.auth);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!account) {
      setShowLoginModal(true);
      return;
    }

    if (product.stock_count === 0) {
      setToastMessage('Sorry, this item is out of stock');
      setShowToast(true);
      return;
    }

    await dispatch(addToCart({ userId: account.id, productId: product.id }));
    setToastMessage('Added to cart');
    setShowToast(true);
  };

  const handleProductClick = () => {
    if (!account) {
      setShowLoginModal(true);
      return;
    }
    navigate(`/product/${product.id}`);
  };

  return (
    <>
      <div
        onClick={handleProductClick}
        className="group relative bg-white rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-stone-200/50 cursor-pointer border border-stone-100"
      >
        {/* Visual Composition */}
        <div className="relative overflow-hidden aspect-[4/5]">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
          />

          {/* Status Indicators */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <div className="bg-white/90 backdrop-blur-md text-stone-900 px-3 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-sm">
              <Leaf className="w-3 h-3 text-green-600" />
              Mindful
            </div>
          </div>

          {product.stock_count === 0 && (
            <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-white text-stone-950 px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl">
                Depleted
              </span>
            </div>
          )}

          {/* Quick Action Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
            <button
              onClick={handleAddToCart}
              disabled={product.stock_count === 0}
              className="w-full bg-white text-stone-900 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 disabled:opacity-50 shadow-xl"
            >
              <Plus className="w-3 h-3" />
              Procure Item
            </button>
          </div>
        </div>

        {/* Descriptor Area */}
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-1">{product.material_type}</p>
              <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-green-800 transition-colors leading-tight">
                {product.name}
              </h3>
            </div>
            <span className="text-xl font-black text-stone-900 font-serif tracking-tighter">
              ${product.price}
            </span>
          </div>
        </div>
      </div>

      {showToast && <Toast message={toastMessage} type="success" onClose={() => setShowToast(false)} />}
      <LoginPromptModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message="Authenticating provides access to the full boutique experience."
      />
    </>
  );
}
