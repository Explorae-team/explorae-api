import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, View } from 'react-native';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  loadingTitle?: string;
  loading?: boolean;
  rightIcon?: React.ReactNode;
}

export default function PrimaryButton({
  title,
  loadingTitle = "CARREGANDO...",
  loading = false,
  rightIcon,
  className = "",
  ...props
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      disabled={loading || props.disabled}
      activeOpacity={0.8}
      className={`bg-[#F2641F] py-5 rounded-2xl shadow-xl items-center ${className} ${loading || props.disabled ? 'opacity-70' : ''}`}
      {...props}
    >
      <View className="flex-row items-center justify-center gap-3">
        <Text className="text-white font-black tracking-widest uppercase text-sm">
          {loading ? loadingTitle : title}
        </Text>
        {!loading && rightIcon}
      </View>
    </TouchableOpacity>
  );
}
