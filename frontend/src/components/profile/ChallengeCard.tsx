import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ProgressBar } from '../common/ProgressBar';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'DAILY' | 'WEEKLY' | 'SPECIAL';
  actionType: string;
  targetValue: number;
  xpReward: number;
  coinsReward: number;
  startDate: string;
  endDate: string;
  currentValue: number;
  completed: boolean;
  completedAt?: string;
}

interface ChallengeCardProps {
  challenge: Challenge;
  onPress: () => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onPress }) => {
  const progressPercent = Math.min(100, (challenge.currentValue / challenge.targetValue) * 100);

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-[#002532] border border-white/5 p-4 rounded-2xl mb-4"
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 pr-4">
          <Text className="text-white font-bold text-base font-sans mb-1">{challenge.title}</Text>
          <Text className="text-white/60 text-xs font-sans" numberOfLines={2}>
            {challenge.description}
          </Text>
        </View>
        
        {challenge.completed ? (
          <View className="bg-green-500/10 border border-green-500/30 px-3 py-1 rounded-full flex-row items-center">
            <MaterialIcons name="check" size={12} color="#4ade80" />
            <Text className="text-[#4ade80] text-[10px] font-bold font-sans ml-1">Concluído</Text>
          </View>
        ) : (
          <View className="bg-white/5 border border-white/10 px-3 py-1 rounded-full">
            <Text className="text-white/70 text-[10px] font-bold font-sans">Pendente</Text>
          </View>
        )}
      </View>

      {/* Barra de Progresso Reutilizável */}
      <View className="mb-4">
        <View className="flex-row justify-between items-center mb-1.5">
          <Text className="text-white/40 text-[10px] font-bold font-sans">Progresso</Text>
          <Text className="text-white/80 text-xs font-bold font-sans">
            {challenge.currentValue} / {challenge.targetValue}
          </Text>
        </View>
        <ProgressBar 
          progressPercentage={progressPercent}
          fillColor={challenge.completed ? '#4ade80' : '#fd6c28'}
        />
      </View>

      {/* Recompensas */}
      <View className="flex-row items-center border-t border-white/5 pt-3 justify-between">
        <Text className="text-white/40 text-[10px] font-bold uppercase tracking-wider font-sans">Recompensas</Text>
        <View className="flex-row items-center">
          <View className="flex-row items-center mr-3 bg-white/5 px-2.5 py-1 rounded-lg">
            <MaterialIcons name="star" size={12} color="#fd6c28" />
            <Text className="text-white text-[10px] font-bold ml-1 font-sans">+{challenge.xpReward} XP</Text>
          </View>
          <View className="flex-row items-center bg-white/5 px-2.5 py-1 rounded-lg">
            <MaterialIcons name="monetization-on" size={12} color="#ffba26" />
            <Text className="text-white text-[10px] font-bold ml-1 font-sans">+{challenge.coinsReward}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
