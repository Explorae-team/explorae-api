import React, { useState, useRef, useCallback } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity, Image,
  ScrollView, Dimensions, Animated, PanResponder, StatusBar,
  Alert, Linking, Platform, ActivityIndicator
} from 'react-native';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import { useRouter, useFocusEffect } from 'expo-router';

// IMPORT DA SUA API CONFIGURADA (Ajuste o caminho se necessário)
import api from '../../services/api'; 
import DestinationReachedModal from './DestinationReachedModal';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.45;
const SHEET_MIN_HEIGHT = 100;

interface Attraction {
  id: string;
  category: string;
  title: string;
  imageUrl: string;
  coordinate: { latitude: number; longitude: number };
}

interface PointCardProps extends Attraction {
  distanceText: string;
  onPress: () => void;
  canCheckIn: boolean;
  onCheckIn: () => void;
}

export default function RoutesScreen() {
  const router = useRouter();

  // Estados principais da API e UI
  const [attractionsList, setAttractionsList] = useState<Attraction[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [canCheckIn, setCanCheckIn] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Refs de Controlo
  const mapRef = useRef<MapView>(null);
  const animatedHeight = useRef(new Animated.Value(SHEET_MIN_HEIGHT)).current;
  const lastDrivenHeight = useRef(SHEET_MIN_HEIGHT);
  const triggeredAttractionId = useRef<string | null>(null);

  // REQUISIÇÃO AO BACKEND: Executa sempre que a tela entra em foco
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const fetchAttractions = async () => {
        try {
          setIsLoadingData(true);
          const response = await api.get('/api/v1/attractions');

// CORREÇÃO: Pegamos o array de atrações navegando até a raiz exata do JSON
const attractionsArray = response.data.data.content; 

const mappedData: Attraction[] = attractionsArray.map((item: any) => ({
  id: item.id,
  category: item.category || 'Exploração',
  title: item.name, 
  imageUrl: item.mainImageUrl || 'https://via.placeholder.com/150',
  coordinate: {
    latitude: item.coordinate?.latitude || 0,
    longitude: item.coordinate?.longitude || 0
  }
}));

          if (isMounted) {
            setAttractionsList(mappedData);
          }
        } catch (error) {
          console.error('Erro ao buscar atrações do servidor:', error);
          Alert.alert('Erro de Conexão', 'Não foi possível carregar os pontos de exploração do servidor.');
        } finally {
          if (isMounted) setIsLoadingData(false);
        }
      };

      fetchAttractions();

      return () => {
        isMounted = false;
      };
    }, [])
  );

  // Lógica da Barra Arrastável (Bottom Sheet)
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, gestureState) => Math.abs(gestureState.dy) > 10,
      onPanResponderGrant: () => {
        animatedHeight.setOffset(lastDrivenHeight.current);
        animatedHeight.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => animatedHeight.setValue(-gestureState.dy),
      onPanResponderRelease: (_, gestureState) => {
        animatedHeight.flattenOffset();
        const finalHeight = lastDrivenHeight.current - gestureState.dy;
        if (gestureState.vy < -0.5 || finalHeight > SHEET_MAX_HEIGHT * 0.5) {
          Animated.spring(animatedHeight, { toValue: SHEET_MAX_HEIGHT, useNativeDriver: false }).start();
          lastDrivenHeight.current = SHEET_MAX_HEIGHT;
        } else {
          Animated.spring(animatedHeight, { toValue: SHEET_MIN_HEIGHT, useNativeDriver: false }).start();
          lastDrivenHeight.current = SHEET_MIN_HEIGHT;
        }
      },
    })
  ).current;

  const mapStyleOptions = [
    { "elementType": "geometry", "stylers": [{ "color": "#05232b" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#ffffff" }, { "weight": 2 }] },
    { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#1e3841" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#00161d" }] }
  ];

  // GPS Tracking ativo apenas em foco
  useFocusEffect(
    useCallback(() => {
      let locationSubscription: Location.LocationSubscription | null = null;
      let isActive = true;
      
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão negada', 'Ative o GPS para o app funcionar.');
          return;
        }

        if (!isActive) return;

        let initialLoc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        
        if (isActive) {
          setUserLocation(initialLoc);
          mapRef.current?.animateToRegion({
            latitude: initialLoc.coords.latitude,
            longitude: initialLoc.coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }, 1000);
        }

        locationSubscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.BestForNavigation, distanceInterval: 1 },
          (newLocation) => {
            if (isActive) setUserLocation(newLocation);
          }
        );
      })();

      return () => {
        isActive = false;
        if (locationSubscription) locationSubscription.remove();
      };
    }, [])
  );

  // Radar de proximidade geográfica
  useFocusEffect(
    useCallback(() => {
      if (!userLocation || attractionsList.length === 0) return;

      let nearestAttraction: Attraction | null = null;
      let shortestDistance = Infinity;

      for (const attr of attractionsList) {
        const dist = getDistance(userLocation.coords, attr.coordinate);
        if (dist <= 50 && dist < shortestDistance) {
          shortestDistance = dist;
          nearestAttraction = attr;
        }
      }

      if (nearestAttraction) {
        if (triggeredAttractionId.current !== nearestAttraction.id) {
          triggeredAttractionId.current = nearestAttraction.id;
          setSelectedAttraction(nearestAttraction);
          setCanCheckIn(true);
          
          mapRef.current?.animateToRegion({
            latitude: nearestAttraction.coordinate.latitude,
            longitude: nearestAttraction.coordinate.longitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
          }, 800);

          setIsModalVisible(true);
        } else {
          setCanCheckIn(true);
        }
      } else {
        triggeredAttractionId.current = null;
        setCanCheckIn(false);
      }
    }, [userLocation, attractionsList])
  );

  const handleSelectAttraction = (attraction: Attraction) => {
    setSelectedAttraction(attraction);
    mapRef.current?.animateToRegion({
      latitude: attraction.coordinate.latitude,
      longitude: attraction.coordinate.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    }, 500);
  };

  const handleNextDestination = () => {
    if (attractionsList.length === 0) return;
    let nextIndex = 0;
    if (selectedAttraction) {
      const currentIndex = attractionsList.findIndex(a => a.id === selectedAttraction.id);
      if (currentIndex !== -1) {
        nextIndex = (currentIndex + 1) % attractionsList.length;
      }
    }
    const nextAttr = attractionsList[nextIndex];
    handleSelectAttraction(nextAttr);
  };

  const handleOpenNativeMaps = () => {
    if (!selectedAttraction) {
      Alert.alert("Aviso", "Por favor, selecione um destino no mapa ou na lista primeiro.");
      return;
    }
    const { latitude, longitude } = selectedAttraction.coordinate;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    Linking.canOpenURL(url).then(supported => {
      if (supported) Linking.openURL(url);
      else Alert.alert("Erro", "Não foi possível abrir o aplicativo de mapas.");
    }).catch(() => Alert.alert("Erro", "Ocorreu um erro ao tentar exportar a rota."));
  };

  const handleCheckInClick = () => {
    if (selectedAttraction && canCheckIn) {
      setIsModalVisible(true);
    }
  };

  const handleConfirmArrival = () => {
    if (selectedAttraction) {
      const filteredList = attractionsList.filter(attr => attr.id !== selectedAttraction.id);
      const newList = [...filteredList, selectedAttraction];
      setAttractionsList(newList);
      
      setSelectedAttraction(null);
      setCanCheckIn(false);
      triggeredAttractionId.current = null;
      setIsModalVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.mapCanvas}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true} 
          showsMyLocationButton={false} 
          customMapStyle={mapStyleOptions}
        >
          {attractionsList.map((attr) => (
            <Marker 
              key={attr.id} 
              coordinate={attr.coordinate} 
              onPress={() => handleSelectAttraction(attr)}
            >
              <View style={styles.markerPulse}>
                 <MaterialIcon name="place" size={20} color="#fff" />
              </View>
            </Marker>
          ))}
        </MapView>

        <View style={styles.topBarContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.replace('/dashboard')}
          >
            <MaterialIcon name="arrow-back" size={24} color="#cbe7f2" />
          </TouchableOpacity>

          <View style={styles.searchBar}>
            <MaterialIcon name="search" size={20} color="#e1bfb3" />
            <TextInput style={styles.searchInput} placeholder="Onde vamos explorar?" placeholderTextColor="#e1bfb3" />
            <MaterialIcon name="mic" size={20} color="#e1bfb3" />
          </View>
        </View>
      </View>

      <Animated.View style={[styles.bottomSheet, { height: animatedHeight }]}>
        <View style={styles.dragHandler} {...panResponder.panHandlers}>
          <View style={styles.dragBar} />
        </View>

        <ScrollView contentContainerStyle={styles.sheetContent} showsVerticalScrollIndicator={false}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Seu roteiro personalizado</Text>
          </View>

          <View style={styles.actionButtonGroup}>
            <TouchableOpacity style={styles.primaryActionButton} onPress={handleNextDestination}>
              <MaterialIcon name="near-me" size={20} color="#370e00" style={styles.buttonIcon} />
              <Text style={styles.primaryActionText}>Ir para próximo destino</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryActionButton} onPress={handleOpenNativeMaps}>
              <MaterialIcon name="map" size={20} color="#cbe7f2" style={styles.buttonIcon} />
              <Text style={styles.secondaryActionText}>Abrir Rota no App Maps</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardsContainer}>
            {isLoadingData ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#fd6c28" />
                <Text style={styles.loadingText}>Carregando pontos turísticos...</Text>
              </View>
            ) : (
              attractionsList.map((item) => {
                let dynamicDistanceText = "Calculando...";
                if (userLocation) {
                  const d = getDistance(userLocation.coords, item.coordinate);
                  dynamicDistanceText = d > 1000 ? `${(d / 1000).toFixed(1)} km` : `${d} m`;
                }
                if (selectedAttraction?.id === item.id) {
                  dynamicDistanceText = `🎯 Alvo: ${dynamicDistanceText}`;
                }

                return (
                  <PointCard
                    key={item.id}
                    {...item}
                    distanceText={dynamicDistanceText} 
                    onPress={() => handleSelectAttraction(item)}
                    canCheckIn={selectedAttraction?.id === item.id && canCheckIn}
                    onCheckIn={handleCheckInClick}
                  />
                );
              })
            )}
            
            {!isLoadingData && attractionsList.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>Nenhum local disponível na rota. 🎉</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </Animated.View>

      <DestinationReachedModal
        visible={isModalVisible}
        destinationName={selectedAttraction?.title || 'Destino'}
        onClose={() => setIsModalVisible(false)}
        onConfirm={handleConfirmArrival}
      />
    </View>
  );
}

function PointCard({ category, distanceText, title, imageUrl, onPress, canCheckIn, onCheckIn }: PointCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.cardContainer}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: imageUrl }} style={styles.cardImage} />
        <View style={[styles.xpBadge, category === 'Longe' && styles.xpBadgeTertiary]}>
          <Text style={[styles.xpText, category === 'Longe' && styles.xpTextTertiary]}>+100 XP</Text>
        </View>
      </View>
      
      <View style={styles.cardDetails}>
        <View style={styles.cardRowTop}>
          <Text style={styles.categoryText}>{category}</Text>
          <View style={styles.distanceWrapper}>
            <MaterialIcon name="navigation" size={10} color="#e1bfb3" style={styles.distanceIcon} />
            <Text style={styles.distanceText}>{distanceText}</Text>
          </View>
        </View>
        <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
        
        <TouchableOpacity 
          style={[styles.checkInButton, !canCheckIn && { opacity: 0.5, backgroundColor: '#594138' }]} 
          disabled={!canCheckIn}
          onPress={onCheckIn}
        >
          <MaterialIcon name="location-on" size={14} color={canCheckIn ? "#370e00" : "#cbe7f2"} style={styles.buttonIcon} />
          <Text style={[styles.checkInText, !canCheckIn && { color: '#cbe7f2' }]}>
            {canCheckIn ? "Fazer Check-in!" : "Muito longe"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#00161d' },
  mapCanvas: { flex: 1, backgroundColor: '#05232b' },
  topBarContainer: { 
    position: 'absolute', 
    top: Platform.OS === 'ios' ? 60 : 40, 
    width: SCREEN_WIDTH, 
    paddingHorizontal: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    zIndex: 40 
  },
  backButton: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(6, 35, 43, 0.9)',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(89, 65, 56, 0.2)',
  },
  searchBar: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(6, 35, 43, 0.9)', borderRadius: 9999, height: 48, paddingHorizontal: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(89, 65, 56, 0.2)' },
  searchInput: { flex: 1, paddingHorizontal: 8, color: '#cbe7f2', fontSize: 14 },
  markerPulse: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#fd6c28', justifyContent: 'center', alignItems: 'center', elevation: 4, borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.8)' },
  bottomSheet: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'rgba(2, 31, 39, 0.95)', borderTopLeftRadius: 16, borderTopRightRadius: 16, borderWidth: 1, borderColor: 'rgba(89, 65, 56, 0.1)', zIndex: 60 },
  dragHandler: { width: '100%', paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  dragBar: { width: 48, height: 6, backgroundColor: 'rgba(89, 65, 56, 0.5)', borderRadius: 3 },
  sheetContent: { paddingHorizontal: 24, paddingBottom: 120 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  sheetTitle: { fontSize: 24, fontWeight: '700', color: '#cbe7f2', letterSpacing: -0.5 },
  actionButtonGroup: { flexDirection: 'column', gap: 12, marginBottom: 24 },
  primaryActionButton: { backgroundColor: '#ffb598', height: 52, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  primaryActionText: { color: '#370e00', fontSize: 16, fontWeight: '700' },
  secondaryActionButton: { backgroundColor: '#1e3841', height: 48, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(89, 65, 56, 0.3)' },
  secondaryActionText: { color: '#cbe7f2', fontSize: 12, fontWeight: '800' },
  buttonIcon: { marginRight: 6 },
  cardsContainer: { gap: 12 },
  cardContainer: { height: 128, backgroundColor: '#1e3841', borderRadius: 12, flexDirection: 'row', overflow: 'hidden' },
  imageWrapper: { width: 128, height: '100%', position: 'relative' },
  cardImage: { width: '100%', height: '100%', backgroundColor: '#05232b' },
  xpBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#fd6c28', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 9999 },
  xpBadgeTertiary: { backgroundColor: '#594138' },
  xpText: { fontSize: 10, fontWeight: '800', color: '#370e00' },
  xpTextTertiary: { color: '#cbe7f2' },
  cardDetails: { flex: 1, padding: 12, justifyContent: 'space-between' },
  cardRowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryText: { fontSize: 10, fontWeight: '700', color: '#ffb598', textTransform: 'uppercase', letterSpacing: 1 },
  distanceWrapper: { flexDirection: 'row', alignItems: 'center' },
  distanceIcon: { transform: [{ rotate: '45deg' }], marginRight: 2 },
  distanceText: { fontSize: 12, color: '#e1bfb3' },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#cbe7f2', marginTop: 4 },
  checkInButton: { backgroundColor: '#ffb598', height: 36, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  checkInText: { color: '#370e00', fontSize: 12, fontWeight: '700' },
  emptyState: { padding: 24, alignItems: 'center' },
  emptyStateText: { color: '#cbe7f2', fontSize: 16, fontWeight: '600' },
  loadingContainer: { padding: 40, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: 'rgba(203, 231, 242, 0.6)', fontSize: 14, fontWeight: '600' }
});