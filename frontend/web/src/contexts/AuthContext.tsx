import  { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import api from '../services/api';

interface AuthProviderProps {
  children: ReactNode;
}

// 1. Definimos o formato dos dados que o Contexto vai fornecer
interface AuthContextData {
  isAuthenticated: boolean;
  user: any;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (formData: any) => Promise<{ success: boolean; data?: any; message?: string }>; // Verifique se o register está assim
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// 2. Avisamos ao TypeScript qual é o formato do Contexto
export const AuthProvider = ({ children }: AuthProviderProps) => {
  // 1. O estado DEVE estar aqui dentro
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

  // 2. As funções DEVEM estar aqui dentro para "enxergar" o setUser
  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await api.post('/api/v1/auth/login', { 
      email: email, 
      password: password 
    });
      const { token, user: userData } = response.data.data;

      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(userData));

      setUser(userData); // Agora ele vai encontrar o setUser
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro de conexão com o servidor' 
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
        message: error.response?.data?.message || 'Erro ao realizar cadastro' 
      };
    }
  };

  const logout = async (): Promise<void> => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null); // Agora ele vai encontrar o setUser
  };

  // 3. O retorno do componente também fica aqui dentro
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