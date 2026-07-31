import { useEffect, useState } from 'react';
import api from '../utils/api';

export default function RecommendationFeedback({
  historyId,
  products = [],
  initialFeedback = null,
  compact = false,
}) {
  const [rating, setRating] = useState(initialFeedback?.rating || 0);
  const [relevant, setRelevant] = useState(
    initialFeedback?.relevant ?? null
  );
  const [selectedProductId, setSelectedProductId] = useState(
    initialFeedback?.selectedProductId || ''
  );
  const [comment, setComment] = useState(initialFeedback?.comment || '');
  const [loading, setLoading] = useState(Boolean(historyId));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadFeedback = async () => {
      if (!historyId) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get(`/history/${historyId}/feedback`);
        if (!active || !response.data) return;
        setRating(response.data.rating || 0);
        setRelevant(response.data.relevant ?? null);
        setSelectedProductId(response.data.selectedProductId || '');
        setComment(response.data.comment || '');
      } catch (requestError) {
        if (requestError.response?.status !== 204 && active) {
          setError('Không thể tải đánh giá đã lưu.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadFeedback();
    return () => {
      active = false;
    };
  }, [historyId]);

  const submitFeedback = async () => {
    if (!historyId) {
      setError('Kết quả chưa có mã lịch sử để đánh giá.');
      return;
    }
    if (rating < 1 || relevant === null) {
      setError('Hãy chọn số sao và cho biết gợi ý có đúng hay không.');
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');
    try {
      await api.put(`/history/${historyId}/feedback`, {
        rating,
        relevant,
        selectedProductId: selectedProductId
          ? Number(selectedProductId)
          : null,
        comment: comment.trim() || null,
      });
      setMessage('Cảm ơn bạn! Đánh giá đã được lưu để cải thiện AI.');
    } catch (requestError) {
      setError(
        requestError.response?.data?.message
        || 'Không thể lưu đánh giá. Vui lòng thử lại.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (!historyId) return null;

  return (
    <section className={`rounded-2xl border border-primary/20 bg-primary/5 ${compact ? 'p-4 mt-4' : 'p-6 mt-lg'}`}>
      <div className="flex items-start gap-3">
        <span className="material-symbols-outlined text-primary">
          rate_review
        </span>
        <div className="flex-grow min-w-0">
          <h2 className={`${compact ? 'text-body-md' : 'text-title-md'} font-bold text-on-surface`}>
            AI gợi ý có đúng với nhu cầu của bạn?
          </h2>
          <p className="text-label-md text-on-surface-variant mt-1">
            Vote của bạn giúp hệ thống đánh giá và cải thiện mô hình.
          </p>
        </div>
      </div>

      {loading ? (
        <p className="mt-4 text-label-md text-on-surface-variant">
          Đang tải đánh giá...
        </p>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1" aria-label="Chấm điểm từ 1 đến 5 sao">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`material-symbols-outlined text-[28px] transition-colors ${
                    star <= rating ? 'text-amber-500' : 'text-outline'
                  }`}
                  style={{
                    fontVariationSettings: star <= rating
                      ? "'FILL' 1"
                      : "'FILL' 0",
                  }}
                  aria-label={`${star} sao`}
                >
                  star
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRelevant(true)}
                className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-label-md font-bold ${
                  relevant === true
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-outline-variant bg-white text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined">thumb_up</span>
                Đúng
              </button>
              <button
                type="button"
                onClick={() => setRelevant(false)}
                className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-label-md font-bold ${
                  relevant === false
                    ? 'border-error bg-error-container text-error'
                    : 'border-outline-variant bg-white text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined">thumb_down</span>
                Chưa đúng
              </button>
            </div>
          </div>

          <div className={`mt-4 grid ${compact ? 'grid-cols-1' : 'md:grid-cols-2'} gap-3`}>
            <label className="text-label-md font-medium text-on-surface">
              Sản phẩm phù hợp nhất
              <select
                value={selectedProductId}
                onChange={event => setSelectedProductId(event.target.value)}
                className="mt-1.5 w-full rounded-xl border border-outline-variant bg-white px-3 py-2.5"
              >
                <option value="">Chưa chọn sản phẩm</option>
                {products.map(product => (
                  <option key={product.productId} value={product.productId}>
                    {product.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-label-md font-medium text-on-surface">
              Góp ý thêm
              <textarea
                value={comment}
                onChange={event => setComment(event.target.value)}
                maxLength={1000}
                rows={compact ? 2 : 3}
                placeholder="Điều gì đúng hoặc chưa đúng trong kết quả?"
                className="mt-1.5 w-full resize-none rounded-xl border border-outline-variant bg-white px-3 py-2.5"
              />
            </label>
          </div>

          {error && <p className="mt-3 text-label-md text-error">{error}</p>}
          {message && (
            <p className="mt-3 text-label-md text-green-700">{message}</p>
          )}

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={submitFeedback}
              disabled={saving}
              className="rounded-xl bg-primary px-5 py-2.5 text-white font-bold disabled:opacity-60"
            >
              {saving ? 'Đang lưu...' : 'Gửi đánh giá'}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
