import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../utils/api';
import useCompareProducts from '../hooks/useCompareProducts';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80';

const formatPrice = value => `${Number(value || 0).toLocaleString('vi-VN')} ₫`;

export default function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [compareMessage, setCompareMessage] = useState('');
  const { count, isSelected, toggleProduct } = useCompareProducts();

  useEffect(() => {
    let active = true;
    api.get(`/products/${productId}`)
      .then(response => {
        if (active) setProduct(response.data);
      })
      .catch(requestError => {
        if (!active) return;
        setError(
          requestError.response?.data?.message
          || 'Không thể tải thông tin sản phẩm.'
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [productId]);

  const handleCompare = () => {
    const result = toggleProduct(product);
    setCompareMessage(
      result.ok
        ? result.selected
          ? 'Đã thêm sản phẩm vào danh sách so sánh.'
          : 'Đã bỏ sản phẩm khỏi danh sách so sánh.'
        : result.message
    );
  };

  if (loading) {
    return <main className="flex-grow p-xl text-center">Đang tải sản phẩm...</main>;
  }

  if (error || !product) {
    return (
      <main className="flex-grow p-xl text-center">
        <h1 className="text-title-lg font-bold text-error">Không thể mở sản phẩm</h1>
        <p className="mt-2 text-on-surface-variant">{error}</p>
        <Link to="/home" className="mt-6 inline-flex text-primary font-bold">
          Quay lại trang chủ
        </Link>
      </main>
    );
  }

  const selected = isSelected(product.productId);
  return (
    <main className="flex-grow max-w-6xl mx-auto w-full px-gutter md:px-xl py-xl">
      <nav className="mb-6 text-label-md text-on-surface-variant">
        <Link to="/home" className="hover:text-primary">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </nav>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-xl bg-white rounded-3xl border border-surface-container p-6 md:p-10 shadow-sm">
        <div className="rounded-2xl overflow-hidden bg-surface-container aspect-square">
          <img
            src={product.imageUrl || FALLBACK_IMAGE}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={event => { event.currentTarget.src = FALLBACK_IMAGE; }}
          />
        </div>

        <div className="flex flex-col">
          <p className="text-label-md text-primary font-bold">
            {product.storeName || 'Cửa hàng GiftMatch'}
          </p>
          <h1 className="mt-2 text-[32px] md:text-[42px] leading-tight font-heading font-bold text-on-surface">
            {product.name}
          </h1>
          <p className="mt-4 text-[30px] font-extrabold text-primary-container">
            {formatPrice(product.price)}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {product.category?.name && (
              <span className="rounded-full bg-surface-container px-4 py-2 text-label-md">
                {product.category.name}
              </span>
            )}
            {product.giftType && (
              <span className="rounded-full bg-secondary-fixed px-4 py-2 text-label-md text-secondary">
                {product.giftType}
              </span>
            )}
            {product.aiGiftName && (
              <span className="rounded-full bg-primary/10 px-4 py-2 text-label-md text-primary">
                AI: {product.aiGiftName}
              </span>
            )}
          </div>

          <div className="mt-8 border-t border-surface-container pt-6">
            <h2 className="font-title-md font-bold">Mô tả sản phẩm</h2>
            <p className="mt-3 whitespace-pre-line text-on-surface-variant leading-7">
              {product.description || 'Sản phẩm chưa có mô tả chi tiết.'}
            </p>
          </div>

          <div className="mt-auto pt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCompare}
              className={`rounded-xl border-2 px-5 py-3 font-bold transition-colors ${
                selected
                  ? 'border-secondary bg-secondary text-white'
                  : 'border-secondary text-secondary hover:bg-secondary hover:text-white'
              }`}
            >
              {selected ? 'Đã chọn so sánh' : 'Thêm vào so sánh'}
            </button>
            {count > 0 && (
              <Link to="/compare" className="rounded-xl bg-primary px-5 py-3 text-white font-bold">
                Xem so sánh ({count})
              </Link>
            )}
            <Link to="/survey" className="rounded-xl bg-primary-container px-5 py-3 text-white font-bold">
              Tìm quà tương tự
            </Link>
          </div>
          {compareMessage && (
            <p className="mt-3 text-label-md text-on-surface-variant">{compareMessage}</p>
          )}
        </div>
      </section>
    </main>
  );
}
