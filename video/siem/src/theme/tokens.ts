/**
 * Visual language of the SIEM video. Colours come from the IntelForge app
 * (src/index.css + Tailwind palette) and each accent has ONE meaning:
 *   cyan    → data / the SIEM itself
 *   violet  → exam (matches the app's "Nota de examen" callout)
 *   amber   → noise, fatigue, warnings
 *   rose    → attacker, critical, blind spots
 *   emerald → validated, contained, healthy
 */
export const C = {
  ink950: '#070b14',
  ink900: '#0c1322',
  ink850: '#101a2d',
  ink800: '#142036',
  ink700: '#1d2d4a',
  ink600: '#2b4068',
  ink500: '#3b5585',

  textStrong: '#f8fafc',
  text: '#e2e8f0',
  muted: '#94a3b8',
  faint: '#64748b',

  cyan: '#22d3ee',
  cyanSoft: '#67e8f9',
  cyanDeep: '#0e7490',
  violet: '#a78bfa',
  violetStrong: '#8b5cf6',
  violetDeep: '#2e1065',
  amber: '#fbbf24',
  amberDeep: '#78350f',
  rose: '#f43f5e',
  roseSoft: '#fb7185',
  roseDeep: '#4c0519',
  emerald: '#34d399',
  emeraldDeep: '#064e3b',
  sky: '#38bdf8',
} as const;

export type Accent = 'cyan' | 'violet' | 'amber' | 'rose' | 'emerald' | 'muted';

export const ACCENT: Record<Accent, { fg: string; soft: string; deep: string }> = {
  cyan: { fg: C.cyan, soft: C.cyanSoft, deep: C.cyanDeep },
  violet: { fg: C.violet, soft: '#c4b5fd', deep: C.violetDeep },
  amber: { fg: C.amber, soft: '#fcd34d', deep: C.amberDeep },
  rose: { fg: C.rose, soft: C.roseSoft, deep: C.roseDeep },
  emerald: { fg: C.emerald, soft: '#6ee7b7', deep: C.emeraldDeep },
  muted: { fg: C.muted, soft: C.text, deep: C.ink700 },
};

/** Hex colour + alpha (0–1) → #rrggbbaa. */
export function alpha(hex: string, a: number): string {
  const v = Math.round(Math.max(0, Math.min(1, a)) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex.slice(0, 7)}${v}`;
}

export const FONT = {
  sans: '"IF Inter", "Segoe UI", Arial, sans-serif',
  mono: '"IF JetBrains Mono", Consolas, "Courier New", monospace',
} as const;

/**
 * Type scale in px at 1920×1080. The lesson player shows the video at ~896 CSS
 * px wide, so anything the narration points at must be ≥ 32 px; pure texture
 * (streaming log lines) may go down to 22 px.
 */
export const TYPE = {
  hero: 104,
  h1: 76,
  h2: 58,
  h3: 46,
  body: 38,
  label: 32,
  small: 26,
  micro: 22,
} as const;

/**
 * Layout zones (px). Scenes draw ONLY inside STAGE (y 190–850). The top band
 * (y 0–170) belongs to the chrome: chapter rail + scene title on the left,
 * simulation tag / exam card on the right. Captions own y 872–1046 and the
 * progress bar sits at the very bottom.
 */
export const LAYOUT = {
  width: 1920,
  height: 1080,
  marginX: 96,
  topBarHeight: 170,
  stage: { top: 190, bottom: 850, left: 96, right: 1824 },
  captions: { top: 872, bottom: 1046 },
  progressY: 1072,
} as const;

export const STAGE = {
  top: LAYOUT.stage.top,
  left: LAYOUT.stage.left,
  width: LAYOUT.stage.right - LAYOUT.stage.left,
  height: LAYOUT.stage.bottom - LAYOUT.stage.top,
} as const;

export const RADIUS = { sm: 10, md: 16, lg: 24, pill: 999 } as const;
