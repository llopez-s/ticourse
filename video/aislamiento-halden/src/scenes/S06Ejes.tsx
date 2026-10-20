import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { mix } from '../../../engine/src/ui';
import { AXIS_WHERE, AXIS_WHO, CENTRAL, CLOUD, DECENTRAL, FOOTBALL_WHERE, FOOTBALL_WHO, ON_PREM, PORT_DOT, QUESTION, type Entry } from '../data/s06-ejes';
import { Football } from './parts/Football';
import { ImageTag } from './parts/Tags';
import { PoleCard, type PoleLine } from './parts/s06-ejes/PoleCard';
import { CentralSites, LocalSites, SITES } from './parts/s06-ejes/Sites';
import { Stage, wordFrame } from './kit';

const S = 's06-ejes';
const TOP = { x: 410, y: 0, w: 830, h: 206 } as const;
const BOTTOM = { x: 410, y: 454, w: 830, h: 206 } as const;
const LEFT = { x: 0, y: 222, w: 600, h: 216 } as const;
const RIGHT = { x: 1128, y: 222, w: 600, h: 216 } as const;
const CX = 825;
const CY = 330;
const DOT = { x: 652, y: CY } as const;
const FB = { x: 1462, y: 489, w: 260 } as const;

/**
 * s06-ejes «Dónde vive y quién decide». «¿Por qué no llevarlas a la nube?» opens big and, on `grid`, moves to the
 * corner as the two crossed axes draw: DÓNDE VIVE (horizontal, sky) and QUIÉN LA GESTIONA (vertical, amber). ON-PREMISES
 * and NUBE fill their ends on their cues, each line on its word; on `centralized` the horizontal cards step back and
 * CENTRALIZED fills the top, its console wired to four sites; on `down` (the error) the console blinks rose and goes
 * dark, the sites go grey and the line «si cae la consola, todas a ciegas» flashes. DECENTRALIZED fills the bottom. On
 * `port-dot` the horizontal axis lights again and one cyan dot lands on it, near ON-PREMISES, «oficina: en su centro
 * de datos (on-premises)»; the vertical axis gets no dot. On `football` the pitch and its coach (imagen · no es del
 * puerto): the pitch lights on «campo» (dónde), the coach on «quién».
 */
export function S06Ejes(props: SceneProps) {
  const frame = useCurrentFrame();
  const qAt = props.cue('cloud-question');
  const gridAt = props.cue('grid');
  const onPremAt = props.cue('on-prem');
  const cloudAt = props.cue('cloud');
  const centralAt = props.cue('centralized');
  const downAt = props.cue('down');
  const decentralAt = props.cue('decentralized');
  const portAt = props.cue('port-dot');
  const footAt = props.cue('football');
  const campoAt = wordFrame(S, 's06-06', 'campo') - 6;
  const quienAt = wordFrame(S, 's06-06', 'quién') - 6;

  const lineAt = (e: Entry) => wordFrame(S, e.seg, e.word) - 6 + (e.delay ?? 0);
  const linesOf = (entries: Entry[], extra?: (e: Entry, i: number) => Partial<PoleLine>): PoleLine[] =>
    entries.map((e, i) => ({ text: e.text, con: e.con, show: progress(frame, lineAt(e), 12), ...(extra ? extra(e, i) : {}) }));

  // The question: big in the middle, then into the corner on `grid`.
  const qIn = enter(frame, qAt - 6, { distance: 16, duration: 16 });
  const qMove = progress(frame, gridAt - 4, 22, EASE.inOut);
  const qSize = mix(60, 32, qMove);
  const qLeft = mix(500, 0, qMove);
  const qTop = mix(240, 0, qMove);

  const hDraw = progress(frame, gridAt, 18);
  const vDraw = progress(frame, gridAt + 8, 18);
  const whoPhase = progress(frame, centralAt - 6, 14) * (1 - progress(frame, portAt - 6, 16));
  const wherePhase = progress(frame, centralAt - 6, 14) * (1 - 0.6 * progress(frame, portAt - 6, 16));
  const whoDim = progress(frame, portAt - 6, 16) * 0.8;
  const hTone = alpha(C.sky, 0.95 - 0.5 * whoPhase);
  const vTone = alpha(C.amber, 0.45 + 0.5 * progress(frame, centralAt - 6, 14) - 0.3 * whoDim);

  const blink = frame >= downAt - 2 && frame < downAt + 18 ? (Math.floor((frame - downAt + 2) / 3) % 2 === 0 ? 1 : 0) : 0;
  const down = progress(frame, downAt + 16, 6);
  const dotIn = progress(frame, portAt, 14);
  const footIn = enter(frame, footAt - 4, { distance: 14, duration: 14 });

  const head = (x: number, y: number, dx: number, dy: number, color: string) => (
    <path d={`M ${x} ${y} L ${x - dx * 18 - dy * 11} ${y - dy * 18 - dx * 11} L ${x - dx * 18 + dy * 11} ${y - dy * 18 + dx * 11} Z`} fill={color} />
  );

  return (
    <Stage>
      {/* The two axes */}
      <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {hDraw > 0.01 ? (
          <g>
            <line x1={CX - (CX - LEFT.w - 16) * hDraw} y1={CY} x2={CX + (RIGHT.x - 16 - CX) * hDraw} y2={CY} stroke={hTone} strokeWidth={6} strokeLinecap="round" />
            {hDraw > 0.95 ? head(RIGHT.x - 6, CY, 1, 0, hTone) : null}
            {hDraw > 0.95 ? head(LEFT.w + 6, CY, -1, 0, hTone) : null}
          </g>
        ) : null}
        {vDraw > 0.01 ? (
          <g>
            <line x1={CX} y1={CY - (CY - TOP.h - 14) * vDraw} x2={CX} y2={CY + (BOTTOM.y - 14 - CY) * vDraw} stroke={vTone} strokeWidth={6} strokeLinecap="round" />
            {vDraw > 0.95 ? head(CX, TOP.h + 6, 0, -1, vTone) : null}
            {vDraw > 0.95 ? head(CX, BOTTOM.y - 6, 0, 1, vTone) : null}
          </g>
        ) : null}
        {dotIn > 0.01 ? (
          <g opacity={dotIn}>
            <circle cx={DOT.x} cy={DOT.y} r={22 + 10 * (1 - dotIn)} fill={alpha(C.cyan, 0.25)} />
            <circle cx={DOT.x} cy={DOT.y} r={14} fill={C.cyan} stroke={C.ink900} strokeWidth={4} />
            <path d={`M ${DOT.x} ${DOT.y + 16} L ${DOT.x} 446 L 330 446`} fill="none" stroke={alpha(C.cyan, 0.7)} strokeWidth={3} strokeDasharray="8 7" />
          </g>
        ) : null}
      </svg>
      <div style={{ position: 'absolute', left: CX + 22, top: CY - 50, fontFamily: FONT.sans, fontSize: 32, fontWeight: 850, color: '#7dd3fc', whiteSpace: 'nowrap', opacity: hDraw * (1 - 0.5 * whoPhase) }}>
        {AXIS_WHERE}
      </div>
      <div style={{ position: 'absolute', left: CX + 22, top: CY + 14, fontFamily: FONT.sans, fontSize: 32, fontWeight: 850, lineHeight: 1.1, color: '#fcd34d', whiteSpace: 'nowrap', opacity: vDraw * (1 - 0.5 * whoDim) }}>
        <div>{AXIS_WHO[0]}</div>
        <div>{AXIS_WHO[1]}</div>
      </div>

      {/* The four ends */}
      <PoleCard {...LEFT} title={ON_PREM.title} icon="server" tone={C.sky} show={progress(frame, onPremAt - 4, 14)} dim={wherePhase} lines={linesOf(ON_PREM.lines)} />
      <PoleCard {...RIGHT} title={CLOUD.title} icon="cloud" tone={C.sky} show={progress(frame, cloudAt - 4, 14)} dim={wherePhase} lines={linesOf(CLOUD.lines)} />
      <PoleCard
        {...TOP}
        title={CENTRAL.title}
        icon="desktop"
        tone={C.amber}
        show={progress(frame, centralAt - 4, 14)}
        dim={whoDim}
        lines={linesOf(CENTRAL.lines, (_, i) => (i === 2 ? { alarm: blink || progress(frame, downAt, 6) * (1 - progress(frame, downAt + 40, 20)) } : {}))}
        diagram={<CentralSites down={down} blink={blink} />}
        diagramW={SITES.w}
      />
      <PoleCard
        {...BOTTOM}
        title={DECENTRAL.title}
        icon="users"
        tone={C.amber}
        show={progress(frame, decentralAt - 4, 14)}
        dim={whoDim}
        lines={linesOf(DECENTRAL.lines)}
        diagram={<LocalSites on={progress(frame, decentralAt, 16)} />}
        diagramW={SITES.w}
      />

      {/* The question */}
      <div style={{ position: 'absolute', left: qLeft, top: qTop, fontFamily: FONT.sans, fontSize: qSize, fontWeight: 850, lineHeight: 1.12, color: C.textStrong, whiteSpace: 'nowrap', opacity: qIn.opacity }}>
        <div>{QUESTION[0]}</div>
        <div style={{ color: C.cyan }}>{QUESTION[1]}</div>
      </div>

      {/* The port's dot: on the «where» axis only */}
      {dotIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: BOTTOM.y + 6, fontFamily: FONT.sans, fontSize: 32, fontWeight: 800, lineHeight: 1.16, color: C.cyanSoft, whiteSpace: 'nowrap', opacity: dotIn }}>
          <div>{PORT_DOT[0]}</div>
          <div>{PORT_DOT[1]}</div>
        </div>
      ) : null}

      {/* The football image */}
      {frame >= footAt - 6 ? (
        <div style={{ position: 'absolute', inset: 0, ...footIn }}>
          <div style={{ position: 'absolute', left: BOTTOM.x + BOTTOM.w + 14, top: BOTTOM.y - 8 }}>
            <ImageTag size={22} />
          </div>
          <div style={{ position: 'absolute', left: FB.x, top: FB.y }}>
            <Football width={FB.w} field={progress(frame, campoAt, 12)} coach={progress(frame, quienAt, 12)} />
          </div>
          <div style={{ position: 'absolute', left: FB.x - 120, top: FB.y + 52, fontFamily: FONT.sans, fontSize: 32, fontWeight: 850, color: '#7dd3fc', opacity: 0.3 + 0.7 * progress(frame, campoAt, 12) }}>
            {FOOTBALL_WHERE}
          </div>
          <div style={{ position: 'absolute', left: FB.x - 120, top: FB.y + 118, fontFamily: FONT.sans, fontSize: 32, fontWeight: 850, color: '#fcd34d', opacity: 0.3 + 0.7 * progress(frame, quienAt, 12) }}>
            {FOOTBALL_WHO}
          </div>
        </div>
      ) : null}
    </Stage>
  );
}
