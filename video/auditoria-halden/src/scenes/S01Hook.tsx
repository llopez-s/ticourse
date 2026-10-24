import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { enter, progress, pulse } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui';
import { PLAQUE, STAMP } from '../data/shared';
import { BoardTable } from './parts/Board';
import { Bars, Sheet, SignatureGap } from './parts/Docs';
import { CHIP_H, CaseStamp, PlaqueChip, Pill } from './parts/Labels';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';

// ---- Left: the board's table with the document in the middle. Right column: the three phrases, then plate, title and chips.
const TABLE_TOP = 104;
const COL_X = 930;
const PLAQUE_TOP = 120;
const TITLE_TOP = 186;
const TITLE_SIZE = 100;
const CHIPS_TOP = 440;
const CHIP_GAP = 16;
const PHRASE_TOP = 176;
const PHRASE_STEP = 124;

const THREE: readonly { text: string; verb: string; rest: string; icon: IconName; tone: string }[] = [
  { text: 'lo declaramos', verb: 'declaramos', rest: 'lo ', icon: 'file', tone: C.sky },
  { text: 'lo comprobamos', verb: 'comprobamos', rest: 'lo ', icon: 'search', tone: C.cyan },
  { text: 'lo probamos', verb: 'probamos', rest: 'lo ', icon: 'target', tone: C.rose },
];

const PROMISE: readonly { text: string; icon: IconName; word: string; tone: string }[] = [
  { text: 'quién lo firma', icon: 'file', word: 'firma', tone: C.sky },
  { text: 'quién lo comprueba', icon: 'search', word: 'comprueba', tone: C.cyan },
  { text: 'cómo se prueba', icon: 'target', word: 'prueba', tone: C.rose },
];

/**
 * s01-hook «Decirlo no es demostrarlo». The case stamp «Autoridad Portuaria de Halden · propuesta · sin fecha» sits
 * top-left from the first frame. On `table` the board's table comes in seen from above, a document in its middle with an
 * empty dashed gap where the signature goes (nothing is signed). On `three` the phrases «lo declaramos» · «lo
 * comprobamos» · «lo probamos» come in one after another on the right (sky, cyan, rose). On `title` (before 12 s) they
 * give way to the plate «SY0-701 · 5.5» and the title «Cumplir o aguantar»; on `promise` three chips, each lit on its
 * words — quién lo firma, quién lo comprueba, cómo se prueba — and, at the closing «demostrarlo», the empty gap pulses.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stampAt = -6;
  const tableAt = props.cue('table') - 10;
  // Title before 12 s, whatever the voice does.
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const p2 = Math.min(props.cue('three') + 40, titleAt - 26);
  const p1 = Math.min(props.cue('three') + 20, p2 - 16);
  const p0 = Math.min(props.cue('three'), p1 - 16);
  const phraseAt = [p0, p1, p2];
  const chipAt = PROMISE.map((p, i) => {
    const at = wordFrame(S, 's01-03', p.word) - 6;
    return i === 0 ? Math.min(at, props.cue('promise') + 14) : at;
  });
  const lastWord = wordFrame(S, 's01-03', 'demostrarlo');

  const stampIn = enter(frame, stampAt, { distance: 16, duration: 16 });
  const tableIn = enter(frame, tableAt, { distance: 24, duration: 22 });
  const docIn = enter(frame, tableAt + 12, { distance: 26, duration: 20 });
  const phrasesOut = progress(frame, titleAt - 10, 12);
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const plaqueIn = enter(frame, titleAt - 4, { distance: 14, duration: 16 });
  const chipOn = PROMISE.map((_, i) => progress(frame, chipAt[i], 10) * (1 - 0.55 * progress(frame, (chipAt[i + 1] ?? lastWord) - 2, 12)));
  const gapPulse = progress(frame, lastWord - 4, 10) * (0.5 + 0.5 * pulse(frame, fps, 0.8));

  return (
    <Stage>
      {/* Case stamp */}
      <div style={{ position: 'absolute', left: 0, top: 0, ...stampIn }}>
        <CaseStamp what={STAMP.what} kind={STAMP.kind} />
      </div>

      {/* The board's table, the document and its empty signature gap */}
      {frame >= tableAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: TABLE_TOP, ...tableIn }}>
          <BoardTable glow={docIn.opacity}>
            <div style={{ position: 'absolute', left: 330, top: 168, opacity: docIn.opacity, transform: `${docIn.transform} rotate(-2deg)` }}>
              <Sheet width={220} height={184} tone={C.sky} glow={0.2 + 0.6 * gapPulse}>
                <div style={{ padding: '22px 22px 0' }}>
                  <Bars widths={[62, 100, 100, 84]} gap={13} h={9} />
                </div>
                <div style={{ position: 'absolute', left: 22, bottom: 18 }}>
                  <SignatureGap width={176} height={50} pulse={gapPulse} />
                </div>
              </Sheet>
            </div>
          </BoardTable>
        </div>
      ) : null}

      {/* The three plain phrases, one after another */}
      {phrasesOut < 0.98
        ? THREE.map((t, i) => {
            if (frame < phraseAt[i] - 2) return null;
            const e = enter(frame, phraseAt[i], { distance: 28, axis: 'x', duration: 16 });
            const isLast = i === THREE.length - 1;
            return (
              <div
                key={t.text}
                style={{
                  position: 'absolute',
                  left: COL_X,
                  top: PHRASE_TOP + i * PHRASE_STEP,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 24,
                  height: 92,
                  padding: '0 40px 0 28px',
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.lg,
                  border: `3px solid ${alpha(t.tone, 0.8)}`,
                  background: alpha(t.tone, 0.1),
                  boxShadow: `0 0 28px ${alpha(t.tone, 0.2)}`,
                  fontFamily: FONT.sans,
                  fontSize: 58,
                  fontWeight: 850,
                  color: C.textStrong,
                  whiteSpace: 'nowrap',
                  opacity: e.opacity * (1 - phrasesOut) * (isLast ? 1 : 0.9),
                  transform: e.transform,
                }}
              >
                <Icon name={t.icon} size={54} color={t.tone} strokeWidth={2.2} />
                <span>
                  {t.rest}
                  <span style={{ color: t.tone }}>{t.verb}</span>
                </span>
              </div>
            );
          })
        : null}

      {/* Plate, title and promise */}
      {frame >= titleAt - 6 ? (
        <div style={{ position: 'absolute', left: COL_X, top: PLAQUE_TOP, ...plaqueIn }}>
          <PlaqueChip text={PLAQUE} />
        </div>
      ) : null}
      {frame >= titleAt - 2 ? (
        <div style={{ position: 'absolute', left: COL_X, top: TITLE_TOP, fontFamily: FONT.sans, ...titleIn }}>
          {['Cumplir', 'o aguantar'].map((l, k) => (
            <div
              key={l}
              style={{
                fontSize: TITLE_SIZE,
                fontWeight: 900,
                letterSpacing: -2,
                lineHeight: 1.04,
                color: k === 0 ? C.cyan : C.roseSoft,
                whiteSpace: 'nowrap',
                textShadow: `0 0 30px ${alpha(k === 0 ? C.cyan : C.rose, 0.22)}`,
              }}
            >
              {l}
            </div>
          ))}
        </div>
      ) : null}
      {PROMISE.map((p, i) => {
        if (frame < chipAt[i] - 2) return null;
        const e = enter(frame, chipAt[i], { distance: 16 });
        return (
          <div key={p.text} style={{ position: 'absolute', left: COL_X, top: CHIPS_TOP + i * (CHIP_H + CHIP_GAP), ...e }}>
            <Pill icon={p.icon} text={p.text} on={chipOn[i]} tone={p.tone} size={36} />
          </div>
        );
      })}
    </Stage>
  );
}
