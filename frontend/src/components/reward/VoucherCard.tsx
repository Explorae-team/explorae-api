import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Voucher } from '../../services/rewardService';
import { getVoucherExpirationText } from '../../utils/dateUtils';

interface VoucherCardProps {
  voucher: Voucher;
  onPress?: () => void;
}

interface VoucherStatusUIConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
}

const VOUCHER_STATUS_THEMES: Record<Voucher['status'], VoucherStatusUIConfig> = {
  ACTIVE: {
    label: 'Disponível',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/20',
    iconName: 'check-circle',
  },
  USED: {
    label: 'Utilizado',
    color: 'text-gray-400',
    bgColor: 'bg-white/5',
    borderColor: 'border-white/10',
    iconName: 'done-all',
  },
  EXPIRED: {
    label: 'Expirado',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    borderColor: 'border-rose-500/20',
    iconName: 'cancel',
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

export const VoucherCard: React.FC<VoucherCardProps> = ({ voucher, onPress }) => {
  const statusTheme = VOUCHER_STATUS_THEMES[voucher.status] || VOUCHER_STATUS_THEMES.ACTIVE;
  
  const formattedDate = new Date(voucher.redeemedAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const expirationText = getVoucherExpirationText(voucher);

  return (
    <Pressable
      onPress={voucher.status === 'ACTIVE' ? onPress : undefined}
      style={{ backgroundColor: colors.surfaceContainerHigh }}
      className={`rounded-2xl overflow-hidden border border-white/5 shadow-md flex-row h-28 mb-4 pr-3 ${voucher.status !== 'ACTIVE' ? 'opacity-60' : ''}`}
    >
      <View className="w-1/4 h-full relative">
        <Image
          source={{ uri: voucher.reward.imageUrl || voucher.reward.partner.photoUrl || DEFAULT_FALLBACK_IMAGE }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      <View className="flex-1 p-3 justify-between">
        <View className="space-y-0.5">
          <Text 
            style={{ color: colors.onSurfaceVariant }}
            className="text-[10px] font-black uppercase tracking-wider"
          >
            {voucher.reward.partner.name}
          </Text>
          <Text 
            className="text-xs font-bold text-white leading-tight"
            numberOfLines={1}
          >
            {voucher.reward.name}
          </Text>
          <Text style={{ color: colors.onSurfaceVariant }} className="text-[10px]">
            Resgatado em {formattedDate}
          </Text>
          {expirationText && (
            <View className="flex-row items-center mt-0.5">
              <MaterialIcons name="schedule" size={10} color={colors.tertiary} style={{ marginRight: 3 }} />
              <Text style={{ color: colors.tertiary }} className="text-[9px] font-bold">
                {expirationText}
              </Text>
            </View>
          )}
        </View>

        <View className="flex-row items-center justify-between mt-2">
          <View className={`flex-row items-center border ${statusTheme.bgColor} ${statusTheme.borderColor} px-2 py-0.5 rounded-md`}>
            <MaterialIcons name={statusTheme.iconName} size={10} color="currentColor" style={{ marginRight: 4 }} />
            <Text className={`text-[10px] font-black uppercase ${statusTheme.color}`}>
              {statusTheme.label}
            </Text>
          </View>
          
          {voucher.status === 'ACTIVE' && (
            <View className="flex-row items-center">
              <Text style={{ color: colors.onSurface }} className="text-[10px] font-bold mr-1">
                Ver QR Code
              </Text>
              <MaterialIcons name="qr-code-2" size={14} color={colors.onSurface} />
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};
