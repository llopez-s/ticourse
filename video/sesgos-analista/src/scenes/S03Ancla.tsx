import { useCurrentFrame } from 'remotion';
import type { ReactNode } from 'react';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { Anchor } from './parts/Anchor';
import { Paper, LogStrip, Report } from './parts/Docs';
import { ExampleLabel } from './parts/ExampleLabel';
import { Finger } from './parts/Finger';
import { Sea } from './parts/Sea';
import { Stage, segment, wordFrame } from './kit';

const S = 's03-ancla';
const W = STAGE.width;
const AMBER = '#fcd34d';

/** A: the report on the table. B: small, sunk in the sea. D: big again, on the left, with its socket. */
const TABLE_Y = 500;
const REP_A = { w: 420, cx: W / 2 } as const;
const REP_B = { w: 280, cx: W / 2, cy: 372 } as const;
const REP_D = { w: 420, x: 170, top: 221 } as const;
const SURFACE = 236;
const SEA_BOTTOM = 600;

/** The log line, in D: the hinge of its tab and the strip's vertical centre. */
const LOG = { bodyW: 560, tabW: 150, h: 100, cy: 380 } as const;
const HINGE = { start: 1160, short: 770, bump: 720, fit: 684 } as const;

/** The sea of data: sheets that float and, once the anchor is down, turn to face the report. */
const PAPERS: readonly { x: number; y: number; a: number; tone: 'muted' | 'cyan' | 'amber' }[] = [
  { x: 150, y: 345, a: -28, tone: 'muted' },
  { x: 340, y: 470, a: 20, tone: 'cyan' },
  { x: 520, y: 330, a: -12, tone: 'muted' },
  { x: 650, y: 520, a: 35, tone: 'amber' },
  { x: 230, y: 550, a: 12, tone: 'muted' },
  { x: 1140, y: 480, a: 15, tone: 'muted' },
  { x: 1340, y: 540, a: -30, tone: 'cyan' },
  { x: 1540, y: 440, a: 25, tone: 'muted' },
  { x: 1630, y: 550, a: -18, tone: 'muted' },
  { x: 1630, y: 320, a: -20, tone: 'amber' },
  { x: 1330, y: 420, a: 8, tone: 'muted' },
];

const rot = (x: number, y: number, deg: number) => {
  const r = (deg * Math.PI) / 180;
  return { x: x * Math.cos(r) - y * Math.sin(r), y: x * Math.sin(r) + y * Math.cos(r) };
};

/**
 * s03-ancla «Dos que van de la mano». The note «Frases de ejemplo de la lección · no son el caso de
 * Meridian» is there from the first frame, at the foot of the stage.
 *   frame 0   the table
 *   report    a vendor's report lands on it (generic: a coloured square, no name); its first line, «grupo X»,
 *             is lit and under it the quote «el primer informe decía: grupo X»
 *   anchor    the table becomes a sea of data (water, floating sheets, top left); the report shrinks and, on
 *             «ancla», is pulled down by an anchor on a rope; on «todo» every sheet turns its pointer to it
 *             and drifts a little toward it; on «anchoring» ANCHORING lands top left with «el primer dato
 *             encuadra todo lo demás» and, on «primer», the signal phrase «el primer informe decía»
 *   intercept (card over the top ~170 px, from before s03-03 to its end) the top block leaves, the picture
 *             dims; on `reply-a` it lights up again and, on «ventaja», «la primera hipótesis sale con ventaja»
 *   bend      the sea drains; the report comes back big on the left with a socket in its edge; a grey log
 *             line (bars, no hour, no host, no domain) slides in with a crooked tab and does not fit (glitch,
 *             twice); on «calzador» a finger presses the tab flat and, on «cuadra», it slides in
 *   confirm   CONFIRMATION BIAS top left and the lesson's box on the right: «el más letal en atribución —
 *             cuando el equipo ya sabe quién fue, cada dato se dobla para encajar»
 *   together  everything steps aside: the anchor and the crooked tab side by side, their names, the signal
 *             phrase «esto también lo confirma» and «el patrón clásico del fallo de atribución»
 * No date, no hour, no time zone, no country, no real group.
 */
export function S03Ancla(props: SceneProps) {
  const frame = useCurrentFrame();
  const reportAt = props.cue('report');
  const anchorAt = props.cue('anchor');
  const replyAt = props.cue('reply-a');
  const bendAt = props.cue('bend');
  const confirmAt = props.cue('confirm');
  const togetherAt = props.cue('together');
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const p = (start: number, dur = 14) => progress(frame, start, dur);
  const swell = (start: number, hold = 20) => progress(frame, start, 10) * (1 - progress(frame, start + hold, 26, EASE.inOut));

  // ---- Where the message is: it types from `msgFrom` and stays until s03-03 ends.
  const msgFrom = segment(props, 's03-02').to; // the silent lead starts where s03-02 ends; the card enters here
  const msgOn = progress(frame, msgFrom - 4, 10, EASE.inOut) * (1 - progress(frame, replyAt - 2, 14, EASE.inOut));

  // ---- A → B: the report, the table, the sea.
  const dropIn = progress(frame, reportAt - 8, 18, EASE.out);
  const grupoAt = at('s03-01', 'grupo');
  const claim = p(grupoAt - 4, 12);
  const quoteIn = p(grupoAt + 2, 16) * (1 - progress(frame, anchorAt - 4, 14, EASE.inOut));
  const shrink = progress(frame, anchorAt - 6, 30, EASE.inOut);
  const anclaAt = at('s03-02', 'ancla');
  const sink = progress(frame, anclaAt - 2, 34, EASE.in);
  const seaRise = progress(frame, anchorAt - 4, 40, EASE.inOut);
  const toD = progress(frame, bendAt - 10, 34, EASE.inOut); // the sea drains, the report comes back
  const sea = seaRise * (1 - toD);
  const table = (1 - progress(frame, anchorAt - 4, 24, EASE.inOut)) + progress(frame, bendAt + 10, 24, EASE.inOut);
  const repCx = mix(REP_A.cx, REP_B.cx, shrink);
  const repW = mix(mix(REP_A.w, REP_B.w, shrink), REP_D.w, toD);
  const repCyAB = mix(TABLE_Y - (REP_A.w * 0.76) / 2, REP_B.cy, Math.max(shrink * 0.45, sink));
  const repCy = mix(repCyAB, REP_D.top + (REP_D.w * 0.76) / 2, toD);
  const repCxNow = mix(repCx, REP_D.x + REP_D.w / 2, toD);
  const repH = repW * 0.76;
  const drop = (1 - dropIn) * -70;

  // ---- The anchor and its rope.
  const anchorIn = p(anclaAt - 4, 12) * (1 - toD);
  const ropeLen = 26;
  const repBottom = repCy + repH / 2;
  const anchorSize = 76;

  // ---- The sheets turn to face the report.
  const todoAt = at('s03-02', 'todo');
  const face = progress(frame, todoAt, 46, EASE.inOut);
  const paperIn = (i: number) => progress(frame, anchorAt + 6 + i * 3, 16);

  // ---- Names and the signal phrase.
  const anchoringAt = at('s03-02', 'anchoring');
  const nameA = enter(frame, anchoringAt - 6, { distance: 16, duration: 16 });
  const subA = enter(frame, anchoringAt + 8, { distance: 12, duration: 16 });
  const chipA = enter(frame, at('s03-02', 'primer') - 4, { distance: 14, duration: 14 });
  const topA = 1 - progress(frame, msgFrom - 12, 12, EASE.inOut);
  const advantage = enter(frame, at('s03-03', 'ventaja') - 8, { distance: 12, duration: 16 });
  const advOut = 1 - progress(frame, bendAt - 14, 14, EASE.inOut);

  // ---- D: the log line, the finger and the fit.
  const arrive = progress(frame, bendAt - 6, 36, EASE.inOut);
  const bumpAt = [at('s03-04', 'encaja') - 2, at('s03-04', 'penas') - 6];
  const bump = (t: number) => progress(frame, t, 6, EASE.in) * (1 - progress(frame, t + 6, 12, EASE.out));
  const bumps = Math.max(bump(bumpAt[0]), bump(bumpAt[1]));
  const pressAt = at('s03-04', 'calzador') - 8;
  const press = progress(frame, pressAt, 22, EASE.inOut);
  const fitAt = at('s03-04', 'cuadra') - 10;
  const fit = progress(frame, fitAt, 22, EASE.out);
  const glitch = Math.max(bumps, progress(frame, bendAt, 4) * (1 - progress(frame, bendAt + 4, 14)));
  const hinge = mix(mix(HINGE.start, HINGE.short, arrive) - (HINGE.short - HINGE.bump) * bumps, HINGE.fit, fit);
  const tab = 38 * (1 - press);
  const logIn = arrive > 0.01 ? Math.min(1, arrive * 3) : 0;
  const tabTip = rot(-110, -50, tab);
  const fingerOut = 1 - progress(frame, fitAt + 8, 14, EASE.inOut);
  const fingerIn = progress(frame, pressAt - 10, 14);
  const fingerY = LOG.cy + tabTip.y - 90 * (1 - fingerIn);
  const socket = p(bendAt - 8, 20);
  const forced = p(at('s03-04', 'calzador') - 2, 12);
  const dimD = progress(frame, togetherAt - 20, 16, EASE.inOut);

  // ---- E: the biggest name and the lesson's box.
  const confirmIn = enter(frame, confirmAt - 6, { distance: 16, duration: 16 });
  const letalAt = at('s03-05', 'letal');
  const boxIn = enter(frame, letalAt - 10, { distance: 20, duration: 18 });
  const eOut = 1 - progress(frame, togetherAt - 24, 14, EASE.inOut);

  // ---- F: the two together.
  const fIn = progress(frame, togetherAt - 4, 18);
  const sigAt = at('s03-06', 'oyes');
  const sig = enter(frame, sigAt - 4, { distance: 14, duration: 14 });
  const tileA = enter(frame, at('s03-06', 'Ancla') - 4, { distance: 16, duration: 16 });
  const tileB = enter(frame, at('s03-06', 'confirmación') - 4, { distance: 16, duration: 16 });
  const classic = enter(frame, at('s03-06', 'fallo') - 10, { distance: 16, duration: 18 });
  const isF = fIn > 0.01;

  return (
    <Stage>
      {/* The note: there from frame 0 */}
      <ExampleLabel width={W} />

      {/* The table */}
      <div style={{ position: 'absolute', left: 150, top: TABLE_Y + 6, width: W - 300, height: 12, borderRadius: 6, background: `linear-gradient(180deg, ${C.ink600} 0%, ${C.ink700} 100%)`, opacity: Math.min(1, table) * 0.9 }} />

      {/* The sea of data and its sheets */}
      <Sea width={W} surface={SURFACE} bottom={SEA_BOTTOM} frame={frame} rise={sea} />
      {PAPERS.map((q, i) => {
        const target = (Math.atan2(repCxNow - q.x, -(REP_B.cy - q.y)) * 180) / Math.PI;
        const angle = mix(q.a, target, face);
        const px = mix(q.x, mix(q.x, REP_B.cx, 0.12), face);
        const py = mix(q.y, mix(q.y, REP_B.cy, 0.1), face);
        const bob = 4 * Math.sin(frame * 0.04 + i * 1.3);
        const o = paperIn(i) * sea * (1 - 0.5 * msgOn);
        if (o < 0.01) return null;
        return (
          <div key={i} style={{ position: 'absolute', left: px - 70, top: py - 53 + bob, opacity: o, transform: `rotate(${angle}deg)` }}>
            <Paper w={140} tone={q.tone} lit={face} />
          </div>
        );
      })}

      {/* The anchor, on its rope */}
      {anchorIn > 0.01 ? (
        <div style={{ position: 'absolute', left: repCx - 40, top: repBottom, width: 80, opacity: anchorIn * (1 - 0.5 * msgOn) }}>
          <svg width={80} height={ropeLen + 6} viewBox={`0 0 80 ${ropeLen + 6}`} style={{ display: 'block' }}>
            <path d={`M 40 0 C 30 ${ropeLen * 0.4}, 50 ${ropeLen * 0.7}, 40 ${ropeLen + 4}`} fill="none" stroke={alpha(AMBER, 0.8)} strokeWidth={4} strokeDasharray="6 5" strokeLinecap="round" />
          </svg>
          <div style={{ position: 'relative', left: 8, top: 0, width: anchorSize }}>
            <Anchor size={anchorSize} glow={swell(anclaAt, 30)} />
          </div>
        </div>
      ) : null}

      {/* The report: on the table, then in the sea, then on the left with its socket */}
      <div
        style={{
          position: 'absolute',
          left: repCxNow - repW / 2,
          top: repCy - repH / 2 + drop,
          opacity: dropIn * (1 - 0.5 * msgOn) * (1 - dimD),
        }}
      >
        <Report width={repW} claim={claim} socket={socket} glow={Math.max(swell(grupoAt, 40), toD * 0.2, 0.9 * progress(frame, replyAt, 10) * (1 - progress(frame, replyAt + 70, 30, EASE.inOut)))} />
      </div>

      {/* The quote under the report on the table */}
      {quoteIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: 536, width: W, textAlign: 'center', fontFamily: FONT.sans, fontSize: 46, fontWeight: 800, color: C.text, whiteSpace: 'nowrap', opacity: quoteIn, transform: `translateY(${(1 - quoteIn) * 12}px)` }}>
          «el primer informe decía: <span style={{ color: AMBER }}>grupo X</span>»
        </div>
      ) : null}

      {/* ANCHORING, its meaning and the signal phrase (the top block; it leaves for the message) */}
      {frame > anchoringAt - 10 && topA > 0.01 && toD < 1 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, opacity: topA * (1 - toD), fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', left: 0, top: 8, whiteSpace: 'nowrap', ...nameA }}>
            <span style={{ fontSize: 72, fontWeight: 900, letterSpacing: 2, color: AMBER, textShadow: `0 0 30px ${alpha(C.amber, 0.25)}` }}>ANCHORING</span>
          </div>
          <div style={{ position: 'absolute', left: 0, top: 96, whiteSpace: 'nowrap', fontSize: 42, fontWeight: 750, color: C.textStrong, ...subA }}>el primer dato encuadra todo lo demás</div>
          <div style={{ position: 'absolute', left: 940, top: 18, ...chipA }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', height: 74, padding: '0 34px', boxSizing: 'border-box', borderRadius: RADIUS.pill, border: `3px solid ${alpha(C.cyan, 0.8)}`, background: alpha(C.cyan, 0.12), boxShadow: `0 0 28px ${alpha(C.cyan, 0.25)}`, fontSize: 50, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap' }}>
              «el primer informe decía»
            </div>
          </div>
        </div>
      ) : null}

      {/* The advantage: after the message */}
      {advantage.opacity > 0.01 && advOut > 0.01 ? (
        <div style={{ position: 'absolute', left: 1060, top: 252, padding: '12px 26px 14px', borderRadius: RADIUS.lg, background: alpha(C.ink900, 0.92), border: `2px solid ${alpha(C.amber, 0.5)}`, fontFamily: FONT.sans, fontSize: 46, fontWeight: 800, lineHeight: 1.15, color: C.textStrong, whiteSpace: 'nowrap', opacity: advantage.opacity * advOut, transform: advantage.transform }}>
          la primera hipótesis
          <br />
          sale con <span style={{ color: AMBER }}>ventaja</span>
        </div>
      ) : null}

      {/* D: the log line with its crooked tab, the finger that presses it flat */}
      {logIn > 0.01 ? (
        <div style={{ position: 'absolute', left: hinge - LOG.tabW, top: LOG.cy - LOG.h / 2, opacity: logIn * (1 - dimD) }}>
          <LogStrip bodyW={LOG.bodyW} tabW={LOG.tabW} h={LOG.h} tab={tab} glitch={glitch} label />
        </div>
      ) : null}
      {fingerIn > 0.01 && fingerOut > 0.01 ? (
        <div style={{ position: 'absolute', left: hinge + tabTip.x - 72, top: fingerY - 190, opacity: fingerIn * fingerOut }}>
          <Finger length={190} />
        </div>
      ) : null}
      {forced > 0.01 ? (
        <div style={{ position: 'absolute', left: 900, top: 456, fontFamily: FONT.sans, fontSize: 44, fontWeight: 850, color: AMBER, whiteSpace: 'nowrap', opacity: forced * (1 - dimD), transform: `translateY(${(1 - forced) * 10}px)` }}>
          con calzador
        </div>
      ) : null}

      {/* E: CONFIRMATION BIAS and the lesson's box */}
      {frame > confirmAt - 10 && eOut > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, opacity: eOut, fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', left: 0, top: 8, whiteSpace: 'nowrap', ...confirmIn }}>
            <span style={{ fontSize: 66, fontWeight: 900, letterSpacing: 1.5, color: AMBER, textShadow: `0 0 30px ${alpha(C.amber, 0.25)}` }}>CONFIRMATION BIAS</span>
          </div>
          <div style={{ position: 'absolute', left: 0, top: 92, whiteSpace: 'nowrap', fontSize: 40, fontWeight: 750, color: C.text, opacity: confirmIn.opacity }}>buscas y valoras solo lo que confirma</div>
          {boxIn.opacity > 0.01 ? (
            <div
              style={{
                position: 'absolute',
                left: 800,
                top: 4,
                width: 928,
                boxSizing: 'border-box',
                padding: '18px 30px 22px',
                borderRadius: RADIUS.lg,
                border: `3px solid ${alpha(C.rose, 0.7)}`,
                background: `linear-gradient(180deg, ${alpha(C.rose, 0.16)} 0%, ${alpha(C.ink900, 0.96)} 80%)`,
                boxShadow: `0 0 ${Math.round(34 * swell(letalAt, 40))}px ${alpha(C.rose, 0.3)}`,
                ...boxIn,
              }}
            >
              <div style={{ fontSize: 46, fontWeight: 850, color: C.roseSoft, whiteSpace: 'nowrap' }}>el más letal en atribución</div>
              <div style={{ marginTop: 6, fontSize: 38, fontWeight: 650, lineHeight: 1.2, color: C.textStrong }}>
                cuando el equipo ya sabe quién fue, cada dato se dobla para encajar
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* F: anchoring and confirmation, together */}
      {isF ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: 600, opacity: fIn, fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', left: 0, top: 10, width: W, display: 'flex', justifyContent: 'center', ...sig }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', height: 78, padding: '0 38px', boxSizing: 'border-box', borderRadius: RADIUS.pill, border: `3px solid ${alpha(C.cyan, 0.8)}`, background: alpha(C.cyan, 0.12), fontSize: 52, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap' }}>
              «esto también lo confirma»
            </div>
          </div>
          <div style={{ position: 'absolute', left: 204, top: 130, display: 'flex', alignItems: 'center', gap: 40 }}>
            <Tile enter={tileA} name="ANCHORING">
              <Anchor size={118} />
            </Tile>
            <div style={{ fontSize: 80, fontWeight: 800, color: C.muted, ...tileB }}>+</div>
            <Tile enter={tileB} name="CONFIRMATION BIAS">
              <div style={{ width: 300, height: 70, marginTop: 30 }}>
                <LogStrip bodyW={210} tabW={90} h={64} tab={38} />
              </div>
            </Tile>
          </div>
          <div style={{ position: 'absolute', left: 0, top: 440, width: W, textAlign: 'center', fontSize: 60, fontWeight: 850, letterSpacing: -1, color: C.textStrong, whiteSpace: 'nowrap', ...classic }}>
            el patrón clásico del <span style={{ color: C.roseSoft }}>fallo de atribución</span>
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

function Tile({ enter: e, name, children }: { enter: { opacity: number; transform: string }; name: string; children: ReactNode }) {
  return (
    <div
      style={{
        width: 600,
        height: 250,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(C.amber, 0.55)}`,
        background: `linear-gradient(180deg, ${alpha(C.amber, 0.1)} 0%, ${alpha(C.ink900, 0.96)} 75%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        fontFamily: FONT.sans,
        ...e,
      }}
    >
      <div style={{ height: 124, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
      <div style={{ fontSize: 50, fontWeight: 900, letterSpacing: 1.5, color: AMBER, whiteSpace: 'nowrap' }}>{name}</div>
    </div>
  );
}
