import { useEffect, useState } from 'react';
import StoreShell from '../components/StoreShell';
import api from '../utils/api';

export default function StoreProfilePage() {
  const [form, setForm] = useState({ storeName: '', description: '', address: '', phone: '', logoUrl: '', email: '', status: '', reviewNote: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const loadProfile = () => api.get('/store/profile/me').then(response => {
    setForm({ ...response.data, description: response.data.description || '', address: response.data.address || '', phone: response.data.phone || '', logoUrl: response.data.logoUrl || '' });
  }).catch(error => setMessage({ type: 'error', text: error.response?.data?.message || 'Không thể tải hồ sơ cửa hàng.' })).finally(() => setLoading(false));

  useEffect(() => { loadProfile(); }, []);

  const uploadLogo = async event => {
    const file = event.target.files?.[0]; if (!file) return;
    setUploading(true); const data = new FormData(); data.append('file', file);
    try { const response = await api.post('/upload/image', data, { headers: { 'Content-Type': 'multipart/form-data' } }); setForm(current => ({ ...current, logoUrl: response.data.url })); }
    catch (error) { setMessage({ type: 'error', text: error.response?.data?.message || 'Không thể tải logo.' }); }
    finally { setUploading(false); }
  };

  const save = async event => {
    event.preventDefault(); setSaving(true); setMessage({ type: '', text: '' });
    try { const response = await api.put('/store/profile/me', form); setForm(response.data); setMessage({ type: 'success', text: 'Đã cập nhật hồ sơ cửa hàng.' }); }
    catch (error) { setMessage({ type: 'error', text: error.response?.data?.message || 'Không thể cập nhật hồ sơ cửa hàng.' }); }
    finally { setSaving(false); }
  };

  if (loading) return <StoreShell title="Hồ sơ cửa hàng"><div className="py-20 text-center">Đang tải hồ sơ cửa hàng...</div></StoreShell>;
  const inputClass = 'w-full rounded-xl border border-outline-variant bg-white px-4 py-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary';
  return (
    <StoreShell title="Hồ sơ cửa hàng">
      <div className="mx-auto max-w-5xl">
        <form onSubmit={save} className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6">
          <aside className="rounded-3xl border border-outline-variant bg-white p-6 h-fit text-center min-w-0">
            <div className="mx-auto h-32 w-32 rounded-2xl overflow-hidden bg-surface-container flex items-center justify-center text-4xl font-bold text-primary">{form.logoUrl ? <img src={form.logoUrl} alt="Logo cửa hàng" className="h-full w-full object-cover" /> : form.storeName?.charAt(0)}</div>
            <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-primary px-4 py-2 font-bold text-primary"><span className="material-symbols-outlined">upload</span>{uploading ? 'Đang tải...' : 'Đổi logo'}<input type="file" accept="image/*" onChange={uploadLogo} className="hidden" /></label>
            <div className="mt-4 rounded-full bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary break-words">{form.status || 'PENDING'}</div>
            {form.reviewNote && <p className="mt-3 break-words rounded-xl bg-surface-container p-3 text-left text-sm"><strong>Phản hồi Admin:</strong><br/>{form.reviewNote}</p>}
          </aside>
          <section className="rounded-3xl border border-outline-variant bg-white p-5 sm:p-8 shadow-sm space-y-5 min-w-0">
            <div><h2 className="text-2xl font-bold">Thông tin hiển thị</h2><p className="mt-1 text-on-surface-variant">Dữ liệu được sử dụng tại catalog và kết quả gợi ý.</p></div>
            {message.text && <div className={`rounded-xl px-4 py-3 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-error-container text-error'}`}>{message.text}</div>}
            <label><span className="mb-1.5 block font-bold">Tên cửa hàng</span><input required maxLength={150} value={form.storeName} onChange={e => setForm({ ...form, storeName: e.target.value })} className={inputClass} /></label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><label><span className="mb-1.5 block font-bold">Email</span><input value={form.email} readOnly className={`${inputClass} bg-surface-container`} /></label><label><span className="mb-1.5 block font-bold">Điện thoại</span><input maxLength={20} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={inputClass} /></label></div>
            <label><span className="mb-1.5 block font-bold">Địa chỉ</span><input maxLength={500} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className={inputClass} /></label>
            <label><span className="mb-1.5 block font-bold">Mô tả</span><textarea rows={6} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={`${inputClass} resize-y`} /></label>
            <div className="flex justify-end"><button disabled={saving || uploading} className="w-full sm:w-auto rounded-xl bg-primary px-6 py-3 font-bold text-white disabled:opacity-50">{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</button></div>
          </section>
        </form>
      </div>
    </StoreShell>
  );
}
