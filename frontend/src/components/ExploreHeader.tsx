import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ExploreHeaderProps {
  userPhotoUrl?: string;
  onProfilePress?: () => void;
  onNotificationsPress?: () => void;
}

export const ExploreHeader: React.FC<ExploreHeaderProps> = ({
  userPhotoUrl,
  onProfilePress,
  onNotificationsPress,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View 
      style={{ paddingTop: insets.top + 12 }}
      className="bg-surface/80 border-b border-outline-variant/10 px-6 pb-4 flex-row justify-between items-center z-50"
    >
      <View className="flex-row items-center">
        <Image 
          source={require('../../assets/branding/logo-main.png')}
          contentFit="contain"
          className="w-32 h-10"
        />
      </View>

      <Pressable 
        onPress={onNotificationsPress}
        className="p-2 rounded-full active:bg-surface-bright/50 transition-colors"
      >
        <MaterialIcons name="notifications" size={24} color="#fd6c28" />
      </Pressable>
    </View>
  );
};
