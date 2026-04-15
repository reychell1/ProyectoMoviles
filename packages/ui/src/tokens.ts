/**
 * Design tokens compartidos para toda la app Dado Triple.
 *
 * Los colores base están alineados con packages/tailwind-config/tailwind.config.ts
 * para mantener consistencia visual entre web (Tailwind CSS) y mobile (StyleSheet).
 *
 * En el frontend web pueden importarse estos valores directamente para usarlos
 * como variables CSS o como utilidades de Tailwind vía `safelist`.
 */

// ─── Paleta de colores ───────────────────────────────────────────────────────

export const colors = {
  // Colores de marca (alineados con tailwind-config)
  primary:   '#3b82f6',  // blue-500   → botones principales
  secondary: '#10b981',  // emerald-500 → victorias / éxito
  accent:    '#f59e0b',  // amber-500  → descanso (bye) / advertencia
  danger:    '#ef4444',  // red-500    → derrotas / peligro

  // Superficies oscuras (slate)
  surface: {
    bg:      '#0f172a',  // slate-900  → fondo raíz
    card:    '#1e293b',  // slate-800  → tarjetas / paneles
    border:  '#334155',  // slate-700  → bordes neutros
    muted:   '#475569',  // slate-600  → bordes deshabilitados
  },

  // Texto
  text: {
    primary:   '#ffffff',
    secondary: '#94a3b8',  // slate-400
    muted:     '#64748b',  // slate-500
    success:   '#34d399',  // emerald-400 → mi puntuación
    warning:   '#fbbf24',  // amber-400  → espera / bye
    warningLight: '#fde68a', // amber-200
  },

  // Estados de resultado de ronda
  result: {
    winBg:      '#064e3b',  // emerald-900
    winBorder:  '#10b981',  // emerald-500
    loseBg:     '#450a0a',  // red-900
    loseBorder: '#ef4444',  // red-500
    drawBg:     '#334155',  // slate-700
  },

  // Colores especiales
  white: '#ffffff',
  dieBackground: '#ffffff',
  dieForeground: '#0f172a',  // texto sobre dado blanco

  // Oponente
  opponent: {
    border:  '#b91c1c',  // red-700
    label:   '#f87171',  // red-400
    score:   '#fca5a5',  // red-300
  },
} as const;

// ─── Espaciado ───────────────────────────────────────────────────────────────

export const spacing = {
  xs:   4,
  sm:   8,
  md:  12,
  lg:  16,
  xl:  24,
  xxl: 32,
} as const;

// ─── Radio de borde ──────────────────────────────────────────────────────────

export const radius = {
  sm:   8,
  md:  12,
  lg:  16,
  xl:  24,
  full: 999,
} as const;

// ─── Tipografía ──────────────────────────────────────────────────────────────

export const typography = {
  appTitle:   { fontSize: 36, fontWeight: 'bold'  as const },
  sectionTitle:{ fontSize: 22, fontWeight: 'bold'  as const },
  heading:    { fontSize: 20, fontWeight: 'bold'  as const },
  subheading: { fontSize: 17, fontWeight: 'bold'  as const },
  body:       { fontSize: 15 },
  caption:    { fontSize: 13 },
  label:      { fontSize: 10, letterSpacing: 2 },
  small:      { fontSize: 11 },
  // Números grandes (scores, dados)
  scoreXL:    { fontSize: 40, fontWeight: '900' as const },
  dieValue:   { fontSize: 28, fontWeight: '900' as const },
  btnLabel:   { fontSize: 18, fontWeight: '900' as const, letterSpacing: 2 },
} as const;

// ─── Tamaños de dado ─────────────────────────────────────────────────────────

export const dieSize = 64 as const;
