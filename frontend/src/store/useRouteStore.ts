import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Attraction {
  id: string;
  category: string;
  title: string;
  imageUrl: string;
  coordinate: { latitude: number; longitude: number };
}

interface RouteStore {
  routeQueue: Attraction[];
  addToRoute: (attraction: Attraction) => void;
  navigateNow: (attraction: Attraction) => void;
  setRouteQueue: (queue: Attraction[]) => void;
  removeAttraction: (id: string) => void;
  clearQueue: () => void;
}

export const useRouteStore = create<RouteStore>()(
  persist(
    (set) => ({
      routeQueue: [],

      addToRoute: (attraction) => set((state) => {
        // Avoid duplicates
        if (state.routeQueue.some(a => a.id === attraction.id)) {
          return state;
        }
        return { routeQueue: [...state.routeQueue, attraction] };
      }),

      navigateNow: (attraction) => set((state) => {
        // Remove if exists to place at the top
        const filteredQueue = state.routeQueue.filter(a => a.id !== attraction.id);
        return { routeQueue: [attraction, ...filteredQueue] };
      }),

      setRouteQueue: (queue) => set({ routeQueue: queue }),

      removeAttraction: (id) => set((state) => ({
        routeQueue: state.routeQueue.filter(a => a.id !== id)
      })),

      clearQueue: () => set({ routeQueue: [] })
    }),
    {
      name: 'explorae-route-storage', // chave única no storage
      storage: createJSONStorage(() => AsyncStorage), // Define AsyncStorage
    }
  )
);
