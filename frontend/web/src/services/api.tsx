import axios, { type InternalAxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios';

/**
 * Configuração centralizada do Axios para o Exploraê (Web).
 * No Vite, usamos o prefixo VITE_ para expor variáveis de ambiente do .env.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 10000,
  
  adapter: import.meta.env.MODE === 'test' ? 'http' : undefined,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erro ao recuperar token do localStorage:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      console.warn('Sessão expirada. Limpando dados locais...');
      
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');

    }
    return Promise.reject(error);
  }
);

export const saveInterests = async (interests: string[]) => {
  const response = await api.put('/api/v1/users/me/preferences', { interests });
  return response.data;
};

export default api;