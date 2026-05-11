import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
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
      style={{ paddingTop: insets.top + 16 }}
      className="bg-[#00161e] border-b border-white/5 px-6 pb-4 flex-row justify-between items-center"
    >
      <View style={{ width: 150, height: 40 }}>
        <Image 
          source={require('../../assets/branding/logo-main.png')}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
        />
      </View>

      <Pressable 
        onPress={onNotificationsPress}
        className="p-2 rounded-full active:bg-surface-bright/50"
      >
        <MaterialIcons name="notifications" size={24} color="#fd6c28" />
      </Pressable>
    </View>
  );
};
