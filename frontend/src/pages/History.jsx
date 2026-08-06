import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { GIFT_NAME_LABELS, GIFT_TYPE_LABELS } from '../constants/giftTaxonomy';
import RecommendationFeedback from '../components/RecommendationFeedback';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600&auto=format&fit=crop';

const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number(price || 0));

const formatDate = (value) => {
  if (!value) return '';
  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(value));
};

export default function History() {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await api.get('/history/me');
        setHistoryData(response.data || []);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message
          || 'Không thể tải lịch sử gợi ý.'
        );
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  if (loading) {
    return (
      <main className="flex-grow grid place-items-center">
        <div className="text-center text-on-surface-variant">
          <span className="material-symbols-outlined text-5xl text-primary animate-pulse">
            history
          </span>
          <p>Đang tải lịch sử...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow max-w-container-max mx-auto w-full px-gutter md:px-xl py-lg">
      <div className="mb-10 text-center md:text-left max-w-2xl">
        <h1 className="font-display-lg text-[32px] md:text-[40px] font-bold text-on-surface mb-3">
          Lịch sử gợi ý quà tặng
        </h1>
        <p className="font-body-md text-on-surface-variant leading-relaxed">
          Mỗi lần AI phân tích thành công sẽ tự động được lưu tại đây.
        </p>
      </div>

      {error && (
        <div className="rounded-xl bg-error-container px-4 py-3 text-error mb-lg">
          {error}
        </div>
      )}

      {historyData.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-outline-variant p-xl text-center">
          <span className="material-symbols-outlined text-6xl text-outline">history_toggle_off</span>
          <h2 className="font-title-lg font-bold mt-md">Chưa có lịch sử</h2>
          <p className="text-on-surface-variant mt-xs mb-lg">
            Hoàn thành khảo sát đầu tiên để nhận gợi ý cá nhân hóa.
          </p>
          <Link to="/survey" className="rounded-xl bg-primary px-6 py-3 text-white font-bold">
            Bắt đầu khảo sát
          </Link>
        </div>
      ) : (
        <div className="relative border-l-2 border-surface-container-high ml-4 md:ml-8 pb-10">
          {historyData.map((history) => (
            <article key={history.historyId} className="mb-12 relative pl-8 md:pl-12">
              <div className="absolute -left-[17px] top-0 bg-white border-2 border-primary rounded-full w-8 h-8 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              </div>

              <h3 className="font-bold text-title-md text-primary mb-4 ml-2 -mt-1">
                {formatDate(history.createdAt)}
              </h3>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-surface-container flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-1/3 shrink-0 flex flex-col">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 rounded-full bg-primary/10 text-primary grid place-items-center font-bold text-xl">
                      {(history.recipient?.fullName
                        || history.recipientName
                        || 'N').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-title-md text-on-surface">
                        {history.recipient?.fullName
                          || history.recipientName
                          || 'Người nhận chưa đặt tên'}
                      </h4>
                      {history.recipient && (
                        <span className="text-label-sm text-on-surface-variant">
                          {history.recipient.age || '?'} tuổi · {history.recipient.relationship || ''}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-surface-container-low rounded-2xl p-5 border border-surface-container-high flex-grow">
                    <div className="flex items-center gap-2 text-primary font-bold text-label-md mb-2">
                      <span className="material-symbols-outlined">psychology</span>
                      AI INSIGHTS
                    </div>
                    <p className="text-body-md text-on-surface-variant leading-relaxed">
                      {history.aiInsights}
                    </p>
                  </div>

                  <RecommendationFeedback
                    historyId={history.historyId}
                    products={history.products || []}
                    initialFeedback={history.feedback}
                    compact
                  />
                </div>

                <div className="w-full flex flex-col flex-grow min-w-0">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-label-md text-on-surface-variant">
                      Sản phẩm đã gợi ý ({history.products?.length || 0})
                    </span>
                    <Link
                      to="/survey"
                      state={{
                        recipientProfileId: history.recipient?.profileId,
                        recipientName: history.recipient?.fullName
                          || history.recipientName,
                      }}
                      className="text-primary font-medium text-label-md flex items-center gap-1"
                    >
                      Gợi ý lại
                      <span className="material-symbols-outlined text-[18px]">refresh</span>
                    </Link>
                  </div>

                  {history.products?.length ? (
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                      {history.products.map((product) => (
                        <div
                          key={product.productId}
                          className="snap-start shrink-0 w-64 bg-surface-container-lowest rounded-2xl overflow-hidden border border-surface-variant"
                        >
                          <div className="h-44 overflow-hidden bg-surface-variant">
                            <img
                              src={product.imageUrl || FALLBACK_IMAGE}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <span className="text-label-sm text-on-surface-variant">
                              {product.storeName || 'GiftMatch Store'}
                            </span>
                            <h5 className="font-bold text-body-md text-on-surface line-clamp-1">
                              {product.name}
                            </h5>
                            <p className="text-label-sm text-primary mt-1">
                              {GIFT_NAME_LABELS[product.aiGiftName]
                                || GIFT_TYPE_LABELS[product.giftType]
                                || product.giftType}
                            </p>
                            {product.matchReason && (
                              <p className="mt-2 line-clamp-3 text-xs text-on-surface-variant" title={product.matchReason}>
                                {product.matchReason}
                              </p>
                            )}
                            <p className="text-primary font-bold mt-2">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-outline-variant p-6 text-center text-on-surface-variant">
                      Lần phân tích này chưa có sản phẩm đã duyệt phù hợp.
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
