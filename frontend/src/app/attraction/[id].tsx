import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, Vibration, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Componentes Reutilizáveis
import PhotoGalleryCarousel from '../../components/attraction/PhotoGalleryCarousel';
import PrimaryButton from '../../components/PrimaryButton';
import api from '../../services/api';
import ExploraScrollView from '../../components/common/ExploraScrollView';
import { useCelebration } from '../../contexts/BadgeCelebrationContext';
import { useToast } from '../../contexts/ToastContext';
import { ReviewModal } from '../../components/attraction/ReviewModal';
import { colors } from '../../constants/colors';
import { useRouteStore } from '../../store/useRouteStore';

// Sub-componentes Especializados
import AttractionActionHeader from '../../components/attraction/AttractionActionHeader';
import AttractionInfoGrid from '../../components/attraction/AttractionInfoGrid';
import AttractionHighlights from '../../components/attraction/AttractionHighlights';
import AttractionCommunityTips from '../../components/attraction/AttractionCommunityTips';

const AttractionDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { triggerCelebration } = useCelebration();
  const { showToast } = useToast();
  const addToRoute = useRouteStore((state) => state.addToRoute);
  const navigateNow = useRouteStore((state) => state.navigateNow);

  const [attraction, setAttraction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Controle do modal de avaliação
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isSavingAttraction, setIsSavingAttraction] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAttraction = async () => {
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
  };

  useEffect(() => {
    setIsLoading(true);
    fetchAttraction();
  }, [id]);

  const handleRefresh = async () => {
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
  };

  const handleCheckIn = async () => {
    if (isCheckingIn) return;
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
  };
  const handleToggleSave = async () => {
    if (isSavingAttraction) return;
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
  };

  const handleAddReview = async (rating: number, content: string, photoUri?: string) => {
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
          formData.append('file', { uri: localUri, name: filename, type } as any);
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
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background justify-center items-center">
        <ActivityIndicator size="large" color={colors.accent} />
        <Text className="text-white mt-4 font-bold">Carregando detalhes...</Text>
      </View>
    );
  }

  if (error || !attraction) {
    return (
      <View className="flex-1 bg-background justify-center items-center px-6">
        <MaterialCommunityIcons name="alert-circle-outline" size={64} color={colors.accent} />
        <Text className="text-white text-center mt-4 text-lg font-bold">{error || 'Atração não encontrada'}</Text>
        <PrimaryButton
          title="VOLTAR"
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/dashboard');
            }
          }}
          className="mt-8 px-12"
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Cabeçalho de Ações */}
      <AttractionActionHeader 
        isSaved={attraction?.isSaved}
        onToggleSave={handleToggleSave}
        onBack={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/dashboard');
          }
        }} 
      />

      <ExploraScrollView 
        contentContainerStyle={{ paddingBottom: 220 }} 
        onRefresh={handleRefresh}
        refreshing={refreshing}
      >
        {/* Galeria de Fotos */}
        <PhotoGalleryCarousel images={attraction.imageUrls || []} />

        {/* Canvas de Conteúdo */}
        <View className="px-6 -mt-20">
          {/* Tags e Info de Status */}
          <View className="flex-row items-center gap-2 mb-2">
            <View className="bg-explora-gold/20 px-3 py-1 rounded-full">
              <Text className="text-explora-gold text-[10px] font-bold uppercase">{attraction.category || 'Atração'}</Text>
            </View>
            <View className="flex-row items-center gap-1 bg-surface-bright/80 px-2 py-1 rounded-lg">
              <MaterialCommunityIcons name="star" size={14} color={colors.exploraGold} />
              <Text className="text-white text-sm font-bold">
                {attraction.averageRating ? attraction.averageRating.toFixed(1) : '0.0'}
              </Text>
            </View>
            {attraction.isPartner && (
              <View className="bg-green-500/20 px-2 py-1 rounded-lg flex-row items-center gap-1">
                <MaterialCommunityIcons name="check-decagram" size={12} color={colors.success} />
                <Text className="text-success text-[10px] font-bold">PARCEIRO</Text>
              </View>
            )}
          </View>

          {/* Nome e Descrição */}
          <Text className="text-4xl font-black text-on-background mb-2">{attraction.name}</Text>
          <Text className="text-on-background/90 text-sm leading-6">
            {attraction.longDescription || attraction.shortDescription}
          </Text>

          {/* Ação Principal: Rotas */}
          <View className="flex-row gap-3 mt-8">
            <TouchableOpacity
              onPress={() => {
                const lat = attraction.coordinate?.latitude !== undefined ? attraction.coordinate.latitude : (attraction.latitude || 0);
                const lng = attraction.coordinate?.longitude !== undefined ? attraction.coordinate.longitude : (attraction.longitude || 0);
                const img = attraction.mainImageUrl || attraction.imageUrls?.[0] || 'https://via.placeholder.com/150';

                const attrPayload = {
                  id: attraction.id,
                  category: attraction.category || 'Exploração',
                  title: attraction.name,
                  imageUrl: img,
                  coordinate: {
                    latitude: lat,
                    longitude: lng
                  }
                };
                addToRoute(attrPayload);
                showToast('Atração adicionada ao seu roteiro!', 'success');
              }}
              className="flex-1 border-2 border-primary py-4 rounded-xl flex-row justify-center items-center gap-2"
            >
              <MaterialCommunityIcons name="playlist-plus" size={18} color={colors.primary} />
              <Text className="text-primary font-bold text-xs text-center">ADICIONAR AO ROTEIRO</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                const lat = attraction.coordinate?.latitude !== undefined ? attraction.coordinate.latitude : (attraction.latitude || 0);
                const lng = attraction.coordinate?.longitude !== undefined ? attraction.coordinate.longitude : (attraction.longitude || 0);
                const img = attraction.mainImageUrl || attraction.imageUrls?.[0] || 'https://via.placeholder.com/150';

                const attrPayload = {
                  id: attraction.id,
                  category: attraction.category || 'Exploração',
                  title: attraction.name,
                  imageUrl: img,
                  coordinate: {
                    latitude: lat,
                    longitude: lng
                  }
                };
                navigateNow(attrPayload);
                router.push('/dashboard/routes');
              }}
              className="flex-1 bg-primary py-4 rounded-xl flex-row justify-center items-center gap-2"
            >
              <MaterialCommunityIcons name="navigation-variant" size={18} color="white" />
              <Text className="text-white font-bold text-xs text-center">NAVEGAR AGORA</Text>
            </TouchableOpacity>
          </View>

          {/* Grid de Informações Bento */}
          <AttractionInfoGrid
            openingHours={attraction.openingHours}
            priceRange={attraction.priceRange}
          />

          {/* Destaques (O que encontrar) */}
          <AttractionHighlights highlights={attraction.highlights} />

          {/* Dicas da Comunidade */}
          <AttractionCommunityTips reviews={attraction.reviews} />

          {/* Botão de Nova Review */}
          <TouchableOpacity 
            onPress={() => setReviewModalVisible(true)}
            className="mt-6 border border-dashed border-accent/40 bg-accent/5 p-4 rounded-2xl flex-row justify-center items-center gap-2"
          >
            <MaterialCommunityIcons name="plus-circle-outline" size={18} color={colors.accent} />
            <Text className="text-accent font-bold font-sans">Adicionar Nova Dica</Text>
          </TouchableOpacity>
        </View>
      </ExploraScrollView>



      {/* Modal de Nova Review Reutilizável */}
      <ReviewModal 
        visible={reviewModalVisible} 
        onClose={() => setReviewModalVisible(false)} 
        onSubmit={handleAddReview} 
      />
    </View>
  );
};

export default AttractionDetail;