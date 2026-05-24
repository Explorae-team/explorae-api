import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ProgressBar, calculateLevelProgress } from '../common/ProgressBar';

interface UserProgressHeroProps {
  userName: string;
  level: number;
  currentXp: number;
  nextLevelXp: number;
}

export const UserProgressHero: React.FC<UserProgressHeroProps> = ({
  userName,
  level,
  currentXp,
  nextLevelXp,
}) => {
  const { progressXp, xpNeededForThisLevel, progressPercentage } = calculateLevelProgress(currentXp, level);

  return (
    <View className="space-y-4 px-6 pt-4">
      <View className="flex-row justify-between items-end">
        <View>
          <Text className="text-on-surface-variant text-sm font-medium">
            Bem-vindo, Explorador!
          </Text>
          <Text className="text-3xl font-extrabold tracking-tight text-on-surface">
            {userName}
          </Text>
        </View>
        <View className="bg-tertiary-container px-4 py-1.5 rounded-full flex-row items-center space-x-2 border border-tertiary/20">
          <MaterialIcons name="military-tech" size={16} color="#ffba26" />
          <Text className="text-tertiary font-bold text-sm">Nível {level}</Text>
        </View>
      </View>

      <View className="mt-2">
        <ProgressBar
          progressPercentage={progressPercentage}
          fillColor="#ffba26" // cor correspondente ao bg-tertiary
          variant="compact"
          label="XP ATUAL"
          currentValue={progressXp}
          targetValue={xpNeededForThisLevel}
        />
      </View>
    </View>
  );
};
