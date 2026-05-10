import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface DailyChallengeCardProps {
  title: string;
  description: string;
  progress: number; // 0 to 1
  progressLabel: string;
  rewardXp: number;
  onPress?: () => void;
}

export const DailyChallengeCard: React.FC<DailyChallengeCardProps> = ({
  title,
  description,
  progress,
  progressLabel,
  rewardXp,
  onPress,
}) => {
  return (
    <Pressable 
      onPress={onPress}
      className="mx-6 rounded-2xl bg-surface-container-high border border-outline-variant/10 overflow-hidden active:scale-[0.98] transition-transform"
    >
      <View className="p-6 space-y-4">
        <View className="flex-row justify-between items-start">
          <View className="space-y-1">
            <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-on-primary-container">
              Desafio do Dia
            </Text>
            <Text className="text-xl font-bold text-on-surface">{title}</Text>
          </View>
          <View className="bg-on-primary-container p-3 rounded-2xl shadow-lg">
            <MaterialIcons name="emoji_events" size={24} color="#591c00" />
          </View>
        </View>

        <Text className="text-on-surface-variant text-sm leading-relaxed">
          {description}
        </Text>

        <View className="space-y-3 mt-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-bold text-on-surface">Progresso</Text>
            <Text className="text-xs font-bold text-on-primary-container">{progressLabel}</Text>
          </View>
          <View className="h-2 w-full bg-surface-container-lowest rounded-full overflow-hidden">
            <View 
              className="h-full bg-on-primary-container" 
              style={{ width: `${progress * 100}%` }} 
            />
          </View>
        </View>

        <View className="flex-row items-center space-x-2 pt-2">
          <Text className="text-tertiary font-bold">+{rewardXp} XP</Text>
          <View className="w-1 h-1 rounded-full bg-outline-variant" />
          <Text className="text-on-surface-variant text-xs">Emblema Raro</Text>
        </View>
      </View>
    </Pressable>
  );
};
