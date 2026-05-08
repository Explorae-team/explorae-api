import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function StatsGrid() {
  const stats = [
    { icon: 'location-on', count: '128', label: 'Check-ins' },
    { icon: 'map', count: '42', label: 'Routes' },
    { icon: 'bolt', count: '15', label: 'Quests' },
    { icon: 'group', count: '24', label: 'Friends' },
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
