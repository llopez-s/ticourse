import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { CAR_SCRAP, CAR_SELL, LATER, MAGNETIC, NEVER, NO_OVERWRITE, OVERWRITE, RECYCLER, SSD_TEASER, TERMS } from '../data/s06-retirada';
import { Car, CAR, Sheet } from './parts/Car';
import { HDD, HardDrive } from './parts/Drives';
import { Pill, Struck, TermPill } from './parts/Labels';
import { NAS, Nas, Shelf } from './parts/Nas';
import { ImageTag } from './parts/Tags';
import { Stage, wordFrame } from './kit';

const S = 's06-retirada';
const W = 1728;

// ---- Phase A: the shelf, the swap and the way out (stage-local).
const SHELF = { x: 40, y: 400, w: 300 } as const;
const NAS_W = 200;
const NAS_H = (NAS_W * NAS.h) / NAS.w;
const NAS_X = SHELF.x + 50;
const NAS_Y = SHELF.y - NAS_H;
const GESTOR = { x: 1240, y: 170, w: 488, h: 230 } as const;
// ---- Phase B: two drives, the paper (stage-local).
const MINI = { x: 520, y: 0, w: 120 } as const;
const DRIVE_W = 180;
const DRIVE_H = (DRIVE_W * HDD.h) / HDD.w;
const DRIVE_Y = 36;
const COL = [
  { x: 0, w: 560 },
  { x: 600, w: 560 },
] as const;
const DRIVE_X = COL.map((c) => c.x + (c.w - DRIVE_W) / 2);
const LABEL_TOP = DRIVE_Y + DRIVE_H + 18;
const NOTE_TOP = LABEL_TOP + 64;
const TERM_TOP = 470;
const PAPER = { x: 1200, y: 20, w: 528, h: 330 } as const;
const CERT_TERM_TOP = 372;
const NEVER_TOP = 466;
// ---- Phase C: the car card.
const CARD = { x: 144, y: 20, w: 1440, h: 540 } as const;
const TEASER_TOP = 584;

/** One row of the gestor's sheet: a drive glyph, its serial (an unreadable bar) and what was done (icon). */
function SheetRow({ y, done, tone, icon, show }: { y: number; done: number; tone: string; icon: 'check' | 'x'; show: number }) {
  return (
    <div style={{ position: 'absolute', left: 34, right: 34, top: y, height: 70, display: 'flex', alignItems: 'center', gap: 22, opacity: show }}>
      <svg width={44} height={56} viewBox="0 0 44 56">
        <rect x={2} y={2} width={40} height={52} rx={5} fill="#cfd8e6" stroke={alpha(C.ink900, 0.5)} strokeWidth={2} />
        <circle cx={22} cy={22} r={13} fill="none" stroke={alpha(C.ink900, 0.45)} strokeWidth={2} />
      </svg>
      <div style={{ flex: 1, height: 22, borderRadius: 4, background: alpha(C.ink900, 0.75) }} />
      <div style={{ width: 52, height: 52, borderRadius: 26, background: alpha(tone, 0.2), border: `3px solid ${tone}`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: done }}>
        <Icon name={icon} size={32} color={tone === C.emerald ? '#047857' : '#be123c'} strokeWidth={3} />
      </div>
    </div>
  );
}

/**
 * s06-retirada «Cuando el disco de red se jubila». «Más adelante · sin fecha». Phase A: on `replaced` a new network disk
 * takes the old one's place on the shelf; on `leaves` the old one travels to «un gestor autorizado» (no name). Phase B,
 * on `works`: the old disk opens and two magnetic drives come out of it. The one that works fills with the verified
 * overwrite on `overwrite` and is named «sanitization»; meanwhile «no valen:» strikes out three false wipes in a corner.
 * On `broken` the other cracks («no admite sobrescritura») and on `shred` it is cut into strips, «destruction». On
 * `paper` the gestor's sheet lists both drives (serials unreadable) and is named «certification». Phase C, on `car`:
 * the old car («imagen · no es del puerto»): it runs and passes the ITV, it gets sold; if not, the scrapyard, with its
 * certificate of destruction (on screen only). The last line announces question 3, on screen only.
 */
export function S06Retirada(props: SceneProps) {
  const frame = useCurrentFrame();
  const replacedAt = props.cue('replaced');
  const leavesAt = props.cue('leaves');
  const worksAt = props.cue('works');
  const overwriteAt = props.cue('overwrite');
  const brokenAt = props.cue('broken');
  const shredAt = props.cue('shred');
  const paperAt = props.cue('paper');
  const carAt = props.cue('car');
  const wipeEnd = wordFrame(S, 's06-02', 'comprueba');
  const sanitAt = wordFrame(S, 's06-02', 'sanitization') - 6;
  const triturAt = Math.max(shredAt + 4, wordFrame(S, 's06-03', 'tritura') - 6);
  const destAt = wordFrame(S, 's06-03', 'destruction') - 6;
  const hojaAt = Math.max(paperAt + 4, wordFrame(S, 's06-04', 'hoja') - 8);
  const serialAt = wordFrame(S, 's06-04', 'serie') - 6;
  const certAt = wordFrame(S, 's06-04', 'certification') - 6;
  const ruedaAt = wordFrame(S, 's06-05', 'rueda') - 6;
  const vendesAt = wordFrame(S, 's06-05', 'vendes');
  const siNoAt = wordFrame(S, 's06-05', 'si', 1) - 6;
  const teaserAt = vendesAt + 10;

  // ---- Phase A
  const tagIn = enter(frame, -6, { distance: 14, duration: 14 });
  const phaseAOut = progress(frame, worksAt - 12, 14, EASE.inOut);
  const swap = progress(frame, replacedAt, 18, EASE.inOut);
  const newIn = progress(frame, replacedAt + 6, 16, EASE.out);
  const travel = progress(frame, leavesAt, 34, EASE.inOut);
  const gestorIn = enter(frame, leavesAt - 8, { distance: 14, duration: 14 });
  const oldX = mix(mix(NAS_X, NAS_X + 300, swap), GESTOR.x + (GESTOR.w - 150) / 2, travel);
  const oldY = mix(NAS_Y, GESTOR.y + 30, travel);
  const oldW = mix(NAS_W, 150, travel);

  // ---- Phase B
  const phaseBIn = progress(frame, worksAt - 8, 14);
  const phaseBOut = progress(frame, carAt - 10, 14, EASE.inOut);
  const drivesOut = progress(frame, worksAt, 18, EASE.out);
  const wipe = progress(frame, overwriteAt, Math.max(20, wipeEnd - overwriteAt), EASE.inOut);
  const verified = progress(frame, wipeEnd + 6, 10);
  const crack = progress(frame, brokenAt + 4, 12);
  const shred = progress(frame, triturAt, 22, EASE.out);
  const focusA = 1 - 0.5 * progress(frame, brokenAt - 4, 14);
  const focusB = 0.55 + 0.45 * progress(frame, brokenAt - 4, 14);
  const paperIn = enter(frame, hojaAt, { distance: 18, duration: 16 });
  const neverAt = wipeEnd + 14;

  // ---- Phase C
  const cardIn = progress(frame, carAt - 4, 16);
  const sellOn = progress(frame, ruedaAt, 12);
  const scrapOn = progress(frame, siNoAt, 12);
  const crushed = progress(frame, siNoAt + 6, 18, EASE.inOut);
  const teaserIn = progress(frame, teaserAt, 14);

  return (
    <Stage>
      <div style={{ position: 'absolute', inset: 0, fontFamily: FONT.sans }}>
        {/* ---------- Phase A ---------- */}
        {phaseAOut < 0.99 ? (
          <div style={{ position: 'absolute', inset: 0, opacity: 1 - phaseAOut }}>
            <div style={{ position: 'absolute', left: 0, top: 0, ...tagIn }}>
              <Pill text={LATER} icon="clock" tone={C.cyan} size={30} height={52} weight={750} on={0.5} />
            </div>
            <div style={{ position: 'absolute', left: SHELF.x, top: SHELF.y }}>
              <Shelf width={SHELF.w} />
            </div>
            {newIn > 0.01 ? (
              <div style={{ position: 'absolute', left: NAS_X, top: NAS_Y - (1 - newIn) * 60, opacity: newIn }}>
                <Nas width={NAS_W} frame={frame} glow={newIn * (1 - progress(frame, leavesAt + 20, 20))} />
              </div>
            ) : null}
            {frame >= leavesAt - 10 ? (
              <>
                <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
                  <path
                    d={`M ${NAS_X + 300 + NAS_W / 2} ${NAS_Y - 12} Q ${(NAS_X + 300 + GESTOR.x) / 2 + 120} ${NAS_Y - 200} ${GESTOR.x - 16} ${GESTOR.y + 80}`}
                    fill="none"
                    stroke={alpha(C.muted, 0.6)}
                    strokeWidth={4}
                    strokeDasharray="12 10"
                    opacity={gestorIn.opacity}
                  />
                </svg>
                <div
                  style={{
                    position: 'absolute',
                    left: GESTOR.x,
                    top: GESTOR.y,
                    width: GESTOR.w,
                    height: GESTOR.h,
                    boxSizing: 'border-box',
                    borderRadius: RADIUS.lg,
                    border: `3px solid ${alpha(C.sky, 0.6)}`,
                    background: alpha(C.sky, 0.06),
                    ...gestorIn,
                  }}
                >
                  <div style={{ position: 'absolute', left: 24, bottom: 18, display: 'flex', alignItems: 'center', gap: 12, fontSize: 34, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>
                    <Icon name="archive" size={36} color={C.sky} />
                    {RECYCLER}
                  </div>
                </div>
              </>
            ) : null}
            <div style={{ position: 'absolute', left: oldX, top: oldY }}>
              <Nas width={oldW} frame={frame} running={1 - swap} tone={swap > 0.5 ? C.muted : C.cyan} />
            </div>
          </div>
        ) : null}

        {/* ---------- Phase B ---------- */}
        {phaseBIn > 0.01 && phaseBOut < 0.99 ? (
          <div style={{ position: 'absolute', inset: 0, opacity: phaseBIn * (1 - phaseBOut) }}>
            {/* the old disk, open, and where each drive came from */}
            <div style={{ position: 'absolute', left: MINI.x, top: MINI.y, opacity: 0.75 }}>
              <Nas width={MINI.w} frame={frame} running={0} open={1} tone={C.muted} />
            </div>
            <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              {DRIVE_X.map((x, i) => (
                <line
                  key={i}
                  x1={MINI.x + MINI.w / 2 + (i === 0 ? -20 : 20)}
                  y1={MINI.y + 80}
                  x2={mix(MINI.x + MINI.w / 2, x + (i === 0 ? DRIVE_W : 0), drivesOut)}
                  y2={mix(MINI.y + 80, DRIVE_Y + 50, drivesOut)}
                  stroke={alpha(C.muted, 0.5)}
                  strokeWidth={3}
                  strokeDasharray="8 8"
                />
              ))}
            </svg>

            {/* Drive A: works, overwritten, sanitization */}
            <div style={{ position: 'absolute', inset: 0, opacity: focusA }}>
              <div style={{ position: 'absolute', left: mix(MINI.x, DRIVE_X[0], drivesOut), top: DRIVE_Y, opacity: drivesOut }}>
                <HardDrive id="s06-a" width={DRIVE_W} wipe={wipe} tone={verified > 0.5 ? C.emerald : alpha(C.sky, 0.8)} />
              </div>
              {verified > 0.01 ? (
                <div style={{ position: 'absolute', left: DRIVE_X[0] + DRIVE_W - 30, top: DRIVE_Y - 14, opacity: verified, transform: `scale(${0.7 + 0.3 * verified})` }}>
                  <div style={{ width: 54, height: 54, borderRadius: 27, background: C.emeraldDeep, border: `3px solid ${C.emerald}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="check" size={34} color={C.emerald} strokeWidth={3} />
                  </div>
                </div>
              ) : null}
              <div style={{ position: 'absolute', left: COL[0].x, top: LABEL_TOP, width: COL[0].w, display: 'flex', justifyContent: 'center', ...enter(frame, worksAt + 10, { distance: 10, duration: 12 }) }}>
                <Pill text={MAGNETIC} icon="record" tone={C.sky} size={30} height={50} on={0.4} />
              </div>
              {frame >= overwriteAt - 4 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: COL[0].x + 60,
                    top: NOTE_TOP,
                    width: COL[0].w - 120,
                    textAlign: 'center',
                    fontSize: 32,
                    fontWeight: 800,
                    lineHeight: 1.2,
                    color: C.textStrong,
                    ...enter(frame, overwriteAt, { distance: 10, duration: 12 }),
                  }}
                >
                  <div>{OVERWRITE[0]}</div>
                  <div style={{ color: verified > 0.5 ? C.emerald : C.text }}>{OVERWRITE[1]}</div>
                </div>
              ) : null}
              {frame >= sanitAt - 2 ? (
                <div style={{ position: 'absolute', left: COL[0].x, top: TERM_TOP, width: COL[0].w, display: 'flex', justifyContent: 'center', ...enter(frame, sanitAt, { distance: 12, duration: 12 }) }}>
                  <TermPill text={TERMS.sanitization} on={progress(frame, sanitAt, 12)} size={40} />
                </div>
              ) : null}
            </div>

            {/* Drive B: broken, shredded, destruction */}
            <div style={{ position: 'absolute', inset: 0, opacity: focusB }}>
              <div style={{ position: 'absolute', left: mix(MINI.x, DRIVE_X[1], drivesOut), top: DRIVE_Y, opacity: drivesOut }}>
                <HardDrive id="s06-b" width={DRIVE_W} broken={crack} shred={shred} tone={crack > 0.5 ? C.rose : alpha(C.sky, 0.8)} />
              </div>
              {shred > 0.01 ? (
                <svg width={DRIVE_W + 80} height={40} style={{ position: 'absolute', left: DRIVE_X[1] - 40, top: DRIVE_Y - 30, opacity: progress(frame, triturAt - 6, 8) }}>
                  <rect x={0} y={8} width={DRIVE_W + 80} height={24} rx={6} fill={C.ink700} stroke={C.rose} strokeWidth={3} />
                  {Array.from({ length: 13 }, (_, k) => (
                    <path key={k} d={`M ${10 + k * 19} 32 l 8 8 l 8 -8`} fill={C.rose} />
                  ))}
                </svg>
              ) : null}
              {frame >= brokenAt ? (
                <div style={{ position: 'absolute', left: COL[1].x, top: LABEL_TOP, width: COL[1].w, display: 'flex', justifyContent: 'center', opacity: progress(frame, brokenAt + 2, 12) * (1 - 0.6 * shred) }}>
                  <Pill text={MAGNETIC} icon="record" tone={C.sky} size={30} height={50} on={0.4} />
                </div>
              ) : null}
              {frame >= brokenAt + 6 ? (
                <div style={{ position: 'absolute', left: COL[1].x, top: NOTE_TOP + 10, width: COL[1].w, display: 'flex', justifyContent: 'center', ...enter(frame, brokenAt + 10, { distance: 10, duration: 12 }) }}>
                  <Pill text={NO_OVERWRITE} icon="x" tone={C.rose} size={30} height={52} on={0.7} />
                </div>
              ) : null}
              {frame >= destAt - 2 ? (
                <div style={{ position: 'absolute', left: COL[1].x, top: TERM_TOP, width: COL[1].w, display: 'flex', justifyContent: 'center', ...enter(frame, destAt, { distance: 12, duration: 12 }) }}>
                  <TermPill text={TERMS.destruction} on={progress(frame, destAt, 12)} size={40} />
                </div>
              ) : null}
            </div>

            {/* What never counts */}
            {frame >= neverAt - 4 ? (
              <div style={{ position: 'absolute', left: PAPER.x + 20, top: NEVER_TOP, ...enter(frame, neverAt, { distance: 12, duration: 12 }), opacity: progress(frame, neverAt, 12) * (1 - 0.35 * progress(frame, hojaAt, 14)) }}>
                <div style={{ fontSize: 32, fontWeight: 850, color: C.amber, marginBottom: 6 }}>{NEVER.head}</div>
                {NEVER.items.map((t, k) => (
                  <div key={t} style={{ height: 44 }}>
                    <Struck text={t} strike={progress(frame, neverAt + 10 + k * 10, 12)} size={30} />
                  </div>
                ))}
              </div>
            ) : null}

            {/* The gestor's sheet */}
            {frame >= hojaAt - 2 ? (
              <div
                style={{
                  position: 'absolute',
                  left: PAPER.x,
                  top: PAPER.y,
                  width: PAPER.w,
                  height: PAPER.h,
                  boxSizing: 'border-box',
                  borderRadius: 12,
                  background: '#e8edf5',
                  border: `3px solid ${alpha(C.emerald, 0.4 + 0.5 * progress(frame, certAt, 12))}`,
                  boxShadow: `0 20px 44px ${alpha('#000000', 0.45)}`,
                  ...paperIn,
                }}
              >
                <div style={{ position: 'absolute', left: 34, top: 26, width: 200, height: 16, borderRadius: 8, background: alpha(C.ink900, 0.7) }} />
                <div style={{ position: 'absolute', left: 34, top: 54, width: 300, height: 10, borderRadius: 5, background: alpha(C.ink900, 0.3) }} />
                <SheetRow y={90} done={progress(frame, serialAt, 10)} tone={C.emerald} icon="check" show={progress(frame, hojaAt + 8, 10)} />
                <SheetRow y={176} done={progress(frame, serialAt + 8, 10)} tone={C.emerald} icon="check" show={progress(frame, hojaAt + 16, 10)} />
                <div style={{ position: 'absolute', right: 30, bottom: 14 }}>
                  <svg width={60} height={60} viewBox="-30 -30 60 60" style={{ opacity: progress(frame, certAt, 10) }}>
                    <circle r={24} fill="none" stroke="#047857" strokeWidth={4} />
                    <circle r={14} fill={alpha(C.emerald, 0.4)} />
                  </svg>
                </div>
              </div>
            ) : null}
            {frame >= certAt - 2 ? (
              <div style={{ position: 'absolute', left: PAPER.x, top: CERT_TERM_TOP, width: PAPER.w, display: 'flex', justifyContent: 'center', ...enter(frame, certAt, { distance: 12, duration: 12 }) }}>
                <TermPill text={TERMS.certification} on={progress(frame, certAt, 12)} size={40} />
              </div>
            ) : null}
          </div>
        ) : null}

        {/* ---------- Phase C: the car ---------- */}
        {cardIn > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: CARD.x,
              top: CARD.y,
              width: CARD.w,
              height: CARD.h,
              boxSizing: 'border-box',
              borderRadius: 30,
              background: alpha(C.ink850, 0.96),
              border: `2px solid ${C.ink600}`,
              boxShadow: `0 30px 70px ${alpha('#000000', 0.5)}`,
              opacity: cardIn,
              transform: `scale(${0.96 + 0.04 * cardIn})`,
            }}
          >
            {/* left: it still runs */}
            <div style={{ position: 'absolute', left: 0, top: 40, width: CARD.w / 2, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.45 + 0.55 * sellOn * (1 - 0.4 * scrapOn) }}>
              <div style={{ height: (CAR.h * 400) / CAR.w + 40, display: 'flex', alignItems: 'flex-end' }}>
                <Car width={400} itv={progress(frame, ruedaAt + 16, 12)} spin={sellOn > 0 ? frame - ruedaAt : 0} />
              </div>
              <div style={{ marginTop: 26, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <Icon name="check" size={40} color={C.emerald} strokeWidth={3} />
                <div style={{ fontSize: 38, fontWeight: 850, lineHeight: 1.2, color: C.textStrong, whiteSpace: 'nowrap' }}>
                  <div>{CAR_SELL[0]}</div>
                  <div style={{ color: C.emerald }}>{CAR_SELL[1]}</div>
                </div>
              </div>
            </div>
            <div style={{ position: 'absolute', left: CARD.w / 2, top: 50, width: 2, height: 360, background: C.ink700 }} />
            {/* right: the scrapyard, with its certificate */}
            <div style={{ position: 'absolute', left: CARD.w / 2, top: 40, width: CARD.w / 2, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.3 + 0.7 * scrapOn }}>
              <div style={{ height: (CAR.h * 400) / CAR.w + 40, display: 'flex', alignItems: 'flex-end', gap: 24 }}>
                <Car width={360} crushed={crushed} />
                <div style={{ marginBottom: 10, opacity: progress(frame, siNoAt + 20, 12), transform: `rotate(6deg)` }}>
                  <Sheet width={96} seal={progress(frame, siNoAt + 28, 10)} tone="#047857" />
                </div>
              </div>
              <div style={{ marginTop: 26, display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <Icon name="x" size={40} color={C.rose} strokeWidth={3} />
                <div style={{ fontSize: 36, fontWeight: 850, lineHeight: 1.2, color: C.textStrong, whiteSpace: 'nowrap' }}>
                  <div>{CAR_SCRAP[0]}</div>
                  <div style={{ color: C.cyanSoft }}>{CAR_SCRAP[1]}</div>
                </div>
              </div>
            </div>
            <div style={{ position: 'absolute', left: 0, bottom: 22, width: CARD.w, display: 'flex', justifyContent: 'center' }}>
              <ImageTag size={28} />
            </div>
          </div>
        ) : null}
        {teaserIn > 0.01 ? (
          <div style={{ position: 'absolute', left: 0, top: TEASER_TOP, width: W, display: 'flex', justifyContent: 'center', opacity: teaserIn, transform: `translateY(${(1 - teaserIn) * 12}px)` }}>
            <Pill text={SSD_TEASER} icon="mortarboard" tone={C.violet} size={34} height={58} on={0.6} />
          </div>
        ) : null}
      </div>
    </Stage>
  );
}
