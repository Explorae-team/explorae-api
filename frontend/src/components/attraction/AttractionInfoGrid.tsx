import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

interface AttractionInfoGridProps {
  distance?: string;
  openingHours?: string;
  priceRange?: number;
}

export default function AttractionInfoGrid({ 
  distance = "2.5km", 
  openingHours, 
  priceRange 
}: AttractionInfoGridProps) {
  return (
    <View className="flex-row justify-between gap-4 mt-8">
      <View className="flex-1 bg-surface-container-high p-4 rounded-3xl items-center">
        <MaterialCommunityIcons name="map-marker-distance" size={24} color={colors.exploraGold} />
        <Text className="text-[10px] text-white/60 uppercase mt-1">Distância</Text>
        <Text className="text-sm font-bold text-white">{distance}</Text>
      </View>
      
      <View className="flex-1 bg-surface-container-high p-4 rounded-3xl items-center">
        <MaterialCommunityIcons name="clock-outline" size={24} color={colors.exploraGold} />
        <Text className="text-[10px] text-white/60 uppercase mt-1">Horário</Text>
        <Text className="text-[10px] font-bold text-white text-center">
          {openingHours || 'Aberto'}
        </Text>
      </View>
      
      <View className="flex-1 bg-surface-container-high p-4 rounded-3xl items-center">
        <MaterialCommunityIcons name="cash" size={24} color={colors.exploraGold} />
        <Text className="text-[10px] text-white/60 uppercase mt-1">Preço</Text>
        <Text className="text-sm font-bold text-white">
          {priceRange === 0 ? 'Grátis' : '$'.repeat(priceRange || 1)}
        </Text>
      </View>
    </View>
  );
}
