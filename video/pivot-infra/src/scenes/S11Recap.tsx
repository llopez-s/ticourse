import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { BrandMark } from '../../../engine/src/overlay/ChapterRail';
import { isElevenLabsVoice } from '../../../engine/src/timeline/voice';
import { C, FONT, RADIUS, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, type IconName } from '../../../engine/src/ui';
import { TIMELINE } from '../timeline/load';
import { Stage, wordFrame } from './kit';

const S = 's11-recap';

const COL_W = 852;
const COL_GAP = STAGE.width - 2 * COL_W;
const ROW_H = 116;
const ROW_GAP = 16;
const GRID_TOP = 84;

type Reflex = { icon: IconName; title: string; sub: string; at: number };

/**
 * s11-recap «Para el examen»: the video's own images come back as exam
 * reflexes, each lighting up as it is spoken (listín con memoria, cuenta los
 * inquilinos, la llave hecha a mano, el tablón, el WHOIS con memoria, pasivo,
 * el lote). The last slot is the Lab 3A card; then the ALERTÓPOLIS end card
 * holds to the last frame.
 */
export function S11Recap(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recapAt = props.cue('recap');
  const labAt = props.cue('lab3a');
  const endcardAt = props.cue('endcard');
  const at = (seg: string, word: string, nth = 0) => Math.max(recapAt, wordFrame(S, seg, word, nth) - 4);

  const reflexes: Reflex[] = [
    { icon: 'database', title: 'Listín con memoria', sub: 'passive DNS · first seen / last seen', at: at('s11-01', 'listín') },
    { icon: 'users', title: 'Cuenta los inquilinos', sub: 'compartido contamina · dedicado discrimina', at: at('s11-01', 'cuenta') },
    { icon: 'key', title: 'Misma llave, mismo dueño probable', sub: 'cert autofirmado: pista fuerte, no certeza', at: at('s11-02', 'llave') },
    { icon: 'layers', title: 'El tablón enseña lo que montan', sub: 'Certificate Transparency · CT logs', at: at('s11-02', 'tablón') },
    { icon: 'archive', title: 'El WHOIS tiene memoria', sub: 'WHOIS histórico · patrón de registro', at: at('s11-02', 'WHOIS') },
    { icon: 'eyeOff', title: 'Pasivo: sin que te vea', sub: 'colección pasiva primero · OPSEC', at: at('s11-03', 'Investigas') },
    { icon: 'shield', title: 'Pillas el lote, bloqueas antes', sub: 'antes del primer uso · COA: Deny', at: at('s11-03', 'lote,') },
  ];

  const boardOpacity = progress(frame, 0, 10) * (1 - progress(frame, endcardAt - 14, 14, EASE.inOut));

  return (
    <Stage>
      {boardOpacity > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: boardOpacity, fontFamily: FONT.sans }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 60, ...enter(frame, 0, { distance: 14 }) }}>
            <Icon name="mortarboard" size={42} color={C.violet} />
            <span style={{ fontSize: TYPE.h3, fontWeight: 800, color: C.textStrong }}>Para el examen</span>
            <span style={{ marginLeft: 'auto', fontSize: TYPE.small, fontWeight: 700, letterSpacing: 3, color: C.faint }}>REFLEJOS · PIVOTAR POR LA INFRAESTRUCTURA</span>
          </div>
          {reflexes.map((r, i) => (
            <ReflexTile key={r.title} n={i + 1} reflex={r} frame={frame} fps={fps} col={i < 4 ? 0 : 1} row={i < 4 ? i : i - 4} />
          ))}
          <LabTile frame={frame} fps={fps} at={labAt} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcardAt} />
    </Stage>
  );
}

function slot(col: number, row: number) {
  return { left: col * (COL_W + COL_GAP), top: GRID_TOP + row * (ROW_H + ROW_GAP) };
}

function ReflexTile({ n, reflex, frame, fps, col, row }: { n: number; reflex: Reflex; frame: number; fps: number; col: number; row: number }) {
  const p = springIn(frame, fps, reflex.at, { damping: 16 });
  const lit = Math.min(1, p * 1.3);
  const hot = progress(frame, reflex.at, 8) * (1 - progress(frame, reflex.at + 30, 30));
  return (
    <div
      style={{
        position: 'absolute',
        ...slot(col, row),
        width: COL_W,
        height: ROW_H,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        padding: '0 26px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.violet, 0.18 + 0.37 * lit + 0.3 * hot)}`,
        background: `linear-gradient(90deg, ${alpha(C.violet, 0.12 * lit)} 0%, ${alpha(C.ink900, 0.9)} 65%)`,
        boxShadow: hot > 0.05 ? `0 0 ${Math.round(28 * hot)}px ${alpha(C.violet, 0.3 * hot)}` : 'none',
      }}
    >
      <div
        style={{
          flex: 'none',
          width: 66,
          height: 66,
          borderRadius: 18,
          display: 'grid',
          placeItems: 'center',
          background: alpha(C.violet, 0.08 + 0.14 * lit),
          border: `2px solid ${alpha(C.violet, 0.2 + 0.3 * lit)}`,
          position: 'relative',
        }}
      >
        <Icon name={reflex.icon} size={36} color={lit > 0.5 ? '#c4b5fd' : C.ink500} />
        <span
          style={{
            position: 'absolute',
            right: -10,
            top: -10,
            width: 30,
            height: 30,
            borderRadius: 15,
            display: 'grid',
            placeItems: 'center',
            background: lit > 0.5 ? C.violetStrong : C.ink700,
            fontSize: TYPE.micro - 2,
            fontWeight: 800,
            color: lit > 0.5 ? C.textStrong : C.faint,
          }}
        >
          {n}
        </span>
      </div>
      <div style={{ minWidth: 0, opacity: lit, transform: `translateX(${(1 - lit) * 26}px)` }}>
        <div style={{ fontSize: 36, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', lineHeight: 1.15 }}>{reflex.title}</div>
        <div style={{ marginTop: 6, fontSize: TYPE.small, fontWeight: 650, color: '#c4b5fd', whiteSpace: 'nowrap' }}>{reflex.sub}</div>
      </div>
    </div>
  );
}

/** The eighth slot: the lab where the viewer does it with a query budget. */
function LabTile({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  const pos = slot(1, 3);
  const p = springIn(frame, fps, at - 4, { damping: 15 });
  const lit = Math.min(1, p * 1.3);
  return (
    <>
      {/* Waiting slot, dashed, until the lab lands. */}
      <div
        style={{
          position: 'absolute',
          ...pos,
          width: COL_W,
          height: ROW_H,
          boxSizing: 'border-box',
          borderRadius: RADIUS.lg,
          border: `2px dashed ${C.ink700}`,
          opacity: 1 - lit,
        }}
      />
      {lit > 0 ? (
        <div
          style={{
            position: 'absolute',
            ...pos,
            width: COL_W,
            height: ROW_H,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            padding: '0 26px',
            borderRadius: RADIUS.lg,
            border: `3px solid ${alpha(C.cyan, 0.8)}`,
            background: `linear-gradient(90deg, ${alpha(C.cyan, 0.18)} 0%, ${alpha(C.ink900, 0.92)} 70%)`,
            boxShadow: `0 0 ${Math.round(34 * lit)}px ${alpha(C.cyan, 0.3 * lit)}`,
            opacity: lit,
            transform: `scale(${0.94 + 0.06 * p})`,
          }}
        >
          <div style={{ flex: 'none', width: 66, height: 66, borderRadius: 18, display: 'grid', placeItems: 'center', background: C.cyan }}>
            <Icon name="target" size={40} color={C.ink950} strokeWidth={2.2} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 36, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap', lineHeight: 1.15 }}>
              Lab 3A <span style={{ color: C.faint }}>·</span> <span style={{ color: C.cyanSoft }}>Pivot Hunt</span>
            </div>
            <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 10, fontSize: TYPE.small, fontWeight: 700, color: C.cyanSoft, whiteSpace: 'nowrap' }}>
              <Icon name="search" size={26} color={C.cyan} />
              consultas contadas · ahora te toca a ti
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

const CARD_W = 1320;

/** Closing card: ALERTÓPOLIS brand, title, exam badge, the lab and the next lesson, disclaimer. */
function EndCard({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 8) return null;
  const cardIn = springIn(frame, fps, at - 6, { damping: 18 });
  const brand = enter(frame, at - 2, { distance: 16 });
  const title = enter(frame, at + 2, { distance: 24 });
  const objective = enter(frame, at + 8, { distance: 18 });
  const ruleDraw = progress(frame, at + 8, 18);
  const cta = enter(frame, at + 14, { distance: 18 });
  const disclaimer = enter(frame, at + 22, { distance: 12 });
  return (
    <div
      style={{
        position: 'absolute',
        left: (STAGE.width - CARD_W) / 2,
        top: 30,
        width: CARD_W,
        height: STAGE.height - 60,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 36,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        border: `2px solid ${C.ink700}`,
        boxShadow: `0 40px 90px ${alpha('#000000', 0.45)}, inset 0 1px 0 ${alpha('#ffffff', 0.05)}`,
        fontFamily: FONT.sans,
        opacity: Math.min(1, cardIn * 1.4),
        transform: `scale(${0.94 + 0.06 * cardIn})`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: 4,
          background: `linear-gradient(90deg, transparent 0%, ${C.cyan} 50%, transparent 100%)`,
          opacity: 0.8,
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
        <BrandMark size={34} />
        <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
      </div>
      <div style={{ marginTop: 20, fontSize: 70, fontWeight: 850, letterSpacing: -2, lineHeight: 1.05, color: C.textStrong, whiteSpace: 'nowrap', ...title }}>
        Pivotar por la <span style={{ color: C.cyan }}>infraestructura</span>
      </div>
      <div style={{ marginTop: 20, ...objective }}>
        <Chip accent="violet" icon="mortarboard" size={TYPE.label}>
          GIAC GCTI · Collection
        </Chip>
      </div>
      <div style={{ marginTop: 30, width: 720 * ruleDraw, height: 2, background: C.ink700 }} />
      <div
        style={{
          marginTop: 30,
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          padding: '16px 34px 16px 24px',
          borderRadius: 32,
          background: alpha(C.cyan, 0.08),
          border: `2px solid ${alpha(C.cyan, 0.55)}`,
          ...cta,
        }}
      >
        <Icon name="play" size={40} color={C.cyan} strokeWidth={2} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontSize: TYPE.body, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap' }}>
            Ahora te toca a ti: <span style={{ color: C.cyanSoft }}>Lab 3A · Pivot Hunt</span>
          </span>
          <span style={{ fontSize: TYPE.label, fontWeight: 600, color: C.text, whiteSpace: 'nowrap' }}>Siguiente: OSINT, TLP y comunidades de compartición</span>
        </div>
      </div>
      <div style={{ marginTop: 32, fontSize: TYPE.small, fontWeight: 550, color: C.muted, textAlign: 'center', lineHeight: 1.35, ...disclaimer }}>
        Simulación educativa con datos ficticios. Material independiente, no afiliado a SANS/GIAC.
        {isElevenLabsVoice(TIMELINE.voice) ? (
          <>
            <br />
            Voz: ElevenLabs.
          </>
        ) : null}
      </div>
    </div>
  );
}
