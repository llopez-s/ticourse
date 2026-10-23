import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui';
import { Binder } from './parts/Binder';
import { OpenBook, PagePile } from './parts/Book';
import { Climber } from './parts/Climber';
import { Dial } from './parts/Dial';
import { Tag } from './parts/paper';
import { Stage, segment, wordFrame } from './kit';

const S = 's02-abierto';
const W = STAGE.width;

const FORMAT_CHIPS: { text: string; icon: IconName; word: string | null }[] = [
  { text: 'examen con vigilancia (proctored)', icon: 'eye', word: 'vigilancia' },
  { text: 'material impreso permitido', icon: 'file', word: 'impreso' },
  { text: 'sin dispositivos electrónicos', icon: 'unplug', word: null },
];

/**
 * s02-abierto «A libro abierto, sin tiempo para todo». `format`: the card «lo que dice el
 * temario de la app» with its three chips (proctored, impreso, sin dispositivos); `verify`: the
 * amber stamp «el formato puede cambiar» lands on it and the sky box «giac.org · compruébalo
 * tú» opens beside it (no figures anywhere). `indep`: the disclaimer seal pins itself at the
 * bottom-left and stays. `open`: the card steps aside, a thick book rises with the ribbon
 * «open-book». `reply-a`: the book has been swelling since the message started typing until it
 * fills the stage; the answer stops it (rose flash, shake), and it shrinks away. `time`: a pile of
 * pages («cada duda, un viaje»), then the index and a dial with «-60 s cuando dudas entre dos
 * respuestas». `rope`: the climber with the backpack-index and the rope («para las dudas», «no
 * sube por ti»). `wrap-open`: «open-book = cuerda para las dudas · no sustituye al estudio».
 * The top ~170 px stay free of text while the intercepted message is up (s02-04).
 */
export function S02Abierto(props: SceneProps) {
  const frame = useCurrentFrame();
  const format = props.cue('format');
  const verify = props.cue('verify');
  const indep = props.cue('indep');
  const open = props.cue('open');
  const reply = props.cue('reply-a');
  const time = props.cue('time');
  const rope = props.cue('rope');
  const wrap = props.cue('wrap-open');
  const msgStart = segment(props, 's02-03').to; // the typed message begins right after s02-03

  // ---- format card + verify
  const chipAt = [wordFrame(S, 's02-01', 'vigilancia') - 8, wordFrame(S, 's02-01', 'impreso') - 8, 0];
  chipAt[2] = chipAt[1] + 50;
  const stampAt = wordFrame(S, 's02-02', 'cambiar') - 4;
  const boxAt = wordFrame(S, 's02-02', 'web') - 6;
  const cardOut = progress(frame, open - 12, 18, EASE.inOut);
  // At `verify` the format card steps back: the eye goes to the stamp and the giac.org box.
  const cardBack = progress(frame, verify, 14);

  // ---- the book
  const bookIn = progress(frame, open, 22);
  const g1 = progress(frame, open + 20, 140, EASE.inOut);
  const g2 = progress(frame, msgStart + 24, 86, EASE.in);
  const recoil = progress(frame, reply + 4, 46, EASE.inOut);
  const rawScale = 0.9 + 0.3 * g1 + 1.95 * g2;
  const bookScale = rawScale - (rawScale - 0.7) * recoil;
  const bookFade = Math.min(bookIn, 1 - progress(frame, reply + 30, 26));
  const shake = frame >= reply && frame < reply + 22 ? Math.sin((frame - reply) * 2.4) * 9 * (1 - (frame - reply) / 22) : 0;
  const stopFlash = frame >= reply ? Math.max(0, 1 - (frame - reply) / 30) : 0;
  const ribbonAt = wordFrame(S, 's02-03', 'open-book') - 6;

  // ---- time: pile, index, dial
  const viajeAt = wordFrame(S, 's02-04', 'viaje') - 14;
  const pileIn = progress(frame, viajeAt, 18);
  const dialIn = progress(frame, time - 4, 16);
  const idxAt = wordFrame(S, 's02-05', 'índice') - 8;
  const secAt = wordFrame(S, 's02-05', 'sesenta') - 6;
  const sweep = progress(frame, secAt, 60, EASE.inOut);
  const timeOut = progress(frame, rope - 14, 16, EASE.inOut);

  // ---- rope
  const climberIn = progress(frame, rope - 6, 18);
  const dudasAt = wordFrame(S, 's02-06', 'resbalas') - 8;
  const subesAt = wordFrame(S, 's02-06', 'subes') - 6;
  const climb = progress(frame, rope + 20, 150, EASE.inOut) * 0.55;

  // ---- wrap
  const wrapEq = wordFrame(S, 's02-07', 'ayuda') - 6;
  const wrapNo = wordFrame(S, 's02-07', 'sustituye') - 6;

  return (
    <Stage>
      {/* the format card and the giac.org box */}
      {cardOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - cardOut, transform: `translateY(${-cardOut * 24}px)` }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 24,
              width: 1020,
              filter: cardBack > 0.02 ? `saturate(${1 - 0.4 * cardBack}) brightness(${1 - 0.25 * cardBack})` : undefined,
              height: 432,
              boxSizing: 'border-box',
              borderRadius: RADIUS.lg,
              background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
              border: `2px solid ${C.ink700}`,
              boxShadow: `0 30px 70px ${alpha('#000000', 0.4)}`,
              padding: '26px 36px',
              fontFamily: FONT.sans,
              ...enter(frame, format - 4, { distance: 22 }),
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <Icon name="mortarboard" size={52} color={C.cyan} strokeWidth={2} />
              <span style={{ fontSize: 44, fontWeight: 800, color: C.textStrong, letterSpacing: -0.5 }}>lo que dice el temario de la app</span>
            </div>
            <div style={{ marginTop: 24, display: 'grid', gap: 18 }}>
              {FORMAT_CHIPS.map((c, i) => {
                const e = enter(frame, chipAt[i], { distance: 30, axis: 'x' });
                return (
                  <div key={c.text} style={{ ...e }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 16,
                        padding: '10px 28px 10px 18px',
                        borderRadius: 999,
                        border: `3px solid ${alpha(C.cyan, 0.65)}`,
                        background: alpha(C.cyan, 0.1),
                        fontSize: 40,
                        fontWeight: 700,
                        color: C.textStrong,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Icon name={c.icon} size={44} color={C.cyan} strokeWidth={2.1} />
                      {c.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {frame >= stampAt - 2 ? (
            <div
              style={{
                position: 'absolute',
                left: 360,
                top: 396,
                transform: `rotate(-4deg) scale(${1.5 - 0.5 * progress(frame, stampAt, 10, EASE.out)})`,
                opacity: progress(frame, stampAt, 8),
                padding: '10px 26px',
                borderRadius: RADIUS.md,
                border: `5px solid ${C.amber}`,
                background: alpha(C.ink950, 0.88),
                color: C.amber,
                fontFamily: FONT.sans,
                fontSize: 34,
                fontWeight: 850,
                letterSpacing: 1,
                lineHeight: 1.18,
                textAlign: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              <div>SEGÚN EL TEMARIO DE LA APP</div>
              <div>EL FORMATO PUEDE CAMBIAR</div>
            </div>
          ) : null}

          {frame >= boxAt - 4 ? (
            <div
              style={{
                position: 'absolute',
                left: 1088,
                top: 24,
                width: W - 1088,
                height: 432,
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 14,
                padding: '0 40px',
                borderRadius: RADIUS.lg,
                border: `3px dashed ${alpha(C.sky, 0.8)}`,
                background: alpha(C.sky, 0.08),
                fontFamily: FONT.sans,
                ...enter(frame, boxAt, { distance: 30, axis: 'x' }),
              }}
            >
              <Icon name="globe" size={64} color={C.sky} strokeWidth={1.9} />
              <span style={{ fontFamily: FONT.mono, fontSize: 76, fontWeight: 800, color: '#7dd3fc', letterSpacing: -2 }}>giac.org</span>
              <span style={{ fontSize: 42, fontWeight: 800, color: C.textStrong }}>compruébalo tú:</span>
              <span style={{ fontSize: 38, fontWeight: 650, color: C.text, lineHeight: 1.2 }}>preguntas, tiempo y reglas</span>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* the book */}
      {bookFade > 0.01 && frame >= open - 2 ? (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', borderRadius: 24, opacity: bookFade }}>
          <div
            style={{
              position: 'absolute',
              left: W / 2 - 280 + shake,
              top: 330 - 174,
              transform: `scale(${bookScale})`,
              transformOrigin: '50% 50%',
            }}
          >
            <OpenBook w={560} glow={0.4} />
          </div>
          {frame >= ribbonAt - 2 ? (
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 330 - 56,
                width: W,
                display: 'flex',
                justifyContent: 'center',
                transform: `translateX(${shake}px) scale(${0.85 + 0.15 * progress(frame, ribbonAt, 12, EASE.out)})`,
                opacity: progress(frame, ribbonAt, 10),
              }}
            >
              <span
                style={{
                  padding: '8px 54px 12px',
                  borderRadius: RADIUS.md,
                  background: C.cyan,
                  color: C.ink950,
                  fontFamily: FONT.sans,
                  fontSize: 88,
                  fontWeight: 850,
                  letterSpacing: -2,
                  boxShadow: `0 20px 50px ${alpha('#000000', 0.55)}, 0 0 50px ${alpha(C.cyan, 0.45)}`,
                  whiteSpace: 'nowrap',
                }}
              >
                open-book
              </span>
            </div>
          ) : null}
        </div>
      ) : null}
      {stopFlash > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, borderRadius: 24, boxShadow: `inset 0 0 ${Math.round(120 * stopFlash)}px ${alpha(C.rose, 0.7 * stopFlash)}`, border: `${Math.round(6 * stopFlash)}px solid ${alpha(C.rose, 0.8 * stopFlash)}`, pointerEvents: 'none' }} />
      ) : null}

      {/* time: pile of pages, the index, the dial */}
      {pileIn > 0 && timeOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: pileIn * (1 - timeOut), transform: `translateY(${timeOut * -20}px)`, fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', left: 40, top: 268, transform: `translateY(${(1 - pileIn) * 30}px)` }}>
            <PagePile w={210} n={8} />
          </div>
          <div style={{ position: 'absolute', left: 20, top: 196, width: 380 }}>
            <Tag color={C.amber} size={34}>
              cada duda, un viaje
            </Tag>
          </div>
          {frame >= idxAt - 4 ? (
            <div style={{ position: 'absolute', left: 400, top: 236, ...enter(frame, idxAt, { distance: 30, axis: 'x' }) }}>
              <Binder w={190} glow={0.5} tabs={progress(frame, idxAt + 4, 26)} />
              <div style={{ marginTop: 22, fontSize: 36, fontWeight: 800, color: C.cyanSoft, letterSpacing: 4, textAlign: 'center', width: 190 }}>ÍNDICE</div>
            </div>
          ) : null}
          {frame >= time - 6 ? (
            <div style={{ position: 'absolute', left: 660, top: 150, opacity: dialIn, transform: `translateY(${(1 - dialIn) * 24}px)` }}>
              <Dial size={290} sweep={sweep} hand={sweep} color={C.emerald} stopwatch glow={sweep > 0.95 ? 0.8 + 0.2 * pulse(frame, 30, 0.8) : 0.3} />
            </div>
          ) : null}
          {frame >= secAt + 10 ? (
            <div style={{ position: 'absolute', left: 1010, top: 170, width: W - 1010, ...enter(frame, secAt + 10, { distance: 24, axis: 'x' }) }}>
              <div style={{ fontSize: 120, fontWeight: 850, color: C.emerald, letterSpacing: -3, lineHeight: 1, whiteSpace: 'nowrap', textShadow: `0 0 36px ${alpha(C.emerald, 0.4)}` }}>−60 s</div>
              <div style={{ marginTop: 18, fontSize: 42, fontWeight: 750, color: C.textStrong, lineHeight: 1.18 }}>cuando dudas entre dos respuestas</div>
              <div style={{ marginTop: 16, fontSize: 34, fontWeight: 650, color: C.muted }}>lo que ahorra el índice</div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* the climber */}
      {climberIn > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 22, opacity: climberIn, transform: `translateX(${(1 - climberIn) * -40}px)` }}>
          <Climber climb={climb} rope={progress(frame, rope, 34, EASE.inOut)} glow={0.6 * progress(frame, dudasAt, 12) * (1 - 0.6 * progress(frame, wrap, 12))}>
            {frame >= dudasAt - 4 ? (
              <div style={{ position: 'absolute', left: 30, top: 262, ...enter(frame, dudasAt, { distance: 20 }) }}>
                <Tag color={C.emerald} size={38} icon="shield">
                  para las dudas
                </Tag>
              </div>
            ) : null}
            {frame >= subesAt - 4 ? (
              <div style={{ position: 'absolute', left: 560, top: 470, ...enter(frame, subesAt, { distance: 20 }) }}>
                <Tag color={C.amber} size={38} solid>
                  no sube por ti
                </Tag>
              </div>
            ) : null}
          </Climber>
        </div>
      ) : null}

      {/* wrap */}
      {frame >= wrap - 4 ? (
        <div style={{ position: 'absolute', left: 900, top: 150, width: W - 900, fontFamily: FONT.sans }}>
          <div style={enter(frame, wrap, { distance: 24, axis: 'x' })}>
            <span style={{ display: 'inline-block', padding: '6px 34px 10px', borderRadius: RADIUS.md, background: C.cyan, color: C.ink950, fontSize: 76, fontWeight: 850, letterSpacing: -1.5 }}>open-book</span>
          </div>
          <div style={{ marginTop: 28, fontSize: 62, fontWeight: 850, color: C.emerald, lineHeight: 1.08, letterSpacing: -1, ...enter(frame, wrapEq, { distance: 24, axis: 'x' }) }}>
            = cuerda para
            <br />
            las dudas
          </div>
          <div style={{ marginTop: 34, display: 'flex', alignItems: 'center', gap: 20, ...enter(frame, wrapNo, { distance: 24, axis: 'x' }) }}>
            <Icon name="x" size={56} color={C.amber} strokeWidth={3} />
            <span style={{ fontSize: 54, fontWeight: 800, color: C.amber, lineHeight: 1.1 }}>no sustituye al estudio</span>
          </div>
        </div>
      ) : null}

      {/* the disclaimer seal, fixed from `indep` on */}
      {frame >= indep - 4 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 594,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
            padding: '8px 26px 8px 16px',
            borderRadius: RADIUS.pill,
            border: `2px solid ${alpha(C.muted, 0.6)}`,
            background: alpha(C.ink950, 0.92),
            fontFamily: FONT.sans,
            fontSize: 28,
            fontWeight: 650,
            color: C.text,
            whiteSpace: 'nowrap',
            ...enter(frame, indep, { distance: 18 }),
          }}
        >
          <Icon name="shield" size={34} color={C.muted} />
          Alertópolis · material independiente · no afiliado a SANS/GIAC
        </div>
      ) : null}
    </Stage>
  );
}
