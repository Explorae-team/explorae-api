import React from 'react';
import { View, Animated } from 'react-native';

export default function AttractionSkeleton({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
  const opacity = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  if (variant === 'compact') {
    return (
      <View className="w-48 bg-surface-container rounded-3xl p-3 overflow-hidden">
        <Animated.View style={{ opacity }} className="w-full h-32 bg-on-surface/10 rounded-2xl" />
        <View className="mt-3 gap-y-2">
          <Animated.View style={{ opacity }} className="w-3/4 h-4 bg-on-surface/10 rounded-lg" />
          <Animated.View style={{ opacity }} className="w-1/2 h-3 bg-on-surface/10 rounded-lg" />
        </View>
      </View>
    );
  }

  return (
    <View className="w-full bg-surface-container-low rounded-[40px] p-6 mb-4">
      <Animated.View style={{ opacity }} className="w-full h-64 bg-on-surface/10 rounded-[32px]" />
      <View className="mt-6 gap-y-3">
        <Animated.View style={{ opacity }} className="w-2/3 h-6 bg-on-surface/10 rounded-lg" />
        <Animated.View style={{ opacity }} className="w-full h-4 bg-on-surface/10 rounded-lg" />
        <View className="flex-row justify-between mt-2">
          <Animated.View style={{ opacity }} className="w-24 h-4 bg-on-surface/10 rounded-lg" />
          <Animated.View style={{ opacity }} className="w-16 h-4 bg-on-surface/10 rounded-lg" />
        </View>
      </View>
    </View>
  );
}
