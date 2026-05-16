import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
        <Text className="text-[#003646] text-[10px] font-bold uppercase tracking-widest ml-1">
          {label}
        </Text>
        {rightElement}
      </View>
      
      <View className="relative justify-center">
        <View className="absolute left-4 z-20">
          <Ionicons name={iconName} size={20} color="#94A3B8" />
        </View>
        
        <TextInput
          placeholderTextColor="#94A3B8"
          secureTextEntry={secureTextEntry}
          className={`bg-slate-50 pl-12 ${rightIconName ? 'pr-12' : 'pr-4'} py-4 rounded-2xl text-[#003646] font-semibold ${
            error ? "border border-red-200" : ""
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
            <Ionicons name={rightIconName} size={22} color="#fd6c28" />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text className="text-red-500 text-[10px] mt-1 ml-1">{error}</Text>
      )}
    </View>
  );
}
