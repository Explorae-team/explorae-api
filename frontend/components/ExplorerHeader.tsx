import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ExplorerHeader() {
  const router = useRouter();
  
  return (
    <View className="flex-row justify-between items-center px-6 h-16 bg-surface-bright/20 w-full absolute top-0 z-50">
      <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full">
        <MaterialIcons name="arrow-back" size={24} color="#fd6c28" />
      </TouchableOpacity>
      <Text className="font-sans font-bold text-lg text-primary">Explorer Profile</Text>
      <TouchableOpacity className="p-2 rounded-full">
        <MaterialIcons name="settings" size={24} color="#fd6c28" />
      </TouchableOpacity>
    </View>
  );
}
