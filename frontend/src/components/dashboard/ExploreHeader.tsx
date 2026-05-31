import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Logo from '../brand/Logo';

import { useRouter } from 'expo-router';

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
  const router = useRouter();

  return (
    <View 
      style={{ paddingTop: insets.top + 16 }}
      className="bg-[#00161e] border-b border-white/5 px-6 pb-4 flex-row justify-between items-center"
    >
      <View style={{ width: 130, height: 40, justifyContent: 'center' }}>
        <Logo width={120} height={40} />
      </View>

      <View className="flex-row items-center">
        <Pressable 
          onPress={() => router.push('/dashboard/favorites')}
          className="p-2 rounded-full active:bg-surface-bright/50 mr-1"
        >
          <MaterialIcons name="favorite" size={24} color="#fd6c28" />
        </Pressable>

        <Pressable 
          onPress={onNotificationsPress}
          className="p-2 rounded-full active:bg-surface-bright/50"
        >
          <MaterialIcons name="notifications" size={24} color="#fd6c28" />
        </Pressable>
      </View>
    </View>
  );
};
