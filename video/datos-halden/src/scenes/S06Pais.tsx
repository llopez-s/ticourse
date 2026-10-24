import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { enter, progress } from '../../../engine/src/theme/motion';
import { EuropeMap, MAP } from './parts/EuropeMap';
import { Caption, ImageTag, Pill, TermPill } from './parts/Labels';
import { StorageRoom } from './parts/StorageRoom';
import { Stage, wordFrame } from './kit';

const S = 's06-pais';
const MAP_W = 760;
const MAP_TOP = 96;
const MAP_H = (MAP_W * MAP.h) / MAP.w;
const COL_X = 820;
const STEP_TOP = 92;
const STEP_H = 154;
const FOOT_TOP = 572;

const STEPS = [
  { label: 'Mirar', term: 'GEOLOCATION', word: 'geolocation', seg: 's06-02', gloss: 'en qué región viviría cada almacenamiento y desde qué países se entraría', tone: C.sky },
  { label: 'La ley que manda', term: 'DATA SOVEREIGNTY', word: 'sovereignty', seg: 's06-03', gloss: 'la del país donde reside el dato, no la de la sede', tone: C.violet },
  { label: 'Atarlo', term: 'GEOGRAPHIC RESTRICTIONS', word: 'geographic', seg: 's06-04', gloss: 'solo en una región de la UE · nadie entra desde fuera · geofencing', tone: C.emerald },
] as const;

/**
 * s06-pais «En qué país vive». On `suppose` «Imagina que el sistema se alojara en la nube» with «supuesto · sin efectos»
 * (no provider, no logo). On `map` the dot map of Europe with three storage points and three numbered steps on the
 * right. «Mirar» on `look`: two logins reach the centre point (from inside and from outside) → GEOLOCATION on its word.
 * «La ley que manda» on `law`: violet rings around the point where it lives, «la del país donde reside el dato, no la
 * de la sede» → DATA SOVEREIGNTY. «Atarlo» on `tie`: the emerald «región UE», the other points dim and the outside login
 * is crossed → GEOGRAPHIC RESTRICTIONS. On `order` «primero se mira, después se limita» under the steps; on `storage`
 * the map steps back and the storage room beyond the border takes its place, labelled «imagen · no es del puerto».
 */
export function S06Pais(props: SceneProps) {
  const frame = useCurrentFrame();
  const supposeAt = props.cue('suppose');
  const mapAt = props.cue('map');
  const lookAt = props.cue('look');
  const lawAt = props.cue('law');
  const tieAt = props.cue('tie');
  const orderAt = props.cue('order');
  const storageAt = props.cue('storage');
  const imaginaAt = Math.max(supposeAt + 6, wordFrame(S, 's06-01', 'Imagina') - 6);
  const stepAt = [lookAt, lawAt, tieAt];
  const termAt = STEPS.map((s, i) => Math.max(stepAt[i] + 8, wordFrame(S, s.seg, s.word) - 4));
  const nextAt = [lawAt, tieAt, orderAt];
  const normasAt = Math.max(storageAt + 10, wordFrame(S, 's06-06', 'normas') - 8);

  const topIn = enter(frame, Math.min(imaginaAt, supposeAt + 20) - 4, { distance: 14 });
  const mapIn = enter(frame, Math.min(mapAt, imaginaAt + 30) - 4, { distance: 20 });
  const store = progress(frame, storageAt - 4, 16);
  const orderIn = enter(frame, orderAt - 2, { distance: 14 });

  return (
    <Stage>
      {/* The supposition */}
      <div style={{ position: 'absolute', left: 0, top: 0, display: 'flex', alignItems: 'center', gap: 18, ...topIn }}>
        <Pill text="Imagina que el sistema se alojara en la nube" tone={C.sky} icon="cloud" size={36} height={60} />
        <div style={{ padding: '6px 18px', borderRadius: 999, border: `2px dashed ${alpha(C.muted, 0.6)}`, fontFamily: FONT.sans, fontSize: 28, fontWeight: 700, color: C.muted, whiteSpace: 'nowrap' }}>
          supuesto · sin efectos
        </div>
      </div>

      {/* The map, then the storage room in its place */}
      <div style={{ position: 'absolute', left: 0, top: MAP_TOP, opacity: mapIn.opacity * (1 - 0.82 * store), transform: mapIn.transform }}>
        <EuropeMap
          width={MAP_W}
          dots={progress(frame, mapAt, 16)}
          look={progress(frame, lookAt + 4, 24)}
          law={progress(frame, lawAt + 4, 16)}
          tie={progress(frame, tieAt + 4, 20)}
          t={frame}
        />
      </div>
      {store > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: MAP_TOP + 10, width: MAP_W, height: MAP_H, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: store, transform: `translateY(${(1 - store) * 16}px)` }}>
          <StorageRoom width={420} rules={progress(frame, normasAt, 14)} />
          <div style={{ marginTop: 16, display: 'flex', gap: 28 }}>
            <Caption size={34} color={C.cyanSoft}>lo que guardas es tuyo</Caption>
            <Caption size={34} color={C.amber} style={{ opacity: 0.3 + 0.7 * progress(frame, normasAt, 12) }}>
              allí mandan sus normas
            </Caption>
          </div>
          <div style={{ marginTop: 14 }}>
            <ImageTag size={26} />
          </div>
        </div>
      ) : null}

      {/* The three steps */}
      {STEPS.map((s, i) => {
        if (frame < Math.min(mapAt, stepAt[i]) - 4) return null;
        const shown = progress(frame, mapAt + i * 6, 14);
        const lit = progress(frame, stepAt[i] - 4, 12);
        const hot = lit * (1 - 0.45 * progress(frame, nextAt[i] - 6, 12));
        const term = progress(frame, termAt[i], 12);
        return (
          <div key={s.term} style={{ position: 'absolute', left: COL_X, top: STEP_TOP + i * STEP_H, width: 1728 - COL_X, opacity: shown * (0.4 + 0.6 * Math.max(hot, 0.0)) + (1 - shown) * 0, fontFamily: FONT.sans }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, whiteSpace: 'nowrap' }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  display: 'grid',
                  placeItems: 'center',
                  background: hot > 0.5 ? s.tone : alpha(s.tone, 0.15),
                  border: `2px solid ${alpha(s.tone, 0.8)}`,
                  fontSize: 30,
                  fontWeight: 850,
                  color: hot > 0.5 ? C.ink950 : s.tone,
                }}
              >
                {i + 1}
              </div>
              <span style={{ fontSize: 42, fontWeight: 850, color: C.textStrong, letterSpacing: -1 }}>{s.label}</span>
              <div style={{ opacity: term, transform: `translateX(${(1 - term) * 12}px)` }}>
                <TermPill text={s.term} size={32} on={hot} />
              </div>
            </div>
            <div style={{ marginTop: 8, marginLeft: 68, fontSize: 30, fontWeight: 700, lineHeight: 1.2, color: C.text, opacity: lit }}>{s.gloss}</div>
          </div>
        );
      })}

      {frame >= orderAt - 4 ? (
        <div style={{ position: 'absolute', left: COL_X, top: FOOT_TOP, ...orderIn }}>
          <Pill
            text={
              <span>
                primero <span style={{ color: C.sky }}>se mira</span>, después <span style={{ color: C.emerald }}>se limita</span>
              </span>
            }
            tone={C.cyan}
            size={38}
            height={64}
          />
        </div>
      ) : null}
    </Stage>
  );
}
