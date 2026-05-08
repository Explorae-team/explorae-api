import React from 'react';
import { View, Text, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export default function UserStats() {
  const { user } = useAuth() as any;
  const userName = user?.name || 'Explorador Anonimo';
  const bio = user?.bio || 'Sempre pronto para a próxima aventura!';
  const level = user?.level || 1;
  const xp = user?.xp || 0;

  const avatarUrl = user?.photoUrl || 'https://i.pravatar.cc/150?img=11';

  const nextLevelXp = level * 100;

  const progressPercentage = Math.min((xp / nextLevelXp) * 100, 100);

  return (
    <View className="items-center mt-6">
      <View className="relative">
        <View className="w-32 h-32 rounded-full p-1 bg-tertiary shadow-xl">
          <Image
            source={{ uri: avatarUrl }}
            className="w-full h-full rounded-full border-4 border-surface"
          />
        </View>
        <View className="absolute -bottom-2 -right-2 bg-tertiary px-3 py-1 rounded-full border-2 border-surface flex-row items-center space-x-1">
          <MaterialIcons name="military-tech" size={16} color="#422d00" />
          <Text className="text-on-tertiary font-black">{level}</Text>
        </View>
      </View>

      <View className="mt-4 items-center">
        <Text className="text-3xl font-black text-on-surface">{userName}</Text>
        <Text className="text-on-surface-variant font-medium mt-1">{bio}</Text>
      </View>


      <View className="w-full mt-8 bg-surface-container-highest rounded-full h-4 overflow-hidden relative">
        <View
          className="absolute top-0 left-0 h-full bg-tertiary rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </View>

      <View className="w-full flex-row justify-between mt-2 px-1">
        <Text className="text-xs font-bold text-tertiary uppercase tracking-widest">{xp} XP</Text>
        <Text className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{nextLevelXp} XP</Text>
      </View>
    </View>
  );
}
