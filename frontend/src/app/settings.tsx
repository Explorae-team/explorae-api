import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, Alert, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import SettingsGroup from '../components/settings/SettingsGroup';
import SettingsItem from '../components/settings/SettingsItem';

export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useAuth() as any;

  const handleLogout = () => {
    const onConfirm = async () => {
      await logout();
      router.replace('/login');
    };

    if (Platform.OS === 'web') {
      if (window.confirm("Deseja realmente sair da sua conta?")) {
        onConfirm();
      }
    } else {
      Alert.alert(
        "Sair da Conta",
        "Deseja realmente sair da sua conta?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Sair", style: "destructive", onPress: onConfirm }
        ]
      );
    }
  };

  const handleDeleteAccount = () => {
    if (Platform.OS === 'web') {
      if (window.confirm("Esta ação é permanente e todos os seus dados serão apagados. Tem certeza?")) {
        window.alert("Sua solicitação de exclusão está sendo processada.");
      }
    } else {
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
    }
  };

  return (
    // KeyboardAvoidingView + flex:1 no View raiz garante scroll correto no mobile
    <View style={{ flex: 1, backgroundColor: '#001b24' }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header fixo fora do ScrollView */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 24,
            height: 64,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(189, 233, 254, 0.06)',
          }}
        >
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 8, marginLeft: -8, borderRadius: 99 }}>
            <MaterialIcons name="arrow-back" size={24} color="#fd6c28" />
          </TouchableOpacity>
          <Text style={{ color: '#fd6c28', fontSize: 18, fontWeight: '700', letterSpacing: -0.3 }}>
            Configurações
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* ScrollView ocupa o resto — flex:1 aqui é crítico para o scroll funcionar */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 48 }}
          showsVerticalScrollIndicator={false}
          bounces={true}
          alwaysBounceVertical={false}
        >
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
              onPress={() => {
                if (Platform.OS === 'web') {
                  window.alert("Configurações de idioma estarão disponíveis em breve.");
                } else {
                  Alert.alert("Idioma", "Configurações de idioma estarão disponíveis em breve.");
                }
              }}
            />
          </SettingsGroup>

          {/* Grupo 2: Privacidade & Notificações */}
          <SettingsGroup>
            <SettingsItem
              icon="lock"
              title="Privacidade do Perfil"
              description="Público, apenas amigos ou privado"
              onPress={() => {
                if (Platform.OS === 'web') {
                  window.alert("Opções de privacidade em desenvolvimento.");
                } else {
                  Alert.alert("Privacidade", "Opções de privacidade em desenvolvimento.");
                }
              }}
            />
            <SettingsItem
              icon="notifications"
              title="Notificações"
              description="Desafios, badges e amigos"
              onPress={() => {
                if (Platform.OS === 'web') {
                  window.alert("Gestão de notificações disponível na próxima atualização.");
                } else {
                  Alert.alert("Notificações", "Gestão de notificações disponível na próxima atualização.");
                }
              }}
            />
          </SettingsGroup>

          {/* Grupo 3: Segurança & Dados */}
          <SettingsGroup>
            <SettingsItem
              icon="shield"
              title="Segurança"
              description="Alterar senha e sessões ativas"
              onPress={() => {
                if (Platform.OS === 'web') {
                  window.alert("Funcionalidade de troca de senha em breve.");
                } else {
                  Alert.alert("Segurança", "Funcionalidade de troca de senha em breve.");
                }
              }}
            />
            <SettingsItem
              icon="data-usage"
              title="Dados e Privacidade"
              description="Exportar dados e excluir conta"
              onPress={handleDeleteAccount}
            />
          </SettingsGroup>

          {/* Logout */}
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              marginTop: 8,
              width: '100%',
              backgroundColor: '#002e3c',
              padding: 20,
              borderRadius: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
            activeOpacity={0.7}
          >
            <MaterialIcons name="logout" size={24} color="#ffb4ab" />
            <Text style={{ color: '#ffb4ab', fontWeight: '700', fontSize: 16 }}>
              Sair da Conta
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
