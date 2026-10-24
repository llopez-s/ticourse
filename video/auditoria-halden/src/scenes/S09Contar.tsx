import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { enter, progress, springIn } from '../../../engine/src/theme/motion';
import { dimStyle } from '../../../engine/src/ui';
import { EscapeRoom, type RoomKind } from './parts/Images';
import { ImageTag, Pill } from './parts/Labels';
import { Stage, wordFrame } from './kit';

const S = 's09-contar';
const W = STAGE.width;
const COL_GAP = 36;
const COL_W = (W - 2 * COL_GAP) / 3;
const CARD_H = 322;
const ROOM_TAG_TOP = 340;
const ROOM_TOP = 388;
const ROOM_W = 216;
const CAPTION_TOP = 548;
const CHIP_TOP = 600;

interface Level {
  id: 'unknown' | 'partial' | 'known';
  term: string;
  tone: string;
  /** Sheets peeking out of the envelope: 0 = empty and sealed. */
  sheets: number;
  lead: string;
  details: readonly string[];
  box: { text: string; fill: string; ink: string };
  room: RoomKind;
  caption: string;
}

const LEVELS: readonly Level[] = [
  {
    id: 'unknown',
    term: 'UNKNOWN',
    tone: C.rose,
    sheets: 0,
    lead: 'nada',
    details: ['lo más realista frente a alguien de fuera', 'se va tiempo en descubrir'],
    box: { text: 'black box', fill: '#05070d', ink: '#ffffff' },
    room: 'none',
    caption: 'sin pistas',
  },
  {
    id: 'partial',
    term: 'PARTIALLY KNOWN',
    tone: C.cyan,
    sheets: 1,
    lead: 'una cuenta de usuario normal',
    details: ['lo que tendría un cliente o un usuario'],
    box: { text: 'grey box', fill: '#64748b', ink: '#ffffff' },
    room: 'hint',
    caption: 'una pista',
  },
  {
    id: 'known',
    term: 'KNOWN',
    tone: C.emerald,
    sheets: 3,
    lead: 'planos, código, credenciales',
    details: ['máxima cobertura por hora', 'no se parece a un atacante de fuera'],
    box: { text: 'white box', fill: '#f8fafc', ink: '#0c1322' },
    room: 'plan',
    caption: 'el plano',
  },
];

/** An envelope: sealed when it holds nothing, open with `sheets` papers peeking out otherwise (150 × 100). */
function Envelope({ tone, sheets, open }: { tone: string; sheets: number; open: number }) {
  const o = sheets > 0 ? open : 0;
  return (
    <svg width={150} height={106} viewBox="0 0 150 106" fill="none" aria-hidden style={{ display: 'block', overflow: 'visible' }}>
      {Array.from({ length: sheets }, (_, k) => {
        const lift = (14 + k * 9) * o;
        return <rect key={k} x={26 + k * 24} y={12 - lift} width={64} height={56} rx={6} fill={C.ink800} stroke={alpha(tone, 0.8)} strokeWidth={3.5} transform={`rotate(${(k - (sheets - 1) / 2) * 7} 75 60)`} />;
      })}
      <rect x={6} y={26} width={138} height={74} rx={10} fill={C.ink850} stroke={tone} strokeWidth={5} />
      <path d="M 8 30 L 75 72 L 142 30" stroke={alpha(tone, 0.75)} strokeWidth={4} strokeLinejoin="round" />
      {sheets === 0 ? <path d="M 8 30 L 75 6 L 142 30 Z" fill={alpha(tone, 0.12)} stroke={alpha(tone, 0.75)} strokeWidth={4} strokeLinejoin="round" /> : null}
    </svg>
  );
}

function Line({ children, size = 30, color = C.text, weight = 650, show = 1 }: { children: ReactNode; size?: number; color?: string; weight?: number; show?: number }) {
  return <div style={{ fontSize: size, fontWeight: weight, color, lineHeight: 1.2, opacity: show, transform: `translateY(${(1 - show) * 8}px)` }}>{children}</div>;
}

/**
 * s09-contar «Cuánto le cuentas». On `envelopes` three sealed envelopes wait in dashed slots. On `unknown`, `partial`
 * and `known` each opens on its own cue — UNKNOWN (rose: «nada», empty), PARTIALLY KNOWN (cyan: «una cuenta de usuario
 * normal», one sheet), KNOWN (emerald: «planos, código, credenciales», three sheets) — with its lines lit on the voice's
 * own words, the one on the voice bright and the others stepping back. On `boxes`, with no voice, the old names tag the
 * three: black box, grey box, white box. On `escape-room` the escape room (tagged «imagen · no es del puerto») shows its
 * three rooms under the envelopes — sin pistas, una pista (on «pista») and el plano (on «plano»), only game doors and
 * keyhole plates. On `proposal` the chip «la aplicación nueva, known; lo que se ve desde fuera, unknown» lands.
 */
export function S09Contar(props: SceneProps) {
  const frame = useCurrentFrame();
  const envAt = props.cue('envelopes');
  const openAt = [props.cue('unknown'), props.cue('partial'), props.cue('known')];
  const boxesAt = props.cue('boxes');
  const escapeAt = props.cue('escape-room');
  const proposalAt = props.cue('proposal');
  const hintAt = wordFrame(S, 's09-06', 'pista') - 10;
  const planAt = wordFrame(S, 's09-06', 'plano') - 10;
  const roomAt = [escapeAt - 2, hintAt, planAt];

  const active = frame >= openAt[2] - 2 ? 2 : frame >= openAt[1] - 2 ? 1 : frame >= openAt[0] - 2 ? 0 : -1;
  const allUp = progress(frame, boxesAt - 6, 14);
  const imageIn = progress(frame, escapeAt - 6, 16);
  const chipIn = springIn(frame, 30, proposalAt - 2, { damping: 15 });

  return (
    <Stage>
      {LEVELS.map((lv, i) => {
        const x = i * (COL_W + COL_GAP);
        const slot = enter(frame, envAt + i * 6 - 4, { distance: 18, duration: 18 });
        const open = progress(frame, openAt[i] - 4, 16);
        const dim = i === active || active < 0 ? 0 : 0.5 * (1 - allUp);
        const lead = progress(frame, openAt[i] + 4, 12);
        const d0 = progress(frame, openAt[i] + 18, 12);
        const d1 = progress(frame, openAt[i] + 40, 12);
        const tag = progress(frame, boxesAt + i * 10, 12);
        return (
          <div key={lv.id} style={{ position: 'absolute', left: x, top: 0, width: COL_W, height: CARD_H, ...slot }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                boxSizing: 'border-box',
                padding: '16px 24px',
                borderRadius: RADIUS.lg,
                border: `3px ${open > 0.5 ? 'solid' : 'dashed'} ${alpha(open > 0.5 ? lv.tone : C.muted, open > 0.5 ? 0.5 + 0.4 * open : 0.5)}`,
                background: alpha(lv.tone, 0.03 + 0.07 * open),
                boxShadow: open > 0.05 ? `0 0 ${Math.round(28 * open)}px ${alpha(lv.tone, 0.2 * open)}` : undefined,
                fontFamily: FONT.sans,
                whiteSpace: 'nowrap',
                ...dimStyle(dim),
              }}
            >
              <div style={{ height: 104, display: 'flex', justifyContent: 'center' }}>
                <Envelope tone={lv.tone} sheets={lv.sheets} open={open} />
              </div>
              <div style={{ marginTop: 6, display: 'flex', alignItems: 'baseline', gap: 12, opacity: 0.35 + 0.65 * open }}>
                <span style={{ fontSize: 42, fontWeight: 900, letterSpacing: 0.5, color: lv.tone }}>{lv.term}</span>
                <span style={{ fontSize: 28, fontWeight: 700, color: C.muted }}>environment</span>
              </div>
              <Line size={32} weight={850} color={C.textStrong} show={lead}>
                {lv.lead}
              </Line>
              <div style={{ marginTop: 6, whiteSpace: 'normal' }}>
                {lv.details.map((d, k) => (
                  <Line key={d} size={28} color={k === lv.details.length - 1 && lv.id === 'known' ? C.roseSoft : C.text} show={k === 0 ? d0 : d1}>
                    {d}
                  </Line>
                ))}
              </div>
              {/* the old names, with no voice */}
              <div style={{ position: 'absolute', right: 18, top: 16, opacity: tag, transform: `translateY(${(1 - tag) * 8}px)` }}>
                <div style={{ height: 40, padding: '0 16px', display: 'flex', alignItems: 'center', boxSizing: 'border-box', borderRadius: RADIUS.pill, border: `2px solid ${alpha('#ffffff', 0.7)}`, background: lv.box.fill, color: lv.box.ink, fontSize: 28, fontWeight: 800 }}>{lv.box.text}</div>
              </div>
            </div>
          </div>
        );
      })}

      {/* The escape room: no hints, one hint, the plan */}
      {imageIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: STAGE.height, opacity: imageIn }}>
          <div style={{ position: 'absolute', left: 0, top: ROOM_TAG_TOP }}>
            <ImageTag />
          </div>
          {LEVELS.map((lv, i) => {
            const cx = i * (COL_W + COL_GAP) + COL_W / 2;
            const on = progress(frame, roomAt[i], 14);
            return (
              <div key={lv.id} style={{ position: 'absolute', left: cx - ROOM_W / 2, top: ROOM_TOP, opacity: on, transform: `translateY(${(1 - on) * 14}px)` }}>
                <EscapeRoom kind={lv.room} width={ROOM_W} lit={on} />
                <div style={{ position: 'absolute', left: 0, top: CAPTION_TOP - ROOM_TOP, width: ROOM_W, textAlign: 'center', fontFamily: FONT.sans, fontSize: 30, fontWeight: 800, color: lv.tone, whiteSpace: 'nowrap' }}>{lv.caption}</div>
              </div>
            );
          })}
        </div>
      ) : null}

      {frame >= proposalAt - 4 ? (
        <div style={{ position: 'absolute', left: 0, top: CHIP_TOP, width: W, display: 'flex', justifyContent: 'center', opacity: Math.min(1, chipIn * 1.4), transform: `translateY(${(1 - Math.min(1, chipIn)) * 14}px)` }}>
          <Pill text="la aplicación nueva, known; lo que se ve desde fuera, unknown" icon="flag" tone={C.cyan} size={36} height={58} on={0.6} />
        </div>
      ) : null}
    </Stage>
  );
}
