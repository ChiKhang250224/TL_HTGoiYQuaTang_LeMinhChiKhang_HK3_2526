import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../utils/api';
import useCompareProducts from '../hooks/useCompareProducts';
import useFavorites from '../hooks/useFavorites';
import FavoriteButton from '../components/FavoriteButton';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80';

const formatPrice = value => `${Number(value || 0).toLocaleString('vi-VN')} ₫`;

const REPORT_REASONS = [
  ['MISLEADING_INFO', 'Thông tin gây hiểu nhầm'],
  ['INAPPROPRIATE_CONTENT', 'Nội dung không phù hợp'],
  ['WRONG_PRICE', 'Giá hiển thị không chính xác'],
  ['COUNTERFEIT_SUSPECTED', 'Nghi ngờ hàng giả'],
  ['OTHER', 'Lý do khác'],
];

const REPORT_STATUS_LABELS = {
  PENDING: 'Đang chờ xử lý',
  RESOLVED: 'Đã xử lý',
  REJECTED: 'Không chấp nhận',
};

export default function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [compareMessage, setCompareMessage] = useState('');
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('MISLEADING_INFO');
  const [reportDescription, setReportDescription] = useState('');
  const [reportSending, setReportSending] = useState(false);
  const [reportMessage, setReportMessage] = useState({ type: '', text: '' });
  const [latestReport, setLatestReport] = useState(null);
  const { count, isSelected, toggleProduct } = useCompareProducts();
  const { isFavorite, toggleFavorite, error: favoriteError } = useFavorites();
  const isCustomer = localStorage.getItem('role') === 'CUSTOMER';

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

  useEffect(() => {
    if (!isCustomer) return undefined;
    let active = true;
    api.get('/product-reports/me')
      .then(response => {
        if (!active) return;
        const report = response.data.find(item => Number(item.productId) === Number(productId));
        setLatestReport(report || null);
      })
      .catch(() => {});
    return () => { active = false; };
  }, [isCustomer, productId]);

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

  const submitReport = async event => {
    event.preventDefault();
    setReportSending(true);
    setReportMessage({ type: '', text: '' });
    try {
      const response = await api.post(`/product-reports/${product.productId}`, {
        reason: reportReason,
        description: reportDescription.trim() || null,
      });
      setLatestReport(response.data);
      setReportDescription('');
      setReportOpen(false);
      setReportMessage({ type: 'success', text: 'Báo cáo đã được tiếp nhận và chuyển tới quản trị viên.' });
    } catch (requestError) {
      setReportMessage({
        type: 'error',
        text: requestError.response?.data?.message || 'Không thể gửi báo cáo sản phẩm.',
      });
    } finally {
      setReportSending(false);
    }
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
  const favorite = isFavorite(product.productId);
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
            <FavoriteButton favorite={favorite} onClick={() => toggleFavorite(product)} />
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
            {isCustomer && (
              <button
                type="button"
                onClick={() => setReportOpen(current => !current)}
                className="rounded-xl px-5 py-3 font-bold text-error hover:bg-error-container transition-colors"
              >
                Báo cáo sản phẩm
              </button>
            )}
          </div>
          {compareMessage && (
            <p className="mt-3 text-label-md text-on-surface-variant">{compareMessage}</p>
          )}
          {favoriteError && (
            <p className="mt-3 text-label-md text-error">{favoriteError}</p>
          )}
          {reportMessage.text && (
            <p className={`mt-3 rounded-xl px-4 py-3 text-label-md ${
              reportMessage.type === 'success'
                ? 'bg-green-50 text-green-800'
                : 'bg-error-container text-error'
            }`}>
              {reportMessage.text}
            </p>
          )}
          {latestReport && (
            <div className="mt-4 rounded-xl border border-outline-variant bg-surface-container-low p-4 text-sm">
              <p className="font-bold">Báo cáo gần nhất: {REPORT_STATUS_LABELS[latestReport.status] || latestReport.status}</p>
              {latestReport.resolutionNote && (
                <p className="mt-1 break-words text-on-surface-variant">Kết quả: {latestReport.resolutionNote}</p>
              )}
            </div>
          )}
          {reportOpen && (
            <form onSubmit={submitReport} className="mt-4 min-w-0 rounded-2xl border border-error/20 bg-error-container/30 p-4 sm:p-5">
              <h3 className="font-bold text-lg">Báo cáo nội dung sản phẩm</h3>
              <label className="mt-4 block text-sm font-bold" htmlFor="report-reason">Lý do</label>
              <select
                id="report-reason"
                value={reportReason}
                onChange={event => setReportReason(event.target.value)}
                className="mt-2 w-full min-w-0 rounded-xl border border-outline-variant bg-white px-3 py-2.5"
              >
                {REPORT_REASONS.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <label className="mt-4 block text-sm font-bold" htmlFor="report-description">Mô tả bổ sung</label>
              <textarea
                id="report-description"
                rows="4"
                maxLength="1000"
                value={reportDescription}
                onChange={event => setReportDescription(event.target.value)}
                placeholder="Mô tả dấu hiệu hoặc thông tin cần được kiểm tra"
                className="mt-2 w-full min-w-0 resize-y rounded-xl border border-outline-variant bg-white px-3 py-2.5"
              />
              <div className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                <button type="button" onClick={() => setReportOpen(false)} className="rounded-xl border border-outline-variant px-4 py-2.5 font-bold">
                  Hủy
                </button>
                <button disabled={reportSending} type="submit" className="rounded-xl bg-error px-4 py-2.5 font-bold text-white disabled:opacity-50">
                  {reportSending ? 'Đang gửi...' : 'Gửi báo cáo'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
