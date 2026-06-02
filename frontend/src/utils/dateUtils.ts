import { Voucher } from '../services/rewardService';

export const getVoucherExpirationText = (voucher: Voucher): string | null => {
  if (voucher.status !== 'ACTIVE' || !voucher.expiresAt) return null;
  
  const expirationDate = new Date(voucher.expiresAt);
  const now = new Date();
  const diffTime = expirationDate.getTime() - now.getTime();
  
  if (diffTime <= 0) return 'Expira hoje';

  const totalHours = Math.floor(diffTime / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  if (days === 0) {
    if (hours === 0) return 'Expira em menos de 1 hora';
    if (hours === 1) return 'Expira em 1 hora';
    return `Expira em ${hours} horas`;
  }

  if (days === 1) {
    if (hours === 0) return 'Expira em 1 dia';
    if (hours === 1) return 'Expira em 1 dia e 1 hora';
    return `Expira em 1 dia e ${hours} horas`;
  }

  if (hours === 0) return `Expira em ${days} dias`;
  if (hours === 1) return `Expira em ${days} dias e 1 hora`;
  return `Expira em ${days} dias e ${hours} horas`;
};
