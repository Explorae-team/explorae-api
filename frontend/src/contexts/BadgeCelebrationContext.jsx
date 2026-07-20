import React, { createContext, useContext, useState } from 'react';
import { Modal, View, Text, StyleSheet, Platform, Image, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { ZoomIn } from 'react-native-reanimated';

const CelebrationContext = createContext({
  triggerCelebration: (badges) => {}
});

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

export const BadgeCelebrationProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [unlockedBadges, setUnlockedBadges] = useState([]);

  const triggerCelebration = (badges) => {
    if (badges && badges.length > 0) {
      setUnlockedBadges(badges);
      setVisible(true);
    }
  };

  const handleClose = () => {
    setVisible(false);
    setUnlockedBadges([]);
  };

  return (
    <CelebrationContext.Provider value={{ triggerCelebration }}>
      {children}
      
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={handleClose}
      >
        <View style={styles.overlay}>
          {Platform.OS === 'web' ? (
            <View style={[styles.blurWeb, StyleSheet.absoluteFill]} />
          ) : (
            <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
          )}

          {unlockedBadges.map((badge, index) => (
            <Animated.View 
              key={badge.id || index}
              entering={ZoomIn ? ZoomIn.delay(index * 200).springify().damping(12) : undefined}
              className="bg-[#002532] rounded-3xl p-6 border border-white/10 w-[85%] max-w-[380px] items-center shadow-2xl"
            >
              {/* Sparkles / Estrelas flutuantes */}
              <View className="absolute -top-6 -left-6">
                <MaterialIcons name="auto-awesome" size={40} color="#ffba26" />
              </View>
              <View className="absolute -top-8 -right-8">
                <MaterialIcons name="auto-awesome" size={48} color="#fd6c28" />
              </View>
              <View className="absolute -bottom-6 -left-8">
                <MaterialIcons name="auto-awesome" size={36} color="#a2cde1" />
              </View>

              <Text className="text-[#fd6c28] text-xs font-black uppercase tracking-widest mb-2 font-sans">
                MEDALHA DESBLOQUEADA!
              </Text>
              
              <View 
                className="w-32 h-32 rounded-full bg-[#00161e] items-center justify-center border-4 mb-4"
                style={{ 
                  borderColor: '#fd6c28',
                  shadowColor: '#fd6c28',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.4,
                  shadowRadius: 12
                }}
              >
                {badge.iconUrl ? (
                  <Image 
                    source={{ uri: badge.iconUrl.startsWith('http') ? badge.iconUrl : `${API_URL}${badge.iconUrl}` }}
                    className="w-20 h-20"
                    resizeMode="contain"
                  />
                ) : (
                  <MaterialIcons name="emoji-events" size={64} color="#fd6c28" />
                )}
              </View>

              <Text className="text-white text-2xl font-black text-center mb-2 font-sans">
                {badge.name}
              </Text>
              
              <Text className="text-white/70 text-sm text-center mb-6 px-4 font-sans leading-relaxed">
                {badge.description}
              </Text>

              <TouchableOpacity 
                onPress={handleClose}
                className="bg-[#fd6c28] w-full py-4 rounded-2xl items-center shadow-lg"
              >
                <Text className="text-[#00161e] font-black font-sans uppercase tracking-wider text-sm">
                  Sensacional!
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </Modal>
    </CelebrationContext.Provider>
  );
};

export const useCelebration = () => useContext(CelebrationContext);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurWeb: {
    backgroundColor: 'rgba(0, 22, 30, 0.9)',
  }
});
