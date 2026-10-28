import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Stage, wordFrame } from './kit';
import { PROGRAM, RAW, UPLOAD_SITE_IP } from './parts/data';
import { ALLOW_MEANING, BYTES_MEANING, GAPS, HYPOTHESES } from './parts/data-b';
import { CaseStamp } from './parts/CaseStamp';
import { RawText } from './parts/RawLines';
import { SourceTag } from './parts/Ruler';

const S = 's09-megas';

// ---- Layout (stage-local). Nothing above y 240 until the thinking pause is over: the prompt owns the top centre.
const PANEL = { top: 246, h: 190 } as const;
const CALLOUT = { top: 452, h: 124 } as const;
const ALLOW_COLOR = C.textStrong;
const BYTES_COLOR = C.sky;

const GAP_CARD_W = (1728 - 2 * 24) / 3;

/** A gap in the evidence: an empty card with a question mark, dashed amber. */
function GapCard({ index, text, on }: { index: number; text: string; on: number }) {
  const pieces = text.split(new RegExp(`(${PROGRAM.replace('.', '\\.')}|${UPLOAD_SITE_IP.replace(/\./g, '\\.')})`));
  return (
    <div
      style={{
        position: 'absolute',
        left: index * (GAP_CARD_W + 24),
        top: CALLOUT.top,
        width: GAP_CARD_W,
        height: CALLOUT.h,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '0 22px',
        borderRadius: RADIUS.md,
        border: `3px dashed ${alpha(C.amber, 0.75)}`,
        background: alpha(C.amber, 0.06),
        fontFamily: FONT.sans,
        opacity: on,
        transform: `translateY(${(1 - on) * 16}px)`,
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: 58,
          height: 58,
          borderRadius: 29,
          border: `3px dashed ${alpha(C.amber, 0.8)}`,
          display: 'grid',
          placeItems: 'center',
          fontSize: 38,
          fontWeight: 850,
          color: C.amber,
        }}
      >
        ?
      </div>
      <div style={{ fontSize: 33, fontWeight: 650, lineHeight: 1.22, color: C.textStrong }}>
        {pieces.map((p, i) =>
          p === PROGRAM || p === UPLOAD_SITE_IP ? (
            <span key={i} style={{ fontFamily: FONT.mono, fontSize: 30, fontWeight: 700 }}>
              {p}
            </span>
          ) : (
            <span key={i}>{p}</span>
          ),
        )}
      </div>
    </div>
  );
}

/**
 * s09-megas «Cuarenta y seis megas». The firewall's line, enlarged (`allow`): `action=ALLOW` boxed in white (never
 * alarm-coloured), `bytes_out=46180352` in sky once the voice says the figure. The thinking pause (`ask2`) leaves the
 * top band free. After the answer: `meaning` labels ALLOW «decisión de paso», `bytes` labels bytes_out «cuánto, no qué».
 * `maybe`: the two hypotheses of s08 are still standing, neither struck. `gaps`, `gap1`..`gap3`: three empty cards
 * of missing evidence replace the labels.
 */
export function S09Megas(props: SceneProps) {
  const frame = useCurrentFrame();
  const allowAt = props.cue('allow');
  props.cue('ask2'); // the thinking pause is the engine's; the scene only keeps the top band clear until it ends
  const meaningAt = props.cue('meaning');
  const bytesAt = props.cue('bytes');
  const maybeAt = props.cue('maybe');
  const gapsAt = props.cue('gaps');
  const gapAt = [props.cue('gap1'), props.cue('gap2'), props.cue('gap3')];

  const megasAt = Math.max(allowAt + 18, wordFrame(S, 's09-01', 'cuarenta') - 6);
  const panelOn = progress(frame, allowAt - 2, 18);
  const allowBox = progress(frame, allowAt + 4, 16);
  const bytesBox = progress(frame, megasAt, 16);
  // The boxes stay while the labels explain them; at the end they step back a little.
  const labelOut = 1 - progress(frame, gapsAt - 6, 12);
  const meaningOn = progress(frame, meaningAt - 2, 16) * labelOut;
  const bytesOn = progress(frame, bytesAt - 2, 16) * labelOut;
  const hypOn = [progress(frame, maybeAt - 2, 16), progress(frame, maybeAt + 8, 16)];
  const gapOn = gapAt.map((t) => progress(frame, t - 2, 16));

  return (
    <Stage>
      {/* the hypotheses of s08, still standing (they arrive after the pause, so the top band is free during it) */}
      {HYPOTHESES.map((h, k) => (
        <div
          key={h.id}
          style={{
            position: 'absolute',
            left: 0,
            top: 6 + k * 76,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '8px 24px 8px 10px',
            borderRadius: RADIUS.pill,
            border: `3px solid ${alpha(C.amber, 0.6)}`,
            background: alpha(C.amber, 0.08),
            fontFamily: FONT.sans,
            fontSize: 32,
            fontWeight: 650,
            color: C.textStrong,
            whiteSpace: 'nowrap',
            opacity: hypOn[k],
            transform: `translateX(${(1 - hypOn[k]) * -24}px)`,
          }}
        >
          <span style={{ width: 52, height: 52, borderRadius: 26, display: 'grid', placeItems: 'center', background: alpha(C.amber, 0.2), border: `3px solid ${C.amber}`, fontSize: 26, fontWeight: 850, color: C.amber }}>{h.id}</span>
          {h.text}
        </div>
      ))}

      {/* the firewall's line, enlarged */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: PANEL.top,
          width: 1728,
          height: PANEL.h,
          boxSizing: 'border-box',
          padding: '16px 28px',
          borderRadius: RADIUS.lg,
          border: `3px solid ${alpha(C.cyan, 0.55)}`,
          background: alpha(C.ink850, 0.97),
          opacity: panelOn,
          transform: `translateY(${(1 - panelOn) * 18}px)`,
        }}
      >
        <SourceTag id="firewall" size={32} />
        <RawText
          line={RAW.firewall[0]}
          size={32}
          marks={{ action: { w: allowBox, tone: ALLOW_COLOR }, bytes_out: { w: bytesBox, tone: BYTES_COLOR } }}
          style={{ marginTop: 14, lineHeight: 1.55 }}
        />
      </div>

      {/* what the two fields mean (after the answer) */}
      {[
        { key: 'allow', left: 0, on: meaningOn, color: ALLOW_COLOR, field: 'action=ALLOW', text: ALLOW_MEANING },
        { key: 'bytes', left: 876, on: bytesOn, color: BYTES_COLOR, field: 'bytes_out=46180352', text: BYTES_MEANING },
      ].map((c) => (
        <div
          key={c.key}
          style={{
            position: 'absolute',
            left: c.left,
            top: CALLOUT.top,
            width: 852,
            height: CALLOUT.h,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 30px',
            borderRadius: RADIUS.md,
            border: `3px solid ${alpha(c.color, 0.85)}`,
            background: alpha(c.color, 0.08),
            fontFamily: FONT.sans,
            opacity: c.on,
            transform: `translateY(${(1 - c.on) * 16}px)`,
          }}
        >
          <div style={{ fontFamily: FONT.mono, fontSize: 32, fontWeight: 700, color: c.color }}>{c.field}</div>
          <div style={{ fontSize: 50, fontWeight: 850, color: C.textStrong, lineHeight: 1.15 }}>{c.text}</div>
        </div>
      ))}

      {/* the three gaps in the evidence */}
      {GAPS.map((g, k) => (
        <GapCard key={g.id} index={k} text={g.text} on={gapOn[k]} />
      ))}

      <CaseStamp frame={frame} />
    </Stage>
  );
}
