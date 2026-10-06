import type { CSSProperties } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Chip, clamp01, mix, windowWeight } from '../../../engine/src/ui';
import { ATTRIB_CHIP, COL_ATTRIB, COL_GROUP, DOOR_CAPTION, PDB_PATH } from '../data/s07-nombre';
import { GROUP_RECT, GroupedFilms } from './parts/s06-grupo/GroupedFilms';
import { WorkshopDoor, workshopDoorPoint } from './parts/s07-nombre/WorkshopDoor';
import { TrapBox, trapBoxHeight, trapBoxLabelSlot, trapBoxPoint } from './parts/TrapBox';
import { WorkshopLabel } from './parts/WorkshopLabel';
import { Stage, segment, wordFrame } from './kit';

const S = 's07-nombre';
const W = 1728;

/** Left column: the group (the s06 composite), re-laid out smaller. `y` while the door is alone, then with the text. */
const COL_L = { x: 0, w: 824 } as const;
const MINI = { x: 8, w: 816, h: 300, nameSize: 36, yAlone: 172, yCols: 30 } as const;

/** Right column: the workshop (door, two boxes, caption) as one 820×372 block. */
const COL_R = { x: 908, w: 820 } as const;
const SHOP = { yAlone: 144, yCols: 16, h: 372 } as const;
const DOOR = { w: 360, x: (COL_R.w - 360) / 2, top: 0 } as const;
const GROUND_Y = DOOR.top + workshopDoorPoint(DOOR.w, 'threshold').y - 4;
const BOX_W = 214;
const BOX_H = trapBoxHeight(BOX_W);
const BOX_TOP = GROUND_Y - trapBoxPoint(BOX_W, 'base').y;
const BOXES = [
  { key: 'meridian', label: 'Meridian', color: C.cyan, x: 6, wrapper: 'cv' },
  { key: 'orbital', label: 'Orbital', color: C.cyanSoft, x: COL_R.w - 6 - BOX_W, wrapper: 'order' },
] as const;
const CAPTION_Y = BOX_TOP + BOX_H + 54;

/** The two columns' text (`two-cols`), centred under the two images. */
const TEXT_Y = 434;
const NEQ = { x: (COL_L.x + COL_L.w + COL_R.x) / 2, y: TEXT_Y + 31 } as const;

/**
 * s07-nombre «Un grupo no es un nombre». GLASS VIPER's card owns the top centre from the scene's start to the end of
 * s07-01, so the group stays low, exactly where s06 left it (GROUP_RECT). `reply-iii`: the frame breathes — nothing
 * on it says who. `blank`: its blank tag swings in, «sin nombre». `plate`: the group moves to the left column; on the
 * right, the workshop door with no plate and, on either side, the two boxes (Meridian's, Orbital's) with the same
 * workshop label inside, a dashed cyan line from each back to the same door on «taller»: «mismo taller»; the empty
 * plate spot is outlined on «placa»: «· ¿de quién?». `two-cols`: both images rise and the columns' text comes in under
 * them — «agrupar: qué intrusiones van juntas» | «atribuir: quién está detrás · pide otras pruebas» (on «atribuir»).
 * `attribution`: a drawn «no es igual» between the columns and the chip «S4: niveles de atribución». `wrap-iii`:
 * «agrupar» stays in focus, «atribuir» steps back (still unknown). Last frame: the two columns, for s08's wipe.
 */
export function S07Nombre(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const replyAt = props.cue('reply-iii');
  const blankAt = props.cue('blank');
  const plateAt = props.cue('plate');
  const colsAt = props.cue('two-cols');
  const attrAt = props.cue('attribution');
  const wrapAt = props.cue('wrap-iii');
  const s01 = segment(props, 's07-01');
  const tallerAt = wordFrame(S, 's07-02', 'taller');
  const placaAt = wordFrame(S, 's07-02', 'placa');
  const atribuirAt = wordFrame(S, 's07-03', 'atribuir');
  const nivelesAt = wordFrame(S, 's07-04', 'niveles');

  // ---- The group: low while the intercept is up, then to the left column, then up with the text ----------------
  // The move starts once the intercept card has gone (it stays until s07-01 ends).
  const moveAt = Math.max(plateAt, s01.to) + 2;
  const mv = progress(frame, moveAt, 26, EASE.inOut);
  const up = progress(frame, colsAt - 4, 22, EASE.inOut);
  const gx = mix(GROUP_RECT.x, MINI.x, mv);
  const gy = mix(GROUP_RECT.y, mix(MINI.yAlone, MINI.yCols, up), mv);
  const gw = mix(GROUP_RECT.w, MINI.w, mv);
  const gh = mix(GROUP_RECT.h, MINI.h, mv);
  const gName = mix(46, MINI.nameSize, mv);
  const gLabel = mix(32, 26, mv);
  const tagIn = springIn(frame, fps, blankAt - 2, { damping: 11, mass: 0.7 });
  const tagFocus = windowWeight(frame, blankAt, plateAt, { ramp: 10 });
  const breathe = windowWeight(frame, replyAt + 6, blankAt + 6, { ramp: 14 }) * (0.5 + 0.5 * pulse(frame, fps, 0.5));
  const marksOut = progress(frame, moveAt, 14);

  // ---- The workshop: the door, the two boxes from the same door, the caption ---------------------------------
  const doorIn = progress(frame, moveAt + 10, 18);
  const boxesIn = [progress(frame, moveAt + 18, 16), progress(frame, moveAt + 26, 16)];
  const sameShop = progress(frame, tallerAt - 4, 22, EASE.inOut);
  const plateFocus = windowWeight(frame, placaAt - 6, colsAt + 40, { ramp: 12 });
  const captionA = enter(frame, tallerAt + 10, { distance: 14 });
  const captionB = enter(frame, placaAt + 4, { distance: 14 });
  const shopY = mix(SHOP.yAlone, SHOP.yCols, up);

  // ---- Two columns, «no es igual», the chip, the wrap ------------------------------------------------------------
  const colL = enter(frame, colsAt + 6, { distance: 18 });
  const colR = enter(frame, atribuirAt - 2, { distance: 18 });
  const neq = progress(frame, attrAt + 4, 18, EASE.inOut);
  const chip = enter(frame, nivelesAt - 4, { distance: 14 });
  const wrap = progress(frame, wrapAt + 6, 22, EASE.inOut);
  const beat = 0.75 + 0.25 * pulse(frame, fps, 0.5);

  return (
    <Stage>
      {/* Left column: the group, blank tag on its frame */}
      <div
        style={{
          position: 'absolute',
          left: gx,
          top: gy,
          transform: `scale(${1 + 0.02 * wrap})`,
          transformOrigin: 'center top',
        }}
      >
        <GroupedFilms
          width={gw}
          height={gh}
          nameSize={gName}
          labelSize={gLabel}
          draw={1}
          name={1}
          candidate={1}
          tag={tagIn}
          tagFocus={tagFocus * beat}
          glow={Math.max(breathe * 0.8, wrap * 0.7)}
          glowTone={wrap > 0.05 ? C.cyan : C.text}
          films={1}
          link={1 - marksOut}
          marks={1 - marksOut}
          marksRoom={1 - mv}
        />
      </div>

      {/* Right column: the workshop door with no plate, the two boxes from the same door */}
      {doorIn > 0.01 ? (
        <div style={{ position: 'absolute', left: COL_R.x, top: shopY, width: COL_R.w, height: SHOP.h, ...stepBack(wrap * 0.6) }}>
          <div style={{ position: 'absolute', left: DOOR.x, top: DOOR.top }}>
            <WorkshopDoor width={DOOR.w} show={doorIn} plateFocus={plateFocus} />
          </div>
          <svg width={COL_R.w} height={SHOP.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {BOXES.map((b, k) => {
              const foot = workshopDoorPoint(DOOR.w, k === 0 ? 'leftFoot' : 'rightFoot');
              const fx = DOOR.x + foot.x;
              const fy = DOOR.top + foot.y - 26;
              const bx = k === 0 ? b.x + BOX_W - 26 : b.x + 26;
              const by = BOX_TOP + trapBoxPoint(BOX_W, 'front').y;
              const dx = k === 0 ? -1 : 1;
              const d = `M ${fx} ${fy} C ${fx + dx * 34} ${fy - 4}, ${bx - dx * 30} ${by - 26}, ${bx} ${by}`;
              return (
                <path
                  key={b.key}
                  d={d}
                  fill="none"
                  stroke={C.cyan}
                  strokeWidth={4}
                  strokeLinecap="round"
                  strokeDasharray="10 9"
                  opacity={sameShop * 0.95}
                  style={{ filter: `drop-shadow(0 0 6px ${alpha(C.cyan, 0.45)})` }}
                />
              );
            })}
          </svg>
          {BOXES.map((b, k) => {
            const slot = trapBoxLabelSlot(BOX_W, 1);
            return (
              <div key={b.key} style={{ position: 'absolute', left: b.x, top: BOX_TOP }}>
                {/* The same box as s04/s05: its victim's wrapper, the device up and lit, the workshop label on it */}
                <TrapBox width={BOX_W} show={boxesIn[k]} open={1} device={1} lit={1} wrapper={b.wrapper}>
                  <WorkshopLabel width={slot.w * 1.2} path={PDB_PATH} glow={sameShop * 0.7} />
                </TrapBox>
                <div
                  style={{
                    position: 'absolute',
                    left: -30,
                    top: BOX_H + 2,
                    width: BOX_W + 60,
                    textAlign: 'center',
                    fontFamily: FONT.sans,
                    fontSize: 32,
                    fontWeight: 800,
                    color: b.color,
                    opacity: boxesIn[k],
                  }}
                >
                  {b.label}
                </div>
              </div>
            );
          })}
          {/* «mismo taller · ¿de quién?» */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: CAPTION_Y,
              width: COL_R.w,
              display: 'flex',
              justifyContent: 'center',
              gap: 16,
              fontFamily: FONT.sans,
              fontSize: 46,
              fontWeight: 800,
              lineHeight: 1,
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ color: C.textStrong, ...captionA }}>{DOOR_CAPTION.same}</span>
            <span style={{ color: C.muted, ...captionB }}>·</span>
            <span style={{ color: '#fecdd3', ...captionB }}>{DOOR_CAPTION.who}</span>
          </div>
        </div>
      ) : null}

      {/* The two columns */}
      <ColumnText
        x={COL_L.x}
        w={COL_L.w}
        head={COL_GROUP.head}
        body={COL_GROUP.body}
        headColor={C.cyan}
        style={{ ...colL, transform: `${colL.transform} scale(${1 + 0.04 * wrap})` }}
      />
      <ColumnText
        x={COL_R.x}
        w={COL_R.w}
        head={COL_ATTRIB.head}
        body={COL_ATTRIB.body}
        headColor={C.textStrong}
        style={{ ...colR, ...stepBack(wrap * 0.6, colR.opacity) }}
      />

      {/* «Agrupar no es atribuir»: a drawn not-equal sign between the columns */}
      {neq > 0.01 ? (
        <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <g transform={`translate(${NEQ.x} ${NEQ.y})`} opacity={Math.min(1, neq * 1.4)}>
            <line x1={-26 * neq} y1={-12} x2={26 * neq} y2={-12} stroke={C.textStrong} strokeWidth={8} strokeLinecap="round" />
            <line x1={-26 * neq} y1={12} x2={26 * neq} y2={12} stroke={C.textStrong} strokeWidth={8} strokeLinecap="round" />
            <line
              x1={-14}
              y1={32}
              x2={-14 + 28 * clamp01((neq - 0.4) / 0.6)}
              y2={32 - 64 * clamp01((neq - 0.4) / 0.6)}
              stroke={C.rose}
              strokeWidth={8}
              strokeLinecap="round"
            />
          </g>
        </svg>
      ) : null}

      {/* «S4: niveles de atribución» */}
      {chip.opacity > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: COL_R.x,
            top: TEXT_Y + 150,
            width: COL_R.w,
            display: 'flex',
            justifyContent: 'center',
            ...chip,
            ...stepBack(wrap * 0.4, chip.opacity),
          }}
        >
          <Chip accent="violet" icon="mortarboard" size={34}>
            {ATTRIB_CHIP}
          </Chip>
        </div>
      ) : null}
    </Stage>
  );
}

/** Opacity + desaturation for a column that steps back. */
function stepBack(d: number, base = 1): CSSProperties {
  const k = clamp01(d);
  return { opacity: base * (1 - 0.55 * k), filter: k > 0.01 ? `saturate(${1 - 0.5 * k})` : undefined };
}

/** «head:» over one body line, centred in its column. */
function ColumnText({ x, w, head, body, headColor, style }: { x: number; w: number; head: string; body: string; headColor: string; style?: CSSProperties }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: TEXT_Y,
        width: w,
        textAlign: 'center',
        fontFamily: FONT.sans,
        transformOrigin: 'center top',
        ...style,
      }}
    >
      <div style={{ fontSize: 58, fontWeight: 850, color: headColor, letterSpacing: -1, lineHeight: 1.05 }}>{head}</div>
      <div style={{ marginTop: 12, fontSize: 42, fontWeight: 650, color: C.text, lineHeight: 1.2, whiteSpace: 'nowrap' }}>{body}</div>
    </div>
  );
}
