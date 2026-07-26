import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80';

const EVENT_COLORS = [
  {
    avatar: 'bg-primary-container text-on-primary-container',
    badge: 'bg-error/10 text-error',
  },
  {
    avatar: 'bg-secondary-fixed text-secondary',
    badge: 'bg-on-surface-variant/10 text-on-surface-variant',
  },
  {
    avatar: 'bg-tertiary-fixed text-tertiary',
    badge: 'bg-on-surface-variant/10 text-on-surface-variant',
  },
];

function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map(part => part.charAt(0).toUpperCase())
    .join('');
}

function getUpcomingDate(dateValue) {
  if (!dateValue) return null;

  const source = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(source.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = new Date(
    today.getFullYear(),
    source.getMonth(),
    source.getDate()
  );
  if (upcoming < today) {
    upcoming.setFullYear(today.getFullYear() + 1);
  }

  const daysRemaining = Math.ceil(
    (upcoming.getTime() - today.getTime()) / 86400000
  );

  return { upcoming, daysRemaining };
}

function formatPrice(value) {
  return `${Number(value || 0).toLocaleString('vi-VN')} ₫`;
}

export default function UserHome() {
  const [fullName, setFullName] = useState(
    localStorage.getItem('fullName') || 'bạn'
  );
  const [profiles, setProfiles] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadHomeData = async () => {
      try {
        const [profileResponse, productResponse] = await Promise.all([
          api.get('/profiles/me'),
          api.get('/products/featured', { params: { limit: 8 } }),
        ]);

        if (!active) return;
        setProfiles(
          Array.isArray(profileResponse.data) ? profileResponse.data : []
        );
        setProducts(
          Array.isArray(productResponse.data) ? productResponse.data : []
        );
        setFullName(localStorage.getItem('fullName') || 'bạn');
      } catch (requestError) {
        if (!active) return;
        console.error('Không thể tải dữ liệu trang chủ:', requestError);
        setError(
          requestError.response?.data?.message
          || 'Không thể tải đầy đủ dữ liệu từ hệ thống.'
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    loadHomeData();
    return () => {
      active = false;
    };
  }, []);

  const upcomingEvents = useMemo(
    () => profiles
      .flatMap(profile => (profile.anniversaries || []).map(anniversary => {
        const dateInfo = getUpcomingDate(anniversary.eventDate);
        if (!dateInfo) return null;
        return {
          profileId: profile.profileId,
          recipientName: profile.fullName,
          relationship: profile.relationship || 'Người thân',
          eventName: anniversary.eventName || 'Ngày kỷ niệm',
          ...dateInfo,
        };
      }))
      .filter(Boolean)
      .sort((left, right) => left.daysRemaining - right.daysRemaining)
      .slice(0, 6),
    [profiles]
  );

  return (
    <main className="flex-grow max-w-container-max mx-auto w-full px-gutter md:px-xl py-lg">
      <section className="bg-gradient-to-br from-primary-container to-primary-fixed-dim rounded-2xl md:rounded-[32px] p-8 md:p-12 mb-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-md">
        <div className="relative z-10 max-w-xl text-center md:text-left">
          <h1 className="text-[28px] md:text-display-lg text-white font-extrabold mb-4 leading-tight font-heading">
            Chào mừng trở lại, {fullName}! 👋
          </h1>
          <p className="text-body-lg text-white/90 font-medium">
            Hôm nay bạn muốn tìm quà cho ai?
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              to="/survey"
              className="bg-white text-primary font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">auto_awesome</span>
              Bắt đầu ngay
            </Link>
          </div>
        </div>
        <div className="hidden md:block relative w-1/3 aspect-square">
          <img
            className="w-full h-full object-contain drop-shadow-2xl animate-bounce"
            style={{ animationDuration: '3s' }}
            alt="Hộp quà GiftMatch AI"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIV-my3Y6hLYsuYDbH4eNRj8iyyFXzQW-_QNPi_c2ezlfQiiTlSDQG-GRjxU_bLdhNp56TNsCqb7Km1tcjpFDXuCYU497zKAcWKV-15pFLhAQN824cp_3pgg8N0L8LPUbk_poQQTUMjtN-Tikz-WTxqvcaF4TXU5zusKXKADOP4MXHL90rIMjl1575EYvY1EnWrQO7KtSljblbPnO1gZCi_MBeUaO8CPVsk84iwjESMQUf4OuLg15QIQ"
          />
        </div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
        <Link to="/survey" className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-surface-container flex items-center gap-5 active:scale-[0.98]">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-container to-primary-fixed-dim flex items-center justify-center text-white shadow-inner">
            <span className="material-symbols-outlined text-3xl">feature_search</span>
          </div>
          <div>
            <h3 className="font-bold text-title-md text-on-surface">Tìm quà ngay</h3>
            <p className="text-label-md text-on-surface-variant mt-1">Trình cố vấn AI thông minh</p>
          </div>
        </Link>
        <Link to="/dashboard" className="group bg-secondary-fixed/30 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-secondary-fixed/50 flex items-center gap-5 active:scale-[0.98]">
          <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-white shadow-inner">
            <span className="material-symbols-outlined text-3xl">menu_book</span>
          </div>
          <div>
            <h3 className="font-bold text-title-md text-on-surface">Sổ tay người nhận</h3>
            <p className="text-label-md text-on-surface-variant mt-1">
              {loading ? 'Đang tải...' : `${profiles.length} hồ sơ đã lưu`}
            </p>
          </div>
        </Link>
        <Link to="/recommendations" className="group bg-tertiary-fixed/30 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-tertiary-fixed/50 flex items-center gap-5 active:scale-[0.98]">
          <div className="w-14 h-14 rounded-xl bg-tertiary flex items-center justify-center text-white shadow-inner">
            <span className="material-symbols-outlined text-3xl">magic_button</span>
          </div>
          <div>
            <h3 className="font-bold text-title-md text-on-surface">Gợi ý hôm nay</h3>
            <p className="text-label-md text-on-surface-variant mt-1">
              {loading ? 'Đang tải...' : `${products.length} sản phẩm nổi bật`}
            </p>
          </div>
        </Link>
      </section>

      {error && (
        <div className="mb-lg rounded-xl bg-error-container px-4 py-3 text-error">
          {error}
        </div>
      )}

      <section className="mb-lg">
        <div className="flex items-center justify-between mb-sm">
          <h2 className="text-[24px] md:text-title-md font-bold text-on-surface flex items-center gap-2 font-heading">
            Sự kiện sắp tới <span className="text-2xl">⏰</span>
          </h2>
          <Link to="/dashboard" className="text-primary font-bold text-label-md flex items-center gap-1 hover:underline">
            Xem tất cả <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-surface-container bg-white p-8 text-center text-on-surface-variant">
            Đang tải ngày kỷ niệm từ Sổ tay...
          </div>
        ) : upcomingEvents.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-outline-variant bg-white p-8 text-center">
            <span className="material-symbols-outlined text-4xl text-primary">event_available</span>
            <p className="mt-2 font-bold">Chưa có ngày kỷ niệm sắp tới</p>
            <p className="mt-1 text-on-surface-variant">
              Thêm ngày sinh hoặc ngày kỷ niệm trong hồ sơ người nhận.
            </p>
            <Link to="/add-profile" className="mt-4 inline-flex text-primary font-bold hover:underline">
              Thêm hồ sơ người nhận
            </Link>
          </div>
        ) : (
          <div className="flex gap-md overflow-x-auto pb-4 scrollbar-hide">
            {upcomingEvents.map((event, index) => {
              const colors = EVENT_COLORS[index % EVENT_COLORS.length];
              return (
                <article
                  key={`${event.profileId}-${event.eventName}-${event.upcoming.toISOString()}`}
                  className="flex-shrink-0 w-72 bg-white rounded-2xl p-5 border border-surface-container shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl font-heading ${colors.avatar}`}>
                      {getInitials(event.recipientName)}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[12px] font-bold ${colors.badge}`}>
                      {event.daysRemaining === 0
                        ? 'hôm nay'
                        : `còn ${event.daysRemaining} ngày`}
                    </span>
                  </div>
                  <h3 className="font-bold text-title-md text-on-surface font-heading">
                    {event.recipientName}
                  </h3>
                  <p className="text-label-md text-on-surface-variant mb-4">
                    {event.relationship} • {event.eventName}
                  </p>
                  <Link
                    to="/survey"
                    state={{
                      recipientProfileId: event.profileId,
                      recipientName: event.recipientName,
                    }}
                    className="pt-3 border-t border-surface-container flex items-center gap-2 text-primary font-medium text-label-md hover:text-primary-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">redeem</span>
                    Tìm quà cho {event.recipientName}
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="mb-xl">
        <div className="flex items-center justify-between mb-sm">
          <h2 className="text-[24px] md:text-title-md font-bold text-on-surface flex items-center gap-2 font-heading">
            Sản phẩm nổi bật <span className="text-2xl">✨</span>
          </h2>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-surface-container bg-white p-8 text-center text-on-surface-variant">
            Đang tải sản phẩm từ cửa hàng...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-outline-variant bg-white p-8 text-center">
            <span className="material-symbols-outlined text-4xl text-primary">inventory_2</span>
            <p className="mt-2 font-bold">Chưa có sản phẩm đã duyệt</p>
            <p className="mt-1 text-on-surface-variant">
              Sản phẩm của các cửa hàng sẽ xuất hiện tại đây sau khi được quản trị viên duyệt.
            </p>
          </div>
        ) : (
          <div className="flex gap-md overflow-x-auto pb-4 scrollbar-hide">
            {products.map(product => (
              <article
                key={product.productId}
                className="flex-shrink-0 w-64 md:w-72 bg-white rounded-2xl overflow-hidden shadow-sm border border-surface-container group hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-48 bg-surface-container overflow-hidden">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    alt={product.name}
                    src={product.imageUrl || FALLBACK_IMAGE}
                    onError={event => {
                      event.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[12px] font-bold text-primary flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-xs">stars</span>
                    {product.isTopSelling
                      ? 'Bán chạy'
                      : `${product.recommendCount || 0} lượt gợi ý`}
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-[12px] text-on-surface-variant font-medium mb-1">
                    {product.storeName || 'Cửa hàng GiftMatch'}
                    {product.category?.name ? ` • ${product.category.name}` : ''}
                  </p>
                  <h3 className="font-bold text-body-md text-on-surface mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-label-md text-on-surface-variant line-clamp-2 min-h-10 mb-3">
                    {product.description || product.aiGiftName || product.giftType}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-primary font-extrabold text-title-md">
                      {formatPrice(product.price)}
                    </span>
                    <Link
                      to="/survey"
                      className="px-4 py-2 border-2 border-secondary text-secondary font-bold text-[12px] rounded-xl hover:bg-secondary hover:text-white transition-all active:scale-95"
                    >
                      Tìm quà
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
