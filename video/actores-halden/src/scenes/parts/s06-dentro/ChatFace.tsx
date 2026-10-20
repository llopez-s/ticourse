import { C, alpha } from '../../../../../engine/src/theme/tokens';
import { progress, springIn } from '../../../../../engine/src/theme/motion';
import { clamp01 } from '../../../../../engine/src/ui';
import { FACES } from '../../../data/s06-dentro';
import { FacePanel, FactChip } from './FacePanel';

const PHONE = { w: 104, h: 180, y: 62 } as const;
const PHONE_X = [24, 144];

/** A photo thumbnail of a ship list: a light card with a header and rows (nothing readable). */
function ListPhoto({ w, h }: { w: number; h: number }) {
  return (
    <div style={{ width: w, height: h, borderRadius: 6, background: '#e2e8f0', padding: 6, boxSizing: 'border-box' }}>
      <div style={{ height: 6, width: '70%', borderRadius: 3, background: '#0369a1', marginBottom: 5 }} />
      {[0.9, 0.7, 0.8].map((r, i) => (
        <div key={i} style={{ height: 4, width: `${r * 100}%`, borderRadius: 2, background: '#64748b', marginBottom: 4 }} />
      ))}
    </div>
  );
}

/** One crew member's phone: the group's chat with grey bubbles and one photo; `pop` 0–1 brings the new photo in. */
function Phone({ x, pop, ring }: { x: number; pop: number; ring: number }) {
  const p = clamp01(pop);
  return (
    <div style={{ position: 'absolute', left: x, top: PHONE.y, width: PHONE.w, height: PHONE.h, borderRadius: 16, background: C.ink950, border: `3px solid #475569`, boxSizing: 'border-box', padding: 6, overflow: 'hidden' }}>
      <div style={{ height: 18, borderRadius: 6, background: alpha(C.sky, 0.5), marginBottom: 8 }} />
      <div style={{ width: 60, height: 14, borderRadius: 7, background: '#334155', marginBottom: 6 }} />
      <div style={{ marginLeft: 20, width: 64, height: 14, borderRadius: 7, background: alpha(C.sky, 0.35), marginBottom: 8 }} />
      <ListPhoto w={70} h={46} />
      {p > 0 ? (
        <div style={{ position: 'absolute', right: 6, bottom: 8, transform: `scale(${p})`, transformOrigin: '100% 100%', borderRadius: 8, boxShadow: ring > 0.01 ? `0 0 0 ${Math.round(6 * ring)}px ${alpha(C.sky, 0.45 * ring)}` : undefined }}>
          <ListPhoto w={70} h={46} />
        </div>
      ) : null}
    </div>
  );
}

/**
 * Face 3 (sky): the amarradores' group on their own phones. On `chatAt` two phones with the group open; on `pingAt`
 * (the ping sound) a new photo of a ship list pops into both, with one soft ring. «listas de buques» beside them; on
 * «Sistemas» the chip «Sistemas no lo sabe», which turns into «sin malicia · nadie lo vigila» on `afterAt`.
 */
export function ChatFace({ frame, fps, on, chatAt, pingAt, systemsAt, afterAt }: { frame: number; fps: number; on: number; chatAt: number; pingAt: number; systemsAt: number; afterAt: number }) {
  const phones = progress(frame, chatAt - 6, 14);
  const pop = frame >= pingAt - 2 ? Math.min(1, springIn(frame, fps, pingAt - 2, { damping: 12 })) : 0;
  const ring = frame >= pingAt ? 1 - progress(frame, pingAt, 24) : 0;
  const after = progress(frame, afterAt, 12);
  return (
    <FacePanel title={FACES.chat.title} tone={C.sky} icon="users" on={on}>
      <div style={{ opacity: phones }}>
        {PHONE_X.map((x) => (
          <Phone key={x} x={x} pop={pop} ring={ring} />
        ))}
      </div>
      <div style={{ position: 'absolute', left: 272, top: 120, fontSize: 28, fontWeight: 800, color: C.text, whiteSpace: 'nowrap', opacity: progress(frame, pingAt + 4, 12) }}>{FACES.chat.photo}</div>
      <div style={{ position: 'absolute', left: 24, top: 252 }}>
        {after < 1 ? (
          <div style={{ position: 'absolute', left: 0, top: 0, opacity: 1 - after }}>
            <FactChip text={FACES.chat.systems} tone={C.sky} show={progress(frame, systemsAt, 12)} />
          </div>
        ) : null}
        {after > 0 ? (
          <div style={{ position: 'absolute', left: 0, top: 0 }}>
            <FactChip text={FACES.chat.after} tone={C.sky} show={after} />
          </div>
        ) : null}
      </div>
    </FacePanel>
  );
}
