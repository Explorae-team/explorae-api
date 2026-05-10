import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import Register from '../src/app/cadastro';
import { useAuth } from '../src/contexts/AuthContext';

jest.setTimeout(30000);

// Mocks
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

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  Link: ({ children }: any) => children,
  Stack: {
    Screen: () => null
  }
}));

jest.mock('../src/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

describe('Tela de Cadastro (Register Screen)', () => {
  const mockReplace = jest.fn();
  const mockRegister = jest.fn();
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
    (useAuth as jest.Mock).mockReturnValue({ 
      register: mockRegister,
      login: mockLogin 
    });
  });

  it('Deve renderizar os componentes do formulário com os novos placeholders', () => {
    const { getByText, getAllByPlaceholderText, getByPlaceholderText } = render(<Register />);

    expect(getByText('Crie sua conta para começar a aventura!')).toBeTruthy();
    expect(getByPlaceholderText('Seu nome de explorador')).toBeTruthy();
    expect(getByPlaceholderText('email@exemplo.com')).toBeTruthy();
    expect(getAllByPlaceholderText('••••••••')).toHaveLength(2);
  });

  it('Deve exibir erro de nome vazio', async () => {
    const { getByText } = render(<Register />);

    fireEvent.press(getByText('CRIAR CONTA'));

    await waitFor(() => {
      expect(getByText('O nome de explorador é obrigatório')).toBeTruthy();
    });
  });

  it('Deve exibir erro de e-mail inválido', async () => {
    const { getByText, getByPlaceholderText } = render(<Register />);

    fireEvent.changeText(getByPlaceholderText('Seu nome de explorador'), 'Explorador Teste');
    fireEvent.changeText(getByPlaceholderText('email@exemplo.com'), 'email-invalido');
    fireEvent.press(getByText('CRIAR CONTA'));

    await waitFor(() => {
      expect(getByText('E-mail inválido para expedição')).toBeTruthy();
    });
  });

  it('Deve exibir erro se as senhas não coincidirem', async () => {
    const { getByText, getByPlaceholderText, getAllByPlaceholderText } = render(<Register />);

    const passInputs = getAllByPlaceholderText('••••••••');
    fireEvent.changeText(getByPlaceholderText('Seu nome de explorador'), 'Explorador Teste');
    fireEvent.changeText(getByPlaceholderText('email@exemplo.com'), 'teste@explorae.com');
    fireEvent.changeText(passInputs[0], 'senha123');
    fireEvent.changeText(passInputs[1], 'senha456');
    
    fireEvent.press(getByText('CRIAR CONTA'));

    await waitFor(() => {
      expect(getByText('As senhas de expedição não coincidem')).toBeTruthy();
    });
  });

  it('Deve completar o fluxo de registro e redirecionar para login em caso de sucesso', async () => {
    mockRegister.mockResolvedValue({ success: true });

    const { getByText, getByPlaceholderText, getAllByPlaceholderText } = render(<Register />);

    const passInputs = getAllByPlaceholderText('••••••••');
    fireEvent.changeText(getByPlaceholderText('Seu nome de explorador'), 'Novo Viajante');
    fireEvent.changeText(getByPlaceholderText('email@exemplo.com'), 'novo@viajante.com');
    fireEvent.changeText(passInputs[0], 'senha123456');
    fireEvent.changeText(passInputs[1], 'senha123456');
    
    fireEvent.press(getByText(/Aceito os/));
    
    fireEvent.press(getByText('CRIAR CONTA'));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: 'Novo Viajante',
        email: 'novo@viajante.com',
        password: 'senha123456'
      });
      expect(mockReplace).toHaveBeenCalledWith('/login');
    });
  });
});
