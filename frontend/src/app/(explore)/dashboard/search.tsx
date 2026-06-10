import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ExploreHeader } from '../../../components/dashboard/ExploreHeader';
import { SearchBar } from '../../../components/dashboard/SearchBar';
import { CategoryCarousel } from '../../../components/dashboard/CategoryCarousel';
import { FiltersModal, FilterState } from '../../../components/dashboard/FiltersModal';
import { AttractionCard } from '../../../components/dashboard/AttractionCard';
import AttractionSkeleton from '../../../components/dashboard/AttractionSkeleton';
import { useExploreData } from '../../../services/useExploreData';
import { useFavorites } from '../../../services/useFavorites';
import { useCelebration } from '../../../contexts/BadgeCelebrationContext';
import { useRouter } from 'expo-router';
import api from '../../../services/api';
import { colors } from '../../../constants/colors';

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState | null>(null);
  const { favoriteIds, toggleFavorite } = useFavorites();
  const { triggerCelebration } = useCelebration();

  const handleToggleFavorite = async (id: string) => {
    const result = await toggleFavorite(id);
    if (result && result.unlockedBadges && result.unlockedBadges.length > 0) {
      triggerCelebration(result.unlockedBadges);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filters = useMemo(() => ({
    name: debouncedSearch || undefined,
    category: selectedCategory || undefined,
    minRating: activeFilters?.minRating || undefined,
    minPrice: activeFilters?.priceRange?.length ? Math.min(...activeFilters.priceRange) : undefined,
    maxPrice: activeFilters?.priceRange?.length ? Math.max(...activeFilters.priceRange) : undefined,
    openNow: activeFilters?.openNow || undefined,
  }), [debouncedSearch, selectedCategory, activeFilters]);

  const {
    attractions,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMore,
    error
  } = useExploreData(filters);

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(prev => prev === id ? null : id);
  };

  const handleApplyFilters = (applied: FilterState) => {
    setActiveFilters(applied);
  };

  // Estilo do container de grid — 3 colunas no web, 1 coluna no mobile
  const gridContainerStyle = Platform.OS === 'web'
    ? { flexDirection: 'row' as const, flexWrap: 'wrap' as const, marginHorizontal: -8 }
    : { flexDirection: 'column' as const };

  // Estilo de cada item — 1/3 de largura no web, largura total no mobile
  const cardWrapperStyle = (index: number) => Platform.OS === 'web'
    ? { width: '33.33%' as any, paddingHorizontal: 8, marginBottom: 32 }
    : { marginBottom: 40 };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ExploreHeader onNotificationsPress={() => {}} />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isNearEnd = layoutMeasurement.height + contentOffset.y >= contentSize.height - 120;
          if (isNearEnd && hasMore && !isLoadingMore) {
            loadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        {/* Header da busca */}
        <View style={{ paddingHorizontal: 24, paddingTop: 24, marginBottom: 24, gap: 24 }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: colors.onBackground }}>
            Buscar Atrações
          </Text>

          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFilterPress={() => setIsFilterModalVisible(true)}
          />

          <View style={{ alignItems: 'center' }}>
            <CategoryCarousel
              selectedCategoryId={selectedCategory}
              onSelect={handleCategorySelect}
            />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 12, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase', color: colors.onSurfaceVariant }}>
              {isLoading ? 'Buscando...' : attractions.length > 0 ? 'Resultados Encontrados' : 'Nenhum resultado'}
            </Text>
            <Pressable
              onPress={() => setIsFilterModalVisible(true)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.surfaceContainerHigh, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 }}
            >
              <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primary }}>Filtros</Text>
              <MaterialIcons name="tune" size={16} color={colors.primary} />
            </Pressable>
          </View>
        </View>

        {/* Grid de resultados */}
        <View style={{ paddingHorizontal: Platform.OS === 'web' ? 16 : 0 }}>
          {isLoading ? (
            <View style={gridContainerStyle}>
              {[1, 2, 3].map((i) => (
                <View key={i} style={cardWrapperStyle(i)}>
                  <AttractionSkeleton />
                </View>
              ))}
            </View>
          ) : attractions.length > 0 ? (
            <View style={gridContainerStyle}>
              {attractions.map((attraction, index) => (
                <View key={`${attraction.id}-${index}`} style={cardWrapperStyle(index)}>
                  <View style={Platform.OS !== 'web' ? { paddingHorizontal: 24 } : {}}>
                    <AttractionCard
                      title={attraction.title}
                      tagline={attraction.tagline}
                      imageUrl={attraction.imageUrl}
                      rating={attraction.rating}
                      distance={attraction.distance}
                      type={attraction.type}
                      tags={attraction.tags}
                      priceRange={attraction.priceRange}
                      isPartner={attraction.isPartner}
                      isPopular={index % 4 === 0}
                      isFavorite={favoriteIds.includes(attraction.id)}
                      onFavoritePress={() => handleToggleFavorite(attraction.id)}
                      onPress={() => router.push(`/attraction/${attraction.id}` as any)}
                    />
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={{ alignItems: 'center', paddingVertical: 80, paddingHorizontal: 40 }}>
              <MaterialIcons name="search-off" size={48} color={colors.outline} />
              <Text style={{ marginTop: 16, color: colors.onSurfaceVariant, fontWeight: '500', textAlign: 'center' }}>
                {error || "Não encontramos nada com esses filtros. Tente ajustar sua busca."}
              </Text>
            </View>
          )}
        </View>

        {/* Footer de paginação */}
        {isLoadingMore ? (
          <View style={{ paddingVertical: 24, alignItems: 'center' }}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : hasMore && attractions.length > 0 ? (
          <View style={{ paddingHorizontal: 24, paddingTop: 8 }}>
            <Pressable
              onPress={() => loadMore()}
              style={{ paddingVertical: 16, alignItems: 'center', justifyContent: 'center', borderRadius: 16, backgroundColor: colors.surfaceContainerHigh, borderWidth: 1, borderColor: 'rgba(189, 233, 254, 0.1)' }}
            >
              <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primary, letterSpacing: 2, textTransform: 'uppercase' }}>
                Mostrar mais atrações
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={{ height: 96 }} />
        )}
      </ScrollView>

      <FiltersModal
        isVisible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        onApply={handleApplyFilters}
        initialFilters={activeFilters || undefined}
      />
    </View>
  );
}
