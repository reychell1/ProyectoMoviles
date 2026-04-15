import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { DiceValues } from '@dado-triple/shared-types';
import { colors, dieSize, spacing, radius, typography } from '../tokens';

interface DiceDisplayProps {
  /** Valores actuales de los tres dados. `null` muestra placeholders vacíos. */
  dice: DiceValues | null;
}

/**
 * Muestra tres dados con sus valores, o tres placeholders si `dice` es null.
 * Componente visual puro, sin estado propio.
 */
export const DiceDisplay: React.FC<DiceDisplayProps> = ({ dice }) => (
  <View style={styles.row}>
    {dice
      ? dice.map((value, i) => (
          <View key={i} style={styles.die}>
            <Text style={styles.dieValue}>{value}</Text>
          </View>
        ))
      : [0, 1, 2].map((i) => (
          <View key={i} style={[styles.die, styles.dieEmpty]} />
        ))}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  die: {
    width: dieSize,
    height: dieSize,
    backgroundColor: colors.dieBackground,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dieEmpty: {
    backgroundColor: colors.surface.border,
    opacity: 0.5,
  },
  dieValue: {
    ...typography.dieValue,
    color: colors.dieForeground,
  },
});
