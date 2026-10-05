import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, dimStyle, mix, windowWeight } from '../../../engine/src/ui';
import { COMPLEMENTS, FITS, LIMITS, WHAT_IF } from '../data/s09-limites';
import { Figure, KillChain, StreetHouse, killChainLayout, type PhaseId, type VignetteLook } from './parts/KillChain';
import { DiamondGlyph, MatrixGlyph } from './parts/s09-limites/ModelGlyphs';
import { Stage, wordFrame } from './kit';

const S = 's09-limites';
const W = STAGE.width;

// ---- The chain along the top, all scene long.
const CHAIN = killChainLayout(W);
/** «Taller, caja, puerta»: the steps an insider does not need. */
const GAPS: readonly PhaseId[] = ['weaponization', 'delivery', 'exploitation'];

// ---- Lower band: the house with the insider (left), the limits and the fit (right); then the two models.
const LOW_Y = CHAIN.height + 26;
const HOUSE = { x: 10, y: LOW_Y + 20, w: 340 };
const HK = HOUSE.w / 140;
/** The house's door (StreetHouse design units: door 78–104, ground 126). */
const DOOR = { x: HOUSE.x + 91 * HK, ground: HOUSE.y + 126 * HK };
const FIG_W = 66;
const FIG_H = (FIG_W * 104) / 60;
const CHIPS_X = 548;
const CHIP_H = 62;
const CHIP_GAP = 16;
const FITS_Y = LOW_Y + 3 * (CHIP_H + CHIP_GAP) + 26;
const CARD_W = (W - 28) / 2;
const CARD_H = STAGE.height - LOW_Y - 6;

/**
 * s09-limites «Cuando no hay caja». The chain hangs along the top («el modelo»). On `insider` the house comes back
 * below it, and with «¿y si…?» a faceless figure (amber: a hypothesis, not the thief) steps out of the door with
 * the plans under its arm — on «vive» — and a real key — on «llave». On `gaps` the workshop, the box and the door go
 * empty and the rings around them come off: a chain full of holes. On `limits` three chips land on their words
 * («insider con acceso legítimo · credenciales válidas · servicios en la nube (SaaS)»); on `fits` the holes close and
 * the chain lights, «encaja bien: intrusiones con malware y fases en fila». On `complements` the house and the chips
 * step out for two cards: ATT&CK «el cómo, técnica a técnica» (a small matrix) and Diamond Model «cada paso, un
 * diamante de cuatro esquinas» (a four-corner diamond, nothing in its vertices) — the last frame.
 */
export function S09Limites(props: SceneProps) {
  const frame = useCurrentFrame();
  const insiderAt = props.cue('insider');
  const gapsAt = props.cue('gaps');
  const limitsAt = props.cue('limits');
  const fitsAt = props.cue('fits');
  const complementsAt = props.cue('complements');

  // ---- The house and the insider.
  const houseIn = progress(frame, insiderAt - 4, 18);
  const figAt = Math.max(insiderAt + 8, wordFrame(S, 's09-01', 'vive') - 6);
  const keyAt = Math.max(figAt + 8, wordFrame(S, 's09-01', 'llave') - 4);
  const fig = progress(frame, figAt, 20, EASE.inOut);
  const keyIn = progress(frame, keyAt, 12);
  const whatIf = progress(frame, insiderAt + 2, 14);

  // ---- The chain: holes on `gaps`, closed again on `fits`.
  const holes = progress(frame, gapsAt - 2, 20, EASE.inOut) * (1 - progress(frame, fitsAt, 22, EASE.inOut));
  const fitLit = progress(frame, fitsAt + 4, 18);
  const chainDim = 0.45 * progress(frame, insiderAt, 16) * (1 - progress(frame, gapsAt - 6, 12)) + 0.3 * progress(frame, limitsAt, 16) * (1 - fitLit);
  const looks: Partial<Record<PhaseId, VignetteLook>> = {};
  for (const s of CHAIN.slots) {
    const gap = GAPS.includes(s.id);
    looks[s.id] = {
      empty: gap ? holes : 0,
      dim: chainDim,
      lit: 0.55 * fitLit,
      tone: fitLit > 0.02 ? C.cyan : undefined,
    };
  }
  const gi = GAPS.map((id) => CHAIN.slot(id)!.i);
  const lo = Math.min(...gi);
  const hi = Math.max(...gi);
  const links = CHAIN.slots.slice(0, -1).map((s) => (s.i >= lo - 1 && s.i <= hi ? 1 - holes : 1));

  // ---- Limits, fit, complements.
  const chipAt = LIMITS.map((l, i) => Math.max(limitsAt + i * 8, wordFrame(S, 's09-03', l.word) - 6));
  const fitsIn = progress(frame, fitsAt, 16);
  const swap = progress(frame, complementsAt - 10, 18, EASE.inOut);
  const cardAt = COMPLEMENTS.map((c, i) => Math.max(complementsAt + i * 10, wordFrame(S, 's09-05', c.word) - 6));

  return (
    <Stage>
      {/* The chain: centred while the voice names «el modelo», then up for the house */}
      <div style={{ position: 'absolute', left: 0, top: mix((STAGE.height - CHAIN.height) / 2, 0, progress(frame, insiderAt - 12, 22, EASE.inOut)) }}>
        <KillChain width={W} frame={frame} looks={looks} links={links} names={1} />
      </div>

      {/* The house and the insider («¿y si…?») */}
      {houseIn > 0 && swap < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: houseIn * (1 - swap), ...dimStyle(0.35 * progress(frame, limitsAt, 16)) }}>
          <div style={{ position: 'absolute', left: HOUSE.x, top: HOUSE.y }}>
            <StreetHouse width={HOUSE.w} plans={1 - fig} />
          </div>
          {fig > 0 ? (
            <div style={{ position: 'absolute', left: DOOR.x - FIG_W / 2 + 70 * fig, top: DOOR.ground - FIG_H + 2 }}>
              <Figure width={FIG_W} tone={C.amber} pose="walk" carry={fig} show={fig} />
            </div>
          ) : null}
          {keyIn > 0 ? (
            <div style={{ position: 'absolute', left: DOOR.x + 70 * fig + FIG_W / 2 + 6, top: DOOR.ground - FIG_H * 0.55, ...enter(frame, keyAt, { distance: 10 }) }}>
              <Icon name="key" size={44} color={C.amber} strokeWidth={2.2} />
            </div>
          ) : null}
          <div
            style={{
              position: 'absolute',
              left: HOUSE.x + HOUSE.w - 8,
              top: HOUSE.y + 120,
              display: 'inline-flex',
              alignItems: 'center',
              height: 50,
              padding: '0 20px',
              borderRadius: RADIUS.pill,
              border: `2px dashed ${alpha(C.amber, 0.7)}`,
              background: alpha(C.amber, 0.1),
              fontFamily: FONT.sans,
              fontSize: 34,
              fontWeight: 800,
              color: '#fcd34d',
              whiteSpace: 'nowrap',
              opacity: whatIf,
              transform: `translateY(${(1 - whatIf) * 10}px)`,
            }}
          >
            {WHAT_IF}
          </div>
        </div>
      ) : null}

      {/* Limits: three chips on their words */}
      {frame >= chipAt[0] - 2 && swap < 1 ? (
        <div style={{ position: 'absolute', left: CHIPS_X, top: LOW_Y, opacity: 1 - swap }}>
          {LIMITS.map((l, i) => {
            const lit = windowWeight(frame, chipAt[i], chipAt[i + 1] ?? fitsAt, { ramp: 10, lead: 0 });
            return (
              <div
                key={l.text}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: i * (CHIP_H + CHIP_GAP),
                  ...enter(frame, chipAt[i], { distance: 18, axis: 'x' }),
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 14,
                  height: CHIP_H,
                  padding: '0 28px 0 20px',
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.pill,
                  border: `2px solid ${alpha(C.amber, 0.4 + 0.45 * lit)}`,
                  background: alpha(C.amber, 0.06 + 0.1 * lit),
                  boxShadow: lit > 0.02 ? `0 0 ${Math.round(22 * lit)}px ${alpha(C.amber, 0.25 * lit)}` : undefined,
                  fontFamily: FONT.sans,
                  fontSize: 36,
                  fontWeight: 750,
                  color: C.textStrong,
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon name={l.icon} size={36} color={C.amber} />
                {l.text}
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Where it fits */}
      {fitsIn > 0 && swap < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: CHIPS_X,
            top: FITS_Y,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
            fontFamily: FONT.sans,
            fontSize: 40,
            fontWeight: 800,
            color: '#6ee7b7',
            whiteSpace: 'nowrap',
            ...enter(frame, fitsAt, { distance: 14 }),
            opacity: fitsIn * (1 - swap),
          }}
        >
          <Icon name="check" size={40} color={C.emerald} strokeWidth={2.4} />
          {FITS}
        </div>
      ) : null}

      {/* Two models that complete it */}
      {frame >= cardAt[0] - 4 ? (
        <div style={{ position: 'absolute', left: 0, top: LOW_Y }}>
          {COMPLEMENTS.map((c, i) => {
            const e = enter(frame, cardAt[i], { distance: 22 });
            const draw = progress(frame, cardAt[i] + 4, 26, EASE.inOut);
            const tint = i === 0 ? C.sky : C.violet;
            const soft = i === 0 ? '#7dd3fc' : '#c4b5fd';
            return (
              <div
                key={c.name}
                style={{
                  position: 'absolute',
                  left: i * (CARD_W + 28),
                  top: 0,
                  width: CARD_W,
                  height: CARD_H,
                  boxSizing: 'border-box',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 34,
                  padding: '0 34px',
                  borderRadius: RADIUS.lg,
                  border: `2px solid ${alpha(tint, 0.6)}`,
                  background: `linear-gradient(180deg, ${alpha(tint, 0.1)} 0%, ${alpha(C.ink900, 0.95)} 65%)`,
                  boxShadow: `0 0 34px ${alpha(tint, 0.16)}`,
                  fontFamily: FONT.sans,
                  ...e,
                }}
              >
                <div style={{ flexShrink: 0, width: 210, display: 'flex', justifyContent: 'center' }}>
                  {i === 0 ? <MatrixGlyph width={200} height={150} draw={draw} color={tint} /> : <DiamondGlyph size={160} draw={draw} color={tint} />}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 56, fontWeight: 850, letterSpacing: -1, color: soft, whiteSpace: 'nowrap', lineHeight: 1.05 }}>{c.name}</div>
                  <div style={{ marginTop: 12, fontSize: 34, fontWeight: 700, color: C.text, lineHeight: 1.2 }}>{c.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </Stage>
  );
}
