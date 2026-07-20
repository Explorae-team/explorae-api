import api from './api';

/**
 * Atualiza as preferências de viagem do usuário.
 * @param {string[]} interests Lista de interesses selecionados.
 * @returns {Promise<any>} Resposta padronizada do servidor.
 */
export const updatePreferences = async (interests) => {
  try {
    const response = await api.put('/api/v1/users/me/preferences', { interests });
    return { 
      success: true, 
      data: response.data.data,
      unlockedBadges: response.data.data,
      message: response.data.message 
    };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Erro ao salvar preferências' 
    };
  }
};

/**
 * Recupera as preferências de viagem do usuário.
 */
export const getPreferences = async () => {
  try {
    const response = await api.get('/api/v1/users/me/preferences');
    return { 
      success: true, 
      data: response.data.data 
    };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Erro ao recuperar preferências' 
    };
  }
};

/**
 * Recupera o catálogo de categorias disponíveis no sistema.
 */
export const getCategories = async () => {
  try {
    const response = await api.get('/api/v1/categories');
    return { 
      success: true, 
      data: response.data.data 
    };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || 'Erro ao recuperar catálogo' 
    };
  }
};

const preferenceService = {
  updatePreferences,
  getPreferences,
  getCategories
};

export default preferenceService;
