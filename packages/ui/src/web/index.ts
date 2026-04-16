// ─── Componentes web del dashboard administrativo ─────────────────────────────
// Usan React puro (sin React Native) con estilos inline basados en los tokens
// de packages/ui/src/tokens.ts para mantener consistencia visual.

export { LeaderboardTable } from './LeaderboardTable';
export type { LeaderboardEntry } from './LeaderboardTable';

export { SessionCard } from './SessionCard';
export type { SessionSummary, MovementDetail } from './SessionCard';
