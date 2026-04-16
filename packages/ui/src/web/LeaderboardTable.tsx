import React from 'react';
import { colors, spacing, typography, radius } from '../tokens';

export interface LeaderboardEntry {
  id: string;
  username: string;
  totalScore: number;
  sessionIds: string[];
  createdAt: string;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

const MEDAL: Record<number, string> = { 0: '🥇', 1: '🥈', 2: '🥉' };

/**
 * Tabla de posiciones global para el dashboard web administrativo.
 * Usa los design tokens de packages/ui/src/tokens.ts para mantener
 * consistencia visual con la app móvil.
 */
export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries }) => (
  <div style={styles.wrapper}>
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Pos.</th>
          <th style={{ ...styles.th, textAlign: 'left' }}>Jugador</th>
          <th style={styles.th}>Puntuación Total</th>
          <th style={styles.th}>Partidas</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, index) => {
          const isTop3 = index < 3;
          return (
            <tr
              key={entry.id}
              style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}
            >
              <td style={{ ...styles.td, textAlign: 'center' }}>
                {isTop3 ? (
                  <span style={styles.medal}>{MEDAL[index]}</span>
                ) : (
                  <span style={styles.rankNum}>#{index + 1}</span>
                )}
              </td>
              <td style={{ ...styles.td, ...styles.nameCell }}>
                {entry.username}
              </td>
              <td style={{ ...styles.td, textAlign: 'center', ...styles.scoreCell }}>
                {entry.totalScore.toLocaleString('es-ES')} pts
              </td>
              <td style={{ ...styles.td, textAlign: 'center', color: colors.text.secondary }}>
                {entry.sessionIds.length}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    overflowX: 'auto',
    borderRadius: radius.md,
    border: `1px solid ${colors.surface.border}`,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: colors.surface.card,
  },
  th: {
    padding: `${spacing.sm}px ${spacing.lg}px`,
    textAlign: 'center',
    color: colors.text.muted,
    fontSize: typography.label.fontSize,
    letterSpacing: typography.label.letterSpacing,
    fontWeight: 'bold',
    borderBottom: `1px solid ${colors.surface.border}`,
    backgroundColor: colors.surface.bg,
    whiteSpace: 'nowrap',
  },
  td: {
    padding: `${spacing.md}px ${spacing.lg}px`,
    color: colors.text.primary,
    fontSize: typography.body.fontSize,
    borderBottom: `1px solid ${colors.surface.border}`,
  },
  rowEven: { backgroundColor: colors.surface.card },
  rowOdd: { backgroundColor: '#16213e' },
  medal: { fontSize: 20 },
  rankNum: { color: colors.text.muted, fontWeight: 'bold' },
  nameCell: {
    fontWeight: 'bold',
    textAlign: 'left',
  },
  scoreCell: {
    color: colors.text.success,
    fontWeight: 'bold',
  },
};
