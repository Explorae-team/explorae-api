import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';

export interface FooterTab {
  key: 'routes' | 'search' | 'explore' | 'coupons' | 'profile';
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
  isFAB?: boolean;
  badgeCount?: number;
}

interface AppFooterProps {
  activeTab: FooterTab['key'];
  questNotification?: boolean;
  couponCount?: number;
}

const AppFooter: React.FC<AppFooterProps> = ({
  activeTab,
  questNotification = false,
  couponCount = 0
}) => {
  const router = useRouter();
  const segments = useSegments();
  const insets = useSafeAreaInsets();

  const tabs: FooterTab[] = [
    { key: 'routes', label: 'Rotas', icon: 'map-outline', route: '/dashboard/routes' },
    { key: 'search', label: 'Buscas', icon: 'search-outline', route: '/dashboard/search' },
    { key: 'explore', label: 'Explorar', icon: 'compass-outline', route: '/dashboard', isFAB: true },
    { key: 'coupons', label: 'Cupons', icon: 'ticket-outline', route: '/dashboard/coupons', badgeCount: couponCount },
    { key: 'profile', label: 'Perfil', icon: 'person-outline', route: '/dashboard/profile', badgeCount: questNotification ? 1 : 0 },
  ];

  const handleTabPress = (route: string) => {
    const currentPath = segments.join('/');
    const targetPath = route.replace(/^\//, '');
    
    // Simplifica a comparação: dashboard/index vs dashboard
    const normalizedCurrent = currentPath === 'dashboard/index' ? 'dashboard' : currentPath;
    const normalizedTarget = targetPath === 'dashboard/index' ? 'dashboard' : targetPath;

    if (normalizedCurrent === normalizedTarget) return;
    
    router.push(route as any);
  };

  return (
    <View 
      className="bg-surface/95 border-t border-outline-variant/10 flex-row items-end justify-around px-2"
      style={{
        paddingTop: 8,
        paddingBottom: Math.max(insets.bottom, 16),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 8
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        if (tab.isFAB) {
          return (
            <View key={tab.key} className="items-center justify-center -top-3">
              <Pressable
                onPress={() => handleTabPress(tab.route)}
                className="bg-primary shadow-primary/40 w-14 h-14 rounded-2xl items-center justify-center shadow-lg"
              >
                <Ionicons 
                   name={tab.icon.replace('-outline', '') as any} 
                   size={32} 
                   color="white" 
                />
              </Pressable>
              <Text className={`text-[10px] mt-1 ${isActive ? 'font-bold text-primary' : 'font-medium text-on-surface-variant'}`}>
                {tab.label}
              </Text>
            </View>
          );
        }

        return (
          <Pressable
            key={tab.key}
            onPress={() => handleTabPress(tab.route)}
            className="flex-1 items-center justify-center py-2 active:opacity-70"
          >
            <View>
              <Ionicons
                name={isActive ? tab.icon.replace('-outline', '') as any : tab.icon}
                size={24}
                color={isActive ? colors.primary : colors.outline}
              />

              {(tab.badgeCount ?? 0) > 0 ? (
                <View className="absolute -top-1 -right-1 bg-error min-w-[16px] h-4 rounded-full items-center justify-center px-1">
                  <Text className="text-[8px] font-bold text-white">
                    {(tab.badgeCount ?? 0) > 9 ? '9+' : tab.badgeCount}
                  </Text>
                </View>
              ) : null}
            </View>

            <Text
              className={`text-[10px] mt-1 ${isActive ? 'font-bold text-primary' : 'font-medium text-on-surface-variant'}`}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default AppFooter;
