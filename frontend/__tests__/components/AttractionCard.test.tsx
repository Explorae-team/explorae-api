import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AttractionCard } from '../../src/components/dashboard/AttractionCard';

// No expo-image mock needed


describe('AttractionCard', () => {
  const defaultProps = {
    title: 'Farol de Cabo Branco',
    tagline: 'Iconic lighthouse marking the easternmost point.',
    imageUrl: 'https://example.com/image.jpg',
    rating: 4.8,
    distance: '2.4 km',
    type: 'Sightseeing',
    tags: ['Coastal', 'Historic'],
  };

  it('renders title and tagline correctly', () => {
    const { getByText } = render(<AttractionCard {...defaultProps} />);
    
    expect(getByText('Farol de Cabo Branco')).toBeTruthy();
    expect(getByText('Iconic lighthouse marking the easternmost point.')).toBeTruthy();
  });

  it('renders metadata (rating and distance)', () => {
    const { getByText } = render(<AttractionCard {...defaultProps} />);
    
    expect(getByText('4.8')).toBeTruthy();
    expect(getByText('2.4 km')).toBeTruthy();
  });

  it('renders type badge correctly', () => {
    const { getByText } = render(<AttractionCard {...defaultProps} />);
    expect(getByText('SIGHTSEEING')).toBeTruthy();
  });

  it('renders tags correctly', () => {
    const { getByText } = render(<AttractionCard {...defaultProps} />);
    expect(getByText('Coastal')).toBeTruthy();
    expect(getByText('Historic')).toBeTruthy();
  });

  it('calls onPress when the card is pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<AttractionCard {...defaultProps} onPress={onPress} />);
    
    fireEvent.press(getByText('Farol de Cabo Branco'));
    expect(onPress).toHaveBeenCalled();
  });

  it('calls onFavoritePress when the favorite button is pressed', () => {
    const onFavoritePress = jest.fn();
    const { getByTestId } = render(
      <AttractionCard {...defaultProps} onFavoritePress={onFavoritePress} />
    );
    
    fireEvent.press(getByTestId('favorite-button'));
    expect(onFavoritePress).toHaveBeenCalled();
  });
});
