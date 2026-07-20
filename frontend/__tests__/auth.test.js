// Mocks das bibliotecas externas primeiro (Ordem Crítica)
jest.mock('axios', () => {
  const mockAxios = {
    create: jest.fn(() => mockAxios),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };
  return mockAxios;
});

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import * as SecureStore from 'expo-secure-store';

// Mock do nosso serviço de api (importado após o axios ser mockado)
jest.mock('../src/services/api');
import api from '../src/services/api';

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe('AuthContext Integration (SDGEU-21)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve iniciar com estado não autenticado e carregando', async () => {
    SecureStore.getItemAsync.mockResolvedValue(null);
    
    const { result } = renderHook(() => useAuth(), { wrapper });

    // No início está carregando
    expect(result.current.isLoading).toBe(true);
    
    // Aguarda o useEffect de carregamento
    await act(async () => {});

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.isLoading).toBe(false);
  });

  it('deve realizar login com sucesso e persistir dados', async () => {
    const mockUser = { id: 1, name: 'Teste', email: 'teste@explorae.com.br' };
    const mockToken = 'fake-jwt-token';
    
    api.post.mockResolvedValue({
      data: {
        data: {
          token: mockToken,
          user: mockUser
        }
      }
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const loginResult = await result.current.login('teste@explorae.com.br', 'senha123');
      expect(loginResult.success).toBe(true);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    
    // Verifica persistência
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_token', mockToken);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('user_data', JSON.stringify(mockUser));
  });

  it('deve lidar com falha no login', async () => {
    api.post.mockRejectedValue({
      response: {
        data: {
          message: 'Credenciais inválidas'
        }
      }
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const loginResult = await result.current.login('teste@explorae.com.br', 'senha-errada');
      expect(loginResult.success).toBe(false);
      expect(loginResult.message).toBe('Credenciais inválidas');
    });

    expect(result.current.isAuthenticated).toBe(false);
  });

  it('deve carregar dados do SecureStore ao iniciar', async () => {
    const mockUser = { id: 1, name: 'Teste Persistido' };
    const mockToken = 'token-persistido';
    
    SecureStore.getItemAsync.mockImplementation((key) => {
      if (key === 'auth_token') return Promise.resolve(mockToken);
      if (key === 'user_data') return Promise.resolve(JSON.stringify(mockUser));
      return Promise.resolve(null);
    });
    
    api.get.mockResolvedValue({
      data: {
        data: mockUser
      }
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      // Espera o useEffect rodar
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('deve limpar storage no logout', async () => {
    SecureStore.getItemAsync.mockResolvedValue(null);
    
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.logout();
    });

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_token');
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('user_data');
    expect(result.current.user).toBe(null);
  });
});
