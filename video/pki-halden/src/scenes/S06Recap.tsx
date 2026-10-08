import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { BrandMark } from '../../../engine/src/overlay/ChapterRail';
import { isElevenLabsVoice } from '../../../engine/src/timeline/voice';
import { C, FONT, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { END, NEXT, RULES, type RecapLine, type RuleArt } from '../data/s06-recap';
import { TIMELINE } from '../timeline/load';
import { AnchorChain, anchorChainPoints, anchorChainSize } from './parts/AnchorChain';
import { CaSeal } from './parts/CaSeal';
import { StapledPair, stapledPairLayout } from './parts/Hotel';
import { RevokeGhost } from './parts/s06-recap/RevokeGhost';
import { Stage, wordFrame } from './kit';

const S = 's06-recap';
const W = STAGE.width;
const CARDS_TOP = 12;
const CARDS_H = 520;
const NEXT_TOP = 546;
const ART_H = 190;

const EXAM_TEXT = '#c4b5fd';

/** One sub line: words in capitals are exam terms (violet), trailing punctuation aside. */
function Line({ line, show }: { line: RecapLine; show: number }) {
  return (
    <div style={{ color: line.strong ? C.textStrong : C.text, fontWeight: line.strong ? 800 : 650, opacity: show }}>
      {line.text.split(' ').map((w, k) => {
        const m = /^([A-ZÁÉÍÓÚÑ]{2,})(\W*)$/.exec(w);
        return (
          <span key={k}>
            {k ? ' ' : ''}
            {m ? (
              <>
                <span style={{ color: EXAM_TEXT, fontWeight: 850 }}>{m[1]}</span>
                {m[2]}
              </>
            ) : (
              w
            )}
          </span>
        );
      })}
    </div>
  );
}

/** Per-rule moments for the art (local frames). */
interface ArtTimes {
  /** The card lights. */
  at: number;
  /** Rule 1: the middle link arrives («el servidor manda la intermedia»); rule 2: the stamp lands; rule 3: the receipt slides in. */
  a: number;
  /** Rule 1: the chain validates («la raíz ya la tienes»); rule 3: the receipt «la trae el servidor». */
  b: number;
}

/** The card's illustration: the same drawings the video used. */
function RuleImage({ art, frame, t }: { art: RuleArt; frame: number; t: ArtTimes }): ReactNode {
  const draw = progress(frame, t.at - 4, 20, EASE.inOut);
  switch (art) {
    case 'chain': {
      // The anchor on its deck and the portal's link; the middle link arrives, then the whole chain holds.
      const middle = progress(frame, t.a, 14, EASE.inOut);
      const validated = progress(frame, t.b, 16, EASE.inOut);
      return <AnchorChain height={ART_H} anchor={1} deck={1} leaf={1} middle={middle} validated={validated} show={Math.min(1, 0.35 + draw)} middleShift={{ x: 0, y: -10 * (1 - middle) }} />;
    }
    case 'revoke':
      return <RevokeGhost width={380} frame={frame} at={t.a} show={Math.min(1, 0.35 + draw)} />;
    case 'note': {
      const L = stapledPairLayout(PAIR_DNI);
      return (
        <div style={{ width: L.w, height: L.h, opacity: Math.min(1, 0.35 + draw) }}>
          <StapledPair
            width={PAIR_DNI}
            receipt={progress(frame, t.a, 14, EASE.out)}
            staple={progress(frame, t.a + 10, 10, EASE.out)}
            glow={0.5 * progress(frame, t.b, 14)}
            seal={(size) => <CaSeal size={size} press={1} verdict="ok" check={progress(frame, t.b, 12)} />}
          />
        </div>
      );
    }
  }
}

/** The DNI's width in rule 3's pair (the pair is ~1.5× wider). */
const PAIR_DNI = 180;

/**
 * s06-recap «Tres reglas». Three numbered slots wait from the first frame
 * (the chapter wipe reveals them). Each rule card lights as the voice says it,
 * with the drawing the video gave it, and its three lines light on their own
 * words: the anchor chain («Emisor desconocido» — the middle link arrives on
 * «el servidor manda la intermedia» and the chain holds, emerald, on «la raíz
 * ya la tienes»); the REVOKE stamp on the ghost copy («Clave filtrada» — the
 * stamp lands on «revoca»); the justificante stapled to the DNI («La CRL puede
 * llegar tarde» — the receipt arrives on «stapling»). On `next` the cards
 * step back for «Tu turno: termina la lección y sus preguntas»; on `endcard`
 * the ALERTÓPOLIS end card (V11's layout, no lab line) — the chain, complete
 * and named, «PKI: la cadena y la revocación», «Arregla cadenas, no avisos»,
 * the objective and the CompTIA disclaimer — holds to the last frame.
 */
export function S06Recap(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const nextAt = props.cue('next');
  const endcardAt = props.cue('endcard');
  const reglasAt = Math.min(wordFrame(S, 's06-01', 'reglas') - 6, ruleAt[0] - 12);

  const boardOut = progress(frame, endcardAt - 14, 14, EASE.inOut);

  const lineAt = (seg: string, l: RecapLine, at: number) => Math.max(at + 4, wordFrame(S, seg, l.word, l.nth ?? 0) - 6);

  const art: ArtTimes[] = [
    { at: ruleAt[0], a: wordFrame(S, 's06-01', 'manda') - 6, b: wordFrame(S, 's06-01', 'raíz') - 4 },
    { at: ruleAt[1], a: wordFrame(S, 's06-02', 'revoca') - 4, b: wordFrame(S, 's06-02', 'revoca') - 4 },
    { at: ruleAt[2], a: wordFrame(S, 's06-03', 'stapling') - 6, b: wordFrame(S, 's06-03', 'trae') - 4 },
  ];

  const rules: RuleCardDef[] = RULES.map((r, i) => ({
    title: r.title,
    sub: (
      <div style={{ lineHeight: 1.22 }}>
        {r.sub.map((l, k) => (
          <Line key={k} line={l} show={0.25 + 0.75 * progress(frame, lineAt(r.seg, l, ruleAt[i]), 12)} />
        ))}
      </div>
    ),
    tone: 'cyan',
    at: ruleAt[i],
    art: <RuleImage art={r.art} frame={frame} t={art[i]} />,
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

/** The one next step: the lesson and its questions. */
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
          padding: '16px 34px 16px 26px',
          borderRadius: 32,
          background: alpha(C.cyan, 0.08),
          border: `3px solid ${alpha(C.cyan, 0.7)}`,
          boxShadow: `0 0 34px ${alpha(C.cyan, 0.22)}`,
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name="play" size={42} color={C.cyan} strokeWidth={2} />
        <span style={{ fontSize: 44, fontWeight: 850, color: C.textStrong }}>{NEXT}</span>
      </div>
    </div>
  );
}

const CARD_W = 1620;
const ART_W = 500;
const CHAIN_H = 440;
const CHAIN = anchorChainSize(CHAIN_H);
const CHAIN_PTS = anchorChainPoints(CHAIN_H);

/** The chain of the video, complete and holding, with its exam names (violet). */
function ChainNamed({ frame, at }: { frame: number; at: number }) {
  const names: { y: number; text: string }[] = [
    { y: CHAIN_PTS.anchor.y, text: 'ROOT CA' },
    { y: CHAIN_PTS.deck.y, text: 'TRUST STORE' },
    { y: CHAIN_PTS.middle.y, text: 'INTERMEDIATE CA' },
    { y: CHAIN_PTS.leaf.y, text: 'LEAF' },
  ];
  const validated = progress(frame, at + 4, 18, EASE.inOut);
  return (
    <div style={{ position: 'relative', width: ART_W, height: CHAIN_H }}>
      <div style={{ position: 'absolute', left: 0, top: 0 }}>
        <AnchorChain height={CHAIN_H} validated={validated} />
      </div>
      {names.map((n, i) => (
        <div
          key={n.text}
          style={{
            position: 'absolute',
            left: CHAIN.width + 22,
            top: n.y,
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: FONT.sans,
            fontSize: 26,
            fontWeight: 850,
            letterSpacing: 0.5,
            color: EXAM_TEXT,
            whiteSpace: 'nowrap',
            opacity: progress(frame, at + 10 + i * 4, 12),
          }}
        >
          <span style={{ width: 18, height: 3, borderRadius: 2, background: alpha(C.violet, 0.7) }} />
          {n.text}
        </div>
      ))}
    </div>
  );
}

/** Closing card: the chain, named; ALERTÓPOLIS, title, the remate, the next step, objective, disclaimer. */
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
        <ChainNamed frame={frame} at={at} />
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
        <div style={{ marginTop: 12, fontSize: 38, fontWeight: 800, color: '#6ee7b7', whiteSpace: 'nowrap', ...sub }}>{END.remate}</div>
        <div style={{ marginTop: 20, display: 'inline-flex', alignItems: 'center', gap: 14, fontSize: 36, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap', ...cta }}>
          <Icon name="play" size={34} color={C.cyan} strokeWidth={2} />
          {NEXT}
        </div>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10, ...chips }}>
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
