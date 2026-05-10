import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface Category {
  id: string;
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

const CATEGORIES: Category[] = [
  { id: '1', name: 'Natureza', icon: 'forest' },
  { id: '2', name: 'Cultura', icon: 'theater_comedy' },
  { id: '3', name: 'Gastronomia', icon: 'restaurant' },
  { id: '4', name: 'História', icon: 'account_balance' },
  { id: '5', name: 'Aventura', icon: 'explore' },
];

export const CategoryCarousel: React.FC = () => {
  return (
    <View className="space-y-4">
      <Text className="text-sm font-bold uppercase tracking-widest text-on-surface-variant px-6">
        Categorias
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 24 }}
      >
        {CATEGORIES.map((category) => (
          <Pressable 
            key={category.id} 
            className="items-center space-y-3"
          >
            <View className="w-16 h-16 rounded-full bg-surface-bright items-center justify-center shadow-lg border border-outline-variant/10">
              <MaterialIcons name={category.icon} size={30} color="#fd6c28" />
            </View>
            <Text className="text-xs font-semibold text-on-surface">
              {category.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};
