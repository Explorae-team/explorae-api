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

// Cache simples em memória para evitar loading excessivo ao alternar categorias
const attractionCache: Record<string, { data: Attraction[], page: number, hasMore: boolean }> = {};

export const useExploreData = () => {
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
    if (pageNum === 0 && attractionCache[cacheKey] && !refresh) {
      setAttractions(attractionCache[cacheKey].data);
      setPage(attractionCache[cacheKey].page);
      setHasMore(attractionCache[cacheKey].hasMore);
      setIsLoading(false);
      // Opcional: fazer um fetch silencioso em background para atualizar o cache
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
          size: 5,
          category: category === 'Todos' ? undefined : category
        }
      });

      const pageData = response.data?.data;
      const content = pageData?.content || [];

      const mappedAttractions = content.map((item: any) => {
        const defaultTags = item.category === 'Praia' ? ['Mar', 'Verão', 'Lazer'] :
          item.category === 'Cultura' ? ['Arte', 'Museu', 'História'] :
            ['Exploração', 'Turismo', 'Aventura'];

        const rawImageUrl = item.mainImageUrl || (item.imageUrls && item.imageUrls[0]) || 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b';
        const imageUrl = rawImageUrl.includes('unsplash.com') 
          ? `${rawImageUrl}?q=80&w=500&auto=format&fit=crop` 
          : rawImageUrl;

        return {
          id: item.id,
          title: item.name,
          tagline: item.shortDescription,
          imageUrl: imageUrl,
          rating: item.averageRating || 0.0,
          distance: item.distance || '2.4 km',
          type: item.category || 'Atração',
          tags: item.tags && item.tags.length > 0 ? item.tags : defaultTags,
          priceRange: item.priceRange || 2,
          isPartner: item.isPartner || false
        };
      });

      let updatedList: Attraction[];
      if (refresh || pageNum === 0) {
        updatedList = mappedAttractions;
      } else {
        updatedList = [...attractions, ...mappedAttractions];
      }

      setAttractions(updatedList);
      const last = !!pageData?.last;
      setHasMore(!last);
      setPage(pageNum);

      // Atualiza o cache para esta categoria
      attractionCache[cacheKey] = {
        data: updatedList,
        page: pageNum,
        hasMore: !last
      };

    } catch (err: any) {
      console.error('Erro ao buscar atrações:', err);
      setError('Não foi possível carregar as atrações.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      setIsRefreshing(false);
    }
  }, [attractions]);

  const loadMore = useCallback((category?: string) => {
    if (!isLoadingMore && hasMore) {
      fetchAttractions(page + 1, category);
    }
  }, [fetchAttractions, page, isLoadingMore, hasMore]);

  const refresh = useCallback((category?: string) => {
    fetchAttractions(0, category, true);
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
