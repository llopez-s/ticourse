import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, springIn } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { S03_ASK } from '../data/s03-supuestos';
import { AssumptionSheet } from './parts/AssumptionSheet';
import { Pocket } from './parts/Pocket';
import { CraneCard } from './parts/s03-supuestos/CraneCard';
import { Whiteboard } from './parts/Whiteboard';
import { S02_BOARD } from './S02Fuera';
import { Stage, segment, wordFrame } from './kit';

const S = 's03-supuestos';
const W = STAGE.width;

// The room's board, picked up where s02 left it, then low and dim under the intercepted message.
const BOARD_LOW = { x: (W - 660) / 2, y: 336, w: 660 } as const;
const BOARD_SIDE = { x: 24, y: 336, w: 660 } as const;
// PAPER CRANE's card: low right while the message is up (top-centre stays clear), top centre after.
const CRANE_LOW = { x: 716, y: 380, w: 1000 } as const;
const CRANE_TOP = { x: (W - 1000) / 2, y: 22, w: 1000 } as const;
// The sheet: centred, then on the left beside the pocket, then centred again.
const SHEET_C = { w: 1040, x: (W - 1040) / 2, y: 40 } as const;
const SHEET_L = { w: 800, x: 0, y: 128 } as const;
const POCKET = { w: 600, x: W - 600 - 30, y: 56 } as const;

/**
 * s03-supuestos «Lo que das por hecho». While PAPER CRANE's intercepted message is up
 * (engine overlay, top centre), the room's whiteboard from s02 sinks low and dims; on
 * `crane` PAPER CRANE's card lands low right — «PAPER CRANE · célula de engaño · siembra
 * pistas falsas», rose, «siembra pistas falsas» lit as the voice says it. Once the message
 * is gone the card rises and his claim is quoted, «Las pruebas nunca mienten.», stamped
 * «supuesto» on the word. On `sheet` the KEY ASSUMPTIONS CHECK sheet lands, still
 * untitled; the two assumptions are written on their cues, each gets «¿y si no?» as the
 * voice asks «¿y si es falso?», and they open: three empty hypothesis slots («te faltan
 * hipótesis») and the small table «lo comprobamos al final» («alguna prueba engaña»). On
 * `pocket` the sheet steps left and the hand pats the jacket pocket for the phone and the
 * wallet (found on «comprobarlo»). On `kac` the sheet comes back and its title, KEY
 * ASSUMPTIONS CHECK, is written as the voice names it.
 */
export function S03Supuestos(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const crane = props.cue('crane');
  const sheet = props.cue('sheet');
  const assume1 = props.cue('assume-1');
  const assume2 = props.cue('assume-2');
  const pocket = props.cue('pocket');
  const kac = props.cue('kac');
  const s1 = segment(props, 's03-01');

  // ---- Board (0 → crane) and PAPER CRANE (crane → sheet).
  const sink = progress(frame, 6, 30, EASE.inOut);
  const aside = progress(frame, crane - 10, 20, EASE.inOut);
  const boardOut = progress(frame, s1.to, 16, EASE.inOut);
  const board = {
    x: mix(mix(S02_BOARD.x, BOARD_LOW.x, sink), BOARD_SIDE.x, aside),
    y: mix(S02_BOARD.y, BOARD_LOW.y, sink),
    w: mix(S02_BOARD.w, BOARD_LOW.w, sink),
  };
  const craneIn = frame < crane - 4 ? 0 : springIn(frame, fps, crane - 4, { damping: 15 });
  const rise = progress(frame, s1.to, 22, EASE.inOut);
  const craneCard = { x: mix(CRANE_LOW.x, CRANE_TOP.x, rise), y: mix(CRANE_LOW.y, CRANE_TOP.y, rise) };
  const sows = progress(frame, wordFrame(S, 's03-01', 'siembra') - 4, 14);
  const quoteAt = Math.max(s1.to + 10, wordFrame(S, 's03-02', 'pide') - 4);
  const stampAt = wordFrame(S, 's03-02', 'supuesto') - 4;
  const askOut = progress(frame, sheet - 16, 14, EASE.inOut);

  // ---- The sheet.
  const askAt: [number, number] = [wordFrame(S, 's03-04', 'y'), wordFrame(S, 's03-04', 'falso')];
  const openAt: [number, number] = [wordFrame(S, 's03-04', 'faltan') - 6, wordFrame(S, 's03-04', 'engaña') - 6];
  const titleAt = wordFrame(S, 's03-06', 'Key') - 4;
  const toSide = progress(frame, pocket - 12, 20, EASE.inOut) * (1 - progress(frame, kac - 10, 22, EASE.inOut));
  const sheetW = mix(SHEET_C.w, SHEET_L.w, toSide);
  const sheetX = mix(SHEET_C.x, SHEET_L.x, toSide);
  const sheetY = mix(SHEET_C.y, SHEET_L.y, toSide);

  // ---- The pocket.
  const pocketIn = progress(frame, pocket - 6, 16) * (1 - progress(frame, kac - 12, 14, EASE.inOut));

  return (
    <Stage>
      {/* The room's board, sinking under the message */}
      {boardOut < 1 ? (
        <div style={{ position: 'absolute', left: board.x, top: board.y, opacity: 1 - boardOut }}>
          <Whiteboard width={board.w} header question dim={0.15 + 0.35 * sink} frame={frame} />
        </div>
      ) : null}

      {/* PAPER CRANE's card */}
      {craneIn > 0.001 && askOut < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: craneCard.x,
            top: craneCard.y,
            opacity: Math.min(1, craneIn * 1.4) * (1 - askOut),
            transform: `translateX(${(1 - Math.min(1, craneIn)) * 60}px) scale(${0.94 + 0.06 * Math.min(1, craneIn)})`,
          }}
        >
          <CraneCard width={CRANE_LOW.w} highlight={sows} glow={0.5 * (1 - rise)} />
        </div>
      ) : null}

      {/* What he asks: his claim, quoted, and its name */}
      <Claim frame={frame} fps={fps} at={quoteAt} stampAt={stampAt} out={askOut} />

      {/* The KEY ASSUMPTIONS CHECK sheet (titled only when the voice names it) */}
      <div style={{ position: 'absolute', left: sheetX, top: sheetY }}>
        <AssumptionSheet
          width={sheetW}
          at={sheet - 4}
          titleAt={titleAt}
          writeAt={[assume1, assume2]}
          askAt={askAt}
          openAt={openAt}
          slots="empty"
          dim={0.4 * toSide}
          glow={progress(frame, titleAt, 16) * (1 - 0.4 * progress(frame, titleAt + 50, 30))}
          frame={frame}
        />
      </div>

      {/* The pocket: what you take for granted, checked */}
      {pocketIn > 0 ? (
        <div style={{ position: 'absolute', left: POCKET.x, top: POCKET.y, opacity: pocketIn, transform: `translateX(${(1 - pocketIn) * 40}px)` }}>
          <Pocket
            width={POCKET.w}
            patAt={wordFrame(S, 's03-05', 'palparte') - 2}
            itemsAt={wordFrame(S, 's03-05', 'llevas')}
            found={wordFrame(S, 's03-05', 'comprobarlo')}
            frame={frame}
          />
        </div>
      ) : null}
    </Stage>
  );
}

/** «Las pruebas nunca mienten.» in a rose quote box, then the amber stamp «supuesto». */
function Claim({ frame, fps, at, stampAt, out }: { frame: number; fps: number; at: number; stampAt: number; out: number }) {
  const p = progress(frame, at, 16);
  if (p <= 0 || out >= 1) return null;
  const stamp = frame < stampAt ? 0 : springIn(frame, fps, stampAt, { damping: 11, mass: 0.7 });
  const BOX_W = 1040;
  return (
    <div style={{ position: 'absolute', left: (W - BOX_W) / 2, top: 300, width: BOX_W, opacity: p * (1 - out), transform: `translateY(${(1 - p) * 20}px)`, fontFamily: FONT.sans }}>
      <div
        style={{
          boxSizing: 'border-box',
          height: 190,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 40px',
          borderRadius: RADIUS.lg,
          border: `2px dashed ${alpha(C.rose, 0.7)}`,
          background: alpha(C.roseDeep, 0.35),
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ fontSize: 64, fontWeight: 800, fontStyle: 'italic', color: C.textStrong, letterSpacing: -0.5 }}>
          <span style={{ color: C.roseSoft }}>«</span>
          {S03_ASK.quote}
          <span style={{ color: C.roseSoft }}>»</span>
        </span>
      </div>
      {stamp > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            right: -24,
            bottom: -46,
            padding: '8px 30px',
            borderRadius: 14,
            border: `5px solid ${C.amber}`,
            color: C.amber,
            background: alpha(C.ink950, 0.85),
            fontSize: 58,
            fontWeight: 900,
            letterSpacing: 3,
            whiteSpace: 'nowrap',
            opacity: Math.min(1, stamp * 1.5),
            transform: `rotate(-8deg) scale(${1.6 - 0.6 * Math.min(1, stamp)})`,
            boxShadow: `0 0 30px ${alpha(C.amber, 0.3)}`,
          }}
        >
          {S03_ASK.stamp}
        </div>
      ) : null}
    </div>
  );
}

