import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, MonoLine, Panel, type IconName, type MonoToken } from '../../../engine/src/ui';
import { Stage } from './kit';

const LEFT_W = 700;
const RIGHT_LEFT = LEFT_W + 40;
const RIGHT_W = 1728 - RIGHT_LEFT;
/** Both panels start below y 210 (stage-local) so the think-prompt card
 * (which lands top-centre, y 0-210) never covers anything essential. */
const PANEL_TOP = 210;
const PANEL_H = 660 - PANEL_TOP;

type VerdictKind = 'pass' | 'fail';

/**
 * S02 «El correo que parecía de casa»: Lucía's inbox next to a live
 * Authentication-Results breakdown. SPF and DKIM both pass — for the
 * attacker's sending domain — while DMARC alignment, which compares that
 * against the visible From, fails. The message still lands in the inbox.
 */
export function S02Spoof(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inboxAt = props.cue('inbox');
  const headersAt = props.cue('headers');
  const spfAt = props.cue('spf-pass');
  const dkimAt = props.cue('dkim-pass');
  const dmarcAt = props.cue('dmarc-fail');
  // The DMARC row appears early, as an open question, then resolves at its cue.
  const dmarcRowIn = dkimAt + 40;

  const inboxIn = enter(frame, inboxAt, { distance: 24, axis: 'x' });
  const headersIn = enter(frame, headersAt - 8, { distance: 24, axis: 'x' });

  return (
    <Stage>
      {/* Inbox */}
      <div style={{ position: 'absolute', left: 0, top: PANEL_TOP, width: LEFT_W, height: PANEL_H, ...inboxIn }}>
        <Inbox />
      </div>

      {/* Authentication-Results */}
      <div style={{ position: 'absolute', left: RIGHT_LEFT, top: PANEL_TOP, width: RIGHT_W, height: PANEL_H, ...headersIn }}>
        <Panel title="Authentication-Results" icon="mail" accent="cyan" style={{ height: '100%' }} bodyStyle={{ padding: '16px 26px' }}>
          <RawHeader frame={frame} spfAt={spfAt} dkimAt={dkimAt} dmarcAt={dmarcAt} />
          <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
            <VerdictRow
              frame={frame}
              fps={fps}
              revealAt={spfAt}
              resolveAt={spfAt}
              icon="globe"
              label="SPF"
              detail="smtp.mailfrom=hdn-mailer.example"
              verdict="pass"
              verdictLabel="APROBADO"
            />
            <VerdictRow
              frame={frame}
              fps={fps}
              revealAt={dkimAt}
              resolveAt={dkimAt}
              icon="key"
              label="DKIM"
              detail="header.d=hdn-mailer.example"
              verdict="pass"
              verdictLabel="APROBADO"
            />
            <VerdictRow
              frame={frame}
              fps={fps}
              revealAt={dmarcRowIn}
              resolveAt={dmarcAt}
              icon="shield"
              label="DMARC"
              detail="header.from=haldenport.example · no alinea"
              verdict="fail"
              verdictLabel="SUSPENSO"
            />
          </div>
        </Panel>
      </div>
    </Stage>
  );
}

function Inbox() {
  return (
    <Panel title="Bandeja · Lucía (Operaciones)" icon="mail" accent="cyan" style={{ height: '100%' }} bodyStyle={{ padding: '20px 26px' }}>
      <div style={{ fontFamily: FONT.sans, display: 'grid', gap: 14 }}>
        <Field label="De" value="haldenport.example" valueColor={C.cyanSoft} />
        <Field label="Asunto" value="Turnos de atraque — actualización muelle 3" />
        <div
          style={{
            fontSize: TYPE.small,
            lineHeight: 1.5,
            color: C.text,
            paddingTop: 4,
            borderTop: `2px solid ${C.ink700}`,
          }}
        >
          Buenas, os paso los turnos de atraque actualizados para esta semana en el muelle 3. Revisad el adjunto antes del cambio de turno.
        </div>
        <div
          style={{
            marginTop: 6,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            width: 'fit-content',
            padding: '8px 16px',
            borderRadius: RADIUS.md,
            border: `2px solid ${C.ink600}`,
            background: alpha(C.ink800, 0.7),
          }}
        >
          <Icon name="file" size={26} color={C.muted} />
          <span style={{ fontFamily: FONT.mono, fontSize: TYPE.small, color: C.text }}>turnos_muelle3.docm</span>
        </div>
      </div>
    </Panel>
  );
}

function Field({ label, value, valueColor = C.textStrong }: { label: string; value: string; valueColor?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
      <span style={{ fontSize: TYPE.small, fontWeight: 700, color: C.muted, width: 76, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: TYPE.label, fontWeight: 700, color: valueColor }}>{value}</span>
    </div>
  );
}

/** The raw Authentication-Results header, field by field, highlighted as each cue fires. */
function RawHeader({ frame, spfAt, dkimAt, dmarcAt }: { frame: number; spfAt: number; dkimAt: number; dmarcAt: number }) {
  const hl = (active: boolean, color: string): string | undefined => (active ? alpha(color, 0.22) : undefined);
  const lines: MonoToken[][] = [
    [{ t: 'Authentication-Results: ', c: C.muted }, { t: 'mx.haldenport.example;', c: C.text }],
    [
      { t: '  smtp.mailfrom=hdn-mailer.example; ', c: C.text },
      { t: 'spf=', c: C.muted },
      { t: 'pass', c: C.emerald, bold: true, bg: hl(frame >= spfAt, C.emerald) },
    ],
    [
      { t: '  header.d=hdn-mailer.example; ', c: C.text },
      { t: 'dkim=', c: C.muted },
      { t: 'pass', c: C.emerald, bold: true, bg: hl(frame >= dkimAt, C.emerald) },
    ],
    [
      { t: '  header.from=haldenport.example; ', c: C.text },
      { t: 'dmarc=', c: C.muted },
      { t: 'fail', c: C.rose, bold: true, bg: hl(frame >= dmarcAt, C.rose) },
      { t: ' (p=NONE)', c: C.muted },
    ],
  ];
  return (
    <div style={{ display: 'grid', gap: 2 }}>
      {lines.map((tokens, i) => (
        <MonoLine key={i} tokens={tokens} size={22} />
      ))}
    </div>
  );
}

function VerdictRow({
  frame,
  fps,
  revealAt,
  resolveAt,
  icon,
  label,
  detail,
  verdict,
  verdictLabel,
}: {
  frame: number;
  fps: number;
  revealAt: number;
  resolveAt: number;
  icon: IconName;
  label: string;
  detail: string;
  verdict: VerdictKind;
  verdictLabel: string;
}) {
  const shown = progress(frame, revealAt, 12, EASE.out);
  if (shown <= 0) return null;
  const resolved = frame >= resolveAt;
  const pop = resolved ? springIn(frame, fps, resolveAt, { damping: 14, mass: 0.7 }) : 0;
  const color = resolved ? (verdict === 'pass' ? C.emerald : C.rose) : C.faint;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        height: 64,
        padding: '0 18px',
        borderRadius: RADIUS.md,
        border: `2px solid ${resolved ? alpha(color, 0.6) : C.ink700}`,
        background: resolved ? alpha(color, 0.1) : alpha(C.ink800, 0.6),
        opacity: shown,
        transform: `translateY(${(1 - shown) * 12}px)`,
        fontFamily: FONT.sans,
      }}
    >
      <Icon name={icon} size={30} color={resolved ? color : C.muted} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: TYPE.label, fontWeight: 750, color: resolved ? C.textStrong : C.text, whiteSpace: 'nowrap' }}>{label}</div>
        <div style={{ fontSize: TYPE.micro, color: C.muted, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {detail}
        </div>
      </div>
      <div style={{ marginLeft: 'auto', opacity: resolved ? Math.min(1, pop * 1.3) : 0.5, transform: `scale(${resolved ? 0.75 + 0.25 * pop : 1})` }}>
        {resolved ? (
          <Chip accent={verdict === 'pass' ? 'emerald' : 'rose'} icon={verdict === 'pass' ? 'check' : 'x'} size={TYPE.small} solid>
            {verdictLabel}
          </Chip>
        ) : (
          <Chip accent="muted" size={TYPE.small}>
            ¿?
          </Chip>
        )}
      </div>
    </div>
  );
}
