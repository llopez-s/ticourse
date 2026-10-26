import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { S01_ASK, S01_CONTEXT, S01_PANEL, S01_PROMISE, S01_TITLE } from '../data/s01-hook';
import { Desk } from './parts/Desk';
import { Odometer } from './parts/Odometer';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;
const H = STAGE.height;

/** Ask strip and example panel: big and centred while the question lands, small on the left for the title. */
const STRIP = { w: 1130, h: 96, a: { x: (W - 1130) / 2, y: 104, s: 1 }, b: { x: 20, y: 100, s: 0.55 } } as const;
const PANEL = { w: 1490, h: 330, a: { x: (W - 1490) / 2, y: 226, s: 1 }, b: { x: 20, y: 176, s: 0.6 } } as const;
const TILE_W = 450;
const TITLE_X = 960;

/**
 * s01-hook «¿Sirve de algo el equipo?».
 *   start    the context strip over a desk seen from above (nothing else: no date, no alert).
 *   ask      the CISO's strip slides in (mail sfx): a question, not a decision.
 *   panel    an example panel lands on the desk, «cifras ficticias»; empty counters.
 *   numbers  the three counters fill: digits that only blur and rise, nothing readable.
 *   title    (always before 12 s) strip and panel step aside and the title lands.
 *   promise  three chips, each on its words: qué medir · a quién preguntar · cómo madura un equipo.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const askAt = props.cue('ask');
  const panelAt = props.cue('panel');
  const numbersAt = props.cue('numbers');
  const promiseAt = props.cue('promise');
  // The title is on screen before 12 s, whatever the voice does.
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const w1 = (word: string) => wordFrame(S, 's01-01', word);
  const w2 = (word: string) => wordFrame(S, 's01-02', word);

  const stripIn = progress(frame, 0, 16);
  const youLit = progress(frame, w1('tú') - 6, 14);
  const shrink = progress(frame, titleAt - 10, 28, EASE.inOut);

  const strip = { x: mix(STRIP.a.x, STRIP.b.x, shrink), y: mix(STRIP.a.y, STRIP.b.y, shrink), s: mix(STRIP.a.s, STRIP.b.s, shrink) };
  const panel = { x: mix(PANEL.a.x, PANEL.b.x, shrink), y: mix(PANEL.a.y, PANEL.b.y, shrink), s: mix(PANEL.a.s, PANEL.b.s, shrink) };
  const askIn = enter(frame, askAt - 6, { distance: -220, axis: 'x', duration: 16 });
  const panelIn = enter(frame, panelAt - 6, { distance: 46, duration: 18 });

  const titleIn = enter(frame, titleAt, { distance: 24, duration: 18 });
  const subIn = enter(frame, titleAt + 8, { distance: 16, duration: 16 });
  const chipAt = S01_PROMISE.map((p) => Math.max(promiseAt - 2, w2(p.word) - 6));

  return (
    <Stage>
      {/* The desk */}
      <div style={{ position: 'absolute', left: 0, top: 86, opacity: progress(frame, 0, 20) }}>
        <Desk width={W} height={H - 86} />
      </div>

      {/* Who and where */}
      <div style={{ position: 'absolute', left: 0, top: 8, width: W, display: 'flex', justifyContent: 'center', opacity: stripIn }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: 16,
            height: 58,
            boxSizing: 'border-box',
            padding: '8px 30px 0',
            borderRadius: RADIUS.pill,
            border: `2px solid ${alpha(C.cyan, 0.4 + 0.5 * youLit)}`,
            background: alpha(C.ink900, 0.9),
            boxShadow: youLit > 0.02 ? `0 0 ${Math.round(24 * youLit)}px ${alpha(C.cyan, 0.3 * youLit)}` : undefined,
            fontFamily: FONT.sans,
            fontSize: 34,
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontWeight: 850, color: C.textStrong }}>{S01_CONTEXT[0]}</span>
          <span style={{ color: C.faint }}>·</span>
          <span style={{ fontWeight: 700, color: C.text }}>{S01_CONTEXT[1]}</span>
          <span style={{ color: C.faint }}>·</span>
          <span style={{ fontWeight: 800, color: youLit > 0.5 ? C.cyanSoft : C.text, opacity: 0.6 + 0.4 * youLit }}>{S01_CONTEXT[2]}</span>
        </div>
      </div>

      {/* The CISO's strip: a question */}
      {frame >= askAt - 8 ? (
        <div style={{ position: 'absolute', left: strip.x, top: strip.y, width: STRIP.w, height: STRIP.h, transform: `scale(${strip.s})`, transformOrigin: '0 0' }}>
          <div
            style={{
              ...askIn,
              width: STRIP.w,
              height: STRIP.h,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              gap: 22,
              padding: '0 34px 0 22px',
              borderRadius: 22,
              border: `3px solid ${alpha(C.sky, 0.75)}`,
              background: `linear-gradient(90deg, ${alpha(C.sky, 0.2)} 0%, ${alpha(C.ink900, 0.97)} 62%)`,
              boxShadow: `0 20px 44px ${alpha('#000000', 0.4)}`,
              fontFamily: FONT.sans,
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: 32, fontWeight: 800, color: '#bae6fd' }}>
              <Icon name="user" size={44} color={C.sky} />
              {S01_ASK.who}
            </span>
            <span style={{ fontSize: 44, fontWeight: 800, color: C.textStrong, letterSpacing: -0.5 }}>{S01_ASK.text}</span>
          </div>
        </div>
      ) : null}

      {/* The example panel: three counters that only blur and rise */}
      {frame >= panelAt - 8 ? (
        <div style={{ position: 'absolute', left: panel.x, top: panel.y, width: PANEL.w, height: PANEL.h, transform: `scale(${panel.s})`, transformOrigin: '0 0' }}>
          <div
            style={{
              ...panelIn,
              width: PANEL.w,
              height: PANEL.h,
              boxSizing: 'border-box',
              padding: '24px 40px',
              borderRadius: 28,
              border: `2px solid ${alpha(C.amber, 0.5)}`,
              background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
              boxShadow: `0 30px 70px ${alpha('#000000', 0.45)}`,
              fontFamily: FONT.sans,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 32, fontWeight: 800, color: C.amber, whiteSpace: 'nowrap' }}>
              <Icon name="chart" size={38} color={C.amber} />
              {S01_PANEL.title}
            </div>
            <div style={{ marginTop: 22, display: 'flex', gap: 30 }}>
              {S01_PANEL.counters.map((label, i) => (
                <div
                  key={label}
                  style={{
                    width: TILE_W,
                    height: 208,
                    boxSizing: 'border-box',
                    padding: '22px 22px 0',
                    borderRadius: 22,
                    border: `2px solid ${C.ink600}`,
                    background: alpha(C.ink800, 0.9),
                  }}
                >
                  <div style={{ fontSize: 32, fontWeight: 700, color: C.text, whiteSpace: 'nowrap' }}>{label}</div>
                  <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Odometer frame={frame} startAt={numbersAt + i * 10} digits={5} size={84} color={C.cyan} blur={8} seed={i * 2} />
                    <Icon name="arrowUp" size={48} color={C.emerald} style={{ opacity: progress(frame, numbersAt + i * 10 + 20, 14) }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Title and promise */}
      {frame >= titleAt - 2 ? (
        <div style={{ position: 'absolute', left: TITLE_X, top: 108, width: W - TITLE_X, fontFamily: FONT.sans }}>
          <div style={{ ...titleIn, fontSize: 76, fontWeight: 850, color: C.textStrong, letterSpacing: -1.5, lineHeight: 1.06, whiteSpace: 'nowrap' }}>
            {S01_TITLE.lines.map((l) => (
              <div key={l}>{l}</div>
            ))}
          </div>
          <div style={{ ...subIn, marginTop: 20, fontSize: 42, fontWeight: 700, lineHeight: 1.2, color: C.cyanSoft, whiteSpace: 'nowrap' }}>
            {S01_TITLE.sub.map((l) => (
              <div key={l}>{l}</div>
            ))}
          </div>
        </div>
      ) : null}
      {frame >= chipAt[0] - 2 ? (
        <div style={{ position: 'absolute', left: TITLE_X, top: 392, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14 }}>
          {S01_PROMISE.map((p, i) => {
            const e = enter(frame, chipAt[i], { distance: 18, axis: 'x' });
            const lit = progress(frame, chipAt[i], 10) * (1 - 0.45 * progress(frame, (chipAt[i + 1] ?? chipAt[i] + 90) - 2, 12, EASE.inOut));
            return (
              <div
                key={p.text}
                style={{
                  ...e,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 14,
                  height: 66,
                  padding: '0 28px 0 20px',
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.pill,
                  border: `2px solid ${alpha(C.cyan, 0.4 + 0.5 * lit)}`,
                  background: alpha(C.ink900, 0.9),
                  boxShadow: lit > 0 ? `0 0 ${Math.round(24 * lit)}px ${alpha(C.cyan, 0.3 * lit)}` : undefined,
                  fontFamily: FONT.sans,
                  fontSize: 36,
                  fontWeight: 750,
                  color: C.textStrong,
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon name={p.icon} size={38} color={C.cyan} />
                {p.text}
              </div>
            );
          })}
        </div>
      ) : null}
    </Stage>
  );
}
