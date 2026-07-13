import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function StoreProductsPage() {
  const userName = localStorage.getItem('fullName') || 'Quản lý';
  const userAvatar = localStorage.getItem('avatar');

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex w-full">
      {/* SideNavBar */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-inverse-surface dark:bg-surface-container-lowest border-r border-outline-variant shadow-md flex flex-col p-md z-40 hidden md:flex transition-transform duration-300">
        <div className="flex items-center gap-xs mb-lg px-2">
          <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container shadow-sm">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>storefront</span>
          </div>
          <div>
            <h2 className="font-display-lg text-[20px] leading-tight text-primary-fixed dark:text-primary tracking-tight">GiftMatch Admin</h2>
            <p className="font-label-sm text-label-sm text-surface-variant/80 dark:text-outline mt-0.5">Shop Manager</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-2">
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-surface-variant hover:bg-surface-variant/10 transition-colors group" to="/store-dashboard">
            <span className="material-symbols-outlined group-hover:text-primary-fixed transition-colors">dashboard</span>
            <span className="font-label-md text-label-md">Dashboard</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-container text-on-primary-container font-bold shadow-sm transition-transform active:scale-95 duration-150 relative overflow-hidden" to="/store-products">
            <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>inventory_2</span>
            <span className="font-label-md text-label-md">Sản phẩm</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-surface-variant hover:bg-surface-variant/10 transition-colors group" to="/store-profile">
            <span className="material-symbols-outlined group-hover:text-primary-fixed transition-colors">settings</span>
            <span className="font-label-md text-label-md">Cài đặt cửa hàng</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-surface-variant hover:bg-surface-variant/10 transition-colors group" to="/store-analytics">
            <span className="material-symbols-outlined group-hover:text-primary-fixed transition-colors">analytics</span>
            <span className="font-label-md text-label-md">Thống kê</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-surface-variant hover:bg-surface-variant/10 transition-colors group mt-8 border-t border-surface-variant/20 pt-4" to="/">
            <span className="material-symbols-outlined group-hover:text-primary-fixed transition-colors">arrow_back</span>
            <span className="font-label-md text-label-md">Về trang chính</span>
          </Link>
        </nav>

        <div className="mt-auto pt-4 border-t border-surface-variant/20">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary-fixed text-on-primary-fixed font-label-md text-label-md font-semibold hover:bg-primary-fixed-dim transition-colors active:scale-95 duration-150 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            New Product
          </button>
          <div className="mt-4 flex items-center gap-3 px-2">
            {userAvatar && userAvatar !== 'null' && userAvatar.startsWith('http') ? (
               <img className="w-10 h-10 rounded-full object-cover border-2 border-primary-fixed shadow-sm" src={userAvatar} referrerPolicy="no-referrer" />
            ) : (
               <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-primary font-bold border-2 border-primary-fixed shadow-sm">
                  {userName.charAt(0)}
               </div>
            )}
            <div>
              <p className="font-label-md text-label-md text-on-surface-variant dark:text-surface-container font-semibold truncate max-w-[120px]">{userName}</p>
              <p className="font-label-sm text-label-sm text-surface-variant/70">Quản lý</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-0 md:ml-64 flex flex-col min-h-screen bg-surface-container-lowest">
        {/* TopNavBar */}
        <header className="sticky top-0 h-16 bg-surface/80 backdrop-blur-md shadow-sm flex justify-between items-center px-xl z-30 transition-all duration-300">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-on-surface-variant hover:bg-surface-variant/20 rounded-full transition-colors">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="font-title-md text-title-md text-primary font-bold">Quản lý Cửa hàng</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-on-surface-variant hover:text-primary transition-colors hover:opacity-80 relative p-2">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-surface"></span>
            </button>
            <Link to="/store-profile" className="text-on-surface-variant hover:text-primary transition-colors hover:opacity-80 p-2">
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-gutter md:p-xl animate-fade-in-up">
          {/* Header & Action */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-lg">
            <h1 className="font-headline-lg text-headline-lg text-on-background tracking-tight">Quản lý sản phẩm</h1>
            <button className="bg-primary-container text-on-primary px-6 py-3 rounded-[12px] font-label-md flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow active:scale-95">
              <span className="material-symbols-outlined">add</span>
              Thêm sản phẩm
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-xl">
            <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant flex flex-col items-center justify-center hover:shadow-md transition-shadow">
              <div className="text-[32px] font-bold text-tertiary-container bg-tertiary-container/10 px-6 py-2 rounded-lg mb-2">12</div>
              <div className="text-tertiary-container font-label-md uppercase tracking-wider font-semibold">Đã duyệt</div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant flex flex-col items-center justify-center hover:shadow-md transition-shadow">
              <div className="text-[32px] font-bold text-[#D97706] bg-[#FEF3C7] px-6 py-2 rounded-lg mb-2">3</div>
              <div className="text-[#D97706] font-label-md uppercase tracking-wider font-semibold">Chờ duyệt</div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant flex flex-col items-center justify-center hover:shadow-md transition-shadow">
              <div className="text-[32px] font-bold text-error bg-error-container px-6 py-2 rounded-lg mb-2">1</div>
              <div className="text-error font-label-md uppercase tracking-wider font-semibold">Bị từ chối</div>
            </div>
          </div>

          {/* Product Table */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant text-on-surface-variant font-label-md">
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">Hình ảnh</th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">Tên sản phẩm</th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">Giá</th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">Loại quà</th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">Trạng thái</th>
                    <th className="px-6 py-4 font-semibold whitespace-nowrap">
                      <div className="flex items-center gap-1 text-secondary">
                        <span className="material-symbols-outlined text-[18px]">psychology</span>
                        Số lần gợi ý AI
                      </div>
                    </th>
                    <th className="px-6 py-4 font-semibold text-right whitespace-nowrap">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {/* Row 1 */}
                  <tr className="hover:bg-surface-container-low/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 rounded-lg bg-surface-variant overflow-hidden shadow-sm">
                        <img className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSjsXEpJbhgEIKIZnSYYyTWQq2foIvZSwfMiVGrvBRcMA1SHQ3zPVwiTHVuGgJi9kwNbu5d4N7fEFus9eU9CT9AgKOHvI5eT0O-8aDVBls7_vhJ69mez6QOmjfY9BIQhSDb7H1aQSoUZEulZRaCMxq6rqMbKGoiiymSekaMWpATIWxsh6iOscKVbSbnrL778jSYQsJuDV7dBH7kwodoyJgDiyV0Q42_UK_yBX22HtcecnoKZw0OcS7xQ" />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-title-md text-on-background font-semibold">Skincare Box</td>
                    <td className="px-6 py-4 font-medium text-on-surface-variant">450.000đ</td>
                    <td className="px-6 py-4">
                      <span className="bg-secondary-container/20 text-secondary-container px-3 py-1 rounded-full font-label-sm font-medium">Mỹ phẩm</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-tertiary-container/10 text-tertiary-container px-3 py-1 rounded-full font-label-sm border border-tertiary-container/20 font-medium">Đã duyệt</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="bg-gradient-to-r from-primary-container to-secondary-container text-white px-3 py-1 rounded-lg font-bold text-sm shadow-sm inline-block">147</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-on-surface-variant hover:text-primary bg-surface hover:bg-surface-variant transition-colors p-2 rounded-lg shadow-sm border border-outline-variant">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-surface-container-low/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 rounded-lg bg-surface-variant overflow-hidden shadow-sm">
                        <img className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCq4BFMVxInXYOjxxmCMCMWYZjS3tIX75LEY_k_f1UtFJ733Pmq6jJyK67hTtbIPS96pPshCkBpl_fnKPYSk-TGO9FqxsD2JZBaep7IXJt8KdpDxdxgKZBkGHXl2bBzdPaId5PEegF442QVayMcq4ppx5Zd2AhfsC4Xitb7DTBAyi6_zg8W1-lxN6ktzarjMlm5jlz-IJOXtLlFPjx_Ubl8oqLPePKJk_lto9-b3uBzOhX5xTWNgRFOvQ" />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-title-md text-on-background font-semibold">Nến thơm cao cấp</td>
                    <td className="px-6 py-4 font-medium text-on-surface-variant">250.000đ</td>
                    <td className="px-6 py-4">
                      <span className="bg-secondary-container/20 text-secondary-container px-3 py-1 rounded-full font-label-sm font-medium">Trang trí</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-tertiary-container/10 text-tertiary-container px-3 py-1 rounded-full font-label-sm border border-tertiary-container/20 font-medium">Đã duyệt</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="bg-gradient-to-r from-primary-container to-secondary-container text-white px-3 py-1 rounded-lg font-bold text-sm shadow-sm inline-block">89</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-on-surface-variant hover:text-primary bg-surface hover:bg-surface-variant transition-colors p-2 rounded-lg shadow-sm border border-outline-variant">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-surface-container-low/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 rounded-lg bg-surface-variant overflow-hidden shadow-sm">
                        <img className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUeYwAe7eEDwuyXGgEZxzBGlVfpNCk3Mj0gakYGDdI1D57GIR8rjfrxKTKCeu8id9dH_hEqiIq4KpzcNaaBsj4SBGyMAD8djl1Ml0e4MfOI44uXAaKYZc7EzKLIM_I06FWin4xrpkH5XlRvszQLlDGtW5mSujyLOaY_AP7pdfZE-13rjMxy35gFFJd_wnfAQPjvsgEXDU_MZPxyoiQrXsnZUT4wAcsFLRMDbySzzTRF-1rhkGog0T0gw" />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-title-md text-on-background font-semibold">Đồng hồ thông minh</td>
                    <td className="px-6 py-4 font-medium text-on-surface-variant">1.200.000đ</td>
                    <td className="px-6 py-4">
                      <span className="bg-secondary-container/20 text-secondary-container px-3 py-1 rounded-full font-label-sm font-medium">Công nghệ</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-[#FEF3C7] text-[#D97706] px-3 py-1 rounded-full font-label-sm border border-[#FCD34D] font-medium">Chờ duyệt</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="bg-surface-variant text-on-surface-variant px-3 py-1 rounded-lg font-bold text-sm inline-block">0</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-on-surface-variant hover:text-primary bg-surface hover:bg-surface-variant transition-colors p-2 rounded-lg shadow-sm border border-outline-variant">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                    </td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="hover:bg-surface-container-low/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 rounded-lg bg-surface-variant overflow-hidden shadow-sm">
                        <img className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2tLZKl5VgiaIVDb3DYHnGvZqUK14Kj_HNrzk9aTydo3ibNk5_HUiOMfZEY7RHfEgxjrjvF6msquQqpuKNjsChN0DzDupd1U8imQHD2nhbRjnvCTC6UlMdYepwyMfm8is_veUb3vBAv1BoBD9IhbWQBx55BAUn6gvoQItf4tII93q0g6zVNXo4d25_pqWyq_QnmqNmSGjnJUrJx2RI21gj47ETR7ecX9tJ58s-QWPU9zEFcOTgsL98fA" />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-title-md text-on-background font-semibold">Gấu bông khổng lồ</td>
                    <td className="px-6 py-4 font-medium text-on-surface-variant">600.000đ</td>
                    <td className="px-6 py-4">
                      <span className="bg-secondary-container/20 text-secondary-container px-3 py-1 rounded-full font-label-sm font-medium">Đồ chơi</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-error-container text-error px-3 py-1 rounded-full font-label-sm border border-error/20 font-medium">Bị từ chối</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="bg-gradient-to-r from-primary-container to-secondary-container text-white px-3 py-1 rounded-lg font-bold text-sm shadow-sm inline-block opacity-60">12</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-on-surface-variant hover:text-primary bg-surface hover:bg-surface-variant transition-colors p-2 rounded-lg shadow-sm border border-outline-variant">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                    </td>
                  </tr>

                  {/* Row 5 */}
                  <tr className="hover:bg-surface-container-low/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 rounded-lg bg-surface-variant overflow-hidden shadow-sm">
                        <img className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA60Btpuf7EUvUX-oqtC5e-o0-nA79Yyx5Dyx7vX9DCDtikAN9rNvzbipq5bzIIjb1edwgUtcA1T9Bg3XWeBK6Jc47deRCdUSi80mqkELRhvBcShAXjvBdSxRkjI2EIBBM-4gkxfdYkfeYPLZ9Job6xMHTMzEPd5Lhzkf9j_fwfo3LmTuNxzAkngSHZF9aPKLbAdBcxpkWB06rYzUXP0muNEh8CAONc0g1qqwYSNfz-YhNq7GStKN8lmA" />
                      </div>
                    </td>
                    <td className="px-6 py-4 font-title-md text-on-background font-semibold">Bộ ấm trà gốm sứ</td>
                    <td className="px-6 py-4 font-medium text-on-surface-variant">850.000đ</td>
                    <td className="px-6 py-4">
                      <span className="bg-secondary-container/20 text-secondary-container px-3 py-1 rounded-full font-label-sm font-medium">Gia dụng</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-tertiary-container/10 text-tertiary-container px-3 py-1 rounded-full font-label-sm border border-tertiary-container/20 font-medium">Đã duyệt</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="bg-gradient-to-r from-primary-container to-secondary-container text-white px-3 py-1 rounded-lg font-bold text-sm shadow-sm inline-block">32</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-on-surface-variant hover:text-primary bg-surface hover:bg-surface-variant transition-colors p-2 rounded-lg shadow-sm border border-outline-variant">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
