import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function UserHome() {
  const [fullName, setFullName] = useState('Huyền');

  useEffect(() => {
    const storedName = localStorage.getItem('fullName');
    if (storedName) {
      setFullName(storedName);
    }
  }, []);

  return (
    <main className="flex-grow max-w-container-max mx-auto w-full px-gutter md:px-xl py-lg">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-container to-primary-fixed-dim rounded-2xl md:rounded-[32px] p-8 md:p-12 mb-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between shadow-md">
        <div className="relative z-10 max-w-xl text-center md:text-left">
          <h1 className="text-[28px] md:text-display-lg text-white font-extrabold mb-4 leading-tight font-heading">
            Chào mừng trở lại, {fullName}! 👋
          </h1>
          <p className="text-body-lg text-white/90 font-medium">Hôm nay bạn muốn tìm quà cho ai?</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to="/recommendations" className="bg-white text-primary font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">auto_awesome</span>
              Bắt đầu ngay
            </Link>
          </div>
        </div>
        <div className="hidden md:block relative w-1/3 aspect-square">
          <img 
            className="w-full h-full object-contain drop-shadow-2xl animate-bounce" 
            style={{ animationDuration: '3s' }}
            alt="3D floating gift box" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIV-my3Y6hLYsuYDbH4eNRj8iyyFXzQW-_QNPi_c2ezlfQiiTlSDQG-GRjxU_bLdhNp56TNsCqb7Km1tcjpFDXuCYU497zKAcWKV-15pFLhAQN824cp_3pgg8N0L8LPUbk_poQQTUMjtN-Tikz-WTxqvcaF4TXU5zusKXKADOP4MXHL90rIMjl1575EYvY1EnWrQO7KtSljblbPnO1gZCi_MBeUaO8CPVsk84iwjESMQUf4OuLg15QIQ" 
          />
        </div>
        {/* Decorative circle */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </section>

      {/* Quick Action Row */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
        {/* Action 1 */}
        <Link to="/recommendations" className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-surface-container flex items-center gap-5 cursor-pointer active:scale-[0.98]">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-container to-primary-fixed-dim flex items-center justify-center text-white shadow-inner">
            <span className="material-symbols-outlined text-3xl">feature_search</span>
          </div>
          <div>
            <h3 className="font-bold text-title-md text-on-surface">Tìm quà ngay</h3>
            <p className="text-label-md text-on-surface-variant mt-1">Trình cố vấn AI thông minh</p>
          </div>
        </Link>
        {/* Action 2 */}
        <Link to="/dashboard" className="group bg-secondary-fixed/30 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-secondary-fixed/50 flex items-center gap-5 cursor-pointer active:scale-[0.98]">
          <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-white shadow-inner">
            <span className="material-symbols-outlined text-3xl">menu_book</span>
          </div>
          <div>
            <h3 className="font-bold text-title-md text-on-surface">Sổ tay người nhận</h3>
            <p className="text-label-md text-on-surface-variant mt-1">Quản lý danh sách ưu tiên</p>
          </div>
        </Link>
        {/* Action 3 */}
        <Link to="/recommendations" className="group bg-tertiary-fixed/30 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-tertiary-fixed/50 flex items-center gap-5 cursor-pointer active:scale-[0.98]">
          <div className="w-14 h-14 rounded-xl bg-tertiary flex items-center justify-center text-white shadow-inner">
            <span className="material-symbols-outlined text-3xl">magic_button</span>
          </div>
          <div>
            <h3 className="font-bold text-title-md text-on-surface">Gợi ý hôm nay</h3>
            <p className="text-label-md text-on-surface-variant mt-1">Xu hướng mới nhất</p>
          </div>
        </Link>
      </section>

      {/* Upcoming Events Section */}
      <section className="mb-lg">
        <div className="flex items-center justify-between mb-sm">
          <h2 className="text-[24px] md:text-title-md font-bold text-on-surface flex items-center gap-2 font-heading">
            Sự kiện sắp tới <span className="text-2xl">⏰</span>
          </h2>
          <Link to="/dashboard" className="text-primary font-bold text-label-md flex items-center gap-1 hover:underline">
            Xem tất cả <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        <div className="flex gap-md overflow-x-auto pb-4 scrollbar-hide">
          {/* Card 1 */}
          <div className="flex-shrink-0 w-72 bg-white rounded-2xl p-5 border border-surface-container shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xl font-heading">M</div>
              <span className="bg-error/10 text-error px-3 py-1 rounded-full text-[12px] font-bold">còn 5 ngày</span>
            </div>
            <h4 className="font-bold text-title-md text-on-surface font-heading">Mẹ</h4>
            <p className="text-label-md text-on-surface-variant mb-4">Gia đình • Sinh nhật</p>
            <Link to="/recommendations" className="pt-3 border-t border-surface-container flex items-center gap-2 text-primary font-medium text-label-md hover:text-primary-container transition-colors">
              <span className="material-symbols-outlined text-sm">redeem</span> Tìm quà cho Mẹ
            </Link>
          </div>
          {/* Card 2 */}
          <div className="flex-shrink-0 w-72 bg-white rounded-2xl p-5 border border-surface-container shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center font-bold text-xl font-heading">TA</div>
              <span className="bg-on-surface-variant/10 text-on-surface-variant px-3 py-1 rounded-full text-[12px] font-bold">còn 12 ngày</span>
            </div>
            <h4 className="font-bold text-title-md text-on-surface font-heading">Tuấn Anh</h4>
            <p className="text-label-md text-on-surface-variant mb-4">Đồng nghiệp • Kỷ niệm</p>
            <Link to="/recommendations" className="pt-3 border-t border-surface-container flex items-center gap-2 text-primary font-medium text-label-md hover:text-primary-container transition-colors">
              <span className="material-symbols-outlined text-sm">redeem</span> Chọn quà kỷ niệm
            </Link>
          </div>
          {/* Card 3 */}
          <div className="flex-shrink-0 w-72 bg-white rounded-2xl p-5 border border-surface-container shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center font-bold text-xl font-heading">L</div>
              <span className="bg-on-surface-variant/10 text-on-surface-variant px-3 py-1 rounded-full text-[12px] font-bold">còn 20 ngày</span>
            </div>
            <h4 className="font-bold text-title-md text-on-surface font-heading">Lan Chi</h4>
            <p className="text-label-md text-on-surface-variant mb-4">Bạn thân • Đầy tháng</p>
            <Link to="/recommendations" className="pt-3 border-t border-surface-container flex items-center gap-2 text-primary font-medium text-label-md hover:text-primary-container transition-colors">
              <span className="material-symbols-outlined text-sm">redeem</span> Gợi ý quà bé
            </Link>
          </div>
        </div>
      </section>

      {/* AI Recommendation Strip */}
      <section className="mb-xl">
        <div className="flex items-center justify-between mb-sm">
          <h2 className="text-[24px] md:text-title-md font-bold text-on-surface flex items-center gap-2 font-heading">
            AI gợi ý cho bạn <span className="text-2xl">✨</span>
          </h2>
        </div>
        <div className="flex gap-md overflow-x-auto pb-4 scrollbar-hide">
          {/* Product Card 1 */}
          <div className="flex-shrink-0 w-64 md:w-72 bg-white rounded-2xl overflow-hidden shadow-sm border border-surface-container group hover:-translate-y-1 transition-all duration-300">
            <div className="relative h-48 bg-surface-container overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Bộ nến thơm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKi29U7sGE4huSidJPH3N4TOZyOUS5pF3j-xAdun75Oxc1Un-6XXQ7u5Y2uGOGz1Ki9o1HHHJaeCCkHbcdBobG7LncbfXiYZAy8eyxOswevJ_HYyb_mSfjy_mGUHiyqEMDtdgGvFAnUDhHeXe5V8s577aAk7vb0kV7KcS28pJ1q3AXNeXvCQ-9xuyhO_RFfDlNjxcbmIJsYcdQ7WRGC69DXexuKfFvOrdK2Y5PDa_Qaf6OzoMykHPKvQ"/>
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[12px] font-bold text-primary flex items-center gap-1 shadow-sm">
                <span className="material-symbols-outlined text-xs" style={{fontVariationSettings: "'FILL' 1"}}>stars</span> 98% Hợp gu
              </div>
            </div>
            <div className="p-5">
              <p className="text-[12px] text-on-surface-variant font-medium mb-1">Thơm Decor • Hà Nội</p>
              <h4 className="font-bold text-body-md text-on-surface mb-3 line-clamp-1">Bộ Nến Thơm Tinh Dầu Cao Cấp</h4>
              <div className="flex items-center justify-between gap-2">
                <span className="text-primary font-extrabold text-title-md">450.000đ</span>
                <button className="px-4 py-2 border-2 border-secondary text-secondary font-bold text-[12px] rounded-xl hover:bg-secondary hover:text-white transition-all active:scale-95">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
          {/* Product Card 2 */}
          <div className="flex-shrink-0 w-64 md:w-72 bg-white rounded-2xl overflow-hidden shadow-sm border border-surface-container group hover:-translate-y-1 transition-all duration-300">
            <div className="relative h-48 bg-surface-container overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Đồng hồ thông minh" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4PWF2QIwps5tfQtDd2lrqgeBCbm1U0CBLGKD9yvUq42P84hfx4886eDfrs9F9cE5JJRLuqF_dE2uWLrJ-cDRBLB-bskrIBVu-4SxU9mt5JIovLolczwUPgAl6J3jsBcDilRKWsYT_8WqI6Ahf4YwNYWAs3DOCy43GsxIBl0WhQwsYjfa5c_FXY4uvAwjUUkYchxd3KfQgzi5yy5vpXWLa-7m4U2InN27nOkrmFOTFRqqMJ00uuJJbzw"/>
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[12px] font-bold text-primary flex items-center gap-1 shadow-sm">
                <span className="material-symbols-outlined text-xs" style={{fontVariationSettings: "'FILL' 1"}}>stars</span> 94% Hợp gu
              </div>
            </div>
            <div className="p-5">
              <p className="text-[12px] text-on-surface-variant font-medium mb-1">TechStore • Toàn quốc</p>
              <h4 className="font-bold text-body-md text-on-surface mb-3 line-clamp-1">Đồng Hồ Thông Minh Rose Gold</h4>
              <div className="flex items-center justify-between gap-2">
                <span className="text-primary font-extrabold text-title-md">3.200.000đ</span>
                <button className="px-4 py-2 border-2 border-secondary text-secondary font-bold text-[12px] rounded-xl hover:bg-secondary hover:text-white transition-all active:scale-95">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
          {/* Product Card 3 */}
          <div className="flex-shrink-0 w-64 md:w-72 bg-white rounded-2xl overflow-hidden shadow-sm border border-surface-container group hover:-translate-y-1 transition-all duration-300">
            <div className="relative h-48 bg-surface-container overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Hộp socola" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDOwzrc_hNw2BTqN2RNA5oNe4lWYrqRmnjBi7MBef2fyoBg5bIb_r0iVNzpGR0mmEtEkQMcIfSa3-S0Y9zcrzv2k3-LhNdaOx5MzRP2840iOZquERP_wuvmT0krMGikGatjnYw0sRki0cad0kwKMa99KGBo1kMzAJ1gOy0Se15nf6GGGtB4LSro1IE5gOd0Rdt5c13GCMeSfG_iZgbaA1J--cWViTTG9fvKVGHp2kvD0Wo1gmiUG6zvQ"/>
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[12px] font-bold text-primary flex items-center gap-1 shadow-sm">
                <span className="material-symbols-outlined text-xs" style={{fontVariationSettings: "'FILL' 1"}}>stars</span> 89% Hợp gu
              </div>
            </div>
            <div className="p-5">
              <p className="text-[12px] text-on-surface-variant font-medium mb-1">CocoaArt • HCM</p>
              <h4 className="font-bold text-body-md text-on-surface mb-3 line-clamp-1">Hộp Socola Nghệ Thuật 12 Vị</h4>
              <div className="flex items-center justify-between gap-2">
                <span className="text-primary font-extrabold text-title-md">580.000đ</span>
                <button className="px-4 py-2 border-2 border-secondary text-secondary font-bold text-[12px] rounded-xl hover:bg-secondary hover:text-white transition-all active:scale-95">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
          {/* Product Card 4 */}
          <div className="flex-shrink-0 w-64 md:w-72 bg-white rounded-2xl overflow-hidden shadow-sm border border-surface-container group hover:-translate-y-1 transition-all duration-300">
            <div className="relative h-48 bg-surface-container overflow-hidden">
              <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Chậu cây" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5gdK5tfUvUu7RkAfNQuvYtPWIo0EHcv119HlINklmzMOKy44k07cHEDp5maQGVaAnwWqVsv7lFX_tL8VQInv8QxKnX5P5zYORpXfwSQIpq6jwNcCvje_eV9HKQNr6dZ8KhQVUmJKnt3qNTNoNx9vUOBvsymFS07uATv4SacVAs45OlhnT9vkjist8jMg_QwUIKgt5HhiI3sFiRP583GSZXoOXpqvsm8jmkTtKGMubb92gwExzK7hneA"/>
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[12px] font-bold text-primary flex items-center gap-1 shadow-sm">
                <span className="material-symbols-outlined text-xs" style={{fontVariationSettings: "'FILL' 1"}}>stars</span> 85% Hợp gu
              </div>
            </div>
            <div className="p-5">
              <p className="text-[12px] text-on-surface-variant font-medium mb-1">GreenVibes • Đà Lạt</p>
              <h4 className="font-bold text-body-md text-on-surface mb-3 line-clamp-1">Chậu Cây Monstera Trang Trí</h4>
              <div className="flex items-center justify-between gap-2">
                <span className="text-primary font-extrabold text-title-md">250.000đ</span>
                <button className="px-4 py-2 border-2 border-secondary text-secondary font-bold text-[12px] rounded-xl hover:bg-secondary hover:text-white transition-all active:scale-95">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
