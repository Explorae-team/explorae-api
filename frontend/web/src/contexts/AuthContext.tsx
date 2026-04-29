import  { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import api from '../services/api';

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextData {
  isAuthenticated: boolean;
  user: any;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (formData: any) => Promise<{ success: boolean; data?: any; message?: string }>; // 
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

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

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await api.post('/api/v1/auth/login', { 
      email: email, 
      password: password 
    });
      const { token, user: userData } = response.data.data;

      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(userData));

      setUser(userData);
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        message: 'Erro de conexão com o servidor' 
      };
    }
  };

  const register = async (formData: any): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      const response = await api.post('/api/v1/auth/register', formData);
      return { success: true, data: response.data.data };
    } catch (error: any) {
      return { 
        success: false, 
        message: 'Erro ao realizar cadastro' 
      };
    }
  };

  const logout = async (): Promise<void> => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
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