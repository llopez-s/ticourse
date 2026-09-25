import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../timeline/types';
import { STAGE } from '../theme/tokens';
import { Definition } from './parts/s01-hook/Definition';
import { Flood } from './parts/s01-hook/Flood';
import { wordFrame } from './parts/s01-hook/words';

/**
 * S01 "Seis mil avisos, uno importa" - chapter I opener.
 *   flood     the alert queue fills with 6.000 dots, counter climbs
 *   needle    one dot turns rose and pulses; the rest dim
 *   title     the console recedes; SIEM + its expansion, initials lit per word
 *   def-sim   SIM capsule slides in from the left
 *   def-sem   SEM capsule slides in from the right
 *   def-merge capsules fuse into one cyan SIEM card (exam card 4.4 overlay)
 *   verbs     Agregar, Normalizar, Correlacionar, Alertar, one per spoken word
 */
export function S01Hook({ cue }: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const flood = cue('flood');
  const needle = cue('needle');
  const title = cue('title');
  const defSim = cue('def-sim');
  const defSem = cue('def-sem');
  const defMerge = cue('def-merge');
  const verbs = cue('verbs');
  const word = (text: string, fallback: number) => wordFrame('s01-hook', text, fallback);

  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: STAGE.left, top: STAGE.top, width: STAGE.width, height: STAGE.height }}>
        <Flood
          frame={frame}
          fps={fps}
          t={{ flood, needle, title, defSim, team: word('equipo', needle + 87) }}
        />
        <Definition
          frame={frame}
          fps={fps}
          t={{
            title,
            words: [
              word('Security', title + 18),
              word('Information', title + 36),
              word('and', title + 56),
              word('Event', title + 63),
              word('Management', title + 71),
            ],
            defSim,
            defSem,
            defMerge,
            verbsIntro: word('cuatro', verbs - 28),
            verbs: [
              word('agregar', verbs),
              word('normalizar', verbs + 15),
              word('correlacionar', verbs + 37),
              word('alertar', verbs + 62),
            ],
          }}
        />
      </div>
    </AbsoluteFill>
  );
}
