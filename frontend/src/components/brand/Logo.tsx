import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { CompassIcon } from './CompassIcon';
import LogoWithText from './LogoWithText';

interface LogoProps {
  variant?: 'main';
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

// Re-exporta o CompassIcon para manter a compatibilidade completa
export { CompassIcon };

/**
 * Por padrão, o componente Logo agora renderiza a identidade completa (Logo + Texto "Exploraê").
 * Isso garante que todas as telas legadas e novas exibições unifiquem automaticamente a identidade visual.
 */
export const Logo: React.FC<LogoProps> = ({ 
  width = 120, 
  height = 120,
  style 
}) => {
  const size = Math.min(width, height);
  return <LogoWithText size={size} style={style} />;
};

export default Logo;
