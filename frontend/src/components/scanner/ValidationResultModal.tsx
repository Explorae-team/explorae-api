import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VoucherValidationResponse } from '../../services/rewardService';

interface ValidationResultModalProps {
  visible: boolean;
  successData: VoucherValidationResponse | null;
  errorMsg: string | null;
  onClose: () => void;
}

const colors = {
  primary: '#fd6c28',
  success: '#10b981',
  error: '#ef4444',
  background: '#001b24',
  surface: '#00232f',
};

export const ValidationResultModal: React.FC<ValidationResultModalProps> = ({
  visible,
  successData,
  errorMsg,
  onClose
}) => {
  const insets = useSafeAreaInsets();
  const isSuccess = successData !== null;

  if (!visible) return null;

  return (
    <Modal 
      visible={visible} 
      transparent={true} 
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/85">
        <View 
          className="bg-[#001b24] border-t border-white/5 rounded-t-[40px] p-6 items-center"
          style={{ paddingBottom: insets.bottom + 24 }}
        >
          {isSuccess ? (
            <>
              {/* Badge de Verificado */}
              <View className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 items-center justify-center mb-5 mt-2">
                <Ionicons name="checkmark-circle" size={54} color={colors.success} />
              </View>

              <Text className="text-emerald-400 font-black text-xl tracking-tight text-center font-sans mb-1">
                Voucher Validado!
              </Text>
              <Text className="text-white/60 text-xs text-center font-sans mb-6">
                A recompensa foi consumida com sucesso no sistema.
              </Text>

              {/* Box de Detalhes */}
              <View className="w-full bg-[#00232f] border border-white/5 rounded-3xl p-5 mb-8 gap-4">
                
                <View className="flex-row justify-between items-center border-b border-white/5 pb-3">
                  <Text className="text-white/40 text-[10px] font-black uppercase font-sans">Voucher ID</Text>
                  <Text className="text-white text-xs font-bold font-sans">{successData?.voucherCode}</Text>
                </View>

                <View className="flex-row justify-between items-center border-b border-white/5 pb-3">
                  <Text className="text-white/40 text-[10px] font-black uppercase font-sans">Recompensa</Text>
                  <Text className="text-white text-xs font-bold font-sans text-right max-w-[200px]" numberOfLines={1}>
                    {successData?.rewardName}
                  </Text>
                </View>

                <View className="flex-row justify-between items-center border-b border-white/5 pb-3">
                  <Text className="text-white/40 text-[10px] font-black uppercase font-sans">Estabelecimento</Text>
                  <Text className="text-white text-xs font-bold font-sans">{successData?.partnerName}</Text>
                </View>

                <View className="flex-row justify-between items-center border-b border-white/5 pb-3">
                  <Text className="text-white/40 text-[10px] font-black uppercase font-sans">Explorador</Text>
                  <Text className="text-[#fd6c28] text-xs font-black font-sans">{successData?.userName}</Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text className="text-white/40 text-[10px] font-black uppercase font-sans">Data do Uso</Text>
                  <Text className="text-white/60 text-xs font-sans">
                    {successData?.validatedAt ? new Date(successData.validatedAt).toLocaleString('pt-BR') : ''}
                  </Text>
                </View>

              </View>

              <TouchableOpacity
                onPress={onClose}
                style={{ backgroundColor: colors.success }}
                className="w-full py-4 rounded-2xl items-center shadow-lg active:opacity-90"
              >
                <Text className="text-white text-sm font-black font-sans tracking-wide">
                  Concluir Validação
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Badge de Erro */}
              <View className="w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500 items-center justify-center mb-5 mt-2">
                <Ionicons name="close-circle" size={54} color={colors.error} />
              </View>

              <Text className="text-red-400 font-black text-xl tracking-tight text-center font-sans mb-1">
                Validação Falhou
              </Text>
              <Text className="text-white/60 text-xs text-center font-sans mb-6">
                Este voucher não pôde ser resgatado no momento.
              </Text>

              {/* Mensagem do Erro */}
              <View className="w-full bg-[#00232f] border border-red-500/15 rounded-3xl p-5 mb-8 items-center justify-center">
                <Text className="text-white/90 text-sm font-bold text-center font-sans leading-relaxed">
                  {errorMsg}
                </Text>
              </View>

              <TouchableOpacity
                onPress={onClose}
                style={{ backgroundColor: colors.error }}
                className="w-full py-4 rounded-2xl items-center shadow-lg active:opacity-90"
              >
                <Text className="text-white text-sm font-black font-sans tracking-wide">
                  Tentar Novamente
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};
