import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Componentes Reutilizáveis
import PhotoGalleryCarousel from '../../components/attraction/PhotoGalleryCarousel';
import PrimaryButton from '../../components/PrimaryButton';
import api from '../../services/api';

// Sub-componentes Especializados
import AttractionActionHeader from '../../components/attraction/AttractionActionHeader';
import AttractionInfoGrid from '../../components/attraction/AttractionInfoGrid';
import AttractionHighlights from '../../components/attraction/AttractionHighlights';
import AttractionCommunityTips from '../../components/attraction/AttractionCommunityTips';

const AttractionDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [attraction, setAttraction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        onBack={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/dashboard');
          }
        }} 
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
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
        </View>
      </ScrollView>

      {/* Botão de Check-in Flutuante */}
      <View className="absolute bottom-10 left-6 right-6">
        <PrimaryButton 
          title="CHECK-IN NO LOCAL"
          className="bg-[#FFB700] shadow-[#FFB700]/30"
          rightIcon={<MaterialCommunityIcons name="checkbox-marked-circle" size={20} color="#00161e" />}
        />
      </View>
    </View>
  );
};

export default AttractionDetail;