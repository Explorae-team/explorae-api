import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

// Importando nossos componentes reutilizáveis!
import ExplorerHeader from '../../components/profile/ExplorerHeader';
import UserStats from '../../components/profile/UserStats';
import StatsGrid from '../../components/profile/StatsGrid';
import AchievementsList from '../../components/profile/AchievementsList';
import RecentActivity from '../../components/profile/RecentActivity';

import { colors } from '../../constants/colors';

export default function ExplorerProfile() {
  const { updateUserPreferences } = useAuth() as any;
  const [isRefreshing, setIsRefreshing] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    async function fetchProfile() {
      try {
        await updateUserPreferences();
      } finally {
        setIsRefreshing(false);
      }
    }
    fetchProfile();
  }, []);

  if (isRefreshing) {
    return (
      <View className="flex-1 bg-surface justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="mt-4 text-primary font-sans">Carregando explorador...</Text>
      </View>
    );
  }
  return (
    <View className="flex-1 bg-surface">
      <ExplorerHeader />

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ 
          paddingTop: insets.top + 80, 
          paddingBottom: 160, 
          paddingHorizontal: 24,
          flexGrow: 1
        }} 
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      >
        <UserStats />
        <StatsGrid />
        <AchievementsList />
        <RecentActivity />
      </ScrollView>

    </View>
  );
}
