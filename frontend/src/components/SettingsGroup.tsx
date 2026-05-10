import React from 'react';
import { View } from 'react-native';

interface SettingsGroupProps {
  children: React.ReactNode;
}

export default function SettingsGroup({ children }: SettingsGroupProps) {
  // Converte children para array para facilitar a inserção de divisores
  const childrenArray = React.Children.toArray(children);

  return (
    <View className="bg-surface-container-high rounded-2xl overflow-hidden shadow-xl mb-4">
      {childrenArray.map((child, index) => (
        <React.Fragment key={index}>
          {child}
          {index < childrenArray.length - 1 && (
            <View className="h-px bg-outline-variant/30 mx-5" />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}
