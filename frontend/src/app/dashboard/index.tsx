import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  Platform,
  ScrollView,
  useWindowDimensions
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useExploreData } from '../../services/useExploreData';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { useRecommendations } from '../../services/useRecommendations';
import { useFavorites } from '../../services/useFavorites';
import { useCelebration } from '../../contexts/BadgeCelebrationContext';
import api from '../../services/api';
import ExploraScrollView from '../../components/common/ExploraScrollView';

import { ExploreHeader } from '../../components/dashboard/ExploreHeader';
import { UserProgressHero } from '../../components/dashboard/UserProgressHero';
import { DailyChallengeCard } from '../../components/dashboard/DailyChallengeCard';
import { CategoryCarousel } from '../../components/dashboard/CategoryCarousel';
import { AttractionCard } from '../../components/dashboard/AttractionCard';
import AttractionSkeleton from '../../components/dashboard/AttractionSkeleton';
import { TopVisitedList } from '../../components/dashboard/TopVisitedList';
import { MapQuickAccess } from '../../components/dashboard/MapQuickAccess';
import { FiltersModal, FilterState } from '../../components/dashboard/FiltersModal';
import { colors } from '../../constants/colors';

interface LocationCoords {
  latitude: number;
  longitude: number;
}

export default function ExploreScreen() {
  const { user, updateUserPreferences } = useAuth() as any;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState | null>(null);
  const { width: windowWidth } = useWindowDimensions();

  const [coords, setCoords] = useState<LocationCoords>({
  latitude: -7.1196,
  longitude: -34.8450,
});

  useEffect(() => {
    async function requestPermissionsAndGetLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          // Timeout de 3 segundos para evitar travamentos infinitos no GPS do celular
          const locationPromise = Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 3000));
          
          const loc = await Promise.race([locationPromise, timeoutPromise]) as any;
          if (loc && loc.coords) {
            setCoords({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
          } else {
            // Se der timeout, tenta a última localização conhecida ou usa o fallback
            const lastLoc = await Location.getLastKnownPositionAsync({});
            if (lastLoc) {
              setCoords({ latitude: lastLoc.coords.latitude, longitude: lastLoc.coords.longitude });
            } else {
              setCoords({ latitude: -7.1196, longitude: -34.8450 });
            }
          }
        } else {
          setCoords({ latitude: -7.1196, longitude: -34.8450 });
        }
        // Se não concedido, ele mantém o valor inicial de João Pessoa
      } catch (err) {
        console.error('Erro ao obter localização:', err);
      }
    }
    requestPermissionsAndGetLocation();
  }, []);

  const hasActiveFilters = selectedCategory !== null || activeFilters !== null;

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

  // Recomendação horizontal de maior afinidade e geolocalização (limita a 10 itens)
  const {
    recommendations: recsTop,
    isLoading: isLoadingRecsTop,
    refresh: refreshRecsTop
  } = useRecommendations(coords.latitude, coords.longitude, 15);

  // Feed de recomendação paginado para rolagem vertical
  const {
    recommendations: recsVertical,
    isLoading: isLoadingRecsVert,
    isLoadingMore: isLoadingMoreRecsVert,
    hasMore: hasMoreRecsVert,
    refresh: refreshRecsVert,
    loadMore: loadMoreRecsVert
  } = useRecommendations(coords.latitude, coords.longitude, 10);

  const router = useRouter();

  const [challenges, setChallenges] = useState<any[]>([]);
  const [isLoadingChallenges, setIsLoadingChallenges] = useState(true);

  const { favoriteIds, toggleFavorite, fetchFavorites } = useFavorites();
  const { triggerCelebration } = useCelebration();

  const fetchChallenges = async () => {
    try {
      setIsLoadingChallenges(true);
      const response = await api.get('/api/v1/challenges');
      setChallenges(response.data?.data || []);
    } catch (err) {
      console.error('Erro ao buscar desafios:', err);
    } finally {
      setIsLoadingChallenges(false);
    }
  };

  const handleToggleFavorite = async (id: string) => {
    const result = await toggleFavorite(id);
    if (result && result.unlockedBadges && result.unlockedBadges.length > 0) {
      triggerCelebration(result.unlockedBadges);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleRefresh = async () => {
    await Promise.all([
      refresh(selectedCategory || undefined),
      refreshRecsTop(),
      refreshRecsVert(),
      updateUserPreferences(),
      fetchChallenges(),
      fetchFavorites(true)
    ]);
  };

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(prev => {
      if (id === 'all') return null;
      return prev === id ? null : id;
    });
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

      <ExploraScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100, paddingTop: 24 }}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
      >
        <View style={{ gap: 32 }}>

          <UserProgressHero
            userName={user?.name || 'Explorador'}
            level={user?.level || 1}
            currentXp={user?.xp || 0}
            nextLevelXp={(user?.level || 1) * 100} // Fórmula padrão de progressão: nível * 100 XP
          />

          <View style={{ gap: 16 }}>
            <View className="flex-row justify-between items-center px-6">
              <Text className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                Seus Desafios Ativos
              </Text>
            </View>

            {isLoadingChallenges ? (
              <View className="mx-6 p-6 rounded-2xl bg-surface-container border border-white/10 items-center justify-center">
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : challenges.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={Platform.OS === 'web' ? { overflowX: 'auto' } as any : undefined}
                contentContainerStyle={{ 
                  paddingHorizontal: 24,
                  minWidth: '100%',
                  justifyContent: windowWidth >= 768 ? 'center' : 'flex-start'
                }}
              >
                {challenges.map((challenge, index) => (
                  <View 
                    key={challenge.id || index} 
                    style={{ 
                      width: 290, 
                      marginRight: index < challenges.length - 1 ? 16 : 0 
                    }}
                  >
                    <DailyChallengeCard
                      title={challenge.title}
                      description={challenge.description}
                      type={challenge.type}
                      progress={challenge.targetValue > 0 ? (challenge.currentValue / challenge.targetValue) : 0}
                      progressLabel={`${challenge.currentValue}/${challenge.targetValue}`}
                      rewardXp={challenge.xpReward}
                      rewardCoins={challenge.coinsReward}
                    />
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View className="mx-6 p-6 rounded-2xl bg-surface-container border border-white/10 items-center">
                <Text className="text-white/60 text-sm italic">
                  Todos os desafios completados! Volte amanhã.
                </Text>
              </View>
            )}
          </View>

          <CategoryCarousel 
            selectedCategoryId={selectedCategory}
            onSelect={handleCategorySelect}
          />

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
                contentContainerStyle={{ 
                  paddingHorizontal: 24,
                  minWidth: '100%',
                  justifyContent: windowWidth >= 768 ? 'center' : 'flex-start'
                }}
              >
                {[1, 2, 3].map((i) => (
                  <View key={i} style={{ marginRight: 12 }}>
                    <AttractionSkeleton variant="compact" />
                  </View>
                ))}
              </ScrollView>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={Platform.OS === 'web' ? { overflowX: 'auto' } as any : undefined}
                contentContainerStyle={{ 
                  paddingHorizontal: 24,
                  minWidth: '100%',
                  justifyContent: windowWidth >= 768 ? 'center' : 'flex-start'
                }}
              >
                {recsTop.slice(0, 10).map((attraction, index) => (
                  <View key={attraction.id} style={index < Math.min(recsTop.length, 10) - 1 ? { marginRight: 12 } : undefined}>
                    <AttractionCard
                      {...attraction}
                      variant="compact"
                      isFavorite={favoriteIds.includes(attraction.id)}
                      onFavoritePress={() => handleToggleFavorite(attraction.id)}
                      onPress={() => router.push(`/attraction/${attraction.id}` as any)}
                    />
                  </View>
                ))}
              </ScrollView>
            )}
          </View>

          <TopVisitedList attractions={attractions} />

          <MapQuickAccess onPress={() => console.log('Open Map')} />

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
                <MaterialIcons name="tune" size={16} color={colors.primary} />
              </Pressable>
            </View>

            <View style={Platform.OS === 'web' ? { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -8 } : { flexDirection: 'column' }}>
              {hasActiveFilters ? (
                isLoading && !isRefreshing ? (
                  [1, 2, 3].map((i) => (
                    <View key={i} style={Platform.OS === 'web' ? { width: '100%', paddingHorizontal: 8, marginBottom: 32, ...(windowWidth >= 768 ? { width: '33.33%' } : {}) } : { marginBottom: 40 }}>
                      <AttractionSkeleton />
                    </View>
                  ))
                ) : attractions.length > 0 ? (
                  attractions.map((attraction, index) => (
                    <View
                      key={`${attraction.id}-${index}`}
                      style={Platform.OS === 'web' ? { width: '100%', paddingHorizontal: 8, marginBottom: 32, ...(windowWidth >= 768 ? { width: '33.33%' } : {}) } : { marginBottom: 40 }}
                    >
                      <AttractionCard
                        {...attraction}
                        isPopular={index % 4 === 0}
                        isNew={index === 1}
                        isFavorite={favoriteIds.includes(attraction.id)}
                        onFavoritePress={() => handleToggleFavorite(attraction.id)}
                        onPress={() => router.push(`/attraction/${attraction.id}` as any)}
                      />
                    </View>
                  ))
                ) : (
                  <View className="items-center py-10 w-full">
                    <MaterialIcons name="search-off" size={48} color={colors.onSurfaceVariant} />
                    <Text style={{ color: colors.onSurfaceVariant }} className="mt-2 text-center">
                      Nenhuma atração encontrada no momento.
                    </Text>
                  </View>
                )
              ) : (
                isLoadingRecsVert && !isRefreshing ? (
                  [1, 2, 3].map((i) => (
                    <View key={i} style={Platform.OS === 'web' ? { width: '100%', paddingHorizontal: 8, marginBottom: 32, ...(windowWidth >= 768 ? { width: '33.33%' } : {}) } : { marginBottom: 40 }}>
                      <AttractionSkeleton />
                    </View>
                  ))
                ) : recsVertical.length > 0 ? (
                  recsVertical.map((attraction, index) => (
                    <View
                      key={`${attraction.id}-${index}`}
                      style={Platform.OS === 'web' ? { width: '100%', paddingHorizontal: 8, marginBottom: 32, ...(windowWidth >= 768 ? { width: '33.33%' } : {}) } : { marginBottom: 40 }}
                    >
                      <AttractionCard
                        {...attraction}
                        isPopular={index % 4 === 0}
                        isNew={index === 1}
                        isFavorite={favoriteIds.includes(attraction.id)}
                        onFavoritePress={() => handleToggleFavorite(attraction.id)}
                        onPress={() => router.push(`/attraction/${attraction.id}` as any)}
                      />
                    </View>
                  ))
                ) : (
                  <View className="items-center py-10 w-full">
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
                      <ActivityIndicator color={colors.primary} />
                    ) : (
                      <Text className="text-sm font-bold text-primary uppercase tracking-widest">Mostrar mais atrações</Text>
                    )}
                  </Pressable>
                ) : attractions.length > 0 ? (
                  <View className="items-center justify-center py-10">
                    <View className="w-16 h-16 bg-surface-container-high rounded-full items-center justify-center mb-4">
                      <MaterialIcons name="route" size={32} color={colors.outline} />
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
                      <ActivityIndicator color={colors.primary} />
                    ) : (
                      <Text className="text-sm font-bold text-primary uppercase tracking-widest">Mostrar mais atrações</Text>
                    )}
                  </Pressable>
                ) : recsVertical.length > 0 ? (
                  <View className="items-center justify-center py-10">
                    <View className="w-16 h-16 bg-surface-container-high rounded-full items-center justify-center mb-4">
                      <MaterialIcons name="route" size={32} color={colors.outline} />
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
        </View>
      </ExploraScrollView>

      <FiltersModal 
        isVisible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        onApply={handleApplyFilters}
        initialFilters={activeFilters || undefined}
      />
    </View>
  );
}