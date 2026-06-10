import api from './api';
import { Platform } from 'react-native';

export const userService = {
  /**
   * Envia a foto de perfil do usuário para o backend.
   * Lida automaticamente com as diferenças de FormData entre plataformas (Web e Mobile).
   */
  uploadAvatar: async (uri: string): Promise<{ success: boolean; data?: any; message?: string }> => {
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

      const response = await api.post('/api/v1/users/me/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        data: response.data?.data,
        message: response.data?.message || 'Upload realizado com sucesso'
      };
    } catch (error: any) {
      console.error('Erro no upload do avatar:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao realizar upload da foto de perfil'
      };
    }
  }
};
