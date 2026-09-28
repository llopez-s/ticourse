import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { BrandMark } from '../../../engine/src/overlay/ChapterRail';
import { isElevenLabsVoice } from '../../../engine/src/timeline/voice';
import { C, FONT, RADIUS, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon } from '../../../engine/src/ui';
import { TIMELINE } from '../timeline/load';
import { VERTEX } from './parts/Diamond';
import { Stage, wordFrame } from './kit';

const S = 's12-recap';

const V = (id: keyof typeof VERTEX) => <span style={{ color: VERTEX[id].tint }}>{VERTEX[id].label}</span>;
const Dot = () => <span style={{ color: C.faint }}> · </span>;

/**
 * S12 «Para el examen» — the closing scene:
 *   recap    a board of exam reflexes, one row per reflex as it is spoken
 *   endcard  ALERTÓPOLIS end card pointing to the infrastructure lesson, held to the last frame
 */
export function S12Recap(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recapAt = props.cue('recap');
  const endcardAt = props.cue('endcard');

  const rows: { at: number; body: ReactNode }[] = [
    {
      at: wordFrame(S, 's12-01', 'Cuatro'),
      body: (
        <>
          4 vértices: {V('adv')}
          <Dot />
          {V('cap')}
          <Dot />
          {V('infra')}
          <Dot />
          {V('vic')}
        </>
      ),
    },
    {
      at: wordFrame(S, 's12-01', 'implante'),
      body: (
        <>
          Implante = {V('cap')}
          <Dot />
          dominio = {V('infra')}
        </>
      ),
    },
    {
      at: wordFrame(S, 's12-02', 'Operator'),
      body: (
        <>
          <b style={{ color: C.roseSoft }}>Operator</b> teclea
          <Dot />
          <b style={{ color: C.roseSoft }}>customer</b> encarga
        </>
      ),
    },
    {
      at: wordFrame(S, 's12-02', 'UNKNOWN'),
      body: (
        <>
          <span style={{ fontFamily: FONT.mono, letterSpacing: 1 }}>UNKNOWN</span> + plan de pivotes = <b style={{ color: C.emerald }}>válido</b>
        </>
      ),
    },
    {
      at: wordFrame(S, 's12-02', 'pivotar'),
      body: (
        <>
          Pivota por lo <b style={{ color: C.emerald }}>dedicado</b>, no por lo compartido
        </>
      ),
    },
  ];

  const boardOpacity = progress(frame, 0, 12) * (1 - progress(frame, endcardAt - 14, 14, EASE.inOut));

  return (
    <Stage>
      {boardOpacity > 0.001 ? (
        <div style={{ position: 'absolute', left: 110, top: 24, width: STAGE.width - 220, opacity: boardOpacity, fontFamily: FONT.sans }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...enter(frame, Math.min(4, recapAt), { distance: 16 }) }}>
            <Icon name="mortarboard" size={42} color={C.violet} />
            <span style={{ fontSize: TYPE.h3, fontWeight: 800, color: C.textStrong }}>Para el examen</span>
            <span style={{ marginLeft: 'auto', fontSize: TYPE.small, fontWeight: 700, letterSpacing: 3, color: C.faint }}>REFLEJOS · DIAMOND MODEL</span>
          </div>
          <div style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {rows.map((r, i) => (
              <ReflexRow key={i} n={i + 1} frame={frame} fps={fps} at={Math.max(recapAt, r.at - 4)}>
                {r.body}
              </ReflexRow>
            ))}
          </div>
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcardAt} />
    </Stage>
  );
}

function ReflexRow({ n, frame, fps, at, children }: { n: number; frame: number; fps: number; at: number; children: ReactNode }) {
  const p = springIn(frame, fps, at, { damping: 16 });
  const lit = Math.min(1, p * 1.3);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        height: 88,
        boxSizing: 'border-box',
        padding: '0 28px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.violet, 0.2 + 0.35 * lit)}`,
        background: `linear-gradient(90deg, ${alpha(C.violet, 0.12 * lit)} 0%, ${alpha(C.ink900, 0.9)} 60%)`,
      }}
    >
      <div
        style={{
          flex: 'none',
          width: 50,
          height: 50,
          borderRadius: 25,
          display: 'grid',
          placeItems: 'center',
          background: alpha(C.violet, 0.12 + 0.18 * lit),
          fontSize: TYPE.small,
          fontWeight: 800,
          color: lit > 0.5 ? '#c4b5fd' : C.faint,
        }}
      >
        {n}
      </div>
      <div
        style={{
          fontSize: TYPE.body - 2,
          fontWeight: 700,
          color: C.textStrong,
          whiteSpace: 'nowrap',
          opacity: lit,
          transform: `translateX(${(1 - lit) * 30}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

const CARD_W = 1320;

/** Closing card: ALERTÓPOLIS brand, title, exam badge, the next lesson, disclaimer. */
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
      <div style={{ marginTop: 20, fontSize: TYPE.h1, fontWeight: 850, letterSpacing: -2, lineHeight: 1.05, color: C.textStrong, whiteSpace: 'nowrap', ...title }}>
        El <span style={{ color: C.cyan }}>Diamond Model</span> en acción
      </div>
      <div style={{ marginTop: 20, ...objective }}>
        <Chip accent="violet" icon="mortarboard" size={TYPE.label}>
          GIAC GCTI · Intrusion Analysis
        </Chip>
      </div>
      <div style={{ marginTop: 32, width: 720 * ruleDraw, height: 2, background: C.ink700 }} />
      <div
        style={{
          marginTop: 32,
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
            Siguiente: <span style={{ color: C.cyanSoft }}>Infraestructura</span>
          </span>
          <span style={{ fontSize: TYPE.label, fontWeight: 600, color: C.text, whiteSpace: 'nowrap' }}>passive DNS, WHOIS y certificados</span>
        </div>
      </div>
      <div style={{ marginTop: 34, fontSize: TYPE.small, fontWeight: 550, color: C.muted, textAlign: 'center', lineHeight: 1.35, ...disclaimer }}>
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
