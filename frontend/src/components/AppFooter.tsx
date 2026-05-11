import React from 'react';
import { View, Text, Pressable, Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';

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

  const tabs: FooterTab[] = [
    { key: 'routes', label: 'Rotas', icon: 'map-outline', route: '/dashboard/routes' },
    { key: 'search', label: 'Buscas', icon: 'search-outline', route: '/dashboard/search' },
    { key: 'explore', label: 'Explore', icon: 'compass', route: '/dashboard', isFAB: true },
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
    <View className="absolute bottom-0 left-0 right-0">
      <View className="flex-row bg-surface/95 border-t border-white/5 pb-8 pt-3 px-4 items-center justify-around shadow-2xl">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          
          if (tab.isFAB) {
            return (
              <Pressable
                key={tab.key}
                onPress={() => handleTabPress(tab.route)}
                className="bg-primary w-14 h-14 rounded-full items-center justify-center -mt-10 shadow-lg shadow-primary/40 border-4 border-surface"
              >
                <Ionicons name={tab.icon as any} size={28} color="white" />
              </Pressable>
            );
          }

          return (
            <Pressable 
              key={tab.key} 
              onPress={() => handleTabPress(tab.route)}
              className="items-center px-4 py-1"
            >
              <View>
                <Ionicons 
                  name={isActive ? tab.icon.replace('-outline', '') as any : tab.icon} 
                  size={24} 
                  color={isActive ? '#fd6c28' : '#8b9296'} 
                />
                
                {tab.badgeCount && tab.badgeCount > 0 ? (
                  <View className="absolute -top-1 -right-1 bg-error min-w-[16px] h-4 rounded-full items-center justify-center px-1">
                    <Text className="text-[8px] font-bold text-white">
                      {tab.badgeCount > 9 ? '9+' : tab.badgeCount}
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
    </View>
  );
};

export default AppFooter;
