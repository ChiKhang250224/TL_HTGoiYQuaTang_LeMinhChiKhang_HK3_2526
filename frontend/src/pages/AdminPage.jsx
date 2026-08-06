import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminShell from '../components/AdminShell';
import api from '../utils/api';

const formatPercent = value => value == null ? 'Chưa có' : `${(Number(value) * 100).toFixed(2)}%`;
export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api.get('/admin/analytics/dashboard').then(response => setStats(response.data)).catch(e => setError(e.response?.data?.message || 'Không thể tải thống kê hệ thống.')); }, []);
  const cards = stats ? [
    ['Tổng người dùng', stats.totalUsers, 'group', `${stats.activeUsers} đang hoạt động`],
    ['Store chờ duyệt', stats.pendingStores, 'storefront', 'Hồ sơ cần kiểm tra'],
    ['Sản phẩm chờ duyệt', stats.pendingProducts, 'inventory', `${stats.approvedProducts} đã duyệt`],
    ['Lượt gợi ý', stats.totalRecommendations, 'auto_awesome', `${stats.totalFeedback} phản hồi`],
  ] : [];
  const actions = [
    ['/admin/stores', 'storefront', 'Duyệt cửa hàng', 'Kiểm tra hồ sơ Store đang chờ.'],
    ['/admin/products', 'fact_check', 'Duyệt sản phẩm', 'Gán nhãn và phê duyệt catalog.'],
    ['/admin/reports', 'report', 'Xử lý báo cáo', 'Tiếp nhận phản ánh từ Customer.'],
    ['/admin/analytics', 'monitoring', 'Phân tích AI', 'Theo dõi phản hồi và chất lượng dữ liệu.'],
    ['/admin/audit', 'history', 'Nhật ký quản trị', 'Truy vết thao tác quan trọng.'],
    ['/admin/ai', 'model_training', 'Quản lý mô hình', 'Tải lên, kích hoạt và nạp lại artifact.'],
  ];
  return <AdminShell title="Dashboard tổng quan"><div className="mb-6"><h2 className="text-2xl font-bold">Xin chào, {localStorage.getItem('fullName') || 'Admin'}</h2><p className="text-on-surface-variant">Số liệu bên dưới được lấy trực tiếp từ database.</p></div>{error && <p className="mb-4 rounded-xl bg-error-container p-4 text-error">{error}</p>}{!stats && !error && <p className="rounded-2xl bg-white p-8 text-center">Đang tải thống kê...</p>}{stats && <><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label, value, icon, note]) => <div key={label} className="rounded-2xl border border-outline-variant bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold text-on-surface-variant">{label}</p><strong className="mt-2 block text-3xl">{Number(value).toLocaleString('vi-VN')}</strong></div><span className="material-symbols-outlined grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">{icon}</span></div><p className="mt-4 text-sm text-on-surface-variant">{note}</p></div>)}</div><div className="mt-5 grid gap-4 lg:grid-cols-2"><div className="rounded-2xl border border-outline-variant bg-white p-5"><p className="text-sm text-on-surface-variant">Mô hình đang đăng ký</p><strong className="mt-2 block break-words text-xl">{stats.activeModelVersion || 'Chưa xác định'}</strong><p className="mt-2 text-sm">Top-5 Accuracy: <strong>{formatPercent(stats.top5Accuracy)}</strong></p></div><div className="rounded-2xl border border-outline-variant bg-white p-5"><p className="text-sm text-on-surface-variant">Quy mô dữ liệu vận hành</p><div className="mt-3 flex flex-wrap gap-2"><span className="rounded-full bg-surface-container px-3 py-2 text-sm">{stats.totalProducts} sản phẩm</span><span className="rounded-full bg-surface-container px-3 py-2 text-sm">{stats.storeUsers} Store</span><span className="rounded-full bg-surface-container px-3 py-2 text-sm">{stats.totalNotifications} thông báo</span></div></div></div><section className="mt-6 rounded-2xl border border-outline-variant bg-white p-5"><h3 className="text-lg font-bold">Thao tác nhanh</h3><div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{actions.map(([path, icon, label, description]) => <Link key={path} to={path} className="flex min-w-0 items-start gap-3 rounded-xl border border-outline-variant p-4 hover:border-primary hover:bg-primary/5"><span className="material-symbols-outlined shrink-0 text-primary">{icon}</span><div className="min-w-0"><strong className="break-words">{label}</strong><p className="break-words text-sm text-on-surface-variant">{description}</p></div></Link>)}</div></section></>}</AdminShell>;
}
