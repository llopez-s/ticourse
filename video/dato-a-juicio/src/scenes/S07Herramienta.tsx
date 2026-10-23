import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix, type IconName } from '../../../engine/src/ui';
import { FileArt, RodScene, Silhouette } from './parts/Glyphs';
import { Stage, wordFrame } from './kit';

const S = 's07-herramienta';
const W = STAGE.width;

const ROD_W = 700;

/**
 * s07-herramienta «La herramienta y quien la usa». EMBER FOX's message sits in the top band (clear for all of its lead and
 * the answer), so everything starts low: a file labelled «malware» enters on «fichero» and, on «quien lo usa», a faceless
 * silhouette. On `tool` the file gets its chapa «una parte de la capability» and the silhouette «adversario · persona con una
 * intención». On `rod` they make way for the fishing rod leaning alone by the water («malware» tagged on it); on «pescador» the
 * fisherman sits behind it and «dónde», «cuándo» and «con qué cebo» land beside the picture. On `human` the picture steps
 * aside for the row «actores · comportamientos · no solo ficheros» and, on «TTPs», «tácticas, técnicas y procedimientos = TTPs».
 * (The next scene keeps the same image.)
 */
export function S07Herramienta(props: SceneProps) {
  const frame = useCurrentFrame();
  const tool = props.cue('tool');
  const rod = props.cue('rod');
  const human = props.cue('human');

  // ---- Pair (file + silhouette).
  const fileAt = wordFrame(S, 's07-01', 'fichero') - 8;
  const whoAt = wordFrame(S, 's07-01', 'usa') - 8;
  const adversaryAt = wordFrame(S, 's07-02', 'adversario') - 8;
  const pairOut = progress(frame, rod - 8, 16, EASE.inOut);

  // ---- Rod.
  const rodAt = Math.max(rod + 4, wordFrame(S, 's07-03', 'caña') - 14);
  const fisherAt = wordFrame(S, 's07-03', 'pescador') - 6;
  const whereAt = wordFrame(S, 's07-03', 'dónde') - 8;
  const whenAt = wordFrame(S, 's07-03', 'cuándo') - 8;
  const baitAt = wordFrame(S, 's07-03', 'cebo') - 12;
  const rodDraw = progress(frame, rodAt, 24, EASE.inOut);
  const fisher = progress(frame, fisherAt, 20, EASE.out);
  const toSide = progress(frame, human - 8, 24, EASE.inOut);

  // ---- Human row.
  const row1 = progress(frame, human, 16);
  const ttpAt = wordFrame(S, 's07-05', 'TTPs') - 12;
  const row2 = progress(frame, wordFrame(S, 's07-05', 'tácticas') - 10, 16);
  const ttpLit = progress(frame, ttpAt, 12);

  return (
    <Stage>
      {/* The pair: file and silhouette, low (the top band is the intercept's) */}
      {pairOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - pairOut, fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', left: 150, top: 240, width: 560, textAlign: 'center', ...enter(frame, fileAt, { distance: 20 }) }}>
            <div style={{ position: 'relative', width: 200, height: 240, margin: '0 auto' }}>
              <FileArt width={200} color={C.rose} />
              <div style={{ position: 'absolute', left: 0, top: 120, width: 200, textAlign: 'center', fontFamily: FONT.mono, fontSize: 31, fontWeight: 800, color: '#fecdd3' }}>malware</div>
            </div>
            <Chapa at={tool} frame={frame} icon="gear" tone={C.rose}>
              una parte de la <b style={{ color: '#fecdd3' }}>capability</b>
            </Chapa>
          </div>
          <div style={{ position: 'absolute', left: 1000, top: 232, width: 560, textAlign: 'center', ...enter(frame, whoAt, { distance: 20 }) }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Silhouette width={200} />
            </div>
            <Chapa at={adversaryAt} frame={frame} icon="target" tone={C.rose} wrap>
              adversario · persona con una intención
            </Chapa>
          </div>
          {/* who uses it */}
          <svg width={W} height={STAGE.height} style={{ position: 'absolute', left: 0, top: 0, opacity: progress(frame, whoAt + 6, 16) }}>
            <line x1={980} y1={390} x2={760} y2={390} stroke={alpha(C.roseSoft, 0.8)} strokeWidth={5} strokeDasharray="4 14" strokeLinecap="round" />
            <path d="M776 372L752 390L776 408" fill="none" stroke={C.roseSoft} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      ) : null}

      {/* The rod, then (on `human`) it steps aside */}
      {frame >= rodAt - 4 ? (
        <div
          style={{
            position: 'absolute',
            left: mix(300, 10, toSide),
            top: mix(190, 226, toSide),
            width: ROD_W,
            height: Math.round(ROD_W * 0.66),
            transform: `scale(${mix(1, 0.84, toSide)})`,
            transformOrigin: '0 0',
            opacity: Math.min(1, progress(frame, rodAt - 4, 12)),
            fontFamily: FONT.sans,
          }}
        >
          <RodScene width={ROD_W} fisher={fisher} draw={rodDraw} />
          <Tag left={170} top={30} at={rodAt + 14} frame={frame} tone={C.rose}>
            malware
          </Tag>
          <Tag left={20} top={140} at={fisherAt + 10} frame={frame} tone={C.rose}>
            adversario
          </Tag>
        </div>
      ) : null}
      {frame >= whereAt - 4 && toSide < 1 ? (
        <div style={{ position: 'absolute', left: 1040, top: 240, display: 'flex', flexDirection: 'column', gap: 26, opacity: 1 - toSide }}>
          <Decide at={whereAt} frame={frame} icon="globe">
            dónde
          </Decide>
          <Decide at={whenAt} frame={frame} icon="clock">
            cuándo
          </Decide>
          <Decide at={baitAt} frame={frame} icon="target">
            con qué cebo
          </Decide>
        </div>
      ) : null}

      {/* The human row */}
      {row1 > 0 ? (
        <div style={{ position: 'absolute', left: 610, top: 218, width: W - 610, fontFamily: FONT.sans, opacity: row1, transform: `translateY(${(1 - row1) * 18}px)` }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28, alignItems: 'flex-start' }}>
            <Row icon="users" tone={C.rose}>
              actores
            </Row>
            <Row icon="eye" tone={C.rose}>
              comportamientos
            </Row>
            <Row icon="file" tone={C.faint} muted>
              no solo ficheros
            </Row>
          </div>
        </div>
      ) : null}
      {row2 > 0 ? (
        <div style={{ position: 'absolute', left: 610, top: 548, width: W - 610, fontFamily: FONT.sans, opacity: row2, transform: `translateY(${(1 - row2) * 18}px)` }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 20, padding: '10px 34px', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.cyan, 0.7)}`, background: alpha(C.cyan, 0.1), whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 40, fontWeight: 750, color: C.text }}>tácticas, técnicas y procedimientos</span>
            <span style={{ fontSize: 44, fontWeight: 700, color: C.muted }}>=</span>
            <span style={{ fontSize: 58, fontWeight: 900, letterSpacing: 2, color: ttpLit > 0.4 ? C.cyanSoft : C.text, textShadow: ttpLit > 0.05 ? `0 0 ${Math.round(28 * ttpLit)}px ${alpha(C.cyan, 0.7 * ttpLit)}` : undefined }}>TTPs</span>
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

function Chapa({ at, frame, icon, tone, wrap = false, children }: { at: number; frame: number; icon: IconName; tone: string; wrap?: boolean; children: React.ReactNode }) {
  const p = progress(frame, at, 14);
  return (
    <div style={{ marginTop: 22, display: 'flex', justifyContent: 'center', opacity: p, transform: `translateY(${(1 - p) * 12}px)` }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, maxWidth: 520, padding: '10px 28px 10px 20px', borderRadius: wrap ? 28 : 999, border: `3px solid ${alpha(tone, 0.85)}`, background: alpha(tone, 0.14), boxShadow: `0 0 24px ${alpha(tone, 0.25)}`, fontSize: 34, fontWeight: 700, lineHeight: 1.2, color: C.text, textAlign: 'left', whiteSpace: wrap ? 'normal' : 'nowrap' }}>
        <Icon name={icon} size={40} color={tone} strokeWidth={2.2} />
        <span>{children}</span>
      </div>
    </div>
  );
}

function Tag({ left, top, at, frame, tone, children }: { left: number; top: number; at: number; frame: number; tone: string; children: React.ReactNode }) {
  const p = progress(frame, at, 12);
  return (
    <div style={{ position: 'absolute', left, top, padding: '2px 18px', borderRadius: 999, border: `2px solid ${alpha(tone, 0.85)}`, background: alpha(C.ink900, 0.9), fontSize: 32, fontWeight: 800, color: '#fecdd3', opacity: p, whiteSpace: 'nowrap', transform: `translateY(${(1 - p) * 8}px)` }}>{children}</div>
  );
}

function Decide({ at, frame, icon, children }: { at: number; frame: number; icon: IconName; children: React.ReactNode }) {
  const p = progress(frame, at, 14);
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 20, padding: '12px 34px 12px 24px', borderRadius: 999, border: `3px solid ${alpha(C.cyan, 0.8)}`, background: alpha(C.cyan, 0.12), fontSize: 52, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', opacity: p, transform: `translateX(${(1 - p) * 30}px)`, alignSelf: 'flex-start' }}>
      <Icon name={icon} size={54} color={C.cyan} strokeWidth={2.2} />
      {children}
    </div>
  );
}

function Row({ icon, tone, muted = false, children }: { icon: IconName; tone: string; muted?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 22, whiteSpace: 'nowrap' }}>
      <div style={{ width: 84, height: 84, borderRadius: 42, display: 'grid', placeItems: 'center', border: `3px solid ${alpha(tone, 0.75)}`, background: alpha(tone, 0.12) }}>
        <Icon name={icon} size={50} color={muted ? C.muted : tone} strokeWidth={2.2} />
      </div>
      <span style={{ fontSize: 62, fontWeight: 850, letterSpacing: -0.8, color: muted ? C.muted : C.textStrong }}>{children}</span>
    </div>
  );
}
