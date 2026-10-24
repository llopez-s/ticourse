import type { ReactNode } from 'react';
import { C, STAGE, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, type IconName } from '../../../../engine/src/ui';
import { Bars, PAPER, Sheet } from './Paper';

/**
 * The still, textless backgrounds of the three question scenes (the engine's panel covers them, dimmed): generic paper
 * sheets with unreadable bars, a different arrangement per question. Nothing here names a person, a place or a date,
 * and nothing moves.
 */

const SW = 400;
const SH = 470;

/** A round badge on a sheet's corner (an icon on a coloured disc). */
function Badge({ icon, tone, size = 76, style }: { icon: IconName; tone: string; size?: number; style?: React.CSSProperties }) {
  return (
    <div style={{ position: 'absolute', width: size, height: size, borderRadius: size / 2, background: C.ink900, border: `4px solid ${tone}`, display: 'grid', placeItems: 'center', boxShadow: `0 0 28px ${alpha(tone, 0.35)}`, ...style }}>
      <Icon name={icon} size={Math.round(size * 0.52)} color={tone} strokeWidth={2.2} />
    </div>
  );
}

function Centered({ w, h, children }: { w: number; h: number; children: ReactNode }) {
  return <div style={{ position: 'absolute', left: (STAGE.width - w) / 2, top: (STAGE.height - h) / 2, width: w, height: h }}>{children}</div>;
}

/** s03 «Un documento de desarrollo»: a sheet that suggests (a lock on it, no stamp of authority) over a second one. */
export function DevArt() {
  return (
    <Centered w={900} h={SH + 40}>
      <div style={{ position: 'absolute', left: 140, top: 30 }}>
        <Sheet width={SW} height={SH} tilt={-6} heading={null}>
          <Bars set={1} count={6} />
        </Sheet>
      </div>
      <div style={{ position: 'absolute', left: 340, top: 0 }}>
        <Sheet width={SW} height={SH} tilt={3} heading={null}>
          <Bars set={0} count={3} />
          <div style={{ marginTop: 26, height: 86, borderRadius: 10, background: PAPER.bar, display: 'grid', placeItems: 'center' }}>
            <Icon name="terminal" size={52} color={PAPER.soft} strokeWidth={2} />
          </div>
          <Bars set={2} count={3} style={{ marginTop: 26 }} />
        </Sheet>
        <Badge icon="lock" tone={C.cyan} style={{ left: SW - 40, top: -22 }} />
      </div>
    </Centered>
  );
}

/** s05 «Un documento firmado por todos»: a sheet of numbered steps with an approval seal and many signatures. */
export function StepsArt() {
  const steps = [0.86, 0.7, 0.78];
  return (
    <Centered w={900} h={SH + 40}>
      <div style={{ position: 'absolute', left: 120, top: 36 }}>
        <Sheet width={SW} height={SH} tilt={-4} heading={null}>
          <Bars set={3} count={5} />
        </Sheet>
      </div>
      <div style={{ position: 'absolute', left: 330, top: 0 }}>
        <Sheet width={SW + 70} height={SH} tilt={2} heading={null}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28, marginTop: 8 }}>
            {steps.map((w, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <div style={{ width: 44, height: 44, borderRadius: 22, background: PAPER.ink, color: '#ffffff', display: 'grid', placeItems: 'center', fontSize: 26, fontWeight: 850 }}>{i + 1}</div>
                <div style={{ width: `${w * 100}%`, height: 14, borderRadius: 7, background: PAPER.bar }} />
              </div>
            ))}
          </div>
          <svg width="100%" height={86} viewBox="0 0 400 86" style={{ marginTop: 34 }} fill="none" stroke={PAPER.ink} strokeWidth={3} strokeLinecap="round" opacity={0.7}>
            <path d="M 6 44 C 16 8, 26 10, 26 32 C 26 46, 36 16, 46 30 C 54 40, 58 38, 66 24" />
            <path d="M 110 50 C 120 14, 130 16, 130 38 C 130 52, 142 22, 152 36 C 160 44, 164 42, 172 28" />
            <path d="M 214 46 C 224 10, 234 12, 234 34 C 234 48, 246 18, 256 32 C 264 42, 268 40, 276 26" />
            <path d="M 4 74 L 392 74" stroke={PAPER.edge} />
          </svg>
        </Sheet>
        <Badge icon="check" tone={C.emerald} style={{ left: SW + 30, top: -22 }} />
      </div>
    </Centered>
  );
}

/** s07 «Una ley en marzo»: the sheet with its yearly review, and a newer sheet sliding in with a bell. */
export function LawArt() {
  return (
    <Centered w={900} h={SH + 40}>
      <div style={{ position: 'absolute', left: 120, top: 30 }}>
        <Sheet width={SW} height={SH} tilt={-3} heading={null}>
          <Bars set={0} count={4} />
          <div style={{ marginTop: 30, display: 'flex', alignItems: 'center', gap: 18 }}>
            <Icon name="clock" size={64} color={PAPER.soft} strokeWidth={2} />
            <div style={{ flex: 1 }}>
              <Bars set={2} count={2} />
            </div>
          </div>
          <Bars set={1} count={3} style={{ marginTop: 30 }} />
        </Sheet>
      </div>
      <div style={{ position: 'absolute', left: 400, top: 6 }}>
        <Sheet width={SW} height={SH} tilt={5} heading={null} glow={0.5} glowTone={C.amber}>
          <Bars set={3} count={6} />
        </Sheet>
        <Badge icon="bell" tone={C.amber} style={{ left: SW - 40, top: -22 }} />
      </div>
    </Centered>
  );
}
