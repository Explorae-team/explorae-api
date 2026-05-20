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
      <View
        style={{
          width: 192,
          backgroundColor: '#00232f',
          borderRadius: 24,
          padding: 12,
          overflow: 'hidden',
        }}
      >
        <Animated.View
          style={{
            opacity,
            width: '100%',
            height: 128,
            backgroundColor: 'rgba(189, 233, 254, 0.08)',
            borderRadius: 16,
          }}
        />
        {/* Usamos marginTop em vez de gap para compatibilidade web */}
        <View style={{ marginTop: 12 }}>
          <Animated.View
            style={{
              opacity,
              width: '75%',
              height: 16,
              backgroundColor: 'rgba(189, 233, 254, 0.08)',
              borderRadius: 8,
            }}
          />
          <Animated.View
            style={{
              opacity,
              width: '50%',
              height: 12,
              backgroundColor: 'rgba(189, 233, 254, 0.08)',
              borderRadius: 8,
              marginTop: 8,
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <View
      style={{
        width: '100%',
        backgroundColor: '#001b24',
        borderRadius: 40,
        padding: 24,
        marginBottom: 16,
      }}
    >
      <Animated.View
        style={{
          opacity,
          width: '100%',
          height: 256,
          backgroundColor: 'rgba(189, 233, 254, 0.08)',
          borderRadius: 32,
        }}
      />
      <View style={{ marginTop: 24 }}>
        <Animated.View
          style={{
            opacity,
            width: '66%',
            height: 24,
            backgroundColor: 'rgba(189, 233, 254, 0.08)',
            borderRadius: 8,
          }}
        />
        <Animated.View
          style={{
            opacity,
            width: '100%',
            height: 16,
            backgroundColor: 'rgba(189, 233, 254, 0.08)',
            borderRadius: 8,
            marginTop: 12,
          }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
          <Animated.View
            style={{
              opacity,
              width: 96,
              height: 16,
              backgroundColor: 'rgba(189, 233, 254, 0.08)',
              borderRadius: 8,
            }}
          />
          <Animated.View
            style={{
              opacity,
              width: 64,
              height: 16,
              backgroundColor: 'rgba(189, 233, 254, 0.08)',
              borderRadius: 8,
            }}
          />
        </View>
      </View>
    </View>
  );
}
