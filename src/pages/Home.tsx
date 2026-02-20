import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts } from '../store/productsSlice';
import ProductCard from '../components/Products/ProductCard';
import ProductFilters from '../components/Products/ProductFilters';
import ProductSkeleton from '../components/ProductSkeleton';
import { Leaf } from 'lucide-react';

export default function Home() {
  const dispatch = useAppDispatch();

  // Destructuring with names that feel less generic
  const { productList, isProductsFetching, selectedCategory, selectedMaterial } =
    useAppSelector((state) => state.products);

  useEffect(() => {
    // only fetch if we don't have items to avoid double calls
    if (productList.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, productList.length]);

  // Handle filtering logic in a clean, readable way
  const visibleProducts = productList.filter((item) => {
    const categoryMatch = !selectedCategory || item.category === selectedCategory;
    const materialMatch = !selectedMaterial || item.material_type === selectedMaterial;
    return categoryMatch && materialMatch;
  });

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Banner Section */}
      <section className="bg-gradient-to-r from-green-800 to-green-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Leaf className="w-12 h-12 text-green-400" />
            <h1 className="text-4xl md:text-6xl font-serif font-black tracking-tight">SCATCH</h1>
          </div>
          <p className="text-xl text-green-100/90 max-w-2xl mx-auto leading-relaxed">
            Crafting the future of luxury with sustainable, vegan materials.
            Compassion is our core ingredient.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar for filtering styles */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <ProductFilters />
          </aside>

          {/* Main Product Feed */}
          <main className="flex-1">
            <div className="mb-10 flex items-baseline justify-between border-b border-stone-200 pb-4">
              <h2 className="text-2xl font-serif font-bold text-stone-800">
                {selectedCategory || selectedMaterial ? 'Filtered Results' : 'The Collection'}
              </h2>
              <span className="text-sm font-medium text-stone-500">
                {visibleProducts.length} items shown
              </span>
            </div>

            {isProductsFetching ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => <ProductSkeleton key={`skel-${i}`} />)}
              </div>
            ) : visibleProducts.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-lg border border-dashed border-stone-300">
                <p className="text-stone-400 font-medium">No matches found for those specific filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visibleProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
