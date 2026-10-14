import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { Icon } from '../../../../../engine/src/ui';
import { G, S03 } from '../../../data/s03-apreton';
import { STEEL } from '../Glyphs';
import { Txt } from './bits';

const P = G.panel;
const CX = P.x + P.w / 2;
const SLOT_Y = P.y + 214;
const FILE_Y = P.y + 356;
const TAG_Y = P.y + 138;

/** The four messages as the laptop records them: a numbered slot each, amber once it is on disk. */
export function CaptureSlots({ slots, opacity }: { slots: readonly number[]; opacity: number }) {
  if (opacity <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: CX - 250, top: SLOT_Y - 42, width: 500, display: 'flex', justifyContent: 'space-between', opacity }}>
      {slots.map((s, i) => (
        <div
          key={i}
          style={{
            width: 84,
            height: 84,
            boxSizing: 'border-box',
            borderRadius: 42,
            display: 'grid',
            placeItems: 'center',
            border: s > 0.5 ? `4px solid ${C.amber}` : `3px dashed ${STEEL.line}`,
            background: alpha(C.amber, 0.14 * s),
            boxShadow: s > 0.02 ? `0 0 ${Math.round(22 * s)}px ${alpha(C.amber, 0.25 * s)}` : undefined,
            transform: `scale(${1 + 0.12 * s * (1 - s) * 4})`,
            fontFamily: FONT.sans,
            fontSize: 42,
            fontWeight: 850,
            color: s > 0.5 ? C.textStrong : C.faint,
          }}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
}

/**
 * «captura · 1 handshake»: the recorded file. It pops in under the slots (`show`), and when the
 * padlock takes its place (`tag` 0–1) it shrinks to a tag over it: that padlock IS this capture.
 */
export function CaptureFile({ show, tag, glow, dim }: { show: number; tag: number; glow: number; dim: number }) {
  if (show <= 0.001) return null;
  const y = FILE_Y + (TAG_Y - FILE_Y) * tag;
  const scale = (0.9 + 0.1 * Math.min(1, show)) * (1 - 0.34 * tag);
  return (
    <div style={{ position: 'absolute', left: CX, top: y, transform: `translate(-50%, -50%) scale(${scale})`, opacity: Math.min(1, show * 1.4) * (1 - 0.65 * dim) }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '14px 28px 14px 20px',
          borderRadius: 18,
          border: `3px solid ${alpha(C.amber, 0.8)}`,
          background: alpha('#2a1c05', 0.92),
          boxShadow: `0 0 ${Math.round(14 + 30 * glow)}px ${alpha(C.amber, 0.18 + 0.3 * glow)}`,
          fontFamily: FONT.sans,
          fontSize: 40,
          fontWeight: 800,
          color: '#fcd34d',
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name="file" size={44} color={C.amber} strokeWidth={2} />
        {S03.captured}
      </div>
    </div>
  );
}

/**
 * «claves probadas · 38.000.000», under the padlock. `value` is the text to show (the scene swaps
 * it in uneven jumps; it never counts up), `bump` 0–1 a short swell on each jump.
 */
export function TriedCounter({ show, value, bump }: { show: number; value: string; bump: number }) {
  if (show <= 0.001) return null;
  return (
    <>
      <Txt x={CX} y={P.y + 342} size={32} weight={700} anchor="center" color={C.text} opacity={show}>
        {S03.tried}
      </Txt>
      <Txt
        x={CX}
        y={P.y + 380}
        size={62}
        weight={800}
        mono
        anchor="center"
        color={C.amber}
        opacity={show}
        style={{ transform: `translateX(-50%) scale(${1 + 0.06 * bump})`, textShadow: `0 0 ${Math.round(10 + 22 * bump)}px ${alpha(C.amber, 0.35)}` }}
      >
        {value}
      </Txt>
    </>
  );
}
