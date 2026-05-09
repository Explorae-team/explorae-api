import React, { useEffect } from 'react';
import '../styles/global.css'; // Importando Tailwind globalmente para o ambiente Web/Native

import { Platform, ActivityIndicator, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

function InitialLayout() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAppGroup = segments[0] === 'dashboard' || segments[0] === 'preferences';
    const isAuthRoute = segments[0] === 'login' || segments[0] === 'cadastro';

    if (!isAuthenticated && inAppGroup) {
      // Se não está logado e tenta acessar área restrita, vai pro login
      router.replace('/login');
    } else if (isAuthenticated) {
      // Se está logado...
      if (!user?.hasPreferences && segments[0] !== 'preferences') {
        // ...mas não tem preferências e não está na tela de preferências, redireciona pra lá
        router.replace('/preferences');
      } else if (user?.hasPreferences && (isAuthRoute || segments[0] === 'preferences' || segments[0] === undefined)) {
        // ...e tem preferências, se tentar ir pra login/cadastro ou preferences, vai pro dashboard
        router.replace('/dashboard');
      }
    }
  }, [isAuthenticated, user?.hasPreferences, isLoading, segments]);

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
          backgroundColor: '#007AFF',
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
