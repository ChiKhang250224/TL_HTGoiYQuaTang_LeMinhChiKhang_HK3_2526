import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80';

const REASON_LABELS = {
  MISLEADING_INFO: 'Thông tin gây hiểu nhầm',
  INAPPROPRIATE_CONTENT: 'Nội dung không phù hợp',
  WRONG_PRICE: 'Giá không chính xác',
  COUNTERFEIT_SUSPECTED: 'Nghi ngờ hàng giả',
  OTHER: 'Lý do khác',
};

const STATUS_LABELS = {
  PENDING: 'Chờ xử lý',
  RESOLVED: 'Đã xử lý',
  REJECTED: 'Không chấp nhận',
};

const STATUS_STYLES = {
  PENDING: 'bg-amber-50 text-amber-800 border-amber-200',
  RESOLVED: 'bg-green-50 text-green-800 border-green-200',
  REJECTED: 'bg-surface-container text-on-surface-variant border-outline-variant',
};

export default function AdminProductReportsPage() {
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState('PENDING');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState({});
  const [hideProducts, setHideProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const loadReports = useCallback(async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await api.get('/admin/product-reports', {
        params: { status: status || undefined, reason: reason || undefined },
      });
      setReports(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Không thể tải danh sách báo cáo.' });
    } finally {
      setLoading(false);
    }
  }, [reason, status]);

  useEffect(() => { loadReports(); }, [loadReports]);

  const decide = async (reportId, decision) => {
    const resolutionNote = notes[reportId]?.trim();
    if (!resolutionNote) {
      setMessage({ type: 'error', text: 'Cần nhập kết quả xử lý trước khi hoàn tất báo cáo.' });
      return;
    }
    setProcessingId(reportId);
    setMessage({ type: '', text: '' });
    try {
      await api.put(`/admin/product-reports/${reportId}/decision`, {
        status: decision,
        resolutionNote,
        hideProduct: decision === 'RESOLVED' && Boolean(hideProducts[reportId]),
      });
      setReports(current => current.filter(report => report.reportId !== reportId));
      setMessage({
        type: 'success',
        text: decision === 'RESOLVED' ? 'Báo cáo đã được xử lý.' : 'Báo cáo đã được đánh dấu không hợp lệ.',
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Không thể cập nhật báo cáo.' });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-surface-container-low text-on-surface">
      <header className="sticky top-0 z-30 border-b border-outline-variant bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Link to="/admin" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant hover:bg-surface-container">
              <span className="material-symbols-outlined">arrow_back</span>
            </Link>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold sm:text-xl">Báo cáo sản phẩm</h1>
              <p className="truncate text-xs text-on-surface-variant sm:text-sm">Tiếp nhận và lưu kết quả xử lý phản ánh</p>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-error-container px-3 py-1.5 text-sm font-bold text-error">{reports.length} báo cáo</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:py-10 lg:px-8">
        <section className="mb-6 grid grid-cols-1 gap-3 rounded-2xl border border-outline-variant bg-white p-4 sm:grid-cols-2">
          <label className="min-w-0 text-sm font-bold">
            Trạng thái
            <select value={status} onChange={event => setStatus(event.target.value)} className="mt-2 w-full min-w-0 rounded-xl border border-outline-variant bg-white px-3 py-2.5 font-normal">
              <option value="">Tất cả trạng thái</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label className="min-w-0 text-sm font-bold">
            Loại vi phạm
            <select value={reason} onChange={event => setReason(event.target.value)} className="mt-2 w-full min-w-0 rounded-xl border border-outline-variant bg-white px-3 py-2.5 font-normal">
              <option value="">Tất cả loại vi phạm</option>
              {Object.entries(REASON_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
        </section>

        {message.text && (
          <div className={`mb-6 rounded-xl border px-4 py-3 ${message.type === 'success' ? 'border-green-200 bg-green-50 text-green-800' : 'border-error/20 bg-error-container text-error'}`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="py-20 text-center text-on-surface-variant">Đang tải báo cáo...</div>
        ) : reports.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-outline-variant bg-white px-4 py-16 text-center">
            <span className="material-symbols-outlined text-6xl text-outline">verified</span>
            <h2 className="mt-4 text-xl font-bold">Không có báo cáo phù hợp bộ lọc</h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {reports.map(report => (
              <article key={report.reportId} className="min-w-0 rounded-2xl border border-outline-variant bg-white p-4 shadow-sm sm:p-5">
                <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-[120px_minmax(0,1fr)]">
                  <img src={report.productImageUrl || FALLBACK_IMAGE} alt={report.productName} className="aspect-[4/3] h-full max-h-40 w-full rounded-xl bg-surface-container object-cover sm:aspect-square" onError={event => { event.currentTarget.src = FALLBACK_IMAGE; }} />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-primary">{report.storeName}</p>
                        <Link to={`/products/${report.productId}`} className="mt-1 block break-words text-lg font-bold hover:text-primary">{report.productName}</Link>
                      </div>
                      <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold ${STATUS_STYLES[report.status] || STATUS_STYLES.PENDING}`}>
                        {STATUS_LABELS[report.status] || report.status}
                      </span>
                    </div>
                    <p className="mt-3 text-sm"><strong>Lý do:</strong> {REASON_LABELS[report.reason] || report.reason}</p>
                    <p className="mt-1 break-words text-sm text-on-surface-variant">{report.description || 'Không có mô tả bổ sung.'}</p>
                    <p className="mt-3 break-words text-xs text-on-surface-variant">Người gửi: {report.reporterName} · {report.reporterEmail}</p>
                    <p className="mt-1 text-xs text-on-surface-variant">{new Date(report.createdAt).toLocaleString('vi-VN')}</p>
                  </div>
                </div>

                {report.status === 'PENDING' && (
                  <div className="mt-5 border-t border-surface-container pt-4">
                    <label htmlFor={`note-${report.reportId}`} className="text-sm font-bold">Kết quả xử lý</label>
                    <textarea id={`note-${report.reportId}`} maxLength="1000" rows="3" value={notes[report.reportId] || ''} onChange={event => setNotes(current => ({ ...current, [report.reportId]: event.target.value }))} className="mt-2 w-full min-w-0 resize-y rounded-xl border border-outline-variant px-3 py-2.5" placeholder="Ghi rõ kết quả kiểm tra" />
                    <label className="mt-3 flex items-start gap-2 text-sm">
                      <input type="checkbox" checked={Boolean(hideProducts[report.reportId])} onChange={event => setHideProducts(current => ({ ...current, [report.reportId]: event.target.checked }))} className="mt-0.5" />
                      <span>Ẩn sản phẩm nếu báo cáo hợp lệ</span>
                    </label>
                    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <button type="button" disabled={processingId === report.reportId} onClick={() => decide(report.reportId, 'RESOLVED')} className="rounded-xl bg-primary px-4 py-2.5 font-bold text-white disabled:opacity-50">Xác nhận đã xử lý</button>
                      <button type="button" disabled={processingId === report.reportId} onClick={() => decide(report.reportId, 'REJECTED')} className="rounded-xl border border-outline-variant px-4 py-2.5 font-bold disabled:opacity-50">Báo cáo không hợp lệ</button>
                    </div>
                  </div>
                )}
                {report.resolutionNote && <p className="mt-4 rounded-xl bg-surface-container-low p-3 break-words text-sm"><strong>Kết quả:</strong> {report.resolutionNote}</p>}
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
