import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/client';
import { useOwnerAuth } from '../hooks/useOwnerAuth';

const defaultProduct = {
  name: '',
  price: '',
  discount: 0,
  bgcolor: '#eab308',
};

const OwnerCreateProductPage = () => {
  const { authorized, checking } = useOwnerAuth();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const editingId = params.id;
  const [form, setForm] = useState(defaultProduct);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!authorized || !editingId) return;

    const productFromState = location.state?.product;
    if (productFromState) {
      setForm({
        name: productFromState.name || '',
        price: productFromState.price ?? '',
        discount: productFromState.discount ?? 0,
        bgcolor: productFromState.bgcolor || defaultProduct.bgcolor,
      });
      if (productFromState.image) {
        setPreviewUrl(productFromState.image);
      }
      return;
    }

    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${editingId}`);
        setForm({
          name: data.name || '',
          price: data.price ?? '',
          discount: data.discount ?? 0,
          bgcolor: data.bgcolor || defaultProduct.bgcolor,
        });
        if (data.image) {
          setPreviewUrl(data.image);
        }
      } catch (err) {
        toast.error('Failed to load product');
      }
    };

    fetchProduct();
  }, [authorized, editingId, location.state]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      toast.error('Name and price are required');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', form.price);
      formData.append('discount', form.discount);
      formData.append('bgcolor', form.bgcolor);

      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (editingId) {
        await api.put(`/owner/products/${editingId}`, formData, config);
        toast.success('Product updated');
      } else {
        await api.post('/owner/products', formData, config);
        toast.success('Product created');
      }
      navigate('/owner/dashboard');
    } catch (err) {
      toast.error('Save failed');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return <div className="min-h-[40vh] flex items-center justify-center text-slate-400">Checking owner access...</div>;
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-400">Owner</p>
        <h1 className="text-3xl font-semibold">{editingId ? 'Edit Product' : 'Create Product'}</h1>
        <p className="text-sm text-slate-400">
          Provide basic product details. Required: image, name, price, colors.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-surface bg-surface/60 p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            className="input-dark"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="input-dark"
            placeholder="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            className="input-dark"
            placeholder="Discount"
            type="number"
            value={form.discount}
            onChange={(e) => setForm({ ...form, discount: e.target.value })}
          />
          <div>
            <label className="text-xs text-slate-400">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="input-dark mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400">Background color (top section)</label>
            <input
              className="input-dark mt-1"
              value={form.bgcolor}
              onChange={(e) => setForm({ ...form, bgcolor: e.target.value })}
              placeholder="#eab308"
            />
          </div>
        </div>

        <div className="rounded-lg border border-surface bg-background/50 p-4 flex items-center gap-4">
          <div
            className="aspect-square h-24 w-24 flex items-center justify-center"
            style={{ backgroundColor: form.bgcolor }}
          >
            {previewUrl ? (
              <img src={previewUrl} alt={form.name || 'preview'} className="h-5/6 w-5/6 object-contain" />
            ) : (
              <div className="text-sm text-slate-900">No image</div>
            )}
          </div>
          <div className="text-sm text-slate-400">
            Preview shows Yellow/Red split to match the storefront ProductCard. Upload an image to see it here.
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/owner/dashboard')}
            className="rounded-full border border-surface px-4 py-2 text-sm hover:border-accent transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-accent text-background px-4 py-2 font-semibold shadow-glow hover:brightness-110 transition disabled:opacity-60"
          >
            {loading ? 'Saving...' : editingId ? 'Update product' : 'Create product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OwnerCreateProductPage;
