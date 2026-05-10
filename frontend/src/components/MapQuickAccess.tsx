import React from 'react';
import { View, Text, Pressable, ImageBackground } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface MapQuickAccessProps {
  onPress?: () => void;
}

export const MapQuickAccess: React.FC<MapQuickAccessProps> = ({ onPress }) => {
  return (
    <Pressable 
      onPress={onPress}
      className="mx-6 h-32 rounded-2xl overflow-hidden border border-outline-variant/20 active:scale-[0.98] transition-transform mb-10"
    >
      <ImageBackground 
        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlNB5RpYyiDx0vZZpazyoKtI_oXKbJSA1JA47H2mKHh_9KqYhYMuPS4fWEGTc857raJJBZziBSQSzuRfXGJc5hcNxTgjdaZJKwapBK45Q2LvJq-VSKMy7W3SrBiWohgtm8tsmIAq3QconK9E6Nrls9upwWpg_evLDp9DsCGWagzRNc6XMyQXmjUcyQwTPD5KbE9UVvldilQQ_tU2-t3KzjTlOLXhe_2WW4_TMQVCqicNOrL2fHBw-cbBKHXgwW3FowrHrE4EAz-CE' }}
        className="w-full h-full"
      >
        <View className="flex-1 bg-surface/60 items-center justify-center p-6">
          <View className="bg-on-primary-container px-8 py-3 rounded-full flex-row items-center space-x-2 shadow-xl">
            <MaterialIcons name="map" size={20} color="#591c00" />
            <Text className="text-on-primary font-black text-sm tracking-widest">
              ABRIR MAPA
            </Text>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
};
