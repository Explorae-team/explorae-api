import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileForm() {
  const { user } = useAuth() as any;
  const [name, setName] = useState(user?.name || 'Marina Silva');
  const [bio, setBio] = useState(user?.bio || 'Trailblazer Enthusiast. Sempre em busca da próxima grande aventura e paisagens intocadas.');

  return (
    <View className="px-4 py-2 flex-col gap-5">
      <View className="flex-col gap-2">
        <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-2">
          Nome Completo
        </Text>
        <TextInput
          className="w-full bg-surface-container-high rounded-[16px] px-5 py-4 text-on-surface font-medium text-[16px]"
          value={name}
          onChangeText={setName}
          placeholder="Seu nome"
          placeholderTextColor="rgba(193, 199, 204, 0.5)"
        />
      </View>
      
      <View className="flex-col gap-2">
        <Text className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-2">
          Bio
        </Text>
        <TextInput
          className="w-full bg-surface-container-high rounded-[16px] px-5 py-4 text-on-surface font-medium text-[16px]"
          value={bio}
          onChangeText={setBio}
          placeholder="Conte um pouco sobre você"
          placeholderTextColor="rgba(193, 199, 204, 0.5)"
          multiline
          numberOfLines={3}
          style={{ textAlignVertical: 'top' }}
        />
      </View>
    </View>
  );
}
