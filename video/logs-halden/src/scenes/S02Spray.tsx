import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, countUp, progress, pulse } from '../../../engine/src/theme/motion';
import { Icon, clamp01, dimStyle, focusWeights, mix } from '../../../engine/src/ui';
import { EVERY_DOOR, IDP_LINES, LOOK, MATRIX, NOTE, OK_INDEX, ONE_DOOR, SUMMARY } from '../data/s02-spray';
import { Door, FailCounter, FlatsBlock, KeyBunch, KeyGlyph, Padlock, bunchAnchor, doorPoint } from './parts/FlatsBlock';
import { IdpLog, idpColumn, idpLogHeight, idpLogWidth, type IdpColumn } from './parts/IdpLog';
import { MATRIX_GRID, Matrix, matrixCell, matrixSize } from './parts/s02-spray/Matrix';
import { LookTag, TermTag } from './parts/s02-spray/Marks';
import { ExpandingRow } from './parts/TrailRow';
import { Stage, segment, wordFrame } from './kit';

const S = 's02-spray';
const W = 1728;

// ---- Phase A: the IdP log, under the key row's strip (stage-local y 0–90).
const LOG_SIZE = 32;
const LOG_PITCH = 50;
const LOG_W = idpLogWidth(LOG_SIZE);
const LOG_H = idpLogHeight(IDP_LINES.length, LOG_PITCH);
const LOG = { x: Math.round((W - LOG_W) / 2), y: 104 } as const;
const LOG_BOTTOM = LOG.y + LOG_H;
const TAG_Y = LOG_BOTTOM + 26;
const SUMMARY_Y = LOG_BOTTOM + 30;
const NOTE_Y = SUMMARY_Y + 112;

// ---- Phase B: the counter-example door (left, amber, dashed) and the block of flats (right).
const LEFT = { w: 520, h: 546 } as const;
const RIGHT = { w: 1148, h: 546, blockH: 470 } as const;
const LP_DOOR = { x: 170, y: 76, w: 150 } as const;
const LP_LOCK = { x: LP_DOOR.x + doorPoint(LP_DOOR.w, 'lock1').x, y: LP_DOOR.y + doorPoint(LP_DOOR.w, 'lock1').y };
const BUNCH_W = 130;
const PADLOCK = 64;

// ---- Phase B2: both shrink to the bottom; the accounts × passwords matrix sits above, between them.
const MAT = matrixSize();
const MAT_POS = { x: Math.round((W - MAT.width) / 2), y: 116 } as const;
const BRUTE_ROW_Y = MAT_POS.y + matrixCell(MATRIX_GRID.bruteRow, 0).y + MATRIX_GRID.cell / 2;
const SMALL = 0.48;
const B1 = { left: { x: 0, y: 104 }, right: { x: W - RIGHT.w, y: 104 } } as const;
const B2 = {
  left: { x: 250, y: 660 - Math.round(LEFT.h * SMALL) - 4 },
  right: { x: 1124, y: 660 - Math.round(RIGHT.h * SMALL) - 4 },
} as const;
const TAG_GAP = 44;

/**
 * s02-spray «Una llave en todas las puertas». The key row grows into the
 * title strip and the IdP's log opens: five lines (the OK one dimmed, for
 * s03). Where to look, step by step — `user` changes on every line, `src`
 * never does, ~40 s between tries — then the night in one line with
 * «cuentas bloqueadas: 0» big. The image: a block of flats; on the left the
 * counter-example (amber, dashed): a bunch of keys on ONE door that locks at
 * the 5th failure — ACCOUNT LOCKOUT; on the right ONE ordinary key tries each
 * door once and none locks. Above, accounts × passwords: BRUTE FORCE fills a
 * row, PASSWORD SPRAYING a column. Last line: look at the shape.
 */
export function S02Spray(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logAt = props.cue('log');
  const usersAt = props.cue('users');
  const srcAt = props.cue('src');
  const paceAt = props.cue('pace');
  const zeroAt = props.cue('zero');
  const oneDoorAt = props.cue('one-door');
  const everyDoorAt = props.cue('every-door');
  const matrixAt = props.cue('matrix');
  const sprayingAt = props.cue('spraying');
  const s05 = segment(props, 's02-05');
  const s07 = segment(props, 's02-07');

  // ---- Phase A ---------------------------------------------------------------
  const logOpen = progress(frame, logAt - 2, 18, EASE.out);
  const aOut = progress(frame, oneDoorAt - 12, 14, EASE.inOut);
  const rows = IDP_LINES.map((_, i) => ({
    show: progress(frame, logAt + 8 + i * 5, 10),
    dim: i === OK_INDEX ? 1 : 0,
  }));

  const lookStarts = [usersAt, srcAt, paceAt];
  const lookCols: IdpColumn[] = ['user', 'src', 'time'];
  const lookTones = [C.cyan, C.rose, C.cyan];
  const lookEnd = zeroAt - 8;
  const { weights, dims } = focusWeights(frame, lookStarts, { end: lookEnd });
  const lookGone = progress(frame, zeroAt - 10, 12, EASE.inOut);
  const marks = lookCols.map((col, i) => ({
    col,
    tone: lookTones[i],
    on: Math.max(weights[i], 0.3 * progress(frame, lookStarts[i], 10) * (1 - lookGone)),
  }));

  const sumIn = progress(frame, zeroAt - 2, 16);
  const accounts = Math.round(countUp(frame, zeroAt, 26, 5, SUMMARY.accounts));
  const wLockout = wordFrame(S, 's02-03', 'bloqueo');
  const zeroPop = frame >= wLockout - 4 ? 1 - progress(frame, wLockout - 4, 16, EASE.out) : 0;
  // The small note rides with the summary (it must read for a while before Phase A leaves).
  const noteIn = progress(frame, wordFrame(S, 's02-03', 'intento') - 2, 14);

  // ---- Phase B1: the counter-example door ---------------------------------------
  const wTry = wordFrame(S, 's02-04', 'pruebas');
  const wBunch = wordFrame(S, 's02-04', 'manojo');
  const wFifth = wordFrame(S, 's02-04', 'quinto');
  const wLocks = wordFrame(S, 's02-04', 'bloquea');
  const wAccount = wordFrame(S, 's02-04', 'account');
  const blockIn = progress(frame, oneDoorAt - 2, 18);
  const leftIn = progress(frame, wTry - 8, 16);
  const bunchIn = progress(frame, wBunch - 4, 12);
  const firstTry = wBunch + 10;
  const tryAt = [0, 1, 2, 3].map((k) => firstTry + (k * Math.max(16, wFifth - 6 - firstTry)) / 3).concat(wFifth);
  const fails = tryAt.reduce((n, t) => n + progress(frame, t, 6), 0);
  const lastTry = tryAt.reduce((k, t, i) => (frame >= t ? i : k), -1);
  const locked = progress(frame, wLocks - 2, 9, EASE.out);
  const sinceTry = lastTry >= 0 ? frame - tryAt[lastTry] : -1;
  const swing = sinceTry >= 0 && locked < 1 ? Math.sin(sinceTry * 0.8) * Math.exp(-sinceTry / 7) : 0;

  // ---- Phase B1: the single key, one try per door --------------------------------
  const leftBack = progress(frame, everyDoorAt - 6, 14, EASE.inOut) * 0.6;
  const blockBack = 0.4 * progress(frame, wTry - 6, 12) * (1 - progress(frame, everyDoorAt - 6, 12));
  const sweepStart = everyDoorAt + 8;
  const sweepDur = Math.max(54, Math.min(96, s05.to - sweepStart - 10));
  const doors = 18;
  const keyPos = (doors - 1) * progress(frame, sweepStart, sweepDur, EASE.linear);
  const sweepEnd = sweepStart + sweepDur;
  const tried = Math.min(doors, keyPos + 0.45 + 0.6 * progress(frame, sweepEnd, 6));
  const keyShow = progress(frame, everyDoorAt - 2, 10);
  const captionIn = progress(frame, sweepEnd - 8, 14);

  // ---- Phase B2: the matrix ------------------------------------------------------
  const shrink = progress(frame, matrixAt - 10, 22, EASE.inOut);
  const matIn = progress(frame, matrixAt - 2, 16);
  const wPocas = wordFrame(S, 's02-06', 'Pocas');
  const bruteFill = 6 * progress(frame, matrixAt + 6, Math.max(18, wordFrame(S, 's02-06', 'cuenta') + 6 - (matrixAt + 6)), EASE.inOut);
  const sprayFill = 5 * progress(frame, wPocas + 2, Math.max(18, wordFrame(S, 's02-06', 'cuentas') + 6 - (wPocas + 2)), EASE.inOut);
  const wBrute = wordFrame(S, 's02-06', 'fuerza') - 4;
  const shape = progress(frame, s07.from - 4, 14, EASE.inOut);
  const bruteGlow = progress(frame, wBrute, 10) * (1 - 0.7 * progress(frame, wPocas - 4, 12)) * (1 - shape);
  const sprayGlow = Math.max(progress(frame, sprayingAt - 2, 12) * 0.75, shape * (0.7 + 0.3 * pulse(frame, fps, 0.5)));

  const leftPos = { x: mix(B1.left.x, B2.left.x, shrink), y: mix(B1.left.y, B2.left.y, shrink), s: mix(1, SMALL, shrink) };
  // The block comes in centred («piensa en un bloque de pisos») and steps right when the counter-example door arrives.
  const aside = progress(frame, wTry - 10, 18, EASE.inOut);
  const rightB1x = mix((W - RIGHT.w) / 2, B1.right.x, aside);
  const rightPos = { x: mix(rightB1x, B2.right.x, shrink), y: mix(B1.right.y, B2.right.y, shrink), s: mix(1, SMALL, shrink) };
  // Labels would shrink below legibility: they leave as the panels shrink.
  const labelsOut = 1 - progress(frame, matrixAt - 12, 12, EASE.inOut);

  return (
    <Stage>
      {/* The key row grows out of s01's queue into the title strip */}
      <ExpandingRow kind="key" frame={frame} startAt={props.enterFrames} />

      {/* ---------------- Phase A: the log ---------------- */}
      {aOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - aOut, transform: `translateY(${-24 * aOut}px)` }}>
          <div style={{ position: 'absolute', left: LOG.x, top: LOG.y }}>
            <IdpLog lines={IDP_LINES} size={LOG_SIZE} pitch={LOG_PITCH} width={LOG_W} open={logOpen} rows={rows} marks={marks} chromeDim={0.4 * sumIn} />
          </div>

          {/* Where to look: a tag under each column, with a short leader */}
          {lookCols.map((col, i) => {
            const p = progress(frame, lookStarts[i] - 2, 12) * (1 - lookGone);
            if (p <= 0.001) return null;
            const c = idpColumn(col, LOG_SIZE);
            const cx = LOG.x + c.centre;
            const text = i === 0 ? LOOK.users : i === 1 ? LOOK.src : LOOK.pace;
            // user: right-aligned to its column; src: left-aligned to its column; time: right-aligned
            // clear of the user tag (≈ 420 px wide at 32 px), its leader still lands inside it.
            const userCol = idpColumn('user', LOG_SIZE);
            const userRight = LOG.x + userCol.x + userCol.width + 14;
            const anchor =
              col === 'user'
                ? { left: userRight, shift: '-100%' }
                : col === 'src'
                  ? { left: LOG.x + c.x - 14, shift: '0%' }
                  : { left: userRight - 450, shift: '-100%' };
            return (
              <div key={col}>
                <div
                  style={{
                    position: 'absolute',
                    left: cx - 1.5,
                    top: LOG_BOTTOM + 2,
                    width: 3,
                    height: (TAG_Y - LOG_BOTTOM - 2) * p,
                    background: alpha(lookTones[i], 0.8),
                    ...dimStyle(dims[i] * 0.7),
                  }}
                />
                <div style={{ position: 'absolute', left: anchor.left, top: TAG_Y, transform: `translateX(${anchor.shift})` }}>
                  <LookTag text={text} tone={lookTones[i]} p={p} dim={dims[i] * 0.7} icon={col === 'time' ? 'clock' : col === 'src' ? 'target' : 'users'} />
                </div>
              </div>
            );
          })}

          {/* The night in one line */}
          {sumIn > 0.001 ? (
            <div style={{ position: 'absolute', left: 0, top: SUMMARY_Y, width: W, display: 'flex', justifyContent: 'center', opacity: sumIn, transform: `translateY(${(1 - sumIn) * 14}px)` }}>
              <SummaryBar accounts={accounts} zeroPop={zeroPop} frame={frame} fps={fps} zeroAt={zeroAt} />
            </div>
          ) : null}
          {noteIn > 0.001 ? (
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: NOTE_Y,
                width: W,
                textAlign: 'center',
                fontFamily: FONT.sans,
                fontSize: 28,
                fontWeight: 600,
                fontStyle: 'italic',
                color: C.muted,
                whiteSpace: 'nowrap',
                opacity: noteIn,
              }}
            >
              {NOTE}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ---------------- Phase B: the block of flats ---------------- */}
      {blockIn > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: rightPos.x,
            top: rightPos.y,
            width: RIGHT.w,
            height: RIGHT.h,
            transform: `translateY(${(1 - blockIn) * 26}px) scale(${rightPos.s})`,
            transformOrigin: '0 0',
            opacity: blockIn,
          }}
        >
          <FlatsBlock
            width={RIGHT.w}
            height={RIGHT.blockH}
            tried={keyShow > 0 ? tried : 0}
            skipMark={[OK_INDEX]}
            doorDim={{ [OK_INDEX]: 0.55 * keyShow }}
            keyPos={keyShow > 0 ? keyPos : null}
            keyShow={keyShow}
            keyWidth={88}
            dim={blockBack}
          />
          {captionIn > 0.001 ? (
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: RIGHT.blockH + 18,
                width: RIGHT.w,
                display: 'flex',
                justifyContent: 'center',
                opacity: captionIn * labelsOut,
                transform: `translateY(${(1 - captionIn) * 10}px)`,
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14, fontFamily: FONT.sans, fontSize: 38, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>
                <KeyGlyph width={70} glow={0.5} />
                {EVERY_DOOR}
              </span>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* The counter-example: a bunch of keys on ONE door */}
      {leftIn > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: leftPos.x,
            top: leftPos.y,
            width: LEFT.w,
            height: LEFT.h,
            transform: `translateY(${(1 - leftIn) * 26}px) scale(${leftPos.s})`,
            transformOrigin: '0 0',
            ...dimStyle(Math.max(leftBack, 0.6 * shape), leftIn),
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: RADIUS.lg,
              border: `3px dashed ${alpha(C.amber, 0.6)}`,
              background: `linear-gradient(180deg, ${alpha(C.amber, 0.07)} 0%, ${alpha(C.ink900, 0.6)} 100%)`,
            }}
          />
          {/* «umbral: 5 fallos» */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 14,
              width: LEFT.w,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 12,
              fontFamily: FONT.sans,
              fontSize: 38,
              fontWeight: 800,
              color: '#fde68a',
              whiteSpace: 'nowrap',
              opacity: bunchIn * labelsOut,
            }}
          >
            <Icon name="lock" size={38} color={C.amber} />
            {ONE_DOOR.threshold}
          </div>
          <div style={{ position: 'absolute', left: LP_DOOR.x, top: LP_DOOR.y }}>
            <Door width={LP_DOOR.w} frameColor={alpha(C.amber, 0.85)} dashed glow={locked} glowColor={C.amber} lock1Color={alpha(C.amber, 0.9)} />
          </div>
          {bunchIn > 0.001 ? (
            <div
              style={{
                position: 'absolute',
                left: LP_LOCK.x - bunchAnchor(BUNCH_W).x,
                top: LP_LOCK.y - bunchAnchor(BUNCH_W).y,
                opacity: bunchIn * (1 - 0.45 * locked),
                transform: `translateY(${(1 - bunchIn) * -14}px)`,
              }}
            >
              <KeyBunch width={BUNCH_W} active={locked > 0.5 ? -1 : lastTry} swing={swing} />
            </div>
          ) : null}
          <div style={{ position: 'absolute', left: LP_LOCK.x - PADLOCK / 2, top: LP_LOCK.y - PADLOCK * 0.42 }}>
            <Padlock size={PADLOCK} close={locked} />
          </div>
          <div style={{ position: 'absolute', left: 0, top: 388, width: LEFT.w, display: 'flex', justifyContent: 'center', opacity: bunchIn }}>
            <FailCounter count={fails} total={ONE_DOOR.fails} size={52} />
          </div>
          <div style={{ position: 'absolute', left: 0, top: 458, width: LEFT.w, display: 'flex', justifyContent: 'center', opacity: labelsOut }}>
            <TermTag frame={frame} fps={fps} at={wAccount - 2} term={ONE_DOOR.lockout} size={38} />
          </div>
        </div>
      ) : null}

      {/* ---------------- Phase B2: accounts × passwords ---------------- */}
      {matIn > 0.001 ? (
        <>
          <div style={{ position: 'absolute', left: MAT_POS.x, top: MAT_POS.y, transform: `translateY(${(1 - matIn) * 18}px)` }}>
            <Matrix show={matIn} bruteFill={bruteFill} sprayFill={sprayFill} bruteDim={shape} bruteGlow={bruteGlow} sprayGlow={sprayGlow} />
          </div>
          {/* BRUTE FORCE, left of its row */}
          <div style={{ position: 'absolute', left: MAT_POS.x - TAG_GAP, top: BRUTE_ROW_Y, transform: 'translate(-100%, -50%)' }}>
            <TermTag frame={frame} fps={fps} at={wBrute} term={MATRIX.brute} sub={MATRIX.bruteSub} size={44} subSize={32} align="right" dim={0.6 * shape} />
          </div>
          {/* PASSWORD SPRAYING, right of its column */}
          <div style={{ position: 'absolute', left: MAT_POS.x + MAT.width + TAG_GAP, top: BRUTE_ROW_Y, transform: 'translateY(-50%)' }}>
            <TermTag frame={frame} fps={fps} at={sprayingAt - 2} term={MATRIX.spray} sub={MATRIX.spraySub} size={44} subSize={32} />
          </div>
        </>
      ) : null}
    </Stage>
  );
}

// ---------------------------------------------------------------------------

/** «180 cuentas · 1 intento por cuenta · 03:10–05:06 · cuentas bloqueadas: 0», the 0 at 60 px (amber: the lockout never fired). */
function SummaryBar({ accounts, zeroPop, frame, fps, zeroAt }: { accounts: number; zeroPop: number; frame: number; fps: number; zeroAt: number }) {
  const glow = 0.6 + 0.4 * pulse(frame - zeroAt, fps, 0.5);
  const sep = <span style={{ color: C.faint, fontWeight: 700 }}>·</span>;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 22,
        height: 96,
        padding: '0 34px',
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${C.ink600}`,
        background: `linear-gradient(180deg, ${alpha(C.ink800, 0.96)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        boxShadow: `0 24px 56px ${alpha('#000000', 0.4)}`,
        fontFamily: FONT.sans,
        fontSize: 38,
        fontWeight: 750,
        color: C.textStrong,
        whiteSpace: 'nowrap',
      }}
    >
      <span>
        <span style={{ fontFamily: FONT.mono, fontWeight: 850, color: C.cyanSoft }}>{accounts}</span> {SUMMARY.accountsLabel}
      </span>
      {sep}
      <span>{SUMMARY.perAccount}</span>
      {sep}
      <span style={{ fontFamily: FONT.mono, fontSize: 36, fontWeight: 700, color: C.text }}>{SUMMARY.span}</span>
      {sep}
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
        <span style={{ color: '#fde68a' }}>{SUMMARY.lockedLabel}</span>
        <span
          style={{
            display: 'inline-block',
            fontSize: 60,
            fontWeight: 850,
            lineHeight: 1,
            color: C.amber,
            textShadow: `0 0 ${Math.round(18 * glow)}px ${alpha(C.amber, 0.6 * glow)}`,
            transform: `scale(${1 + 0.3 * clamp01(zeroPop)})`,
          }}
        >
          {SUMMARY.locked}
        </span>
      </span>
    </div>
  );
}
