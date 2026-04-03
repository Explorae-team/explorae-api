import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

/**
 * Configuração centralizada do Axios para o Exploraê.
 * O prefixo EXPO_PUBLIC_ permite que o Expo carregue a variável do arquivo .env automaticamente.
 */
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080',
  timeout: 10000,
  // Força o adaptador 'http' em ambiente de teste para evitar conflitos com polyfills de fetch/streams do Expo no Node/Jest
  adapter: process.env.NODE_ENV === 'test' ? 'http' : undefined,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para injetar o token JWT em todas as requisições
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erro ao recuperar token do SecureStore:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para lidar com erros globais (ex: token expirado)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido - poderia disparar um logout global aqui
      console.warn('Sessão expirada. Redirecionando para login...');
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('user_data');
    }
    return Promise.reject(error);
  }
);

export default api;
