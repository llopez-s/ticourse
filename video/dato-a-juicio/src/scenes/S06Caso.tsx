import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { ReactNode } from 'react';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse } from '../../../engine/src/theme/motion';
import { Building, Icon } from '../../../engine/src/ui';
import { MiniTriangle } from './parts/MiniTriangle';
import { Silhouette } from './parts/Glyphs';
import { ThreatTriangle } from './parts/Triangle';
import type { Piece } from '../data/canon';
import { Stage, wordFrame } from './kit';

const S = 's06-caso';
const W = STAGE.width;

const TRI = { x: 20, y: 196, scale: 0.85 } as const;
const PANEL_X = 700;

/** The three quick schemas (storyboard `others`): which pieces are lit, which one is missing, and the wording. */
const SCHEMAS: { why: string; on: readonly Piece[]; missing: Piece; line1: string; line2: string }[] = [
  { why: 'exploit público · programa que no usas', on: ['capability'], missing: 'opportunity', line1: 'capability', line2: 'sin opportunity' },
  { why: 'odia tu sector · sin malware que funcione', on: ['intent'], missing: 'capability', line1: 'intent', line2: 'sin capability' },
  { why: 'herramientas y acceso · tus datos no le sirven', on: ['capability', 'opportunity'], missing: 'intent', line1: 'capability + opportunity', line2: 'sin intent' },
];

/**
 * s06-caso «Un caso para practicar». The threat triangle of the last scene on the left; on the right another company,
 * «otra empresa · no es Meridian» (a generic block, grey), and a group whose two lit chips fill two slots on the words
 * «ransomware que funciona» (capacidad) and «lo proclama en público» (intención). On `isolated` the installation appears with
 * its lock and a cable that ends in the air, cut off from the outside. Under the think prompt the third slot stays empty and
 * unmarked. On `opp` it is picked out — «sin camino hasta ellos», «hoy: amenaza incompleta». On `others` the picture gives
 * way to three quick schemas, one per missing piece (one per sentence of the voice). On `watch` it comes back: «hoy no» no es
 * «nunca», the cable joins, the slot lights and «sigue vigilando» closes.
 */
export function S06Caso(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const isolated = props.cue('isolated');
  const opp = props.cue('opp');
  const others = props.cue('others');
  const watch = props.cue('watch');

  // ---- Base picture.
  const otherAt = wordFrame(S, 's06-01', 'caso') - 6;
  const notMeridianAt = wordFrame(S, 's06-01', 'Meridian') - 8;
  const groupAt = wordFrame(S, 's06-01', 'grupo') - 8;
  const ransomAt = wordFrame(S, 's06-01', 'ransomware') - 8;
  const announceAt = wordFrame(S, 's06-01', 'anuncia') - 8;
  const instAt = wordFrame(S, 's06-02', 'instalación') - 8;
  const noRemoteAt = wordFrame(S, 's06-02', 'remoto') - 6;
  const baseOut = progress(frame, others - 8, 16, EASE.inOut);
  const baseBack = progress(frame, watch - 8, 16, EASE.inOut);
  const baseShow = (1 - baseOut) + baseBack * baseOut;

  const lit: Record<Piece, number> = {
    intent: progress(frame, announceAt + 6, 16),
    capability: progress(frame, ransomAt + 6, 16),
    opportunity: progress(frame, wordFrame(S, 's06-07', 'aparece') - 4, 18),
  };
  const gapIn = progress(frame, opp, 14) * (1 - progress(frame, watch - 10, 14));
  const gap = { opportunity: gapIn };

  // ---- Answer: caption, remote path.
  const todayAt = wordFrame(S, 's06-03', 'Hoy') - 8;
  const noPathAt = wordFrame(S, 's06-03', 'ningún') - 6;
  const caption = progress(frame, todayAt, 14) * (1 - progress(frame, watch - 10, 14));

  // ---- Watch.
  const neverAt = Math.max(watch, wordFrame(S, 's06-07', 'nunca') - 14);
  const opensAt = wordFrame(S, 's06-07', 'abre') - 6;
  const lookAt = wordFrame(S, 's06-07', 'vigilando') - 10;
  const joined = progress(frame, opensAt, 20);

  // ---- Schemas.
  const schemaAt = [others, wordFrame(S, 's06-05', 'grupo') - 10, wordFrame(S, 's06-06', 'herramientas') - 10];
  const schemasOut = progress(frame, watch - 8, 16, EASE.inOut);

  return (
    <Stage>
      {baseShow > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: baseShow, fontFamily: FONT.sans }}>
          {/* Triangle (left) */}
          <div style={{ position: 'absolute', left: TRI.x, top: TRI.y, ...enter(frame, 0, { distance: 14, duration: 14 }) }}>
            <ThreatTriangle lit={lit} gap={gap} whole={0} scale={TRI.scale} />
          </div>
          <div style={{ position: 'absolute', left: TRI.x, top: TRI.y + 392, width: 527, textAlign: 'center', opacity: caption, transform: `translateY(${(1 - caption) * 10}px)`, fontSize: 40, fontWeight: 850, color: '#fcd34d', whiteSpace: 'nowrap' }}>
            hoy: amenaza incompleta
          </div>

          {/* The group and its two lit chips (right, row A) */}
          <div style={{ position: 'absolute', left: PANEL_X, top: 196, ...enter(frame, groupAt, { distance: 14 }) }}>
            <Silhouette width={86} />
            <div style={{ marginTop: 4, width: 110, fontSize: 30, fontWeight: 700, color: C.roseSoft, whiteSpace: 'nowrap' }}>un grupo</div>
          </div>
          <Ficha left={PANEL_X + 150} top={196} at={ransomAt} frame={frame} icon="gear" tag="capacidad">
            ransomware que funciona
          </Ficha>
          <Ficha left={PANEL_X + 150} top={268} at={announceAt} frame={frame} icon="target" tag="intención">
            lo proclama en público
          </Ficha>

          {/* The other company (right, row B) */}
          <div style={{ position: 'absolute', left: PANEL_X, top: 346, fontSize: 36, fontWeight: 750, color: C.muted, whiteSpace: 'nowrap', ...enter(frame, notMeridianAt, { distance: 12 }) }}>
            <span style={{ display: 'inline-block', padding: '3px 20px', borderRadius: 999, border: `2px dashed ${alpha(C.faint, 0.8)}` }}>otra empresa · no es Meridian</span>
          </div>
          <div style={{ position: 'absolute', left: PANEL_X, top: 398, opacity: progress(frame, otherAt, 14) }}>
            <Building width={190} height={118} cols={5} rows={4} seed={9} mix={{ cyan: 0.05, amber: 0 }} tone="muted" at={otherAt} />
          </div>

          {/* The isolated installation, its lock and the cable that ends in the air */}
          <Installation frame={frame} fps={fps} at={instAt} lockAt={isolated} noRemoteAt={noRemoteAt} noPathAt={noPathAt} joined={joined} />

          {/* «hoy no» no es «nunca», then «sigue vigilando» */}
          {frame >= neverAt - 4 ? <WatchLine frame={frame} neverAt={neverAt} lookAt={lookAt} /> : null}
        </div>
      ) : null}

      {/* Three quick schemas, one per missing piece */}
      {schemasOut < 1 && baseOut > 0 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: baseOut * (1 - schemasOut), fontFamily: FONT.sans }}>
          {SCHEMAS.map((sc, i) => {
            const e = enter(frame, schemaAt[i], { distance: 26 });
            const cardW = 540;
            return (
              <div
                key={sc.line1}
                style={{
                  position: 'absolute',
                  left: i * ((W - cardW) / 2),
                  top: 196,
                  width: cardW,
                  height: 452,
                  boxSizing: 'border-box',
                  padding: '24px 30px 24px',
                  borderRadius: RADIUS.lg,
                  border: `2px solid ${alpha(C.amber, 0.5)}`,
                  background: `linear-gradient(180deg, ${alpha(C.amber, 0.07)} 0%, ${alpha(C.ink900, 0.96)} 55%)`,
                  boxShadow: `0 20px 50px ${alpha('#000000', 0.3)}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  ...e,
                }}
              >
                <div style={{ height: 82, width: '100%', fontSize: 31, fontWeight: 650, lineHeight: 1.28, color: C.text, textAlign: 'center' }}>{sc.why}</div>
                <div style={{ marginTop: 8 }}>
                  <MiniTriangle on={sc.on} missing={sc.missing} />
                </div>
                <div style={{ marginTop: 14, textAlign: 'center', whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: 38, fontWeight: 850, color: C.textStrong, lineHeight: 1.15 }}>{sc.line1}</div>
                  <div style={{ fontSize: 38, fontWeight: 850, color: '#fcd34d', lineHeight: 1.15 }}>{sc.line2}</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </Stage>
  );
}

/** A lit chip («ficha encendida») with the piece it fills as a small tag. */
function Ficha({ left, top, at, frame, icon, tag, children }: { left: number; top: number; at: number; frame: number; icon: 'gear' | 'target'; tag: string; children: ReactNode }) {
  const e = enter(frame, at, { distance: 18, axis: 'x' });
  return (
    <div style={{ position: 'absolute', left, top, display: 'flex', alignItems: 'center', gap: 16, padding: '8px 26px 8px 18px', borderRadius: 999, border: `3px solid ${alpha(C.rose, 0.85)}`, background: alpha(C.rose, 0.14), boxShadow: `0 0 26px ${alpha(C.rose, 0.3)}`, whiteSpace: 'nowrap', fontFamily: FONT.sans, ...e }}>
      <Icon name={icon} size={38} color={C.roseSoft} strokeWidth={2.2} />
      <span style={{ fontSize: 38, fontWeight: 800, color: C.textStrong }}>{children}</span>
      <span style={{ fontSize: 28, fontWeight: 700, color: C.roseSoft }}>· {tag}</span>
    </div>
  );
}

const INST = { x: 960, y: 410, w: 300, h: 150 } as const;
const EXT = { x: 1580, y: 435 } as const;

/** The isolated installation (a box with a server and a lock), the outside world and the cable between them. */
function Installation({ frame, fps, at, lockAt, noRemoteAt, noPathAt, joined }: { frame: number; fps: number; at: number; lockAt: number; noRemoteAt: number; noPathAt: number; joined: number }) {
  const e = enter(frame, at, { distance: 18 });
  const lock = progress(frame, lockAt, 12);
  const cableY = INST.y + INST.h / 2;
  const x1 = INST.x + INST.w;
  const x2 = EXT.x;
  const gapA = x1 + (x2 - x1) * 0.38;
  const gapB = x1 + (x2 - x1) * 0.62;
  const cut = progress(frame, noRemoteAt, 14) * (1 - joined);
  const label = progress(frame, noPathAt, 14) * (1 - joined);
  const beat = 0.7 + 0.3 * pulse(frame, fps, 0.6);
  return (
    <>
      {/* the outside world */}
      <div style={{ position: 'absolute', left: EXT.x - 20, top: EXT.y - 42, width: 140, textAlign: 'center', fontSize: 30, fontWeight: 700, color: C.muted, opacity: progress(frame, at + 8, 14) }}>exterior</div>
      <div style={{ position: 'absolute', left: EXT.x, top: EXT.y, width: 100, height: 100, borderRadius: 50, display: 'grid', placeItems: 'center', border: `3px solid ${alpha(C.sky, 0.7)}`, background: alpha(C.sky, 0.1), opacity: progress(frame, at + 8, 14) }}>
        <Icon name="globe" size={60} color={C.sky} strokeWidth={2} />
      </div>
      {/* the cable: two stubs and a gap, or joined */}
      <svg width={W} height={STAGE.height} style={{ position: 'absolute', left: 0, top: 0, opacity: progress(frame, at + 6, 14) }}>
        <line x1={x1} y1={cableY} x2={joined > 0.01 ? x1 + (x2 - x1) * Math.max(joined, 0.38) : gapA} y2={cableY} stroke={joined > 0.01 ? C.rose : alpha(C.faint, 0.9)} strokeWidth={joined > 0.01 ? 7 : 5} strokeLinecap="round" />
        {joined < 0.4 ? <line x1={gapB} y1={cableY} x2={x2 - 10} y2={cableY} stroke={alpha(C.faint, 0.9)} strokeWidth={5} strokeLinecap="round" opacity={1 - joined * 2.5} /> : null}
        {cut > 0.01 ? (
          <g opacity={cut}>
            <path d={`M${(gapA + gapB) / 2 - 16} ${cableY - 16}L${(gapA + gapB) / 2 + 16} ${cableY + 16}M${(gapA + gapB) / 2 + 16} ${cableY - 16}L${(gapA + gapB) / 2 - 16} ${cableY + 16}`} stroke={C.amber} strokeWidth={6} strokeLinecap="round" />
          </g>
        ) : null}
      </svg>
      <div style={{ position: 'absolute', left: (gapA + gapB) / 2 - 140, top: cableY - 84, width: 280, textAlign: 'center', fontSize: 28, fontWeight: 800, color: '#fcd34d', opacity: cut, whiteSpace: 'nowrap' }}>sin acceso remoto</div>
      {label > 0.01 ? (
        <div style={{ position: 'absolute', left: (gapA + gapB) / 2 - 200, top: cableY + 56, width: 400, textAlign: 'center', fontSize: 32, fontWeight: 800, color: '#fcd34d', opacity: label, whiteSpace: 'nowrap' }}>sin camino hasta ellos</div>
      ) : null}
      {joined > 0.01 ? (
        <div style={{ position: 'absolute', left: (gapA + gapB) / 2 - 140, top: cableY - 84, width: 280, textAlign: 'center', fontSize: 32, fontWeight: 800, color: '#fecdd3', opacity: joined, whiteSpace: 'nowrap' }}>acceso remoto</div>
      ) : null}
      {/* the installation */}
      <div
        style={{
          position: 'absolute',
          left: INST.x,
          top: INST.y,
          width: INST.w,
          height: INST.h,
          boxSizing: 'border-box',
          borderRadius: RADIUS.lg,
          border: `3px dashed ${alpha(C.emerald, 0.65 + 0.3 * lock)}`,
          background: alpha(C.ink850, 0.95),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          boxShadow: joined > 0.01 ? `0 0 ${Math.round(34 * joined * beat)}px ${alpha(C.rose, 0.45)}` : undefined,
          ...e,
        }}
      >
        <Icon name="server" size={56} color={C.emerald} strokeWidth={2} />
        <div style={{ fontSize: 31, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>instalación aislada</div>
        <div style={{ position: 'absolute', right: 12, top: 10, width: 54, height: 54, borderRadius: 27, display: 'grid', placeItems: 'center', background: C.ink900, border: `3px solid ${joined > 0.3 ? C.rose : C.emerald}`, opacity: lock, transform: `scale(${0.6 + 0.4 * lock})` }}>
          <Icon name={joined > 0.3 ? 'unlock' : 'lock'} size={30} color={joined > 0.3 ? C.roseSoft : C.emerald} strokeWidth={2.4} />
        </div>
      </div>
    </>
  );
}

/** Bottom line: «hoy no» no es «nunca» (on its cue), then «sigue vigilando» with an eye. */
function WatchLine({ frame, neverAt, lookAt }: { frame: number; neverAt: number; lookAt: number }) {
  const a = progress(frame, neverAt, 16);
  const b = progress(frame, lookAt, 16);
  return (
    <div style={{ position: 'absolute', left: 0, top: 600, width: W, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 44, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
      <span style={{ fontSize: 50, fontWeight: 850, color: C.textStrong, opacity: a * (1 - 0.45 * b), transform: `translateY(${(1 - a) * 14}px)` }}>
        «hoy no» no es «nunca»
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '6px 30px 6px 20px', borderRadius: 999, border: `3px solid ${alpha(C.cyan, 0.85)}`, background: alpha(C.cyan, 0.14), fontSize: 46, fontWeight: 850, color: C.cyanSoft, opacity: b, transform: `translateY(${(1 - b) * 14}px)` }}>
        <Icon name="eye" size={46} color={C.cyan} strokeWidth={2.2} />
        sigue vigilando
      </span>
    </div>
  );
}
