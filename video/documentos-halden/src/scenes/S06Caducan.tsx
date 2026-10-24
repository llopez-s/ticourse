import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { DOC_NAMES, DOC_ORDER } from '../data/canon';
import { ImageTag, Pill, TermPill } from './parts/Labels';
import { Bars, PAPER, Sheet } from './parts/Paper';
import { OLDSIGN, OldSign } from './parts/Pool';
import { Stage, wordFrame } from './kit';

const S = 's06-caducan';

const SW = 372;
const SH = 372;
const GAP = 36;
const ROW_X = (1728 - (4 * SW + 3 * GAP)) / 2;
/** The row sits lower while it is alone and moves up when the band under it fills. */
const ROW_TOP_ALONE = 96;
const ROW_TOP = 8;
const sheetX = (i: number) => ROW_X + i * (SW + GAP);

const TILE = { x: 470, y: 486, w: 800, h: 128 } as const;
const OLD = { x: 1190, y: 416 } as const;

/** A product badge on the platform tile: a hexagon (the old product) or a rounded square (the new one). */
function Product({ kind, tone, on = 1 }: { kind: 'old' | 'new'; tone: string; on?: number }) {
  return (
    <svg width={76} height={76} viewBox="0 0 76 76" style={{ opacity: on }}>
      {kind === 'old' ? (
        <>
          <polygon points="38,4 68,21 68,55 38,72 8,55 8,21" fill={alpha(tone, 0.14)} stroke={tone} strokeWidth={4} strokeLinejoin="round" />
          {[28, 38, 48].map((y) => (
            <rect key={y} x={24} y={y - 2} width={28} height={4} rx={2} fill={tone} />
          ))}
        </>
      ) : (
        <>
          <rect x={8} y={8} width={60} height={60} rx={16} fill={alpha(tone, 0.14)} stroke={tone} strokeWidth={4} />
          <circle cx={38} cy={38} r={13} fill="none" stroke={tone} strokeWidth={4} />
        </>
      )}
    </svg>
  );
}

/**
 * s06-caducan «Papeles que caducan». The four papers in a row, each now with its real name. On `owners` each gets
 * «dueño: una persona» (a rule of every paper, not a fact of the port), on `cycle` «revisión: cada año» and «y si cambia
 * la ley o el servicio». On `platform-change` the exchange platform's tile appears under them with a SUPPOSED new
 * product replacing the old one (a condition, nothing has happened); on `standard-only` only the standard lights
 * («se reescribe») and the policy stays («igual · porque no nombra tecnología»). The tile makes way for MONITORING AND
 * REVISION and its chip on `monitoring`; on `old-sign` the yellowed sign of the small pool hangs on the right,
 * «imagen · no es del puerto», next to «ya no existe». The exam card enters at the end of the `cycle` sentence.
 */
export function S06Caducan(props: SceneProps) {
  const frame = useCurrentFrame();
  const ownersAt = props.cue('owners');
  const cycleAt = props.cue('cycle');
  const platformAt = props.cue('platform-change');
  const onlyAt = props.cue('standard-only');
  const monitorAt = props.cue('monitoring');
  const oldAt = props.cue('old-sign');

  const personAt = Math.max(ownersAt + 14, wordFrame(S, 's06-01', 'persona') - 6);
  const yearAt = Math.max(cycleAt + 8, wordFrame(S, 's06-02', 'año') - 6);
  const lawAt = Math.max(yearAt + 24, wordFrame(S, 's06-02', 'ley') - 6);
  const otroAt = Math.max(platformAt + 24, wordFrame(S, 's06-03', 'otro') - 6);
  const monTermAt = Math.max(onlyAt + 90, wordFrame(S, 's06-04', 'monitoring') - 8);

  // phases
  const tileIn = progress(frame, platformAt - 4, 16);
  const tileOut = progress(frame, monTermAt - 10, 12, EASE.inOut);
  const swap = progress(frame, otroAt, 14);
  const std = progress(frame, onlyAt, 14);
  const pol = progress(frame, Math.max(onlyAt + 20, wordFrame(S, 's06-03', 'policy') - 4), 14);
  const monTerm = progress(frame, monTermAt, 12);
  const monChip = progress(frame, monitorAt, 14);
  const monDim = 1 - 0.5 * progress(frame, oldAt, 14);
  const signIn = progress(frame, oldAt, 18);
  const dueAt = ownersAt;
  const rowTop = mix(ROW_TOP_ALONE, ROW_TOP, progress(frame, platformAt - 40, 26, EASE.inOut));

  return (
    <Stage>
      {DOC_ORDER.map((kind, i) => {
        const p = progress(frame, -4 + i * 5, 18);
        const owner = progress(frame, dueAt + i * 8, 12);
        const person = progress(frame, personAt, 14);
        const year = progress(frame, yearAt + i * 6, 12);
        const law = progress(frame, lawAt + i * 6, 12);
        const isStd = kind === 'standard';
        const isPol = kind === 'policy';
        const glow = isStd ? 0.7 * std : 0;
        const rest = std > 0.01 && !isStd && !isPol ? 0.45 * std : 0;
        return (
          <div key={kind} style={{ position: 'absolute', left: sheetX(i), top: rowTop, opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
            <Sheet width={SW} height={SH} heading={DOC_NAMES[kind]} headTone={isPol && pol > 0.3 ? 'right' : isStd && std > 0.3 ? 'wrong' : 'plain'} glow={glow} glowTone={C.amber} dim={rest} tilt={0}>
              <Bars set={i} count={3} gap={14} height={12} />
              <div style={{ marginTop: 22, height: 3, background: PAPER.edge, borderRadius: 2 }} />
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6, fontFamily: FONT.sans, fontSize: 27, fontWeight: 750, color: PAPER.ink }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 36, opacity: owner, whiteSpace: 'nowrap' }}>
                  <Icon name="user" size={30} color="#0e7490" strokeWidth={2.2} />
                  <span>
                    dueño: <span style={{ color: '#0e5a70', fontWeight: 850, textDecoration: person > 0.5 ? 'underline' : 'none', textDecorationThickness: 3 }}>una persona</span>
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: 36, opacity: year, whiteSpace: 'nowrap' }}>
                  <Icon name="clock" size={30} color="#0e7490" strokeWidth={2.2} />
                  <span>revisión: cada año</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, opacity: law, whiteSpace: 'nowrap', lineHeight: 1.2 }}>
                  <Icon name="bell" size={30} color="#b45309" strokeWidth={2.2} style={{ marginTop: 2 }} />
                  <span>
                    <div>y si cambia la ley</div>
                    <div>o el servicio</div>
                  </span>
                </div>
              </div>
            </Sheet>
          </div>
        );
      })}

      {/* the platform, a supposition */}
      {tileIn * (1 - tileOut) > 0.01 ? (
        <>
          <div style={{ position: 'absolute', left: sheetX(1) + SW / 2 - 150, top: 392, width: 300, display: 'flex', justifyContent: 'center', opacity: std * (1 - tileOut) }}>
            <Pill text="se reescribe" tone={C.amber} size={32} height={50} on={std} icon="gear" />
          </div>
          {std > 0.01 ? (
            <svg width={4} height={48} style={{ position: 'absolute', left: sheetX(1) + SW / 2 - 2, top: 444, opacity: std * (1 - tileOut) }}>
              <line x1={2} y1={0} x2={2} y2={48} stroke={C.amber} strokeWidth={4} strokeDasharray="4 8" />
            </svg>
          ) : null}
          <div
            style={{
              position: 'absolute',
              left: TILE.x,
              top: TILE.y,
              width: TILE.w,
              height: TILE.h,
              boxSizing: 'border-box',
              borderRadius: RADIUS.lg,
              border: `3px dashed ${alpha(C.sky, 0.8)}`,
              background: `linear-gradient(180deg, ${alpha(C.sky, 0.08)} 0%, ${C.ink900} 80%)`,
              display: 'flex',
              alignItems: 'center',
              gap: 22,
              padding: '0 30px',
              fontFamily: FONT.sans,
              opacity: tileIn * (1 - tileOut),
              transform: `translateY(${(1 - tileIn) * 20}px)`,
            }}
          >
            <Icon name="layers" size={58} color={C.sky} strokeWidth={2} />
            <div style={{ fontSize: 36, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap', lineHeight: 1.15 }}>
              <div>plataforma de</div>
              <div>intercambio</div>
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ position: 'relative', width: 76, height: 76 }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 1 - swap }}>
                <Product kind="old" tone={C.sky} />
              </div>
              <div style={{ position: 'absolute', inset: 0, opacity: swap, transform: `scale(${0.7 + 0.3 * swap})` }}>
                <Product kind="new" tone={C.amber} />
              </div>
            </div>
            <div style={{ position: 'absolute', right: 28, top: -26, opacity: progress(frame, platformAt + 4, 12) }}>
              <Pill text="supuesto: otro producto" tone={C.muted} size={28} height={48} on={0.2 + 0.6 * swap} style={{ background: C.ink900, border: `2px dashed ${alpha(C.muted, 0.8)}` }} />
            </div>
          </div>
        </>
      ) : null}

      {/* the policy stays */}
      {pol > 0.01 ? (
        <div style={{ position: 'absolute', left: sheetX(0), top: 396, width: SW, opacity: pol, transform: `translateY(${(1 - pol) * 12}px)` }}>
          <Pill text="igual" tone={C.emerald} icon="check" size={36} height={54} on={pol} />
          <div style={{ marginTop: 8, fontFamily: FONT.sans, fontSize: 27, fontWeight: 700, color: C.text, whiteSpace: 'nowrap' }}>porque no nombra tecnología</div>
        </div>
      ) : null}

      {/* monitoring and revision */}
      {monTerm > 0.01 ? (
        <div style={{ position: 'absolute', left: 500, top: 424, opacity: monTerm * monDim, transform: `translateY(${(1 - monTerm) * 12}px)` }}>
          <TermPill text="MONITORING AND REVISION" size={34} on={monTerm} />
        </div>
      ) : null}
      {monChip > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: sheetX(0),
            top: 508,
            width: 1000,
            height: 130,
            boxSizing: 'border-box',
            padding: '0 28px',
            borderRadius: RADIUS.lg,
            border: `3px solid ${alpha(C.cyan, 0.75)}`,
            background: `linear-gradient(180deg, ${alpha(C.cyan, 0.1)} 0%, ${C.ink900} 90%)`,
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            fontFamily: FONT.sans,
            opacity: monChip * monDim,
            transform: `translateY(${(1 - monChip) * 14}px)`,
          }}
        >
          <Icon name="search" size={56} color={C.cyan} strokeWidth={2} />
          <div style={{ whiteSpace: 'nowrap', lineHeight: 1.25 }}>
            <div style={{ fontSize: 34, fontWeight: 850, color: C.cyanSoft }}>comprobar que se aplica:</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: C.textStrong }}>¿salen documentos por correo y no por la plataforma?</div>
          </div>
        </div>
      ) : null}

      {/* the pool's old sign */}
      {signIn > 0.01 ? (
        <>
          <div style={{ position: 'absolute', left: OLD.x, top: OLD.y, opacity: signIn, transform: `translateY(${(1 - signIn) * -18}px)` }}>
            <OldSign />
          </div>
          <div style={{ position: 'absolute', left: 1090, top: OLD.y + OLDSIGN.h - 30 + 4, width: 638, display: 'flex', gap: 14, alignItems: 'center', justifyContent: 'center', opacity: signIn }}>
            <Pill text="ya no existe" tone={C.muted} size={26} height={38} on={0.2} style={{ border: `2px dashed ${alpha(C.muted, 0.7)}` }} />
            <ImageTag size={26} />
          </div>
        </>
      ) : null}
    </Stage>
  );
}
