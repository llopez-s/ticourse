import { interpolate, useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, dimStyle, mix, windowWeight } from '../../../engine/src/ui';
import { PROMISE, STAMP, SUBTITLE, TITLE } from '../data/s01-hook';
import { Napkin, napkinSize } from './parts/Napkin';
import { AdversaryTag } from './parts/s01-hook/AdversaryTag';
import { Chatter } from './parts/s01-hook/Chatter';
import { Stage, segment, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;
const H = STAGE.height;

// ---- Napkin layouts (x = left, y = top, w = width) --------------------------------------
/** A/B: drawing itself, then under the title — centred, bottom-anchored (the top 190 px hold stamp / title). */
const NAP_A = { w: 760, x: Math.round((W - 760) / 2), y: H - Math.round(napkinSize(760).h) } as const;
/** C/D: the voice reads the VLAN names and the note — 1100 wide (names 34 px, note 33 px), centred. */
const NAP_C = { w: 1100, x: Math.round((W - 1100) / 2), y: Math.round((H - napkinSize(1100).h) / 2) } as const;
/** E: BLIND ARCHITECT's tag takes the right column. */
const NAP_E = { w: 1000, x: 0, y: Math.round((H - napkinSize(1000).h) / 2) } as const;
const TAG_X = NAP_E.w + 34;

// ---- Title block (B) ----------------------------------------------------------------------
const TITLE_TOP = 0;
const SUB_TOP = 78;
const CHIPS_TOP = 126;

/**
 * s01-hook «El plano de la servilleta». Monday 16-11: the stamp «16-11 · lunes
 * · rediseño de la red» settles in from the first frame, and on `napkin` the
 * shared Napkin draws itself by hand under it — Internet, `fw-perimetro-01`,
 * `rt-core`, the four VLAN, Operaciones behind «cortafuegos interno», the note
 * «entre estas VLAN: el router no filtra» and the portal, dimmed, in Oficinas.
 * Before 12 s (`title`) the title «Zonas de seguridad» replaces the stamp with
 * «security zones · device placement · failure modes» under it, and the promise
 * follows as three chips, each on its word; the napkin steps back. On s01-03
 * the title block leaves and the napkin grows to 1100 px: the four VLAN get the
 * highlighter on «cuatro redes con nombre». On «router» (s01-04) the router
 * and the note light up and ink dots travel between the VLAN through `rt-core`
 * without stopping; on «nombre» the four VLAN light again («tienen nombre,
 * pero no son zonas»). On `adversary` the napkin moves left and BLIND
 * ARCHITECT's tag («BLIND ARCHITECT · sección 3» / «vive de los planos con
 * atajos») enters on the right; on «atajos» the note lights once more. The
 * last frame: the napkin and the tag.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const napkinAt = props.cue('napkin');
  const advAt = props.cue('adversary');
  const s03 = segment(props, 's01-03');
  const s04 = segment(props, 's01-04');

  // ---- Title before 12 s, whatever the voice does.
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const chipAt = PROMISE.map((p) => wordFrame(S, 's01-02', p.word) - 6);

  // ---- Phases: A/B (small, under stamp/title) → C (big, centred) → E (left, beside the tag).
  // The title block holds into s01-03 and the napkin grows on «servilleta» (before the VLAN get the highlighter).
  const growAt = Math.min(wordFrame(S, 's01-03', 'servilleta') - 10, wordFrame(S, 's01-03', 'cuatro') - 40);
  const toC = progress(frame, growAt, 26, EASE.inOut);
  const toE = progress(frame, advAt - 14, 26, EASE.inOut);
  const napW = mix(mix(NAP_A.w, NAP_C.w, toC), NAP_E.w, toE);
  const napX = mix(mix(NAP_A.x, NAP_C.x, toC), NAP_E.x, toE);
  const napY = mix(mix(NAP_A.y, NAP_C.y, toC), NAP_E.y, toE);
  const drawDur = Math.max(90, Math.min(150, titleAt - napkinAt - 24));
  // The paper lands in the first second (so the opening frame is not just the stamp); the pen
  // creeps until `napkin` and draws the network as the voice starts.
  const preRoll = Math.max(12, Math.min(24, napkinAt - 8));
  const draw = interpolate(frame, [0, preRoll, Math.max(preRoll + 1, napkinAt), Math.max(preRoll + 2, napkinAt) + drawDur], [0, 0.1, 0.13, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // The napkin steps back while the title and the promise are on.
  const napDim = 0.5 * progress(frame, titleAt - 4, 16, EASE.inOut) * (1 - toC);

  // ---- Stamp (A) until the title lands; title block (B) until s01-03.
  const settle = progress(frame, -12, 20);
  const stampOut = progress(frame, titleAt - 10, 12, EASE.inOut);
  const titleOut = progress(frame, growAt - 4, 16, EASE.inOut);

  // ---- Highlighter: the four VLAN (s01-03 «cuatro redes con nombre»), router + note (s01-04), VLAN again on «nombre».
  const vlanAt = wordFrame(S, 's01-03', 'cuatro') - 4;
  const vlanStep = 7;
  const vlanEnd = s03.to - 6;
  const nameAt = wordFrame(S, 's01-04', 'nombre') - 6;
  const vlanW = (i: number) =>
    Math.max(windowWeight(frame, vlanAt + i * vlanStep, vlanEnd, { ramp: 12 }), 0.85 * windowWeight(frame, nameAt + i * 4, advAt - 6, { ramp: 12 }));
  const routerAt = wordFrame(S, 's01-04', 'router') - 4;
  const shortcutAt = wordFrame(S, 's01-05', 'atajos') - 6;
  const routerW = Math.max(windowWeight(frame, routerAt, s04.to - 4, { ramp: 12 }), 0.8 * windowWeight(frame, shortcutAt, Number.POSITIVE_INFINITY, { ramp: 14 }));
  // The rest of the drawing steps back a little while the voice is on the VLAN and their router.
  const restDim = 0.55 * windowWeight(frame, routerAt, advAt - 10, { ramp: 16 });
  // Ink dots: the VLAN talk to each other through rt-core, nobody asking.
  const talkAt = wordFrame(S, 's01-04', 'hablar') - 8;
  const talk = windowWeight(frame, talkAt, nameAt + 30, { ramp: 14 });

  // ---- Adversary tag.
  const tagIn = enter(frame, advAt + 6, { distance: 26, duration: 18, axis: 'x' });

  return (
    <Stage>
      {/* Stamp: Monday 16-11, the redesign */}
      {stampOut < 1 ? (
        <div style={{ position: 'absolute', left: 0, top: 54, width: W, display: 'flex', justifyContent: 'center', opacity: settle * (1 - stampOut), transform: `translateY(${-14 * stampOut}px)` }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 14,
              height: 64,
              padding: '0 28px 0 18px',
              boxSizing: 'border-box',
              borderRadius: RADIUS.md,
              border: `2px solid ${alpha(C.cyan, 0.7)}`,
              background: alpha(C.cyan, 0.1),
              fontFamily: FONT.sans,
              fontSize: 36,
              whiteSpace: 'nowrap',
            }}
          >
            <Icon name="clock" size={36} color={C.cyan} />
            <span style={{ fontFamily: FONT.mono, fontWeight: 800, color: C.cyanSoft }}>{STAMP.day}</span>
            <Dot />
            <span style={{ fontWeight: 750, color: C.textStrong }}>{STAMP.weekday}</span>
            <Dot />
            <span style={{ fontWeight: 750, color: C.textStrong }}>{STAMP.what}</span>
          </div>
        </div>
      ) : null}

      {/* Title + English line */}
      {frame >= titleAt - 2 && titleOut < 1 ? (
        <div style={{ position: 'absolute', left: 0, top: TITLE_TOP, width: W, textAlign: 'center', fontFamily: FONT.sans, opacity: 1 - titleOut, transform: `translateY(${-18 * titleOut}px)` }}>
          <div style={{ ...enter(frame, titleAt, { distance: 22, duration: 18 }) }}>
            <div style={{ fontSize: 66, fontWeight: 850, letterSpacing: -1.3, lineHeight: 1.08, color: C.textStrong, whiteSpace: 'nowrap' }}>
              <span style={{ color: C.cyan }}>{TITLE.lead}</span>
              {TITLE.rest}
            </div>
          </div>
          <div style={{ position: 'absolute', left: 0, top: SUB_TOP - TITLE_TOP, width: W, ...enter(frame, titleAt + 10, { distance: 14, duration: 16 }) }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, fontFamily: FONT.mono, fontSize: 32, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap' }}>
              {SUBTITLE.map((t, i) => (
                <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 16 }}>
                  {i ? <span style={{ color: C.faint }}>·</span> : null}
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Promise: three chips, each on its word */}
      {frame >= chipAt[0] - 2 && titleOut < 1 ? (
        <div style={{ position: 'absolute', left: 0, top: CHIPS_TOP, width: W, display: 'flex', justifyContent: 'center', gap: 22, opacity: 1 - titleOut, transform: `translateY(${-18 * titleOut}px)` }}>
          {PROMISE.map((p, i) => {
            const e = enter(frame, chipAt[i], { distance: 16 });
            const lit = progress(frame, chipAt[i], 10) * (1 - 0.55 * progress(frame, (chipAt[i + 1] ?? growAt - 20) - 2, 12, EASE.inOut));
            return (
              <div
                key={p.text}
                style={{
                  ...e,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  height: 56,
                  padding: '0 26px 0 18px',
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.pill,
                  border: `2px solid ${alpha(C.cyan, 0.4 + 0.5 * lit)}`,
                  background: alpha(C.cyan, 0.06 + 0.12 * lit),
                  boxShadow: lit > 0.02 ? `0 0 ${Math.round(22 * lit)}px ${alpha(C.cyan, 0.3 * lit)}` : undefined,
                  fontFamily: FONT.sans,
                  fontSize: 34,
                  fontWeight: 750,
                  color: C.textStrong,
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon name={p.icon} size={32} color={C.cyan} />
                {p.text}
              </div>
            );
          })}
        </div>
      ) : null}

      {/* The napkin: today's network, by hand */}
      <div style={{ position: 'absolute', left: napX, top: napY, ...dimStyle(napDim) }}>
        <Napkin
          width={napW}
          draw={draw}
          highlight={{
            oficinas: vlanW(0),
            administracion: vlanW(1),
            produccion: vlanW(2),
            pruebas: vlanW(3),
            rtcore: routerW,
            note: routerW,
          }}
          dim={{ internet: restDim, fw: restDim, fwint: restDim, operaciones: restDim }}
        />
        <Chatter width={napW} start={talkAt} show={talk} />
      </div>

      {/* BLIND ARCHITECT: lives off plans with shortcuts */}
      {frame >= advAt ? (
        <div style={{ position: 'absolute', left: TAG_X, top: 0, height: H, display: 'flex', alignItems: 'center', ...tagIn }}>
          <AdversaryTag glow={windowWeight(frame, shortcutAt, Number.POSITIVE_INFINITY, { ramp: 14 })} />
        </div>
      ) : null}
    </Stage>
  );
}

function Dot() {
  return <span style={{ fontWeight: 700, color: C.faint }}>·</span>;
}
