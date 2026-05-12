import React, { useState } from 'react';
import { View, Image, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import api from '../../services/api';
import storage from '../../utils/storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

export default function ProfilePhotoEdit() {
  const { user } = useAuth() as any;
  const [isSaving, setIsSaving] = useState(false);

  const tierColor = '#fd6c28'; 
  const avatarUrl = user?.photoUrl 
    ? (user.photoUrl.startsWith('http') ? user.photoUrl : `${API_URL}${user.photoUrl}`)
    : null;

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos de acesso à sua galeria.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        uploadImage(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível abrir a galeria.');
    }
  };

  const uploadImage = async (uri: string) => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      const filename = uri.split('/').pop() || 'avatar.jpg';
      const type = 'image/jpeg';

      if (Platform.OS === 'web') {
        const response = await fetch(uri);
        const blob = await response.blob();
        formData.append('file', blob, filename);
      } else {
        // @ts-ignore
        formData.append('file', { uri, name: filename, type });
      }

      const token = await storage.getItem('auth_token');
      const response = await fetch(`${api.defaults.baseURL}/api/v1/users/me/avatar`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Falha no servidor');

      Alert.alert('Sucesso', 'Foto atualizada com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro no Upload', 'Não foi possível salvar sua foto.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View className="items-center mb-8">
      <TouchableOpacity 
        onPress={handlePickImage}
        activeOpacity={0.8}
        disabled={isSaving}
        className="w-32 h-32 rounded-full shadow-xl items-center justify-center overflow-hidden"
        style={{ backgroundColor: tierColor }}
      >
        {avatarUrl ? (
          <Image 
            source={{ uri: avatarUrl }} 
            className="w-full h-full" 
          />
        ) : (
          <MaterialIcons name="person" size={64} color="white" />
        )}
        
        {/* Camera Overlay */}
        <View className="absolute bottom-0 w-full h-8 bg-black/50 items-center justify-center">
           <MaterialIcons name="camera-alt" size={18} color="white" />
        </View>

        {isSaving && (
          <View className="absolute inset-0 bg-black/40 items-center justify-center">
            <ActivityIndicator color="white" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
