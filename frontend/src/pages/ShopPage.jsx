import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import SkeletonGrid from '../components/SkeletonGrid';

const fallbackProducts = [
  {
    _id: 'demo-1',
    name: 'Apex Leather Tote',
    price: 189,
    discount: 30,
    description: 'Structured silhouette in Italian pebble leather with padded handle.',
    category: 'Tote',
    material: 'Leather',
    color: 'Black',
    dimensions: { w: 38, h: 30, d: 14 },
    images: ['/files/images/1bag.png'],
    countInStock: 8,
    rating: 4.7
  },
  {
    _id: 'demo-2',
    name: 'Drift Nylon Backpack',
    price: 129,
    discount: 20,
    description: 'Featherweight ripstop nylon with waterproof zips and padded laptop sleeve.',
    category: 'Backpack',
    material: 'Nylon',
    color: 'Navy',
    dimensions: { w: 30, h: 45, d: 16 },
    images: ['/files/images/2bag.png'],
    countInStock: 15,
    rating: 4.5
  },
  {
    _id: 'demo-3',
    name: 'Metro Canvas Messenger',
    price: 149,
    discount: 0,
    description: 'Waxed canvas body with full-grain leather trims and magnetic flap.',
    category: 'Messenger',
    material: 'Canvas',
    color: 'Olive',
    dimensions: { w: 36, h: 28, d: 12 },
    images: ['/files/images/3bag 1.png'],
    countInStock: 5,
    rating: 4.2
  }
];

const fetchProducts = async (filters) => {
  try {
    const { data } = await api.get('/products', {
      params: {
        category: filters.category || undefined,
        material: filters.material || undefined,
        color: filters.color || undefined,
        search: filters.search || undefined
      }
    });
    return data;
  } catch (error) {
    // fall back to demo data if API not yet implemented
    return fallbackProducts;
  }
};

const ShopPage = () => {
  const [filters, setFilters] = useState({ category: '', material: '', color: '', search: '' });

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters)
  });

  const productList = useMemo(() => {
    if (Array.isArray(products)) return products;
    if (products && Array.isArray(products.data)) return products.data;
    if (products && Array.isArray(products.items)) return products.items;
    return [];
  }, [products]);

  const filtered = useMemo(() => {
    if (!productList) return [];
    return productList.filter((product) => {
      const matchesSearch =
        !filters.search ||
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = !filters.category || product.category === filters.category;
      const matchesMaterial = !filters.material || product.material === filters.material;
      const matchesColor = !filters.color || product.color === filters.color;
      return matchesSearch && matchesCategory && matchesMaterial && matchesColor;
    });
  }, [products, filters]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Collection</p>
          <h1 className="text-3xl font-semibold">Premium Bags</h1>
          <p className="text-slate-400 mt-1">Refined silhouettes with a futuristic dark interface.</p>
        </div>
        <div className="flex items-center gap-3">
          <FilterSidebar filters={filters} onFilterChange={setFilters} />
          <div className="flex items-center gap-2 rounded-full border border-surface bg-surface px-3 py-2 w-full md:w-80">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search for bags..."
              className="bg-transparent w-full text-sm outline-none placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <SkeletonGrid />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center text-slate-400 border border-surface rounded-xl p-6 bg-surface/50">
              No products found. Adjust filters or check API response format.
            </div>
          ) : (
            filtered.map((product) => <ProductCard key={product._id} product={product} />)
          )}
        </div>
      )}
    </div>
  );
};

export default ShopPage;

