import type { ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { NOTE_1, NOTE_2, SHEET_TAG } from '../../data/s03-fuente';
import { PAPER, Sheet } from './Paper';

/** A note of the lesson's examples (s03): 800 x 280, a sentence, and the two-box template «quién lo dice» | «qué pruebas trae». */
export const NOTE_BOX = { w: 800, h: 280 } as const;
/** Where the first word of note 1 sits (so a ring can be drawn round it), in note coordinates. */
export const VENDOR_WORD = { x: 28, w: 226, cy: 47, h: 62 } as const;
export const STRIKE_BOX = { x: 12, y: 12, w: NOTE_BOX.w - 24, h: 256 } as const;

const BOX = { x: 28, w: 360, y: 128, h: 112, gap: 24 } as const;
const PROOFS_X = BOX.x + BOX.w + BOX.gap;

function TemplateBox({ x, y, label, tone, dashed = false, dim = 0, children, lift = 0 }: { x: number; y: number; label: string; tone: string; dashed?: boolean; dim?: number; children?: ReactNode; lift?: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: BOX.w,
        height: BOX.h,
        boxSizing: 'border-box',
        padding: '10px 18px',
        borderRadius: 14,
        border: `3px ${dashed ? 'dashed' : 'solid'} ${alpha(tone, 0.8)}`,
        background: lift > 0 ? `linear-gradient(${alpha(tone, 0.2)}, ${alpha(tone, 0.2)}), ${PAPER.top}` : alpha(tone, 0.1),
        boxShadow: lift > 0.01 ? `0 10px 24px ${alpha('#000000', 0.35)}` : undefined,
        opacity: 1 - 0.55 * dim,
      }}
    >
      <div style={{ fontSize: 32, fontWeight: 750, lineHeight: 1.1, color: PAPER.inkSoft, whiteSpace: 'nowrap' }}>{label}</div>
      <div style={{ marginTop: 6, fontSize: 34, fontWeight: 850, lineHeight: 1.15, color: PAPER.ink, whiteSpace: 'nowrap' }}>{children}</div>
    </div>
  );
}

/**
 * One example note. kind 1: «VendorCo lo atribuye a APT-Z» (+ «Lo dice X, luego es verdad» on `formula`); kind 2: «Ese informe
 * viene de un vendor pequeño, ignóralo» (+ «la evidencia era buena» on `aside`).
 *   whoIn     0-1  the box «quién lo dice» comes in on the left
 *   slide     0-1  it slides over «qué pruebas trae»: the source takes the place of the evidence
 *   overlay   drawn in note coordinates on top (the pen's strokes)
 */
export function Note({ kind, formula = 0, aside = 0, whoIn = 0, slide = 0, glow = 0, dim = 0, overlay }: { kind: 1 | 2; formula?: number; aside?: number; whoIn?: number; slide?: number; glow?: number; dim?: number; overlay?: ReactNode }) {
  const note = kind === 1 ? NOTE_1 : NOTE_2;
  const whoX = BOX.x + (PROOFS_X - BOX.x - 10) * slide;
  const whoY = BOX.y - 10 * slide;
  return (
    <div style={{ position: 'relative', width: NOTE_BOX.w, height: NOTE_BOX.h, fontFamily: FONT.sans }}>
      <Sheet width={NOTE_BOX.w} height={NOTE_BOX.h} glow={glow} dim={dim} tone={C.sky}>
        {/* the sentence */}
        {kind === 1 ? (
          <>
            <div style={{ position: 'absolute', left: VENDOR_WORD.x, top: 20, fontSize: 44, fontWeight: 850, letterSpacing: -0.6, lineHeight: 1.2, color: PAPER.ink, whiteSpace: 'nowrap' }}>
              <span style={{ display: 'inline-block', width: VENDOR_WORD.w }}>{NOTE_1.vendor}</span>
              <span style={{ marginLeft: 8 }}>{NOTE_1.sentence.slice(NOTE_1.vendor.length + 1)}</span>
            </div>
            <div style={{ position: 'absolute', left: 28, top: 86, fontSize: 38, fontWeight: 750, color: C.cyanDeep, whiteSpace: 'nowrap', opacity: formula, transform: `translateY(${(1 - formula) * 8}px)` }}>
              «{NOTE_1.structure.join(' ')}»
            </div>
          </>
        ) : (
          <div style={{ position: 'absolute', left: 28, top: 14, fontSize: 44, fontWeight: 850, letterSpacing: -0.6, lineHeight: 1.18, color: PAPER.ink, whiteSpace: 'nowrap' }}>
            {NOTE_2.sentence.map((l) => (
              <div key={l}>{l}</div>
            ))}
          </div>
        )}

        {/* the template: evidence on the right, the source slides in from the left */}
        <TemplateBox x={PROOFS_X} y={BOX.y} label={note.proofs} tone={C.faint} dashed={kind === 1 || slide < 0.5} dim={0.5 * slide}>
          {kind === 2 ? <span style={{ fontSize: 28, fontWeight: 650, fontStyle: 'italic', color: C.emeraldDeep, opacity: aside }}>«{NOTE_2.aside}»</span> : null}
        </TemplateBox>
        {whoIn > 0.01 ? (
          <div style={{ opacity: whoIn, transform: `translateX(${(1 - whoIn) * -30}px)` }}>
            <TemplateBox x={whoX} y={whoY} label={note.who} tone={C.rose} lift={slide}>
              {note.whoText}
            </TemplateBox>
          </div>
        ) : null}

        <div style={{ position: 'absolute', right: 22, bottom: 5, fontSize: 22, fontWeight: 650, color: PAPER.inkSoft, whiteSpace: 'nowrap', opacity: 0.8 }}>{SHEET_TAG}</div>
      </Sheet>
      {overlay ? (
        <svg width={NOTE_BOX.w} height={NOTE_BOX.h} viewBox={`0 0 ${NOTE_BOX.w} ${NOTE_BOX.h}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }} aria-hidden>
          {overlay}
        </svg>
      ) : null}
    </div>
  );
}
