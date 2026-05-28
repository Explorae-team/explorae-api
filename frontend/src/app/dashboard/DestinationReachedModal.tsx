import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import MaterialIcon from '@expo/vector-icons/MaterialIcons';

interface DestinationReachedModalProps {
  visible: boolean;
  destinationName: string;
  xpEarned?: number;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DestinationReachedModal({
  visible,
  destinationName,
  xpEarned = 100,
  onClose,
  onConfirm,
}: DestinationReachedModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Top Navigation */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={onClose} style={styles.iconButton}>
            <MaterialIcon name="close" size={24} color="#fd6c28" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Destino Alcançado</Text>
          <View style={{ width: 40 }} /> {/* Spacer */}
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Background Ambient Glow (Simulado) */}
          <View style={styles.glowBackground} />

          {/* Achievement Badge */}
          <View style={styles.badgeContainer}>
            <View style={styles.badgeCircle}>
              <MaterialIcon name="military-tech" size={80} color="#00161e" />
            </View>
            <View style={styles.floatingChip}>
              <MaterialIcon name="star" size={14} color="#271900" />
              <Text style={styles.floatingChipText}>Local Descoberto</Text>
            </View>
          </View>

          {/* Typography */}
          <View style={styles.textContainer}>
            <Text style={styles.headline}>
              Você chegou a {destinationName}!
            </Text>
            <View style={styles.xpRow}>
              <MaterialIcon name="stars" size={24} color="#ffba26" />
              <Text style={styles.xpText}>+{xpEarned} XP GANHO</Text>
            </View>
            <Text style={styles.subtitle}>
              Parabéns, Explorador! Sua jornada continua.
            </Text>
          </View>

          {/* Action Button */}
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={onConfirm} activeOpacity={0.8}>
              <Text style={styles.primaryButtonText}>Confirmar e Continuar</Text>
            </TouchableOpacity>
            <Text style={styles.earlyAccessText}>Exploraê Early Access</Text>
          </View>

          {/* Bento Stats */}
          <View style={styles.bentoGrid}>
            <View style={styles.bentoCard}>
              <Text style={styles.bentoLabel}>Média</Text>
              <Text style={styles.bentoValue}>Top 5%</Text>
            </View>
            <View style={styles.bentoCard}>
              <Text style={styles.bentoLabel}>Status</Text>
              <Text style={styles.bentoValue}>Novato</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: '#00161e', paddingTop: Platform.OS === 'ios' ? 50 : 20 },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16, zIndex: 50 },
  iconButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20 },
  navTitle: { color: '#bde9fe', fontSize: 18, fontWeight: '700' },
  mainContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingBottom: 40 },
  glowBackground: { position: 'absolute', top: '25%', width: 300, height: 300, backgroundColor: 'rgba(253, 108, 40, 0.1)', borderRadius: 150 },
  badgeContainer: { marginBottom: 40, alignItems: 'center', position: 'relative' },
  badgeCircle: { width: 160, height: 160, backgroundColor: '#fd6c28', borderRadius: 80, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: 'rgba(255, 181, 152, 0.2)', shadowColor: '#fd6c28', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.6, shadowRadius: 30, elevation: 15 },
  floatingChip: { position: 'absolute', top: -10, right: -20, backgroundColor: '#ffba26', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 4, transform: [{ rotate: '12deg' }], elevation: 5 },
  floatingChipText: { color: '#271900', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  textContainer: { alignItems: 'center', gap: 12 },
  headline: { color: '#ffffff', fontSize: 32, fontWeight: '900', textAlign: 'center', lineHeight: 38 },
  xpRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 8 },
  xpText: { color: '#ffba26', fontSize: 22, fontWeight: '900', letterSpacing: 1 },
  subtitle: { color: 'rgba(189, 233, 254, 0.7)', fontSize: 16, fontWeight: '600', textAlign: 'center', paddingHorizontal: 16 },
  actionContainer: { width: '100%', marginTop: 48, alignItems: 'center' },
  primaryButton: { width: '100%', backgroundColor: '#fd6c28', paddingVertical: 18, borderRadius: 12, alignItems: 'center', shadowColor: '#fd6c28', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 8 },
  primaryButtonText: { color: '#370e00', fontSize: 18, fontWeight: 'bold' },
  earlyAccessText: { color: 'rgba(189, 233, 254, 0.4)', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginTop: 24 },
  bentoGrid: { flexDirection: 'row', width: '100%', gap: 16, marginTop: 48 },
  bentoCard: { flex: 1, backgroundColor: 'rgba(5, 58, 74, 0.4)', padding: 24, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  bentoLabel: { color: 'rgba(189, 233, 254, 0.5)', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 },
  bentoValue: { color: '#ffffff', fontSize: 24, fontWeight: 'bold' },
});