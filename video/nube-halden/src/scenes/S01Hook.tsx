import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { PLAQUE, PROMISE, STAMP, TITLE } from '../data/s01-hook';
import { APP, AppWindow, ROW_Y, WIN } from './parts/AppWindow';
import { CHIP_H, CaseStamp, PlaqueChip, Pill } from './parts/Labels';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;
/** The window before the title (big, centred) and after it (left, under the title). */
const BIG = { w: 820, x: (W - 820) / 2, y: 76 } as const;
const SMALL = { w: 660, x: 170, y: 198 } as const;
const CHIP_X = 980;
const TITLE_TOP = 74;
const TITLE_SIZE = 100;

/**
 * s01-hook «Tres decisiones antes de estrenar». The proposal stamp from the first frame. On `app` the new
 * application's window comes in, empty and nameless, with three unticked boxes; on `cloud` the cloud rises behind it.
 * Before 12 s the window glides left and shrinks, «Construir en la nube» lands on top with «SY0-701 · 3.1», and the
 * promise comes as one chip per box, each lit on its word (plantilla · función · piezas). On «ganas» every chip gets
 * an emerald tick disc and on «arriesgas» an amber alert disc: something to gain and something to risk in each.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const appAt = props.cue('app');
  const cloudAt = wordFrame(S, 's01-01', 'nube.') - 8;
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const chipAt = PROMISE.map((p) => wordFrame(S, 's01-02', p.word) - 6);
  const gainAt = wordFrame(S, 's01-02', 'ganas') - 4;
  const riskAt = wordFrame(S, 's01-02', 'arriesgas.') - 4;

  const stampIn = enter(frame, -6, { distance: 16, duration: 16 });
  const winIn = enter(frame, appAt - 6, { distance: 24, duration: 18 });
  const glide = progress(frame, titleAt - 16, 30, EASE.inOut);
  const ww = mix(BIG.w, SMALL.w, glide);
  const wx = mix(BIG.x, SMALL.x, glide);
  const wy = mix(BIG.y, SMALL.y, glide);
  const k = ww / APP.w;
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const plaqueIn = enter(frame, titleAt + 4, { distance: 14, duration: 16 });
  const lastChip = chipAt.length - 1;
  const lit = chipAt.map((at, i) => progress(frame, at, 10) * (1 - (i < lastChip ? 0.6 * progress(frame, chipAt[i + 1] - 2, 10) : 0)) * (1 - 0.5 * progress(frame, gainAt - 6, 12)));

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...stampIn }}>
        <CaseStamp what={STAMP.what} kind={STAMP.kind} />
      </div>
      {frame >= titleAt ? (
        <div style={{ position: 'absolute', right: 0, top: 5, ...plaqueIn }}>
          <PlaqueChip text={PLAQUE} />
        </div>
      ) : null}

      {/* The new application: faint from the first frame (never an empty stage), full on `app`. */}
      <div style={{ position: 'absolute', left: wx, top: wy, opacity: 0.25 + 0.75 * winIn.opacity, transform: winIn.transform }}>
        <AppWindow width={ww} cloud={progress(frame, cloudAt, 22)} glow={0.3 * progress(frame, appAt, 14)} lit={lit} />
      </div>

      {/* The promise: one chip per box, tied to it by a dashed line */}
      <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {PROMISE.map((_, i) => {
          const show = progress(frame, chipAt[i] - 4, 12);
          if (show <= 0.01) return null;
          const y = wy + ROW_Y[i] * k;
          const x1 = wx + (WIN.x + WIN.w + 8) * k;
          return <line key={i} x1={x1} y1={y} x2={x1 + (CHIP_X - 16 - x1) * show} y2={y} stroke={alpha(C.cyan, 0.55)} strokeWidth={3} strokeDasharray="10 8" />;
        })}
      </svg>
      {PROMISE.map((p, i) => {
        if (frame < chipAt[i] - 2) return null;
        const y = SMALL.y + ROW_Y[i] * (SMALL.w / APP.w);
        const gain = progress(frame, gainAt + i * 4, 10);
        const risk = progress(frame, riskAt + i * 4, 10);
        return (
          <div key={p.text} style={{ position: 'absolute', left: CHIP_X, top: y - CHIP_H / 2, display: 'flex', alignItems: 'center', gap: 16, ...enter(frame, chipAt[i], { distance: 16 }) }}>
            <Pill text={p.text} tone={C.cyan} on={0.3 + 0.7 * Math.max(lit[i], 0.4 * gain)} size={38} />
            <Disc icon="check" tone={C.emerald} show={gain} />
            <Disc icon="alert" tone={C.amber} show={risk} />
          </div>
        );
      })}

      {/* The title */}
      {frame >= titleAt - 2 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: TITLE_TOP,
            width: W,
            textAlign: 'center',
            fontFamily: FONT.sans,
            fontSize: TITLE_SIZE,
            fontWeight: 900,
            letterSpacing: -2,
            lineHeight: 1.04,
            color: C.textStrong,
            whiteSpace: 'nowrap',
            textShadow: `0 0 30px ${alpha(C.sky, 0.2)}`,
            ...titleIn,
          }}
        >
          {TITLE[0]}
          <span style={{ color: C.sky }}>{TITLE[1]}</span>
        </div>
      ) : null}
    </Stage>
  );
}

/** A small round disc with an icon (the gain / the risk next to each decision). */
function Disc({ icon, tone, show }: { icon: 'check' | 'alert'; tone: string; show: number }) {
  if (show <= 0.01) return null;
  return (
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: 26,
        display: 'grid',
        placeItems: 'center',
        background: alpha(tone, 0.14),
        border: `3px solid ${alpha(tone, 0.8)}`,
        opacity: show,
        transform: `scale(${0.7 + 0.3 * show})`,
      }}
    >
      <Icon name={icon} size={30} color={tone} strokeWidth={2.4} />
    </div>
  );
}
