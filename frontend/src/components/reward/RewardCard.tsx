import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Reward } from '../../services/rewardService';

interface RewardCardProps {
  reward: Reward;
  onPress?: () => void;
}

interface RewardTypeUIConfig {
  label: string;
  badgeClass: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
}

const REWARD_UI_THEMES: Record<Reward['type'], RewardTypeUIConfig> = {
  DISCOUNT: {
    label: 'Desconto',
    badgeClass: 'bg-emerald-600 text-white border-emerald-500',
    iconName: 'local-offer',
  },
  EXPERIENCE: {
    label: 'Experiência',
    badgeClass: 'bg-cyan-600 text-white border-cyan-500',
    iconName: 'directions-bike',
  },
  PRODUCT: {
    label: 'Brinde',
    badgeClass: 'bg-amber-600 text-white border-amber-500',
    iconName: 'card-giftcard',
  },
};

const colors = {
  surfaceContainerHigh: '#002e3c',
  surfaceBright: '#0d3e4e',
  surfaceContainer: '#00232f',
  onSurface: '#bde9fe',
  onSurfaceVariant: '#c1c7cc',
  onPrimaryContainer: '#fd6c28',
  tertiary: '#ffba26',
};

const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=500';

export const RewardCard: React.FC<RewardCardProps> = ({ reward, onPress }) => {
  const theme = REWARD_UI_THEMES[reward.type] || {
    label: 'Recompensa',
    badgeClass: 'bg-blue-600 text-white border-blue-500',
    iconName: 'stars',
  };

  return (
    <Pressable
      onPress={onPress}
      style={{ backgroundColor: colors.surfaceContainerHigh }}
      className="rounded-2xl overflow-hidden border border-white/5 shadow-md flex-row h-32 mb-4 pr-3"
    >
      <View className="w-1/3 h-full relative">
        <Image
          source={{ uri: reward.imageUrl || reward.partner.photoUrl || DEFAULT_FALLBACK_IMAGE }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <View 
          className={`absolute top-2 left-2 px-2 py-0.5 rounded-md border flex-row items-center ${theme.badgeClass}`}
        >
          <MaterialIcons name={theme.iconName} size={10} color="currentColor" style={{ marginRight: 4 }} />
          <Text className="text-[9px] font-bold uppercase">{theme.label}</Text>
        </View>
      </View>

      <View className="flex-1 p-3 justify-between">
        <View className="space-y-1">
          <Text 
            style={{ color: colors.onSurfaceVariant }}
            className="text-[10px] font-black uppercase tracking-wider"
          >
            {reward.partner.name}
          </Text>
          <Text 
            className="text-sm font-bold text-white leading-tight"
            numberOfLines={2}
          >
            {reward.name}
          </Text>
        </View>

        <View className="flex-row items-center justify-between pt-1">
          <View className="flex-row items-center bg-[#fd6c28]/10 border border-[#fd6c28]/20 px-2 py-1 rounded-lg">
            <MaterialIcons name="monetization-on" size={14} color={colors.tertiary} style={{ marginRight: 4 }} />
            <Text style={{ color: colors.tertiary }} className="font-black text-xs">
              {reward.costInCoins} Moedas
            </Text>
          </View>
          
          <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px]">
            {reward.stock} restantes
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
