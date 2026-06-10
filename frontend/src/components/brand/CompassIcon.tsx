import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import Svg, { Defs, G, Path, Circle, Text as SvgText } from 'react-native-svg';
import { colors } from '../../constants/colors';

interface CompassIconProps {
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

/**
 * Ícone Bússola (Compass Pin) construído puramente com SVG nativo do React Native.
 * OTIMIZAÇÃO: Filtros SVG complexos (<Filter>, <FeDropShadow>) foram substituídos por 
 * sombras nativas de alto desempenho e sombras de vetor diretas. Isso resolve o bug crítico
 * de carregamento do Metro/Web onde o logotipo ficava invisível até recarregar a página.
 */
export const CompassIcon: React.FC<CompassIconProps> = ({ 
  width = 120, 
  height = 120,
  style 
}) => {
  // Paleta de cores extraída da imagem original
  const compassColors = {
    orangeLight: colors.brandCompassLight,
    orangeDark: colors.brandCompassDark,
    white: "#FFFFFF",
    shadow: "#000000"
  };

  return (
    <View 
      style={[
        { 
          width, 
          height, 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: 'transparent',
        }, 
        style
      ]}
    >
      <Svg 
        viewBox="0 0 200 240" 
        width="100%"
        height="100%"
        style={{ overflow: 'visible' }}
      >
        <G>
          <Path 
            d="M100,10 C50.29,10 10,50.29 10,100 C10,167.5 100,230 100,230 C100,230 190,167.5 190,100 C190,50.29 149.71,10 100,10 Z" 
            fill={compassColors.orangeLight} 
          />
          <Path 
            d="M100,10 C149.71,10 190,50.29 190,100 C190,167.5 100,230 100,230 Z" 
            fill={compassColors.orangeDark} 
          />
        </G>
        <G fill={compassColors.white}>
          <Path d="M 93,85 L 107,85 L 100,52 Z" />
          <Path d="M 93,115 L 107,115 L 100,148 Z" />
          <Path d="M 85,93 L 85,107 L 52,100 Z" />
          <Path d="M 115,93 L 115,107 L 148,100 Z" />
        </G>

        <Path 
          d="M 84.5,74 L 84.5,126 L 130.5,100 Z" 
          fill={compassColors.white} 
          stroke={compassColors.white} 
          strokeWidth="12" 
          strokeLinejoin="round" 
        />

        <G transform="translate(100, 100) rotate(55)">
          <Path d="M 0,-24 L -8,0 L 0,24 Z" fill={compassColors.orangeLight} />
          <Path d="M 0,-24 L 8,0 L 0,24 Z" fill={compassColors.orangeDark} />
          <Circle cx="0" cy="0" r="3.5" fill={compassColors.white} />
        </G>

        <G 
          fill={compassColors.white} 
          fontFamily="Arial, Helvetica, sans-serif" 
          fontWeight="900" 
          fontSize="22px" 
          textAnchor="middle"
        ><SvgText x="100" y="42">N</SvgText><SvgText x="100" y="178">S</SvgText><SvgText x="32" y="108">O</SvgText><SvgText x="168" y="108">L</SvgText></G>
      </Svg>
    </View>
  );
};
