import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { mix, tone as toneOf, windowWeight } from '../../../engine/src/ui';
import { IncomingCard } from './parts/IncomingCard';
import { NeighbourNote, type NoteLineId } from './parts/NeighbourNote';
import { StixJson, stixLineBox, type StixFocus, type StixKey } from './parts/StixJson';
import { CAL_H, CAL_W, CalendarStrip } from './parts/s02-lectura/Calendar';
import { LENS_H, LENS_TONE, Lens, type LensField } from './parts/s02-lectura/Lens';
import { Stage, segment, wordFrame } from './kit';

const S = 's02-lectura';
const W = 1728;
const H = 660;

// The JSON on the left, full height.
const JSON_BOX = { x: 0, y: 36, w: 980 } as const;
// Right column: the lens (fields), then the note with the calendar under it.
const LENS_X = 1030;
const NOTE_W = 600;
const NOTE_POS = { x: W - NOTE_W - 30, y: 14 } as const;
const CAL_POS = { x: NOTE_POS.x + (NOTE_W - CAL_W) / 2, y: H - CAL_H - 4 } as const;
// Where s01 leaves the incoming card (inside the small TIP), so the scene opens on it.
const S01_CARD = { x: 158, y: 125, w: 502 } as const;
// Step back for the think prompt: everything shrinks to the bottom centre (top stays below y 230).
const BACK_SCALE = 0.62;

const LENS_KEY: Record<LensField, StixKey> = {
  type: 'type',
  spec: 'spec_version',
  pattern: 'pattern',
  source: 'created_by_ref',
  confidence: 'confidence',
  tlp: 'object_marking_refs',
};

/**
 * Stage-local vertical centre of a JSON line, and where a link leaves it: the
 * right end of its highlight band (past the text even when the lit line grows).
 */
function lineAnchor(key: StixKey): { cy: number; right: number } {
  const b = stixLineBox(key, JSON_BOX.w);
  return { cy: JSON_BOX.y + b.cy, right: JSON_BOX.x + JSON_BOX.w - 14 };
}

/**
 * s02-lectura «Lo que trae el aviso». The incoming card opens into the STIX
 * JSON. One field at a time is lit (the rest dimmed) and a lens beside it
 * repeats it readable with its plain reading: the pattern (the domain), «quién
 * lo dice: el ISAC», «70 sobre 100», «solo dentro de Meridian». Then the
 * neighbours' note fills in step with the same fields, valid_until meets a
 * calendar (25-06) and today lights up (02-07). For the think prompt the whole
 * board steps back to the bottom so the top centre is free.
 */
export function S02Lectura(props: SceneProps) {
  const frame = useCurrentFrame();

  const jsonAt = props.cue('json');
  const patternAt = props.cue('pattern');
  const sourceAt = props.cue('source');
  const confidenceAt = props.cue('confidence');
  const tlpAt = props.cue('tlp');
  const contextAt = props.cue('context');
  const untilAt = props.cue('until');
  const todayAt = props.cue('today');
  const s6 = segment(props, 's02-06');

  const wIndicador = wordFrame(S, 's02-01', 'indicador') - 4;
  const wFormato = wordFrame(S, 's02-01', 'formato') - 4;
  const wStix = wordFrame(S, 's02-01', 'STIX') - 4;
  const wTimador = wordFrame(S, 's02-04', 'timador') - 4;
  const wQuien = wordFrame(S, 's02-04', 'quién', 0) - 4;
  const wSi = wordFrame(S, 's02-04', 'si') - 4;
  const wContar = wordFrame(S, 's02-04', 'quién', 1) - 6;
  const wCaduca = wordFrame(S, 's02-05', 'caduca') - 4;
  const stepAt = wordFrame(S, 's02-06', 'bloqueas') - 10;
  const lensOut = contextAt - 6;

  // ---- Focus windows (JSON) and the matching note lines.
  const focus: StixFocus[] = [
    { key: 'type', from: wIndicador, to: wFormato },
    { key: 'spec_version', from: wFormato, to: patternAt, tone: 'violet' },
    { key: 'pattern', from: patternAt, to: sourceAt, tone: 'rose' },
    { key: 'created_by_ref', from: sourceAt, to: confidenceAt },
    { key: 'confidence', from: confidenceAt, to: tlpAt },
    { key: 'object_marking_refs', from: tlpAt, to: lensOut, tone: 'amber' },
    // In step with the note.
    { key: 'pattern', from: wTimador, to: wQuien, tone: 'rose' },
    { key: 'created_by_ref', from: wQuien, to: wSi },
    { key: 'confidence', from: wSi, to: wContar },
    { key: 'object_marking_refs', from: wContar, to: untilAt, tone: 'amber' },
    { key: 'valid_until', from: untilAt, to: stepAt, tone: 'amber' },
  ];
  const noteLines: Partial<Record<NoteLineId, number>> = { number: wTimador, source: wQuien, confidence: wSi, share: wContar, until: wCaduca };
  const noteFocus = [
    { id: 'number' as const, from: wTimador, to: wQuien },
    { id: 'source' as const, from: wQuien, to: wSi },
    { id: 'confidence' as const, from: wSi, to: wContar },
    { id: 'share' as const, from: wContar, to: untilAt },
    { id: 'until' as const, from: wCaduca, to: stepAt },
  ];

  // ---- Lens: one field at a time, before the note arrives.
  const lensWin: Record<LensField, [number, number]> = {
    type: [wIndicador, wFormato],
    spec: [wFormato, patternAt],
    pattern: [patternAt, sourceAt],
    source: [sourceAt, confidenceAt],
    confidence: [confidenceAt, tlpAt],
    tlp: [tlpAt, lensOut],
  };
  const weights = {} as Record<LensField, number>;
  (Object.keys(lensWin) as LensField[]).forEach((f) => {
    weights[f] = windowWeight(frame, lensWin[f][0], lensWin[f][1], { ramp: 10, lead: 4 });
  });
  const wSum = Object.values(weights).reduce((a, b) => a + b, 0);
  const lensCy = wSum > 0.001 ? (Object.keys(weights) as LensField[]).reduce((y, f) => y + lineAnchor(LENS_KEY[f]).cy * weights[f], 0) / wSum : H / 2;
  const lensTop = Math.max(0, Math.min(H - LENS_H, lensCy - LENS_H / 2));
  const lead = (Object.keys(weights) as LensField[]).reduce((a, b) => (weights[b] > weights[a] ? b : a));
  const leadLine = lineAnchor(LENS_KEY[lead]);

  // ---- Opening: the card from s01, then the JSON.
  const cardOut = progress(frame, jsonAt - 6, 12, EASE.inOut);
  const headerGlow = windowWeight(frame, wStix, patternAt, { ramp: 10 });

  // ---- Calendar and the valid_until link.
  const untilLine = lineAnchor('valid_until');
  const linkIn = progress(frame, untilAt + 6, 16, EASE.inOut);
  const expiredGlow = windowWeight(frame, s6.from - 4, stepAt + 20, { ramp: 10 });

  // ---- Step back for the think prompt.
  const back = progress(frame, stepAt, 24, EASE.inOut);
  const groupScale = mix(1, BACK_SCALE, back);

  return (
    <Stage>
      {/* The incoming card, where s01 left it; it opens into the JSON */}
      {cardOut < 1 ? (
        <div style={{ position: 'absolute', left: S01_CARD.x, top: S01_CARD.y, opacity: 1 - cardOut, transform: `scale(${1 + 0.15 * cardOut})`, transformOrigin: '0 0' }}>
          <IncomingCard width={S01_CARD.w} frame={frame} />
        </div>
      ) : null}

      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `scale(${groupScale})`, transformOrigin: `${W / 2}px ${H}px`, opacity: 1 - 0.55 * back }}>
        {/* The JSON */}
        <div style={{ position: 'absolute', left: JSON_BOX.x, top: JSON_BOX.y }}>
          <StixJson at={jsonAt - 6} width={JSON_BOX.w} focus={focus} glow={headerGlow} frame={frame} />
        </div>

        {/* Lens + its link to the lit line */}
        {wSum > 0.01 ? (
          <>
            <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: Math.min(1, wSum) }}>
              <path
                d={`M ${leadLine.right} ${leadLine.cy} C ${leadLine.right + 30} ${leadLine.cy}, ${LENS_X - 30} ${lensTop + LENS_H / 2}, ${LENS_X} ${lensTop + LENS_H / 2}`}
                fill="none"
                stroke={alpha(toneOf(LENS_TONE[lead]).fg, 0.85)}
                strokeWidth={4}
                strokeLinecap="round"
              />
              <circle cx={leadLine.right} cy={leadLine.cy} r={7} fill={toneOf(LENS_TONE[lead]).fg} />
            </svg>
            <div style={{ position: 'absolute', left: LENS_X, top: lensTop }}>
              <Lens weights={weights} />
            </div>
          </>
        ) : null}

        {/* The neighbours' note, filling in step */}
        <div style={{ position: 'absolute', left: NOTE_POS.x, top: NOTE_POS.y }}>
          <NeighbourNote at={contextAt - 4} lineAt={noteLines} focus={noteFocus} width={NOTE_W} frame={frame} />
        </div>

        {/* valid_until, next to the calendar */}
        {linkIn > 0 ? (
          <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {(() => {
              const x0 = untilLine.right;
              const y0 = untilLine.cy;
              const x1 = CAL_POS.x;
              const y1 = CAL_POS.y + 60;
              const d = `M ${x0} ${y0} C ${x0 + 160} ${y0}, ${x1 - 160} ${y1}, ${x1} ${y1}`;
              return (
                <>
                  <defs>
                    <mask id="s02-until-link" maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
                      <path d={d} fill="none" stroke="#ffffff" strokeWidth={12} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - linkIn} />
                    </mask>
                  </defs>
                  <path d={d} fill="none" stroke={alpha(C.amber, 0.85)} strokeWidth={4} strokeDasharray="12 10" strokeLinecap="round" mask="url(#s02-until-link)" />
                  <circle cx={x0} cy={y0} r={7} fill={C.amber} />
                </>
              );
            })()}
          </svg>
        ) : null}
        <div style={{ position: 'absolute', left: CAL_POS.x, top: CAL_POS.y }}>
          <CalendarStrip frame={frame} at={untilAt - 4} todayAt={todayAt + 2} expiredAt={todayAt + 10} expiredGlow={expiredGlow} />
        </div>
      </div>
    </Stage>
  );
}

