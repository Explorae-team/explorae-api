import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useSegments, useGlobalSearchParams } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import AppFooter from '../../components/AppFooter';
import { colors } from '../../constants/colors';

export default function ExploreLayout() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const params = useGlobalSearchParams();
  const isEditMode = params.mode === 'edit';

  // Lógica para detectar rotas que ocultam o footer
  const isMapRoute = segments.includes('routes');
  const isPreferencesRoute = segments.includes('preferences');

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && !user?.hasPreferences && !isPreferencesRoute) {
      router.replace('/(explore)/preferences');
    } else if (isAuthenticated && user?.hasPreferences && isPreferencesRoute && !isEditMode) {
      router.replace('/(explore)/dashboard');
    }
  }, [isAuthenticated, user?.hasPreferences, isLoading, segments, isEditMode]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const getActiveTab = () => {
    if (segments.includes('profile') || segments.includes('badges')) return 'profile';
    if (segments.includes('routes')) return 'routes';
    if (segments.includes('coupons')) return 'coupons';
    if (segments.includes('search')) return 'search';
    return 'explore';
  };

  const showFooter = !isPreferencesRoute && !isMapRoute;

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="dashboard/index" />
        <Stack.Screen name="dashboard/profile" />
        <Stack.Screen name="dashboard/badges" />
        <Stack.Screen name="dashboard/favorites" />
        <Stack.Screen name="dashboard/routes" />
        <Stack.Screen name="dashboard/coupons" />
        <Stack.Screen name="dashboard/scanner" />
        <Stack.Screen name="preferences" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="attraction/[id]" />
      </Stack>

      {showFooter && (
        <AppFooter activeTab={getActiveTab()} />
      )}
    </View>
  );
}
