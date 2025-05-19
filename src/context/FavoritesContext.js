import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesContext = createContext();

export const FavoritesProvider = ({children}) => {
  const [favorites, setFavorites] = useState([]);

  // AsyncStorage'dan favorileri yükle
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Favoriler yüklenirken hata oluştu:', error);
      }
    };

    loadFavorites();
  }, []);

  // Favorileri AsyncStorage'a kaydet
  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      } catch (error) {
        console.error('Favoriler kaydedilirken hata oluştu:', error);
      }
    };

    saveFavorites();
  }, [favorites]);

  // Favorilere ürün ekle/çıkar
  const toggleFavorite = product => {
    setFavorites(prevFavorites => {
      const existingIndex = prevFavorites.findIndex(
        item => item.id === product.id,
      );

      if (existingIndex >= 0) {
        // Ürün zaten favorilerde, kaldır
        const newFavorites = [...prevFavorites];
        newFavorites.splice(existingIndex, 1);
        return newFavorites;
      } else {
        // Ürünü favorilere ekle
        return [...prevFavorites, product];
      }
    });
  };

  // Favorilerden ürün kaldır
  const removeFromFavorites = productId => {
    setFavorites(prevFavorites =>
      prevFavorites.filter(item => item.id !== productId),
    );
  };

  // Ürünün favorilerde olup olmadığını kontrol et
  const isFavorite = productId => {
    return favorites.some(item => item.id === productId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        removeFromFavorites,
        isFavorite,
      }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
