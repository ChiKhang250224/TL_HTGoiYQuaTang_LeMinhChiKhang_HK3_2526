import { Link } from 'react-router-dom';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80';
const formatPrice = value => `${Number(value || 0).toLocaleString('vi-VN')} ₫`;

export default function FavoriteProductCard({ product, onRemove }) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden gift-shadow hover:shadow-md transition-all border border-surface-variant flex flex-col h-full min-w-0 group">
      <div className="relative w-full aspect-[4/3] bg-surface-variant overflow-hidden">
        <img
          src={product.image || FALLBACK_IMAGE}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={event => { event.currentTarget.src = FALLBACK_IMAGE; }}
        />
        <button
          type="button"
          onClick={() => onRemove(product.id)}
          className="absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm text-outline hover:text-error hover:bg-error-container transition-colors"
          title="Bỏ khỏi danh sách"
          aria-label={`Bỏ ${product.name} khỏi danh sách yêu thích`}
        >
          <span className="material-symbols-outlined text-[19px]">delete</span>
        </button>
        <div className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] bg-primary-container text-white px-2.5 py-1 rounded-md text-[12px] font-bold flex items-center gap-1 shadow-sm">
          <span className="material-symbols-outlined text-[14px]">favorite</span>
          <span className="truncate">
            {product.matchPercentage != null ? `${product.matchPercentage}% Hợp gu` : 'Đã yêu thích'}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-grow min-w-0">
        <span className="text-[12px] text-on-surface-variant font-medium mb-1 truncate">{product.brand}</span>
        <h3 className="font-bold text-[16px] text-on-surface mb-3 line-clamp-2 break-words">{product.name}</h3>
        <div className="text-primary font-extrabold text-[18px] mb-4 mt-auto">
          {formatPrice(product.price)}
        </div>
        <div className="grid grid-cols-1 gap-2 mt-auto">
          <Link to={`/products/${product.id}`} className="w-full py-2 bg-primary text-white rounded-xl font-label-md hover:opacity-90 transition-opacity active:scale-[0.98] text-center">
            Xem chi tiết
          </Link>
          <Link to="/survey" className="w-full py-2 border border-secondary text-secondary rounded-xl font-label-md hover:bg-secondary-fixed transition-colors active:scale-[0.98] text-center">
            Tìm quà tương tự
          </Link>
        </div>
      </div>
    </article>
  );
}
