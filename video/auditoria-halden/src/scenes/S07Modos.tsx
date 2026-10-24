import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon, dimStyle } from '../../../engine/src/ui';
import { MODES } from '../data/modes';
import { PLAN_STAMP } from '../data/shared';
import { CaseStamp, Pill } from './parts/Labels';
import { ModeGlyph, modeBorder } from './parts/Modes';
import { Stage, wordFrame } from './kit';

const S = 's07-modos';
const W = STAGE.width;
const ROE_TOP = 74;
const ROE_H = 182;
const CARDS_TOP = 274;
const CARDS_H = 306;
const CARD_GAP = 20;
const CARD_W = (W - 3 * CARD_GAP) / 4;
const CHIP_TOP = 598;

const CELLS = ['alcance', 'ventana', 'técnicas', 'contactos', 'quién autoriza'] as const;

/** What the card says besides its term: the lines the screen carries (the voice says less). */
function Description({ id }: { id: (typeof MODES)[number]['id'] }) {
  if (id === 'physical') return <>alguien intenta entrar en una oficina detrás de otra persona</>;
  if (id === 'red') return <>un objetivo: llegar a un fichero marcado en un servidor de pruebas · sin avisar</>;
  if (id === 'blue') return <>lo que se mide: si el SOC lo ve, lo entiende y lo contiene</>;
  return (
    <>
      <div>ataque y SOC en la misma sala, técnica a técnica</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
        <span>¿se vio?</span>
        <svg width={40} height={20} viewBox="0 0 40 20" fill="none" aria-hidden>
          <path d="M2 10 H34 M26 3 L35 10 L26 17" stroke={C.cyan} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ color: C.cyanSoft, fontWeight: 800 }}>regla nueva</span>
      </div>
    </>
  );
}

const NICK: Record<(typeof MODES)[number]['id'], string | null> = { physical: null, red: 'red team', blue: 'blue team', purple: 'purple team' };

/**
 * s07-modos «Cuatro maneras de probar». The plan stamp «Plan de pruebas del puerto · propuesta · sin fecha» (nothing is
 * run) and, on `roe`, the paper that goes before everything: RULES OF ENGAGEMENT with its five empty boxes — alcance ·
 * ventana · técnicas · contactos · quién autoriza —, three lit on the voice's «toca», «cuándo» and «autoriza», and the
 * phrase «sin este papel no es una prueba» on «Sin». On `physical` the paper steps back and four dashed slots wait for the
 * four modes; each card fills on its own cue — PHYSICAL, OFFENSIVE · red team (rose), DEFENSIVE · blue team (cyan),
 * INTEGRATED · purple team (rose and cyan: it is both) — while the others step back. On `proposal` all four come up
 * together and the chip «primero purple; después, un red team sin avisar» lands.
 */
export function S07Modos(props: SceneProps) {
  const frame = useCurrentFrame();
  const roeAt = props.cue('roe');
  const cardAt = [
    Math.max(props.cue('physical') + 8, wordFrame(S, 's07-02', 'physical') - 8),
    props.cue('red'),
    props.cue('blue'),
    props.cue('purple'),
  ];
  const slotsAt = props.cue('physical');
  const proposalAt = props.cue('proposal');

  const stampIn = enter(frame, -6, { distance: 14, duration: 16 });
  const roeIn = progress(frame, roeAt - 4, 18);
  const cellAt = CELLS.map((_, i) => roeAt + 12 + i * 6);
  const litAt = [wordFrame(S, 's07-01', 'toca') - 8, wordFrame(S, 's07-01', 'cuándo') - 8, wordFrame(S, 's07-01', 'autoriza') - 8];
  const cellLit = [litAt[0], litAt[1], -1, -1, litAt[2]].map((a) => (a < 0 ? 0 : progress(frame, a, 12)));
  const phraseAt = wordFrame(S, 's07-01', 'Sin') - 6;
  const phraseIn = progress(frame, phraseAt, 14);
  const roeBack = progress(frame, slotsAt - 6, 16, EASE.inOut);

  const slots = progress(frame, slotsAt - 6, 14);
  const active = frame >= cardAt[3] - 2 ? 3 : frame >= cardAt[2] - 2 ? 2 : frame >= cardAt[1] - 2 ? 1 : frame >= cardAt[0] - 2 ? 0 : -1;
  const allUp = progress(frame, proposalAt - 8, 14);
  const chipIn = springIn(frame, 30, proposalAt - 2, { damping: 15 });

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, ...stampIn }}>
        <CaseStamp what={PLAN_STAMP.what} kind={PLAN_STAMP.kind} />
      </div>

      {/* The paper that goes before everything */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: ROE_TOP,
          width: W,
          height: ROE_H,
          boxSizing: 'border-box',
          padding: '16px 24px 0',
          borderRadius: RADIUS.lg,
          border: `3px solid ${alpha(C.amber, 0.5 + 0.3 * roeIn)}`,
          background: alpha(C.amber, 0.05),
          fontFamily: FONT.sans,
          opacity: roeIn,
          transform: `translateY(${(1 - roeIn) * 16}px)`,
          ...dimStyle(0.55 * roeBack * (1 - allUp)),
        }}
      >
        <div style={{ height: 62, display: 'flex', alignItems: 'center', gap: 18, whiteSpace: 'nowrap' }}>
          <Icon name="file" size={48} color={C.amber} strokeWidth={2} />
          <span style={{ fontSize: 46, fontWeight: 900, letterSpacing: 1, color: C.textStrong }}>RULES OF ENGAGEMENT</span>
          <span style={{ marginLeft: 'auto', fontSize: 36, fontWeight: 800, color: C.amber, opacity: phraseIn, transform: `translateX(${(1 - phraseIn) * 18}px)` }}>sin este papel no es una prueba</span>
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 10 }}>
          {CELLS.map((c, i) => {
            const on = progress(frame, cellAt[i], 12);
            const lit = cellLit[i];
            return (
              <div
                key={c}
                style={{
                  flex: 1,
                  height: 70,
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '0 16px',
                  borderRadius: RADIUS.md,
                  border: `2px solid ${alpha(lit > 0.1 ? C.cyan : C.muted, 0.35 + 0.55 * lit)}`,
                  background: alpha(C.ink900, 0.7),
                  fontSize: 32,
                  fontWeight: 750,
                  color: lit > 0.1 ? C.textStrong : C.text,
                  whiteSpace: 'nowrap',
                  opacity: on,
                  transform: `translateY(${(1 - on) * 10}px)`,
                  boxShadow: lit > 0.05 ? `0 0 ${Math.round(18 * lit)}px ${alpha(C.cyan, 0.25 * lit)}` : undefined,
                }}
              >
                <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 7, border: `3px dashed ${alpha(lit > 0.1 ? C.cyan : C.muted, 0.7)}` }} />
                {c}
              </div>
            );
          })}
        </div>
      </div>

      {/* The four modes */}
      {MODES.map((m, i) => {
        const x = i * (CARD_W + CARD_GAP);
        const filled = progress(frame, cardAt[i] - 4, 16);
        const dim = i === active || allUp > 0.5 ? 0 : active >= 0 && filled > 0.5 ? 0.5 : 0;
        const full = Math.max(i === active ? 1 : 0.55, allUp);
        return (
          <div key={m.id} style={{ position: 'absolute', left: x, top: CARDS_TOP, width: CARD_W, height: CARDS_H }}>
            {/* the dashed slot that waits */}
            <div style={{ position: 'absolute', inset: 0, boxSizing: 'border-box', borderRadius: RADIUS.lg, border: `3px dashed ${alpha(C.muted, 0.5)}`, background: alpha(C.ink800, 0.4), opacity: slots * (1 - filled) }} />
            {filled > 0.01 ? (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  boxSizing: 'border-box',
                  padding: '20px 22px',
                  borderRadius: RADIUS.lg,
                  border: m.id === 'purple' ? '3px solid transparent' : `3px solid ${alpha(m.tone, 0.45 + 0.45 * full)}`,
                  background:
                    m.id === 'purple'
                      ? `linear-gradient(${C.ink900}, ${C.ink900}) padding-box, ${modeBorder(m, 0.4 + 0.5 * full)} border-box`
                      : alpha(m.tone, 0.05 + 0.08 * full),
                  boxShadow: `0 0 ${Math.round(30 * full * filled)}px ${alpha(m.id === 'purple' ? C.cyan : m.tone, 0.22 * full)}`,
                  fontFamily: FONT.sans,
                  opacity: filled,
                  transform: `translateY(${(1 - filled) * 18}px)`,
                  ...dimStyle(dim),
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 76 }}>
                  <div style={{ flexShrink: 0, width: 68, height: 68, borderRadius: 18, display: 'grid', placeItems: 'center', border: `3px solid ${alpha(m.id === 'purple' ? C.cyan : m.tone, 0.7)}`, background: alpha(m.id === 'purple' ? C.cyan : m.tone, 0.1) }}>
                    <ModeGlyph mode={m} size={42} />
                  </div>
                  <div style={{ whiteSpace: 'nowrap' }}>
                    <div style={{ fontSize: 38, fontWeight: 900, letterSpacing: 0.5, color: C.textStrong, lineHeight: 1.1 }}>{m.term.toUpperCase()}</div>
                    {NICK[m.id] ? <div style={{ fontSize: 34, fontWeight: 800, color: m.id === 'purple' ? C.cyanSoft : m.tone, lineHeight: 1.15 }}>{NICK[m.id]}</div> : null}
                  </div>
                </div>
                <div style={{ marginTop: 14, fontSize: 30, fontWeight: 650, lineHeight: 1.24, color: C.text }}>
                  <Description id={m.id} />
                </div>
              </div>
            ) : null}
          </div>
        );
      })}

      {/* The port's proposal */}
      {frame >= proposalAt - 4 ? (
        <div style={{ position: 'absolute', left: 0, top: CHIP_TOP, width: W, display: 'flex', justifyContent: 'center', opacity: Math.min(1, chipIn * 1.4), transform: `translateY(${(1 - Math.min(1, chipIn)) * 14}px)` }}>
          <Pill text="primero purple; después, un red team sin avisar" icon="flag" tone={C.cyan} size={38} height={60} on={0.6} />
        </div>
      ) : null}
    </Stage>
  );
}
