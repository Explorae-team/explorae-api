import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface DailyChallengeCardProps {
  title: string;
  description: string;
  progress: number; // 0 to 1
  progressLabel: string;
  rewardXp: number;
  type?: string; // DAILY, WEEKLY, SPECIAL
  onPress?: () => void;
}

export const DailyChallengeCard: React.FC<DailyChallengeCardProps> = ({
  title,
  description,
  progress,
  progressLabel,
  rewardXp,
  type = 'DAILY',
  onPress,
}) => {
  const getTypeConfig = (challengeType: string) => {
    switch (challengeType) {
      case 'WEEKLY':
        return {
          label: 'Desafio Semanal',
          icon: 'workspace-premium' as const,
          iconColor: '#00e5ff',
          tagColor: 'text-[#00e5ff]',
        };
      case 'SPECIAL':
        return {
          label: 'Desafio Especial',
          icon: 'stars' as const,
          iconColor: '#ffea00',
          tagColor: 'text-[#ffea00]',
        };
      case 'DAILY':
      default:
        return {
          label: 'Desafio Diário',
          icon: 'emoji-events' as const,
          iconColor: '#fd6c28',
          tagColor: 'text-[#fd6c28]',
        };
    }
  };

  const config = getTypeConfig(type);

  return (
    <Pressable 
      onPress={onPress}
      className="rounded-2xl bg-[#002532] border border-white/10 overflow-hidden w-full"
    >
      <View className="p-6 space-y-4">
        <View className="flex-row justify-between items-start">
          <View className="space-y-1 flex-1 pr-2">
            <Text className={`text-[10px] font-black uppercase tracking-[0.2em] ${config.tagColor}`}>
              {config.label}
            </Text>
            <Text className="text-lg font-bold text-white leading-tight">{title}</Text>
          </View>
          <View className="bg-white/5 p-3 rounded-2xl border border-white/10 shadow-lg">
            <MaterialIcons name={config.icon} size={24} color={config.iconColor} />
          </View>
        </View>

        <Text className="text-white/70 text-sm leading-relaxed min-h-[40px]">
          {description}
        </Text>

        <View className="space-y-3 mt-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-bold text-white">Progresso</Text>
            <Text className="text-xs font-bold text-white/80">{progressLabel}</Text>
          </View>
          <View className="h-2 w-full bg-white/5 border border-white/10 rounded-full overflow-hidden">
            <View 
              className="h-full bg-[#FFB700]" 
              style={{ width: `${Math.min(Math.max(progress, 0), 1) * 100}%` }} 
            />
          </View>
        </View>

        <View className="flex-row items-center space-x-2 pt-2">
          <Text className="text-[#FFB700] font-bold">+{rewardXp} XP</Text>
          <View className="w-1 h-1 rounded-full bg-white/20" />
          <Text className="text-white/60 text-xs">Desafio Ativo</Text>
        </View>
      </View>
    </Pressable>
  );
};
