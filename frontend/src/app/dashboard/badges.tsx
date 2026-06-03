import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
  RefreshControl
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { BadgeDetailModal } from '../../components/profile/BadgeDetailModal';
import { ChallengeCard } from '../../components/profile/ChallengeCard';
import { colors } from '../../constants/colors';

const { width } = Dimensions.get('window');
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';

const CATEGORY_COLORS = {
  'ONBOARDING': colors.tertiary,
  'EXPLORACAO': colors.primary,
  'JORNADA': '#ffb598', // Tom salmão/laranja claro
  'SOCIAL': colors.secondary
};

interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  category: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'DAILY' | 'WEEKLY' | 'SPECIAL';
  actionType: string;
  targetValue: number;
  xpReward: number;
  coinsReward: number;
  startDate: string;
  endDate: string;
  currentValue: number;
  completed: boolean;
  completedAt?: string;
}

export default function BadgesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { user, updateUserPreferences } = useAuth() as any;

  const [activeTab, setActiveTab] = useState<'MEDALS' | 'CHALLENGES'>(
    params.tab === 'challenges' ? 'CHALLENGES' : 'MEDALS'
  );
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    type: 'BADGE' | 'CHALLENGE';
    data: any;
    isUnlocked?: boolean;
  } | null>(null);

  const fetchData = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      await updateUserPreferences();

      const [badgesRes, challengesRes] = await Promise.all([
        api.get('/api/v1/badges'),
        api.get('/api/v1/challenges')
      ]);

      if (badgesRes.data?.data) {
        setAllBadges(badgesRes.data.data);
      }
      if (challengesRes.data?.data) {
        setChallenges(challengesRes.data.data);
      }
    } catch (error) {
      console.error('Erro ao buscar dados de conquistas:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const unlockedBadgeIds = new Set((user?.badges || []).map((b: any) => b.id));
  const dailyChallenges = challenges.filter(c => c.type === 'DAILY');
  const weeklyChallenges = challenges.filter(c => c.type === 'WEEKLY');
  const specialChallenges = challenges.filter(c => c.type === 'SPECIAL');

  return (
    <View className="flex-1 bg-background">
      {/* Cabeçalho da tela */}
      <View
        className="flex-row justify-between items-center px-6 pb-4 border-b border-white/5 bg-background/95 z-10"
        style={{ paddingTop: insets.top + 16 }}
      >
        <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full bg-white/5">
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold font-sans">Conquistas & Desafios</Text>
        <View className="w-10 h-10" />
      </View>

      {/* Abas de navegação */}
      <View className="flex-row px-6 py-4 bg-surface-container/40 border-b border-white/5">
        <TouchableOpacity
          onPress={() => setActiveTab('MEDALS')}
          className="flex-1 py-3 rounded-xl items-center flex-row justify-center"
          style={{ backgroundColor: activeTab === 'MEDALS' ? colors.primary : 'transparent' }}
        >
          <Ionicons name="trophy-outline" size={18} color={activeTab === 'MEDALS' ? colors.background : 'white'} />
          <Text
            className="font-bold ml-2 font-sans"
            style={{ color: activeTab === 'MEDALS' ? colors.background : 'white' }}
          >
            Medalhas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('CHALLENGES')}
          className="flex-1 py-3 rounded-xl items-center flex-row justify-center"
          style={{ backgroundColor: activeTab === 'CHALLENGES' ? colors.primary : 'transparent' }}
        >
          <Ionicons name="calendar-outline" size={18} color={activeTab === 'CHALLENGES' ? colors.background : 'white'} />
          <Text
            className="font-bold ml-2 font-sans"
            style={{ color: activeTab === 'CHALLENGES' ? colors.background : 'white' }}
          >
            Desafios
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="text-white/60 mt-4 font-sans">Carregando dados...</Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingVertical: 24, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        >
          {activeTab === 'MEDALS' ? (
            <View>
              {/* Progresso de conquistas da coleção */}
              <LinearGradient
                colors={[colors.surfaceContainer, colors.surfaceContainerLow]}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}
                className="p-5 rounded-2xl border border-white/5"
              >
                <View className="flex-1 pr-4">
                  <Text className="text-white text-lg font-bold mb-1 font-sans">Minha Coleção</Text>
                  <Text className="text-white/60 text-xs font-sans">
                    Você conquistou {unlockedBadgeIds.size} de {allBadges.length} medalhas disponíveis.
                  </Text>
                </View>
                <View className="bg-white/5 w-14 h-14 rounded-full items-center justify-center border border-white/10">
                  <Text className="text-primary text-xl font-bold font-sans">
                    {Math.round((unlockedBadgeIds.size / (allBadges.length || 1)) * 100)}%
                  </Text>
                </View>
              </LinearGradient>

              {/* Grade de medalhas do explorador */}
              <View className="flex-row flex-wrap justify-between">
                {allBadges.map((badge) => {
                  const isUnlocked = unlockedBadgeIds.has(badge.id);
                  const color = (CATEGORY_COLORS as any)[badge.category] || colors.primary;

                  return (
                    <TouchableOpacity
                      key={badge.id}
                      onPress={() => setSelectedItem({ type: 'BADGE', data: badge, isUnlocked })}
                      style={{ width: (width - 64) / 3 }}
                      className="items-center mb-6"
                    >
                      <View
                        className="w-20 h-20 rounded-full bg-surface-container items-center justify-center border-2 mb-2 relative"
                        style={{
                          borderColor: isUnlocked ? color : 'rgba(255,255,255,0.05)',
                          opacity: isUnlocked ? 1 : 0.6,
                          overflow: 'hidden'
                        }}
                      >
                        {badge.iconUrl ? (
                          <Image
                            source={{ uri: badge.iconUrl.startsWith('http') ? badge.iconUrl : `${API_URL}${badge.iconUrl}` }}
                            style={{ 
                              width: '115%', 
                              height: '115%', 
                              opacity: isUnlocked ? 1 : 0.2,
                              borderRadius: 46
                            }}
                            resizeMode="cover"
                          />
                        ) : (
                          <Ionicons name="trophy-outline" size={32} color={isUnlocked ? color : colors.outlineVariant} />
                        )}

                        {!isUnlocked && (
                          <View className="absolute inset-0 bg-black/45 rounded-full items-center justify-center">
                            <Ionicons name="lock-closed" size={18} color="white" />
                          </View>
                        )}
                      </View>

                      <Text
                        numberOfLines={1}
                        className="text-[10px] font-bold text-center tracking-tighter uppercase font-sans w-full"
                        style={{ color: isUnlocked ? 'white' : 'rgba(255,255,255,0.4)' }}
                      >
                        {badge.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ) : (
            <View>
              <Text className="text-white/50 text-xs font-bold uppercase tracking-widest mb-4 font-sans">
                Desafios Diários
              </Text>
              {dailyChallenges.length === 0 ? (
                <View className="bg-surface-container/40 border border-white/5 rounded-2xl p-5 items-center mb-6">
                  <Text className="text-white/60 text-sm font-sans">Nenhum desafio diário ativo no momento.</Text>
                </View>
              ) : (
                dailyChallenges.map(c => (
                  <ChallengeCard
                    key={c.id}
                    challenge={c}
                    onPress={() => setSelectedItem({ type: 'CHALLENGE', data: c })}
                  />
                ))
              )}

              <Text className="text-white/50 text-xs font-bold uppercase tracking-widest mt-4 mb-4 font-sans">
                Desafios Semanais
              </Text>
              {weeklyChallenges.length === 0 ? (
                <View className="bg-surface-container/40 border border-white/5 rounded-2xl p-5 items-center mb-6">
                  <Text className="text-white/60 text-sm font-sans">Nenhum desafio semanal ativo no momento.</Text>
                </View>
              ) : (
                weeklyChallenges.map(c => (
                  <ChallengeCard
                    key={c.id}
                    challenge={c}
                    onPress={() => setSelectedItem({ type: 'CHALLENGE', data: c })}
                  />
                ))
              )}

              {specialChallenges.length > 0 && (
                <>
                  <Text className="text-white/50 text-xs font-bold uppercase tracking-widest mt-4 mb-4 font-sans">
                    Campanhas Especiais
                  </Text>
                  {specialChallenges.map(c => (
                    <ChallengeCard
                      key={c.id}
                      challenge={c}
                      onPress={() => setSelectedItem({ type: 'CHALLENGE', data: c })}
                    />
                  ))}
                </>
              )}
            </View>
          )}
        </ScrollView>
      )}

      {/* Modal de detalhes da conquista selecionada */}
      <BadgeDetailModal
        visible={!!selectedItem}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </View>
  );
}
