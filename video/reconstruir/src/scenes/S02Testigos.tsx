import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeOut, progress } from '../../../engine/src/theme/motion';
import { mix, windowWeight } from '../../../engine/src/ui';
import { Stage, segment } from './kit';
import { RAW, SOURCES, SOURCE_ORDER, type SourceId } from './parts/data';
import { CaseStamp } from './parts/CaseStamp';
import { RawText } from './parts/RawLines';
import { SourceCard } from './parts/SourceCard';
import { WITNESS_H, WITNESS_W, WitnessFigure } from './parts/Witness';

// ---- Phase 1: four witnesses side by side, each in its own place.
const BAND = { y: 64, w: 360, centres: [216, 648, 1080, 1512] } as const;
const BAND_FIG_H = (BAND.w * WITNESS_H) / WITNESS_W;
// ---- Phase 2: the table. One row per source: witness | card | raw lines.
const ROW_H: Record<SourceId, number> = { login: 120, proxy: 120, edr: 172, firewall: 120 };
const ROW_GAP = 12;
const ROW_Y0 = 6;
const rowTop = (i: number) => ROW_Y0 + SOURCE_ORDER.slice(0, i).reduce((s, id) => s + ROW_H[id] + ROW_GAP, 0);
const WIT_W = 120;
const CARD_X = 136;
const CARD_W = 400;
const RAW_X = 552;
const RAW_W = 1728 - RAW_X;
const RAW_SIZE = 22;

/**
 * s02-testigos «Cuatro testigos». `witnesses`: four faceless silhouettes, each in its own place (a counter, a door, a
 * window, an exit — «imagen · no es del puerto»); each one only sees its piece (the cone grows with «desde su
 * sitio»). As the voice names them (`login`, `proxy`, `edr`, `firewall`) each witness shrinks into the left of its
 * row and its card appears: the table of the four sources, in the order and with the icons it keeps for the rest of
 * the video. `raw`: each card shows its raw line (CSV with its header, proxy text, the two EDR JSON lines, the
 * firewall key=value). `json` colours the EDR's name:value pairs; `csv` the login's commas.
 */
export function S02Testigos(props: SceneProps) {
  const frame = useCurrentFrame();
  const witnessesAt = props.cue('witnesses');
  const nameAt: Record<SourceId, number> = {
    login: props.cue('login'),
    proxy: props.cue('proxy'),
    edr: props.cue('edr'),
    firewall: props.cue('firewall'),
  };
  const rawAt = props.cue('raw');
  const jsonAt = props.cue('json');
  const csvAt = props.cue('csv');
  const seeAt = segment(props, 's02-02').from;
  const firstName = nameAt.login;

  const intro = enter(frame, witnessesAt, { distance: 18, duration: 18 });
  const introOut = fadeOut(frame, firstName - 14, 14);
  const see = progress(frame, seeAt, 36, EASE.out);
  const jsonP = progress(frame, jsonAt, 18);
  const csvP = progress(frame, csvAt, 18);

  return (
    <Stage>
      {/* what a log is */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 1728,
          textAlign: 'center',
          fontFamily: FONT.sans,
          fontSize: 40,
          fontWeight: 750,
          color: C.text,
          whiteSpace: 'nowrap',
          ...intro,
          opacity: intro.opacity * introOut,
        }}
      >
        <span style={{ fontFamily: FONT.mono, color: C.cyan, fontWeight: 800 }}>log</span> · la nota que deja un sistema cuando pasa algo
      </div>

      {SOURCE_ORDER.map((id, i) => {
        const src = SOURCES[id];
        const top = rowTop(i);
        const h = ROW_H[id];
        const mv = progress(frame, nameAt[id] - 8, 28, EASE.inOut);
        const bandX = BAND.centres[i] - BAND.w / 2;
        const figW = mix(BAND.w, WIT_W, mv);
        const x = mix(bandX, 0, mv);
        const y = mix(BAND.y, top + (h - (WIT_W * WITNESS_H) / WITNESS_W) / 2, mv);
        const glow = windowWeight(frame, nameAt[id], nameAt[id] + 80, { ramp: 12, lead: 4 });
        const appear = enter(frame, witnessesAt + i * 5, { distance: 30, duration: 20 });
        const cardOn = progress(frame, nameAt[id] - 2, 18);
        const rawOn = progress(frame, rawAt + i * 8, 18);
        const isEdr = id === 'edr';
        const isLogin = id === 'login';
        const syntax = isEdr ? jsonP : isLogin ? csvP : 0;
        const chip = isEdr ? jsonP : isLogin ? csvP : 0;
        return (
          <div key={id}>
            {/* the witness: in the band, then in its row */}
            <div style={{ position: 'absolute', left: x, top: y, opacity: appear.opacity, transform: mv < 0.01 ? appear.transform : undefined }}>
              <WitnessFigure kind={src.witness} width={figW} see={mv < 0.5 ? see : 1} glow={glow} />
            </div>
            {/* its place, under the figure (band only) */}
            <div
              style={{
                position: 'absolute',
                left: bandX,
                top: BAND.y + BAND_FIG_H + 10,
                width: BAND.w,
                textAlign: 'center',
                fontFamily: FONT.sans,
                fontSize: 36,
                fontWeight: 700,
                color: C.muted,
                opacity: appear.opacity * (1 - mv),
              }}
            >
              {src.place}
            </div>

            {/* the card */}
            {cardOn > 0.01 ? (
              <div style={{ position: 'absolute', left: CARD_X, top, opacity: cardOn, transform: `translateX(${(1 - cardOn) * -34}px)` }}>
                <SourceCard
                  id={id}
                  variant="row"
                  width={CARD_W}
                  height={h}
                  glow={glow}
                  formatShown={progress(frame, rawAt, 14)}
                  longFormat={chip > 0.5}
                  formatChip={chip}
                />
              </div>
            ) : null}

            {/* the raw lines */}
            {rawOn > 0.01 ? (
              <div
                style={{
                  position: 'absolute',
                  left: RAW_X,
                  top,
                  width: RAW_W,
                  height: h,
                  boxSizing: 'border-box',
                  padding: '12px 20px',
                  borderRadius: RADIUS.md,
                  border: `2px solid ${alpha(C.cyan, 0.3)}`,
                  background: alpha(C.ink900, 0.97),
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  opacity: rawOn,
                  transform: `translateX(${(1 - rawOn) * 30}px)`,
                }}
              >
                {RAW[id].map((line, k) => (
                  <RawText key={k} line={line} size={RAW_SIZE} syntax={syntax} />
                ))}
              </div>
            ) : null}
          </div>
        );
      })}

      {/* it is a picture, not the port */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 526,
          width: 1728,
          display: 'flex',
          justifyContent: 'center',
          opacity: intro.opacity * introOut,
        }}
      >
        <div
          style={{
            padding: '6px 22px',
            borderRadius: RADIUS.pill,
            border: `2px solid ${alpha(C.muted, 0.5)}`,
            background: alpha(C.ink850, 0.9),
            fontFamily: FONT.sans,
            fontSize: 28,
            fontWeight: 650,
            color: C.muted,
          }}
        >
          imagen · no es del puerto
        </div>
      </div>

      <CaseStamp frame={frame} />
    </Stage>
  );
}
