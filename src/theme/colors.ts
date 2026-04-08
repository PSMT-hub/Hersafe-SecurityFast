/**
 * HERSAFE — Design Tokens (TypeScript)
 *
 * Use este objeto quando precisar de cores em contextos onde
 * className não é suportado (ex: StyleSheet.create, props de cor
 * de componentes nativos como Switch, StatusBar, etc.)
 *
 * Para className, use as classes Tailwind mapeadas no tailwind.config.js.
 */

export const colors = {
  // ── Backgrounds ───────────────────────────────────────────────
  bg:        '#121218',
  surface:   '#1C1C27',
  surface2:  '#252535',
  surface3:  '#2E2E42',

  // ── Primary (Violeta Proteção) ────────────────────────────────
  primary:       '#8B5CF6',
  primaryLight:  '#A78BFA',
  primaryDark:   '#6D28D9',
  primaryMuted:  '#3B1F6E',

  // ── Emergency (Rosa SOS) ─────────────────────────────────────
  emergency:       '#E91E8C',
  emergencyLight:  '#F472B6',
  emergencyDark:   '#BE185D',
  emergencyMuted:  '#4A0D2E',

  // ── Semantic (Status) ─────────────────────────────────────────
  safe:         '#10B981',
  safeMuted:    '#064E3B',
  warning:      '#F59E0B',
  warningMuted: '#451A00',
  danger:       '#EF4444',
  dangerMuted:  '#450A0A',

  // ── Text ─────────────────────────────────────────────────────
  text:        '#F0EFFE',
  textMuted:   '#9B98B8',
  textDim:     '#5C5A7A',
  textInverse: '#121218',

  // ── Border ───────────────────────────────────────────────────
  border:      '#2E2E42',
  borderFocus: '#8B5CF6',

  // ── Transparent ──────────────────────────────────────────────
  transparent: 'transparent',
} as const;

/** Tipo utilitário para usar os tokens em props tipadas */
export type ColorToken = keyof typeof colors;
