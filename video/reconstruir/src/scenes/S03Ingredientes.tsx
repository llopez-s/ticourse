import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { windowWeight } from '../../../engine/src/ui';
import { Stage, wordFrame } from './kit';
import {
  FIREWALL_CELLS,
  FIREWALL_CELL_NOTES,
  INGREDIENTS,
  NOT_NOBODY,
  PROXY_CELLS,
  RAW,
  type Ingredient,
} from './parts/data';
import { CaseStamp } from './parts/CaseStamp';
import { RawText } from './parts/RawLines';
import { SourceTag } from './parts/Ruler';
import { WITNESS_H, WITNESS_W, WitnessFigure } from './parts/Witness';

const S = 's03-ingredientes';

// ---- Geometry (stage-local). The five columns are the five ingredients.
const COL_X0 = 250;
const COL_W: Record<Ingredient, number> = { cuando: 250, donde: 290, quien: 230, que: 400, resultado: 308 };
const COL_X: Record<Ingredient, number> = (() => {
  const out = {} as Record<Ingredient, number>;
  let x = COL_X0;
  for (const ing of INGREDIENTS) {
    out[ing.id] = x;
    x += COL_W[ing.id];
  }
  return out;
})();
const HEAD_Y = 0;
const HEAD_H = 60;
const PROXY = { top: 76, rawH: 102, cellsTop: 188 };
const FW = { top: 296, rawH: 141, cellsTop: 447 };
const CELL_H = 66;
const RAW_SIZE = 26;
const RAW_W = 1728 - COL_X0;
const WIT_W = 130;

/**
 * s03-ingredientes «Los ingredientes de una línea». `boxes`: the proxy and firewall lines appear and five coloured
 * boxes name the ingredients as the voice lists them (cuándo, dónde, quién, qué, resultado). `proxy-fields`: the
 * proxy line's five fields are boxed in their colours and fill the proxy's row of cells (resultado: 403 BLOQUEADO,
 * the only rose on the board). `fw-fields`: same for the firewall — start, src, dst + port + bytes_out, action=ALLOW
 * — but the «quién» box has nothing to hold. `empty`: that box blinks once and stays grey (never red); `not-nobody`:
 * the label «no lo apunta: no significa nadie». The firewall's witness looks at the street, not at the faces.
 */
export function S03Ingredientes(props: SceneProps) {
  const frame = useCurrentFrame();
  const boxesAt = props.cue('boxes');
  const proxyAt = props.cue('proxy-fields');
  const fwAt = props.cue('fw-fields');
  const emptyAt = props.cue('empty');
  const nobodyAt = props.cue('not-nobody');

  // The header boxes arrive on the words that name them.
  const headAt: Record<Ingredient, number> = {
    cuando: wordFrame(S, 's03-01', 'Cuándo') - 4,
    donde: wordFrame(S, 's03-01', 'dónde') - 4,
    quien: wordFrame(S, 's03-01', 'quién') - 4,
    que: wordFrame(S, 's03-01', 'qué', 0) - 4,
    resultado: wordFrame(S, 's03-01', 'resultado') - 4,
  };
  const proxyResultAt = wordFrame(S, 's03-02', 'resultado', 0) - 6;
  const fwResultAt = wordFrame(S, 's03-02', 'resultado', 1) - 6;
  const stepP = Math.max(12, (proxyResultAt - proxyAt) / 4);
  const stepF = Math.max(12, (fwResultAt - fwAt) / 3.4);
  const proxyAtOf: Record<Ingredient, number> = {
    cuando: proxyAt,
    donde: proxyAt + stepP,
    quien: proxyAt + 2 * stepP,
    que: proxyAt + 3 * stepP,
    resultado: proxyResultAt,
  };
  const fwAtOf: Record<Ingredient, number> = {
    cuando: fwAt,
    donde: fwAt + stepF,
    quien: Number.POSITIVE_INFINITY,
    que: fwAt + 2 * stepF,
    resultado: fwResultAt,
  };
  const on = (at: number) => (Number.isFinite(at) ? progress(frame, at, 14) : 0);
  const proxyIngs = Object.fromEntries(INGREDIENTS.map((i) => [i.id, on(proxyAtOf[i.id])])) as Record<Ingredient, number>;
  const fwIngs = Object.fromEntries(INGREDIENTS.map((i) => [i.id, on(fwAtOf[i.id])])) as Record<Ingredient, number>;

  // The empty box: appears, blinks once (one soft pulse), stays grey.
  const emptyP = progress(frame, emptyAt, 14);
  const blink = Math.max(0, Math.sin(Math.min(1, (frame - emptyAt) / 40) * Math.PI)) * (frame >= emptyAt ? 1 : 0);
  const nobodyP = progress(frame, nobodyAt, 16);
  const proxyGlow = windowWeight(frame, proxyAt, fwAt - 20, { ramp: 12 });
  const fwGlow = windowWeight(frame, fwAt, nobodyAt + 120, { ramp: 12 });

  return (
    <Stage>
      {/* the five ingredients, as the voice says them */}
      {INGREDIENTS.map((ing) => {
        const p = progress(frame, headAt[ing.id], 14, EASE.out);
        return (
          <div
            key={ing.id}
            style={{
              position: 'absolute',
              left: COL_X[ing.id] + 4,
              top: HEAD_Y,
              width: COL_W[ing.id] - 12,
              height: HEAD_H,
              boxSizing: 'border-box',
              borderRadius: RADIUS.md,
              border: `3px solid ${alpha(ing.color, 0.95)}`,
              background: alpha(ing.color, 0.18),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT.sans,
              fontSize: 34,
              fontWeight: 800,
              color: C.textStrong,
              opacity: p,
              transform: `translateY(${(1 - p) * -16}px) scale(${0.92 + 0.08 * p})`,
            }}
          >
            {ing.label}
          </div>
        );
      })}

      {/* ---- the proxy ---- */}
      <Block
        frame={frame}
        sourceId="proxy"
        top={PROXY.top}
        rawH={PROXY.rawH}
        appearAt={boxesAt}
        glow={proxyGlow}
        witness={<WitnessFigure kind="door" width={WIT_W} glow={proxyGlow} />}
        line={
          <RawText line={RAW.proxy[0]} size={RAW_SIZE} ings={proxyIngs} />
        }
      />
      {INGREDIENTS.map((ing) => {
        const p = on(proxyAtOf[ing.id]);
        const rose = ing.id === 'resultado';
        return (
          <Cell key={ing.id} ing={ing.id} top={PROXY.cellsTop} p={p} tone={rose ? C.rose : ing.color}>
            <Mono text={PROXY_CELLS[ing.id]} color={rose ? C.roseSoft : C.textStrong} />
          </Cell>
        );
      })}

      {/* ---- the firewall ---- */}
      <Block
        frame={frame}
        sourceId="firewall"
        top={FW.top}
        rawH={FW.rawH}
        appearAt={boxesAt + 10}
        glow={fwGlow}
        witness={<WitnessFigure kind="exit" look="street" crowd width={WIT_W} glow={fwGlow} />}
        caption="mira a la calle, no a las caras"
        line={<RawText line={RAW.firewall[0]} size={RAW_SIZE} ings={fwIngs} />}
      />
      {INGREDIENTS.map((ing) => {
        if (ing.id === 'quien') return null;
        const p = on(fwAtOf[ing.id]);
        return (
          <Cell key={ing.id} ing={ing.id} top={FW.cellsTop} p={p} tone={ing.color}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {FIREWALL_CELLS[ing.id].map((t) => (
                <Mono key={t} text={t} color={C.textStrong} />
              ))}
              {FIREWALL_CELL_NOTES[ing.id] ? (
                <span style={{ fontFamily: FONT.sans, fontSize: 22, fontWeight: 650, color: C.muted }}>{FIREWALL_CELL_NOTES[ing.id]}</span>
              ) : null}
            </div>
          </Cell>
        );
      })}

      {/* the box that has nothing to hold: grey, not red */}
      <div
        style={{
          position: 'absolute',
          left: COL_X.quien + 4,
          top: FW.cellsTop,
          width: COL_W.quien - 12,
          height: CELL_H,
          boxSizing: 'border-box',
          borderRadius: RADIUS.md,
          border: `3px dashed ${alpha(C.muted, 0.55 + 0.4 * blink)}`,
          background: alpha(C.muted, 0.06 + 0.16 * blink),
          opacity: emptyP,
          transform: `scale(${1 + 0.06 * blink})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT.sans,
          fontSize: 30,
          fontWeight: 650,
          color: C.muted,
        }}
      >
        vacío
      </div>
      <div
        style={{
          position: 'absolute',
          left: COL_X.quien - 40,
          top: FW.cellsTop + CELL_H + 12,
          width: 740,
          fontFamily: FONT.sans,
          fontSize: 36,
          fontWeight: 750,
          color: C.text,
          opacity: nobodyP,
          transform: `translateY(${(1 - nobodyP) * 10}px)`,
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ color: C.muted }}>{NOT_NOBODY.split(':')[0]}:</span>
        {NOT_NOBODY.split(':')[1]}
      </div>

      <CaseStamp frame={frame} />
    </Stage>
  );
}

/** One source's row: its name tag and witness on the left, its raw line in a panel on the right. */
function Block({
  frame,
  sourceId,
  top,
  rawH,
  appearAt,
  glow,
  witness,
  caption,
  line,
}: {
  frame: number;
  sourceId: 'proxy' | 'firewall';
  top: number;
  rawH: number;
  appearAt: number;
  glow: number;
  witness: ReactNode;
  caption?: string;
  line: ReactNode;
}) {
  const p = progress(frame, appearAt, 18);
  const witH = (WIT_W * WITNESS_H) / WITNESS_W;
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * 20}px)` }}>
      <div style={{ position: 'absolute', left: 0, top }}>
        <SourceTag id={sourceId} size={26} />
      </div>
      <div style={{ position: 'absolute', left: 0, top: top + 44 }}>{witness}</div>
      {caption ? (
        <div style={{ position: 'absolute', left: 0, top: top + 44 + witH + 4, width: 240, fontFamily: FONT.sans, fontSize: 26, fontWeight: 600, lineHeight: 1.2, color: C.muted }}>
          {caption}
        </div>
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: COL_X0,
          top,
          width: RAW_W,
          height: rawH,
          boxSizing: 'border-box',
          padding: '10px 20px',
          borderRadius: RADIUS.md,
          border: `2px solid ${alpha(C.cyan, 0.3 + 0.4 * glow)}`,
          background: alpha(C.ink900, 0.97),
          boxShadow: glow > 0.01 ? `0 0 ${16 + 22 * glow}px ${alpha(C.cyan, 0.22 * glow)}` : undefined,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {line}
      </div>
    </div>
  );
}

function Cell({ ing, top, p, tone, children }: { ing: Ingredient; top: number; p: number; tone: string; children: ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: COL_X[ing] + 4,
        top,
        width: COL_W[ing] - 12,
        height: CELL_H,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `3px solid ${alpha(tone, 0.9)}`,
        background: alpha(tone, 0.14),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: p,
        transform: `translateY(${(1 - p) * 14}px)`,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </div>
  );
}

function Mono({ text, color }: { text: string; color: string }) {
  return <span style={{ fontFamily: FONT.mono, fontSize: 30, fontWeight: 650, color }}>{text}</span>;
}
