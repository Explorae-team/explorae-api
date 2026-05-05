import React from 'react';
import { View, Text, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function UserStats() {
  return (
    <View className="items-center mt-6">
      <View className="relative">
        <View className="w-32 h-32 rounded-full p-1 bg-tertiary shadow-xl">
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBL6rf3HvpVtMjNf8HlRbjw9eRQK-_TpCO3Z_LOIAws6t-h76MHvjXHoEFWGMjnUf-wdSMqWTXeKbbngsGy8fZVxhss6YbkhrgRVyrucI4PVrEoOvKGzEYZR-FxT_Y1yhaXgpSYSZGOtWOcS95hxGopFks6I2YSnljAtGqnMLz7OLCMojfD7J0X5RnruFkH1Qhjqn2pd_R2GC79ziVnq9Gn11biKGLYmx58xczOQnlvMkE9BFR0YkwkwiY5Ut1POtqiQkegnNhp6tU' }}
            className="w-full h-full rounded-full border-4 border-surface"
          />
        </View>
        <View className="absolute -bottom-2 -right-2 bg-tertiary px-3 py-1 rounded-full border-2 border-surface flex-row items-center space-x-1">
          <MaterialIcons name="military-tech" size={16} color="#422d00" />
          <Text className="text-on-tertiary font-black">24</Text>
        </View>
      </View>
      
      <View className="mt-4 items-center">
        <Text className="text-3xl font-black text-on-surface">Marina Silva</Text>
        <Text className="text-on-surface-variant font-medium mt-1">Trailblazer Enthusiast</Text>
      </View>

      {/* XP Progress */}
      <View className="w-full mt-8 bg-surface-container-highest rounded-full h-4 overflow-hidden relative">
        <View className="absolute top-0 left-0 h-full bg-tertiary rounded-full" style={{ width: '85%' }} />
      </View>
      <View className="w-full flex-row justify-between mt-2 px-1">
        <Text className="text-xs font-bold text-tertiary uppercase tracking-widest">4,250 XP</Text>
        <Text className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">5,000 XP</Text>
      </View>
    </View>
  );
}
