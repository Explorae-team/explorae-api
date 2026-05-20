// Mock do módulo de Supabase ANTES de qualquer importação
jest.mock('../supabase', () => ({
  __esModule: true,
  getPublicImageUrl: jest.fn((path) => path),
}));

import { renderHook, waitFor } from '@testing-library/react-native';
import { useExploreData } from '../useExploreData';

// Mock do módulo de API interno ANTES de qualquer importação que possa carregar o axios real
jest.mock('../api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  },
}));

import api from '../api';
const mockedApi = api as jest.Mocked<typeof api>;

describe('useExploreData Hook', () => {
  const mockApiAttractions = [
    {
      id: '1',
      name: 'Atração Teste',
      category: 'Cultura',
      mainImageUrl: 'http://test.com/image.jpg',
      averageRating: 4.5,
      distance: '1.2 km',
      tags: ['Tag1'],
      shortDescription: 'Descrição curta'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve iniciar com estado de carregamento e buscar dados iniciais', async () => {
    mockedApi.get.mockResolvedValueOnce({
      data: {
        data: {
          content: mockApiAttractions,
          number: 0,
          totalPages: 1,
          totalElements: 1,
          last: true
        }
      }
    });

    const { result } = renderHook(() => useExploreData());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.attractions).toHaveLength(1);
      // O hook mapeia 'name' para 'title'
      expect(result.current.attractions[0].title).toBe('Atração Teste');
    });
  });

  it('deve lidar com erro na API', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('API Error'));

    const { result } = renderHook(() => useExploreData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe('Não foi possível carregar as atrações.');
    });
  });

  it('deve carregar próxima página corretamente', async () => {
    // Primeira chamada (inicial)
    mockedApi.get.mockResolvedValueOnce({
      data: {
        data: {
          content: mockApiAttractions,
          number: 0,
          totalPages: 2,
          totalElements: 2,
          last: false
        }
      }
    });

    const { result } = renderHook(() => useExploreData());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Segunda chamada (loadMore)
    const nextAttraction = { ...mockApiAttractions[0], id: '2', name: 'Atração 2' };
    mockedApi.get.mockResolvedValueOnce({
      data: {
        data: {
          content: [nextAttraction],
          number: 1,
          totalPages: 2,
          totalElements: 2,
          last: true
        }
      }
    });

    await result.current.loadMore();

    await waitFor(() => {
      expect(result.current.attractions).toHaveLength(2);
      expect(result.current.attractions[1].title).toBe('Atração 2');
    });
  });
});
