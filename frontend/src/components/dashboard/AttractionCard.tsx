import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Image, Platform } from 'react-native';
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
  isPopular?: boolean;
  isNew?: boolean;
  isPartner?: boolean;
  priceRange?: number;
  variant?: 'default' | 'compact';
  onPress?: () => void;
  onFavoritePress?: () => void;
}

const colors = {
  surfaceContainerHigh: '#002e3c',
  surfaceBright: '#0d3e4e',
  surfaceContainer: '#00232f',
  onSurface: '#bde9fe',
  onSurfaceVariant: '#c1c7cc',
  onPrimaryContainer: '#fd6c28',
  tertiary: '#ffba26',
};

export const AttractionCard: React.FC<AttractionCardProps> = ({
  title,
  tagline,
  imageUrl,
  rating,
  distance,
  type,
  tags = [],
  isFavorite = false,
  isPopular = false,
  isNew = false,
  isPartner = false,
  priceRange = 2,
  variant = 'default',
  onPress,
  onFavoritePress,
}) => {
  const defaultFallback = 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=500';
  const [imgUri, setImgUri] = useState(imageUrl || defaultFallback);

  useEffect(() => {
    if (imageUrl) {
      setImgUri(imageUrl);
    } else {
      setImgUri(defaultFallback);
    }
  }, [imageUrl]);
  // Variante compacta para carrosséis horizontais
  if (variant === 'compact') {
    return (
      <Pressable 
        onPress={onPress}
        style={{ 
          backgroundColor: colors.surfaceContainerHigh,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
            },
            android: {
              elevation: 2,
            },
            web: {
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            }
          } as any)
        }}
        className="rounded-xl overflow-hidden border border-white/5 w-40"
      >
        <View className="h-28 w-full">
          <Image 
            source={{ uri: imgUri }} 
            resizeMode="cover" 
            className="w-full h-full" 
            onError={() => setImgUri(defaultFallback)}
          />
          <View className="absolute top-2 right-2 bg-black/40 rounded-full p-1">
            <MaterialIcons name="star" size={10} color={colors.tertiary} />
          </View>
        </View>
        <View className="p-2">
          <Text numberOfLines={1} style={{ color: colors.onSurface }} className="text-xs font-bold">{title}</Text>
          <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px]">{distance} • {type} • {'$'.repeat(priceRange)}</Text>
        </View>
      </Pressable>
    );
  }

  // Variante padrão para o feed vertical principal
  return (
    <Pressable 
      onPress={onPress}
      style={{ 
        backgroundColor: colors.surfaceContainerHigh,
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
          },
          android: {
            elevation: 4,
          },
          web: {
            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)',
          }
        } as any)
      }}
      className="rounded-2xl overflow-hidden border border-white/5"
    >
      <View className="h-40 w-full relative">
        <Image 
          source={{ uri: imgUri }} 
          resizeMode="cover" 
          className="w-full h-full" 
          onError={() => setImgUri(defaultFallback)}
        />
        
        <View 
          style={{ backgroundColor: colors.surfaceBright + 'CC' }} // 80% opacity
          className="absolute top-3 left-3 px-3 py-1 rounded-full flex-row items-center space-x-1.5 shadow-sm"
        >
          <MaterialIcons name="visibility" size={12} color={colors.onPrimaryContainer} />
          <Text 
            style={{ color: colors.onSurface, letterSpacing: 2 }} 
            className="text-[10px] font-black uppercase"
          >
            {type.toUpperCase()}
          </Text>
        </View>

        <Pressable 
          onPress={onFavoritePress}
          testID="favorite-button"
          style={{ backgroundColor: colors.surfaceBright + 'CC' }} // 80% opacity
          className="absolute top-3 right-3 w-8 h-8 rounded-full items-center justify-center shadow-sm"
        >
          <MaterialIcons 
            name={isFavorite ? "favorite" : "favorite-border"} 
            size={18} 
            color={colors.onPrimaryContainer} 
          />
        </Pressable>

        <View className="absolute top-12 left-3 flex-col space-y-1.5">
          {isPopular && (
            <View 
              style={{ backgroundColor: colors.tertiary }} 
              className="px-2 py-0.5 rounded-sm shadow-sm self-start"
            >
              <Text className="text-[8px] font-black text-black uppercase">POPULAR</Text>
            </View>
          )}
          {isNew && (
            <View 
              style={{ backgroundColor: colors.onPrimaryContainer }} 
              className="px-2 py-0.5 rounded-sm shadow-sm self-start"
            >
              <Text className="text-[8px] font-black text-white uppercase">NOVO</Text>
            </View>
          )}
          {isPartner && (
            <View 
              style={{ backgroundColor: '#4CAF50' }} 
              className="px-2 py-0.5 rounded-sm shadow-sm self-start flex-row items-center space-x-1"
            >
              <MaterialIcons name="verified" size={8} color="white" />
              <Text className="text-[8px] font-black text-white uppercase">PARCEIRO</Text>
            </View>
          )}
        </View>
      </View>

      <View className="p-4 flex-col">
        <View className="flex-row items-center space-x-4 mb-2">
          <View className="flex-row items-center space-x-1">
            <MaterialIcons name="star" size={14} color={colors.tertiary} />
            <Text style={{ color: colors.tertiary }} className="text-xs font-bold">{rating.toFixed(1)}</Text>
          </View>
          
          <View className="flex-row items-center space-x-1">
            <MaterialIcons name="location-on" size={14} color={colors.onSurfaceVariant} />
            <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-medium">{distance}</Text>
          </View>

          <View className="flex-row items-center space-x-1">
            <Text style={{ color: colors.onPrimaryContainer }} className="text-xs font-bold">{'$'.repeat(priceRange)}</Text>
          </View>
        </View>

        <View className="mb-2">
          <Text 
            numberOfLines={2} 
            style={{ color: colors.onSurface, lineHeight: 22 }} 
            className="text-lg font-bold mb-1"
          >
            {title}
          </Text>
          <Text 
            numberOfLines={1} 
            style={{ color: colors.onSurfaceVariant }} 
            className="text-sm font-normal"
          >
            {tagline}
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-2 mt-1">
          {tags.slice(0, 3).map((tag, index) => (
            <View 
              key={index} 
              style={{ backgroundColor: colors.surfaceContainer }} 
              className="px-2 py-1 rounded-md"
            >
              <Text 
                style={{ color: colors.onSurfaceVariant, letterSpacing: 0.5 }} 
                className="text-[10px] font-bold uppercase"
              >
                {tag}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
};
