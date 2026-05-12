import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface Category {
  id: string;
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

const CATEGORIES: Category[] = [
  { id: 'all', name: 'Todos', icon: 'apps' },
  { id: '1', name: 'Natureza', icon: 'forest' },
  { id: '2', name: 'Cultura', icon: 'theater-comedy' },
  { id: '3', name: 'Gastronomia', icon: 'restaurant' },
  { id: '4', name: 'História', icon: 'account-balance' },
  { id: '5', name: 'Aventura', icon: 'explore' },
];

interface CategoryCarouselProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ 
  selectedCategory, 
  onCategorySelect 
}) => {
  return (
    <View className="flex-col gap-y-6">
      <Text className="text-sm font-bold uppercase tracking-widest text-on-surface-variant px-6">
        Categorias
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 24 }}
      >
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category.name || (category.id === 'all' && selectedCategory === '');
          return (
            <Pressable 
              key={category.id} 
              onPress={() => onCategorySelect(category.id === 'all' ? '' : category.name)}
              className="items-center space-y-3"
            >
              <View className={`w-16 h-16 rounded-full items-center justify-center shadow-lg border ${
                isActive 
                  ? 'bg-primary border-primary' 
                  : 'bg-surface-bright border-outline-variant/10'
              }`}>
                <MaterialIcons 
                  name={category.icon} 
                  size={30} 
                  color={isActive ? 'white' : '#fd6c28'} 
                />
              </View>
              <Text className={`text-xs font-semibold ${isActive ? 'text-primary' : 'text-on-surface'}`}>
                {category.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};
