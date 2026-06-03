import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Modal, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { rewardService, VoucherValidationResponse } from '../../services/rewardService';

// Sub-componentes modulares e reutilizáveis
import { ScannerViewfinder } from '../../components/scanner/ScannerViewfinder';
import { ValidationResultModal } from '../../components/scanner/ValidationResultModal';

const colors = {
  primary: '#fd6c28',
  background: '#001b24',
  surface: '#00232f',
};

export default function PartnerScannerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<VoucherValidationResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [scanned, setScanned] = useState(false);

  const handleValidateToken = async (token: string) => {
    setLoading(true);
    setErrorMsg(null);
    setSuccessData(null);
    
    const res = await rewardService.validateVoucher(token);
    setLoading(false);
    
    if (res.success && res.data) {
      setSuccessData(res.data);
    } else {
      setErrorMsg(res.message || 'Falha ao validar voucher. Código inválido ou expirado.');
    }
  };

  const handleCloseModals = () => {
    setSuccessData(null);
    setErrorMsg(null);
    setScanned(false);
  };

  const isResultModalVisible = successData !== null || errorMsg !== null;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <View className="flex-1" style={{ paddingTop: insets.top }}>
        
        {/* Botão de voltar e título da tela */}
        <View className="flex-row items-center justify-between px-6 h-16 border-b border-white/5">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="p-2 -ml-2 rounded-full bg-white/5 border border-white/5"
          >
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
          </TouchableOpacity>
          <Text className="text-white text-base font-bold font-sans tracking-tight">
            Validador de Voucher
          </Text>
          <View className="w-10 h-10" />
        </View>

        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Texto de suporte para guiar o lojista parceiro */}
          <View className="bg-[#00232f]/80 rounded-2xl p-4 border border-white/5 mb-8">
            <Text className="text-white/60 text-xs leading-relaxed text-center font-sans">
              Posicione o QR Code temporário do cliente em frente ao leitor para realizar a homologação instantânea da recompensa.
            </Text>
          </View>

          {/* Visor onde renderizamos a câmera traseira do celular ou a animação de testes */}
          <ScannerViewfinder 
            onBarcodeScanned={(data) => {
              setScanned(true);
              handleValidateToken(data);
            }}
            scanned={scanned || loading || isResultModalVisible}
          />

          {/* Informações da versão do leitor de parceiros */}
          <View className="w-full max-w-[320px] mx-auto mt-2 items-center">
            <Text className="text-white/30 text-[9px] font-black uppercase tracking-widest font-sans">
              Exploraê Parceiros v1.0
            </Text>
          </View>
        </ScrollView>

        {/* Overlay de carregamento travando a tela durante a verificação de segurança no backend */}
        <Modal visible={loading} transparent={true} animationType="fade">
          <View className="flex-1 justify-center items-center bg-black/75">
            <View className="bg-[#00232f] p-6 rounded-3xl border border-white/5 items-center justify-center max-w-[280px]">
              <ActivityIndicator size="large" color={colors.primary} />
              <Text className="text-white font-bold text-sm text-center mt-4 font-sans">
                Validando Voucher
              </Text>
              <Text className="text-white/50 text-xs text-center mt-1 font-sans">
                Decodificando chaves de segurança...
              </Text>
            </View>
          </View>
        </Modal>

        {/* Modal de feedback mostrando se o voucher é válido (sucesso) ou se expirou/já foi usado */}
        <ValidationResultModal 
          visible={isResultModalVisible}
          successData={successData}
          errorMsg={errorMsg}
          onClose={handleCloseModals}
        />

      </View>
    </KeyboardAvoidingView>
  );
}
