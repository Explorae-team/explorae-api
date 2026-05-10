import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface InterestCardProps {
  label: string;
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
  isSelected: boolean;
  onPress: () => void;
}

export default function InterestCard({ label, iconName, isSelected, onPress }: InterestCardProps) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.7}
      style={{ width: 160, height: 160 }}
      className={`rounded-3xl p-5 justify-between border-2 ${
        isSelected 
          ? 'bg-[#fd6c28] border-[#fd6c28]' 
          : 'bg-white/5 border-white/10'
      }`}
    >
      <View className={`w-12 h-12 rounded-2xl items-center justify-center ${
        isSelected ? 'bg-white/20' : 'bg-[#fd6c28]/10'
      }`}>
        <MaterialCommunityIcons 
          name={iconName} 
          size={28} 
          color={isSelected ? 'white' : '#fd6c28'} 
        />
      </View>
      
      <Text 
        className={`text-lg font-bold leading-tight ${
          isSelected ? 'text-white' : 'text-[#bde9fe]'
        }`}
      >
        {label}
      </Text>

      {isSelected && (
        <View className="absolute top-3 right-3 bg-white rounded-full p-1">
          <MaterialCommunityIcons name="check" size={12} color="#fd6c28" />
        </View>
      )}
    </TouchableOpacity>
  );
}
