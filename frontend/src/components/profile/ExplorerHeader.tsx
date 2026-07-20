import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';

export default function ExplorerHeader() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  return (
    <View 
      className="flex-row justify-between items-center px-6 w-full absolute top-0 z-50"
      style={{
        paddingTop: insets.top,
        height: 64 + insets.top,
        backgroundColor: '#00161e',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(189, 233, 254, 0.1)',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
        elevation: 10,
      }}
    >
      <TouchableOpacity 
        onPress={() => {
          if (router.canGoBack()) router.back();
          else router.replace('/dashboard');
        }} 
        className="p-2 rounded-full bg-surface-bright/10"
      >
        <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
      </TouchableOpacity>
      <Text className="font-sans font-black text-lg text-on-primary-container tracking-tight">Explorer Profile</Text>
      <TouchableOpacity 
        onPress={() => router.push('/settings')} 
        className="p-2 rounded-full bg-surface-bright/10"
      >
        <MaterialIcons name="settings" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}
