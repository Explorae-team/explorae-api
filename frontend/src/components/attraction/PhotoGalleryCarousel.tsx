import React, { useState } from 'react';
import { View, Image, Dimensions, TouchableOpacity, FlatList, Modal, SafeAreaView, Pressable, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface PhotoGalleryCarouselProps {
  images: string[];
}

export default function PhotoGalleryCarousel({ images }: PhotoGalleryCarouselProps) {
  const { width: windowWidth } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  // Caso não tenha imagens, mostrar um placeholder
  const safeImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1590505183015-84906596144e?q=80&w=1000'];

  const onViewableItemsChanged = React.useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const handleImagePress = (index: number) => {
    console.log('Imagem clicada:', index);
    setViewerIndex(index);
    setIsModalVisible(true);
  };

  return (
    <View className="relative h-[530px] w-full bg-[#003646] overflow-hidden">
      <FlatList
        data={safeImages}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        snapToAlignment="center"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        style={{ width: windowWidth }}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => handleImagePress(index)}
            style={{ width: windowWidth, height: 530 }}
          >
            <Image
              source={{ uri: item }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
            />
          </Pressable>
        )}
      />

      <LinearGradient
        colors={['transparent', '#003646']}
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{ pointerEvents: 'none' }}
      />

      {/* Indicadores (Dots) */}
      {safeImages.length > 1 && (
        <View className="absolute bottom-24 flex-row self-center gap-2" style={{ pointerEvents: 'none' }}>
          {safeImages.map((_, index) => (
            <View
              key={index}
              style={{ 
                height: 6,
                borderRadius: 3,
                width: index === currentIndex ? 32 : 8,
                backgroundColor: index === currentIndex ? '#F2641F' : 'rgba(255,255,255,0.3)'
              }}
            />
          ))}
        </View>
      )}

      {/* Modal Customizado para Zoom/Tela Cheia */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 9999 }}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Pressable 
                style={{ position: 'absolute', top: 50, right: 30, zIndex: 10000, padding: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 25 }}
                onPress={() => setIsModalVisible(false)}
              >
                <MaterialCommunityIcons name="close" size={30} color="white" />
              </Pressable>

              <Pressable 
                onPress={() => setIsModalVisible(false)}
                style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
              >
                <Image
                  source={{ uri: safeImages[viewerIndex] }}
                  style={{ width: windowWidth, height: '100%' }}
                  resizeMode="contain"
                />
              </Pressable>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}


