import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { ACCENT, C, FONT, RADIUS, TYPE, alpha, type Accent } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, lerp, progress } from '../../../engine/src/theme/motion';
import { Chip, Icon, Panel } from '../../../engine/src/ui';
import { Stage } from './kit';

type Rule = {
  n: number;
  action: 'ALLOW' | 'DENY';
  src: string;
  dst: string;
  svc: string;
  tag?: string;
  tagAccent?: Accent;
};

/** The rule table as it stands before the fix: rule 3 is migration debris that shadows rule 7. */
const RULES: Rule[] = [
  { n: 1, action: 'ALLOW', src: 'Operaciones', dst: 'dns-int.local', svc: 'udp/53' },
  { n: 2, action: 'ALLOW', src: 'Operaciones', dst: 'mail-gw.local', svc: 'tcp/25' },
  { n: 3, action: 'ALLOW', src: 'any', dst: 'any', svc: 'tcp/443', tag: 'resto de migración', tagAccent: 'amber' },
  { n: 4, action: 'DENY', src: 'Contratistas', dst: 'Internet', svc: 'any' },
  { n: 5, action: 'ALLOW', src: 'Administración', dst: 'gestion.local', svc: 'tcp/22' },
  { n: 6, action: 'ALLOW', src: 'Operaciones', dst: 'erp.local', svc: 'tcp/443' },
  { n: 7, action: 'DENY', src: 'Operaciones', dst: 'Internet', svc: 'any', tag: 'bloquea el C2', tagAccent: 'rose' },
];

const REMOVED_INDEX = 2; // rule 3
const ROW_H = 58;
const ROW_GAP = 6;
const HEADER_H = 40;
const EXPLICIT_H = 58;
const IMPLICIT_H = 54;
const RAIL_X = 14;

/**
 * s05-rules «Orden de reglas e implicit deny»: a packet walks the rule table
 * top-down and the first match wins — rule 3, migration debris, shadows
 * rule 7 before it can block the C2. Unmatched traffic falls to the implicit
 * deny at the bottom. The fix removes rule 3 and adds an explicit final
 * deny+log (it changes nothing, it just leaves a record).
 */
export function S05Rules(props: SceneProps) {
  const frame = useCurrentFrame();
  const table = props.cue('table');
  const packet = props.cue('packet');
  const firstMatch = props.cue('first-match');
  const shadowed = props.cue('shadowed');
  const implicit = props.cue('implicit');
  const fix = props.cue('fix');

  const tableIn = enter(frame, table, { distance: 20 });

  // Rule 3 is struck through, then physically removed; the rows below rise to close the gap.
  const strike = progress(frame, fix, 14);
  const collapse = progress(frame, fix + 16, 22, EASE.inOut);
  const explicitH = EXPLICIT_H * progress(frame, fix + 36, 22, EASE.out);

  const rowHeights = RULES.map((_, i) => (i === REMOVED_INDEX ? ROW_H * (1 - collapse) : ROW_H));
  const rowY: number[] = [];
  let cursor = HEADER_H + 12;
  for (let i = 0; i < RULES.length; i++) {
    rowY.push(cursor);
    cursor += rowHeights[i] + ROW_GAP;
  }
  const explicitY = cursor;
  cursor += explicitH + (explicitH > 2 ? ROW_GAP : 0);
  const implicitY = cursor;
  const bodyH = implicitY + IMPLICIT_H + 12;

  // The C2 packet: rides the rail down to rule 3, then fades away with it once removed.
  const matchY = rowY[REMOVED_INDEX] + ROW_H / 2;
  const packetY = lerp(frame, [packet, firstMatch], [rowY[0], matchY]);
  const packetOn = frame >= packet ? (1 - collapse) : 0;

  // A second, unmatched packet: falls straight through to the implicit deny.
  const genericY = lerp(frame, [shadowed + 10, implicit], [rowY[0], implicitY + IMPLICIT_H / 2]);
  const genericOn = fadeIn(frame, shadowed + 10, 10) * (1 - progress(frame, implicit + 70, 20));

  // Rule 7 is shadowed while rule 3 sits above it, and becomes reachable the moment it is gone.
  const shadowOn = progress(frame, shadowed, 12) * (1 - collapse);
  const clearedOn = progress(frame, fix + 30, 16);

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1728, height: 660, ...tableIn }}>
        <Panel title="Cortafuegos · Zona Operaciones" icon="firewall" accent="cyan" style={{ height: '100%' }} bodyStyle={{ padding: '16px 30px' }}>
          <div style={{ position: 'relative', height: Math.min(bodyH, 596) }}>
            {/* Rail: the packet's path down the table. */}
            <div style={{ position: 'absolute', left: RAIL_X, top: HEADER_H, bottom: 0, width: 2, background: alpha(C.ink600, 0.6) }} />
            {packetOn > 0 ? <RailDot x={RAIL_X} y={packetY} color={C.amber} opacity={packetOn} /> : null}
            {genericOn > 0 ? <RailDot x={RAIL_X} y={genericY} color={C.muted} opacity={genericOn} /> : null}

            <ColumnHeader />

            {RULES.map((rule, i) => (
              <RuleRow
                key={rule.n}
                rule={rule}
                y={rowY[i]}
                height={rowHeights[i]}
                strike={i === REMOVED_INDEX ? strike : 0}
                matched={i === REMOVED_INDEX && frame >= firstMatch && collapse < 1}
                shadowTag={i === 6 ? (clearedOn > 0.05 ? { text: 'AHORA SE EVALÚA', accent: 'emerald' as Accent, opacity: clearedOn } : { text: 'NUNCA EVALUADA', accent: 'rose' as Accent, opacity: shadowOn }) : undefined}
              />
            ))}

            {explicitH > 2 ? <ExplicitDenyRow y={explicitY} height={explicitH} opacity={progress(frame, fix + 40, 18)} /> : null}

            <ImplicitDenyRow y={implicitY} glow={progress(frame, implicit, 14) * (1 - progress(frame, implicit + 90, 30))} />
          </div>
        </Panel>
      </div>
    </Stage>
  );
}

function RailDot({ x, y, color, opacity }: { x: number; y: number; color: string; opacity: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 7,
        top: y - 7,
        width: 14,
        height: 14,
        borderRadius: 7,
        background: color,
        opacity,
        boxShadow: `0 0 16px ${alpha(color, 0.8 * opacity)}`,
      }}
    />
  );
}

function ColumnHeader() {
  const cell = (w: number | undefined, text: string) => (
    <div style={{ flex: w ? `0 0 ${w}px` : 1, fontSize: TYPE.micro, fontWeight: 800, letterSpacing: 1.5, color: C.faint, textTransform: 'uppercase' as const }}>
      {text}
    </div>
  );
  return (
    <div style={{ position: 'absolute', left: 40, right: 0, top: 0, height: HEADER_H - 10, display: 'flex', alignItems: 'flex-end', gap: 16, fontFamily: FONT.sans }}>
      {cell(56, '#')}
      {cell(150, 'Acción')}
      {cell(300, 'Origen')}
      {cell(300, 'Destino')}
      {cell(180, 'Servicio')}
      {cell(undefined, 'Nota')}
    </div>
  );
}

function ActionChip({ action }: { action: 'ALLOW' | 'DENY' }) {
  return (
    <Chip accent={action === 'ALLOW' ? 'emerald' : 'rose'} size={TYPE.small} solid>
      {action}
    </Chip>
  );
}

function RuleRow({
  rule,
  y,
  height,
  strike,
  matched,
  shadowTag,
}: {
  rule: Rule;
  y: number;
  height: number;
  strike: number;
  matched: boolean;
  shadowTag?: { text: string; accent: Accent; opacity: number };
}) {
  if (height <= 1) return null;
  const a = rule.tagAccent ? ACCENT[rule.tagAccent] : null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 40,
        right: 0,
        top: y,
        height,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '0 4px',
        borderRadius: RADIUS.sm,
        background: matched ? alpha(C.amber, 0.12) : 'transparent',
        border: matched ? `2px solid ${alpha(C.amber, 0.75)}` : '2px solid transparent',
        boxShadow: matched ? `0 0 22px ${alpha(C.amber, 0.3)}` : 'none',
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ position: 'relative', flex: '0 0 56px', fontFamily: FONT.mono, fontSize: TYPE.label, fontWeight: 700, color: C.text }}>
        {rule.n}
        {strike > 0 ? (
          <div style={{ position: 'absolute', left: -4, right: -4, top: '50%', height: 3, background: C.rose, transform: `scaleX(${strike})`, transformOrigin: 'left' }} />
        ) : null}
      </div>
      <div style={{ flex: '0 0 150px', opacity: 1 - 0.5 * strike }}>
        <ActionChip action={rule.action} />
      </div>
      <div style={{ flex: '0 0 300px', fontSize: TYPE.label, color: C.text, opacity: 1 - 0.5 * strike, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {rule.src}
      </div>
      <div style={{ flex: '0 0 300px', fontSize: TYPE.label, color: C.text, opacity: 1 - 0.5 * strike, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {rule.dst}
      </div>
      <div style={{ flex: '0 0 180px', fontFamily: FONT.mono, fontSize: TYPE.label, color: C.cyanSoft, opacity: 1 - 0.5 * strike }}>{rule.svc}</div>
      <div style={{ flex: 1, display: 'flex', gap: 10, alignItems: 'center' }}>
        {rule.tag && a ? (
          <Chip accent={rule.tagAccent} size={TYPE.micro} style={{ opacity: 1 - strike }}>
            {rule.tag}
          </Chip>
        ) : null}
        {matched ? (
          <Chip accent="amber" icon="check" size={TYPE.micro} solid>
            COINCIDE
          </Chip>
        ) : null}
        {shadowTag && shadowTag.opacity > 0.02 ? (
          <Chip accent={shadowTag.accent} size={TYPE.micro} style={{ opacity: shadowTag.opacity }}>
            {shadowTag.text}
          </Chip>
        ) : null}
      </div>
    </div>
  );
}

function ExplicitDenyRow({ y, height, opacity }: { y: number; height: number; opacity: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 40,
        right: 0,
        top: y,
        height,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '0 4px',
        borderRadius: RADIUS.sm,
        background: alpha(C.cyan, 0.1),
        border: `2px solid ${alpha(C.cyan, 0.6)}`,
        opacity,
        fontFamily: FONT.sans,
      }}
    >
      <Icon name="record" size={22} color={C.cyan} />
      <span style={{ fontSize: TYPE.label, fontWeight: 750, color: C.textStrong }}>Final</span>
      <div style={{ flex: '0 0 150px' }}>
        <ActionChip action="DENY" />
      </div>
      <div style={{ flex: '0 0 300px', fontSize: TYPE.label, color: C.text }}>any</div>
      <div style={{ flex: '0 0 300px', fontSize: TYPE.label, color: C.text }}>any</div>
      <div style={{ flex: '0 0 180px', fontFamily: FONT.mono, fontSize: TYPE.label, color: C.cyanSoft }}>any</div>
      <div style={{ flex: 1 }}>
        <Chip accent="cyan" size={TYPE.micro} solid>
          + LOG
        </Chip>
      </div>
    </div>
  );
}

function ImplicitDenyRow({ y, glow }: { y: number; glow: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 40,
        right: 0,
        top: y,
        height: IMPLICIT_H,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '0 4px',
        borderRadius: RADIUS.sm,
        border: `2px dashed ${alpha(C.muted, 0.5 + 0.4 * glow)}`,
        background: alpha(C.ink800, 0.5 + 0.2 * glow),
        boxShadow: glow > 0 ? `0 0 ${24 * glow}px ${alpha(C.muted, 0.25 * glow)}` : 'none',
        fontFamily: FONT.sans,
      }}
    >
      <div style={{ flex: '0 0 56px', textAlign: 'center', color: C.faint, fontFamily: FONT.mono, fontSize: TYPE.label }}>—</div>
      <span style={{ fontSize: TYPE.label, fontWeight: 750, color: glow > 0.3 ? C.textStrong : C.muted, letterSpacing: 1 }}>IMPLICIT DENY</span>
      <span style={{ fontSize: TYPE.small, color: C.muted }}>lo que no se permite, se bloquea</span>
    </div>
  );
}
