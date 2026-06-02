import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Voucher } from '../../services/rewardService';
import { VoucherCard } from './VoucherCard';

interface VoucherHistoryAccordionProps {
  inactiveVouchers: Voucher[];
  isExpanded: boolean;
  onToggle: () => void;
}

export const VoucherHistoryAccordion: React.FC<VoucherHistoryAccordionProps> = ({
  inactiveVouchers,
  isExpanded,
  onToggle
}) => {
  if (inactiveVouchers.length === 0) return null;

  return (
    <View className="mt-4 border-t border-white/5 pt-4">
      <TouchableOpacity
        onPress={onToggle}
        className="flex-row justify-between items-center bg-[#002532]/35 border border-white/5 px-4 py-3.5 rounded-xl active:opacity-80"
      >
        <View className="flex-row items-center">
          <Ionicons name="archive-outline" size={16} color="#8b9296" style={{ marginRight: 8 }} />
          <Text className="text-[#8b9296] text-xs font-bold font-sans">
            Histórico de Cupons ({inactiveVouchers.length})
          </Text>
        </View>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={16}
          color="#8b9296"
        />
      </TouchableOpacity>

      {isExpanded && (
        <View className="mt-3 space-y-1">
          {inactiveVouchers.map((voucher) => (
            <VoucherCard
              key={voucher.id}
              voucher={voucher}
            />
          ))}
        </View>
      )}
    </View>
  );
};
