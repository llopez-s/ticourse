import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, clamp01, type IconName } from '../../../engine/src/ui';
import { ART, GROUPS, PROMISE, SWITCHES, SWITCH_LABEL, TITLE } from '../data/s01-hook';
import { vlan } from '../data/vlans';
import { Illustration, Pin, Region } from './parts/Illustration';
import { CaseStamp, PlaqueChip, Rotulo } from './parts/Tags';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;
const H = STAGE.height;

// ---- Left column (stage coordinates), over the empty night sky of the art.
const COL_X = 28;
const STAMP_TOP = 22;
/** Until the title lands the stamp sits lower, in the middle of the empty sky. */
const STAMP_TOP0 = 236;
const PLAQUE_TOP = 150;
const TITLE_TOP = 214;
const TITLE_SIZE = 96;
const CHIPS_TOP = 446;
const CHIP_H = 58;
const CHIP_GAP = 12;

function PromiseChip({ icon, text, on }: { icon: IconName; text: string; on: number }) {
  const o = clamp01(on);
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        height: CHIP_H,
        padding: '0 26px 0 18px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(C.cyan, 0.4 + 0.5 * o)}`,
        background: alpha(C.ink950, 0.8),
        boxShadow: o > 0.02 ? `0 0 ${Math.round(22 * o)}px ${alpha(C.cyan, 0.3 * o)}` : undefined,
        fontFamily: FONT.sans,
        fontSize: 34,
        fontWeight: 750,
        color: C.textStrong,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name={icon} size={32} color={C.cyan} />
      <span>{text}</span>
    </div>
  );
}

/**
 * s01-hook «Los mismos aparatos». The headquarters in section (art, as a one-hue plate so that only the engine's colours
 * carry meaning) fills the stage; the case stamp sits on the empty sky at the left. On `building` the three groups
 * the voice names light on their words, each in the colour of its VLAN, on both floors, and then the two cabinets
 * («conmutador», one per floor). On `apart` the colours take turns: while one is lit the others go dark. Before 12 s
 * (`title`) the plate «REDES Y ENS · Redes» and «VLAN y 802.1Q» land on the left, and the promise follows as three
 * chips, each on its words (`promise`).
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const buildingAt = props.cue('building');
  const apartAt = props.cue('apart');
  // Title before 12 s, whatever the voice does.
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const groupAt = GROUPS.map((g) => Math.max(buildingAt, wordFrame(S, 's01-01', g.word) - 4));
  const switchAt = wordFrame(S, 's01-01', 'conmutadores') - 6;
  const chipAt = PROMISE.map((p, i) => {
    const at = wordFrame(S, 's01-02', p.word, p.nth) - 6;
    return i === 0 ? Math.max(at, props.cue('promise')) : at;
  });
  const lastWord = wordFrame(S, 's01-02', 'hablarse') + 16;

  // ---- `apart`: one colour at a time, the rest dark; then all three settle.
  const turn = Math.max(14, Math.floor((titleAt - 8 - apartAt) / GROUPS.length));
  const settle = progress(frame, apartAt + turn * GROUPS.length - 4, 14, EASE.inOut);
  const apartOn = progress(frame, apartAt - 4, 10);
  const level = GROUPS.map((_, i) => {
    const shown = progress(frame, groupAt[i], 12);
    const mine = progress(frame, apartAt + i * turn - 4, 8) * (1 - progress(frame, apartAt + (i + 1) * turn - 6, 8, EASE.inOut));
    const duringApart = 0.14 + 0.86 * mine;
    // Before `apart`: fully lit. During: lit only on its turn. After: all back, a little lower so the title leads.
    const v = (1 - apartOn) * 1 + apartOn * ((1 - settle) * duringApart + settle * 0.7);
    return shown * v;
  });
  const switchIn = progress(frame, switchAt, 14);

  const stampIn = enter(frame, -6, { distance: 16, duration: 16 });
  const stampTop = STAMP_TOP0 + (STAMP_TOP - STAMP_TOP0) * progress(frame, titleAt - 18, 26, EASE.inOut);
  const plaqueIn = enter(frame, titleAt - 4, { distance: 14, duration: 16 });
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const chipOn = PROMISE.map((_, i) => progress(frame, chipAt[i], 10) * (1 - 0.55 * progress(frame, (chipAt[i + 1] ?? lastWord) - 2, 12, EASE.inOut)));

  return (
    <Stage>
      <Illustration
        src={ART}
        width={W}
        height={H}
        focus={{ x: 0.5, y: 1 }}
        zoom={{ to: 1.03, start: 0, end: props.durationInFrames }}
        zoomOrigin={{ x: 0.72, y: 0.38 }}
        mono
        dim={0.12}
        opacity={progress(frame, -6, 14)}
        style={{ position: 'absolute', left: 0, top: 0 }}
        overlay={
          // A night veil under the left column, so the text never depends on the art being empty there.
          <div style={{ position: 'absolute', left: 0, top: 0, width: 760, height: H, background: `linear-gradient(90deg, ${alpha(C.ink950, 0.7)} 0%, ${alpha(C.ink950, 0.55)} 70%, ${alpha(C.ink950, 0)} 100%)` }} />
        }
      >
        {/* One cabinet per floor */}
        {SWITCHES.map((s, k) => (
          <Region
            key={k}
            box={s.box}
            style={{ borderRadius: 10, border: `3px solid ${alpha(C.sky, 0.85 * switchIn)}`, background: alpha(C.sky, 0.1 * switchIn), boxShadow: `0 0 ${Math.round(22 * switchIn)}px ${alpha(C.sky, 0.4 * switchIn)}` }}
          />
        ))}
        {/* The three groups, in the colour of their VLAN, on both floors */}
        {GROUPS.map((g, i) => {
          const tone = vlan(g.vlan).tone;
          const o = level[i];
          return g.boxes.map((box, k) => (
            <Region
              key={`${g.text}-${k}`}
              box={box}
              style={{
                borderRadius: 12,
                border: `3px solid ${alpha(tone, 0.95 * o)}`,
                background: alpha(tone, 0.16 * o),
                boxShadow: o > 0.3 ? `0 0 ${Math.round(26 * o)}px ${alpha(tone, 0.45 * o)}` : undefined,
              }}
            />
          ));
        })}
        {SWITCHES.map((s, k) =>
          switchIn > 0.01 ? (
            <Pin key={k} u={s.label.u} v={s.label.v} align="bottom" style={{ opacity: switchIn }}>
              <Rotulo tone={C.sky} size={30} icon="network">
                {SWITCH_LABEL}
              </Rotulo>
            </Pin>
          ) : null,
        )}
        {GROUPS.map((g, i) => {
          const shown = progress(frame, groupAt[i], 12);
          if (shown < 0.01) return null;
          return (
            <Pin key={g.text} u={g.label.u} v={g.label.v} align="bottom" style={{ opacity: shown * (0.35 + 0.65 * clamp01(level[i] / 0.7)) }}>
              <Rotulo tone={vlan(g.vlan).tone} size={32} on={clamp01(level[i])}>
                {g.text}
              </Rotulo>
            </Pin>
          );
        })}
      </Illustration>

      {/* Case stamp */}
      <div style={{ position: 'absolute', left: COL_X, top: stampTop, ...stampIn }}>
        <CaseStamp />
      </div>

      {/* Plate, title and promise */}
      {frame >= titleAt - 6 ? (
        <div style={{ position: 'absolute', left: COL_X, top: PLAQUE_TOP, ...plaqueIn }}>
          <PlaqueChip />
        </div>
      ) : null}
      {frame >= titleAt - 2 ? (
        <div style={{ position: 'absolute', left: COL_X, top: TITLE_TOP, fontFamily: FONT.sans, ...titleIn }}>
          {TITLE.map((l, k) => (
            <div
              key={k}
              style={{
                fontSize: TITLE_SIZE,
                fontWeight: 900,
                letterSpacing: -2,
                lineHeight: 1.06,
                color: k === 0 ? C.textStrong : C.cyan,
                whiteSpace: 'nowrap',
                textShadow: `0 4px 30px ${alpha(C.ink950, 0.9)}`,
              }}
            >
              {l}
            </div>
          ))}
        </div>
      ) : null}
      {PROMISE.map((p, i) => {
        if (frame < chipAt[i] - 2) return null;
        const e = enter(frame, chipAt[i], { distance: 16 });
        return (
          <div key={p.text} style={{ position: 'absolute', left: COL_X, top: CHIPS_TOP + i * (CHIP_H + CHIP_GAP), ...e }}>
            <PromiseChip icon={p.icon} text={p.text} on={chipOn[i]} />
          </div>
        );
      })}
    </Stage>
  );
}
