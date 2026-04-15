import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../tokens';

interface ByeScreenProps {
  /** Título del mensaje. Por defecto "Descansas esta ronda". */
  title?: string;
  /** Cuerpo explicativo. Por defecto describe el avance automático. */
  body?: string;
}

/**
 * Pantalla de descanso para el jugador que queda impar en la ronda (bye).
 * Informa al jugador que avanza automáticamente a la siguiente ronda.
 */
export const ByeScreen: React.FC<ByeScreenProps> = ({
  title = 'Descansas esta ronda',
  body = 'El número de jugadores es impar. Avanzas automáticamente a la siguiente ronda.',
}) => (
  <View style={styles.card}>
    <Text style={styles.emoji}>😴</Text>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.body}>{body}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    alignItems: 'center',
    width: '100%',
  },
  emoji: {
    fontSize: 52,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.sectionTitle,
    color: colors.text.warning,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  body: {
    ...typography.body,
    color: colors.text.warningLight,
    textAlign: 'center',
    lineHeight: 22,
  },
});
