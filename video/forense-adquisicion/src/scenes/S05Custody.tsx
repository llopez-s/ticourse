import type { CSSProperties } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { enter, fadeIn, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, Stamp, type IconName } from '../../../engine/src/ui';
import { CASE, CUSTODY_ROWS, PEOPLE } from '../data/canon';
import { Stage, wordFrame } from './kit';

const BAG_W = 440;
const FORM_LEFT = BAG_W + 44;
const FORM_W = 1728 - FORM_LEFT;
const FORM_H = 470;
const COLS = [
  { key: 'n', label: '#', w: 40 },
  { key: 'when', label: 'Fecha/hora', w: 190 },
  { key: 'from', label: 'Entregado por', w: 225 },
  { key: 'to', label: 'Recibido por', w: 245 },
  { key: 'why', label: 'Motivo', w: 0 },
] as const;
type ColKey = (typeof COLS)[number]['key'];

/**
 * S05 «Cadena de custodia»: the sealed bag, the form that records who had it,
 * when, from whom, to whom and why; a hypothetical night in an open drawer that
 * can make it inadmissible even with matching hashes; hash vs chain.
 */
export function S05Custody(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const S = 's05-custody';
  const bag = props.cue('bag');
  const rows = props.cue('rows');
  const gap = props.cue('gap');
  const inadmissible = props.cue('inadmissible');
  const hashVsChain = props.cue('hash-vs-chain');
  const hashStill = wordFrame(S, 's05-03', 'coincida');
  const neither = wordFrame(S, 's05-04', 'ninguno');

  // Column highlight follows «quién · cuándo · de quién · a quién · por qué».
  const beats: { key: ColKey; at: number }[] = [
    { key: 'to', at: wordFrame(S, 's05-02', 'quien', 0) },
    { key: 'when', at: wordFrame(S, 's05-02', 'cuando') },
    { key: 'from', at: wordFrame(S, 's05-02', 'quien', 1) },
    { key: 'to', at: wordFrame(S, 's05-02', 'quien', 2) },
    { key: 'why', at: wordFrame(S, 's05-02', 'que') },
  ];
  const active = [...beats].reverse().find((b) => frame >= b.at - 2 && frame < gap - 20)?.key ?? null;

  const bagIn = springIn(frame, fps, bag - 8, { damping: 16 });
  const formIn = enter(frame, rows - 24, { distance: 24, axis: 'x' });
  const gapIn = progress(frame, gap - 4, 16);
  const bottomIn = enter(frame, hashVsChain - 6, { distance: 20 });
  const formDim = 1 - 0.55 * progress(frame, hashVsChain - 10, 16);

  return (
    <Stage>
      {/* The evidence bag */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: BAG_W, height: FORM_H, opacity: Math.min(1, bagIn * 1.4), transform: `scale(${0.92 + 0.08 * bagIn})` }}>
        <EvidenceBag frame={frame} fps={fps} sealAt={bag + 24} gap={gapIn} />
      </div>

      {/* The custody form */}
      <div style={{ position: 'absolute', left: FORM_LEFT, top: 0, width: FORM_W, height: FORM_H, opacity: formIn.opacity * formDim, transform: formIn.transform }}>
        <div
          style={{
            height: '100%',
            boxSizing: 'border-box',
            borderRadius: RADIUS.lg,
            border: `2px solid ${C.ink700}`,
            background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
            padding: '18px 24px',
            fontFamily: FONT.sans,
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Icon name="file" size={32} color={C.cyan} />
            <span style={{ fontSize: TYPE.label, fontWeight: 750, color: C.textStrong }}>Cadena de custodia</span>
            {/* The hash still matches, and that does not save the evidence */}
            <span style={{ marginLeft: 'auto', ...enter(frame, hashStill - 4, { distance: 8 }) }}>
              <Chip accent="emerald" icon="check" size={TYPE.small}>
                hash: coincide
              </Chip>
            </span>
            <span style={{ fontFamily: FONT.mono, fontSize: TYPE.small, color: C.muted }}>
              {CASE.id} · {CASE.evidence}
            </span>
          </div>
          {/* Header row */}
          <div style={{ display: 'flex', marginTop: 16, paddingBottom: 8, borderBottom: `2px solid ${C.ink600}` }}>
            {COLS.map((c) => (
              <div
                key={c.key}
                style={{
                  flex: c.w ? `0 0 ${c.w}px` : 1,
                  fontSize: TYPE.micro,
                  fontWeight: 800,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  color: active === c.key ? C.ink950 : C.muted,
                  background: active === c.key ? C.cyan : 'transparent',
                  borderRadius: 8,
                  padding: '4px 8px',
                  marginRight: 6,
                }}
              >
                {c.label}
              </div>
            ))}
          </div>
          {CUSTODY_ROWS.map((row, k) => (
            <div key={row.n}>
              {k === 3 ? <GapRow frame={frame} gap={gapIn} /> : null}
              <FormRow row={row} active={active} style={enter(frame, rows + k * 10, { distance: 10 })} />
            </div>
          ))}
          <div style={{ position: 'absolute', right: 40, bottom: 26 }}>
            <Stamp frame={frame} at={inadmissible} accent="rose" rotate={-7} size={54}>
              Inadmisible
            </Stamp>
          </div>
        </div>
      </div>

      {/* Hash vs chain */}
      <div style={{ position: 'absolute', left: 0, top: FORM_H + 26, width: 1728, height: 660 - FORM_H - 26, display: 'flex', alignItems: 'stretch', gap: 24, ...bottomIn }}>
        <Proof icon="key" accent={C.cyan} title="Hash" text="los datos no cambiaron" />
        <div style={{ display: 'grid', placeItems: 'center', fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 750, lineHeight: 1.2, color: C.textStrong, textAlign: 'center', width: 300, opacity: fadeIn(frame, neither - 2, 12) }}>
          Ninguno sustituye al otro
        </div>
        <Proof icon="users" accent={C.emerald} title="Cadena" text="quién tuvo el objeto" />
      </div>
    </Stage>
  );
}

function FormRow({ row, active, style }: { row: (typeof CUSTODY_ROWS)[number]; active: ColKey | null; style?: CSSProperties }) {
  const cell = (key: ColKey, text: string | number, w: number) => (
    <div
      key={key}
      style={{
        flex: w ? `0 0 ${w}px` : 1,
        padding: '0 8px',
        marginRight: 6,
        fontSize: TYPE.small,
        fontFamily: key === 'when' ? FONT.mono : FONT.sans,
        color: active === key ? C.textStrong : C.text,
        fontWeight: active === key ? 700 : 500,
        background: active === key ? alpha(C.cyan, 0.12) : 'transparent',
        borderRadius: 6,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {text}
    </div>
  );
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: 58, borderBottom: `1px solid ${C.ink700}`, ...style }}>
      {cell('n', row.n, 40)}
      {cell('when', row.when, 190)}
      {cell('from', row.from, 225)}
      {cell('to', row.to, 245)}
      {cell('why', row.why, 0)}
    </div>
  );
}

/** The hypothetical gap: a night in an unlocked drawer that nobody wrote down. */
function GapRow({ frame, gap }: { frame: number; gap: number }) {
  if (gap <= 0) return null;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        height: 58 * gap,
        overflow: 'hidden',
        margin: '4px 0',
        padding: '0 12px',
        borderRadius: 10,
        border: `3px dashed ${alpha(C.rose, 0.85)}`,
        background: alpha(C.rose, 0.08),
        fontFamily: FONT.sans,
        opacity: gap,
      }}
    >
      <Chip accent="amber" size={TYPE.micro}>
        SUPUESTO
      </Chip>
      <span style={{ fontFamily: FONT.mono, fontSize: TYPE.small, color: C.roseSoft }}>¿?</span>
      <span style={{ fontSize: TYPE.small, fontWeight: 700, color: C.roseSoft }}>Una noche en un cajón sin cerrar</span>
      <span style={{ marginLeft: 'auto', fontSize: TYPE.small, color: C.rose, opacity: 0.5 + 0.5 * pulse(frame, 30, 0.8) }}>sin anotar</span>
    </div>
  );
}

function EvidenceBag({ frame, fps, sealAt, gap }: { frame: number; fps: number; sealAt: number; gap: number }) {
  const seal = springIn(frame, fps, sealAt, { damping: 14 });
  return (
    <div
      style={{
        position: 'relative',
        height: '100%',
        boxSizing: 'border-box',
        borderRadius: 28,
        border: `3px solid ${gap > 0.5 ? alpha(C.rose, 0.6) : alpha(C.muted, 0.5)}`,
        background: `linear-gradient(180deg, ${alpha(C.sky, 0.1)} 0%, ${alpha(C.ink800, 0.9)} 40%)`,
        fontFamily: FONT.sans,
        padding: '26px 28px',
      }}
    >
      {/* zip strip */}
      <div style={{ height: 14, borderRadius: 7, background: `repeating-linear-gradient(90deg, ${C.ink600} 0 10px, ${C.ink700} 10px 18px)` }} />
      <div style={{ marginTop: 16, fontSize: TYPE.micro, fontWeight: 800, letterSpacing: 3, color: C.muted }}>BOLSA ANTIESTÁTICA</div>
      <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
        <Icon name="database" size={52} color={C.amber} />
        <div>
          <div style={{ fontFamily: FONT.mono, fontSize: TYPE.label, fontWeight: 700, color: C.textStrong }}>{CASE.evidence}</div>
          <div style={{ fontSize: TYPE.micro, color: C.muted }}>
            {CASE.device} · S/N {CASE.serial}
          </div>
        </div>
      </div>
      <BagLine icon="clock" text="04-09 · 04:12" />
      <BagLine icon="user" text={`Incauta: ${PEOPLE.seizer}`} />
      <BagLine icon="eye" text={`Testigo: ${PEOPLE.witness}`} />
      {/* The seal */}
      <div
        style={{
          position: 'absolute',
          right: 26,
          bottom: 26,
          width: 150,
          height: 150,
          borderRadius: 75,
          display: 'grid',
          placeItems: 'center',
          textAlign: 'center',
          background: alpha(C.rose, 0.16),
          border: `4px solid ${C.rose}`,
          transform: `scale(${seal}) rotate(-10deg)`,
          color: C.roseSoft,
        }}
      >
        <div>
          <div style={{ fontSize: TYPE.micro, fontWeight: 800, letterSpacing: 2 }}>PRECINTO</div>
          <div style={{ fontFamily: FONT.mono, fontSize: TYPE.h3, fontWeight: 800 }}>{CASE.sealSeizure}</div>
        </div>
      </div>
    </div>
  );
}

function BagLine({ icon, text }: { icon: IconName; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14, fontSize: TYPE.small, color: C.text }}>
      <Icon name={icon} size={28} color={C.muted} />
      {text}
    </div>
  );
}

function Proof({ icon, accent, title, text }: { icon: IconName; accent: string; title: string; text: string }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '0 28px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(accent, 0.6)}`,
        background: alpha(accent, 0.08),
        fontFamily: FONT.sans,
      }}
    >
      <Icon name={icon} size={46} color={accent} />
      <span style={{ fontSize: TYPE.body, fontWeight: 800, color: C.textStrong }}>{title}</span>
      <span style={{ fontSize: TYPE.label, color: C.text }}>{text}</span>
    </div>
  );
}
