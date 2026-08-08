import { Link, useLocation, useNavigate } from 'react-router-dom';

const ITEMS = [
  ['/store-dashboard', 'dashboard', 'Tổng quan'],
  ['/store-products', 'inventory_2', 'Sản phẩm'],
  ['/store-profile', 'settings', 'Hồ sơ'],
  ['/store-analytics', 'analytics', 'Thống kê'],
];

export default function StoreShell({ title, children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = () => { localStorage.clear(); navigate('/login'); };
  return (
    <div className="min-h-screen bg-surface-container-low md:flex overflow-x-hidden">
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-64 flex-col bg-inverse-surface p-4 text-surface-container">
        <Link to="/store-dashboard" className="flex items-center gap-3 px-2 py-3"><span className="material-symbols-outlined grid h-10 w-10 place-items-center rounded-xl bg-primary-container text-white">storefront</span><div><strong className="block text-lg text-primary-fixed">GiftMatch Store</strong><span className="text-xs text-outline">Shop Manager</span></div></Link>
        <nav className="mt-5 flex-1 space-y-1">
          {ITEMS.map(([path, icon, label]) => <Link key={path} to={path} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold ${location.pathname === path ? 'bg-primary-container text-white' : 'text-surface-variant hover:bg-white/10'}`}><span className="material-symbols-outlined">{icon}</span>{label}</Link>)}
        </nav>
        <button onClick={logout} className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-3 text-sm font-bold text-surface-variant hover:bg-white/10"><span className="material-symbols-outlined">logout</span>Đăng xuất</button>
      </aside>
      <div className="min-w-0 flex-1 md:ml-64">
        <header className="sticky top-0 z-30 border-b border-outline-variant bg-white/95 px-4 py-3 sm:px-6"><h1 className="truncate text-xl font-bold text-primary">{title}</h1><nav className="mt-3 flex gap-2 overflow-x-auto pb-1 md:hidden">{ITEMS.map(([path, icon, label]) => <Link key={path} to={path} className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-2 text-xs font-bold ${location.pathname === path ? 'bg-primary text-white' : 'bg-surface-container'}`}><span className="material-symbols-outlined text-[17px]">{icon}</span>{label}</Link>)}</nav></header>
        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
