import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, clamp01, mix } from '../../../engine/src/ui';
import { CRANE_PLACE, Crane, craneHeight } from './parts/Crane';
import { FireTrucks, ImageTag, fireIconWidth } from './parts/Firehouse';
import { CaseStamp, Pill, TermPill } from './parts/Labels';
import { Stage, wordFrame } from './kit';

const S = 's02-manda';
const STAMP = ['Autoridad Portuaria de Halden', 'requisitos para el control del muelle', 'propuesta · sin fecha'];

/** The requirements, in the order the voice gives them (the port's order, not the textbook's). */
const REQS = [
  { word: 'AVAILABILITY', gloss: 'que siga moviendo carga mientras haya barco', at: 'primero' },
  { word: 'INTEGRITY', gloss: 'que nadie cambie una orden', at: 'nadie' },
  { word: 'CONFIDENTIALITY', gloss: 'la velocidad del viento no es ningún secreto', at: 'secreto' },
] as const;
const NAMES = [
  { name: 'ICS', idea: 'lo que gobierna el proceso, controladores incluidos', idea_at: null, at: 'ICS' },
  { name: 'SCADA', idea: 'la capa que los supervisa', idea_at: 'capa', at: 'SCADA' },
  { name: 'OT', idea: 'todo junto', idea_at: 'todo', at: 'OT' },
] as const;

/** Right-hand text column (the crane is at CRANE_PLACE, boom pointing at it). */
const COL_X = CRANE_PLACE.left + CRANE_PLACE.width + 70;
const COL_W = 1728 - COL_X;
const ROW_W = 940;
const ROW_TOP = 86;
const BIG_H = 118;
const SMALL_H = 62;
const ROW_GAP = 12;
const NAMES_TOP = 350;
const NAME_H = 92;
/** The duplicated controllers and the fire-station strip under them. */
const CARD_TOP = 160;
const FIRE_TOP = 426;
const FIRE_SIZE = 130;

/** A bump 0 → 1 → `rest`: lit at `at`, back to `rest` after `hold` frames. */
function bump(frame: number, at: number, hold = 40, rest = 0): number {
  return rest + (1 - rest) * progress(frame, at, 8) * (1 - progress(frame, at + hold, 18));
}

/**
 * s02-manda «Primero, que no se pare». The crane sits at its place on the left; on `case` three empty numbered slots
 * wait on the right (the port's requirements, still unwritten) while a pass lights each part of the crane in turn
 * («lo repasa sobre esta grúa»). On `order` the three words fill the slots, each on its sentence of the voice, with its
 * gloss; on `names` the rows shrink to make room for ICS · SCADA · OT (the idea first, the name on its word). On `cia`
 * the names give way to «en OT, la CIA se lee al revés» (C·I·A becomes A·I·C as the voice lists them) and, on
 * `exam-line`, the exam hint in violet. On `ha` the column is replaced by the duplicated controllers, each with its own
 * power, and on `firehouse-1` the two fire trucks on duty come in with «high availability · se diseña, no se compra».
 */
export function S02Manda(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const caseAt = props.cue('case');
  const sweepAt = w('s02-01', 'repasa') - 6;
  const orderAt = props.cue('order');
  const rowAt = REQS.map((r) => w('s02-02', r.at) - 6);
  const namesAt = props.cue('names');
  const ideaAt = NAMES.map((n) => (n.idea_at ? w('s02-03', n.idea_at) - 6 : namesAt));
  const pillAt = NAMES.map((n) => w('s02-03', n.at) - 4);
  const ciaAt = props.cue('cia');
  const letterAt = [w('s02-04', 'availability') - 4, w('s02-04', 'integrity') - 4, w('s02-04', 'confidentiality') - 4];
  const reverseAt = w('s02-04', 'revés') - 4;
  const examAt = props.cue('exam-line');
  const haAt = props.cue('ha');
  const copyAt = w('s02-05', 'cada') - 4;
  const powerAt = [w('s02-05', 'alimentación') - 4, w('s02-05', 'alimentación') + 10];
  const fhAt = props.cue('firehouse-1');
  const designAt = w('s02-06', 'diseña') - 6;
  const highAt = w('s02-06', 'high') - 4;

  const stampIn = enter(frame, -6, { distance: 16, duration: 16 });
  const collapse = progress(frame, namesAt - 10, 22, EASE.inOut);
  const rowH = mix(BIG_H, SMALL_H, collapse);
  const rowTop = (i: number) => ROW_TOP + i * (rowH + mix(ROW_GAP + 2, 8, collapse));
  const namesOut = progress(frame, ciaAt - 8, 14);
  const colOut = progress(frame, haAt - 12, 14);

  // Crane: a pass over the four parts on `case` (in x order), then the part each requirement talks about.
  const pass = [0, 1, 2, 3].map((i) => bump(frame, sweepAt + i * 12, 14, 0));
  const lit = {
    controllers: Math.max(pass[0], bump(frame, rowAt[1], 56), progress(frame, haAt, 14)),
    anticollision: pass[1],
    wireless: pass[2],
    wind: Math.max(pass[3], bump(frame, rowAt[2], 56)),
  };

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...stampIn }}>
        <CaseStamp parts={STAMP} />
      </div>

      <div style={{ position: 'absolute', left: CRANE_PLACE.left, top: CRANE_PLACE.top, ...enter(frame, -4, { distance: 14 }) }}>
        <Crane width={CRANE_PLACE.width} lit={lit} dots />
      </div>

      {/* The requirements: empty numbered slots on `case`, filled on `order`; they stay (compact) until `ha`. */}
      <div style={{ position: 'absolute', left: COL_X, top: 0, width: COL_W, height: 660, opacity: 1 - colOut }}>
        {REQS.map((r, i) => {
          const slotIn = enter(frame, caseAt + 2 + i * 5, { distance: 14 });
          const filled = progress(frame, rowAt[i], 12);
          const hot = filled * (1 - 0.55 * progress(frame, rowAt[i + 1] ?? orderAt + 99999, 10));
          const cia = frame >= ciaAt ? bump(frame, letterAt[i] ?? 0, 36, 0.35) : 0;
          return (
            <div key={r.word} style={{ position: 'absolute', left: 0, top: rowTop(i), width: ROW_W, height: rowH, ...slotIn }}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  boxSizing: 'border-box',
                  borderRadius: 22,
                  border: `3px ${filled < 0.5 ? 'dashed' : 'solid'} ${alpha(C.cyan, 0.22 + 0.55 * Math.max(hot, 0.35 * filled, cia))}`,
                  background: alpha(C.cyan, 0.03 + 0.1 * Math.max(hot, cia)),
                  boxShadow: hot > 0.05 || cia > 0.4 ? `0 0 ${Math.round(26 * Math.max(hot, cia))}px ${alpha(C.cyan, 0.28 * Math.max(hot, cia))}` : undefined,
                }}
              />
              <div style={{ position: 'absolute', left: 22, top: 0, bottom: 0, display: 'flex', alignItems: 'center', gap: 22 }}>
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 27,
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: FONT.sans,
                    fontSize: 34,
                    fontWeight: 850,
                    color: filled > 0.5 ? C.ink950 : C.faint,
                    background: filled > 0.5 ? C.cyan : 'transparent',
                    border: `3px solid ${filled > 0.5 ? C.cyan : alpha(C.faint, 0.7)}`,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ opacity: filled, transform: `translateX(${(1 - filled) * 14}px)` }}>
                  <div style={{ fontFamily: FONT.sans, fontSize: mix(48, 42, collapse), fontWeight: 850, letterSpacing: 0.5, lineHeight: 1.1, color: C.textStrong }}>{r.word}</div>
                  <div
                    style={{
                      fontFamily: FONT.sans,
                      fontSize: 34,
                      fontWeight: 600,
                      lineHeight: 1.2,
                      color: C.muted,
                      whiteSpace: 'nowrap',
                      height: (1 - collapse) * 42,
                      opacity: clamp01(1 - collapse * 1.8),
                      overflow: 'hidden',
                    }}
                  >
                    {r.gloss}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* The names, after the idea: ICS · SCADA · OT */}
        {frame >= namesAt - 12 && namesOut < 1 ? (
          <div style={{ position: 'absolute', left: 0, top: NAMES_TOP, width: COL_W, opacity: (1 - namesOut) * progress(frame, namesAt - 10, 14) }}>
            {NAMES.map((n, i) => {
              const ideaIn = enter(frame, ideaAt[i], { distance: 14, duration: 16 });
              const named = progress(frame, pillAt[i], 10);
              return (
                <div key={n.name} style={{ position: 'absolute', left: 0, top: i * (NAME_H + 12), height: NAME_H, display: 'flex', alignItems: 'center', gap: 26 }}>
                  <div
                    style={{
                      width: 210,
                      height: NAME_H - 8,
                      boxSizing: 'border-box',
                      display: 'grid',
                      placeItems: 'center',
                      borderRadius: RADIUS.pill,
                      border: `3px ${named > 0.3 ? 'solid' : 'dashed'} ${alpha(C.sky, 0.3 + 0.6 * named)}`,
                      background: alpha(C.sky, 0.05 + 0.12 * named),
                      boxShadow: named > 0.05 ? `0 0 ${Math.round(24 * named)}px ${alpha(C.sky, 0.3 * named)}` : undefined,
                      fontFamily: FONT.sans,
                      fontSize: 56,
                      fontWeight: 900,
                      letterSpacing: 1,
                      color: C.textStrong,
                    }}
                  >
                    <span style={{ opacity: named, transform: `scale(${0.85 + 0.15 * named})` }}>{n.name}</span>
                  </div>
                  <div style={{ width: 760, fontFamily: FONT.sans, fontSize: 36, fontWeight: 650, lineHeight: 1.18, color: C.text, ...ideaIn }}>{n.idea}</div>
                </div>
              );
            })}
          </div>
        ) : null}

        {/* «en OT, la CIA se lee al revés» + the exam hint */}
        {frame >= ciaAt - 6 ? (
          <div style={{ position: 'absolute', left: 0, top: NAMES_TOP - 6, width: COL_W, ...enter(frame, ciaAt - 4, { distance: 18 }) }}>
            <div style={{ fontFamily: FONT.sans, fontSize: 54, fontWeight: 850, letterSpacing: -1, color: C.textStrong, whiteSpace: 'nowrap' }}>
              en <span style={{ color: C.cyan }}>OT</span>, la CIA se lee al revés
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 28 }}>
              <LetterRow letters={['C', 'I', 'A']} tone={C.faint} struck={progress(frame, reverseAt, 14)} />
              <svg width={96} height={64} viewBox="0 0 96 64" style={{ opacity: progress(frame, reverseAt, 12) }}>
                <path d="M10 48 C 30 6, 66 6, 86 44" fill="none" stroke={C.cyan} strokeWidth={5} strokeLinecap="round" />
                <path d="M70 46 L88 46 L84 28" fill="none" stroke={C.cyan} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <LetterRow letters={['A', 'I', 'C']} tone={C.cyan} at={letterAt} frame={frame} />
            </div>
            {frame >= examAt - 6 ? (
              <div style={{ marginTop: 34, ...enter(frame, examAt - 4, { distance: 16 }) }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 18,
                    padding: '14px 30px 14px 22px',
                    borderRadius: 22,
                    border: `3px solid ${alpha(C.violet, 0.7)}`,
                    background: alpha(C.violet, 0.12),
                    fontFamily: FONT.sans,
                    fontSize: 38,
                    fontWeight: 750,
                    color: '#ddd6fe',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Icon name="mortarboard" size={40} color={C.violet} />
                  <span>la opción que para el proceso suele ser la mala</span>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* The first design requirement: the controllers are duplicated, each with its own power, no line between them */}
      {frame >= haAt - 6 ? (
        <div style={{ position: 'absolute', left: COL_X, top: 0, width: COL_W, height: 660 }}>
          <div style={{ position: 'absolute', left: 0, top: ROW_TOP, ...enter(frame, haAt, { distance: 16 }) }}>
            <Pill text="primer requisito: duplicar los controladores" tone={C.cyan} size={36} height={62} on={0.7} />
          </div>
          <ControllerCard left={0} top={CARD_TOP} at={haAt + 6} powerAt={powerAt[0]} frame={frame} />
          <ControllerCard left={470} top={CARD_TOP} at={copyAt} powerAt={powerAt[1]} frame={frame} />

          {frame >= fhAt - 6 ? (
            <div style={{ position: 'absolute', left: 0, top: 0 }}>
              <div style={{ position: 'absolute', left: 0, top: FIRE_TOP, ...enter(frame, fhAt, { distance: 18 }) }}>
                <FireTrucks size={FIRE_SIZE} glow={0.35 + 0.4 * bump(frame, fhAt, 60)} />
              </div>
              <div style={{ position: 'absolute', left: 0, top: FIRE_TOP + FIRE_SIZE + 22, ...enter(frame, fhAt + 6, { distance: 12 }) }}>
                <ImageTag />
              </div>
              {frame >= highAt - 4 ? (
                <div style={{ position: 'absolute', left: fireIconWidth('trucks', FIRE_SIZE) + 70, top: FIRE_TOP + 4, ...enter(frame, highAt, { distance: 16 }) }}>
                  <TermPill text="HIGH AVAILABILITY" size={46} on={0.9} />
                </div>
              ) : null}
              {frame >= designAt - 4 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: fireIconWidth('trucks', FIRE_SIZE) + 70,
                    top: FIRE_TOP + 100,
                    fontFamily: FONT.sans,
                    fontSize: 48,
                    fontWeight: 850,
                    letterSpacing: -0.5,
                    color: C.textStrong,
                    whiteSpace: 'nowrap',
                    ...enter(frame, designAt, { distance: 16 }),
                  }}
                >
                  se diseña, <span style={{ color: C.cyan }}>no se compra</span>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </Stage>
  );
}

/** Three round letter discs (C · I · A or A · I · C); with `at` each lights on its own frame. */
function LetterRow({ letters, tone, struck = 0, at, frame = 0 }: { letters: string[]; tone: string; struck?: number; at?: number[]; frame?: number }) {
  return (
    <div style={{ display: 'flex', gap: 14, position: 'relative' }}>
      {letters.map((l, i) => {
        const on = at ? progress(frame, at[i], 10) : 1;
        return (
          <div
            key={l}
            style={{
              width: 78,
              height: 78,
              borderRadius: 39,
              display: 'grid',
              placeItems: 'center',
              boxSizing: 'border-box',
              fontFamily: FONT.sans,
              fontSize: 46,
              fontWeight: 900,
              color: at ? (on > 0.5 ? C.ink950 : alpha(C.cyan, 0.5)) : alpha(C.muted, 1 - 0.55 * struck),
              background: at ? (on > 0.5 ? C.cyan : alpha(C.cyan, 0.06)) : alpha(C.muted, 0.08),
              border: `3px ${at && on < 0.5 ? 'dashed' : 'solid'} ${at ? alpha(C.cyan, 0.3 + 0.6 * on) : alpha(tone, 0.7 - 0.4 * struck)}`,
              boxShadow: at && on > 0.05 ? `0 0 ${Math.round(24 * on)}px ${alpha(C.cyan, 0.4 * on)}` : undefined,
            }}
          >
            {l}
          </div>
        );
      })}
      {struck > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: -8,
            top: 37,
            height: 5,
            width: `calc(${struck * 100}% + 16px)`,
            borderRadius: 3,
            background: C.rose,
            boxShadow: `0 0 10px ${alpha(C.rose, 0.6)}`,
            transform: 'rotate(-3deg)',
            transformOrigin: '0 50%',
          }}
        />
      ) : null}
    </div>
  );
}

/** One of the two duplicated controllers: the machinery-house shape, its name and its own power line. */
function ControllerCard({ left, top, at, powerAt, frame }: { left: number; top: number; at: number; powerAt: number; frame: number }): ReactNode {
  const power = progress(frame, powerAt, 12);
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        width: 440,
        height: 220,
        boxSizing: 'border-box',
        borderRadius: 26,
        border: `3px solid ${alpha(C.cyan, 0.75)}`,
        background: alpha(C.cyan, 0.08),
        boxShadow: `0 0 26px ${alpha(C.cyan, 0.2)}`,
        ...enter(frame, at, { distance: 22 }),
      }}
    >
      <svg width={150} height={80} viewBox="0 0 128 56" style={{ position: 'absolute', left: 28, top: 22 }}>
        <rect x={2} y={2} width={124} height={52} rx={6} fill={alpha(C.cyan, 0.3)} stroke={C.cyan} strokeWidth={4} />
        <rect x={12} y={12} width={30} height={22} rx={3} fill={alpha(C.cyan, 0.4)} stroke={C.cyan} strokeWidth={3} />
        {[22, 32, 42].map((y) => (
          <line key={y} x1={86} y1={y} x2={114} y2={y} stroke={C.cyan} strokeWidth={3.5} strokeLinecap="round" />
        ))}
      </svg>
      <div style={{ position: 'absolute', left: 192, top: 34, fontFamily: FONT.sans, fontSize: 36, fontWeight: 850, color: C.textStrong }}>controlador</div>
      <div style={{ position: 'absolute', left: 28, right: 28, top: 128, height: 70, display: 'flex', alignItems: 'center', gap: 16, opacity: power, transform: `translateY(${(1 - power) * 10}px)` }}>
        <div style={{ width: 62, height: 62, borderRadius: 31, display: 'grid', placeItems: 'center', border: `3px solid ${alpha(C.amber, 0.85)}`, background: alpha(C.amber, 0.12) }}>
          <Icon name="bolt" size={36} color={C.amber} strokeWidth={2.4} />
        </div>
        <div style={{ fontFamily: FONT.sans, fontSize: 36, fontWeight: 700, color: C.text, whiteSpace: 'nowrap' }}>su alimentación</div>
      </div>
    </div>
  );
}

export const S02_CRANE_BOTTOM = CRANE_PLACE.top + craneHeight(CRANE_PLACE.width);
