import React, { useEffect } from 'react';
import '../styles/global.css'; // Importando Tailwind globalmente para o ambiente Web/Native

import { Platform, ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, useRouter, useSegments, useGlobalSearchParams } from 'expo-router';
import { useFonts } from 'expo-font';
import { MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import AppFooter from '../components/AppFooter';

function InitialLayout() {
  const { isAuthenticated, user, isLoading: isAuthLoading } = useAuth();
  const [fontsLoaded, fontError] = useFonts({
    ...MaterialCommunityIcons.font,
    ...Ionicons.font,
    ...MaterialIcons.font,
  });
  const segments = useSegments();
  const router = useRouter();
  const params = useGlobalSearchParams();
  const isEditMode = params.mode === 'edit';

  const isLoading = isAuthLoading || (!fontsLoaded && !fontError);

  const protectedRoutes = ['dashboard', 'preferences', 'settings', 'attraction'];
  const inAppGroup = protectedRoutes.includes(segments[0]);
  const isAuthRoute = segments[0] === 'login' || segments[0] === 'cadastro';

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated && inAppGroup) {
      // Se não está logado e tenta acessar área restrita, vai pro login
      router.replace('/login');
    } else if (isAuthenticated) {
      // Se está logado...
      if (!user?.hasPreferences && segments[0] !== 'preferences') {
        // ...mas não tem preferências e não está na tela de preferências, redireciona pra lá
        router.replace('/preferences');
      } else if (user?.hasPreferences && (isAuthRoute || (segments[0] === 'preferences' && !isEditMode) || segments[0] === undefined)) {
        // ...e tem preferências, se tentar ir pra login/cadastro ou preferences (sem ser modo edit), vai pro dashboard
        router.replace('/dashboard');
      }
    }
  }, [isAuthenticated, user?.hasPreferences, isLoading, segments, isEditMode]);


  const showFooter = isAuthenticated && inAppGroup && segments[0] !== 'preferences';

  const getActiveTab = () => {
    const route = segments[0];
    const subRoute = segments[1];

    if (route === 'dashboard') {
      if (subRoute === 'profile') return 'profile';
      if (subRoute === 'routes') return 'routes';
      if (subRoute === 'coupons') return 'coupons';
      if (subRoute === 'search') return 'explore';
      return 'action';
    }
    return 'action';
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#fd6c28" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
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
          contentStyle: { backgroundColor: '#00161e' },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: 'Login', headerShown: false }} />
        <Stack.Screen name="cadastro" options={{ title: 'Criar Conta', headerShown: false }} />
        <Stack.Screen name="dashboard/index" options={{ title: 'Dashboard', headerShown: false }} />
        <Stack.Screen name="dashboard/profile" options={{ title: 'Perfil', headerShown: false }} />
        <Stack.Screen name="settings" options={{ title: 'Configurações', headerShown: false }} />
        <Stack.Screen
          name="attraction/[id]"
          options={{
            title: 'Detalhes da Atração',
            headerShown: false
          }}
        />
      </Stack>

      {showFooter && (
        <AppFooter activeTab={getActiveTab()} />
      )}
    </View>
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
    <SafeAreaProvider style={{ flex: 1, backgroundColor: '#00161e' }}>
      <View style={{ flex: 1, height: Platform.OS === 'web' ? '100vh' : '100%', backgroundColor: '#00161e', overflow: 'hidden' }}>
        <AuthProvider>
          <InitialLayout />
        </AuthProvider>
      </View>
    </SafeAreaProvider>
  );
}
