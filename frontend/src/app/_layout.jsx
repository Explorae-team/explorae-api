import React, { useEffect } from 'react';
import '../styles/global.css'; 

import { Platform, ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import { MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { BadgeCelebrationProvider } from '../contexts/BadgeCelebrationContext';
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

  const isLoading = isAuthLoading || (!fontsLoaded && !fontError);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || isLoading) return;

    // Segmentos: segments[0] dirá se estamos em '(auth)' ou '(explore)'
    const currentGroup = segments[0];

    if (!isAuthenticated) {
      // Se não autenticado e tentou acessar a área interna, manda para o login
      if (currentGroup === '(explore)' || currentGroup === undefined) {
        router.replace('/(auth)/login');
      }
    } else {
      // Se autenticado
      if (!user?.hasPreferences) {
        // Se não tem preferências salvas e não está na tela de preferências, redireciona
        if (segments[1] !== 'preferences') {
          router.replace('/(explore)/preferences');
        }
      } else {
        // Se tem preferências salvas
        // Se tentar acessar auth ou a raiz ou a tela de preferências (fora de modo edit), manda para dashboard
        const isPreferencesInExplore = currentGroup === '(explore)' && segments[1] === 'preferences';
        
        if (currentGroup === '(auth)' || currentGroup === undefined || (isPreferencesInExplore && !segments.includes('edit'))) {
          router.replace('/(explore)/dashboard');
        }
      }
    }
  }, [isAuthenticated, user?.hasPreferences, isLoading, segments, isMounted]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(explore)" options={{ headerShown: false }} />
    </Stack>
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