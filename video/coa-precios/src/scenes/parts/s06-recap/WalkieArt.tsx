import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../../../engine/src/theme/motion';
import { windowWeight } from '../../../../../engine/src/ui';
import { SINKHOLE } from '../../../data/s06-recap';
import { MatrixCell } from '../Matrix';
import { Channel, Figure, walkieTip } from '../Shop';
import { ART_H, ART_W, shown } from './RuleArt';

/**
 * Rule 3's drawing: the suspect on his walkie (amber) and, beside it, the matrix's sinkhole cell with
 * its `[!]` mark and its DENY label. The mark glows while «lo que el atacante ve tiene un precio» is
 * said; from «corta» nobody answers the walkie any more (the far half of the channel goes dashed grey)
 * and the label lights. The C2 is only ever the walkie: no shutter, nobody walked out.
 */

/** The shared Channel bends by fixed design units, so the vignette is drawn in the shop's units and scaled. */
const K = 0.64;
const U = { w: ART_W / K, h: ART_H / K } as const;
const SUSPECT = { x: 84, y: U.h - 4, h: 219 } as const;
/** The far end hangs beside the DENY label, low enough for the channel's arc to stay inside the card. */
const FAR = { x: 508, y: 144 } as const;

/** The verb's tag (emerald: stopping that works). `lit` 0–1 makes it glow. */
function VerbTag({ text, lit }: { text: string; lit: number }) {
  return (
    <div
      style={{
        display: 'inline-block',
        padding: '3px 20px 5px',
        borderRadius: 14,
        border: `3px solid ${alpha(C.emerald, 0.55 + 0.45 * lit)}`,
        background: alpha('#04241b', 0.95),
        boxShadow: lit > 0.02 ? `0 0 ${Math.round(26 * lit)}px ${alpha(C.emerald, 0.45 * lit)}` : undefined,
        fontFamily: FONT.sans,
        fontSize: 38,
        lineHeight: 1.1,
        fontWeight: 900,
        letterSpacing: 1,
        color: C.emerald,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
}

export function WalkieArt({ frame, fps, at, seenAt, cutAt }: { frame: number; fps: number; at: number; /** «ve» */ seenAt: number; /** «corta» */ cutAt: number }) {
  const seen = windowWeight(frame, seenAt, cutAt - 8, { ramp: 10 });
  const cut = progress(frame, cutAt - 2, 20, EASE.inOut);
  const tip = walkieTip(SUSPECT.x, SUSPECT.y, SUSPECT.h);
  return (
    <div style={{ position: 'relative', width: ART_W, height: ART_H, opacity: shown(frame, at) }}>
      <svg width={ART_W} height={ART_H} viewBox={`0 0 ${U.w} ${U.h}`} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <Figure x={SUSPECT.x} y={SUSPECT.y} h={SUSPECT.h} kind="suspect" pose="walkie" />
        <Channel from={tip} to={FAR} state={{ draw: 1, talk: 1, nobody: cut, phase: frame / fps }} />
      </svg>
      {/* The sinkhole cell, always under its DENY label */}
      <div style={{ position: 'absolute', right: 0, bottom: 2, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
        <VerbTag text={SINKHOLE.label} lit={cut} />
        {/* amber while its price is named; emerald once it is the action taken (`seen` is over by then) */}
        <MatrixCell cell={SINKHOLE.cell} fontSize={24} form="wide" header="full" lit={cut > 0.5 ? (cut - 0.5) * 2 : 0.8 * seen} tone={cut > 0.5 ? 'emerald' : 'amber'} markGlow={seen} />
      </div>
    </div>
  );
}
