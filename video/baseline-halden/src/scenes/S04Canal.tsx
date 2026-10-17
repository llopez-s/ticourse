import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { HARDENING, LIVING_ROOM, PRINCIPLE, RULE, SLOTS, type SlotArt } from '../data/s04-canal';
import { BaselineSheet, sheetHeight } from './parts/BaselineSheet';
import { BridgeArt, CloudArt, LaptopArt, PhoneArt } from './parts/Devices';
import { ImageTag, Pill } from './parts/Labels';
import { REMOTES_H, REMOTES_W, Remotes } from './parts/Remotes';
import { Stage, wordFrame } from './kit';

const S = 's04-canal';
const W = 1728;
const SHEET_W = 180;
const SHEET_H = sheetHeight(SHEET_W);
const PRINCIPLE_X = 214;
const HARD_X = 1056;
const SLOT_TOP = 104;
const SLOT_H = 336;
const SLOT_GAP = 20;
const SLOT_W = (W - 3 * SLOT_GAP) / 4;
const ROW2_Y = 456;
const REMOTE_W = 470;
const RULE_X = 760;

function art(kind: SlotArt): ReactNode {
  switch (kind) {
    case 'laptop':
      return <LaptopArt width={146} />;
    case 'phone':
      return <PhoneArt width={56} />;
    case 'cloud':
      return <CloudArt width={150} />;
    case 'bridge':
      return <BridgeArt width={184} tone={C.amber} />;
  }
}

/**
 * s04-canal «Cada aparato, su mando». The baseline sheet comes back top-left with its principle in one line,
 * «quitar lo que sobra · proteger lo que queda», named «Hardening» on its word. Four dashed slots wait from the first
 * frame. On `laptop`, `phone` and `cloud` a copy of the sheet flies into its slot and the slot fills: the machine,
 * its channel (sky) and its main measure (emerald) — the laptop's «usuaria sin derechos de admin» lit, with «disco
 * cifrado · EDR» half-lit. On `remotes` the living room comes in small at the bottom-left: the TV and the
 * air-conditioning unit, each obeying its own remote, and on «obedece» the AC remote aimed at the TV, crossed out.
 * On `rule` the rule in plain words; on `no-remote` the fourth slot: the drawbridge, «sin mando», no sheet.
 */
export function S04Canal(props: SceneProps) {
  const frame = useCurrentFrame();
  const paperAt = props.cue('paper') - 4;
  const principleAt = wordFrame(S, 's04-01', 'Quitar') - 6;
  const hardAt = wordFrame(S, 's04-01', 'hardening') - 6;
  const slotAt = SLOTS.map((s) => props.cue(s.cue));
  const mainAt = [wordFrame(S, 's04-02', 'quien') - 6, slotAt[1] + 30, slotAt[2] + 20, slotAt[3]];
  const remotesAt = props.cue('remotes');
  const crossAt = wordFrame(S, 's04-04', 'obedece') - 4;
  const ruleAt = props.cue('rule');

  const sheetIn = enter(frame, paperAt, { distance: 18 });
  const principleIn = progress(frame, principleAt, 16);
  const hardIn = progress(frame, hardAt, 14);
  const waiting = progress(frame, paperAt + 10, 16);

  const tvIn = progress(frame, remotesAt - 4, 14);
  const acIn = progress(frame, remotesAt + 6, 14);
  const tvBeam = progress(frame, wordFrame(S, 's04-04', 'tele') - 4, 12);
  const acBeam = progress(frame, remotesAt + 16, 12);
  const cross = progress(frame, crossAt, 14);
  const ruleIn = progress(frame, ruleAt - 2, 16);

  const slotX = (i: number) => i * (SLOT_W + SLOT_GAP);
  const sheetCentre = { x: SHEET_W / 2, y: SHEET_H / 2 };

  return (
    <Stage>
      <div style={{ position: 'absolute', inset: 0, fontFamily: FONT.sans }}>
        {/* the sheet, its principle and its name */}
        <div style={{ position: 'absolute', left: 0, top: 0, ...sheetIn }}>
          <BaselineSheet width={SHEET_W} glow={0.5} />
        </div>
        {principleIn > 0.01 ? (
          <div style={{ position: 'absolute', left: PRINCIPLE_X, top: 6, fontSize: 38, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', opacity: principleIn, transform: `translateX(${(1 - principleIn) * 14}px)` }}>
            {PRINCIPLE}
          </div>
        ) : null}
        {hardIn > 0.01 ? (
          <div style={{ position: 'absolute', left: HARD_X, top: 0, opacity: hardIn, transform: `translateY(${(1 - hardIn) * 10}px)` }}>
            <Pill text={HARDENING} tone={C.violet} size={34} height={50} weight={850} on={hardIn * (1 - 0.4 * progress(frame, slotAt[0], 14))} />
          </div>
        ) : null}

        {/* the four slots */}
        {SLOTS.map((s, i) => {
          const x = slotX(i);
          const fill = progress(frame, slotAt[i] + (s.art === 'bridge' ? 0 : 14), 16);
          const mainIn = progress(frame, mainAt[i], 14);
          const isBridge = s.art === 'bridge';
          const tone = isBridge ? C.amber : C.cyan;
          // A copy of the sheet flies from the top-left into this slot (not into the bridge's).
          const fly = isBridge ? 0 : progress(frame, slotAt[i] - 6, 22, EASE.inOut);
          const flyOn = fly > 0.01 && fly < 0.999;
          const to = { x: x + SLOT_W - 40, y: SLOT_TOP - 26 };
          const fx = sheetCentre.x + (to.x - sheetCentre.x) * fly;
          const fy = sheetCentre.y + (to.y - sheetCentre.y) * fly - Math.sin(Math.PI * fly) * 50;
          const on = fill * (1 - 0.35 * progress(frame, (slotAt[i + 1] ?? remotesAt) - 2, 14));
          return (
            <div key={s.name}>
              {/* the waiting slot */}
              <div
                style={{
                  position: 'absolute',
                  left: x,
                  top: SLOT_TOP,
                  width: SLOT_W,
                  height: SLOT_H,
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.lg,
                  border: `2px dashed ${C.ink600}`,
                  opacity: waiting * (1 - fill),
                }}
              />
              {fill > 0.01 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: x,
                    top: SLOT_TOP,
                    width: SLOT_W,
                    height: SLOT_H,
                    boxSizing: 'border-box',
                    padding: '14px 20px',
                    borderRadius: RADIUS.lg,
                    border: `${on > 0.6 ? 3 : 2}px solid ${alpha(tone, 0.3 + 0.5 * on)}`,
                    background: `linear-gradient(180deg, ${alpha(tone, 0.04 + 0.06 * on)} 0%, ${alpha(C.ink900, 0.95)} 60%)`,
                    boxShadow: on > 0.05 ? `0 0 ${Math.round(30 * on)}px ${alpha(tone, 0.2 * on)}` : undefined,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    opacity: fill,
                    transform: `translateY(${(1 - fill) * 14}px)`,
                  }}
                >
                  <div style={{ fontSize: 30, fontWeight: 750, color: isBridge ? '#fcd34d' : C.cyanSoft, whiteSpace: 'nowrap' }}>{s.name}</div>
                  <div style={{ height: 90, marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{art(s.art)}</div>
                  <div style={{ marginTop: 8 }}>
                    <Pill text={s.channel} tone={isBridge ? C.amber : C.sky} icon={isBridge ? 'unplug' : 'split'} size={30} height={48} on={0.8} />
                  </div>
                  {s.main.length ? (
                    <div style={{ marginTop: 14, fontSize: 32, fontWeight: 800, lineHeight: 1.18, color: '#6ee7b7', textAlign: 'center', whiteSpace: 'nowrap', opacity: 0.25 + 0.75 * mainIn }}>
                      {s.main.map((l) => (
                        <div key={l}>{l}</div>
                      ))}
                    </div>
                  ) : null}
                  {s.aside ? <div style={{ marginTop: 8, fontSize: 28, fontWeight: 600, color: C.faint, whiteSpace: 'nowrap', opacity: 0.8 * mainIn }}>{s.aside}</div> : null}
                </div>
              ) : null}
              {/* the copy that has landed: a small sheet tab on the slot's corner */}
              {!isBridge && fly >= 0.999 ? (
                <div style={{ position: 'absolute', left: to.x, top: to.y, transform: 'rotate(6deg)' }}>
                  <MiniSheet />
                </div>
              ) : null}
              {flyOn ? (
                <div style={{ position: 'absolute', left: fx, top: fy, transform: `rotate(${6 * fly}deg) scale(${1.15 - 0.15 * fly})` }}>
                  <MiniSheet />
                </div>
              ) : null}
            </div>
          );
        })}

        {/* the living room */}
        {tvIn > 0.01 ? (
          <div style={{ position: 'absolute', left: 0, top: ROW2_Y, width: REMOTE_W, height: (REMOTE_W * REMOTES_H) / REMOTES_W }}>
            <Remotes width={REMOTE_W} tvIn={tvIn} acIn={acIn} tvBeam={tvBeam} acBeam={acBeam} cross={cross} />
          </div>
        ) : null}
        {tvIn > 0.01 ? (
          <div style={{ position: 'absolute', left: REMOTE_W + 20, top: ROW2_Y + 6, opacity: tvIn }}>
            <ImageTag text={LIVING_ROOM} />
          </div>
        ) : null}

        {/* the rule */}
        {ruleIn > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: RULE_X,
              top: ROW2_Y + 4,
              width: W - RULE_X,
              boxSizing: 'border-box',
              padding: '16px 28px',
              borderRadius: RADIUS.lg,
              border: `3px solid ${alpha(C.cyan, 0.6)}`,
              background: alpha(C.cyan, 0.08),
              display: 'flex',
              alignItems: 'center',
              gap: 22,
              opacity: ruleIn,
              transform: `translateY(${(1 - ruleIn) * 14}px)`,
            }}
          >
            <Icon name="split" size={52} color={C.cyan} strokeWidth={2.2} />
            <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.2, color: C.textStrong, whiteSpace: 'nowrap' }}>
              <div>{RULE[0]}</div>
              <div style={{ color: C.cyanSoft }}>{RULE[1]}</div>
            </div>
          </div>
        ) : null}
      </div>
    </Stage>
  );
}

/** The baseline sheet as a small tab (the same pale page and cyan header bar). */
function MiniSheet() {
  return (
    <div style={{ width: 50, height: 62, borderRadius: 6, background: 'linear-gradient(180deg, #e8eef6 0%, #d5deea 100%)', border: `2px solid ${alpha(C.cyan, 0.8)}`, boxShadow: `0 6px 16px ${alpha('#000000', 0.45)}`, position: 'relative' }}>
      <div style={{ position: 'absolute', left: 7, top: 8, width: 5, height: 12, borderRadius: 2, background: C.cyanDeep }} />
      <div style={{ position: 'absolute', left: 16, top: 11, width: 24, height: 5, borderRadius: 2, background: C.cyanDeep }} />
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: 'absolute', left: 7, top: 28 + i * 9, width: 34 - (i % 2) * 8, height: 4, borderRadius: 2, background: alpha('#1e293b', 0.4) }} />
      ))}
    </div>
  );
}
