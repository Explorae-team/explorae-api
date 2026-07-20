import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Platform, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';

interface ScannerViewfinderProps {
  onBarcodeScanned?: (data: string) => void;
  scanned?: boolean;
}

const colors = {
  primary: '#fd6c28',
};

export const ScannerViewfinder: React.FC<ScannerViewfinderProps> = ({ 
  onBarcodeScanned, 
  scanned = false 
}) => {
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const [permission, requestPermission] = useCameraPermissions();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const startScanAnimation = () => {
      scanLineAnim.setValue(0);
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 2500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 2500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          })
        ])
      ).start();
    };

    startScanAnimation();
  }, [scanLineAnim]);

  const scanTranslateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 220],
  });

  const showCamera = Platform.OS !== 'web' && permission?.granted && !hasError;

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (onBarcodeScanned && !scanned) {
      onBarcodeScanned(data);
    }
  };

  return (
    <View className="w-full aspect-square max-w-[320px] mx-auto rounded-3xl bg-[#00141b] border-2 border-white/10 items-center justify-center relative overflow-hidden mb-8 shadow-2xl">
      
      {/* Feed da câmera traseira real (somente no celular se o usuário autorizar) */}
      {showCamera ? (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        />
      ) : (
        /* Caso a câmera esteja bloqueada ou o app esteja rodando em simulador/web */
        <View className="absolute inset-0 items-center justify-center p-6">
          {Platform.OS !== 'web' && !permission?.granted ? (
            <View className="items-center justify-center">
              <MaterialCommunityIcons name="camera-off" size={40} color="rgba(255,255,255,0.4)" className="mb-3" />
              <Text className="text-white text-xs font-bold font-sans text-center mb-4 leading-relaxed">
                Permissão de câmera necessária para escanear QR Codes.
              </Text>
              <TouchableOpacity
                onPress={requestPermission}
                style={{ backgroundColor: colors.primary }}
                className="px-4 py-2 rounded-xl"
              >
                <Text className="text-white text-xs font-bold font-sans">Ativar Câmera</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Visual de scan fictício para manter os testes funcionais no navegador local */
            <>
              <View className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 items-center justify-center pointer-events-none">
                <MaterialCommunityIcons name="qrcode-scan" size={48} color={colors.primary} className="opacity-80" />
              </View>
              <Text className="absolute bottom-6 text-[#fd6c28]/80 text-[10px] font-black uppercase tracking-widest font-sans">
                Aguardando Leitura (Simulador)...
              </Text>
            </>
          )}
        </View>
      )}

      {/* Mira física desenhada sobreposta (bordas laranja e linha de laser animada) */}
      <View style={[styles.corner, styles.topLeft]} />
      <View style={[styles.corner, styles.topRight]} />
      <View style={[styles.corner, styles.bottomLeft]} />
      <View style={[styles.corner, styles.bottomRight]} />

      <Animated.View 
        style={[
          styles.scanLine, 
          { transform: [{ translateY: scanTranslateY }] }
        ]} 
      />

      {/* Grid de fundo sutil aplicado apenas na tela preta de simulação */}
      {!showCamera && (
        <View className="absolute inset-8 border border-[#fd6c28]/10 rounded-2xl flex-row justify-around opacity-40 pointer-events-none">
          <View className="w-[1px] bg-[#fd6c28]/10 h-full" />
          <View className="w-[1px] bg-[#fd6c28]/10 h-full" />
          <View className="w-[1px] bg-[#fd6c28]/10 h-full" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: colors.primary,
  },
  topLeft: {
    top: 20,
    left: 20,
    borderLeftWidth: 3,
    borderTopWidth: 3,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: 20,
    right: 20,
    borderRightWidth: 3,
    borderTopWidth: 3,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: 20,
    left: 20,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: 20,
    right: 20,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderBottomRightRadius: 12,
  },
  scanLine: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: 20,
    height: 2,
    backgroundColor: colors.primary,
    opacity: 0.85,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
  }
});
