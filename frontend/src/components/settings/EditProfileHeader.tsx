import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EditProfileHeader() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  return (
    <View 
      className="flex-row justify-between items-center px-4 bg-surface/80 backdrop-blur-xl absolute top-0 w-full z-50"
      style={{ paddingTop: insets.top, height: 64 + insets.top }}
    >
      <TouchableOpacity 
        onPress={() => router.back()} 
        className="w-12 h-12 rounded-full items-center justify-center hover:bg-surface-container-high"
      >
        <MaterialIcons name="arrow-back" size={24} color="#bde9fe" />
      </TouchableOpacity>
      
      <Text className="text-[20px] font-bold tracking-tight text-on-surface flex-1 text-center">
        Editar Perfil
      </Text>
      
      <TouchableOpacity className="w-12 h-12 items-center justify-center">
        <Text className="text-on-primary-container text-[16px] font-bold tracking-wide uppercase">
          Salvar
        </Text>
      </TouchableOpacity>
    </View>
  );
}
