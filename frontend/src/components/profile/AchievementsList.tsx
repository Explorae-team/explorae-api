import React, { useState } from 'react';
import { View, Text, ScrollView, Platform, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useAuth } from '../../contexts/AuthContext';
import { BadgeDetailModal } from './BadgeDetailModal';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

export default function AchievementsList() {
  const router = useRouter();
  const { user } = useAuth() as any;
  const [selectedBadge, setSelectedBadge] = useState<any>(null);
  
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
        <TouchableOpacity onPress={() => router.push('/dashboard/badges')}>
          <Text className="text-tertiary text-xs font-bold uppercase tracking-widest">Ver Tudo</Text>
        </TouchableOpacity>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={Platform.OS === 'web'} 
        className="pb-4"
        contentContainerStyle={{ paddingRight: 20 }}
      >
        {badges.map((b: any) => (
          <TouchableOpacity 
            key={b.id} 
            onPress={() => setSelectedBadge(b)}
            className="items-center w-24 mr-4"
            activeOpacity={0.7}
          >
            <View 
              className="w-20 h-20 rounded-full bg-surface-bright items-center justify-center border-2 mb-3"
              style={{ 
                borderColor: (categoryColors as any)[b.category] || '#fd6c28',
                overflow: 'hidden'
              }}
            >
              {b.iconUrl ? (
                <Image 
                  source={{ uri: b.iconUrl.startsWith('http') ? b.iconUrl : `${API_URL}${b.iconUrl}` }}
                  style={{ 
                    width: '115%', 
                    height: '115%',
                    borderRadius: 46
                  }}
                  resizeMode="cover"
                />
              ) : (
                <MaterialIcons name="emoji-events" size={36} color={(categoryColors as any)[b.category] || '#fd6c28'} />
              )}
            </View>
            <Text className="text-[10px] font-bold uppercase text-center text-on-surface-variant tracking-tighter px-1">
              {b.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal de Detalhe da Medalha */}
      <BadgeDetailModal
        visible={!!selectedBadge}
        item={selectedBadge ? { type: 'BADGE', data: selectedBadge, isUnlocked: true } : null}
        onClose={() => setSelectedBadge(null)}
      />
    </View>
  );
}
