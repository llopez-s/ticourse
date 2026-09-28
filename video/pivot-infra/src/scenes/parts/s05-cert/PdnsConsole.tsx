import type { ReactNode } from 'react';
import { C, FONT, TYPE, alpha } from '../../../../../engine/src/theme/tokens';
import { enter, pulse } from '../../../../../engine/src/theme/motion';
import { Chip, Icon, MonoLine, Panel, type MonoToken } from '../../../../../engine/src/ui';
import { CANON, Pill, RedactBar } from './bits';
import { RIGHT_W, RIGHT_X } from './Scan';

export const CONSOLE_Y = 352;
export const CONSOLE_H = 660 - CONSOLE_Y;
const HEADER_H = 64;
const PAD_X = 26;
const PAD_TOP = 16;
/** Body-local top of the phishing result row. */
const ROW_A_Y = 96;
const RIGHT_COL_X = 750;

/** Stage-local top-left of the phishing domain text (for the copy that flies to the conclusion). */
export const PHISH_POS = { x: RIGHT_X + PAD_X - 12 + 2 + 12 + 44, y: CONSOLE_Y + 2 + HEADER_H + 2 + PAD_TOP + ROW_A_Y - 10 + 2 + 16 } as const;

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

/**
 * «Se lo preguntas al listín con memoria»: the passive DNS console (same look
 * as s03 — a Panel with mono lines) asked who lives on 141.98.6.10. One answer
 * is readable, the phishing portal against Meridian; the two neighbours stay
 * redacted for Lab 3A. No first/last-seen dates: canon has none for them.
 */
export function PdnsConsole({ frame, fps, t, phishGlow }: { frame: number; fps: number; t: ConsoleTiming; phishGlow: number }) {
  if (frame < t.openAt - 2) return null;
  const cmd: MonoToken[] = [
    { t: '$ ', c: C.emerald, bold: true },
    { t: 'pdns ip ' },
    { t: CANON.vpsIp, c: '#6ee7b7', bold: true },
  ];
  const cmdLen = cmd.reduce((n, k) => n + k.t.length, 0);
  const typed = frame < t.cmdAt ? 0 : Math.min(cmdLen, Math.floor(((frame - t.cmdAt) / fps) * 60));
  const lock = frame >= t.lockAt;
  const lockPulse = lock ? 0.45 + 0.55 * pulse(frame - t.lockAt, fps, 0.8) : 0;

  return (
    <div style={{ position: 'absolute', left: RIGHT_X, top: CONSOLE_Y, width: RIGHT_W, height: CONSOLE_H, ...enter(frame, t.openAt, { distance: 22, duration: 14 }) }}>
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
        <MonoLine tokens={cmd} size={28} visibleChars={typed} caret={frame >= t.cmdAt && typed < cmdLen} />
        {frame >= t.resultAt - 4 ? (
          <MonoLine tokens={[{ t: '3 dominios han resuelto a esta IP', c: C.faint }]} size={TYPE.micro} style={{ marginTop: 2, ...enter(frame, t.resultAt - 4, { distance: 6, duration: 8 }) }} />
        ) : null}

        {/* The readable answer: the phishing portal. */}
        {frame >= t.resultAt ? (
          <div
            style={{
              position: 'absolute',
              left: PAD_X - 12,
              top: PAD_TOP + ROW_A_Y - 10,
              width: RIGHT_COL_X - 36,
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
        ) : null}

        {/* Divider between the answer and the redacted neighbours. */}
        {frame >= t.resultAt ? (
          <div style={{ position: 'absolute', left: RIGHT_COL_X - 12, top: PAD_TOP + ROW_A_Y - 10, width: 2, height: 132, background: C.ink700, opacity: enter(frame, t.resultAt + 6, { duration: 10 }).opacity }} />
        ) : null}

        {[0, 1].map((k) => (
          <Neighbour key={k} frame={frame} at={t.resultAt + 8 + k * 6} top={PAD_TOP + ROW_A_Y - 6 + k * 66} lock={lock} glow={lockPulse} />
        ))}
      </Panel>
    </div>
  );
}

/** A redacted neighbour on the same IP, reserved for Lab 3A. */
function Neighbour({ frame, at, top, lock, glow }: { frame: number; at: number; top: number; lock: boolean; glow: number }) {
  if (frame < at) return null;
  return (
    <div style={{ position: 'absolute', left: RIGHT_COL_X + 14, top, height: 54, display: 'flex', alignItems: 'center', gap: 14, ...enter(frame, at, { distance: 12, duration: 10 }) }}>
      <Icon name={lock ? 'lock' : 'globe'} size={30} color={lock ? C.cyan : C.faint} />
      <RedactBar width={200} height={28} color={lock ? C.cyan : C.muted} glow={glow} />
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
    <Pill color={C.cyan} size={28} icon="flag" glow={glow}>
      {children}
    </Pill>
  );
}
