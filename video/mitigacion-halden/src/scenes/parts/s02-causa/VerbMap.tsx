import { C, FONT, RADIUS, alpha } from '../../../../../engine/src/theme/tokens';
import { progress } from '../../../../../engine/src/theme/motion';
import { MAP_HEAD, VERB_MAP } from '../../../data/s02-causa';
import { Arrow } from '../Arrow';
import { ExamChip } from '../Labels';

const ROW_H = 80;
const VERB_W = 760;
const CHIPS_X = 920;

/**
 * The verb map (s02 `map`, screen only): «el verbo del fallo elige la técnica», then six rows — what happened, an SVG
 * arrow, and the technique(s) that answer it in violet exam chips. Rows come in one after another from `at`.
 */
export function VerbMap({ frame, at, width }: { frame: number; at: number; width: number }) {
  const head = progress(frame, at, 14);
  return (
    <div style={{ position: 'relative', width, height: 640, fontFamily: FONT.sans }}>
      <div style={{ position: 'absolute', left: 0, top: 0, width, textAlign: 'center', fontSize: 44, fontWeight: 850, color: C.textStrong, opacity: head, transform: `translateY(${(1 - head) * 12}px)` }}>
        {MAP_HEAD}
      </div>
      {VERB_MAP.map((r, i) => {
        const p = progress(frame, at + 8 + i * 7, 12);
        const y = 76 + i * ROW_H;
        return (
          <div key={r.verb} style={{ position: 'absolute', left: 0, top: y, width, height: ROW_H - 12, opacity: p, transform: `translateX(${(1 - p) * -18}px)` }}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: VERB_W,
                height: ROW_H - 14,
                boxSizing: 'border-box',
                padding: '0 24px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: RADIUS.md,
                background: alpha(C.ink850, 0.85),
                border: `2px solid ${alpha(C.cyan, 0.35)}`,
                fontSize: 34,
                fontWeight: 750,
                color: C.textStrong,
                whiteSpace: 'nowrap',
              }}
            >
              {r.verb}
            </div>
            <svg width={CHIPS_X - VERB_W} height={ROW_H} style={{ position: 'absolute', left: VERB_W, top: 0, overflow: 'visible' }}>
              <Arrow points={[[18, (ROW_H - 14) / 2], [CHIPS_X - VERB_W - 22, (ROW_H - 14) / 2]]} draw={progress(frame, at + 12 + i * 7, 10)} color={alpha(C.violet, 0.8)} width={4} />
            </svg>
            <div style={{ position: 'absolute', left: CHIPS_X, top: (ROW_H - 14 - 48) / 2, display: 'flex', gap: 14 }}>
              {r.techniques.map((t) => (
                <ExamChip key={t} text={t} size={32} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
