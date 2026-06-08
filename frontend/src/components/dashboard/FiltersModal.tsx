import React, { useState } from 'react';
import { View, Text, Modal, Pressable, ScrollView, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

interface FiltersModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters?: FilterState;
}

export interface FilterState {
  distance: number;
  priceRange: number[];
  minRating: number;
  openNow: boolean;
}

const DEFAULT_FILTERS: FilterState = {
  distance: 10,
  priceRange: [],
  minRating: 0,
  openNow: false,
};

export const FiltersModal: React.FC<FiltersModalProps> = ({
  isVisible,
  onClose,
  onApply,
  initialFilters = DEFAULT_FILTERS,
}) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const togglePrice = (price: number) => {
    setFilters(prev => ({
      ...prev,
      priceRange: prev.priceRange.includes(price)
        ? prev.priceRange.filter(p => p !== price)
        : [...prev.priceRange, price]
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/60">
        <View className="bg-surface rounded-t-[40px] h-[85%] border-t border-white/5">
          {/* Header */}
          <View className="flex-row justify-between items-center px-8 py-6 border-b border-white/5">
            <Pressable onPress={onClose} className="p-2">
              <MaterialIcons name="close" size={24} color={colors.primary} />
            </Pressable>
            <Text className="text-lg font-bold text-on-surface">Filtros</Text>
            <Pressable onPress={handleReset}>
              <Text className="text-sm font-bold text-primary">Limpar</Text>
            </Pressable>
          </View>

          <ScrollView className="px-8 pt-8">
            <View className="gap-y-10 pb-20">
              
              {/* Distance Section */}
              <View className="gap-y-4">
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Distância</Text>
                  <Text className="text-primary font-bold">{filters.distance} km</Text>
                </View>
                {/* Custom Slider Placeholder - In a real app use @react-native-community/slider */}
                <View className="h-1 bg-surface-container-high rounded-full overflow-hidden">
                  <View className="h-full bg-primary" style={{ width: `${(filters.distance / 50) * 100}%` }} />
                </View>
                <View className="flex-row justify-between">
                  {[5, 10, 20, 30, 50].map((dist) => (
                    <Pressable 
                      key={dist} 
                      onPress={() => setFilters(prev => ({ ...prev, distance: dist }))}
                      className={`px-3 py-1.5 rounded-full ${filters.distance === dist ? 'bg-primary' : 'bg-surface-container-high'}`}
                    >
                      <Text className={`text-[10px] font-bold ${filters.distance === dist ? 'text-white' : 'text-on-surface-variant'}`}>{dist}km</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Price Section */}
              <View className="gap-y-4">
                <Text className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Faixa de Preço</Text>
                <View className="flex-row gap-x-4">
                  {[1, 2, 3].map((price) => (
                    <Pressable
                      key={price}
                      onPress={() => togglePrice(price)}
                      className={`flex-1 py-4 rounded-2xl border items-center justify-center ${
                        filters.priceRange.includes(price) 
                          ? 'bg-primary/10 border-primary' 
                          : 'bg-surface-container-high border-outline-variant/10'
                      }`}
                    >
                      <Text className={`text-lg font-bold ${filters.priceRange.includes(price) ? 'text-primary' : 'text-on-surface-variant'}`}>
                        {'$'.repeat(price)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Rating Section */}
              <View className="gap-y-4">
                <Text className="text-sm font-bold uppercase tracking-widest text-on-surface-variant">Avaliação Mínima</Text>
                <View className="flex-row justify-between">
                  {[3, 3.5, 4, 4.5].map((rating) => (
                    <Pressable
                      key={rating}
                      onPress={() => setFilters(prev => ({ ...prev, minRating: rating }))}
                      className={`flex-row items-center px-5 py-3 rounded-2xl border ${
                        filters.minRating === rating 
                          ? 'bg-primary/10 border-primary' 
                          : 'bg-surface-container-high border-outline-variant/10'
                      }`}
                    >
                      <MaterialIcons name="star" size={16} color={filters.minRating === rating ? colors.primary : colors.outline} />
                      <Text className={`ml-1 font-bold ${filters.minRating === rating ? 'text-primary' : 'text-on-surface-variant'}`}>
                        {rating}+
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Open Now Section */}
              <View className="flex-row justify-between items-center bg-surface-container-high p-6 rounded-3xl border border-outline-variant/10">
                <View>
                  <Text className="text-on-surface font-bold text-lg">Aberto Agora</Text>
                  <Text className="text-on-surface-variant text-xs mt-1">Mostrar apenas locais funcionando</Text>
                </View>
                <Switch
                  value={filters.openNow}
                  onValueChange={(val) => setFilters(prev => ({ ...prev, openNow: val }))}
                  trackColor={{ false: colors.surfaceContainerHighest, true: colors.primary }}
                  thumbColor={filters.openNow ? '#fff' : colors.outline}
                />
              </View>

            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View className="p-8 border-t border-white/5 bg-surface">
            <Pressable 
              onPress={handleApply}
              className="bg-primary py-5 rounded-2xl shadow-xl shadow-primary/30 active:opacity-90"
            >
              <Text className="text-white text-center font-bold text-lg">APLICAR FILTROS</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};
