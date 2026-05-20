import React from 'react';
import { View, Text, ScrollView, Pressable, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface Category {
  id: string;
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
}

const CATEGORIES: Category[] = [
  { id: 'all', name: 'Todos', icon: 'apps' },
  { id: 'Cultura', name: 'Cultura', icon: 'theater-comedy' },
  { id: 'Praia', name: 'Praia', icon: 'beach-access' },
  { id: 'Gastronomia', name: 'Gastronomia', icon: 'restaurant' },
  { id: 'Histórico', name: 'Histórico', icon: 'account-balance' },
  { id: 'Natureza', name: 'Natureza', icon: 'forest' },
  { id: 'Aventura', name: 'Aventura', icon: 'explore' },
];

interface CategoryCarouselProps {
  selectedCategoryId?: string | null;
  onSelect?: (id: string) => void;
}

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  selectedCategoryId,
  onSelect,
}) => {
  return (
    <View style={{ gap: 24 }}>
      <Text
        style={{
          fontSize: 12,
          fontWeight: '700',
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: '#c1c7cc',
          textAlign: 'center',
        }}
      >
        Categorias
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        // No web, overflow:scroll permite arrastar com o mouse e não corta o conteúdo
        style={Platform.OS === 'web' ? { overflowX: 'auto' } as any : undefined}
        contentContainerStyle={{
          paddingHorizontal: 24,
          gap: 16,
        }}
      >
        {CATEGORIES.map((category) => {
          const isAll = category.id === 'all';
          const isSelected = (isAll && !selectedCategoryId) || selectedCategoryId === category.id;

          return (
            <Pressable
              key={category.id}
              onPress={() => onSelect?.(isAll ? '' : category.id)}
              style={{ alignItems: 'center' }}
            >
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isSelected ? '#fd6c28' : '#0d3e4e',
                  borderWidth: 1,
                  borderColor: isSelected ? '#fd6c28' : 'rgba(189, 233, 254, 0.1)',
                  // Sombra só no native (boxShadow via style causes issues on web)
                  ...(Platform.OS !== 'web'
                    ? {
                        shadowColor: isSelected ? '#fd6c28' : 'transparent',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: isSelected ? 0.3 : 0,
                        shadowRadius: 8,
                        elevation: isSelected ? 4 : 0,
                      }
                    : {}),
                }}
              >
                <MaterialIcons
                  name={category.icon}
                  size={28}
                  color={isSelected ? 'white' : '#fd6c28'}
                />
              </View>
              <Text
                style={{
                  fontSize: 10,
                  marginTop: 8,
                  fontWeight: '700',
                  color: isSelected ? '#fd6c28' : '#c1c7cc',
                }}
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
