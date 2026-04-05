import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../app/login';
import { AuthProvider } from '../src/contexts/AuthContext';
import { useRouter } from 'expo-router';

// Mock do useRouter
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock do Contexto de Autenticação se necessário, mas aqui usaremos o Provider real ou mockado conforme a necessidade
const mockLogin = jest.fn();
jest.mock('../src/contexts/AuthContext', () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}));

describe('LoginScreen', () => {
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
    });
  });

  it('deve exibir erros de validação quando campos estão vazios', async () => {
    const { getByText } = render(<LoginScreen />);
    
    const loginButton = getByText('Inicia Jornada');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(getByText('E-mail é obrigatório')).toBeTruthy();
      expect(getByText('Senha é obrigatória')).toBeTruthy();
    });
  });

  it('deve chamar a função de login e redirecionar em caso de sucesso', async () => {
    mockLogin.mockResolvedValue({ success: true });
    
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    const emailInput = getByPlaceholderText('seu@dominio.com');
    const passwordInput = getByPlaceholderText('••••••••');
    const loginButton = getByText('Inicia Jornada');

    fireEvent.changeText(emailInput, 'test@explorae.com');
    fireEvent.changeText(passwordInput, 'senha123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@explorae.com', 'senha123');
      expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('deve exibir erro geral quando o login falha', async () => {
    mockLogin.mockResolvedValue({ success: false, message: 'Credenciais inválidas' });
    
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    fireEvent.changeText(getByPlaceholderText('seu@dominio.com'), 'wrong@test.com');
    fireEvent.changeText(getByPlaceholderText('••••••••'), 'wrongpass');
    fireEvent.press(getByText('Inicia Jornada'));

    await waitFor(() => {
      expect(getByText('Credenciais inválidas')).toBeTruthy();
    });
  });
});
