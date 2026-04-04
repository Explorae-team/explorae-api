import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import api from '../services/api';

// 1. Definimos o formato dos dados que o Contexto vai fornecer
interface AuthContextData {
  isAuthenticated: boolean;
  user: any; // Você pode trocar 'any' por uma Interface User depois, se quiser ser mais estrito
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (formData: any) => Promise<{ success: boolean; data?: any; message?: string }>;
  logout: () => Promise<void>;
}

// 2. Avisamos ao TypeScript qual é o formato do Contexto
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    function loadStoredData() {
      try {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user_data');

        if (storedToken && storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Erro ao recarregar dados de autenticação:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadStoredData();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/api/v1/auth/login', { email, password });
      
      const { token, user: userData } = response.data.data;

      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(userData));

      setUser(userData);
      return { success: true };
    } catch (error: any) {
      if (true//process.env.NODE_ENV !== 'test'
        ) {
        console.error('Falha no login:', error);
      }
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro de conexão com o servidor' 
      };
    }
  };

  const register = async (formData: any) => {
    try {
      const response = await api.post('/api/v1/auth/register', formData);
      return { success: true, data: response.data.data };
    } catch (error: any) {
      console.error('Falha no cadastro:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao realizar cadastro' 
      };
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      setUser(null);
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: !!user, 
      user, 
      isLoading,
      login, 
      register,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);