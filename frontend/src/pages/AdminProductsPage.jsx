import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80';
const formatPrice = value => `${Number(value || 0).toLocaleString('vi-VN')} ₫`;

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [taxonomy, setTaxonomy] = useState({});
  const [labels, setLabels] = useState({});
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const loadData = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const [pendingResponse, taxonomyResponse] = await Promise.all([
        api.get('/admin/products/pending'),
        api.get('/admin/products/taxonomy'),
      ]);
      setProducts(pendingResponse.data);
      setTaxonomy(taxonomyResponse.data);
      setLabels(Object.fromEntries(
        pendingResponse.data.map(product => [product.productId, product.aiGiftName || ''])
      ));
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Không thể tải danh sách sản phẩm chờ duyệt.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    const keyword = searchTerm.trim().toLocaleLowerCase('vi');
    return products.filter(product => (
      product.name?.toLocaleLowerCase('vi').includes(keyword)
      || product.storeName?.toLocaleLowerCase('vi').includes(keyword)
    ));
  }, [products, searchTerm]);

  const removeFromQueue = productId => {
    setProducts(current => current.filter(product => product.productId !== productId));
  };

  const ensureLabelSaved = async (product) => {
    const selectedLabel = labels[product.productId];
    if (!selectedLabel) throw new Error('Vui lòng chọn nhãn AI trước khi phê duyệt.');
    if (selectedLabel !== product.aiGiftName) {
      await api.put(`/admin/products/${product.productId}/label`, { aiGiftName: selectedLabel });
    }
  };

  const approveProduct = async (product) => {
    setProcessingId(product.productId);
    setMessage({ type: '', text: '' });
    try {
      await ensureLabelSaved(product);
      await api.put(`/admin/products/${product.productId}/approve`);
      removeFromQueue(product.productId);
      setMessage({ type: 'success', text: `Đã phê duyệt “${product.name}”.` });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || error.message || 'Không thể phê duyệt sản phẩm.',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const rejectProduct = async () => {
    if (!rejectionReason.trim()) {
      setMessage({ type: 'error', text: 'Lý do từ chối không được bỏ trống.' });
      return;
    }
    setProcessingId(rejectingId);
    try {
      const product = products.find(item => item.productId === rejectingId);
      await api.put(`/admin/products/${rejectingId}/reject`, { reason: rejectionReason.trim() });
      removeFromQueue(rejectingId);
      setRejectingId(null);
      setRejectionReason('');
      setMessage({ type: 'success', text: `Đã từ chối “${product?.name || 'sản phẩm'}”.` });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Không thể từ chối sản phẩm.' });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface overflow-x-hidden">
      <header className="sticky top-0 z-30 border-b border-outline-variant bg-white/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/admin" className="w-10 h-10 shrink-0 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <div className="min-w-0">
              <h1 className="font-bold text-lg sm:text-xl truncate">Kiểm duyệt sản phẩm</h1>
              <p className="text-xs sm:text-sm text-on-surface-variant truncate">Gán nhãn và quyết định phạm vi hiển thị</p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
            {products.length} chờ duyệt
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Danh sách chờ xử lý</h2>
            <p className="mt-1 text-on-surface-variant">Chỉ sản phẩm đã có nhãn AI hợp lệ mới có thể được phê duyệt.</p>
          </div>
          <label className="relative w-full md:w-80">
            <span className="sr-only">Tìm sản phẩm</span>
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              type="search"
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
              placeholder="Tìm sản phẩm hoặc cửa hàng"
              className="w-full rounded-xl border border-outline-variant bg-white py-2.5 pl-10 pr-4 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </label>
        </div>

        {message.text && (
          <div className={`mb-6 rounded-xl border px-4 py-3 ${
            message.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-800'
              : 'border-error/20 bg-error-container text-error'
          }`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin text-4xl">progress_activity</span>
            <p className="mt-3">Đang tải sản phẩm...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-outline-variant bg-white px-4 py-16 text-center">
            <span className="material-symbols-outlined text-6xl text-outline">inventory_2</span>
            <h3 className="mt-4 text-xl font-bold">Không có sản phẩm chờ duyệt</h3>
            <p className="mt-2 text-on-surface-variant">Danh sách sẽ cập nhật khi Store gửi sản phẩm mới.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {filteredProducts.map(product => (
              <article key={product.productId} className="min-w-0 rounded-2xl border border-outline-variant bg-white p-4 sm:p-5 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-[150px_minmax(0,1fr)] gap-4">
                  <div className="aspect-[4/3] sm:aspect-square rounded-xl overflow-hidden bg-surface-container">
                    <img
                      src={product.imageUrl || FALLBACK_IMAGE}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={event => { event.currentTarget.src = FALLBACK_IMAGE; }}
                    />
                  </div>
                  <div className="min-w-0 flex flex-col">
                    <p className="text-sm text-primary font-bold truncate">{product.storeName || 'Cửa hàng chưa xác định'}</p>
                    <h3 className="mt-1 text-xl font-bold break-words line-clamp-2">{product.name}</h3>
                    <p className="mt-2 text-lg font-extrabold text-primary-container">{formatPrice(product.price)}</p>
                    <p className="mt-2 text-sm leading-6 text-on-surface-variant line-clamp-3 break-words">
                      {product.description || 'Sản phẩm chưa có mô tả.'}
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <label htmlFor={`label-${product.productId}`} className="block mb-2 text-sm font-bold">Nhãn quà AI</label>
                  <select
                    id={`label-${product.productId}`}
                    value={labels[product.productId] || ''}
                    onChange={event => setLabels(current => ({ ...current, [product.productId]: event.target.value }))}
                    className="w-full rounded-xl border border-outline-variant bg-white px-3 py-2.5 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Chọn nhãn phù hợp</option>
                    {Object.entries(taxonomy).map(([giftName, giftType]) => (
                      <option key={giftName} value={giftName}>{giftName} — {giftType}</option>
                    ))}
                  </select>
                </div>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={processingId === product.productId || !labels[product.productId]}
                    onClick={() => approveProduct(product)}
                    className="rounded-xl bg-primary px-4 py-2.5 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 hover:opacity-90"
                  >
                    {processingId === product.productId ? 'Đang xử lý...' : 'Phê duyệt'}
                  </button>
                  <button
                    type="button"
                    disabled={processingId === product.productId}
                    onClick={() => { setRejectingId(product.productId); setRejectionReason(''); }}
                    className="rounded-xl border border-error px-4 py-2.5 font-bold text-error hover:bg-error-container disabled:opacity-50"
                  >
                    Từ chối
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl bg-white p-5 sm:p-6 shadow-xl">
            <h2 className="text-xl font-bold">Từ chối sản phẩm</h2>
            <p className="mt-2 text-on-surface-variant">Lý do sẽ được lưu nhằm hỗ trợ Store chỉnh sửa sản phẩm.</p>
            <textarea
              autoFocus
              rows={5}
              maxLength={1000}
              value={rejectionReason}
              onChange={event => setRejectionReason(event.target.value)}
              placeholder="Nhập lý do từ chối..."
              className="mt-4 w-full resize-y rounded-xl border border-outline-variant p-3 focus:border-error focus:outline-none focus:ring-1 focus:ring-error"
            />
            <div className="mt-1 text-right text-xs text-on-surface-variant">{rejectionReason.length}/1000</div>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button type="button" onClick={() => setRejectingId(null)} className="rounded-xl border border-outline-variant px-4 py-2.5 font-bold">Hủy</button>
              <button type="button" onClick={rejectProduct} disabled={processingId === rejectingId} className="rounded-xl bg-error px-4 py-2.5 font-bold text-white disabled:opacity-50">
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
