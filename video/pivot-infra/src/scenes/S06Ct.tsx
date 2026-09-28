import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon, NodeCard } from '../../../engine/src/ui';
import { KEY_COLOR, KeyBadge, MiniBlock, Pill } from './parts/s05-cert/bits';
import { LENS_R, Lens } from './parts/s06-ct/Lens';
import { MINI_H, MINI_W, MiniNotice, NOTICE_H, NOTICE_W, NoticeCard } from './parts/s06-ct/Notice';
import { Stage, segment, wordFrame } from './kit';

const SCENE = 's06-ct';

const LEFT_W = 470;
const BOARD_X = 510;
const BOARD_W = 1728 - BOARD_X;
const BOARD_H = 660;
const HEADER_H = 72;
const BODY_H = BOARD_H - HEADER_H;

// Board grid: 4 × 3 notices.
const GAP_X = (BOARD_W - 4 * NOTICE_W) / 5;
const GAP_Y = (BODY_H - 3 * NOTICE_H) / 4;
const slotPos = (slot: number) => ({
  x: BOARD_X + GAP_X + (slot % 4) * (NOTICE_W + GAP_X),
  y: HEADER_H + GAP_Y + Math.floor(slot / 4) * (NOTICE_H + GAP_Y),
});

/** Generic notices (never actor data). Slot 5 stays free for the new lookalike. */
const NOTICES: { slot: number; domain: string; fp: string }[] = [
  { slot: 0, domain: 'tienda.example', fp: '3f:a2:91…' },
  { slot: 2, domain: 'correo.example', fp: 'b1:6d:40…' },
  { slot: 7, domain: 'mapas.example', fp: 'e6:12:7d…' },
  { slot: 1, domain: 'blog.example', fp: '7c:05:e8…' },
  { slot: 9, domain: 'radio.example', fp: '91:7f:a3…' },
  { slot: 4, domain: 'fotos.example', fp: '58:f3:1b…' },
  { slot: 11, domain: 'agenda.example', fp: '6a:d0:f9…' },
  { slot: 6, domain: 'wiki.example', fp: 'a9:44:0e…' },
  { slot: 3, domain: 'api.example', fp: '2e:9a:c7…' },
  { slot: 8, domain: 'foro.example', fp: '0d:b8:5c…' },
  { slot: 10, domain: 'cine.example', fp: 'c4:2b:66…' },
];
const NEW_SLOT = 5;

// Flood of free-CA notices: 7 × 4.
const MINI_COLS = 7;
const MINI_ROWS = 4;
const MGAP_X = (BOARD_W - MINI_COLS * MINI_W) / (MINI_COLS + 1);
const MGAP_Y = (BODY_H - MINI_ROWS * MINI_H) / (MINI_ROWS + 1);
const miniPos = (i: number) => ({
  x: BOARD_X + MGAP_X + (i % MINI_COLS) * (MINI_W + MGAP_X),
  y: HEADER_H + MGAP_Y + Math.floor(i / MINI_COLS) * (MINI_H + MGAP_Y),
});
const HEX = '0123456789abcdef';
const miniFp = (i: number) => {
  const h = (n: number) => HEX[(i * 7 + n * 5 + 3) % 16] + HEX[(i * 11 + n * 3 + 9) % 16];
  return `${h(1)}:${h(2)}:${h(3)}…`;
};
/** The notice the magnifier lands on, and its exact fingerprint. */
const TARGET = 1 * MINI_COLS + 3;
const TARGET_FP = '9c:41:be…';

/** Where the CA signs the first notice (stage-local top-left). */
const DESK = { x: 60, y: 150 };

// The self-signed key card that bounces off the board.
const SELF_W = 300;
const SELF_H = 76;
const SELF_Y = 150;
const SELF_HIT_X = BOARD_X - SELF_W - 4;

/**
 * s06-ct «El tablón de certificados»: every certificate a public CA signs is
 * pinned on a board anyone can read — Certificate Transparency. New notices
 * keep landing; one is fresh and imitates Meridian (name fully redacted).
 * Two warnings: a self-signed key bounces off the board (search scans
 * instead), and free CAs flood it by the millions, so the issuer says
 * nothing; the magnifier isolates what pivots: the exact fingerprint.
 */
export function S06Ct(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s4 = segment(props, 's06-04');
  const board = props.cue('ct-board');
  const newSub = props.cue('new-sub');
  const freeCa = props.cue('free-ca');
  const exact = props.cue('exact');

  const wAuthority = wordFrame(SCENE, 's06-01', 'autoridad');
  const wSigns = wordFrame(SCENE, 's06-01', 'firma');
  const wHang = wordFrame(SCENE, 's06-01', 'colgar');
  const wView = wordFrame(SCENE, 's06-01', 'vista');
  const wAnyone = wordFrame(SCENE, 's06-02', 'cualquiera');
  const wImitates = wordFrame(SCENE, 's06-03', 'imita');
  const wSelf = wordFrame(SCENE, 's06-04', 'autofirmados');
  const wBoardWord = wordFrame(SCENE, 's06-04', 'tablón');
  const wScans = wordFrame(SCENE, 's06-04', 'escaneos');
  const wMillions = wordFrame(SCENE, 's06-05', 'millones');
  const wIssuer = wordFrame(SCENE, 's06-05', 'emisor');
  const wBlock = wordFrame(SCENE, 's06-05', 'bloque');

  // --- Board chrome.
  const boardIn = enter(frame, 6, { distance: 24, axis: 'x' });
  const titleP = progress(frame, board, 12);
  const eyeGlow = Math.max(progress(frame, wView, 10) * (1 - progress(frame, board + 20, 20)), titleP * 0.6);

  // --- s06-01: sign, then hang.
  const deskOn = frame >= wSigns - 6 && frame < wHang + 20;
  const hang = progress(frame, wHang, 18, EASE.inOut);
  const seal = springIn(frame, fps, wSigns + 4);

  // --- s06-03: the fresh lookalike notice.
  const featureIn = progress(frame, newSub, 14);
  const featureOut = progress(frame, s4.from, 16, EASE.inOut);
  const feature = featureIn * (1 - featureOut);
  const othersDim = 1 - 0.72 * feature;

  // --- s06-04: the self-signed key bounces off the board.
  const selfIn = fadeIn(frame, wSelf - 10, 10);
  const hitAt = wSelf + 26;
  const go = progress(frame, wSelf, hitAt - wSelf, EASE.in);
  const backT = Math.max(0, frame - hitAt);
  const back = progress(frame, hitAt, 26, EASE.out);
  // Recoil with a small overshoot, then rest at x = 0.
  const recoil = backT > 0 ? SELF_HIT_X * (1 - back) - Math.sin(Math.min(1, backT / 26) * Math.PI) * 18 : SELF_HIT_X * go;
  const selfX = Math.max(-18, recoil);
  const bump = frame >= hitAt ? progress(frame, hitAt, 6) * (1 - progress(frame, hitAt + 10, 22)) : 0;
  const rejected = progress(frame, hitAt, 8);
  const selfDim = progress(frame, freeCa, 20) * 0.35;

  // --- s06-05: flood, grey issuer, then the exact fingerprint.
  const oldOut = 1 - progress(frame, freeCa, 18, EASE.inOut);
  const millionsP = progress(frame, wMillions, 12);
  const lensP = progress(frame, exact, 14);
  const dimBoard = progress(frame, exact, 14) * 0.62;
  const target = miniPos(TARGET);
  const lensCx = target.x + MINI_W / 2;
  const lensCy = target.y + MINI_H / 2;

  const headerRight =
    frame >= freeCa ? (
      <span style={{ opacity: millionsP, transform: `scale(${0.9 + 0.1 * millionsP})`, display: 'inline-block' }}>
        <Pill color={C.amber} icon="layers" size={TYPE.label}>
          millones
        </Pill>
      </span>
    ) : frame >= wAnyone - 4 ? (
      <span style={{ opacity: fadeIn(frame, wAnyone - 4, 12) }}>
        <Pill color={C.cyan} icon="users" size={TYPE.label}>
          lo lee cualquiera
        </Pill>
      </span>
    ) : null;

  return (
    <Stage>
      {/* ------------------------------------------------ The board. */}
      <div style={{ position: 'absolute', left: BOARD_X, top: 0, width: BOARD_W, height: BOARD_H, ...boardIn }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: RADIUS.lg,
            border: `3px solid ${bump > 0 ? alpha(C.rose, 0.4 + 0.6 * bump) : alpha(C.cyan, 0.25 + 0.45 * titleP)}`,
            background: `radial-gradient(${alpha(C.ink600, 0.35)} 1.5px, transparent 1.6px) 0 0 / 22px 22px, linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
            boxShadow: `0 30px 70px ${alpha('#000000', 0.4)}${bump > 0 ? `, 0 0 ${Math.round(40 * bump)}px ${alpha(C.rose, 0.45 * bump)}` : titleP > 0 ? `, 0 0 30px ${alpha(C.cyan, 0.12 * titleP)}` : ''}`,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              right: 0,
              height: HEADER_H,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '0 24px',
              borderBottom: `2px solid ${C.ink700}`,
              background: alpha(C.ink800, 0.92),
            }}
          >
            <Icon name="eye" size={36} color={eyeGlow > 0 ? C.cyan : C.muted} style={{ filter: eyeGlow > 0 ? `drop-shadow(0 0 ${Math.round(10 * eyeGlow)}px ${alpha(C.cyan, 0.8)})` : undefined }} />
            <div style={{ fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', opacity: titleP }}>
              Certificate Transparency <span style={{ color: C.faint, margin: '0 8px' }}>·</span>
              <span style={{ color: C.cyan }}>CT logs</span>
            </div>
            <div style={{ flex: 1 }} />
            {headerRight}
          </div>
        </div>
      </div>

      {/* Pinned notices (board-stage coordinates). */}
      <div style={{ position: 'absolute', inset: 0, opacity: oldOut }}>
        {NOTICES.map((n, k) => {
          const pos = slotPos(n.slot);
          const at = k === 0 ? wHang + 18 : board + 8 + (k - 1) * 13;
          if (k === 0) {
            // The first one flies from the CA's desk.
            if (frame < wHang) return null;
            const from = { x: DESK.x, y: DESK.y };
            const x = from.x + (pos.x - from.x) * hang;
            const y = from.y + (pos.y - from.y) * hang - Math.sin(Math.PI * hang) * 50;
            return (
              <div key={n.slot} style={{ position: 'absolute', left: x, top: y, transform: `rotate(${tilt(n.slot) * hang}deg)`, opacity: othersDim }}>
                <NoticeCard domain={n.domain} fingerprint={n.fp} />
              </div>
            );
          }
          if (frame < at) return null;
          const p = progress(frame, at, 10);
          return (
            <div
              key={n.slot}
              style={{
                position: 'absolute',
                left: pos.x,
                top: pos.y,
                opacity: p * othersDim,
                transform: `translateY(${(1 - p) * -26}px) scale(${1.06 - 0.06 * p}) rotate(${tilt(n.slot)}deg)`,
              }}
            >
              <NoticeCard domain={n.domain} fingerprint={n.fp} />
            </div>
          );
        })}

        {/* s06-03: the fresh lookalike — name fully redacted. */}
        {frame >= newSub ? <FreshNotice frame={frame} feature={feature} featureIn={featureIn} imitatesAt={wImitates} newSub={newSub} tagOut={featureOut} /> : null}
      </div>

      {/* s06-05: the flood of identical free-CA notices. */}
      {frame >= freeCa ? (
        <div style={{ position: 'absolute', inset: 0 }}>
          {Array.from({ length: MINI_COLS * MINI_ROWS }, (_, i) => {
            const order = (i * 11) % (MINI_COLS * MINI_ROWS);
            const at = freeCa + 2 + order * 2;
            if (frame < at) return null;
            const p = progress(frame, at, 8);
            const pos = miniPos(i);
            const greyAt = wIssuer + (i % MINI_COLS) * 2;
            return (
              <div key={i} style={{ position: 'absolute', left: pos.x, top: pos.y, opacity: p, transform: `translateY(${(1 - p) * -30}px) rotate(${tilt(i + 3) * 0.8}deg)` }}>
                <MiniNotice fingerprint={i === TARGET ? TARGET_FP : miniFp(i)} grey={frame >= greyAt ? 1 : 0} hl={i === TARGET ? lensP : 0} />
              </div>
            );
          })}
        </div>
      ) : null}

      {/* {exact}: dim the board except under the lens. */}
      {dimBoard > 0 ? (
        <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0 }}>
          <path
            fillRule="evenodd"
            fill={alpha(C.ink950, dimBoard)}
            d={`M${BOARD_X + 3} ${HEADER_H + 2} H${1728 - 3} V${BOARD_H - 3} H${BOARD_X + 3} Z M${lensCx - LENS_R} ${lensCy} a${LENS_R} ${LENS_R} 0 1 0 ${2 * LENS_R} 0 a${LENS_R} ${LENS_R} 0 1 0 ${-2 * LENS_R} 0 Z`}
          />
        </svg>
      ) : null}
      <Lens cx={lensCx} cy={lensCy} p={lensP} fingerprint={TARGET_FP} />
      {frame >= exact ? (
        <div
          style={{
            position: 'absolute',
            left: lensCx + LENS_R + 22,
            top: lensCy - 122,
            padding: '14px 22px 16px',
            borderRadius: RADIUS.md,
            border: `2px solid ${alpha(KEY_COLOR, 0.6)}`,
            background: alpha(C.ink950, 0.94),
            boxShadow: `0 20px 44px ${alpha('#000000', 0.5)}`,
            fontFamily: FONT.sans,
            whiteSpace: 'nowrap',
            ...enter(frame, exact + 4, { distance: 14, axis: 'x', duration: 12 }),
          }}
        >
          <div style={{ fontSize: TYPE.label, fontWeight: 700, color: C.text }}>lo que pivota:</div>
          <div style={{ marginTop: 4, fontSize: 38, fontWeight: 850, color: KEY_COLOR }}>la huella exacta</div>
        </div>
      ) : null}

      {/* ------------------------------------------------ Left column. */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: LEFT_W, ...enter(frame, 0, { distance: 18 }) }}>
        <NodeCard
          icon="shield"
          label="CA pública"
          sublabel="autoridad de certificación"
          accent="cyan"
          state={frame >= wAuthority && frame < wHang + 30 ? 'active' : 'normal'}
          width={LEFT_W}
        />
      </div>

      {/* s06-01: the CA signs a certificate before pinning it. */}
      {deskOn ? (
        <div style={{ position: 'absolute', left: DESK.x, top: DESK.y, opacity: fadeIn(frame, wSigns - 6, 10) * (1 - progress(frame, wHang, 10)) }}>
          <NoticeCard domain={NOTICES[0].domain} fingerprint={NOTICES[0].fp} style={{ opacity: frame >= wHang ? 0 : 1 }} />
          <div
            style={{
              position: 'absolute',
              right: -26,
              bottom: -26,
              width: 72,
              height: 72,
              borderRadius: 36,
              display: 'grid',
              placeItems: 'center',
              border: `4px solid ${C.emerald}`,
              background: alpha(C.emeraldDeep, 0.9),
              boxShadow: `0 0 24px ${alpha(C.emerald, 0.45)}`,
              transform: `scale(${seal}) rotate(-12deg)`,
              opacity: Math.min(1, seal),
            }}
          >
            <Icon name="check" size={40} color={C.emerald} strokeWidth={3} />
          </div>
          <div style={{ position: 'absolute', left: 0, top: NOTICE_H + 18, opacity: progress(frame, wSigns + 6, 10) }}>
            <Pill color={C.emerald} size={TYPE.small} icon="shield">
              firmado por la CA
            </Pill>
          </div>
        </div>
      ) : null}

      {/* s06-01..03: how CT works, in three steps. */}
      <CtSteps frame={frame} firstAt={wHang + 12} anyoneAt={wAnyone - 4} outAt={s4.from - 6} />

      {/* s06-04: «autofirmados: no pasan por aquí · búscalos en escaneos». */}
      {frame >= wSelf - 10 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - selfDim }}>
          <div
            style={{
              position: 'absolute',
              left: selfX,
              top: SELF_Y,
              width: SELF_W,
              height: SELF_H,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '0 18px 0 10px',
              borderRadius: RADIUS.pill,
              border: `2px solid ${alpha(KEY_COLOR, 0.8)}`,
              background: `linear-gradient(180deg, ${alpha(KEY_COLOR, 0.14)} 0%, ${alpha(C.ink900, 0.97)} 100%)`,
              boxShadow: `0 16px 36px ${alpha('#000000', 0.45)}`,
              opacity: selfIn,
              fontFamily: FONT.sans,
            }}
          >
            <KeyBadge size={56} glow={0.4} />
            <span style={{ fontSize: TYPE.label, fontWeight: 800, color: '#6ee7b7', whiteSpace: 'nowrap' }}>autofirmado</span>
            {rejected > 0 ? (
              <div
                style={{
                  position: 'absolute',
                  right: -18,
                  top: -18,
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  display: 'grid',
                  placeItems: 'center',
                  background: C.rose,
                  boxShadow: `0 0 18px ${alpha(C.rose, 0.6)}`,
                  transform: `scale(${0.6 + 0.4 * rejected})`,
                  opacity: rejected,
                }}
              >
                <Icon name="x" size={28} color={C.ink950} strokeWidth={3.2} />
              </div>
            ) : null}
          </div>
          <div style={{ position: 'absolute', left: 4, top: SELF_Y + SELF_H + 18, fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 750, lineHeight: 1.18, whiteSpace: 'nowrap', ...enter(frame, Math.max(hitAt + 4, wBoardWord - 10), { distance: 12, duration: 12 }) }}>
            <div style={{ color: '#6ee7b7' }}>autofirmados:</div>
            <div style={{ color: C.text }}>no pasan por aquí</div>
          </div>
          <div style={{ position: 'absolute', left: 4, top: SELF_Y + SELF_H + 118, ...enter(frame, wScans - 6, { distance: 12, duration: 12 }) }}>
            <Pill color={C.cyan} icon="radar" size={TYPE.label}>
              búscalos en escaneos
            </Pill>
          </div>
        </div>
      ) : null}

      {/* s06-05: the issuer of free certificates says nothing. */}
      {frame >= freeCa ? <FreeIssuer frame={frame} at={freeCa} greyAt={wIssuer} blockAt={wBlock} /> : null}
    </Stage>
  );
}

/** Small deterministic tilt so the board does not look like a spreadsheet. */
function tilt(i: number): number {
  return (((i * 37) % 7) - 3) * 0.45;
}

function FreshNotice({
  frame,
  feature,
  featureIn,
  imitatesAt,
  newSub,
  tagOut,
}: {
  frame: number;
  feature: number;
  featureIn: number;
  imitatesAt: number;
  newSub: number;
  tagOut: number;
}) {
  const pos = slotPos(NEW_SLOT);
  const scale = 1 + 0.35 * feature;
  const cx = pos.x + NOTICE_W / 2;
  const tagTop = pos.y + NOTICE_H / 2 + (NOTICE_H * 1.35) / 2 + 18;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: pos.x,
          top: pos.y,
          opacity: featureIn,
          transform: `translateY(${(1 - featureIn) * -60}px) scale(${scale})`,
          transformOrigin: 'center center',
          zIndex: 2,
        }}
      >
        <NoticeCard
          domain={null}
          redactW={150}
          fingerprint="f2:8c:37…"
          accent={C.rose}
          style={{
            border: `3px solid ${alpha(C.rose, 0.55 + 0.4 * feature)}`,
            boxShadow: `0 16px 40px ${alpha('#000000', 0.5)}, 0 0 ${Math.round(12 + 30 * feature)}px ${alpha(C.rose, 0.25 + 0.3 * feature)}`,
          }}
          extra={
            <div style={{ position: 'absolute', right: 10, top: 12 }}>
              <Pill color={C.rose} size={TYPE.micro} solid>
                hoy
              </Pill>
            </div>
          }
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: cx,
          top: tagTop,
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 12,
          opacity: fadeIn(frame, newSub + 4, 10) * (1 - tagOut),
          zIndex: 3,
        }}
      >
        <TagSlot on={fadeIn(frame, imitatesAt - 4, 10)}>
          <Pill color={C.rose} size={TYPE.label} solid>
            imita a Meridian
          </Pill>
        </TagSlot>
        <TagSlot on={1}>
          <Pill color={C.rose} size={TYPE.label}>
            recién emitido
          </Pill>
        </TagSlot>
      </div>
    </>
  );
}

/** Keeps its size while hidden, so the tag row never re-centres; carries its own dark backing. */
function TagSlot({ on, children }: { on: number; children: ReactNode }) {
  return (
    <span style={{ opacity: on, transform: `scale(${0.9 + 0.1 * on})`, display: 'inline-block', borderRadius: RADIUS.pill, background: alpha(C.ink950, 0.92), boxShadow: `0 10px 24px ${alpha('#000000', 0.5)}` }}>
      {children}
    </span>
  );
}

const STEPS: { icon: 'shield' | 'file' | 'users'; text: string }[] = [
  { icon: 'shield', text: 'la CA lo firma' },
  { icon: 'file', text: 'lo cuelga en el tablón' },
  { icon: 'users', text: 'cualquiera lo lee' },
];

/** The mechanism: sign, pin, anyone reads. Gone before the two warnings arrive. */
function CtSteps({ frame, firstAt, anyoneAt, outAt }: { frame: number; firstAt: number; anyoneAt: number; outAt: number }) {
  if (frame < firstAt || frame >= outAt + 14) return null;
  const out = 1 - progress(frame, outAt, 12, EASE.inOut);
  const at = [firstAt, firstAt + 10, anyoneAt];
  const ROW = 82;
  return (
    <div style={{ position: 'absolute', left: 0, top: 168, width: LEFT_W, opacity: out }}>
      <svg width={60} height={ROW * 3} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {[0, 1].map((k) => {
          const p = progress(frame, at[k + 1], 12, EASE.inOut);
          if (p <= 0) return null;
          const y1 = k * ROW + 60;
          return <line key={k} x1={28} y1={y1} x2={28} y2={y1 + (ROW - 60) * p} stroke={alpha(C.cyan, 0.7)} strokeWidth={4} strokeLinecap="round" />;
        })}
      </svg>
      {STEPS.map((s, k) => (
        <div key={s.text} style={{ position: 'absolute', left: 0, top: k * ROW, display: 'flex', alignItems: 'center', gap: 16, ...enter(frame, at[k], { distance: 12, duration: 12 }) }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, display: 'grid', placeItems: 'center', background: alpha(C.cyan, 0.12), border: `2px solid ${alpha(C.cyan, 0.5)}` }}>
            <Icon name={s.icon} size={32} color={C.cyan} />
          </div>
          <span style={{ fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 700, color: C.text, whiteSpace: 'nowrap' }}>{s.text}</span>
        </div>
      ))}
    </div>
  );
}

/** Warning 2: free CAs issue by the millions — following the issuer is following the whole block. */
function FreeIssuer({ frame, at, greyAt, blockAt }: { frame: number; at: number; greyAt: number; blockAt: number }) {
  const grey = progress(frame, greyAt, 12);
  const top = 420;
  return (
    <div style={{ position: 'absolute', left: 0, top, width: LEFT_W, ...enter(frame, at, { distance: 16, duration: 12 }) }}>
      <Pill color={grey > 0.5 ? C.faint : C.amber} icon="shield" size={TYPE.label}>
        emisor:{' '}
        <span style={{ color: grey > 0.5 ? C.faint : C.amber, textDecoration: grey > 0.5 ? 'line-through' : undefined }}>CA gratuita</span>
      </Pill>
      <div style={{ marginTop: 16, marginLeft: 4, fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 750, color: C.muted, whiteSpace: 'nowrap', opacity: fadeIn(frame, greyAt + 6, 12) }}>
        el emisor no dice nada
      </div>
      <div style={{ marginTop: 14, marginLeft: 4, display: 'flex', alignItems: 'center', gap: 14, ...enter(frame, blockAt - 10, { distance: 10, duration: 12 }) }}>
        <MiniBlock height={46} glow={progress(frame, blockAt, 10)} />
        <span style={{ fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 750, color: C.amber, whiteSpace: 'nowrap' }}>seguir a todo el bloque</span>
      </div>
    </div>
  );
}
