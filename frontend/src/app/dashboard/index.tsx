import React from 'react';
import {
  ScrollView,
  View,
  Text,
  RefreshControl,
  ActivityIndicator,
  Pressable
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useExploreData } from '../../services/useExploreData';

// Components
import { ExploreHeader } from '../../components/ExploreHeader';
import { UserProgressHero } from '../../components/UserProgressHero';
import { DailyChallengeCard } from '../../components/DailyChallengeCard';
import { CategoryCarousel } from '../../components/CategoryCarousel';
import { AttractionCard } from '../../components/AttractionCard';
import { TopVisitedList } from '../../components/TopVisitedList';
import { MapQuickAccess } from '../../components/MapQuickAccess';
import AppFooter from '../../components/AppFooter';

const colors = {
  onSurface: '#bde9fe',
  onSurfaceVariant: '#c1c7cc',
  primary: '#fd6c28',
};

export default function ExploreScreen() {
  const { user, logout, updateUserPreferences } = useAuth();
  const {
    attractions,
    isLoading,
    isLoadingMore,
    isRefreshing,
    hasMore,
    refresh,
    loadMore
  } = useExploreData();
  const router = useRouter();

  const handleRefresh = async () => {
    await Promise.all([
      refresh(),
      updateUserPreferences() // Atualiza XP/Level do usuário
    ]);
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
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#fd6c28"
          />
        }
      >
        <View className="space-y-8">

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
          <CategoryCarousel />

          {/* Recommendations Feed */}
          <View className="space-y-4">
            <View className="flex-row justify-between items-center px-6">
              <Text className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
                Recomendado para você
              </Text>
              <Pressable>
                <Text className="text-xs font-bold text-on-primary-container">VER TUDO</Text>
              </Pressable>
            </View>

            {isLoading && !isRefreshing ? (
              <View className="h-40 items-center justify-center">
                <ActivityIndicator color="#fd6c28" />
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}
              >
                {attractions.slice(0, 5).map((attraction) => (
                  <AttractionCard
                    key={attraction.id}
                    {...attraction}
                    variant="compact"
                    onPress={() => console.log('Attraction pressed', attraction.id)}
                  />
                ))}
              </ScrollView>
            )}
          </View>

          {/* Top Visited */}
          <TopVisitedList />

          {/* Map Quick Access */}
          <MapQuickAccess onPress={() => console.log('Open Map')} />

          {/* Vertical Feed (Paginated) */}
          <View className="px-6 pb-20">
            <View className="flex-row justify-between items-center mb-6">
              <Text style={{ color: colors.onSurface }} className="text-lg font-bold">
                Descubra
              </Text>
              <Pressable className="flex-row items-center space-x-1 bg-surface-container-high px-3 py-1.5 rounded-full active:scale-95">
                <Text className="text-sm font-bold text-primary">Filtros</Text>
                <MaterialIcons name="tune" size={16} color="#fd6c28" />
              </Pressable>
            </View>

            <View className="space-y-6">
              {attractions.length > 0 ? (
                attractions.map((attraction, index) => (
                  <AttractionCard 
                    key={`${attraction.id}-${index}`}
                    {...attraction}
                    isPopular={index % 4 === 0}
                    isNew={index === 1}
                    onPress={() => console.log('Attraction pressed', attraction.id)}
                  />
                ))
              ) : !isLoading && (
                <View className="items-center py-10">
                  <MaterialIcons name="search-off" size={48} color={colors.onSurfaceVariant} />
                  <Text style={{ color: colors.onSurfaceVariant }} className="mt-2 text-center">
                    Nenhuma atração encontrada no momento.
                  </Text>
                </View>
              )}
            </View>

            <View className="mt-10">
              {hasMore ? (
                <Pressable 
                  onPress={loadMore}
                  className="py-4 items-center justify-center rounded-2xl bg-surface-container-high border border-outline-variant/20 active:bg-surface-bright"
                >
                  {isLoadingMore ? (
                    <ActivityIndicator color="#fd6c28" />
                  ) : (
                    <Text className="text-sm font-bold text-primary uppercase tracking-widest">Mostrar mais atrações</Text>
                  )}
                </Pressable>
              ) : (
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
                    className="bg-surface border-2 border-primary py-3 px-8 rounded-full active:bg-primary/5 active:scale-95 transition-all w-full"
                  >
                    <Text className="text-primary font-bold text-center">VER MAIS NO MAPA</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>

        </View>
      </ScrollView>

      <AppFooter activeTab="explore" />
    </View>
  );
}


