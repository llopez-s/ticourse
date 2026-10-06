import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { EASE, progress, pulse } from '../../../engine/src/theme/motion';
import { mix, windowWeight } from '../../../engine/src/ui';
import { DOOR_NAMES, LABEL_CAPTION } from '../data/s04-taller';
import { CompareTable, PDB_PATH } from './parts/CompareTable';
import { TrapBox } from './parts/TrapBox';
import { WorkshopLabel } from './parts/WorkshopLabel';
import { CAPTION, DOOR, DOOR_X, Door, LabelCaption, LeaderLines, RULE, RuleLabel, SIDES, boxS04, callBubbleAt, labelCentre } from './parts/s04-taller/Doorstep';
import { Stage, wordFrame } from './kit';

const S = 's04-taller';

/**
 * s04-taller «La etiqueta del taller». The answer to GLASS VIPER's message: the two films go
 * into one table, face to face (header from the first frame; the frame draws with «tabla»).
 * `lure` / «dominios»: rows 1–2 fill; `cheap`: they go grey with the chip «barato de cambiar ·
 * si no coincide, no separa». s04-04: two doors, one trap box at each — same box, different
 * wrapper (a CV, a purchase order: row 1 lights) and a device that calls a different number (row 2).
 * `pdb`: row 3 fills while the boxes open and their devices rise («miras dentro de cada caja»).
 * `match`: the two PDB paths light up character by character until they match, in cyan.
 * `label`: the same workshop label on both devices, «la etiqueta del taller» with its leader lines.
 * «Pero si otro programa trae la misma» (word-synced): the two-line rule. s04-08: a light runs
 * along both paths («letra por letra»), «(PDB)» lifts. `strong`: «fuerte · raro y caro de cambiar».
 * From the exam card on, the table is still; s04-10 only lights the wrappers, numbers and labels.
 */
export function S04Taller(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lureAt = props.cue('lure');
  const cheapAt = props.cue('cheap');
  const pdbAt = props.cue('pdb');
  const matchAt = props.cue('match');
  const strongAt = props.cue('strong');

  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const wTabla = w('s04-01', 'tabla');
  const wEnlace = w('s04-02', 'enlace');
  const wPesan = w('s04-02', 'pesan');
  const wDominios = w('s04-03', 'dominios');
  const wCajas = w('s04-04', 'cajas');
  const wPuerta = w('s04-04', 'puerta');
  const wEnvoltorio = w('s04-04', 'envoltorio');
  const wNumero = w('s04-04', 'número');
  const wPoco = w('s04-04', 'poco');
  const wDentro = w('s04-05', 'dentro');
  const wPrograma5 = w('s04-05', 'programa');
  const wProgramaMatch = w('s04-06', 'programa');
  const wPero = w('s04-07', 'Pero');
  const wSalen = w('s04-07', 'salen');
  const wLetra = w('s04-08', 'letra');
  const wRuta = w('s04-08', 'ruta');
  const wRara = w('s04-09', 'rara');
  const wEnvoltorio10 = w('s04-10', 'envoltorio');
  const wNumero10 = w('s04-10', 'número');
  const wEtiqueta10 = w('s04-10', 'etiqueta');
  /** From the exam card on, the table holds still. */
  const stillFrom = strongAt + 190;

  // ---- The table ---------------------------------------------------------------------------------
  const tableIn = progress(frame, 0, 12);
  /** Centred while it is alone on the stage; up to the top as the doors come in. */
  const tableY = mix(178, 0, progress(frame, wCajas - 36, 28, EASE.inOut));
  /** «en una tabla»: the three empty rows open before anything fills them. */
  const skel = progress(frame, wTabla - 8, 24);
  const frameDraw = progress(frame, wTabla - 8, 20);
  const link = windowWeight(frame, wEnlace - 2, lureAt + 6, { ramp: 14 });
  const scale = progress(frame, wPesan - 4, 18);
  const reveal = {
    lure: progress(frame, lureAt - 2, 30),
    domain: progress(frame, wDominios - 6, 30),
    pdb: progress(frame, pdbAt - 2, 34),
  };
  const greyP = progress(frame, cheapAt, 14);
  const cheapMark = progress(frame, cheapAt + 8, 16);
  const match = progress(frame, matchAt + 2, wProgramaMatch + 14 - (matchAt + 2), EASE.inOut);
  const sweep = progress(frame, wLetra - 6, 54, EASE.linear);
  const pdbName = windowWeight(frame, wRuta - 4, strongAt + 60, { ramp: 12 });
  const strong = progress(frame, strongAt + 4, 18);
  const focus = {
    lure: windowWeight(frame, wEnvoltorio - 4, wNumero - 2, { ramp: 10 }),
    domain: windowWeight(frame, wNumero - 2, wPoco + 16, { ramp: 10 }),
    pdb: windowWeight(frame, pdbAt, stillFrom - 22, { ramp: 14 }),
  };

  // ---- The doors and the boxes -------------------------------------------------------------------
  const doorIn = progress(frame, wCajas - 10, 20);
  const boxIn = (k: number) => progress(frame, wCajas - 4 + k * 8, 18, EASE.out);
  const plateGlow = windowWeight(frame, wPuerta - 4, wPuerta + 30, { ramp: 10 });
  const wrapperHl = Math.max(windowWeight(frame, wEnvoltorio - 4, wNumero + 4, { ramp: 10 }), windowWeight(frame, wEnvoltorio10 - 4, wNumero10, { ramp: 10 }));
  const callIn = progress(frame, wNumero - 2, 16);
  const callHl = Math.max(windowWeight(frame, wNumero - 2, wPoco + 16, { ramp: 10 }), windowWeight(frame, wNumero10 - 4, wEtiqueta10, { ramp: 10 }));
  const callLevel = callIn * (0.55 + 0.45 * Math.max(callHl, 1 - progress(frame, pdbAt, 20)));
  const open = progress(frame, wDentro - 6, 22);
  const device = progress(frame, wDentro + 10, wPrograma5 + 10 - (wDentro + 10), EASE.inOut);
  const labelAt = props.cue('label');
  const tagIn = progress(frame, labelAt - 2, 16);
  const beat = pulse(frame, fps, 0.5);
  const tagGlow = Math.max(windowWeight(frame, labelAt, wPero, { ramp: 12 }), windowWeight(frame, wEtiqueta10 - 4, props.durationInFrames + 30, { ramp: 12 }));

  // ---- Caption, leader lines, the rule -------------------------------------------------------------
  const capIn = progress(frame, labelAt + 4, 14);
  const leader = progress(frame, labelAt + 8, 22, EASE.inOut);
  const ruleIn = progress(frame, wPero - 4, 16);
  const ruleLine2 = progress(frame, wSalen - 4, 16);
  const ruleGlow = windowWeight(frame, wRara - 4, stillFrom, { ramp: 14 }) * 0.6;

  const boxes = SIDES.map((side) => ({ side, b: boxS04(side) }));
  const labels = Object.fromEntries(boxes.map(({ side, b }) => [side, labelCentre(b, device)])) as Record<(typeof SIDES)[number], { x: number; y: number; w: number }>;
  const capW = LABEL_CAPTION.length * CAPTION.size * 0.5;
  const capMid = CAPTION.y + CAPTION.size * 0.62;

  return (
    <Stage>
      {/* The table: Meridian | Orbital, face to face */}
      <div style={{ position: 'absolute', left: 0, top: tableY, opacity: 0.6 + 0.4 * frameDraw }}>
        <CompareTable
          width={1728}
          rows={['lure', 'domain', 'pdb', 'https', 'supplier']}
          show={tableIn}
          reveal={reveal}
          skeleton={{ lure: skel, domain: skel, pdb: skel }}
          grey={{ lure: greyP, domain: greyP }}
          match={match}
          sweep={sweep}
          pdbName={pdbName}
          marks={{ cheap: cheapMark, strong }}
          focus={focus}
          link={link}
          scale={scale}
        />
      </div>

      {/* Two doors, one box at each */}
      {SIDES.map((side) => (
        <div key={side} style={{ position: 'absolute', left: DOOR_X[side], top: DOOR.y }}>
          <Door side={side} name={DOOR_NAMES[side]} show={doorIn} glow={plateGlow} />
        </div>
      ))}
      {boxes.map(({ side, b }, k) => {
        const slotW = labels[side].w;
        return (
          <div key={side} style={{ position: 'absolute', left: b.x, top: b.y - (1 - boxIn(k)) * 30 }}>
            <TrapBox
              width={b.w}
              show={boxIn(k)}
              open={open}
              device={device}
              lit={device}
              wrapper={side === 'meridian' ? 'cv' : 'order'}
              call={callLevel}
              callPattern={side === 'meridian' ? 'a' : 'b'}
              callSide={side === 'meridian' ? 'right' : 'left'}
              callAt={callBubbleAt(side, b)}
              highlight={{ sticker: wrapperHl, call: callHl }}
            >
              <WorkshopLabel width={slotW * 1.2} path={PDB_PATH} show={tagIn} glow={tagGlow * (0.6 + 0.4 * beat)} />
            </TrapBox>
          </div>
        );
      })}

      {/* «la etiqueta del taller», pointing at both labels */}
      <LeaderLines
        from={{ left: { x: CAPTION.cx - capW / 2 - 14, y: capMid }, right: { x: CAPTION.cx + capW / 2 + 14, y: capMid } }}
        to={labels}
        p={leader}
        glow={tagGlow}
      />
      <LabelCaption text={LABEL_CAPTION} show={capIn} glow={tagGlow} cx={CAPTION.cx} y={CAPTION.y} />

      {/* The rule (two lines, the same in V14 and V15) */}
      <RuleLabel show={ruleIn} line2={ruleLine2} glow={ruleGlow} cx={RULE.cx} y={RULE.y} />
    </Stage>
  );
}
