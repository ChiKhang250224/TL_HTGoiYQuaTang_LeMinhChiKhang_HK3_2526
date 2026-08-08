import { Link, useLocation, useNavigate } from 'react-router-dom';

const ITEMS = [
  ['/admin', 'dashboard', 'Tổng quan'],
  ['/admin/users', 'group', 'Người dùng'],
  ['/admin/stores', 'storefront', 'Cửa hàng'],
  ['/admin/products', 'inventory', 'Sản phẩm'],
  ['/admin/reports', 'report', 'Báo cáo'],
  ['/admin/labels', 'label', 'Taxonomy'],
  ['/admin/analytics', 'monitoring', 'Phân tích'],
  ['/admin/audit', 'history', 'Nhật ký'],
  ['/admin/ai', 'model_training', 'Mô hình AI'],
];

export default function AdminShell({ title, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };
  const active = path => path === '/admin'
    ? location.pathname === path
    : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface md:flex overflow-x-hidden">
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-64 flex-col bg-inverse-surface p-4 text-surface-container">
        <Link to="/admin" className="flex items-center gap-3 px-2 py-3">
          <span className="material-symbols-outlined grid h-10 w-10 place-items-center rounded-xl bg-primary-container text-white">admin_panel_settings</span>
          <div><strong className="block text-lg text-primary-fixed">GiftMatch Admin</strong><span className="text-xs text-outline">System Manager</span></div>
        </Link>
        <nav className="mt-5 flex-1 space-y-1 overflow-y-auto">
          {ITEMS.map(([path, icon, label]) => (
            <Link key={path} to={path} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${active(path) ? 'bg-primary-container text-white' : 'text-surface-variant hover:bg-white/10'}`}>
              <span className="material-symbols-outlined text-[20px]">{icon}</span>{label}
            </Link>
          ))}
        </nav>
        <button onClick={logout} className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 px-3 py-3 text-sm font-bold text-surface-variant hover:bg-white/10">
          <span className="material-symbols-outlined">logout</span>Đăng xuất
        </button>
      </aside>

      <div className="min-w-0 flex-1 md:ml-64">
        <header className="sticky top-0 z-30 border-b border-outline-variant bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <h1 className="min-w-0 truncate text-xl font-bold text-primary">{title}</h1>
            <div className="shrink-0 rounded-full bg-surface-container px-3 py-2 text-sm font-bold" aria-label="Tài khoản quản trị">
              {localStorage.getItem('fullName') || 'Admin'}
            </div>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 md:hidden">
            {ITEMS.map(([path, icon, label]) => (
              <Link key={path} to={path} title={label} className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-2 text-xs font-bold ${active(path) ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'}`}>
                <span className="material-symbols-outlined text-[17px]">{icon}</span>{label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
