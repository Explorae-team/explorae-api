import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ExplorerHeader() {
  const router = useRouter();
  
  return (
    <View 
      className="flex-row justify-between items-center px-6 h-16 w-full absolute top-0 z-50"
      style={{
        backgroundColor: '#00161e',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(189, 233, 254, 0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
      }}
    >
      <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full bg-surface-bright/10">
        <MaterialIcons name="arrow-back" size={24} color="#fd6c28" />
      </TouchableOpacity>
      <Text className="font-sans font-black text-lg text-on-primary-container tracking-tight">Explorer Profile</Text>
      <TouchableOpacity className="p-2 rounded-full bg-surface-bright/10">
        <MaterialIcons name="settings" size={24} color="#fd6c28" />
      </TouchableOpacity>
    </View>
  );
}
