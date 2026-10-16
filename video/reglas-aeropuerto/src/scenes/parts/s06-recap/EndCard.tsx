import { BrandMark } from '../../../../../engine/src/overlay/ChapterRail';
import { C, FONT, STAGE, TYPE, alpha } from '../../../../../engine/src/theme/tokens';
import { enter, progress, springIn } from '../../../../../engine/src/theme/motion';
import { Chip, Icon } from '../../../../../engine/src/ui';
import { isElevenLabsVoice } from '../../../../../engine/src/timeline/voice';
import { END, NEXT } from '../../../data/s06-recap';
import { TIMELINE } from '../../../timeline/load';
import { GATE_ASPECT, Gate, SCANNER_ASPECT, Scanner } from '../Airport';

const W = STAGE.width;
const CARD_W = 1600;
const ART_W = 300;

/** The video's one image: the scanner that looks inside, over the gate whose logbook Sigma reads. */
function AirportArt({ frame, at }: { frame: number; at: number }) {
  const lens = progress(frame, at, 20);
  return (
    <div style={{ position: 'relative', width: ART_W, height: ART_W * SCANNER_ASPECT + 22 + ART_W * GATE_ASPECT, flexShrink: 0 }}>
      <div style={{ position: 'absolute', left: -70, top: 20, width: ART_W + 140, height: 360, background: `radial-gradient(closest-side, ${alpha(C.cyan, 0.13)} 0%, transparent 100%)` }} />
      <div style={{ position: 'absolute', left: 0, top: 0 }}>
        <Scanner width={ART_W} items={['bottle', 'umbrella', 'book']} />
      </div>
      <div style={{ position: 'absolute', left: 0, top: ART_W * SCANNER_ASPECT + 22 }}>
        <Gate width={ART_W} pass={1} write={1} lines={3} lens={lens} />
      </div>
    </div>
  );
}

/**
 * Closing card (the series' layout, as in the recent GCTI capsules): the airport; ALERTÓPOLIS, the video's
 * title, the next step (the lesson's questions — no lab), the objective and the disclaimer. Everything is in
 * by `at` + ~35 and nothing moves or fades afterwards: it holds to the scene's last frame (the music tail).
 */
export function EndCard({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 8) return null;
  const cardIn = springIn(frame, fps, at - 6, { damping: 18 });
  const art = enter(frame, at - 4, { distance: 20 });
  const brand = enter(frame, at - 4, { distance: 16 });
  const title = enter(frame, at - 2, { distance: 24 });
  const sub = enter(frame, at + 2, { distance: 18 });
  const cta = enter(frame, at + 6, { distance: 18 });
  const chips = enter(frame, at + 10, { distance: 18 });
  const ruleDraw = progress(frame, at + 10, 18);
  const disclaimer = enter(frame, at + 14, { distance: 12 });
  const sentences = END.disclaimer.split('. ');
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
        gap: 72,
        padding: '0 56px 0 80px',
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
      <div style={art}>
        <AirportArt frame={frame} at={at + 6} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
          <BrandMark size={34} />
          <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
        </div>
        <div style={{ marginTop: 14, fontSize: 92, fontWeight: 850, letterSpacing: -2.4, lineHeight: 1.05, whiteSpace: 'nowrap', color: '#c4b5fd', ...title }}>{END.title}</div>
        <div style={{ marginTop: 6, fontSize: 52, fontWeight: 750, letterSpacing: -1, lineHeight: 1.12, color: C.textStrong, whiteSpace: 'nowrap', ...sub }}>{END.sub}</div>
        <div style={{ marginTop: 26, display: 'inline-flex', alignItems: 'center', gap: 14, fontSize: 38, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap', ...cta }}>
          <Icon name="play" size={36} color={C.cyan} strokeWidth={2} />
          {NEXT.text}
        </div>
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 16, ...chips }}>
          <Chip accent="cyan" icon="check" size={TYPE.small} solid>
            {NEXT.chip}
          </Chip>
          <Chip accent="violet" icon="mortarboard" size={TYPE.small}>
            {END.objective}
          </Chip>
        </div>
        <div style={{ marginTop: 22, width: 640 * ruleDraw, height: 2, background: C.ink700 }} />
        {/* One sentence per line, so the last word is never left alone on a second line */}
        <div style={{ marginTop: 12, fontSize: TYPE.small, fontWeight: 550, color: C.muted, lineHeight: 1.35, whiteSpace: 'nowrap', ...disclaimer }}>
          {sentences.map((s, k) => (
            <div key={k}>{k < sentences.length - 1 ? `${s}.` : s}</div>
          ))}
          {isElevenLabsVoice(TIMELINE.voice) ? <div>Voz: ElevenLabs.</div> : null}
        </div>
      </div>
    </div>
  );
}
