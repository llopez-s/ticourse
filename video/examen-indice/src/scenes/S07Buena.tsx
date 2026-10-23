import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui';
import { Dial } from './parts/Dial';
import { PAGE_H, PAGE_W, IndexPage } from './parts/IndexPage';
import { IndexLine, PAPER, Paper, Tag, withOpacity } from './parts/paper';
import { Stage, wordFrame } from './kit';

const S = 's07-buena';
const W = STAGE.width;

const WRAP_CHIPS: { text: string; icon: IconName; word: string }[] = [
  { text: 'corta', icon: 'check', word: 'corta' },
  { text: 'responde sola', icon: 'bolt', word: 'responde' },
  { text: 'un hecho', icon: 'file', word: 'hecho' },
];

/**
 * s07-buena «Qué hace buena a una nota». It opens on the two entries of s06, still unmarked. `good`:
 * «gana la menos inconsistente» lights up (emerald) with a stopwatch «5 s»; `pointer`: the other
 * goes dark, «ver página 12: solo suma un viaje». `page`: the lesson's finished index page
 * (INDEX — page 7 of 12, tab ANALYSIS = yellow, TERM · NOTE · WHERE, six entries, «orden alfabético»);
 * `where`: the WHERE column lights and «B4 = tu libro oficial + página» says what B4 is. `oneline`:
 * the page steps back and an invented entry grows to three lines, with a magnifier and «¿juicio?».
 * `wrap-note`: «corta · responde sola · un hecho».
 */
export function S07Buena(props: SceneProps) {
  const frame = useCurrentFrame();
  const good = props.cue('good');
  const pointer = props.cue('pointer');
  const page = props.cue('page');
  const where = props.cue('where');
  const oneline = props.cue('oneline');
  const wrap = props.cue('wrap-note');

  const shift = progress(frame, 0, 24, EASE.inOut);
  const goodP = progress(frame, good, 14);
  const ptrP = progress(frame, pointer, 14);
  const secP = progress(frame, good + 4, 50, EASE.inOut);
  const pairOut = progress(frame, page - 10, 14, EASE.inOut);

  const whereP = progress(frame, where, 16);
  const alphaAt = wordFrame(S, 's07-03', 'alfabético') - 6;
  const pageOut = progress(frame, wrap - 12, 14, EASE.inOut);
  const toSide = progress(frame, oneline - 10, 24, EASE.inOut);
  const pageScale = 1 - 0.4 * toSide;

  const lupaAt = wordFrame(S, 's07-05', 'sospecha') - 6;
  const juicioAt = wordFrame(S, 's07-05', 'juicio') - 6;

  return (
    <Stage>
      {/* the two entries of s06 */}
      {pairOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - pairOut, transform: `translateY(${-pairOut * 26}px)` }}>
          <div
            style={{
              position: 'absolute',
              left: 114 * (1 - shift),
              top: 250,
              filter: goodP > 0.05 ? undefined : undefined,
              transform: `scale(${1 + 0.02 * goodP})`,
              transformOrigin: 'left center',
            }}
          >
            <div style={{ position: 'relative' }}>
              <IndexLine term="ACH" note="gana la menos inconsistente" where="S4M3" width={1500} size={46} state={goodP > 0.3 ? 'good' : 'plain'} style={{ borderColor: goodP > 0.05 ? alpha(C.emerald, 0.9) : undefined, boxShadow: goodP > 0.05 ? `0 0 ${Math.round(40 * goodP)}px ${alpha(C.emerald, 0.6 * goodP)}, 0 14px 30px ${alpha('#000000', 0.45)}` : undefined }} />
            </div>
          </div>
          <div style={{ position: 'absolute', left: 114 * (1 - shift), top: 410, opacity: 1 - 0.58 * ptrP, filter: ptrP > 0.05 ? `saturate(${1 - 0.7 * ptrP})` : undefined }}>
            <IndexLine term="ACH" note="ver página 12" where="S4M3" width={1500} size={46} state={ptrP > 0.3 ? 'pointer' : 'plain'} />
            {ptrP > 0.02 ? (
              <div style={{ position: 'absolute', left: 90, top: 50 - 3, width: 640 * ptrP, height: 6, borderRadius: 3, background: C.rose }} />
            ) : null}
          </div>
          {/* stopwatch for the good one */}
          {goodP > 0.02 ? (
            <div style={{ position: 'absolute', left: 1522, top: 214, opacity: goodP, transform: `scale(${0.7 + 0.3 * goodP})`, transformOrigin: 'left top' }}>
              <Dial size={170} sweep={secP / 12} hand={secP / 12} color={C.emerald} stopwatch glow={0.6} />
              <div style={{ marginTop: 6, textAlign: 'center', width: 170, fontFamily: FONT.sans, fontSize: 64, fontWeight: 850, color: C.emerald, lineHeight: 1 }}>5 s</div>
            </div>
          ) : null}
          {ptrP > 0.02 ? (
            <div style={{ position: 'absolute', left: 0, top: 538, opacity: ptrP, transform: `translateY(${(1 - ptrP) * 14}px)` }}>
              <Tag color={C.amber} size={42} icon="alert">
                ver página 12: solo suma un viaje
              </Tag>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* the finished page */}
      {frame >= page - 8 && pageOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: (1 - pageOut) * progress(frame, page - 8, 12) }}>
          <div style={{ position: 'absolute', left: 0, top: 12, transform: `scale(${pageScale})`, transformOrigin: 'left top', opacity: 1 - 0.35 * toSide }}>
            <IndexPage frame={frame} at={page} where={whereP} />
          </div>
          {frame >= alphaAt - 4 ? (
            <div style={{ position: 'absolute', left: 0, top: 12 + PAGE_H + 30, ...enter(frame, alphaAt, { distance: 14 }), opacity: progress(frame, alphaAt, 10) * (1 - toSide) }}>
              <Tag color={C.cyan} size={36} icon="arrowDown">
                orden alfabético estricto
              </Tag>
            </div>
          ) : null}
          {whereP > 0.02 ? (
            <div style={{ position: 'absolute', left: PAGE_W - 640, top: 12 + PAGE_H + 30, opacity: whereP * (1 - toSide), transform: `translateY(${(1 - whereP) * 14}px)` }}>
              <Tag color={C.cyan} size={36} solid>
                B4 = tu libro oficial + página
              </Tag>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* the invented, over-long entry */}
      {frame >= oneline - 6 && pageOut < 1 ? (
        <div style={{ position: 'absolute', left: 880, top: 190, width: W - 880, ...withOpacity(enter(frame, oneline, { distance: 36, axis: 'x' }), 1 - pageOut) }}>
          <Paper w={W - 880} style={{ padding: '26px 34px 30px', borderColor: alpha(C.amber, 0.8) }} glow={0.4} glowColor={C.amber}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 46, fontWeight: 850 }}>Atribución</span>
              <span style={{ fontFamily: FONT.mono, fontSize: 30, fontWeight: 700, color: PAPER.soft }}>S4M5</span>
            </div>
            <div style={{ marginTop: 14, fontSize: 40, fontWeight: 650, lineHeight: 1.22, color: PAPER.amber }}>
              razones por las que deberías sospechar de esta atribución: el idioma, el horario y las herramientas...
            </div>
          </Paper>
          {frame >= lupaAt - 4 ? (
            <div style={{ position: 'absolute', right: 20, top: 250, width: 160, height: 160, borderRadius: 80, display: 'grid', placeItems: 'center', background: alpha(C.ink950, 0.85), border: `5px solid ${C.amber}`, boxShadow: `0 0 40px ${alpha(C.amber, 0.45)}`, ...enter(frame, lupaAt, { distance: 24 }) }}>
              <Icon name="search" size={92} color={C.amber} strokeWidth={2.2} />
            </div>
          ) : null}
          {frame >= juicioAt - 4 ? (
            <div style={{ position: 'absolute', left: 30, top: 300, ...enter(frame, juicioAt, { distance: 18 }) }}>
              <Tag color={C.rose} size={52} solid>
                ¿juicio?
              </Tag>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* wrap */}
      {frame >= wrap - 4 ? (
        <div style={{ position: 'absolute', left: 0, top: 250, width: W, display: 'flex', justifyContent: 'center', gap: 36, fontFamily: FONT.sans }}>
          {WRAP_CHIPS.map((c) => {
            const at = wordFrame(S, 's07-06', c.word) - 8;
            return (
              <div key={c.text} style={enter(frame, at, { distance: 30 })}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 22, padding: '18px 42px 22px 30px', borderRadius: RADIUS.pill, background: alpha(C.emerald, 0.12), border: `4px solid ${alpha(C.emerald, 0.85)}`, boxShadow: `0 0 36px ${alpha(C.emerald, 0.25)}`, fontSize: 68, fontWeight: 850, letterSpacing: -1, color: C.textStrong, whiteSpace: 'nowrap' }}>
                  <Icon name={c.icon} size={70} color={C.emerald} strokeWidth={2.4} />
                  {c.text}
                </span>
              </div>
            );
          })}
        </div>
      ) : null}
    </Stage>
  );
}
