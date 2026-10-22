import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, clamp01, type IconName } from '../../../engine/src/ui';
import { Door } from './parts/Doors';
import { CaseStamp, Pill, TermPill } from './parts/Labels';
import { Sheet } from './parts/Sheet';
import { Stage, wordFrame } from './kit';

const S = 's04-aaa';
const W = 1728;
const STAMP = ['Autoridad Portuaria de Halden', 'propuesta · sin fecha'];

const DOOR_W = 460;
const DOOR_H = 246;
const DOOR_TOP = 74;
const DOOR_X = [60, 634, 1208];
const DOOR_CX = DOOR_X.map((x) => x + DOOR_W / 2);
/** The path the sheet walks along, under the doors. */
const PATH_Y = 352;
const MINI_W = 64;
const DETAIL_TOP = 404;
const COL_W = 800;
const COL2_W = 830;
const FOOT_TOP = 650;

/** One line of a detail block: an optional icon and text, lit by `on`. */
function Line({ icon, children, on, size = 36, color = C.text }: { icon?: IconName; children: ReactNode; on: number; size?: number; color?: string }) {
  const o = clamp01(on);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 50, fontSize: size, fontWeight: 750, color, opacity: 0.3 + 0.7 * o, whiteSpace: 'nowrap' }}>
      {icon ? <Icon name={icon} size={36} color={C.cyan} /> : null}
      <span>{children}</span>
    </div>
  );
}

/**
 * s04-aaa «Quién, qué y qué queda». The proposal stamp and three screen doors — three drawn questions, no lock, reader
 * or lobby — faint from the first frame, solid on `doors`. A small copy of the sheet walks along a line under them and
 * stops under each door on its cue, while that door grows bright and its detail fills the band below:
 * `who` the shipping line's system identifies itself, nobody types, AUTHENTICATION and on `cert` «también las
 * máquinas, con un certificado» · `what` who declares sends and corrects, Operaciones only reads, AUTHORIZATION, and on
 * `role` ROLE-BASED «el permiso va con el puesto»; on `attr` the emergency role, only while that ship is in port,
 * ATTRIBUTE-BASED «varias cosas a la vez: quién, qué hoja, cuándo», then half lit «a cada uno, lo justo: least
 * privilege» · `log` «quién la abrió · quién la cambió · cuándo», ACCOUNTING. On `order` the three doors light together
 * and the footer reads «primero quién, luego qué, y todo apuntado».
 */
export function S04Aaa(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const doorsAt = props.cue('doors');
  const whoAt = props.cue('who');
  const certAt = props.cue('cert');
  const whatAt = props.cue('what');
  const roleAt = props.cue('role');
  const attrAt = props.cue('attr');
  const logAt = props.cue('log');
  const orderAt = props.cue('order');
  const navieraAt = w('s04-02', 'naviera') - 6;
  const authnAt = w('s04-02', 'authentication') - 6;
  const certWordAt = w('s04-02', 'certificado') - 6;
  const declaraAt = w('s04-03', 'declara') - 6;
  const opsAt = w('s04-03', 'Operaciones') - 6;
  const authzAt = w('s04-03', 'authorization') - 6;
  const roleWordAt = w('s04-03', 'role-based') - 6;
  const barcoAt = w('s04-04', 'barco') - 6;
  const attrWordAt = w('s04-04', 'attribute-based') - 6;
  const cosasAt = w('s04-04', 'quién', 1) - 6;
  const leastAt = w('s04-05', 'least') - 6;
  const acctAt = w('s04-06', 'accounting') - 6;
  const cambioAt = w('s04-06', 'cambió') - 6;
  const cuandoAt = w('s04-06', 'cuándo') - 6;

  const stampIn = enter(frame, -6, { distance: 16, duration: 16 });
  const doorOn = [
    progress(frame, whoAt, 12) * (1 - progress(frame, whatAt - 4, 12)),
    progress(frame, whatAt, 12) * (1 - progress(frame, logAt - 4, 12)),
    progress(frame, logAt, 12),
  ].map((v) => Math.max(v, 0.85 * progress(frame, orderAt, 14)));
  const termOn = [progress(frame, authnAt, 12), progress(frame, authzAt, 12), progress(frame, acctAt, 12)];

  // The sheet: enters on `doors`, then walks to each door on its cue.
  const walk = [whoAt, whatAt, logAt].map((at) => progress(frame, at - 12, 24, EASE.inOut));
  const startX = DOOR_CX[0] - 260;
  const sheetX = startX + (DOOR_CX[0] - startX) * walk[0] + (DOOR_CX[1] - DOOR_CX[0]) * walk[1] + (DOOR_CX[2] - DOOR_CX[1]) * walk[2];
  const sheetIn = progress(frame, doorsAt, 16);
  const pathIn = progress(frame, doorsAt + 4, 24);

  // Detail blocks: each lives while its door is on.
  const d1 = progress(frame, whoAt, 14) * (1 - progress(frame, whatAt - 8, 10));
  const d2 = progress(frame, whatAt, 14) * (1 - progress(frame, logAt - 8, 10));
  const d3 = progress(frame, logAt, 14) * (1 - 0.5 * progress(frame, orderAt, 14));

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...stampIn }}>
        <CaseStamp parts={STAMP} />
      </div>

      {/* The three doors: faint from the first frame, drawn on `doors` one after another */}
      {DOOR_X.map((x, i) => (
        <div key={i} style={{ position: 'absolute', left: x, top: DOOR_TOP }}>
          <Door index={i} width={DOOR_W} height={DOOR_H} on={doorOn[i]} term={termOn[i]} show={0.3 + 0.7 * progress(frame, doorsAt + i * 6, 14)} />
        </div>
      ))}

      {/* The path and the walking sheet */}
      <div style={{ position: 'absolute', left: DOOR_CX[0] - 260, top: PATH_Y, width: (DOOR_CX[2] - DOOR_CX[0] + 260) * pathIn, height: 0, borderTop: `3px dashed ${alpha(C.cyan, 0.35)}` }} />
      <div style={{ position: 'absolute', left: sheetX - MINI_W / 2, top: PATH_Y - 40, opacity: sheetIn, transform: `translateY(${(1 - sheetIn) * 12}px)` }}>
        <Sheet width={MINI_W} mini glow={0.6} />
      </div>

      {/* Door 1: who are you */}
      {d1 > 0.01 ? (
        <div style={{ position: 'absolute', left: 60, top: DETAIL_TOP, opacity: d1, fontFamily: FONT.sans, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Line icon="server" on={progress(frame, navieraAt, 12)} size={42}>
            nadie teclea · el sistema de la naviera se identifica solo
          </Line>
          <div style={{ display: 'flex', opacity: progress(frame, certAt, 12), transform: `translateY(${(1 - progress(frame, certAt, 12)) * 12}px)` }}>
            <Pill text="también las máquinas, con un certificado" tone={C.cyan} icon="file" on={0.3 + 0.7 * progress(frame, certWordAt, 12)} size={42} height={72} />
          </div>
        </div>
      ) : null}

      {/* Door 2: what can you do — role-based on the left, attribute-based on the right */}
      {d2 > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: DETAIL_TOP, width: W, height: FOOT_TOP - DETAIL_TOP + 40, opacity: d2, fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', left: 20, top: 0, width: COL_W, display: 'flex', flexDirection: 'column', gap: 6, opacity: 1 - 0.45 * progress(frame, attrAt, 12) }}>
            <Line icon="file" on={progress(frame, declaraAt, 12)}>
              quien la declara · enviar y corregir
            </Line>
            <Line icon="users" on={progress(frame, opsAt, 12)}>
              Operaciones · solo leer
            </Line>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 6, opacity: progress(frame, roleAt, 12) }}>
              <TermPill text="ROLE-BASED" size={36} on={progress(frame, roleWordAt, 12)} />
              <span style={{ fontSize: 36, fontWeight: 750, color: C.text, whiteSpace: 'nowrap' }}>el permiso va con el puesto</span>
            </div>
          </div>
          <div style={{ position: 'absolute', left: W - COL2_W, top: 0, width: COL2_W, display: 'flex', flexDirection: 'column', gap: 6, opacity: progress(frame, attrAt, 14) }}>
            <Line icon="bell" on={progress(frame, attrAt, 12)}>
              quien acude a una emergencia
            </Line>
            <Line on={progress(frame, barcoAt, 12)}>solo mientras ese barco está en el puerto</Line>
            <div style={{ display: 'flex', marginTop: 6 }}>
              <TermPill text="ATTRIBUTE-BASED" size={36} on={progress(frame, attrWordAt, 12)} />
            </div>
            <div style={{ fontSize: 36, fontWeight: 750, color: C.text, whiteSpace: 'nowrap', opacity: 0.3 + 0.7 * progress(frame, cosasAt, 12) }}>varias cosas a la vez: quién, qué hoja, cuándo</div>
          </div>
          {/* half lit, no cue of its own */}
          <div style={{ position: 'absolute', left: 20, top: 186, width: COL_W, display: 'flex', opacity: 0.6 * progress(frame, leastAt, 14) }}>
            <span style={{ fontSize: 36, fontWeight: 750, color: C.muted, whiteSpace: 'nowrap' }}>
              a cada uno, lo justo: <span style={{ color: '#c4b5fd' }}>least privilege</span>
            </span>
          </div>
        </div>
      ) : null}

      {/* Door 3: what did you do */}
      {d3 > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: DETAIL_TOP + 20, width: W, display: 'flex', justifyContent: 'center', gap: 20, opacity: d3 }}>
          <Pill text="quién la abrió" tone={C.cyan} icon="record" on={progress(frame, logAt + 4, 12)} size={44} height={76} />
          <Pill text="quién la cambió" tone={C.cyan} icon="record" on={progress(frame, cambioAt, 12)} size={44} height={76} />
          <Pill text="cuándo" tone={C.cyan} icon="record" on={progress(frame, cuandoAt, 12)} size={44} height={76} />
        </div>
      ) : null}

      {/* The order, on `order` */}
      {frame >= orderAt - 6 ? (
        <div style={{ position: 'absolute', left: 0, top: FOOT_TOP - 96, width: W, display: 'flex', justifyContent: 'center', ...enter(frame, orderAt, { distance: 16 }) }}>
          <Pill text="primero quién, luego qué, y todo apuntado" tone={C.violet} icon="mortarboard" on={0.9} size={46} height={84} weight={850} />
        </div>
      ) : null}
    </Stage>
  );
}
