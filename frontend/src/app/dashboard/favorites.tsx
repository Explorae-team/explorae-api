import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import api from '../../services/api';
import { AttractionCard } from '../../components/dashboard/AttractionCard';
import { useFavorites } from '../../services/useFavorites';
import { useCelebration } from '../../contexts/BadgeCelebrationContext';
import { colors } from '../../constants/colors';
import ExploraScrollView from '../../components/common/ExploraScrollView';

export default function FavoritesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { 
    favorites: attractions, 
    isLoading, 
    error, 
    fetchFavorites, 
    toggleFavorite 
  } = useFavorites();
  const { triggerCelebration } = useCelebration();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchFavorites(true);
    setIsRefreshing(false);
  };

  const handleToggleFavorite = async (id: string) => {
    const result = await toggleFavorite(id);
    if (result && result.unlockedBadges && result.unlockedBadges.length > 0) {
      triggerCelebration(result.unlockedBadges);
    }
  };

  // Grid responsivo: 3 colunas na web e 1 no mobile
  const gridContainerStyle = Platform.OS === 'web'
    ? { flexDirection: 'row' as const, flexWrap: 'wrap' as const, marginHorizontal: -8 }
    : { flexDirection: 'column' as const };

  // Ajusta o tamanho do card conforme a tela
  const cardWrapperStyle = (index: number) => Platform.OS === 'web'
    ? { width: '33.33%' as any, paddingHorizontal: 8, marginBottom: 32 }
    : { marginBottom: 40 };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 24, 
        paddingVertical: 16, 
        borderBottomWidth: 1, 
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
        backgroundColor: colors.background
      }}>
        <Pressable 
          onPress={() => router.back()}
          style={{ padding: 8, borderRadius: 99, backgroundColor: 'rgba(255, 255, 255, 0.05)', marginRight: 16 }}
        >
          <MaterialIcons name="arrow-back" size={20} color={colors.primary} />
        </Pressable>
        <Text style={{ fontSize: 20, fontWeight: '700', color: colors.onBackground }}>
          Meus Favoritos
        </Text>
      </View>

      <ExploraScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 48, paddingTop: 24 }}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
      >
        <View style={{ paddingHorizontal: Platform.OS === 'web' ? 16 : 0 }}>
          {isLoading ? (
            <View style={{ paddingVertical: 120, alignItems: 'center' }}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={{ marginTop: 16, color: colors.onSurfaceVariant, fontSize: 14 }}>Carregando salvos...</Text>
            </View>
          ) : error ? (
            <View style={{ alignItems: 'center', paddingVertical: 80, paddingHorizontal: 40 }}>
              <MaterialIcons name="error-outline" size={48} color={colors.error} />
              <Text style={{ marginTop: 16, color: colors.onSurfaceVariant, fontWeight: '500', textAlign: 'center' }}>
                {error}
              </Text>
              <TouchableOpacity 
                onPress={() => fetchFavorites()}
                style={{ marginTop: 24, backgroundColor: colors.surfaceContainerHigh, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}
              >
                <Text style={{ color: colors.primary, fontWeight: '700' }}>Tentar Novamente</Text>
              </TouchableOpacity>
            </View>
          ) : attractions.length > 0 ? (
            <View style={gridContainerStyle}>
              {attractions.map((attraction, index) => (
                <View key={`${attraction.id}-${index}`} style={cardWrapperStyle(index)}>
                  <View style={Platform.OS !== 'web' ? { paddingHorizontal: 24 } : {}}>
                    <AttractionCard
                      {...attraction}
                      isPopular={index % 4 === 0}
                      isFavorite={true}
                      onFavoritePress={() => handleToggleFavorite(attraction.id)}
                      onPress={() => router.push(`/attraction/${attraction.id}` as any)}
                    />
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 100, paddingHorizontal: 40 }}>
              <MaterialIcons name="favorite-border" size={64} color={colors.primary} style={{ opacity: 0.3, marginBottom: 16 }} />
              <Text style={{ fontSize: 18, fontWeight: '700', color: colors.onBackground, marginBottom: 8, textAlign: 'center' }}>
                Sua lista está vazia
              </Text>
              <Text style={{ fontSize: 14, color: colors.outline, textAlign: 'center', marginBottom: 24, lineHeight: 20 }}>
                Salve as atrações que você mais gostou clicando no ícone de coração na tela de detalhes para visualizá-las aqui.
              </Text>
              <TouchableOpacity 
                onPress={() => router.replace('/dashboard')}
                style={{ backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 999 }}
              >
                <Text style={{ color: 'white', fontWeight: '700', fontSize: 14 }}>Explorar Atrações</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ExploraScrollView>
    </View>
  );
}
