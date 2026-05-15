import React from 'react';
import { View, Text } from 'react-native';

interface WizardHeaderProps {
  title: string;
  description: string;
}

export default function WizardHeader({ title, description }: WizardHeaderProps) {
  return (
    <View className="mb-10 px-6">
      <Text className="text-3xl font-black text-[#bde9fe] tracking-tight leading-tight mb-4">
        {title}
      </Text>
      <Text className="text-[#91bbcf] text-lg leading-relaxed">
        {description}
      </Text>
    </View>
  );
}
