import React, { useEffect } from 'react';
import '../src/styles/global.css'; // Importando Tailwind globalmente para o ambiente Web/Native

import { Platform, ActivityIndicator, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';

function InitialLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Detecta se o usuário está tentando acessar o dashboard
    const inAppGroup = segments[0] === 'dashboard';

    if (!isAuthenticated && inAppGroup) {
      // Se não está logado e tenta acessar o dashboard, redireciona para login
      router.replace('/login');
    } else if (isAuthenticated && (segments[0] === 'login' || segments[0] === 'cadastro')) {
      // Se já está logado e tenta acessar login/cadastro, redireciona para dashboard
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#007AFF', // Azul Royal do Explorce
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerBackTitle: 'Voltar',
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: 'Login', headerShown: false }} />
      <Stack.Screen name="cadastro" options={{ title: 'Criar Conta', headerShown: false }} />
      <Stack.Screen name="dashboard/index" options={{ title: 'Dashboard' }} />
    </Stack>
  );
}

export default function RootLayout() {
  // Registro de Service Worker para PWA (Task [S1-P2-T4])
  useEffect(() => {
    if (Platform.OS === 'web' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => console.log('[PWA] Service Worker registrado!', reg.scope))
          .catch(err => console.log('[PWA] Falha no erro do SW: ', err));
      });
    }
  }, []);

  return (
    <AuthProvider>
      <InitialLayout />
    </AuthProvider>
  );
}
