import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

export default function ProfilePage() {
  const [form, setForm] = useState({ email: '', fullName: '', phoneNumber: '', avatarUrl: '' });
  const [password, setPassword] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    api.get('/profile/me').then(response => {
      setForm({ ...response.data, phoneNumber: response.data.phoneNumber || '', avatarUrl: response.data.avatarUrl || '' });
    }).catch(error => setMessage({ type: 'error', text: error.response?.data?.message || 'Không thể tải hồ sơ.' }))
      .finally(() => setLoading(false));
  }, []);

  const uploadAvatar = async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append('file', file);
    try {
      const response = await api.post('/upload/image', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm(current => ({ ...current, avatarUrl: response.data.url }));
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Không thể tải ảnh đại diện.' });
    } finally { setUploading(false); }
  };

  const save = async event => {
    event.preventDefault();
    if (password.newPassword && password.newPassword !== password.confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp.' }); return;
    }
    setSaving(true); setMessage({ type: '', text: '' });
    try {
      const response = await api.put('/profile/me', {
        fullName: form.fullName, phoneNumber: form.phoneNumber, avatarUrl: form.avatarUrl,
      });
      if (password.newPassword) {
        await api.put('/profile/password', { currentPassword: password.currentPassword, newPassword: password.newPassword });
        setPassword({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
      localStorage.setItem('fullName', response.data.fullName);
      localStorage.setItem('avatar', response.data.avatarUrl || '');
      setMessage({ type: 'success', text: 'Đã cập nhật hồ sơ.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Không thể cập nhật hồ sơ.' });
    } finally { setSaving(false); }
  };

  if (loading) return <main className="py-20 text-center">Đang tải hồ sơ...</main>;
  const inputClass = 'w-full rounded-xl border border-outline-variant bg-white px-4 py-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary';

  return (
    <main className="flex-grow w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-10 overflow-x-hidden">
      <nav className="mb-5 text-sm text-on-surface-variant"><Link to="/home" className="hover:text-primary">Trang chủ</Link> / Hồ sơ</nav>
      <h1 className="text-3xl sm:text-4xl font-bold">Hồ sơ cá nhân</h1>
      <p className="mt-2 text-on-surface-variant">Thông tin được đồng bộ trực tiếp với tài khoản GiftMatch.</p>

      <form onSubmit={save} className="mt-7 rounded-3xl border border-outline-variant bg-white p-5 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="h-24 w-24 shrink-0 rounded-full overflow-hidden bg-surface-container flex items-center justify-center text-3xl font-bold text-primary">
            {form.avatarUrl ? <img src={form.avatarUrl} alt="Ảnh đại diện" className="h-full w-full object-cover" /> : form.fullName?.charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-left min-w-0">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-primary px-4 py-2 font-bold text-primary hover:bg-primary hover:text-white">
              <span className="material-symbols-outlined">photo_camera</span>{uploading ? 'Đang tải...' : 'Chọn ảnh đại diện'}
              <input type="file" accept="image/*" onChange={uploadAvatar} className="hidden" disabled={uploading} />
            </label>
            <p className="mt-2 text-sm text-on-surface-variant break-all">{form.email}</p>
          </div>
        </div>

        {message.text && <div className={`rounded-xl px-4 py-3 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-error-container text-error'}`}>{message.text}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="min-w-0"><span className="mb-1.5 block font-bold">Họ và tên</span><input required maxLength={100} value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className={inputClass} /></label>
          <label className="min-w-0"><span className="mb-1.5 block font-bold">Số điện thoại</span><input maxLength={20} value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} className={inputClass} /></label>
        </div>
        <label><span className="mb-1.5 block font-bold">Email</span><input value={form.email} readOnly className={`${inputClass} bg-surface-container text-on-surface-variant`} /></label>

        <div className="border-t border-outline-variant pt-6">
          <h2 className="text-xl font-bold">Đổi mật khẩu</h2>
          <p className="mt-1 text-sm text-on-surface-variant">Có thể bỏ trống nếu không thay đổi mật khẩu.</p>
          <div className="mt-4 grid grid-cols-1 gap-4">
            <input type="password" placeholder="Mật khẩu hiện tại" value={password.currentPassword} onChange={e => setPassword({ ...password, currentPassword: e.target.value })} className={inputClass} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="password" minLength={8} placeholder="Mật khẩu mới" value={password.newPassword} onChange={e => setPassword({ ...password, newPassword: e.target.value })} className={inputClass} />
              <input type="password" minLength={8} placeholder="Xác nhận mật khẩu mới" value={password.confirmPassword} onChange={e => setPassword({ ...password, confirmPassword: e.target.value })} className={inputClass} />
            </div>
          </div>
        </div>
        <div className="flex justify-end"><button disabled={saving || uploading} className="w-full sm:w-auto rounded-xl bg-primary px-6 py-3 font-bold text-white disabled:opacity-50">{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</button></div>
      </form>
    </main>
  );
}
