import { C, FONT, RADIUS, STAGE, TYPE, alpha } from '../../../theme/tokens';
import { EASE, lerp, progress } from '../../../theme/motion';
import { Icon, PIPELINE_STAGES, PipelineSpine } from '../../../ui';

const GAP = 14;
const HEIGHT = 76;
const ITEM_W = (STAGE.width - GAP * (PIPELINE_STAGES.length - 1)) / PIPELINE_STAGES.length;
/** Stage-local top of the spine while it is the focus, and once it has moved up out of the way. */
const CENTRE_TOP = 306;
const TOP = 0;

export interface SpineTimes {
  /** Frame each stage lights, in PIPELINE_STAGES order (Recoger, Normalizar, Enriquecer, Correlacionar, Alertar). */
  lit: number[];
  loop: number;
  exam: number;
  endcard: number;
}

/**
 * The five SIEM stages, all lit (active = 5). While the voice lists them the
 * spine sits mid-stage and each stage is unveiled on its word (Enriquecer
 * last, "por el camino"); at `loop` it moves to the top and steps back.
 */
export function RecapSpine({ frame, t }: { frame: number; t: SpineTimes }) {
  const move = progress(frame, t.loop - 8, 22, EASE.inOut);
  const top = lerp(move, [0, 1], [CENTRE_TOP, TOP]);
  const exit = 1 - progress(frame, t.endcard - 18, 12, EASE.inOut);
  const settle = lerp(frame, [t.exam - 6, t.exam + 12], [1, 0.7]);
  const opacity = lerp(move, [0, 1], [1, 0.72]) * settle * exit;
  if (opacity <= 0.001) return null;
  const intensity = lerp(move, [0, 1], [1, 0.35]);
  const labelOpacity = 1 - move;

  return (
    <div style={{ position: 'absolute', left: 0, top, width: STAGE.width, height: HEIGHT, opacity }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: -64,
          width: STAGE.width,
          textAlign: 'center',
          fontFamily: FONT.sans,
          fontSize: TYPE.small,
          fontWeight: 750,
          letterSpacing: 4,
          color: C.cyan,
          opacity: labelOpacity,
        }}
      >
        EL PIPELINE DEL SIEM
      </div>

      <PipelineSpine active={PIPELINE_STAGES.length} intensity={intensity} />

      {/* Under the spine while it is the focus: the whole pipeline turns noise into evidence. */}
      {labelOpacity > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: HEIGHT + 44,
            width: STAGE.width,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            fontFamily: FONT.sans,
            fontSize: 32,
            fontWeight: 750,
            opacity: labelOpacity * progress(frame, t.lit[0] + 6, 18),
          }}
        >
          <span style={{ color: C.amber, whiteSpace: 'nowrap' }}>ruido</span>
          <svg height={20} style={{ flex: 1, overflow: 'visible' }} aria-hidden>
            <defs>
              <linearGradient id="s12-noise-to-evidence" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor={C.amber} stopOpacity={0.7} />
                <stop offset="1" stopColor={C.cyan} stopOpacity={0.9} />
              </linearGradient>
            </defs>
            <rect x={0} y={9} width="100%" height={3} rx={1.5} fill="url(#s12-noise-to-evidence)" />
          </svg>
          <Icon name="arrowRight" size={34} color={C.cyan} strokeWidth={2.2} style={{ marginLeft: -30 }} />
          <span style={{ color: C.cyan, whiteSpace: 'nowrap' }}>evidencia</span>
        </div>
      ) : null}

      {PIPELINE_STAGES.map((stage, i) => {
        const at = t.lit[i];
        const reveal = progress(frame, at - 2, 10);
        const flash = progress(frame, at, 6) * (1 - progress(frame, at + 12, 26));
        const left = i * (ITEM_W + GAP);
        return (
          <div key={stage.label}>
            {reveal < 1 ? (
              <div
                style={{
                  position: 'absolute',
                  left: left - 1,
                  top: -1,
                  width: ITEM_W + 2,
                  height: HEIGHT + 2,
                  borderRadius: 18,
                  background: alpha(C.ink950, 0.8 * (1 - reveal)),
                }}
              />
            ) : null}
            {flash > 0.001 ? (
              <div
                style={{
                  position: 'absolute',
                  left: left - 4,
                  top: -4,
                  width: ITEM_W + 8,
                  height: HEIGHT + 8,
                  borderRadius: RADIUS.lg - 2,
                  border: `3px solid ${alpha(C.cyanSoft, 0.9 * flash)}`,
                  boxShadow: `0 0 ${34 * flash}px ${alpha(C.cyan, 0.45 * flash)}`,
                }}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
