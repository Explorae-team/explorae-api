import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';

const StatefulImage: React.FC<{ uri: string; className?: string; resizeMode?: any }> = ({ uri, className, resizeMode }) => {
  const defaultFallback = 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=500';
  const [src, setSrc] = useState({ uri });
  
  useEffect(() => {
    setSrc({ uri });
  }, [uri]);

  return (
    <Image 
      source={src} 
      className={className} 
      resizeMode={resizeMode} 
      onError={() => setSrc({ uri: defaultFallback })}
    />
  );
};

interface TopAttraction {
  id: string;
  title: string;
  type: string;
  imageUrl: string;
  rating: number;
}

interface TopVisitedListProps {
  attractions: any[];
}

export const TopVisitedList: React.FC<TopVisitedListProps> = ({ attractions }) => {
  const router = useRouter();

  if (!attractions || attractions.length === 0) return null;

  return (
    <View className="gap-y-6 px-6">
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-black uppercase tracking-[3px] text-accent">
          Mais Visitados
        </Text>
        <View className="flex-row items-center space-x-1 bg-accent/10 px-2 py-1 rounded-full">
          <MaterialIcons name="trending-up" size={14} color={colors.accent} />
          <Text className="text-[10px] font-bold text-accent">TRENDING</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'column', gap: 16 }}>
        {attractions.slice(0, 3).map((item, index) => (
          <Pressable 
            key={item.id}
            onPress={() => router.push(`/attraction/${item.id}` as any)}
            className="flex-row items-center p-2 bg-surface-bright/40 rounded-[24px] border border-white/5 active:bg-surface-bright/60"
          >
            {/* Image Container with Rank Overlay */}
            <View className="relative">
              <StatefulImage 
                uri={item.imageUrl} 
                className="w-20 h-20 rounded-[20px]"
                resizeMode="cover"
              />
              <View 
                className="absolute -top-2 -left-2 w-8 h-8 rounded-full items-center justify-center border-2 border-explora-blue"
                style={{ backgroundColor: index === 0 ? colors.accent : colors.secondary }}
              >
                <Text className="text-xs font-black text-white italic">
                  {index + 1}
                </Text>
              </View>
            </View>

            <View className="flex-1 ml-4 space-y-1">
              <Text numberOfLines={1} className="text-base font-bold text-white">
                {item.title}
              </Text>
              <View className="flex-row items-center space-x-2">
                <View className="bg-white/10 px-2 py-0.5 rounded-md">
                  <Text className="text-[9px] font-bold text-on-background uppercase tracking-wider">
                    {item.type}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <MaterialIcons name="star" size={12} color={colors.tertiary} />
                  <Text className="text-[10px] font-bold text-tertiary ml-0.5">
                    {item.rating > 0 ? item.rating.toFixed(1) : '4.5'}
                  </Text>
                </View>
              </View>
            </View>

            <View className="mr-2 bg-white/5 p-2 rounded-full">
              <MaterialIcons name="chevron-right" size={20} color="rgba(255,255,255,0.5)" />
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
};
