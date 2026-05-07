import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export default function ProfilePhotoEdit() {
  const { user } = useAuth() as any;

  const userName = user?.name || 'Marina Silva';
  const bio = user?.bio || 'Trailblazer Enthusiast';
  const avatarUrl = user?.photoUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAp8u5WBaSE35UAHA0VB7q5Io3Gwo0LoZM09wzn1__awkfo3RLoPviW7oc7C9_LOXuaucRg7z8xZBdqDdjF4MtWaYBuo-F2yKAWNxbOA8mgEWRihxWU32Wh2HJts0jwKMkzycLsRyeiX2u_htL3qjoFBTqYEhpFC57Uagodn1PxugFDP5wrzeENSUpLYPz6MPsCgOky25gXqVHpP7QnFdqRo9JEMEClsUQ9vw4n8O_JbjFS7cAiDODdAyfN2U9UqQXeBWrOq7AfhnPy';

  return (
    <View className="flex-col items-center pt-8 pb-6 px-4">
      <View className="relative">
        <View className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface-container-high">
          <Image 
            source={{ uri: avatarUrl }} 
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <TouchableOpacity 
          className="absolute bottom-0 right-0 w-10 h-10 bg-on-primary-container rounded-full flex items-center justify-center border-2 border-surface shadow-lg"
          activeOpacity={0.8}
        >
          <MaterialIcons name="edit" size={20} color="#00161e" />
        </TouchableOpacity>
      </View>
      <View className="mt-4 text-center items-center">
        <Text className="text-[24px] font-black tracking-tight text-on-surface">{userName}</Text>
        <Text className="text-[14px] font-medium text-on-surface-variant mt-1">{bio}</Text>
      </View>
    </View>
  );
}
