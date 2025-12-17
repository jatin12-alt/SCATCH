import { useDispatch } from 'react-redux';
import { addItem } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAdd = () => {
    dispatch(addItem({ ...product, quantity: 1 }));
    toast.success('Added to cart');
  };

  const image = product?.image || product?.images?.[0];

  return (
    <div className="group relative flex flex-col w-full border-2 border-transparent bg-surface/40 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(34,211,238,0.8)] transition-all duration-300 ease-in-out cursor-pointer">
      <div
        className="aspect-square flex items-center justify-center"
        style={{ backgroundColor: product?.bgcolor || '#eab308' }}
      >
        {image ? (
          <img src={image} alt={product?.name || 'Product'} className="w-4/5 h-4/5 object-contain" />
        ) : (
          <div className="text-sm text-slate-900">No image</div>
        )}
      </div>

      <div className="bg-red-500 p-4 flex justify-between items-center text-slate-900">
        <div>
          <h3 className="font-bold text-lg leading-tight">{product?.name || 'Unnamed product'}</h3>
          <p className="font-medium">₹ {product?.price != null ? product.price : '—'}</p>
        </div>
        <button
          onClick={handleAdd}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          aria-label="Add to cart"
        >
          <span className="text-2xl font-bold text-black">+</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

