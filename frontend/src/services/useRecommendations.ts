import { useState, useEffect, useCallback } from 'react';
import api from './api';
import { getPublicImageUrl } from './supabase';

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

export const useRecommendations = (
  latitude?: number | null,
  longitude?: number | null,
  defaultSize = 10
) => {
  const [recommendations, setRecommendations] = useState<Attraction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchRecommendations = useCallback(async (pageNum: number, refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else if (pageNum > 0) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    setError(null);

    try {
      const response = await api.get('/api/v1/attractions/recommendations', {
        params: {
          latitude: latitude || undefined,
          longitude: longitude || undefined,
          page: pageNum,
          size: defaultSize,
        }
      });

      const pageData = response.data?.data;
      const content = pageData?.content || [];

      const mapped = content.map((item: any) => {
        const defaultTags = item.category === 'Praia' ? ['Mar', 'Verão', 'Lazer'] :
          item.category === 'Cultura' ? ['Arte', 'Museu', 'História'] :
            ['Exploração', 'Turismo', 'Aventura'];

        const rawImageUrl = item.mainImageUrl || (item.imageUrls && item.imageUrls[0]) || 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b';
        const resolvedUrl = getPublicImageUrl(rawImageUrl);
        const imageUrl = resolvedUrl && resolvedUrl.includes('unsplash.com') 
          ? `${resolvedUrl}?q=80&w=500&auto=format&fit=crop` 
          : resolvedUrl || rawImageUrl;

        return {
          id: item.id,
          title: item.name,
          tagline: item.shortDescription,
          imageUrl: imageUrl,
          rating: item.averageRating || 0.0,
          distance: item.distance || 'Localizando...',
          type: item.category || 'Atração',
          tags: item.tags && item.tags.length > 0 ? item.tags : defaultTags,
          priceRange: item.priceRange || 2,
          isPartner: item.isPartner || false
        };
      });

      setRecommendations(prev => {
        if (refresh || pageNum === 0) {
          return mapped;
        } else {
          return [...prev, ...mapped];
        }
      });

      const last = !!pageData?.last;
      setHasMore(!last);
      setPage(pageNum);

    } catch (err: any) {
      console.error('Erro ao buscar recomendações:', err);
      setError('Não foi possível carregar as recomendações.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      setIsRefreshing(false);
    }
  }, [latitude, longitude, defaultSize]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchRecommendations(page + 1);
    }
  }, [fetchRecommendations, page, isLoadingMore, hasMore]);

  const refresh = useCallback(() => {
    fetchRecommendations(0, true);
  }, [fetchRecommendations]);

  useEffect(() => {
    fetchRecommendations(0, true);
  }, [latitude, longitude]);

  return {
    recommendations,
    isLoading,
    isLoadingMore,
    isRefreshing,
    hasMore,
    error,
    refresh,
    loadMore
  };
};
