import React from 'react';
import { View, ViewStyle, Platform } from 'react-native';

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
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progressPercentage,
  variant = 'compact',
  fillColor = '#fd6c28', // cor primária padrão
  glowColor,
  style,
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
    <View 
      className={`w-full bg-surface-container-highest rounded-full overflow-hidden relative ${heightClass}`}
      style={[barStyle, style]}
    >
      <View
        className="absolute top-0 left-0 h-full rounded-full"
        style={{ 
          width: `${progressPercentage}%`, 
          backgroundColor: fillColor 
        }}
      />
    </View>
  );
};
