import React from 'react';
import { View, Text, StyleSheet, Platform, Image, TouchableOpacity, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { ProgressBar } from '../common/ProgressBar';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

// Mapeamento de cores para categorias de medalhas
const CATEGORY_COLORS = {
  'ONBOARDING': '#ffba26',
  'EXPLORACAO': '#fd6c28',
  'JORNADA': '#ffb598',
  'SOCIAL': '#a2cde1'
};

const CATEGORY_LABELS = {
  'ONBOARDING': 'Boas-Vindas',
  'EXPLORACAO': 'Exploração',
  'JORNADA': 'Jornada',
  'SOCIAL': 'Social'
};

interface BadgeDetailModalProps {
  visible: boolean;
  item: {
    type: 'BADGE' | 'CHALLENGE';
    data: any;
    isUnlocked?: boolean;
  } | null;
  onClose: () => void;
}

export const BadgeDetailModal: React.FC<BadgeDetailModalProps> = ({ visible, item, onClose }) => {
  if (!item) return null;

  const { type, data, isUnlocked } = item;
  const color = type === 'BADGE' 
    ? (CATEGORY_COLORS as any)[data.category] || '#fd6c28'
    : data.completed ? '#4ade80' : '#fd6c28';

  const modalContent = (
    <View className="bg-[#002532] rounded-3xl p-6 border border-white/10 w-[90%] max-w-[400px] items-center">
      {/* Header com Categoria */}
      <View className="w-full flex-row justify-between items-center mb-4">
        <Text className="text-white/40 text-xs font-bold uppercase tracking-widest">
          {type === 'BADGE' ? `Medalha • ${CATEGORY_LABELS[data.category as keyof typeof CATEGORY_LABELS] || data.category}` : 'Desafio'}
        </Text>
        <TouchableOpacity onPress={onClose} className="p-1 rounded-full bg-white/5">
          <Ionicons name="close" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Ícone */}
      <View 
        className="w-28 h-28 rounded-full bg-[#00161e] items-center justify-center border-4 mb-4 relative"
        style={{ 
          borderColor: color, 
          shadowColor: color, 
          shadowOffset: { width: 0, height: 4 }, 
          shadowOpacity: 0.3, 
          shadowRadius: 10 
        }}
      >
        {type === 'BADGE' ? (
          data.iconUrl ? (
            <Image 
              source={{ uri: data.iconUrl.startsWith('http') ? data.iconUrl : `${API_URL}${data.iconUrl}` }}
              style={{ width: 72, height: 72, opacity: isUnlocked ? 1 : 0.3 }}
              resizeMode="contain"
            />
          ) : (
            <MaterialIcons name="emoji-events" size={48} color={isUnlocked ? color : '#3a5866'} />
          )
        ) : (
          <MaterialIcons name="tour" size={48} color={data.completed ? '#4ade80' : '#fd6c28'} />
        )}

        {type === 'BADGE' && !isUnlocked && (
          <View className="absolute inset-0 items-center justify-center bg-black/40 rounded-full">
            <MaterialIcons name="lock" size={32} color="white" />
          </View>
        )}
      </View>

      {/* Título e Descrição */}
      <Text className="text-white text-xl font-bold text-center mb-2 font-sans">
        {type === 'BADGE' ? data.name : data.title}
      </Text>
      <Text className="text-white/70 text-sm text-center mb-6 px-2 font-sans leading-relaxed">
        {type === 'BADGE' ? data.description : data.description}
      </Text>

      {/* Status / Recompensas */}
      {type === 'BADGE' ? (
        <View className="w-full mb-6">
          <View className="w-full bg-[#00161e] p-4 rounded-2xl border border-white/5 items-center mb-4">
            <Text className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-1">Status</Text>
            <View className="flex-row items-center">
              <MaterialIcons 
                name={isUnlocked ? "check-circle" : "lock"} 
                size={18} 
                color={isUnlocked ? "#4ade80" : "#9ca3af"} 
              />
              <Text 
                className="ml-2 font-bold font-sans text-sm" 
                style={{ color: isUnlocked ? "#4ade80" : "#9ca3af" }}
              >
                {isUnlocked ? "Medalha Conquistada!" : "Medalha Bloqueada"}
              </Text>
            </View>
          </View>

          {/* Barra de Progresso da Medalha Bloqueada */}
          {!isUnlocked && data.targetValue !== undefined && data.targetValue !== null && (
            <View className="bg-[#00161e] p-4 rounded-2xl border border-white/5">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-white/60 text-xs font-bold font-sans">Progresso</Text>
                <Text className="text-white text-xs font-bold font-sans">
                  {data.currentValue || 0} / {data.targetValue}
                </Text>
              </View>
              <ProgressBar 
                progressPercentage={Math.min(100, ((data.currentValue || 0) / data.targetValue) * 100)}
                fillColor={color}
              />
            </View>
          )}
        </View>
      ) : (
        <View className="w-full mb-6">
          {/* Barra de Progresso no Modal */}
          <View className="bg-[#00161e] p-4 rounded-2xl border border-white/5 mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-white/60 text-xs font-bold font-sans">Progresso</Text>
              <Text className="text-white text-xs font-bold font-sans">
                {data.currentValue} / {data.targetValue}
              </Text>
            </View>
            <ProgressBar 
              progressPercentage={Math.min(100, (data.currentValue / data.targetValue) * 100)}
              fillColor={data.completed ? '#4ade80' : '#fd6c28'}
            />
          </View>

          {/* Recompensas */}
          <View className="flex-row justify-between">
            <View className="flex-1 bg-[#00161e] p-3 rounded-2xl border border-white/5 items-center mr-2">
              <Text className="text-white/40 text-[10px] font-bold uppercase mb-1">XP</Text>
              <View className="flex-row items-center">
                <MaterialIcons name="star" size={16} color="#fd6c28" />
                <Text className="text-white font-bold ml-1 font-sans">+{data.xpReward}</Text>
              </View>
            </View>
            <View className="flex-1 bg-[#00161e] p-3 rounded-2xl border border-white/5 items-center ml-2">
              <Text className="text-white/40 text-[10px] font-bold uppercase mb-1">Moedas</Text>
              <View className="flex-row items-center">
                <MaterialIcons name="monetization-on" size={16} color="#ffba26" />
                <Text className="text-white font-bold ml-1 font-sans">+{data.coinsReward}</Text>
              </View>
            </View>
          </View>
        </View>
      )}

    </View>
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {Platform.OS === 'web' ? (
          <View style={[styles.blurWeb, StyleSheet.absoluteFill]} />
        ) : (
          <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
        )}
        {modalContent}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurWeb: {
    backgroundColor: 'rgba(0, 22, 30, 0.85)',
  }
});
