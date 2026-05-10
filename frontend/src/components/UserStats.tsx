import React from 'react';
import { View, Text, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

export default function UserStats() {
  const { user } = useAuth() as any;
  const userName = user?.name || 'Explorador Anônimo';
  const bio = user?.bio || 'Sempre pronto para a próxima aventura!';
  const level = user?.level || 1;
  const xp = user?.xp || 0;

  const avatarUrl = user?.photoUrl 
    ? (user.photoUrl.startsWith('http') ? user.photoUrl : `${API_URL}${user.photoUrl}`)
    : null;

  const levelStartXp = (level - 1) * 100;
  const nextLevelXp = level * 100;
  const currentLevelProgress = xp - levelStartXp;
  
  const progressPercentage = Math.min(Math.max((currentLevelProgress / 100) * 100, 0), 100);

  return (
    <View className="items-center mt-6">
      <View className="relative">
        {/* Simulação de borda gradiente com View aninhada */}
        <View className="w-32 h-32 rounded-full bg-tertiary shadow-xl items-center justify-center overflow-hidden">
          <View className="w-[124px] h-[124px] rounded-full bg-on-primary-container items-center justify-center">
            <View className="w-[118px] h-[118px] rounded-full bg-surface items-center justify-center">
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  className="w-full h-full rounded-full"
                />
              ) : (
                <View className="w-full h-full rounded-full bg-surface-container items-center justify-center">
                  <MaterialIcons name="person" size={64} color="#fd6c28" />
                </View>
              )}
            </View>
          </View>
        </View>
        <View className="absolute -bottom-2 -right-2 bg-tertiary px-3 py-1 rounded-full border-2 border-surface flex-row items-center space-x-1 shadow-lg">
          <MaterialIcons name="military-tech" size={16} color="#422d00" />
          <Text className="text-on-tertiary font-black">{level}</Text>
        </View>
      </View>

      <View className="mt-4 items-center">
        <Text className="text-3xl font-black text-on-surface tracking-tight">{userName}</Text>
        <Text className="text-on-surface-variant font-medium mt-1">{bio}</Text>
      </View>


      <View 
        className="w-full mt-8 bg-surface-container-highest rounded-full h-4 overflow-hidden relative"
        style={{
          shadowColor: '#ffba26',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 10,
          elevation: 5, // Para Android
        }}
      >
        <View
          className="absolute top-0 left-0 h-full bg-tertiary rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </View>

      <View className="w-full flex-row justify-between mt-2 px-1">
        <Text className="text-xs font-bold text-tertiary uppercase tracking-widest">{currentLevelProgress} XP</Text>
        <Text className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">100 XP</Text>
      </View>
    </View>
  );
}
