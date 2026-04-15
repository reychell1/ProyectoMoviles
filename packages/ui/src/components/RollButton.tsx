import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../tokens';

interface RollButtonProps {
  onPress: () => void;
  disabled?: boolean;
  /** Texto del botón. Por defecto "LANZAR DADOS". */
  label?: string;
  testID?: string;
}

/**
 * Botón principal de acción para lanzar los dados.
 * Acepta estado deshabilitado con retroalimentación visual clara.
 */
export const RollButton: React.FC<RollButtonProps> = ({
  onPress,
  disabled = false,
  label = 'Lanzar Dados',
  testID = 'roll-dice-btn',
}) => (
  <TouchableOpacity
    testID={testID}
    onPress={onPress}
    disabled={disabled}
    style={[styles.btn, disabled && styles.btnDisabled]}
    accessibilityState={{ disabled }}
  >
    <Text style={styles.label}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl + spacing.sm,
    paddingVertical: spacing.lg + spacing.sm,
    borderRadius: radius.full,
    width: '100%',
    alignItems: 'center',
  },
  btnDisabled: {
    backgroundColor: colors.surface.muted,
    opacity: 0.5,
  },
  label: {
    ...typography.btnLabel,
    color: colors.white,
    textTransform: 'uppercase',
  },
});
