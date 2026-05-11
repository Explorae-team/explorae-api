import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileForm() {
  const { user } = useAuth() as any;
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');

  return (
    <View className="px-6 gap-6">
      <View>
        <Text className="text-on-surface-variant font-bold text-xs uppercase mb-2 ml-1">Nome de Explorador</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          className="bg-surface-container-high p-4 rounded-2xl text-on-surface font-bold border border-on-surface/5"
          placeholder="Como quer ser chamado?"
          placeholderTextColor="#999"
        />
      </View>
      
      <View>
        <View className="flex-row justify-between items-center mb-2 ml-1">
          <Text className="text-on-surface-variant font-bold text-xs uppercase">Sua Bio</Text>
          <Text className="text-[10px] text-on-surface-variant font-medium">{bio.length}/150</Text>
        </View>
        <TextInput
          value={bio}
          onChangeText={setBio}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          className="bg-surface-container-high p-4 rounded-2xl text-on-surface font-medium min-h-[100px] border border-on-surface/5"
          placeholder="Conte um pouco sobre suas aventuras..."
          placeholderTextColor="#999"
          maxLength={150}
        />
      </View>
    </View>
  );
}
