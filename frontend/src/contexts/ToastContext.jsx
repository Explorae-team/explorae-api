import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Vibration, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeOutDown, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { colors } from '../constants/colors';

const ToastContext = createContext({
  showToast: (message, type = 'success', duration = 3000) => {}
});

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const insets = useSafeAreaInsets();
  const timerRef = useRef(null);

  const showToast = (message, type = 'success', duration = 3000) => {
    // Limpa timer anterior se houver
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Feedback tátil de vibração no celular para dar sensação de feedback físico
    if (Platform.OS !== 'web') {
      Vibration.vibrate(40);
    }

    setToast({ message, type });

    timerRef.current = setTimeout(() => {
      setToast(null);
    }, duration);
  };

  const handleDismiss = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setToast(null);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const getIconAndColor = (type) => {
    switch (type) {
      case 'success':
        return {
          name: 'check-circle',
          color: colors.success || '#10b981',
          bgBorder: 'border-[#10b981]/20'
        };
      case 'error':
        return {
          name: 'alert-circle',
          color: colors.error || '#ffb4ab',
          bgBorder: 'border-[#ffb4ab]/20'
        };
      case 'info':
      default:
        return {
          name: 'information',
          color: colors.secondary || '#a2cde1',
          bgBorder: 'border-[#a2cde1]/20'
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <Animated.View
          entering={SlideInDown.duration(400).springify().damping(15)}
          exiting={SlideOutDown.duration(300)}
          style={[
            styles.toastContainer,
            { bottom: Platform.OS === 'web' ? 32 : insets.bottom + 80 } // Above standard bottom bars
          ]}
          pointerEvents="box-none"
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleDismiss}
            className={`flex-row items-center bg-[#00232f]/95 p-4 rounded-2xl border ${getIconAndColor(toast.type).bgBorder} shadow-2xl w-[90%] max-w-[420px] self-center overflow-hidden`}
            style={styles.toastCard}
          >
            {/* Faixa decorativa lateral */}
            <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: getIconAndColor(toast.type).color }} />
            
            {/* Ícone */}
            <View className="mr-3">
              <MaterialCommunityIcons
                name={getIconAndColor(toast.type).name}
                size={24}
                color={getIconAndColor(toast.type).color}
              />
            </View>

            {/* Texto da Mensagem */}
            <Text className="text-white text-sm font-semibold flex-1 font-sans mr-2">
              {toast.message}
            </Text>

            {/* Ícone de fechar discreto */}
            <MaterialCommunityIcons name="close" size={16} color="rgba(255, 255, 255, 0.4)" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    backdropFilter: 'blur(10px)', // Para navegadores web que suportam
  }
});
