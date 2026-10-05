import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { BrandMark } from '../../../engine/src/overlay/ChapterRail';
import { isElevenLabsVoice } from '../../../engine/src/timeline/voice';
import { C, FONT, RADIUS, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { END, LAB, NEXT, RULES, type RecapLine, type RuleArt } from '../data/s10-recap';
import { TIMELINE } from '../timeline/load';
import { FingerprintGlyph } from './parts/Fingerprint';
import { Mailbox } from './parts/Mailbox';
import { SealPattern, WaxSeal } from './parts/WaxSeal';
import { TLS_CHIPS, TLS_PARTS, TlsChip, type TlsPart } from './parts/TlsLine';
import { PaintIcon, PaintKey } from './parts/PaintMix';
import { Stage, wordFrame } from './kit';

const S = 's10-recap';
const W = STAGE.width;
const CARDS_TOP = 12;
const CARDS_H = 482;
const NEXT_TOP = 512;
const ART_H = 178;

/** Where each rule's second half starts: the word of its sub line 2, and of its second image. */
const SECOND = [
  { seg: 's10-01', line: 'sepa', art: 'sello' },
  { seg: 's10-02', line: 'contraseñas', art: 'contraseñas' },
  { seg: 's10-03', line: 'Eso', art: 'simétrica' },
] as const;

const LINE_COLOR: Record<NonNullable<RecapLine['tone']>, string> = {
  naviera: '#6ee7b7',
  puerto: C.cyanSoft,
  exam: '#c4b5fd',
};

/** One sub line; words in capitals are exam terms (violet) unless the line has its own colour. */
function Line({ line, show = 1 }: { line: RecapLine; show?: number }) {
  if (line.tone) return <span style={{ color: LINE_COLOR[line.tone], fontWeight: line.tone === 'exam' ? 850 : 750, opacity: show }}>{line.text}</span>;
  return (
    <span style={{ color: C.text, fontWeight: 650, opacity: show }}>
      {line.text.split(' ').map((w, k) => (
        <span key={k} style={/^[A-Z]{2,}$/.test(w) ? { color: LINE_COLOR.exam, fontWeight: 850 } : undefined}>
          {k ? ' ' : ''}
          {w}
        </span>
      ))}
    </span>
  );
}

/** The card's illustration: the same drawings the video used (buzón y sello · huella · pintura y llave). */
function RuleImage({ art, draw, second }: { art: RuleArt; draw: number; second: number }): ReactNode {
  switch (art) {
    case 'mailbox-seal':
      // Her mailbox on «buzón»; the port's seal lands on «sello».
      return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 30 }}>
          <Mailbox width={108} mini slotGlow={0.5 * draw} />
          <div style={{ position: 'relative', width: 136, height: 136 }}>
            {/* The seal's design waits from the start; the wax lands on «sello». */}
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', opacity: (0.45 + 0.55 * draw) * (1 - 0.85 * second) }}>
              <SealPattern size={120} />
            </div>
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
              <WaxSeal size={136} press={second} />
            </div>
          </div>
        </div>
      );
    case 'fingerprint':
      return <FingerprintGlyph size={160} draw={draw} glow={0.4 * draw} />;
    case 'paint-key':
      // The paint (the asymmetric agreement) and the key it yields (the symmetric rest).
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ opacity: Math.min(1, 0.3 + draw) }}>
            <PaintIcon size={140} glow={0.5 * draw} />
          </div>
          <div style={{ opacity: Math.min(1, 0.25 + second) }}>
            <PaintKey width={150} side="naviera" glow={0.5 * second} />
          </div>
        </div>
      );
  }
}

/**
 * s10-recap «Tres reglas». Three numbered slots wait from the first frame;
 * each rule card lights as the voice says it, with the drawing the video gave
 * it — her mailbox and the port's seal («cifras con SU pública · firmas con
 * TU privada»), the fingerprint («un hash no se descifra · SALT · KEY
 * STRETCHING»), the paint and the house key («la asimétrica acuerda y sella
 * · la simétrica cifra el resto · eso es TLS»). On `next` the cards step back
 * for the one next step, «Ahora te toca: el laboratorio Crypto Toolbox»; on
 * `endcard` the ALERTÓPOLIS end card — the line of the video, read: its four
 * chips stacked and lit — holds to the last frame, with the lab, the
 * objective (Security+ SY0-701 · 1.4) and the CompTIA disclaimer.
 */
export function S10Recap(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const nextAt = props.cue('next');
  const endcardAt = props.cue('endcard');
  // The slots are there from the first frame; «reglas» only nudges them.
  const reglasAt = Math.min(wordFrame(S, 's10-01', 'reglas') - 6, ruleAt[0] - 12);

  const boardOut = progress(frame, endcardAt - 14, 14, EASE.inOut);

  // Each rule's second half lands on its own words (the seal on «sello», the exam names on «contraseñas»…).
  const second = SECOND.map((w, i) => ({
    line: Math.max(ruleAt[i] + 8, wordFrame(S, w.seg, w.line) - 4),
    art: Math.max(ruleAt[i] + 8, wordFrame(S, w.seg, w.art) - 6),
  }));

  const rules: RuleCardDef[] = RULES.map((r, i) => ({
    title: r.title,
    sub: [<Line key="a" line={r.sub[0]} />, <Line key="b" line={r.sub[1]} show={0.25 + 0.75 * progress(frame, second[i].line, 12)} />],
    tone: 'cyan',
    at: ruleAt[i],
    art: (
      <RuleImage
        art={r.art}
        draw={progress(frame, ruleAt[i] - 4, 24, EASE.inOut)}
        second={progress(frame, second[i].art, 16, EASE.inOut)}
      />
    ),
  }));

  return (
    <Stage>
      {boardOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - boardOut, fontFamily: FONT.sans }}>
          <RuleCards
            rules={rules}
            width={W}
            height={CARDS_H}
            gap={24}
            slotAt={Math.min(-14, reglasAt - 40)}
            dimFrom={nextAt}
            subSize={32}
            artHeight={ART_H}
            frame={frame}
            fps={fps}
            style={{ position: 'absolute', left: 0, top: CARDS_TOP }}
          />
          <NextAction frame={frame} fps={fps} at={nextAt} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcardAt} />
    </Stage>
  );
}

/** The one next step: the Crypto Toolbox lab. */
function NextAction({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 6) return null;
  const p = springIn(frame, fps, at - 4, { damping: 16 });
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: NEXT_TOP,
        width: W,
        display: 'flex',
        justifyContent: 'center',
        opacity: Math.min(1, p * 1.4),
        transform: `translateY(${(1 - Math.min(1, p)) * 18}px)`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          padding: '16px 20px 16px 26px',
          borderRadius: 32,
          background: alpha(C.cyan, 0.08),
          border: `3px solid ${alpha(C.cyan, 0.7)}`,
          boxShadow: `0 0 34px ${alpha(C.cyan, 0.22)}`,
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name="play" size={42} color={C.cyan} strokeWidth={2} />
        <span style={{ fontSize: 44, fontWeight: 850, color: C.textStrong }}>{NEXT}</span>
        <span
          style={{
            padding: '8px 20px',
            borderRadius: RADIUS.pill,
            background: alpha(C.cyan, 0.16),
            border: `2px solid ${alpha(C.cyan, 0.55)}`,
            fontSize: 32,
            fontWeight: 800,
            color: C.cyanSoft,
          }}
        >
          {LAB}
        </span>
      </div>
    </div>
  );
}

const CARD_W = 1620;
const ART_W = 470;
const CHIP_SIZE = 32;

/** The line of the video, read: its four chips stacked, each lit in its colour. */
function LineRead({ frame, at }: { frame: number; at: number }) {
  const light = Object.fromEntries(TLS_PARTS.map((p, i) => [p, progress(frame, at + 6 + i * 4, 14)])) as Record<TlsPart, number>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14 }}>
      <span style={{ fontFamily: FONT.mono, fontSize: 24, fontWeight: 650, color: C.faint, marginLeft: 4 }}>SSL connection using</span>
      {TLS_CHIPS.map((c) => (
        <TlsChip key={c.id} id={c.id} size={CHIP_SIZE} light={light} frame={frame} />
      ))}
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontFamily: FONT.mono, fontSize: 24, fontWeight: 650, color: '#6ee7b7', marginLeft: 4, opacity: progress(frame, at + 26, 12) }}>
        <Icon name="check" size={26} color={C.emerald} strokeWidth={2.4} />
        SSL certificate verify ok
      </span>
    </div>
  );
}

/** Closing card: the line, read; ALERTÓPOLIS, title, the lab, objective, disclaimer. */
function EndCard({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 8) return null;
  const cardIn = springIn(frame, fps, at - 6, { damping: 18 });
  const art = enter(frame, at, { distance: 20 });
  const brand = enter(frame, at - 2, { distance: 16 });
  const title = enter(frame, at + 2, { distance: 24 });
  const sub = enter(frame, at + 6, { distance: 18 });
  const cta = enter(frame, at + 10, { distance: 18 });
  const chips = enter(frame, at + 14, { distance: 18 });
  const ruleDraw = progress(frame, at + 14, 18);
  const disclaimer = enter(frame, at + 20, { distance: 12 });
  return (
    <div
      style={{
        position: 'absolute',
        left: (W - CARD_W) / 2,
        top: 24,
        width: CARD_W,
        height: STAGE.height - 48,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 54,
        padding: '0 56px',
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
      <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 4, background: `linear-gradient(90deg, transparent 0%, ${C.cyan} 50%, transparent 100%)`, opacity: 0.8 }} />
      <div style={{ flexShrink: 0, width: ART_W, ...art }}>
        <LineRead frame={frame} at={at} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
          <BrandMark size={34} />
          <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
        </div>
        <div style={{ marginTop: 14, fontSize: 64, fontWeight: 850, letterSpacing: -1.6, lineHeight: 1.05, color: C.textStrong, whiteSpace: 'nowrap', ...title }}>
          <div style={{ color: C.cyan }}>{END.title[0]}</div>
          <div>{END.title[1]}</div>
        </div>
        <div style={{ marginTop: 8, fontSize: 36, fontWeight: 650, color: C.text, whiteSpace: 'nowrap', ...sub }}>{END.sub}</div>
        <div style={{ marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 14, fontSize: 36, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap', ...cta }}>
          <Icon name="play" size={34} color={C.cyan} strokeWidth={2} />
          {NEXT}
        </div>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, ...chips }}>
          <Chip accent="cyan" icon="check" size={TYPE.label}>
            {END.lab}
          </Chip>
          <Chip accent="violet" icon="mortarboard" size={TYPE.label}>
            {END.objective}
          </Chip>
        </div>
        <div style={{ marginTop: 20, width: 640 * ruleDraw, height: 2, background: C.ink700 }} />
        <div style={{ marginTop: 14, width: 900, fontSize: TYPE.small, fontWeight: 550, color: C.muted, lineHeight: 1.35, ...disclaimer }}>
          {END.disclaimer}
          {isElevenLabsVoice(TIMELINE.voice) ? (
            <>
              <br />
              Voz: ElevenLabs.
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
