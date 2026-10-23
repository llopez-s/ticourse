import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { Bar, Tag } from './parts/paper';
import { Stage, wordFrame } from './kit';

const S = 's03-anatomia';
const W = STAGE.width;
const CARD_W = 1010;
const RIGHT = 1070;

// Block geometry in stage coordinates.
const A = { top: 12, h: 220 } as const;
const B = { top: 246, h: 126 } as const;
const O = { top: 388, h: 262 } as const;
const ROW_A0 = A.top + 66; // first scenario bar
const OPT_ROW0 = O.top + 60;

/**
 * s03-anatomia «Las tres partes de una pregunta». A question skeleton made of grey bars
 * (no text of any real question), split into three labelled blocks as `shape` is said:
 * ESCENARIO, PREGUNTA, CUATRO OPCIONES. `scenario`: three bars light up as «hechos», the
 * fourth dims as «relleno a propósito», an eye says «una lectura, rápida». `question`: one bar,
 * «dos lecturas», a chunk of it goes cyan. `qualifier`: that chunk is labelled «calificador»
 * and best · first · except appear beside it. `options`: two of the four rows are marked
 * «defendible», the other two switch off («una vale · otra vale más»). `wrap-shape`: the
 * right column gives way to «cierta no basta · tiene que responder justo lo que piden».
 */
export function S03Anatomia(props: SceneProps) {
  const frame = useCurrentFrame();
  const shape = props.cue('shape');
  const scenario = props.cue('scenario');
  const question = props.cue('question');
  const qualifier = props.cue('qualifier');
  const options = props.cue('options');
  const wrap = props.cue('wrap-shape');

  // ---- word beats
  const hechosAt = wordFrame(S, 's03-02', 'hechos') - 6;
  const rellenoAt = wordFrame(S, 's03-02', 'relleno') - 6;
  const dosAt = wordFrame(S, 's03-03', 'dos') - 6;
  const palabraAt = wordFrame(S, 's03-03', 'palabra') - 6;
  const bestAt = wordFrame(S, 's03-04', 'best') - 6;
  const firstAt = wordFrame(S, 's03-04', 'first') - 6;
  const exceptAt = wordFrame(S, 's03-04', 'except') - 6;
  const defAt = wordFrame(S, 's03-05', 'defendibles') - 6;
  const valeAt = wordFrame(S, 's03-05', 'vale') - 6;
  const masAt = wordFrame(S, 's03-05', 'más') - 6;

  const wrapP = progress(frame, wrap - 8, 16, EASE.inOut);
  const rightOut = 1 - wrapP;

  const block = (top: number, h: number, label: string, at: number, focusAt: number, children: ReactNode) => {
    const e = enter(frame, at, { distance: 24 });
    const hot = progress(frame, focusAt, 12);
    return (
      <div
        style={{
          position: 'absolute',
          left: 0,
          top,
          width: CARD_W,
          height: h,
          boxSizing: 'border-box',
          borderRadius: RADIUS.lg,
          background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
          border: `2px solid ${alpha(C.cyan, 0.18 + 0.5 * hot)}`,
          boxShadow: hot > 0.05 ? `0 0 ${Math.round(30 * hot)}px ${alpha(C.cyan, 0.2 * hot)}` : `0 18px 40px ${alpha('#000000', 0.35)}`,
          ...e,
        }}
      >
        <span
          style={{
            position: 'absolute',
            left: 26,
            top: -20,
            padding: '4px 20px',
            borderRadius: RADIUS.pill,
            background: C.ink700,
            border: `2px solid ${alpha(C.cyan, 0.4 + 0.5 * hot)}`,
            fontFamily: FONT.sans,
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: 3,
            color: hot > 0.4 ? C.cyanSoft : C.text,
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
        {children}
      </div>
    );
  };

  // scenario bars: [width px, lit by `hechos`, relleno]
  const barDefs = [
    { w: 780, fact: true },
    { w: 640, fact: true },
    { w: 720, fact: true },
    { w: 470, fact: false },
  ];
  const factLit = progress(frame, hechosAt, 14);
  const fillerLit = progress(frame, rellenoAt, 14);

  const chunkLit = progress(frame, palabraAt, 12);
  const qLabel = progress(frame, qualifier, 14);

  const optLit = progress(frame, defAt, 14);

  return (
    <Stage>
      {/* the skeleton card */}
      {block(
        A.top,
        A.h,
        'ESCENARIO',
        shape,
        scenario,
        <>
          {barDefs.map((b, i) => {
            const top = ROW_A0 - A.top + i * 36;
            const lit = b.fact ? factLit : 0;
            const dim = b.fact ? 0 : fillerLit;
            return (
              <Bar
                key={i}
                w={b.w}
                h={22}
                color={b.fact ? (lit > 0.05 ? C.cyan : C.ink600) : dim > 0.05 ? C.amber : C.ink600}
                glow={b.fact ? lit * 0.6 : 0}
                style={{ position: 'absolute', left: 40, top, opacity: b.fact ? 1 : 1 - 0.5 * dim, ...enter(frame, shape + 6 + i * 4, { distance: 10 }) }}
              />
            );
          })}
          {/* bracket + «hechos» */}
          {factLit > 0.01 ? (
            <div style={{ position: 'absolute', left: 836, top: ROW_A0 - A.top - 2, opacity: factLit }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: 16, height: 3 * 36 - 10, borderRight: `5px solid ${C.cyan}`, borderTop: `5px solid ${C.cyan}`, borderBottom: `5px solid ${C.cyan}`, borderRadius: '0 10px 10px 0', boxSizing: 'border-box' }} />
              <div style={{ position: 'absolute', left: 36, top: 24 }}>
                <Tag color={C.cyan} size={32}>
                  hechos
                </Tag>
              </div>
            </div>
          ) : null}
          {fillerLit > 0.01 ? (
            <div style={{ position: 'absolute', left: 540, top: ROW_A0 - A.top + 3 * 36 - 18, opacity: fillerLit, transform: `translateX(${(1 - fillerLit) * -16}px)` }}>
              <Tag color={C.amber} size={28}>
                relleno a propósito
              </Tag>
            </div>
          ) : null}
        </>,
      )}
      {block(
        B.top,
        B.h,
        'PREGUNTA',
        shape + 14,
        question,
        <div style={{ position: 'absolute', left: 40, top: 66, display: 'flex', alignItems: 'center', ...enter(frame, shape + 22, { distance: 10 }) }}>
          <Bar w={520} h={30} />
          <Bar w={150} h={30} color={chunkLit > 0.05 ? C.cyan : C.ink600} glow={chunkLit} style={{ margin: '0 12px', transform: `scaleY(${1 + 0.15 * chunkLit})` }} />
          <Bar w={46} h={30} />
        </div>,
      )}
      {block(
        O.top,
        O.h,
        'CUATRO OPCIONES',
        shape + 28,
        options,
        <>
          {['A', 'B', 'C', 'D'].map((l, i) => {
            const defendible = i === 1 || i === 2;
            const off = defendible ? 0 : optLit;
            const tagIn = defendible ? optLit : 0;
            return (
              <div
                key={l}
                style={{
                  position: 'absolute',
                  left: 40,
                  top: OPT_ROW0 - O.top + i * 50,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  opacity: 1 - 0.62 * off,
                  filter: off > 0.05 ? `saturate(${1 - 0.5 * off})` : undefined,
                  ...enter(frame, shape + 34 + i * 4, { distance: 10 }),
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 20, display: 'grid', placeItems: 'center', background: defendible && tagIn > 0.05 ? alpha(C.cyan, 0.9) : C.ink700, border: `2px solid ${defendible && tagIn > 0.05 ? C.cyan : C.ink600}`, color: defendible && tagIn > 0.05 ? C.ink950 : C.text, fontFamily: FONT.sans, fontSize: 26, fontWeight: 850 }}>{l}</div>
                <Bar w={[520, 600, 560, 430][i]} h={22} color={defendible && tagIn > 0.05 ? C.cyan : C.ink600} glow={tagIn * 0.5} />
                {defendible ? (
                  <span style={{ opacity: tagIn, transform: `translateX(${(1 - tagIn) * -14}px)` }}>
                    <Tag color={C.cyan} size={28}>
                      defendible
                    </Tag>
                  </span>
                ) : null}
              </div>
            );
          })}
        </>,
      )}

      {/* right column: how to read each part */}
      <div style={{ position: 'absolute', left: RIGHT, top: 0, width: W - RIGHT, height: 660, opacity: rightOut, fontFamily: FONT.sans }}>
        {frame >= scenario - 4 ? (
          <div style={{ position: 'absolute', left: 0, top: 36, display: 'flex', alignItems: 'center', gap: 20, ...enter(frame, scenario, { distance: 24, axis: 'x' }) }}>
            <div style={{ width: 84, height: 84, borderRadius: 42, display: 'grid', placeItems: 'center', background: alpha(C.cyan, 0.12), border: `3px solid ${alpha(C.cyan, 0.7)}` }}>
              <Icon name="eye" size={50} color={C.cyan} strokeWidth={2} />
            </div>
            <span style={{ fontSize: 44, fontWeight: 800, color: C.textStrong, lineHeight: 1.1 }}>
              una lectura,
              <br />
              rápida
            </span>
          </div>
        ) : null}

        {frame >= dosAt - 4 ? (
          <div style={{ position: 'absolute', left: 0, top: 252, display: 'flex', alignItems: 'center', gap: 16, ...enter(frame, dosAt, { distance: 24, axis: 'x' }) }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <Icon name="eye" size={48} color={C.cyan} strokeWidth={2} />
              <Icon name="eye" size={48} color={C.cyan} strokeWidth={2} />
            </div>
            <span style={{ fontSize: 44, fontWeight: 800, color: C.textStrong }}>dos lecturas</span>
          </div>
        ) : null}
        {qLabel > 0.01 ? (
          <>
            {/* connector from the cyan chunk to the label */}
            <div style={{ position: 'absolute', left: -(RIGHT - 712), top: 327, width: RIGHT - 712 + 14, height: 4, background: C.cyan, transformOrigin: 'left center', transform: `scaleX(${qLabel})`, borderRadius: 2 }} />
            <div style={{ position: 'absolute', left: 14, top: 300, opacity: qLabel }}>
              <Tag color={C.cyan} size={36} solid>
                calificador
              </Tag>
            </div>
            <div style={{ position: 'absolute', left: 0, top: 372, display: 'flex', gap: 14 }}>
              {[
                ['best', bestAt],
                ['first', firstAt],
                ['except', exceptAt],
              ].map(([t, at]) => (
                <div key={t as string} style={enter(frame, at as number, { distance: 18 })}>
                  <span style={{ display: 'inline-block', padding: '6px 24px 8px', borderRadius: RADIUS.md, background: alpha(C.cyan, 0.14), border: `3px solid ${alpha(C.cyan, 0.7)}`, fontFamily: FONT.mono, fontSize: 40, fontWeight: 800, color: C.cyanSoft }}>{t as string}</span>
                </div>
              ))}
            </div>
          </>
        ) : null}

        {frame >= valeAt - 4 ? (
          <div style={{ position: 'absolute', left: 0, top: 486, width: W - RIGHT }}>
            <div style={{ fontSize: 44, fontWeight: 800, color: C.textStrong, ...enter(frame, valeAt, { distance: 22, axis: 'x' }) }}>una vale</div>
            <div style={{ marginTop: 6, fontSize: 52, fontWeight: 850, color: C.cyanSoft, ...enter(frame, masAt, { distance: 22, axis: 'x' }) }}>otra vale más</div>
          </div>
        ) : null}
      </div>

      {/* wrap */}
      {frame >= wrap - 6 ? (
        <div style={{ position: 'absolute', left: RIGHT, top: 120, width: W - RIGHT, fontFamily: FONT.sans, ...enter(frame, wrap, { distance: 28, axis: 'x' }) }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <Icon name="check" size={64} color={C.amber} strokeWidth={2.6} />
            <span style={{ fontSize: 62, fontWeight: 850, color: C.amber, letterSpacing: -1 }}>cierta no basta</span>
          </div>
          <div style={{ marginTop: 40, width: 120, height: 4, background: C.ink600 }} />
          <div style={{ marginTop: 40, fontSize: 56, fontWeight: 850, color: C.emerald, lineHeight: 1.12, letterSpacing: -1 }}>
            tiene que responder justo lo que piden
          </div>
        </div>
      ) : null}
    </Stage>
  );
}
