import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { clamp01, mix } from '../../../engine/src/ui';
import { ART_FLOOR, ART_WALLS, ASK_FROM, CLIP_WALLS, LABELLED_PORT, LABELS, PORTS, SOURCE_PORT } from '../data/s02-difusion';
import { VLANS, vlan } from '../data/vlans';
import { ART_H, ART_W, ClipPlate, Region } from './parts/Illustration';
import { Device, FrameGlyph, Switch, switchPortX } from './parts/Net';
import { ImageTag, Rotulo } from './parts/Tags';
import { VLAN_ROW_H, VlanRow } from './parts/VlanRow';
import { Stage, wordFrame } from './kit';

const S = 's02-difusion';
const W = STAGE.width;
const N = PORTS.length;

// ---- The switch diagram, in its own coordinates (GW wide). It starts centred and glides left on `floor`.
const GW = 800;
const GX0 = Math.round((W - GW) / 2);
const SW = { x: 20, y: 58, w: 760, h: 92 } as const;
const LANE = { top: SW.y + SW.h + 4, bottom: 328, w: 98 } as const;
const DEV = { size: 64, y: 334 } as const;
const LABEL_Y = [420, 482] as const;
const ROW_Y0 = 416;
const ROW_PITCH = 60;
const laneX = (i: number) => SW.x + switchPortX(i, N, SW.w);
const FRAME = { w: 64, h: 26 } as const;
/** The frame's rest points: on its device, and inside the switch. */
const FRAME_Y_DEV = DEV.y - FRAME.h - 6;
const FRAME_Y_SW = SW.y + SW.h + 10;

// ---- The floor image, on the right from `floor`, and the two labels under it.
const PLATE = { x: 860, y: 20, w: 868, h: 484 } as const;
const UNDER_Y = [522, 586] as const;

/**
 * s02-difusion «Una pregunta en voz alta». Left, drawn in code: a switch seen from the front; each port («puerto»)
 * gets its own lane down to a device (`port`), and each lane is outlined as a collision domain (`collision`). One
 * device sends a broadcast frame up its lane (`shout`, «difusión · destino ff:ff:ff:ff:ff:ff») and the switch sends a
 * copy down every other lane (`flood`). Right, from `floor`: the open-plan floor (art, tagged «imagen · no es el
 * Consorcio»); a question asked aloud spreads over it, the area it reaches is named «dominio de difusión»
 * (`broadcast`), and on `walls` the partitions rise (the clip, then its last still held): «VLAN · por configuración».
 * On `four` the switch's ports take the colours of the headquarters' four VLANs and the list with their subnets
 * replaces the two labels under the switch.
 */
export function S02Difusion(props: SceneProps) {
  const frame = useCurrentFrame();
  const portAt = props.cue('port');
  const collisionAt = props.cue('collision');
  const shoutAt = props.cue('shout');
  const floodAt = props.cue('flood');
  const floorAt = props.cue('floor');
  const broadcastAt = props.cue('broadcast');
  const wallsAt = props.cue('walls');
  const fourAt = props.cue('four');
  const lanesAt = wordFrame(S, 's02-01', 'bocas') - 4;
  const portLabelAt = wordFrame(S, 's02-01', 'puerto') - 4;
  const shoutLabelAt = wordFrame(S, 's02-03', 'todos') - 6;
  const climbAt = wordFrame(S, 's02-03', 'pregunta') - 4;
  const askAt = wordFrame(S, 's02-04', 'alguien') - 2;
  const heardAt = wordFrame(S, 's02-04', 'oyen') - 2;
  const domainAt = wordFrame(S, 's02-05', 'dominio') - 6;
  const rowsAt = wordFrame(S, 's02-06', 'cuatro') - 6;

  // ---- The diagram glides left to make room for the image.
  const glide = progress(frame, floorAt - 26, 30, EASE.inOut);
  const gx = mix(GX0, 0, glide);
  const diagramIn = enter(frame, Math.min(0, portAt - 12), { distance: 20, duration: 18 });

  // ---- VLAN colours arrive on `four`: the neutral tone dips out and the VLAN's comes in.
  const four = progress(frame, fourAt - 4, 24, EASE.inOut);
  const tint = Math.abs(2 * four - 1);
  const toneOf = (i: number) => (four >= 0.5 ? vlan(PORTS[i].vlan).tone : C.sky);

  // ---- Lanes, collision outlines.
  const laneIn = PORTS.map((_, i) => progress(frame, lanesAt + i * 4, 14));
  const outline = PORTS.map((_, i) => progress(frame, collisionAt + i * 5, 12));
  const collisionLive = progress(frame, collisionAt, 10) * (1 - 0.6 * progress(frame, shoutAt - 6, 14, EASE.inOut));

  // ---- The broadcast frame: up the source lane, then one copy down each of the others.
  const born = progress(frame, shoutAt + 4, 10);
  const climb = progress(frame, climbAt, 36, EASE.inOut);
  const flood = progress(frame, floodAt + 4, 34, EASE.inOut);
  const landed = progress(frame, floodAt + 34, 10);
  const frameGone = progress(frame, floodAt + 40, 14, EASE.inOut);
  const afterGlow = 1 - 0.65 * progress(frame, floodAt + 70, 40, EASE.inOut);
  const shoutLive = progress(frame, shoutLabelAt, 10) * (1 - 0.6 * progress(frame, floorAt - 6, 14, EASE.inOut));

  // ---- The two labels under the switch give way to the VLAN list: label k leaves as row k comes in over it, so
  // the column is never empty.
  const labelOut = [0, 1].map((k) => 1 - progress(frame, rowsAt + k * 8 + 1, 7, EASE.inOut));

  // ---- The image.
  const plateIn = enter(frame, floorAt - 6, { distance: 30, duration: 20, axis: 'x' });
  const rings = frame >= askAt ? 1 - progress(frame, wallsAt - 16, 12, EASE.inOut) : 0;
  const heard = progress(frame, heardAt, 14);
  // The reach of the question is outlined on «hasta donde llega» (`broadcast`); its name lands on «dominio».
  const domain = progress(frame, broadcastAt + 4, 20) * (1 - progress(frame, wallsAt - 12, 10, EASE.inOut));
  const domainLabel = enter(frame, domainAt, { distance: 14 });
  const wallsLabel = enter(frame, wallsAt + 8, { distance: 14 });
  const domainLive = progress(frame, domainAt, 10) * (1 - 0.6 * progress(frame, wallsAt, 14, EASE.inOut));
  const wallsLive = progress(frame, wallsAt + 8, 10) * (1 - 0.6 * progress(frame, fourAt - 6, 14, EASE.inOut));
  const plateDim = 0.3 * progress(frame, fourAt, 20, EASE.inOut);

  return (
    <Stage>
      {/* ------------------------------------------------ the switch diagram (code) */}
      <div style={{ position: 'absolute', left: gx, top: 0, width: GW, height: STAGE.height, ...diagramIn }}>
        {/* lanes */}
        {PORTS.map((_, i) => {
          const tone = toneOf(i);
          const o = laneIn[i];
          if (o < 0.01) return null;
          const lit = outline[i];
          const x = laneX(i);
          const h = (LANE.bottom - LANE.top) * o;
          return (
            <div key={`lane-${i}`}>
              <div
                style={{
                  position: 'absolute',
                  left: x - LANE.w / 2,
                  top: LANE.top,
                  width: LANE.w,
                  height: h,
                  boxSizing: 'border-box',
                  borderRadius: 12,
                  border: `3px ${i === SOURCE_PORT && flood > 0.02 && four < 0.5 ? 'dashed' : 'solid'} ${alpha(tone, (0.22 + 0.6 * lit) * tint)}`,
                  background: alpha(tone, (0.05 + 0.07 * lit) * tint),
                }}
              />
              {/* the cable */}
              <div style={{ position: 'absolute', left: x - 2, top: LANE.top + 4, width: 4, height: Math.max(0, h - 8), borderRadius: 2, background: alpha(tone, 0.5 * tint) }} />
            </div>
          );
        })}

        {/* devices */}
        {PORTS.map((p, i) => {
          const o = progress(frame, lanesAt + i * 4 + 8, 12);
          if (o < 0.01) return null;
          const got = i === SOURCE_PORT ? born * (1 - 0.6 * climb) : landed * afterGlow;
          return (
            <div key={`dev-${i}`} style={{ position: 'absolute', left: laneX(i) - DEV.size / 2, top: DEV.y, opacity: o * (0.35 + 0.65 * tint) }}>
              <Device icon={four >= 0.5 ? p.icon : 'desktop'} tone={toneOf(i)} size={DEV.size} on={four > 0.02 ? 0.35 * four : got} />
            </div>
          );
        })}

        {/* the switch */}
        <div style={{ position: 'absolute', left: SW.x, top: SW.y }}>
          <Switch
            width={SW.w}
            height={SW.h}
            glow={progress(frame, portAt, 20) * 0.6}
            ports={PORTS.map((_, i) => ({ tone: toneOf(i), on: (0.25 + 0.5 * laneIn[i] + 0.25 * (i === SOURCE_PORT ? climb : flood) * (1 - four)) * (0.3 + 0.7 * tint) }))}
          />
        </div>

        {/* «puerto» */}
        {frame >= portLabelAt - 2 ? (
          <div style={{ position: 'absolute', left: laneX(LABELLED_PORT) - 200, top: 0, width: 400, display: 'flex', justifyContent: 'center', ...enter(frame, portLabelAt, { distance: 12 }) }}>
            <Rotulo tone={C.sky} size={32} on={progress(frame, portLabelAt, 10) * (1 - progress(frame, collisionAt - 6, 14, EASE.inOut))}>
              {LABELS.port}
            </Rotulo>
          </div>
        ) : null}
        {frame >= portLabelAt ? (
          <div style={{ position: 'absolute', left: laneX(LABELLED_PORT) - 2, top: 50, width: 4, height: SW.y + 36 - 50, borderRadius: 2, background: alpha(C.sky, 0.9 * progress(frame, portLabelAt + 4, 10)) }} />
        ) : null}

        {/* the broadcast frame: climbing, then its copies going down */}
        {born > 0.01 && flood < 0.02 ? (
          <div style={{ position: 'absolute', left: laneX(SOURCE_PORT) - FRAME.w / 2, top: mix(FRAME_Y_DEV, FRAME_Y_SW, climb), opacity: born }}>
            <FrameGlyph width={FRAME.w} height={FRAME.h} tone={C.cyanSoft} glow={0.8} />
          </div>
        ) : null}
        {flood >= 0.02 && frameGone < 0.99
          ? PORTS.map((_, i) =>
              i === SOURCE_PORT ? null : (
                <div key={`copy-${i}`} style={{ position: 'absolute', left: laneX(i) - FRAME.w / 2, top: mix(FRAME_Y_SW, FRAME_Y_DEV, flood), opacity: 1 - frameGone }}>
                  <FrameGlyph width={FRAME.w} height={FRAME.h} tone={C.cyanSoft} glow={0.8} />
                </div>
              ),
            )
          : null}
        {/* the entry port gets nothing back */}
        {flood > 0.02 && four < 0.5 ? (
          <div
            style={{
              position: 'absolute',
              left: laneX(SOURCE_PORT) - LANE.w / 2,
              top: LANE.top + 62,
              width: LANE.w,
              textAlign: 'center',
              fontFamily: FONT.sans,
              fontSize: 22,
              fontWeight: 750,
              color: C.text,
              opacity: progress(frame, floodAt + 6, 12) * tint,
            }}
          >
            <span style={{ background: C.ink950, padding: '2px 6px', borderRadius: 6 }}>{LABELS.entry}</span>
          </div>
        ) : null}

        {/* labels under the switch */}
        {frame >= collisionAt - 2 && labelOut[0] > 0.01 ? (
          <div style={{ position: 'absolute', left: SW.x, top: LABEL_Y[0], opacity: labelOut[0] }}>
            <div style={enter(frame, collisionAt, { distance: 14 })}>
              <Rotulo tone={C.sky} size={34} icon="split" on={collisionLive}>
                {LABELS.collision}
              </Rotulo>
            </div>
          </div>
        ) : null}
        {frame >= shoutLabelAt - 2 && labelOut[1] > 0.01 ? (
          <div style={{ position: 'absolute', left: SW.x, top: LABEL_Y[1], opacity: labelOut[1] }}>
            <div style={enter(frame, shoutLabelAt, { distance: 14 })}>
              <Rotulo tone={C.cyan} size={34} icon="radar" on={shoutLive}>
                <span>{LABELS.shout}</span>
                <span style={{ fontFamily: FONT.mono, fontWeight: 700, color: C.cyanSoft }}>{LABELS.broadcastMac}</span>
              </Rotulo>
            </div>
          </div>
        ) : null}

        {/* the four VLANs with devices, each with its subnet */}
        {VLANS.map((v, k) => {
          const at = rowsAt + k * 8;
          if (frame < at - 2) return null;
          return (
            <div key={v.id} style={{ position: 'absolute', left: SW.x, top: ROW_Y0 + k * ROW_PITCH, height: VLAN_ROW_H, ...enter(frame, at, { distance: 16 }) }}>
              <VlanRow v={v} width={SW.w} on={progress(frame, at, 10) * (1 - progress(frame, at + 40, 20, EASE.inOut))} />
            </div>
          );
        })}
      </div>

      {/* ------------------------------------------------ the floor (art) */}
      {frame >= floorAt - 8 ? (
        <div style={{ position: 'absolute', left: PLATE.x, top: PLATE.y, ...plateIn }}>
          <ClipPlate
            src={ART_FLOOR}
            width={PLATE.w}
            height={PLATE.h}
            zoom={{ to: 1.04, start: floorAt, end: wallsAt }}
            clip={{ src: CLIP_WALLS.src, endSrc: ART_WALLS, at: wallsAt, frames: CLIP_WALLS.frames }}
            dim={plateDim}
            overlay={
              <div style={{ position: 'absolute', left: 14, top: 14 }}>
                <ImageTag />
              </div>
            }
          >
            {/* everyone hears it: a soft veil, then the reach of the question outlined */}
            {heard > 0.01 && domain < 0.99 && frame < wallsAt ? <Region box={[0, 0, 1, 1]} style={{ background: alpha(C.cyan, 0.07 * heard * rings) }} /> : null}
            {/* the question, asked aloud: rings on the floor plane (isometric: flattened) */}
            {rings > 0.01 ? (
              <svg viewBox={`0 0 ${ART_W} ${ART_H}`} preserveAspectRatio="none" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: rings }}>
                {[0, 1, 2, 3].map((k) => {
                  const period = 72;
                  const t = (((frame - askAt - k * (period / 4)) % period) + period) % period / period;
                  if (frame - askAt < k * (period / 4)) return null;
                  const rx = 80 + 2300 * t;
                  return <ellipse key={k} cx={ASK_FROM.u * ART_W} cy={ASK_FROM.v * ART_H} rx={rx} ry={rx * 0.58} fill="none" stroke={C.cyanSoft} strokeWidth={10} opacity={0.85 * (1 - t) ** 1.4} />;
                })}
                <circle cx={ASK_FROM.u * ART_W} cy={ASK_FROM.v * ART_H} r={26} fill={C.cyanSoft} opacity={0.9} />
              </svg>
            ) : null}
            {domain > 0.01 ? (
              <Region
                box={[0.05, 0.075, 0.95, 0.925]}
                style={{ borderRadius: 22, border: `5px dashed ${alpha(C.cyan, 0.95 * domain)}`, background: alpha(C.cyan, 0.1 * domain), boxShadow: `inset 0 0 60px ${alpha(C.cyan, 0.25 * domain)}` }}
              />
            ) : null}
          </ClipPlate>
        </div>
      ) : null}

      {/* labels under the image */}
      {frame >= domainAt - 2 ? (
        <div style={{ position: 'absolute', left: PLATE.x, top: UNDER_Y[0], ...domainLabel }}>
          <Rotulo tone={C.cyan} size={36} icon="radar" on={domainLive}>
            {LABELS.broadcast}
          </Rotulo>
        </div>
      ) : null}
      {frame >= wallsAt + 6 ? (
        <div style={{ position: 'absolute', left: PLATE.x, top: UNDER_Y[1], ...wallsLabel }}>
          <Rotulo tone={C.cyan} size={36} icon="gear" on={clamp01(wallsLive)}>
            {LABELS.walls}
          </Rotulo>
        </div>
      ) : null}
    </Stage>
  );
}
