import React from 'react';
import { View } from 'react-native';
import InterestCard from './InterestCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Interest {
  id: string;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

const INTERESTS: Interest[] = [
  { id: 'sabores', label: 'Sabores Locais', icon: 'silverware-fork-knife' },
  { id: 'ecoturismo', label: 'Ecoturismo', icon: 'leaf' },
  { id: 'historia', label: 'História', icon: 'history' },
  { id: 'noite', label: 'Vida Noturna', icon: 'glass-cocktail' },
  { id: 'aventura', label: 'Aventura', icon: 'compass-outline' },
  { id: 'cultura', label: 'Arte & Cultura', icon: 'palette' },
  { id: 'fotografia', label: 'Fotografia', icon: 'camera' },
  { id: 'relaxamento', label: 'Relaxamento', icon: 'spa' },
  { id: 'arquitetura', label: 'Arquitetura', icon: 'office-building' },
];

interface InterestsGridProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export default function InterestsGrid({ selectedIds, onToggle }: InterestsGridProps) {
  return (
    <View className="flex-row flex-wrap justify-center gap-4">
      {INTERESTS.map((interest) => (
        <View key={interest.id} style={{ width: 'auto' }}>
          <InterestCard
            label={interest.label}
            iconName={interest.icon}
            isSelected={selectedIds.includes(interest.id)}
            onPress={() => onToggle(interest.id)}
          />
        </View>
      ))}
      
      {/* Elemento visual para manter o grid elegante */}
      <View style={{ width: 160, height: 160 }} className="bg-white/5 border border-white/10 rounded-3xl items-center justify-center opacity-40">
         <MaterialCommunityIcons name="plus-circle-outline" size={40} color="#bde9fe50" />
      </View>
    </View>
  );
}
