import React from 'react';
import { View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useAuth } from '../../contexts/AuthContext';

export default function StatsGrid() {
  const { user } = useAuth() as any;
  const xp = user?.xp || 0;
  const coins = user?.coins || 0;

  const getTierColor = (xp: number) => {
    if (xp < 1000) return '#CD7F32';
    if (xp < 2000) return '#C0C0C0';
    if (xp < 3000) return '#FFD700';
    return '#40E0D0';
  };

  const tierColor = getTierColor(xp);

  const stats = [
    { 
      icon: 'payments', 
      count: coins.toLocaleString(), 
      label: 'ExploraCoins', 
      sub: 'Ir para a Loja',
      color: '#FFD700' // Moedas sempre douradas
    },
    { 
      icon: 'location-on', 
      count: (user?.checkInCount || 0).toString(), 
      label: 'Check-ins', 
      sub: 'Locais visitados',
      color: tierColor
    },
    { 
      icon: 'map', 
      count: '5', 
      label: 'Rotas', 
      sub: 'Em progresso',
      color: tierColor
    },
    { 
      icon: 'bolt', 
      count: (user?.activeChallengesCount || 0).toString(), 
      label: 'Quests', 
      sub: 'Desafios ativos',
      color: '#40E0D0' // Quests azul turquesa/raio
    },
  ];

  return (
    <View className="mt-10 flex-row flex-wrap justify-between">
      {stats.map((stat, idx) => (
        <View 
          key={idx} 
          testID={`stat-card-${idx}`}
          className="bg-surface-container-high p-5 rounded-[24px] w-[48%] mb-4 items-start border border-on-background/5"
        >
          <View 
            testID={`stat-icon-container-${idx}`}
            className="w-10 h-10 rounded-xl items-center justify-center mb-3"
            style={{ backgroundColor: `${stat.color}20` }}
          >
            <MaterialIcons name={stat.icon as any} size={22} color={stat.color} />
          </View>
          <Text className="text-2xl font-black text-on-surface tracking-tighter">{stat.count}</Text>
          <Text className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">{stat.label}</Text>
          
          <View className="mt-3 py-1 px-2 bg-on-background/5 rounded-md flex-row items-center">
             <Text className="text-[9px] font-bold text-on-surface-variant/70 uppercase">{stat.sub}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
