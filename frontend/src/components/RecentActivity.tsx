import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../services/api';

export default function RecentActivity() {
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
        <Text className="text-xl font-bold tracking-tight mb-6 text-on-surface">Atividade Recente</Text>
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
      <Text className="text-xl font-bold tracking-tight mb-6 text-on-surface">Histórico de Conquistas</Text>
      {activities.map((item) => (
        <View key={item.id} className="bg-white rounded-lg p-3 flex-row items-center mb-4 shadow-sm border border-gray-100">
          <View className="bg-tertiary/10 w-12 h-12 rounded-full items-center justify-center">
            <MaterialIcons name="bolt" size={24} color="#ffba26" />
          </View>
          <View className="flex-1 px-4">
            <Text className="text-gray-900 font-bold text-base leading-tight">{item.reason}</Text>
            <View className="flex-row items-center mt-1">
              <MaterialIcons name="event" size={14} color="#666" />
              <Text className="text-xs font-medium text-gray-500 ml-1">
                {new Date(item.createdAt).toLocaleDateString('pt-BR')}
              </Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-orange-600 font-black text-lg">+{item.amount}</Text>
            <Text className="text-[8px] font-bold text-orange-600 uppercase tracking-tighter">XP</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
