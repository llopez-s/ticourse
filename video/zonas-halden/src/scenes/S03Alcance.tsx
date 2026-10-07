import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, dimStyle, mix, windowWeight } from '../../../engine/src/ui';
import { HELD, QUESTION, REACHED, REACH_LEAD, SURFACE_CHIPS, TERM } from '../data/s03-alcance';
import { PEN } from './parts/Checkpoint';
import { Napkin, napkinSize, type NapkinReachTarget } from './parts/Napkin';
import { ZONE_ROW_BASE, ZoneRow } from './parts/ZoneRow';
import { TermTag } from './parts/s02-garita/Marks';
import { Stage, segment, wordFrame } from './kit';

const S = 's03-alcance';
const W = STAGE.width;
const H = STAGE.height;

// ---- Today: the napkin on the left (1080 px: VLAN names 34 px, the note 32 px), the question and the tally on the right.
const NAP = { w: 1080, x: 0, y: Math.round((H - napkinSize(1080).h) / 2) } as const;
const COL_X = NAP.w + 34;
const COL_W = W - COL_X;

// ---- The plan: the six zones full width, centred, then up to make room for the attack surface.
const ROW_H = Math.round((ZONE_ROW_BASE.h * W) / ZONE_ROW_BASE.w);
const ROW_Y_A = Math.round((H - ROW_H) / 2);
const ROW_Y_B = 12;
const TERM_Y = 432;
const CHIPS_Y_A = 470;
const CHIPS_Y_B = 560;

/**
 * s03-alcance «Hasta dónde llega un portátil». Today, on the napkin: on
 * «portátil» a laptop in Oficinas gets a red circle and the right column asks
 * «un portátil de Oficinas / ¿hasta dónde llega?». On `reach` the red reach
 * lines light — the portal on «portal», then Administración, Producción and
 * Pruebas on «otras tres» — and the tally «alcanza:» fills with the same names;
 * on «router» the router and its note light and the dashed try towards
 * Operaciones stops at its internal firewall (green ring; never voiced, never
 * «el único»), Operaciones added to the tally with a shield. On `six` the
 * napkin goes and the plan draws in as a blueprint: six zones with their
 * confidence and no system names (ZoneRow), «ninguna» and «máxima» glowing on
 * their words, the planned checkpoints growing on «garita». On `reach-after`
 * the same laptop sits in «interna»: «alcanza: su zona y lo que una regla
 * permita», the dashed rule link on «regla». s03-05: the row rises and three
 * rose chips land on their words — «cada servicio publicado», «cada
 * excepción», «cada camino de más»; ATTACK SURFACE above them on
 * «superficie»; on «recortan» the chips shrink back while the checkpoints
 * glow; on `wrap` the laptop's zone takes the focus again. Last frame: the
 * plan, the laptop held in its zone, the term and its chips.
 */
export function S03Alcance(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reachAt = props.cue('reach');
  const sixAt = props.cue('six');
  const surfaceAt = props.cue('surface');
  const wrapAt = props.cue('wrap');
  const s05 = segment(props, 's03-05');

  // ================= Today: the napkin =================
  const settle = progress(frame, -12, 20);
  const laptopAt = Math.max(props.cue('laptop'), wordFrame(S, 's03-01', 'portátil') - 12);
  const laptop = progress(frame, laptopAt, 16);
  const portalAt = wordFrame(S, 's03-02', 'portal') - 6;
  const othersAt = wordFrame(S, 's03-02', 'otras') - 6;
  const reachStart: Record<NapkinReachTarget, number> = {
    portal: portalAt,
    administracion: othersAt,
    produccion: othersAt + 12,
    pruebas: othersAt + 24,
  };
  const reach = Object.fromEntries(REACHED.map((r) => [r.id, progress(frame, reachStart[r.id], 26, EASE.inOut)])) as Record<NapkinReachTarget, number>;
  const routerAt = wordFrame(S, 's03-02', 'router') - 4;
  const blocked = progress(frame, routerAt, 34, EASE.inOut);
  const routerW = windowWeight(frame, routerAt, sixAt - 12, { ramp: 12 });
  const napOut = progress(frame, sixAt - 12, 18, EASE.inOut);

  // Right column: the question, then the tally.
  const whoIn = enter(frame, laptopAt + 6, { distance: 16 });
  const qIn = enter(frame, wordFrame(S, 's03-01', 'Hasta') - 8, { distance: 18 });
  const leadIn = enter(frame, reachAt - 2, { distance: 12 });
  const heldIn = enter(frame, routerAt + 24, { distance: 12 });

  // ================= The plan: six zones =================
  const ninguna = wordFrame(S, 's03-03', 'ninguna') - 4;
  const maxima = wordFrame(S, 's03-03', 'máxima') - 4;
  const garita = wordFrame(S, 's03-03', 'garita') - 4;
  const ra = props.cue('reach-after');
  const sameLaptop = Math.max(ra, wordFrame(S, 's03-04', 'mismo') - 8);
  const alcanza = wordFrame(S, 's03-04', 'alcanza') - 6;
  const regla = wordFrame(S, 's03-04', 'regla') - 10;
  const zonasAt = wordFrame(S, 's03-06', 'zonas') - 4;
  const recortan = wordFrame(S, 's03-06', 'recortan') - 6;
  const rowIn = progress(frame, sixAt - 10, 16);
  const rowUp = progress(frame, s05.from - 10, 24, EASE.inOut);
  const rowY = mix(ROW_Y_A, ROW_Y_B, rowUp);
  const internaF = Math.max(windowWeight(frame, sameLaptop, s05.from + 4, { ramp: 14 }), windowWeight(frame, wrapAt, Number.POSITIVE_INFINITY, { ramp: 16 }));
  const focus = {
    internet: 0.85 * windowWeight(frame, ninguna, garita - 2, { ramp: 10 }),
    invitados: 0.85 * windowWeight(frame, ninguna, garita - 2, { ramp: 10 }),
    gestion: windowWeight(frame, maxima, garita - 2, { ramp: 10 }),
    interna: internaF,
  };
  const gateFocus = Math.max(windowWeight(frame, garita, ra - 10, { ramp: 12 }), windowWeight(frame, zonasAt, wrapAt, { ramp: 12 }));
  // The row steps back while the voice lists what widens the surface.
  const rowDim = 0.35 * windowWeight(frame, s05.from + 6, zonasAt, { ramp: 14 });

  // ================= Attack surface =================
  const chipAt = SURFACE_CHIPS.map((c) => wordFrame(S, 's03-05', c.word) - 6);
  const chipsDown = progress(frame, surfaceAt - 6, 20, EASE.inOut);
  const chipsY = mix(CHIPS_Y_A, CHIPS_Y_B, chipsDown);
  const allLit = windowWeight(frame, surfaceAt, wordFrame(S, 's03-06', 'superficie'), { ramp: 10 });
  const cut = progress(frame, recortan, 18, EASE.inOut);
  const termAt = wordFrame(S, 's03-06', 'superficie') - 8;
  const wrapDim = 0.45 * progress(frame, wrapAt - 4, 16, EASE.inOut);

  return (
    <Stage>
      {/* ---- Today: the napkin and the laptop's reach ---- */}
      {napOut < 1 ? (
        <div style={{ position: 'absolute', left: NAP.x - 40 * napOut, top: NAP.y, opacity: settle * (1 - napOut), transform: `scale(${1 - 0.04 * napOut})`, transformOrigin: '0 50%' }}>
          <Napkin
            width={NAP.w}
            laptop={laptop}
            reach={reach}
            reachBlocked={blocked}
            highlight={{ oficinas: 0.6 * windowWeight(frame, laptopAt, reachAt, { ramp: 12 }), rtcore: routerW, note: routerW }}
          />
        </div>
      ) : null}

      {/* The question and the tally */}
      {napOut < 1 ? (
        <div style={{ position: 'absolute', left: COL_X, top: 0, width: COL_W, height: H, opacity: 1 - napOut, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
          <div style={{ position: 'absolute', left: 0, top: 36, ...whoIn, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 52, height: 52, borderRadius: 12, display: 'grid', placeItems: 'center', border: `2px solid ${PEN.red}`, background: alpha(C.roseDeep, 0.85) }}>
              <Icon name="laptop" size={34} color={C.roseSoft} strokeWidth={2.2} />
            </div>
            <span style={{ fontSize: 36, fontWeight: 700, color: C.text }}>{QUESTION.who}</span>
          </div>
          <div style={{ position: 'absolute', left: 0, top: 104, ...qIn, fontSize: 56, fontWeight: 850, letterSpacing: -0.8, color: C.textStrong }}>{QUESTION.q}</div>
          {frame >= reachAt - 4 ? (
            <div style={{ position: 'absolute', left: 0, top: 222 }}>
              <div style={{ ...leadIn, fontSize: 32, fontWeight: 800, color: C.roseSoft, marginBottom: 8 }}>{REACH_LEAD}</div>
              {REACHED.map((r) => {
                const k = progress(frame, reachStart[r.id] + 10, 14);
                return (
                  <TallyRow key={r.id} name={r.name} k={k} color={C.roseSoft}>
                    <div style={{ width: 22, height: 22, borderRadius: 999, background: PEN.red, boxShadow: `0 0 12px ${alpha(C.rose, 0.6)}` }} />
                  </TallyRow>
                );
              })}
              {frame >= routerAt + 20 ? (
                <div style={{ ...heldIn }}>
                  <TallyRow name={HELD} k={1} color={C.muted}>
                    <Icon name="shield" size={34} color={C.emerald} strokeWidth={2.4} />
                  </TallyRow>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ---- The plan: six zones on a blueprint ---- */}
      {frame >= sixAt - 12 ? (
        <div style={{ position: 'absolute', left: 0, top: rowY, opacity: rowIn, ...dimStyle(rowDim) }}>
          <ZoneRow
            width={W}
            at={sixAt - 2}
            focus={focus}
            gateFocus={gateFocus}
            laptop={progress(frame, sameLaptop, 14)}
            reach={progress(frame, alcanza, 14)}
            reachCaption={progress(frame, alcanza, 16)}
            ruleLink={progress(frame, regla, 24)}
          />
        </div>
      ) : null}

      {/* ---- ATTACK SURFACE and what widens it ---- */}
      <div style={{ position: 'absolute', left: 0, top: TERM_Y, width: W, display: 'flex', justifyContent: 'center' }}>
        <TermTag frame={frame} fps={fps} at={termAt} term={TERM} size={52} dim={wrapDim} style={{ transformOrigin: '50% 50%' }} />
      </div>
      {frame >= chipAt[0] - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: chipsY, width: W, display: 'flex', justifyContent: 'center', gap: 22, ...dimStyle(Math.max(0.4 * cut, wrapDim)) }}>
          {SURFACE_CHIPS.map((c, i) => {
            const e = enter(frame, chipAt[i], { distance: 16 });
            const lit = Math.max(progress(frame, chipAt[i], 10) * (1 - 0.6 * progress(frame, (chipAt[i + 1] ?? surfaceAt) - 2, 14, EASE.inOut)), allLit);
            return (
              <div
                key={c.text}
                style={{
                  opacity: e.opacity,
                  transform: `${e.transform} scale(${1 - 0.08 * cut})`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  height: 62,
                  padding: '0 26px 0 18px',
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.pill,
                  border: `2px solid ${alpha(C.rose, 0.45 + 0.5 * lit)}`,
                  background: alpha(C.rose, 0.07 + 0.12 * lit),
                  boxShadow: lit > 0.02 ? `0 0 ${Math.round(22 * lit)}px ${alpha(C.rose, 0.3 * lit)}` : undefined,
                  fontFamily: FONT.sans,
                  fontSize: 36,
                  fontWeight: 750,
                  color: C.textStrong,
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon name={c.icon} size={34} color={C.roseSoft} strokeWidth={2.2} />
                {c.text}
              </div>
            );
          })}
        </div>
      ) : null}
    </Stage>
  );
}

/** One line of the tally: a marker and a name that slides in. */
function TallyRow({ name, k, color, children }: { name: string; k: number; color: string; children: ReactNode }) {
  if (k <= 0.01) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 56, opacity: k, transform: `translateX(${(1 - k) * 16}px)` }}>
      <div style={{ width: 36, display: 'grid', placeItems: 'center' }}>{children}</div>
      <span style={{ fontSize: 40, fontWeight: 800, color }}>{name}</span>
    </div>
  );
}
