import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { Icon, mix } from '../../../../../engine/src/ui';
import { FACES } from '../../../data/s06-dentro';
import { FACE, FacePanel, FactChip } from './FacePanel';

const LIST = { x: 24, y: 62, w: FACE.w - 48, h: 180 } as const;
const ROWS = [0.8, 0.6, 0.72, 0.5];

/**
 * Face 1 (rose): the sanctioned employee. «pedidos de su sección» as four rows; on `wipeAt` (the error sound) a single
 * rose flash on the panel and each row is struck through and gone, one after another. Then «a propósito» and, in
 * violet, «revenge».
 */
export function SanctionFace({ frame, on, wipeAt }: { frame: number; on: number; wipeAt: number }) {
  const flash = frame >= wipeAt ? 1 - progress(frame, wipeAt, 16) : 0;
  return (
    <FacePanel title={FACES.sanction.title} tone={C.rose} on={on} flash={flash}>
      <div style={{ position: 'absolute', left: LIST.x, top: LIST.y, width: LIST.w, height: LIST.h, borderRadius: RADIUS.md, background: alpha(C.ink950, 0.6), border: `2px solid ${C.ink600}`, boxSizing: 'border-box', padding: '10px 18px' }}>
        <div style={{ fontSize: 28, fontWeight: 750, color: C.text, whiteSpace: 'nowrap' }}>{FACES.sanction.list}</div>
        {ROWS.map((w, k) => {
          const strike = progress(frame, wipeAt + k * 4, 8);
          const gone = progress(frame, wipeAt + 8 + k * 4, 10, EASE.inOut);
          return (
            <div key={k} style={{ position: 'relative', height: 28, marginTop: 4, opacity: 1 - gone }}>
              <div style={{ position: 'absolute', left: 0, top: 9, width: 26, height: 10, borderRadius: 4, background: alpha(C.cyan, 0.5) }} />
              <div style={{ position: 'absolute', left: 40, top: 9, width: (LIST.w - 100) * w, height: 10, borderRadius: 5, background: alpha(C.text, 0.4) }} />
              <div style={{ position: 'absolute', left: 0, top: 12, width: `${strike * 100}%`, height: 4, borderRadius: 2, background: C.rose }} />
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', left: 24, top: 252, display: 'flex', gap: 12 }}>
        <FactChip text={FACES.sanction.chips[0]} tone={C.rose} show={progress(frame, wipeAt + 16, 12)} />
        <FactChip text={FACES.sanction.chips[1]} tone={C.rose} exam show={progress(frame, wipeAt + 28, 12)} />
      </div>
    </FacePanel>
  );
}

const LINE_X = 330;

/**
 * Face 2 (amber): the list sent by mistake. On `mailAt` «lista de turnos y teléfonos» and a plain envelope inside; on
 * `sentAt` (the mail sound) the envelope crosses the dashed line to «fuera». Then «creía que escribía a un compañero».
 */
export function MailFace({ frame, on, mailAt, sentAt }: { frame: number; on: number; mailAt: number; sentAt: number }) {
  const fly = progress(frame, sentAt, 18, EASE.inOut);
  const ex = mix(70, 400, fly);
  const ey = 120 - Math.sin(Math.PI * fly) * 26;
  return (
    <FacePanel title={FACES.mail.title} tone={C.amber} on={on}>
      <div style={{ position: 'absolute', left: 24, top: 62, fontSize: 28, fontWeight: 750, color: C.text, whiteSpace: 'nowrap', opacity: progress(frame, mailAt - 6, 12) }}>{FACES.mail.letter}</div>
      <svg width={FACE.w} height={FACE.h} style={{ position: 'absolute', left: 0, top: 0 }}>
        <line x1={LINE_X} y1={104} x2={LINE_X} y2={226} stroke={alpha(C.amber, 0.7)} strokeWidth={4} strokeDasharray="10 10" />
      </svg>
      <div style={{ position: 'absolute', left: LINE_X + 20, top: 200, fontSize: 28, fontWeight: 800, color: C.amber, fontFamily: FONT.sans }}>{FACES.mail.outside}</div>
      <div style={{ position: 'absolute', left: ex, top: ey, opacity: progress(frame, mailAt - 6, 12), transform: `rotate(${-10 * Math.sin(Math.PI * fly)}deg)` }}>
        <div style={{ width: 96, height: 72, borderRadius: 10, background: alpha(C.amber, 0.14), border: `3px solid ${C.amber}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="mail" size={52} color={C.amber} />
        </div>
      </div>
      <div style={{ position: 'absolute', left: 24, top: 248, fontSize: 28, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap', opacity: progress(frame, sentAt + 22, 14) }}>{FACES.mail.belief}</div>
    </FacePanel>
  );
}
