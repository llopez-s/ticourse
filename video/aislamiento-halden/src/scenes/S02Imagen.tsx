import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { CASE, CONTROLS, COPIES_LABEL, COPIES_NEW, FINDING, IMAGE_LABEL } from '../data/s02-imagen';
import { CaseTag, ExamChip, Pill } from './parts/Labels';
import { Mould } from './parts/Mould';
import { AppTile, IMAGE, ImageStack, TILE } from './parts/Software';
import { ImageTag } from './parts/Tags';
import { PatchPath, RebuildPath } from './parts/s02-imagen/Paths';
import { Stage, wordFrame } from './kit';

const S = 's02-imagen';
const LEFT_W = 560;
const IMG = { x: 130, y: 100, w: 300 } as const;
const IMG_H = (IMG.w * IMAGE.h) / IMAGE.w;
const TILE_W = 150;
const TILE_H = (TILE_W * TILE.h) / TILE.w;
const TILE_Y = 404;
const TILE_X = [20, 205, 390];
const RIGHT_X = 628;
const ROW_Y = [66, 136, 206, 276];
const FIND_Y = 384;
const MOULD_X = 1270;
const MOULD_W = 440;

/**
 * s02-imagen «Se cambia, no se parchea». The port's notice board in test containers, not deployed: its image (three
 * layers) lands on `image`, three copies (app windows) drop out of it on `copies` and, on «cambian», the middle one is
 * swapped for another. The four controls light one by one on their cues (REGISTRY TRUST and IMAGE PROVENANCE only on
 * screen). On `finding` the middle layer turns rose with an alarm ring and «un componente con un fallo ya publicado»
 * comes out (no name, no version). On `two-paths` the controls give way to path 1, struck through on «basta» with «la
 * próxima copia sale igual»; on `rebuild` path 2 lights emerald, the layer turns emerald, the image is scanned again and
 * new copies replace the test ones. On `mould` the cookie mould (imagen · no es del puerto): sanded cookie on «Lijar»,
 * the notch fixed on «arregla». Nothing is ever deployed with the flaw.
 */
export function S02Imagen(props: SceneProps) {
  const frame = useCurrentFrame();
  const imageAt = props.cue('image');
  const copiesAt = props.cue('copies');
  const swapAt = wordFrame(S, 's02-02', 'cambian') - 4;
  const ctrlAt = CONTROLS.map((c) => props.cue(c.cue));
  const scanAt = props.cue('scan');
  const findAt = props.cue('finding');
  const twoAt = props.cue('two-paths');
  const strikeAt = wordFrame(S, 's02-05', 'basta') - 4;
  const noteAt = wordFrame(S, 's02-05', 'próxima') - 6;
  const rebuildAt = props.cue('rebuild');
  const rescanAt = wordFrame(S, 's02-05', 'escanea') - 4;
  const newAt = wordFrame(S, 's02-05', 'salen') - 4;
  const line2At = wordFrame(S, 's02-05', 'copias') - 6;
  const mouldAt = props.cue('mould');
  const sandAt = wordFrame(S, 's02-06', 'Lijar') - 4;
  const fixAt = wordFrame(S, 's02-06', 'arregla') - 4;

  const caseIn = enter(frame, -6, { distance: 12, duration: 14 });
  const imgIn = 0.25 + 0.75 * progress(frame, imageAt - 4, 18);
  const flaw = progress(frame, findAt - 2, 10);
  const fixed = progress(frame, wordFrame(S, 's02-05', 'corrige') - 4, 14);
  const scan1 = frame >= scanAt && frame < scanAt + 40 ? (frame - scanAt) / 40 : -1;
  const scan2 = frame >= rescanAt && frame < rescanAt + 34 ? (frame - rescanAt) / 34 : -1;
  const ringT = frame >= findAt - 2 ? ((frame - findAt + 2) % 30) / 30 : 0;
  const ring = frame >= findAt - 2 && frame < findAt + 58 ? ringT : 0;
  const ctrlOut = progress(frame, twoAt - 10, 14, EASE.inOut);
  const findIn = enter(frame, findAt + 2, { distance: 14, duration: 14 });
  const findDim = 1 - 0.45 * progress(frame, rebuildAt + 20, 20);
  const fresh = progress(frame, newAt, 16);
  const mouldIn = enter(frame, mouldAt - 4, { distance: 16, duration: 16 });

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...caseIn }}>
        <CaseTag text={CASE} />
      </div>

      {/* The image and its copies */}
      <div style={{ position: 'absolute', left: 0, top: 58, width: LEFT_W, textAlign: 'center', fontFamily: FONT.sans, fontSize: 32, fontWeight: 800, color: C.cyanSoft, opacity: imgIn, whiteSpace: 'nowrap' }}>
        {IMAGE_LABEL}
      </div>
      <div style={{ position: 'absolute', left: IMG.x, top: IMG.y, opacity: imgIn, transform: `translateY(${(1 - progress(frame, imageAt - 4, 18)) * 16}px)` }}>
        <ImageStack width={IMG.w} glow={progress(frame, imageAt, 20)} flaw={flaw} fixed={fixed} scan={scan1 >= 0 ? scan1 : scan2} ring={ring} />
      </div>
      <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        {TILE_X.map((x, i) => {
          const d = progress(frame, copiesAt + i * 6, 14);
          return d > 0.01 ? (
            <line key={i} x1={IMG.x + IMG.w / 2} y1={IMG.y + IMG_H - 4} x2={IMG.x + IMG.w / 2 + (x + TILE_W / 2 - IMG.x - IMG.w / 2) * d} y2={IMG.y + IMG_H - 4 + (TILE_Y - IMG.y - IMG_H) * d} stroke={alpha(C.cyan, 0.5)} strokeWidth={3} strokeDasharray="8 8" />
          ) : null;
        })}
        {flaw > 0.01 ? (
          <line x1={IMG.x + 296} y1={IMG.y + 102} x2={IMG.x + 296 + (RIGHT_X - 8 - IMG.x - 296) * findIn.opacity} y2={IMG.y + 102 + (FIND_Y + 29 - IMG.y - 102) * findIn.opacity} stroke={alpha(C.rose, 0.7 * findDim)} strokeWidth={4} strokeLinecap="round" />
        ) : null}
      </svg>
      {TILE_X.map((x, i) => {
        const inP = progress(frame, copiesAt + 8 + i * 6, 14);
        const swapped = i === 1 ? progress(frame, swapAt, 12) : 0;
        const oldOut = Math.max(1 - Math.abs(1 - 2 * swapped), fresh);
        return (
          <div key={i} style={{ position: 'absolute', left: x, top: TILE_Y }}>
            <div style={{ position: 'absolute', left: 0, top: 0, opacity: inP * (1 - oldOut), transform: `translateY(${(1 - inP) * -20 + oldOut * 30}px)` }}>
              <AppTile width={TILE_W} glow={progress(frame, copiesAt + 8 + i * 6, 20) * (1 - progress(frame, copiesAt + 40, 30))} />
            </div>
            {fresh > 0.01 ? (
              <div style={{ position: 'absolute', left: 0, top: 0, opacity: fresh, transform: `translateY(${(1 - fresh) * -24}px)` }}>
                <AppTile width={TILE_W} fresh={1} glow={0.6} />
              </div>
            ) : null}
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: 10, top: TILE_Y + TILE_H + 14, fontFamily: FONT.sans, fontSize: 32, fontWeight: 750, color: C.text, whiteSpace: 'nowrap', opacity: progress(frame, copiesAt + 20, 14) * (1 - fresh) }}>
        {COPIES_LABEL}
      </div>
      {fresh > 0.01 ? (
        <div style={{ position: 'absolute', left: 10, top: TILE_Y + TILE_H + 14, fontFamily: FONT.sans, fontSize: 32, fontWeight: 800, color: '#6ee7b7', whiteSpace: 'nowrap', opacity: fresh }}>
          {COPIES_NEW}
        </div>
      ) : null}

      {/* The four controls (until `two-paths`) */}
      {ctrlOut < 1
        ? CONTROLS.map((c, i) => {
            if (frame < ctrlAt[i] - 6) return null;
            const e = enter(frame, ctrlAt[i] - 4, { distance: 14, duration: 12 });
            const on = progress(frame, ctrlAt[i] - 4, 10) * (1 - 0.5 * progress(frame, (ctrlAt[i + 1] ?? findAt) - 2, 12));
            return (
              <div key={c.cue} style={{ position: 'absolute', left: RIGHT_X, top: ROW_Y[i], display: 'flex', alignItems: 'center', gap: 18, opacity: e.opacity * (1 - ctrlOut), transform: e.transform }}>
                <Pill text={c.text} tone={C.cyan} icon={c.icon} on={on} size={32} />
                {c.term ? <ExamChip text={c.term} on={on} size={28} /> : null}
              </div>
            );
          })
        : null}

      {/* The two paths */}
      {frame >= twoAt - 4 ? (
        <div style={{ position: 'absolute', left: RIGHT_X, top: 56 }}>
          <PatchPath show={progress(frame, twoAt - 2, 14)} strike={progress(frame, strikeAt, 14)} note={progress(frame, noteAt, 12)} />
        </div>
      ) : null}
      {frame >= rebuildAt - 4 ? (
        <div style={{ position: 'absolute', left: RIGHT_X, top: 196 }}>
          <RebuildPath show={progress(frame, rebuildAt - 2, 14)} line2={progress(frame, line2At, 12)} glow={progress(frame, rebuildAt, 16) * (1 - 0.4 * progress(frame, mouldAt, 20))} />
        </div>
      ) : null}

      {/* What the scan finds */}
      {frame >= findAt ? (
        <div style={{ position: 'absolute', left: RIGHT_X, top: FIND_Y, opacity: findIn.opacity * findDim, transform: findIn.transform }}>
          <Pill text={FINDING} tone={C.rose} icon="alert" on={1 - 0.6 * progress(frame, twoAt, 20)} size={32} />
        </div>
      ) : null}

      {/* The cookie mould */}
      {frame >= mouldAt - 6 ? (
        <div style={{ position: 'absolute', left: MOULD_X, top: 448, ...mouldIn }}>
          <Mould width={MOULD_W} sand={progress(frame, sandAt, 12)} fixed={progress(frame, fixAt, 14)} glow={progress(frame, fixAt, 14)} />
          <div style={{ position: 'absolute', left: 196, top: -6 }}>
            <ImageTag size={24} />
          </div>
        </div>
      ) : null}
    </Stage>
  );
}
