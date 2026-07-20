import React from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onFilterPress,
  placeholder = "O que você quer explorar hoje?"
}) => {
  return (
    <View className="flex-row items-center gap-x-3">
      <View className="flex-1 flex-row items-center bg-surface-container-high rounded-2xl px-4 py-1.5 border border-outline-variant/10 shadow-sm">
        <MaterialIcons name="search" size={22} color={colors.primary} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#8b9296"
          className="flex-1 ml-2 py-3 text-on-surface text-base"
          selectionColor="#fd6c28"
        />
        {value.length > 0 && (
          <Pressable onPress={() => onChangeText('')} className="p-1">
            <MaterialIcons name="close" size={20} color={colors.primary} />
          </Pressable>
        )}
      </View>
      
      {onFilterPress && (
        <Pressable 
          onPress={onFilterPress}
          className="bg-surface-container-high p-4 rounded-2xl border border-outline-variant/10 active:bg-surface-bright shadow-sm"
        >
          <MaterialIcons name="tune" size={24} color={colors.primary} />
        </Pressable>
      )}
    </View>
  );
};
