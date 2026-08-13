import { useCallback, useEffect, useState } from 'react';
import AdminShell from '../components/AdminShell';
import api from '../utils/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ keyword: '', role: '', active: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== ''));
      const response = await api.get('/admin/users', { params });
      setUsers(response.data);
      setMessage('');
    } catch (error) { setMessage(error.response?.data?.message || 'Không thể tải danh sách người dùng.'); }
    finally { setLoading(false); }
  }, [filters]);
  useEffect(() => { const timer = setTimeout(load, 250); return () => clearTimeout(timer); }, [load]);

  const toggle = async user => {
    setMessage('');
    try {
      const response = await api.put(`/admin/users/${user.userId}/active`, { active: !user.active });
      setUsers(current => current.map(item => item.userId === user.userId ? response.data : item));
      setMessage(`Đã ${response.data.active ? 'mở khóa' : 'khóa'} tài khoản ${response.data.email}.`);
    } catch (error) { setMessage(error.response?.data?.message || 'Không thể cập nhật trạng thái tài khoản.'); }
  };

  return <AdminShell title="Quản lý người dùng">
    <div className="mb-6"><h2 className="text-2xl font-bold">Tài khoản hệ thống</h2><p className="text-on-surface-variant">Tìm kiếm, lọc và kiểm soát trạng thái truy cập theo vai trò.</p></div>
    <div className="mb-5 grid gap-3 rounded-2xl bg-white p-4 shadow-sm sm:grid-cols-3">
      <input value={filters.keyword} onChange={e => setFilters({ ...filters, keyword: e.target.value })} placeholder="Tên hoặc email" className="min-w-0 rounded-xl border border-outline-variant px-4 py-3" />
      <select value={filters.role} onChange={e => setFilters({ ...filters, role: e.target.value })} className="rounded-xl border border-outline-variant px-4 py-3"><option value="">Mọi vai trò</option><option>CUSTOMER</option><option>STORE</option><option>ADMIN</option></select>
      <select value={filters.active} onChange={e => setFilters({ ...filters, active: e.target.value })} className="rounded-xl border border-outline-variant px-4 py-3"><option value="">Mọi trạng thái</option><option value="true">Đang hoạt động</option><option value="false">Đã khóa</option></select>
    </div>
    {message && <p className={`mb-4 rounded-xl px-4 py-3 ${message.startsWith('Đã') ? 'bg-green-50 text-green-800' : 'bg-error-container text-error'}`}>{message}</p>}
    <div className="overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="bg-surface-container"><tr><th className="p-4">Người dùng</th><th className="p-4">Vai trò</th><th className="p-4">Ngày tạo</th><th className="p-4">Trạng thái</th><th className="p-4 text-right">Thao tác</th></tr></thead><tbody>{!loading && users.map(user => <tr key={user.userId} className="border-t border-outline-variant"><td className="p-4"><strong className="block">{user.fullName}</strong><span className="break-all text-sm text-on-surface-variant">{user.email}</span></td><td className="p-4">{user.role}</td><td className="p-4">{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td><td className="p-4"><span className={`rounded-full px-3 py-1 text-xs font-bold ${user.active ? 'bg-green-100 text-green-800' : 'bg-error-container text-error'}`}>{user.active ? 'Hoạt động' : 'Đã khóa'}</span></td><td className="p-4 text-right"><button onClick={() => toggle(user)} className={`rounded-xl px-4 py-2 text-sm font-bold ${user.active ? 'border border-error text-error' : 'bg-primary text-white'}`}>{user.active ? 'Khóa' : 'Mở khóa'}</button></td></tr>)}</tbody></table></div>{loading && <p className="p-8 text-center">Đang tải...</p>}{!loading && users.length === 0 && <p className="p-8 text-center text-on-surface-variant">Không tìm thấy tài khoản phù hợp.</p>}</div>
  </AdminShell>;
}
