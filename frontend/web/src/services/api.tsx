import axios, { type InternalAxiosRequestConfig, type AxiosResponse, AxiosError } from 'axios';

/**
 * Configuração centralizada do Axios para o Exploraê (Web).
 * No Vite, usamos o prefixo VITE_ para expor variáveis de ambiente do .env.
 */
const api = axios.create({
  // Tenta pegar a variável do Vite, se não achar, usa o localhost do seu backend
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 10000,
  
  // Força o adaptador 'http' em ambiente de teste
  adapter: import.meta.env.MODE === 'test' ? 'http' : undefined,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para injetar o token JWT em todas as requisições
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      // Trocado SecureStore por localStorage (síncrono)
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

// Interceptor para lidar com erros globais (ex: token expirado)
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      console.warn('Sessão expirada. Limpando dados locais...');
      
      // Trocado SecureStore por localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      
      // Dica: Como isso é web pura, se quiser forçar o usuário a ir pro login
      // quando o token do Spring Boot expirar (401), você pode descomentar a linha abaixo:
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const saveInterests = async (interests: string[]) => {
  // O backend espera um TravelPreferenceRequestDTO { interests: string[] }
  const response = await api.put('/api/v1/users/me/preferences', { interests });
  return response.data;
};

export default api;