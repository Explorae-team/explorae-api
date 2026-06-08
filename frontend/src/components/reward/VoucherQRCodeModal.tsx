import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { Voucher, rewardService } from '../../services/rewardService';
import { getVoucherExpirationText } from '../../utils/dateUtils';
import { useCountdown } from '../../hooks/useCountdown';
import { colors } from '../../constants/colors';

interface VoucherQRCodeModalProps {
  visible: boolean;
  voucher: Voucher | null;
  onClose: () => void;
}

export const VoucherQRCodeModal: React.FC<VoucherQRCodeModalProps> = ({
  visible,
  voucher,
  onClose
}) => {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [tokenExpiresAt, setTokenExpiresAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { formattedTime, isTimeLow, expired } = useCountdown(tokenExpiresAt);

  const fetchToken = async () => {
    setLoading(true);
    setError(null);
    setToken(null);
    setTokenExpiresAt(null);

    if (voucher) {
      const res = await rewardService.getVoucherToken(voucher.id);
      if (res.success && res.data) {
        setToken(res.data.token);
        setTokenExpiresAt(res.data.expiresAt);
      } else {
        setError(res.message || 'Erro ao gerar QR Code dinâmico.');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (visible && voucher) {
      fetchToken();
    } else {
      setToken(null);
      setTokenExpiresAt(null);
    }
  }, [visible, voucher?.id]);

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
        className="flex-1 justify-center items-center bg-black/90 px-6"
      >
        <Pressable 
          className="w-full bg-[#001b24] border border-white/5 rounded-3xl p-6 shadow-2xl items-center"
          style={{ maxWidth: 400 }}
        >
          <View className="w-full items-center">
            
            {/* Header da Recompensa */}
            <Text className="text-white/60 text-[9px] font-black uppercase tracking-wider font-sans mb-1">
              Apresentar Recompensa
            </Text>
            <Text className="text-white text-base font-bold text-center mb-1 font-sans px-2" numberOfLines={1}>
              {voucher.reward.name}
            </Text>
            <Text style={{ color: colors.onSurfaceVariant }} className="text-xs font-sans mb-6">
              {voucher.reward.partner.name}
            </Text>

            {/* Container Central (QR Code / Loading / Expired) */}
            <View className="w-full aspect-square bg-[#00232f] rounded-3xl border border-white/5 items-center justify-center p-6 mb-6 relative overflow-hidden">
              
              {loading ? (
                <View className="items-center justify-center">
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text className="text-white/60 text-xs font-sans mt-4 text-center">
                    Gerando QR Code dinâmico...
                  </Text>
                  <Text className="text-white/30 text-[10px] font-sans mt-1 text-center">
                    Garantindo resgate 100% seguro
                  </Text>
                </View>
              ) : error ? (
                <View className="items-center justify-center px-4">
                  <MaterialCommunityIcons name="alert-circle-outline" size={48} color={colors.error} />
                  <Text className="text-white font-bold text-sm text-center mt-3 font-sans">
                    Falha ao carregar
                  </Text>
                  <Text className="text-white/60 text-xs text-center mt-1 font-sans mb-4">
                    {error}
                  </Text>
                  <TouchableOpacity
                    onPress={fetchToken}
                    className="px-4 py-2 bg-white/10 border border-white/10 rounded-xl"
                  >
                    <Text className="text-white text-xs font-bold font-sans">Tentar Novamente</Text>
                  </TouchableOpacity>
                </View>
              ) : expired ? (
                <View className="items-center justify-center px-4">
                  <View className="w-16 h-16 rounded-full bg-[#ffba26]/10 border border-[#ffba26]/20 items-center justify-center mb-4">
                    <MaterialCommunityIcons name="lock-clock" size={32} color={colors.tertiary} />
                  </View>
                  <Text className="text-white font-bold text-base text-center font-sans">
                    Código Expirado
                  </Text>
                  <Text className="text-white/60 text-xs text-center mt-1 font-sans mb-5 leading-relaxed">
                    Por motivos de segurança, o QR Code de validação expira a cada 15 minutos.
                  </Text>
                  <TouchableOpacity
                    onPress={fetchToken}
                    style={{ backgroundColor: colors.primary }}
                    className="w-full py-3 rounded-xl items-center shadow-lg active:opacity-90"
                  >
                    <Text className="text-white text-xs font-bold font-sans">Gerar Novo Código</Text>
                  </TouchableOpacity>
                </View>
              ) : token ? (
                <View className="items-center justify-center">
                  <View className="bg-white p-4 rounded-3xl shadow-lg border border-white/10 items-center justify-center">
                    <QRCode
                      value={token}
                      size={200}
                      color="#00161e"
                      backgroundColor="white"
                      quietZone={10}
                    />
                  </View>
                </View>
              ) : null}
            </View>

            {/* Informações de Expiração do QR */}
            {!loading && !error && !expired && token && (
              <>
                {/* Temporizador regressivo */}
                <View className="flex-row items-center gap-1.5 mb-6">
                  <Ionicons 
                    name="time-outline" 
                    size={13} 
                    color={isTimeLow ? colors.error : colors.tertiary} 
                  />
                  <Text 
                    style={{ color: isTimeLow ? colors.error : colors.tertiary }}
                    className="text-xs font-black font-sans tracking-wider"
                  >
                    EXPIRA EM: {formattedTime}
                  </Text>
                </View>
              </>
            )}

            {/* Termos e Rodapé do Modal */}
            <View className="bg-[#002e3c]/50 rounded-2xl p-4 w-full border border-white/5 mb-6">
              {expirationText && !expired && (
                <Text className="text-[#ffba26] text-[10px] font-black text-center mb-1.5 font-sans tracking-wide">
                  ⏱️ VALIDADE FÍSICA: {expirationText.toUpperCase()}
                </Text>
              )}
              <Text style={{ color: colors.onSurfaceVariant }} className="text-[11px] text-center font-sans leading-relaxed">
                {expired 
                  ? "Este voucher permanece ativo em sua carteira. Basta gerar um novo QR Code acima para validá-lo no estabelecimento."
                  : "Apresente esta tela ao estabelecimento parceiro. O QR Code dinâmico será escaneado e validado em tempo real."}
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
