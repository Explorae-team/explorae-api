import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { mapBackendAttractionToFrontend, Attraction } from './attractionMapper';

export interface ExploreFilters {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  openNow?: boolean;
}

// Cache simples em memória para evitar loading excessivo ao alternar categorias
const attractionCache: Record<string, { data: Attraction[], page: number, hasMore: boolean }> = {};

export const useExploreData = (filters?: ExploreFilters) => {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchAttractions = useCallback(async (pageNum: number, category?: string, refresh = false) => {
    const cacheKey = category || 'all';

    // Se for a primeira página e tivermos cache, usamos o cache primeiro (SWR)
    if (pageNum === 0 && attractionCache[cacheKey] && !refresh && !filters) {
      setAttractions(attractionCache[cacheKey].data);
      setPage(attractionCache[cacheKey].page);
      setHasMore(attractionCache[cacheKey].hasMore);
      setIsLoading(false);
    }

    if (refresh) {
      setIsRefreshing(true);
    } else if (pageNum > 0) {
      setIsLoadingMore(true);
    } else if (!attractionCache[cacheKey]) {
      setIsLoading(true);
    }

    setError(null);

    try {
      const response = await api.get('/api/v1/attractions', {
        params: {
          page: pageNum,
          size: 10,
          category: category === 'Todos' ? undefined : category,
          ...filters
        }
      });

      const pageData = response.data?.data;
      const content = pageData?.content || [];

      const mappedAttractions = content.map((item: any) => mapBackendAttractionToFrontend(item, '2.4 km'));

      setAttractions(prev => {
        if (refresh || pageNum === 0) {
          return mappedAttractions;
        } else {
          return [...prev, ...mappedAttractions];
        }
      });
      
      const last = !!pageData?.last;
      setHasMore(!last);
      setPage(pageNum);

      // Atualiza o cache se não houver filtros aplicados
      if (!filters) {
        attractionCache[cacheKey] = {
          data: refresh || pageNum === 0 ? mappedAttractions : [...attractions, ...mappedAttractions],
          page: pageNum,
          hasMore: !last
        };
      }

    } catch (err: any) {
      console.error('Erro ao buscar atrações:', err);
      setError('Não foi possível carregar as atrações.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      setIsRefreshing(false);
    }
  }, [filters, attractions]);

  const loadMore = useCallback((category?: string) => {
    if (!isLoadingMore && hasMore) {
      fetchAttractions(page + 1, category);
    }
  }, [fetchAttractions, page, isLoadingMore, hasMore]);

  const refresh = useCallback((category?: string) => {
    fetchAttractions(0, category, true);
  }, [fetchAttractions]);

  // Serializa filtros para dependência estável
  const filterString = JSON.stringify(filters);

  useEffect(() => {
    fetchAttractions(0, filters?.category, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterString]);

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
