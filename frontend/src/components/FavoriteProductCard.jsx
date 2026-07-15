import React from 'react';

export default function FavoriteProductCard({ product, onRemove }) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl overflow-hidden gift-shadow hover:shadow-md transition-all border border-surface-variant flex flex-col h-full group">
      {/* Image Section */}
      <div className="relative w-full aspect-[4/3] bg-surface-variant overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Delete Button */}
        <button 
          onClick={() => onRemove(product.id)}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-outline hover:text-error hover:bg-error-container transition-colors"
          title="Xóa khỏi danh sách"
        >
          <span className="material-symbols-outlined text-[18px]">delete</span>
        </button>

        {/* Match Percentage */}
        <div className="absolute bottom-3 left-3 bg-primary-container text-white px-2.5 py-1 rounded-md text-[12px] font-bold flex items-center gap-1 shadow-sm">
          <span className="material-symbols-outlined text-[14px]" style={{fontVariationSettings: "'FILL' 1"}}>auto_awesome</span>
          {product.matchPercentage}% Hợp gu
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-[12px] text-on-surface-variant font-medium mb-1 line-clamp-1">{product.brand}</span>
        <h3 className="font-bold text-[16px] md:text-body-md text-on-surface mb-3 line-clamp-1">{product.name}</h3>
        <div className="text-primary font-extrabold text-[18px] md:text-title-md mb-4 mt-auto">
          {product.price}
        </div>
        
        {/* Actions */}
        <div className="flex flex-col gap-2 mt-auto">
          <button className="w-full py-2 bg-primary text-white rounded-xl font-label-md hover:bg-on-primary-fixed-variant transition-colors active:scale-[0.98]">
            Mua ngay
          </button>
          <button className="w-full py-2 border border-secondary text-secondary rounded-xl font-label-md hover:bg-secondary-fixed transition-colors active:scale-[0.98]">
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}
