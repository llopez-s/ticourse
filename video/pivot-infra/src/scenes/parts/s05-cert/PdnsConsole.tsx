import type { ReactNode } from 'react';
import { C, FONT, TYPE, alpha } from '../../../../../engine/src/theme/tokens';
import { enter, pulse } from '../../../../../engine/src/theme/motion';
import { Chip, Icon, MonoLine, Panel, type MonoToken } from '../../../../../engine/src/ui';
import { CANON, Pill, RedactBar, dimStyle, mix } from './bits';
import { RIGHT_W, RIGHT_X } from './Scan';

/** Taller than the tiles' row it sits under, so the answer has room to grow. */
export const CONSOLE_Y = 310;
export const CONSOLE_H = 660 - CONSOLE_Y;
const HEADER_H = 64;
const PAD_X = 26;
const PAD_TOP = 16;
/** Body-local top of the phishing result row. */
const ROW_A_Y = 96;
const RIGHT_COL_X = 750;
/** Body-local box of the phishing answer (it scales from its top-left corner). */
const CARD_X = PAD_X - 12;
const CARD_Y = PAD_TOP + ROW_A_Y - 10;
const CARD_W = RIGHT_COL_X - 36;
/** Card-local top-left of the domain text (border + padding + icon + gap). */
const CARD_TEXT = { x: 2 + 12 + 32 + 12, y: 2 + 16 } as const;
/** Right edge of the body's content box (body-local). */
const BODY_R = RIGHT_W - 4 - PAD_X;

/** The command (the question) reads at ~36 px until the answer arrives. */
const CMD_FOCUS = 1.3;
/** The answer grows while the voice is on it, and steps back when the Lab 3A neighbours take over. */
const CARD_FOCUS = 1.28;
const CARD_LAB = 0.88;
/** The redacted neighbours: small at the right while the answer is the subject, large at {redacted}. */
const NB_BAR = 180;
const NB_ROW_H = 54;
const NB_ROW_GAP = 66;
const NB_TOP = PAD_TOP + ROW_A_Y - 6;
const NB_W_OPEN = 30 + 14 + NB_BAR + 14 + 126;
const NB_PHISH = { x: BODY_R - 0.7 * NB_W_OPEN, s: 0.7 } as const;
const NB_LAB = { x: 700, s: 1.15 } as const;

/** Scale of the phishing answer for the two focus weights. */
export function phishCardScale(phishFocus: number, labFocus: number): number {
  return mix(mix(1, CARD_FOCUS, phishFocus), CARD_LAB, labFocus);
}

/** Stage-local top-left of the phishing domain text at a given card scale (for the copy that flies to the conclusion). */
export function phishTextPos(scale: number): { x: number; y: number } {
  return {
    x: RIGHT_X + 2 + CARD_X + CARD_TEXT.x * scale,
    y: CONSOLE_Y + 2 + HEADER_H + 2 + CARD_Y + CARD_TEXT.y * scale,
  };
}

export interface ConsoleTiming {
  /** The console opens. */
  openAt: number;
  /** The command starts typing. */
  cmdAt: number;
  /** Results arrive ({phish-link}). */
  resultAt: number;
  /** {redacted}: the neighbours lock and pulse with their Lab 3A tag. */
  lockAt: number;
}

export interface ConsoleFocus {
  /** 0–1: the phishing answer is the subject (grows; the rest steps back). */
  phish: number;
  /** 0–1: the Lab 3A neighbours are the subject (they grow; the answer steps back). */
  lab: number;
  /** 0–1 dimming of the whole console (while the conclusion strip is the subject). */
  dim: number;
}

/**
 * «Se lo preguntas al listín con memoria»: the passive DNS console (same look
 * as s03 — a Panel with mono lines) asked who lives on 141.98.6.10. One answer
 * is readable, the phishing portal against Meridian; the two neighbours stay
 * redacted for Lab 3A. No first/last-seen dates: canon has none for them.
 * `focus` enlarges whichever of the two the voice is on and dims the other.
 */
export function PdnsConsole({ frame, fps, t, phishGlow, focus }: { frame: number; fps: number; t: ConsoleTiming; phishGlow: number; focus: ConsoleFocus }) {
  if (frame < t.openAt - 2) return null;
  const cmd: MonoToken[] = [
    { t: '$ ', c: C.emerald, bold: true },
    { t: 'pdns ip ' },
    { t: CANON.vpsIp, c: '#6ee7b7', bold: true },
  ];
  const cmdLen = cmd.reduce((n, k) => n + k.t.length, 0);
  const typed = frame < t.cmdAt ? 0 : Math.min(cmdLen, Math.floor(((frame - t.cmdAt) / fps) * 60));
  // The neighbours slide into place first, then lock — so the wider locked tag never overflows the body.
  const lockFrame = t.lockAt + 8;
  const lock = frame >= lockFrame;
  const lockPulse = lock ? 0.45 + 0.55 * pulse(frame - lockFrame, fps, 0.8) : 0;

  const cardS = phishCardScale(focus.phish, focus.lab);
  const nbS = mix(mix(1, NB_PHISH.s, focus.phish), NB_LAB.s, focus.lab);
  const nbX = mix(mix(RIGHT_COL_X + 14, NB_PHISH.x, focus.phish), NB_LAB.x, focus.lab);
  const cardRight = CARD_X + CARD_W * cardS;
  const chromeD = 0.5 * focus.phish;
  const cardD = focus.lab;
  const nbD = focus.phish * (1 - focus.lab);

  return (
    <div style={{ position: 'absolute', left: RIGHT_X, top: CONSOLE_Y, width: RIGHT_W, height: CONSOLE_H, ...enter(frame, t.openAt, { distance: 22, duration: 14 }) }}>
      <div style={{ width: '100%', height: '100%', ...dimStyle(focus.dim) }}>
        <Panel
          title="passive DNS"
          icon="terminal"
          accent="cyan"
          right={
            <Chip accent="muted" size={TYPE.small} icon="clock">
              el listín con memoria
            </Chip>
          }
          style={{ height: '100%' }}
          bodyStyle={{ padding: `${PAD_TOP}px ${PAD_X}px` }}
        >
          <div style={dimStyle(chromeD)}>
            {/* The question is the subject until the answer arrives: the command reads large, then settles. */}
            <div style={{ transform: `scale(${mix(CMD_FOCUS, 1, focus.phish)})`, transformOrigin: '0 0' }}>
              <MonoLine tokens={cmd} size={28} visibleChars={typed} caret={frame >= t.cmdAt && typed < cmdLen} />
            </div>
            {frame >= t.resultAt + 10 ? (
              <MonoLine tokens={[{ t: '3 dominios han resuelto a esta IP', c: C.faint }]} size={TYPE.micro} style={{ marginTop: 2, ...enter(frame, t.resultAt + 10, { distance: 6, duration: 8 }) }} />
            ) : null}
          </div>

          {/* The readable answer: the phishing portal. */}
          {frame >= t.resultAt ? (
            <div
              style={{
                position: 'absolute',
                left: CARD_X,
                top: CARD_Y,
                width: CARD_W,
                transform: `scale(${cardS})`,
                transformOrigin: '0 0',
                ...dimStyle(cardD),
              }}
            >
              <div
                style={{
                  boxSizing: 'border-box',
                  width: CARD_W,
                  padding: '10px 12px',
                  borderRadius: 16,
                  background: alpha(C.rose, 0.06 + 0.1 * phishGlow),
                  border: `2px solid ${alpha(C.rose, 0.35 + 0.55 * phishGlow)}`,
                  boxShadow: phishGlow > 0 ? `0 0 ${Math.round(30 * phishGlow)}px ${alpha(C.rose, 0.35 * phishGlow)}` : undefined,
                  ...enter(frame, t.resultAt, { distance: 14, duration: 12 }),
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Icon name="globe" size={32} color={C.rose} />
                  <span style={{ fontFamily: FONT.mono, fontSize: TYPE.label, fontWeight: 800, color: C.roseSoft, whiteSpace: 'nowrap' }}>{CANON.phish}</span>
                  <Pill color={C.rose} size={TYPE.label} solid>
                    phishing
                  </Pill>
                </div>
                <div style={{ marginTop: 8, marginLeft: 44, fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 650, color: C.text, whiteSpace: 'nowrap' }}>
                  portal falso de login de <span style={{ color: C.roseSoft, fontWeight: 800 }}>Meridian</span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Divider between the answer and the redacted neighbours. */}
          {frame >= t.resultAt ? (
            <div
              style={{
                position: 'absolute',
                left: (cardRight + nbX) / 2 - 1,
                top: CARD_Y,
                width: 2,
                height: 140,
                background: C.ink700,
                opacity: enter(frame, t.resultAt + 6, { duration: 10 }).opacity,
              }}
            />
          ) : null}

          <div style={{ position: 'absolute', left: nbX, top: NB_TOP, transform: `scale(${nbS})`, transformOrigin: '0 0', ...dimStyle(nbD) }}>
            {[0, 1].map((k) => (
              <Neighbour key={k} frame={frame} at={t.resultAt + 8 + k * 6} top={k * NB_ROW_GAP} lock={lock} glow={lockPulse} />
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

/** A redacted neighbour on the same IP, reserved for Lab 3A. */
function Neighbour({ frame, at, top, lock, glow }: { frame: number; at: number; top: number; lock: boolean; glow: number }) {
  if (frame < at) return null;
  return (
    <div style={{ position: 'absolute', left: 0, top, height: NB_ROW_H, display: 'flex', alignItems: 'center', gap: 14, ...enter(frame, at, { distance: 12, duration: 10 }) }}>
      <Icon name={lock ? 'lock' : 'globe'} size={30} color={lock ? C.cyan : C.faint} />
      <RedactBar width={NB_BAR} height={28} color={lock ? C.cyan : C.muted} glow={glow} />
      <LabTag lock={lock} glow={glow}>
        Lab 3A
      </LabTag>
    </div>
  );
}

function LabTag({ lock, glow, children }: { lock: boolean; glow: number; children: ReactNode }) {
  if (!lock) {
    return <span style={{ fontFamily: FONT.mono, fontSize: TYPE.small, fontWeight: 650, color: C.muted, whiteSpace: 'nowrap' }}>({children})</span>;
  }
  return (
    <Pill color={C.cyan} size={34} icon="flag" glow={glow}>
      {children}
    </Pill>
  );
}
