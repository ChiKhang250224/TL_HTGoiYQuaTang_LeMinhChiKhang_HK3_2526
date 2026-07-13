import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function StoreProfilePage() {
  const [activeChips, setActiveChips] = useState(['Hoa', 'Quà tặng']);
  const [description, setDescription] = useState("Chuyên cung cấp các loại hoa tươi nhập khẩu và quà tặng thiết kế riêng cho các dịp đặc biệt. Giao hàng hỏa tốc nội thành.");

  const allCategories = ['Hoa', 'Quà tặng', 'Trang sức', 'Đồ handmade', 'Bánh ngọt', 'Thú nhồi bông'];

  const toggleChip = (category) => {
    if (activeChips.includes(category)) {
      setActiveChips(activeChips.filter(c => c !== category));
    } else {
      setActiveChips([...activeChips, category]);
    }
  };

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
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg text-surface-variant hover:bg-surface-variant/10 transition-colors group" to="/store-products">
            <span className="material-symbols-outlined group-hover:text-primary-fixed transition-colors">inventory_2</span>
            <span className="font-label-md text-label-md">Sản phẩm</span>
          </Link>
          <Link className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-container text-on-primary-container font-bold shadow-soft transition-transform active:scale-95 duration-150 relative overflow-hidden" to="/store-profile">
            <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>settings</span>
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
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary-fixed text-on-primary-fixed font-label-md text-label-md font-semibold hover:bg-primary-fixed-dim transition-colors active:scale-95 duration-150 shadow-soft">
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            New Product
          </button>
          <div className="mt-4 flex items-center gap-3 px-2">
            <img className="w-10 h-10 rounded-full object-cover border-2 border-primary-fixed shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCD-gyVGkuvwR6PiUhkq5sEpLP2-7-Xk6UZ8XHkZmN040tQ_AKbKKnJSgGrqTiP3cGsSaKT5n3cPVXBejFk80QiyIj5gfyJSJ_4yXz9Ds7AK5QUF16ODGdNFUkrlAY_fpwoSE3jV3N4kjjyjfPkz4U28f3X-qvLzugy11kn2OodTGVRfwN3se0bheMFL7SZl2NY3LVVJGl-NsR_mUp2Kk217rVpySuyMOCYJlY2mwFg8nLL80nKF8EjnA" />
            <div>
              <p className="font-label-md text-label-md text-on-surface-variant dark:text-surface-container font-semibold">Mai Nguyễn</p>
              <p className="font-label-sm text-label-sm text-surface-variant/70">Quản lý</p>
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
            <h1 className="font-title-md text-title-md text-primary font-bold hidden sm:block">Quản lý Cửa hàng</h1>
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

        {/* Page Content Canvas */}
        <div className="max-w-[1000px] w-full mx-auto p-gutter md:p-md lg:p-lg pb-24 flex-grow">
          <div className="mb-lg animate-fade-in-up">
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background tracking-tight">Thông tin cửa hàng</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">Quản lý hồ sơ và thông tin hiển thị của cửa hàng bạn. Thông tin này sẽ được hiển thị công khai cho người dùng GiftMatch.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
            {/* Left Column */}
            <div className="lg:col-span-5 space-y-md">
              <div className="glass-card rounded-[24px] overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300 relative group bg-surface-container-lowest">
                <div className="h-[180px] w-full relative">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAKgfXElrGOOtlsNehdpMMkbDYqPuqxYT9jrQxDH_7e0Q2vRVJgQpPsprjGK6FnQJnygc67rmMzvvVCnPGHrzoqXhTVbbjF_qAgKW0d5QS9EdP0dSPaBa9i2SCBwjx2g61OVo4273UFzP4BuZaEuTWaiDHlbGNHCflQ652IUhfIecBbnDyLkVC1zC5bPGkWpYXO3NuPTDwCdmbDhxSk9tFqm1HGer9JFoeoAs9XJ4pj9cOhCCkr66O5vg')"}}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <button className="absolute top-4 right-4 bg-surface/90 backdrop-blur text-on-surface p-2 rounded-full shadow-sm hover:bg-surface-variant transition-colors flex items-center justify-center group/btn" title="Thay đổi ảnh bìa">
                    <span className="material-symbols-outlined text-[20px] group-hover/btn:text-primary">photo_camera</span>
                  </button>
                </div>
                <div className="px-md pb-md relative pt-12">
                  <div className="absolute -top-10 left-md p-1 bg-surface-container-lowest rounded-full shadow-md z-10">
                    <div className="w-[80px] h-[80px] rounded-full overflow-hidden relative group/logo">
                      <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQs5_PLac3-DxdKxmOLf_0kMM3swAOdQUR_6Wdj-nUvMKWs3plVPmnetT9pBzKwVVMISRr8GuPNdn4IZoSKCdNZL91Q7b8tdiYeNq2hwPYJI-MNKlwuxSYn-PZKsPtda5g8fzR4wCQxYsVrFhWY6ebS7rpS-6qAcOefTEdVT8Dm79ATfB2DVClb0Nx6YGq4aryBaON05er4qb2efikzPNu7bvDw8x1nsJZ5jSUgkh2L2bBJe0Tuk1UMQ" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/logo:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                        <span className="material-symbols-outlined text-white">edit</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-4 right-md">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-container/20 text-on-tertiary-container text-xs font-semibold border border-tertiary-container/30">
                      <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                      Đang hoạt động
                    </div>
                  </div>
                  <div className="mt-2">
                    <h2 className="font-title-md text-title-md text-on-background font-bold">Tiệm Hoa Bốn Mùa</h2>
                    <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">Gia nhập tháng 3, 2023</p>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-[24px] p-md shadow-soft hover:shadow-hover transition-all bg-surface-container-lowest">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-title-md text-title-md text-on-background font-semibold flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">category</span>
                    Danh mục bán hàng
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map(cat => {
                    const isActive = activeChips.includes(cat);
                    return (
                      <button 
                        key={cat}
                        onClick={() => toggleChip(cat)}
                        className={`px-4 py-2 rounded-full font-label-md text-label-md transition-all flex items-center gap-1 cursor-pointer ${
                          isActive 
                            ? "border-2 border-primary bg-primary text-on-primary hover:bg-primary/90 shadow-sm" 
                            : "border border-outline-variant bg-surface-variant/30 text-on-surface-variant hover:border-secondary hover:text-secondary hover:bg-secondary/5"
                        }`}
                      >
                        <span>{cat}</span>
                        {isActive && <span className="material-symbols-outlined text-[16px]">close</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-7">
              <div className="glass-card rounded-[24px] p-md lg:p-lg shadow-soft bg-surface-container-lowest h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
                <h3 className="font-title-md text-title-md text-on-background font-semibold mb-6 flex items-center gap-2 border-b border-surface-variant pb-4">
                  <span className="material-symbols-outlined text-primary">info</span>
                  Thông tin cơ bản
                </h3>
                <form className="space-y-6">
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface font-medium mb-1.5" htmlFor="storeName">Tên cửa hàng <span className="text-error">*</span></label>
                    <div className="relative group">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">store</span>
                      <input className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-container border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-body-md text-on-background placeholder:text-outline" id="storeName" placeholder="Nhập tên cửa hàng" type="text" defaultValue="Tiệm Hoa Bốn Mùa" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface font-medium mb-1.5" htmlFor="businessEmail">Email liên hệ <span className="text-error">*</span></label>
                      <div className="relative group">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">mail</span>
                        <input className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-container border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-body-md text-on-background placeholder:text-outline" id="businessEmail" placeholder="email@cuahang.com" type="email" defaultValue="contact@hoabonmua.vn" />
                      </div>
                    </div>
                    <div>
                      <label className="block font-label-md text-label-md text-on-surface font-medium mb-1.5" htmlFor="phone">Số điện thoại <span className="text-error">*</span></label>
                      <div className="relative group">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">call</span>
                        <input className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-container border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-body-md text-on-background placeholder:text-outline" id="phone" placeholder="09xx xxx xxx" type="tel" defaultValue="0987654321" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface font-medium mb-1.5" htmlFor="address">Địa chỉ</label>
                    <div className="relative group flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline group-focus-within:text-primary transition-colors">location_on</span>
                        <input className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-container border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-body-md text-on-background placeholder:text-outline" id="address" placeholder="Nhập địa chỉ cụ thể" type="text" defaultValue="123 Đường Xuân Thủy, Cầu Giấy, Hà Nội" />
                      </div>
                      <button className="px-4 py-3 bg-surface-variant text-on-surface-variant rounded-xl border border-outline-variant hover:bg-outline-variant/30 transition-colors flex items-center justify-center" title="Chọn trên bản đồ" type="button">
                        <span className="material-symbols-outlined">map</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-end mb-1.5">
                      <label className="block font-label-md text-label-md text-on-surface font-medium" htmlFor="description">Mô tả cửa hàng</label>
                      <span className={`font-label-sm text-label-sm ${description.length > 500 ? 'text-error' : 'text-on-surface-variant'}`}>{description.length}/500</span>
                    </div>
                    <div className="relative group">
                      <textarea 
                        className="w-full p-4 rounded-xl bg-surface-container border border-outline-variant focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all font-body-md text-on-background placeholder:text-outline resize-none" 
                        id="description" rows="5"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="fixed bottom-0 right-0 left-0 md:left-64 bg-surface-container-lowest/80 backdrop-blur-lg border-t border-surface-variant p-4 z-20 flex justify-end items-center gap-4 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
            <div className="max-w-[1000px] w-full mx-auto flex justify-end gap-4 px-gutter md:px-md lg:px-lg">
              <button className="px-6 py-2.5 rounded-[12px] font-label-md text-label-md font-semibold border-2 border-secondary text-secondary hover:bg-secondary/5 active:scale-95 transition-all duration-150 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">visibility</span>
                Xem trang cửa hàng
              </button>
              <button className="px-8 py-2.5 rounded-[12px] font-label-md text-label-md font-semibold bg-primary text-on-primary hover:bg-primary/90 active:scale-95 shadow-md hover:shadow-lg transition-all duration-150 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">save</span>
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
