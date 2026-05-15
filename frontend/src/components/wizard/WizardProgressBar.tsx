import React from 'react';
import { View } from 'react-native';

interface WizardProgressBarProps {
  totalSteps: number;
  currentStep: number;
}

export default function WizardProgressBar({ totalSteps, currentStep }: WizardProgressBarProps) {
  return (
    <View className="flex-row gap-2 mb-8 px-6 pt-6">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View 
          key={index}
          className={`h-1.5 flex-1 rounded-full ${
            index <= currentStep ? 'bg-[#fd6c28]' : 'bg-[#053a4a]'
          }`} 
        />
      ))}
    </View>
  );
}
