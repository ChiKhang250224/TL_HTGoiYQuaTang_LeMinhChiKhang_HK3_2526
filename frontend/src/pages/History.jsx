import React from 'react';
import { Link } from 'react-router-dom';

export default function History() {
  const historyData = [
    {
      id: 1,
      dateGroup: 'Hôm nay',
      icon: 'schedule',
      recipient: {
        name: 'Tặng Mẹ',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        occasion: 'Sinh nhật'
      },
      insights: '"Dựa trên sở thích làm vườn và phong cách tối giản của Mẹ, hệ thống đã chọn lọc các sản phẩm mang tính thư giãn và tinh tế."',
      products: [
        {
          id: 'p1',
          name: 'Bộ trà gốm thủ công',
          price: '1.250.000đ',
          match: 98,
          image: 'https://images.unsplash.com/photo-1577905781358-1f1966a4f91d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        },
        {
          id: 'p2',
          name: 'Bộ dụng cụ làm vườn mini',
          price: '850.000đ',
          match: 92,
          image: 'https://images.unsplash.com/photo-1416879598555-220b33230489?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        }
      ]
    },
    {
      id: 2,
      dateGroup: 'Tuần trước',
      icon: 'calendar_today',
      recipient: {
        name: 'Tặng Anh Trai',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
        occasion: 'Tân gia'
      },
      insights: '"Đã lọc các thiết bị thông minh và đồ trang trí phong cách công nghiệp cho căn hộ mới."',
      products: [
        {
          id: 'p3',
          name: 'Loa Bluetooth thông minh',
          price: '3.400.000đ',
          match: 95,
          image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        },
        {
          id: 'p4',
          name: 'Đèn bàn kim loại hiện đại',
          price: '1.150.000đ',
          match: 89,
          image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
        }
      ]
    }
  ];

  return (
    <main className="flex-grow max-w-container-max mx-auto w-full px-gutter md:px-xl py-lg">
      <div className="mb-10 text-center md:text-left max-w-2xl">
        <h1 className="font-display-lg text-[32px] md:text-[40px] font-bold text-on-surface mb-3">
          Lịch sử gợi ý quà tặng
        </h1>
        <p className="font-body-md text-on-surface-variant leading-relaxed">
          Xem lại các hành trình tìm kiếm quà tặng của bạn và tiếp tục khám phá những lựa chọn tuyệt vời nhất cho người thân yêu.
        </p>
      </div>

      <div className="relative border-l-2 border-surface-container-high ml-4 md:ml-8 pb-10">
        {historyData.map((history, index) => (
          <div key={history.id} className="mb-12 relative pl-8 md:pl-12">
            {/* Timeline Marker */}
            <div className="absolute -left-[17px] top-0 bg-white border-2 border-surface-container-high rounded-full w-8 h-8 flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px]">{history.icon}</span>
            </div>
            
            <h3 className="font-bold text-title-md text-primary mb-6 ml-2 -mt-1">{history.dateGroup}</h3>
            
            {/* History Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-surface-container flex flex-col lg:flex-row gap-8">
              
              {/* Left Column: Recipient & Insights */}
              <div className="w-full lg:w-1/3 shrink-0 flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <img src={history.recipient.avatar} alt={history.recipient.name} className="w-16 h-16 rounded-full object-cover shadow-sm border border-surface-variant" />
                  <div>
                    <h4 className="font-bold text-title-md text-on-surface">{history.recipient.name}</h4>
                    <span className="inline-block mt-1 bg-secondary-fixed/50 text-secondary px-3 py-1 rounded-full text-label-sm font-medium flex items-center gap-1 w-max">
                      <span className="material-symbols-outlined text-[14px]">celebration</span>
                      {history.recipient.occasion}
                    </span>
                  </div>
                </div>
                
                <div className="bg-surface-container-low rounded-2xl p-5 border border-surface-container-high flex-grow">
                  <div className="flex items-center gap-2 text-primary font-bold text-label-md mb-2">
                    <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
                    AI INSIGHTS
                  </div>
                  <p className="italic text-body-md text-on-surface-variant leading-relaxed">
                    {history.insights}
                  </p>
                </div>
              </div>

              {/* Right Column: Products */}
              <div className="w-full flex flex-col flex-grow min-w-0">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium text-label-md text-on-surface-variant">
                    Sản phẩm gợi ý ({history.products.length})
                  </span>
                  <Link to="/recommendations" className="text-primary hover:text-primary-container font-medium text-label-md flex items-center gap-1 transition-colors">
                    Tìm lại quà tương tự <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </Link>
                </div>
                
                {/* Horizontal Scroll Products */}
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                  {history.products.map(product => (
                    <div key={product.id} className="snap-start shrink-0 w-64 bg-surface-container-lowest rounded-2xl overflow-hidden border border-surface-variant group relative">
                      <div className="relative h-48 overflow-hidden bg-surface-variant">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <button className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur rounded-full text-outline hover:text-primary-container hover:bg-white transition-all shadow-sm">
                          <span className="material-symbols-outlined text-[18px]">favorite_border</span>
                        </button>
                        <div className="absolute bottom-2 left-2 bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                          {product.match}% Match
                        </div>
                      </div>
                      <div className="p-4">
                        <h5 className="font-bold text-body-md text-on-surface mb-1 line-clamp-1">{product.name}</h5>
                        <p className="text-primary font-bold text-label-md">{product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-auto pt-4 flex justify-end">
                  <Link to="/recommendations" className="px-8 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-on-primary-fixed-variant transition-colors shadow-sm">
                    Xem lại toàn bộ kết quả
                  </Link>
                </div>
              </div>
              
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <button className="px-8 py-3 rounded-full border border-outline-variant text-on-surface-variant font-bold hover:bg-surface-container transition-colors flex items-center gap-2">
          Tải thêm lịch sử <span className="material-symbols-outlined text-[20px]">expand_more</span>
        </button>
      </div>
    </main>
  );
}
