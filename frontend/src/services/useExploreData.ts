import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

interface Attraction {
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

export const useExploreData = () => {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchAttractions = useCallback(async (pageNum: number, refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
      setPage(0);
    } else if (pageNum > 0) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    setError(null);

    try {
      const response = await api.get('/api/v1/attractions', {
        params: { page: pageNum, size: 5 }
      });

      const pageData = response.data?.data;
      console.log('API Response PageData:', JSON.stringify(pageData, null, 2));
      const content = pageData?.content || [];
      
      const mappedAttractions = content.map((item: any) => ({
        id: item.id,
        title: item.name,
        tagline: item.shortDescription,
        imageUrl: item.mainImageUrl,
        rating: item.averageRating || 4.5,
        distance: item.distance || '2.4 km',
        type: item.category || 'Sightseeing',
        tags: item.tags || ['Cultural', 'Histórico'], // Fallback tags se não houver no banco
        priceRange: item.priceRange || 2,
        isPartner: item.isPartner || false
      }));

      if (refresh) {
        setAttractions(mappedAttractions);
      } else {
        setAttractions(prev => [...prev, ...mappedAttractions]);
      }

      setHasMore(!pageData?.last);
      setPage(pageNum);
    } catch (err: any) {
      console.error('Erro ao buscar atrações:', err);
      setError('Não foi possível carregar as atrações.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      setIsRefreshing(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchAttractions(page + 1);
    }
  }, [fetchAttractions, page, isLoadingMore, hasMore]);

  const refresh = useCallback(() => {
    fetchAttractions(0, true);
  }, [fetchAttractions]);

  useEffect(() => {
    fetchAttractions(0);
  }, []);

  return {
    attractions,
    isLoading,
    isLoadingMore,
    isRefreshing,
    hasMore,
    error,
    refresh,
    loadMore
  };
};
