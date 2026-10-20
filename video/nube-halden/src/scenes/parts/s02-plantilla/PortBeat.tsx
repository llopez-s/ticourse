import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { enter, progress } from '../../../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../../../engine/src/ui';
import { ENVS, GAINS, IAC, KEY_LINE, LINES } from '../../../data/s02-plantilla';
import { Arrow } from '../Arrow';
import { TermPill } from '../Labels';
import { ENV, EnvBox, TPL, TemplateSheet } from './Template';

export const TPL_X = 0;
export const TPL_Y = 76;
const ENV_X = 640;
const ENV_Y = [96, 290];
const GAIN_X = 962;
const GAIN_Y = [84, 196, 268];
const IAC_Y = 372;

export interface PortBeatTimes {
  port: number;
  /** Each typed line's start (the voice's word). */
  typeAt: readonly number[];
  template: number;
  envs: number;
  gainAt: readonly number[];
  iac: number;
  error: number;
  history: number;
  key: number;
  decision: number;
}

/** One line of what the template gives: icon + text (wraps to two lines when long). */
function Gain({ text, icon, small, on }: { text: string; icon: IconName; small?: string; on: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, width: 760, fontFamily: FONT.sans }}>
      <div style={{ marginTop: 2, width: 46, height: 46, borderRadius: 12, display: 'grid', placeItems: 'center', flexShrink: 0, background: alpha(C.cyan, 0.08 + 0.1 * on), border: `2px solid ${alpha(C.cyan, 0.4 + 0.5 * on)}` }}>
        <Icon name={icon} size={28} color={C.cyan} />
      </div>
      <div style={{ fontSize: 36, fontWeight: 750, lineHeight: 1.15, whiteSpace: 'pre-line', color: on > 0.5 ? C.textStrong : C.text }}>
        {text}
        {small ? <span style={{ marginLeft: 16, fontSize: 26, fontWeight: 650, color: C.muted, whiteSpace: 'nowrap' }}>· {small}</span> : null}
      </div>
    </div>
  );
}

/**
 * s02's port beat: Sistemas types the new application's network, machines and permissions into the template (the
 * typing sound on `template`, one line per word, caret blinking); two identical environments come out of it on
 * «Pruebas»; what it gives lights on its words; «infrastructure as code · IaC» on `iac`. On `error` the same amber mark
 * shows on the template's second line and in both environments; on «historial» its footer lights. On `decision` the
 * right side steps back for the decision card (drawn by the scene) and the key line is added.
 */
export function PortBeat({ frame, t }: { frame: number; t: PortBeatTimes }) {
  const typing = frame >= t.template - 2 && frame < t.template + 96;
  const caret = typing && frame % 16 < 10;
  const back = progress(frame, t.decision - 8, 16);
  const err = progress(frame, t.error, 12);
  const envShow = progress(frame, t.envs - 4, 14);
  const lastGain = t.gainAt.length - 1;
  const tplOut: [number, number] = [TPL_X + TPL.w + 6, TPL_Y + 180];

  return (
    <>
      <div style={{ position: 'absolute', left: TPL_X, top: TPL_Y, ...enter(frame, t.port, { distance: 18 }) }}>
        <TemplateSheet
          lines={LINES.map((l) => l.text)}
          keyLine={KEY_LINE}
          s={{
            typed: t.typeAt.map((at) => progress(frame, at - 2, 10)),
            caret,
            error: err,
            history: progress(frame, t.history - 4, 12),
            key: progress(frame, t.key, 14),
            glow: progress(frame, t.template - 4, 10) * (1 - progress(frame, t.envs + 30, 20)),
          }}
        />
      </div>

      <div style={{ position: 'absolute', inset: 0, opacity: 1 - 0.85 * back }}>
        <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          {ENV_Y.map((y, i) => (
            <Arrow key={i} points={[tplOut, [ENV_X - 8, y + ENV.h / 2]]} draw={progress(frame, t.envs - 4 + i * 4, 14)} color={err > 0.5 ? C.amber : C.cyan} width={4} />
          ))}
        </svg>
        {ENVS.map((label, i) => (
          <div key={label} style={{ position: 'absolute', left: ENV_X, top: ENV_Y[i] }}>
            <EnvBox label={label} show={envShow} error={progress(frame, t.error + 6 + i * 4, 12)} />
          </div>
        ))}
        {GAINS.map((g, i) => {
          if (frame < t.gainAt[i] - 4) return null;
          const on = progress(frame, t.gainAt[i], 10) * (1 - (i < lastGain ? 0.5 * progress(frame, t.gainAt[i + 1], 10) : 0.5 * progress(frame, t.iac, 10)));
          return (
            <div key={g.text} style={{ position: 'absolute', left: GAIN_X, top: GAIN_Y[i], ...enter(frame, t.gainAt[i], { distance: 14 }) }}>
              <Gain text={g.text} icon={g.icon} small={'small' in g ? g.small : undefined} on={on} />
            </div>
          );
        })}
        {frame >= t.iac - 6 ? (
          <div style={{ position: 'absolute', left: GAIN_X, top: IAC_Y, ...enter(frame, t.iac - 2, { distance: 14 }) }}>
            <TermPill text={IAC} size={40} on={progress(frame, t.iac, 10) * (1 - 0.5 * progress(frame, t.error, 12))} />
          </div>
        ) : null}
      </div>
    </>
  );
}
