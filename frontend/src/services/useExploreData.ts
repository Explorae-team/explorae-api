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

  const fetchAttractions = useCallback(async (pageNum: number, category?: string, refresh = false) => {
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
        params: {
          page: pageNum,
          size: 5,
          category: category === 'Todos' ? undefined : category
        }
      });

      const pageData = response.data?.data;
      const content = pageData?.content || [];

      const mappedAttractions = content.map((item: any) => {
        // Gerar tags dinâmicas baseadas na categoria se o back não enviar
        const defaultTags = item.category === 'Praia' ? ['Mar', 'Verão', 'Lazer'] :
          item.category === 'Cultura' ? ['Arte', 'Museu', 'História'] :
            ['Exploração', 'Turismo', 'Aventura'];

        return {
          id: item.id,
          title: item.name,
          tagline: item.shortDescription,
          imageUrl: item.mainImageUrl || (item.imageUrls && item.imageUrls[0]) || 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=500',
          rating: item.averageRating || 0.0,
          distance: item.distance || '2.4 km',
          type: item.category || 'Atração',
          tags: item.tags && item.tags.length > 0 ? item.tags : defaultTags,
          priceRange: item.priceRange || 2,
          isPartner: item.isPartner || false
        };
      });

      if (refresh || pageNum === 0) {
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
