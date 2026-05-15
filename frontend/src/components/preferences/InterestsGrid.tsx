import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import InterestCard from './InterestCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import preferenceService from '../../services/preferenceService';

interface Category {
  id: string;
  slug: string;
  name: string;
  iconName: string;
}

interface InterestsGridProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export default function InterestsGrid({ selectedIds, onToggle }: InterestsGridProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    const result = await preferenceService.getCategories();
    if (result.success) {
      setCategories(result.data);
    } else {
      setError("Não conseguimos carregar os interesses agora.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <View className="py-20 items-center justify-center">
        <ActivityIndicator size="large" color="#fd6c28" />
        <Text className="text-[#91bbcf] mt-4 font-medium italic">Carregando catálogo...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="py-10 items-center justify-center bg-red-500/10 rounded-3xl p-6 border border-red-500/20">
        <MaterialCommunityIcons name="alert-circle-outline" size={40} color="#ef4444" />
        <Text className="text-red-400 mt-2 text-center font-medium">{error}</Text>
        <TouchableOpacity 
          onPress={fetchCategories}
          className="mt-4 bg-[#fd6c28] px-6 py-2 rounded-full"
        >
          <Text className="text-white font-bold">Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-row flex-wrap justify-start gap-4 md:gap-6">
      {categories.map((category) => (
        <View 
          key={category.id} 
          className="w-[47%] md:w-[31%] lg:w-[23%]"
        >
          <InterestCard
            label={category.name}
            iconName={category.iconName as any}
            isSelected={selectedIds.includes(category.slug)}
            onPress={() => onToggle(category.slug)}
          />
        </View>
      ))}
    </View>
  );
}
