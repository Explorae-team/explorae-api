import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

interface DailyChallengeCardProps {
  title: string;
  description: string;
  progress: number; // 0 to 1
  progressLabel: string;
  rewardXp: number;
  rewardCoins?: number;
  type?: string; // DAILY, WEEKLY, SPECIAL
  onPress?: () => void;
}

export const DailyChallengeCard: React.FC<DailyChallengeCardProps> = ({
  title,
  description,
  progress,
  progressLabel,
  rewardXp,
  rewardCoins = 0,
  type = 'DAILY',
  onPress,
}) => {
  const getTypeConfig = (challengeType: string) => {
    switch (challengeType) {
      case 'WEEKLY':
        return {
          label: 'Desafio Semanal',
          icon: 'workspace-premium' as const,
          iconColor: colors.challengeWeekly,
        };
      case 'SPECIAL':
        return {
          label: 'Desafio Especial',
          icon: 'stars' as const,
          iconColor: colors.challengeSpecial,
        };
      case 'DAILY':
      default:
        return {
          label: 'Desafio Diário',
          icon: 'emoji-events' as const,
          iconColor: colors.primary,
        };
    }
  };

  const config = getTypeConfig(type);

  return (
    <Pressable 
      onPress={onPress}
      className="rounded-2xl bg-surface-container border border-white/10 overflow-hidden w-full"
    >
      <View className="p-6 space-y-4">
        <View className="flex-row justify-between items-start">
          <View className="space-y-1 flex-1 pr-2">
            <Text 
              style={{ color: config.iconColor }}
              className="text-[10px] font-black uppercase tracking-[0.2em]"
            >
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
              className="h-full bg-explora-gold" 
              style={{ width: `${Math.min(Math.max(progress, 0), 1) * 100}%` }} 
            />
          </View>
        </View>

        <View className="flex-row items-center pt-2">
          <View className="flex-row items-center mr-3">
            <MaterialIcons name="star" size={14} color={colors.exploraGold} style={{ marginRight: 4 }} />
            <Text style={{ color: colors.exploraGold }} className="font-bold text-xs">+{rewardXp} XP</Text>
          </View>
          {rewardCoins > 0 && (
            <View className="flex-row items-center mr-3">
              <MaterialIcons name="monetization-on" size={14} color={colors.tertiary} style={{ marginRight: 4 }} />
              <Text style={{ color: colors.tertiary }} className="font-bold text-xs">+{rewardCoins} Moedas</Text>
            </View>
          )}
          <View className="w-1 h-1 rounded-full bg-white/20 mr-3" />
          <Text className="text-white/60 text-xs">Desafio Ativo</Text>
        </View>
      </View>
    </Pressable>
  );
};
