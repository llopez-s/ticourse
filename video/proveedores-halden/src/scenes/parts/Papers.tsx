import type { ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01, type IconName } from '../../../../engine/src/ui';
import { OTHERS } from '../../data/canon';

/**
 * The four papers of the agency (s06 tiles, s08 icon) and the chip of the papers for what is not buying (s06; s07 brings
 * it back with MOA lit). The MSA is never drawn as an umbrella (the folded umbrella is another video's image): it is a
 * text label and a flat «cover» band that its SOW hangs from.
 */

export type PaperKey = 'nda' | 'msa' | 'sow' | 'sla';

export interface PaperLine {
  text: string;
  /** The narration segment and word that light the line (none = with the acronym). */
  seg?: string;
  word?: string;
  /** Frames after the word (for a screen-only line that follows a spoken one). */
  lag?: number;
}

export interface PaperDef {
  key: PaperKey;
  sigla: string;
  /** Exam term, English, small under the acronym. */
  term: string;
  icon: IconName;
  /** What the paper fixes (the storyboard's text, verbatim, split at its own colons and dots). */
  lines: readonly PaperLine[];
  /** Cue that brings the tile in. */
  cue: string;
  /** Segment and word of the acronym. */
  seg: string;
  /** Extra word shown beside the acronym (the SOW's «o WO»). */
  alias?: string;
}

export const PAPERS: readonly PaperDef[] = [
  {
    key: 'nda',
    sigla: 'NDA',
    term: 'non-disclosure agreement',
    icon: 'lock',
    cue: 'nda',
    seg: 's06-01',
    lines: [{ text: 'confidencialidad', seg: 's06-01', word: 'confidencialidad' }, { text: 'antes de enseñar nada', seg: 's06-01', word: 'documento', lag: 4 }],
  },
  {
    key: 'msa',
    sigla: 'MSA',
    term: 'master service agreement',
    icon: 'layers',
    cue: 'msa',
    seg: 's06-02',
    lines: [
      { text: 'el paraguas:', seg: 's06-02', word: 'paraguas' },
      { text: 'responsabilidad,', seg: 's06-02', word: 'responsabilidad' },
      { text: 'pagos, ley aplicable', seg: 's06-02', word: 'pagos' },
      { text: 'se firma una vez', seg: 's06-02', word: 'aplicable', lag: 16 },
    ],
  },
  {
    key: 'sow',
    sigla: 'SOW',
    term: 'statement of work',
    icon: 'file',
    cue: 'sow',
    seg: 's06-03',
    alias: 'o WO',
    lines: [
      { text: 'la traducción de las', seg: 's06-03', word: 'traducción' },
      { text: 'instrucciones de', seg: 's06-03', word: 'instrucciones' },
      { text: 'embarque:', seg: 's06-03', word: 'embarque' },
      { text: 'entregables, fechas,', seg: 's06-03', word: 'entregables' },
      { text: 'aceptación', seg: 's06-03', word: 'fechas', lag: 12 },
    ],
  },
  {
    key: 'sla',
    sigla: 'SLA',
    term: 'service level agreement',
    icon: 'clock',
    cue: 'sla',
    seg: 's06-04',
    lines: [
      { text: 'urgentes en 24 h', seg: 's06-04', word: 'urgentes' },
      { text: 'si no, descuento', seg: 's06-04', word: 'descuento' },
      { text: 'en la factura', seg: 's06-04', word: 'factura' },
    ],
  },
];

/** One segment of the chip: the acronym bold, then its meaning. `on` 0–1 brightens it; `tone` colours the border. */
function Seg({ sigla, text, on, tone, size }: { sigla: string; text: string; on: number; tone: string; size: number }) {
  const o = clamp01(on);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        height: Math.round(size * 1.75),
        padding: '0 26px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(tone, 0.35 + 0.55 * o)}`,
        background: alpha(tone, 0.05 + 0.13 * o),
        boxShadow: o > 0.6 ? `0 0 ${Math.round(20 * o)}px ${alpha(tone, 0.32 * o)}` : undefined,
        fontFamily: FONT.sans,
        fontSize: size,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        opacity: 0.45 + 0.55 * o,
      }}
    >
      <span style={{ fontWeight: 900, color: tone === C.muted ? C.text : tone }}>{sigla}:</span>
      <span style={{ fontWeight: 650 }}>{text}</span>
    </div>
  );
}

/**
 * «MOU: intención · MOA: compromisos repartidos · BPA: socios que reparten el negocio». `on` lights each segment (0–1);
 * with `focus` set to a key, only that one is lit (emerald) and the rest step back.
 */
export function OthersChip({ on = [1, 1, 1], focus, size = 32, caption = true }: { on?: readonly number[]; focus?: { key: (typeof OTHERS)[number]['key']; amount: number }; size?: number; caption?: boolean }): ReactNode {
  const f = focus ? clamp01(focus.amount) : 0;
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, fontFamily: FONT.sans }}>
      {caption ? (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: 28, fontWeight: 750, color: C.muted, whiteSpace: 'nowrap' }}>
          <Icon name="link" size={28} color={C.muted} />
          para lo que no es comprar
        </div>
      ) : null}
      <div style={{ display: 'inline-flex', gap: 18, alignItems: 'center' }}>
        {OTHERS.map((o, i) => {
          const isFocus = focus && focus.key === o.key;
          const amount = focus ? (isFocus ? 1 : 1 - 0.65 * f) * (on[i] ?? 1) : (on[i] ?? 1);
          return <Seg key={o.key} sigla={o.sigla} text={o.text} on={amount} tone={isFocus && f > 0.05 ? C.emerald : C.sky} size={size} />;
        })}
      </div>
    </div>
  );
}
