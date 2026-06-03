import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { CompassIcon } from './CompassIcon';
import { colors } from '../../constants/colors';

interface LogoWithTextProps {
  size?: number; // Altura geral recomendada do componente (ex: 80, 100, 120)
  style?: StyleProp<ViewStyle>;
}

/**
 * Componente LogoWithText
 * Une o CompassIcon (Logo) e o texto "Exploraê" estilizado.
 * CORREÇÃO DE ALINHAMENTO: Unifica o texto em um único bloco de <Text> nativo
 * para garantir 100% de precisão no alinhamento do baseline (sem desalinhamento vertical),
 * e sobrepõe o acento circunflexo vazada 3D de forma absoluta no canto direito (sobre a letra "e").
 */
export const LogoWithText: React.FC<LogoWithTextProps> = ({ 
  size = 100,
  style 
}) => {
  // Fatores de escala dinâmicos com base no tamanho fornecido
  const logoSize = size * 0.85;
  const fontSize = size * 0.38;
  const accentWidth = fontSize * 0.55;
  const accentHeight = fontSize * 0.50;
  
  // Posicionamento vertical preciso do acento sobre a letra "e"
  const accentTop = -fontSize * 0.14;
  
  // Alinhamento horizontal do acento com o caractere "e" (último caractere à direita)
  const accentRight = -fontSize * 0.02;

  const gap = size * 0.12;

  return (
    <View style={[styles.container, style]}>
      {/* 1. Logo Bússola no lado esquerdo */}
      <CompassIcon width={logoSize} height={logoSize} />

      {/* Espaçador dinâmico */}
      <View style={{ width: gap }} />

      {/* 2. Bloco de Texto Unificado (Garante baseline perfeito e evita desalinhamento vertical) */}
      <View style={styles.textWrapper}>
        <Text style={[styles.textBase, { fontSize, lineHeight: fontSize * 1.25 }]}>
          Explora
          <Text style={styles.textE}>e</Text>
        </Text>

        {/* Acento Circunflexo Customizado: Posicionado absolutamente em relação ao contêiner de texto */}
        <View 
          style={[
            styles.accentWrapper, 
            { 
              width: accentWidth, 
              height: accentHeight, 
              top: accentTop,
              right: accentRight,
            }
          ]}
        >
          <Svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 100 90"
            style={{ overflow: 'visible' }}
          >
            {/* Metade Esquerda (Laranja Base / Claro) */}
            <Path 
              d="M 50 0 L 0 90 L 50 90 L 50 55 L 25 70 L 50 30 Z" 
              fill={colors.brandOrangeLight} 
            />
            
            {/* Metade Direita (Laranja Escuro - Sombra) */}
            <Path 
              d="M 50 0 L 50 30 L 75 70 L 50 55 L 50 90 L 100 90 Z" 
              fill={colors.brandOrangeDark} 
            />
          </Svg>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  textWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  textBase: {
    fontFamily: 'System', // Excelente renderização e alinhamento cross-platform
    fontWeight: '900',
    color: colors.brandBlue,
    letterSpacing: -1,
  },
  textE: {
    color: colors.brandOrangeLight,
  },
  accentWrapper: {
    position: 'absolute',
    zIndex: 10,
  },
});

export default LogoWithText;
