import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import useCompareProducts, { MAX_COMPARE_PRODUCTS } from '../hooks/useCompareProducts';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=700&q=80';
const formatPrice = value => `${Number(value || 0).toLocaleString('vi-VN')} ₫`;

export default function ProductCompare() {
  const { products: selected, removeProduct, clearProducts } = useCompareProducts();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    if (selected.length === 0) {
      setProducts([]);
      return undefined;
    }

    setLoading(true);
    Promise.all(selected.map(async stored => {
      try {
        const response = await api.get(`/products/${stored.productId}`);
        return response.data;
      } catch {
        return stored;
      }
    })).then(result => {
      if (active) setProducts(result);
    }).finally(() => {
      if (active) setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [selected]);

  if (selected.length === 0) {
    return (
      <main className="flex-grow max-w-4xl mx-auto w-full px-gutter py-xl text-center">
        <span className="material-symbols-outlined text-6xl text-outline">compare_arrows</span>
        <h1 className="mt-4 text-display-sm font-bold">Chưa chọn sản phẩm so sánh</h1>
        <p className="mt-2 text-on-surface-variant">
          Có thể chọn tối đa {MAX_COMPARE_PRODUCTS} sản phẩm từ kết quả gợi ý hoặc trang chi tiết.
        </p>
        <Link to="/recommendations" className="mt-6 inline-flex rounded-xl bg-primary px-6 py-3 text-white font-bold">
          Xem sản phẩm gợi ý
        </Link>
      </main>
    );
  }

  const rows = [
    ['Giá', product => formatPrice(product.price)],
    ['Cửa hàng', product => product.storeName || 'GiftMatch Store'],
    ['Danh mục', product => product.category?.name || 'Chưa phân loại'],
    ['Loại quà', product => product.giftType || 'Chưa xác định'],
    ['Nhãn AI', product => product.aiGiftName || product.predictedGiftName || 'Chưa xác định'],
    ['Lượt gợi ý', product => product.recommendCount ?? '—'],
  ];

  return (
    <main className="flex-grow max-w-7xl mx-auto w-full px-gutter md:px-xl py-xl">
      <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
        <div>
          <h1 className="text-display-sm font-bold">So sánh sản phẩm</h1>
          <p className="mt-2 text-on-surface-variant">
            Dữ liệu sản phẩm được tải lại từ hệ thống trước khi đối chiếu.
          </p>
        </div>
        <button type="button" onClick={clearProducts} className="text-error font-bold">
          Xóa tất cả
        </button>
      </div>

      {loading ? (
        <div className="p-10 text-center">Đang cập nhật dữ liệu sản phẩm...</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-surface-container bg-white shadow-sm">
          <table className="min-w-[760px] w-full border-collapse">
            <thead>
              <tr>
                <th className="w-40 p-4 text-left bg-surface-container">Tiêu chí</th>
                {products.map(product => (
                  <th key={product.productId} className="min-w-56 p-4 align-top border-l border-surface-container">
                    <img
                      src={product.imageUrl || FALLBACK_IMAGE}
                      alt={product.name}
                      className="w-full h-36 object-cover rounded-xl"
                      onError={event => { event.currentTarget.src = FALLBACK_IMAGE; }}
                    />
                    <Link to={`/products/${product.productId}`} className="block mt-3 font-bold text-on-surface hover:text-primary">
                      {product.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeProduct(product.productId)}
                      className="mt-2 text-label-sm text-error"
                    >
                      Bỏ khỏi so sánh
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, render]) => (
                <tr key={label} className="border-t border-surface-container">
                  <th className="p-4 text-left bg-surface-container-low font-bold">{label}</th>
                  {products.map(product => (
                    <td key={`${label}-${product.productId}`} className="p-4 text-center border-l border-surface-container">
                      {render(product)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
