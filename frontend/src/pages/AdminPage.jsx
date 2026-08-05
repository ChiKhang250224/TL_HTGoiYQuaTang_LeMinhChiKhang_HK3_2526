import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Admin');
  const [userAvatar, setUserAvatar] = useState(null);

  useEffect(() => {
    // Check if admin
    const role = localStorage.getItem('role');
    if (role !== 'ADMIN') {
      navigate('/login');
    }
    
    const name = localStorage.getItem('fullName');
    if (name) setUserName(name);
    
    const avatar = localStorage.getItem('avatar');
    if (avatar && avatar !== 'null') setUserAvatar(avatar);
  }, [navigate]);

  return (
    <div className="flex h-screen overflow-hidden bg-background font-body-md text-body-md w-full">
      <style>{`
        .glass-card { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.5); }
        .shadow-soft { box-shadow: 0px 4px 20px rgba(152, 70, 34, 0.05); }
        .shadow-hover { box-shadow: 0px 12px 24px rgba(152, 70, 34, 0.08); transition: box-shadow 0.3s ease; }
        .shadow-hover:hover { box-shadow: 0px 16px 32px rgba(152, 70, 34, 0.12); }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: theme('colors.surface-variant'); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: theme('colors.outline'); }
      `}</style>

      {/* SideNavBar */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-inverse-surface dark:bg-surface-container-lowest border-r border-outline-variant shadow-md flex flex-col p-md z-40 hidden md:flex transition-transform duration-300">
        <div className="flex items-center gap-xs mb-lg px-2">
          <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container shadow-soft">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>admin_panel_settings</span>
          </div>
          <div>
            <h2 className="font-display-lg text-[20px] leading-tight text-primary-fixed dark:text-primary tracking-tight">GiftMatch Admin</h2>
            <p className="font-label-sm text-label-sm text-surface-variant/80 dark:text-outline mt-0.5">System Manager</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-2">
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-container text-on-primary-container font-bold shadow-soft transition-transform active:scale-95 duration-150 relative overflow-hidden" to="/admin">
            <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
            <span className="material-symbols-outlined group-hover:text-primary-fixed transition-colors">dashboard</span>
            <span className="font-label-md text-label-md">Dashboard</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-surface-variant hover:bg-surface-variant/10 transition-colors group" to="/admin/users">
            <span className="material-symbols-outlined group-hover:text-primary-fixed transition-colors">group</span>
            <span className="font-label-md text-label-md">Quản lý người dùng</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-surface-variant hover:bg-surface-variant/10 transition-colors group" to="/admin/products">
            <span className="material-symbols-outlined group-hover:text-primary-fixed transition-colors">inventory</span>
            <span className="font-label-md text-label-md">Kiểm duyệt sản phẩm</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-surface-variant hover:bg-surface-variant/10 transition-colors group" to="/admin/reports">
            <span className="material-symbols-outlined group-hover:text-primary-fixed transition-colors">report</span>
            <span className="font-label-md text-label-md">Báo cáo sản phẩm</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-surface-variant hover:bg-surface-variant/10 transition-colors group" to="/admin/labels">
            <span className="material-symbols-outlined group-hover:text-primary-fixed transition-colors">label</span>
            <span className="font-label-md text-label-md">Gắn nhãn AI</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-surface-variant hover:bg-surface-variant/10 transition-colors group" to="/admin/ai">
            <span className="material-symbols-outlined group-hover:text-primary-fixed transition-colors">model_training</span>
            <span className="font-label-md text-label-md">Quản lý Model AI</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-surface-variant hover:bg-surface-variant/10 transition-colors group mt-8 border-t border-surface-variant/20 pt-4" to="/">
            <span className="material-symbols-outlined group-hover:text-primary-fixed transition-colors">arrow_back</span>
            <span className="font-label-md text-label-md">Về trang khách</span>
          </Link>
        </nav>

        <div className="mt-auto pt-4 border-t border-surface-variant/20">
          <div className="mt-4 flex items-center gap-3 px-2 cursor-pointer" onClick={() => {
              localStorage.clear();
              navigate('/login');
          }}>
            {userAvatar ? (
               <img className="w-10 h-10 rounded-full object-cover border-2 border-primary-fixed shadow-sm" src={userAvatar} referrerPolicy="no-referrer" alt="avatar" />
            ) : (
               <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center border-2 border-primary-fixed shadow-sm">
                 <span className="material-symbols-outlined text-primary">person</span>
               </div>
            )}
            <div>
              <p className="font-label-md text-label-md text-on-surface-variant dark:text-surface-container font-semibold truncate max-w-[120px]">{userName}</p>
              <p className="font-label-sm text-label-sm text-surface-variant/70">Đăng xuất</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-0 md:ml-64 h-full overflow-y-auto bg-surface-container-low relative flex flex-col">
        {/* TopNavBar */}
        <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md shadow-sm h-16 w-full px-xl flex justify-between items-center transition-all duration-300">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-on-surface-variant hover:bg-surface-variant/20 rounded-full transition-colors">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h1 className="font-title-md text-title-md text-primary font-bold hidden sm:block">Dashboard Tổng Quan</h1>
          </div>
          <div className="flex items-center gap-xs">
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:opacity-80 rounded-full">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button className="p-2 text-on-surface-variant hover:text-primary transition-colors hover:opacity-80 rounded-full relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-surface"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-xl max-w-7xl mx-auto w-full animate-fade-in pb-20">
          <div className="mb-lg">
            <h2 className="font-display-sm text-[28px] font-bold text-on-surface mb-2">Xin chào, {userName}!</h2>
            <p className="text-body-lg text-on-surface-variant">Tổng quan hoạt động hệ thống GiftMatch AI hôm nay.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg mb-lg">
            
            <div className="glass-card rounded-2xl p-6 shadow-soft hover:shadow-hover transition-all flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                 <div>
                   <p className="text-label-md text-on-surface-variant mb-1 font-semibold">Tổng người dùng</p>
                   <h3 className="font-display-md text-[32px] font-bold text-on-surface">1,248</h3>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                   <span className="material-symbols-outlined">group</span>
                 </div>
              </div>
              <div className="flex items-center gap-1 text-primary font-medium text-label-sm">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                <span>+12% so với tháng trước</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 shadow-soft hover:shadow-hover transition-all flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                 <div>
                   <p className="text-label-md text-on-surface-variant mb-1 font-semibold">Sản phẩm chờ duyệt</p>
                   <h3 className="font-display-md text-[32px] font-bold text-on-surface">24</h3>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                   <span className="material-symbols-outlined">inventory</span>
                 </div>
              </div>
              <div className="flex items-center gap-1 text-error font-medium text-label-sm">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                <span>Cần xử lý ngay</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 shadow-soft hover:shadow-hover transition-all flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                 <div>
                   <p className="text-label-md text-on-surface-variant mb-1 font-semibold">Lượt AI Gợi ý</p>
                   <h3 className="font-display-md text-[32px] font-bold text-on-surface">5,432</h3>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
                   <span className="material-symbols-outlined">auto_awesome</span>
                 </div>
              </div>
              <div className="flex items-center gap-1 text-primary font-medium text-label-sm">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                <span>+45% hôm nay</span>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 shadow-soft hover:shadow-hover transition-all flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                 <div>
                   <p className="text-label-md text-on-surface-variant mb-1 font-semibold">Model Active</p>
                   <h3 className="font-title-md text-[20px] font-bold text-on-surface mt-2 truncate">rf_hybrid_v1.0</h3>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center">
                   <span className="material-symbols-outlined">check_circle</span>
                 </div>
              </div>
              <div className="flex items-center gap-1 text-on-surface-variant font-medium text-label-sm">
                <span>Accuracy: 84.6%</span>
              </div>
            </div>

          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-8 border border-outline-variant shadow-soft">
             <h3 className="font-title-lg text-title-lg font-bold text-on-surface mb-6 flex items-center gap-2">
               <span className="material-symbols-outlined text-primary">bolt</span>
               Thao tác nhanh
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <Link to="/admin/products" className="flex items-center gap-4 p-4 rounded-xl border border-outline-variant hover:border-primary hover:bg-primary/5 transition-all group">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined">fact_check</span>
                  </div>
                  <div>
                    <h4 className="font-title-md font-bold text-on-surface">Duyệt sản phẩm mới</h4>
                    <p className="text-body-sm text-on-surface-variant">Xem và phê duyệt các sản phẩm do Cửa hàng đăng lên.</p>
                  </div>
                </Link>

                <Link to="/admin/reports" className="flex items-center gap-4 p-4 rounded-xl border border-outline-variant hover:border-primary hover:bg-primary/5 transition-all group">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined">report</span>
                  </div>
                  <div>
                    <h4 className="font-title-md font-bold text-on-surface">Xử lý báo cáo sản phẩm</h4>
                    <p className="text-body-sm text-on-surface-variant">Kiểm tra phản ánh của Customer và cập nhật trạng thái xử lý.</p>
                  </div>
                </Link>

                <Link to="/admin/labels" className="flex items-center gap-4 p-4 rounded-xl border border-outline-variant hover:border-primary hover:bg-primary/5 transition-all group">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined">label</span>
                  </div>
                  <div>
                    <h4 className="font-title-md font-bold text-on-surface">Gắn nhãn AI (Data Labeling)</h4>
                    <p className="text-body-sm text-on-surface-variant">Chuẩn hóa dữ liệu sản phẩm để đưa vào model học máy.</p>
                  </div>
                </Link>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
