import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ONBOARDING_STEPS } from '../constants/onboarding';
import preferenceService from '../services/preferenceService';

export function usePreferencesWizard(user, logout, updateUserPreferences, isEditMode) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stepInfo = ONBOARDING_STEPS[currentStep];

  useEffect(() => {
    if (isEditMode) {
      const fetchPrefs = async () => {
        const result = await preferenceService.getPreferences();
        if (result.success) {
          setSelectedIds(result.data);
        }
      };
      fetchPrefs();
    }
  }, [isEditMode]);

  const handleToggleInterest = (id) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else if (isEditMode) {
      router.back();
    } else {
      logout();
    }
  };

  const handleFinish = async () => {
    if (selectedIds.length === 0) {
      Alert.alert('Ops!', 'Selecione pelo menos um interesse para continuar.');
      return;
    }

    setIsSubmitting(true);
    const result = await preferenceService.updatePreferences(selectedIds);
    setIsSubmitting(false);

    if (result.success) {
      await updateUserPreferences();
      if (isEditMode) {
        router.back();
      } else {
        router.replace('/dashboard');
      }
    } else {
      Alert.alert('Erro', result.message);
    }
  };

  return {
    currentStep,
    selectedIds,
    isSubmitting,
    stepInfo,
    handleToggleInterest,
    handleNext,
    handleBack
  };
}
