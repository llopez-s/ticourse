import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { clamp01, mix } from '../../../engine/src/ui';
import { ART_MAIL, ART_MAIL_END, CLIP_LIFT, FLOOR_A, FLOOR_B, LABELS, REGION_DESK, REGION_LIFT, REGION_TRAY, TRUNK_FRAMES, type AccessPort } from '../data/s04-etiqueta';
import { NATIVE, vlan } from '../data/vlans';
import { ClipPlate, Region } from './parts/Illustration';
import { Device, FrameGlyph, Switch, switchPortX } from './parts/Net';
import { ImageTag, Rotulo } from './parts/Tags';
import { Lines, OPEN_TAG_H, OpenTag, TrunkPipe, Tray } from './parts/s04-etiqueta/bits';
import { Stage, wordFrame } from './kit';

const S = 's04-etiqueta';
const W = STAGE.width;

// ---- Beats 1–2 (code): one switch per floor and, between them, the trunk. The width is taken (four tagged frames
// fill the trunk between the two switches), so the diagram grows downwards: taller switches, longer lanes and bigger
// devices use the stage from y ≈ 40 to 630.
const SW_W = 420;
const SW_H = 116;
const SW_Y = 136;
const A_X = 30;
const B_X = W - 30 - SW_W;
const PIPE = { x: A_X + SW_W, y: SW_Y + 12, w: B_X - (A_X + SW_W), h: 92 } as const;
const LANE = { top: SW_Y + SW_H + 4, bottom: 404, w: 66 } as const;
const DEV = { size: 68, y: 410 } as const;
const SMALL = { w: 62, h: 26 } as const;
const SMALL_Y_DEV = DEV.y - SMALL.h - 6;
const SMALL_Y_SW = LANE.top + 6;
/** Frames: tall enough for the VLAN number on the tag to read (digits = 0.62 × height). FR is beat 3's size. */
const FR = { w: 176, h: 54, gap: 32 } as const;
/** Frames on the trunk of beats 1–2: as tall as two digits still fit on the tag at this width. */
const TFR = { w: 176, h: 56, gap: 32 } as const;
const FR_X0 = Math.round((PIPE.w - (TRUNK_FRAMES.length * TFR.w + (TRUNK_FRAMES.length - 1) * TFR.gap)) / 2);
const slotX = (k: number) => FR_X0 + k * (TFR.w + TFR.gap);
const TFR_Y = Math.round((PIPE.h - 6 - TFR.h) / 2);
const portX = (x0: number, i: number) => x0 + switchPortX(i, FLOOR_A.length, SW_W);
const LABEL_Y = [506, 576] as const;
const TRUNK_LABEL_Y = 44;
const OPEN = { x: 164, y: 424, w: 1400 } as const;

// ---- Beat 3 (art): the mail room on the left, the code column on the right.
const PLATE = { x: 0, y: 0, w: 1060, h: 592 } as const;
const COL = { x: 1090, w: W - 1090 } as const;
const ROW_Y = [36, 300] as const;
const N_PIPE = { y: 30, h: 84 } as const;
const N_FRAME_X = COL.x + Math.round((COL.w - FR.w) / 2);
const N_FRAME_Y = N_PIPE.y + Math.round((N_PIPE.h - 6 - FR.h) / 2) + 3;
/** The tray is wider than the frame on the right: the native VLAN's number is written there on `n999`. */
const TRAY = { x: N_FRAME_X - 24, y: 250, w: FR.w + 24 + 120, h: 96 } as const;
const N_LABEL_Y = 372;
const N999_Y = 540;

function Floor({ x0, ports, frame, at, dimOf, litOf }: { x0: number; ports: readonly AccessPort[]; frame: number; at: number; dimOf: (i: number) => number; litOf: (i: number) => number }) {
  return (
    <>
      {ports.map((p, i) => {
        const tone = vlan(p.vlan).tone;
        const o = progress(frame, at + i * 3, 12) * dimOf(i);
        const lit = litOf(i);
        const x = portX(x0, i);
        return (
          <div key={i} style={{ opacity: o }}>
            <div
              style={{
                position: 'absolute',
                left: x - LANE.w / 2,
                top: LANE.top,
                width: LANE.w,
                height: LANE.bottom - LANE.top,
                boxSizing: 'border-box',
                borderRadius: 10,
                border: `3px solid ${alpha(tone, 0.22 + 0.7 * lit)}`,
                background: alpha(tone, 0.05 + 0.1 * lit),
              }}
            />
            <div style={{ position: 'absolute', left: x - 2, top: LANE.top + 4, width: 4, height: LANE.bottom - LANE.top - 8, borderRadius: 2, background: alpha(tone, 0.5) }} />
            <div style={{ position: 'absolute', left: x - DEV.size / 2, top: DEV.y }}>
              <Device icon={p.icon} tone={tone} size={DEV.size} on={0.3 + 0.5 * lit} />
            </div>
          </div>
        );
      })}
    </>
  );
}

/**
 * s04-etiqueta «El sobre y la pegatina», in three beats so the stage is never crowded.
 * 1 (code) `access`/`untagged`: the switch of one floor with its access ports in VLAN colours; one port of VLAN 10 is
 *   picked out («puerto de acceso · una sola VLAN») and a frame goes in through it and out through the other port of
 *   its VLAN, «sin etiqueta».
 * 2 (code) `trunk`/`tag`/`dot1q`/`vid`: the other floor's switch lights and the cable between them is drawn; one frame
 *   per VLAN enters it, each gets a tag with its VLAN number, the link is named «enlace troncal · IEEE 802.1Q» and the
 *   tag of the first frame opens in its four fields, the VID lit on «doce».
 * 3 (art + code) `mail`: the diagram leaves and the mail room comes in (tagged «imagen · no es el Consorcio»); the desk
 *   pairs with «puerto de acceso / sin etiqueta», the lift with «enlace troncal / con etiqueta» while the clip takes
 *   the envelopes up (held on its end still). `native`/`tray`/`n999`: on the right an untagged frame arrives on a
 *   trunk and drops into a dashed tray, named in three lines, and the headquarters' native 999 closes the scene.
 */
export function S04Etiqueta(props: SceneProps) {
  const frame = useCurrentFrame();
  const trunkAt = props.cue('trunk');
  const tagAt = props.cue('tag');
  const vidAt = props.cue('vid');
  const mailAt = props.cue('mail');
  const nativeAt = props.cue('native');
  const trayAt = props.cue('tray');
  const n999At = props.cue('n999');
  const pickAt = Math.max(props.cue('access'), wordFrame(S, 's04-01', 'puerto') - 4);
  const accessLabelAt = Math.max(props.cue('untagged'), wordFrame(S, 's04-02', 'puerto') - 6);
  const goAt = wordFrame(S, 's04-02', 'entra') - 4;
  const untaggedAt = wordFrame(S, 's04-02', 'sin') - 4;
  const cableAt = wordFrame(S, 's04-03', 'cable') - 6;
  const flowAt = wordFrame(S, 's04-03', 'pasan') - 6;
  const trunkLabelAt = Math.max(props.cue('dot1q'), wordFrame(S, 's04-04', 'troncal') - 6);
  const keyAt = wordFrame(S, 's04-04', 'doce') - 4;
  const deskAt = wordFrame(S, 's04-05', 'Dentro') - 4;
  // «En el montacargas»: the clip starts on «En» (the second «en» of the segment; the first is «Piensa en»).
  const liftAt = wordFrame(S, 's04-05', 'en', 1) - 2;
  const strayAt = wordFrame(S, 's04-06', 'trama') - 8;
  const strayLabelAt = wordFrame(S, 's04-06', 'sin') - 4;
  // The drop lands on the `tray` cue, where the timeline plays its sound.
  const fallAt = trayAt - 20;
  const trayInAt = strayAt + 16;
  const artTrayAt = trayAt + 4;
  const nativeLabelAt = wordFrame(S, 's04-06', 'VLAN') - 6;

  // ---- Beat changes.
  const lowOut = 1 - progress(frame, vidAt - 18, 14, EASE.inOut);
  const diagramOut = 1 - progress(frame, mailAt - 16, 14, EASE.inOut);
  const rowsOut = 1 - progress(frame, nativeAt - 14, 12, EASE.inOut);

  // ---- Beat 1.
  const pick = progress(frame, pickAt, 14) * (1 - progress(frame, trunkAt - 6, 16, EASE.inOut));
  const up = progress(frame, goAt, 18, EASE.inOut);
  const across = progress(frame, goAt + 18, 12, EASE.inOut);
  const down = progress(frame, goAt + 30, 18, EASE.inOut);
  const tripGone = progress(frame, goAt + 58, 12, EASE.inOut);
  const accessLive = progress(frame, accessLabelAt, 10) * (1 - 0.6 * progress(frame, untaggedAt - 4, 14, EASE.inOut));
  const untaggedLive = progress(frame, untaggedAt, 10) * (1 - 0.6 * progress(frame, trunkAt - 6, 14, EASE.inOut));
  const labelsDim = 1 - 0.55 * progress(frame, trunkAt, 16, EASE.inOut);

  // ---- Beat 2.
  const bOn = progress(frame, trunkAt, 18);
  const pipe = progress(frame, cableAt, 26, EASE.inOut);
  const lanes = progress(frame, flowAt - 6, 16);
  const trunkLive = progress(frame, trunkLabelAt, 10) * (1 - 0.6 * progress(frame, vidAt - 8, 14, EASE.inOut));
  const open = enter(frame, vidAt - 4, { distance: 20 });
  const keyOn = progress(frame, keyAt, 14);

  // ---- Beat 3.
  const plateIn = enter(frame, mailAt - 6, { distance: 30, duration: 20, axis: 'x' });
  const desk = progress(frame, deskAt, 14) * rowsOut;
  const deskLive = desk * (1 - 0.6 * progress(frame, liftAt - 4, 14, EASE.inOut));
  const lift = progress(frame, liftAt, 14) * rowsOut;
  const stray = progress(frame, strayAt, 30, EASE.out);
  const fall = progress(frame, fallAt, 26, EASE.in);
  const landed = progress(frame, fallAt + 24, 10);
  const strayLive = progress(frame, strayLabelAt, 10) * (1 - 0.6 * progress(frame, fallAt, 14, EASE.inOut));
  const artTray = progress(frame, artTrayAt, 14) * (1 - 0.5 * progress(frame, n999At, 20, EASE.inOut));
  const nativeLive = progress(frame, nativeLabelAt, 10) * (1 - 0.6 * progress(frame, n999At - 6, 14, EASE.inOut));
  const n999Live = progress(frame, n999At + 4, 10) * (1 - 0.5 * progress(frame, n999At + 70, 30, EASE.inOut));
  const nativeParts = NATIVE.label.split(' · ');

  const first = vlan(TRUNK_FRAMES[0]).tone;

  return (
    <Stage>
      {/* ------------------------------------------------ beats 1–2: the two floors and the trunk (code) */}
      {diagramOut > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: STAGE.height, opacity: diagramOut }}>
          {/* lanes, devices */}
          {lowOut > 0.01 ? (
            <div style={{ opacity: lowOut }}>
              <Floor x0={A_X} ports={FLOOR_A} frame={frame} at={-20} dimOf={(i) => (FLOOR_A[i].vlan === 10 ? 1 : 1 - 0.65 * pick)} litOf={(i) => (i === 0 ? pick : i === 1 ? pick * down : 0)} />
              <div style={{ opacity: 0.3 + 0.7 * bOn }}>
                <Floor x0={B_X} ports={FLOOR_B} frame={frame} at={-20} dimOf={() => 1} litOf={() => 0} />
              </div>

              {/* «¿de qué VLAN es cada trama?»: frames climbing every lane, all alike */}
              {FLOOR_A.map((_, i) => {
                const start = 24 + i * 16;
                const t = progress(frame, start, 44, EASE.inOut);
                const o = progress(frame, start, 8) * (1 - progress(frame, start + 40, 10));
                if (o < 0.01 || frame >= pickAt + 20) return null;
                return (
                  <div key={i} style={{ position: 'absolute', left: portX(A_X, i) - SMALL.w / 2, top: mix(SMALL_Y_DEV, SMALL_Y_SW, t), opacity: o }}>
                    <FrameGlyph width={SMALL.w} height={SMALL.h} tone={C.text} glow={0.5} />
                  </div>
                );
              })}

              {/* in through its access port, out through the other port of its VLAN: never a tag */}
              {up > 0.01 && tripGone < 0.99 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: mix(portX(A_X, 0), portX(A_X, 1), across) - SMALL.w / 2,
                    top: down > 0 ? mix(SMALL_Y_SW, SMALL_Y_DEV, down) : mix(SMALL_Y_DEV, SMALL_Y_SW, up),
                    opacity: progress(frame, goAt, 6) * (1 - tripGone),
                  }}
                >
                  <FrameGlyph width={SMALL.w} height={SMALL.h} tone={vlan(10).tone} glow={0.9} />
                </div>
              ) : null}

              {/* labels of beat 1 */}
              {frame >= accessLabelAt - 2 ? (
                <div style={{ position: 'absolute', left: A_X, top: LABEL_Y[0], opacity: labelsDim }}>
                  <div style={enter(frame, accessLabelAt, { distance: 14 })}>
                    <Rotulo tone={vlan(10).tone} size={34} icon="plug" on={accessLive}>
                      {LABELS.access}
                    </Rotulo>
                  </div>
                </div>
              ) : null}
              {frame >= untaggedAt - 2 ? (
                <div style={{ position: 'absolute', left: A_X, top: LABEL_Y[1], opacity: labelsDim }}>
                  <div style={enter(frame, untaggedAt, { distance: 14 })}>
                    <Rotulo tone={vlan(10).tone} size={34} on={untaggedLive}>
                      <FrameGlyph width={SMALL.w} height={SMALL.h} tone={vlan(10).tone} glow={0} />
                      {LABELS.untagged}
                    </Rotulo>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* the trunk, between the switches' sides */}
          {pipe > 0.01 ? (
            <div style={{ position: 'absolute', left: PIPE.x, top: PIPE.y }}>
              <TrunkPipe width={PIPE.w} height={PIPE.h} draw={pipe} tones={TRUNK_FRAMES.map((id) => vlan(id).tone)} lanes={lanes}>
                {TRUNK_FRAMES.map((id, k) => {
                  const v = vlan(id);
                  // The frame that goes furthest enters first.
                  const inAt = flowAt + (TRUNK_FRAMES.length - 1 - k) * 10;
                  const t = progress(frame, inAt, 30, EASE.out);
                  if (t < 0.005) return null;
                  const tagOn = progress(frame, tagAt + 4 + k * 9, 12);
                  const others = 1 - 0.55 * progress(frame, vidAt - 8, 14, EASE.inOut) * (k === 0 ? 0 : 1);
                  return (
                    <div key={id} style={{ position: 'absolute', left: mix(-TFR.w, slotX(k), t), top: TFR_Y, opacity: others }}>
                      <FrameGlyph
                        width={TFR.w}
                        height={TFR.h}
                        tone={v.tone}
                        glow={0.4 + 0.5 * tagOn * (1 - progress(frame, tagAt + 40 + k * 9, 30))}
                        tag={tagOn > 0.02 ? { label: String(v.id), tone: v.tone, on: tagOn } : undefined}
                      />
                    </div>
                  );
                })}
              </TrunkPipe>
            </div>
          ) : null}

          {/* the two switches */}
          <div style={{ position: 'absolute', left: A_X, top: SW_Y }}>
            <Switch width={SW_W} height={SW_H} glow={0.5} ports={FLOOR_A.map((p, i) => ({ tone: vlan(p.vlan).tone, on: (i === 0 ? 0.45 + 0.55 * pick : 0.45) * (p.vlan === 10 ? 1 : 1 - 0.6 * pick) }))} />
          </div>
          <div style={{ position: 'absolute', left: B_X, top: SW_Y, opacity: 0.3 + 0.7 * bOn }}>
            <Switch width={SW_W} height={SW_H} glow={0.5 * bOn} ports={FLOOR_B.map((p) => ({ tone: vlan(p.vlan).tone, on: 0.45 }))} />
          </div>

          {/* «enlace troncal · IEEE 802.1Q» */}
          {frame >= trunkLabelAt - 2 ? (
            <div style={{ position: 'absolute', left: PIPE.x, top: TRUNK_LABEL_Y, width: PIPE.w, display: 'flex', justifyContent: 'center', ...enter(frame, trunkLabelAt, { distance: 14 }) }}>
              <Rotulo tone={C.sky} size={38} icon="link" on={trunkLive}>
                {LABELS.trunk}
              </Rotulo>
            </div>
          ) : null}

          {/* the tag of the first frame, opened */}
          {frame >= vidAt - 6 ? (
            <>
              <svg width={W} height={STAGE.height} viewBox={`0 0 ${W} ${STAGE.height}`} style={{ position: 'absolute', left: 0, top: 0, opacity: open.opacity }}>
                <polygon
                  points={`${PIPE.x + slotX(0) + 58},${PIPE.y + TFR_Y + TFR.h + 8} ${PIPE.x + slotX(0) + 108},${PIPE.y + TFR_Y + TFR.h + 8} ${OPEN.x + OPEN.w - 20},${OPEN.y} ${OPEN.x + 20},${OPEN.y}`}
                  fill={alpha(first, 0.1)}
                  stroke={alpha(first, 0.45)}
                  strokeWidth={2}
                  strokeDasharray="10 8"
                />
              </svg>
              <div style={{ position: 'absolute', left: OPEN.x, top: OPEN.y, height: OPEN_TAG_H, ...open }}>
                <OpenTag width={OPEN.w} tone={first} fieldOn={[0, 1, 2, 3].map((i) => progress(frame, vidAt + 2 + i * 6, 12))} keyOn={keyOn} />
              </div>
            </>
          ) : null}
        </div>
      ) : null}

      {/* ------------------------------------------------ beat 3: the mail room (art) */}
      {frame >= mailAt - 8 ? (
        <div style={{ position: 'absolute', left: PLATE.x, top: PLATE.y, ...plateIn }}>
          <ClipPlate
            src={ART_MAIL}
            width={PLATE.w}
            height={PLATE.h}
            mono
            zoom={{ to: 1.03, start: mailAt, end: liftAt }}
            // The clip deforms the pile from its first frames (a long dissolve in shows as ghosting); its last frames
            // lack the tilted envelope of the end still, so the way out is long.
            clip={{ src: CLIP_LIFT.src, endSrc: ART_MAIL_END, at: liftAt, frames: CLIP_LIFT.frames, fadeIn: 3, fadeOut: 22 }}
            overlay={
              <div style={{ position: 'absolute', left: 14, top: 14 }}>
                <ImageTag />
              </div>
            }
          >
            {deskLive > 0.01 ? <Region box={REGION_DESK} style={{ borderRadius: 22, border: `5px dashed ${alpha(C.text, 0.9 * deskLive)}`, background: alpha(C.text, 0.05 * deskLive) }} /> : null}
            {lift > 0.01 ? <Region box={REGION_LIFT} style={{ borderRadius: 22, border: `5px dashed ${alpha(C.text, 0.9 * lift)}` }} /> : null}
            {artTray > 0.01 ? <Region box={REGION_TRAY} style={{ borderRadius: 22, border: `5px dashed ${alpha(C.text, 0.9 * artTray)}`, background: alpha(C.text, 0.06 * artTray) }} /> : null}
          </ClipPlate>
        </div>
      ) : null}

      {/* the analogy, read back in the course's words */}
      {frame >= deskAt - 2 && rowsOut > 0.01 ? (
        <div style={{ position: 'absolute', left: COL.x, top: ROW_Y[0], opacity: rowsOut }}>
          <div style={enter(frame, deskAt, { distance: 16 })}>
            <FrameGlyph width={FR.w} height={FR.h} tone={vlan(10).tone} glow={0.5 * deskLive} />
            <div style={{ height: 14 }} />
            <Lines lines={[LABELS.accessShort, LABELS.untagged]} tone={C.sky} width={COL.w} on={deskLive} size={36} />
          </div>
        </div>
      ) : null}
      {frame >= liftAt - 2 && rowsOut > 0.01 ? (
        <div style={{ position: 'absolute', left: COL.x, top: ROW_Y[1], opacity: rowsOut }}>
          <div style={enter(frame, liftAt, { distance: 16 })}>
            <div style={{ display: 'flex', gap: 20 }}>
              {TRUNK_FRAMES.slice(0, 3).map((id) => (
                <FrameGlyph key={id} width={FR.w} height={FR.h} tone={vlan(id).tone} glow={0.4} tag={{ label: String(id), tone: vlan(id).tone }} />
              ))}
            </div>
            <div style={{ height: 14 }} />
            <Lines lines={[LABELS.trunkShort, LABELS.tagged]} tone={C.sky} width={COL.w} on={clamp01(lift)} size={36} />
          </div>
        </div>
      ) : null}

      {/* a frame without a tag arrives on the trunk and drops into the tray that port has assigned */}
      {frame >= nativeAt - 2 ? (
        <>
          <div style={{ position: 'absolute', left: COL.x, top: N_PIPE.y, opacity: progress(frame, nativeAt, 14) }}>
            <TrunkPipe width={COL.w} height={N_PIPE.h} tones={TRUNK_FRAMES.map((id) => vlan(id).tone)} lanes={1} />
          </div>
          {frame >= trayInAt - 2 ? (
            <div style={{ position: 'absolute', left: TRAY.x, top: TRAY.y, ...enter(frame, trayInAt, { distance: 16 }) }}>
              <Tray
                width={TRAY.w}
                height={TRAY.h}
                tone={NATIVE.tone}
                on={landed * (1 - 0.6 * progress(frame, fallAt + 60, 30, EASE.inOut))}
                label={frame >= n999At ? <span style={{ opacity: progress(frame, n999At, 12) }}>{NATIVE.id}</span> : undefined}
              />
            </div>
          ) : null}
          {stray > 0.005 ? (
            <div style={{ position: 'absolute', left: mix(W - FR.w, N_FRAME_X, stray), top: mix(N_FRAME_Y, TRAY.y + 14, fall), opacity: progress(frame, strayAt, 8) }}>
              <FrameGlyph width={FR.w} height={FR.h} tone={C.text} glow={0.7 * (1 - 0.6 * landed)} />
            </div>
          ) : null}
          {frame >= strayLabelAt - 2 ? (
            <div style={{ position: 'absolute', left: COL.x, top: N_PIPE.y + N_PIPE.h + 14, ...enter(frame, strayLabelAt, { distance: 12 }) }}>
              <Rotulo tone={C.text} size={34} on={strayLive}>
                {LABELS.untagged}
              </Rotulo>
            </div>
          ) : null}
          {frame >= nativeLabelAt - 2 ? (
            <div style={{ position: 'absolute', left: COL.x, top: N_LABEL_Y, ...enter(frame, nativeLabelAt, { distance: 16 }) }}>
              <Lines lines={LABELS.native} tone={C.text} width={COL.w} on={nativeLive} />
            </div>
          ) : null}
          {frame >= n999At + 2 ? (
            <div style={{ position: 'absolute', left: COL.x, top: N999_Y, ...enter(frame, n999At + 4, { distance: 16 }) }}>
              <Lines lines={[`${nativeParts[0]} · ${nativeParts[1]}`, nativeParts[2]]} tone={NATIVE.tone} width={COL.w} on={n999Live} headSize={38} size={34} />
            </div>
          ) : null}
        </>
      ) : null}
    </Stage>
  );
}
