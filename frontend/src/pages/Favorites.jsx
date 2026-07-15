import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useFavorites from '../hooks/useFavorites';
import FavoriteProductCard from '../components/FavoriteProductCard';
import CustomSelect from '../components/CustomSelect'; // using existing select if available, or native select

// Mock data to match the UI precisely if local storage is empty
const MOCK_FAVORITES = [
  {
    id: 'f1',
    brand: 'Lumina Scents',
    name: 'Nến thơm hương gỗ tuyết tùng',
    price: '450.000đ',
    matchPercentage: 98,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKi29U7sGE4huSidJPH3N4TOZyOUS5pF3j-xAdun75Oxc1Un-6XXQ7u5Y2uGOGz1Ki9o1HHHJaeCCkHbcdBobG7LncbfXiYZAy8eyxOswevJ_HYyb_mSfjy_mGUHiyqEMDtdgGvFAnUDhHeXe5V8s577aAk7vb0kV7KcS28pJ1q3AXNeXvCQ-9xuyhO_RFfDlNjxcbmIJsYcdQ7WRGC69DXexuKfFvOrdK2Y5PDa_Qaf6OzoMykHPKvQ'
  },
  {
    id: 'f2',
    brand: 'BrewMaster Pro',
    name: 'Máy pha cà phê Espresso',
    price: '2.890.000đ',
    matchPercentage: 92,
    image: 'https://images.unsplash.com/photo-1517246286411-8bb31bf32f8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Placeholder
  },
  {
    id: 'f3',
    brand: 'PaperKind',
    name: 'Sổ tay da bò thủ công',
    price: '320.000đ',
    matchPercentage: 87,
    image: 'https://images.unsplash.com/photo-1531346878377-a541e4a11f44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Placeholder
  },
  {
    id: 'f4',
    brand: 'SoundScape',
    name: 'Tai nghe không dây chống ồn',
    price: '1.250.000đ',
    matchPercentage: 95,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Placeholder
  },
  {
    id: 'f5',
    brand: 'Aura Jewelry',
    name: 'Dây chuyền ngọc trai nhân tạo',
    price: '1.150.000đ',
    matchPercentage: 81,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDisbVXV7MCmEVz_aTrZGvHAIHltMN7jo5t7JXbPyt-c1Tmol7P5aGuJ0nPKqPT8UTEI2mHZtOVkAYh-5eiD8KPim22zipuXNmwaZy5-SfcyWU9QD9QMhAfiBDELOeus5xId6yZvdHGr6vfzW2XHlXLB1UNzO11h4TSRHLAW97sa7a7l8w6eE1-BVGAgA2KRp_FJ96RBTLgVqZR0LGiIJ7MVmDSMArg31UURwjczEsOnxjWbT5JlZO32g'
  },
  {
    id: 'f6',
    brand: 'Green Corner',
    name: 'Cây Monstera trang trí',
    price: '350.000đ',
    matchPercentage: 76,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5gdK5tfUvUu7RkAfNQuvYtPWIo0EHcv119HlINklmzMOKy44k07cHEDp5maQGVaAnwWqVsv7lFX_tL8VQInv8QxKnX5P5zYORpXfwSQIpq6jwNcCvje_eV9HKQNr6dZ8KhQVUmJKnt3qNTNoNx9vUOBvsymFS07uATv4SacVAs45OlhnT9vkjist8jMg_QwUIKgt5HhiI3sFiRP583GSZXoOXpqvsm8jmkTtKGMubb92gwExzK7hneA'
  },
  {
    id: 'f7',
    brand: 'Urban Step',
    name: 'Giày Sneaker Da lộn cao cổ',
    price: '1.450.000đ',
    matchPercentage: 89,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Placeholder
  },
  {
    id: 'f8',
    brand: 'Zen Home',
    name: 'Bộ ấm trà gốm sứ thủ công',
    price: '680.000đ',
    matchPercentage: 94,
    image: 'https://images.unsplash.com/photo-1577905781358-1f1966a4f91d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' // Placeholder
  }
];

export default function Favorites() {
  const { favorites, removeFavorite, setFavorites } = useFavorites(MOCK_FAVORITES);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('Mới nhất');

  // Initialize mock data if empty (just for demo purposes to match UI requested)
  useEffect(() => {
    if (favorites.length === 0) {
      setFavorites(MOCK_FAVORITES);
    }
  }, []);

  const filteredFavorites = favorites.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="flex-grow max-w-container-max mx-auto w-full px-gutter md:px-xl py-lg">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-label-sm font-label-sm text-on-surface-variant mb-6">
        <Link to="/home" className="hover:text-primary transition-colors">Trang chủ</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-primary font-bold">Danh sách yêu thích</span>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display-lg text-[32px] md:text-[40px] font-bold text-on-surface mb-2 flex items-center gap-2">
            Danh sách yêu thích của tôi <span className="text-error">❤️</span>
          </h1>
          <p className="font-body-md text-on-surface-variant">
            Bạn có <span className="font-bold text-primary">{favorites.length}</span> món quà đã lưu
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-[240px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
            <input 
              type="text" 
              placeholder="Tìm trong danh sách" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-full text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          
          {/* Sort Dropdown */}
          <div className="w-full sm:w-[160px]">
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-full text-body-md text-on-surface appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2355433c'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                backgroundSize: '16px'
              }}
            >
              <option value="Mới nhất">Mới nhất</option>
              <option value="Cũ nhất">Cũ nhất</option>
              <option value="Giá tăng dần">Giá tăng dần</option>
              <option value="Giá giảm dần">Giá giảm dần</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredFavorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredFavorites.map(product => (
            <FavoriteProductCard 
              key={product.id} 
              product={product} 
              onRemove={removeFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined text-[64px] text-surface-variant mb-4">favorite_border</span>
          <h2 className="text-title-md font-bold text-on-surface mb-2">Danh sách trống</h2>
          <p className="text-body-md text-on-surface-variant max-w-md">
            Bạn chưa lưu món quà nào. Hãy khám phá các gợi ý của chúng tôi và thả tim nhé!
          </p>
          <Link to="/recommendations" className="mt-6 px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-on-primary-fixed-variant transition-colors">
            Khám phá ngay
          </Link>
        </div>
      )}
      
      {/* Floating Action Button (Optional flair) */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-14 h-14 bg-secondary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-on-secondary-fixed-variant transition-all hover:scale-105 group">
          <span className="material-symbols-outlined text-[28px] group-hover:rotate-12 transition-transform">auto_awesome</span>
        </button>
      </div>
    </main>
  );
}
