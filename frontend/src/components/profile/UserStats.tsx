import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import api from '../../services/api';
import storage from '../../utils/storage';
import { ProgressBar, calculateLevelProgress } from '../common/ProgressBar';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

export default function UserStats() {
  const { user, updateProfile } = useAuth() as any;
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tempName, setTempName] = useState(user?.name || '');
  const [tempBio, setTempBio] = useState(user?.bio || '');

  const userName = user?.name || 'Explorador Anônimo';
  const bio = user?.bio || 'Sempre pronto para a próxima aventura!';
  const level = user?.level || 1;
  const xp = user?.xp || 0;
  const levelName = user?.levelName || `Explorador Nível ${level}`;

  const handleToggleEdit = () => {
    if (!isEditing) {
      setTempName(user?.name || '');
      setTempBio(user?.bio || '');
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (!tempName.trim()) {
      Alert.alert('Erro', 'O nome não pode estar vazio');
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateProfile({
        name: tempName,
        bio: tempBio
      });

      if (result.success) {
        setIsEditing(false);
      } else {
        Alert.alert('Erro', result.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Precisamos de permissão para acessar suas fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
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

      if (!response.ok) throw new Error('Falha no upload');

      Alert.alert('Sucesso', 'Foto atualizada!');
    } catch (error: any) {
      Alert.alert('Erro', 'Não foi possível salvar a foto.');
    } finally {
      setIsSaving(false);
    }
  };

  const getTierColor = (xp: number) => {
    if (xp < 1000) return '#CD7F32';
    if (xp < 2000) return '#C0C0C0';
    if (xp < 3000) return '#FFD700';
    return '#40E0D0';
  };

  const tierColor = getTierColor(xp);

  const avatarUrl = user?.photoUrl 
    ? (user.photoUrl.startsWith('http') ? user.photoUrl : `${API_URL}${user.photoUrl}`)
    : null;

  const { progressXp, xpNeededForThisLevel, progressPercentage } = calculateLevelProgress(xp, level);

  return (
    <View className="items-center mt-6">
      <View className="relative">
        {/* Borda dinâmica baseada no tier de XP */}
        <TouchableOpacity 
          testID="avatar-touchable"
          activeOpacity={0.8}
          onPress={pickImage}
          disabled={isSaving}
          className="w-32 h-32 rounded-full shadow-xl items-center justify-center overflow-hidden"
          style={{ backgroundColor: tierColor }}
        >
          <View className="w-[124px] h-[124px] rounded-full bg-on-primary-container items-center justify-center">
            <View className="w-[118px] h-[118px] rounded-full bg-surface items-center justify-center">
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
              <View className="absolute inset-0 bg-black/20 items-center justify-center rounded-full opacity-0 hover:opacity-100">
                 <MaterialIcons name="camera-alt" size={24} color="white" />
              </View>
            </View>
          </View>
          {isSaving && (
            <View className="absolute inset-0 bg-black/30 items-center justify-center rounded-full">
              <ActivityIndicator color="white" />
            </View>
          )}
        </TouchableOpacity>
        <View 
          className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full border-2 border-surface flex-row items-center space-x-1 shadow-lg"
          style={{ backgroundColor: tierColor }}
        >
          <MaterialIcons name="military-tech" size={16} color="#422d00" />
          <Text className="text-on-tertiary font-black">{level}</Text>
        </View>
      </View>

      <View className="mt-4 items-center w-full px-4">
        {isEditing ? (
          <View className="w-full items-center">
            <TextInput
              testID="name-input"
              value={tempName}
              onChangeText={setTempName}
              placeholder="Nome"
              maxLength={100}
              className="text-3xl font-black text-on-surface tracking-tight text-center w-full border-b border-tertiary pb-1"
              autoFocus
            />
            <View className="w-full mt-4">
              <TextInput
                testID="bio-input"
                value={tempBio}
                onChangeText={setTempBio}
                placeholder="Sua bio (até 150 caracteres)"
                maxLength={150}
                multiline
                className="text-on-surface-variant font-medium text-center border border-on-surface/10 rounded-xl p-3"
                style={{ minHeight: 80, textAlignVertical: 'top' }}
              />
              <Text className="text-[10px] text-on-surface-variant text-right mt-1">
                {tempBio.length}/150
              </Text>
            </View>
            
            <View className="flex-row mt-6 space-x-4">
              <TouchableOpacity 
                testID="save-button"
                onPress={handleSave}
                disabled={isSaving}
                className="bg-primary px-6 py-2 rounded-full flex-row items-center space-x-2"
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <MaterialIcons name="check" size={18} color="white" />
                    <Text className="text-white font-bold">Salvar</Text>
                  </>
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                testID="cancel-button"
                onPress={handleToggleEdit}
                disabled={isSaving}
                className="bg-surface-container-highest px-6 py-2 rounded-full flex-row items-center space-x-2"
              >
                <MaterialIcons name="close" size={18} color="#fd6c28" />
                <Text className="text-primary font-bold">Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="items-center">
            <View className="flex-row items-center">
              <Text className="text-3xl font-black text-on-surface tracking-tight">{userName}</Text>
              <TouchableOpacity 
                testID="edit-button"
                onPress={handleToggleEdit} 
                className="ml-2 bg-surface-container p-1 rounded-full"
              >
                <MaterialIcons name="edit" size={18} color="#fd6c28" />
              </TouchableOpacity>
            </View>
            <Text className="text-tertiary font-bold text-xs uppercase tracking-widest mt-1">{levelName}</Text>
            <Text className="text-on-surface-variant font-medium mt-1 text-center">{bio}</Text>
          </View>
        )}
      </View>


      <ProgressBar
        progressPercentage={progressPercentage}
        variant="premium"
        fillColor={tierColor}
        style={{ marginTop: 32 }}
        label="XP ATUAL"
        labelColor={tierColor}
        currentValue={progressXp}
        targetValue={xpNeededForThisLevel}
      />
    </View>
  );
}
