import { useCallback, useEffect, useState } from 'react';
import AdminShell from '../components/AdminShell';
import api from '../utils/api';

const fmt = value => value == null
  ? 'Chưa có dữ liệu'
  : Number(value).toLocaleString('vi-VN', { maximumFractionDigits: 1 });

export default function AdminAnalyticsPage() {
  const [feedback, setFeedback] = useState(null);
  const [quality, setQuality] = useState(null);
  const [health, setHealth] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [feedbackResponse, qualityResponse, healthResponse] = await Promise.all([
        api.get('/admin/analytics/feedback'),
        api.get('/admin/analytics/data-quality'),
        api.get('/admin/analytics/ai-health'),
      ]);
      setFeedback({ ...feedbackResponse.data, models: feedbackResponse.data?.models || [] });
      setQuality({
        ...qualityResponse.data,
        unmappedLabels: qualityResponse.data?.unmappedLabels || [],
        productIssues: qualityResponse.data?.productIssues || [],
      });
      setHealth(healthResponse.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Không thể tải dữ liệu phân tích.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const exportFeedback = async () => {
    try {
      setError('');
      const response = await api.get('/admin/analytics/feedback/export', { responseType: 'blob' });
      const url = URL.createObjectURL(response.data);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'giftmatch_feedback.csv';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Không thể xuất dữ liệu phản hồi.');
    }
  };

  const cards = feedback ? [
    ['Đánh giá', feedback.totalFeedback],
    ['Điểm trung bình', fmt(feedback.averageRating)],
    ['Phù hợp', feedback.relevantRate == null ? '—' : `${fmt(feedback.relevantRate)}%`],
    ['Có chọn sản phẩm', feedback.selectionRate == null ? '—' : `${fmt(feedback.selectionRate)}%`],
  ] : [];

  return <AdminShell title="Phân tích hệ thống và AI">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-2xl font-bold">Chất lượng gợi ý và dữ liệu</h2>
        <p className="text-on-surface-variant">Các chỉ số được tổng hợp trực tiếp từ database.</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={load} disabled={loading} className="rounded-xl border border-outline-variant px-4 py-2 text-sm font-bold disabled:opacity-50">Làm mới</button>
        <button type="button" onClick={exportFeedback} disabled={!feedback || loading} className="rounded-xl border border-primary px-4 py-2 text-sm font-bold text-primary hover:bg-primary/5 disabled:opacity-50"><span className="material-symbols-outlined mr-2 align-middle text-[18px]">download</span>Xuất phản hồi CSV</button>
        {health && <span className={`rounded-full px-4 py-2 text-sm font-bold ${health.available ? 'bg-green-100 text-green-800' : 'bg-error-container text-error'}`}>AI Service: {health.available ? 'Hoạt động' : 'Không phản hồi'}</span>}
      </div>
    </div>
    {error && <p className="mb-4 rounded-xl bg-error-container p-4 text-error">{error}</p>}
    {loading && <p className="rounded-2xl bg-white p-8 text-center text-on-surface-variant">Đang tổng hợp dữ liệu phân tích...</p>}
    {!loading && <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value]) => <div key={label} className="rounded-2xl border border-outline-variant bg-white p-5 shadow-sm"><p className="text-sm text-on-surface-variant">{label}</p><strong className="mt-2 block text-3xl">{value}</strong></div>)}</div>
      {feedback && <section className="mt-6 overflow-hidden rounded-2xl border border-outline-variant bg-white">
        <div className="p-5"><h3 className="text-lg font-bold">Phản hồi theo phiên bản mô hình</h3></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left"><thead className="bg-surface-container"><tr><th className="p-4">Model</th><th className="p-4">Số đánh giá</th><th className="p-4">Điểm TB</th><th className="p-4">Phù hợp</th><th className="p-4">Được chọn</th></tr></thead><tbody>{feedback.models.map(model => <tr key={model.modelVersion} className="border-t border-outline-variant"><td className="p-4 font-bold">{model.modelVersion}</td><td className="p-4">{model.feedbackCount}</td><td className="p-4">{fmt(model.averageRating)}</td><td className="p-4">{model.relevantRate == null ? '—' : `${fmt(model.relevantRate)}%`}</td><td className="p-4">{model.selectionRate == null ? '—' : `${fmt(model.selectionRate)}%`}</td></tr>)}</tbody></table></div>
        {feedback.models.length === 0 && <p className="p-8 text-center text-on-surface-variant">Chưa có phản hồi theo phiên bản mô hình.</p>}
      </section>}
      {quality && <section className="mt-6 rounded-2xl border border-outline-variant bg-white p-5">
        <h3 className="text-lg font-bold">Kiểm tra chất lượng dữ liệu</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">{[
          ['Thiếu ảnh', quality.productsMissingImage], ['Thiếu mô tả', quality.productsMissingDescription],
          ['Thiếu nhãn AI', quality.productsMissingGiftLabel], ['Giá lỗi', quality.productsWithInvalidPrice],
          ['Nhãn không ánh xạ', quality.unmappedPredictionLabels],
        ].map(([label, value]) => <div key={label} className="rounded-xl bg-surface-container-low p-4"><span className="text-sm text-on-surface-variant">{label}</span><strong className="mt-1 block text-2xl">{value ?? 0}</strong></div>)}</div>
        {quality.unmappedLabels.length > 0 && <div className="mt-5"><strong>Nhãn dự đoán chưa ánh xạ:</strong><div className="mt-2 flex flex-wrap gap-2">{quality.unmappedLabels.map(label => <span key={label} className="rounded-full bg-error-container px-3 py-1 text-sm text-error">{label}</span>)}</div></div>}
        <div className="mt-5 grid gap-2 md:grid-cols-2">{quality.productIssues.slice(0, 20).map(product => <div key={product.productId} className="min-w-0 rounded-xl border border-outline-variant p-3"><strong className="break-words">#{product.productId} · {product.name}</strong><p className="text-sm text-error">{(product.issues || []).join(', ')}</p></div>)}</div>
        {quality.productIssues.length === 0 && <p className="mt-5 rounded-xl bg-green-50 p-4 text-green-800">Không phát hiện sản phẩm thiếu dữ liệu quan trọng.</p>}
      </section>}
    </>}
  </AdminShell>;
}
