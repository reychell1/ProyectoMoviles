import React from 'react';
import { colors, spacing, typography, radius } from '../tokens';

export interface SessionSummary {
  id: string;
  status: string;
  startTime: string;
  endTime: string | null;
  playerIds: string[];
  movementCount: number;
}

export interface MovementDetail {
  id: string;
  playerId: string;
  diceValues: number[];
  comboType: string;
  scoreEarned: number;
  timestamp: string;
}

interface SessionCardProps {
  session: SessionSummary;
  movements?: MovementDetail[];
}

const STATUS_COLOR: Record<string, string> = {
  finished: colors.secondary,
  playing: colors.accent,
  waiting: colors.text.muted,
  pairing: colors.primary,
};

const COMBO_COLOR: Record<string, string> = {
  triple: colors.accent,
  par: colors.primary,
  nada: colors.text.muted,
};

function formatDuration(start: string, end: string | null): string {
  if (!end) return '—';
  const secs = Math.round(
    (new Date(end).getTime() - new Date(start).getTime()) / 1000,
  );
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m ${secs % 60}s`;
}

/**
 * Tarjeta que muestra el resumen de una sesión de juego y,
 * opcionalmente, el detalle de sus movimientos.
 * Usada en el historial de partidas del dashboard web.
 */
export const SessionCard: React.FC<SessionCardProps> = ({ session, movements }) => {
  const statusColor = STATUS_COLOR[session.status] ?? colors.text.muted;

  return (
    <div style={styles.card}>
      {/* Cabecera */}
      <div style={styles.header}>
        <div>
          <span style={styles.sessionId}>
            Sesión #{session.id.slice(-8).toUpperCase()}
          </span>
          <span style={{ ...styles.badge, color: statusColor, borderColor: statusColor }}>
            {session.status.toUpperCase()}
          </span>
        </div>
        <span style={styles.timestamp}>
          {new Date(session.startTime).toLocaleString('es-ES')}
        </span>
      </div>

      {/* Estadísticas */}
      <div style={styles.statsRow}>
        <StatItem label="Jugadores" value={String(session.playerIds.length)} />
        <StatItem label="Movimientos" value={String(session.movementCount)} />
        <StatItem
          label="Duración"
          value={formatDuration(session.startTime, session.endTime)}
        />
      </div>

      {/* Tabla de movimientos (opcional) */}
      {movements && movements.length > 0 && (
        <div style={styles.movementsWrapper}>
          <p style={styles.movementsTitle}>Detalle de movimientos</p>
          <table style={styles.movTable}>
            <thead>
              <tr>
                <th style={styles.movTh}>Dados</th>
                <th style={styles.movTh}>Combo</th>
                <th style={styles.movTh}>Puntos</th>
                <th style={styles.movTh}>Hora</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((mov) => (
                <tr key={mov.id}>
                  <td style={styles.movTd}>
                    [{mov.diceValues.join(', ')}]
                  </td>
                  <td style={{ ...styles.movTd, color: COMBO_COLOR[mov.comboType] ?? colors.text.primary, fontWeight: 'bold' }}>
                    {mov.comboType}
                  </td>
                  <td style={{ ...styles.movTd, color: colors.text.success, fontWeight: 'bold' }}>
                    +{mov.scoreEarned}
                  </td>
                  <td style={{ ...styles.movTd, color: colors.text.muted }}>
                    {new Date(mov.timestamp).toLocaleTimeString('es-ES')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ─── Subcomponente interno ────────────────────────────────────────────────────

const StatItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={statStyles.item}>
    <span style={statStyles.label}>{label}</span>
    <span style={statStyles.value}>{value}</span>
  </div>
);

// ─── Estilos ─────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: colors.surface.card,
    border: `1px solid ${colors.surface.border}`,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  sessionId: {
    fontSize: typography.subheading.fontSize,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginRight: spacing.sm,
  },
  badge: {
    fontSize: typography.small.fontSize,
    fontWeight: 'bold',
    border: '1px solid',
    borderRadius: radius.sm,
    padding: `2px ${spacing.sm}px`,
    verticalAlign: 'middle',
  },
  timestamp: {
    fontSize: typography.caption.fontSize,
    color: colors.text.muted,
  },
  statsRow: {
    display: 'flex',
    gap: spacing.xl,
    marginBottom: spacing.md,
    flexWrap: 'wrap',
  },
  movementsWrapper: {
    marginTop: spacing.md,
    borderTop: `1px solid ${colors.surface.border}`,
    paddingTop: spacing.md,
  },
  movementsTitle: {
    fontSize: typography.caption.fontSize,
    color: colors.text.muted,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  movTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  movTh: {
    fontSize: typography.small.fontSize,
    color: colors.text.muted,
    textAlign: 'left',
    padding: `${spacing.xs}px ${spacing.sm}px`,
    borderBottom: `1px solid ${colors.surface.border}`,
  },
  movTd: {
    fontSize: typography.small.fontSize,
    color: colors.text.primary,
    padding: `${spacing.xs}px ${spacing.sm}px`,
    borderBottom: `1px solid ${colors.surface.border}`,
    fontFamily: 'monospace',
  },
};

const statStyles: Record<string, React.CSSProperties> = {
  item: { display: 'flex', flexDirection: 'column' },
  label: {
    fontSize: typography.label.fontSize,
    color: colors.text.muted,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  value: {
    fontSize: typography.body.fontSize,
    color: colors.text.secondary,
    fontWeight: 'bold',
  },
};
