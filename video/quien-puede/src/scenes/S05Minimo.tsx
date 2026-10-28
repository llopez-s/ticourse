import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, clamp01 } from '../../../engine/src/ui';
import { Connector, Packet } from '../../../engine/src/ui/Connector';
import { curveBetween, cubicPoint } from '../../../engine/src/ui/geometry';
import { Stage, wordFrame } from './kit';
import { Rotulo, SceneStamp } from './parts/Bits';
import { FOLDER_NAME, PARTES } from './parts/data';
import { AclRow, FolderGlyph } from './parts/FolderAcl';
import { Pill, SoftTag, TermPill } from './parts/Labels';
import { win } from './parts/timing';

const S = 's05-minimo';
const RX = 620;
const RW = 1108;

const OPS = PARTES[2];

function RiskCard({ top, height, children, show, tone = C.amber, glow = 0 }: { top: number; height: number; children: ReactNode; show: number; tone?: string; glow?: number }) {
  const s = clamp01(show);
  return (
    <div
      style={{
        position: 'absolute',
        left: RX,
        top,
        width: RW,
        height,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(tone, 0.45 + 0.4 * glow)}`,
        background: alpha(tone, 0.05 + 0.05 * glow),
        boxShadow: glow > 0.02 ? `0 0 ${Math.round(30 * glow)}px ${alpha(tone, 0.28 * glow)}` : undefined,
        opacity: s,
        transform: `translateY(${(1 - s) * 22}px)`,
        fontFamily: FONT.sans,
      }}
    >
      {children}
    </div>
  );
}

/**
 * s05-minimo «Por si acaso, no». A request from Operaciones (`request`); on the left «qué pierde con leer: nada»
 * (`nothing`) with the row of Operaciones, which stays at «leer»; on the right two amber risks of giving write access: a
 * file dragged to another folder by mistake (`drag`) and a malicious program on any laptop, which spoils or hijacks
 * whatever its account can write (`malware`). On `blocked` the program hits the read-only folder and nothing changes.
 * LEAST PRIVILEGE (`name`), «lo necesario para la tarea · nada más» (`task`), the two steps «qué hace el puesto» then
 * «justo eso», and the close of the chapter (`wrap`).
 */
export function S05Minimo(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const requestAt = props.cue('request');
  const nothingAt = props.cue('nothing');
  const dragAt = props.cue('drag');
  const malwareAt = props.cue('malware');
  const blockedAt = props.cue('blocked');
  const nameAt = props.cue('name');
  const taskAt = props.cue('task');
  const wrapAt = props.cue('wrap');
  const step1At = Math.max(taskAt + 24, wordFrame(S, 's05-04', 'Primero'));
  const step2At = Math.max(step1At + 24, wordFrame(S, 's05-04', 'después'));

  // everything of the first half steps back when the name arrives
  const back = 1 - progress(frame, nameAt - 4, 18);

  // --- drag: a file goes from one folder to another by mistake
  const dragCurve = curveBetween({ x: 170, y: 78 }, { x: 470, y: 78 }, 0.45);
  const fileT = progress(frame, dragAt + 10, 46, EASE.inOut);
  const filePos = cubicPoint(dragCurve, fileT);

  // --- malware: a packet runs from the laptop to the folder; on `blocked` it hits the read-only barrier and bounces
  const mCurve = curveBetween({ x: 180, y: 78 }, { x: 440, y: 78 }, 0.4);
  const run = ((frame - malwareAt) / fps) * 0.7;
  const blockedF = frame - blockedAt;
  let packetT = 0;
  if (frame >= malwareAt + 8 && blockedF < 0) packetT = run % 1 < 0.02 ? 0.02 : run % 1;
  else if (blockedF >= 0 && blockedF < 26) packetT = blockedF < 12 ? 0.04 + (0.62 * blockedF) / 12 : 0.66 - (0.5 * (blockedF - 12)) / 14;
  const barrier = progress(frame, blockedAt - 4, 12);
  const safe = progress(frame, blockedAt + 8, 14);

  return (
    <Stage>
      <SceneStamp frame={frame} />

      <div style={{ opacity: back, display: back < 0.01 ? 'none' : undefined }}>
        {/* the request */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 84,
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            padding: '16px 36px 16px 26px',
            borderRadius: RADIUS.lg,
            border: `3px solid ${alpha(C.cyan, 0.7)}`,
            background: alpha(C.cyan, 0.07),
            fontFamily: FONT.sans,
            ...enter(frame, requestAt - 2, { distance: 24, duration: 16 }),
          }}
        >
          <Icon name="users" size={56} color={C.cyan} />
          <span style={{ fontSize: 40, fontWeight: 750, color: C.muted }}>Operaciones:</span>
          <span style={{ fontSize: 52, fontWeight: 850, letterSpacing: -1, color: C.textStrong }}>¿escritura, por si acaso?</span>
        </div>

        {/* left: what they lose with read */}
        <div style={{ position: 'absolute', left: 0, top: 244, width: 560, height: 380, boxSizing: 'border-box', padding: '24px 28px', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.emerald, 0.5)}`, background: alpha(C.emerald, 0.05), fontFamily: FONT.sans, ...enter(frame, nothingAt - 6, { distance: 22, duration: 16 }) }}>
          <div style={{ fontSize: 38, fontWeight: 750, color: C.muted }}>qué pierde con leer</div>
          <div style={{ fontSize: 150, fontWeight: 900, letterSpacing: -4, lineHeight: 1.05, color: C.emerald, opacity: progress(frame, nothingAt, 14), transform: `scale(${0.9 + 0.1 * progress(frame, nothingAt, 14)})`, transformOrigin: 'left center' }}>nada</div>
          <div style={{ position: 'absolute', left: 28, bottom: 28 }}>
            <AclRow entry={OPS} width={504} fx={{ focus: 0.5 + 0.5 * safe }} />
          </div>
        </div>

        {/* right: the risks of write access */}
        <RiskCard top={244} height={176} show={progress(frame, dragAt - 4, 16)}>
          <div style={{ position: 'absolute', left: 36, top: 24 }}>
            <FolderGlyph width={110} />
            <div style={{ fontSize: 28, fontWeight: 700, color: C.muted, marginTop: 6, whiteSpace: 'nowrap' }}>{FOLDER_NAME}</div>
          </div>
          <div style={{ position: 'absolute', left: 416, top: 24 }}>
            <FolderGlyph width={110} tone={C.muted} />
            <div style={{ fontSize: 28, fontWeight: 700, color: C.muted, marginTop: 6, whiteSpace: 'nowrap' }}>otra carpeta</div>
          </div>
          <svg width={RW} height={176} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
            <Connector curve={dragCurve} color={C.amber} width={4} dashed opacity={0.8} />
            <g transform={`translate(${filePos.x - 30} ${filePos.y - 64})`} opacity={clamp01(fileT * 8)}>
              <Icon name="file" size={60} color={C.amber} strokeWidth={2.2} />
            </g>
          </svg>
          <div style={{ position: 'absolute', left: 620, top: 0, height: 176, display: 'flex', alignItems: 'center', fontSize: 38, fontWeight: 800, lineHeight: 1.18, color: C.textStrong }}>
            un archivo arrastrado
            <br />
            sin querer
          </div>
        </RiskCard>

        <RiskCard top={440} height={184} show={progress(frame, malwareAt - 4, 16)} tone={safe > 0.5 ? C.emerald : C.amber} glow={safe}>
          <div style={{ position: 'absolute', left: 30, top: 14 }}>
            <Icon name="laptop" size={104} color={C.amber} strokeWidth={1.6} />
            <div style={{ marginTop: 4 }}>
              <SoftTag text="programa malicioso" size={26} />
            </div>
          </div>
          <div style={{ position: 'absolute', left: 440, top: 14 }}>
            <FolderGlyph width={110} tone={safe > 0.5 ? C.emerald : C.cyan} />
            <div style={{ fontSize: 28, fontWeight: 700, color: safe > 0.5 ? '#6ee7b7' : C.muted, marginTop: 6, whiteSpace: 'nowrap' }}>solo lectura</div>
          </div>
          <svg width={RW} height={184} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
            <g transform="translate(0 14)">
              <Connector curve={mCurve} color={C.amber} width={4} dashed opacity={0.5} />
              {packetT > 0 ? <Packet curve={mCurve} t={packetT} color={C.amber} radius={11} /> : null}
              {/* the barrier in front of the folder: the read-only wall */}
              <g opacity={barrier}>
                <rect x={414} y={20} width={14} height={110} rx={7} fill={alpha(C.emerald, 0.85)} stroke={C.emerald} strokeWidth={3} />
              </g>
            </g>
          </svg>
          <div style={{ position: 'absolute', left: 620, top: 0, height: 184, display: 'flex', alignItems: 'center', fontSize: 34, fontWeight: 800, lineHeight: 1.18, whiteSpace: 'nowrap', color: safe > 0.5 ? '#6ee7b7' : C.textStrong }}>
            {safe > 0.5 ? (
              <span>
                choca y no cambia nada:
                <br />
                la fila sigue en «leer»
              </span>
            ) : (
              <span>
                estropea o secuestra
                <br />
                lo que su cuenta
                <br />
                puede escribir
              </span>
            )}
          </div>
        </RiskCard>
      </div>

      {/* the name, the rule and the two steps */}
      {frame >= nameAt - 6 ? (
        <>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 150, display: 'flex', justifyContent: 'center', ...enter(frame, nameAt, { distance: 20, duration: 16 }) }}>
            <TermPill text="LEAST PRIVILEGE" size={72} on={progress(frame, nameAt, 14)} />
          </div>
          <Rotulo weight={progress(frame, taskAt, 16)} size={64} style={{ position: 'absolute', left: 0, right: 0, top: 290, textAlign: 'center' }}>
            lo necesario para la tarea <span style={{ color: C.faint }}>·</span> <span style={{ color: C.emerald }}>nada más</span>
          </Rotulo>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 410, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 28, opacity: 1 - 0.45 * progress(frame, wrapAt - 4, 16) }}>
            <div style={enter(frame, step1At, { distance: 18, duration: 14 })}>
              <Pill text="qué hace el puesto" tone={C.cyan} on={0.8} size={46} height={90} />
            </div>
            <div style={{ opacity: progress(frame, step2At - 8, 12) }}>
              <Icon name="arrowRight" size={64} color={C.cyan} strokeWidth={2.4} />
            </div>
            <div style={enter(frame, step2At, { distance: 18, duration: 14 })}>
              <Pill text="justo eso" tone={C.emerald} on={0.8} size={46} height={90} />
            </div>
          </div>
        </>
      ) : null}

      <Rotulo weight={win(frame, wrapAt, Number.POSITIVE_INFINITY, 16)} size={56} style={{ position: 'absolute', left: 0, right: 0, top: 522, textAlign: 'center' }}>
        el permiso sale de <span style={{ color: C.cyan }}>la tarea</span>,
        <br />
        no de la comodidad
      </Rotulo>
    </Stage>
  );
}
