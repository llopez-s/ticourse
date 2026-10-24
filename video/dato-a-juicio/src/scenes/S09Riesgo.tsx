import { useCurrentFrame } from 'remotion';
import type { ReactNode } from 'react';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix, type IconName } from '../../../engine/src/ui';
import { Ghost, Spotlit } from './parts/Glyphs';
import { Stage, wordFrame } from './kit';

const S = 's09-riesgo';
const W = STAGE.width;

/** The lesson's table (src/data/s1.ts, «Riesgo: dónde encaja CTI»): factor, question and who answers it. */
const ROWS = [
  { factor: 'threat', q: '¿quién querría atacarnos y cómo opera?', a: 'CTI (tú)', icon: 'radar' as IconName },
  { factor: 'vulnerability', q: '¿dónde somos débiles?', a: 'gestión de vulnerabilidades', icon: 'search' as IconName },
  { factor: 'consequence', q: '¿qué perderíamos si ocurre?', a: 'negocio · BIA', icon: 'chart' as IconName },
] as const;
const ROW_TOP = [132, 236, 340] as const;
const ROW_H = 92;
const LOWER = 462;

/**
 * s09-riesgo «Quién responde a qué». The lesson's formula, «risk = f(threat × vulnerability × consequence)», opens the
 * scene big and low with three empty slots; the voice names each factor and its slot lights (`risk`). Then it goes up and
 * the lesson's table fills in row by row: «¿quién querría atacarnos y cómo opera?» with «CTI (tú)» (`who`, the row that
 * stays lit, no arrows), «¿dónde somos débiles?» with «gestión de vulnerabilidades» (`vuln`), «¿qué perderíamos si ocurre?» with
 * «negocio · BIA» (`cons`). Under it, on `evidence`, what CTI brings: «evidencia real: qué actores existen · a quién apuntan ·
 * cómo operan». On `ghosts` two figures, both errors: a struck ghost, «defenderse de fantasmas», and a lit figure,
 * «ignorar a quien sí va a por ti». It closes on «CTI alimenta un factor de tres».
 */
export function S09Riesgo(props: SceneProps) {
  const frame = useCurrentFrame();
  const risk = props.cue('risk');
  const who = props.cue('who');
  const vuln = props.cue('vuln');
  const cons = props.cue('cons');
  const evidence = props.cue('evidence');
  const ghosts = props.cue('ghosts');

  // ---- Formula.
  const slotAt = [wordFrame(S, 's09-01', 'amenaza', 1) - 8, wordFrame(S, 's09-01', 'vulnerabilidad') - 8, wordFrame(S, 's09-01', 'consecuencia') - 8];
  const formulaIn = enter(frame, risk, { distance: 0, duration: 18 });
  const up = progress(frame, wordFrame(S, 's09-02', 'Cada') - 10, 24, EASE.inOut);
  const formulaTop = mix(228, 4, up);
  const formulaScale = mix(1.1, 0.86, up);

  // ---- Table.
  const rowAt = [who - 4, vuln - 4, cons - 4];
  const hotRow = progress(frame, who, 14);
  const rowsDim = 0.72 * progress(frame, evidence - 4, 16);

  // ---- Lower zone: evidence → ghosts → close.
  const evIn = progress(frame, evidence, 16) * (1 - progress(frame, ghosts - 6, 14));
  const ghIn = progress(frame, ghosts, 16) * (1 - progress(frame, wordFrame(S, 's09-06', 'Alimentas') - 14, 14));
  const closeAt = wordFrame(S, 's09-06', 'Alimentas') - 10;
  const closeIn = progress(frame, closeAt, 16);
  const tableBack = progress(frame, ghosts - 4, 16);
  const tableDim = 0.82 * tableBack;

  return (
    <Stage>
      {/* Formula */}
      <div style={{ position: 'absolute', left: 0, top: formulaTop, width: W, display: 'flex', justifyContent: 'center', transform: `scale(${formulaScale})`, transformOrigin: '50% 0', fontFamily: FONT.sans, opacity: formulaIn.opacity }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: 60, fontWeight: 850, color: C.textStrong }}>
            <span style={{ color: C.roseSoft }}>risk</span> = f(
          </span>
          <Slot text="threat" at={slotAt[0]} frame={frame} tone={C.cyan} mine />
          <span style={{ fontSize: 56, fontWeight: 700, color: C.muted }}>×</span>
          <Slot text="vulnerability" at={slotAt[1]} frame={frame} tone={C.sky} />
          <span style={{ fontSize: 56, fontWeight: 700, color: C.muted }}>×</span>
          <Slot text="consequence" at={slotAt[2]} frame={frame} tone={C.sky} />
          <span style={{ fontSize: 60, fontWeight: 850, color: C.textStrong }}>)</span>
        </div>
      </div>

      {/* Table: filled row by row */}
      {ROWS.map((r, i) => {
        const p = progress(frame, rowAt[i], 16);
        if (p <= 0.001) return null;
        const mine = i === 0;
        const dim = mine ? tableDim * 0.35 : Math.max(rowsDim, tableDim);
        return (
          <div
            key={r.factor}
            style={{
              position: 'absolute',
              left: 0,
              top: ROW_TOP[i],
              width: W,
              height: ROW_H,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              gap: 28,
              padding: '0 34px',
              borderRadius: RADIUS.lg,
              border: `${mine ? 3 : 2}px solid ${alpha(mine ? C.cyan : C.sky, mine ? 0.55 + 0.4 * hotRow : 0.4)}`,
              background: `linear-gradient(90deg, ${alpha(mine ? C.cyan : C.sky, mine ? 0.06 + 0.1 * hotRow : 0.05)} 0%, ${alpha(C.ink900, 0.95)} 70%)`,
              boxShadow: mine ? `0 0 ${Math.round(38 * hotRow)}px ${alpha(C.cyan, 0.28 * hotRow)}` : undefined,
              fontFamily: FONT.sans,
              opacity: p * (1 - 0.6 * dim),
              filter: dim > 0.02 ? `saturate(${1 - 0.5 * dim})` : undefined,
              transform: `translateY(${(1 - p) * 18}px)`,
            }}
          >
            <span style={{ width: 250, fontSize: 32, fontWeight: 800, letterSpacing: 1, color: mine ? C.cyanSoft : '#7dd3fc', whiteSpace: 'nowrap' }}>{r.factor}</span>
            <span style={{ flex: 1, fontSize: 42, fontWeight: 700, color: C.textStrong, whiteSpace: 'nowrap' }}>{r.q}</span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 14,
                padding: '6px 28px 6px 18px',
                borderRadius: 999,
                border: `3px solid ${alpha(mine ? C.cyan : C.sky, 0.85)}`,
                background: alpha(mine ? C.cyan : C.sky, mine ? 0.18 : 0.1),
                fontSize: mine ? 46 : 38,
                fontWeight: 850,
                color: mine ? '#ecfeff' : '#e0f2fe',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon name={r.icon} size={mine ? 46 : 38} color={mine ? C.cyan : C.sky} strokeWidth={2.2} />
              {r.a}
            </span>
          </div>
        );
      })}

      {/* Evidence: what CTI brings */}
      {evIn > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: LOWER, width: W, opacity: evIn, transform: `translateY(${(1 - evIn) * 16}px)`, fontFamily: FONT.sans }}>
          <div style={{ textAlign: 'center', fontSize: 46, fontWeight: 850, color: C.cyanSoft, marginBottom: 18 }}>evidencia real</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 28 }}>
            {(
              [
                ['users', 'qué actores existen', 'actores'],
                ['target', 'a quién apuntan', 'apuntan'],
                ['gear', 'cómo operan', 'trabajan'],
              ] as [IconName, string, string][]
            ).map(([icon, text, word]) => {
              const p = progress(frame, wordFrame(S, 's09-04', word) - 10, 14);
              return (
                <span key={text} style={{ display: 'inline-flex', alignItems: 'center', gap: 16, padding: '12px 34px 12px 22px', borderRadius: 999, border: `3px solid ${alpha(C.cyan, 0.8)}`, background: alpha(C.cyan, 0.12), fontSize: 42, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap', opacity: p, transform: `translateY(${(1 - p) * 12}px)` }}>
                  <Icon name={icon} size={44} color={C.cyan} strokeWidth={2.2} />
                  {text}
                </span>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Ghosts: two errors */}
      {ghIn > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: LOWER - 16, width: W, display: 'flex', justifyContent: 'center', gap: 56, opacity: ghIn, transform: `translateY(${(1 - ghIn) * 16}px)`, fontFamily: FONT.sans }}>
          <Error show={progress(frame, ghosts + 4, 14)} strike={progress(frame, wordFrame(S, 's09-05', 'fantasmas') + 6, 14)} label="defenderse de fantasmas" art={<Ghost size={110} />} />
          <Error show={progress(frame, wordFrame(S, 's09-05', 'ignora') - 10, 14)} strike={progress(frame, wordFrame(S, 's09-05', 'ignora') + 14, 14)} label="ignorar a quien sí va a por ti" art={<Spotlit width={120} />} />
        </div>
      ) : null}

      {/* Close */}
      {closeIn > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: LOWER + 56, width: W, display: 'flex', justifyContent: 'center', opacity: closeIn, transform: `translateY(${(1 - closeIn) * 16}px)`, fontFamily: FONT.sans }}>
          <div style={{ padding: '22px 60px', borderRadius: RADIUS.lg, border: `4px solid ${alpha(C.cyan, 0.9)}`, background: `linear-gradient(180deg, ${alpha(C.cyan, 0.14)}, ${alpha(C.ink900, 0.96)})`, boxShadow: `0 0 50px ${alpha(C.cyan, 0.28)}`, whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 68, fontWeight: 850, letterSpacing: -1, color: C.textStrong }}>
              CTI alimenta <span style={{ color: C.cyanSoft }}>un factor</span> de tres
            </span>
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

/** An empty slot of the formula that fills with its factor's name when the voice says it. */
function Slot({ text, at, frame, tone, mine = false }: { text: string; at: number; frame: number; tone: string; mine?: boolean }) {
  const p = progress(frame, at, 14);
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 26px',
        borderRadius: RADIUS.md,
        border: `3px ${p > 0.5 ? 'solid' : 'dashed'} ${p > 0.5 ? alpha(tone, 0.9) : C.ink500}`,
        background: alpha(tone, 0.14 * p),
        boxShadow: p > 0.05 ? `0 0 ${Math.round(26 * p)}px ${alpha(tone, 0.4 * p)}` : undefined,
        fontSize: 48,
        fontWeight: 850,
        color: p > 0.5 ? (mine ? '#ecfeff' : '#e0f2fe') : alpha(C.faint, 0.0),
        minWidth: 120,
        textAlign: 'center',
      }}
    >
      {text}
    </span>
  );
}

function Error({ show, strike, label, art }: { show: number; strike: number; label: string; art: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '14px 40px 14px 28px', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.rose, 0.6)}`, background: alpha(C.roseDeep, 0.35), opacity: show, transform: `translateY(${(1 - show) * 14}px)` }}>
      <div style={{ position: 'relative', width: 130, display: 'grid', placeItems: 'center', opacity: 1 - 0.3 * strike }}>
        {art}
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', opacity: strike }}>
          <Icon name="x" size={110} color={C.rose} strokeWidth={2.6} />
        </div>
      </div>
      <span style={{ position: 'relative', fontSize: 44, fontWeight: 800, lineHeight: 1.15, color: C.text, whiteSpace: 'nowrap' }}>
        {label}
        <span style={{ position: 'absolute', left: 0, top: '52%', height: 6, width: `${strike * 100}%`, borderRadius: 3, background: C.rose }} />
      </span>
    </div>
  );
}
