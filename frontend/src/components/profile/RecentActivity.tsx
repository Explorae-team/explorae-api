import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api from '../../services/api';

export default function RecentActivity() {
  const router = useRouter();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await api.get('/api/v1/users/me/xp-history');
        setActivities(response.data.data || []);
      } catch (error) {
        console.error('Erro ao buscar histórico de XP:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <View className="mt-10 items-center">
        <ActivityIndicator color="#fd6c28" />
      </View>
    );
  }

  if (activities.length === 0) {
    return (
      <View className="mt-10 mb-8">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold tracking-tight text-on-surface">Atividade Recente</Text>
          <TouchableOpacity onPress={() => router.push({ pathname: '/dashboard/badges', params: { tab: 'challenges' } })}>
            <Text className="text-tertiary text-xs font-bold uppercase tracking-widest">Ver Tudo</Text>
          </TouchableOpacity>
        </View>
        <View className="bg-surface-container p-6 rounded-xl border border-on-background/5 items-center">
          <MaterialIcons name="history" size={40} color="#fd6c2820" />
          <Text className="text-on-surface-variant text-center mt-2 font-sans">
            Nenhuma atividade registrada ainda.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mt-10 mb-8">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-xl font-bold tracking-tight text-on-surface">Histórico de Desafios</Text>
        <TouchableOpacity onPress={() => router.push({ pathname: '/dashboard/badges', params: { tab: 'challenges' } })}>
          <Text className="text-tertiary text-xs font-bold uppercase tracking-widest">Ver Tudo</Text>
        </TouchableOpacity>
      </View>
      {activities.map((item) => (
        <View key={item.id} className="bg-surface-container-high rounded-3xl p-4 flex-row items-center mb-4 border border-on-background/5">
          <View className="bg-tertiary/20 w-12 h-12 rounded-2xl items-center justify-center">
            <MaterialIcons name="bolt" size={24} color="#ffba26" />
          </View>
          <View className="flex-1 px-4">
            <Text className="text-on-surface font-bold text-base leading-tight">{item.reason}</Text>
            <View className="flex-row items-center mt-1">
              <MaterialIcons name="event" size={14} color="#a2cde1" />
              <Text className="text-xs font-medium text-on-surface-variant ml-1">
                {new Date(item.createdAt).toLocaleDateString('pt-BR')}
              </Text>
            </View>
          </View>
          <View className="items-end justify-center">
            <View className="flex-row items-center">
              <Text className="text-primary font-black text-base">+{item.amount}</Text>
              <Text className="text-[8px] font-bold text-primary uppercase tracking-tighter ml-1">XP</Text>
            </View>
            {item.coins !== undefined && item.coins !== null && item.coins > 0 && (
              <View className="flex-row items-center mt-1">
                <MaterialIcons name="monetization-on" size={14} color="#ffba26" />
                <Text className="text-[#ffba26] font-bold text-xs ml-1">+{item.coins}</Text>
              </View>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}
