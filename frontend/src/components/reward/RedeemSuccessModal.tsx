import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Voucher } from '../../services/rewardService';

interface RedeemSuccessModalProps {
  visible: boolean;
  voucher: Voucher | null;
  onClose: () => void;
  onShowQRCode: (voucher: Voucher) => void;
}

const colors = {
  primary: '#fd6c28',
  onSurfaceVariant: '#c1c7cc',
  success: '#34d399',
};

export const RedeemSuccessModal: React.FC<RedeemSuccessModalProps> = ({
  visible,
  voucher,
  onClose,
  onShowQRCode
}) => {
  if (!voucher) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/85">
        <View 
          className="w-full bg-[#00232f] border-t border-white/10 rounded-t-[32px] p-6 pb-12"
          style={{ maxHeight: '90%' }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="items-center mt-2 mb-4">
              <View className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 items-center justify-center mb-3">
                <Ionicons name="checkmark-circle" size={36} color={colors.success} />
              </View>
              <Text className="text-white text-lg font-black font-sans">Resgate Realizado com Sucesso!</Text>
              <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-sans text-center mt-1 px-4 leading-normal">
                Você adquiriu o voucher para a recompensa:
              </Text>
              <Text className="text-white text-sm font-bold text-center mt-1 px-2 font-sans">
                {voucher.reward.name}
              </Text>
            </View>



            <View className="bg-[#002e3c]/50 border border-emerald-500/20 rounded-2xl p-4 mb-6 mx-2 flex-row items-start">
              <Ionicons name="information-circle" size={20} color={colors.success} style={{ marginRight: 10, marginTop: 1 }} />
              <View className="flex-1">
                <Text className="text-white text-xs font-bold font-sans mb-1">Este voucher já está salvo!</Text>
                <Text style={{ color: colors.onSurfaceVariant }} className="text-[11px] font-sans leading-relaxed">
                  Não se preocupe se fechar esta tela agora. Sua recompensa está <Text className="text-white font-bold">salva e segura</Text>! 
                  Você pode acessá-la a qualquer momento clicando na aba <Text className="text-[#fd6c28] font-bold">Meus Vouchers</Text> para apresentá-la quando quiser.
                </Text>
              </View>
            </View>

            <View className="space-y-3 px-2">
              
              <TouchableOpacity
                onPress={() => onShowQRCode(voucher)}
                className="w-full py-4 rounded-xl items-center flex-row justify-center mb-3"
                style={{ backgroundColor: colors.primary }}
              >
                <Ionicons name="qr-code-outline" size={16} color="#00161e" style={{ marginRight: 6 }} />
                <Text className="text-[#00161e] text-xs font-black font-sans">Mostrar QR Code Agora</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onClose}
                className="w-full py-4 bg-white/5 border border-white/10 rounded-xl items-center justify-center"
              >
                <Text className="text-white text-xs font-bold font-sans">Entendido, usar depois</Text>
              </TouchableOpacity>
              
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};
