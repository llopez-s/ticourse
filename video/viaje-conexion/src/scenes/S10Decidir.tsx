import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse } from '../../../engine/src/theme/motion';
import { Chip } from '../../../engine/src/ui/Chip';
import { Icon, type IconName } from '../../../engine/src/ui/Icon';
import { Stage, wordFrame } from './kit';
import { NAT_ROWS, RDP_PACKET } from './parts/data';
import { DeviceTile, Parcel } from './parts/Glyphs';
import { CaseStamp, Line } from './parts/Marks';
import { RuleList } from './parts/RuleList';

const S = 's10-decidir';
const FRAME = { x: 280, y: 66, w: 1140, h: 272 };
const BOX = { y: 130, w: 520, h: 186, fwX: 304, natX: 876 };
const WEB_Y = 160;
const RDP_Y = 256;
const PARCEL_W = 70;
const LIST_X = 30;
const LIST_Y = 396;
const TAG_Y = 346;
const STEEL = '#94a3b8';
const STEEL_SOFT = '#cbd5e1';

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
/** 1 when x is at c, falling to 0 at `span` px away. */
const near = (x: number, c: number, span = 150) => clamp01(1 - Math.abs(x - c) / span);

function Box({ x, kind, title, glow, opacity = 1, children }: { x: number; kind: 'fw' | 'nat'; title: string; glow: number; opacity?: number; children?: ReactNode }) {
  const color = kind === 'fw' ? C.cyan : C.amber;
  const icon: IconName = kind === 'fw' ? 'firewall' : 'network';
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: BOX.y,
        width: BOX.w,
        height: BOX.h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(color, 0.5 + 0.45 * glow)}`,
        background: alpha(color, 0.07 + 0.11 * glow),
        boxShadow: glow > 0.02 ? `0 0 ${Math.round(46 * glow)}px ${alpha(color, 0.42 * glow)}` : undefined,
        opacity,
      }}
    >
      <div style={{ position: 'absolute', left: 24, top: 22, display: 'flex', alignItems: 'center', gap: 16, whiteSpace: 'nowrap' }}>
        <Icon name={icon} size={52} color={color} strokeWidth={2} />
        <span style={{ fontFamily: FONT.sans, fontSize: 38, fontWeight: 850, color: C.textStrong }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

/**
 * s10-decidir «Traducir no es decidir». Inside the router frame the NAT box is alone («¿protege?») until
 * `boxes`, when the firewall box joins it. `rdp`: a second laptop's packet, whose destination reads «equipo
 * externo · 3389 · escritorio remoto»; `same`: NAT would translate it just the same (a ghost rewrite in its box);
 * `rules`: the outbound list; `scan`: a bar reads it from the top, passing rule 1 and 2 («no coincide»);
 * `implicit`: it stops on the grey row, «denegación implícita»; `stop`: the packet is held at the firewall, NAT
 * writes nothing («lo habría traducido igual») while the web packet goes through; `state`: the portal's answer
 * comes in because the conversation was opened from inside; `split`: two jobs in one device; `nocrypt`: a chip
 * says neither encrypts (no padlock: that is TLS, next video).
 */
export function S10Decidir(props: SceneProps) {
  const frame = useCurrentFrame();
  const boxesAt = props.cue('boxes');
  const rdpAt = props.cue('rdp');
  const sameAt = props.cue('same');
  const rulesAt = props.cue('rules');
  const scanAt = props.cue('scan');
  const implicitAt = props.cue('implicit');
  const stopAt = props.cue('stop');
  const stateAt = props.cue('state');
  const splitAt = props.cue('split');
  const nocryptAt = props.cue('nocrypt');
  const wf = (seg: string, w: string, n = 0) => wordFrame(S, seg, w, n);

  // ---- the frame, its boxes and the question ----
  const frameIn = progress(frame, 0, 18);
  const protegeIn = progress(frame, wf('s10-01', 'protege') - 2, 12) * (1 - progress(frame, boxesAt - 4, 10));
  const fwIn = progress(frame, boxesAt - 4, 16);
  const splitP = progress(frame, splitAt, 12);
  const natJobText = progress(frame, wf('s10-08', 'traduce') - 2, 10);
  const natJob = natJobText * (1 - progress(frame, wf('s10-08', 'decide') - 2, 10));
  const fwJob = progress(frame, wf('s10-08', 'decide') - 2, 10);

  // ---- the second packet (remote desktop) ----
  const rdpIn = progress(frame, rdpAt - 2, 14);
  const rdpX = 108 + 28 * progress(frame, rdpAt, 40, EASE.inOut) + 34 * progress(frame, scanAt, 50, EASE.inOut);
  const shake = Math.sin((frame - stopAt) * 1.6) * 7 * (1 - progress(frame, stopAt, 26)) * (frame >= stopAt ? 1 : 0);
  const rdpTag = enter(frame, rdpAt, { distance: 14 });
  const rdpTagOut = 1 - progress(frame, stateAt - 10, 10);

  // ---- the ghost rewrite inside the NAT box ----
  const ghost = progress(frame, sameAt + 4, 22, EASE.linear) * (1 - progress(frame, stopAt - 2, 10));
  const ghostCaption = enter(frame, stopAt + 6, { distance: 12 });
  const ghostCaptionOut = 1 - progress(frame, splitAt - 6, 10);

  // ---- the rule list and its reading bar ----
  const rows = [0, 1, 2].map((i) => progress(frame, rulesAt + 4 + i * 10, 16));
  const listTitle = enter(frame, rulesAt, { distance: 12 });
  const scanSpan = Math.max(40, implicitAt - 8 - (scanAt + 8));
  const bar = 2 * progress(frame, scanAt + 8, scanSpan, EASE.inOut);
  const barOn = progress(frame, scanAt, 8) * (1 - progress(frame, stateAt - 10, 10));
  const passed = [clamp01((bar - 0.6) / 0.3), clamp01((bar - 1.6) / 0.3), 0];
  const hit = [0, 0, progress(frame, implicitAt - 2, 10) * (1 - 0.7 * progress(frame, stateAt - 10, 10))];
  const implicit = progress(frame, implicitAt, 12);
  const listDim = 1 - 0.7 * progress(frame, stateAt - 10, 12);
  const listDimAfterSplit = 1 - 0.55 * progress(frame, splitAt - 6, 12);

  // ---- the web packet goes through (on «la web sale») ----
  const webAt = wf('s10-06', 'web') - 6;
  const webT = progress(frame, webAt, 84, EASE.inOut);
  const webX = 108 + 1392 * webT;
  const webShow = progress(frame, webAt - 4, 8) * (1 - progress(frame, webAt + 84, 8));
  const webRestShow = progress(frame, 0, 12) * (frame < webAt - 4 ? 1 : 0);
  const fwGlowWeb = frame >= webAt ? near(webX, BOX.fwX + BOX.w / 2) : 0;
  const natGlowWeb = frame >= webAt ? near(webX, BOX.natX + BOX.w / 2) : 0;
  const blockMark = progress(frame, stopAt, 8) * (1 - progress(frame, stateAt - 12, 10));

  // ---- the portal's answer comes back in ----
  const stateT = progress(frame, stateAt + 4, 96, EASE.inOut);
  const stateX = 1500 - 1390 * stateT;
  const stateShow = progress(frame, stateAt, 8) * (1 - progress(frame, stateAt + 100, 8));
  const stateCaption = enter(frame, stateAt, { distance: 14 });
  const stateCaptionOut = 1 - progress(frame, splitAt - 8, 10);
  const fwGlowState = frame >= stateAt ? Math.max(near(stateX, BOX.fwX + BOX.w / 2), near(stateX, BOX.natX + BOX.w / 2) * 0.5) : 0;

  const fwGlow = Math.max(fwGlowWeb, fwGlowState, fwJob, progress(frame, scanAt, 12) * (1 - progress(frame, stopAt, 12)) * 0.7);
  const natGlow = Math.max(natGlowWeb, natJob, progress(frame, sameAt, 12) * (1 - progress(frame, stopAt, 12)) * 0.6);
  const pulseHalo = 0.5 + 0.5 * pulse(frame, 30, 0.8);

  // ---- split / nocrypt ----
  const headerSplit = splitP;
  const nocrypt = enter(frame, nocryptAt - 2, { distance: 14 });

  return (
    <>
      <Stage>
        {/* ---- the laptops and the Internet ---- */}
        <div style={{ position: 'absolute', left: 0, top: 84, width: 120, textAlign: 'left', opacity: frameIn, fontFamily: FONT.sans, fontSize: 26, fontWeight: 700, color: C.textStrong, whiteSpace: 'nowrap' }}>portátil</div>
        <div style={{ position: 'absolute', left: 0, top: 118, opacity: frameIn }}>
          <DeviceTile kind="laptop" tile={84} />
        </div>
        {rdpIn > 0.01 ? (
          <div style={{ position: 'absolute', left: 0, top: 214, opacity: rdpIn }}>
            <DeviceTile kind="laptop" tile={84} name="otro portátil" nameSize={26} />
          </div>
        ) : null}
        <div style={{ position: 'absolute', left: 1560, top: 118, opacity: frameIn }}>
          <DeviceTile kind="cloud" tile={96} name="Internet" tone="muted" />
        </div>

        {/* ---- the router frame ---- */}
        <div
          style={{
            position: 'absolute',
            left: FRAME.x,
            top: FRAME.y,
            width: FRAME.w,
            height: FRAME.h,
            boxSizing: 'border-box',
            borderRadius: RADIUS.lg + 6,
            border: `2px solid ${alpha(C.cyan, 0.4 + 0.45 * headerSplit * pulseHalo)}`,
            background: alpha(C.cyan, 0.04),
            boxShadow: headerSplit > 0.02 ? `0 0 ${Math.round(40 * headerSplit)}px ${alpha(C.cyan, 0.25 * headerSplit)}` : undefined,
            opacity: frameIn,
          }}
        />
        <div style={{ position: 'absolute', left: FRAME.x + 24, top: FRAME.y + 6, height: 46, display: 'flex', alignItems: 'center', gap: 14, opacity: frameIn, whiteSpace: 'nowrap' }}>
          <Icon name="router" size={34} color={C.cyan} />
          <span style={{ fontFamily: FONT.sans, fontSize: 36, fontWeight: 750, color: C.muted, opacity: 1 - headerSplit }}>router</span>
          <span style={{ position: 'absolute', left: 48, fontFamily: FONT.sans, fontSize: 40, fontWeight: 850, color: C.textStrong, opacity: headerSplit }}>
            el mismo aparato, <span style={{ color: C.cyan }}>dos trabajos</span>
          </span>
        </div>
        {protegeIn > 0.01 ? (
          <div style={{ position: 'absolute', left: FRAME.x + 560, top: FRAME.y + 4, opacity: protegeIn }}>
            <Chip accent="amber" size={34}>
              ¿protege?
            </Chip>
          </div>
        ) : null}
        {frame >= stopAt + 2 && ghostCaptionOut > 0.01 ? (
          <div style={{ position: 'absolute', left: BOX.natX + 12, top: FRAME.y + 10, ...ghostCaption, opacity: ghostCaption.opacity * ghostCaptionOut, fontFamily: FONT.sans, fontSize: 34, fontWeight: 700, color: STEEL_SOFT, whiteSpace: 'nowrap' }}>
            lo habría traducido igual
          </div>
        ) : null}

        {/* ---- the web packet at rest, then going through ---- */}
        {webRestShow > 0.01 ? (
          <div style={{ position: 'absolute', left: 108, top: WEB_Y - 27, opacity: webRestShow }}>
            <Parcel width={PARCEL_W} glow={0.3} />
          </div>
        ) : null}
        {webShow > 0.01 ? (
          <div style={{ position: 'absolute', left: webX, top: WEB_Y - 27, opacity: webShow }}>
            <Parcel width={PARCEL_W} glow={0.5} />
          </div>
        ) : null}

        <Box x={BOX.fwX} kind="fw" title="cortafuegos · decide" glow={fwGlow} opacity={fwIn}>
          {fwJob > 0.02 ? (
            <div style={{ position: 'absolute', left: 24, top: 104, fontFamily: FONT.sans, fontSize: 46, fontWeight: 850, color: C.cyanSoft, opacity: fwJob }}>decide qué pasa</div>
          ) : null}
        </Box>
        <Box x={BOX.natX} kind="nat" title="NAT · traduce" glow={natGlow}>
          {ghost > 0.01 ? (
            <div style={{ position: 'absolute', left: 24, top: 92, opacity: ghost, fontFamily: FONT.mono, fontSize: 27, fontWeight: 650, color: STEEL_SOFT, lineHeight: 1.45, whiteSpace: 'nowrap', clipPath: `inset(-4px ${Math.round((1 - ghost) * 100)}% -4px 0)` }}>
              <div style={{ textDecoration: 'line-through', textDecorationColor: STEEL }}>{NAT_ROWS[2].inside}</div>
              <div>{NAT_ROWS[2].outside}</div>
            </div>
          ) : null}
          {natJobText > 0.02 ? (
            <div style={{ position: 'absolute', left: 24, top: 104, fontFamily: FONT.sans, fontSize: 46, fontWeight: 850, color: C.amber, opacity: natJobText }}>traduce direcciones</div>
          ) : null}
        </Box>

        {/* ---- the remote desktop packet, held at the firewall ---- */}
        {rdpIn > 0.01 ? (
          <div style={{ position: 'absolute', left: rdpX + shake, top: RDP_Y - 27, opacity: rdpIn * (1 - progress(frame, stateAt - 12, 10)) }}>
            <Parcel width={PARCEL_W} tone="amber" glow={0.5} />
          </div>
        ) : null}
        {blockMark > 0.01 ? (
          <div style={{ position: 'absolute', left: FRAME.x - 36, top: RDP_Y - 38, width: 72, height: 72, borderRadius: 36, display: 'grid', placeItems: 'center', background: alpha(STEEL, 0.25), border: `4px solid ${STEEL_SOFT}`, opacity: blockMark, transform: `scale(${0.8 + 0.2 * blockMark})` }}>
            <Icon name="x" size={44} color="#ffffff" strokeWidth={3.6} />
          </div>
        ) : null}
        {rdpIn > 0.01 && rdpTagOut > 0.01 ? (
          <div style={{ position: 'absolute', left: 0, top: TAG_Y, ...rdpTag, opacity: rdpTag.opacity * rdpTagOut }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '6px 24px 8px 18px', borderRadius: RADIUS.pill, border: `3px solid ${alpha(C.amber, 0.8)}`, background: alpha(C.amber, 0.1), fontFamily: FONT.sans, fontSize: 36, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>
              <Parcel width={44} tone="amber" />
              {RDP_PACKET}
            </span>
          </div>
        ) : null}
        {frame >= rulesAt - 4 && rdpTagOut > 0.01 ? (
          <div style={{ position: 'absolute', left: 1060, top: TAG_Y + 2, ...listTitle, opacity: listTitle.opacity * rdpTagOut, fontFamily: FONT.sans, fontSize: 34, fontWeight: 750, color: C.muted, whiteSpace: 'nowrap' }}>
            reglas de salida de la naviera
          </div>
        ) : null}

        {/* ---- the portal's answer, remembered by the firewall ---- */}
        {stateShow > 0.01 ? (
          <div style={{ position: 'absolute', left: stateX, top: WEB_Y - 27, opacity: stateShow }}>
            <Parcel width={PARCEL_W} tone="emerald" glow={0.5} />
          </div>
        ) : null}
        {frame >= stateAt - 2 && stateCaptionOut > 0.01 ? (
          <div style={{ position: 'absolute', left: 0, top: TAG_Y - 2, width: 1728, display: 'flex', justifyContent: 'center', ...stateCaption, opacity: stateCaption.opacity * stateCaptionOut }}>
            <Line size={46} weight={850} color={C.emerald}>
              conversación abierta desde dentro · estado
            </Line>
          </div>
        ) : null}

        {/* ---- the rule list ---- */}
        {frame >= rulesAt - 2 ? (
          <div style={{ position: 'absolute', left: LIST_X, top: LIST_Y, opacity: listDim * listDimAfterSplit }}>
            <RuleList rows={rows} bar={bar} barOn={barOn} hit={hit} passed={passed} implicit={implicit} />
          </div>
        ) : null}

        {/* ---- neither encrypts ---- */}
        {frame >= nocryptAt - 4 ? (
          <div style={{ position: 'absolute', left: FRAME.x, top: 2, ...nocrypt }}>
            <Chip accent="cyan" size={36}>
              ninguno cifra · eso es TLS, en el siguiente vídeo
            </Chip>
          </div>
        ) : null}
      </Stage>
      <CaseStamp scene={S} />
    </>
  );
}

