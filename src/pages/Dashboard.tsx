import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Package, LayoutGrid, ListOrdered, Clock, Truck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../store/productsSlice';
import { fetchOrders, updateOrderStatus } from '../store/ordersSlice';
import Toast from '../components/Toast';

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Tote' | 'Backpack' | 'Clutches';
  material_type: string;
  stock_count: number;
  image_url: string | null;
  is_vegan: boolean;
}

export default function Dashboard() {
  const dispatch = useAppDispatch();

  // naming updates: items -> productList, items -> orderList
  const { productList } = useAppSelector((state) => state.products);
  const { orderList: orders } = useAppSelector((state) => state.orders);

  const [activeView, setActiveView] = useState<'inventory' | 'sales'>('inventory');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [targetProduct, setTargetProduct] = useState<ProductData | null>(null);

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Tote' as 'Tote' | 'Backpack' | 'Clutches',
    material_type: '',
    stock_count: '',
    image_url: '',
  });

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchOrders());
  }, [dispatch]);

  const clearForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: 'Tote',
      material_type: '',
      stock_count: '',
      image_url: '',
    });
    setTargetProduct(null);
    setIsEditorOpen(false);
  };

  const initiateProductEdit = (product: ProductData) => {
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      material_type: product.material_type,
      stock_count: product.stock_count.toString(),
      image_url: product.image_url || '',
    });
    setTargetProduct(product);
    setIsEditorOpen(true);
  };

  const saveProductAction = async (e: React.FormEvent) => {
    e.preventDefault();

    const submissionData = {
      name: productForm.name,
      description: productForm.description,
      price: parseFloat(productForm.price),
      category: productForm.category,
      material_type: productForm.material_type,
      stock_count: parseInt(productForm.stock_count),
      image_url: productForm.image_url || null,
      is_vegan: true,
    };

    try {
      if (targetProduct) {
        await dispatch(updateProduct({ id: targetProduct.id, updates: submissionData }));
        setNotification({ message: 'Masterpiece updated successfully.', type: 'success' });
      } else {
        await dispatch(addProduct(submissionData));
        setNotification({ message: 'New piece added to gallery.', type: 'success' });
      }
      clearForm();
    } catch {
      setNotification({ message: 'System error during save process.', type: 'error' });
    }
  };

  const removeProductAction = async (id: string) => {
    if (confirm('Are you sure you want to remove this piece from the registry?')) {
      try {
        await dispatch(deleteProduct(id));
        setNotification({ message: 'Registry updated: Item removed.', type: 'success' });
      } catch {
        setNotification({ message: 'Removal failed.', type: 'error' });
      }
    }
  };

  const modifyOrderStatus = async (orderId: string, status: string) => {
    await dispatch(updateOrderStatus({ orderId, status: status as any }));
    setNotification({ message: 'Fulfillment status updated.', type: 'success' });
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-serif font-black text-stone-900 tracking-tighter italic">Studio Console</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mt-2">Administrative Registry Control</p>
          </div>

          <div className="flex bg-white p-1 rounded-2xl border border-stone-100 shadow-sm">
            <button
              onClick={() => setActiveView('inventory')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeView === 'inventory' ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-400 hover:text-stone-900'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Gallery
            </button>
            <button
              onClick={() => setActiveView('sales')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeView === 'sales' ? 'bg-stone-900 text-white shadow-lg' : 'text-stone-400 hover:text-stone-900'}`}
            >
              <ListOrdered className="w-3.5 h-3.5" />
              Logistics
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-100 overflow-hidden">
          <div className="p-10">
            {activeView === 'inventory' && (
              <div className="animate-in fade-in duration-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                  <h2 className="text-2xl font-serif font-black text-stone-900">Inventory Management</h2>
                  <button
                    onClick={() => setIsEditorOpen(true)}
                    className="bg-stone-900 text-white px-8 py-3 rounded-full hover:bg-black transition-all text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-stone-200"
                  >
                    <Plus className="w-4 h-4" />
                    Archive New Piece
                  </button>
                </div>

                {isEditorOpen && (
                  <div className="bg-stone-50/50 rounded-3xl p-10 mb-12 border border-stone-100 animate-in slide-in-from-top-4 duration-500">
                    <h3 className="text-lg font-serif font-black text-stone-900 mb-8">
                      {targetProduct ? 'Modify Archive Entry' : 'Manual Registry Entry'}
                    </h3>
                    <form onSubmit={saveProductAction} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">Piece Identity</label>
                        <input
                          type="text"
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                          required
                          className="w-full bg-white px-6 py-4 rounded-2xl border border-stone-100 focus:border-stone-900 outline-none transition-all"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">Composition Summary</label>
                        <textarea
                          value={productForm.description}
                          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                          required
                          rows={3}
                          className="w-full bg-white px-6 py-4 rounded-2xl border border-stone-100 focus:border-stone-900 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">Appraisal Value ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          required
                          className="w-full bg-white px-6 py-4 rounded-2xl border border-stone-100 focus:border-stone-900 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">Units Allocated</label>
                        <input
                          type="number"
                          value={productForm.stock_count}
                          onChange={(e) => setProductForm({ ...productForm, stock_count: e.target.value })}
                          required
                          className="w-full bg-white px-6 py-4 rounded-2xl border border-stone-100 focus:border-stone-900 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">Archival Class</label>
                        <select
                          value={productForm.category}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                          className="w-full bg-white px-6 py-4 rounded-2xl border border-stone-100 focus:border-stone-900 outline-none transition-all"
                        >
                          <option value="Tote">Tote Selection</option>
                          <option value="Backpack">Backpack Library</option>
                          <option value="Clutches">Evening Clutches</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">Primary Material</label>
                        <input
                          type="text"
                          value={productForm.material_type}
                          onChange={(e) => setProductForm({ ...productForm, material_type: e.target.value })}
                          required
                          className="w-full bg-white px-6 py-4 rounded-2xl border border-stone-100 focus:border-stone-900 outline-none transition-all"
                          placeholder="Grape Leather / Apple Fiber"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 ml-1">Visual Asset URL</label>
                        <input
                          type="url"
                          value={productForm.image_url}
                          onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                          className="w-full bg-white px-6 py-4 rounded-2xl border border-stone-100 focus:border-stone-900 outline-none transition-all"
                        />
                      </div>

                      <div className="md:col-span-2 flex gap-4 pt-4">
                        <button
                          type="submit"
                          className="flex-1 bg-stone-900 text-white py-4 rounded-2xl hover:bg-black transition-all font-black text-xs uppercase tracking-widest shadow-xl shadow-stone-200"
                        >
                          Confirm Entry
                        </button>
                        <button
                          type="button"
                          onClick={clearForm}
                          className="px-8 py-4 border border-stone-200 rounded-2xl hover:bg-stone-50 transition-all font-black text-xs uppercase text-stone-400"
                        >
                          Discard
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="border-b border-stone-100">
                        <th className="text-left pb-4 font-black text-[10px] uppercase tracking-[0.2em] text-stone-400">Archived Piece</th>
                        <th className="text-left pb-4 font-black text-[10px] uppercase tracking-[0.2em] text-stone-400">Classification</th>
                        <th className="text-left pb-4 font-black text-[10px] uppercase tracking-[0.2em] text-stone-400">Value</th>
                        <th className="text-left pb-4 font-black text-[10px] uppercase tracking-[0.2em] text-stone-400">Availability</th>
                        <th className="text-right pb-4 font-black text-[10px] uppercase tracking-[0.2em] text-stone-400">Control</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-50">
                      {productList.map((product) => (
                        <tr key={product.id} className="group hover:bg-stone-50/50 transition-all">
                          <td className="py-6">
                            <div className="flex items-center gap-4">
                              <img
                                src={product.image_url || 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=100&q=80'}
                                alt={product.name}
                                className="w-14 h-14 object-cover rounded-xl shadow-sm grayscale-[0.3] group-hover:grayscale-0 transition-grayscale duration-500"
                              />
                              <div>
                                <p className="font-bold text-stone-900 leading-tight">{product.name}</p>
                                <p className="text-[10px] text-stone-400 font-medium italic mt-1">{product.material_type}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-6">
                            <span className="text-xs font-medium text-stone-600 bg-stone-100/50 px-3 py-1 rounded-lg">
                              {product.category}
                            </span>
                          </td>
                          <td className="py-6">
                            <span className="font-serif font-black text-stone-900">${product.price}</span>
                          </td>
                          <td className="py-6">
                            <div className="flex flex-col">
                              <span className={`text-[10px] font-black uppercase ${product.stock_count > 0 ? 'text-green-600' : 'text-rose-600'}`}>
                                {product.stock_count > 0 ? 'In Library' : 'Reserving...'}
                              </span>
                              <span className="text-[10px] font-medium text-stone-400">{product.stock_count} units</span>
                            </div>
                          </td>
                          <td className="py-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => initiateProductEdit(product)}
                                className="w-10 h-10 rounded-xl border border-stone-100 flex items-center justify-center hover:bg-white hover:border-stone-900 transition-all shadow-sm"
                              >
                                <Edit2 className="w-4 h-4 text-stone-400" />
                              </button>
                              <button
                                onClick={() => removeProductAction(product.id)}
                                className="w-10 h-10 rounded-xl border border-stone-100 flex items-center justify-center hover:bg-rose-50 hover:border-rose-100 group/del transition-all"
                              >
                                <Trash2 className="w-4 h-4 text-stone-400 group-hover/del:text-rose-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeView === 'sales' && (
              <div className="animate-in fade-in duration-700">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-2xl font-serif font-black text-stone-900">Logistic Manifest</h2>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400">
                    <Clock className="w-3 h-3" />
                    Real-time Sync
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {orders.map((order) => (
                    <div key={order.id} className="group border border-stone-100 rounded-[2rem] p-8 hover:shadow-2xl hover:shadow-stone-200 transition-all duration-500 bg-[#fafafa]/50">
                      <div className="flex justify-between items-start mb-8 pb-8 border-b border-stone-100">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-2">Order Identification</p>
                          <p className="font-mono text-xs font-bold text-stone-900 bg-white px-3 py-1.5 rounded-lg border border-stone-100">
                            #{order.id.slice(0, 12).toUpperCase()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1">Status Control</p>
                          <select
                            value={order.status}
                            onChange={(e) => modifyOrderStatus(order.id, e.target.value)}
                            className="text-xs font-black uppercase tracking-widest bg-stone-900 text-white px-4 py-2 rounded-xl outline-none border-0 ring-0 shadow-lg shadow-stone-200"
                          >
                            <option value="pending">Initiated</option>
                            <option value="confirmed">Validated</option>
                            <option value="shipped">In Transit</option>
                            <option value="delivered">Fulfilled</option>
                            <option value="cancelled">Revoked</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-3">Recipient</p>
                          <div className="space-y-1 text-sm">
                            <p className="font-black text-stone-900">{order.shipping_name}</p>
                            <p className="text-stone-500 leading-snug">{order.shipping_address}</p>
                            <p className="text-stone-500">{order.shipping_city}, {order.shipping_postal_code}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-3">Manifest Content</p>
                          <div className="space-y-3">
                            {order.order_items.map((item) => (
                              <div key={item.id} className="flex justify-between items-baseline gap-2">
                                <span className="text-xs font-bold text-stone-600 truncate">{item.product.name}</span>
                                <span className="text-[10px] font-black text-stone-400 italic">×{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-8 border-t border-stone-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                            <Truck className="w-5 h-5 text-stone-400" />
                          </div>
                          <div>
                            <p className="text-[8px] font-black uppercase tracking-widest text-stone-400 mb-0.5">Payment</p>
                            <p className="text-[10px] font-black text-stone-900 uppercase">Cash on Delivery</p>
                          </div>
                        </div>
                        <div className="text-right leading-none">
                          <p className="text-[10px] font-bold text-stone-400 mb-2">Transaction Value</p>
                          <p className="text-3xl font-serif font-black text-stone-900">${order.total_amount.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {orders.length === 0 && (
                    <div className="col-span-full py-24 text-center">
                      <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-10 h-10 text-stone-200" />
                      </div>
                      <h3 className="text-xl font-serif font-black text-stone-900 mb-2">Zero Activity Recorded</h3>
                      <p className="text-stone-400 text-sm">We are currently waiting for the first manual acquisition.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {notification && (
        <Toast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}
