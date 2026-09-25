import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { enter, lerp, progress, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, MonoLine, Panel, type IconName, type MonoToken } from '../../../engine/src/ui';
import { CASE, HASH_ROWS } from '../data/canon';
import { Stage, wordFrame } from './kit';

const LEFT_W = 1080;
const CHAIN_H = 118;
const TERM_TOP = CHAIN_H + 22;
const RIGHT_LEFT = LEFT_W + 40;
const RIGHT_W = 1728 - RIGHT_LEFT;

/**
 * S03 «Demo: imagen bit a bit»: write blocker, hash of the original, sector-by-
 * sector E01 acquisition (unallocated space and deleted files included), the
 * hash over the acquired data, the original re-hashed, three matching values,
 * the original re-sealed and the analysis moved to a working copy.
 */
export function S03Image(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const S = 's03-image';
  const blocker = props.cue('blocker');
  const hashOrig = props.cue('hash-orig');
  const acquire = props.cue('acquire');
  const hashImg = props.cue('hash-img');
  const match = props.cue('match');
  const workCopy = props.cue('work-copy');
  const unallocated = wordFrame(S, 's03-03', 'asignado');
  const deleted = wordFrame(S, 's03-03', 'borrados');
  const rehash = wordFrame(S, 's03-04', 'original');
  const reseal = wordFrame(S, 's03-05', 'precintar');
  const acquireEnd = wordFrame(S, 's03-03', 'carpetas');

  const chainIn = enter(frame, 20, { distance: 18 });
  const termIn = enter(frame, blocker - 30, { distance: 24 });
  const ledgerIn = enter(frame, hashOrig - 10, { distance: 24, axis: 'x' });

  const hashAt = [hashOrig + 40, hashImg + 44, rehash + 30];

  return (
    <Stage>
      {/* Device chain: evidence disk -> write blocker -> forensic workstation */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: LEFT_W, height: CHAIN_H, display: 'flex', alignItems: 'center', gap: 0, ...chainIn }}>
        <Device icon="database" title={CASE.evidence} sub={`S/N ${CASE.serial}`} accent={C.amber} />
        <Wire lit={progress(frame, blocker, 14)} />
        <Device
          icon="lock"
          title={`Write blocker ${CASE.blocker}`}
          sub="solo lectura"
          accent={C.cyan}
          glow={progress(frame, blocker, 14) * (1 - progress(frame, hashOrig + 30, 30))}
        />
        <Wire lit={progress(frame, blocker + 8, 14)} />
        <Device icon="terminal" title="Estación forense" sub="laboratorio" accent={C.muted} />
      </div>

      {/* Terminal */}
      <div style={{ position: 'absolute', left: 0, top: TERM_TOP, width: LEFT_W, height: 660 - TERM_TOP, ...termIn }}>
        <Panel title="lab-forense · IR-2026-0147" icon="terminal" accent="cyan" style={{ height: '100%' }} bodyStyle={{ padding: '18px 26px' }}>
          <Terminal
            frame={frame}
            fps={fps}
            t={{ blocker, hashOrig, acquire, acquireEnd, unallocated, deleted, hashImg, rehash }}
          />
        </Panel>
      </div>

      {/* Integrity ledger */}
      <div style={{ position: 'absolute', left: RIGHT_LEFT, top: 0, width: RIGHT_W, height: 660, ...ledgerIn }}>
        <Panel
          title="Integridad"
          icon="key"
          accent={frame >= match ? 'emerald' : 'cyan'}
          glow={progress(frame, match, 10) * (1 - progress(frame, match + 50, 30))}
          right={
            <span style={{ ...enter(frame, match + 22, { distance: 8 }) }}>
              <Chip accent="emerald" icon="check" size={TYPE.small} solid>
                3 de 3 coinciden
              </Chip>
            </span>
          }
          style={{ height: 452 }}
          bodyStyle={{ padding: '14px 24px' }}
        >
          {HASH_ROWS.map((row, k) => (
            <HashRow key={row.key} frame={frame} fps={fps} at={hashAt[k]} match={match + k * 6} label={row.label} time={row.time} hash={CASE.hash} />
          ))}
        </Panel>
        <div style={{ position: 'absolute', left: 0, top: 472, width: RIGHT_W, display: 'grid', gap: 14 }}>
          <Outcome frame={frame} at={reseal} icon="lock" title="Original" detail={`precinto ${CASE.sealVault}`} accent={C.amber} />
          <Outcome frame={frame} at={workCopy} icon="search" title="Copia de trabajo" detail="aquí se analiza" accent={C.emerald} strong />
        </div>
      </div>
    </Stage>
  );
}

function Device({ icon, title, sub, accent, glow = 0 }: { icon: IconName; title: string; sub: string; accent: string; glow?: number }) {
  return (
    <div
      style={{
        flex: '0 0 auto',
        height: CHAIN_H,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 16px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${glow > 0 ? alpha(accent, 0.4 + 0.5 * glow) : C.ink700}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        boxShadow: glow > 0 ? `0 0 ${36 * glow}px ${alpha(accent, 0.4 * glow)}` : 'none',
        fontFamily: FONT.sans,
      }}
    >
      <Icon name={icon} size={38} color={accent} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: TYPE.small, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap' }}>{title}</div>
        <div style={{ fontSize: TYPE.micro, color: C.muted, whiteSpace: 'nowrap' }}>{sub}</div>
      </div>
    </div>
  );
}

function Wire({ lit }: { lit: number }) {
  return (
    <div style={{ flex: 1, minWidth: 24, height: 6, margin: '0 8px', borderRadius: 3, background: C.ink700, overflow: 'hidden' }}>
      <div style={{ width: `${lit * 100}%`, height: '100%', background: C.cyan, boxShadow: `0 0 12px ${alpha(C.cyan, 0.8)}` }} />
    </div>
  );
}

type TermTiming = {
  blocker: number;
  hashOrig: number;
  acquire: number;
  acquireEnd: number;
  unallocated: number;
  deleted: number;
  hashImg: number;
  rehash: number;
};

const P = (time: string): MonoToken[] => [
  { t: `[${time}] `, c: C.faint },
  { t: '$ ', c: C.emerald, bold: true },
];

function Terminal({ frame, fps, t }: { frame: number; fps: number; t: TermTiming }) {
  const SIZE = 25;
  const lines: { at: number; tokens: MonoToken[]; typed?: boolean }[] = [
    { at: t.blocker + 6, tokens: [...P('05:40'), { t: 'lsblk -o NAME,SIZE,RO,SERIAL /dev/sdb' }], typed: true },
    { at: t.blocker + 40, tokens: [{ t: 'sdb   476.9G   ' }, { t: 'RO=1', c: C.ink950, bg: C.cyan, bold: true }, { t: `   ${CASE.serial}` }] },
    { at: t.hashOrig, tokens: [...P('05:41'), { t: 'sha256sum /dev/sdb' }], typed: true },
    { at: t.hashOrig + 36, tokens: [{ t: CASE.hash, c: C.cyanSoft, bold: true }, { t: '  /dev/sdb', c: C.muted }] },
    { at: t.acquire - 4, tokens: [...P('05:44'), { t: `ewfacquire -d sha256 -t ${CASE.evidence} /dev/sdb` }], typed: true },
  ];
  const after: { at: number; tokens: MonoToken[]; typed?: boolean }[] = [
    { at: t.acquireEnd + 10, tokens: [{ t: `${CASE.evidence}.E01 … .E12 · ${CASE.fragments} fragmentos · ${CASE.sizeGiB} GiB`, c: C.muted }] },
    { at: t.hashImg - 2, tokens: [...P('07:58'), { t: `ewfverify -d sha256 ${CASE.image}` }], typed: true },
    { at: t.hashImg + 40, tokens: [{ t: 'SHA256 de los datos: ', c: C.muted }, { t: CASE.hash, c: C.cyanSoft, bold: true }] },
    { at: t.rehash - 4, tokens: [...P('08:02'), { t: 'sha256sum /dev/sdb' }], typed: true },
    { at: t.rehash + 26, tokens: [{ t: CASE.hash, c: C.cyanSoft, bold: true }, { t: '  /dev/sdb', c: C.muted }] },
  ];
  // Scroll the older lines away once the verification starts.
  const scroll = lerp(frame, [t.hashImg - 20, t.hashImg], [0, 1]);
  const lineH = SIZE * 1.45;
  const render = (l: { at: number; tokens: MonoToken[]; typed?: boolean }, key: string) => {
    if (frame < l.at) return null;
    const len = l.tokens.reduce((a, x) => a + x.t.length, 0);
    // Commands are typed at 60 characters per second; output lines appear whole.
    const visible = l.typed ? Math.min(len, Math.floor(((frame - l.at) / fps) * 60)) : undefined;
    return <MonoLine key={key} tokens={l.tokens} size={SIZE} visibleChars={visible} caret={l.typed && (visible ?? 0) < len} />;
  };
  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <div style={{ transform: `translateY(${-scroll * lineH * 4}px)` }}>
        {lines.map((l, k) => render(l, `a${k}`))}
        {frame >= t.acquire + 10 ? <SectorMap frame={frame} t={t} /> : null}
        {after.map((l, k) => render(l, `b${k}`))}
      </div>
    </div>
  );
}

const COLS = 40;
const ROWS = 3;
/** Sector kinds: 0 used, 1 unallocated, 2 deleted file. Deterministic layout. */
const KIND = Array.from({ length: COLS * ROWS }, (_, i) => {
  const h = (i * 37 + 11) % 23;
  return h < 4 ? 2 : h < 11 ? 1 : 0;
});

function SectorMap({ frame, t }: { frame: number; t: TermTiming }) {
  const done = lerp(frame, [t.acquire + 10, t.acquireEnd], [0, KIND.length]);
  const pct = Math.round((100 * done) / KIND.length);
  const hlUnalloc = progress(frame, t.unallocated - 6, 10);
  const hlDeleted = progress(frame, t.deleted - 6, 10);
  const colour = (k: number) => (k === 2 ? C.amber : k === 1 ? C.ink500 : C.cyan);
  return (
    <div style={{ margin: '8px 0 10px', fontFamily: FONT.sans }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: 4, width: 1000 }}>
        {KIND.map((k, i) => {
          const copied = i < done;
          const emph = (k === 1 && hlUnalloc > 0) || (k === 2 && hlDeleted > 0);
          return (
            <div
              key={i}
              style={{
                height: 16,
                borderRadius: 3,
                background: copied ? colour(k) : 'transparent',
                border: `1.5px solid ${alpha(colour(k), copied ? 1 : 0.35)}`,
                boxShadow: emph && copied ? `0 0 10px ${alpha(colour(k), 0.9)}` : 'none',
              }}
            />
          );
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 10, fontSize: TYPE.micro, color: C.muted }}>
        <span style={{ fontFamily: FONT.mono, color: pct >= 100 ? C.emerald : C.text, fontWeight: 700 }}>sector a sector · {pct} %</span>
        <Legend colour={C.cyan} label="en uso" />
        <Legend colour={C.ink500} label="no asignado" strong={hlUnalloc} />
        <Legend colour={C.amber} label="borrados" strong={hlDeleted} />
      </div>
    </div>
  );
}

function Legend({ colour, label, strong = 0 }: { colour: string; label: string; strong?: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: strong > 0 ? C.textStrong : C.muted, fontWeight: strong > 0 ? 700 : 500 }}>
      <span style={{ width: 16, height: 16, borderRadius: 3, background: colour }} />
      {label}
    </span>
  );
}

function HashRow({ frame, fps, at, match, label, time, hash }: { frame: number; fps: number; at: number; match: number; label: string; time: string; hash: string }) {
  const inn = enter(frame, at, { distance: 14 });
  const ok = springIn(frame, fps, match, { damping: 14 });
  return (
    <div style={{ padding: '12px 0', borderBottom: `2px solid ${C.ink700}`, fontFamily: FONT.sans, ...inn }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span style={{ fontSize: TYPE.small, fontWeight: 650, color: C.text }}>{label}</span>
        <span style={{ marginLeft: 'auto', fontSize: TYPE.micro, fontFamily: FONT.mono, color: C.faint }}>{time}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6 }}>
        <span style={{ fontFamily: FONT.mono, fontSize: TYPE.label, fontWeight: 700, color: C.cyanSoft }}>{hash}</span>
        {frame >= match ? (
          <span style={{ marginLeft: 'auto', opacity: Math.min(1, ok * 1.3), transform: `scale(${0.7 + 0.3 * ok})` }}>
            <Chip accent="emerald" icon="check" size={TYPE.micro} solid>
              MATCH
            </Chip>
          </span>
        ) : null}
      </div>
    </div>
  );
}

function Outcome({ frame, at, icon, title, detail, accent, strong = false }: { frame: number; at: number; icon: IconName; title: string; detail: string; accent: string; strong?: boolean }) {
  const inn = enter(frame, at - 4, { distance: 14 });
  return (
    <div
      style={{
        height: 80,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '0 22px',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(accent, strong ? 0.8 : 0.5)}`,
        background: alpha(accent, strong ? 0.14 : 0.08),
        fontFamily: FONT.sans,
        ...inn,
      }}
    >
      <Icon name={icon} size={36} color={accent} />
      <span style={{ fontSize: TYPE.label, fontWeight: 750, color: C.textStrong }}>{title}</span>
      <span style={{ marginLeft: 'auto', fontSize: TYPE.small, color: C.text }}>{detail}</span>
    </div>
  );
}
