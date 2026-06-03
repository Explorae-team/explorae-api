import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

interface AuthInputProps extends TextInputProps {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  error?: string;
  rightElement?: React.ReactNode;
  rightIconName?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
}

export default function AuthInput({
  label,
  iconName,
  error,
  rightElement,
  rightIconName,
  onRightIconPress,
  secureTextEntry, // Extraído para controle explícito se necessário
  ...textInputProps
}: AuthInputProps) {
  return (
    <View className="mb-4">
      <View className="flex-row justify-between mb-2">
        <Text className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest ml-1">
          {label}
        </Text>
        {rightElement}
      </View>
      
      <View className="relative justify-center">
        <View className="absolute left-4 z-20">
          <Ionicons name={iconName} size={20} color={colors.outline} />
        </View>
        
        <TextInput
          placeholderTextColor={colors.outline}
          secureTextEntry={secureTextEntry}
          className={`bg-surface pl-12 ${rightIconName ? 'pr-12' : 'pr-4'} py-4 rounded-2xl text-on-surface font-semibold ${
            error ? "border border-error" : "border border-white/5"
          }`}
          {...textInputProps}
        />

        {rightIconName && (
          <TouchableOpacity 
            onPress={onRightIconPress}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            className="absolute right-4 z-20"
            style={{ padding: 4 }}
          >
            <Ionicons name={rightIconName} size={22} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text className="text-error text-[10px] mt-1 ml-1">{error}</Text>
      )}
    </View>
  );
}
