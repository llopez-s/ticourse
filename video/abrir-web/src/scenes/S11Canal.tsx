import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, pulse } from '../../../engine/src/theme/motion';
import { Cursor, Icon, Redacted, mix } from '../../../engine/src/ui';
import { Stage } from './kit';
import { Dots, Pill } from './parts/Bits';
import { WARNING } from './parts/data';
import { Ribbon, ribbonLit } from './parts/Ribbon';
import { ImaginaSeal } from './parts/Seal';
import { TUBE_H, TUBE_W, TlsTube } from './parts/TlsTube';

const TUBE = { left: 260, top: 250 };
const MID_Y = TUBE.top + TUBE_H / 2;
const SHELL_W = 400;
const SHELL_H = 98;
const DIALOG = { left: 244, top: 104, width: 1240 };
const BTN = { w: 440, h: 70 };

/**
 * s11-canal «Lo que el canal no arregla».
 *   more     inside the TLS tube (see-through here, unlike s08) travels a packet «entrada maliciosa» wrapped in the
 *            channel's protection; path  it arrives intact and the application turns amber: the channel brings it
 *            as protected as anything else;   warning  a certificate warning of the browser;   causes  its causes
 *            in a row;   skip  a pointer goes towards «continuar de todos modos» and stops (the engine's «error»
 *            sound falls here);   wrap  what the certificate says and what it does not.
 */
export function S11Canal(props: SceneProps) {
  const frame = useCurrentFrame();
  const more = props.cue('more');
  const path = props.cue('path');
  const warning = props.cue('warning');
  const causes = props.cue('causes');
  const skip = props.cue('skip');
  const wrap = props.cue('wrap');

  // ---- Phase 1: the packet in the tube.
  const baseIn = progress(frame, 2, 14);
  const packetIn = progress(frame, more + 6, 14);
  const travel = progress(frame, more + 18, Math.max(40, path - more - 40), EASE.linear);
  const appAmber = progress(frame, path - 4, 14);
  const chip = progress(frame, path + 4, 16);
  const p1Out = progress(frame, warning - 12, 14, EASE.inOut);
  const shellOff = progress(frame, path - 26, 14);

  const x0 = -SHELL_W;
  const x1 = TUBE_W - SHELL_W - 24;
  const packetX = mix(x0 + 20, x1, travel);

  // ---- Phase 2: the warning.
  const dlg = progress(frame, warning - 2, 18);
  const causesIn = causes <= frame ? [0, 1, 2, 3].map((k) => progress(frame, causes + k * 12, 12)) : [0, 0, 0, 0];
  const skipIn = progress(frame, skip - 40, 16);
  const stop = progress(frame, skip, 12);
  const ruleIn = progress(frame, skip + 4, 16);
  const wrapIn = progress(frame, wrap - 4, 18);
  const dlgDim = 1 - progress(frame, wrap - 8, 12);

  return (
    <Stage>
      <Ribbon lit={ribbonLit(frame, {}, ['DHCP', 'DNS', 'TCP', 'TLS', 'HTTP'])} />

      {/* Phase 1 */}
      {p1Out < 0.99 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: baseIn * (1 - p1Out), fontFamily: FONT.sans }}>
          <End x={20} icon="laptop" label="cliente" tone={C.cyan} top={MID_Y - 70} />
          <End x={1546} icon="app" label="aplicación del portal" tone={mix2(C.sky, C.amber, appAmber)} top={MID_Y - 70} glow={appAmber} wide />

          <div style={{ position: 'absolute', left: TUBE.left + TUBE_W / 2 - 80, top: TUBE.top - 66 }}>
            <Pill size={40} tone={C.textStrong} border={alpha(C.sky, 0.85)}>
              TLS
            </Pill>
          </div>
          <div style={{ position: 'absolute', left: TUBE.left, top: TUBE.top }}>
            <TlsTube cover={0} noise={0} glow={0.3}>
              {packetIn > 0.01 ? (
                <div style={{ position: 'absolute', left: packetX, top: (TUBE_H - SHELL_H) / 2 - 4, opacity: packetIn }}>
                  <div
                    style={{
                      width: SHELL_W,
                      height: SHELL_H,
                      boxSizing: 'border-box',
                      borderRadius: 22,
                      border: `4px solid ${alpha('#cbd5e1', 0.85 * (1 - shellOff))}`,
                      background: alpha('#cbd5e1', 0.1 * (1 - shellOff)),
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        padding: '8px 22px',
                        borderRadius: 14,
                        border: `3px solid ${alpha(C.amber, 0.95)}`,
                        background: alpha(C.amber, 0.22),
                        boxShadow: `0 0 ${Math.round(18 + 14 * pulse(frame, 30, 0.8))}px ${alpha(C.amber, 0.4)}`,
                        fontFamily: FONT.sans,
                        fontSize: 31,
                        fontWeight: 800,
                        color: '#fde68a',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {WARNING.packet}
                    </div>
                  </div>
                </div>
              ) : null}
            </TlsTube>
          </div>
          <div style={{ position: 'absolute', left: 0, top: TUBE.top + TUBE_H + 52, width: 1728, display: 'flex', justifyContent: 'center', opacity: chip, transform: `translateY(${(1 - chip) * 14}px)` }}>
            <Pill size={38} tone={C.textStrong} border={alpha(C.amber, 0.85)} icon="alert">
              {WARNING.protectedPath}
            </Pill>
          </div>
        </div>
      ) : null}

      {/* Phase 2: the browser's certificate warning */}
      {dlg > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: dlg * dlgDim, fontFamily: FONT.sans }}>
          <div
            style={{
              position: 'absolute',
              left: DIALOG.left,
              top: DIALOG.top + (1 - dlg) * 16,
              width: DIALOG.width,
              boxSizing: 'border-box',
              borderRadius: RADIUS.lg,
              border: `3px solid ${alpha(C.amber, 0.7)}`,
              background: alpha(C.ink900, 0.98),
              boxShadow: `0 30px 70px ${alpha('#000000', 0.5)}, 0 0 40px ${alpha(C.amber, 0.14)}`,
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '16px 28px', background: alpha(C.amber, 0.16), borderBottom: `2px solid ${alpha(C.amber, 0.45)}` }}>
              <Icon name="alert" size={52} color={C.amber} strokeWidth={2.2} />
              <span style={{ fontSize: 42, fontWeight: 850, color: C.textStrong }}>{WARNING.title}</span>
            </div>
            <div style={{ padding: '22px 28px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, minHeight: 64, flexWrap: 'nowrap' }}>
                {WARNING.causes.map((c, k) => (
                  <span
                    key={c}
                    style={{
                      padding: '8px 22px',
                      borderRadius: RADIUS.pill,
                      border: `2px solid ${alpha(C.amber, 0.7)}`,
                      background: alpha(C.amber, 0.1),
                      fontSize: 29,
                      fontWeight: 750,
                      color: '#fde68a',
                      whiteSpace: 'nowrap',
                      opacity: causesIn[k],
                      transform: `translateY(${(1 - causesIn[k]) * 12}px)`,
                    }}
                  >
                    {c}
                  </span>
                ))}
                <Dots size={10} color="#fde68a" show={causesIn[3]} />
                {causes > frame ? <Redacted width={420} height={20} tone="muted" strength={0.4} /> : null}
              </div>
              <div style={{ marginTop: 22, display: 'flex', gap: 28 }}>
                <div style={{ flex: '0 0 300px', height: BTN.h, boxSizing: 'border-box', borderRadius: RADIUS.pill, display: 'grid', placeItems: 'center', background: alpha(C.cyan, 0.9), color: C.ink950, fontSize: 36, fontWeight: 850 }}>{WARNING.back}</div>
                <div
                  style={{
                    flex: '0 0 ' + BTN.w + 'px',
                    height: BTN.h,
                    boxSizing: 'border-box',
                    borderRadius: RADIUS.pill,
                    display: 'grid',
                    placeItems: 'center',
                    border: `3px solid ${stop > 0.5 ? C.rose : alpha(C.amber, 0.8)}`,
                    background: stop > 0.5 ? alpha(C.rose, 0.14) : 'transparent',
                    boxShadow: stop > 0.02 ? `0 0 ${Math.round(26 * stop)}px ${alpha(C.rose, 0.45)}` : undefined,
                    color: stop > 0.5 ? C.roseSoft : '#fde68a',
                    fontSize: 34,
                    fontWeight: 800,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {WARNING.skip}
                </div>
              </div>
            </div>
          </div>

          {/* the pointer goes towards «continuar de todos modos» and stops short */}
          <Cursor
            frame={frame}
            appearAt={skip - 44}
            path={[
              { x: 330, y: 520, at: skip - 40 },
              { x: 690, y: 384, at: skip - 4 },
            ]}
          />
          {skipIn > 0 ? (
            <div style={{ position: 'absolute', left: 1056, top: 300, opacity: stop, transform: `scale(${0.7 + 0.3 * stop})` }}>
              <svg width={64} height={64} viewBox="0 0 64 64">
                <circle cx={32} cy={32} r={28} fill={alpha(C.rose, 0.18)} stroke={C.rose} strokeWidth={5} />
                <path d="M 14 50 L 50 14" stroke={C.rose} strokeWidth={5} strokeLinecap="round" />
              </svg>
            </div>
          ) : null}

          <div style={{ position: 'absolute', left: 0, top: DIALOG.top + 410, width: 1728, display: 'flex', justifyContent: 'center', opacity: ruleIn, transform: `translateY(${(1 - ruleIn) * 14}px)` }}>
            <span style={{ padding: '10px 36px', borderRadius: RADIUS.pill, border: `3px solid ${alpha(C.rose, 0.7)}`, background: alpha(C.rose, 0.1), fontSize: 44, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>{WARNING.rule}</span>
          </div>
        </div>
      ) : null}

      {/* wrap: what the certificate says and what it does not */}
      {wrapIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: 150, width: 1728, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34, opacity: wrapIn, fontFamily: FONT.sans }}>
          <Verdict lead="el certificado te dice" tone={C.emerald} icon="check" show={wrapIn}>
            {WARNING.says}
          </Verdict>
          <Verdict lead="pero no te dice" tone={C.amber} icon="alert" show={progress(frame, wrap + 26, 16)}>
            {WARNING.doesNotSay}
          </Verdict>
        </div>
      ) : null}

      <ImaginaSeal />
    </Stage>
  );
}

/** Colour blend between two hex colours (t 0-1). */
function mix2(a: string, b: string, t: number): string {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const m = pa.map((v, i) => Math.round(mix(v, pb[i], t)));
  return `#${m.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

function End({ x, icon, label, tone, top, glow = 0, wide = false }: { x: number; icon: 'laptop' | 'app'; label: string; tone: string; top: number; glow?: number; wide?: boolean }) {
  return (
    <div style={{ position: 'absolute', left: x, top, width: wide ? 170 : 150, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, fontFamily: FONT.sans }}>
      <div
        style={{
          width: 130,
          height: 130,
          borderRadius: 28,
          display: 'grid',
          placeItems: 'center',
          border: `3px solid ${alpha(tone, 0.8)}`,
          background: alpha(tone, 0.1 + 0.08 * glow),
          boxShadow: glow > 0.02 ? `0 0 ${Math.round(34 * glow)}px ${alpha(tone, 0.5 * glow)}` : undefined,
        }}
      >
        <Icon name={icon} size={80} color={tone} strokeWidth={1.8} />
      </div>
      <span style={{ fontSize: 30, fontWeight: 750, color: C.text, textAlign: 'center', lineHeight: 1.1 }}>{label}</span>
    </div>
  );
}

function Verdict({ lead, tone, icon, show, children }: { lead: string; tone: string; icon: 'check' | 'alert'; show: number; children: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: show, transform: `translateY(${(1 - show) * 14}px)` }}>
      <span style={{ fontSize: 38, fontWeight: 700, color: C.muted }}>{lead}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 20, padding: '12px 40px 12px 28px', borderRadius: RADIUS.pill, border: `3px solid ${alpha(tone, 0.8)}`, background: alpha(tone, 0.1), fontSize: 54, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>
        <Icon name={icon} size={58} color={tone} strokeWidth={2.6} />
        {children}
      </span>
    </div>
  );
}
