import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../../../engine/src/theme/motion';
import { BUBBLES } from '../../../data/s04-nube';
import { Pill } from '../Labels';
import { Person } from '../Person';

const BUBBLE_X = 590;

/** A speech bubble with its speaker (a small figure) on the left and a tail towards the door. */
function Bubble({ who, text, tone, top, style }: { who: string; text: string; tone: string; top: number; style: { opacity: number; transform: string } }) {
  return (
    <div style={{ position: 'absolute', left: BUBBLE_X, top, display: 'flex', alignItems: 'center', gap: 20, ...style }}>
      <svg width={64} height={96} viewBox="0 0 64 96" style={{ flexShrink: 0 }}>
        <Person x={32} y={92} h={88} tone={tone} />
      </svg>
      <div
        style={{
          position: 'relative',
          padding: '14px 30px 16px',
          borderRadius: RADIUS.lg,
          border: `3px solid ${alpha(tone, 0.75)}`,
          background: alpha(C.ink850, 0.95),
          fontFamily: FONT.sans,
          whiteSpace: 'nowrap',
        }}
      >
        <div style={{ position: 'absolute', left: -16, top: 30, width: 26, height: 26, background: C.ink850, borderLeft: `3px solid ${alpha(tone, 0.75)}`, borderBottom: `3px solid ${alpha(tone, 0.75)}`, transform: 'rotate(45deg)' }} />
        <div style={{ fontSize: 28, fontWeight: 700, color: C.muted }}>{who}</div>
        <div style={{ fontSize: 34, fontWeight: 800, color: C.textStrong, marginTop: 2 }}>«{text}»</div>
      </div>
    </div>
  );
}

/**
 * s04's door beat (stage-local; the door itself is drawn by the scene): the landlord's bubble on the voice's «cierra»
 * («la cierra cada vecino al entrar: lo dice el contrato»), a neighbour's on «creen» («eso es cosa del casero»), and on
 * `open-door` the amber «abierta toda la noche».
 */
export function DoorBubbles({ frame, landlordAt, neighbourAt, openAt }: { frame: number; landlordAt: number; neighbourAt: number; openAt: number }) {
  const b1 = frame >= landlordAt - 4 ? enter(frame, landlordAt, { distance: 16 }) : null;
  const b2 = frame >= neighbourAt - 4 ? enter(frame, neighbourAt, { distance: 16 }) : null;
  const open = frame >= openAt ? enter(frame, openAt + 4, { distance: 14 }) : null;
  const dim = 1 - 0.35 * progress(frame, openAt, 12, EASE.inOut);
  return (
    <>
      {b1 ? <Bubble who={BUBBLES.landlord.who} text={BUBBLES.landlord.text} tone={C.sky} top={40} style={{ ...b1, opacity: b1.opacity * dim }} /> : null}
      {b2 ? <Bubble who={BUBBLES.neighbour.who} text={BUBBLES.neighbour.text} tone={C.cyan} top={222} style={{ ...b2, opacity: b2.opacity * dim }} /> : null}
      {open ? (
        <div style={{ position: 'absolute', left: BUBBLE_X + 84, top: 420, ...open }}>
          <Pill text={BUBBLES.open} tone={C.amber} icon="alert" size={40} height={66} weight={850} on={progress(frame, openAt, 10)} />
        </div>
      ) : null}
    </>
  );
}
