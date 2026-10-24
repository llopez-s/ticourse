import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { PLAQUE, STAMP, TITLE } from '../data/canon';
import { Crate, OfficeBuilding, PortBuilding, Rope } from './parts/Art';
import { CaseStamp, PlaqueChip, Pill } from './parts/Labels';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';

/** One chip per promise; each lights on its word in s01-02 (the voice says «cuánto vale», «qué se hace», «qué fija»). */
const PROMISE = [
  { text: 'cuánto vale cada prueba', word: 'cuánto' },
  { text: 'qué se hace antes y después', word: 'hace' },
  { text: 'qué fija cada papel', word: 'fija' },
] as const;

/** The scene's group (port, crate, office): centred before the title, on the left after it. All in group coordinates. */
const GROUP_W = 940;
const SCALE_FROM = 1.22;
const SCALE_TO = 0.9;
const CENTRE_X = (1728 - GROUP_W * SCALE_FROM) / 2;
const GROUND = 430;
const PORT = { x: 0, w: 190 };
const OFFICE = { x: 740, w: 196 };
const CRATE = { w: 124, from: 100, to: 540 };
const TEXT_X = 900;
const TITLE_TOP = 110;
const PLAQUE_TOP = 330;
const CHIPS_TOP = 414;
const CHIP_STEP = 76;

function Label({ x, y, children, on, color = C.text, size = 34 }: { x: number; y: number; children: string; on: number; color?: string; size?: number }) {
  if (on <= 0.01) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%, ${(1 - on) * 10}px)`, opacity: on, fontFamily: FONT.sans, fontSize: size, fontWeight: 750, color, whiteSpace: 'nowrap' }}>
      {children}
    </div>
  );
}

/**
 * s01-hook «Fuera, pero tuyo». The proposal stamp from the first frame; the port's building on the left and a nameless
 * office on the right. On `box` a crate of documents comes out of the port's door and slides to the office while the
 * voice says «pasar un trabajo a otra empresa»; on `rope` a rope draws from the port to the crate and pulls taut, with
 * «responsabilidad» lit on its word: the work left, the responsibility did not. Before 12 s the group glides left, the
 * title «Antes, al firmar y después» lands with «SY0-701 · 5.3», and the promise comes as three chips, each lit on its
 * word. Nothing says anything was decided.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const boxAt = props.cue('box');
  const ropeAt = props.cue('rope');
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const promiseAt = Math.max(props.cue('promise') - 4, titleAt + 24);
  const pAt = PROMISE.map((p) => Math.max(promiseAt, wordFrame(S, 's01-02', p.word) - 6));

  const pasarAt = wordFrame(S, 's01-01', 'pasar');
  const empresaAt = wordFrame(S, 's01-01', 'empresa');
  const trabajoAt = wordFrame(S, 's01-01', 'trabajo');
  const respAt = wordFrame(S, 's01-01', 'responsabilidad');

  const stampIn = enter(frame, -6, { distance: 16, duration: 16 });
  const groupIn = enter(frame, -2, { distance: 20, duration: 18 });
  const crateIn = progress(frame, boxAt, 12);
  const slideStart = Math.max(boxAt + 14, pasarAt - 4);
  const slideEnd = Math.max(slideStart + 44, empresaAt + 10);
  const slide = progress(frame, slideStart, slideEnd - slideStart, EASE.inOut);
  const crateX = mix(CRATE.from, CRATE.to, slide);
  const hop = Math.sin(slide * Math.PI * 6) * 3 * Math.sin(slide * Math.PI);
  const crateY = GROUND - 104 * (CRATE.w / 130) - Math.max(0, hop);

  const ropeDraw = progress(frame, ropeAt - 2, 26, EASE.inOut);
  const taut = progress(frame, ropeAt + 20, 34, EASE.inOut);
  const sag = mix(78, 14, taut);
  const respOn = progress(frame, respAt - 6, 12);

  const portCaption = progress(frame, 6, 14);
  const officeCaption = progress(frame, empresaAt - 4, 12);
  const workCaption = progress(frame, trabajoAt - 4, 12);

  const glide = progress(frame, titleAt - 18, 30, EASE.inOut);
  const gx = mix(CENTRE_X, 0, glide);
  const gs = mix(SCALE_FROM, SCALE_TO, glide);
  const groundY = GROUND * gs;
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const plaqueIn = enter(frame, titleAt + 8, { distance: 14, duration: 16 });

  const hold = PROMISE.map((_, i) => 1 - 0.5 * (i < PROMISE.length - 1 ? progress(frame, pAt[i + 1] - 2, 10) : 0));
  const on = PROMISE.map((_, i) => progress(frame, pAt[i], 10) * hold[i]);

  const ropeAnchor = { x: PORT.x + PORT.w - 6, y: GROUND - 42 };
  const crateGrip = { x: crateX + 6, y: crateY + 70 };

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...stampIn }}>
        <CaseStamp parts={[...STAMP]} size={30} />
      </div>

      <div style={{ position: 'absolute', left: gx, top: 570 - groundY, width: GROUP_W, height: 660, transform: `${groupIn.transform} scale(${gs})`, transformOrigin: '0 0', opacity: groupIn.opacity }}>
        <div style={{ position: 'absolute', left: 0, top: GROUND, width: GROUP_W, height: 4, borderRadius: 2, background: alpha(C.ink500, 0.8) }} />
        <div style={{ position: 'absolute', left: PORT.x, top: GROUND - (PORT.w * 330) / 220 }}>
          <PortBuilding width={PORT.w} lit={0.4 + 0.6 * crateIn} />
        </div>
        <div style={{ position: 'absolute', left: OFFICE.x, top: GROUND - (OFFICE.w * 230) / 220 }}>
          <OfficeBuilding width={OFFICE.w} lit={0.3 + 0.7 * slide} />
        </div>

        {ropeDraw > 0.005 ? <Rope x1={ropeAnchor.x} y1={ropeAnchor.y} x2={crateGrip.x} y2={crateGrip.y} sag={sag} draw={ropeDraw} w={GROUP_W} h={660} /> : null}

        {crateIn > 0.01 ? (
          <div style={{ position: 'absolute', left: crateX, top: crateY, opacity: crateIn, transform: `scale(${0.85 + 0.15 * crateIn})`, transformOrigin: '50% 100%' }}>
            <Crate width={CRATE.w} />
          </div>
        ) : null}

        <Label x={PORT.x + PORT.w / 2} y={GROUND + 22} on={portCaption} color={C.cyanSoft}>
          el puerto
        </Label>
        <Label x={OFFICE.x + OFFICE.w / 2} y={GROUND + 22} on={officeCaption} color={C.text}>
          otra empresa
        </Label>
        <Label x={crateX + CRATE.w / 2} y={GROUND + 22} on={workCaption * (1 - 0.0)} color={C.text}>
          el trabajo
        </Label>
        <Label x={(ropeAnchor.x + crateGrip.x) / 2} y={Math.min(ropeAnchor.y, crateGrip.y) - 78 + sag * 0.5} on={respOn} color={C.amber} size={38}>
          responsabilidad
        </Label>
      </div>

      {frame >= titleAt - 2 ? (
        <div
          style={{
            position: 'absolute',
            left: TEXT_X,
            top: TITLE_TOP,
            fontFamily: FONT.sans,
            fontSize: 88,
            fontWeight: 900,
            letterSpacing: -2,
            lineHeight: 1.04,
            color: C.textStrong,
            whiteSpace: 'nowrap',
            textShadow: `0 0 30px ${alpha(C.cyan, 0.2)}`,
            ...titleIn,
          }}
        >
          <div>{TITLE[0]}</div>
          <div style={{ color: C.cyan }}>{TITLE[1]}</div>
        </div>
      ) : null}
      {frame >= titleAt ? (
        <div style={{ position: 'absolute', left: TEXT_X, top: PLAQUE_TOP, ...plaqueIn }}>
          <PlaqueChip text={PLAQUE} />
        </div>
      ) : null}

      {PROMISE.map((p, i) => {
        if (frame < promiseAt - 2) return null;
        return (
          <div key={p.text} style={{ position: 'absolute', left: TEXT_X, top: CHIPS_TOP + i * CHIP_STEP, ...enter(frame, promiseAt + i * 6, { distance: 16 }) }}>
            <Pill text={p.text} tone={C.cyan} on={0.12 + 0.88 * on[i]} size={40} height={62} />
          </div>
        );
      })}
    </Stage>
  );
}
