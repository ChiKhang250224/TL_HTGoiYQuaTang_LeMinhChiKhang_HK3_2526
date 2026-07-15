import { useState, useEffect } from 'react';

// Hook để quản lý danh sách yêu thích
export default function useFavorites(initialItems = []) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('giftmatch_favorites');
      if (stored) {
        return JSON.parse(stored);
      }
      return initialItems;
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
      return initialItems;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('giftmatch_favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [favorites]);

  const toggleFavorite = (product) => {
    setFavorites((prev) => {
      const isExist = prev.some((item) => item.id === product.id);
      if (isExist) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const removeFavorite = (productId) => {
    setFavorites((prev) => prev.filter((item) => item.id !== productId));
  };

  const isFavorite = (productId) => {
    return favorites.some((item) => item.id === productId);
  };

  return { favorites, toggleFavorite, removeFavorite, isFavorite, setFavorites };
}
