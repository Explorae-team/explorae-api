import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useAuth } from '../contexts/AuthContext';

export default function StatsGrid() {
  const { user } = useAuth();
  const coins = user?.coins || 0;

  const stats = [
    { icon: 'payments', count: coins.toString(), label: 'ExploraCoins' },
    { icon: 'location-on', count: '0', label: 'Check-ins' },
    { icon: 'map', count: '0', label: 'Rotas' },
    { icon: 'bolt', count: '0', label: 'Quests' },
  ];

  return (
    <View className="mt-10 flex-row flex-wrap justify-between">
      {stats.map((stat, idx) => (
        <View key={idx} className="bg-surface-container-high p-5 rounded-lg w-[48%] mb-4 items-start">
          <MaterialIcons name={stat.icon as any} size={24} color="#ffba26" className="mb-1" />
          <Text className="text-2xl font-black text-on-surface">{stat.count}</Text>
          <Text className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}
