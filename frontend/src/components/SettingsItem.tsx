import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SettingsItemProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description?: string;
  onPress: () => void;
  showChevron?: boolean;
  isError?: boolean;
}

export default function SettingsItem({ 
  icon, 
  title, 
  description, 
  onPress, 
  showChevron = true,
  isError = false 
}: SettingsItemProps) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="flex-row items-center p-5 active:bg-surface-bright"
    >
      <View className={`w-12 h-12 rounded-full bg-surface-bright flex items-center justify-center mr-4`}>
        <MaterialIcons 
          name={icon} 
          size={24} 
          color={isError ? "#ffb4ab" : "#fd6c28"} 
        />
      </View>
      <View className="flex-1">
        <Text className={`text-base font-bold mb-0.5 ${isError ? 'text-error' : 'text-on-surface'}`}>
          {title}
        </Text>
        {description && (
          <Text className="text-sm font-medium text-on-surface-variant">{description}</Text>
        )}
      </View>
      {showChevron && !isError && (
        <MaterialIcons name="chevron-right" size={24} color="#8b9296" />
      )}
    </TouchableOpacity>
  );
}
