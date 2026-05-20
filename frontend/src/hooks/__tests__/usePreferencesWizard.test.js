import { renderHook, act, waitFor } from '@testing-library/react-native';
import { usePreferencesWizard } from '../usePreferencesWizard';
import preferenceService from '../../services/preferenceService';
import { Alert } from 'react-native';

// Mocks
jest.mock('../../services/preferenceService', () => ({
  getCategories: jest.fn(),
  getPreferences: jest.fn(),
  updatePreferences: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: jest.fn(),
    replace: jest.fn(),
    push: jest.fn(),
  }),
}));

const mockCategories = [
  { id: '1', slug: 'restaurantes', name: 'Restaurantes', parentCategory: 'gastronomia' },
  { id: '2', slug: 'museus', name: 'Museus', parentCategory: 'cultura' },
  { id: '3', slug: 'trilhas', name: 'Trilhas', parentCategory: 'aventura' },
];

describe('usePreferencesWizard Hook', () => {
  const logoutMock = jest.fn();
  const updateUserPreferencesMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    preferenceService.getCategories.mockResolvedValue({
      success: true,
      data: mockCategories,
    });
  });

  it('deve carregar as categorias no mount', async () => {
    const { result } = renderHook(() =>
      usePreferencesWizard(null, logoutMock, updateUserPreferencesMock, false)
    );

    await waitFor(() => {
      expect(result.current.categories).toHaveLength(mockCategories.length);
    });
  });

  it('deve bloquear a navegação para o próximo passo se não houver interesses selecionados no pilar ativo', async () => {
    const { result } = renderHook(() =>
      usePreferencesWizard(null, logoutMock, updateUserPreferencesMock, false)
    );

    await waitFor(() => {
      expect(result.current.categories).toHaveLength(mockCategories.length);
    });

    // Passo atual: 0 (gastronomia). selectedIds: [] (vazio)
    act(() => {
      result.current.handleNext();
    });

    // O passo não deve mudar
    expect(result.current.currentStep).toBe(0);
    // Deve exibir alerta
    expect(Alert.alert).toHaveBeenCalledWith(
      'Exploração sob Medida',
      'Por favor, selecione pelo menos um interesse nesta categoria para continuarmos a montar suas recomendações.'
    );
  });

  it('deve permitir a navegação se houver ao menos um interesse selecionado para o pilar ativo', async () => {
    const { result } = renderHook(() =>
      usePreferencesWizard(null, logoutMock, updateUserPreferencesMock, false)
    );

    await waitFor(() => {
      expect(result.current.categories).toHaveLength(mockCategories.length);
    });

    // Seleciona um interesse de gastronomia ('restaurantes')
    act(() => {
      result.current.handleToggleInterest('restaurantes');
    });

    expect(result.current.selectedIds).toContain('restaurantes');

    // Avança para o próximo passo
    act(() => {
      result.current.handleNext();
    });

    // O passo atual deve mudar para 1 (cultura)
    expect(result.current.currentStep).toBe(1);
  });

  it('deve bloquear conclusão (finish) se o último pilar não tiver escolhas selecionadas', async () => {
    const { result } = renderHook(() =>
      usePreferencesWizard(null, logoutMock, updateUserPreferencesMock, false)
    );

    await waitFor(() => {
      expect(result.current.categories).toHaveLength(mockCategories.length);
    });

    // Seleciona gastronomia
    act(() => {
      result.current.handleToggleInterest('restaurantes');
    });
    // Avança para cultura (passo 1)
    act(() => {
      result.current.handleNext();
    });

    // Avança direto sem marcar cultura
    act(() => {
      result.current.handleNext();
    });

    // O passo atual não deve mudar de 1 (cultura) porque foi bloqueado por falta de seleção
    expect(result.current.currentStep).toBe(1);
    expect(Alert.alert).toHaveBeenCalledWith(
      'Exploração sob Medida',
      'Por favor, selecione pelo menos um interesse nesta categoria para continuarmos a montar suas recomendações.'
    );
  });
});
