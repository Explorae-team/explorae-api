import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, SafeAreaView, Pressable, ActivityIndicator, FlatList, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ExploreHeader } from '../../components/dashboard/ExploreHeader';
import { SearchBar } from '../../components/dashboard/SearchBar';
import { CategoryCarousel } from '../../components/dashboard/CategoryCarousel';
import { FiltersModal, FilterState } from '../../components/dashboard/FiltersModal';
import { AttractionCard } from '../../components/dashboard/AttractionCard';
import AppFooter from '../../components/AppFooter';
import { useExploreData } from '../../services/useExploreData';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState | null>(null);

  // Debounce para busca textual
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Constrói objeto de filtros para o hook
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

  const handleApplyFilters = (filters: FilterState) => {
    setActiveFilters(filters);
  };

  return (
    <View className="flex-1 bg-surface">
      <ExploreHeader 
        onNotificationsPress={() => console.log('Notifications')}
      />

      <View className="flex-1">
        <FlatList
          data={attractions}
          key={Platform.OS === 'web' ? 'web-grid' : 'mobile-list'}
          numColumns={Platform.OS === 'web' ? 3 : 1}
          columnWrapperStyle={Platform.OS === 'web' ? { paddingHorizontal: 24, gap: 16 } : null}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <View className={Platform.OS === 'web' ? 'flex-1 mb-6' : 'px-6 mb-6'}>
              <AttractionCard 
                title={item.title}
                tagline={item.tagline}
                imageUrl={item.imageUrl}
                rating={item.rating}
                distance={item.distance}
                type={item.type}
                tags={item.tags}
                priceRange={item.priceRange}
                isPartner={item.isPartner}
              />
            </View>
          )}
          ListHeaderComponent={
            <View className="px-6 pt-6 gap-y-8 mb-6">
              <Text className="text-2xl font-bold text-on-surface">
                Buscar Atrações
              </Text>

              <SearchBar 
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFilterPress={() => setIsFilterModalVisible(true)}
              />

              <CategoryCarousel 
                selectedCategoryId={selectedCategory}
                onSelect={handleCategorySelect}
              />

              <Text className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                {isLoading ? 'Buscando...' : (attractions.length > 0 ? 'Resultados Encontrados' : 'Nenhum resultado')}
              </Text>
            </View>
          }
          ListEmptyComponent={
            !isLoading && (
              <View className="items-center py-20 px-10">
                <MaterialIcons name="search-off" size={48} color="#8b9296" />
                <Text className="mt-4 text-on-surface-variant font-medium text-center">
                  {error || "Não encontramos nada com esses filtros. Tente ajustar sua busca."}
                </Text>
              </View>
            )
          }
          ListFooterComponent={
            isLoadingMore ? (
              <View className="py-6">
                <ActivityIndicator color="#fd6c28" />
              </View>
            ) : <View className="h-24" />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <FiltersModal 
        isVisible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        onApply={handleApplyFilters}
        initialFilters={activeFilters || undefined}
      />

      <AppFooter activeTab="search" />
    </View>
  );
}
