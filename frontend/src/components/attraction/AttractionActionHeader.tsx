import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

interface AttractionActionHeaderProps {
  onBack: () => void;
}

export default function AttractionActionHeader({ onBack }: AttractionActionHeaderProps) {
  return (
    <SafeAreaView className="absolute top-0 left-0 right-0 z-50 flex-row justify-between items-center px-6 py-2">
      <TouchableOpacity 
        onPress={onBack}
        className="w-12 h-12 items-center justify-center rounded-full bg-[#0d3e4e]/50 overflow-hidden"
      >
        <BlurView intensity={20} className="absolute inset-0" />
        <MaterialCommunityIcons name="arrow-left" size={24} color="#F2641F" />
      </TouchableOpacity>
      
      <Text className="font-bold text-lg text-[#F2641F]">Exploraê</Text>
      
      <TouchableOpacity className="w-12 h-12 items-center justify-center rounded-full bg-[#0d3e4e]/50 overflow-hidden">
        <BlurView intensity={20} className="absolute inset-0" />
        <MaterialCommunityIcons name="share-variant" size={24} color="#F2641F" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
