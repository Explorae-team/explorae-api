import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function AchievementsList() {
  const badges = [
    { id: 1, icon: 'wb-sunny', title: 'Early Bird', color: 'tertiary', hex: '#ffba26' },
    { id: 2, icon: 'restaurant', title: 'Gourmet', color: 'on-primary-container', hex: '#fd6c28' },
    { id: 3, icon: 'explore', title: 'Pathfinder', color: 'primary', hex: '#ffb598' },
    { id: 4, icon: 'landscape', title: 'Peak Master', color: 'secondary', hex: '#a2cde1' },
  ];

  return (
    <View className="mt-8">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-xl font-bold tracking-tight text-on-surface">My Badges</Text>
        <Text className="text-tertiary text-xs font-bold uppercase tracking-widest">View All</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-4 flex-row">
        {badges.map((b) => (
          <View key={b.id} className="items-center w-20 mr-4">
            <View className={`w-16 h-16 rounded-full bg-surface-bright items-center justify-center border-2 border-${b.color} mb-3`}>
              <MaterialIcons name={b.icon as any} size={30} color={b.hex} />
            </View>
            <Text className="text-[10px] font-bold uppercase text-center text-on-surface-variant tracking-tighter">{b.title}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
