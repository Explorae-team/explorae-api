import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
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

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await preferenceService.getCategories();
      if (result.success) {
        setCategories(result.data);
      }
      setLoading(false);
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <View className="py-10 items-center justify-center">
        <ActivityIndicator size="large" color="#fd6c28" />
      </View>
    );
  }

  return (
    <View className="flex-row flex-wrap justify-center gap-4">
      {categories.map((category) => (
        <View key={category.id} style={{ width: 'auto' }}>
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
