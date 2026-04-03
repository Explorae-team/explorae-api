import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import Register from '../app/cadastro';
import { useAuth } from '../src/contexts/AuthContext';

// Mock das dependências principais (Expo Router e AuthContext)
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  Link: ({ children }) => children, // Simplificando o compoente Link
}));

jest.mock('../src/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('Tela de Cadastro (Register Screen)', () => {
  const mockReplace = jest.fn();
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ replace: mockReplace });
    useAuth.mockReturnValue({ login: mockLogin });
  });

  it('Deve renderizar os componentes do formulário corretamente', () => {
    const { getByText, getByPlaceholderText } = render(<Register />);

    expect(getByText('Crie sua conta')).toBeTruthy();
    expect(getByPlaceholderText('Seu nome')).toBeTruthy();
    expect(getByPlaceholderText('exemplo@email.com')).toBeTruthy();
    expect(getByPlaceholderText('Mínimo 6 caracteres')).toBeTruthy();
    expect(getByPlaceholderText('Repita a senha')).toBeTruthy();
  });

  it('Deve exibir bloqueio e erro de nome vazio ou menor que 3 letras', () => {
    const { getByText, getByPlaceholderText } = render(<Register />);

    // Preenche com falha o campo nome
    fireEvent.changeText(getByPlaceholderText('Seu nome'), 'Ab');
    fireEvent.changeText(getByPlaceholderText('exemplo@email.com'), 'teste@email.com');
    fireEvent.changeText(getByPlaceholderText('Mínimo 6 caracteres'), 'senha123');
    fireEvent.changeText(getByPlaceholderText('Repita a senha'), 'senha123');
    
    fireEvent.press(getByText('Cadastrar e Entrar'));

    // Verifica erro visual
    expect(getByText('Nome deve ter pelo menos 3 caracteres')).toBeTruthy();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('Deve exibir bloqueio se o e-mail não pussuir formato válido', () => {
    const { getByText, getByPlaceholderText } = render(<Register />);

    fireEvent.changeText(getByPlaceholderText('Seu nome'), 'Explorador');
    fireEvent.changeText(getByPlaceholderText('exemplo@email.com'), 'email-sem-arroba');
    fireEvent.changeText(getByPlaceholderText('Mínimo 6 caracteres'), 'senha123');
    fireEvent.changeText(getByPlaceholderText('Repita a senha'), 'senha123');
    
    fireEvent.press(getByText('Cadastrar e Entrar'));

    expect(getByText('Formato de e-mail inválido')).toBeTruthy();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('Deve exibir erro caso as senhas digitadas sejam diferentes (Confirmação)', () => {
    const { getByText, getByPlaceholderText } = render(<Register />);

    fireEvent.changeText(getByPlaceholderText('Seu nome'), 'Explorador');
    fireEvent.changeText(getByPlaceholderText('exemplo@email.com'), 'teste@email.com');
    // Digitou as senhas trocadas
    fireEvent.changeText(getByPlaceholderText('Mínimo 6 caracteres'), 'mypass123');
    fireEvent.changeText(getByPlaceholderText('Repita a senha'), 'mypass321');
    
    fireEvent.press(getByText('Cadastrar e Entrar'));

    // Exibe o erro focado na Confirmação que construimos!
    expect(getByText('As senhas devem ser iguais')).toBeTruthy();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('Deve registrar e redirecionar para o /dashboard se os dados forem perfeitos', () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<Register />);

    // Happy Path!
    fireEvent.changeText(getByPlaceholderText('Seu nome'), 'Julio Silva');
    fireEvent.changeText(getByPlaceholderText('exemplo@email.com'), 'julio@email.com');
    fireEvent.changeText(getByPlaceholderText('Mínimo 6 caracteres'), 'minhasenhaforte');
    fireEvent.changeText(getByPlaceholderText('Repita a senha'), 'minhasenhaforte');
    
    fireEvent.press(getByText('Cadastrar e Entrar'));

    // Certifique que NENHUMA string de erro pipocou na tela
    expect(queryByText('As senhas devem ser iguais')).toBeNull();
    expect(queryByText('Nome deve ter pelo menos 3 caracteres')).toBeNull();

    // Verica a ação da base do projeto
    expect(mockLogin).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith('/dashboard');
  });
});
