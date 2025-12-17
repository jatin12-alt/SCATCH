import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/client';
import SkeletonGrid from '../components/SkeletonGrid';
import { useOwnerAuth } from '../hooks/useOwnerAuth';

const fetchOwnerProducts = async () => {
  const { data } = await api.get('/owner/products');
  return data;
};

const OwnerDashboardPage = () => {
  useOwnerAuth();
  const navigate = useNavigate();

  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['owner-products'],
    queryFn: fetchOwnerProducts
  });

  const productList = useMemo(() => (Array.isArray(products) ? products : []), [products]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/owner/products/${id}`);
      toast.success('Product removed');
      refetch();
    } catch (error) {
      if (!error.response?.data?.message) {
        toast.error('Failed to delete product');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Owner</p>
          <h1 className="text-3xl font-semibold">Product Dashboard</h1>
          <p className="text-sm text-slate-400">Manage products visible in the shop.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/owner/create')}
            className="inline-flex items-center gap-2 rounded-full bg-accent text-background px-4 py-2 font-semibold shadow-glow hover:brightness-110 transition"
          >
            <Plus className="h-4 w-4" />
            New product
          </button>
        </div>
      </div>

      {isLoading ? (
        <SkeletonGrid />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productList.length === 0 ? (
            <div className="col-span-full text-center rounded-xl border border-surface bg-surface/50 p-6 text-slate-400">
              No products yet. Create one to get started.
            </div>
          ) : (
            productList.map((product) => (
              <div
                key={product._id}
                className="rounded-xl border border-surface bg-surface/60 p-4 space-y-3 shadow-card"
              >
                <div className="aspect-square rounded-lg overflow-hidden border border-surface/70 bg-background">
                  <img
                    src={product.images?.[0] || product.image || '/files/images/1bag.png'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-slate-400 line-clamp-2">{product.description}</p>
                  <p className="text-sm text-slate-300">
                    ${Number(product.price || 0).toFixed(2)}{' '}
                    {product.discount ? (
                      <span className="text-xs text-slate-500">(-{Number(product.discount)} off)</span>
                    ) : null}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => navigate(`/owner/edit/${product._id}`, { state: { product } })}
                    className="inline-flex items-center gap-1 rounded-full border border-surface px-3 py-1.5 text-sm hover:border-accent transition"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="inline-flex items-center gap-1 rounded-full border border-red-500/40 px-3 py-1.5 text-sm text-red-400 hover:border-red-400 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboardPage;
