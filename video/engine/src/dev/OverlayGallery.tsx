import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { CaptionPage, ExamCue, InterceptCue, QuestionCue, SceneTiming, ThinkPrompt as ThinkEntry } from '../timeline/types';
import { C, STAGE, TYPE } from '../theme/tokens';
import { Backdrop } from '../ui/Backdrop';
import { MonoLine } from '../ui/MonoLine';
import { Panel } from '../ui/Panel';
import { SeverityBadge } from '../ui/Chip';
import { CaptionsView } from '../overlay/Captions';
import { ChapterRailView } from '../overlay/ChapterRail';
import { ExamCueView } from '../overlay/ExamCueLayer';
import { ExamQuestionView } from '../overlay/ExamQuestionLayer';
import { InterceptView } from '../overlay/InterceptLayer';
import { ProgressBarView } from '../overlay/ProgressBar';
import { SimulationTagView } from '../overlay/SimulationTag';
import { ThinkPromptView } from '../overlay/ThinkPrompt';

/**
 * Dev-only preview of every overlay with hardcoded sample data (the real
 * timeline has no captions / exam / think entries until the builder runs in
 * audio mode). Frames of interest:
 *   40  two-line caption mid-karaoke        116  exam card sliding in, tag fading
 *   131 panel morphing between pages        150  one-line page, exam card holding
 *   250 long lines shrunk, chapter wipe     330  think prompt mid-countdown
 *   365 last page + think prompt            420  chapter V, one-line exam card
 *   40  intercepted message typing          100  intercepted message complete
 * Exam questions (scenes s12/s13, after the captions end):
 *   470 entry, options staggering in        575 mid-countdown (3 s left)
 *   670 reveal: correct marked, others dim  720 trap marked + exam card
 *   770 long question: entry                875 long question: mid-countdown
 *   970 long question: reveal               1020 long question: trap + exam card
 */
export const GALLERY_DURATION = 1050;

const SCENES: SceneTiming[] = [
  { id: 's01-hook', chapter: 1, chapterTitle: 'Qué es', title: 'Seis mil avisos, uno importa', from: 0, durationInFrames: 90 },
  { id: 's02-collect', chapter: 2, chapterTitle: 'Cómo funciona', title: 'Recoger', from: 90, durationInFrames: 90 },
  { id: 's03-normalize', chapter: 2, chapterTitle: 'Cómo funciona', title: 'Normalizar', from: 180, durationInFrames: 75 },
  { id: 's06-fatigue', chapter: 3, chapterTitle: 'Operar el SIEM', title: 'Alert fatigue', from: 255, durationInFrames: 45 },
  { id: 's09-pivot', chapter: 4, chapterTitle: 'El caso de Halden', title: 'Pivotar y correlacionar', from: 300, durationInFrames: 75 },
  { id: 's11-limits', chapter: 5, chapterTitle: 'Límites y examen', title: 'Lo que el SIEM no ve', from: 375, durationInFrames: 75 },
  { id: 's12-p1', chapter: 5, chapterTitle: 'Límites y examen', title: 'Al cerrar la oficina', from: 450, durationInFrames: 300 },
  { id: 's13-p2', chapter: 5, chapterTitle: 'Límites y examen', title: 'La copia que no llegó', from: 750, durationInFrames: 300 },
];

/** Builds a caption page with evenly timed words (`step` frames per word, 1-frame gap). */
function page(from: number, lines: string[], step = 6, tail = 10): CaptionPage {
  let f = from;
  const timed = lines.map((line) =>
    line.split(' ').map((text) => {
      const word = { text, from: f, to: f + step - 1 };
      f += step;
      return word;
    }),
  );
  return { from, to: f + tail, lines: timed };
}

const P1 = page(6, ['¿Seis mil avisos al día? Un SIEM recoge los logs', 'de toda la red, los normaliza y los correlaciona.']);
const P2 = page(P1.to + 2, ['¿Cuál de ellos importa de verdad?']);
// 66 characters on the first line: too wide for 46 px, so the page shrinks.
const P3 = page(P2.to + 40, [
  'A las 01:52, svc_tosreport entró en srv-tc-app03 desde ADM-WS-07,',
  'y NetFlow marcó 38 GB hacia 203.0.113.47 «sin payload».',
]);
const P4 = page(P3.to + 1, ['Caso 0412: contener sin apagar, ¡la evidencia importa!']);

const CAPTIONS: CaptionPage[] = [P1, P2, P3, P4];

const EXAM: ExamCue[] = [
  {
    scene: 's02-collect',
    from: 112,
    durationInFrames: 110,
    objective: '4.4',
    text: 'Un SIEM agrega, normaliza y correlaciona logs de muchas fuentes para generar alertas.',
  },
  {
    scene: 's11-limits',
    from: 380,
    durationInFrames: 66,
    objective: '4.4',
    text: 'NetFlow registra metadatos, no el payload.',
  },
  // After each question's trap, in the same scene: the card shares the screen with the panel.
  {
    scene: 's12-p1',
    from: 705,
    durationInFrames: 40,
    objective: '1.1',
    text: 'Managerial decide la norma; operational la cumple cada día.',
  },
  {
    scene: 's13-p2',
    from: 1000,
    durationInFrames: 44,
    objective: '1.1',
    text: 'Una alerta que avisa sola de un fallo es un control técnico de tipo detective.',
  },
];

const THINK: ThinkEntry[] = [
  {
    scene: 's09-pivot',
    from: 292,
    durationInFrames: 120,
    q: '¿Qué dato te falta para saber si esos 38 GB son exfiltración?',
  },
];

/** A short question (one-word options) and the longest the validator allows (scenario 160, question 110, options 70, why 90 characters). */
const QUESTIONS: QuestionCue[] = [
  {
    scene: 's12-p1',
    segment: 's12-01',
    from: 456,
    durationInFrames: 294,
    countdownFrom: 500,
    countdownFrames: 150,
    revealFrame: 656,
    trapFrame: 690,
    objective: '1.1',
    scenario:
      'La dirección del puerto aprueba una norma de mesa limpia. Cada tarde, al cerrar, alguien de la oficina repasa las mesas y guarda los papeles a la vista.',
    q: '¿A qué categoría de control pertenece el repaso de cada tarde?',
    options: ['Technical', 'Managerial', 'Operational', 'Physical'],
    answer: 2,
    trap: 1,
    why: 'Es una persona que cumple un procedimiento en el día a día.',
    trapWhy: 'La norma es managerial, pero la pregunta es por el repaso: hacerla cumplir es operational.',
  },
  {
    scene: 's13-p2',
    segment: 's13-01',
    from: 756,
    durationInFrames: 294,
    countdownFrom: 800,
    countdownFrames: 150,
    revealFrame: 956,
    trapFrame: 990,
    objective: '1.1',
    scenario:
      'Tras un corte de luz en la terminal norte, el técnico de turno reinicia el servidor de grúas y ve que la copia de seguridad nocturna lleva tres días sin hacerse',
    q: '¿Qué control habría descubierto ANTES el fallo de las copias nocturnas, sin depender de que alguien lo revise?',
    options: [
      'Una política firmada por la dirección que exige hacer copia cada noche',
      'Una alerta automática que avisa al equipo en cuanto una copia no acaba',
      'Un vigilante que hace rondas por la sala de servidores cada tres horas',
      'Un cartel en la puerta de la sala que recuerda que se graba con cámara',
    ],
    answer: 1,
    trap: 0,
    why: 'Detecta sola y en el momento: avisa cuando la copia falla, sin esperar a que alguien mire.',
    trapWhy: 'Tienta porque exige copias, pero una norma no descubre nada: es managerial, no detective.',
  },
];

const INTERCEPT: InterceptCue[] = [
  { scene: 's01-hook', from: 20, durationInFrames: 90, adversary: 'SILENT PAGER', text: 'Borro el log del servidor y aquí no ha pasado nada.' },
];

/** A stand-in for scene content so the overlays can be judged over something busy. */
function MockStage() {
  const rows = [
    { t: '01:52:07', host: 'srv-tc-app03', msg: 'logon svc_tosreport src=ADM-WS-07', sev: 'ALTA' as const },
    { t: '01:52:09', host: 'fw-edge-01', msg: 'allow 10.20.4.31 > 203.0.113.47:443', sev: 'MEDIA' as const },
    { t: '01:53:40', host: 'srv-tc-app03', msg: 'proc tar -czf /tmp/export.tgz', sev: 'ALTA' as const },
    { t: '02:00:12', host: 'netflow', msg: 'bytes_out=38 GB dst=203.0.113.47', sev: 'CRÍTICA' as const },
    { t: '02:04:55', host: 'dns-int', msg: 'query cdn-sync.example A', sev: 'BAJA' as const },
  ];
  return (
    <Panel
      title="Consola SIEM · cola de alertas"
      icon="radar"
      style={{ position: 'absolute', left: STAGE.left, top: STAGE.top, width: STAGE.width, height: STAGE.height }}
      bodyStyle={{ padding: '28px 34px', display: 'grid', gap: 18, alignContent: 'start' }}
    >
      {rows.map((r) => (
        <div key={r.t} style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
          <SeverityBadge level={r.sev} />
          <MonoLine
            size={TYPE.small}
            tokens={[
              { t: `${r.t}  `, c: C.faint },
              { t: `${r.host.padEnd(14)}`, c: C.cyanSoft },
              { t: r.msg, c: C.text },
            ]}
          />
        </div>
      ))}
    </Panel>
  );
}

export function OverlayGallery() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.ink950 }}>
      <Backdrop />
      <MockStage />
      <ChapterRailView scenes={SCENES} frame={frame} />
      <SimulationTagView exam={EXAM} frame={frame} />
      <ThinkPromptView prompts={THINK} frame={frame} fps={fps} />
      <ExamQuestionView questions={QUESTIONS} frame={frame} fps={fps} />
      <InterceptView entries={INTERCEPT} frame={frame} />
      <ExamCueView exam={EXAM} frame={frame} />
      <CaptionsView pages={CAPTIONS} frame={frame} />
      <ProgressBarView scenes={SCENES} frame={frame} total={GALLERY_DURATION} />
    </AbsoluteFill>
  );
}
