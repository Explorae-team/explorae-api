import React from 'react';
import { SafeAreaView, ScrollView, View, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../constants/colors';
import InterestsGrid from '../../components/preferences/InterestsGrid';
import preferenceService from '../../services/preferenceService';
import WizardProgressBar from '../../components/wizard/WizardProgressBar';
import WizardHeader from '../../components/wizard/WizardHeader';
import WizardFooter from '../../components/wizard/WizardFooter';
import { usePreferencesWizard } from '../../hooks/usePreferencesWizard';
import { ONBOARDING_STEPS } from '../../constants/onboarding';

export default function PreferencesScreen() {
  const { logout, updateUserPreferences } = useAuth() as any;
  const { mode } = useLocalSearchParams();
  const isEditMode = mode === 'edit';

  const {
    currentStep,
    selectedIds,
    isSubmitting,
    stepInfo,
    isNextDisabled,
    handleToggleInterest,
    handleNext,
    handleBack
  } = usePreferencesWizard(null, logout, updateUserPreferences, isEditMode);

  return (
    <SafeAreaView
      className="flex-1 bg-[#00161e]"
      style={{ flex: 1 }}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: isEditMode ? 'Editar Interesses' : 'Selecionar Interesses',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.primary,
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack} className="ml-2">
              <MaterialIcons 
                name={isEditMode || currentStep > 0 ? "arrow-back" : "logout"} 
                size={24} 
                color={colors.primary} 
              />
            </TouchableOpacity>
          )
        }}
      />

      <WizardProgressBar 
        totalSteps={ONBOARDING_STEPS.length} 
        currentStep={currentStep} 
      />

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={true}
        className="w-full"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingBottom: 140, 
          flexGrow: 1,
          maxWidth: 1200, 
          alignSelf: 'center',
          width: '100%'
        }}
      >
        <WizardHeader 
          title={stepInfo.title} 
          description={stepInfo.description} 
        />

        <View className="px-6">
          <InterestsGrid
            selectedIds={selectedIds}
            onToggle={handleToggleInterest}
            pillarFilter={stepInfo.pillar}
          />
        </View>

      </ScrollView>

      <WizardFooter
        currentStep={currentStep}
        totalSteps={ONBOARDING_STEPS.length}
        onNext={handleNext}
        onBack={handleBack}
        isSubmitting={isSubmitting}
        isEditMode={isEditMode}
        isNextDisabled={isNextDisabled}
      />
    </SafeAreaView>
  );
}
