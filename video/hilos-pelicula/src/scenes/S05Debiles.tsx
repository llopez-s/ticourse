import type { CSSProperties } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { mix, windowWeight } from '../../../engine/src/ui';
import { DOOR_NAMES, LABEL_CAPTION } from '../data/s04-taller';
import { DETECT_VS_GROUP, TAPE_CAPTION, WEAK_LIST, WEAK_LIST_NOTE } from '../data/s05-debiles';
import { COMPARE_TEXT, CompareTable, PDB_PATH, TABLE_AT_REST } from './parts/CompareTable';
import { TrapBox, trapBoxHeight } from './parts/TrapBox';
import { WorkshopLabel } from './parts/WorkshopLabel';
import { CAPTION, DOOR, DOOR_X, Door, LabelCaption, RULE, RuleLabel, SIDES, boxAt, boxS04, callBubbleAt, labelCentre } from './parts/s04-taller/Doorstep';
import { Stage, wordFrame } from './kit';

const S = 's05-debiles';

/** The centre band between the two boxes (s05 layout). */
const BAND = { cx: 864, a: 478, a2: 534, b: 578, c: 616 } as const;
/** «todas las del mundo»: ordinary parcels with the same tape (closed, no sticker). */
const PARCELS = [{ w: 78 }, { w: 92 }, { w: 70 }, { w: 86 }, { w: 74 }, { w: 90 }] as const;
const PARCEL_GAP = 18;
const PARCEL_BOTTOM = 650;

const AMBER_SOFT = '#fcd34d';

/**
 * s05-debiles «Lo que lleva todo el mundo». Opens on s04's last frame; the doors, the caption and
 * the rule step out while the two boxes move to the ends of a lower band. `https`: row 4 «canal»,
 * «muy débil: lo hace todo el mundo». `supplier`: row 5 «relación», «medio: encaja con ir a por su
 * cadena de suministro». `weak-list`: the lesson's list between the boxes, word by word, with «miles
 * de actores». `tape`: the brown packing tape lights on both boxes, then on a row of ordinary parcels,
 * «como todas las cajas». `detect-vs-group`: the small line in two halves, each with its sentence.
 * `weak`: «débil para agrupar» on the list and on row 4. s05-07 «Ya está la tabla entera»: the rest
 * steps out and the whole table settles below the think card (TABLE_AT_REST), where s06 picks it up;
 * no row is lit during the question.
 */
export function S05Debiles(props: SceneProps) {
  const frame = useCurrentFrame();

  const httpsAt = props.cue('https');
  const supplierAt = props.cue('supplier');
  const listAt = props.cue('weak-list');
  const tapeAt = props.cue('tape');
  const detectAt = props.cue('detect-vs-group');
  const weakAt = props.cue('weak');

  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const wMuy = w('s05-01', 'muy');
  const wEncaja = w('s05-02', 'encaja');
  const wCobalt = w('s05-03', 'Cobalt');
  const wPhishing = w('s05-03', 'phishing');
  const wMiles = w('s05-03', 'miles');
  const wDos = w('s05-04', 'dos');
  const wTodas = w('s05-04', 'todas');
  const wPara1 = w('s05-05', 'Para');
  const wPara2 = w('s05-06', 'Para');
  const wHttps6 = w('s05-06', 'HTTPS');
  const wYa = w('s05-07', 'Ya');

  // ---- Hand-off from s04: doors, caption and rule step out; boxes move down to the band ends -----------
  const outS04 = progress(frame, 4, 22, EASE.inOut);
  const toBand = progress(frame, 8, 34, EASE.inOut);

  // ---- The table ---------------------------------------------------------------------------------
  const settle = progress(frame, wYa + 8, 40, EASE.inOut);
  const tableY = mix(0, TABLE_AT_REST.y, settle);
  const reveal = { lure: 1, domain: 1, pdb: 1, https: progress(frame, httpsAt - 2, 34), supplier: progress(frame, supplierAt - 2, 34) };
  const marks = {
    cheap: 1,
    strong: 1,
    https: progress(frame, wMuy - 6, 16),
    supplier: progress(frame, wEncaja - 6, 16),
    weak: progress(frame, wHttps6 - 4, 16),
  };
  const clearAt = wYa - 4;
  const focus = {
    https: Math.max(windowWeight(frame, httpsAt, supplierAt - 4, { ramp: 12 }), windowWeight(frame, listAt, tapeAt - 6, { ramp: 12 }), windowWeight(frame, weakAt, clearAt, { ramp: 12 })),
    supplier: windowWeight(frame, supplierAt, listAt - 6, { ramp: 12 }),
  };

  // ---- The boxes, the list, the tape, the small line ---------------------------------------------------
  const restOut = 1 - progress(frame, wYa - 2, 22, EASE.inOut);
  const tapeHl = windowWeight(frame, tapeAt - 2, detectAt + 10, { ramp: 12 });
  const twoBoxes = windowWeight(frame, wDos - 4, wTodas + 10, { ramp: 10 });
  const chipIn = [listAt + 2, wCobalt - 6, wPhishing - 6].map((at) => progress(frame, at, 14));
  const noteIn = progress(frame, wMiles - 4, 14);
  const listDim = windowWeight(frame, tapeAt, wPara1 - 10, { ramp: 14 }) * 0.5;
  const listWeak = progress(frame, weakAt - 2, 16);
  const parcelsIn = PARCELS.map((_, k) => progress(frame, wTodas - 6 + k * 4, 14));
  const parcelsOut = 1 - progress(frame, detectAt - 12, 14);
  const tapeCapIn = progress(frame, wTodas + 10, 14);
  const det1 = progress(frame, detectAt + 2, 16);
  const det2 = progress(frame, wPara2 - 6, 16);

  const boxes = SIDES.map((side) => ({ side, b: boxAt(side, toBand) }));
  const parcelsW = PARCELS.reduce((a, p) => a + p.w, 0) + PARCEL_GAP * (PARCELS.length - 1);
  const tapeCapW = TAPE_CAPTION.length * 32 * 0.5;
  const parcelsX0 = BAND.cx - (parcelsW + 30 + tapeCapW) / 2;

  const text = (size: number, extra: CSSProperties = {}): CSSProperties => ({ fontFamily: FONT.sans, fontSize: size, whiteSpace: 'nowrap', ...extra });

  return (
    <Stage>
      {/* The table */}
      <div style={{ position: 'absolute', left: TABLE_AT_REST.x, top: tableY }}>
        <CompareTable width={TABLE_AT_REST.width} reveal={reveal} grey={{ lure: 1, domain: 1 }} match={1} marks={marks} focus={focus} scale={1} />
      </div>

      {/* s04's doors, caption and rule, stepping out */}
      {outS04 < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - outS04 }}>
          {SIDES.map((side) => (
            <div key={side} style={{ position: 'absolute', left: DOOR_X[side], top: DOOR.y }}>
              <Door side={side} name={DOOR_NAMES[side]} />
            </div>
          ))}
          <LabelCaption text={LABEL_CAPTION} show={1} glow={0.8} cx={CAPTION.cx} y={CAPTION.y} />
          <RuleLabel show={1} cx={RULE.cx} y={RULE.y} />
        </div>
      ) : null}

      {/* The two boxes: tape lit, «las dos cajas» */}
      {boxes.map(({ side, b }) => {
        const slotW = labelCentre(b).w;
        return (
          <div key={side} style={{ position: 'absolute', left: b.x, top: b.y }}>
            <TrapBox
              width={b.w}
              show={restOut}
              open={1}
              device={1}
              lit={1}
              wrapper={side === 'meridian' ? 'cv' : 'order'}
              call={0.55 * (1 - outS04)}
              callPattern={side === 'meridian' ? 'a' : 'b'}
              callSide={side === 'meridian' ? 'right' : 'left'}
              callAt={callBubbleAt(side, boxS04(side))}
              highlight={{ tape: tapeHl }}
              glow={twoBoxes * 0.6}
              glowTone={C.amber}
            >
              <WorkshopLabel width={slotW * 1.2} path={PDB_PATH} glow={0.8 * (1 - outS04)} />
            </TrapBox>
          </div>
        );
      })}

      {/* The lesson's list of what does not join, with «miles de actores» and, later, «débil para agrupar» */}
      <div
        style={{
          position: 'absolute',
          left: BAND.cx,
          top: BAND.a,
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 14,
          opacity: restOut * (1 - listDim),
        }}
      >
        {WEAK_LIST.map((item, k) => (
          <span
            key={item}
            style={text(32, {
              display: 'inline-block',
              padding: '4px 20px 6px',
              lineHeight: 1.1,
              borderRadius: 999,
              border: `2px solid ${alpha(C.amber, 0.6 + 0.3 * listWeak)}`,
              background: alpha(C.amber, 0.1 + 0.06 * listWeak),
              color: AMBER_SOFT,
              fontWeight: 700,
              opacity: chipIn[k],
              transform: `translateY(${(1 - chipIn[k]) * 10}px)`,
            })}
          >
            {item}
          </span>
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: BAND.cx,
          top: BAND.a2,
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          opacity: restOut * (1 - listDim),
        }}
      >
        <span style={text(32, { fontWeight: 650, fontStyle: 'italic', color: C.text, opacity: noteIn })}>{WEAK_LIST_NOTE}</span>
        {listWeak > 0.01 ? (
          <span
            style={text(32, {
              display: 'inline-block',
              padding: '1px 16px 3px',
              lineHeight: 1.1,
              borderRadius: 999,
              border: `2px solid ${alpha(C.amber, 0.85)}`,
              background: alpha(C.amber, 0.16),
              color: AMBER_SOFT,
              fontWeight: 780,
              opacity: listWeak,
              transform: `translateX(${(1 - listWeak) * -10}px)`,
            })}
          >
            {COMPARE_TEXT.marks.weak}
          </span>
        ) : null}
      </div>

      {/* «como todas las cajas»: ordinary parcels, the same tape */}
      {parcelsOut > 0.01
        ? PARCELS.map((p, k) => {
            const x = parcelsX0 + PARCELS.slice(0, k).reduce((a, q) => a + q.w + PARCEL_GAP, 0);
            const h = trapBoxHeight(p.w);
            return (
              <div key={k} style={{ position: 'absolute', left: x, top: PARCEL_BOTTOM - h }}>
                <TrapBox width={p.w} show={parcelsIn[k] * parcelsOut} sticker={false} mini highlight={{ tape: tapeHl }} />
              </div>
            );
          })
        : null}
      <div
        style={{
          position: 'absolute',
          left: parcelsX0 + parcelsW + 30,
          top: PARCEL_BOTTOM - 60,
          opacity: tapeCapIn * parcelsOut,
          transform: `translateX(${(1 - tapeCapIn) * -12}px)`,
          ...text(32, { fontWeight: 720, fontStyle: 'italic', color: '#fde68a' }),
        }}
      >
        {TAPE_CAPTION}
      </div>

      {/* The small line: detecting vs grouping */}
      {[det1, det2].map((p, k) => (
        <div
          key={k}
          style={{
            position: 'absolute',
            left: BAND.cx,
            top: k === 0 ? BAND.b : BAND.c,
            transform: `translate(-50%, ${(1 - p) * 8}px)`,
            opacity: p * restOut,
            ...text(32, { fontWeight: k === 0 ? 600 : 720, color: k === 0 ? C.text : C.textStrong }),
          }}
        >
          {DETECT_VS_GROUP[k]}
        </div>
      ))}
    </Stage>
  );
}
