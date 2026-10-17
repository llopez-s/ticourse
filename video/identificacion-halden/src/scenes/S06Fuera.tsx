import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { INSIDE_LABEL, OUTSIDE_LABEL, SOURCES, STALL_SIGN } from '../data/s06-fuera';
import { TermChip } from './parts/Bits';
import { SIL_RATIO, SILHOUETTES, Silhouette } from './parts/Silhouettes';
import { ImageTag } from './parts/Tags';
import { TIENDA_TONE, TiendaTile } from './parts/Tienda';
import { Stage, wordFrame } from './kit';

const S = 's06-fuera';
const W = STAGE.width;

// ---- Phase A: s01's row of silhouettes.
const SIL_W = 300;
const SIL_GAP = 110;
const ROW_W = 3 * SIL_W + 2 * SIL_GAP;
const ROW_X = Math.round((W - ROW_W) / 2);
const ROW_Y = 40;
const ROW_H = SIL_W * SIL_RATIO;

// ---- Phase B: four source cards in a row.
const CARD_GAP = 24;
const CARD_Y = 52;
const CARD_H = 600;
const TILE_W = 320;
const TILE_H = TILE_W * 0.75;
const cardX = (i: number) => SOURCES.slice(0, i).reduce((s, c) => s + c.width + CARD_GAP, 0);

/**
 * s06-fuera «Lo que pasa fuera». Phase A: s01's three silhouettes come back; on `door` the server and the application
 * step back under «dentro de casa» and the door onto the street lights, «fuera». Phase B (`osint`): four sources in a
 * row, each with its vignette of la tienda de la calle (one label «imagen · no es del puerto» for the row): the
 * newspaper — «OSINT · publicado · gratis · hay que cribar» (title on its word); the paid alert service — «fuentes de
 * pago · proprietary · alguien criba por ti»; the street's shops that warn each other — «ISAC · el sector se lo cuenta ·
 * no se publica», title on «ISAC», and small «para un puerto, el ISAC marítimo»; the mercadillo — «dark web monitoring ·
 * lo tuyo a la venta» with «tus credenciales · tus datos · tu nombre como objetivo» lit on the voice's words, and on
 * `keys` a sign on the stall, «tus credenciales · tus datos · tu nombre». The card the voice is on leads; the others
 * step back. No keys anywhere.
 */
export function S06Fuera(props: SceneProps) {
  const frame = useCurrentFrame();
  const doorAt = props.cue('door');
  const insideAt = wordFrame(S, 's06-01', 'dentro') - 6;
  const outsideAt = wordFrame(S, 's06-01', 'fuera') - 6;
  const cardAt = SOURCES.map((s) => props.cue(s.cue));
  const titleAt = SOURCES.map((s, i) => (s.titleSeg && s.titleWord ? wordFrame(S, s.titleSeg, s.titleWord) - 6 : cardAt[i]));
  const keysAt = props.cue('keys');
  const darkLineAt = [cardAt[3], wordFrame(S, 's06-06', 'credenciales') - 6, wordFrame(S, 's06-06', 'datos') - 6, wordFrame(S, 's06-06', 'datos') + 14];

  const aOut = progress(frame, cardAt[0] - 12, 18, EASE.inOut);
  const rowIn = progress(frame, -6, 16);
  const doorOn = progress(frame, doorAt + 4, 16);

  const focusOf = (i: number) => {
    const on = progress(frame, cardAt[i] - 6, 14);
    const next = cardAt[i + 1];
    const past = next !== undefined ? progress(frame, next - 6, 14, EASE.inOut) : 0;
    return on * (1 - past);
  };

  return (
    <Stage>
      {aOut < 0.999 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: rowIn * (1 - aOut) }}>
          {SILHOUETTES.map((kind, k) => {
            const isDoor = kind === 'door';
            return (
              <div key={kind} style={{ position: 'absolute', left: ROW_X + k * (SIL_W + SIL_GAP), top: ROW_Y }}>
                <Silhouette kind={kind} width={SIL_W} lit={isDoor ? doorOn : 0} dim={isDoor ? 0 : doorOn * 0.8} tone={isDoor ? C.amber : C.cyan} id={`s06-${k}`} />
              </div>
            );
          })}
          {/* a bracket under the two that look inside, and the label under the door */}
          <svg width={W} height={80} style={{ position: 'absolute', left: 0, top: ROW_Y + ROW_H + 8, opacity: progress(frame, insideAt, 14) }}>
            <path d={`M ${ROW_X + 30} 4 L ${ROW_X + 30} 22 L ${ROW_X + 2 * SIL_W + SIL_GAP - 30} 22 L ${ROW_X + 2 * SIL_W + SIL_GAP - 30} 4`} fill="none" stroke={alpha(C.cyan, 0.6)} strokeWidth={4} />
          </svg>
          <div
            style={{
              position: 'absolute',
              left: ROW_X,
              width: 2 * SIL_W + SIL_GAP,
              top: ROW_Y + ROW_H + 40,
              textAlign: 'center',
              fontFamily: FONT.sans,
              fontSize: 40,
              fontWeight: 800,
              color: C.cyanSoft,
              opacity: 0.7 * progress(frame, insideAt, 14),
            }}
          >
            {INSIDE_LABEL}
          </div>
          <div
            style={{
              position: 'absolute',
              left: ROW_X + 2 * (SIL_W + SIL_GAP),
              width: SIL_W,
              top: ROW_Y + ROW_H + 40,
              textAlign: 'center',
              fontFamily: FONT.sans,
              fontSize: 48,
              fontWeight: 900,
              color: C.amber,
              ...enter(frame, outsideAt, { distance: 12 }),
            }}
          >
            {OUTSIDE_LABEL}
          </div>
        </div>
      ) : null}

      {aOut > 0.001 ? (
        <>
          <div style={{ position: 'absolute', right: 0, top: 0, ...enter(frame, cardAt[0] + 6, { distance: 10 }) }}>
            <ImageTag size={24} />
          </div>
          {SOURCES.map((s, i) => {
            if (frame < cardAt[i] - 8) return null;
            const e = enter(frame, cardAt[i] - 4, { distance: 20 });
            const f = focusOf(i);
            const started = progress(frame, cardAt[i] - 4, 14);
            const dim = started * (1 - f) * 0.55;
            const tone = TIENDA_TONE[s.kind];
            const tIn = progress(frame, titleAt[i], 12);
            return (
              <div
                key={s.kind}
                style={{
                  position: 'absolute',
                  left: cardX(i),
                  top: CARD_Y,
                  width: s.width,
                  height: CARD_H,
                  boxSizing: 'border-box',
                  padding: '18px 20px',
                  borderRadius: RADIUS.lg,
                  border: `3px solid ${alpha(tone, 0.25 + 0.55 * f)}`,
                  background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
                  boxShadow: f > 0.05 ? `0 0 ${Math.round(30 * f)}px ${alpha(tone, 0.18)}` : undefined,
                  fontFamily: FONT.sans,
                  opacity: e.opacity,
                  transform: e.transform,
                  filter: dim > 0.01 ? `saturate(${1 - 0.5 * dim}) brightness(${1 - 0.5 * dim})` : undefined,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <TiendaTile kind={s.kind} width={TILE_W} glow={f} />
                </div>
                {/* the stall's sign, on `keys` */}
                {s.kind === 'mercadillo' && frame >= keysAt - 2 ? (
                  <div style={{ position: 'absolute', left: 0, width: s.width, top: 18 + TILE_H - 92, display: 'flex', justifyContent: 'center', ...enter(frame, keysAt, { distance: 12 }) }}>
                    <div
                      style={{
                        padding: '8px 22px',
                        borderRadius: 8,
                        background: '#f8fafc',
                        border: `3px solid ${C.rose}`,
                        boxShadow: `0 8px 20px ${alpha('#000000', 0.45)}`,
                        transform: 'rotate(-2deg)',
                        textAlign: 'center',
                        fontSize: 32,
                        fontWeight: 850,
                        lineHeight: 1.15,
                        color: '#111827',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {STALL_SIGN.map((l) => (
                        <div key={l}>{l}</div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div style={{ marginTop: 18, height: 50, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ fontSize: 40, fontWeight: 900, color: C.textStrong, whiteSpace: 'nowrap', opacity: tIn, transform: `translateY(${(1 - tIn) * 10}px)` }}>{s.title}</div>
                </div>
                {s.term ? (
                  <div style={{ marginTop: 10, ...enter(frame, cardAt[i] + 10, { distance: 10 }) }}>
                    <TermChip text={s.term} size={30} on={f} />
                  </div>
                ) : null}
                <div style={{ marginTop: 12 }}>
                  {s.lines.map((l, k) => {
                    const at = s.kind === 'mercadillo' ? darkLineAt[k] : cardAt[i] + 10 + k * 12 + (s.term ? 8 : 0);
                    const first = s.kind === 'mercadillo' && k === 0;
                    return (
                      <div
                        key={l}
                        style={{
                          marginTop: k === 0 ? 0 : 6,
                          fontSize: first ? 36 : 32,
                          fontWeight: first ? 850 : 750,
                          color: first ? C.roseSoft : C.text,
                          whiteSpace: 'nowrap',
                          ...enter(frame, at, { distance: 10 }),
                        }}
                      >
                        {l}
                      </div>
                    );
                  })}
                </div>
                {s.small ? (
                  <div style={{ position: 'absolute', left: 20, right: 20, bottom: 22, fontSize: 26, fontWeight: 650, lineHeight: 1.25, color: C.muted, ...enter(frame, titleAt[i] + 10, { distance: 8 }) }}>{s.small}</div>
                ) : null}
              </div>
            );
          })}
        </>
      ) : null}
    </Stage>
  );
}
