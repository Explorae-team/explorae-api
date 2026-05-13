import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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
        <Text className="text-xs font-black uppercase tracking-[3px] text-[#F2641F]">
          Mais Visitados
        </Text>
        <View className="flex-row items-center space-x-1 bg-[#F2641F]/10 px-2 py-1 rounded-full">
          <MaterialIcons name="trending-up" size={14} color="#F2641F" />
          <Text className="text-[10px] font-bold text-[#F2641F]">TRENDING</Text>
        </View>
      </View>

      <View className="flex-col gap-y-4">
        {attractions.slice(0, 3).map((item, index) => (
          <Pressable 
            key={item.id}
            onPress={() => router.push(`/attraction/${item.id}` as any)}
            className="flex-row items-center p-2 bg-[#0d3e4e]/40 rounded-[24px] border border-white/5 active:bg-[#0d3e4e]/60"
          >
            {/* Image Container with Rank Overlay */}
            <View className="relative">
              <Image 
                source={{ uri: item.imageUrl }} 
                className="w-20 h-20 rounded-[20px]"
                resizeMode="cover"
              />
              <View 
                className="absolute -top-2 -left-2 w-8 h-8 rounded-full items-center justify-center border-2 border-[#003646]"
                style={{ backgroundColor: index === 0 ? '#F2641F' : '#33658A' }}
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
                  <Text className="text-[9px] font-bold text-[#bde9fe] uppercase tracking-wider">
                    {item.type}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <MaterialIcons name="star" size={12} color="#ffba26" />
                  <Text className="text-[10px] font-bold text-[#ffba26] ml-0.5">
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
