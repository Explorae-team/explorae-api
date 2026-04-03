import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega os dados persistidos no app launch
  useEffect(() => {
    async function loadStoredData() {
      try {
        const storedToken = await SecureStore.getItemAsync('auth_token');
        const storedUser = await SecureStore.getItemAsync('user_data');

        if (storedToken && storedUser) {
          // Re-hidrata o estado do usuário
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

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/v1/auth/login', { email, password });
      
      // O backend retorna StandardResponseDTO<AuthLoginResponseDTO>
      const { token, user: userData } = response.data.data;

      // Salva token e user no storage seguro
      await SecureStore.setItemAsync('auth_token', token);
      await SecureStore.setItemAsync('user_data', JSON.stringify(userData));

      setUser(userData);
      return { success: true };
    } catch (error) {
      if (process.env.NODE_ENV !== 'test') {
        console.error('Falha no login:', error);
      }
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro de conexão com o servidor' 
      };
    }
  };

  const register = async (formData) => {
    try {
      // O endpoint de cadastro retorna StandardResponseDTO<UserResponseDTO>
      const response = await api.post('/api/v1/auth/register', formData);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Falha no cadastro:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao realizar cadastro' 
      };
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('user_data');
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
