import { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  category: string;
}

export interface Challenge {
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

export function useBadges() {
  const { user, updateUserPreferences } = useAuth() as any;
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      
      // Atualiza o estado do perfil/preferências do usuário atualizado
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
  }, [updateUserPreferences]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchData(true);
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const unlockedBadgeIds = useMemo(() => {
    return new Set<string>((user?.badges || []).map((b: any) => b.id));
  }, [user?.badges]);

  const dailyChallenges = useMemo(() => {
    return challenges.filter(c => c.type === 'DAILY');
  }, [challenges]);

  const weeklyChallenges = useMemo(() => {
    return challenges.filter(c => c.type === 'WEEKLY');
  }, [challenges]);

  const specialChallenges = useMemo(() => {
    return challenges.filter(c => c.type === 'SPECIAL');
  }, [challenges]);

  return {
    allBadges,
    challenges,
    isLoading,
    isRefreshing,
    unlockedBadgeIds,
    dailyChallenges,
    weeklyChallenges,
    specialChallenges,
    refresh,
  };
}
