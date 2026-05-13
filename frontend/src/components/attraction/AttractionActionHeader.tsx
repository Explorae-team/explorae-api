import React from 'react';
import { Share, TouchableOpacity, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

interface AttractionActionHeaderProps {
  onBack: () => void;
}

export default function AttractionActionHeader({ onBack }: AttractionActionHeaderProps) {
  const insets = useSafeAreaInsets();

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Confira esta atração incrível no Exploraê!',
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View
      className="absolute top-0 left-0 right-0 z-50 flex-row justify-between items-center px-6"
      style={{ paddingTop: insets.top + 8, paddingBottom: 8 }}
    >
      <LinearGradient
        colors={['rgba(0,54,70,0.8)', 'rgba(0,54,70,0.4)', 'transparent']}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top + 100 }}
      />
      <TouchableOpacity
        onPress={onBack}
        className="w-12 h-12 items-center justify-center rounded-full bg-[#0d3e4e]/50 overflow-hidden"
      >
        <BlurView intensity={20} className="absolute inset-0" />
        <MaterialCommunityIcons name="arrow-left" size={24} color="#F2641F" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleShare}
        className="w-12 h-12 items-center justify-center rounded-full bg-[#0d3e4e]/50 overflow-hidden"
      >
        <BlurView intensity={20} className="absolute inset-0" />
        <MaterialCommunityIcons name="share-variant" size={24} color="#F2641F" />
      </TouchableOpacity>
    </View>
  );
}
