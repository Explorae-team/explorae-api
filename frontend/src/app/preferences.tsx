import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import InterestsGrid from '../components/preferences/InterestsGrid';
import preferenceService from '../services/preferenceService';

export default function PreferencesScreen() {
  const { logout, updateUserPreferences } = useAuth() as any;
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggleInterest = (id: string) => {
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
      await updateUserPreferences();
    } else {
      Alert.alert('Erro', result.message);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-[#00161e]"
      style={{ flex: 1 }}
    >
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
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 140, // Espaço para o rodapé
          flexGrow: 1
        }}
      >
        {/* Progress Indicator */}
        <View className="flex-row gap-2 mb-8">
          <View className="h-1.5 w-12 rounded-full bg-[#fd6c28]" />
          <View className="h-1.5 w-12 rounded-full bg-[#053a4a]" />
          <View className="h-1.5 w-12 rounded-full bg-[#053a4a]" />
        </View>

        {/* Header Section */}
        <View className="mb-10">
          <Text className="text-3xl font-black text-[#bde9fe] tracking-tight leading-tight mb-4">
            Como você prefere explorar?
          </Text>
          <Text className="text-[#91bbcf] text-lg leading-relaxed">
            Escolha suas categorias favoritas para que possamos filtrar os melhores destinos para você.
          </Text>
        </View>

        <InterestsGrid
          selectedIds={selectedIds}
          onToggle={handleToggleInterest}
        />


      </ScrollView>

      {/* Footer Navigation - Premium Glassmorphism Fixo na Base */}
      <View
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
        className="px-8 pb-10 pt-6 bg-[#00161e]/80 backdrop-blur-md border-t border-white/5 flex-row justify-between items-center"
      >
        <TouchableOpacity
          onPress={() => logout()}
          className="flex-row items-center"
        >
          <Ionicons name="chevron-back" size={20} color="#bde9fe" />
          <Text className="text-[#bde9fe] ml-1 font-medium">Sair</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleFinish}
          disabled={isSubmitting}
          className={`px-8 py-4 rounded-2xl flex-row items-center ${selectedIds.length > 0 ? 'bg-[#fd6c28]' : 'bg-slate-800'
            }`}
        >
          <Text className="text-white font-bold mr-2">
            {isSubmitting ? 'SALVANDO...' : 'CONCLUIR'}
          </Text>
          <MaterialCommunityIcons name="check-circle" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
