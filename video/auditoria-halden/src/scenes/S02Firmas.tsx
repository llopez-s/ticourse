import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon, dimStyle } from '../../../engine/src/ui';
import { Bars, PersonGlyph, Sheet, Signature, SignatureGap } from './parts/Docs';
import { Pill } from './parts/Labels';
import { Stage, wordFrame } from './kit';

const S = 's02-firmas';
const W = STAGE.width;
const HALF = W / 2;
// ---- Labels on top, the table band, the piles, the chips and the question bubble.
const LABEL_TOP = 0;
const BAND = { x: 24, y: 130, w: W - 48, h: 380 } as const;
const PILE_TOP = 150;
const CHIP_TOP = 524;
const BUBBLE_TOP = 590;

/** Six signed sheets, two rows of three, overlapping like a pile: [x, y, rotation] inside the 640 × 330 pile box. */
const SHEETS: readonly (readonly [number, number, number])[] = [
  [20, 8, -3],
  [228, 0, 2],
  [436, 12, -2],
  [10, 166, 2],
  [220, 174, -3],
  [428, 164, 3],
];
const SHEET = { w: 262, h: 178 } as const;
const PILE = { x: 60, w: 706, h: 350 } as const;
const DOC = { w: 600, h: 360 } as const;

/** One head label: the English term big in its colour and the two-word idea under it. */
function Head({ term, idea, tone, show }: { term: string; idea: string; tone: string; show: number }) {
  return (
    <div style={{ fontFamily: FONT.sans, whiteSpace: 'nowrap', textAlign: 'center', opacity: show, transform: `translateY(${(1 - show) * 14}px)` }}>
      <div style={{ fontSize: 58, fontWeight: 900, letterSpacing: 1, color: tone, textShadow: `0 0 26px ${alpha(tone, 0.25)}` }}>{term}</div>
      <div style={{ marginTop: 4, fontSize: 38, fontWeight: 750, color: C.textStrong }}>{idea}</div>
    </div>
  );
}

/**
 * s02-firmas «Dos montones de firmas». On `piles` the board's table band holds two piles: six blank sheets on the left,
 * one blank document on the right. On `ack` the left head «ACKNOWLEDGEMENT · una persona · una norma» lands and the six
 * signatures are written one by one (a person glyph on each sheet); the policy it is about, «política de uso aceptable»,
 * rides under the pile. On `attest` the left pile steps back and the right head «ATTESTATION · la organización · un
 * hecho» lands with the document's rows: its empty date box and its scope on «controles», its period on `period`/«últimos»
 * («los últimos doce meses»); on `signature` management signs (the squiggle draws) and the chip «management
 * attestation» lands on «attestation». On `not-a-test` both piles step back and the question «¿y funciona?» comes in
 * with a struck pen: the answer is not another signature.
 */
export function S02Firmas(props: SceneProps) {
  const frame = useCurrentFrame();
  const pilesAt = props.cue('piles');
  const ackAt = props.cue('ack');
  const attestAt = props.cue('attest');
  const periodAt = props.cue('period');
  const signAt = props.cue('signature');
  const notAt = props.cue('not-a-test');
  const attestWord = wordFrame(S, 's02-04', 'attestation') - 8;
  const ultimosAt = Math.max(periodAt + 10, wordFrame(S, 's02-03', 'últimos') - 8);
  const controlesAt = Math.max(periodAt - 20, wordFrame(S, 's02-03', 'controles') - 8);

  const band = enter(frame, pilesAt - 6, { distance: 18, duration: 20 });
  const leftIn = springIn(frame, 30, pilesAt - 2, { damping: 16 });
  const rightIn = springIn(frame, 30, pilesAt + 10, { damping: 16 });
  const ackHead = progress(frame, ackAt - 4, 14);
  const attestHead = progress(frame, attestAt - 4, 14);
  const policyIn = progress(frame, Math.max(ackAt + 6, wordFrame(S, 's02-02', 'política') - 8), 14);

  // Focus: the left pile while the voice is on it, then the right one, then both step back for the question.
  const toRight = progress(frame, attestAt - 6, 16, EASE.inOut);
  const toBubble = progress(frame, notAt - 6, 16, EASE.inOut);
  const leftDim = Math.max(0.78 * toRight, 0.5 * toBubble);
  const rightDim = Math.max(0.78 * (1 - toRight) * progress(frame, pilesAt + 20, 10), 0.5 * toBubble);

  const signP = (i: number) => progress(frame, ackAt + 8 + i * 9, 22, EASE.inOut);
  const rowIn = (at: number) => progress(frame, at, 14);
  const dateBox = rowIn(Math.max(attestAt + 6, periodAt - 6));
  const scopeRow = rowIn(controlesAt);
  const periodRow = rowIn(ultimosAt);
  const sig = progress(frame, signAt + 4, 36, EASE.inOut);
  const chipIn = enter(frame, attestWord, { distance: 14 });
  const bubble = springIn(frame, 30, notAt - 2, { damping: 15 });
  const strike = progress(frame, notAt + 22, 12);

  return (
    <Stage>
      {/* Heads */}
      <div style={{ position: 'absolute', left: 0, top: LABEL_TOP, width: HALF }}>
        <Head term="ACKNOWLEDGEMENT" idea="una persona · una norma" tone={C.sky} show={ackHead} />
      </div>
      <div style={{ position: 'absolute', left: HALF, top: LABEL_TOP, width: HALF }}>
        <Head term="ATTESTATION" idea="la organización · un hecho" tone={C.cyan} show={attestHead} />
      </div>

      {/* The table band */}
      <div
        style={{
          position: 'absolute',
          left: BAND.x,
          top: BAND.y,
          width: BAND.w,
          height: BAND.h,
          boxSizing: 'border-box',
          borderRadius: 64,
          border: `3px solid ${alpha(C.cyan, 0.22)}`,
          background: `linear-gradient(180deg, ${alpha(C.ink850, 0.95)} 0%, ${alpha(C.ink900, 0.9)} 100%)`,
          ...band,
        }}
      />

      {/* Left pile: one signed sheet per person */}
      <div style={{ position: 'absolute', left: PILE.x, top: PILE_TOP, width: PILE.w, height: PILE.h, opacity: Math.min(1, leftIn * 1.3), transform: `scale(${0.94 + 0.06 * Math.min(1, leftIn)})`, ...dimStyle(leftDim) }}>
        {SHEETS.map(([x, y, r], i) => (
          <div key={i} style={{ position: 'absolute', left: x, top: y }}>
            <Sheet width={SHEET.w} height={SHEET.h} tone={C.sky} rotate={r} glow={ackHead * signP(i) * 0.2}>
              <div style={{ position: 'absolute', left: 18, top: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                <PersonGlyph size={36} color={C.sky} />
                <Bars widths={[100, 70]} gap={9} h={8} style={{ width: 128 }} />
              </div>
              <div style={{ position: 'absolute', left: 22, top: 84 }}>
                <Signature p={signP(i)} variant={i} width={140} color={'#7dd3fc'} />
              </div>
            </Sheet>
          </div>
        ))}
      </div>

      {/* Right pile: a single document */}
      <div style={{ position: 'absolute', left: HALF + (HALF - DOC.w) / 2, top: PILE_TOP - 10, width: DOC.w, height: DOC.h, opacity: Math.min(1, rightIn * 1.3), transform: `scale(${0.94 + 0.06 * Math.min(1, rightIn)})`, ...dimStyle(rightDim) }}>
        <Sheet width={DOC.w} height={DOC.h} tone={C.cyan} glow={attestHead * 0.5}>
          <div style={{ position: 'absolute', left: 28, top: 24, right: 28, display: 'flex', alignItems: 'center', gap: 16 }}>
            <Icon name="shield" size={44} color={C.cyan} strokeWidth={2} />
            <Bars widths={[100, 62]} gap={10} h={10} style={{ flex: 1 }} />
          </div>
          {/* fecha: an empty box, nothing is dated */}
          <div style={{ position: 'absolute', left: 28, top: 88, right: 28, opacity: dateBox }}>
            <Field label="fecha">
              <SignatureGap width={150} height={38} />
            </Field>
          </div>
          <div style={{ position: 'absolute', left: 28, top: 150, right: 28, opacity: scopeRow, transform: `translateY(${(1 - scopeRow) * 10}px)` }}>
            <Field label="alcance">
              <Value>los controles del programa</Value>
            </Field>
          </div>
          <div style={{ position: 'absolute', left: 28, top: 212, right: 28, opacity: periodRow, transform: `translateY(${(1 - periodRow) * 10}px)` }}>
            <Field label="periodo">
              <Value>los últimos doce meses</Value>
            </Field>
          </div>
          <div style={{ position: 'absolute', left: 28, right: 28, bottom: 16, height: 84 }}>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 26, height: 3, borderRadius: 2, background: alpha(C.text, 0.4) }} />
            <div style={{ position: 'absolute', left: 14, bottom: 8 }}>
              <Signature p={sig} variant={2} width={200} color={C.cyanSoft} strokeWidth={2.8} />
            </div>
            <div style={{ position: 'absolute', right: 0, bottom: 0, fontFamily: FONT.sans, fontSize: 26, fontWeight: 650, color: C.muted, opacity: progress(frame, signAt - 6, 12) }}>la dirección</div>
          </div>
        </Sheet>
      </div>

      {/* Chips under the piles */}
      <div style={{ position: 'absolute', left: 0, top: CHIP_TOP, width: HALF, display: 'flex', justifyContent: 'center', opacity: policyIn, transform: `translateY(${(1 - policyIn) * 12}px)`, ...dimStyle(leftDim) }}>
        <Pill text="política de uso aceptable" icon="file" tone={C.sky} size={32} height={56} />
      </div>
      {frame >= attestWord - 2 ? (
        <div style={{ position: 'absolute', left: HALF, top: CHIP_TOP, width: HALF, display: 'flex', justifyContent: 'center', ...chipIn, ...dimStyle(rightDim) }}>
          <Pill text="management attestation" icon="flag" tone={C.cyan} size={32} height={56} on={1} />
        </div>
      ) : null}

      {/* The question that is not answered with another signature */}
      {frame >= notAt - 4 ? (
        <div style={{ position: 'absolute', left: 0, top: BUBBLE_TOP, width: W, display: 'flex', justifyContent: 'center', opacity: Math.min(1, bubble * 1.4), transform: `translateY(${(1 - Math.min(1, bubble)) * 16}px)` }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 30, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
            <div style={{ height: 72, padding: '0 36px', display: 'inline-flex', alignItems: 'center', borderRadius: RADIUS.pill, border: `3px solid ${alpha(C.amber, 0.85)}`, background: alpha(C.amber, 0.1), fontSize: 46, fontWeight: 850, color: C.textStrong }}>
              «¿y funciona?»
            </div>
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 14, fontSize: 40, fontWeight: 750, color: C.muted }}>
              <Signature p={1} variant={1} width={110} color={alpha(C.muted, 0.9)} strokeWidth={3} />
              <span>otra firma</span>
              <div style={{ position: 'absolute', left: -8, right: -8, top: '50%', height: 5, borderRadius: 3, background: C.rose, transform: `scaleX(${strike}) rotate(-3deg)`, transformOrigin: '0 50%' }} />
            </div>
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT.sans }}>
      <div style={{ width: 96, fontSize: 26, fontWeight: 650, color: C.muted }}>{label}</div>
      {children}
    </div>
  );
}

function Value({ children }: { children: ReactNode }) {
  return <div style={{ fontSize: 30, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>{children}</div>;
}
