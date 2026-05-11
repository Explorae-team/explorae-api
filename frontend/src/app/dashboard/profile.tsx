import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

// Importando nossos componentes reutilizáveis!
import ExplorerHeader from '../../components/profile/ExplorerHeader';
import UserStats from '../../components/profile/UserStats';
import StatsGrid from '../../components/profile/StatsGrid';
import AchievementsList from '../../components/profile/AchievementsList';
import RecentActivity from '../../components/profile/RecentActivity';

export default function ExplorerProfile() {
  const { updateUserPreferences } = useAuth() as any;
  const [isRefreshing, setIsRefreshing] = useState(true);

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
      <SafeAreaView className="flex-1 bg-surface justify-center items-center">
        <ActivityIndicator size="large" color="#fd6c28" />
        <Text className="mt-4 text-primary font-sans">Carregando explorador...</Text>
      </SafeAreaView>
    );
  }
  return (
    <View className="flex-1 bg-surface">
      <ExplorerHeader />

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ 
          paddingTop: 80, 
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

      {/* Bottom Nav */}
      <View className="absolute bottom-0 left-0 right-0 flex-row justify-around items-center px-4 pt-3 pb-8 bg-surface-bright rounded-t-[32px] border-t border-on-background/10">
        <TouchableOpacity className="items-center p-2">
           <MaterialIcons name="explore" size={24} color="#bde9fe" />
           <Text className="font-sans text-[10px] font-medium uppercase tracking-widest mt-1 text-on-surface">Explore</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center p-2">
           <MaterialIcons name="map" size={24} color="#bde9fe" />
           <Text className="font-sans text-[10px] font-medium uppercase tracking-widest mt-1 text-on-surface">Routes</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center p-2">
           <MaterialIcons name="military-tech" size={24} color="#bde9fe" />
           <Text className="font-sans text-[10px] font-medium uppercase tracking-widest mt-1 text-on-surface">Rankings</Text>
        </TouchableOpacity>
        <TouchableOpacity className="items-center justify-center bg-on-primary-container rounded-2xl p-2 min-w-[64px]">
           <MaterialIcons name="person" size={24} color="#00161e" />
           <Text className="font-sans text-[10px] font-bold uppercase tracking-widest mt-1 text-surface">Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
