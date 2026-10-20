import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { windowWeight } from '../../../engine/src/ui/Focus';
import { Icon } from '../../../engine/src/ui/Icon';
import { Chip } from '../../../engine/src/ui/Chip';
import { LearningCard, Mark, Pill, Reveal } from './parts/bits';
import { CASES } from './parts/data';
import { Stage, audioEnd, segment, wordFrame } from './kit';

const S = 's06-caso';
const TILE_W = 420;
const TILE_H = 104;
const GAP_X = 16;
const GAP_Y = 14;
const GRID_Y = 100;

interface Note {
  at: number;
  text: string;
  tone: string;
}

function Tile({ frame, at, file, text, lit, notes }: { frame: number; at: number; file: string; text: string; lit: number; notes: Note[] }) {
  const p = progress(frame, at, 14);
  const note = [...notes].reverse().find((n) => frame >= n.at);
  const hit = text !== 'sin coincidencia';
  const tone = note ? note.tone : hit ? C.cyan : C.muted;
  const glow = Math.max(lit, note ? 0.6 : 0);
  return (
    <div style={{ boxSizing: 'border-box', width: TILE_W, height: TILE_H, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', borderRadius: RADIUS.md, background: alpha(tone, 0.05 + 0.1 * glow), border: `2px solid ${alpha(tone, 0.3 + 0.6 * glow)}`, boxShadow: glow > 0 ? `0 0 ${14 + 18 * glow}px ${alpha(tone, 0.28 * glow)}` : 'none', opacity: p, transform: `translateY(${(1 - p) * 12}px)`, fontFamily: FONT.sans }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: 26, fontWeight: 700, color: C.textStrong, whiteSpace: 'nowrap' }}>{file}</div>
        <div style={{ marginTop: 6, fontSize: 26, fontWeight: 650, color: note ? alpha(tone, 1) : hit ? C.cyanSoft : C.muted, whiteSpace: 'nowrap' }}>{note ? note.text : text}</div>
      </div>
      <Mark kind="yes" size={44} />
    </div>
  );
}

function Statement({ frame, at, icon, tone, title, sub }: { frame: number; at: number; icon: 'check' | 'alert'; tone: string; title: string; sub: string }) {
  return (
    <Reveal frame={frame} at={at} x={0} y={0}>
      <div style={{ boxSizing: 'border-box', width: 840, height: 112, display: 'flex', alignItems: 'center', gap: 20, padding: '0 24px', borderRadius: RADIUS.md, background: alpha(tone, 0.08), border: `2px solid ${alpha(tone, 0.7)}`, fontFamily: FONT.sans }}>
        <Icon name={icon} size={50} color={tone} strokeWidth={2.6} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: C.textStrong, lineHeight: 1.1 }}>{title}</div>
          <div style={{ marginTop: 4, fontSize: 28, fontWeight: 600, color: tone === C.emerald ? '#6ee7b7' : '#fcd34d', whiteSpace: 'nowrap' }}>{sub}</div>
        </div>
      </div>
    </Reveal>
  );
}

/**
 * s06-caso «Doce de doce, con denominador». The real summary line of the reference run (12/12) on top and the
 * twelve cases as tiles: six that must match (cyan) and six that must not (grey, still a green «conforme»), each
 * lit as the voice says «deben coincidir» / «no deben hacerlo». Two pills deny what 12/12 would suggest (twelve
 * infections, perfect sensitivity); the future-uncovered tile turns amber (marker and route change) then rose
 * (known false negative), and the large / boundary tiles show the 4096-byte limit. Contract v1 and extended
 * objective v2 sit side by side; the closing pill carries result + scope. Learning card at the end.
 */
export function S06Doce(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const cardAt = audioEnd(S, 's06-06') + 6;

  const tTiles = w('s06-01', 'doce') - 4;
  const winMatch = windowWeight(frame, w('s06-01', 'archivos', 0), w('s06-01', 'archivos', 1));
  const winNone = windowWeight(frame, w('s06-01', 'archivos', 1), at('s06-02'));
  const denyOut = at('s06-03') - 6;
  const tTam = w('s06-04', 'tamaño');

  const notes: Record<number, Note[]> = {
    9: [{ at: tTam, text: 'fuera de 4096 bytes', tone: C.amber }],
    10: [
      { at: w('s06-03', 'cambia'), text: 'marcador v2 · ruta nueva', tone: C.amber },
      { at: w('s06-04', 'falso'), text: 'FN conocido si incluye v2', tone: C.rose },
    ],
    11: [{ at: tTam + 12, text: '4096 queda fuera', tone: C.amber }],
  };

  return (
    <Stage>
      <Reveal frame={frame} at={at('s06-01') - 2} x={0} y={0} w={1728}>
        <div style={{ boxSizing: 'border-box', width: 1728, height: 80, display: 'flex', alignItems: 'center', gap: 20, padding: '0 28px', borderRadius: RADIUS.md, background: alpha(C.emerald, 0.08), border: `2px solid ${alpha(C.emerald, 0.6)}`, fontFamily: FONT.sans }}>
          <Icon name="check" size={46} color={C.emerald} strokeWidth={3} />
          <span style={{ fontFamily: FONT.mono, fontSize: 36, fontWeight: 800, color: '#6ee7b7', whiteSpace: 'nowrap' }}>YARA 4.5.4: 12/12 casos conformes al alcance declarado</span>
          <span style={{ marginLeft: 'auto' }}>
            <Chip accent="emerald" icon="record" size={26}>captura real · extracto</Chip>
          </span>
        </div>
      </Reveal>

      {CASES.map((c, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const hit = c.hits.length > 0;
        return (
          <div key={c.file} style={{ position: 'absolute', left: col * (TILE_W + GAP_X), top: GRID_Y + row * (TILE_H + GAP_Y) }}>
            <Tile frame={frame} at={tTiles + i * 4} file={c.file} text={hit ? c.hits.join(' · ') : 'sin coincidencia'} lit={hit ? winMatch : winNone} notes={notes[i] ?? []} />
          </div>
        );
      })}

      {/* what 12/12 does not say */}
      <Reveal frame={frame} at={w('s06-02', 'infecciones') - 22} outAt={denyOut} x={0} y={GRID_Y + 3 * (TILE_H + GAP_Y) + 14}>
        <Pill icon="x" tone="rose" size={32}>12/12 no son doce infecciones detectadas</Pill>
      </Reveal>
      <Reveal frame={frame} at={w('s06-02', 'sensibilidad') - 10} outAt={denyOut} x={0} y={GRID_Y + 3 * (TILE_H + GAP_Y) + 82}>
        <Pill icon="x" tone="rose" size={32}>ni sensibilidad perfecta frente a una familia real</Pill>
      </Reveal>

      {/* contract v1 vs extended objective v2 */}
      <div style={{ position: 'absolute', left: 0, top: GRID_Y + 3 * (TILE_H + GAP_Y) + 14 }}>
        <Statement frame={frame} at={props.cue('s06-c')} icon="check" tone={C.emerald} title="Contrato v1" sub="12 de 12 conformes: afirmación correcta" />
      </div>
      <div style={{ position: 'absolute', left: 888, top: GRID_Y + 3 * (TILE_H + GAP_Y) + 14 }}>
        <Statement frame={frame} at={props.cue('s06-c') + 14} icon="alert" tone={C.amber} title="Objetivo ampliado v2" sub="1 falso negativo conocido y límite de tamaño" />
      </div>
      <Reveal frame={frame} at={w('s06-05', 'promesa') - 8} x={0} y={GRID_Y + 3 * (TILE_H + GAP_Y) + 142}>
        <Pill icon="x" tone="rose" size={30} strike>promesa de producción</Pill>
      </Reveal>
      <Reveal frame={frame} at={at('s06-06')} x={520} y={GRID_Y + 3 * (TILE_H + GAP_Y) + 142}>
        <Pill icon="flag" tone="emerald" size={30}>resultado + alcance = conclusión</Pill>
      </Reveal>
      <LearningCard frame={frame} at={cardAt} text="Doce resultados esperados no son cobertura universal" />
    </Stage>
  );
}
