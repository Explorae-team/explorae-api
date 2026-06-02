import api from './api';

export interface Partner {
  id: string;
  name: string;
  description: string;
  contactInfo?: string;
  photoUrl?: string;
}

export interface Reward {
  id: string;
  partner: Partner;
  name: string;
  description: string;
  type: 'DISCOUNT' | 'EXPERIENCE' | 'PRODUCT';
  costInCoins: number;
  stock: number;
  imageUrl?: string;
}

export interface Voucher {
  id: string;
  userId: string;
  reward: Reward;
  code: string;
  status: 'ACTIVE' | 'USED' | 'EXPIRED';
  redeemedAt: string;
  expiresAt: string;
}

export const rewardService = {
  getRewards: async (): Promise<{ success: boolean; data?: Reward[]; message?: string }> => {
    try {
      const response = await api.get('/api/v1/rewards');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao carregar catálogo de recompensas'
      };
    }
  },

  redeemReward: async (rewardId: string): Promise<{ success: boolean; data?: Voucher; message?: string }> => {
    try {
      const response = await api.post(`/api/v1/rewards/redeem/${rewardId}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao resgatar recompensa'
      };
    }
  },

  getMyVouchers: async (): Promise<{ success: boolean; data?: Voucher[]; message?: string }> => {
    try {
      const response = await api.get('/api/v1/rewards/my-vouchers');
      return {
        success: true,
        data: response.data.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao carregar seus vouchers'
      };
    }
  }
};
