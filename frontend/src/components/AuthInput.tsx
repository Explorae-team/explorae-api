import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AuthInputProps extends TextInputProps {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  error?: string;
  rightElement?: React.ReactNode;
}

export default function AuthInput({
  label,
  iconName,
  error,
  rightElement,
  ...textInputProps
}: AuthInputProps) {
  return (
    <View className="mb-4">
      <View className="flex-row justify-between mb-2">
        <Text className="text-[#003646] text-[10px] font-bold uppercase tracking-widest ml-1">
          {label}
        </Text>
        {rightElement}
      </View>
      
      <View className="relative">
        <View className="absolute left-4 top-[14px] z-10">
          <Ionicons name={iconName} size={20} color="#94A3B8" />
        </View>
        <TextInput
          placeholderTextColor="#94A3B8"
          className={`bg-slate-50 pl-12 pr-4 py-4 rounded-2xl text-[#003646] font-semibold ${
            error ? "border border-red-200" : ""
          }`}
          {...textInputProps}
        />
      </View>
      
      {error && (
        <Text className="text-red-500 text-[10px] mt-1 ml-1">{error}</Text>
      )}
    </View>
  );
}
