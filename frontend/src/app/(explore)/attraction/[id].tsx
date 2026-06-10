import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Componentes Reutilizáveis
import PhotoGalleryCarousel from '../../../components/attraction/PhotoGalleryCarousel';
import PrimaryButton from '../../../components/PrimaryButton';
import ExploraScrollView from '../../../components/common/ExploraScrollView';
import { useAttraction } from '../../../hooks/useAttraction';
import { ReviewModal } from '../../../components/attraction/ReviewModal';
import { colors } from '../../../constants/colors';

// Sub-componentes Especializados
import AttractionActionHeader from '../../../components/attraction/AttractionActionHeader';
import AttractionInfoGrid from '../../../components/attraction/AttractionInfoGrid';
import AttractionHighlights from '../../../components/attraction/AttractionHighlights';
import AttractionCommunityTips from '../../../components/attraction/AttractionCommunityTips';

const AttractionDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const {
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
    refresh
  } = useAttraction(id);

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
        onToggleSave={toggleSave}
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
        onRefresh={refresh}
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
            className="mt-6 border border-dashed border-accent/40 bg-accent/5 p-4 rounded-2xl flex-row justify-center items-center gap-2"
          >
            <MaterialCommunityIcons name="plus-circle-outline" size={18} color={colors.accent} />
            <Text className="text-accent font-bold font-sans">Adicionar Nova Dica</Text>
          </TouchableOpacity>
        </View>
      </ExploraScrollView>

      {/* Botão de Check-in Flutuante */}
      <View className="absolute bottom-10 left-6 right-6">
        <PrimaryButton 
          title={isCheckingIn ? "REALIZANDO CHECK-IN..." : "CHECK-IN NO LOCAL"}
          onPress={checkIn}
          disabled={isCheckingIn}
          className="bg-explora-gold shadow-explora-gold/30"
          rightIcon={isCheckingIn ? <ActivityIndicator size="small" color={colors.background} /> : <MaterialCommunityIcons name="checkbox-marked-circle" size={20} color={colors.background} />}
        />
      </View>

      {/* Modal de Nova Review Reutilizável */}
      <ReviewModal 
        visible={reviewModalVisible} 
        onClose={() => setReviewModalVisible(false)} 
        onSubmit={addReview} 
      />
    </View>
  );
};

export default AttractionDetail;