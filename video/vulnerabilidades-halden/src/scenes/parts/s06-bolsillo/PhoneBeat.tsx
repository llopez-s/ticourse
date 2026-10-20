import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../../../engine/src/theme/motion';
import { BYPASS, INTACT, JAILBREAK, PROTECTIONS, ROOTING, SIDELOAD, STORE } from '../../../data/s06-bolsillo';
import { Caption, Pill, StrikeLine, TermPill } from '../Labels';
import { FREE_SLOT, PHONE, Phone, tileCenter } from '../Phone';
import { STORE_H, STORE_W, StoreBadge } from './Store';

const STORE_AT = { x: 20, y: 30 } as const;
const P1 = { x: 440, y: 10, w: 240 } as const;
const P2 = { x: 770, y: 10, w: 240 } as const;
const K = P1.w / PHONE.w;
const RIGHT_X = 1060;
const [sx, sy] = tileCenter(FREE_SLOT);
const SLOT: [number, number] = [P1.x + sx * K, P1.y + sy * K];
const ORIGIN: [number, number] = [70, 330];
const CTRL: [number, number] = [330, 470];

/** Point on the quadratic bypass curve at t. */
function onCurve(t: number): [number, number] {
  const u = 1 - t;
  return [u * u * ORIGIN[0] + 2 * u * t * CTRL[0] + t * t * SLOT[0], u * u * ORIGIN[1] + 2 * u * t * CTRL[1] + t * t * SLOT[1]];
}

export interface PhoneTimes {
  phone: number;
  store: number;
  review: number;
  intact: number;
  sideload: number;
  root: number;
  falls: number;
  often: number;
  mdm: number;
  rooting: number;
  jailbreak: number;
}

/** One protection of phone 2, struck through on its frame. */
function Protection({ text, size, color, strike }: { text: string; size: number; color: string; strike: number }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block', fontSize: size, fontWeight: 800, color: strike > 0.5 ? C.muted : color, whiteSpace: 'nowrap' }}>
      {text}
      <StrikeLine strike={strike} />
    </div>
  );
}

/**
 * s06's second beat. Phone 1: the official store badge with its «revisión»; an amber app from «fuera de la tienda»
 * runs around it and, on `store` (the ping2), pops into the phone's free slot with one ring — «sin pasar por la
 * revisión de la tienda»; on «sistema» an emerald «el sistema sigue entero», and «side loading» on `sideload`. Phone 2
 * on `root`, with its protections on the right; on `falls` (the alarm) a rose ring pulses once, the cells between apps
 * drop and «aislamiento entre apps» is struck, then «arranque verificado» and «MDM» on their words; «rooting · Android»
 * and «jailbreaking · iPhone» side by side on their words.
 */
export function PhoneBeat({ frame, t }: { frame: number; t: PhoneTimes }) {
  const p1In = enter(frame, t.phone - 4, { distance: 18 });
  const storeIn = enter(frame, t.phone + 2, { distance: 14 });
  const tileIn = progress(frame, t.phone + 10, 10);
  const travel = progress(frame, t.store - 16, 16, EASE.inOut);
  const arrived = frame >= t.store ? progress(frame, t.store, 10) : 0;
  const ping = frame >= t.store ? progress(frame, t.store, 30, EASE.linear) : 0;
  const [tx, ty] = onCurve(travel);
  const p1Dim = 1 - 0.4 * progress(frame, t.root, 12);
  const p2In = frame >= t.root - 6 ? enter(frame, t.root - 2, { distance: 18 }) : null;
  const fall = frame >= t.falls ? progress(frame, t.falls, 16) : 0;
  const alarm = frame >= t.falls ? progress(frame, t.falls, 26, EASE.linear) : 0;
  const curve = `M ${ORIGIN[0]} ${ORIGIN[1]} Q ${CTRL[0]} ${CTRL[1]} ${SLOT[0]} ${SLOT[1]}`;
  return (
    <div style={{ position: 'absolute', inset: 0, fontFamily: FONT.sans }}>
      <div style={{ position: 'absolute', left: STORE_AT.x, top: STORE_AT.y, ...storeIn, opacity: storeIn.opacity * p1Dim }}>
        <StoreBadge />
      </div>
      <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: p1Dim }}>
        <path d={`M ${STORE_AT.x + STORE_W} ${STORE_AT.y + STORE_H / 2} L ${P1.x - 8} ${STORE_AT.y + STORE_H / 2}`} stroke={alpha(C.cyan, 0.5 * storeIn.opacity)} strokeWidth={4} strokeDasharray="8 8" />
        {travel > 0.01 ? <path d={curve} fill="none" stroke={alpha(C.amber, 0.75)} strokeWidth={5} strokeDasharray="12 10" strokeLinecap="round" opacity={travel} /> : null}
        {tileIn > 0.01 && arrived < 0.5 ? <rect x={tx - 26} y={ty - 26} width={52} height={52} rx={14} fill={alpha(C.amber, 0.7)} stroke={C.amber} strokeWidth={3} opacity={tileIn} /> : null}
      </svg>
      {tileIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 14, top: ORIGIN[1] - 80, opacity: tileIn * p1Dim }}>
          <Caption color="#fcd34d" size={32}>
            {STORE.outside}
          </Caption>
        </div>
      ) : null}
      <div style={{ position: 'absolute', left: P1.x, top: P1.y, ...p1In, opacity: p1In.opacity * p1Dim }}>
        <Phone width={P1.w} arrived={arrived} ping={ping} glow={progress(frame, t.intact - 4, 12)} />
      </div>
      {frame >= t.review - 4 ? (
        <div style={{ position: 'absolute', left: 14, top: 470, ...enter(frame, t.review, { distance: 12 }), opacity: p1Dim }}>
          {BYPASS.map((l) => (
            <Caption key={l} color={C.text} size={34}>
              {l}
            </Caption>
          ))}
        </div>
      ) : null}
      {frame >= t.intact - 4 ? (
        <div style={{ position: 'absolute', left: P1.x - 70, top: 472, ...enter(frame, t.intact, { distance: 12 }), opacity: p1Dim }}>
          <Pill text={INTACT} tone={C.emerald} icon="shield" size={32} height={54} />
        </div>
      ) : null}
      {frame >= t.sideload - 4 ? (
        <div style={{ position: 'absolute', left: P1.x - 30, top: 548, ...enter(frame, t.sideload, { distance: 12 }) }}>
          <TermPill text={SIDELOAD} size={38} on={progress(frame, t.sideload, 10) * (1 - 0.4 * progress(frame, t.root + 20, 12))} />
        </div>
      ) : null}

      {p2In ? (
        <>
          <div style={{ position: 'absolute', left: P2.x, top: P2.y, ...p2In }}>
            <Phone width={P2.w} isolation={1 - fall} alarm={alarm} tone={fall > 0.5 ? C.rose : C.cyan} />
          </div>
          <div style={{ position: 'absolute', left: RIGHT_X, top: 40, ...p2In }}>
            <Protection text={PROTECTIONS.main} size={38} color={C.textStrong} strike={frame >= t.falls ? progress(frame, t.falls + 2, 12) : 0} />
            <div style={{ marginTop: 22, fontSize: 28, fontWeight: 700, color: C.muted }}>{PROTECTIONS.often}</div>
            <div style={{ marginTop: 6, display: 'flex', gap: 22, alignItems: 'baseline' }}>
              <Protection text={PROTECTIONS.boot} size={32} color={C.text} strike={progress(frame, t.often, 12)} />
              <Protection text={PROTECTIONS.mdm} size={32} color={C.text} strike={progress(frame, t.mdm - 2, 10)} />
            </div>
          </div>
          <div style={{ position: 'absolute', left: RIGHT_X, top: 330, display: 'flex', gap: 26 }}>
            {[
              { ...ROOTING, at: t.rooting },
              { ...JAILBREAK, at: t.jailbreak },
            ].map((x) =>
              frame >= x.at - 4 ? (
                <div key={x.term} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, ...enter(frame, x.at, { distance: 14 }) }}>
                  <TermPill text={x.term} size={38} on={progress(frame, x.at, 10)} />
                  <Caption color={C.text} size={34}>
                    {x.os}
                  </Caption>
                </div>
              ) : null,
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
