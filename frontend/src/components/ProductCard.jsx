import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import clsx from 'clsx';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAdd = () => {
    dispatch(addItem({ ...product, quantity: 1 }));
    toast.success('Added to cart');
  };

  return (
    <div className="group relative rounded-xl bg-surface border border-surface/60 shadow-card overflow-hidden">
      <div className="aspect-[4/5] overflow-hidden bg-background">
        <img
          src={product?.images?.[0] || product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide">{product.category}</p>
            <h3 className="text-lg font-semibold leading-tight">{product.name}</h3>
          </div>
          <span className="rounded-full px-3 py-1 text-xs bg-background text-slate-300">
            {product.material || '—'}
          </span>
        </div>
        <p className="text-sm text-slate-400 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-semibold text-accent">${product.price?.toFixed(2)}</span>
            {product.discount ? (
              <span className="text-xs text-slate-500 line-through">
                ${(product.price + product.discount).toFixed(2)}
              </span>
            ) : null}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className={clsx(
                'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition',
                'bg-accent text-background shadow-glow hover:brightness-110'
              )}
            >
              <ShoppingCart className="h-4 w-4" />
              Add
            </button>
            <Link
              to={`/product/${product._id}`}
              className="inline-flex items-center rounded-full px-4 py-2 text-sm font-medium border border-surface hover:border-accent transition"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

