import React from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import {
  type DiceValues,
  type GameState,
  type RoundResultPayload,
} from '@dado-triple/shared-types';
import {
  DiceDisplay,
  PlayerCard,
  MyScore,
  RollButton,
  ByeScreen,
  RoundResultModal,
  colors,
  spacing,
} from '@dado-triple/ui';

interface GameScreenProps {
  dice: DiceValues | null;
  isReady: boolean;
  onRollDice: () => void;
  gameState?: GameState | null;
  playerId?: string | null;
  byePlayerId?: string | null;
  roundResult?: RoundResultPayload | null;
  onDismissResult?: () => void;
  /** @deprecated Score derivado de gameState. Mantenido para compatibilidad con tests. */
  score?: number | null;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  dice,
  isReady,
  onRollDice,
  gameState = null,
  playerId = null,
  byePlayerId = null,
  roundResult = null,
  onDismissResult = () => {},
}) => {
  // ── Jugador actual y oponente ──────────────────────────────────────────────
  const me = gameState?.players.find((p) => p.id === playerId) ?? null;

  const myPair =
    gameState?.pairs.find(
      (pair) => pair.player1Id === playerId || pair.player2Id === playerId,
    ) ?? null;

  const opponentId = myPair
    ? myPair.player1Id === playerId
      ? myPair.player2Id
      : myPair.player1Id
    : null;

  const opponent = opponentId
    ? (gameState?.players.find((p) => p.id === opponentId) ?? null)
    : null;

  // ── ¿Jugador en descanso? ──────────────────────────────────────────────────
  const isOnBye = playerId !== null && byePlayerId === playerId;

  // ── Datos para el modal de resultado ──────────────────────────────────────
  const resultP1 = roundResult
    ? (gameState?.players.find((p) => p.id === roundResult.pair.player1Id) ?? null)
    : null;
  const resultP2 = roundResult
    ? (gameState?.players.find((p) => p.id === roundResult.pair.player2Id) ?? null)
    : null;
  const resultWinner = roundResult?.winnerId
    ? (gameState?.players.find((p) => p.id === roundResult.winnerId) ?? null)
    : null;

  const outcome =
    roundResult === null           ? 'draw'  :
    roundResult.winnerId === null  ? 'draw'  :
    roundResult.winnerId === playerId ? 'win' : 'lose';

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea}>

        {/* Encabezado */}
        <Text style={styles.title}>Dado Triple</Text>
        {gameState && (
          <Text style={styles.roundLabel}>
            Ronda {gameState.round} / {gameState.maxRounds}
          </Text>
        )}

        {/* Pantalla de Descanso (Bye) */}
        {isOnBye ? (
          <ByeScreen />
        ) : (
          <View style={styles.gameArea}>

            {/* Tarjeta del oponente */}
            {opponent ? (
              <PlayerCard
                name={opponent.name}
                score={opponent.score}
                variant="opponent"
                label="Oponente"
              />
            ) : (
              gameState?.status === 'playing' && (
                <View style={styles.searchingCard}>
                  <Text style={styles.searchingText}>Buscando oponente...</Text>
                </View>
              )
            )}

            {/* Área de dados */}
            <View style={styles.diceCard}>
              {me && <MyScore name={me.name} score={me.score} />}

              <DiceDisplay dice={dice} />

              <RollButton onPress={onRollDice} disabled={!isReady} />
            </View>

            {!isReady && (
              <Text style={styles.waitText}>Espera tu turno...</Text>
            )}
          </View>
        )}

        <Text style={styles.rules}>
          Reglas: Trío (+100), Par (+50), Suma simple.
        </Text>
      </SafeAreaView>

      {/* Modal de Resultado de Ronda */}
      <RoundResultModal
        visible={roundResult !== null}
        player1Name={resultP1?.name ?? 'Jugador 1'}
        player2Name={resultP2?.name ?? 'Jugador 2'}
        score1={roundResult?.scores.player1 ?? 0}
        score2={roundResult?.scores.player2 ?? 0}
        outcome={outcome}
        winnerName={resultWinner?.name ?? roundResult?.winnerId ?? undefined}
        onDismiss={onDismissResult}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface.bg,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  roundLabel: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: spacing.xl,
  },
  gameArea: {
    width: '100%',
  },
  diceCard: {
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.surface.border,
    borderRadius: 24,
    padding: spacing.xl,
    alignItems: 'center',
  },
  searchingCard: {
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.surface.border,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    alignItems: 'center' as const,
  },
  searchingText: {
    fontSize: 13,
    color: colors.text.muted,
  },
  waitText: {
    marginTop: spacing.md,
    color: colors.text.warning,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rules: {
    marginTop: spacing.xl,
    color: colors.surface.muted,
    fontSize: 12,
    textAlign: 'center',
  },
});
