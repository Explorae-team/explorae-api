import React from 'react';
import { View, Text, Pressable, Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export interface FooterTab {
  key: 'routes' | 'explore' | 'action' | 'coupons' | 'profile';
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

  const tabs: FooterTab[] = [
    { key: 'routes', label: 'Rotas', icon: 'map-outline', route: '/dashboard/routes' },
    { key: 'explore', label: 'Buscas', icon: 'search-outline', route: '/dashboard/search' },
    { key: 'action', label: 'Explorar', icon: 'compass-outline', route: '/dashboard', isFAB: true },
    { key: 'coupons', label: 'Cupons', icon: 'ticket-outline', route: '/dashboard/coupons', badgeCount: couponCount },
    { key: 'profile', label: 'Perfil', icon: 'person-outline', route: '/dashboard/profile', badgeCount: questNotification ? 1 : 0 },
  ];

  const handlePress = (tab: FooterTab) => {
    router.push(tab.route as any);
  };

  return (
    <View className="bg-surface/95 border-t border-outline-variant/10 flex-row items-end justify-around pb-8 pt-2 px-2"
      style={{
        boxShadow: '0px -4px 8px rgba(0, 0, 0, 0.05)',
        elevation: 8
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        if (tab.isFAB) {
          return (
            <View key={tab.key} className="items-center justify-center -top-3">
              <Pressable
                onPress={() => handlePress(tab)}
                className={`${isActive ? 'bg-primary shadow-primary/40' : 'bg-[#0d3e4e] border border-white/10'} w-14 h-14 rounded-2xl items-center justify-center shadow-lg`}
              >
                <Ionicons 
                  name={isActive ? tab.icon.replace('-outline', '') as any : tab.icon} 
                  size={32} 
                  color={isActive ? 'white' : '#bde9fe'} 
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
            onPress={() => handlePress(tab)}
            className="flex-1 items-center justify-center py-2 active:opacity-70"
          >
            <View>
              <Ionicons
                name={isActive ? tab.icon.replace('-outline', '') as any : tab.icon}
                size={24}
                color={isActive ? '#FF5C00' : '#8E918F'}
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
  );
};

export default AppFooter;
