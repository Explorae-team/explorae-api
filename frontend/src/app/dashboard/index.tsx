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
          <View className="px-6 space-y-6">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-xl font-black text-on-surface uppercase tracking-tighter">
                  Próximas Aventuras
                </Text>
                <Text className="text-xs font-medium text-on-surface-variant">
                  Baseado nas suas preferências
                </Text>
              </View>
            </View>

            <View className="space-y-6">
              {attractions.map((attraction, index) => (
                <AttractionCard
                  key={`${attraction.id}-${index}`}
                  {...attraction}
                  onPress={() => console.log('Attraction pressed', attraction.id)}
                />
              ))}
            </View>

            {hasMore && (
              <Pressable
                onPress={loadMore}
                className="py-4 items-center justify-center rounded-2xl bg-surface-container-high border border-outline-variant/20 active:bg-surface-bright"
              >
                {isLoadingMore ? (
                  <ActivityIndicator color="#fd6c28" />
                ) : (
                  <Text className="text-sm font-bold text-primary">MOSTRAR MAIS ATRAÇÕES</Text>
                )}
              </Pressable>
            )}
          </View>

        </View>
      </ScrollView>

      <AppFooter activeTab="explore" />
    </View>
  );
}


