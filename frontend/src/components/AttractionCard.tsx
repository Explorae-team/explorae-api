import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';

interface AttractionCardProps {
  title: string;
  tagline: string;
  imageUrl: string;
  rating: number;
  distance: string;
  type: string;
  tags: string[];
  isFavorite?: boolean;
  onPress?: () => void;
  onFavoritePress?: () => void;
}

/**
 * AttractionCard - Componente de card para exibição de atrações.
 * Implementado com base no design "Default Variant" do Horizon Design System.
 */
export const AttractionCard: React.FC<AttractionCardProps> = ({
  title,
  tagline,
  imageUrl,
  rating,
  distance,
  type,
  tags,
  isFavorite = false,
  onPress,
  onFavoritePress,
}) => {
  return (
    <Pressable 
      onPress={onPress}
      className="bg-surface-container-high rounded-2xl overflow-hidden shadow-lg border border-transparent active:border-primary/20 transition-all duration-300"
    >
      {/* Header Section: Image and Overlays */}
      <View className="h-40 w-full relative">
        <Image
          source={{ uri: imageUrl }}
          contentFit="cover"
          transition={500}
          className="w-full h-full"
        />
        
        {/* Type Badge (Top-Left) */}
        <View className="absolute top-3 left-3 bg-surface-bright/80 rounded-full px-3 py-1 flex-row items-center space-x-1.5 shadow-sm">
          <MaterialIcons name="visibility" size={12} color="#fd6c28" />
          <Text className="text-[10px] font-black uppercase tracking-widest text-on-surface">
            {type}
          </Text>
        </View>

        {/* Favorite Button (Top-Right) */}
        <Pressable 
          testID="favorite-button"
          onPress={onFavoritePress}
          className="absolute top-3 right-3 w-8 h-8 bg-surface-bright/80 rounded-full items-center justify-center active:scale-110 transition-transform"
        >
          <MaterialIcons 
            name={isFavorite ? "favorite" : "favorite-border"} 
            size={18} 
            color="#fd6c28" 
          />
        </Pressable>
      </View>

      {/* Content Section */}
      <View className="p-4 flex-col gap-2">
        {/* Metadata: Rating and Distance */}
        <View className="flex-row items-center space-x-4">
          <View className="flex-row items-center space-x-1">
            <MaterialIcons name="star" size={14} color="#ffba26" />
            <Text className="text-xs font-bold text-tertiary">{rating.toFixed(1)}</Text>
          </View>
          
          <View className="flex-row items-center space-x-1">
            <MaterialIcons name="location-on" size={14} color="#8b9296" />
            <Text className="text-xs font-medium text-on-surface-variant">{distance}</Text>
          </View>
        </View>

        {/* Title and Tagline */}
        <View>
          <Text 
            numberOfLines={2} 
            className="text-lg font-bold text-on-surface leading-tight mb-1"
          >
            {title}
          </Text>
          <Text 
            numberOfLines={1} 
            className="text-sm text-on-surface-variant"
          >
            {tagline}
          </Text>
        </View>

        {/* Tags Row */}
        <View className="flex-row flex-wrap gap-2 mt-1">
          {tags.map((tag, index) => (
            <View 
              key={index} 
              className="bg-surface-container-lowest px-2 py-1 rounded-md"
            >
              <Text className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                {tag}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
};
