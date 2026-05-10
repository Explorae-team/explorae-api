import React from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useAuth } from '../contexts/AuthContext';
import { Image } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

export default function AchievementsList() {
  const { user } = useAuth();
  
  // Mapeamento de cores para categorias de medalhas
  const categoryColors = {
    'ONBOARDING': '#ffba26',
    'EXPLORACAO': '#fd6c28',
    'JORNADA': '#ffb598',
    'SOCIAL': '#a2cde1'
  };

  const badges = user?.badges || [];

  if (badges.length === 0) {
    return (
      <View className="mt-8">
        <Text className="text-xl font-bold tracking-tight text-on-surface mb-4">Minhas Medalhas</Text>
        <View className="bg-surface-container p-6 rounded-2xl items-center border border-on-background/5">
          <MaterialIcons name="emoji-events" size={48} color="#fd6c2820" />
          <Text className="text-on-surface-variant text-center mt-2 font-sans">
            Você ainda não conquistou medalhas. Comece a explorar para ganhar!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mt-8">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-xl font-bold tracking-tight text-on-surface">Minhas Medalhas</Text>
        <Text className="text-tertiary text-xs font-bold uppercase tracking-widest">Ver Tudo</Text>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={Platform.OS === 'web'} 
        className="pb-4"
        contentContainerStyle={{ paddingRight: 20 }}
      >
        {badges.map((b) => (
          <View key={b.id} className="items-center w-24 mr-4">
            <View 
              className="w-20 h-20 rounded-full bg-surface-bright items-center justify-center border-2 mb-3"
              style={{ borderColor: categoryColors[b.category] || '#fd6c28' }}
            >
              {b.iconUrl ? (
                <Image 
                  source={{ uri: b.iconUrl.startsWith('http') ? b.iconUrl : `${API_URL}${b.iconUrl}` }}
                  className="w-14 h-14"
                  resizeMode="contain"
                />
              ) : (
                <MaterialIcons name="emoji-events" size={36} color={categoryColors[b.category] || '#fd6c28'} />
              )}
            </View>
            <Text className="text-[10px] font-bold uppercase text-center text-on-surface-variant tracking-tighter px-1">
              {b.name}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
