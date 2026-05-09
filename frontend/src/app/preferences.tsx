import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import InterestsGrid from '../components/preferences/InterestsGrid';
import PrimaryButton from '../components/PrimaryButton';
import preferenceService from '../services/preferenceService';

export default function PreferencesScreen() {
  const { user, logout, updateUserPreferences } = useAuth();
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleInterest = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
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
      // Atualiza o estado global para hasPreferences: true
      await updateUserPreferences();
      // O _layout.jsx cuidará do redirecionamento para o dashboard
    } else {
      Alert.alert('Erro', result.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#00161e]">
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: 'Selecionar Interesses',
          headerStyle: { backgroundColor: '#00161e' },
          headerTintColor: '#fd6c28',
          headerLeft: () => (
            <TouchableOpacity onPress={logout} className="ml-2">
              <MaterialCommunityIcons name="logout" size={24} color="#fd6c28" />
            </TouchableOpacity>
          )
        }} 
      />

      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 140, backgroundColor: '#00161e' }}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Indicator (Simulado do design do Stitch) */}
        <View className="flex-row gap-2 mb-8">
          <View className="h-1.5 w-12 rounded-full bg-[#fd6c28]" />
          <View className="h-1.5 w-12 rounded-full bg-[#053a4a]" />
          <View className="h-1.5 w-12 rounded-full bg-[#053a4a]" />
        </View>

        {/* Header Section */}
        <View className="mb-10">
          <Text className="text-3xl font-black text-[#bde9fe] tracking-tight leading-tight mb-4">
            O que faz seu coração vibrar?
          </Text>
          <Text className="text-[#91bbcf] text-lg leading-relaxed">
            Selecione seus interesses para que possamos curar expedições sob medida para você.
          </Text>
        </View>

        {/* Bento Grid */}
        <InterestsGrid 
          selectedIds={selectedIds} 
          onToggle={handleToggleInterest} 
        />

        <View className="h-32" />
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="absolute bottom-0 left-0 w-full px-6 pb-10 pt-6 bg-[#00161e]/90 backdrop-blur-xl rounded-t-[40px] flex-row justify-between items-center border-t border-white/5">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="flex-row items-center gap-2 px-4"
        >
          <MaterialCommunityIcons name="chevron-left" size={24} color="#bde9fe" />
          <Text className="text-[#bde9fe] font-medium text-lg">Voltar</Text>
        </TouchableOpacity>

        <PrimaryButton
          title="Concluir"
          onPress={handleFinish}
          loading={isSubmitting}
          rightIcon={<MaterialCommunityIcons name="arrow-right" size={20} color="white" />}
          className="px-10"
        />
      </View>
    </SafeAreaView>
  );
}
