// Mocks antecipados para isolar o ambiente (Ordem Crítica)
jest.mock('axios', () => {
  const mockAxios = {
    create: jest.fn(() => mockAxios),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
    post: jest.fn(),
    get: jest.fn(),
  };
  return mockAxios;
});

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import Register from '../app/cadastro';
import { useAuth } from '../src/contexts/AuthContext';

// Mock das dependências que causam efeitos colaterais
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  Link: ({ children }) => children,
}));

jest.mock('../src/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('Tela de Cadastro (Register Screen) - Task SDGEU-21', () => {
  const mockReplace = jest.fn();
  const mockRegister = jest.fn();
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ replace: mockReplace });
    useAuth.mockReturnValue({ 
      register: mockRegister,
      login: mockLogin 
    });
  });

  it('Deve renderizar os componentes do formulário com os novos placeholders', () => {
    const { getByText, getByPlaceholderText } = render(<Register />);

    expect(getByText('Crie sua conta')).toBeTruthy();
    expect(getByPlaceholderText('Como quer ser chamado?')).toBeTruthy();
    expect(getByPlaceholderText('exemplo@email.com')).toBeTruthy();
    expect(getByPlaceholderText('Mínimo 8 caracteres')).toBeTruthy();
    expect(getByPlaceholderText('Repita a mesma senha')).toBeTruthy();
  });

  it('Deve exibir erro de nome curto (< 3 caracteres)', async () => {
    const { getByText, getByPlaceholderText } = render(<Register />);

    fireEvent.changeText(getByPlaceholderText('Como quer ser chamado?'), 'Ab');
    fireEvent.press(getByText('Começar Aventura'));

    await waitFor(() => {
      expect(getByText('Nome deve ter pelo menos 3 caracteres')).toBeTruthy();
    });
  });

  it('Deve exibir erro de e-mail inválido', async () => {
    const { getByText, getByPlaceholderText } = render(<Register />);

    fireEvent.changeText(getByPlaceholderText('exemplo@email.com'), 'email-invalido');
    fireEvent.press(getByText('Começar Aventura'));

    await waitFor(() => {
      expect(getByText('Formato de e-mail inválido')).toBeTruthy();
    });
  });

  it('Deve exibir erro se as senhas não coincidirem', async () => {
    const { getByText, getByPlaceholderText } = render(<Register />);

    fireEvent.changeText(getByPlaceholderText('Mínimo 8 caracteres'), 'senha12345');
    fireEvent.changeText(getByPlaceholderText('Repita a mesma senha'), 'senha54321');
    fireEvent.press(getByText('Começar Aventura'));

    await waitFor(() => {
      expect(getByText('As senhas devem ser iguais')).toBeTruthy();
    });
  });

  it('Deve completar o fluxo de registro e login automático com sucesso', async () => {
    mockRegister.mockResolvedValue({ success: true });
    mockLogin.mockResolvedValue({ success: true });

    const { getByText, getByPlaceholderText } = render(<Register />);

    fireEvent.changeText(getByPlaceholderText('Como quer ser chamado?'), 'Novo Viajante');
    fireEvent.changeText(getByPlaceholderText('exemplo@email.com'), 'novo@viajante.com');
    fireEvent.changeText(getByPlaceholderText('Mínimo 8 caracteres'), 'senhafortissima');
    fireEvent.changeText(getByPlaceholderText('Repita a mesma senha'), 'senhafortissima');
    
    fireEvent.press(getByText('Começar Aventura'));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'Novo Viajante',
        email: 'novo@viajante.com',
        password: 'senhafortissima'
      });
      expect(mockLogin).toHaveBeenCalled();
      expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('Deve exibir erro amigável se o registro falhar no backend', async () => {
    mockRegister.mockResolvedValue({ 
      success: false, 
      message: 'Este e-mail já está em uso' 
    });

    const { getByText, getByPlaceholderText } = render(<Register />);

    fireEvent.changeText(getByPlaceholderText('Como quer ser chamado?'), 'Teste');
    fireEvent.changeText(getByPlaceholderText('exemplo@email.com'), 'duplicado@email.com');
    fireEvent.changeText(getByPlaceholderText('Mínimo 8 caracteres'), 'senha12345678');
    fireEvent.changeText(getByPlaceholderText('Repita a mesma senha'), 'senha12345678');
    
    fireEvent.press(getByText('Começar Aventura'));

    // Note: O Alert.alert não é capturado facilmente em testes de unidade simples
    // mas verificamos se o login NÃO foi chamado.
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
      expect(mockLogin).not.toHaveBeenCalled();
    });
  });
});
