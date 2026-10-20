import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { DeskPhone, LetterArt, type LetterForm } from './parts/Images';
import { Caption, TermName } from './parts/Labels';
import { LureCard } from './parts/Messages';
import { Stage, wordFrame } from './kit';

const S = 's02-canal';
const W = STAGE.width;
const LURE_W = 1320;
const COL_W = 520;
const COL_GAP = (W - 3 * COL_W) / 2;
const COL_TOP = 128;
const COL_H = 296;
const ART_H = 160;
const NAMES_TOP = 446;
const ROW_TOP = 566;

/** A closed envelope (the mail channel). */
function Envelope({ tone }: { tone: string }) {
  return (
    <svg width={200} height={140} viewBox="0 0 200 140" style={{ display: 'block' }}>
      <rect x={10} y={14} width={180} height={116} rx={12} fill={C.ink800} stroke={alpha(tone, 0.85)} strokeWidth={5} />
      <path d="M14 20 L100 84 L186 20" stroke={alpha(tone, 0.85)} strokeWidth={5} fill="none" strokeLinejoin="round" />
    </svg>
  );
}

/** A phone with one message bubble (the SMS channel). */
function SmsPhone({ tone }: { tone: string }) {
  return (
    <svg width={110} height={150} viewBox="0 0 110 150" style={{ display: 'block' }}>
      <rect x={8} y={4} width={94} height={142} rx={16} fill={C.ink900} stroke={alpha(tone, 0.85)} strokeWidth={5} />
      <rect x={18} y={20} width={74} height={110} rx={6} fill={C.ink800} />
      <path d="M24 36 H84 Q88 36 88 40 V72 Q88 76 84 76 H36 L26 86 L28 76 Q24 76 24 72 Z" fill={alpha(tone, 0.2)} stroke={alpha(tone, 0.7)} strokeWidth={3} />
      <rect x={32} y={46} width={46} height={7} rx={3} fill={alpha(C.text, 0.55)} />
      <rect x={32} y={60} width={34} height={7} rx={3} fill={alpha(C.text, 0.55)} />
    </svg>
  );
}

interface Channel {
  form: LetterForm;
  title: string;
  sub: string[];
  term: string;
  word: string;
  art: (tone: string) => ReactNode;
}

const CHANNELS: Channel[] = [
  { form: 'envelope', title: 'Correo', sub: ['a toda la plantilla'], term: 'PHISHING', word: 'phishing', art: (t) => <Envelope tone={t} /> },
  { form: 'phone', title: 'SMS', sub: [], term: 'SMISHING', word: 'smishing', art: (t) => <SmsPhone tone={t} /> },
  {
    form: 'handset',
    title: 'Llamada',
    sub: ['«de Recursos Humanos»', 'pide los datos de viva voz'],
    term: 'VISHING',
    word: 'vishing',
    art: (t) => <DeskPhone width={200} tone={t} />,
  },
];

/**
 * s02-canal «La misma carta, tres veces». On `lure` the message of s01 comes back big; on `mail` it rises into a
 * banner and splits into three columns that light in turn with the rest dimmed — «Correo · a toda la plantilla»
 * (`mail`), «SMS» (`sms`), «Llamada · «de Recursos Humanos» · pide los datos de viva voz» (`call`, image only, no
 * sound). On `names` each column gets its name on its own word: PHISHING · SMISHING · VISHING. On `targeted` a small
 * row: spear phishing and whaling. On `letter` each channel turns into the same letter — in an envelope, in a phone,
 * out of a handset — and the row gives way to «mira cómo llega, no lo que cuenta» (the case itself: no image tag).
 * No domains, no phone numbers.
 */
export function S02Canal(props: SceneProps) {
  const frame = useCurrentFrame();
  const lureAt = props.cue('lure') - 6;
  const chanAt = [props.cue('mail') - 6, props.cue('sms') - 6, props.cue('call') - 6];
  const namesAt = props.cue('names') - 4;
  const nameAt = CHANNELS.map((c) => Math.max(namesAt, wordFrame(S, 's02-04', c.word) - 6));
  const targetedAt = props.cue('targeted') - 4;
  const spearAt = wordFrame(S, 's02-05', 'spear') - 6;
  const whalingAt = wordFrame(S, 's02-05', 'whaling') - 6;
  const letterAt = props.cue('letter') - 4;
  const lookAt = Math.max(letterAt + 30, wordFrame(S, 's02-06', 'llega', 1) - 8);

  const lureIn = enter(frame, lureAt, { distance: 20, duration: 18 });
  const rise = progress(frame, chanAt[0] - 10, 24, EASE.inOut);
  const lureS = mix(0.82, 0.5, rise);
  const lureY = mix(150, 0, rise);
  const lureX = (W - LURE_W * lureS) / 2;
  const colsIn = progress(frame, chanAt[0], 18);
  const allLit = progress(frame, namesAt, 14);
  const toLetter = progress(frame, letterAt, 22, EASE.inOut);
  const rowIn = progress(frame, targetedAt, 14) * (1 - progress(frame, letterAt - 6, 14, EASE.inOut));
  const capIn = enter(frame, lookAt, { distance: 16, duration: 16 });
  const lureDim = 1 - 0.45 * toLetter;

  return (
    <Stage>
      {/* the lure, as a banner over the three channels */}
      <div style={{ position: 'absolute', left: lureX, top: lureY, transformOrigin: '0 0', transform: `scale(${lureS})`, opacity: lureDim }}>
        <div style={{ opacity: lureIn.opacity, transform: lureIn.transform }}>
          <LureCard size={54} width={LURE_W} />
        </div>
      </div>

      {/* the three channels */}
      {colsIn > 0.001
        ? CHANNELS.map((c, i) => {
            const started = progress(frame, chanAt[i], 12);
            const next = chanAt[i + 1] ?? namesAt;
            const own = started * (1 - 0.6 * progress(frame, next, 12, EASE.inOut));
            const lit = Math.max(own, allLit);
            const op = 0.3 + 0.7 * lit;
            const tone = lit > 0.5 ? C.cyan : C.muted;
            const x = i * (COL_W + COL_GAP);
            return (
              <div key={c.title} style={{ position: 'absolute', left: x, top: COL_TOP, width: COL_W, fontFamily: FONT.sans, opacity: colsIn }}>
                <div
                  style={{
                    position: 'relative',
                    width: COL_W,
                    height: COL_H,
                    boxSizing: 'border-box',
                    borderRadius: RADIUS.lg,
                    border: `${lit > 0.5 ? 3 : 2}px solid ${alpha(tone, 0.3 + 0.5 * lit)}`,
                    background: `linear-gradient(180deg, ${alpha(C.cyan, 0.04 + 0.06 * lit)} 0%, ${C.ink900} 100%)`,
                    boxShadow: lit > 0.5 ? `0 0 ${Math.round(30 * lit)}px ${alpha(C.cyan, 0.18 * lit)}` : undefined,
                    opacity: op,
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <div style={{ position: 'relative', height: ART_H, marginTop: 14 }}>
                    <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', opacity: 1 - toLetter }}>{c.art(tone)}</div>
                    {toLetter > 0.001 ? (
                      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', opacity: toLetter, transform: `scale(${0.85 + 0.15 * toLetter})` }}>
                        <LetterArt form={c.form} width={172} />
                      </div>
                    ) : null}
                  </div>
                  <div style={{ fontSize: 46, fontWeight: 850, color: C.textStrong, marginTop: 6 }}>{c.title}</div>
                  {c.sub.map((s) => (
                    <div key={s} style={{ fontSize: 32, fontWeight: 700, color: C.text, lineHeight: 1.25 }}>
                      {s}
                    </div>
                  ))}
                </div>
                {frame >= nameAt[i] - 2 ? (
                  <div style={{ position: 'absolute', left: 0, top: NAMES_TOP - COL_TOP, width: COL_W, display: 'flex', justifyContent: 'center', ...enter(frame, nameAt[i], { distance: 14, duration: 14 }) }}>
                    <TermName term={c.term} size={48} />
                  </div>
                ) : null}
              </div>
            );
          })
        : null}

      {/* spear phishing and whaling, small */}
      {rowIn > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: ROW_TOP, width: W, display: 'flex', justifyContent: 'center', opacity: rowIn, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: C.text, padding: '10px 28px', borderRadius: RADIUS.pill, background: alpha(C.violet, 0.07), border: `2px solid ${alpha(C.violet, 0.4)}` }}>
            <span>dirigido a una persona concreta: </span>
            <span style={{ fontWeight: 850, color: '#c4b5fd', opacity: 0.35 + 0.65 * progress(frame, spearAt, 10) }}>spear phishing</span>
            <span style={{ color: C.faint }}> · </span>
            <span>a los altos cargos: </span>
            <span style={{ fontWeight: 850, color: '#c4b5fd', opacity: 0.35 + 0.65 * progress(frame, whalingAt, 10) }}>whaling</span>
          </div>
        </div>
      ) : null}

      {/* the letter's line */}
      {frame >= lookAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: ROW_TOP - 8, width: W, display: 'flex', justifyContent: 'center', ...capIn }}>
          <Caption text="mira cómo llega, no lo que cuenta" icon="eye" tone={C.cyan} size={42} />
        </div>
      ) : null}
    </Stage>
  );
}
