import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../timeline/types';
import { ACCENT, C, FONT, STAGE, TYPE, alpha } from '../theme/tokens';
import { EASE, fadeIn, lerp, progress, springIn } from '../theme/motion';
import { Chip, Icon, MonoLine, Panel, PipelineSpine, type Severity } from '../ui';
import { CONTEXT_ROWS, EVENT, GHOST } from '../data/s04-enrich';
import { SeverityGauge } from './parts/s04-enrich/SeverityGauge';

/* Layout in stage-local px (stage = 1728 × 660, origin at STAGE.left/top). */
const CARD = { x: 0, y: 104, w: 1000, h: 556 };
const HEADER = 64;
const EVENT_BLOCK = 194;
const ROW = { x: 28, w: 944, h: 52, step: 61, top: CARD.y + HEADER + EVENT_BLOCK + 14 };
const SIDE = { x: 1080, w: 648 };
const GHOST_BOX = { x: SIDE.x, y: CARD.y, w: SIDE.w, h: 262 };
/** Both gauges sit this far below their card's header (Panel border 2 + header 64). */
const GAUGE_TOP = 6;

const LEVELS: Severity[] = ['BAJA', 'MEDIA', 'ALTA'];
const levelName = (level: number): Severity => LEVELS[Math.max(0, Math.min(2, Math.round(level)))];

export function S04Enrich({ cue, segments }: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rowCues = CONTEXT_ROWS.map((row) => cue(row.cue));
  const severityAt = cue('severity');
  // "El contexto decide la gravedad": the focus moves from the sources to the gauge.
  const decideAt = segments.find((s) => s.id === 's04-03')?.from ?? severityAt - 80;
  // The sources are on screen from the start so the first frame is already complete.
  const sourcesIn = 6;
  const ghostAt = severityAt - 24;

  const spineOn = progress(frame, 0, 24);
  const cardIn = progress(frame, 2, 18);
  const sourcesFocus = 1 - 0.6 * progress(frame, decideAt, 18, EASE.inOut);

  // Main gauge: waits at BAJA (dim) until the context is in, then swings to ALTA.
  const swing = springIn(frame, fps, severityAt, { damping: 13, mass: 0.9 });
  const mainLevel = 2 * Math.min(1, swing);
  const dialLit = 0.45 + 0.55 * progress(frame, decideAt, 16);
  const alarm = progress(frame, severityAt + 6, 16);
  const terminalFocus = progress(frame, severityAt + 46, 14);
  // While the voice says the context decides, each row is "read" in turn.
  const scan = (index: number) => {
    const start = decideAt + 10 + index * 9;
    return progress(frame, start, 8) * (1 - progress(frame, start + 12, 14, EASE.inOut));
  };

  const ghostIn = progress(frame, ghostAt, 18);
  const ghostBadge = progress(frame, severityAt + 24, 12);

  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: STAGE.left, top: STAGE.top, width: STAGE.width, height: STAGE.height }}>
        <PipelineSpine active={2} intensity={spineOn} />

        {/* ---- Main event card ---- */}
        <div
          style={{
            position: 'absolute',
            left: CARD.x,
            top: CARD.y,
            width: CARD.w,
            height: CARD.h,
            opacity: cardIn,
            transform: `translateY(${(1 - cardIn) * 24}px)`,
          }}
        >
          <Panel
            title="Evento normalizado"
            icon="layers"
            accent={alarm > 0 ? 'rose' : 'cyan'}
            glow={alarm * 0.7}
            right={
              <Chip accent="muted" size={TYPE.small}>
                {EVENT.source}
              </Chip>
            }
            style={{ width: CARD.w, height: CARD.h }}
          >
            {/* Event facts */}
            <div style={{ position: 'absolute', left: 28, top: 14 }}>
              <div style={{ fontFamily: FONT.sans, fontSize: 40, fontWeight: 800, color: C.textStrong, lineHeight: 1.15 }}>
                {EVENT.kind}
              </div>
              <div style={{ marginTop: 8 }}>
                {EVENT.fields.map((field) => (
                  <MonoLine
                    key={field.key}
                    size={TYPE.small}
                    style={{ lineHeight: 1.4 }}
                    tokens={[
                      { t: field.key, c: C.faint },
                      { t: field.value, c: C.cyanSoft },
                    ]}
                  />
                ))}
              </div>
            </div>

            {/* Severity gauge, top-right of the card */}
            <SeverityGauge
              level={mainLevel}
              label={levelName(mainLevel)}
              badgeGlow={alarm}
              glowColor={C.rose}
              style={{ position: 'absolute', left: 700, top: GAUGE_TOP, width: 272, opacity: dialLit }}
            />
          </Panel>
        </div>

        {/* ---- Context rows (drawn over the card so they can slide in from the sources) ---- */}
        {CONTEXT_ROWS.map((row, index) => {
          const at = rowCues[index];
          const top = ROW.top + index * ROW.step;
          const inP = springIn(frame, fps, at + 4, { damping: 16, mass: 0.7 });
          const shown = progress(frame, at + 4, 10);
          const next = index + 1 < rowCues.length ? rowCues[index + 1] : decideAt;
          const current = frame >= at && frame < next ? 1 - progress(frame, next - 4, 10) : 0;
          const a = ACCENT[row.accent];
          const rose = index === 0 ? terminalFocus : 0;
          const border = rose > 0 ? alpha(C.rose, 0.5 + 0.45 * rose) : alpha(a.fg, 0.4 + 0.5 * Math.max(current, scan(index)));
          const glowColor = rose > 0 ? C.rose : a.fg;
          const glow = Math.max(current, rose, scan(index));
          return (
            <div key={row.cue} style={{ opacity: cardIn }}>
              {/* Empty slot: the event before enrichment */}
              <div
                style={{
                  position: 'absolute',
                  left: ROW.x,
                  top,
                  width: ROW.w,
                  height: ROW.h,
                  borderRadius: 14,
                  border: `2px dashed ${C.ink600}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '0 18px',
                  boxSizing: 'border-box',
                  opacity: 1 - shown,
                }}
              >
                <Icon name={row.icon} size={28} color={C.faint} />
                <span style={{ fontFamily: FONT.sans, fontSize: TYPE.small, fontWeight: 600, color: C.faint }}>
                  {row.key} ?
                </span>
              </div>

              {shown > 0 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: ROW.x,
                    top,
                    width: ROW.w,
                    height: ROW.h,
                    borderRadius: 14,
                    background: alpha(a.fg, 0.08 + 0.05 * current),
                    border: `2px solid ${border}`,
                    boxShadow: glow > 0 ? `0 0 ${22 * glow}px ${alpha(glowColor, 0.3 * glow)}` : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '0 18px',
                    boxSizing: 'border-box',
                    opacity: shown,
                    transform: `translateX(${(1 - inP) * 56}px)`,
                    fontFamily: FONT.sans,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Icon name={row.icon} size={30} color={a.fg} />
                  <span style={{ fontSize: TYPE.label, fontWeight: 600, color: C.muted }}>{row.key}</span>
                  <span style={{ fontSize: TYPE.label, fontWeight: 750, color: C.textStrong }}>{row.value}</span>
                  {row.chip ? (
                    <Chip
                      accent={row.chip.accent}
                      size={28}
                      style={{
                        marginLeft: 6,
                        opacity: progress(frame, at + row.chip.delay, 10),
                        transform: `scale(${0.8 + 0.2 * springIn(frame, fps, at + row.chip.delay)})`,
                      }}
                    >
                      {row.chip.text}
                    </Chip>
                  ) : null}
                </div>
              ) : null}

              {row.note ? (
                <div
                  style={{
                    position: 'absolute',
                    left: ROW.x + 56,
                    top: top + ROW.h + 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontFamily: FONT.sans,
                    fontSize: TYPE.small,
                    fontWeight: 650,
                    color: ACCENT.amber.soft,
                    opacity: progress(frame, at + row.note.delay, 12),
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Icon name="alert" size={26} color={C.amber} />
                  {row.note.text}
                </div>
              ) : null}
            </div>
          );
        })}

        {/* ---- Sources that plug context into the event ---- */}
        <div
          style={{
            position: 'absolute',
            left: SIDE.x,
            top: ROW.top - 118,
            width: SIDE.w,
            opacity: fadeIn(frame, sourcesIn, 14) * (1 - progress(frame, ghostAt - 30, 14, EASE.inOut)),
            fontFamily: FONT.sans,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Icon name="plug" size={38} color={C.cyan} />
            <span style={{ fontSize: 36, fontWeight: 800, color: C.textStrong }}>Fuentes de contexto</span>
          </div>
          <div style={{ fontSize: TYPE.small, fontWeight: 550, color: C.muted, marginTop: 6, marginLeft: 52 }}>
            el SIEM consulta otros sistemas
          </div>
        </div>

        <svg
          width={STAGE.width}
          height={STAGE.height}
          style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: sourcesFocus }}
        >
          {CONTEXT_ROWS.map((row, index) => {
            const at = rowCues[index];
            const y = ROW.top + index * ROW.step + ROW.h / 2;
            const appear = fadeIn(frame, sourcesIn + index * 5, 12);
            const draw = progress(frame, at - 6, 10, EASE.inOut);
            const x0 = SIDE.x - 4;
            const x1 = CARD.x + CARD.w + 4;
            const travel = lerp(frame, [at - 6, at + 6], [0, 1]);
            const px = x0 + (x1 - x0) * travel;
            return (
              <g key={row.cue} opacity={appear}>
                <line x1={x0} y1={y} x2={x1} y2={y} stroke={C.ink600} strokeWidth={3} strokeDasharray="6 8" />
                <line x1={x0} y1={y} x2={x0 + (x1 - x0) * draw} y2={y} stroke={C.cyan} strokeWidth={4} strokeLinecap="round" />
                <circle cx={x0} cy={y} r={6} fill={draw > 0 ? C.cyan : C.ink600} />
                <circle cx={x1} cy={y} r={6} fill={draw >= 1 ? C.cyan : C.ink600} />
                {travel > 0 && travel < 1 ? <circle cx={px} cy={y} r={9} fill={C.cyanSoft} /> : null}
              </g>
            );
          })}
        </svg>

        {CONTEXT_ROWS.map((row, index) => {
          const at = rowCues[index];
          const appear = fadeIn(frame, sourcesIn + index * 5, 12);
          const lit = progress(frame, at - 8, 8);
          const next = index + 1 < rowCues.length ? rowCues[index + 1] : decideAt;
          const current = frame >= at - 8 && frame < next ? lit * (1 - progress(frame, next - 4, 10)) : 0;
          const done = frame >= at;
          return (
            <div
              key={row.cue}
              style={{
                position: 'absolute',
                left: SIDE.x,
                top: ROW.top + index * ROW.step,
                width: SIDE.w,
                height: ROW.h,
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '0 18px',
                borderRadius: 14,
                background: current > 0 ? alpha(C.cyan, 0.08 + 0.08 * current) : C.ink850,
                border: `2px solid ${current > 0 ? alpha(C.cyan, 0.45 + 0.5 * current) : done ? alpha(C.cyan, 0.3) : C.ink700}`,
                boxShadow: current > 0 ? `0 0 ${24 * current}px ${alpha(C.cyan, 0.28 * current)}` : 'none',
                opacity: appear * (done ? 1 : 0.55) * sourcesFocus,
                transform: `translateX(${(1 - appear) * 24}px)`,
                fontFamily: FONT.sans,
                whiteSpace: 'nowrap',
              }}
            >
              <Icon name={row.icon} size={28} color={done ? C.cyan : C.muted} />
              <span style={{ fontSize: 28, fontWeight: 650, color: done ? C.text : C.muted, flex: 1 }}>{row.source}</span>
              {done ? <Icon name="check" size={28} color={C.cyanSoft} style={{ opacity: progress(frame, at + 4, 8) }} /> : null}
            </div>
          );
        })}

        {/* ---- Ghost: the same alert on a test laptop stays BAJA ---- */}
        {ghostIn > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: GHOST_BOX.x,
              top: GHOST_BOX.y,
              width: GHOST_BOX.w,
              height: GHOST_BOX.h,
              opacity: ghostIn,
              transform: `translateX(${(1 - ghostIn) * -40}px)`,
            }}
          >
            <div style={{ position: 'absolute', inset: 0, opacity: 0.62 }}>
              <Panel
                title={GHOST.title}
                icon="layers"
                accent="muted"
                style={{ width: GHOST_BOX.w, height: GHOST_BOX.h, borderStyle: 'dashed' }}
              >
                <div style={{ position: 'absolute', left: 26, top: 14, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: 30, fontWeight: 750, color: C.text, lineHeight: 1.2 }}>{GHOST.kind}</div>
                  <MonoLine size={TYPE.small} style={{ marginTop: 6 }} tokens={[{ t: GHOST.dest, c: C.muted }]} />
                </div>
              </Panel>
            </div>
            {/* Asset line + gauge stay readable above the dimmed card. */}
            <div
              style={{
                position: 'absolute',
                left: 26,
                top: HEADER + 108,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontFamily: FONT.sans,
                whiteSpace: 'nowrap',
                opacity: 0.7 + 0.3 * ghostBadge,
              }}
            >
              <Icon name="laptop" size={32} color={C.emerald} />
              <span style={{ fontSize: TYPE.label, fontWeight: 750, color: C.textStrong }}>{GHOST.asset}</span>
            </div>
            <SeverityGauge
              level={0}
              label="BAJA"
              badgeGlow={ghostBadge}
              glowColor={C.emerald}
              style={{ position: 'absolute', right: 22, top: 2 + HEADER + GAUGE_TOP, width: 200 }}
            />
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
}

