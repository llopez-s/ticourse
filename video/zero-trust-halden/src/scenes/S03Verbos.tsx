import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { focusWeights, mix, windowWeight } from '../../../engine/src/ui';
import { S03 } from '../data/s03-verbos';
import { Warehouse, warehouseLayout, type CargoBox } from './parts/Warehouse';
import { Stage, segment, wordFrame } from './kit';

const S = 's03-verbos';
const W = 1728;
/** While the intercepted message is up: a tall truss roof, so everything that matters sits under the card. */
const BOX_A = { h: 660, roof: 182 } as const;
/** From `desk` on: the roof comes down and the tags get their two bands (same room for the two floors as in A). */
const BOX_B = { h: 644, roof: 20 } as const;
/** On `wrap` the nave steps back a little and the three-verbs line takes the strip under it. */
const BOX_C = { h: 598 } as const;
const WRAP_TOP = 604;
const NOTE = 36;

/**
 * s03-verbos «Una oficina, un administrativo y un mozo».
 *   start         the nave of a port warehouse, split in two by a floor line: downstairs the counter, the
 *                 roller track and the shelf; upstairs nobody. A tall roof fills the top of the stage.
 *   warehouse     the mozo at his counter; on «tres personas» two dashed outlines upstairs (an empty desk
 *                 and an empty printer): three people, two of them not there yet.
 *   clerk-alone   quien recoge walks in with the pedido; the slip goes to the counter and a box comes
 *                 straight back down the track: «sin preguntar a nadie».
 *   (intercept)   the engine's card owns the top of the stage: nothing essential above y 230. s03-02: two
 *                 more boxes slide past the mozo, «ve pasar la mercancía»; then, upstairs and still without
 *                 people, the ledger «el historial de quien recoge» and the rulebook «las normas · las
 *                 mismas para todos».
 *   desk          the roof comes down and the nave rises; the boxes go back to the shelf (not yet). The
 *                 office is there: «oficina de pedidos». The mozo sends the pedido up «el sistema de
 *                 pedidos» (a tube); on «decide» the office stamps it — the only verdict mark of the
 *                 scene — and «decide» appears; on «policy engine», POLICY ENGINE.
 *   lead          the administrativo and his printer: «administrativo de turno». On «no decide» the
 *                 decision reaches him from the office (a neutral dot).
 *   order         the order comes out of the printer on the cue (the «lock» sound) and is held up big:
 *                 «orden», its rows and its clock; «con su caducidad» on that word. On «se la deja al mozo»
 *                 it goes down the chute into the tray. «comunica», then POLICY ADMINISTRATOR.
 *   s03-05        the mozo reads the order; the one box it names lights emerald and slides to quien
 *                 recoge; «aplica», then POLICY ENFORCEMENT POINT (PEP).
 *   wrap          «el engine decide · el administrator comunica · el PEP aplica» under the nave, in place
 *                 before the exam card lands; each third brightens with the voice. Holds.
 */
export function S03Verbos(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const p = (start: number, dur = 12) => progress(frame, start, dur);

  const whAt = props.cue('warehouse');
  const aloneAt = props.cue('clerk-alone');
  const deskAt = props.cue('desk');
  const leadAt = props.cue('lead');
  const orderAt = props.cue('order');
  const wrapAt = props.cue('wrap');
  const s0301 = segment(props, 's03-01');
  const s0302 = segment(props, 's03-02');
  const s0305 = segment(props, 's03-05');

  // ---------------- The box: tall roof first, then the nave rises ----------------
  const rise = progress(frame, deskAt - 4, 26, EASE.inOut);
  const settle = progress(frame, wrapAt - 8, 18, EASE.inOut);
  const bandsB = warehouseLayout(W, BOX_B.h).bands;
  const box = {
    h: mix(mix(BOX_A.h, BOX_B.h, rise), BOX_C.h, settle),
    roof: mix(BOX_A.roof, BOX_B.roof, rise),
    bands: { top: mix(0, bandsB.full, rise), bottom: mix(0, bandsB.one, rise) },
  };
  const L = warehouseLayout(W, box.h, { roof: box.roof, bands: box.bands });
  const tagsIn = progress(frame, deskAt + 14, 10);
  // The engine's card is up from the end of s03-01 to the end of s03-02: the trusses step back under it.
  const cardUp = p(s0301.to - 6, 12);

  // ---------------- 1: the mozo on his own ----------------
  const mozoIn = p(whAt - 4, 14);
  const ghostsIn = p(at('s03-01', 'tres') - 8, 16);
  const mozoLabel = p(at('s03-01', 'mozo') - 4);
  const reqIn = p(aloneAt - 10, 14);
  const reqShift = -170 * (1 - progress(frame, aloneAt - 10, 26, EASE.out));
  const reqLabel = p(aloneAt + 12);
  const entregaAt = at('s03-01', 'entrega');
  const slipDraw = progress(frame, entregaAt - 12, 14, EASE.inOut);
  const slipT = progress(frame, entregaAt - 8, 22, EASE.inOut);
  const aloneNote = p(at('s03-01', 'sin') - 4) * (1 - p(s0302.from - 8));
  const seesNote = p(at('s03-02', 've') - 4) * (1 - 0.45 * p(at('s03-02', 'Pero') - 2, 14)) * (1 - p(deskAt - 10, 10));
  const ledgerIn = p(at('s03-02', 'historial') - 6);
  const rulebookIn = p(at('s03-02', 'normas') - 6);
  const itemLabelsOut = p(at('s03-03', 'Es') - 14, 14);

  // Three boxes leave the shelf in phase A (one on `clerk-alone`, two on «ve pasar toda la mercancía»),
  // queue at the pick-up end, and go back to their slots when the office comes in.
  const back = progress(frame, deskAt - 2, 24, EASE.inOut);
  const queue = -L.cargoSlot(1) * 1.08;
  const starts = [at('s03-01', 'mercancía') - 2, at('s03-02', 'pasar') - 8, at('s03-02', 'toda') + 8];
  const cargo: CargoBox[] = [];
  let taken = 0;
  starts.forEach((start, k) => {
    const go = progress(frame, start, k === 0 ? 44 : 50, EASE.inOut);
    if (go <= 0.001 || back >= 0.999) return;
    taken += 1;
    cargo.push({ at: L.cargoSlot(k) + (1 - k * queue - L.cargoSlot(k)) * go * (1 - back) });
  });

  // ---------------- 2: the office decides ----------------
  const officeIn = p(deskAt + 2, 16);
  const officeLabel = p(Math.max(deskAt + 16, at('s03-03', 'oficina') - 4)) * tagsIn;
  const pasaAt = at('s03-03', 'pasa');
  const tubeDraw = progress(frame, pasaAt - 16, 16, EASE.inOut);
  const systemLabel = p(pasaAt - 8);
  const capT = progress(frame, pasaAt - 2, 26, EASE.inOut);
  const deskSlip = p(pasaAt + 21, 8);
  const decideAt = at('s03-03', 'decide');
  const verdict = progress(frame, decideAt - 3, 10, EASE.out);
  const nameEngine = progress(frame, at('s03-03', 'policy') - 5, 16, EASE.out);

  // ---------------- 3: the administrativo communicates ----------------
  const adminIn = p(leadAt - 2, 16);
  const adminLabel = p(leadAt + 6);
  const noAt = at('s03-04', 'no');
  const decisionDraw = progress(frame, noAt - 14, 14, EASE.inOut);
  const decisionT = progress(frame, noAt - 8, 30, EASE.inOut);
  const seAt = at('s03-04', 'se');
  const printing = p(orderAt - 12, 8) * (1 - p(orderAt + 20, 16));
  const orderShow = progress(frame, orderAt - 8, 8, EASE.out);
  const zoom = progress(frame, orderAt + 1, 14, EASE.out) * (1 - progress(frame, seAt - 14, 14, EASE.inOut));
  const expiryNote = p(at('s03-04', 'caducidad') - 6, 10) * (1 - p(seAt - 16, 10));
  const issueDraw = progress(frame, seAt - 6, 14, EASE.inOut);
  const travel = progress(frame, seAt + 2, 22, EASE.inOut);
  const landed = seAt + 22;
  const trayGlow = p(landed - 2, 8) * (1 - p(landed + 22, 26));
  const verbAdmin = p(at('s03-04', 'Comunica') - 3, 10);
  const nameAdmin = progress(frame, at('s03-04', 'policy') - 5, 16, EASE.out);

  // ---------------- 4: the mozo applies ----------------
  const readAt = at('s03-05', 'entrega') - 6;
  const soloAt = at('s03-05', 'solo');
  const aplicaAt = at('s03-05', 'Aplica');
  const give = progress(frame, soloAt - 2, 46, EASE.inOut);
  const orderGlow = p(readAt, 10) * (1 - p(aplicaAt - 6, 16));
  const pick = p(readAt + 4, 10);
  const trafficLit = p(soloAt - 2, 10) * (1 - 0.65 * p(aplicaAt + 10, 22));
  const verbPep = p(aplicaAt - 3, 10);
  const namePep = progress(frame, at('s03-05', 'policy') - 5, 18, EASE.out);
  if (give > 0.001) {
    taken = 1;
    cargo.push({ at: give, tone: C.emerald });
  }

  // ---------------- 5: the three verbs ----------------
  const wrapIn = p(wrapAt - 4);
  const said = [at('s03-06', 'engine') - 3, at('s03-06', 'administrator') - 3, at('s03-06', 'PEP') - 3];
  const wrapEnd = at('s03-06', 'aplica') + 22;
  const turn = focusWeights(frame, said, { end: wrapEnd });
  const allLit = p(wrapEnd, 14);

  // Who the voice is on (a glow; in the wrap the other two step back).
  const focus = {
    office: Math.max(windowWeight(frame, decideAt - 4, leadAt - 6), turn.weights[0]),
    admin: Math.max(windowWeight(frame, leadAt, s0305.from - 6), turn.weights[1]),
    mozo: Math.max(windowWeight(frame, s0305.from, wrapAt - 6), turn.weights[2]),
  };
  const others = Math.max(...turn.weights);
  const dim = { office: 0.6 * turn.dims[0], admin: 0.6 * turn.dims[1], mozo: 0.6 * turn.dims[2], requester: 0.5 * others, shelf: 0.5 * others };

  // The pedido: in quien recoge's hand, then on its way, then in the mozo's hand until it goes up the tube.
  const requesterCarry = slipT <= 0.001 ? 'slip' : 'none';
  const mozoCarry = slipT >= 0.999 && capT <= 0.001 ? 'slip' : 'none';
  const mozoFacing = frame >= readAt && frame < soloAt + 6 ? 'right' : 'left';

  const noteLeft = L.tag.mozo.px + 62;
  const noteTop = L.tag.mozo.y1 - 3;
  const zoomTop = L.order.zoomPrinter.y - L.order.zoom.h / 2;
  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0 }}>
        <Warehouse
          width={W}
          height={box.h}
          roof={box.roof}
          bands={box.bands}
          roofDetail={1 - 0.8 * cardUp}
          mozo={mozoIn}
          mozoCarry={mozoCarry}
          mozoFacing={mozoFacing}
          requester={reqIn}
          requesterShift={reqShift}
          requesterCarry={requesterCarry}
          shelfTaken={taken}
          shelfPick={give > 0.001 ? 0 : pick}
          office={officeIn}
          admin={adminIn}
          ghosts={ghostsIn}
          ledger={ledgerIn}
          rulebook={rulebookIn}
          deskSlip={deskSlip}
          verdict={verdict}
          printing={printing}
          trayGlow={trayGlow}
          flows={{
            request: { draw: slipDraw, lit: p(entregaAt - 8, 8) * (1 - 0.7 * p(entregaAt + 24, 20)), mark: slipT },
            consult: { draw: tubeDraw, lit: p(pasaAt - 4, 8) * (1 - 0.6 * p(decideAt + 10, 20)), mark: capT },
            decision: { draw: decisionDraw, lit: p(noAt - 8, 8) * (1 - 0.6 * p(orderAt + 10, 20)), mark: decisionT },
            issue: { draw: issueDraw, lit: p(seAt - 2, 8) * (1 - 0.6 * p(landed + 10, 20)) },
          }}
          traffic={{ draw: p(readAt + 6, 14), lit: trafficLit, toShelf: false, phase: frame / 30 }}
          cargo={cargo}
          order={{ show: orderShow, travel, zoom, clock: 0.2, clockLit: expiryNote, glow: Math.max(0.5 * zoom, orderGlow) }}
          labels={{
            mozo: mozoLabel,
            requester: reqLabel,
            office: officeLabel,
            admin: adminLabel * tagsIn,
            engine: nameEngine,
            administrator: nameAdmin,
            pep: namePep,
            system: systemLabel,
            history: ledgerIn * (1 - itemLabelsOut),
            rules: rulebookIn * (1 - itemLabelsOut),
          }}
          verbs={{ engine: verdict, administrator: verbAdmin, pep: verbPep }}
          focus={focus}
          dim={dim}
          autoDim={false}
        />
      </div>

      {/* «sin preguntar a nadie» / «ve pasar la mercancía», over the mozo's head */}
      {aloneNote > 0.001 || seesNote > 0.001 ? (
        <div style={{ position: 'absolute', left: noteLeft, top: noteTop, fontFamily: FONT.sans, fontSize: NOTE, fontWeight: 800, lineHeight: 1.1, whiteSpace: 'nowrap' }}>
          <div style={{ color: C.textStrong, opacity: aloneNote, transform: `translateX(${(1 - Math.min(1, aloneNote * 1.5)) * -10}px)` }}>{S03.alone}</div>
          <div style={{ position: 'absolute', left: 0, top: 0, color: C.textStrong, opacity: seesNote }}>{S03.sees}</div>
        </div>
      ) : null}

      {/* «con su caducidad», over the order held up by the printer */}
      {expiryNote > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: L.order.zoomPrinter.x,
            top: zoomTop - 12 - NOTE * 1.1,
            transform: `translateX(-50%) translateY(${(1 - expiryNote) * 8}px)`,
            fontFamily: FONT.sans,
            fontSize: NOTE,
            fontWeight: 800,
            lineHeight: 1.1,
            color: C.cyanSoft,
            whiteSpace: 'nowrap',
            opacity: expiryNote,
          }}
        >
          {S03.expiry}
        </div>
      ) : null}

      {/* The three verbs, under the nave */}
      {wrapIn > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: W,
            top: WRAP_TOP,
            display: 'flex',
            justifyContent: 'center',
            opacity: wrapIn,
            transform: `translateY(${(1 - wrapIn) * 10}px)`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 22,
              padding: '3px 34px 7px',
              borderRadius: 16,
              border: `2px solid ${alpha(C.violet, 0.55)}`,
              background: alpha('#1a1033', 0.9),
              fontFamily: FONT.sans,
              fontSize: 38,
              fontWeight: 850,
              lineHeight: 1.1,
              whiteSpace: 'nowrap',
            }}
          >
            {S03.wrap.map((part, i) => {
              const lit = Math.max(turn.weights[i], allLit);
              return (
                <span key={part.term} style={{ display: 'inline-flex', alignItems: 'baseline', gap: 22 }}>
                  {i > 0 ? <span style={{ color: C.faint }}>·</span> : null}
                  <span style={{ opacity: 0.55 + 0.45 * lit, textShadow: lit > 0.01 ? `0 0 ${Math.round(18 * lit)}px ${alpha(C.violet, 0.45 * lit)}` : undefined }}>
                    <span style={{ color: C.text, fontWeight: 700 }}>{part.article} </span>
                    <span style={{ color: '#c4b5fd' }}>{part.term}</span>
                    <span style={{ color: C.textStrong }}> {part.verb}</span>
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      ) : null}
    </Stage>
  );
}
