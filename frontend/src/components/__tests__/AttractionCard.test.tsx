import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AttractionCard } from '../AttractionCard';

// Mock do Expo Icons para evitar erros no teste
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
}));

describe('AttractionCard Component', () => {
  const defaultProps = {
    title: 'Farol do Cabo Branco',
    tagline: 'O ponto mais oriental das Américas.',
    imageUrl: 'https://example.com/image.jpg',
    rating: 4.8,
    distance: '2.5 km',
    type: 'Cultura',
    tags: ['Farol', 'Vista'],
  };

  it('deve renderizar as informações básicas corretamente', () => {
    const { getByText } = render(<AttractionCard {...defaultProps} />);

    expect(getByText('Farol do Cabo Branco')).toBeTruthy();
    expect(getByText('O ponto mais oriental das Américas.')).toBeTruthy();
    expect(getByText('2.5 km')).toBeTruthy();
    expect(getByText('Farol')).toBeTruthy(); // Primeira tag
  });

  it('deve disparar evento de clique ao ser pressionado', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<AttractionCard {...defaultProps} onPress={onPressMock} />);

    fireEvent.press(getByText('Farol do Cabo Branco'));
    expect(onPressMock).toHaveBeenCalled();
  });

  it('deve exibir badge de POPULAR quando isPopular for true', () => {
    const { getByText } = render(<AttractionCard {...defaultProps} isPopular={true} />);
    expect(getByText('POPULAR')).toBeTruthy();
  });

  it('deve renderizar variante compacta corretamente', () => {
    const { getByText } = render(<AttractionCard {...defaultProps} variant="compact" />);
    expect(getByText('Farol do Cabo Branco')).toBeTruthy();
    // Na variante compacta o tagline não é exibido (conforme código anterior)
  });
});
