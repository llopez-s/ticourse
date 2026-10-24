import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../../engine/src/ui';
import { OfficeBuilding, Page, Seal } from '../Art';
import { ImageTag, Pill } from '../Labels';
import { Leaflet } from '../Nursery';

/**
 * s02's three candidate cards and their art. A card is a 548×420 slot: header «candidata N», art (500×140), the exam
 * term in English (one or two lines), what it says in Spanish, and an extra row (the nursery's leaflet in card 1, the
 * two questions in card 3). Amber = said by the interested party, emerald = validated by someone outside.
 */
export const CARD_W = 548;
export const CARD_H = 420;
export const CARD_GAP = 42;

export interface CandidateDef {
  n: 1 | 2 | 3;
  term: readonly string[];
  say: string;
  tone: string;
}

export const CANDIDATES: readonly CandidateDef[] = [
  { n: 1, term: ['QUESTIONNAIRE'], say: 'lo dice ella', tone: C.amber },
  { n: 2, term: ['EVIDENCE OF', 'INTERNAL AUDITS'], say: 'lo escribe la interesada', tone: C.amber },
  { n: 3, term: ['INDEPENDENT', 'ASSESSMENT'], say: 'de fuera, sin vínculo con ella', tone: C.emerald },
];

/** The art of each candidate (500×140). `fill` 0–1 draws it in. */
function Art({ n, fill }: { n: 1 | 2 | 3; fill: number }) {
  const f = clamp01(fill);
  const box: CSSProperties = { position: 'relative', width: 500, height: 140, opacity: f, transform: `translateY(${(1 - f) * 12}px)` };
  if (n === 1) {
    return (
      <div style={box}>
        <div style={{ position: 'absolute', left: 24, top: 20 }}>
          <OfficeBuilding width={112} tone={C.amber} lit={0.6} />
        </div>
        <div style={{ position: 'absolute', left: 168, top: 46 }}>
          <Icon name="arrowRight" size={52} color={C.muted} strokeWidth={2.2} />
        </div>
        <div style={{ position: 'absolute', left: 250, top: 0 }}>
          <Page width={110} rows={5} ticks />
        </div>
      </div>
    );
  }
  if (n === 2) {
    return (
      <div style={box}>
        <div style={{ position: 'absolute', left: 24, top: 30 }}>
          <OfficeBuilding width={112} tone={C.amber} lit={0.6} />
        </div>
        <div style={{ position: 'absolute', left: 230, top: 8 }}>
          <Page width={104} rows={4} />
        </div>
        <svg width={500} height={140} viewBox="0 0 500 140" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <path d="M 150 80 H 214" fill="none" stroke={C.muted} strokeWidth={4} strokeLinecap="round" />
          <path d="M 206 70 L 218 80 L 206 90" fill="none" stroke={C.muted} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
          {/* the loop back to its author: the report returns to the one who wrote it */}
          <path d="M 300 14 C 300 -14 180 -14 100 14" fill="none" stroke={C.amber} strokeWidth={4.5} strokeLinecap="round" strokeDasharray="1 11" />
          <path d="M 108 2 L 98 16 L 116 18" fill="none" stroke={C.amber} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  return (
    <div style={box}>
      <div style={{ position: 'absolute', left: 0, top: 30 }}>
        <OfficeBuilding width={96} tone={C.emerald} lit={0.8} />
      </div>
      <div style={{ position: 'absolute', left: 100, top: 46 }}>
        <Icon name="arrowRight" size={44} color={C.muted} strokeWidth={2.2} />
      </div>
      <div style={{ position: 'absolute', left: 150, top: 0 }}>
        <Page width={92} rows={4} tone={C.emerald} />
      </div>
      <div style={{ position: 'absolute', left: 200, top: 70 }}>
        <Seal size={62} />
      </div>
    </div>
  );
}

/** «SOC 2 Type II» / «ISO 27001»: examples of the outside seal, on screen only (the voice never says them). */
export function SealTags({ on }: { on: number }) {
  const o = clamp01(on);
  if (o <= 0.01) return null;
  const tag = (t: string) => (
    <div style={{ height: 46, padding: '0 12px', display: 'inline-flex', alignItems: 'center', borderRadius: RADIUS.md, border: `2px solid ${alpha(C.emerald, 0.7)}`, background: alpha(C.emerald, 0.1), fontFamily: FONT.sans, fontSize: 27, fontWeight: 750, color: '#a7f3d0', whiteSpace: 'nowrap' }}>{t}</div>
  );
  return (
    <div style={{ position: 'absolute', left: 300, top: 84, display: 'flex', flexDirection: 'column', gap: 12, opacity: o, transform: `translateX(${(1 - o) * 14}px)` }}>
      {tag('SOC 2 Type II')}
      {tag('ISO 27001')}
    </div>
  );
}

/**
 * One candidate card. `slot` 0–1 shows the empty slot (dashed); `art`, `term`, `say` fill it (0–1 each); `focus` 0–1
 * brightens it; `extra` is the row at the bottom.
 */
export function CandidateCard({ def, slot, art, term, say, focus, extra, children }: { def: CandidateDef; slot: number; art: number; term: number; say: number; focus: number; extra?: ReactNode; children?: ReactNode }) {
  const s = clamp01(slot);
  if (s <= 0.01) return null;
  const f = clamp01(focus);
  const filled = clamp01(Math.max(art, term));
  return (
    <div
      style={{
        position: 'relative',
        width: CARD_W,
        height: CARD_H,
        boxSizing: 'border-box',
        borderRadius: 24,
        border: filled > 0.05 ? `3px solid ${alpha(def.tone, 0.4 + 0.5 * f)}` : `3px dashed ${alpha(C.muted, 0.5)}`,
        background: filled > 0.05 ? `linear-gradient(180deg, ${alpha(C.ink850, 0.96)} 0%, ${alpha(C.ink900, 0.96)} 100%)` : alpha(C.ink900, 0.5),
        boxShadow: filled > 0.05 && f > 0.1 ? `0 0 ${Math.round(34 * f)}px ${alpha(def.tone, 0.2 * f)}` : undefined,
        opacity: s * (0.72 + 0.28 * f),
        transform: `translateY(${(1 - s) * 22}px)`,
        fontFamily: FONT.sans,
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', left: 22, top: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 20, background: alpha(def.tone, 0.18), border: `2px solid ${alpha(def.tone, 0.8)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 900, color: def.tone }}>{def.n}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: C.muted }}>candidata</div>
      </div>
      <div style={{ position: 'absolute', left: 24, top: 68 }}>
        <Art n={def.n} fill={art} />
      </div>
      <div style={{ position: 'absolute', left: 24, top: 222, width: CARD_W - 48, opacity: clamp01(term), transform: `translateY(${(1 - clamp01(term)) * 10}px)` }}>
        {def.term.map((l) => (
          <div key={l} style={{ fontSize: 42, fontWeight: 900, letterSpacing: 0.5, lineHeight: 1.1, color: def.tone === C.amber ? C.amber : '#6ee7b7', whiteSpace: 'nowrap' }}>
            {l}
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 24, top: 320, width: CARD_W - 48, fontSize: 34, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap', opacity: clamp01(say), transform: `translateY(${(1 - clamp01(say)) * 10}px)` }}>
        {def.say}
      </div>
      {extra ? <div style={{ position: 'absolute', left: 24, top: 360, width: CARD_W - 48 }}>{extra}</div> : null}
      {children}
    </div>
  );
}

/** Card 1's extra row: the nursery's leaflet, small, tagged as an image and not a fact of the port. */
export function NurseryNote({ on }: { on: number }) {
  const o = clamp01(on);
  if (o <= 0.01) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: o, transform: `translateY(${(1 - o) * 10}px)` }}>
      <Leaflet width={78} />
      <ImageTag size={26} />
    </div>
  );
}

/** Card 3's extra row: the two questions that go with an independent report. */
export function ScopeQuestions({ show, cubre, meses }: { show: number; cubre: number; meses: number }) {
  const o = clamp01(show);
  if (o <= 0.01) return null;
  return (
    <div style={{ display: 'flex', gap: 14, opacity: o, transform: `translateY(${(1 - o) * 10}px)` }}>
      <Pill text="¿qué cubre?" tone={C.emerald} on={cubre} size={30} height={52} style={{ padding: '0 22px', opacity: clamp01(0.45 + cubre) }} />
      <Pill text="¿qué meses?" tone={C.emerald} on={meses} size={30} height={52} style={{ padding: '0 22px', opacity: clamp01(0.45 + meses) }} />
    </div>
  );
}
