import type { CSSProperties } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { Stage, wordFrame } from './kit';
import { COLUMN_NAMES, HAS_AND_LACKS, NEXT_STEPS, NEXT_STEPS_TITLE, REPORT, STRUCK } from './parts/data-b';
import { CaseStamp } from './parts/CaseStamp';
import { COLS } from './parts/Columns';

const S = 's11-informe';
const PANEL_TOP = 72;
const PANEL_H = 424;
const STRUCK_TOP = 514;

/** The three column names as a small strip: the same columns as s08, with «conclusión» lit. */
function Tabs({ on }: { on: number }) {
  const items = [
    { name: COLUMN_NAMES[0], color: COLS.obs.color, lit: false },
    { name: COLUMN_NAMES[1], color: COLS.hyp.color, lit: false },
    { name: COLUMN_NAMES[2], color: COLS.con.color, lit: true },
  ];
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, display: 'flex', gap: 16, fontFamily: FONT.sans, opacity: on, transform: `translateY(${(1 - on) * -10}px)` }}>
      {items.map((t) => (
        <div
          key={t.name}
          style={{
            padding: '6px 24px',
            borderRadius: RADIUS.pill,
            border: `3px ${t.lit ? 'solid' : 'dashed'} ${alpha(t.color, t.lit ? 0.9 : 0.5)}`,
            background: t.lit ? alpha(t.color, 0.14) : 'transparent',
            fontSize: 34,
            fontWeight: 800,
            color: t.lit ? t.color : alpha(t.color, 0.7),
            lineHeight: 1.2,
          }}
        >
          {t.name}
        </div>
      ))}
    </div>
  );
}

/** A phrase the report does not write, with a single line through it that draws from the left. */
function Struck({ text, on, strike, style }: { text: string; on: number; strike: number; style: CSSProperties }) {
  return (
    <div style={{ position: 'absolute', top: STRUCK_TOP, height: 84, display: 'flex', alignItems: 'center', fontFamily: FONT.sans, ...style, opacity: on, transform: `translateY(${(1 - on) * 12}px)` }}>
      <div style={{ position: 'relative', padding: '0 22px', fontSize: 48, fontWeight: 750, color: C.muted, whiteSpace: 'nowrap' }}>
        {`«${text}»`}
        <div style={{ position: 'absolute', left: 8, top: '52%', height: 5, width: `calc(${strike * 100}% - 16px)`, borderRadius: 3, background: C.textStrong }} />
      </div>
    </div>
  );
}

/**
 * s11-informe «Lo que escribes». The conclusion column of s08, empty until now, fills with the report in the three
 * beats the voice gives it (`para1`..`para3`); under it «siguientes pasos» with three boxes that stay unticked
 * (`next`); and at the sides, struck through, the two sentences the report does not write (`struck`).
 */
export function S11Informe(props: SceneProps) {
  const frame = useCurrentFrame();
  const askAt = props.cue('ask3');
  const paraAt = [props.cue('para1'), props.cue('para2'), props.cue('para3')];
  const nextAt = props.cue('next');
  const struckAt = props.cue('struck');

  const nadaAt = Math.max(struckAt + 6, wordFrame(S, 's11-06', 'nada') - 4);
  const robadoAt = Math.max(nadaAt + 16, wordFrame(S, 's11-06', 'robado') - 4);
  const hayAt = Math.max(robadoAt + 10, wordFrame(S, 's11-06', 'hay') - 6);

  const tabs = progress(frame, askAt - 4, 16);
  const panel = progress(frame, askAt, 18);
  const para = paraAt.map((t) => progress(frame, t - 2, 18));
  const next = progress(frame, nextAt - 2, 18);
  const nextItem = NEXT_STEPS.map((_, i) => progress(frame, nextAt + 8 + i * 10, 16));
  const struckOn = progress(frame, struckAt - 2, 16);
  const strike = [progress(frame, nadaAt, 16), progress(frame, robadoAt, 16)];
  const hay = progress(frame, hayAt, 18);

  return (
    <Stage>
      <Tabs on={tabs} />

      {/* the report: «conclusión» filled in */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: PANEL_TOP,
          width: 1120,
          height: PANEL_H,
          boxSizing: 'border-box',
          padding: '18px 36px',
          borderRadius: RADIUS.lg,
          border: `3px solid ${alpha(C.emerald, 0.75)}`,
          background: `linear-gradient(180deg, ${alpha(C.emerald, 0.08)} 0%, ${alpha(C.ink900, 0.96)} 60%)`,
          boxShadow: `0 0 28px ${alpha(C.emerald, 0.14)}`,
          fontFamily: FONT.sans,
          opacity: panel,
          transform: `translateY(${(1 - panel) * 16}px)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
          <span style={{ fontSize: 40, fontWeight: 850, color: C.emerald }}>{COLUMN_NAMES[2]}</span>
          <span style={{ fontSize: 30, fontWeight: 600, color: C.muted }}>lo que puedes afirmar</span>
        </div>
        <div style={{ marginTop: 12, fontSize: 32, fontWeight: 600, lineHeight: 1.28, color: C.textStrong }}>
          {REPORT.map((p, i) => (
            <p key={i} style={{ margin: i === 0 ? 0 : '12px 0 0', opacity: para[i], transform: `translateY(${(1 - para[i]) * 10}px)` }}>
              {p}
            </p>
          ))}
        </div>
      </div>

      {/* next steps, unticked */}
      <div
        style={{
          position: 'absolute',
          left: 1148,
          top: PANEL_TOP,
          width: 580,
          height: PANEL_H,
          boxSizing: 'border-box',
          padding: '18px 28px',
          borderRadius: RADIUS.lg,
          border: `3px solid ${alpha(C.cyan, 0.6)}`,
          background: alpha(C.ink850, 0.97),
          fontFamily: FONT.sans,
          opacity: next,
          transform: `translateY(${(1 - next) * 16}px)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 38, fontWeight: 850, color: C.cyanSoft }}>
          <Icon name="search" size={40} color={C.cyan} strokeWidth={2.2} />
          {NEXT_STEPS_TITLE}
        </div>
        <div style={{ marginTop: 18, display: 'grid', gap: 16 }}>
          {NEXT_STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, opacity: nextItem[i], transform: `translateX(${(1 - nextItem[i]) * 14}px)` }}>
              <div style={{ flexShrink: 0, width: 38, height: 38, marginTop: 2, borderRadius: 9, border: `3px solid ${C.ink500}` }} />
              <span style={{ fontSize: 32, fontWeight: 600, lineHeight: 1.22, color: C.text }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* what the report does not say */}
      <Struck text={STRUCK[0]} on={struckOn} strike={strike[0]} style={{ left: 0 }} />
      <Struck text={STRUCK[1]} on={struckOn} strike={strike[1]} style={{ right: 0 }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: STRUCK_TOP, height: 84, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.sans, fontSize: 40, fontWeight: 800, color: C.cyanSoft, opacity: hay }}>
        {HAS_AND_LACKS}
      </div>

      <CaseStamp frame={frame} />
    </Stage>
  );
}
