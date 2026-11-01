import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { AUTHORITY, BEAM, COLUMN_TITLES, CONTROLS, TRICK } from '../data/s10-estandar';
import { Beam, BEAM_ART } from './parts/s10-estandar/Beam';
import { Stage, wordFrame } from './kit';

const S = 's10-estandar';
const W = STAGE.width;
const LEFT_W = 1040;
const RIGHT_X = 1088;
const RIGHT_W = W - RIGHT_X;
const HEAD_H = 72;
const ROW_B = { top: 92, h: 176 };
const ROW_C = { top: 292, h: 128 };
const BEAM_TOP = 440;
const TILT_DEG = 6;

/** Column header: a tab with an icon and the column's name. */
function Header({ text, icon, tone, left, width, show }: { text: string; icon: 'shield' | 'bolt'; tone: string; left: number; width: number; show: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: 0,
        width,
        height: HEAD_H,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '0 28px',
        borderRadius: RADIUS.md,
        border: `3px solid ${alpha(tone, 0.8)}`,
        background: alpha(tone, 0.14),
        fontFamily: FONT.sans,
        fontSize: 46,
        fontWeight: 850,
        color: C.textStrong,
        opacity: show,
        transform: `translateY(${(1 - show) * -16}px)`,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name={icon} size={44} color={tone} strokeWidth={2.2} />
      {text}
    </div>
  );
}

/**
 * s10-estandar «La respuesta de libro». Two columns (`columns`): «práctica estándar» (cyan) and «ocurrencia» (amber, the
 * tempting one), with empty dashed slots waiting. `standard`: the lesson's three controls fill the left slots on their words.
 * `trick`: the right box (empty) gets «un truco propio»; a balance beam appears with a pile on each side. `authority`: the
 * third row (from another lesson) lands on the left and a second block joins the standard pile. `tilt`: the beam leans to
 * the left with «suele», and «siempre» is struck. `hedge`: it settles with a small sway: a rule of thumb, not a law.
 */
export function S10Estandar(props: SceneProps) {
  const frame = useCurrentFrame();
  const columnsAt = props.cue('columns') - 4;
  const standardAt = props.cue('standard') - 4;
  const trickAt = props.cue('trick') - 4;
  const authorityAt = props.cue('authority') - 4;
  const tiltAt = props.cue('tilt') - 4;
  const hedgeAt = props.cue('hedge') - 2;

  const ctlAt = CONTROLS.map((c) => Math.max(standardAt + 4, wordFrame(S, 's10-02', c.word) - 10));
  const truckAt = Math.max(trickAt + 4, wordFrame(S, 's10-03', 'truco') - 10);
  const listoAt = wordFrame(S, 's10-03', 'listo') - 4;
  const suelAt = Math.max(tiltAt + 2, wordFrame(S, 's10-05', 'suele') - 6);
  const siempreAt = Math.max(suelAt + 6, wordFrame(S, 's10-05', 'siempre') - 4);

  const headL = progress(frame, columnsAt, 16);
  const headR = progress(frame, columnsAt + 8, 16);
  const divider = progress(frame, columnsAt + 4, 24, EASE.inOut);

  const beamIn = progress(frame, trickAt + 6, 18);
  const extra = progress(frame, authorityAt + 8, 16);
  const tilt = progress(frame, tiltAt, 30, EASE.inOut);
  const dt = frame - hedgeAt;
  const sway = dt > 0 ? Math.sin((dt / 30) * 2 * Math.PI * 0.9) * Math.exp(-dt / 36) * 1.8 : 0;
  const angle = mix(0, TILT_DEG, tilt) + sway;

  const trickIn = progress(frame, truckAt, 14);
  const bolt = progress(frame, listoAt, 14);
  const authIn = progress(frame, authorityAt, 18);
  const labelsIn = progress(frame, suelAt, 14);
  const strike = progress(frame, siempreAt, 16);

  return (
    <Stage>
      <Header text={COLUMN_TITLES.standard} icon="shield" tone={C.cyan} left={0} width={LEFT_W} show={headL} />
      <Header text={COLUMN_TITLES.trick} icon="bolt" tone={C.amber} left={RIGHT_X} width={RIGHT_W} show={headR} />
      <div
        style={{
          position: 'absolute',
          left: LEFT_W + 24 - 1.5,
          top: 0,
          width: 3,
          height: ROW_C.top + ROW_C.h,
          background: alpha(C.ink600, 0.9),
          borderRadius: 2,
          transformOrigin: '0 0',
          transform: `scaleY(${divider})`,
        }}
      />

      {/* Row 2: the lesson's three controls, and the empty box of the trick */}
      {CONTROLS.map((c, i) => {
        const cw = (LEFT_W - 40) / 3;
        const left = i * (cw + 20);
        const slot = progress(frame, columnsAt + 12 + i * 5, 14);
        const on = progress(frame, ctlAt[i], 14);
        return (
          <div key={c.label}>
            <div
              style={{
                position: 'absolute',
                left,
                top: ROW_B.top,
                width: cw,
                height: ROW_B.h,
                boxSizing: 'border-box',
                borderRadius: RADIUS.lg,
                border: `3px dashed ${alpha(C.ink600, 0.9)}`,
                opacity: slot * (1 - on),
              }}
            />
            {on > 0.01 ? (
              <div
                style={{
                  position: 'absolute',
                  left,
                  top: ROW_B.top,
                  width: cw,
                  height: ROW_B.h,
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.lg,
                  border: `3px solid ${alpha(C.cyan, 0.85)}`,
                  background: `linear-gradient(180deg, ${alpha(C.cyan, 0.2)} 0%, ${alpha(C.ink900, 0.95)} 100%)`,
                  boxShadow: `0 0 ${Math.round(30 * on)}px ${alpha(C.cyan, 0.25)}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 14,
                  fontFamily: FONT.sans,
                  fontSize: 38,
                  fontWeight: 800,
                  color: C.textStrong,
                  whiteSpace: 'nowrap',
                  opacity: on,
                  transform: `translateY(${(1 - on) * 18}px)`,
                }}
              >
                <Icon name={c.icon} size={58} color={C.cyan} strokeWidth={2.1} />
                {c.label}
              </div>
            ) : null}
          </div>
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: RIGHT_X,
          top: ROW_B.top,
          width: RIGHT_W,
          height: ROW_B.h,
          boxSizing: 'border-box',
          borderRadius: RADIUS.lg,
          border: `3px dashed ${alpha(C.amber, 0.35 + 0.5 * trickIn)}`,
          background: alpha(C.amber, 0.03 + 0.07 * trickIn),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          fontFamily: FONT.sans,
          opacity: progress(frame, columnsAt + 16, 14),
        }}
      >
        <Icon name="bolt" size={56} color={C.amber} strokeWidth={2.1} style={{ opacity: 0.25 + 0.75 * Math.max(trickIn * 0.6, bolt) }} />
        <span style={{ fontSize: 40, fontWeight: 800, color: C.textStrong, opacity: trickIn, transform: `translateY(${(1 - trickIn) * 10}px)`, whiteSpace: 'nowrap' }}>{TRICK}</span>
      </div>

      {/* Row 3: the example from another lesson of the course */}
      {authIn > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: ROW_C.top,
            width: LEFT_W,
            height: ROW_C.h,
            boxSizing: 'border-box',
            borderRadius: RADIUS.lg,
            border: `3px solid ${alpha(C.sky, 0.85)}`,
            background: `linear-gradient(90deg, ${alpha(C.sky, 0.2)} 0%, ${alpha(C.ink900, 0.95)} 100%)`,
            boxShadow: `0 0 ${Math.round(30 * authIn)}px ${alpha(C.sky, 0.25)}`,
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            padding: '0 32px',
            fontFamily: FONT.sans,
            opacity: authIn,
            transform: `translateY(${(1 - authIn) * 18}px)`,
          }}
        >
          <Icon name="globe" size={68} color={C.sky} strokeWidth={2} />
          <div style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.22, color: C.textStrong, whiteSpace: 'nowrap' }}>
            <div>{AUTHORITY[0]}</div>
            <div style={{ color: C.text, fontWeight: 700 }}>{AUTHORITY[1]}</div>
          </div>
        </div>
      ) : null}

      {/* The beam: the standard weighs more, usually */}
      <div style={{ position: 'absolute', left: 0, top: BEAM_TOP, width: BEAM_ART.w, height: BEAM_ART.h }}>
        <Beam show={beamIn} extra={extra} angle={angle} />
        {labelsIn > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 6,
              width: BEAM_ART.w,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 28,
              fontFamily: FONT.sans,
              whiteSpace: 'nowrap',
              opacity: labelsIn,
              transform: `translateY(${(1 - labelsIn) * 12}px)`,
            }}
          >
            <span
              style={{
                padding: '0 30px',
                height: 64,
                lineHeight: '58px',
                boxSizing: 'border-box',
                borderRadius: RADIUS.pill,
                border: `3px solid ${C.cyan}`,
                background: alpha(C.cyan, 0.22),
                boxShadow: `0 0 28px ${alpha(C.cyan, 0.3)}`,
                fontSize: 46,
                fontWeight: 850,
                color: C.textStrong,
              }}
            >
              {BEAM.usually}
            </span>
            <span
              style={{
                position: 'relative',
                padding: '0 26px',
                height: 64,
                lineHeight: '58px',
                boxSizing: 'border-box',
                borderRadius: RADIUS.pill,
                border: `3px solid ${alpha(C.muted, 0.7)}`,
                fontSize: 42,
                fontWeight: 750,
                color: C.muted,
              }}
            >
              {BEAM.always}
              <svg width="100%" height="64" style={{ position: 'absolute', left: 0, top: -3, overflow: 'visible' }} viewBox="0 0 100 64" preserveAspectRatio="none">
                <line x1={4} y1={46} x2={4 + 92 * strike} y2={46 - 28 * strike} stroke={C.textStrong} strokeWidth={6} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </svg>
            </span>
          </div>
        ) : null}
      </div>
    </Stage>
  );
}
