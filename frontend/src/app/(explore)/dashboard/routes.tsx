import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity, Image,
  ScrollView, Dimensions, Animated, PanResponder, StatusBar,
  Alert, Linking, Platform, ActivityIndicator, useWindowDimensions
} from 'react-native';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import { useRouter, useFocusEffect } from 'expo-router';

// Drag & Drop (usado apenas em mobile)
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Store
import { useRouteStore, Attraction } from '../../../store/useRouteStore';

// Imports condicionais para evitar crash na web
let MapView: any;
let Marker: any;
let Polyline: any; 
let PROVIDER_GOOGLE: any;

if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  Polyline = Maps.Polyline; 
  PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
}

import api from '../../../services/api'; 
import DestinationReachedModal from './DestinationReachedModal';
import { colors } from '../../../constants/colors';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.45;
const SHEET_MIN_HEIGHT = 100;

interface PointCardProps extends Attraction {
  distanceText: string;
  onPress: () => void;
  canCheckIn: boolean;
  onCheckIn: () => void;
  onLongPress?: () => void;
  isActive?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  onRemove: () => void;
}

type TransportMode = 'driving' | 'transit' | 'walking';

// Coordenadas de Fallback (João Pessoa - PB)
const FALLBACK_LOCATION = {
  coords: { latitude: -7.11532, longitude: -34.86105 }
};

// Dicionário de Ícones e Cores por Categoria
const getCategoryStyle = (category: string) => {
  const lowerCat = category.toLowerCase();
  if (lowerCat.includes('gastronomia') || lowerCat.includes('restaurante')) return { icon: 'restaurant', color: '#e63946' };
  if (lowerCat.includes('natureza') || lowerCat.includes('parque') || lowerCat.includes('praia')) return { icon: 'park', color: '#2a9d8f' };
  if (lowerCat.includes('cultura') || lowerCat.includes('arte') || lowerCat.includes('museu')) return { icon: 'palette', color: '#8338ec' };
  if (lowerCat.includes('história') || lowerCat.includes('histórico') || lowerCat.includes('monumento')) return { icon: 'account-balance', color: '#e76f51' };
  
  return { icon: 'place', color: colors.primary }; 
};

const decodePolyline = (t: string) => {
  let points = [];
  let index = 0, lat = 0, lng = 0;
  while (index < t.length) {
    let b, shift = 0, result = 0;
    do { b = t.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lat += ((result & 1) ? ~(result >> 1) : (result >> 1));
    shift = 0; result = 0;
    do { b = t.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lng += ((result & 1) ? ~(result >> 1) : (result >> 1));
    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return points;
};

// 1. Cache fora do componente (memória global da sessão)
const iframeUrlCache = new Map<string, string>();

// Algoritmo Nearest Neighbor para ordenar o restante da fila a partir de uma atração de início
const optimizeRouteQueue = (queue: Attraction[], startAttraction: Attraction): Attraction[] => {
  if (queue.length <= 1) return queue;
  
  const remaining = queue.filter(a => a.id !== startAttraction.id);
  const ordered: Attraction[] = [startAttraction];
  let current = startAttraction;

  while (remaining.length > 0) {
    let nearestIdx = 0;
    let minDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const dist = getDistance(
        { latitude: current.coordinate.latitude, longitude: current.coordinate.longitude },
        { latitude: remaining[i].coordinate.latitude, longitude: remaining[i].coordinate.longitude }
      );
      if (dist < minDist) {
        minDist = dist;
        nearestIdx = i;
      }
    }
    current = remaining[nearestIdx];
    ordered.push(current);
    remaining.splice(nearestIdx, 1);
  }
  return ordered;
};

// Algoritmo Nearest Neighbor para ordenar toda a fila a partir das coordenadas do usuário (GPS)
const optimizeQueueFromLocation = (queue: Attraction[], userLat: number, userLng: number): Attraction[] => {
  if (queue.length === 0) return queue;
  
  const remaining = [...queue];
  const ordered: Attraction[] = [];
  let currentCoords = { latitude: userLat, longitude: userLng };

  while (remaining.length > 0) {
    let nearestIdx = 0;
    let minDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const dist = getDistance(
        currentCoords,
        { latitude: remaining[i].coordinate.latitude, longitude: remaining[i].coordinate.longitude }
      );
      if (dist < minDist) {
        minDist = dist;
        nearestIdx = i;
      }
    }
    const nextAttraction = remaining[nearestIdx];
    ordered.push(nextAttraction);
    currentCoords = { latitude: nextAttraction.coordinate.latitude, longitude: nextAttraction.coordinate.longitude };
    remaining.splice(nearestIdx, 1);
  }
  return ordered;
};

export default function RoutesScreen() {
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { width: windowWidth } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === 'web' && windowWidth >= 768;

  // Zustand Global Store
  const routeQueue = useRouteStore((state) => state.routeQueue);
  const setRouteQueue = useRouteStore((state) => state.setRouteQueue);
  const removeAttraction = useRouteStore((state) => state.removeAttraction);

  const [allAttractions, setAllAttractions] = useState<Attraction[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [userLocation, setUserLocation] = useState<{coords: {latitude: number, longitude: number}} | null>(null);
  const [webUserLocationForMap, setWebUserLocationForMap] = useState<{coords: {latitude: number, longitude: number}} | null>(null);
  const [isLocationFallback, setIsLocationFallback] = useState(false);
  const [canCheckIn, setCanCheckIn] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // O primeiro da fila é sempre o alvo atual principal
  const selectedAttraction = routeQueue.length > 0 ? routeQueue[0] : null;

  // ESTADOS PARA A SPRINT 4
  const [transportMode, setTransportMode] = useState<TransportMode>('driving');
  const [routePolyline, setRoutePolyline] = useState<{latitude: number, longitude: number}[]>([]);
  const [routeMeta, setRouteMeta] = useState({ distance: '', time: '' });

  const mapRef = useRef<any>(null);
  const animatedHeight = useRef(new Animated.Value(SHEET_MIN_HEIGHT)).current;
  const lastDrivenHeight = useRef(SHEET_MIN_HEIGHT);
  const triggeredAttractionId = useRef<string | null>(null);
  const routeHashRef = useRef<string>('');

  // Purga atrações que corromperiam o mapa com coordenadas inválidas (0, 0) (e.g. Null Island)
  useEffect(() => {
    if (routeQueue.length > 0) {
      const validQueue = routeQueue.filter(item => 
        item.coordinate && item.coordinate.latitude !== 0 && item.coordinate.longitude !== 0
      );
      if (validQueue.length !== routeQueue.length) {
        setRouteQueue(validQueue);
      }
    }
  }, [routeQueue, setRouteQueue]);

  // Fetch Data
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      const fetchAttractions = async () => {
        try {
          setIsLoadingData(true);
          const response = await api.get('/api/v1/attractions', {
            params: { fetchAll: true }
          });
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

          if (isMounted) setAllAttractions(mappedData);
        } catch (error) {
          console.error('Erro ao buscar atrações:', error);
          if(Platform.OS !== 'web') Alert.alert('Erro de Conexão', 'Não foi possível carregar os pontos de exploração.');
        } finally {
          if (isMounted) setIsLoadingData(false);
        }
      };

      fetchAttractions();
      return () => { isMounted = false; };
    }, [])
  );

  // Pan Responder Condicional (Mais sensível na Web se for usar)
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

  // Cross-Platform GPS Tracking
  useFocusEffect(
    useCallback(() => {
      let locationSubscription: any = null;
      let isActive = true;
      let watchId: number;
      
      const startTracking = async () => {
        if (Platform.OS === 'web') {
          if ('geolocation' in navigator) {
            const updateLocation = (position: any) => {
              if (isActive) {
                const newLoc = { 
                  coords: { latitude: position.coords.latitude, longitude: position.coords.longitude } 
                };
                setUserLocation(newLoc);
                setIsLocationFallback(false);

                // Evita atualizações constantes na Web se o deslocamento for menor que 80 metros
                setWebUserLocationForMap(prev => {
                  if (!prev) return newLoc;
                  const distance = getDistance(prev.coords, newLoc.coords);
                  if (distance > 80) {
                    return newLoc;
                  }
                  return prev;
                });
              }
            };

            const handleLocationError = (error: any) => {
              console.warn(`Erro GPS Web (${error.code}):`, error.message);
              if (isActive) {
                setUserLocation(FALLBACK_LOCATION);
                setWebUserLocationForMap(FALLBACK_LOCATION);
                setIsLocationFallback(true);
              }
              if (error.code === 1) window.alert("Permissão negada. O mapa será centralizado em João Pessoa por padrão.");
            };

            // Timeout ajustado para 8 segundos para falhar rapidamente em desktops sem GPS
            const geoOptions = { enableHighAccuracy: true, maximumAge: 10000, timeout: 8000 };
            navigator.geolocation.getCurrentPosition(updateLocation, handleLocationError, geoOptions);
            watchId = navigator.geolocation.watchPosition(updateLocation, handleLocationError, geoOptions);
          } else {
            setUserLocation(FALLBACK_LOCATION);
            setWebUserLocationForMap(FALLBACK_LOCATION);
            setIsLocationFallback(true);
            window.alert("Geolocalização não suportada. Exibindo João Pessoa.");
          }
        } else {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permissão negada', 'O mapa será centralizado em João Pessoa por padrão.');
            setUserLocation(FALLBACK_LOCATION);
            setWebUserLocationForMap(FALLBACK_LOCATION);
            setIsLocationFallback(true);
            mapRef.current?.animateToRegion({
              latitude: FALLBACK_LOCATION.coords.latitude,
              longitude: FALLBACK_LOCATION.coords.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }, 1000);
            return;
          }

          if (!isActive) return;

          try {
            let initialLoc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            if (isActive) {
              setUserLocation(initialLoc);
              setWebUserLocationForMap(initialLoc);
              setIsLocationFallback(false);
              mapRef.current?.animateToRegion({
                latitude: initialLoc.coords.latitude,
                longitude: initialLoc.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }, 1000);
            }
          } catch (e) {
            setUserLocation(FALLBACK_LOCATION);
            setWebUserLocationForMap(FALLBACK_LOCATION);
            setIsLocationFallback(true);
          }

          locationSubscription = await Location.watchPositionAsync(
            { accuracy: Location.Accuracy.BestForNavigation, distanceInterval: 1 },
            (newLocation) => {
              if (isActive) {
                setUserLocation(newLocation);
                setWebUserLocationForMap(newLocation);
                setIsLocationFallback(false);
              }
            }
          );
        }
      };

      startTracking();

      return () => {
        isActive = false;
        if (Platform.OS === 'web' && watchId) navigator.geolocation.clearWatch(watchId);
        else if (locationSubscription) locationSubscription.remove();
      };
    }, [])
  );

  // Radar
  useFocusEffect(
    useCallback(() => {
      if (!userLocation || routeQueue.length === 0) return;

      let nearestAttraction: Attraction | null = null;
      let shortestDistance = Infinity;

      // Simplificado: checa se chegou no target atual (primeiro da fila) ou se passou por qualquer outro da fila
      for (const attr of routeQueue) {
        const dist = getDistance(userLocation.coords, attr.coordinate);
        if (dist <= 50 && dist < shortestDistance) {
          shortestDistance = dist;
          nearestAttraction = attr;
        }
      }

      if (nearestAttraction) {
        if (triggeredAttractionId.current !== nearestAttraction.id) {
          triggeredAttractionId.current = nearestAttraction.id;
          
          // Traz a atração alcançada para o topo caso não seja o alvo atual
          if (routeQueue[0].id !== nearestAttraction.id) {
             const filtered = routeQueue.filter(a => a.id !== nearestAttraction?.id);
             setRouteQueue([nearestAttraction, ...filtered]);
          }

          setCanCheckIn(true);
          
          if(Platform.OS !== 'web') {
            mapRef.current?.animateToRegion({
              latitude: nearestAttraction.coordinate.latitude,
              longitude: nearestAttraction.coordinate.longitude,
              latitudeDelta: 0.003,
              longitudeDelta: 0.003,
            }, 800);
          }

          setIsModalVisible(true);
        } else {
          setCanCheckIn(true);
        }
      } else {
        triggeredAttractionId.current = null;
        setCanCheckIn(false);
      }
    }, [userLocation, routeQueue])
  );

  const moveQueueItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newQueue = [...routeQueue];
      [newQueue[index - 1], newQueue[index]] = [newQueue[index], newQueue[index - 1]];
      setRouteQueue(newQueue);
    } else if (direction === 'down' && index < routeQueue.length - 1) {
      const newQueue = [...routeQueue];
      [newQueue[index + 1], newQueue[index]] = [newQueue[index], newQueue[index + 1]];
      setRouteQueue(newQueue);
    }
  };

  // Traçar a Polyline com MÚLTIPLOS Waypoints (Com Memoização via Hash)
  useEffect(() => {
    if (routeQueue.length > 0 && userLocation) {
      const fetchRouteDirections = async () => {
        try {
          const modeMap = { driving: 'car', transit: 'car', walking: 'foot' }; 
          const mode = modeMap[transportMode];
          
          const waypoints = [userLocation.coords, ...routeQueue.map(a => a.coordinate)].filter(c => c && c.latitude !== 0 && c.longitude !== 0);
          if (waypoints.length < 2) throw new Error("Pontos insuficientes para traçar rota");

          // Reduzir precisão para o Hash para evitar loops em pingos pequenos de GPS
          const hashCoords = waypoints.map(w => w.latitude.toFixed(3) + ',' + w.longitude.toFixed(3)).join('|');
          const currentHash = `${mode}-${hashCoords}`;

          if (currentHash === routeHashRef.current && routePolyline.length > 0) {
            return; // Cache hit: Mesma rota, sem chamadas ao OSRM necessárias
          }

          const coordsString = waypoints.map(c => `${c.longitude},${c.latitude}`).join(';');
          const url = `https://router.project-osrm.org/route/v1/${mode}/${coordsString}?overview=full&geometries=polyline`;
          
          const response = await fetch(url);
          const json = await response.json();
          
          if (json.code === 'Ok' && json.routes.length > 0) {
            const route = json.routes[0];
            const points = decodePolyline(route.geometry);
            setRoutePolyline(points);
            routeHashRef.current = currentHash;
            
            const distMeters = route.distance;
            const durSeconds = route.duration;
            
            const distText = distMeters > 1000 ? `${(distMeters/1000).toFixed(1)} km` : `${Math.round(distMeters)} m`;
            const timeText = durSeconds > 3600 ? `${Math.floor(durSeconds/3600)}h ${Math.ceil((durSeconds%3600)/60)}m` : `${Math.ceil(durSeconds/60)} min`;
            
            setRouteMeta({ distance: distText, time: timeText });

            if (Platform.OS !== 'web' && mapRef.current) {
              setTimeout(() => {
                mapRef.current?.fitToCoordinates(points, {
                  edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
                  animated: true,
                });
              }, 300);
            }
          } else {
            throw new Error("Rota não encontrada pelo OSRM");
          }
        } catch (err) {
          console.warn("Falha na API de rotas. Usando fallback de linhas retas.", err);
          const fallbackMock = [userLocation.coords, ...routeQueue.map(a => a.coordinate)];
          setRoutePolyline(fallbackMock);
          setRouteMeta({ distance: '--', time: '--' });
        }
      };

      fetchRouteDirections();
    } else {
      setRoutePolyline([]);
    }
  }, [routeQueue, userLocation, transportMode]);

  const handleNextDestination = () => {
    if (routeQueue.length > 1) {
       const nextQueue = [...routeQueue];
       nextQueue.shift();
       setRouteQueue(nextQueue);
    }
  };

  const handleOpenNativeMaps = () => {
    if (!selectedAttraction) {
      if(Platform.OS !== 'web') Alert.alert("Aviso", "Por favor, selecione um destino no mapa ou na lista primeiro.");
      else window.alert("Por favor, selecione um destino no mapa ou na lista primeiro.");
      return;
    }
    const { latitude, longitude } = selectedAttraction.coordinate;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    if (Platform.OS === 'web') {
      window.open(url, '_blank');
      return;
    }

    Linking.canOpenURL(url).then(supported => {
      if (supported) Linking.openURL(url);
      else {
        Alert.alert("Erro", "Não foi possível abrir o aplicativo de mapas.");
      }
    }).catch(() => {
        Alert.alert("Erro", "Ocorreu um erro ao tentar exportar a rota.");
    });
  };

  const handleStartRoute = async () => {
    if (!selectedAttraction) return;
    
    if (Platform.OS !== 'web') {
      Alert.alert(
        "Rota Iniciada! 🚀", 
        `A sua jornada pelo roteiro planejado começou.\n\nCompletar esta etapa renderá +150 XP!`,
        [{ text: "Bora explorar!" }]
      );
    } else {
      window.alert(`Rota Iniciada! Completar a etapa renderá +150 XP.`);
    }
  };

  const handleCheckInClick = () => {
    if (selectedAttraction && canCheckIn) {
      setIsModalVisible(true);
    }
  };

  const handleConfirmArrival = () => {
    if (selectedAttraction) {
      const filteredList = routeQueue.filter(attr => attr.id !== selectedAttraction.id);
      setRouteQueue(filteredList);
      
      setCanCheckIn(false);
      triggeredAttractionId.current = null;
      setIsModalVisible(false);
      
      }
    }
  };

  const handleOptimizeRoute = () => {
    if (routeQueue.length <= 1) return;
    
    let lat = userLocation?.coords.latitude;
    let lng = userLocation?.coords.longitude;
    
    if (!lat || !lng || isLocationFallback) {
      const first = routeQueue[0];
      const optimized = optimizeRouteQueue(routeQueue, first);
      setRouteQueue(optimized);
      
      const msg = "Roteiro otimizado a partir do seu primeiro destino (GPS indisponível).";
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert("Roteiro Otimizado 🚀", msg);
      return;
    }
    
    const optimized = optimizeQueueFromLocation(routeQueue, lat, lng);
    setRouteQueue(optimized);
    
    const msg = "Organizamos seu roteiro na ordem mais eficiente a partir da sua localização atual!";
    if (Platform.OS === 'web') window.alert(msg);
    else Alert.alert("Roteiro Otimizado 🚀", msg);
  };

  const mapStyleOptions = [
    { "elementType": "geometry", "stylers": [{ "color": "#05232b" }] },
    { "elementType": "labels.text.fill", "stylers": [{ "color": "#ffffff" }, { "weight": 2 }] },
    { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#1e3841" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#00161d" }] }
  ];

  // Componente de Cabeçalho da Lista
  const ListHeader = () => (
    <>
      <View style={[styles.sheetHeader, Platform.OS === 'web' && { marginTop: 20 }]}>
        <Text style={styles.sheetTitle}>Seu roteiro personalizado</Text>
      </View>

      {selectedAttraction && (
        <View style={styles.transportSelectorContainer}>
          <TouchableOpacity 
            style={[styles.transportBtn, transportMode === 'driving' && styles.transportBtnActive]} 
            onPress={() => setTransportMode('driving')}
          >
            <MaterialIcon name="directions-car" size={24} color={transportMode === 'driving' ? colors.primary : '#e1bfb3'} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.transportBtn, transportMode === 'transit' && styles.transportBtnActive]} 
            onPress={() => setTransportMode('transit')}
          >
            <MaterialIcon name="directions-bus" size={24} color={transportMode === 'transit' ? colors.primary : '#e1bfb3'} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.transportBtn, transportMode === 'walking' && styles.transportBtnActive]} 
            onPress={() => setTransportMode('walking')}
          >
            <MaterialIcon name="directions-walk" size={24} color={transportMode === 'walking' ? colors.primary : '#e1bfb3'} />
          </TouchableOpacity>
          
          <View style={styles.routeMetaInfo}>
            <Text style={styles.routeMetaTime}>{routeMeta.time || '--'}</Text>
            <Text style={styles.routeMetaDist}>{routeMeta.distance || '--'}</Text>
          </View>
        </View>
      )}

      <View style={styles.actionButtonGroup}>
        <TouchableOpacity style={styles.primaryActionButton} onPress={handleStartRoute}>
          <MaterialIcon name="play-arrow" size={24} color="#370e00" style={styles.buttonIcon} />
          <Text style={styles.primaryActionText}>Iniciar Rota</Text>
        </TouchableOpacity>
        
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity style={[styles.secondaryActionButton, { flex: 1 }]} onPress={handleNextDestination}>
            <MaterialIcon name="skip-next" size={20} color="#cbe7f2" style={styles.buttonIcon} />
            <Text style={styles.secondaryActionText}>Próximo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.secondaryActionButton, { flex: 1 }]} onPress={handleOpenNativeMaps}>
            <MaterialIcon name="map" size={20} color="#cbe7f2" style={styles.buttonIcon} />
            <Text style={styles.secondaryActionText}>Externo</Text>
          </TouchableOpacity>
        </View>

        {routeQueue.length > 1 && (
          <TouchableOpacity 
            style={[styles.secondaryActionButton, { borderColor: colors.primary, marginTop: 8 }]} 
            onPress={handleOptimizeRoute}
          >
            <MaterialIcon name="auto-fix-high" size={18} color={colors.primary} style={styles.buttonIcon} />
            <Text style={[styles.secondaryActionText, { color: colors.primary }]}>
              Otimizar Roteiro (Inteligente)
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoadingData && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando pontos turísticos...</Text>
        </View>
      )}

      {!isLoadingData && routeQueue.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Seu roteiro está vazio. Selecione locais no mapa ou busque para começar! 🗺️</Text>
        </View>
      )}
    </>
  );

  const renderCardItem = (item: Attraction, index: number, drag?: () => void, isActive?: boolean) => {
    let dynamicDistanceText = "Calculando...";
    if (userLocation) {
      const d = getDistance(userLocation.coords, item.coordinate);
      dynamicDistanceText = d > 1000 ? `${(d / 1000).toFixed(1)} km` : `${d} m`;
    }
    if (selectedAttraction?.id === item.id) {
      dynamicDistanceText = `🎯 Alvo Atual`;
    }

    return (
      <PointCard
        key={item.id}
        {...item}
        distanceText={dynamicDistanceText}
        isActive={isActive || false}
        onPress={() => {
          if (item.id !== selectedAttraction?.id) {
            const optimized = optimizeRouteQueue(routeQueue, item);
            setRouteQueue(optimized);
          }
        }}
        onLongPress={drag}
        canCheckIn={selectedAttraction?.id === item.id && canCheckIn}
        onCheckIn={handleCheckInClick}
        // Para Web:
        onMoveUp={() => moveQueueItem(index, 'up')}
        onMoveDown={() => moveQueueItem(index, 'down')}
        isFirst={index === 0}
        isLast={index === routeQueue.length - 1}
        onRemove={() => removeAttraction(item.id)}
      />
    );
  };

  const renderMapCanvas = () => (
    <View style={styles.mapCanvas}>
      {Platform.OS === 'web' ? (
         <View style={{ flex: 1, backgroundColor: '#05232b', overflow: 'hidden' }}>
           {(() => {
             // ── Monta a chave de cache com IDs das atrações em ordem ──
             const cacheKey = [
               webUserLocationForMap ? `${webUserLocationForMap.coords.latitude.toFixed(3)},${webUserLocationForMap.coords.longitude.toFixed(3)}` : 'noloc',
               transportMode,
               routeQueue.map(a => a.id).join('->'),
             ].join('|');

             // ── Verifica cache antes de recalcular a URL ──
             let iframeUrl = iframeUrlCache.get(cacheKey);

             if (!iframeUrl) {
               if (routeQueue.length > 0 && webUserLocationForMap) {
                 const dirFlag = transportMode === 'walking' ? 'w' : transportMode === 'transit' ? 'r' : 'd';
                 const originStr = `${webUserLocationForMap.coords.latitude.toFixed(4)},${webUserLocationForMap.coords.longitude.toFixed(4)}`;
                 const finalDest = routeQueue[routeQueue.length - 1];
                 const destStr = `${finalDest.coordinate.latitude},${finalDest.coordinate.longitude}`;
                 let waypointsStr = '';
                 if (routeQueue.length > 1) {
                   const intermediate = routeQueue.slice(0, -1);
                   waypointsStr = intermediate.map(a => `+to:${a.coordinate.latitude},${a.coordinate.longitude}`).join('');
                 }
                 iframeUrl = `https://maps.google.com/maps?saddr=${originStr}${waypointsStr}&daddr=${destStr}&dirflg=${dirFlag}&z=14&output=embed`;
               } else if (routeQueue.length > 0) {
                 const first = routeQueue[0];
                 iframeUrl = `https://maps.google.com/maps?q=${first.coordinate.latitude},${first.coordinate.longitude}&z=15&output=embed`;
               } else if (webUserLocationForMap) {
                 iframeUrl = `https://maps.google.com/maps?q=${webUserLocationForMap.coords.latitude},${webUserLocationForMap.coords.longitude}&z=15&output=embed`;
               } else {
                 iframeUrl = `https://maps.google.com/maps?q=Joao+Pessoa&z=12&output=embed`;
               }

               // ── Armazena no cache ──
               iframeUrlCache.set(cacheKey, iframeUrl);
             }

             return (
               <iframe
                 ref={iframeRef as any}
                 src={iframeUrl}
                 width="100%"
                 height="115%"
                 style={{ border: 'none', outline: 'none', marginTop: '-15%', pointerEvents: 'auto' }}
                 allowFullScreen
                 loading="lazy"
               />
             );
           })()}
         </View>
      ) : (
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFill}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          showsUserLocation={true} 
          showsMyLocationButton={false} 
          customMapStyle={mapStyleOptions}
        >
          {routePolyline.length > 0 && (
            <Polyline 
              key={`route-line-${transportMode}`}
              coordinates={routePolyline}
              strokeColor={colors.primary}
              strokeWidth={4}
              lineDashPattern={transportMode === 'walking' ? [10, 10] : undefined}
            />
          )}

          {allAttractions.map((attr) => {
            const { icon, color } = getCategoryStyle(attr.category);
            return (
              <Marker 
                key={attr.id} 
                coordinate={attr.coordinate} 
                onPress={() => {
                  const exists = routeQueue.some(a => a.id === attr.id);
                  if (!exists) {
                    const newQueue = [...routeQueue, attr];
                    if (newQueue.length > 1) {
                      const optimized = optimizeRouteQueue(newQueue, newQueue[0]);
                      setRouteQueue(optimized);
                    } else {
                      setRouteQueue(newQueue);
                    }
                  } else {
                    const optimized = optimizeRouteQueue(routeQueue, attr);
                    setRouteQueue(optimized);
                  }
                }}
              >
                <View style={[styles.markerPulse, { backgroundColor: color, borderColor: 'rgba(255,255,255,0.9)' }]}>
                   <MaterialIcon name={icon as any} size={16} color="#fff" />
                </View>
              </Marker>
            );
          })}
        </MapView>
      )}

      <View style={[styles.topBarContainer, isDesktopWeb && { width: '100%' }]} pointerEvents="box-none">
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.replace('/dashboard')}
        >
          <MaterialIcon name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {isLocationFallback && (
        <View style={[styles.fallbackBanner, isDesktopWeb && { top: 80 }]}>
          <MaterialIcon name="gps-off" size={12} color="#ffba26" style={{ marginRight: 6 }} />
          <Text style={styles.fallbackBannerText}>
            GPS inativo. Exibindo João Pessoa.
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {isDesktopWeb ? (
        // LAYOUT DESKTOP WEB (SPLIT SCREEN)
        <View style={styles.splitScreenContainer}>
          <View style={styles.sidePanel}>
            <ScrollView contentContainerStyle={styles.sidePanelContent} showsVerticalScrollIndicator={false}>
              <ListHeader />
              <View style={{ marginTop: 16 }}>
                {routeQueue.map((item, index) => renderCardItem(item, index))}
              </View>
            </ScrollView>
          </View>
          <View style={styles.mainMapArea}>
            {renderMapCanvas()}
          </View>
        </View>
      ) : (
        // LAYOUT MOBILE (BOTTOM SHEET)
        <>
          {renderMapCanvas()}

          <Animated.View style={[styles.bottomSheet, { height: animatedHeight }]}>
            <View style={styles.dragHandler} {...panResponder.panHandlers}>
              <View style={styles.dragBar} />
            </View>

            {Platform.OS === 'web' ? (
              // Na Web Mobile, usamos ScrollView simples para evitar problemas de Drag
              <ScrollView 
                contentContainerStyle={styles.sheetContent}
                showsVerticalScrollIndicator={false}
              >
                <ListHeader />
                {routeQueue.map((item, index) => renderCardItem(item, index))}
              </ScrollView>
            ) : (
              // No App Nativo, usamos o DraggableFlatList com animações
              <DraggableFlatList
                data={routeQueue}
                onDragEnd={({ data }) => setRouteQueue(data)}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.sheetContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={<ListHeader />}
                renderItem={({ item, drag, isActive, getIndex }) => {
                  const index = getIndex() || 0;
                  return (
                    <ScaleDecorator>
                      {renderCardItem(item, index, drag, isActive)}
                    </ScaleDecorator>
                  );
                }}
              />
            )}
          </Animated.View>
        </>
      )}

      <DestinationReachedModal
        visible={isModalVisible}
        destinationName={selectedAttraction?.title || 'Destino'}
        onClose={() => setIsModalVisible(false)}
        onConfirm={handleConfirmArrival}
      />
    </GestureHandlerRootView>
  );
}

function PointCard({ category, distanceText, title, imageUrl, onPress, onLongPress, isActive, canCheckIn, onCheckIn, onMoveUp, onMoveDown, isFirst, isLast, onRemove }: PointCardProps) {
  const isWeb = Platform.OS === 'web';

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
      {/* Botões de Ordenação na Web */}
      {isWeb && (
        <View style={styles.webSortControls}>
          <TouchableOpacity 
            style={[styles.sortButton, isFirst && { opacity: 0.2 }]} 
            onPress={onMoveUp} 
            disabled={isFirst}
          >
            <MaterialIcon name="keyboard-arrow-up" size={24} color="#e1bfb3" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sortButton, isLast && { opacity: 0.2 }]} 
            onPress={onMoveDown} 
            disabled={isLast}
          >
            <MaterialIcon name="keyboard-arrow-down" size={24} color="#e1bfb3" />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity 
        activeOpacity={0.8} 
        onPress={onPress} 
        onLongPress={onLongPress}
        style={[
          styles.cardContainer,
          isActive && { backgroundColor: 'rgba(55, 14, 0, 0.4)', borderColor: colors.primary, borderWidth: 1, elevation: 8, boxShadow: '0px 4px 8px rgba(0,0,0,0.5)' }
        ]}
      >
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
              {!isWeb && <MaterialIcon name="drag-indicator" size={14} color="#e1bfb3" style={{ marginRight: 4, opacity: 0.5 }} />}
              <Text style={styles.distanceText}>{distanceText}</Text>
              
              <TouchableOpacity 
                onPress={onRemove}
                style={{ marginLeft: 8, padding: 4 }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialIcon name="delete-outline" size={18} color="#ffb4ab" />
              </TouchableOpacity>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#00161d' },
  splitScreenContainer: { flex: 1, flexDirection: 'row' },
  sidePanel: { width: 380, backgroundColor: 'rgba(2, 31, 39, 1)', borderRightWidth: 1, borderRightColor: 'rgba(89, 65, 56, 0.2)', zIndex: 10 },
  sidePanelContent: { paddingHorizontal: 20, paddingBottom: 40 },
  mainMapArea: { flex: 1, position: 'relative' },
  mapCanvas: { flex: 1, backgroundColor: '#05232b' },
  
  topBarContainer: { 
    position: 'absolute', 
    top: Platform.OS === 'ios' ? 60 : 40, 
    left: 0,
    right: 0,
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
  markerPulse: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', elevation: 4, borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.8)' },
  searchResultsContainer: { position: 'absolute', top: 54, left: 0, right: 0, backgroundColor: 'rgba(6, 35, 43, 0.98)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(89, 65, 56, 0.3)', overflow: 'hidden', elevation: 5, zIndex: 100 },
  searchResultItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.05)' },
  searchResultText: { color: '#cbe7f2', fontSize: 14, fontWeight: '600', flex: 1 },
  searchLoading: { padding: 24, alignItems: 'center' },
  searchEmpty: { padding: 24, alignItems: 'center' },
  searchEmptyText: { color: '#e1bfb3', fontSize: 12 },
  
  bottomSheet: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'rgba(2, 31, 39, 0.95)', borderTopLeftRadius: 16, borderTopRightRadius: 16, borderWidth: 1, borderColor: 'rgba(89, 65, 56, 0.1)', zIndex: 60 },
  dragHandler: { width: '100%', paddingVertical: 16, alignItems: 'center', justifyContent: 'center' }, 
  dragBar: { width: 48, height: 6, backgroundColor: 'rgba(89, 65, 56, 0.5)', borderRadius: 3 },
  sheetContent: { paddingHorizontal: 24, paddingBottom: 120 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  sheetTitle: { fontSize: 24, fontWeight: '700', color: '#cbe7f2', letterSpacing: -0.5 },
  transportSelectorContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#06232b', borderRadius: 12, padding: 8, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(89, 65, 56, 0.3)' },
  transportBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 8 },
  transportBtnActive: { backgroundColor: 'rgba(253, 108, 40, 0.15)' },
  routeMetaInfo: { paddingHorizontal: 16, alignItems: 'flex-end', borderLeftWidth: 1, borderLeftColor: 'rgba(89, 65, 56, 0.3)' },
  routeMetaTime: { fontSize: 16, fontWeight: '800', color: '#cbe7f2' },
  routeMetaDist: { fontSize: 12, color: '#e1bfb3', marginTop: 2 },
  actionButtonGroup: { flexDirection: 'column', gap: 12, marginBottom: 24 },
  primaryActionButton: { backgroundColor: '#ffb598', height: 52, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  primaryActionText: { color: '#370e00', fontSize: 16, fontWeight: '700' },
  secondaryActionButton: { backgroundColor: '#1e3841', height: 48, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(89, 65, 56, 0.3)' },
  secondaryActionText: { color: '#cbe7f2', fontSize: 12, fontWeight: '800' },
  buttonIcon: { marginRight: 6 },
  
  webSortControls: { width: 36, alignItems: 'center', justifyContent: 'center', gap: 4, marginRight: 8 },
  sortButton: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(30, 56, 65, 0.5)', borderRadius: 8 },
  
  cardContainer: { flex: 1, height: 128, backgroundColor: '#1e3841', borderRadius: 12, flexDirection: 'row', overflow: 'hidden' },
  imageWrapper: { width: 128, height: '100%', position: 'relative' },
  cardImage: { width: '100%', height: '100%', backgroundColor: '#05232b' },
  xpBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: colors.primary, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 9999 },
  xpBadgeTertiary: { backgroundColor: '#594138' },
  xpText: { fontSize: 10, fontWeight: '800', color: '#370e00' },
  xpTextTertiary: { color: '#cbe7f2' },
  cardDetails: { flex: 1, padding: 12, justifyContent: 'space-between' },
  cardRowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  categoryText: { fontSize: 10, fontWeight: '700', color: '#ffb598', textTransform: 'uppercase', letterSpacing: 1 },
  distanceWrapper: { flexDirection: 'row', alignItems: 'center' },
  distanceText: { fontSize: 12, color: '#e1bfb3' },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#cbe7f2', marginTop: 4 },
  checkInButton: { backgroundColor: '#ffb598', height: 36, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  checkInText: { color: '#370e00', fontSize: 12, fontWeight: '700' },
  
  emptyState: { padding: 24, alignItems: 'center', backgroundColor: 'rgba(30, 56, 65, 0.3)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(89, 65, 56, 0.2)' },
  emptyStateText: { color: '#cbe7f2', fontSize: 14, fontWeight: '600', textAlign: 'center', lineHeight: 20 },
  loadingContainer: { padding: 40, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: 'rgba(203, 231, 242, 0.6)', fontSize: 14, fontWeight: '600' },
  
  fallbackBanner: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 120 : 100,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(8, 35, 43, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255, 186, 38, 0.3)',
    borderRadius: 9999,
    paddingHorizontal: 16,
    paddingVertical: 6,
    zIndex: 45,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.3)',
    elevation: 4,
  },
  fallbackBannerText: {
    color: '#ffba26',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  }
});