import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function InterestsSection() {
  const interests = ['Gastronomia', 'Ecoturismo', 'História'];

  return (
    <View className="px-4 py-6">
      <Text className="text-[18px] font-bold text-on-surface mb-4">Meus Interesses</Text>
      <View className="flex-row flex-wrap gap-3">
        {interests.map((interest, index) => (
          <TouchableOpacity 
            key={index} 
            className="px-5 py-3 rounded-full bg-on-primary-container/20 border border-on-primary-container/30 flex-row items-center gap-2"
          >
            <Text className="text-on-primary-container text-[14px] font-bold">{interest}</Text>
            <MaterialIcons name="close" size={16} color="#fd6c28" />
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity 
          className="px-5 py-3 rounded-full bg-surface-container-high border border-transparent flex-row items-center gap-2 hover:bg-surface-bright"
        >
          <MaterialIcons name="add" size={18} color="#c1c7cc" />
          <Text className="text-on-surface-variant text-[14px] font-medium">Adicionar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
