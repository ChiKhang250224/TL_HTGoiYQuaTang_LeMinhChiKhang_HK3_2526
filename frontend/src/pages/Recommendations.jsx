import { useState } from 'react';
import CustomSelect from '../components/CustomSelect';

export default function Recommendations() {
  const [sortOrder, setSortOrder] = useState('Độ phù hợp');
  
  return (
    <main className="flex-grow max-w-container-max mx-auto w-full px-gutter md:px-xl py-lg">
      {/* Header Section */}
      <div className="mb-xl text-center md:text-left">
        <h1 className="font-display-lg text-display-lg text-on-surface mb-xs">Gợi ý dành riêng cho bạn ✨</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Dựa trên hồ sơ người nhận — Huyền, 25 tuổi, Bạn thân, Sinh nhật</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-xl">
        {/* Sidebar / Filters */}
        <aside className="w-full md:w-[280px] shrink-0">
          <div className="bg-surface-container-lowest rounded-xl p-md gift-shadow sticky top-[100px]">
            <div className="flex items-center justify-between mb-md">
              <h2 className="font-title-md text-title-md text-on-surface">Bộ lọc</h2>
              <button className="text-secondary hover:text-secondary-container transition-colors text-label-sm font-label-sm">Xóa tất cả</button>
            </div>
            
            {/* Category Filter */}
            <div className="mb-lg">
              <h3 className="font-label-md text-label-md text-on-surface mb-sm">Loại quà</h3>
              <div className="flex flex-wrap gap-xs">
                <button className="px-sm py-xs rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm transition-colors">Trang sức</button>
                <button className="px-sm py-xs rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm hover:bg-secondary-fixed-dim transition-colors">Mỹ phẩm</button>
                <button className="px-sm py-xs rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm hover:bg-secondary-fixed-dim transition-colors">Thời trang</button>
                <button className="px-sm py-xs rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm hover:bg-secondary-fixed-dim transition-colors">Đồ công nghệ</button>
                <button className="px-sm py-xs rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm hover:bg-secondary-fixed-dim transition-colors">Trải nghiệm</button>
              </div>
            </div>
            
            {/* Price Filter */}
            <div className="mb-lg">
              <h3 className="font-label-md text-label-md text-on-surface mb-sm">Khoảng giá</h3>
              <input className="w-full accent-primary-container mb-xs" max="5000000" min="0" step="100000" type="range"/>
              <div className="flex justify-between text-label-sm font-label-sm text-on-surface-variant">
                <span>0đ</span>
                <span>5.000.000đ+</span>
              </div>
            </div>
            
            {/* Store Filter */}
            <div>
              <h3 className="font-label-md text-label-md text-on-surface mb-sm">Cửa hàng</h3>
              <div className="space-y-xs">
                <label className="flex items-center gap-xs cursor-pointer">
                  <input defaultChecked className="rounded text-primary-container focus:ring-primary-container border-outline-variant" type="checkbox"/>
                  <span className="font-body-md text-body-md text-on-surface-variant">PNJ (45)</span>
                </label>
                <label className="flex items-center gap-xs cursor-pointer">
                  <input className="rounded text-primary-container focus:ring-primary-container border-outline-variant" type="checkbox"/>
                  <span className="font-body-md text-body-md text-on-surface-variant">Sephora (32)</span>
                </label>
                <label className="flex items-center gap-xs cursor-pointer">
                  <input className="rounded text-primary-container focus:ring-primary-container border-outline-variant" type="checkbox"/>
                  <span className="font-body-md text-body-md text-on-surface-variant">Zara (18)</span>
                </label>
              </div>
            </div>
          </div>
        </aside>
        
        {/* Product Grid Area */}
        <div className="flex-grow">
          {/* Sort Options */}
          <div className="flex flex-wrap items-center justify-between mb-lg gap-sm">
            <span className="font-body-md text-body-md text-on-surface-variant">Hiển thị 24 kết quả</span>
            <div className="flex items-center gap-xs w-48">
              <span className="font-label-md text-label-md text-on-surface-variant whitespace-nowrap">Sắp xếp theo:</span>
              <CustomSelect
                name="sortOrder"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                options={[
                  { value: 'Độ phù hợp', label: 'Độ phù hợp' },
                  { value: 'Giá tăng dần', label: 'Giá tăng dần' },
                  { value: 'Mới nhất', label: 'Mới nhất' }
                ]}
                className="px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md font-body-md text-on-surface"
              />
            </div>
          </div>
          
          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
            {/* Product Card 1 */}
            <div className="bg-surface-container-lowest rounded-xl p-sm gift-shadow gift-shadow-hover relative flex flex-col group border border-surface-variant">
              <div className="relative w-full aspect-square mb-sm rounded-lg overflow-hidden bg-surface-variant">
                <img className="w-full h-full object-cover" alt="Dây chuyền bạc" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDisbVXV7MCmEVz_aTrZGvHAIHltMN7jo5t7JXbPyt-c1Tmol7P5aGuJ0nPKqPT8UTEI2mHZtOVkAYh-5eiD8KPim22zipuXNmwaZy5-SfcyWU9QD9QMhAfiBDELOeus5xId6yZvdHGr6vfzW2XHlXLB1UNzO11h4TSRHLAW97sa7a7l8w6eE1-BVGAgA2KRp_FJ96RBTLgVqZR0LGiIJ7MVmDSMArg31UURwjczEsOnxjWbT5JlZO32g"/>
                <div className="absolute top-sm right-sm">
                  <button className="bg-surface-container-lowest rounded-full p-xs text-outline hover:text-primary-container transition-colors shadow-sm">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>favorite</span>
                  </button>
                </div>
                <div className="absolute bottom-sm left-sm bg-secondary text-on-secondary px-sm py-[2px] rounded-full font-label-sm text-label-sm flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  94% Hợp gu
                </div>
              </div>
              <div className="flex-grow flex flex-col">
                <h3 className="font-title-md text-title-md text-on-surface mb-1">Dây chuyền bạc đính đá</h3>
                <span className="font-label-sm text-label-sm text-on-surface-variant mb-sm">PNJ Official</span>
                <div className="mt-auto">
                  <div className="font-headline-lg text-[24px] font-semibold text-primary-container mb-sm">1.250.000đ</div>
                  <button className="w-full py-sm rounded-lg border-2 border-secondary text-secondary font-label-md text-label-md hover:bg-secondary hover:text-on-secondary transition-all">Xem chi tiết</button>
                </div>
              </div>
            </div>
            
            {/* Product Card 2 */}
            <div className="bg-surface-container-lowest rounded-xl p-sm gift-shadow gift-shadow-hover relative flex flex-col group border border-surface-variant">
              <div className="relative w-full aspect-square mb-sm rounded-lg overflow-hidden bg-surface-variant">
                <img className="w-full h-full object-cover" alt="Bảng phấn mắt" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQgxBnh69h731OYxTeU8f7F_ZCgoqnnyECuY3tQMelOJ9dB0zBPXF7I4UwN4UM3NBAwJ3JoRrIM6t-ZLgz71XViMxRjDBwWXhckjEYR_TV6uTcG3gMpfBojjkxnK48P_18aeWbAbIx6GWZwxRdzln9ZVp5DxnMEhRHAC-m60yRL6hJDYqlZsJRrE1n4jcDrzaKoAGZjs9_h-hMqxglXKXdWP0u-IkI4UUWg8sPtnDdbnn3g6ILY6kEZg"/>
                <div className="absolute top-sm right-sm">
                  <button className="bg-surface-container-lowest rounded-full p-xs text-outline hover:text-primary-container transition-colors shadow-sm">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>favorite</span>
                  </button>
                </div>
                <div className="absolute bottom-sm left-sm bg-secondary text-on-secondary px-sm py-[2px] rounded-full font-label-sm text-label-sm flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  89% Hợp gu
                </div>
              </div>
              <div className="flex-grow flex flex-col">
                <h3 className="font-title-md text-title-md text-on-surface mb-1">Bảng phấn mắt hoàng hôn</h3>
                <span className="font-label-sm text-label-sm text-on-surface-variant mb-sm">Sephora</span>
                <div className="mt-auto">
                  <div className="font-headline-lg text-[24px] font-semibold text-primary-container mb-sm">850.000đ</div>
                  <button className="w-full py-sm rounded-lg border-2 border-secondary text-secondary font-label-md text-label-md hover:bg-secondary hover:text-on-secondary transition-all">Xem chi tiết</button>
                </div>
              </div>
            </div>
            
            {/* Product Card 3 */}
            <div className="bg-surface-container-lowest rounded-xl p-sm gift-shadow gift-shadow-hover relative flex flex-col group border border-surface-variant">
              <div className="relative w-full aspect-square mb-sm rounded-lg overflow-hidden bg-surface-variant">
                <img className="w-full h-full object-cover" alt="Túi xách da" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC341jyhUgLrfRZJgSU53XPkj2xZAF4VzXx30NTUJGce5KO1QwUDuIx5GVKY4E66qG0Yf2fLEsaX6rxgC4RUnYP4F559XrpPHGdM-Dlr4S4JiV3gnLQSQjyE4QVoDu85UbkMHZL96Y-lffy7tpJfDiLo42em0dc42_7gYW5a23Ae_k0zHzeDMN6LDsuslPo23TRH1M4NtcQvBOTmcgfl6OA_mEqll52ajQ07C_pVLAGkUUFY83d7McWcA"/>
                <div className="absolute top-sm right-sm">
                  <button className="bg-surface-container-lowest rounded-full p-xs text-outline hover:text-primary-container transition-colors shadow-sm">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>favorite</span>
                  </button>
                </div>
                <div className="absolute bottom-sm left-sm bg-secondary text-on-secondary px-sm py-[2px] rounded-full font-label-sm text-label-sm flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                  85% Hợp gu
                </div>
              </div>
              <div className="flex-grow flex flex-col">
                <h3 className="font-title-md text-title-md text-on-surface mb-1">Túi xách da cao cấp</h3>
                <span className="font-label-sm text-label-sm text-on-surface-variant mb-sm">Zara Accessories</span>
                <div className="mt-auto">
                  <div className="font-headline-lg text-[24px] font-semibold text-primary-container mb-sm">1.590.000đ</div>
                  <button className="w-full py-sm rounded-lg border-2 border-secondary text-secondary font-label-md text-label-md hover:bg-secondary hover:text-on-secondary transition-all">Xem chi tiết</button>
                </div>
              </div>
            </div>
            
          </div>
          
          {/* Load More */}
          <div className="mt-xl flex justify-center">
            <button className="px-xl py-sm rounded-xl bg-surface-container text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-high transition-colors">Tải thêm gợi ý</button>
          </div>
        </div>
      </div>
    </main>
  );
}
