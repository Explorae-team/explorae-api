import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Modal, Platform, Image } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../constants/colors';

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, content: string, photoUri?: string) => Promise<void>;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ visible, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePickImage = async (useCamera: boolean) => {
    try {
      const permissionResult = useCamera 
        ? await ImagePicker.requestCameraPermissionsAsync() 
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        alert(`Permissão para usar a ${useCamera ? 'câmera' : 'galeria'} é necessária.`);
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
          });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (err) {
      console.error('Erro ao capturar imagem:', err);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert('Por favor, escreva o conteúdo da dica.');
      return;
    }
    if (content.length > 500) {
      alert('A sua dica deve ter no máximo 500 caracteres.');
      return;
    }
    try {
      setIsSubmitting(true);
      await onSubmit(rating, content, photoUri || undefined);
      setContent('');
      setRating(5);
      setPhotoUri(null);
      onClose();
    } catch (err) {
      console.error('Erro ao enviar avaliação:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <View className="bg-surface-container rounded-3xl p-6 border border-white/10 w-[90%] max-w-[400px]">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-white text-lg font-bold font-sans">Nova Dica</Text>
        <TouchableOpacity onPress={onClose} className="p-1 rounded-full bg-white/5">
          <MaterialCommunityIcons name="close" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Seletor de Estrelas */}
      <Text className="text-white/60 text-xs font-bold uppercase mb-2 font-sans">Sua Nota</Text>
      <View className="flex-row gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <MaterialIcons 
              name={star <= rating ? "star" : "star-border"} 
              size={32} 
              color={colors.exploraGold} 
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Input de Texto */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-white/60 text-xs font-bold uppercase font-sans">Sua Experiência</Text>
        <Text className={`text-xs font-sans ${content.length > 450 ? 'text-accent' : 'text-white/40'}`}>
          {content.length}/500
        </Text>
      </View>
      <TextInput
        placeholder="Compartilhe uma dica valiosa sobre o local..."
        placeholderTextColor="rgba(255,255,255,0.3)"
        multiline
        numberOfLines={4}
        value={content}
        onChangeText={setContent}
        maxLength={500}
        className="bg-surface border border-white/5 rounded-2xl p-4 text-white text-sm font-sans mb-4 h-24"
        style={{ textAlignVertical: 'top' }}
      />

      {/* Seção de Foto Opcional */}
      <Text className="text-white/60 text-xs font-bold uppercase mb-2 font-sans">Anexar Foto (Opcional)</Text>
      
      {photoUri ? (
        <View className="relative rounded-2xl overflow-hidden mb-6 border border-white/10 h-28 w-full">
          <Image source={{ uri: photoUri }} className="w-full h-full object-cover" />
          <TouchableOpacity 
            onPress={() => setPhotoUri(null)}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 border border-white/20"
          >
            <MaterialCommunityIcons name="trash-can-outline" size={16} color={colors.accent} />
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity 
            onPress={() => handlePickImage(true)}
            className="flex-1 py-3 border border-dashed border-white/10 bg-white/5 rounded-xl flex-row justify-center items-center gap-2"
          >
            <MaterialCommunityIcons name="camera" size={16} color={colors.exploraGold} />
            <Text className="text-white/80 font-bold font-sans text-xs">Câmera</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => handlePickImage(false)}
            className="flex-1 py-3 border border-dashed border-white/10 bg-white/5 rounded-xl flex-row justify-center items-center gap-2"
          >
            <MaterialCommunityIcons name="image-multiple" size={16} color={colors.exploraGold} />
            <Text className="text-white/80 font-bold font-sans text-xs">Galeria</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Botões */}
      <View className="flex-row justify-end gap-3">
        <TouchableOpacity 
          onPress={onClose}
          className="px-5 py-3.5 rounded-xl bg-white/5 border border-white/10"
        >
          <Text className="text-white font-bold font-sans">Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={handleSubmit}
          disabled={isSubmitting}
          className="px-6 py-3.5 rounded-xl bg-accent flex-row items-center justify-center min-w-[100px]"
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-bold font-sans">Enviar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        {Platform.OS !== 'web' && (
          <BlurView 
            intensity={30} 
            tint="dark" 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0,
              pointerEvents: 'none'
            }} 
          />
        )}
        {modalContent}
      </View>
    </Modal>
  );
};
