import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function AccountSettingsList() {
  return (
    <View className="px-4 py-2 flex-col gap-3">
      <Text className="text-[18px] font-bold text-on-surface mb-2 mt-4">Conta</Text>
      
      <TouchableOpacity 
        className="w-full bg-surface-container-high rounded-[16px] p-5 flex-row items-center justify-between"
      >
        <View className="flex-row items-center gap-4">
          <View className="w-10 h-10 rounded-full bg-surface-bright flex items-center justify-center">
            <MaterialIcons name="lock" size={20} color="#bde9fe" />
          </View>
          <Text className="text-[16px] font-bold text-on-surface">Alterar Senha</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#c1c7cc" />
      </TouchableOpacity>

      <TouchableOpacity 
        className="w-full bg-surface-container-high rounded-[16px] p-5 flex-row items-center justify-between"
      >
        <View className="flex-row items-center gap-4">
          <View className="w-10 h-10 rounded-full bg-surface-bright flex items-center justify-center">
            <MaterialIcons name="security" size={20} color="#bde9fe" />
          </View>
          <Text className="text-[16px] font-bold text-on-surface">Configurações de Privacidade</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#c1c7cc" />
      </TouchableOpacity>
    </View>
  );
}
