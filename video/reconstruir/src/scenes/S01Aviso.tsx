import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse } from '../../../engine/src/theme/motion';
import { Chip, Icon, mix } from '../../../engine/src/ui';
import { Stage, wordFrame } from './kit';
import { ALERT_QUESTION, ALERT_TEXT, PROMISE_CHIPS, SOURCE_ORDER } from './parts/data';
import { SourceCard } from './parts/SourceCard';

const S = 's01-aviso';

// The alert group (monitor + notice + bubble) in its natural size, then scaled down to make room for the cards.
const GROUP = { w: 1360, h: 360 } as const;
const GROUP_BIG = { x: (1728 - GROUP.w) / 2, y: 142, s: 1 } as const;
const GROUP_SMALL = { x: (1728 - GROUP.w * 0.62) / 2, y: 120, s: 0.62 } as const;
const CHIPS_Y = 356;
const CARDS_Y = 438;
const CARD = { w: 408, h: 212, gap: 32 } as const;

/**
 * s01-aviso «¿Se han llevado algo?». A Comercial workstation is on stage from the first frame, mid-upload. On
 * `alert` the proxy's notice «Subida bloqueada · almacenamiento personal» lands (the alarm is the pipeline's sfx),
 * the arrow gets crossed out; the bubble «¿se han llevado datos?» pops on the word «llevado» (no cue of its own)
 * and the title comes in with `title` (before 12 s). On `cards` the alert group shrinks and the four source cards
 * lie face down; `chips` brings «leer · normalizar · ordenar · afirmar lo justo»; on `flip` the cards turn over
 * together. No case stamp yet: the voice introduces the case at the end of the scene.
 */
export function S01Aviso(props: SceneProps) {
  const frame = useCurrentFrame();
  const alertAt = props.cue('alert');
  const titleAt = props.cue('title');
  const cardsAt = props.cue('cards');
  const flipAt = props.cue('flip');
  const bubbleAt = wordFrame(S, 's01-01', 'llevado') - 6;
  const chipAt = [
    wordFrame(S, 's01-03', 'Leerás') - 4,
    wordFrame(S, 's01-03', 'pondrás') - 4,
    wordFrame(S, 's01-03', 'ordenarás') - 4,
    wordFrame(S, 's01-03', 'sobre') - 4,
  ];

  const alertP = progress(frame, alertAt, 16);
  const ring = frame >= alertAt && frame < alertAt + 96 ? pulse(frame - alertAt, 30, 0.8) * (1 - progress(frame, alertAt + 60, 36)) : 0;
  const bubbleP = progress(frame, bubbleAt, 14);
  const shrink = progress(frame, cardsAt - 26, 28, EASE.inOut);
  const gx = mix(GROUP_BIG.x, GROUP_SMALL.x, shrink);
  const gy = mix(GROUP_BIG.y, GROUP_SMALL.y, shrink);
  const gs = mix(GROUP_BIG.s, GROUP_SMALL.s, shrink);
  const flip = progress(frame, flipAt, 24, EASE.inOut);

  return (
    <Stage>
      {/* the title */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 6,
          width: 1728,
          textAlign: 'center',
          fontFamily: FONT.sans,
          fontSize: 92,
          fontWeight: 850,
          letterSpacing: -2.5,
          lineHeight: 1.05,
          color: C.textStrong,
          whiteSpace: 'nowrap',
          ...enter(frame, titleAt, { distance: 22, duration: 20 }),
        }}
      >
        Cómo reconstruir <span style={{ color: C.cyan }}>lo ocurrido</span>
      </div>

      {/* the alert group */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: GROUP.w,
          height: GROUP.h,
          transformOrigin: '0 0',
          transform: `translate(${gx}px, ${gy}px) scale(${gs})`,
          opacity: 1 - 0.28 * shrink,
        }}
      >
        <Workstation blocked={alertP} frame={frame} alertAt={alertAt} />

        {/* the proxy's notice */}
        <div
          style={{
            position: 'absolute',
            left: 360,
            top: 8,
            width: 1000,
            height: 150,
            boxSizing: 'border-box',
            borderRadius: RADIUS.lg,
            border: `3px solid ${alpha(C.rose, 0.75)}`,
            background: `linear-gradient(180deg, ${alpha(C.roseDeep, 0.85)} 0%, ${alpha(C.ink900, 0.95)} 100%)`,
            boxShadow: `0 0 ${20 + ring * 50}px ${alpha(C.rose, 0.2 + ring * 0.4)}`,
            padding: '16px 30px',
            fontFamily: FONT.sans,
            ...enter(frame, alertAt, { distance: 40, axis: 'x', duration: 18 }),
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: C.roseSoft, fontSize: 28, fontWeight: 700, letterSpacing: 1 }}>
            <Icon name="bell" size={34} color={C.roseSoft} />
            aviso del proxy
          </div>
          <div style={{ marginTop: 14, fontSize: 38, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>{ALERT_TEXT}</div>
        </div>

        {/* the question */}
        <div
          style={{
            position: 'absolute',
            left: 420,
            top: 206,
            opacity: bubbleP,
            transform: `translateY(${(1 - bubbleP) * 22}px) scale(${0.94 + 0.06 * bubbleP})`,
            transformOrigin: '60px 0',
          }}
        >
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
              padding: '22px 44px',
              borderRadius: 36,
              border: `3px solid ${alpha(C.amber, 0.75)}`,
              background: alpha(C.amberDeep, 0.35),
              fontFamily: FONT.sans,
              fontSize: 54,
              fontWeight: 800,
              color: C.amber,
              whiteSpace: 'nowrap',
            }}
          >
            {ALERT_QUESTION}
            <div
              style={{
                position: 'absolute',
                left: 36,
                top: -17,
                width: 30,
                height: 30,
                background: C.ink900,
                borderLeft: `3px solid ${alpha(C.amber, 0.75)}`,
                borderTop: `3px solid ${alpha(C.amber, 0.75)}`,
                transform: 'rotate(45deg)',
              }}
            />
          </div>
        </div>
      </div>

      {/* the promise */}
      <div style={{ position: 'absolute', left: 0, top: CHIPS_Y, width: 1728, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
        {PROMISE_CHIPS.map((text, i) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 20, ...enter(frame, chipAt[i], { distance: 14, duration: 14 }) }}>
            {i > 0 ? <span style={{ fontSize: 36, fontWeight: 800, color: C.faint, fontFamily: FONT.sans }}>·</span> : null}
            <Chip accent={i === 3 ? 'emerald' : 'cyan'} size={38} solid={false}>
              {text}
            </Chip>
          </div>
        ))}
      </div>

      {/* the four sources, face down until `flip` */}
      {SOURCE_ORDER.map((id, i) => {
        const e = enter(frame, cardsAt + i * 6, { distance: 44, duration: 20 });
        return (
          <div key={id} style={{ position: 'absolute', left: i * (CARD.w + CARD.gap), top: CARDS_Y, ...e }}>
            <SourceCard id={id} variant="tile" width={CARD.w} height={CARD.h} flip={flip} glow={0.35 * progress(frame, flipAt + 20, 16)} />
          </div>
        );
      })}
    </Stage>
  );
}

/** The Comercial workstation, mid-upload: a file going up to the cloud, crossed out when the proxy blocks it. */
function Workstation({ blocked, frame, alertAt }: { blocked: number; frame: number; alertAt: number }) {
  const run = frame < alertAt ? (frame % 48) / 48 : 1;
  return (
    <div style={{ position: 'absolute', left: 0, top: 28, width: 330, height: 330 }}>
      <svg width={330} height={300} viewBox="0 0 330 300" style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden>
        <rect x={10} y={10} width={310} height={206} rx={18} fill={C.ink850} stroke={C.ink500} strokeWidth={5} />
        <rect x={28} y={28} width={274} height={170} rx={10} fill={C.ink900} />
        <path d="M 138 216 L 128 252 H 202 L 192 216 Z" fill={C.ink800} stroke={C.ink600} strokeWidth={4} strokeLinejoin="round" />
        <rect x={96} y={252} width={138} height={14} rx={6} fill={C.ink700} />
        <rect x={52} y={278} width={226} height={18} rx={6} fill={C.ink800} stroke={C.ink600} strokeWidth={3} />
        {/* the file */}
        <path d="M 56 98 H 92 L 106 112 V 156 H 56 Z" fill={alpha(C.cyan, 0.16)} stroke={C.cyan} strokeWidth={4} strokeLinejoin="round" />
        <path d="M 92 98 V 112 H 106" stroke={C.cyan} strokeWidth={4} fill="none" strokeLinejoin="round" />
        {/* the upload path */}
        <path d="M 118 128 H 214" stroke={alpha(C.cyan, 0.45)} strokeWidth={5} strokeLinecap="round" strokeDasharray="8 10" />
        {blocked < 0.01 ? <circle cx={118 + run * 96} cy={128} r={8} fill={C.cyan} /> : null}
        {/* blocked */}
        <g opacity={blocked}>
          <circle cx={166} cy={128} r={24} fill={C.roseDeep} stroke={C.rose} strokeWidth={5} />
          <path d="M 155 117 L 177 139 M 177 117 L 155 139" stroke={C.roseSoft} strokeWidth={5} strokeLinecap="round" />
        </g>
      </svg>
      <div style={{ position: 'absolute', left: 214, top: 78 }}>
        <Icon name="cloud" size={72} color={blocked > 0.5 ? C.muted : C.cyanSoft} strokeWidth={1.6} />
      </div>
      <div style={{ position: 'absolute', left: 14, top: 300 }}>
        <Chip accent="muted" size={28} icon="laptop">
          equipo de Comercial
        </Chip>
      </div>
    </div>
  );
}
