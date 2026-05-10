import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface TopAttraction {
  id: string;
  name: string;
  category: string;
}

const MOCK_TOP: TopAttraction[] = [
  { id: '1', name: 'Farol do Cabo Branco', category: 'História & Natureza' },
  { id: '2', name: 'Mercado de Artesanato', category: 'Cultura & Compras' },
  { id: '3', name: 'Pôr do Sol no Jacaré', category: 'Natureza & Lazer' },
];

export const TopVisitedList: React.FC = () => {
  return (
    <View className="space-y-4 px-6">
      <Text className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">
        Mais Visitados
      </Text>
      <View className="space-y-3">
        {MOCK_TOP.map((item, index) => (
          <Pressable 
            key={item.id}
            className="flex-row items-center justify-between p-4 bg-surface-container rounded-2xl border border-outline-variant/10 active:bg-surface-container-high"
          >
            <View className="flex-row items-center space-x-4">
              <Text className="text-2xl font-black text-on-surface-variant/30 italic w-8">
                {(index + 1).toString().padStart(2, '0')}
              </Text>
              <View className="space-y-0.5">
                <Text className="font-bold text-on-surface">{item.name}</Text>
                <Text className="text-[10px] text-on-surface-variant uppercase tracking-widest font-medium">
                  {item.category}
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#c1c7cc" />
          </Pressable>
        ))}
      </View>
    </View>
  );
};
