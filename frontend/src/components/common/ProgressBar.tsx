import React from 'react';
import { View, ViewStyle, Platform, Text } from 'react-native';

export interface LevelProgress {
  levelStartXp: number;
  nextLevelXp: number;
  xpNeededForThisLevel: number;
  progressXp: number;
  progressPercentage: number;
}

/**
 * Calcula o progresso do nível do usuário seguindo a Opção B (Cumulativa RPG).
 */
export function calculateLevelProgress(xp: number, level: number): LevelProgress {
  const levelStartXp = 50 * level * (level - 1);
  const nextLevelXp = 50 * (level + 1) * level;
  const xpNeededForThisLevel = nextLevelXp - levelStartXp; // equivalente a level * 100
  const progressXp = xp - levelStartXp;
  const progressPercentage = Math.min(Math.max((progressXp / xpNeededForThisLevel) * 100, 0), 100);

  return {
    levelStartXp,
    nextLevelXp,
    xpNeededForThisLevel,
    progressXp,
    progressPercentage,
  };
}

interface ProgressBarProps {
  progressPercentage: number;
  variant?: 'compact' | 'premium';
  fillColor?: string;
  glowColor?: string;
  style?: any;
  label?: string;
  labelColor?: string;
  currentValue?: number;
  targetValue?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progressPercentage,
  variant = 'compact',
  fillColor = '#fd6c28', // cor primária padrão
  glowColor,
  style,
  label,
  labelColor,
  currentValue,
  targetValue,
}) => {
  const isPremium = variant === 'premium';
  const heightClass = isPremium ? 'h-4' : 'h-3';

  // Configura a sombra/brilho no estilo do React Native
  const barStyle: ViewStyle = isPremium
    ? {
        shadowColor: glowColor || fillColor,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 5,
        ...Platform.select({
          web: {
            boxShadow: `0px 0px 10px ${glowColor || fillColor}`,
          } as any,
        }),
      }
    : {};

  return (
    <View style={style} className="w-full">
      {label !== undefined && currentValue !== undefined && targetValue !== undefined && (
        <View className="flex-row justify-between mb-1.5 px-0.5">
          <Text className="text-xs font-bold tracking-widest uppercase text-on-surface-variant font-sans">
            {label}
          </Text>
          <Text 
            className="text-xs font-bold font-sans" 
            style={{ color: labelColor || fillColor }}
          >
            {currentValue.toLocaleString()} / {targetValue.toLocaleString()} XP
          </Text>
        </View>
      )}
      <View 
        className={`w-full bg-surface-container-highest rounded-full overflow-hidden relative ${heightClass}`}
        style={barStyle}
      >
        <View
          className="absolute top-0 left-0 h-full rounded-full"
          style={{ 
            width: `${progressPercentage}%`, 
            backgroundColor: fillColor 
          }}
        />
      </View>
    </View>
  );
};

