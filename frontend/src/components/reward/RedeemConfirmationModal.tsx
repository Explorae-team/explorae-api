import React from 'react';
import { View, Text, Modal, ActivityIndicator, TouchableOpacity, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Reward } from '../../services/rewardService';

interface RedeemConfirmationModalProps {
  visible: boolean;
  reward: Reward | null;
  userCoins: number;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const colors = {
  primary: '#fd6c28',
  tertiary: '#ffba26',
  onSurfaceVariant: '#c1c7cc',
};

export const RedeemConfirmationModal: React.FC<RedeemConfirmationModalProps> = ({
  visible,
  reward,
  userCoins,
  isSubmitting,
  onClose,
  onConfirm
}) => {
  if (!reward) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable 
        onPress={() => !isSubmitting && onClose()}
        className="flex-1 justify-center items-center bg-black/75 px-6"
      >
        <Pressable 
          className="w-full bg-[#00232f] border border-white/5 rounded-3xl overflow-hidden shadow-2xl p-6"
          style={{ maxWidth: 450 }}
        >
          <View>
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-1 pr-2">
                <Text className="text-white/60 text-[9px] font-black uppercase tracking-widest font-sans">
                  Confirmar Troca de Moedas
                </Text>
                <Text className="text-white text-lg font-black font-sans leading-tight mt-1">
                  {reward.name}
                </Text>
                <Text style={{ color: colors.onSurfaceVariant }} className="text-[11px] font-sans mt-0.5">
                  Parceiro: {reward.partner.name}
                </Text>
              </View>
              <View className="bg-[#fd6c28]/10 px-3 py-1.5 rounded-xl border border-[#fd6c28]/25 flex-row items-center">
                <MaterialIcons name="monetization-on" size={16} color={colors.tertiary} style={{ marginRight: 4 }} />
                <Text style={{ color: colors.tertiary }} className="text-xs font-bold font-sans">
                  {reward.costInCoins}
                </Text>
              </View>
            </View>

            <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-sans leading-relaxed mb-6">
              {reward.description}
            </Text>

            <View className="bg-[#002e3c] rounded-2xl p-4 mb-6 border border-white/5">
              <View className="flex-row justify-between items-center mb-2">
                <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-sans">Seu saldo atual:</Text>
                <Text className="text-white text-xs font-bold font-sans">{userCoins} Moedas</Text>
              </View>
              <View className="flex-row justify-between items-center border-t border-white/5 pt-2">
                <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-sans">Saldo após o resgate:</Text>
                <Text style={{ color: colors.tertiary }} className="text-xs font-bold font-sans">
                  {userCoins - reward.costInCoins} Moedas
                </Text>
              </View>
            </View>

            <View className="flex-row">
              <TouchableOpacity
                disabled={isSubmitting}
                onPress={onClose}
                className="flex-1 py-3.5 bg-white/5 border border-white/10 rounded-xl items-center"
                style={{ marginRight: 8 }}
              >
                <Text className="text-white text-xs font-bold font-sans">Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={isSubmitting}
                onPress={onConfirm}
                className="flex-1 py-3.5 rounded-xl items-center flex-row justify-center"
                style={{ backgroundColor: colors.primary }}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#00161e" />
                ) : (
                  <>
                    <MaterialIcons name="shopping-bag" size={14} color="#00161e" style={{ marginRight: 4 }} />
                    <Text className="text-[#00161e] text-xs font-black font-sans">Confirmar</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
