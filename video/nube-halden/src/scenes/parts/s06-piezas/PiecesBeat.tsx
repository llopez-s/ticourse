import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../../../engine/src/theme/motion';
import { Icon, clamp01, mix } from '../../../../../engine/src/ui';
import { API, CALLS, DEPLOY, MONOLITH, PIECES, TERMS } from '../../../data/s06-piezas';
import { Pill, TermPill } from '../Labels';
import { Piece } from '../Piece';

const PW = 440;
const PH = 176;
const GAP = 100;
const X0 = (1728 - (3 * PW + 2 * GAP)) / 2;
const PY = 110;
const TERM_Y = PY + PH + 30;
const CALLS_Y = TERM_Y + 92;
const MONO = { x: 1150, y: 330, w: 470, h: 130 } as const;
export const pieceX = (i: number) => X0 + i * (PW + GAP);

export interface PiecesBeatTimes {
  port: number;
  pieces: number;
  micro: number;
  blast: number;
  blastTerm: number;
  monolith: number;
  calls: number;
  doors: number;
  verify: number;
}

/** The credential check at a piece's door: an ID badge (person) with an emerald check stamped on it. */
function CredentialCheck({ show, stamp }: { show: number; stamp: number }) {
  const s = clamp01(stamp);
  return (
    <div style={{ position: 'relative', width: 64, height: 64, opacity: clamp01(show) }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 14, background: C.ink900, border: `3px solid ${alpha(s > 0.5 ? C.emerald : C.sky, 0.9)}`, display: 'grid', placeItems: 'center' }}>
        <Icon name="user" size={36} color={s > 0.5 ? C.emerald : C.sky} />
      </div>
      {s > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            right: -16,
            bottom: -16,
            width: 40,
            height: 40,
            borderRadius: 20,
            background: C.emerald,
            display: 'grid',
            placeItems: 'center',
            opacity: Math.min(1, s * 1.5),
            transform: `scale(${mix(1.8, 1, s)})`,
            boxShadow: `0 0 ${Math.round(18 * s)}px ${alpha(C.emerald, 0.6)}`,
          }}
        >
          <Icon name="check" size={26} color={C.ink950} strokeWidth={3} />
        </div>
      ) : null}
    </div>
  );
}

/**
 * s06's port beat: the new application in three pieces, each with its own deployment, «microservices». On `blast` the
 * first piece goes amber and the other two emerald, «blast radius»; half-lit to the side, the monolith «una sola pieza»
 * turns amber whole on `monolith` (the error sound, a short glitch). On `calls` the network lines between the pieces
 * draw, each with an «API» tag (never a padlock), and «más puertas · más registros». On `verify` (the lock sound) a
 * credential check stamps at every piece's door: each piece checks who calls it.
 */
export function PiecesBeat({ frame, t }: { frame: number; t: PiecesBeatTimes }) {
  const hit = progress(frame, t.blast, 12);
  const calm = progress(frame, t.calls - 10, 16);
  const monoIn = progress(frame, t.monolith - 8, 12);
  const monoHit = progress(frame, t.monolith, 6, EASE.out);
  const glitch = frame >= t.monolith && frame < t.monolith + 10 ? ((frame - t.monolith) % 3) * 4 - 4 : 0;
  const monoOut = progress(frame, t.calls - 12, 14, EASE.inOut);
  const cy = PY + PH / 2;

  return (
    <>
      {PIECES.map((label, i) => {
        const e = enter(frame, t.port + 8 + i * 8, { distance: 18 });
        // Hit on `blast`, back to the port's cyan once the calls take over.
        const state = hit * (1 - calm);
        const tone = state > 0.5 ? (i === 0 ? C.amber : C.emerald) : C.cyan;
        return (
          <div key={label} style={{ position: 'absolute', left: pieceX(i), top: PY, ...e }}>
            <Piece
              width={PW}
              height={PH}
              label={label}
              labelSize={34}
              tone={tone}
              glow={i === 0 ? 0.8 * state : 0.4 * state}
              foot={
                <div style={{ opacity: progress(frame, t.pieces + i * 5, 12) }}>
                  <Pill text={DEPLOY} tone={C.sky} icon="layers" size={26} height={42} on={0.5} />
                </div>
              }
            />
          </div>
        );
      })}

      {/* Calls between pieces: network lines with an API tag each */}
      <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        {[0, 1].map((k) => {
          const d = progress(frame, t.calls + k * 6, 14, EASE.inOut);
          if (d <= 0.01) return null;
          const x1 = pieceX(k) + PW + 4;
          const x2 = pieceX(k + 1) - 4;
          return <line key={k} x1={x1} y1={cy} x2={x1 + (x2 - x1) * d} y2={cy} stroke={alpha(C.sky, 0.85)} strokeWidth={5} strokeDasharray="12 8" />;
        })}
      </svg>
      {[0, 1].map((k) => {
        const show = progress(frame, t.calls + 10 + k * 6, 10);
        if (show <= 0.01) return null;
        const doorLit = progress(frame, t.doors, 10);
        const ok = progress(frame, t.verify, 10);
        const tone = ok > 0.5 ? C.emerald : C.sky;
        return (
          <div key={k} style={{ position: 'absolute', left: pieceX(k) + PW + GAP / 2 - 40, top: cy - 88, width: 80, display: 'flex', justifyContent: 'center', opacity: show }}>
            <div style={{ padding: '2px 12px', borderRadius: RADIUS.sm, border: `2px solid ${alpha(tone, 0.6 + 0.4 * doorLit)}`, background: C.ink900, fontFamily: FONT.sans, fontSize: 30, fontWeight: 850, color: ok > 0.5 ? '#6ee7b7' : '#bae6fd', boxShadow: doorLit > 0.02 ? `0 0 ${Math.round(16 * doorLit)}px ${alpha(tone, 0.5)}` : undefined }}>
              {API}
            </div>
          </div>
        );
      })}
      {/* The door of every piece, where calls arrive: a credential check stamps on `verify` */}
      {PIECES.map((label, i) => (
        <div key={label} style={{ position: 'absolute', left: pieceX(i) - 54, top: cy - 32 }}>
          <CredentialCheck show={progress(frame, t.verify - 10 + i * 3, 8)} stamp={progress(frame, t.verify + i * 3, 9, EASE.out)} />
        </div>
      ))}

      {frame >= t.micro - 6 ? (
        <div style={{ position: 'absolute', left: X0, top: TERM_Y, ...enter(frame, t.micro, { distance: 14 }) }}>
          <TermPill text={TERMS.micro} size={40} on={progress(frame, t.micro, 10) * (1 - 0.5 * progress(frame, t.blastTerm, 10))} />
        </div>
      ) : null}
      {frame >= t.blastTerm - 6 ? (
        <div style={{ position: 'absolute', left: X0 + 430, top: TERM_Y, ...enter(frame, t.blastTerm, { distance: 14 }) }}>
          <TermPill text={TERMS.blast} size={40} on={progress(frame, t.blastTerm, 10) * (1 - 0.5 * calm)} />
        </div>
      ) : null}

      {/* The monolith, half-lit to the side */}
      {monoIn > 0.01 && monoOut < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: MONO.x + glitch,
            top: MONO.y,
            width: MONO.w,
            height: MONO.h,
            boxSizing: 'border-box',
            borderRadius: RADIUS.lg,
            border: `4px solid ${alpha(monoHit > 0.02 ? C.amber : C.muted, 0.75)}`,
            background: monoHit > 0.02 ? alpha(C.amber, 0.14 * monoHit) : C.ink850,
            opacity: 0.65 * monoIn * (1 - monoOut),
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 28px',
            fontFamily: FONT.sans,
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{ fontSize: 36, fontWeight: 850, color: C.textStrong }}>{MONOLITH.name}</div>
          <div style={{ fontSize: 32, fontWeight: 750, color: '#fcd34d', opacity: monoHit }}>{MONOLITH.hit}</div>
        </div>
      ) : null}

      {frame >= t.doors - 6 ? (
        <div style={{ position: 'absolute', left: X0, top: CALLS_Y, ...enter(frame, t.doors, { distance: 14 }) }}>
          <Pill text={CALLS} tone={C.amber} icon="alert" size={38} height={64} on={progress(frame, t.doors, 10) * (1 - 0.5 * progress(frame, t.verify, 12))} />
        </div>
      ) : null}
    </>
  );
}
