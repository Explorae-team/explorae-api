import React, { useEffect } from 'react';
import '../styles/global.css'; 

import { Platform, ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, useRouter, useSegments, useGlobalSearchParams } from 'expo-router';
import { useFonts } from 'expo-font';
import { MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { BadgeCelebrationProvider } from '../contexts/BadgeCelebrationContext';
import AppFooter from '../components/AppFooter';
import { colors } from '../constants/colors';

function InitialLayout() {
  const { isAuthenticated, user, isLoading: isAuthLoading } = useAuth();
  const [fontsLoaded, fontError] = useFonts({
    ...MaterialCommunityIcons.font,
    ...Ionicons.font,
    ...MaterialIcons.font,
  });
  const segments = useSegments();
  const [isMounted, setIsMounted] = React.useState(false);
  const router = useRouter();
  const params = useGlobalSearchParams();
  const isEditMode = params.mode === 'edit';

  const isLoading = isAuthLoading || (!fontsLoaded && !fontError);

  const protectedRoutes = ['dashboard', 'preferences', 'settings', 'attraction'];
  const inAppGroup = protectedRoutes.includes(segments[0]);
  const isAuthRoute = segments[0] === 'login' || segments[0] === 'cadastro';
  
  // Lógica para detectar se estamos na rota do mapa e esconder o footer
  const isMapRoute = segments[0] === 'dashboard' && segments[1] === 'routes';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || isLoading) return;

    if (!isAuthenticated && inAppGroup) {
      router.replace('/login');
    } else if (isAuthenticated) {
      if (!user?.hasPreferences && segments[0] !== 'preferences') {
        router.replace('/preferences');
      } else if (user?.hasPreferences && (isAuthRoute || (segments[0] === 'preferences' && !isEditMode) || segments[0] === undefined)) {
        router.replace('/dashboard');
      }
    }
  }, [isAuthenticated, user?.hasPreferences, isLoading, segments, isEditMode, isMounted]);

  // Footer só aparece se não estivermos no mapa
  const showFooter = isAuthenticated && inAppGroup && segments[0] !== 'preferences' && !isMapRoute;

  const getActiveTab = () => {
    const route = segments[0];
    const subRoute = segments[1];

    if (route === 'dashboard') {
      if (subRoute === 'profile' || subRoute === 'badges') return 'profile';
      if (subRoute === 'routes') return 'routes';
      if (subRoute === 'coupons') return 'coupons';
      if (subRoute === 'search') return 'search';
      return 'explore';
    }
    return 'explore';
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.exploraBlue },
          headerTintColor: '#ffffff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerBackTitle: 'Voltar',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: 'Login', headerShown: false }} />
        <Stack.Screen name="cadastro" options={{ title: 'Criar Conta', headerShown: false }} />
        <Stack.Screen name="dashboard/index" options={{ title: 'Dashboard', headerShown: false }} />
        <Stack.Screen name="dashboard/profile" options={{ title: 'Perfil', headerShown: false }} />
        <Stack.Screen name="dashboard/badges" options={{ title: 'Medalhas & Desafios', headerShown: false }} />
        <Stack.Screen name="dashboard/favorites" options={{ title: 'Meus Favoritos', headerShown: false }} />
        <Stack.Screen name="dashboard/routes" options={{ title: 'Rotas', headerShown: false }} />
        <Stack.Screen name="dashboard/coupons" options={{ title: 'Meus Cupons', headerShown: false }} />
        <Stack.Screen name="dashboard/scanner" options={{ title: 'Validar Voucher', headerShown: false }} />
        <Stack.Screen name="settings" options={{ title: 'Configurações', headerShown: false }} />
        <Stack.Screen
          name="attraction/[id]"
          options={{ title: 'Detalhes da Atração', headerShown: false }}
        />
      </Stack>

      {showFooter && (
        <AppFooter activeTab={getActiveTab()} />
      )}
    </View>
  );
}

export default function RootLayout() {
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
    <SafeAreaProvider style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, height: Platform.OS === 'web' ? '100vh' : '100%', backgroundColor: colors.background, overflow: 'hidden' }}>
        <AuthProvider>
          <BadgeCelebrationProvider>
            <InitialLayout />
          </BadgeCelebrationProvider>
        </AuthProvider>
      </View>
    </SafeAreaProvider>
  );
}