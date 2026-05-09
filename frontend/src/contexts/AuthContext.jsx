import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import storage from '../utils/storage';


const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega os dados persistidos no app launch
  useEffect(() => {
    async function loadStoredData() {
      try {
        // Usando o wrapper local
        const storedToken = await storage.getItem('auth_token');
        const storedUser = await storage.getItem('user_data');

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

  const login = async (email, password) => {
    try {
      const response = await api.post('/api/v1/auth/login', { email, password });
      
      // O backend retorna StandardResponseDTO<AuthLoginResponseDTO>
      const { token, user: userData } = response.data.data;

      // Salva de forma persistente e segura
      await storage.setItem('auth_token', token);
      await storage.setItem('user_data', JSON.stringify(userData));

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

  const updateUserPreferences = async () => {
    try {
      const response = await api.get('/api/v1/users/me');
      const userData = response.data.data;
      await storage.setItem('user_data', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };

  const logout = async () => {
    try {
      // Remove de forma segura ao deslogar
      await storage.removeItem('auth_token');
      await storage.removeItem('user_data');
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
      updateUserPreferences,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);