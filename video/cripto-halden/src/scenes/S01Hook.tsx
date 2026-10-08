import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { ACCENT, C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, dimStyle, mix } from '../../../engine/src/ui';
import { LATER, PROMISE, STAMP, STRIP, TITLE } from '../data/s01-hook';
import { TlsLine, tlsLayout } from './parts/TlsLine';
import { CONSOLE, CurlConsole, ROWS, printTimes } from './parts/s01-hook/CurlConsole';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;

// ---- Console: its bottom edge stays put; its top edge drops when the title arrives (the header covers the first rows).
const CON_X = (W - CONSOLE.width) / 2;
const CON_BOTTOM = 616;
const CON_TOP_A = 76;
const CON_TOP_B = 196;
/** Stage y of the console's content top (fixed: the text never moves, only the box's top edge). */
const CONTENT_TOP = CON_TOP_A + CONSOLE.headerH + 16;
const SSL_Y = CONTENT_TOP + ROWS.ssl;

// ---- The line (shared part), size 46 with the «SSL connection using» row: 1660 × 132.
const LINE_SIZE = 46;
const LINE = tlsLayout({ size: LINE_SIZE, prefix: true });
const LINE_X = Math.round((W - LINE.width) / 2);
/** Lifted out of curl's SSL row (its chip row on that row) to rest over the grey handshake. */
const LINE_Y_FROM = SSL_Y - LINE.rowY - 2;
/** Its bar's top edge sits on the first handshake row, so no half-covered grey text peeks over it. */
const LINE_Y_A = CONTENT_TOP + ROWS.handshake[0] + 6;
const LINE_Y_B = CON_TOP_B + CONSOLE.headerH + 10;
/** Parked in the bottom-right corner on `later`. */
const PARK_SCALE = 0.64;
const PARK_X = W - Math.round(LINE.width * PARK_SCALE) - 6;
const PARK_Y = 470;

// ---- Title block: at the top from `title`; slides towards the middle when the line parks.
const TITLE_TOP = 0;
const CHIPS_TOP = 96;
const TITLE_PARK_DY = 126;

/**
 * s01-hook «Una línea, cuatro piezas». Tuesday 3-11: the stamp «martes 3-11 ·
 * Autoridad Portuaria de Halden» and the strip «portal de reservas de
 * atraque» sit over a console, «prueba de conexión · desde fuera, como una
 * naviera». On `terminal` it types `curl -v https://reservas.haldenport.example/`
 * and the handshake scrolls past in grey, then curl's SSL line and, half-lit
 * and never read, the certificate lines. On `line` the SSL row glows and
 * the line lifts out of it at 46 px — the shared TlsLine, in canon order —
 * over the grey handshake. Before 12 s (`title`) the title lands at the top
 * and the console's top edge drops under it; the promise follows as three
 * chips, each on its words. On `pieces` the line comes apart into four chips
 * and each gets a «?» on «jeroglíficos»; on `later` the console goes, the
 * line parks in the bottom-right corner with «al final, la lees entera» and
 * the title block settles into the middle — the last frame.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const terminalAt = props.cue('terminal');
  const lineAt = props.cue('line');
  const titleCue = props.cue('title');
  const piecesAt = props.cue('pieces');
  const laterAt = props.cue('later');

  // ---- Console printing: from `terminal` until just before `line`.
  const times = printTimes(terminalAt + 2, lineAt - 6);
  const settle = progress(frame, -12, 20);

  // ---- Title before 12 s, whatever the voice does.
  const titleAt = Math.min(titleCue - 6, 12 * 30 - 22);
  const toB = progress(frame, titleAt - 12, 22, EASE.inOut);
  const conTop = mix(CON_TOP_A, CON_TOP_B, toB);

  // ---- The line: lifts on `line`, splits on `pieces`, «?» on «jeroglíficos», parks on `later`.
  // curl's row glows while the line lifts out of it, then settles as its half-lit source.
  const sslGlow = progress(frame, lineAt - 4, 10) * (1 - 0.65 * progress(frame, lineAt + 26, 20, EASE.inOut));
  const lift = progress(frame, lineAt + 2, 22, EASE.out);
  const split = progress(frame, piecesAt - 4, 16, EASE.inOut);
  const askAt = Math.max(piecesAt + 10, wordFrame(S, 's01-04', 'jeroglíficos') - 6);
  const ask = {
    tls: progress(frame, askAt, 10),
    x25519: progress(frame, askAt + 4, 10),
    suite: progress(frame, askAt + 8, 10),
    eckey: progress(frame, askAt + 12, 10),
  };
  const park = progress(frame, laterAt - 6, 26, EASE.inOut);
  const conOut = progress(frame, laterAt - 10, 16, EASE.inOut);
  const lineY = mix(mix(mix(LINE_Y_FROM, LINE_Y_A, lift), LINE_Y_B, toB), PARK_Y, park);
  const lineX = mix(LINE_X, PARK_X, park);
  const lineScale = mix(mix(0.9, 1, lift), PARK_SCALE, park);
  const noteIn = enter(frame, laterAt + 14, { distance: 18, axis: 'x' });

  // ---- Promise chips, one per thing the voice names.
  const chipAt = PROMISE.map((p) => wordFrame(S, 's01-03', p.word) - 6);
  const restDim = 0.5 * progress(frame, piecesAt - 4, 14, EASE.inOut) * (1 - park);
  const titleDy = TITLE_PARK_DY * park;

  return (
    <Stage>
      {/* Stamp and strip: Tuesday 3-11 at the port's booking portal (until the title arrives) */}
      {toB < 1 ? (
        <div style={{ position: 'absolute', left: CON_X, top: 0, display: 'flex', alignItems: 'center', gap: 18, opacity: settle * (1 - toB), fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 14,
              height: 58,
              padding: '0 24px 0 16px',
              boxSizing: 'border-box',
              borderRadius: RADIUS.md,
              border: `2px solid ${alpha(C.cyan, 0.7)}`,
              background: alpha(C.cyan, 0.1),
            }}
          >
            <Icon name="clock" size={34} color={C.cyan} />
            <span style={{ fontFamily: FONT.mono, fontSize: 34, fontWeight: 800, color: C.cyanSoft }}>{STAMP.day}</span>
            <span style={{ fontSize: 32, fontWeight: 700, color: C.faint }}>·</span>
            <span style={{ fontSize: 32, fontWeight: 750, color: C.textStrong }}>{STAMP.who}</span>
          </div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              height: 58,
              padding: '0 24px 0 16px',
              boxSizing: 'border-box',
              borderRadius: RADIUS.pill,
              border: `2px solid ${C.ink600}`,
              background: alpha(C.ink800, 0.9),
            }}
          >
            <Icon name="globe" size={32} color={C.sky} />
            <span style={{ fontSize: 32, fontWeight: 700, color: C.text }}>{STRIP}</span>
          </div>
        </div>
      ) : null}

      {/* Title */}
      {frame >= titleAt - 2 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: TITLE_TOP + titleDy,
            width: W,
            textAlign: 'center',
            fontFamily: FONT.sans,
            ...enter(frame, titleAt, { distance: 22, duration: 18 }),
          }}
        >
          <div style={{ ...dimStyle(restDim), fontSize: 66, fontWeight: 850, letterSpacing: -1.3, lineHeight: 1.08, color: C.textStrong, whiteSpace: 'nowrap' }}>
            <span style={{ color: C.cyan }}>{TITLE.lead}</span>
            {TITLE.rest}
          </div>
        </div>
      ) : null}

      {/* Promise: three chips */}
      {frame >= chipAt[0] - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: CHIPS_TOP + titleDy, width: W, display: 'flex', justifyContent: 'center', gap: 22, ...dimStyle(restDim) }}>
          {PROMISE.map((p, i) => {
            const a = ACCENT[p.accent];
            const e = enter(frame, chipAt[i], { distance: 16 });
            const lit = progress(frame, chipAt[i], 10) * (1 - 0.55 * progress(frame, (chipAt[i + 1] ?? piecesAt) - 2, 12, EASE.inOut));
            return (
              <div
                key={p.text}
                style={{
                  ...e,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  height: 62,
                  padding: '0 26px 0 18px',
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.pill,
                  border: `2px solid ${alpha(a.fg, 0.4 + 0.5 * lit)}`,
                  background: alpha(a.fg, 0.06 + 0.12 * lit),
                  boxShadow: lit > 0.02 ? `0 0 ${Math.round(22 * lit)}px ${alpha(a.fg, 0.3 * lit)}` : undefined,
                  fontFamily: FONT.sans,
                  fontSize: 36,
                  fontWeight: 750,
                  color: C.textStrong,
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon name={p.icon} size={34} color={a.fg} />
                {p.text}
              </div>
            );
          })}
        </div>
      ) : null}

      {/* The console */}
      {conOut < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: CON_X,
            top: conTop,
            opacity: settle * (1 - conOut),
            transform: `scale(${(0.985 + 0.015 * settle) * (1 - 0.03 * conOut)})`,
            transformOrigin: '50% 50%',
            ...dimStyle(0.35 * progress(frame, piecesAt - 4, 14)),
          }}
        >
          <CurlConsole
            height={CON_BOTTOM - conTop}
            contentY={CONTENT_TOP - conTop}
            frame={frame}
            times={times}
            sslGlow={sslGlow}
            textureDim={progress(frame, lineAt, 14)}
          />
        </div>
      ) : null}

      {/* The line */}
      {lift > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: lineX,
            top: lineY,
            opacity: Math.min(1, lift * 1.4),
            transform: `scale(${lineScale})`,
            transformOrigin: park > 0 ? '0 0' : '50% 50%',
          }}
        >
          <TlsLine size={LINE_SIZE} split={split} ask={ask} prefix={1 - split} frame={frame} />
        </div>
      ) : null}

      {/* «al final, la lees entera» */}
      {park > 0 ? (
        <div
          style={{
            position: 'absolute',
            right: W - PARK_X + 28,
            top: PARK_Y + Math.round((LINE.rowY + LINE.chipH / 2) * PARK_SCALE) - 28,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontFamily: FONT.sans,
            fontSize: 38,
            fontWeight: 750,
            color: C.text,
            whiteSpace: 'nowrap',
            ...noteIn,
          }}
        >
          <Icon name="flag" size={36} color={C.cyan} />
          {LATER}
        </div>
      ) : null}
    </Stage>
  );
}
