import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, clamp01, mix, type IconName } from '../../../engine/src/ui';
import { LAYER } from '../data/case';
import { LEFT_END, PROMISE, RIGHT_END, TITLE } from '../data/s01-hook';
import { Device } from './parts/Net';
import { CaseStamp, PlaqueChip } from './parts/Tags';
import { GLYPH, WrapGlyph } from './parts/s02-envoltorios/Stack';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;

// ---- Upper band: stamp, plate, title, promise.
const STAMP_TOP = 0;
/** Until the title lands the stamp sits lower, over the empty upper half. */
const STAMP_TOP0 = 120;
const TITLE_TOP = 106;
const TITLE_SIZE = 96;
const CHIPS_TOP = 240;
const CHIP_H = 58;
const CHIP_GAP = 22;

// ---- Lower band: the two ends and the cable (stage coordinates).
const DEV = 116;
const DEV_Y = 400;
const CABLE_Y = DEV_Y + DEV / 2;
const END_W = 520;
const LEFT_CX = 230;
const RIGHT_CX = W - 260;
const CABLE_X0 = LEFT_CX + DEV / 2 + 8;
const CABLE_X1 = RIGHT_CX - DEV / 2 - 8;
const BUNDLE_CX = (CABLE_X0 + CABLE_X1) / 2;

function PromiseChip({ icon, text, on }: { icon: IconName; text: string; on: number }) {
  const o = clamp01(on);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        height: CHIP_H,
        padding: '0 24px 0 16px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(C.cyan, 0.4 + 0.5 * o)}`,
        background: alpha(C.ink950, 0.8),
        boxShadow: o > 0.02 ? `0 0 ${Math.round(22 * o)}px ${alpha(C.cyan, 0.3 * o)}` : undefined,
        fontFamily: FONT.sans,
        fontSize: 32,
        fontWeight: 750,
        color: C.textStrong,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name={icon} size={30} color={C.cyan} />
      <span>{text}</span>
    </div>
  );
}

/** One end of the request: device tile and its three on-screen lines (label, where, address). */
function End({ cx, icon, lines, mono, on, lit }: { cx: number; icon: IconName; lines: readonly string[]; mono: number; on: number; lit: number }) {
  return (
    <div style={{ position: 'absolute', left: cx - END_W / 2, top: DEV_Y, width: END_W, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: on }}>
      <Device icon={icon} tone={C.sky} size={DEV} on={0.25 + 0.75 * lit} />
      <div style={{ height: 14 }} />
      {lines.map((l, i) => (
        <div
          key={l}
          style={{
            fontFamily: i === mono ? FONT.mono : FONT.sans,
            fontSize: i === 0 ? 36 : 32,
            fontWeight: i === 0 ? 800 : 700,
            lineHeight: 1.2,
            color: i === 0 ? C.textStrong : i === mono ? C.cyanSoft : C.text,
            whiteSpace: 'nowrap',
          }}
        >
          {l}
        </div>
      ))}
    </div>
  );
}

/**
 * s01-hook «Un clic, tres envoltorios». The case stamp on an empty stage; at the bottom the puesto (left) and the
 * server of the «aplicación de expedientes» (right, far), joined by a cable. `click`: a cursor opens the app on the
 * puesto. `wraps`: a white block (the data) goes out onto the cable and three unnamed wraps close over it, one after
 * another (emerald, amber, cyan). Before 12 s (`title`) the plate and «De la trama al segmento» land above, and the
 * promise follows as three chips (`promise`), each on its words.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const clickAt = props.cue('click');
  const wrapsAt = props.cue('wraps');
  // Title before 12 s, whatever the voice does.
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const openAt = wordFrame(S, 's01-01', 'abre') - 4;
  const appAt = wordFrame(S, 's01-01', 'aplicación') - 4;
  const clicAt = Math.max(wrapsAt, wordFrame(S, 's01-01', 'clic') - 4);
  const outAt = wordFrame(S, 's01-01', 'sale') - 4;
  const wrapAt = wordFrame(S, 's01-01', 'envuelto') - 4;
  const chipAt = PROMISE.map((p, i) => {
    const at = wordFrame(S, 's01-02', p.word, p.nth) - 6;
    return i === 0 ? Math.max(at, props.cue('promise')) : at;
  });
  const lastWord = wordFrame(S, 's01-02', 'camino') + 16;

  // ---- The two ends and the cable.
  // Both ends and the cable are there from the first frame (dim); the server and the cable light on «aplicación».
  const leftOn = 1;
  const rightOn = 0.4 + 0.6 * progress(frame, appAt, 16);
  const cableLit = progress(frame, appAt + 6, 24, EASE.inOut);

  // ---- The click: the cursor glides onto the puesto's screen and presses.
  const cursorIn = progress(frame, clickAt - 20, 14);
  const glide = progress(frame, clickAt - 16, Math.max(12, openAt - clickAt + 10), EASE.inOut);
  const press = progress(frame, openAt, 4) * (1 - progress(frame, openAt + 6, 6));
  const ring = progress(frame, openAt + 2, 18);
  const cursorOut = progress(frame, openAt + 30, 14, EASE.inOut);
  const leftLit = progress(frame, openAt + 2, 10) * (1 - 0.5 * progress(frame, outAt + 10, 20, EASE.inOut));

  // ---- The data block leaves on «clic»/«sale» and gets wrapped three times on «envuelto tres veces».
  const dataOn = progress(frame, clicAt, 10);
  const travel = progress(frame, outAt, 34, EASE.inOut);
  const wrapOn = [0, 1, 2].map((i) => progress(frame, wrapAt + i * 10, 14, EASE.out));
  const glow = 0.4 + 0.4 * progress(frame, wrapAt + 30, 20) * (1 - 0.5 * progress(frame, titleAt, 20, EASE.inOut));
  const bundleX = mix(CABLE_X0 + 40, BUNDLE_CX, travel);
  const scale = mix(0.6, 1.35, travel);

  // ---- Upper band.
  const stampIn = enter(frame, -6, { distance: 16, duration: 16 });
  const stampTop = STAMP_TOP0 + (STAMP_TOP - STAMP_TOP0) * progress(frame, titleAt - 18, 26, EASE.inOut);
  const plaqueIn = enter(frame, titleAt - 4, { distance: 14, duration: 16 });
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const chipOn = PROMISE.map((_, i) => progress(frame, chipAt[i], 10) * (1 - 0.55 * progress(frame, (chipAt[i + 1] ?? lastWord) - 2, 12, EASE.inOut)));

  const cursorX = mix(LEFT_CX + 260, LEFT_CX + 14, glide);
  const cursorY = mix(DEV_Y + 210, DEV_Y + DEV / 2 - 6, glide);

  return (
    <Stage>
      {/* cable */}
      <svg width={W} height={STAGE.height} style={{ position: 'absolute', left: 0, top: 0 }}>
        <line x1={CABLE_X0} y1={CABLE_Y} x2={CABLE_X1} y2={CABLE_Y} stroke={alpha(C.sky, 0.25 + 0.4 * cableLit)} strokeWidth={4} strokeDasharray="14 10" strokeLinecap="round" />
      </svg>

      <End cx={LEFT_CX} icon={LEFT_END.icon} lines={LEFT_END.lines} mono={LEFT_END.mono} on={leftOn} lit={leftLit} />
      <End cx={RIGHT_CX} icon={RIGHT_END.icon} lines={RIGHT_END.lines} mono={RIGHT_END.mono} on={rightOn} lit={0.15} />

      {/* the click */}
      {ring > 0.01 && ring < 0.99 ? (
        <div
          style={{
            position: 'absolute',
            left: LEFT_CX - DEV / 2 - 30 * ring,
            top: DEV_Y - 30 * ring,
            width: DEV + 60 * ring,
            height: DEV + 60 * ring,
            boxSizing: 'border-box',
            borderRadius: 18 + 20 * ring,
            border: `3px solid ${alpha(C.cyan, 0.9 * (1 - ring))}`,
          }}
        />
      ) : null}
      {cursorIn > 0.01 && cursorOut < 0.99 ? (
        <div style={{ position: 'absolute', left: cursorX, top: cursorY, opacity: cursorIn * (1 - cursorOut), transform: `scale(${1 - 0.15 * press})`, transformOrigin: '0 0' }}>
          <Icon name="cursor" size={64} color={C.textStrong} strokeWidth={2.2} />
        </div>
      ) : null}

      {/* the bundle: data, then three wraps */}
      {dataOn > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: bundleX - GLYPH.w / 2,
            top: CABLE_Y - GLYPH.h / 2,
            transform: `scale(${scale})`,
            opacity: dataOn,
          }}
        >
          <WrapGlyph data={1} seg={wrapOn[0]} pkt={wrapOn[1]} frame={wrapOn[2]} glow={glow} />
        </div>
      ) : null}

      {/* case stamp */}
      <div style={{ position: 'absolute', left: 0, top: stampTop, ...stampIn }}>
        <CaseStamp />
      </div>

      {/* plate, title and promise */}
      {frame >= titleAt - 6 ? (
        <div style={{ position: 'absolute', right: 0, top: 14, ...plaqueIn }}>
          <PlaqueChip />
        </div>
      ) : null}
      {frame >= titleAt - 2 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: TITLE_TOP,
            fontFamily: FONT.sans,
            fontSize: TITLE_SIZE,
            fontWeight: 900,
            letterSpacing: -2,
            lineHeight: 1.1,
            whiteSpace: 'nowrap',
            textShadow: `0 4px 30px ${alpha(C.ink950, 0.9)}`,
            ...titleIn,
          }}
        >
          {TITLE.map((t) => (
            <span key={t.text} style={{ color: t.layer ? LAYER[t.layer].tone : C.textStrong, whiteSpace: 'pre' }}>
              {t.text}
            </span>
          ))}
        </div>
      ) : null}
      {/* chips keep their slots from the start (opacity 0 until their word), so nothing reflows */}
      <div style={{ position: 'absolute', left: 0, top: CHIPS_TOP, display: 'flex', gap: CHIP_GAP }}>
        {PROMISE.map((p, i) => (
          <div key={p.text} style={enter(frame, chipAt[i], { distance: 16 })}>
            <PromiseChip icon={p.icon} text={p.text} on={chipOn[i]} />
          </div>
        ))}
      </div>
    </Stage>
  );
}
