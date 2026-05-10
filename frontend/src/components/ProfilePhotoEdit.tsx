import React, { useState } from 'react';
import { View, Image, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import api from '../services/api';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

export default function ProfilePhotoEdit() {
  const { user } = useAuth() as any;
  const [isSaving, setIsSaving] = useState(false);

  const tierColor = '#fd6c28'; 
  const avatarUrl = user?.photoUrl 
    ? (user.photoUrl.startsWith('http') ? user.photoUrl : `${API_URL}${user.photoUrl}`)
    : null;

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de permissão para acessar suas fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `image/${match[1]}` : `image`;

      if (Platform.OS === 'web') {
        const response = await fetch(uri);
        const blob = await response.blob();
        
        // Extrai a extensão do tipo MIME (ex: image/png -> png)
        const extension = blob.type.split('/')[1] || 'jpg';
        const webFilename = `avatar-${Date.now()}.${extension}`;
        
        formData.append('file', blob, webFilename);
      } else {
        // @ts-ignore
        formData.append('file', { uri, name: filename, type });
      }

      await api.post('/api/v1/users/me/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Sucesso', 'Foto de perfil atualizada!');
    } catch (error) {
      console.error('Erro no upload:', error);
      Alert.alert('Erro', 'Falha ao fazer upload da imagem');
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
        <View className="w-[124px] h-[124px] rounded-full bg-surface items-center justify-center">
          {avatarUrl ? (
            <Image 
              source={{ uri: avatarUrl }} 
              className="w-full h-full rounded-full" 
            />
          ) : (
            <View className="w-full h-full rounded-full bg-surface-container items-center justify-center">
              <MaterialIcons name="person" size={64} color={tierColor} />
            </View>
          )}
          
          <View className="absolute inset-0 bg-black/20 items-center justify-center">
            <MaterialIcons name="camera-alt" size={24} color="white" />
          </View>
        </View>

        {isSaving && (
          <View className="absolute inset-0 bg-black/40 items-center justify-center rounded-full">
            <ActivityIndicator color="white" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
