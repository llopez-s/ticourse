import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, progress } from '../../../engine/src/theme/motion';
import { CaseStrip, Chip, Connector, Icon, MonoLine, NodeCard, Panel, curveBetween, type IconName } from '../../../engine/src/ui';
import { FLEET, HUNT_QUERY, XDR_SOURCES } from '../data/s08-scope';
import { Stage, segment } from './kit';

const MAIN_TOP = 108;
const HUNT_H = 120;
const GRID_TOP = MAIN_TOP + HUNT_H + 40;
const CARD_W = 540;
const CARD_GAP = 24;
// Wide gap: the "Estación de administración" badge sits BELOW its card
// (not on top of it — a top badge at label size would cover the hostname).
const ROW_GAP = 76;

/**
 * S08 «Alcance: la flota y el XDR»: before cleaning anything you need scope —
 * hunt the hash, the domain and the process pattern across enrolled
 * endpoints (2 more hits, one of them ADM-WS-02); then XDR joins mail, DNS,
 * firewall, IDS and endpoint into a single incident.
 */
export function S08Scope(props: SceneProps) {
  const frame = useCurrentFrame();
  const hunt = props.cue('hunt');
  const hits2 = props.cue('hits-2');
  const admWs = props.cue('adm-ws');
  const xdr = props.cue('xdr');
  const closingAt = segment(props, 's08-05').from;

  // Phase A (hunt + fleet grid) hands over to phase B (XDR diagram) at `xdr`.
  const aOut = progress(frame, xdr - 10, 18, EASE.inOut);

  return (
    <Stage>
      <CaseStrip
        status={frame >= xdr ? 'INCIDENTE ÚNICO' : 'ALCANCE EN CURSO'}
        statusAccent={frame >= xdr ? 'cyan' : 'amber'}
        markers={[{ time: '01:52', label: 'logon', accent: 'rose', reveal: 0 }]}
        style={{ position: 'absolute', left: 0, top: 0 }}
      />

      {aOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - aOut, transform: `translateY(${-18 * aOut}px)` }}>
          <div style={{ position: 'absolute', left: 0, top: MAIN_TOP, width: STAGE.width, height: HUNT_H, ...enter(frame, hunt, { distance: 14 }) }}>
            <Panel
              title="Caza de IOC · flota EDR"
              icon="search"
              accent="cyan"
              right={
                frame >= hits2 ? (
                  <span style={{ ...enter(frame, hits2, { distance: 8 }) }}>
                    <Chip accent="rose" icon="alert" size={TYPE.label} solid>
                      +2 aciertos
                    </Chip>
                  </span>
                ) : undefined
              }
              style={{ height: '100%' }}
              bodyStyle={{ padding: '0 26px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 28, height: '100%' }}>
                {HUNT_QUERY.map((q, i) => {
                  const at = hunt + 8 + i * 10;
                  if (frame < at) return null;
                  return (
                    <div key={q.label} style={{ ...enter(frame, at, { distance: 10 }) }}>
                      <span style={{ fontFamily: FONT.sans, fontSize: TYPE.micro, fontWeight: 750, color: C.muted, marginRight: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                        {q.label}
                      </span>
                      <MonoLine tokens={[{ t: q.value, c: C.cyanSoft }]} size={TYPE.small} style={{ display: 'inline' }} />
                    </div>
                  );
                })}
              </div>
            </Panel>
          </div>

          <div style={{ position: 'absolute', left: 0, top: GRID_TOP, width: STAGE.width }}>
            {[0, 1].map((row) => (
              <div key={row} style={{ display: 'flex', gap: CARD_GAP, marginTop: row === 0 ? 0 : ROW_GAP }}>
                {FLEET.slice(row * 3, row * 3 + 3).map((host) => {
                  const isNewHit = host.hit && frame >= hits2;
                  const state: 'normal' | 'alert' = host.already || isNewHit ? 'alert' : 'normal';
                  const showAdmin = host.admin && frame >= admWs;
                  return (
                    <div key={host.host} style={{ position: 'relative' }}>
                      <NodeCard icon="laptop" label={host.host} sublabel={host.role} accent="cyan" state={state} width={CARD_W} />
                      {showAdmin ? (
                        <div style={{ position: 'absolute', left: 0, top: 104, ...enter(frame, admWs, { distance: 8 }) }}>
                          {/* No icon here: with it, the chip's width matches the 540px card
                              almost exactly and can read as overhanging it. */}
                          <Chip accent="rose" size={TYPE.label} solid>
                            Estación de administración
                          </Chip>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

        </div>
      ) : null}

      {frame >= xdr - 24 ? (
        <div style={{ position: 'absolute', left: 0, top: MAIN_TOP, width: STAGE.width, height: STAGE.height - MAIN_TOP, opacity: aOut }}>
          <XdrDiagram frame={frame} xdr={xdr} closingAt={closingAt} />
        </div>
      ) : null}
    </Stage>
  );
}

const NODE_W = 300;
const NODE_H = 84;
const HUB_W = 620;
const HUB_LEFT = STAGE.width - NODE_W - HUB_W - 120;

function XdrDiagram({ frame, xdr, closingAt }: { frame: number; xdr: number; closingAt: number }) {
  const rows = XDR_SOURCES.length;
  const totalH = rows * NODE_H + (rows - 1) * 18;
  const top0 = (STAGE.height - MAIN_TOP - totalH) / 2 - 40;
  const hubCenterY = top0 + totalH / 2;
  const hubLeftX = HUB_LEFT;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg width={STAGE.width} height={STAGE.height - MAIN_TOP} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {XDR_SOURCES.map((s, i) => {
          const at = xdr + 4 + i * 8;
          const draw = progress(frame, at, 16, EASE.inOut);
          if (draw <= 0) return null;
          const y = top0 + i * (NODE_H + 18) + NODE_H / 2;
          const curve = curveBetween({ x: NODE_W + 8, y }, { x: hubLeftX - 8, y: hubCenterY });
          return <Connector key={s.label} curve={curve} draw={draw} color={C.cyanSoft} width={3} />;
        })}
      </svg>

      {XDR_SOURCES.map((s, i) => {
        const at = xdr + i * 8;
        if (frame < at) return null;
        const y = top0 + i * (NODE_H + 18);
        const inn = enter(frame, at, { distance: 14, axis: 'x' });
        return (
          <div key={s.label} style={{ position: 'absolute', left: 0, top: y, width: NODE_W, ...inn }}>
            <NodeCard icon={s.icon as IconName} label={s.label} accent="cyan" state="active" width={NODE_W} />
          </div>
        );
      })}

      <div
        style={{
          position: 'absolute',
          left: hubLeftX,
          top: hubCenterY - 180,
          width: HUB_W,
          ...enter(frame, xdr + 30, { distance: 20 }),
        }}
      >
        <Panel title="XDR · correlación" icon="merge" accent="cyan" glow={0.5} style={{ height: 360 }} bodyStyle={{ padding: '20px 30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: '100%' }}>
            <Icon name="target" size={64} color={C.cyan} />
            <div>
              <div style={{ fontFamily: FONT.sans, fontSize: TYPE.h3, fontWeight: 800, color: C.textStrong, lineHeight: 1.2 }}>
                Un incidente
              </div>
              <div style={{ fontFamily: FONT.sans, fontSize: TYPE.small, color: C.muted, marginTop: 8, lineHeight: 1.4, maxWidth: HUB_W - 140 }}>
                Correo, DNS, firewall, IDS y endpoint: correlados en un solo caso.
              </div>
            </div>
          </div>
        </Panel>
      </div>

      {frame >= closingAt ? (
        <div style={{ position: 'absolute', left: hubLeftX, top: hubCenterY + 200, width: HUB_W, opacity: fadeIn(frame, closingAt, 14) }}>
          <div
            style={{
              fontFamily: FONT.sans,
              fontSize: TYPE.label,
              fontWeight: 650,
              color: C.text,
              padding: '14px 24px',
              borderRadius: RADIUS.md,
              border: `2px solid ${C.ink700}`,
              background: alpha(C.ink850, 0.85),
            }}
          >
            Por separado, poca cosa. Juntos, cuentan el ataque entero.
          </div>
        </div>
      ) : null}
    </div>
  );
}
