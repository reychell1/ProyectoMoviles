import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../tokens';

export type RoundOutcome = 'win' | 'lose' | 'draw';

interface RoundResultModalProps {
  visible: boolean;
  player1Name: string;
  player2Name: string;
  score1: number;
  score2: number;
  /** Resultado desde la perspectiva del jugador local. */
  outcome: RoundOutcome;
  /** Nombre del ganador (solo necesario cuando outcome !== 'draw'). */
  winnerName?: string;
  onDismiss: () => void;
}

/**
 * Modal que muestra el resultado de una ronda de enfrentamiento.
 * Recibe props simples (sin acoplamiento a los tipos de WebSocket)
 * para facilitar su reutilización en web y futuras pantallas.
 */
export const RoundResultModal: React.FC<RoundResultModalProps> = ({
  visible,
  player1Name,
  player2Name,
  score1,
  score2,
  outcome,
  winnerName,
  onDismiss,
}) => {
  const bannerStyle = [
    styles.resultBanner,
    outcome === 'win'  ? styles.bannerWin  :
    outcome === 'lose' ? styles.bannerLose :
                         styles.bannerDraw,
  ];

  const bannerText =
    outcome === 'draw' ? 'Empate' :
    outcome === 'win'  ? '¡Ganaste esta ronda!' :
                         `Ganador: ${winnerName ?? ''}`;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Resultado de Ronda</Text>

          {/* Marcador */}
          <View style={styles.scoreRow}>
            <View style={styles.scoreCol}>
              <Text style={styles.playerName} numberOfLines={1}>{player1Name}</Text>
              <Text style={styles.scoreValue}>{score1}</Text>
            </View>

            <Text style={styles.vs}>vs</Text>

            <View style={styles.scoreCol}>
              <Text style={styles.playerName} numberOfLines={1}>{player2Name}</Text>
              <Text style={styles.scoreValue}>{score2}</Text>
            </View>
          </View>

          {/* Banner de resultado */}
          <View style={bannerStyle}>
            <Text style={styles.bannerText}>{bannerText}</Text>
          </View>

          <TouchableOpacity onPress={onDismiss} style={styles.continueBtn}>
            <Text style={styles.continueBtnText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.surface.muted,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    ...typography.sectionTitle,
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: spacing.xl,
  },
  scoreCol: {
    flex: 1,
    alignItems: 'center',
  },
  playerName: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  scoreValue: {
    ...typography.scoreXL,
    color: colors.text.primary,
  },
  vs: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.muted,
  },
  resultBanner: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    marginBottom: spacing.xl,
    width: '100%',
    alignItems: 'center',
  },
  bannerWin: {
    backgroundColor: colors.result.winBg,
    borderWidth: 1,
    borderColor: colors.result.winBorder,
  },
  bannerLose: {
    backgroundColor: colors.result.loseBg,
    borderWidth: 1,
    borderColor: colors.result.loseBorder,
  },
  bannerDraw: {
    backgroundColor: colors.result.drawBg,
  },
  bannerText: {
    ...typography.subheading,
    color: colors.text.primary,
    textAlign: 'center',
  },
  continueBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl + spacing.sm,
    paddingVertical: spacing.lg - spacing.xs,
    borderRadius: radius.full,
  },
  continueBtnText: {
    ...typography.subheading,
    color: colors.white,
  },
});
