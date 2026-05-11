import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import SettingsGroup from '../components/settings/SettingsGroup';
import SettingsItem from '../components/settings/SettingsItem';

export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useAuth() as any;

  const handleLogout = () => {
    Alert.alert(
      "Sair da Conta",
      "Deseja realmente sair da sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", style: "destructive", onPress: () => logout() }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Excluir Conta",
      "Esta ação é permanente e todos os seus dados serão apagados. Tem certeza?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: () => Alert.alert("Solicitação enviada", "Sua solicitação de exclusão está sendo processada.") 
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-surface">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 h-16 border-b border-outline-variant/10">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full">
          <MaterialIcons name="arrow-back" size={24} color="#fd6c28" />
        </TouchableOpacity>
        <Text className="text-[#fd6c28] font-sans text-lg font-bold tracking-tight absolute left-1/2 -translate-x-1/2">
          Configurações
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        {/* Grupo 1: Experiência */}
        <SettingsGroup>
          <SettingsItem 
            icon="explore"
            title="Preferências de Viagem"
            description="Tipo de experiência, culinária, orçamento"
            onPress={() => router.push('/preferences?mode=edit')}
          />
          <SettingsItem 
            icon="public"
            title="Idioma e Região"
            description="Português (Brasil)"
            onPress={() => Alert.alert("Idioma", "Configurações de idioma estarão disponíveis em breve.")}
          />
        </SettingsGroup>

        {/* Grupo 2: Privacidade & Notificações */}
        <SettingsGroup>
          <SettingsItem 
            icon="lock"
            title="Privacidade do Perfil"
            description="Público, apenas amigos ou privado"
            onPress={() => Alert.alert("Privacidade", "Opções de privacidade em desenvolvimento.")}
          />
          <SettingsItem 
            icon="notifications"
            title="Notificações"
            description="Desafios, badges e amigos"
            onPress={() => Alert.alert("Notificações", "Gestão de notificações disponível na próxima atualização.")}
          />
        </SettingsGroup>

        {/* Grupo 3: Segurança & Dados */}
        <SettingsGroup>
          <SettingsItem 
            icon="shield"
            title="Segurança"
            description="Alterar senha e sessões ativas"
            onPress={() => Alert.alert("Segurança", "Funcionalidade de troca de senha em breve.")}
          />
          <SettingsItem 
            icon="data-usage"
            title="Dados e Privacidade"
            description="Exportar dados e excluir conta"
            onPress={handleDeleteAccount}
          />
        </SettingsGroup>

        {/* Logout Action */}
        <TouchableOpacity 
          onPress={handleLogout}
          className="mt-2 mb-10 w-full bg-surface-container-high active:bg-surface-bright p-5 rounded-2xl flex-row items-center justify-center gap-2"
        >
          <MaterialIcons name="logout" size={24} color="#ffb4ab" />
          <Text className="text-error font-bold text-base">Sair da Conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
