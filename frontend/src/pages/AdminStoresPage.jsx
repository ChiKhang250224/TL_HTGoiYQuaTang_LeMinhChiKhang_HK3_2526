import { useCallback, useEffect, useState } from 'react';
import AdminShell from '../components/AdminShell';
import api from '../utils/api';

export default function AdminStoresPage() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ keyword: '', status: '' });
  const [notes, setNotes] = useState({});
  const [message, setMessage] = useState('');
  const load = useCallback(async () => {
    try { const response = await api.get('/admin/stores', { params: filters }); setStores(response.data); }
    catch (error) { setMessage(error.response?.data?.message || 'Không thể tải danh sách cửa hàng.'); }
  }, [filters]);
  useEffect(() => { const timer = setTimeout(load, 250); return () => clearTimeout(timer); }, [load]);
  const decide = async (store, status) => {
    try {
      const response = await api.put(`/admin/stores/${store.storeId}/decision`, { status, note: notes[store.storeId] || '' });
      setStores(current => current.map(item => item.storeId === store.storeId ? response.data : item));
      setMessage('Đã cập nhật trạng thái cửa hàng.');
    } catch (error) { setMessage(error.response?.data?.message || 'Không thể xử lý cửa hàng.'); }
  };
  return <AdminShell title="Kiểm duyệt cửa hàng">
    <div className="mb-6"><h2 className="text-2xl font-bold">Hồ sơ Store</h2><p className="text-on-surface-variant">Store chỉ được đăng sản phẩm sau khi hồ sơ chuyển sang APPROVED.</p></div>
    <div className="mb-5 grid gap-3 rounded-2xl bg-white p-4 sm:grid-cols-2"><input placeholder="Tên cửa hàng hoặc email" value={filters.keyword} onChange={e => setFilters({ ...filters, keyword: e.target.value })} className="rounded-xl border border-outline-variant px-4 py-3"/><select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} className="rounded-xl border border-outline-variant px-4 py-3"><option value="">Mọi trạng thái</option><option>PENDING</option><option>APPROVED</option><option>REJECTED</option></select></div>
    {message && <p className={`mb-4 rounded-xl px-4 py-3 ${message.startsWith('Đã') ? 'bg-green-50 text-green-800' : 'bg-error-container text-error'}`}>{message}</p>}
    <div className="grid gap-4 lg:grid-cols-2">{stores.map(store => <article key={store.storeId} className="min-w-0 rounded-2xl border border-outline-variant bg-white p-5 shadow-sm"><div className="flex min-w-0 items-start gap-4"><div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-surface-container text-xl font-bold text-primary">{store.logoUrl ? <img src={store.logoUrl} className="h-full w-full object-cover" alt=""/> : store.storeName.charAt(0)}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="break-words text-lg font-bold">{store.storeName}</h3><span className="rounded-full bg-surface-container px-3 py-1 text-xs font-bold">{store.status}</span></div><p className="break-all text-sm text-on-surface-variant">{store.ownerEmail}</p></div></div><p className="mt-4 break-words text-sm text-on-surface-variant">{store.description || 'Chưa có mô tả.'}</p><textarea value={notes[store.storeId] || ''} onChange={e => setNotes({ ...notes, [store.storeId]: e.target.value })} rows={2} maxLength={1000} placeholder="Ghi chú duyệt hoặc lý do từ chối" className="mt-4 w-full resize-y rounded-xl border border-outline-variant px-3 py-2"/><div className="mt-3 flex flex-wrap gap-2"><button onClick={() => decide(store, 'APPROVED')} className="rounded-xl bg-primary px-4 py-2 font-bold text-white">Phê duyệt</button><button onClick={() => decide(store, 'REJECTED')} className="rounded-xl border border-error px-4 py-2 font-bold text-error">Từ chối</button></div>{store.reviewNote && <p className="mt-3 rounded-xl bg-surface-container p-3 text-sm"><strong>Ghi chú gần nhất:</strong> {store.reviewNote}</p>}</article>)}</div>
  </AdminShell>;
}
