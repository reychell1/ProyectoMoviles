import { render, screen, fireEvent } from '@testing-library/react-native';
import { GameScreen } from '../src/components/GameScreen';
import type { GameState, RoundResultPayload } from '@dado-triple/shared-types';

// ── Fixtures ─────────────────────────────────────────────────────────────────

const PLAYER_ME = { id: 'p1', name: 'Yo', score: 50, isReady: true };
const PLAYER_OPP = { id: 'p2', name: 'Rival', score: 30, isReady: true };

const makeGameState = (overrides?: Partial<GameState>): GameState => ({
  sessionId: 'sess-1',
  players: [PLAYER_ME, PLAYER_OPP],
  pairs: [{ player1Id: 'p1', player2Id: 'p2' }],
  currentDice: [1, 1, 1],
  status: 'playing',
  round: 1,
  maxRounds: 3,
  ...overrides,
});

const makeRoundResult = (overrides?: Partial<RoundResultPayload>): RoundResultPayload => ({
  pair: { player1Id: 'p1', player2Id: 'p2' },
  scores: { player1: 100, player2: 50 },
  winnerId: 'p1',
  ...overrides,
});

// ── Suite: botón Lanzar Dados ─────────────────────────────────────────────────

describe('GameScreen — botón Lanzar Dados', () => {
  const mockOnRollDice = jest.fn();

  beforeEach(() => mockOnRollDice.mockClear());

  it('renderiza el botón', () => {
    render(<GameScreen dice={null} isReady={true} onRollDice={mockOnRollDice} />);
    expect(screen.getByText('Lanzar Dados')).toBeTruthy();
  });

  it('está deshabilitado cuando isReady es false', () => {
    render(<GameScreen dice={null} isReady={false} onRollDice={mockOnRollDice} />);
    // Usamos testID para acceder directo al TouchableOpacity sin depender de .parent
    const btn = screen.getByTestId('roll-dice-btn');
    expect(btn).toHaveProperty('props.accessibilityState', { disabled: true });
    fireEvent.press(screen.getByText('Lanzar Dados'));
    expect(mockOnRollDice).not.toHaveBeenCalled();
  });

  it('muestra "Espera tu turno..." cuando isReady es false', () => {
    render(<GameScreen dice={null} isReady={false} onRollDice={mockOnRollDice} />);
    expect(screen.getByText('Espera tu turno...')).toBeTruthy();
  });

  it('llama a onRollDice al presionar cuando isReady es true', () => {
    render(<GameScreen dice={null} isReady={true} onRollDice={mockOnRollDice} />);
    fireEvent.press(screen.getByText('Lanzar Dados'));
    expect(mockOnRollDice).toHaveBeenCalledTimes(1);
  });
});

// ── Suite: Visualización de Oponente ─────────────────────────────────────────

describe('GameScreen — visualización de oponente', () => {
  it('muestra el nombre y score del oponente cuando hay un pair', () => {
    render(
      <GameScreen
        dice={null}
        isReady={true}
        onRollDice={jest.fn()}
        gameState={makeGameState()}
        playerId="p1"
      />,
    );
    expect(screen.getByText('Rival')).toBeTruthy();
    expect(screen.getByText('30 pts')).toBeTruthy();
  });

  it('muestra el score del jugador actual', () => {
    render(
      <GameScreen
        dice={null}
        isReady={true}
        onRollDice={jest.fn()}
        gameState={makeGameState()}
        playerId="p1"
      />,
    );
    expect(screen.getByText('Yo: 50 pts')).toBeTruthy();
  });

  it('muestra ronda y maxRondas en el encabezado', () => {
    render(
      <GameScreen
        dice={null}
        isReady={true}
        onRollDice={jest.fn()}
        gameState={makeGameState()}
        playerId="p1"
      />,
    );
    expect(screen.getByText('Ronda 1 / 3')).toBeTruthy();
  });
});

// ── Suite: Pantalla de Descanso (Bye) ─────────────────────────────────────────

describe('GameScreen — pantalla de descanso (bye)', () => {
  it('muestra mensaje de bye cuando el jugador actual tiene bye', () => {
    render(
      <GameScreen
        dice={null}
        isReady={false}
        onRollDice={jest.fn()}
        gameState={makeGameState({ pairs: [], status: 'playing' })}
        playerId="p1"
        byePlayerId="p1"
      />,
    );
    expect(screen.getByText('Descansas esta ronda')).toBeTruthy();
    expect(screen.queryByText('Lanzar Dados')).toBeNull();
  });

  it('NO muestra el mensaje de bye cuando es otro jugador quien descansa', () => {
    render(
      <GameScreen
        dice={null}
        isReady={true}
        onRollDice={jest.fn()}
        gameState={makeGameState()}
        playerId="p1"
        byePlayerId="p2"
      />,
    );
    expect(screen.queryByText('Descansas esta ronda')).toBeNull();
    expect(screen.getByText('Lanzar Dados')).toBeTruthy();
  });
});

// ── Suite: Modal de Resultado de Ronda ────────────────────────────────────────

describe('GameScreen — modal de resultado de ronda', () => {
  it('muestra el modal con los scores cuando hay roundResult', () => {
    render(
      <GameScreen
        dice={null}
        isReady={false}
        onRollDice={jest.fn()}
        gameState={makeGameState()}
        playerId="p1"
        roundResult={makeRoundResult()}
        onDismissResult={jest.fn()}
      />,
    );
    expect(screen.getByText('Resultado de Ronda')).toBeTruthy();
    expect(screen.getByText('100')).toBeTruthy();
    expect(screen.getByText('50')).toBeTruthy();
  });

  it('muestra "¡Ganaste esta ronda!" cuando el jugador actual gana', () => {
    render(
      <GameScreen
        dice={null}
        isReady={false}
        onRollDice={jest.fn()}
        gameState={makeGameState()}
        playerId="p1"
        roundResult={makeRoundResult({ winnerId: 'p1' })}
        onDismissResult={jest.fn()}
      />,
    );
    expect(screen.getByText('¡Ganaste esta ronda!')).toBeTruthy();
  });

  it('muestra el nombre del ganador cuando pierde el jugador actual', () => {
    render(
      <GameScreen
        dice={null}
        isReady={false}
        onRollDice={jest.fn()}
        gameState={makeGameState()}
        playerId="p1"
        roundResult={makeRoundResult({ winnerId: 'p2' })}
        onDismissResult={jest.fn()}
      />,
    );
    expect(screen.getByText('Ganador: Rival')).toBeTruthy();
  });

  it('muestra "Empate" cuando winnerId es null', () => {
    render(
      <GameScreen
        dice={null}
        isReady={false}
        onRollDice={jest.fn()}
        gameState={makeGameState()}
        playerId="p1"
        roundResult={makeRoundResult({ winnerId: null })}
        onDismissResult={jest.fn()}
      />,
    );
    expect(screen.getByText('Empate')).toBeTruthy();
  });

  it('llama a onDismissResult al presionar "Continuar"', () => {
    const onDismiss = jest.fn();
    render(
      <GameScreen
        dice={null}
        isReady={false}
        onRollDice={jest.fn()}
        gameState={makeGameState()}
        playerId="p1"
        roundResult={makeRoundResult()}
        onDismissResult={onDismiss}
      />,
    );
    fireEvent.press(screen.getByText('Continuar'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
