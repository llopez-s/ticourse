import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { EXAM_TEXT, G, S03 } from '../../../data/s03-apreton';
import { ExamTag } from './bits';

/** The exam name of the second half, over its lanes: SAE · SIMULTANEOUS AUTHENTICATION OF EQUALS (two lines). */
export function SaeTitle({ show, lit }: { show: number; lit: number }) {
  if (show <= 0.001) return null;
  const cut = S03.saeLong.indexOf(' OF ');
  return (
    <div style={{ position: 'absolute', left: G.title.x, top: G.title.y, transform: `translateX(-50%) scale(${0.92 + 0.08 * show})`, transformOrigin: '50% 100%', opacity: show, textAlign: 'center' }}>
      <ExamTag size={38} lit={lit}>
        {S03.sae}
      </ExamTag>
      <div style={{ marginTop: 8, fontFamily: FONT.sans, fontSize: 25, fontWeight: 800, letterSpacing: 1.1, lineHeight: 1.16, color: EXAM_TEXT, whiteSpace: 'nowrap' }}>
        <div>{S03.saeLong.slice(0, cut)}</div>
        <div>{S03.saeLong.slice(cut + 1)}</div>
      </div>
    </div>
  );
}

/** «intentos recibidos · N», on the access point. In WPA2 it stays at 0; with SAE every attempt shows. */
export function ReceivedCounter({ show, value, lit }: { show: number; value: number; lit: number }) {
  if (show <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: G.ap.x,
        top: G.locker.y + G.locker.h + 58,
        transform: `translateX(-50%) scale(${0.94 + 0.06 * show + 0.04 * lit})`,
        opacity: show,
        display: 'flex',
        alignItems: 'baseline',
        gap: 12,
        padding: '4px 20px 6px',
        borderRadius: 14,
        border: `2px solid ${alpha(C.sky, 0.4 + 0.5 * lit)}`,
        background: alpha(C.ink850, 0.95),
        boxShadow: lit > 0.02 ? `0 0 ${Math.round(28 * lit)}px ${alpha(C.sky, 0.3 * lit)}` : undefined,
        fontFamily: FONT.sans,
        fontSize: 32,
        fontWeight: 700,
        color: C.text,
        whiteSpace: 'nowrap',
      }}
    >
      {S03.received}
      <span style={{ color: C.faint }}>·</span>
      <span style={{ fontFamily: FONT.mono, fontSize: 40, fontWeight: 800, color: C.textStrong }}>{value}</span>
    </div>
  );
}

/**
 * The line along the bottom, one thing at a time: what the exchange is called («apretón de manos» ·
 * FOUR-WAY HANDSHAKE) in the first half; «cada intento, contra el punto de acceso · uno a uno y a la
 * vista» while SAE is explained; and at the end the scene's last word, «Sigue siendo una clave para todos».
 */
export function Band({ name, exam, examLit, one, oneLit, shared }: { name: number; exam: number; examLit: number; one: number; oneLit: number; shared: number }) {
  const cy = G.band.y + G.band.h / 2;
  // The last swap is sequential (out, then in): two lines never cross-dissolve over each other.
  const first = one * (1 - Math.min(1, shared * 2));
  const last = Math.max(0, shared * 2 - 1);
  return (
    <>
      {name > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: cy, width: G.w, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22, transform: `translateY(-50%) translateY(${(1 - name) * 10}px)`, opacity: name }}>
          <span style={{ fontFamily: FONT.sans, fontSize: 44, fontWeight: 850, letterSpacing: -0.6, color: C.textStrong, whiteSpace: 'nowrap' }}>{S03.handshake}</span>
          <span style={{ opacity: exam, transform: `scale(${0.9 + 0.1 * exam})`, transformOrigin: '0 50%' }}>
            <ExamTag size={34} lit={examLit}>
              {S03.handshakeExam}
            </ExamTag>
          </span>
        </div>
      ) : null}
      {first > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: cy, width: G.w, transform: `translateY(-50%) translateY(${(1 - one) * 10}px)`, textAlign: 'center', fontFamily: FONT.sans, fontSize: 38, fontWeight: 800, whiteSpace: 'nowrap', opacity: first }}>
          <span style={{ color: C.textStrong }}>{S03.oneByOne[0]}</span>
          <span style={{ color: C.faint, margin: '0 16px' }}>·</span>
          <span style={{ color: '#6ee7b7', opacity: 0.4 + 0.6 * oneLit }}>{S03.oneByOne[1]}</span>
        </div>
      ) : null}
      {last > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: cy, width: G.w, display: 'flex', justifyContent: 'center', transform: `translateY(-50%) translateY(${(1 - last) * 10}px)`, opacity: last }}>
          <div
            style={{
              padding: '4px 40px 8px',
              borderRadius: 18,
              border: `3px solid ${alpha(C.amber, 0.75)}`,
              background: alpha('#2a1c05', 0.92),
              boxShadow: `0 0 34px ${alpha(C.amber, 0.22)}`,
              fontFamily: FONT.sans,
              fontSize: 50,
              fontWeight: 850,
              letterSpacing: -0.8,
              lineHeight: 1.12,
              color: '#fcd34d',
              whiteSpace: 'nowrap',
            }}
          >
            {S03.shared}
          </div>
        </div>
      ) : null}
    </>
  );
}
