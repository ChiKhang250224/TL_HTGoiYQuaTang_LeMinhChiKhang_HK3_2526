import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'giftmatch_compare_products';
const UPDATE_EVENT = 'giftmatch:compare-products-updated';
export const MAX_COMPARE_PRODUCTS = 4;

function readProducts() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function productIdOf(product) {
  return Number(product?.productId ?? product?.id);
}

function normalizeProduct(product) {
  return {
    productId: productIdOf(product),
    name: product.name,
    price: product.price,
    imageUrl: product.imageUrl || product.image,
    storeName: product.storeName || product.brand,
    giftType: product.giftType,
    aiGiftName: product.aiGiftName,
    matchScore: product.matchScore,
  };
}

function persist(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: products }));
}

export default function useCompareProducts() {
  const [products, setProducts] = useState(readProducts);

  useEffect(() => {
    const sync = event => setProducts(event.detail || readProducts());
    window.addEventListener(UPDATE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(UPDATE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const isSelected = useCallback(
    productId => products.some(item => productIdOf(item) === Number(productId)),
    [products]
  );

  const toggleProduct = useCallback(product => {
    const current = readProducts();
    const productId = productIdOf(product);
    if (!Number.isFinite(productId)) {
      return { ok: false, message: 'Sản phẩm không có mã hợp lệ.' };
    }

    const existing = current.some(item => productIdOf(item) === productId);
    if (existing) {
      const next = current.filter(item => productIdOf(item) !== productId);
      persist(next);
      return { ok: true, selected: false };
    }
    if (current.length >= MAX_COMPARE_PRODUCTS) {
      return {
        ok: false,
        message: `Chỉ có thể so sánh tối đa ${MAX_COMPARE_PRODUCTS} sản phẩm.`,
      };
    }

    const next = [...current, normalizeProduct(product)];
    persist(next);
    return { ok: true, selected: true };
  }, []);

  const removeProduct = useCallback(productId => {
    persist(readProducts().filter(item => productIdOf(item) !== Number(productId)));
  }, []);

  const clearProducts = useCallback(() => persist([]), []);

  return {
    products,
    count: products.length,
    isSelected,
    toggleProduct,
    removeProduct,
    clearProducts,
  };
}
