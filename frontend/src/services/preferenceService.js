import api from './api';

const preferenceService = {
  /**
   * Atualiza as preferências de viagem do usuário.
   * @param {string[]} interests Lista de interesses selecionados.
   * @returns {Promise<any>} Resposta padronizada do servidor.
   */
  updatePreferences: async (interests) => {
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
  },

  /**
   * Recupera as preferências de viagem do usuário.
   */
  getPreferences: async () => {
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
  },

  /**
   * Recupera o catálogo de categorias disponíveis no sistema.
   */
  getCategories: async () => {
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
  }
};

export default preferenceService;
