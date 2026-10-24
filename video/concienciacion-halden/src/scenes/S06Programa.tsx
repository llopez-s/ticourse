import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { AUDIENCES, TOPICS } from '../data/audiences';
import { AudienceCard } from './parts/Audience';
import { EnglishArt } from './parts/EnglishArt';
import { ImageTag, Pill } from './parts/Labels';
import { Stage, wordFrame } from './kit';

const S = 's06-programa';
const W = 1728;

/** The year line (x 0–1230, y 0–214). */
const LINE_Y = 100;
const LINE_X0 = 40;
const LINE_X1 = 1210;
const INITIAL_X = 62;
const RECURRING_X = Array.from({ length: 9 }, (_, i) => 330 + i * 108);
/** The audiences row. */
const AUD_LABEL_TOP = 238;
const AUD_TOP = 280;
/** Wider where the wording is longer (Sistemas); the five add up to the stage width with 22 px gaps. */
const AUD_WIDTHS = [300, 420, 290, 320, 310] as const;
const AUD_GAP = (W - AUD_WIDTHS.reduce((a, b) => a + b, 0)) / 4;
const AUD_X = AUD_WIDTHS.map((_, i) => AUD_WIDTHS.slice(0, i).reduce((a, b) => a + b, 0) + i * AUD_GAP);
/** The eight topics (English, no voice). */
const TOPICS_TOP = 546;

/**
 * s06-programa «Un programa, no un vídeo». On `year` a line for the year draws across the top; on `initial` a big dot
 * lights at its start — INITIAL, «antes de dar accesos · con su acknowledgement» —; on `recurring` smaller dots light
 * one after another along the year — RECURRING, «porque se olvida y los ataques cambian». On `english` the school
 * English, tagged «imagen · no es del puerto», appears in miniature on the right and its notebook slowly goes grey: you
 * passed it and you have not used it since. On `audiences` the line steps back and the five audiences of the port come
 * up, Finanzas and Sistemas lit on the voice's words, each with its risk (amber) and its training (emerald); on
 * `topics` the other three light on «Dirección», «trabaja» and «llega» and, on «Cada uno tiene lo suyo, en pantalla», the eight topics of the objective appear in English with no voice.
 */
export function S06Programa(props: SceneProps) {
  const frame = useCurrentFrame();
  const yearAt = props.cue('year');
  const initialAt = props.cue('initial');
  const recurringAt = props.cue('recurring');
  const englishAt = props.cue('english');
  const audiencesAt = props.cue('audiences');
  const topicsAt = props.cue('topics');
  const finanzasAt = Math.max(audiencesAt + 4, wordFrame(S, 's06-03', 'Finanzas') - 8);
  const sistemasAt = Math.max(finanzasAt + 20, wordFrame(S, 's06-03', 'Sistemas') - 8);
  const direccionAt = Math.max(topicsAt + 4, wordFrame(S, 's06-04', 'Dirección') - 8);
  const fueraAt = Math.max(direccionAt + 12, wordFrame(S, 's06-04', 'trabaja') - 8);
  const llegaAt = Math.max(fueraAt + 12, wordFrame(S, 's06-04', 'llega') - 8);
  const panAt = Math.max(llegaAt + 20, wordFrame(S, 's06-04', 'Cada') - 4);
  const initialWordAt = Math.max(initialAt, wordFrame(S, 's06-01', 'initial') - 6);
  const recurringWordAt = Math.max(recurringAt, wordFrame(S, 's06-02', 'recurring') - 6);
  const dotsStart = Math.max(recurringAt + 10, wordFrame(S, 's06-02', 'todo') - 4);

  const baseIn = progress(frame, 4, 20);
  const draw = progress(frame, yearAt, 34, EASE.inOut);
  const lineDim = progress(frame, audiencesAt - 4, 16);
  const initialIn = progress(frame, initialAt, 16);
  const initialLabel = progress(frame, initialWordAt, 14);
  const recLabel = progress(frame, recurringWordAt, 14);
  const engIn = progress(frame, englishAt, 16);
  const fade = progress(frame, englishAt + 12, 90, EASE.linear);
  const audOn = [
    progress(frame, finanzasAt, 14),
    progress(frame, sistemasAt, 14),
    progress(frame, direccionAt, 14),
    progress(frame, fueraAt, 14),
    progress(frame, llegaAt, 14),
  ];
  const audShow = progress(frame, audiencesAt, 16);
  const topicsIn = progress(frame, panAt, 16);

  return (
    <Stage>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1240, height: 220, opacity: 1 - 0.5 * lineDim, filter: lineDim > 0.01 ? `saturate(${1 - 0.4 * lineDim})` : undefined }}>
        {/* the year line, drawn left to right with twelve faint ticks */}
        <svg width={1240} height={220} viewBox="0 0 1240 220" style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <line x1={LINE_X0} y1={LINE_Y} x2={LINE_X1} y2={LINE_Y} stroke={alpha(C.sky, 0.28)} strokeWidth={4} strokeDasharray="10 10" opacity={baseIn} />
          <line x1={LINE_X0} y1={LINE_Y} x2={LINE_X0 + (LINE_X1 - LINE_X0) * draw} y2={LINE_Y} stroke={alpha(C.sky, 0.7)} strokeWidth={5} strokeLinecap="round" />
          {Array.from({ length: 13 }).map((_, i) => {
            const x = LINE_X0 + ((LINE_X1 - LINE_X0) * i) / 12;
            return <line key={i} x1={x} y1={LINE_Y - 9} x2={x} y2={LINE_Y + 9} stroke={alpha(C.sky, 0.45)} strokeWidth={3} opacity={draw > i / 12 ? 1 : 0} />;
          })}
          <path d={`M${LINE_X1 - 14} ${LINE_Y - 14} L${LINE_X1 + 8} ${LINE_Y} L${LINE_X1 - 14} ${LINE_Y + 14}`} fill="none" stroke={alpha(C.sky, 0.7)} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={draw > 0.97 ? 1 : 0} />
          {/* INITIAL: the big dot */}
          <g transform={`translate(${INITIAL_X} ${LINE_Y}) scale(${0.3 + 0.7 * initialIn})`} opacity={initialIn}>
            <circle r={44} fill={alpha(C.cyan, 0.14)} />
            <circle r={26} fill={C.cyan} stroke={C.cyanSoft} strokeWidth={4} />
          </g>
          {/* RECURRING: the small dots */}
          {RECURRING_X.map((x, i) => {
            const p = progress(frame, dotsStart + i * 9, 12);
            return (
              <g key={x} transform={`translate(${x} ${LINE_Y}) scale(${0.3 + 0.7 * p})`} opacity={p}>
                <circle r={22} fill={alpha(C.emerald, 0.12)} />
                <circle r={11} fill={C.emerald} stroke="#6ee7b7" strokeWidth={3} />
              </g>
            );
          })}
        </svg>
        <div style={{ position: 'absolute', left: 0, top: 0, display: 'flex', alignItems: 'center', gap: 18, opacity: initialLabel, transform: `translateY(${(1 - initialLabel) * 10}px)` }}>
          <Pill text="INITIAL" tone={C.cyan} icon="user" size={38} height={58} weight={850} on={0.5 + 0.5 * initialLabel} />
        </div>
        <div style={{ position: 'absolute', left: 0, top: 146, width: 410, fontFamily: FONT.sans, fontSize: 30, fontWeight: 700, lineHeight: 1.2, color: C.text, opacity: initialLabel }}>
          antes de dar accesos · con su acknowledgement
        </div>
        <div style={{ position: 'absolute', left: 430, top: 0, display: 'flex', opacity: recLabel, transform: `translateY(${(1 - recLabel) * 10}px)` }}>
          <Pill text="RECURRING" tone={C.emerald} icon="clock" size={38} height={58} weight={850} on={0.5 + 0.5 * recLabel} />
        </div>
        <div style={{ position: 'absolute', left: 430, top: 146, width: 780, fontFamily: FONT.sans, fontSize: 30, fontWeight: 700, lineHeight: 1.2, color: C.text, whiteSpace: 'nowrap', opacity: recLabel }}>
          porque se olvida y los ataques cambian
        </div>
      </div>

      {/* the school English, in miniature, with its tag */}
      <div style={{ position: 'absolute', left: 1330, top: 18, opacity: engIn, transform: `translateY(${(1 - engIn) * 14}px)`, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
        <EnglishArt scale={0.95} fade={fade} bubble={engIn} />
        <ImageTag size={26} />
      </div>

      {/* the audiences */}
      <div style={{ position: 'absolute', left: 0, top: AUD_LABEL_TOP, display: 'inline-flex', alignItems: 'center', gap: 12, fontFamily: FONT.sans, fontSize: 28, fontWeight: 750, color: C.muted, opacity: audShow }}>
        <Icon name="flag" size={28} color={C.cyan} />
        audiencias del puerto · cada una con su riesgo
      </div>
      {AUDIENCES.map((a, i) => (
        <div key={a.key} style={{ position: 'absolute', left: AUD_X[i], top: AUD_TOP, opacity: audShow, transform: `translateY(${(1 - audShow) * 18}px)` }}>
          <AudienceCard a={a} width={AUD_WIDTHS[i]} on={audOn[i]} />
        </div>
      ))}

      {/* the eight topics of the objective: English, on screen, no voice */}
      <div style={{ position: 'absolute', left: 0, top: TOPICS_TOP, width: W, height: 140, opacity: topicsIn, transform: `translateY(${(1 - topicsIn) * 14}px)`, fontFamily: FONT.sans }}>
        <div style={{ position: 'absolute', left: 0, top: 6, width: 330, fontSize: 28, fontWeight: 750, lineHeight: 1.2, color: C.muted }}>
          los ocho temas del objetivo
        </div>
        <div style={{ position: 'absolute', left: 350, top: 0, width: W - 350, display: 'flex', flexWrap: 'wrap', gap: '12px 14px' }}>
          {TOPICS.map((t) => (
            <Pill key={t} text={t} tone={C.sky} size={27} height={46} weight={700} on={0.35} color={C.text} />
          ))}
        </div>
      </div>
    </Stage>
  );
}
