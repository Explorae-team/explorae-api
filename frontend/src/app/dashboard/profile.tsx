import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Importando nossos componentes reutilizáveis!
import ExplorerHeader from '../../components/ExplorerHeader';
import UserStats from '../../components/UserStats';
import StatsGrid from '../../components/StatsGrid';
import AchievementsList from '../../components/AchievementsList';
import RecentActivity from '../../components/RecentActivity';

export default function ExplorerProfile() {
  return (
    <SafeAreaView className="flex-1 bg-surface">
      <ExplorerHeader />

      <ScrollView className="flex-1 pt-20 px-6" contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
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
    </SafeAreaView>
  );
}
