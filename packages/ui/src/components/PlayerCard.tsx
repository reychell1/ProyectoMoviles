import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../tokens';

type PlayerCardVariant = 'opponent' | 'neutral';

interface PlayerCardProps {
  name: string;
  score: number;
  /** `'opponent'` usa borde rojo. `'neutral'` usa borde gris. Por defecto `'opponent'`. */
  variant?: PlayerCardVariant;
  /** Etiqueta superior (ej. "OPONENTE"). */
  label?: string;
}

/**
 * Tarjeta que muestra el nombre y puntuación de un jugador.
 * Usada para mostrar al oponente en la pantalla de juego, en el lobby, o en clasificaciones.
 */
export const PlayerCard: React.FC<PlayerCardProps> = ({
  name,
  score,
  variant = 'opponent',
  label,
}) => {
  const isOpponent = variant === 'opponent';

  return (
    <View style={[styles.card, isOpponent ? styles.cardOpponent : styles.cardNeutral]}>
      {label && (
        <Text style={[styles.label, isOpponent ? styles.labelOpponent : styles.labelNeutral]}>
          {label.toUpperCase()}
        </Text>
      )}
      <Text style={styles.name}>{name}</Text>
      <Text style={[styles.score, isOpponent ? styles.scoreOpponent : styles.scoreNeutral]}>
        {score} pts
      </Text>
    </View>
  );
};

/**
 * Variante compacta (sin borde) para mostrar la información del jugador actual
 * dentro de la tarjeta de dados. Solo texto, sin contenedor.
 */
interface MyScoreProps {
  name: string;
  score: number;
}

export const MyScore: React.FC<MyScoreProps> = ({ name, score }) => (
  <Text style={styles.myScore}>
    {name}: {score} pts
  </Text>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  cardOpponent: {
    borderColor: colors.opponent.border,
  },
  cardNeutral: {
    borderColor: colors.surface.border,
  },
  label: {
    ...typography.label,
    marginBottom: spacing.xs,
  },
  labelOpponent: {
    color: colors.opponent.label,
  },
  labelNeutral: {
    color: colors.text.muted,
  },
  name: {
    ...typography.heading,
    color: colors.text.primary,
  },
  score: {
    ...typography.body,
    marginTop: spacing.xs,
  },
  scoreOpponent: {
    color: colors.opponent.score,
  },
  scoreNeutral: {
    color: colors.text.secondary,
  },
  // MyScore
  myScore: {
    ...typography.subheading,
    color: colors.text.success,
    marginBottom: spacing.lg,
  },
});
