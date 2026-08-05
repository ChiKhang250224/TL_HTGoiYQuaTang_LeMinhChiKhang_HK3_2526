import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../utils/api';

const normalizeFavorite = (favorite) => {
  const product = favorite.product || favorite;
  return {
    favoriteId: favorite.favoriteId,
    createdAt: favorite.createdAt,
    id: product.productId ?? product.id,
    name: product.name,
    brand: product.storeName || product.brand || 'GiftMatch Store',
    price: Number(product.price || 0),
    image: product.imageUrl || product.image,
    giftType: product.giftType || '',
    aiGiftName: product.aiGiftName || '',
    matchPercentage: product.matchPercentage ?? null,
  };
};

export default function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/favorites/me');
      setFavorites(response.data.map(normalizeFavorite));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Không thể tải danh sách yêu thích.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const favoriteIds = useMemo(
    () => new Set(favorites.map(item => Number(item.id))),
    [favorites]
  );

  const isFavorite = useCallback(
    productId => favoriteIds.has(Number(productId)),
    [favoriteIds]
  );

  const addFavorite = useCallback(async (product) => {
    const productId = product.productId ?? product.id;
    setError('');
    try {
      const response = await api.post(`/favorites/${productId}`);
      const saved = normalizeFavorite(response.data);
      setFavorites(current => (
        current.some(item => Number(item.id) === Number(productId))
          ? current
          : [saved, ...current]
      ));
      return true;
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Không thể thêm sản phẩm vào danh sách yêu thích.');
      return false;
    }
  }, []);

  const removeFavorite = useCallback(async (productId) => {
    setError('');
    try {
      await api.delete(`/favorites/${productId}`);
      setFavorites(current => current.filter(item => Number(item.id) !== Number(productId)));
      return true;
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Không thể bỏ sản phẩm khỏi danh sách yêu thích.');
      return false;
    }
  }, []);

  const toggleFavorite = useCallback(async (product) => {
    const productId = product.productId ?? product.id;
    return isFavorite(productId)
      ? removeFavorite(productId)
      : addFavorite(product);
  }, [addFavorite, isFavorite, removeFavorite]);

  return {
    favorites,
    loading,
    error,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    reload: loadFavorites,
  };
}
