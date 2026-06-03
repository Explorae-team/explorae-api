import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

interface WizardFooterProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
  isEditMode?: boolean;
  isNextDisabled?: boolean;
}

export default function WizardFooter({
  currentStep,
  totalSteps,
  onNext,
  onBack,
  isSubmitting = false,
  isEditMode = false,
  isNextDisabled = false,
}: WizardFooterProps) {
  const isLastStep = currentStep === totalSteps - 1;
  const isDisabled = isSubmitting || isNextDisabled;

  return (
    <View
      style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
      className="px-8 pb-10 pt-6 bg-[#00161e]/80 backdrop-blur-md border-t border-white/5 flex-row justify-between items-center"
    >
      <TouchableOpacity
        onPress={onBack}
        className="flex-row items-center"
      >
        <Ionicons name="chevron-back" size={20} color="#bde9fe" />
        <Text className="text-[#bde9fe] ml-1 font-medium">
          {currentStep > 0 ? 'Voltar' : (isEditMode ? 'Cancelar' : 'Sair')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onNext}
        disabled={isDisabled}
        className={`px-8 py-4 rounded-2xl flex-row items-center ${
          isDisabled ? 'bg-[#594138] opacity-50' : 'bg-[#fd6c28] active:opacity-90'
        }`}
      >
        <Text className="text-white font-bold mr-2">
          {isSubmitting ? 'SALVANDO...' : (isLastStep ? 'CONCLUIR' : 'PRÓXIMO')}
        </Text>
        <MaterialCommunityIcons 
          name={isLastStep ? "check-circle" : "arrow-right"} 
          size={20} 
          color="white" 
        />
      </TouchableOpacity>
    </View>
  );
}
