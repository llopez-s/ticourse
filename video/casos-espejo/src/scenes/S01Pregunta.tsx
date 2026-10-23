import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { Card, Disc, Pop } from './parts/bits';
import { Stage, wordFrame } from './kit';

const S = 's01-pregunta';
const W = STAGE.width;

const WHERE = ['Meridian Dynamics', 'aeroespacial', 'tú, su analista de inteligencia'] as const;
const CISO_ROLE = 'CISO · responsable de seguridad';
const CISO_Q = '¿Esto ya ha pasado antes?';
const TITLE = { lead: 'Casos', rest: 'históricos', sub: 'cinco casos, cinco lecciones' } as const;
const PROMISE = [
  { text: 'qué enseñó cada caso', word: 'enseñó' },
  { text: 'dónde encaja en tu trabajo', word: 'dónde' },
  { text: 'sin memorizar fechas', word: 'fechas' },
] as const;
const MIRRORS = ['persiste', 'se acumula', ['lo dice un', 'gobierno'], ['dos en', 'una red'], 'el proveedor'] as const;

/**
 * s01-pregunta «Una pregunta del CISO». The context strip «Meridian Dynamics · aeroespacial · tú, su
 * analista de inteligencia» is there from the first frame (no date, no hour). On `ciso` the CISO's card
 * lands in the middle of the stage: «CISO · responsable de seguridad» and his question, big. Before 10 s,
 * as `title` is said, «Casos históricos» takes the top with «cinco casos, cinco lecciones» and the card
 * steps down into a slim bar. On `promise` three chips light one per phrase (what each case taught ·
 * where it fits your work · no dates). On `mirrors` five EMPTY cards come in a row, each with only its
 * keyword (persiste, se acumula, lo dice un gobierno, dos en una red, el proveedor): no data yet, the
 * first one lights on «Empezamos».
 */
export function S01Pregunta(props: SceneProps) {
  const frame = useCurrentFrame();
  const ciso = props.cue('ciso');
  const titleCue = props.cue('title');
  const promise = props.cue('promise');
  const mirrors = props.cue('mirrors');

  const titleAt = Math.min(titleCue - 6, 9.2 * 30);
  const stripIn = progress(frame, 0, 16);
  const youLit = progress(frame, Math.max(titleAt, wordFrame(S, 's01-02', 'cada') - 4), 14);
  const cisoAt = Math.max(4, ciso);
  const cisoIn = progress(frame, cisoAt, 18);
  const down = progress(frame, titleAt - 8, 22, EASE.inOut);
  const titleIn = enter(frame, titleAt, { distance: 24, duration: 18 });
  const subIn = enter(frame, titleAt + 8, { distance: 14, duration: 16 });
  const chipAt = PROMISE.map((p, i) => Math.max(promise - 4 + i, wordFrame(S, 's01-03', p.word) - 6));
  const first = wordFrame(S, 's01-04', 'Empezamos') - 4;
  const lit = progress(frame, first, 14);

  return (
    <Stage>
      {/* Who and where */}
      <div style={{ position: 'absolute', left: 0, top: 8, width: W, display: 'flex', justifyContent: 'center', opacity: stripIn }}>
        <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: 16, height: 58, boxSizing: 'border-box', padding: '8px 30px 0', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.cyan, 0.4)}`, background: alpha(C.cyan, 0.06), fontFamily: FONT.sans, fontSize: 34, whiteSpace: 'nowrap' }}>
          <span style={{ fontWeight: 850, color: C.textStrong }}>{WHERE[0]}</span>
          <span style={{ color: C.faint }}>·</span>
          <span style={{ fontWeight: 700, color: C.text }}>{WHERE[1]}</span>
          <span style={{ color: C.faint }}>·</span>
          <span style={{ fontWeight: 800, color: youLit > 0.5 ? C.cyanSoft : C.text, opacity: 0.65 + 0.35 * youLit }}>{WHERE[2]}</span>
        </div>
      </div>

      {/* The CISO's card: big in the middle, then a slim bar under the title */}
      {down < 1 ? (
        <div style={{ position: 'absolute', left: (W - 1300) / 2, top: mix(210, 270, down), width: 1300, height: 330, transformOrigin: '50% 0', transform: `translateY(${(1 - cisoIn) * 26}px) scale(${mix(1, 0.5, down)})`, opacity: cisoIn * (1 - down) }}>
          <Card tone="cyan" pad={0} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 26, padding: '0 56px', background: `linear-gradient(180deg, ${alpha(C.cyan, 0.12)} 0%, ${alpha(C.ink900, 0.96)} 55%)` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
              <Disc icon="user" size={96} />
              <span style={{ fontSize: 40, fontWeight: 850, letterSpacing: 4, color: C.cyanSoft }}>{CISO_ROLE}</span>
            </div>
            <span style={{ fontSize: 76, fontWeight: 900, color: C.textStrong, letterSpacing: -1.5, lineHeight: 1, whiteSpace: 'nowrap' }}>{CISO_Q}</span>
          </Card>
        </div>
      ) : null}
      {down > 0 ? (
        <div style={{ position: 'absolute', left: (W - 1340) / 2, top: 278, width: 1340, height: 78, opacity: down }}>
          <Card tone="cyan" pad={0} radius={RADIUS.pill} style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '0 22px' }}>
            <Disc icon="user" size={52} />
            <span style={{ fontSize: 30, fontWeight: 800, letterSpacing: 2, color: C.cyanSoft, whiteSpace: 'nowrap' }}>{CISO_ROLE}</span>
            <span style={{ fontSize: 46, fontWeight: 900, color: C.textStrong, letterSpacing: -0.8, whiteSpace: 'nowrap' }}>{CISO_Q}</span>
          </Card>
        </div>
      ) : null}

      {/* Title */}
      {frame >= titleAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: 80, width: W, textAlign: 'center', fontFamily: FONT.sans }}>
          <div style={{ fontSize: 108, lineHeight: 1, fontWeight: 900, letterSpacing: -2.5, color: C.textStrong, whiteSpace: 'nowrap', ...titleIn }}>
            <span style={{ color: C.cyan }}>{TITLE.lead}</span> {TITLE.rest}
          </div>
          <div style={{ marginTop: 10, fontSize: 46, fontWeight: 750, color: C.cyanSoft, ...subIn }}>{TITLE.sub}</div>
        </div>
      ) : null}

      {/* Promise */}
      <div style={{ position: 'absolute', left: 0, top: 376, width: W, display: 'flex', justifyContent: 'center', gap: 22, fontFamily: FONT.sans }}>
        {PROMISE.map((c, i) => {
          const e = enter(frame, chipAt[i], { distance: 16 });
          const on = progress(frame, chipAt[i], 10) * (1 - 0.5 * progress(frame, (chipAt[i + 1] ?? mirrors) - 2, 12, EASE.inOut));
          return (
            <div key={c.text} style={{ display: 'inline-flex', alignItems: 'center', gap: 14, height: 68, boxSizing: 'border-box', padding: '0 28px 0 20px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.cyan, 0.4 + 0.5 * on)}`, background: alpha(C.cyan, 0.06 + 0.12 * on), boxShadow: on > 0.02 ? `0 0 ${Math.round(22 * on)}px ${alpha(C.cyan, 0.3 * on)}` : undefined, fontSize: 34, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap', ...e }}>
              <span style={{ width: 36, height: 36, borderRadius: 18, display: 'grid', placeItems: 'center', background: alpha(C.cyan, 0.2), border: `2px solid ${alpha(C.cyan, 0.7)}`, fontSize: 22, fontWeight: 900, color: C.cyanSoft }}>{i + 1}</span>
              {c.text}
            </div>
          );
        })}
      </div>

      {/* Five empty cards: a keyword each, no data */}
      {MIRRORS.map((m, i) => {
        const cw = (W - 4 * 24) / 5;
        const at = mirrors + i * 7;
        const mine = i === 0 ? lit : 0;
        return (
          <Pop key={i} at={at} frame={frame} x={i * (cw + 24)} y={470} w={cw} h={186} dim={i === 0 ? 0 : 0.45 * lit}>
            <Card tone="cyan" dashed glow={mine} pad={0} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.muted, fontSize: 26, fontWeight: 800, letterSpacing: 3 }}>
                <Icon name="archive" size={30} color={C.muted} strokeWidth={2} />
                CASO {i + 1}
              </div>
              <div style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.08, textAlign: 'center', color: C.textStrong }}>
                {typeof m === 'string' ? m : (
                  <>
                    {m[0]}
                    <br />
                    {m[1]}
                  </>
                )}
              </div>
            </Card>
          </Pop>
        );
      })}
    </Stage>
  );
}
