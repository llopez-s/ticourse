import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { ART_WORDS, CARD_NAME, HEAD, PASSPORT_NAME, RULES, type SubSpan } from '../data/s06-recap';
import { BoardingCard, Gate, ItemGlyph, Passport, Scanner, Suitcase } from './parts/Airport';
import { EndCard } from './parts/s06-recap/EndCard';
import { NextAction } from './parts/s06-recap/NextAction';
import { Stage, wordFrame } from './kit';

const S = 's06-recap';
const W = STAGE.width;
const CARDS_TOP = 84;
const CARDS_H = 450;
const NEXT_TOP = 552;
const ART_H = 170;
const VIOLET = '#c4b5fd';

const SPAN_COLOR: Record<NonNullable<SubSpan['tone']>, string> = {
  cyan: C.cyanSoft,
  violet: VIOLET,
  amber: C.amber,
  emerald: C.emerald,
};

/**
 * s06-recap «Tres reglas»: one big card per idea (engine RuleCards), lit as the voice says it (the previous
 * one steps back), each with an airport part as its picture:
 *   rule-1  the scanner and the gate with its magnifying glass — «YARA mira dentro; Sigma, lo que pasa» ·
 *           «Sigma se convierte antes de correr».
 *   rule-2  the suitcase with a bottle of water (what anybody carries); on «pieza» the rare engraved part
 *           lights beside it — «Lo corriente, solo, salta con cualquiera» · «pídele compañía o una pieza
 *           única: el PDB».
 *   rule-3  the passport (CertUtil.exe) in front of the renamed boarding card, which fades on «disco» — «El
 *           nombre original, no el del disco» · «lo que cuesta cambiar y vigila si salta».
 * On `next` the cards step back and «Tu turno: las preguntas de la lección (s5m3)» comes in under them; on
 * `endcard` the ALERTÓPOLIS end card takes the stage and holds to the last frame.
 */
export function S06Recap(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recapAt = props.cue('recap');
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const nextAt = props.cue('next');
  const endcardAt = props.cue('endcard');

  const boardOpacity = 1 - progress(frame, endcardAt - 14, 14, EASE.inOut);
  const nextDim = progress(frame, nextAt - 4, 14);
  const headIn = enter(frame, Math.min(recapAt - 10, 4), { distance: 14 });

  const pieceAt = Math.max(ruleAt[1] + 4, wordFrame(S, RULES[1].seg, ART_WORDS.piece) - 6);
  const piece = progress(frame, pieceAt, 16);
  const diskAt = Math.max(ruleAt[2] + 4, wordFrame(S, RULES[2].seg, ART_WORDS.disk) - 6);
  const disk = progress(frame, diskAt, 18);

  const art = [
    <div key="airport" style={{ display: 'flex', alignItems: 'flex-end', gap: 18 }}>
      <Scanner width={232} items={['bottle', 'umbrella', 'book']} />
      <Gate width={236} pass={1} write={1} lines={3} lens={1} />
    </div>,
    <div key="suitcase" style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
      <Suitcase width={190} contents={['bottle']} tone={C.sky} />
      <div style={{ opacity: 0.25 + 0.75 * piece, transform: `scale(${0.85 + 0.15 * piece})` }}>
        <ItemGlyph kind="rare" size={96} tone={piece > 0.5 ? C.emerald : '#cbd5e1'} glow={piece} />
      </div>
    </div>,
    <div key="passport" style={{ position: 'relative', width: 300, height: ART_H }}>
      <div style={{ position: 'absolute', left: -6, top: 60, transform: 'rotate(-6deg)' }}>
        <BoardingCard width={168} name={CARD_NAME} changed={1} dim={0.25 + 0.6 * disk} />
      </div>
      <div style={{ position: 'absolute', left: 184, top: 6 }}>
        <Passport width={116} name={PASSPORT_NAME} tone={C.emerald} glow={0.6} />
      </div>
    </div>,
  ];

  const sub = (spans: readonly SubSpan[], key: string) => (
    <span key={key}>
      {spans.map((s, k) => (
        <span key={k} style={s.tone ? { color: SPAN_COLOR[s.tone] } : undefined}>
          {s.text}
        </span>
      ))}
    </span>
  );

  const rules: RuleCardDef[] = RULES.map((r, i) => ({
    title: r.title,
    sub: [sub(r.sub[0], 'a'), sub(r.sub[1], 'b')] as const,
    tone: r.tone,
    at: ruleAt[i],
    art: art[i],
  }));

  return (
    <Stage>
      {boardOpacity > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: boardOpacity, fontFamily: FONT.sans }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, height: 64, ...headIn, opacity: headIn.opacity * (1 - 0.4 * nextDim) }}>
            <Icon name="flag" size={48} color={C.cyan} />
            <span style={{ fontSize: 50, fontWeight: 850, letterSpacing: -0.5, color: C.textStrong, whiteSpace: 'nowrap' }}>
              <span style={{ color: C.cyan }}>{HEAD.lead}</span>
              {HEAD.rest}
            </span>
          </div>
          <RuleCards
            rules={rules}
            width={W}
            height={CARDS_H}
            slotAt={2}
            dimFrom={nextAt}
            gap={24}
            subSize={32}
            artHeight={ART_H}
            frame={frame}
            fps={fps}
            style={{ position: 'absolute', left: 0, top: CARDS_TOP }}
          />
          <NextAction frame={frame} fps={fps} at={nextAt} top={NEXT_TOP} width={W} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcardAt} />
    </Stage>
  );
}

