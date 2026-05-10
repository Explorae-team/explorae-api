import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import UserStats from '../../src/components/UserStats';
import { useAuth } from '../../src/contexts/AuthContext';

jest.setTimeout(30000);

// Mock do Contexto de Autenticação
const mockUpdateProfile = jest.fn();
jest.mock('../../src/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock do expo-image-picker
const mockLaunchImageLibraryAsync = jest.fn();
const mockRequestMediaLibraryPermissionsAsync = jest.fn();
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: (...args: any[]) => mockLaunchImageLibraryAsync(...args),
  requestMediaLibraryPermissionsAsync: () => mockRequestMediaLibraryPermissionsAsync(),
  MediaTypeOptions: {
    Images: 'Images',
  },
}), { virtual: true });

// Mock do @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
}), { virtual: true });

// Mock do axios e api
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}));

jest.mock('../../src/services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('UserStats Component', () => {
  const mockUser = {
    name: 'Explorador Teste',
    bio: 'Minha bio de teste',
    level: 5,
    xp: 450,
    levelName: 'Explorador Bronze',
    photoUrl: null
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      updateProfile: mockUpdateProfile,
    });
  });

  it('deve renderizar o nome, bio e levelName corretamente', () => {
    const { getByText } = render(<UserStats />);
    
    expect(getByText('Explorador Teste')).toBeTruthy();
    expect(getByText('Minha bio de teste')).toBeTruthy();
    expect(getByText('Explorador Bronze')).toBeTruthy();
  });

  it('deve entrar em modo de edição ao clicar no ícone de edit e exibir inputs', () => {
    const { getByTestId, queryByText } = render(<UserStats />);
    
    const editButton = getByTestId('edit-button');
    fireEvent.press(editButton);

    expect(getByTestId('name-input')).toBeTruthy();
    expect(getByTestId('bio-input')).toBeTruthy();
    expect(getByTestId('save-button')).toBeTruthy();
    expect(getByTestId('cancel-button')).toBeTruthy();
  });

  it('deve chamar updateProfile ao salvar alterações', async () => {
    mockUpdateProfile.mockResolvedValue({ success: true });
    const { getByTestId } = render(<UserStats />);
    
    fireEvent.press(getByTestId('edit-button'));
    fireEvent.changeText(getByTestId('name-input'), 'Novo Nome');
    fireEvent.changeText(getByTestId('bio-input'), 'Nova Bio');
    fireEvent.press(getByTestId('save-button'));

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith({
        name: 'Novo Nome',
        bio: 'Nova Bio'
      });
    });
  });

  it('deve cancelar edição e restaurar valores originais', () => {
    const { getByTestId, getByText, queryByTestId } = render(<UserStats />);
    
    fireEvent.press(getByTestId('edit-button'));
    fireEvent.changeText(getByTestId('name-input'), 'Nome Sujo');
    fireEvent.press(getByTestId('cancel-button'));

    expect(queryByTestId('name-input')).toBeNull();
    expect(getByText('Explorador Teste')).toBeTruthy();
  });

  it('deve chamar ImagePicker ao clicar no avatar', async () => {
    mockRequestMediaLibraryPermissionsAsync.mockResolvedValue({ status: 'granted' });
    mockLaunchImageLibraryAsync.mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://test-image.jpg' }]
    });

    const { getByTestId } = render(<UserStats />);
    
    const avatar = getByTestId('avatar-touchable');
    fireEvent.press(avatar);

    await waitFor(() => {
      expect(mockRequestMediaLibraryPermissionsAsync).toHaveBeenCalled();
      expect(mockLaunchImageLibraryAsync).toHaveBeenCalled();
    });
  });
});
