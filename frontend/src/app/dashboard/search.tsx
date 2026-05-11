import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ExploreHeader } from '../../components/dashboard/ExploreHeader';
import { SearchBar } from '../../components/dashboard/SearchBar';
import { CategoryCarousel } from '../../components/dashboard/CategoryCarousel';
import { FiltersModal, FilterState } from '../../components/dashboard/FiltersModal';
import AppFooter from '../../components/AppFooter';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState | null>(null);

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(prev => prev === id ? null : id);
  };

  const handleApplyFilters = (filters: FilterState) => {
    setActiveFilters(filters);
    console.log('Filters Applied:', filters);
  };

  return (
    <View className="flex-1 bg-surface">
      
      <ExploreHeader 
        onNotificationsPress={() => console.log('Notifications')}
      />

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-6 gap-y-10">
          <Text className="text-2xl font-bold text-on-surface">
            Buscar Atrações
          </Text>

          {/* SearchBar */}
          <SearchBar 
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFilterPress={() => setIsFilterModalVisible(true)}
          />

          {/* Categories */}
          <CategoryCarousel 
            selectedCategoryId={selectedCategory}
            onSelect={handleCategorySelect}
          />

          {/* Results Area (Placeholder) */}
          <View className="mt-4">
            <Text className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-6">
              {searchQuery || selectedCategory || activeFilters ? 'Resultados Encontrados' : 'Sugestões para você'}
            </Text>
            
            <View className="items-center py-20 bg-surface-container-low rounded-3xl border border-dashed border-outline-variant/20">
              <MaterialIcons 
                name={searchQuery || selectedCategory || activeFilters ? "search" : "auto-awesome"} 
                size={48} 
                color="#8b9296" 
              />
              <Text className="mt-4 text-on-surface-variant font-medium">
                {searchQuery || selectedCategory || activeFilters
                  ? `Buscando por "${searchQuery || selectedCategory || 'filtros ativos'}"...` 
                  : "Explore por nome ou categoria"
                }
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <FiltersModal 
        isVisible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        onApply={handleApplyFilters}
      />

      <AppFooter activeTab="search" />
    </View>
  );
}
