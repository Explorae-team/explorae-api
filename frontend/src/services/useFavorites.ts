import { useState, useEffect, useCallback } from 'react';
import api from './api';

export interface SavedAttraction {
  id: string;
  title: string;
  tagline: string;
  imageUrl: string;
  rating: number;
  distance: string;
  type: string;
  tags: string[];
  priceRange?: number;
  isPartner?: boolean;
}

export const useFavorites = () => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<SavedAttraction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/v1/attractions/favorites');
      if (response.data && response.data.data) {
        const data = response.data.data;
        
        const mapped = data.map((item: any) => {
          const rawImageUrl = item.mainImageUrl || 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b';
          return {
            id: item.id,
            title: item.name,
            tagline: item.shortDescription,
            imageUrl: rawImageUrl,
            rating: item.averageRating || 0.0,
            distance: item.distance || 'Salvo',
            type: item.category || 'Atração',
            tags: item.tags || [],
            priceRange: item.priceRange || 2,
            isPartner: item.isPartner || false
          };
        });

        setFavorites(mapped);
        setFavoriteIds(mapped.map((fav: any) => fav.id));
      }
    } catch (err) {
      console.error('Erro ao buscar favoritos:', err);
      setError('Não foi possível carregar as atrações salvas.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleFavorite = useCallback(async (id: string) => {
    try {
      const response = await api.post(`/api/v1/attractions/${id}/favorite`);
      if (response.data && response.data.data) {
        const isFav = response.data.data.isFavorite;
        
        setFavoriteIds(prev => {
          if (isFav) {
            return [...prev, id];
          } else {
            return prev.filter(item => item !== id);
          }
        });

        if (!isFav) {
          setFavorites(prev => prev.filter(item => item.id !== id));
        } else {
          fetchFavorites(true);
        }
        
        return { isFavorite: isFav, unlockedBadges: response.data.data.unlockedBadges || [] };
      }
    } catch (err) {
      console.error('Erro ao alternar favorito:', err);
    }
    return null;
  }, [fetchFavorites]);

  const isFavorite = useCallback((id: string) => {
    return favoriteIds.includes(id);
  }, [favoriteIds]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return {
    favoriteIds,
    favorites,
    isLoading,
    error,
    fetchFavorites,
    toggleFavorite,
    isFavorite
  };
};
