import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const fetchProduct = async (id) => {
  try {
    const { data } = await api.get(`/products/${id}`);
    return data;
  } catch {
    return {
      _id: id,
      name: 'Apex Leather Tote',
      price: 189,
      discount: 30,
      description:
        'Structured silhouette in Italian pebble leather with padded handle and microfiber interior. Fits 16” laptops with ease.',
      category: 'Tote',
      material: 'Leather',
      color: 'Black',
      dimensions: { w: 38, h: 30, d: 14 },
      images: ['/files/images/1bag.png', '/files/images/2bag.png'],
      countInStock: 8,
      rating: 4.7
    };
  }
};

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id)
  });

  if (isLoading || !product) {
    return <div className="animate-pulse h-96 rounded-xl bg-surface" />;
  }

  const addToCart = () => {
    dispatch(addItem({ ...product, quantity: 1 }));
    toast.success('Added to cart');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="space-y-4">
        <div className="rounded-2xl overflow-hidden border border-surface bg-background shadow-card">
          <img
            src={product.images?.[0] || product.image}
            alt={product.name}
            className="w-full h-[420px] object-cover transition hover:scale-[1.02]"
          />
        </div>
        <div className="grid grid-cols-4 gap-3">
          {(product.images || []).map((img, idx) => (
            <div key={idx} className="rounded-lg overflow-hidden border border-surface bg-surface">
              <img src={img} alt={`${product.name} ${idx}`} className="h-20 w-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-400">{product.category}</p>
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          <p className="text-slate-400">{product.description}</p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-3xl font-semibold text-accent">${product.price?.toFixed(2)}</span>
          {product.discount ? (
            <span className="text-slate-500 line-through">${(product.price + product.discount).toFixed(2)}</span>
          ) : null}
          <span className="text-sm text-slate-400">Stock: {product.countInStock ?? '—'}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 rounded-xl border border-surface bg-surface/50 p-4">
          <div>
            <p className="text-xs uppercase text-slate-400">Material</p>
            <p className="text-sm">{product.material}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-400">Color</p>
            <p className="text-sm">{product.color}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-400">Dimensions</p>
            <p className="text-sm">
              {product.dimensions
                ? `${product.dimensions.w}W × ${product.dimensions.h}H × ${product.dimensions.d}D cm`
                : '—'}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-400">Rating</p>
            <p className="text-sm">{product.rating ? `${product.rating} / 5` : 'No reviews yet'}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex gap-2">
            <button
              onClick={addToCart}
              className="flex-1 rounded-full bg-accent text-background py-3 font-semibold shadow-glow hover:brightness-110 transition"
            >
              Add to Cart
            </button>
            <button className="flex-1 rounded-full border border-surface py-3 font-semibold hover:border-accent transition">
              Save
            </button>
          </div>
          <div className="flex gap-4 text-sm text-slate-400">
            <span>Free shipping</span>
            <span>30-day returns</span>
            <span>Secured checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;

