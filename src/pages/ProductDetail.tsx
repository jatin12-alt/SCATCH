import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts } from '../store/productsSlice';
import { addToCart } from '../store/cartSlice';
import { Leaf, Heart, Share2, ChevronRight, Minus, Plus } from 'lucide-react';
import Toast from '../components/Toast';
import LoginPromptModal from '../components/LoginPromptModal';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { productList, isProductsFetching } = useAppSelector((state) => state.products);
  const { account } = useAppSelector((state) => state.auth);

  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [isToastActive, setIsToastActive] = useState(false);
  const [activeToastContent, setActiveToastContent] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    // Only trigger fetch if the store is empty
    if (productList.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, productList.length]);

  const currentProduct = productList.find((p) => p.id === id);
  const relatedItems = currentProduct
    ? productList.filter((p) => p.category === currentProduct.category && p.id !== currentProduct.id).slice(0, 4)
    : [];

  const performAddToCart = async () => {
    // Safety check for auth
    if (!account) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!currentProduct) return;

    if (currentProduct.stock_count < purchaseQuantity) {
      setActiveToastContent('Oops! Not enough units in stock.');
      setIsToastActive(true);
      return;
    }

    try {
      await dispatch(addToCart({ userId: account.id, productId: currentProduct.id, quantity: purchaseQuantity }));
      setActiveToastContent(`Success! Added ${purchaseQuantity} to your collection.`);
      setIsToastActive(true);
      setPurchaseQuantity(1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  if (isProductsFetching && !currentProduct) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-stone-900"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Loading Masterpiece...</p>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <div className="text-center p-12 bg-white rounded-[2rem] shadow-sm">
          <h2 className="text-3xl font-serif font-black text-stone-900 mb-6">Item Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-stone-900 text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black transition-all"
          >
            Return to Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">

        {/* Navigation Breadcrumbs */}
        <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] mb-12 text-stone-400">
          <button onClick={() => navigate('/')} className="hover:text-stone-900 transition-colors">Catalog</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-stone-900">{currentProduct.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24">

          {/* Visual Display */}
          <section className="relative group">
            <div className="rounded-[2.5rem] overflow-hidden bg-white shadow-2xl shadow-stone-200/50 border border-stone-100 sticky top-10">
              <img
                src={currentProduct.image_url || 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80'}
                alt={currentProduct.name}
                className="w-full aspect-square object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute top-6 left-6 bg-stone-900/10 backdrop-blur-md text-stone-900 px-4 py-2 rounded-full border border-white/20 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                <Leaf className="w-3 h-3 text-green-600" />
                Ethically Crafted
              </div>
            </div>
          </section>

          {/* Product Details */}
          <section className="flex flex-col py-4">
            <div className="mb-10">
              <div className="flex items-start justify-between gap-6 mb-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-green-600 mb-3 block">
                    {currentProduct.category}
                  </span>
                  <h1 className="text-4xl md:text-5xl font-serif font-black text-stone-900 leading-none tracking-tighter">
                    {currentProduct.name}
                  </h1>
                </div>
                <button className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-all shadow-sm">
                  <Heart className="w-5 h-5 text-stone-400" />
                </button>
              </div>

              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-5xl font-serif font-black text-stone-900">${currentProduct.price}</span>
                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">USD</span>
              </div>

              <div className="inline-flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${currentProduct.stock_count > 0 ? 'bg-green-500' : 'bg-rose-500'}`}></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">
                  {currentProduct.stock_count > 0 ? `${currentProduct.stock_count} units available` : 'Sold out'}
                </span>
              </div>
            </div>

            <div className="space-y-12">
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-stone-400 mb-4">Composition</h3>
                <p className="text-stone-600 leading-relaxed font-medium">
                  {currentProduct.description || "A meticulously designed piece reflecting our commitment to sustainable luxury and timeless aesthetics."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-white rounded-3xl border border-stone-100 shadow-sm">
                  <span className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-1">Primary Material</span>
                  <span className="text-stone-900 font-bold">{currentProduct.material_type}</span>
                </div>
                <div className="p-6 bg-white rounded-3xl border border-stone-100 shadow-sm">
                  <span className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-1">Origin Status</span>
                  <span className="text-stone-900 font-bold">100% PETA Approved</span>
                </div>
              </div>

              {/* Purchase Actions */}
              <div className="pt-8 border-t border-stone-200">
                <div className="flex flex-col sm:flex-row items-stretch gap-4">
                  <div className="flex items-center justify-between bg-white border border-stone-200 rounded-2xl px-2 py-1 min-w-[140px]">
                    <button
                      onClick={() => setPurchaseQuantity(Math.max(1, purchaseQuantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-stone-400 hover:text-stone-900 transition-colors"
                      disabled={currentProduct.stock_count === 0}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-serif font-black text-xl text-stone-900">{purchaseQuantity}</span>
                    <button
                      onClick={() => setPurchaseQuantity(Math.min(currentProduct.stock_count, purchaseQuantity + 1))}
                      className="w-10 h-10 flex items-center justify-center text-stone-400 hover:text-stone-900 transition-colors"
                      disabled={currentProduct.stock_count === 0 || purchaseQuantity >= currentProduct.stock_count}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={performAddToCart}
                    disabled={currentProduct.stock_count === 0}
                    className="flex-1 bg-stone-900 text-white rounded-2xl hover:bg-black transition-all font-black text-xs uppercase tracking-[0.2em] py-5 shadow-xl shadow-stone-200 disabled:opacity-30 disabled:grayscale"
                  >
                    Invest in piece
                  </button>

                  <button className="w-16 h-16 flex items-center justify-center rounded-2xl border border-stone-200 hover:bg-stone-50 transition-all">
                    <Share2 className="w-5 h-5 text-stone-400" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Related Items Section */}
        {relatedItems.length > 0 && (
          <section className="pt-24 border-t border-stone-200">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl font-serif font-black text-stone-900">Similar Aesthetics</h2>
                <div className="h-1 w-12 bg-green-500 mt-2"></div>
              </div>
              <button
                onClick={() => navigate('/')}
                className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors"
              >
                View Full Collection
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(`/product/${item.id}`);
                    window.scrollTo(0, 0);
                  }}
                  className="group text-left"
                >
                  <div className="aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 shadow-sm border border-stone-100">
                    <img
                      src={item.image_url || 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80'}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale-[0.1] group-hover:grayscale-0"
                    />
                  </div>
                  <h3 className="font-serif font-bold text-stone-900 text-lg mb-1">{item.name}</h3>
                  <p className="text-stone-400 font-black text-[10px] uppercase tracking-widest">${item.price}</p>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>

      {isToastActive && <Toast message={activeToastContent} type="success" onClose={() => setIsToastActive(false)} />}

      <LoginPromptModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        message="Please authenticate to add items to your collection."
      />
    </div>
  );
}
