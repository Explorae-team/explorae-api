// Mock do módulo de Supabase ANTES de qualquer importação
jest.mock('../supabase', () => ({
  __esModule: true,
  getPublicImageUrl: jest.fn((path) => path),
}));

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

import { renderHook, waitFor } from '@testing-library/react-native';
import { useRecommendations } from '../useRecommendations';
import api from '../api';

const mockedApi = api as jest.Mocked<typeof api>;

describe('useRecommendations Hook', () => {
  const mockApiRecommendations = [
    {
      id: 'rec-1',
      name: 'Recomendação Cultural',
      category: 'Cultura',
      mainImageUrl: 'http://test.com/image-rec.jpg',
      averageRating: 4.8,
      distance: '0.5 km',
      tags: ['Recomendado'],
      shortDescription: 'Descrição da recomendação'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve iniciar com estado de carregamento e buscar recomendações geolocalizadas', async () => {
    mockedApi.get.mockResolvedValueOnce({
      data: {
        data: {
          content: mockApiRecommendations,
          number: 0,
          totalPages: 1,
          totalElements: 1,
          last: true
        }
      }
    });

    const { result } = renderHook(() => useRecommendations(-7.1196, -34.8450, 10));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.recommendations).toHaveLength(1);
      expect(result.current.recommendations[0].title).toBe('Recomendação Cultural');
      expect(mockedApi.get).toHaveBeenCalledWith('/api/v1/attractions/recommendations', {
        params: {
          latitude: -7.1196,
          longitude: -34.8450,
          page: 0,
          size: 10
        }
      });
    });
  });

  it('deve lidar com erro na API de recomendações de forma resiliente', async () => {
    mockedApi.get.mockRejectedValueOnce(new Error('Internal Server Error'));

    const { result } = renderHook(() => useRecommendations(null, null));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe('Não foi possível carregar as recomendações.');
    });
  });

  it('deve carregar próximas páginas de recomendações paginadas', async () => {
    mockedApi.get.mockResolvedValueOnce({
      data: {
        data: {
          content: mockApiRecommendations,
          number: 0,
          totalPages: 2,
          totalElements: 2,
          last: false
        }
      }
    });

    const { result } = renderHook(() => useRecommendations(-7.1196, -34.8450, 5));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const nextRec = { ...mockApiRecommendations[0], id: 'rec-2', name: 'Recomendação 2' };
    mockedApi.get.mockResolvedValueOnce({
      data: {
        data: {
          content: [nextRec],
          number: 1,
          totalPages: 2,
          totalElements: 2,
          last: true
        }
      }
    });

    await result.current.loadMore();

    await waitFor(() => {
      expect(result.current.recommendations).toHaveLength(2);
      expect(result.current.recommendations[1].title).toBe('Recomendação 2');
    });
  });
});
