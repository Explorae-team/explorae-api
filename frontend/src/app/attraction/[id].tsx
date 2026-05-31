import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Vibration, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Componentes Reutilizáveis
import PhotoGalleryCarousel from '../../components/attraction/PhotoGalleryCarousel';
import PrimaryButton from '../../components/PrimaryButton';
import api from '../../services/api';
import { useCelebration } from '../../contexts/BadgeCelebrationContext';
import { ReviewModal } from '../../components/attraction/ReviewModal';

// Sub-componentes Especializados
import AttractionActionHeader from '../../components/attraction/AttractionActionHeader';
import AttractionInfoGrid from '../../components/attraction/AttractionInfoGrid';
import AttractionHighlights from '../../components/attraction/AttractionHighlights';
import AttractionCommunityTips from '../../components/attraction/AttractionCommunityTips';

const AttractionDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { triggerCelebration } = useCelebration();

  const [attraction, setAttraction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Controle do modal de avaliação
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isSavingAttraction, setIsSavingAttraction] = useState(false);

  useEffect(() => {
    const fetchAttraction = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await api.get(`/api/v1/attractions/${id}`);
        setAttraction(response.data?.data);
      } catch (err: any) {
        console.error('Erro ao buscar detalhes da atração:', err);
        setError('Não foi possível carregar as informações desta atração.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttraction();
  }, [id]);

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
        alert('Check-in realizado com sucesso! Compartilhe sua dica com a galera.');
      }
      
      // Abre automaticamente o modal de dica pós check-in
      setReviewModalVisible(true);
    } catch (err) {
      console.error('Erro ao realizar check-in:', err);
      Vibration.vibrate([100, 100, 100]); // Vibrar erro
      alert('Não foi possível realizar o check-in no momento.');
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
        alert(newSavedState ? 'Atração salva nos favoritos!' : 'Atração removida dos favoritos!');
      }
    } catch (err) {
      console.error('Erro ao favoritar/salvar atração:', err);
      alert('Não foi possível salvar a atração no momento.');
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
        alert('Obrigado pela sua avaliação!');
      }
    } catch (err) {
      console.error('Erro ao adicionar avaliação:', err);
      alert('Não foi possível enviar sua avaliação no momento.');
      throw err; // Propaga para o modal tratar o estado interno de envio
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#003646] justify-center items-center">
        <ActivityIndicator size="large" color="#F2641F" />
        <Text className="text-white mt-4 font-bold">Carregando detalhes...</Text>
      </View>
    );
  }

  if (error || !attraction) {
    return (
      <View className="flex-1 bg-[#003646] justify-center items-center px-6">
        <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#F2641F" />
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
    <View className="flex-1 bg-[#003646]">
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

      <ScrollView contentContainerStyle={{ paddingBottom: 220 }} showsVerticalScrollIndicator={false}>
        {/* Galeria de Fotos */}
        <PhotoGalleryCarousel images={attraction.imageUrls || []} />

        {/* Canvas de Conteúdo */}
        <View className="px-6 -mt-20">
          {/* Tags e Info de Status */}
          <View className="flex-row items-center gap-2 mb-2">
            <View className="bg-[#FFB700]/20 px-3 py-1 rounded-full">
              <Text className="text-[#FFB700] text-[10px] font-bold uppercase">{attraction.category || 'Atração'}</Text>
            </View>
            <View className="flex-row items-center gap-1 bg-[#0d3e4e]/80 px-2 py-1 rounded-lg">
              <MaterialCommunityIcons name="star" size={14} color="#FFB700" />
              <Text className="text-white text-sm font-bold">
                {attraction.averageRating ? attraction.averageRating.toFixed(1) : '0.0'}
              </Text>
            </View>
            {attraction.isPartner && (
              <View className="bg-green-500/20 px-2 py-1 rounded-lg flex-row items-center gap-1">
                <MaterialCommunityIcons name="check-decagram" size={12} color="#4ade80" />
                <Text className="text-[#4ade80] text-[10px] font-bold">PARCEIRO</Text>
              </View>
            )}
          </View>

          {/* Nome e Descrição */}
          <Text className="text-4xl font-black text-[#bde9fe] mb-2">{attraction.name}</Text>
          <Text className="text-[#bde9fe]/90 text-sm leading-6">
            {attraction.longDescription || attraction.shortDescription}
          </Text>

          {/* Ação Principal: Rota */}
          <PrimaryButton
            title="TRAÇAR ROTA"
            className="mt-8"
            rightIcon={<MaterialCommunityIcons name="navigation-variant" size={24} color="white" />}
          />

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
            className="mt-6 border border-dashed border-[#F2641F]/40 bg-[#F2641F]/5 p-4 rounded-2xl flex-row justify-center items-center gap-2"
          >
            <MaterialCommunityIcons name="plus-circle-outline" size={18} color="#F2641F" />
            <Text className="text-[#F2641F] font-bold font-sans">Adicionar Nova Dica</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Botão de Check-in Flutuante */}
      <View className="absolute bottom-10 left-6 right-6">
        <PrimaryButton 
          title={isCheckingIn ? "REALIZANDO CHECK-IN..." : "CHECK-IN NO LOCAL"}
          onPress={handleCheckIn}
          disabled={isCheckingIn}
          className="bg-[#FFB700] shadow-[#FFB700]/30"
          rightIcon={isCheckingIn ? <ActivityIndicator size="small" color="#00161e" /> : <MaterialCommunityIcons name="checkbox-marked-circle" size={20} color="#00161e" />}
        />
      </View>

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