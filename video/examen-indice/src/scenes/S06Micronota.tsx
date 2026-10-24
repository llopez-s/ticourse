import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { FirstChips } from './parts/FirstChips';
import { IndexLine, PAPER, Paper, PostIt, Tag, Verdict } from './parts/paper';
import { Stage, wordFrame } from './kit';

const S = 's06-micronota';
const W = STAGE.width;

/**
 * s06-micronota «Una nota de bolsillo». The scene opens on the cold chips of s05 and `answer` turns
 * them over: «recoger datos» steps back («fuera de turno»), «planificar: definir qué necesitas
 * saber» is marked first. `micro`: one index line in large print, an empty template with the three
 * slots «término · nota · dónde» that fill one by one, «responde sin abrir el libro». `test`: two
 * generic notes side by side, «nota que responde» (check) and «nota que solo apunta» (cross).
 * `postit`: the same idea as two sticky notes, one with the answer written on it and one that
 * says «busca la respuesta». `ach` (think prompt, top band clear): two index entries together,
 * «ACH: gana la menos inconsistente · S4M3» and «ACH: ver página 12 · S4M3», neither marked.
 */
export function S06Micronota(props: SceneProps) {
  const frame = useCurrentFrame();
  const answer = props.cue('answer');
  const micro = props.cue('micro');
  const test = props.cue('test');
  const postit = props.cue('postit');
  const ach = props.cue('ach');

  const reveal = progress(frame, answer + 2, 16, EASE.out);
  const chipsOut = progress(frame, micro - 12, 14, EASE.inOut);

  const fill = progress(frame, micro + 6, 120, EASE.inOut);
  const sinAbrirAt = wordFrame(S, 's06-02', 'responde') - 6;
  const lineOut = progress(frame, test - 12, 14, EASE.inOut);

  const okAt = wordFrame(S, 's06-03', 'buena') - 8;
  const noAt = wordFrame(S, 's06-03', 'no', 0) - 8;
  const testOut = progress(frame, postit - 12, 14, EASE.inOut);

  const postAnsAt = wordFrame(S, 's06-04', 'trae') - 6;
  const postFindAt = wordFrame(S, 's06-04', 'frente') - 6;
  const postOut = progress(frame, ach - 12, 14, EASE.inOut);

  const card = (x: number, ok: boolean, at: number, term: string, note: string, where: string) => {
    const tone = ok ? C.emerald : C.amber;
    const e = enter(frame, test - 2 + (ok ? 0 : 8), { distance: 26 });
    return (
      <div style={{ position: 'absolute', left: x, top: 196, width: 836, ...e }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, fontFamily: FONT.sans }}>
          <Verdict ok={ok} size={58} style={{ opacity: progress(frame, at, 8), transform: `scale(${0.5 + 0.5 * progress(frame, at, 10, EASE.out)})` }} />
          <span style={{ fontSize: 46, fontWeight: 850, color: tone, letterSpacing: -0.5 }}>{ok ? 'nota que responde' : 'nota que solo apunta'}</span>
        </div>
        <Paper w={836} h={236} glow={progress(frame, at, 12) * 0.7} glowColor={tone} style={{ padding: '24px 30px', borderColor: alpha(tone, 0.7) }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 46, fontWeight: 850 }}>{term}</span>
            <span style={{ fontFamily: FONT.mono, fontSize: 32, fontWeight: 700, color: PAPER.soft }}>{where}</span>
          </div>
          <div style={{ marginTop: 14, fontSize: 40, fontWeight: 650, lineHeight: 1.2, color: ok ? PAPER.green : PAPER.amber }}>{note}</div>
        </Paper>
      </div>
    );
  };

  return (
    <Stage>
      {/* the answer to s05's question */}
      {chipsOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - chipsOut, transform: `translateY(${chipsOut * -24}px)` }}>
          <FirstChips frame={frame} appearAt={[-200, -200]} reveal={reveal} />
        </div>
      ) : null}

      {/* an index line, three slots */}
      {frame >= micro - 6 && lineOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: (1 - lineOut) * progress(frame, micro - 6, 14), fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', left: (W - 1560) / 2, top: 220, transform: `translateY(${(1 - progress(frame, micro - 6, 18)) * 24}px)` }}>
            <IndexLine empty={['término', 'nota', 'dónde']} fill={fill} width={1560} size={66} />
          </div>
          <div style={{ position: 'absolute', left: 0, top: 470, width: W, display: 'flex', justifyContent: 'center', ...enter(frame, sinAbrirAt, { distance: 18 }) }}>
            <Tag color={C.cyan} size={46} icon="file">
              una línea que responde sin abrir el libro
            </Tag>
          </div>
        </div>
      ) : null}

      {/* two notes: answers vs only points */}
      {frame >= test - 16 && testOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - testOut, transform: `translateY(${testOut * -20}px)` }}>
          {card(0, true, okAt, 'Diamond Model', '4 vértices: Adversary, Capability, Infrastructure, Victim', 'S2M3')}
          {card(W - 836, false, noAt, 'Diamond Model', 'ver sección 2', 'S2M3')}
        </div>
      ) : null}

      {/* two post-its */}
      {frame >= postit - 8 && postOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - postOut }}>
          <div style={{ position: 'absolute', left: 150, top: 190, ...enter(frame, postAnsAt, { distance: 40 }) }}>
            <PostIt w={560} h={330} rotate={-4}>
              <span style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.12 }}>likely = 55–80 %</span>
            </PostIt>
            <div style={{ position: 'absolute', right: -16, top: -26 }}>
              <Verdict ok size={64} />
            </div>
          </div>
          <div style={{ position: 'absolute', left: 1010, top: 210, ...enter(frame, postFindAt, { distance: 40 }) }}>
            <PostIt w={560} h={330} rotate={3}>
              <span style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.12, color: PAPER.soft }}>busca la respuesta</span>
            </PostIt>
            <div style={{ position: 'absolute', right: -16, top: -26 }}>
              <Verdict ok={false} size={64} />
            </div>
          </div>
        </div>
      ) : null}

      {/* think prompt: two index entries, neither marked */}
      {frame >= ach - 6 ? (
        <div style={{ position: 'absolute', inset: 0, fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', left: (W - 1560) / 2, top: 240, ...enter(frame, ach, { distance: 24 }) }}>
            <IndexLine term="ACH" note="gana la menos inconsistente" where="S4M3" width={1560} size={54} />
          </div>
          <div style={{ position: 'absolute', left: (W - 1560) / 2, top: 410, ...enter(frame, ach + 10, { distance: 24 }) }}>
            <IndexLine term="ACH" note="ver página 12" where="S4M3" width={1560} size={54} />
          </div>
        </div>
      ) : null}
    </Stage>
  );
}
