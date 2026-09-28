import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, progress } from '../../../engine/src/theme/motion';
import { Icon, Stamp } from '../../../engine/src/ui';
import { E7_VALUES } from '../data/s04-infra';
import { Stage, segment, wordFrame } from './kit';
import { Diamond, vertexPoint } from './parts/Diamond';

const SCENE = 's05-adversary';

// Small, low, left diamond: the top-centre of the stage belongs to the intercepted
// message (before s05-02) and the think prompt (after s05-03) in this scene.
const GEO = { cx: 430, cy: 440, hw: 265, hh: 150 };
const CARD_W = 320;
const ADV = vertexPoint('adv', GEO);
const ADV_RIGHT = ADV.x + CARD_W / 2;

const RIGHT_X = 880;
const PENDING_Y = 250; // centre line of the pending-pivot chip
const FORK_Y = 340; // bracket that splits Adversary into operator / customer
const SUB_TOP = 372;
const SUB_W = 410;
const SUB_GAP = 28;
const OPERATOR_X = RIGHT_X + 10;
const CUSTOMER_X = OPERATOR_X + SUB_W + SUB_GAP;

/**
 * s05-adversary «UNKNOWN está bien»: the last corner stays UNKNOWN. GLASS VIPER
 * is a tracking name, not an identity; the suspect's name is not written in —
 * a pending pivot (historical WHOIS of the domain) is. Then Adversary splits
 * into operator (types) and customer (orders and keeps the loot).
 */
export function S05Adversary(props: SceneProps) {
  const frame = useCurrentFrame();
  const unknown = props.cue('unknown');
  const pending = props.cue('pending');
  const operator = props.cue('operator');
  const customer = props.cue('customer');
  const seg1 = segment(props, 's05-01');
  const seg2 = segment(props, 's05-02');
  const seg3 = segment(props, 's05-03');
  const seg4 = segment(props, 's05-04');

  const stillUnknown = wordFrame(SCENE, 's05-02', 'UNKNOWN');
  const bothInAdv = wordFrame(SCENE, 's05-06', 'Adversary');

  // Adversary emphasis: the open question, the "still UNKNOWN", and "both live in Adversary".
  const advGlow = Math.max(
    0.8 * progress(frame, seg1.from, 14) * (1 - 0.6 * progress(frame, unknown + 20, 20)),
    progress(frame, stillUnknown, 10) * (1 - progress(frame, stillUnknown + 40, 20)),
    progress(frame, pending, 10) * 0.5,
    progress(frame, bothInAdv, 10),
  );

  // Sticky label: from s05-02 until operator/customer need the space.
  const stickyIn = enter(frame, seg2.from + 10, { distance: 20 });
  const stickyOut = 1 - progress(frame, operator - 4, 10);

  // The temptation: a suspected name drifts toward Adversary and is struck out on "No."
  const ghostIn = fadeIn(frame, seg3.from + 8, 12);
  const ghostX = 1020 - 360 * progress(frame, seg3.from + 8, Math.max(20, seg4.from - seg3.from - 8), EASE.inOut);
  const ghostStrike = progress(frame, seg4.from, 10);
  const ghostOut = 1 - progress(frame, seg4.from + 18, 14);

  const pendingIn = progress(frame, pending, 16);
  const forkOp = progress(frame, operator, 16);
  const forkCu = progress(frame, customer, 16);
  const distinct = wordFrame(SCENE, 's05-06', 'distinta');
  const distinctIn = enter(frame, distinct - 4, { distance: 12 });

  const stampOn = frame >= unknown ? 1 - progress(frame, unknown + 16, 10) : 0;

  return (
    <Stage>
      <Diamond
        {...GEO}
        cardW={CARD_W}
        vertices={{
          adv: { unknown: frame >= unknown + 7, glow: advGlow },
          cap: { items: [E7_VALUES.cap], question: false, dim: 0.35 },
          infra: { items: [E7_VALUES.ip], question: false, dim: 0.35 },
          vic: { items: [E7_VALUES.vic], question: false, dim: 0.35 },
        }}
      />

      {stampOn > 0 ? (
        <div style={{ position: 'absolute', left: ADV.x, top: ADV.y + 30, transform: 'translate(-50%, -50%)', opacity: stampOn }}>
          <Stamp frame={frame} at={unknown} accent="rose" rotate={-4} size={TYPE.h3}>
            UNKNOWN
          </Stamp>
        </div>
      ) : null}

      <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {pendingIn > 0 ? <Line d={`M ${ADV_RIGHT} ${PENDING_Y} H ${ADV_RIGHT + 50}`} p={pendingIn} dashed /> : null}
        {forkOp > 0 ? <Line d={`M ${ADV_RIGHT} ${FORK_Y} H ${OPERATOR_X + SUB_W / 2} V ${SUB_TOP}`} p={forkOp} /> : null}
        {forkCu > 0 ? <Line d={`M ${OPERATOR_X + SUB_W / 2} ${FORK_Y} H ${CUSTOMER_X + SUB_W / 2} V ${SUB_TOP}`} p={forkCu} /> : null}
      </svg>

      {/* GLASS VIPER is a tracking name, not an identity. */}
      {frame >= seg2.from + 10 && stickyOut > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 940,
            top: 356,
            width: 470,
            boxSizing: 'border-box',
            padding: '26px 30px 24px',
            borderRadius: 10,
            background: `linear-gradient(180deg, ${alpha(C.amber, 0.24)} 0%, ${alpha(C.amberDeep, 0.55)} 100%)`,
            border: `2px solid ${alpha(C.amber, 0.7)}`,
            boxShadow: `0 18px 44px ${alpha('#000000', 0.45)}`,
            fontFamily: FONT.sans,
            opacity: stickyIn.opacity * stickyOut,
            transform: `${stickyIn.transform} rotate(-2deg)`,
          }}
        >
          {/* The pin. */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: -12,
              width: 24,
              height: 24,
              marginLeft: -12,
              borderRadius: 12,
              background: C.rose,
              boxShadow: `0 4px 10px ${alpha('#000000', 0.5)}`,
            }}
          />
          <div style={{ fontFamily: FONT.mono, fontSize: TYPE.h3 - 4, fontWeight: 800, color: C.amber, letterSpacing: 1 }}>{E7_VALUES.cap}</div>
          <div style={{ marginTop: 10, fontSize: TYPE.label, fontWeight: 700, color: C.textStrong }}>nombre de seguimiento</div>
          <div style={{ marginTop: 4, fontSize: TYPE.label, fontWeight: 700, color: C.roseSoft }}>no es una identidad</div>
        </div>
      ) : null}

      {/* The temptation: a name you only suspect. */}
      {frame >= seg3.from + 8 && ghostOut > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: ghostX,
            top: 290 - 30,
            height: 60,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 26px',
            borderRadius: RADIUS.pill,
            border: `2px dashed ${alpha(C.muted, 0.8)}`,
            background: alpha(C.ink900, 0.9),
            fontFamily: FONT.sans,
            fontSize: TYPE.label,
            fontWeight: 650,
            color: C.text,
            whiteSpace: 'nowrap',
            opacity: ghostIn * ghostOut,
          }}
        >
          <Icon name="user" size={32} color={C.muted} />
          ¿el nombre que sospechas?
          {ghostStrike > 0 ? (
            <div
              style={{
                position: 'absolute',
                left: 16,
                top: 28,
                height: 4,
                width: `calc(${ghostStrike * 100}% - 32px)`,
                background: C.rose,
                borderRadius: 2,
              }}
            />
          ) : null}
        </div>
      ) : null}

      {/* Pending pivot instead of a guess. */}
      {frame >= pending ? (
        <div
          style={{
            position: 'absolute',
            left: ADV_RIGHT + 50,
            top: PENDING_Y - 32,
            height: 64,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 26px',
            borderRadius: RADIUS.pill,
            border: `2px dashed ${alpha(C.roseSoft, 0.85)}`,
            background: alpha(C.roseDeep, 0.55),
            fontFamily: FONT.sans,
            fontSize: TYPE.label,
            fontWeight: 700,
            color: C.textStrong,
            whiteSpace: 'nowrap',
            opacity: pendingIn,
            transform: `translateX(${(1 - pendingIn) * 20}px)`,
          }}
        >
          <Icon name="search" size={32} color={C.roseSoft} />
          <span style={{ color: C.roseSoft }}>pivote pendiente:</span> WHOIS histórico del dominio
        </div>
      ) : null}

      {frame >= operator ? (
        <SubCard x={OPERATOR_X} p={progress(frame, operator + 6, 16)} title="operator">
          teclea: registra el dominio, lanza el implante
        </SubCard>
      ) : null}
      {frame >= customer ? (
        <SubCard x={CUSTOMER_X} p={progress(frame, customer + 6, 16)} title="customer">
          encarga y se queda el botín: diseños de propulsión
        </SubCard>
      ) : null}

      {frame >= distinct - 4 ? (
        <div
          style={{
            position: 'absolute',
            left: OPERATOR_X,
            width: SUB_W * 2 + SUB_GAP,
            top: 604,
            textAlign: 'center',
            fontFamily: FONT.sans,
            fontSize: TYPE.label,
            fontWeight: 750,
            color: C.roseSoft,
            ...distinctIn,
          }}
        >
          pueden ser entidades distintas
        </div>
      ) : null}
    </Stage>
  );
}

function SubCard({ x, p, title, children }: { x: number; p: number; title: string; children: ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: SUB_TOP,
        width: SUB_W,
        boxSizing: 'border-box',
        padding: '16px 24px 20px',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(C.rose, 0.7)}`,
        background: `linear-gradient(180deg, ${alpha(C.rose, 0.16)} 0%, ${alpha(C.ink900, 0.95)} 100%)`,
        fontFamily: FONT.sans,
        opacity: p,
        transform: `translateY(${(1 - p) * 18}px)`,
      }}
    >
      <div style={{ fontSize: TYPE.label + 6, fontWeight: 850, color: C.rose }}>{title}</div>
      <div style={{ marginTop: 6, fontSize: TYPE.label, fontWeight: 650, lineHeight: 1.25, color: C.textStrong }}>{children}</div>
    </div>
  );
}

function Line({ d, p, dashed = false }: { d: string; p: number; dashed?: boolean }) {
  // pathLength normalises the dash maths so the line draws in from its start.
  return (
    <path
      d={d}
      pathLength={1}
      fill="none"
      stroke={alpha(C.roseSoft, 0.75)}
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dashed ? undefined : '1 1'}
      strokeDashoffset={dashed ? undefined : 1 - p}
      opacity={dashed ? p : 1}
    />
  );
}
