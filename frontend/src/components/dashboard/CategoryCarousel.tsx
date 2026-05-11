import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface Category {
  id: string;
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

const CATEGORIES: Category[] = [
  { id: 'Cultura', name: 'Cultura', icon: 'theater-comedy' },
  { id: 'Praia', name: 'Praia', icon: 'beach-access' },
  { id: 'Histórico', name: 'Histórico', icon: 'account-balance' },
  { id: 'Natureza', name: 'Natureza', icon: 'forest' },
  { id: 'Compras', name: 'Compras', icon: 'shopping-bag' },
  { id: 'Lazer', name: 'Lazer', icon: 'celebration' },
];

interface CategoryCarouselProps {
  selectedCategoryId?: string | null;
  onSelect?: (id: string) => void;
}

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({ 
  selectedCategoryId, 
  onSelect 
}) => {
  return (
    <View className="flex-col gap-y-6">
      <Text className="text-sm font-bold uppercase tracking-widest text-on-surface-variant text-center">
        Categorias
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingHorizontal: 24, 
          gap: 16,
          flexGrow: 1,
          justifyContent: 'center'
        }}
      >
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategoryId === category.id;
          
          return (
            <Pressable 
              key={category.id} 
              onPress={() => onSelect?.(category.id)}
              className="items-center"
            >
              <View 
                className="w-16 h-16 rounded-2xl items-center justify-center border"
                style={{
                  backgroundColor: isSelected ? '#fd6c28' : '#002e3c',
                  borderColor: isSelected ? '#fd6c28' : 'rgba(65, 72, 75, 0.1)',
                  shadowColor: isSelected ? '#fd6c28' : 'transparent',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isSelected ? 0.3 : 0,
                  shadowRadius: 8,
                  elevation: isSelected ? 4 : 0,
                }}
              >
                <MaterialIcons 
                  name={category.icon} 
                  size={28} 
                  color={isSelected ? 'white' : '#fd6c28'} 
                />
              </View>
              <Text 
                className="text-[10px] mt-2 font-bold"
                style={{ color: isSelected ? '#fd6c28' : '#c1c7cc' }}
              >
                {category.name.toUpperCase()}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};
