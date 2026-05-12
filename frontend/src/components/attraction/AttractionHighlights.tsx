import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface AttractionHighlightsProps {
  highlights: string[];
}

export default function AttractionHighlights({ highlights }: AttractionHighlightsProps) {
  if (!highlights || highlights.length === 0) return null;

  return (
    <View className="mt-10">
      <View className="flex-row items-center gap-4 mb-6">
        <Text className="text-xl font-bold text-[#bde9fe]">O que encontrar</Text>
        <View className="flex-1 h-[1px] bg-[#053a4a]" />
      </View>
      
      <View className="flex-row flex-wrap gap-4">
        {highlights.map((item, index) => (
          <View 
            key={index} 
            style={{ width: (width - 64) / 2 }} 
            className="bg-[#0d3e4e]/40 p-4 rounded-2xl flex-row items-center gap-3 border border-white/5"
          >
            <View className="bg-[#F2641F]/10 p-2 rounded-xl">
              <MaterialCommunityIcons name="check-circle-outline" size={20} color="#F2641F" />
            </View>
            <Text className="text-white text-[10px] font-semibold">{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
