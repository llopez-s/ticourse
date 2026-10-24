import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Building, Icon, dimStyle, mix } from '../../../engine/src/ui';
import { IP, MERIDIAN, TITLE } from '../data/canon';
import { CISO_QUESTION, CisoStrip } from './parts/CisoStrip';
import { LogWindow } from './parts/LogWindow';
import { Stage, wordFrame } from './kit';

const S = 's01-ip';
const W = STAGE.width;

/** The promise, one chip per sentence of s01-05 (canon: storyboard goal). `word`/`nth` is the word each lands on. */
const PROMISE = [
  { text: 'cuándo un dato es inteligencia', word: 'cuándo', nth: 0 },
  { text: 'qué es una amenaza de verdad', word: 'qué', nth: 0 },
  { text: 'qué parte del riesgo es tuya', word: 'qué', nth: 1 },
] as const;

// Left column (Meridian's group), right column (CISO strip, the log window in front of it, the board's rumour).
const LEFT_W = 780;
const GROUP_H = 434;
const COL_TOP = 150;
const RIGHT = { x: 880, w: 800 } as const;
const LOG = { x: 960, w: 720, top: 366 } as const;
const RUMOUR_TOP = 590;

/**
 * s01-ip «Una línea del registro». Meridian's building rises alone in the middle of the stage; as the voice says
 * «Meridian» the labels land under it («Meridian Dynamics · aeroespacial», then «tú, su analista de inteligencia» with
 * the lesson's «primera analista…» small beneath). Before 10 s (`title`) the title lands across the top and the group
 * steps to the left. On `ciso` the CISO strip enters on the right, and as the voice says «una línea» the proxy window
 * with ONE line (just the IP, nothing else) slides in front of it; its question «¿qué sabemos de esto?» is typed on
 * «qué sabemos». On `ip` the window takes the light and the IP is framed on the words «dirección IP» (the voice never
 * reads the number). A small, dimmed strip carries the lesson's rumour («rumores de robo de diseños…»). On `promise`
 * the left group makes way for three chips, one per sentence, and the right side steps back.
 */
export function S01Ip(props: SceneProps) {
  const frame = useCurrentFrame();
  const meridian = props.cue('meridian');
  const titleCue = props.cue('title');
  const ciso = props.cue('ciso');
  const ipCue = props.cue('ip');
  const promise = props.cue('promise');

  // ---- Left group: labels land on the words of s01-01.
  const orgAt = Math.max(meridian, wordFrame(S, 's01-01', 'Meridian') - 8);
  const sectorAt = wordFrame(S, 's01-01', 'aeroespacial') - 6;
  const youAt = wordFrame(S, 's01-01', 'analista') - 8;
  const firstAt = wordFrame(S, 's01-01', 'fichar') - 20;

  // ---- Title before 10 s, whatever the voice does.
  const titleAt = Math.min(titleCue - 6, 10 * 30 - 24);
  const toB = progress(frame, titleAt - 6, 26, EASE.inOut);
  const groupX = mix(W / 2, LEFT_W / 2, toB);
  const groupTop = mix((STAGE.height - GROUP_H) / 2, COL_TOP, toB);
  const groupScale = mix(1.1, 1, toB);
  const leftOut = progress(frame, promise - 8, 16, EASE.inOut);

  // ---- Right column.
  const cisoIn = enter(frame, ciso - 6, { distance: 30, duration: 18, axis: 'x' });
  const logAt = wordFrame(S, 's01-02', 'línea') - 8;
  const questionAt = wordFrame(S, 's01-03', 'sabemos') - 6;
  const ipWord = wordFrame(S, 's01-03', 'IP') - 6;
  const hot = progress(frame, ipWord, 12);
  const logFocus = progress(frame, ipCue, 14) * (1 - progress(frame, questionAt + 24, 20, EASE.inOut));
  const cisoDim = 0.35 * progress(frame, ipCue, 14) * (1 - progress(frame, questionAt - 4, 14)) + 0.5 * progress(frame, promise, 18, EASE.inOut);
  const rumourAt = wordFrame(S, 's01-04', 'rumores') - 6;
  const rightBack = 0.6 * progress(frame, promise, 18, EASE.inOut);

  // ---- Promise chips.
  const chipAt = PROMISE.map((p, i) => (i === 0 ? promise + 6 : wordFrame(S, 's01-05', p.word, p.nth) - 6));
  const lastLit = progress(frame, chipAt[2] + 54, 16, EASE.inOut);

  // ---- Title.
  const titleIn = enter(frame, titleAt, { distance: 24, duration: 18 });
  const subIn = enter(frame, titleAt + 10, { distance: 12, duration: 16 });

  return (
    <Stage>
      {/* Title */}
      {frame >= titleAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, textAlign: 'center', fontFamily: FONT.sans }}>
          <div style={{ fontSize: 82, fontWeight: 900, letterSpacing: -1.6, lineHeight: 1, whiteSpace: 'nowrap', ...titleIn }}>
            <span style={{ color: C.cyan, textShadow: `0 0 34px ${alpha(C.cyan, 0.28)}` }}>{TITLE.lead}</span>
            <span style={{ color: C.textStrong }}> {TITLE.rest}</span>
          </div>
          <div style={{ marginTop: 16, fontSize: 36, fontWeight: 700, lineHeight: 1.1, color: C.cyanSoft, whiteSpace: 'nowrap', ...subIn }}>{TITLE.sub}</div>
        </div>
      ) : null}

      {/* Meridian's group: building, then the labels */}
      {leftOut < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: groupX - LEFT_W / 2,
            top: groupTop,
            width: LEFT_W,
            height: GROUP_H,
            transform: `scale(${groupScale})`,
            transformOrigin: '50% 0',
            opacity: 1 - leftOut,
            fontFamily: FONT.sans,
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Building width={210} height={150} cols={5} rows={5} seed={3} mix={{ cyan: 0.34, amber: 0.04 }} tone="cyan" glow={0.2} at={2} />
          </div>
          <div style={{ marginTop: 18, fontSize: 54, fontWeight: 850, letterSpacing: -0.8, lineHeight: 1.12, color: C.textStrong, ...enter(frame, orgAt, { distance: 14 }) }}>{MERIDIAN.org}</div>
          <div style={{ fontSize: 36, fontWeight: 650, lineHeight: 1.2, color: C.muted, ...enter(frame, sectorAt, { distance: 10 }) }}>{MERIDIAN.sector}</div>
          <div style={{ marginTop: 14, fontSize: 40, fontWeight: 800, lineHeight: 1.15, color: C.cyanSoft, ...enter(frame, youAt, { distance: 14 }) }}>{MERIDIAN.you}</div>
          <div style={{ marginTop: 6, fontSize: 28, fontWeight: 600, lineHeight: 1.2, color: C.faint, ...enter(frame, firstAt, { distance: 8 }) }}>{MERIDIAN.first}</div>
        </div>
      ) : null}

      {/* The CISO's strip, the proxy window in front of it, the rumour */}
      {frame >= ciso - 8 ? (
        <div style={{ position: 'absolute', inset: 0 }}>
          <div style={{ position: 'absolute', left: RIGHT.x, top: COL_TOP, ...cisoIn, ...dimStyle(cisoDim, cisoIn.opacity) }}>
            <CisoStrip width={RIGHT.w} question={CISO_QUESTION} questionShow={progress(frame, questionAt, 14)} questionSize={52} />
          </div>
          {frame >= logAt - 2 ? (
            <div style={{ position: 'absolute', left: LOG.x, top: LOG.top, ...enter(frame, logAt, { distance: 26, duration: 18, axis: 'y' }), ...dimStyle(rightBack, enter(frame, logAt, { distance: 0, duration: 18 }).opacity) }}>
              <LogWindow width={LOG.w} ip={IP} hot={hot} glow={logFocus} />
            </div>
          ) : null}
          {frame >= rumourAt - 2 ? (
            <div
              style={{
                position: 'absolute',
                left: RIGHT.x,
                top: RUMOUR_TOP,
                width: 864,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '8px 20px',
                boxSizing: 'border-box',
                borderRadius: RADIUS.pill,
                border: `2px solid ${alpha(C.faint, 0.45)}`,
                background: alpha(C.ink900, 0.7),
                fontFamily: FONT.sans,
                fontSize: 26,
                fontWeight: 600,
                color: C.muted,
                whiteSpace: 'nowrap',
                ...enter(frame, rumourAt, { distance: 14 }),
                opacity: enter(frame, rumourAt, { distance: 0 }).opacity * (0.75 - 0.35 * rightBack),
              }}
            >
              <Icon name="users" size={30} color={C.faint} />
              rumores de robo de diseños en el sector · el consejo, nervioso
            </div>
          ) : null}
        </div>
      ) : null}

      {/* The promise: three chips, one per sentence */}
      {frame >= chipAt[0] - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: 240, width: LEFT_W, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
          {PROMISE.map((p, i) => {
            const e = enter(frame, chipAt[i], { distance: 18 });
            const on = Math.max(lastLit, progress(frame, chipAt[i], 10) * (1 - 0.55 * progress(frame, (chipAt[i + 1] ?? chipAt[i] + 400) - 2, 12, EASE.inOut)));
            return (
              <div
                key={p.text}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: 78,
                  padding: '0 36px',
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.pill,
                  border: `2px solid ${alpha(C.cyan, 0.4 + 0.5 * on)}`,
                  background: alpha(C.cyan, 0.06 + 0.12 * on),
                  boxShadow: on > 0.02 ? `0 0 ${Math.round(24 * on)}px ${alpha(C.cyan, 0.3 * on)}` : undefined,
                  fontFamily: FONT.sans,
                  fontSize: 44,
                  fontWeight: 750,
                  color: alpha(C.textStrong, 0.6 + 0.4 * on),
                  whiteSpace: 'nowrap',
                  ...e,
                }}
              >
                {p.text}
              </div>
            );
          })}
        </div>
      ) : null}
    </Stage>
  );
}
