import React from 'react';
import { render } from '@testing-library/react-native';
import StatsGrid from '../../src/components/StatsGrid';
import { useAuth } from '../../src/contexts/AuthContext';

// Mock do Contexto de Autenticação
jest.mock('../../src/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock do @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
}), { virtual: true });

describe('StatsGrid Component', () => {
  
  it('deve exibir cores de Bronze quando XP < 1000', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { xp: 500, coins: 100 }
    });

    const { getByTestId } = render(<StatsGrid />);
    
    // Check-ins card (index 1) deve ter cor Bronze (#CD7F32)
    const iconContainer = getByTestId('stat-icon-container-1');
    expect(iconContainer.props.style.backgroundColor).toBe('#CD7F3220');
  });

  it('deve exibir cores de Ouro quando XP >= 2000', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { xp: 2500, coins: 500 }
    });

    const { getByTestId } = render(<StatsGrid />);
    
    const iconContainer = getByTestId('stat-icon-container-1');
    expect(iconContainer.props.style.backgroundColor).toBe('#FFD70020');
  });

  it('deve exibir ExploraCoins com formato numérico correto', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { xp: 100, coins: 1250 }
    });

    const { getByText } = render(<StatsGrid />);
    
    // 1250 deve ser formatado como 1,250 ou 1.250 dependendo do locale, 
    // mas verificamos se o texto existe
    expect(getByText(/1[.,]250/)).toBeTruthy();
  });
});
