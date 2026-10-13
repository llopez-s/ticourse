import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix, windowWeight } from '../../../engine/src/ui';
import { LEVELS } from '../data/levels';
import { S02_CAPTION, S02_STRIP } from '../data/s02-niveles';
import { Lane, LevelHead } from './parts/Lanes';
import { BAND_TONE, Painting, paintingLayout } from './parts/Painting';
import { DiamondLink } from './parts/s02-niveles/DiamondLink';
import { EvidenceCard, OursChip } from './parts/s02-niveles/EvidenceCard';
import { Stage, segment, wordFrame } from './kit';

const S = 's02-niveles';
const W = STAGE.width;
const H = STAGE.height;

// ---- The painting: centred while it is alone, then on the left with its three bands pulled out as lanes.
const PW = 376;
const PY = 16;
const PX_A = Math.round((W - PW) / 2);
const PX_B = 150;
const L = paintingLayout(PW);
const LANE_X = PX_B + PW + 2;
const TEXT_X = 30;
/** The right-hand slot: the evidence of the band in focus, then the diamond. */
const SLOT_X = 1184;
const SLOT_W = W - SLOT_X - 12;
const LANE_END = SLOT_X - 10;
const DIAMOND = { x: 1196, y: 190 } as const;
const STRIP_TOP = 592;

/**
 * s02-niveles «Tres preguntas sobre un cuadro». A painting on its easel, signed and dated in one corner,
 * over «atribuir un cuadro: tres preguntas» (`canvas`); on «tres preguntas» the canvas splits in three bands.
 * It steps left and each question opens its band, bottom-up, as a lane to the right of the canvas:
 *   `machine`     «¿con qué se hizo?» · MÁQUINA / INFRAESTRUCTURA · the weave and the pigments; the evidence
 *                 card («tu telemetría, el malware, el C2», confianza alta) and on `ours` the chip «tu caso:
 *                 el programa y su servidor».
 *   `hand`        «¿quién lo pintó?» · the hand; `operator` OPERADOR «quién tecleó»; `slips` the fingerprint
 *                 in the varnish and the card of human errors (confianza moderada).
 *   `commission`  «¿quién lo encargó y lo pagó?» · an empty outline in the canvas and the contract outside,
 *                 in its archive box; `sponsor` SPONSOR «por cuenta de quién» and its card.
 * Each card leaves when the voice moves on; its lane keeps question, name and confidence. On `diamond` the
 * small diamond takes the right, tied to the lanes by dotted connectors («operator: teclea», «customer:
 * encarga») — a correspondence, not an identity. On `other-kind` the strip «subir un nivel pide evidencia de
 * otro tipo, no más de lo mismo»; nothing moves after it (the exam card lands on still bands).
 */
export function S02Niveles(props: SceneProps) {
  const frame = useCurrentFrame();
  const canvasAt = props.cue('canvas');
  const machineAt = props.cue('machine');
  const oursAt = props.cue('ours');
  const handAt = props.cue('hand');
  const operatorAt = props.cue('operator');
  const slipsAt = props.cue('slips');
  const commissionAt = props.cue('commission');
  const sponsorAt = props.cue('sponsor');
  const diamondAt = props.cue('diamond');
  const otherAt = props.cue('other-kind');
  const tail = segment(props, 's02-07');
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const p = (start: number, dur = 14) => progress(frame, start, dur);
  const swell = (start: number, hold = 20) => progress(frame, start, 10) * (1 - progress(frame, start + hold, 26, EASE.inOut));

  // ---- The painting alone, then on the left.
  const move = progress(frame, machineAt - 24, 26, EASE.inOut);
  const px = mix(PX_A, PX_B, move);
  const captionIn = enter(frame, canvasAt + 2, { distance: 14, duration: 16 });
  const captionOut = progress(frame, machineAt - 26, 14, EASE.inOut);
  const split = progress(frame, at('s02-01', 'tres') - 6, 26, EASE.inOut);

  // ---- Whose turn it is: one band in focus at a time, bottom-up.
  const start = [machineAt, handAt, commissionAt] as const;
  const end = [handAt, commissionAt, diamondAt] as const;
  const turn = start.map((s, i) => windowWeight(frame, s, end[i] - 6, { ramp: 14 }));
  const others = (i: number) => Math.max(...turn.filter((_, k) => k !== i));
  const again = [swell(at('s02-07', 'mil') - 4, 60), 0, swell(at('s02-07', 'encargó') - 6, 40)];
  const ambient = [0, 1, 2].map((i) => 1 - 0.55 * others(i) - 0.5 * (i > 0 ? again[0] : 0)) as [number, number, number];
  const focus = [0, 1, 2].map((i) => Math.max(0.9 * turn[i], again[i])) as [number, number, number];

  // ---- What each band is made of.
  const materials = p(at('s02-02', 'con') - 4);
  const brush = p(handAt + 2);
  const print = p(at('s02-03', 'huella') - 6);
  const absent = p(at('s02-04', 'no') - 4);
  const boxIn = p(at('s02-04', 'eso') - 4, 16);
  const contract = progress(frame, at('s02-04', 'cuadro') - 4, 18, EASE.out);
  const boxLit = Math.max(windowWeight(frame, sponsorAt, diamondAt - 6), again[2]);

  // ---- The lanes' text.
  const nameAt = [at('s02-02', 'ataque') - 4, Math.min(at('s02-03', 'tecleó') - 4, operatorAt - 2), sponsorAt - 2];
  const subAt = [at('s02-02', 'máquinas') - 4, nameAt[1], nameAt[2]];
  const saidAt = [at('s02-02', 'máquina') - 4, at('s02-03', 'operador') - 4, at('s02-04', 'sponsor') - 4];
  // ---- The evidence cards, one at a time in the right-hand slot.
  const cardAt = [at('s02-02', 'herramientas') - 4, slipsAt - 2, at('s02-04', 'trabaja') - 4];
  const card = cardAt.map((s, i) => p(s, 16) * (1 - progress(frame, end[i] - 16, 12, EASE.inOut)));
  const lines = [p(cardAt[0], 12), progress(frame, cardAt[1] + 2, 34, EASE.linear), progress(frame, cardAt[2] + 2, 30, EASE.linear)];
  const reach = [p(cardAt[0] + 22), p(cardAt[1] + 44), p(cardAt[2] + 38)];
  const ours = p(oursAt - 2) * (1 - progress(frame, handAt - 16, 12, EASE.inOut));

  // ---- The diamond and the strip.
  const linkIn = p(diamondAt - 4, 16);
  const linkDim = 0.55 * progress(frame, otherAt - 8, 18, EASE.inOut);
  const stripIn = enter(frame, otherAt - 4, { distance: 14, duration: 16 });
  const notMore = windowWeight(frame, at('s02-06', 'más') - 4, at('s02-06', 'pruebas') - 6);
  const kind = windowWeight(frame, at('s02-06', 'pruebas') - 4, tail.from + 8);
  const stripAll = p(tail.from + 4, 16);

  const lane = (i: 0 | 1 | 2) => ({ x: LANE_X, y: PY + L.bands[i].y, w: W - LANE_X, h: L.bands[i].h });
  const ends = [
    { x: LANE_END, y: lane(0).y },
    { x: LANE_END, y: lane(1).y + 78 },
    { x: LANE_END, y: lane(2).y + 72 },
  ] as const;

  return (
    <Stage>
      {/* The three lanes: each band of the canvas, continued to the right */}
      {([2, 1, 0] as const).map((i) => {
        const r = lane(i);
        const open = progress(frame, start[i] - 6, 20, EASE.inOut);
        return (
          <Lane key={i} {...r} tone={BAND_TONE[i]} show={open} lit={focus[i]}>
            <LevelHead
              level={LEVELS[i]}
              tone={BAND_TONE[i]}
              exam={i === 2}
              q={p(start[i] + 2)}
              name={p(nameAt[i])}
              sub={p(subAt[i])}
              conf={p(end[i] - 12)}
              nameGlow={swell(saidAt[i], 30)}
              style={{ position: 'absolute', left: TEXT_X, top: i === 2 ? 4 : 14 }}
            />
          </Lane>
        );
      })}

      {/* The painting */}
      <div style={{ position: 'absolute', left: px, top: PY }}>
        <Painting width={PW} split={split} ambient={ambient} focus={focus} detail={[materials, print, absent]} bandHand={brush} archive={boxIn} contract={contract} link={contract} archiveLit={boxLit} />
      </div>
      {captionOut < 0.999 ? (
        <div style={{ position: 'absolute', left: 0, top: 604, width: W, textAlign: 'center', fontFamily: FONT.sans, fontSize: 42, fontWeight: 800, lineHeight: 1.1, color: C.textStrong, whiteSpace: 'nowrap', ...captionIn, opacity: captionIn.opacity * (1 - captionOut) }}>
          {S02_CAPTION}
        </div>
      ) : null}

      {/* The evidence of the band in focus */}
      <div style={{ position: 'absolute', right: W - SLOT_X - SLOT_W, bottom: H - (lane(0).y + lane(0).h), display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 14 }}>
        <OursChip show={ours} glow={swell(oursAt, 30)} />
        <EvidenceCard level={LEVELS[0]} tone={BAND_TONE[0]} width={SLOT_W} show={card[0]} lines={lines[0]} reach={reach[0]} conf={reach[0]} />
      </div>
      <div style={{ position: 'absolute', left: SLOT_X, top: lane(1).y + lane(1).h / 2, transform: 'translateY(-50%)' }}>
        <EvidenceCard level={LEVELS[1]} tone={BAND_TONE[1]} width={SLOT_W} show={card[1]} lines={lines[1]} reach={reach[1]} conf={reach[1]} />
      </div>
      <div style={{ position: 'absolute', left: SLOT_X, top: lane(2).y }}>
        <EvidenceCard level={LEVELS[2]} tone={BAND_TONE[2]} width={SLOT_W} show={card[2]} lines={lines[2]} reach={reach[2]} conf={reach[2]} />
      </div>

      {/* The diamond: a correspondence, drawn with dotted connectors */}
      <DiamondLink
        x={DIAMOND.x}
        y={DIAMOND.y}
        ends={ends}
        show={linkIn}
        operator={p(at('s02-05', 'operator') - 4)}
        customer={p(at('s02-05', 'customer') - 4)}
        machine={p(diamondAt + 16)}
        chip={p(diamondAt + 8)}
        dim={linkDim}
      />

      {/* «subir un nivel pide evidencia de otro tipo, no más de lo mismo» */}
      {frame >= otherAt - 6 ? (
        <div style={{ position: 'absolute', left: LANE_X, width: W - LANE_X, top: STRIP_TOP, display: 'flex', justifyContent: 'center', ...stripIn }}>
          <div style={{ padding: '8px 32px 11px', borderRadius: RADIUS.md, border: `2px solid ${alpha(C.violet, 0.6)}`, background: alpha('#1a1033', 0.92), fontFamily: FONT.sans, fontSize: 38, fontWeight: 850, lineHeight: 1.1, whiteSpace: 'nowrap' }}>
            <span style={{ color: alpha(C.textStrong, 0.6 + 0.4 * Math.max(kind, stripAll)) }}>{S02_STRIP.kind}</span>
            <span style={{ color: alpha('#c4b5fd', 0.6 + 0.4 * Math.max(notMore, stripAll)) }}> {S02_STRIP.notMore}</span>
          </div>
        </div>
      ) : null}
    </Stage>
  );
}
