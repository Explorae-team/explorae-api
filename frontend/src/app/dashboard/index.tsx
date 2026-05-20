import React, { useState, useMemo, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  RefreshControl,
  ActivityIndicator,
  Pressable,
  Platform
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useExploreData } from '../../services/useExploreData';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { useRecommendations } from '../../services/useRecommendations';

// Components
import { ExploreHeader } from '../../components/dashboard/ExploreHeader';
import { UserProgressHero } from '../../components/dashboard/UserProgressHero';
import { DailyChallengeCard } from '../../components/dashboard/DailyChallengeCard';
import { CategoryCarousel } from '../../components/dashboard/CategoryCarousel';
import { AttractionCard } from '../../components/dashboard/AttractionCard';
import AttractionSkeleton from '../../components/dashboard/AttractionSkeleton';
import { TopVisitedList } from '../../components/dashboard/TopVisitedList';
import { MapQuickAccess } from '../../components/dashboard/MapQuickAccess';
import { FiltersModal, FilterState } from '../../components/dashboard/FiltersModal';

const colors = {
  onSurface: '#bde9fe',
  onSurfaceVariant: '#c1c7cc',
  primary: '#fd6c28',
};

export default function ExploreScreen() {
  const { user, updateUserPreferences } = useAuth() as any;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState | null>(null);

  const [coords, setCoords] = useState<{ latitude: number | null; longitude: number | null }>({
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    async function requestPermissionsAndGetLocation() {
      try {
        if (Platform.OS === 'web') {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            setCoords({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
          } else {
            setCoords({ latitude: -7.1196, longitude: -34.8450 });
          }
        } else {
          await ImagePicker.requestCameraPermissionsAsync();
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            setCoords({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
          } else {
            setCoords({ latitude: -7.1196, longitude: -34.8450 });
          }
        }
      } catch (err) {
        console.error('Erro ao obter localização/permissões:', err);
        setCoords({ latitude: -7.1196, longitude: -34.8450 });
      }
    }
    requestPermissionsAndGetLocation();
  }, []);

  const hasActiveFilters = selectedCategory !== null || activeFilters !== null;

  // Constrói objeto de filtros para o hook
  const filters = useMemo(() => ({
    category: selectedCategory || undefined,
    minRating: activeFilters?.minRating || undefined,
    minPrice: activeFilters?.priceRange?.length ? Math.min(...activeFilters.priceRange) : undefined,
    maxPrice: activeFilters?.priceRange?.length ? Math.max(...activeFilters.priceRange) : undefined,
    openNow: activeFilters?.openNow || undefined,
  }), [selectedCategory, activeFilters]);

  const {
    attractions,
    isLoading,
    isLoadingMore,
    isRefreshing,
    hasMore,
    refresh,
    loadMore
  } = useExploreData(filters);

  // Carrossel superior (size 15 - sliced to top 10)
  const {
    recommendations: recsTop,
    isLoading: isLoadingRecsTop,
    refresh: refreshRecsTop
  } = useRecommendations(coords.latitude, coords.longitude, 15);

  // Feed vertical "Descubra" paginado (size 10)
  const {
    recommendations: recsVertical,
    isLoading: isLoadingRecsVert,
    isLoadingMore: isLoadingMoreRecsVert,
    hasMore: hasMoreRecsVert,
    refresh: refreshRecsVert,
    loadMore: loadMoreRecsVert
  } = useRecommendations(coords.latitude, coords.longitude, 10);

  const router = useRouter();

  const handleRefresh = async () => {
    await Promise.all([
      refresh(selectedCategory || undefined),
      refreshRecsTop(),
      refreshRecsVert(),
      updateUserPreferences()
    ]);
  };

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(prev => prev === id ? null : id);
  };

  const handleApplyFilters = (filters: FilterState) => {
    setActiveFilters(filters);
  };

  const handleProfilePress = () => {
    router.push('/dashboard/profile');
  };

  return (
    <View className="flex-1 bg-surface">
      <Stack.Screen options={{ headerShown: false }} />
      <ExploreHeader
        userPhotoUrl={user?.photoUrl}
        onProfilePress={handleProfilePress}
        onNotificationsPress={() => console.log('Notifications')}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100, paddingTop: 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#fd6c28"
          />
        }
      >
        <View className="gap-y-14">

          {/* Hero: User Stats */}
          <UserProgressHero
            userName={user?.name || 'Explorador'}
            level={user?.level || 1}
            currentXp={user?.xp || 0}
            nextLevelXp={(user?.level || 1) * 100} // Fórmula baseada na decisão técnica
          />

          {/* Daily Challenge */}
          <DailyChallengeCard
            title="Caminho das Artes"
            description="Visite 3 murais icônicos para desbloquear esta conquista."
            progress={0.66}
            progressLabel="2/3 murais"
            rewardXp={450}
          />

          {/* Categories */}
          <View className="items-center">
            <CategoryCarousel 
              selectedCategoryId={selectedCategory}
              onSelect={handleCategorySelect}
            />
          </View>

          {/* Recommendations Feed */}
          <View style={{ gap: 24 }}>
            <View className="flex-row justify-between items-center px-6">
              <Text className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                Recomendado para você
              </Text>
              <Pressable>
                <Text className="text-xs font-bold text-on-primary-container">VER TUDO</Text>
              </Pressable>
            </View>

            {isLoadingRecsTop && !isRefreshing ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={Platform.OS === 'web' ? { overflowX: 'auto' } as any : undefined}
                contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
              >
                {[1, 2, 3].map((i) => (
                  <AttractionSkeleton key={i} variant="compact" />
                ))}
              </ScrollView>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={Platform.OS === 'web' ? { overflowX: 'auto' } as any : undefined}
                contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
              >
                {recsTop.slice(0, 10).map((attraction) => (
                  <AttractionCard
                    key={attraction.id}
                    {...attraction}
                    variant="compact"
                    onPress={() => router.push(`/attraction/${attraction.id}` as any)}
                  />
                ))}
              </ScrollView>
            )}
          </View>

          {/* Top Visited */}
          <TopVisitedList attractions={attractions} />

          {/* Map Quick Access */}
          <MapQuickAccess onPress={() => console.log('Open Map')} />

          {/* Vertical Feed (Paginated) */}
          <View style={Platform.OS === 'web'
            ? { paddingBottom: 128 }
            : { paddingHorizontal: 24, paddingBottom: 128 }
          }>
            <View style={[
              { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
              Platform.OS === 'web' ? { paddingHorizontal: 24 } : {}
            ]}>
              <Text style={{ color: colors.onSurface }} className="text-lg font-bold">
                Descubra
              </Text>
              <Pressable 
                onPress={() => setIsFilterModalVisible(true)}
                className="flex-row items-center space-x-1 bg-surface-container-high px-3 py-1.5 rounded-full active:bg-surface-bright"
              >
                <Text className="text-sm font-bold text-primary">Filtros</Text>
                <MaterialIcons name="tune" size={16} color="#fd6c28" />
              </Pressable>
            </View>

            <View style={Platform.OS === 'web' ? { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8 } : { flexDirection: 'column' }}>
              {hasActiveFilters ? (
                isLoading && !isRefreshing ? (
                  [1, 2, 3].map((i) => (
                    <View key={i} style={Platform.OS === 'web' ? { width: '33.33%', paddingHorizontal: 8, marginBottom: 32 } : { marginBottom: 40 }}>
                      <AttractionSkeleton />
                    </View>
                  ))
                ) : attractions.length > 0 ? (
                  attractions.map((attraction, index) => (
                    <View
                      key={`${attraction.id}-${index}`}
                      style={Platform.OS === 'web' ? { width: '33.33%', paddingHorizontal: 8, marginBottom: 32 } : { marginBottom: 40 }}
                    >
                      <AttractionCard
                        {...attraction}
                        isPopular={index % 4 === 0}
                        isNew={index === 1}
                        onPress={() => router.push(`/attraction/${attraction.id}` as any)}
                      />
                    </View>
                  ))
                ) : (
                  <View className="flex-1 items-center py-10 w-full">
                    <MaterialIcons name="search-off" size={48} color={colors.onSurfaceVariant} />
                    <Text style={{ color: colors.onSurfaceVariant }} className="mt-2 text-center">
                      Nenhuma atração encontrada no momento.
                    </Text>
                  </View>
                )
              ) : (
                isLoadingRecsVert && !isRefreshing ? (
                  [1, 2, 3].map((i) => (
                    <View key={i} style={Platform.OS === 'web' ? { width: '33.33%', paddingHorizontal: 8, marginBottom: 32 } : { marginBottom: 40 }}>
                      <AttractionSkeleton />
                    </View>
                  ))
                ) : recsVertical.length > 0 ? (
                  recsVertical.map((attraction, index) => (
                    <View
                      key={`${attraction.id}-${index}`}
                      style={Platform.OS === 'web' ? { width: '33.33%', paddingHorizontal: 8, marginBottom: 32 } : { marginBottom: 40 }}
                    >
                      <AttractionCard
                        {...attraction}
                        isPopular={index % 4 === 0}
                        isNew={index === 1}
                        onPress={() => router.push(`/attraction/${attraction.id}` as any)}
                      />
                    </View>
                  ))
                ) : (
                  <View className="flex-1 items-center py-10 w-full">
                    <MaterialIcons name="search-off" size={48} color={colors.onSurfaceVariant} />
                    <Text style={{ color: colors.onSurfaceVariant }} className="mt-2 text-center">
                      Nenhuma recomendação encontrada no momento.
                    </Text>
                  </View>
                )
              )}
            </View>

            <View className="mt-10">
              {hasActiveFilters ? (
                hasMore ? (
                  <Pressable
                    onPress={() => loadMore(selectedCategory || undefined)}
                    className="py-4 items-center justify-center rounded-2xl bg-surface-container-high border border-outline-variant/20"
                  >
                    {isLoadingMore ? (
                      <ActivityIndicator color="#fd6c28" />
                    ) : (
                      <Text className="text-sm font-bold text-primary uppercase tracking-widest">Mostrar mais atrações</Text>
                    )}
                  </Pressable>
                ) : attractions.length > 0 ? (
                  <View className="items-center justify-center py-10">
                    <View className="w-16 h-16 bg-surface-container-high rounded-full items-center justify-center mb-4">
                      <MaterialIcons name="route" size={32} color="#8b9296" />
                    </View>
                    <Text className="text-lg font-bold text-on-surface text-center mb-2">
                      Você chegou ao fim por agora
                    </Text>
                    <Text className="text-sm text-on-surface-variant text-center mb-6 max-w-[250px]">
                      Mas a cidade é enorme! Que tal buscar por regiões específicas no mapa?
                    </Text>
                    <Pressable
                      onPress={() => console.log('Open Map')}
                      className="bg-surface border-2 border-primary py-3 px-8 rounded-full w-full"
                    >
                      <Text className="text-primary font-bold text-center">VER MAIS NO MAPA</Text>
                    </Pressable>
                  </View>
                ) : null
              ) : (
                hasMoreRecsVert ? (
                  <Pressable
                    onPress={loadMoreRecsVert}
                    className="py-4 items-center justify-center rounded-2xl bg-surface-container-high border border-outline-variant/20"
                  >
                    {isLoadingMoreRecsVert ? (
                      <ActivityIndicator color="#fd6c28" />
                    ) : (
                      <Text className="text-sm font-bold text-primary uppercase tracking-widest">Mostrar mais atrações</Text>
                    )}
                  </Pressable>
                ) : recsVertical.length > 0 ? (
                  <View className="items-center justify-center py-10">
                    <View className="w-16 h-16 bg-surface-container-high rounded-full items-center justify-center mb-4">
                      <MaterialIcons name="route" size={32} color="#8b9296" />
                    </View>
                    <Text className="text-lg font-bold text-on-surface text-center mb-2">
                      Você chegou ao fim por agora
                    </Text>
                    <Text className="text-sm text-on-surface-variant text-center mb-6 max-w-[250px]">
                      Mas a cidade é enorme! Que tal buscar por regiões específicas no mapa?
                    </Text>
                    <Pressable
                      onPress={() => console.log('Open Map')}
                      className="bg-surface border-2 border-primary py-3 px-8 rounded-full w-full"
                    >
                      <Text className="text-primary font-bold text-center">VER MAIS NO MAPA</Text>
                    </Pressable>
                  </View>
                ) : null
              )}
            </View>
          </View>

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
