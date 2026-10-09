import { useCurrentFrame, useVideoConfig } from 'remotion';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { enter, progress, typewriter } from '../../../../engine/src/theme/motion';
import { Icon, Panel, dimStyle } from '../../../../engine/src/ui';
import { CONSOLE } from '../../data/s05-despues';

/**
 * s05's console on the machine itself: the command `msgq --version` and what it prints, the change log (the version
 * from before the patch, so the host plainly WAS vulnerable and now is not), the installed package and the service's
 * start time. Every row has its own `at` frame (relative to the Sequence). The change log draws its arrow with the
 * engine's `arrowRight` icon, never the → character (the fonts are latin subsets).
 */
export interface HostConsoleAt {
  cmd: number;
  version: number;
  changes: number;
  pkg: number;
  service: number;
  noReboot: number;
}

export function HostConsole({ width, at, dim = 0, glow = 0, frame: frameProp }: { width: number; at: HostConsoleAt; dim?: number; glow?: number; frame?: number }) {
  const current = useCurrentFrame();
  const { fps } = useVideoConfig();
  const frame = frameProp ?? current;
  const labelW = 300;
  const typed = typewriter(CONSOLE.cmd, frame, at.cmd, fps, 40);
  const caret = frame >= at.cmd && typed.length < CONSOLE.cmd.length;
  const row = (a: number) => enter(frame, a, { distance: 10, duration: 10 });
  const mono = { fontFamily: FONT.mono, fontWeight: 700 } as const;
  const label = { width: labelW, flexShrink: 0, fontFamily: FONT.sans, fontSize: 28, fontWeight: 650, lineHeight: 1.2, color: C.muted } as const;
  const noReboot = progress(frame, at.noReboot, 12);
  return (
    <div style={{ width, ...dimStyle(dim) }}>
      <Panel title={CONSOLE.title} icon="terminal" accent="cyan" glow={glow} style={{ width }} bodyStyle={{ padding: '14px 26px 18px' }}>
        {/* command and what it prints */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, height: 68 }}>
          <span style={{ ...mono, fontSize: 34, color: C.text, whiteSpace: 'nowrap' }}>
            <span style={{ color: C.emerald, fontWeight: 800 }}>$ </span>
            {typed}
            {caret ? <span style={{ display: 'inline-block', width: 16, height: 34, marginLeft: 4, verticalAlign: '-6px', background: C.emerald }} /> : null}
          </span>
          {frame >= at.version ? (
            <span style={{ ...row(at.version), display: 'inline-flex', alignItems: 'center', padding: '2px 18px', borderRadius: RADIUS.md, border: `2px solid ${alpha(C.emerald, 0.8)}`, background: alpha(C.emeraldDeep, 0.6), ...mono, fontSize: 52, fontWeight: 850, color: '#6ee7b7', boxShadow: `0 0 22px ${alpha(C.emerald, 0.3)}` }}>
              {CONSOLE.version}
            </span>
          ) : null}
        </div>
        {/* change log: the version from before the patch */}
        <div style={{ ...(frame >= at.changes ? row(at.changes) : { opacity: 0 }), display: 'flex', alignItems: 'center', gap: 18, minHeight: 56 }}>
          <span style={label}>{CONSOLE.changes.label}</span>
          <span style={{ ...mono, fontSize: 30, color: C.text, display: 'inline-flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}>
            <span style={{ color: C.muted }}>{CONSOLE.changes.date}</span>
            <span style={{ color: C.faint }}>·</span>
            <span style={{ color: '#fcd34d' }}>{CONSOLE.changes.before}</span>
            <Icon name="arrowRight" size={34} color={C.muted} strokeWidth={2.4} />
            <span style={{ color: '#6ee7b7', fontWeight: 850 }}>{CONSOLE.changes.after}</span>
          </span>
        </div>
        {/* installed package */}
        <div style={{ ...(frame >= at.pkg ? row(at.pkg) : { opacity: 0 }), display: 'flex', alignItems: 'center', gap: 18, minHeight: 52 }}>
          <span style={label}>{CONSOLE.package.label}</span>
          <span style={{ ...mono, fontSize: 36, color: '#6ee7b7', fontWeight: 850 }}>{CONSOLE.package.value}</span>
        </div>
        {/* the service: active since the patch, no reboot missing */}
        <div style={{ ...(frame >= at.service ? row(at.service) : { opacity: 0 }), display: 'flex', alignItems: 'center', gap: 18, minHeight: 56 }}>
          <span style={label}>{CONSOLE.service.label}</span>
          <span style={{ ...mono, fontSize: 30, color: C.textStrong, whiteSpace: 'nowrap' }}>{CONSOLE.service.value}</span>
          <span
            style={{
              opacity: noReboot,
              transform: `scale(${0.9 + 0.1 * noReboot})`,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '4px 16px 4px 10px',
              borderRadius: RADIUS.pill,
              border: `2px solid ${alpha(C.emerald, 0.8)}`,
              background: alpha(C.emeraldDeep, 0.55),
              fontFamily: FONT.sans,
              fontSize: 28,
              fontWeight: 750,
              color: '#a7f3d0',
              whiteSpace: 'nowrap',
            }}
          >
            <Icon name="check" size={30} color={C.emerald} strokeWidth={3} />
            {CONSOLE.service.note}
          </span>
        </div>
      </Panel>
    </div>
  );
}
