import { useCallback, useEffect, useState } from 'react';
import AdminShell from '../components/AdminShell';
import api from '../utils/api';

export default function AdminAuditPage() {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({ action: '', targetType: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = Object.fromEntries(Object.entries({ ...filters, limit: 150 }).filter(([, value]) => value !== ''));
      const response = await api.get('/admin/audit-logs', { params });
      setLogs(response.data || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Không thể tải nhật ký.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [load]);

  return <AdminShell title="Nhật ký quản trị">
    <div className="mb-6"><h2 className="text-2xl font-bold">Audit Log</h2><p className="text-on-surface-variant">Theo dõi thao tác quan trọng mà không lưu mật khẩu, JWT hoặc OAuth token.</p></div>
    <div className="mb-5 grid gap-3 rounded-2xl bg-white p-4 sm:grid-cols-2">
      <input value={filters.action} onChange={event => setFilters(current => ({ ...current, action: event.target.value }))} placeholder="Lọc theo hành động" className="min-w-0 rounded-xl border border-outline-variant px-4 py-3" />
      <input value={filters.targetType} onChange={event => setFilters(current => ({ ...current, targetType: event.target.value }))} placeholder="Loại đối tượng: USER, PRODUCT..." className="min-w-0 rounded-xl border border-outline-variant px-4 py-3" />
    </div>
    {error && <p className="mb-4 rounded-xl bg-error-container p-4 text-error">{error}</p>}
    {loading && <p className="rounded-2xl bg-white p-8 text-center text-on-surface-variant">Đang tải nhật ký quản trị...</p>}
    {!loading && <div className="space-y-3">
      {logs.map(log => <article key={log.auditLogId} className="min-w-0 rounded-2xl border border-outline-variant bg-white p-4 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-2"><div className="min-w-0"><strong className="break-words text-primary">{log.action}</strong><p className="break-words text-sm">{log.summary}</p></div><time className="shrink-0 text-xs text-on-surface-variant">{new Date(log.createdAt).toLocaleString('vi-VN')}</time></div><p className="mt-2 break-all text-xs text-on-surface-variant">{log.actorName} · {log.actorEmail} · {log.targetType}{log.targetId ? ` #${log.targetId}` : ''}</p></article>)}
      {logs.length === 0 && <p className="rounded-2xl bg-white p-8 text-center text-on-surface-variant">Chưa có nhật ký phù hợp.</p>}
    </div>}
  </AdminShell>;
}
