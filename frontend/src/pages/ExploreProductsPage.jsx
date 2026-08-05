import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from '../components/FavoriteButton';
import { GIFT_TYPE_LABELS } from '../constants/giftTaxonomy';
import useFavorites from '../hooks/useFavorites';
import api from '../utils/api';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80';
const formatPrice = value => `${Number(value || 0).toLocaleString('vi-VN')} ₫`;

const initialFilters = { keyword: '', giftType: '', minPrice: '', maxPrice: '' };

export default function ExploreProductsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isFavorite, toggleFavorite, error: favoriteError } = useFavorites();

  const search = async requestedFilters => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/products/search', {
        params: {
          keyword: requestedFilters.keyword.trim() || undefined,
          giftType: requestedFilters.giftType || undefined,
          minPrice: requestedFilters.minPrice || undefined,
          maxPrice: requestedFilters.maxPrice || undefined,
        },
      });
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Không thể tải danh sách sản phẩm.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { search(initialFilters); }, []);

  const updateFilter = event => {
    const { name, value } = event.target;
    setFilters(current => ({ ...current, [name]: value }));
  };

  const submit = event => {
    event.preventDefault();
    search(filters);
  };

  const reset = () => {
    setFilters(initialFilters);
    search(initialFilters);
  };

  return (
    <main className="mx-auto w-full max-w-container-max flex-grow overflow-x-hidden px-gutter py-lg md:px-xl">
      <header className="mb-6">
        <p className="font-bold text-primary">Danh mục sản phẩm đã được kiểm duyệt</p>
        <h1 className="mt-2 break-words text-3xl font-extrabold sm:text-4xl">Khám phá quà tặng</h1>
        <p className="mt-2 text-on-surface-variant">Tìm kiếm theo tên, loại quà và khoảng ngân sách phù hợp.</p>
      </header>

      <form onSubmit={submit} className="mb-8 grid min-w-0 grid-cols-1 gap-3 rounded-2xl border border-outline-variant bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
        <label className="min-w-0 text-sm font-bold lg:col-span-2">
          Từ khóa
          <input name="keyword" value={filters.keyword} onChange={updateFilter} placeholder="Tên hoặc mô tả sản phẩm" className="mt-2 w-full min-w-0 rounded-xl border border-outline-variant px-3 py-2.5 font-normal" />
        </label>
        <label className="min-w-0 text-sm font-bold">
          Loại quà
          <select name="giftType" value={filters.giftType} onChange={updateFilter} className="mt-2 w-full min-w-0 rounded-xl border border-outline-variant bg-white px-3 py-2.5 font-normal">
            <option value="">Tất cả</option>
            {Object.entries(GIFT_TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="min-w-0 text-sm font-bold">
          Giá thấp nhất
          <input name="minPrice" type="number" min="0" step="1000" value={filters.minPrice} onChange={updateFilter} placeholder="0" className="mt-2 w-full min-w-0 rounded-xl border border-outline-variant px-3 py-2.5 font-normal" />
        </label>
        <label className="min-w-0 text-sm font-bold">
          Giá cao nhất
          <input name="maxPrice" type="number" min="0" step="1000" value={filters.maxPrice} onChange={updateFilter} placeholder="5.000.000" className="mt-2 w-full min-w-0 rounded-xl border border-outline-variant px-3 py-2.5 font-normal" />
        </label>
        <div className="flex flex-col gap-2 sm:flex-row lg:col-span-5 lg:justify-end">
          <button type="button" onClick={reset} className="rounded-xl border border-outline-variant px-5 py-2.5 font-bold">Xóa bộ lọc</button>
          <button type="submit" className="rounded-xl bg-primary px-6 py-2.5 font-bold text-white">Tìm kiếm</button>
        </div>
      </form>

      {(error || favoriteError) && <div className="mb-6 rounded-xl bg-error-container px-4 py-3 text-error">{error || favoriteError}</div>}

      {loading ? (
        <div className="py-20 text-center text-on-surface-variant">Đang tải sản phẩm...</div>
      ) : products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-outline-variant bg-white px-4 py-16 text-center">
          <span className="material-symbols-outlined text-6xl text-outline">search_off</span>
          <h2 className="mt-4 text-xl font-bold">Không tìm thấy sản phẩm phù hợp</h2>
          <p className="mt-2 text-on-surface-variant">Có thể mở rộng khoảng giá hoặc xóa bớt điều kiện lọc.</p>
        </div>
      ) : (
        <section>
          <p className="mb-4 text-sm text-on-surface-variant">Hiển thị {products.length} sản phẩm</p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map(product => {
              const favorite = isFavorite(product.productId);
              return (
                <article key={product.productId} className="min-w-0 overflow-hidden rounded-2xl border border-surface-container bg-white shadow-sm transition-transform hover:-translate-y-1">
                  <div className="relative aspect-[4/3] overflow-hidden bg-surface-container">
                    <img src={product.imageUrl || FALLBACK_IMAGE} alt={product.name} className="h-full w-full object-cover" onError={event => { event.currentTarget.src = FALLBACK_IMAGE; }} />
                    <FavoriteButton favorite={favorite} onClick={() => toggleFavorite(product)} iconOnly className="absolute right-3 top-3" />
                  </div>
                  <div className="flex min-w-0 flex-col p-4">
                    <p className="truncate text-xs font-bold text-primary">{product.storeName || 'GiftMatch Store'}</p>
                    <h2 className="mt-1 line-clamp-2 min-h-12 break-words text-lg font-bold">{product.name}</h2>
                    <p className="mt-2 line-clamp-2 min-h-10 break-words text-sm text-on-surface-variant">{product.description || product.aiGiftName || product.giftType}</p>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <strong className="text-lg text-primary-container">{formatPrice(product.price)}</strong>
                      <Link to={`/products/${product.productId}`} className="rounded-xl border border-secondary px-4 py-2 text-sm font-bold text-secondary hover:bg-secondary hover:text-white">Chi tiết</Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
