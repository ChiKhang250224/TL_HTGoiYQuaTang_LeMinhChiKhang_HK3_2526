import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useFavorites from '../hooks/useFavorites';
import FavoriteProductCard from '../components/FavoriteProductCard';

export default function Favorites() {
  const { favorites, loading, error, removeFavorite, reload } = useFavorites();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');

  const filteredFavorites = useMemo(() => {
    const keyword = searchTerm.trim().toLocaleLowerCase('vi');
    const filtered = favorites.filter(product => (
      product.name?.toLocaleLowerCase('vi').includes(keyword)
      || product.brand?.toLocaleLowerCase('vi').includes(keyword)
    ));
    return [...filtered].sort((left, right) => {
      if (sortOrder === 'oldest') return new Date(left.createdAt || 0) - new Date(right.createdAt || 0);
      if (sortOrder === 'price-asc') return left.price - right.price;
      if (sortOrder === 'price-desc') return right.price - left.price;
      return new Date(right.createdAt || 0) - new Date(left.createdAt || 0);
    });
  }, [favorites, searchTerm, sortOrder]);

  return (
    <main className="flex-grow max-w-container-max mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 md:py-10 overflow-x-hidden">
      <nav className="flex items-center gap-2 text-label-sm text-on-surface-variant mb-6 min-w-0">
        <Link to="/home" className="hover:text-primary transition-colors">Trang chủ</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-primary font-bold truncate">Danh sách yêu thích</span>
      </nav>

      <section className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-5">
        <div className="min-w-0">
          <h1 className="text-[28px] sm:text-[36px] lg:text-[40px] leading-tight font-bold text-on-surface mb-2">
            Danh sách yêu thích
          </h1>
          <p className="text-on-surface-variant">
            Có <span className="font-bold text-primary">{favorites.length}</span> món quà đã lưu trong tài khoản
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_180px] gap-3 w-full lg:w-auto">
          <label className="relative block min-w-0">
            <span className="sr-only">Tìm trong danh sách</span>
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
            <input
              type="search"
              placeholder="Tìm theo tên hoặc cửa hàng"
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
              className="w-full sm:w-[280px] pl-10 pr-4 py-2.5 bg-white border border-outline-variant rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </label>
          <select
            value={sortOrder}
            onChange={event => setSortOrder(event.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-outline-variant rounded-full text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
          </select>
        </div>
      </section>

      {error && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-error/20 bg-error-container px-4 py-3 text-error">
          <span>{error}</span>
          <button type="button" onClick={reload} className="font-bold underline self-start sm:self-auto">Thử lại</button>
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin text-4xl">progress_activity</span>
          <p className="mt-3">Đang tải danh sách yêu thích...</p>
        </div>
      ) : filteredFavorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredFavorites.map(product => (
            <FavoriteProductCard key={product.id} product={product} onRemove={removeFavorite} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 md:py-24 px-4 text-center rounded-3xl border border-dashed border-outline-variant bg-white/50">
          <span className="material-symbols-outlined text-[64px] text-surface-variant mb-4">favorite_border</span>
          <h2 className="text-title-md font-bold text-on-surface mb-2">
            {searchTerm ? 'Không tìm thấy sản phẩm' : 'Danh sách đang trống'}
          </h2>
          <p className="text-on-surface-variant max-w-md">
            {searchTerm ? 'Hãy thử một từ khóa khác.' : 'Các sản phẩm được đánh dấu yêu thích sẽ được lưu tại đây.'}
          </p>
          {!searchTerm && (
            <Link to="/survey" className="mt-6 px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-opacity">
              Tìm quà ngay
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
