import React from 'react';
import { View, Text, Modal, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { Voucher } from '../../services/rewardService';
import { getVoucherExpirationText } from '../../utils/dateUtils';

interface VoucherQRCodeModalProps {
  visible: boolean;
  voucher: Voucher | null;
  onClose: () => void;
}

const colors = {
  primary: '#fd6c28',
  onSurfaceVariant: '#c1c7cc',
};

export const VoucherQRCodeModal: React.FC<VoucherQRCodeModalProps> = ({
  visible,
  voucher,
  onClose
}) => {
  if (!voucher) return null;

  const expirationText = getVoucherExpirationText(voucher);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable 
        onPress={onClose}
        className="flex-1 justify-center items-center bg-black/85 px-6"
      >
        <Pressable 
          className="w-full bg-[#00232f] border border-white/5 rounded-3xl p-6 shadow-2xl items-center"
          style={{ maxWidth: 400 }}
        >
          <View className="w-full items-center">
            
            <Text className="text-white/60 text-[9px] font-black uppercase tracking-wider font-sans mb-1">
              Apresentar Recompensa
            </Text>
            <Text className="text-white text-sm font-bold text-center mb-1 font-sans px-2" numberOfLines={1}>
              {voucher.reward.name}
            </Text>
            <Text style={{ color: colors.onSurfaceVariant }} className="text-[11px] font-sans mb-6">
              {voucher.reward.partner.name}
            </Text>

            <View className="bg-white p-4 rounded-3xl shadow-lg border border-white/10 items-center justify-center mb-6">
              <QRCode
                value={voucher.code}
                size={200}
                color="#00161e"
                backgroundColor="white"
                quietZone={10}
              />
            </View>

            <Text className="text-white/40 text-[9px] font-black uppercase tracking-wider font-sans">
              Código do Voucher
            </Text>
            <Text className="text-[#fd6c28] text-lg font-black font-sans tracking-widest mt-0.5 mb-6">
              {voucher.code}
            </Text>

            <View className="bg-[#002e3c]/50 rounded-2xl p-4 w-full border border-white/5 mb-6">
              {expirationText && (
                <Text className="text-[#ffba26] text-[10px] font-black text-center mb-1.5 font-sans tracking-wide">
                  ⏱️ {expirationText.toUpperCase()}
                </Text>
              )}
              <Text style={{ color: colors.onSurfaceVariant }} className="text-[11px] text-center font-sans leading-relaxed">
                Mostre esta tela para o atendente do estabelecimento parceiro na hora da compra/resgate para validar o voucher.
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              className="w-full py-3.5 bg-white/5 border border-white/10 rounded-xl items-center"
            >
              <Text className="text-white text-xs font-bold font-sans">Fechar Visualizador</Text>
            </TouchableOpacity>

          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
