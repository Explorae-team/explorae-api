import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { useAuth } from '../../contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { userService } from '../../services/userService';
import { ProgressBar, calculateLevelProgress } from '../common/ProgressBar';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

export default function UserStats() {
  const { user, updateProfile, updateUserPreferences } = useAuth() as any;
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tempName, setTempName] = useState(user?.name || 'Explorador Anônimo');
  const [tempBio, setTempBio] = useState(user?.bio || 'Sempre pronto para a próxima aventura!');
  const [avatarVersion, setAvatarVersion] = useState(Date.now());
 
  const userName = user?.name || 'Explorador Anônimo';
  const bio = user?.bio || 'Sempre pronto para a próxima aventura!';
  const level = user?.level || 1;
  const xp = user?.xp || 0;
  const levelName = user?.levelName || `Explorador Nível ${level}`;
 
  const handleToggleEdit = () => {
    if (!isEditing) {
      setTempName(user?.name || 'Explorador Anônimo');
      setTempBio(user?.bio || 'Sempre pronto para a próxima aventura!');
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
    console.log('[pickImage] Function triggered');
    try {
      console.log('[pickImage] Checking permissions...');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('[pickImage] Permission status:', status);
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos de permissão para acessar suas fotos.');
        return;
      }

      console.log('[pickImage] Launching image library...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      console.log('[pickImage] ImagePicker result:', JSON.stringify(result));

      if (!result.canceled) {
        console.log('[pickImage] Uploading image with URI:', result.assets[0].uri);
        uploadImage(result.assets[0].uri);
      } else {
        console.log('[pickImage] Selection canceled by user');
      }
    } catch (error: any) {
      console.error('[pickImage] Error opening gallery:', error);
      Alert.alert('Erro', `Não foi possível abrir a galeria: ${error.message || error}`);
    }
  };

  const uploadImage = async (uri: string) => {
    console.log('[uploadImage] Uploading image...', uri);
    setIsSaving(true);
    try {
      const result = await userService.uploadAvatar(uri);
      console.log('[uploadImage] Upload result:', JSON.stringify(result));

      if (!result.success) throw new Error(result.message || 'Falha no upload');

      await updateUserPreferences();
      setAvatarVersion(Date.now());

      Alert.alert('Sucesso', 'Foto atualizada!');
    } catch (error: any) {
      console.error('[uploadImage] Error during upload:', error);
      Alert.alert('Erro', error.message || 'Não foi possível salvar a foto.');
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
    ? (user.photoUrl.startsWith('http') 
        ? `${user.photoUrl}${user.photoUrl.includes('?') ? '&' : '?'}v=${avatarVersion}` 
        : `${API_URL}${user.photoUrl}?v=${avatarVersion}`)
    : null;

  const { progressXp, xpNeededForThisLevel, progressPercentage } = calculateLevelProgress(xp, level);

  return (
    <View className="items-center mt-6">
      <View className="relative">
        {/* Borda dinâmica baseada no tier de XP */}
        <TouchableOpacity 
          testID="avatar-touchable"
          activeOpacity={0.85}
          onPress={pickImage}
          disabled={isSaving}
          style={{
            width: 128,
            height: 128,
            borderRadius: 64,
            backgroundColor: tierColor,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
          }}
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
            </View>
          </View>
          {isSaving && (
            <View className="absolute inset-0 bg-black/30 items-center justify-center rounded-full">
              <ActivityIndicator color="white" />
            </View>
          )}
        </TouchableOpacity>
        
        {/* Floating level badge on bottom-right */}
        <View 
          className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full border-2 border-surface flex-row items-center space-x-1 shadow-lg"
          style={{ backgroundColor: tierColor }}
        >
          <MaterialIcons name="military-tech" size={16} color="#422d00" />
          <Text className="text-on-tertiary font-black">{level}</Text>
        </View>

        {/* Floating camera/edit badge on bottom-left */}
        <View 
          className="absolute -bottom-1 -left-1 p-2 rounded-full border-2 border-surface shadow-lg"
          style={{ backgroundColor: colors.surfaceContainer }}
        >
          <MaterialIcons name="camera-alt" size={14} color={colors.primary} />
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
              className="text-3xl font-black tracking-tight text-center w-full border-b border-tertiary pb-1"
              autoFocus
              style={{ color: colors.onSurface }}
              placeholderTextColor={colors.outline}
            />
            <View className="w-full mt-4">
              <TextInput
                testID="bio-input"
                value={tempBio}
                onChangeText={setTempBio}
                placeholder="Sua bio (até 150 caracteres)"
                maxLength={150}
                multiline
                className="font-medium text-center border border-on-surface/10 rounded-xl p-3 w-full"
                style={{ 
                  minHeight: 80, 
                  textAlignVertical: 'top', 
                  color: colors.onSurfaceVariant,
                  backgroundColor: colors.surfaceContainer
                }}
                placeholderTextColor={colors.outline}
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
                <MaterialIcons name="close" size={18} color={colors.primary} />
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
                <MaterialIcons name="edit" size={18} color={colors.primary} />
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
