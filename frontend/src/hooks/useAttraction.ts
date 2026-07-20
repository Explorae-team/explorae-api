import { useState, useEffect, useCallback } from 'react';
import { Vibration, Platform } from 'react-native';
import api from '../services/api';
import { useCelebration } from '../contexts/BadgeCelebrationContext';
import { useToast } from '../contexts/ToastContext';

export function useAttraction(id: string | string[] | undefined) {
  const { triggerCelebration } = useCelebration();
  const { showToast } = useToast();

  const [attraction, setAttraction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isSavingAttraction, setIsSavingAttraction] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAttraction = useCallback(async () => {
    if (!id) return;
    try {
      setError(null);
      const response = await api.get(`/api/v1/attractions/${id}`);
      setAttraction(response.data?.data);
    } catch (err: any) {
      console.error('Erro ao buscar detalhes da atração:', err);
      setError('Não foi possível carregar as informações desta atração.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setIsLoading(true);
    fetchAttraction();
  }, [id, fetchAttraction]);

  const refresh = useCallback(async () => {
    if (!id) return;
    setRefreshing(true);
    try {
      const response = await api.get(`/api/v1/attractions/${id}`);
      setAttraction(response.data?.data);
    } catch (err) {
      console.error('Erro ao recarregar detalhes da atração:', err);
    } finally {
      setRefreshing(false);
    }
  }, [id]);

  const checkIn = useCallback(async () => {
    if (isCheckingIn || !id) return;
    try {
      setIsCheckingIn(true);
      const response = await api.post(`/api/v1/attractions/${id}/check-in`);
      
      // Feedback tátil de sucesso
      Vibration.vibrate(100);

      const unlockedBadges = response.data?.data?.unlockedBadges;
      if (unlockedBadges && unlockedBadges.length > 0) {
        triggerCelebration(unlockedBadges);
      } else {
        showToast('Check-in realizado com sucesso! Compartilhe sua dica com a galera.', 'success');
      }
      
      // Abre automaticamente o modal de dica pós check-in
      setReviewModalVisible(true);
    } catch (err) {
      console.error('Erro ao realizar check-in:', err);
      Vibration.vibrate([100, 100, 100]); // Vibrar erro
      showToast('Não foi possível realizar o check-in no momento.', 'error');
    } finally {
      setIsCheckingIn(false);
    }
  }, [id, isCheckingIn, triggerCelebration, showToast]);

  const toggleSave = useCallback(async () => {
    if (isSavingAttraction || !id) return;
    try {
      setIsSavingAttraction(true);
      const response = await api.post(`/api/v1/attractions/${id}/favorite`);
      
      const newSavedState = response.data?.data?.isFavorite;
      setAttraction((prev: any) => {
        if (!prev) return null;
        return { ...prev, isSaved: newSavedState };
      });
      
      const unlockedBadges = response.data?.data?.unlockedBadges;
      if (unlockedBadges && unlockedBadges.length > 0) {
        triggerCelebration(unlockedBadges);
      } else {
        showToast(newSavedState ? 'Atração salva nos favoritos!' : 'Atração removida dos favoritos!', 'success');
      }
    } catch (err) {
      console.error('Erro ao favoritar/salvar atração:', err);
      showToast('Não foi possível salvar a atração no momento.', 'error');
    } finally {
      setIsSavingAttraction(false);
    }
  }, [id, isSavingAttraction, triggerCelebration, showToast]);

  const addReview = useCallback(async (rating: number, content: string, photoUri?: string) => {
    if (!id) return;
    try {
      let photoUrl = undefined;
      
      // Se houver uma foto selecionada, realizar o upload antes
      if (photoUri) {
        const localUri = photoUri;
        const filename = localUri.split('/').pop() || 'photo.jpg';
        
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        const formData = new FormData();
        
        if (Platform.OS === 'web') {
          // No ambiente web/browser: converte o blob URL local para um objeto Blob real
          const blobResponse = await fetch(localUri);
          const blob = await blobResponse.blob();
          formData.append('file', blob, filename);
        } else {
          // No ambiente nativo (Android/iOS): passa o wrapper de arquivo padrão
          // @ts-ignore
          formData.append('file', { uri: localUri, name: filename, type });
        }
        
        const uploadResponse = await api.post('/api/v1/attractions/reviews/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        photoUrl = uploadResponse.data?.data; // URL pública retornada pelo Supabase Storage
      }

      const response = await api.post(`/api/v1/attractions/${id}/reviews`, {
        content,
        rating,
        photoUrl
      });
      
      const unlockedBadges = response.data?.data?.unlockedBadges;

      // Recarregar os detalhes da atração
      const attractionRes = await api.get(`/api/v1/attractions/${id}`);
      setAttraction(attractionRes.data?.data);

      if (unlockedBadges && unlockedBadges.length > 0) {
        triggerCelebration(unlockedBadges);
      } else {
        showToast('Obrigado pela sua avaliação!', 'success');
      }
    } catch (err) {
      console.error('Erro ao adicionar avaliação:', err);
      showToast('Não foi possível enviar sua avaliação no momento.', 'error');
      throw err; // Propaga para o modal tratar o estado interno de envio
    }
  }, [id, triggerCelebration, showToast]);

  return {
    attraction,
    isLoading,
    error,
    isCheckingIn,
    isSavingAttraction,
    refreshing,
    reviewModalVisible,
    setReviewModalVisible,
    checkIn,
    toggleSave,
    addReview,
    refresh,
  };
}
