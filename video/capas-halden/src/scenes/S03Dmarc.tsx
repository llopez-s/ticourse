import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon, MonoLine, Panel, type IconName, type MonoToken } from '../../../engine/src/ui';
import { Stage, wordFrame } from './kit';

const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/* ---- Phase 1: the three-mechanism chain (big cards -> compact chips) ---- */
const CARD_W = 540;
const CARD_GAP = 27;
const CARD_LEFT0 = 27;
const CHIP_W = 260;
const CHIP_GAP = 24;
const CHIP_LEFT0 = (1728 - (3 * CHIP_W + 2 * CHIP_GAP)) / 2;
/** Both states share the same top: nothing in this scene draws above y 210
 * (stage-local), which keeps the whole think/intercept safe zone (y 0-210) clear. */
const CARD_TOP = 210;
const CARD_H = 450;
const CHIP_H = 76;
const COMPACT_START = 750;
const COMPACT_DUR = 130;

const cardLeft = (i: number) => CARD_LEFT0 + i * (CARD_W + CARD_GAP);
const chipLeft = (i: number) => CHIP_LEFT0 + i * (CHIP_W + CHIP_GAP);

/* ---- Phase 2: dig demo + policy ladder ---- */
const MAIN_TOP = 310;
const MAIN_H = 350;
const TERMINAL_W = 950;
const LADDER_LEFT = TERMINAL_W + 48;
const LADDER_W = 1728 - LADDER_LEFT;
const PHASE2_AT = 850;

/**
 * S03 «Tres mecanismos encadenados»: SPF (authorized senders), DKIM (a domain
 * signature) and DMARC (From alignment + policy + reports) build up as a
 * chain, then compact so a `dig` demo can show the published policy (p=none)
 * stepping up to quarantine and reject. Keeps y 0-210 empty throughout: the
 * SILENT PAGER intercept lands there during the p=none beat.
 */
export function S03Dmarc(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const S = 's03-dmarc';
  const spfAt = props.cue('spf');
  const dkimAt = props.cue('dkim');
  const dmarcAt = props.cue('dmarc-align');
  const policyAt = props.cue('policy');
  const reportsAt = props.cue('reports');
  const rejectAt = props.cue('reject');
  const noAlignAt = wordFrame(S, 's03-03', 'Ninguno');
  const quarantineAt = wordFrame(S, 's03-06', 'quarantine');
  const gatewayAt = wordFrame(S, 's03-07', 'terreno');

  const compact = progress(frame, COMPACT_START, COMPACT_DUR, EASE.inOut);
  const termIn = enter(frame, PHASE2_AT, { distance: 22, axis: 'y' });
  const ladderIn = enter(frame, PHASE2_AT + 12, { distance: 22, axis: 'y' });

  return (
    <Stage>
      {/* Phase 1: the chain */}
      <ChainCard
        frame={frame}
        fps={fps}
        index={0}
        at={spfAt}
        compact={compact}
        icon="globe"
        title="SPF"
        accent="cyan"
      >
        <CardBody
          headline="La lista de mensajeros autorizados"
          text="Registro DNS con las IP que pueden enviar en nombre de un dominio."
          code={['haldenport.example. TXT', '"v=spf1 ip4:203.0.113.10 -all"']}
          frame={frame}
          tagAt={noAlignAt}
          tagOk={false}
        />
      </ChainCard>
      <ChainCard
        frame={frame}
        fps={fps}
        index={1}
        at={dkimAt}
        compact={compact}
        icon="key"
        title="DKIM"
        accent="cyan"
      >
        <CardBody
          headline="El sello de lacre de un dominio"
          text="Firma que dice qué dominio firmó y que el mensaje no cambió después."
          code={['DKIM-Signature: d=hdn-mailer.example;', 's=selector1; b=k8f3Qz...']}
          frame={frame}
          tagAt={noAlignAt}
          tagOk={false}
        />
      </ChainCard>
      <ChainCard
        frame={frame}
        fps={fps}
        index={2}
        at={dmarcAt}
        compact={compact}
        icon="shield"
        title="DMARC"
        accent="cyan"
        glow={progress(frame, dmarcAt, 10) * (1 - progress(frame, COMPACT_START, 16))}
      >
        <CardBody
          headline="Exige que el From coincida"
          text="Compara el remitente visible con el dominio que validó SPF o DKIM."
          code={['From (visible): haldenport.example', 'Validado SPF/DKIM: hdn-mailer.example']}
          codeAccent={C.rose}
          frame={frame}
          tagAt={dmarcAt}
          tagOk
        />
      </ChainCard>
      <ChainArrow frame={frame} index={0} compact={compact} appearAt={dkimAt} />
      <ChainArrow frame={frame} index={1} compact={compact} appearAt={dmarcAt} />

      {/* Phase 2: DNS demo + policy ladder */}
      <div style={{ position: 'absolute', left: 0, top: MAIN_TOP, width: TERMINAL_W, height: MAIN_H, ...termIn }}>
        <Panel
          title="lucia@ops:~$ dig TXT _dmarc.haldenport.example"
          icon="terminal"
          accent="cyan"
          style={{ height: '100%' }}
          bodyStyle={{ padding: '20px 24px' }}
        >
          <Terminal frame={frame} fps={fps} appearAt={PHASE2_AT} policyAt={policyAt} reportsAt={reportsAt} />
        </Panel>
      </div>
      <div style={{ position: 'absolute', left: LADDER_LEFT, top: MAIN_TOP, width: LADDER_W, height: MAIN_H, ...ladderIn }}>
        <Panel
          title="Política DMARC"
          icon="shield"
          accent={frame >= rejectAt ? 'emerald' : 'amber'}
          style={{ height: '100%' }}
          bodyStyle={{ padding: '14px 22px' }}
        >
          <Ladder frame={frame} fps={fps} appearAt={PHASE2_AT + 20} noneAt={policyAt} quarantineAt={quarantineAt} rejectAt={rejectAt} />
        </Panel>
      </div>

      <GatewayNote frame={frame} at={gatewayAt} />
    </Stage>
  );
}

function ChainCard({
  frame,
  fps,
  index,
  at,
  compact,
  icon,
  title,
  accent,
  glow = 0,
  children,
}: {
  frame: number;
  fps: number;
  index: number;
  at: number;
  compact: number;
  icon: IconName;
  title: string;
  accent: 'cyan';
  glow?: number;
  children: ReactNode;
}) {
  const shown = progress(frame, at, 14, EASE.out);
  if (shown <= 0) return null;
  const pop = springIn(frame, fps, at, { damping: 14, mass: 0.75 });
  const left = mix(cardLeft(index), chipLeft(index), compact);
  const width = mix(CARD_W, CHIP_W, compact);
  const height = mix(CARD_H, CHIP_H, compact);
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: CARD_TOP,
        width,
        height,
        opacity: shown,
        transform: `scale(${0.92 + 0.08 * Math.min(1, pop)})`,
      }}
    >
      <Panel title={title} icon={icon} accent={accent} glow={glow} style={{ height: '100%' }} bodyStyle={{ padding: '22px 26px', opacity: Math.max(0, 1 - compact * 1.4) }}>
        {children}
      </Panel>
    </div>
  );
}

function CardBody({
  headline,
  text,
  code,
  codeAccent = C.cyanSoft,
  frame,
  tagAt,
  tagOk,
}: {
  headline: string;
  text: string;
  code: string[];
  codeAccent?: string;
  frame: number;
  tagAt: number;
  tagOk: boolean;
}) {
  return (
    <div style={{ fontFamily: FONT.sans }}>
      <div style={{ fontSize: TYPE.h3, fontWeight: 800, color: C.textStrong, lineHeight: 1.2 }}>{headline}</div>
      <div style={{ fontSize: TYPE.small, color: C.text, marginTop: 12, lineHeight: 1.45 }}>{text}</div>
      <div
        style={{
          marginTop: 18,
          padding: '12px 14px',
          borderRadius: RADIUS.md,
          background: alpha(C.ink900, 0.7),
          border: `2px solid ${C.ink700}`,
          overflow: 'hidden',
        }}
      >
        {code.map((line, i) => (
          <MonoLine key={i} tokens={[{ t: line, c: i === 0 ? C.muted : codeAccent }]} size={18} />
        ))}
      </div>
      <AlignTag frame={frame} at={tagAt} ok={tagOk} />
    </div>
  );
}

function AlignTag({ frame, at, ok }: { frame: number; at: number; ok: boolean }) {
  const op = progress(frame, at, 10, EASE.out);
  if (op <= 0) return null;
  const color = ok ? C.emerald : C.rose;
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 16,
        padding: '6px 14px',
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(color, 0.6)}`,
        background: alpha(color, 0.12),
        opacity: op,
      }}
    >
      <Icon name={ok ? 'check' : 'x'} size={20} color={color} />
      <span style={{ fontSize: TYPE.small, fontWeight: 700, color: C.text, whiteSpace: 'nowrap' }}>
        {ok ? 'Exige que el From coincida' : 'No exige que el From coincida'}
      </span>
    </div>
  );
}

function ChainArrow({ frame, index, compact, appearAt }: { frame: number; index: number; compact: number; appearAt: number }) {
  const op = progress(frame, appearAt, 12, EASE.out);
  if (op <= 0) return null;
  const x = mix(cardLeft(index) + CARD_W + CARD_GAP / 2, chipLeft(index) + CHIP_W + CHIP_GAP / 2, compact);
  const y = CARD_TOP + mix(CARD_H, CHIP_H, compact) / 2;
  return (
    <div style={{ position: 'absolute', left: x - 14, top: y - 14, opacity: op }}>
      <Icon name="arrowRight" size={28} color={C.cyan} />
    </div>
  );
}

const P = (time: string): MonoToken[] => [
  { t: `[${time}] `, c: C.faint },
  { t: '$ ', c: C.emerald, bold: true },
];

function Terminal({
  frame,
  fps,
  appearAt,
  policyAt,
  reportsAt,
}: {
  frame: number;
  fps: number;
  appearAt: number;
  policyAt: number;
  reportsAt: number;
}) {
  const cmd = 'dig TXT _dmarc.haldenport.example +short';
  const typeAt = appearAt + 20;
  const typedLen = Math.max(0, Math.min(cmd.length, Math.floor(((frame - typeAt) / fps) * 55)));
  const showCmd = frame >= typeAt;
  const outputAt = typeAt + Math.ceil((cmd.length / 55) * fps) + 8;
  const outOp = progress(frame, outputAt, 12);
  return (
    <div>
      {showCmd ? (
        <MonoLine tokens={[...P('05:41'), { t: cmd.slice(0, typedLen) }]} size={24} caret={typedLen < cmd.length} />
      ) : null}
      {outOp > 0 ? (
        <div style={{ marginTop: 22, opacity: outOp }}>
          <MonoLine
            tokens={[
              { t: 'v=DMARC1; ', c: C.muted },
              { t: 'p=none', c: C.amber, bold: true, bg: frame >= policyAt ? alpha(C.amber, 0.22) : undefined },
              { t: '; ', c: C.muted },
              {
                t: 'rua=mailto:dmarc@haldenport.example',
                c: C.cyanSoft,
                bg: frame >= reportsAt ? alpha(C.cyan, 0.18) : undefined,
              },
            ]}
            size={24}
          />
        </div>
      ) : null}
    </div>
  );
}

function Ladder({
  frame,
  fps,
  appearAt,
  noneAt,
  quarantineAt,
  rejectAt,
}: {
  frame: number;
  fps: number;
  appearAt: number;
  noneAt: number;
  quarantineAt: number;
  rejectAt: number;
}) {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <LadderRow frame={frame} fps={fps} appearAt={appearAt} activeFrom={noneAt} doneFrom={quarantineAt} icon="unlock" label="p=none" sub="informa, no bloquea" color={C.amber} />
      <LadderRow frame={frame} fps={fps} appearAt={appearAt} activeFrom={quarantineAt} doneFrom={rejectAt} icon="alert" label="p=quarantine" sub="a spam o a cuarentena" color={C.amber} />
      <LadderRow frame={frame} fps={fps} appearAt={appearAt} activeFrom={rejectAt} icon="shield" label="p=reject" sub="rechazado en la puerta" color={C.emerald} />
    </div>
  );
}

function LadderRow({
  frame,
  fps,
  appearAt,
  activeFrom,
  doneFrom,
  icon,
  label,
  sub,
  color,
}: {
  frame: number;
  fps: number;
  appearAt: number;
  activeFrom: number;
  doneFrom?: number;
  icon: IconName;
  label: string;
  sub: string;
  color: string;
}) {
  const shown = progress(frame, appearAt, 12, EASE.out);
  if (shown <= 0) return null;
  const active = frame >= activeFrom && (doneFrom === undefined || frame < doneFrom);
  const done = doneFrom !== undefined && frame >= doneFrom;
  const pop = active ? springIn(frame, fps, activeFrom, { damping: 14, mass: 0.7 }) : 1;
  const state: 'idle' | 'active' | 'done' = active ? 'active' : done ? 'done' : 'idle';
  const border = state === 'idle' ? C.ink700 : alpha(color, state === 'active' ? 0.4 + 0.5 * Math.min(1, pop) : 0.45);
  const bg = state === 'idle' ? alpha(C.ink800, 0.6) : state === 'done' ? alpha(color, 0.08) : alpha(color, 0.16);
  const iconColor = state === 'idle' ? C.faint : color;
  const textColor = state === 'idle' ? C.muted : C.textStrong;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        height: 72,
        padding: '0 18px',
        borderRadius: RADIUS.md,
        border: `2px solid ${border}`,
        background: bg,
        opacity: shown,
        boxShadow: state === 'active' ? `0 0 ${22 * Math.min(1, pop)}px ${alpha(color, 0.3)}` : 'none',
        fontFamily: FONT.sans,
      }}
    >
      <Icon name={icon} size={28} color={iconColor} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: FONT.mono, fontSize: TYPE.label, fontWeight: 800, color: textColor, whiteSpace: 'nowrap' }}>{label}</div>
        <div style={{ fontSize: TYPE.micro, color: C.muted, marginTop: 2, whiteSpace: 'nowrap' }}>{sub}</div>
      </div>
      {done ? (
        <div style={{ marginLeft: 'auto' }}>
          <Icon name="check" size={24} color={alpha(color, 0.8)} />
        </div>
      ) : null}
    </div>
  );
}

function GatewayNote({ frame, at }: { frame: number; at: number }) {
  if (frame < at - 20) return null;
  const inn = enter(frame, at, { distance: 30 });
  return (
    <div style={{ position: 'absolute', left: 164, top: 552, width: 1400, ...inn }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          padding: '18px 30px',
          borderRadius: RADIUS.lg,
          border: `2px solid ${alpha(C.cyan, 0.5)}`,
          background: alpha(C.ink900, 0.94),
          boxShadow: `0 20px 50px ${alpha('#000000', 0.4)}`,
          fontFamily: FONT.sans,
        }}
      >
        <Icon name="funnel" size={40} color={C.cyanSoft} />
        <div>
          <div style={{ fontSize: TYPE.label, fontWeight: 750, color: C.textStrong }}>
            El email gateway filtra spam, malware y enlaces — su terreno es el contenido.
          </div>
          <div style={{ fontSize: TYPE.small, color: C.muted, marginTop: 4 }}>
            La identidad del dominio la decide <span style={{ color: C.cyanSoft, fontWeight: 700 }}>DMARC</span>.
          </div>
        </div>
      </div>
    </div>
  );
}
