import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, pulse, springIn } from '../../../engine/src/theme/motion';
import { clamp01, mix, windowWeight } from '../../../engine/src/ui';
import { E7_NAMES, E7_PIPE_LINE } from '../data/e7';
import { HOSTS, pipeParts } from '../data/report';
import { S03_LABELS, S03_NAMES } from '../data/s03-mitades';
import { SandboxBox, sandboxSlot } from './parts/SampleBox';
import { SandboxReport, reportLayout, type ReportRowId } from './parts/SandboxReport';
import { S02_BOX } from './S02Hash';
import { Stage, segment, wordFrame } from './kit';

const SCENE = 's03-mitades';

// The report as two stacked panels (the two halves), the right column for labels and names.
const REPORT_W = 1180;
const FONT_SIZE = 22;
const GAP = 8;
const TOP_L = reportLayout({ width: REPORT_W, bands: 'static', fontSize: FONT_SIZE });
const BOT_L = reportLayout({ width: REPORT_W, bands: 'dynamic', fontSize: FONT_SIZE });
const TOP_Y = 0;
const BOT_Y = TOP_L.height + GAP;
const COL_X = 1214;
const COL_W = 1728 - COL_X;

const rowMid = (id: ReportRowId) => BOT_Y + BOT_L.rows[id]!.y + BOT_L.rows[id]!.h / 2;
const HOST_ROWS: ReportRowId[] = ['hostsHead', ...HOSTS.map((h) => h.id)];

/**
 * s03-mitades «Dos mitades». The report comes out of the lit box (`report`) and opens as the lesson's extract in
 * two bands. `static`: the top band lights, is named (STATIC ANALYSIS · análisis estático) and steps back at once,
 * «la leemos luego». The bottom band line by line: the scheduled task «para volver a arrancar» (`task`); the pipe
 * (`pipe`) with V3's pipe from E7 beside it — `vc_pipe_` cyan in both, the last eight characters amber, «mismo
 * formato · otro número en cada ejecución» (screen only). DYNAMIC ANALYSIS · análisis dinámico (`dynamic`). `wrap`:
 * both bands, «lo que lleva escrito» and «lo que hace». Host rows stay plain and dimmed.
 */
export function S03Mitades(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const reportAt = props.cue('report');
  const staticAt = props.cue('static');
  const taskAt = props.cue('task');
  const pipeAt = props.cue('pipe');
  const dynamicAt = props.cue('dynamic');
  const wrapAt = props.cue('wrap');
  const s1 = segment(props, 's03-01');

  const wEstatico = wordFrame(SCENE, 's03-01', 'estático');
  const wTarea = wordFrame(SCENE, 's03-02', 'tarea');
  const wDinamico = wordFrame(SCENE, 's03-03', 'dinámico');
  const wEscrito = wordFrame(SCENE, 's03-04', 'escrito');
  const wHace = wordFrame(SCENE, 's03-04', 'hace');

  // ---- Opening: the box of s02 gives out the report, the panels grow out of its slot.
  const sheet = progress(frame, reportAt - 6, 20, EASE.out);
  const grow = progress(frame, reportAt + 10, 30, EASE.inOut);
  const boxOut = progress(frame, reportAt + 12, 22, EASE.inOut);
  const slot = sandboxSlot(S02_BOX.w);
  const originX = S02_BOX.x + slot.x;
  const originY = S02_BOX.y + slot.y;

  // ---- Static band: lights at `static`, steps back soon after its name («la leemos luego»).
  const staticGlow = windowWeight(frame, staticAt - 4, wEstatico + 34, { ramp: 12 });
  const laterAt = Math.min(wEstatico + 30, Math.max(staticAt + 40, s1.to - 30));
  const staticDim = 0.75 * progress(frame, laterAt, 18) * (1 - progress(frame, wEscrito - 8, 16));
  const laterIn = progress(frame, laterAt, 16) * (1 - progress(frame, wrapAt - 6, 14));
  const staticName = frame < wEstatico - 6 ? 0 : springIn(frame, fps, wEstatico - 6, { damping: 15, mass: 0.7 });

  // ---- Dynamic band: the task, then the pipe pair, then the name.
  const dynGlow = windowWeight(frame, taskAt - 4, wrapAt - 6, { ramp: 12 }) * 0.8;
  const taskFocus = windowWeight(frame, wTarea - 8, pipeAt - 4, { ramp: 10 });
  const taskLabel = progress(frame, wTarea - 2, 14) * (1 - progress(frame, pipeAt - 10, 12));
  const pipeFocus = windowWeight(frame, pipeAt - 4, wrapAt - 10, { ramp: 10 });
  const pipeSplit = progress(frame, pipeAt + 6, 16);
  const pairIn = progress(frame, pipeAt + 10, 16) * (1 - progress(frame, wrapAt - 6, 14));
  const ruleIn = progress(frame, pipeAt + 30, 16) * (1 - progress(frame, wrapAt - 6, 14));
  const dynNameAt = Math.max(dynamicAt, wDinamico - 8);
  const dynName = frame < dynNameAt ? 0 : springIn(frame, fps, dynNameAt, { damping: 15, mass: 0.7 });

  // ---- Wrap: both halves side by side with what each one tells.
  const wrapStatic = progress(frame, wEscrito - 8, 16);
  const wrapDynamic = progress(frame, wHace - 8, 16);
  const wrapGlowS = windowWeight(frame, wEscrito - 8, wHace - 6, { ramp: 10 });
  const wrapGlowD = windowWeight(frame, wHace - 8, Number.POSITIVE_INFINITY, { ramp: 10 });
  const namesDim = 0.45 * progress(frame, wrapAt - 6, 14);

  const hostDim = Object.fromEntries(HOST_ROWS.map((id) => [id, 0.55])) as Partial<Record<ReportRowId, number>>;
  const dynDim: Partial<Record<ReportRowId, number>> = {
    ...hostDim,
    persist: 0.5 * pipeFocus,
    pipe: 0.5 * taskFocus,
  };

  const panelScale = mix(0.12, 1, grow);
  const panelOpacity = clamp01(grow * 1.6);
  // Centred while it is alone; slides left when the right column gets its first name.
  const reportX = mix((1728 - REPORT_W) / 2, 0, progress(frame, wEstatico - 30, 22, EASE.inOut));
  const tOrigin = (y: number) => `${originX - reportX}px ${originY - y}px`;

  return (
    <Stage>
      {/* The box of s02, giving out the report */}
      {boxOut < 1 ? (
        <div style={{ position: 'absolute', left: S02_BOX.x, top: S02_BOX.y, opacity: 1 - boxOut, transform: `scale(${1 - 0.3 * boxOut})`, transformOrigin: '50% 100%' }}>
          <SandboxBox width={S02_BOX.w} lit={1} holding={1 - sheet * 0.6} report={sheet} pulse={pulse(frame, fps, 0.5)} />
        </div>
      ) : null}

      {/* Top half: header + ESTÁTICO */}
      {grow > 0 ? (
        <div style={{ position: 'absolute', left: reportX, top: TOP_Y, transform: `scale(${panelScale})`, transformOrigin: tOrigin(TOP_Y), opacity: panelOpacity }}>
          <SandboxReport
            width={REPORT_W}
            bands="static"
            fontSize={FONT_SIZE}
            bandGlow={{ static: Math.max(staticGlow, wrapGlowS) }}
            bandDim={{ static: staticDim }}
          />
        </div>
      ) : null}

      {/* Bottom half: DINÁMICO */}
      {grow > 0 ? (
        <div style={{ position: 'absolute', left: reportX, top: BOT_Y, transform: `scale(${panelScale})`, transformOrigin: tOrigin(BOT_Y), opacity: panelOpacity }}>
          <SandboxReport
            width={REPORT_W}
            bands="dynamic"
            header={false}
            fontSize={FONT_SIZE}
            focus={{ persist: taskFocus, pipe: pipeFocus }}
            focusScale={1.45}
            dim={dynDim}
            bandGlow={{ dynamic: Math.max(dynGlow, wrapGlowD) }}
            pipeSplit={pipeSplit}
          />
        </div>
      ) : null}

      {/* ---------- Right column: the top half ---------- */}
      <div style={{ position: 'absolute', left: COL_X, top: 0, width: COL_W, height: TOP_L.height, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
        {laterIn > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 34,
              display: 'inline-flex',
              alignItems: 'center',
              height: 60,
              padding: '0 26px',
              borderRadius: 999,
              border: `2px dashed ${alpha(C.muted, 0.6)}`,
              background: alpha(C.muted, 0.08),
              fontSize: 34,
              fontWeight: 700,
              color: C.muted,
              opacity: laterIn,
              transform: `translateX(${(1 - laterIn) * 16}px)`,
            }}
          >
            {S03_LABELS.later}
          </div>
        ) : null}
        {wrapStatic > 0 ? (
          <WrapLabel text={S03_LABELS.wrapStatic} p={wrapStatic} glow={wrapGlowS} top={32} />
        ) : null}
        <ExamName en={S03_NAMES.static.en} es={S03_NAMES.static.es} p={staticName} dim={namesDim} top={140} />
      </div>

      {/* ---------- Right column: the bottom half ---------- */}
      {taskLabel > 0 ? (
        <>
          <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: taskLabel }}>
            <path
              d={`M ${BOT_L.rows.persist!.x + BOT_L.rows.persist!.textW * 1.45 + 20} ${rowMid('persist')} L ${COL_X - 12} ${rowMid('persist')}`}
              stroke={alpha(C.cyan, 0.6)}
              strokeWidth={3}
              strokeDasharray="6 8"
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              left: COL_X,
              top: rowMid('persist') - 50,
              fontFamily: FONT.sans,
              fontSize: 40,
              fontWeight: 800,
              lineHeight: 1.15,
              color: C.cyanSoft,
              whiteSpace: 'nowrap',
              opacity: taskLabel,
              transform: `translateX(${(1 - taskLabel) * 16}px)`,
            }}
          >
            <div>{S03_LABELS.task[0]}</div>
            <div>{S03_LABELS.task[1]}</div>
          </div>
        </>
      ) : null}

      {pairIn > 0 ? <PipePair top={rowMid('pipe') - 56} p={pairIn} split={pipeSplit} rule={ruleIn} /> : null}

      {wrapDynamic > 0 ? <WrapLabel text={S03_LABELS.wrapDynamic} p={wrapDynamic} glow={wrapGlowD} top={BOT_Y + 40} left={COL_X} /> : null}
      <div style={{ position: 'absolute', left: COL_X, top: BOT_Y + 228, width: COL_W }}>
        <ExamName en={S03_NAMES.dynamic.en} es={S03_NAMES.dynamic.es} p={dynName} dim={namesDim} top={0} />
      </div>
    </Stage>
  );
}

/** V3's pipe from E7, small, beside the sandbox's: `vc_pipe_` cyan, the eight that change amber. */
function PipePair({ top, p, split, rule }: { top: number; p: number; split: number; rule: number }) {
  const e7 = pipeParts(E7_PIPE_LINE.pipe);
  return (
    <div style={{ position: 'absolute', left: COL_X, top, width: COL_W, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
      <div style={{ opacity: p, transform: `translateX(${(1 - p) * 16}px)` }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: C.muted }}>{E7_NAMES.pipeCaption}</div>
        <div
          style={{
            marginTop: 6,
            display: 'inline-flex',
            alignItems: 'center',
            height: 50,
            padding: '0 16px',
            borderRadius: 12,
            background: C.ink850,
            border: `2px solid ${C.ink700}`,
            fontFamily: FONT.mono, fontVariantLigatures: 'none', fontFeatureSettings: '"liga" 0, "calt" 0',
            fontSize: 28,
            fontWeight: 650,
          }}
        >
          <span style={{ color: C.text }}>{e7.root}</span>
          <span style={{ color: split > 0.5 ? C.cyan : C.text }}>{e7.prefix}</span>
          <span style={{ color: split > 0.5 ? C.amber : C.text }}>{e7.run}</span>
        </div>
      </div>
      <div style={{ marginTop: 22, fontSize: 32, fontWeight: 750, lineHeight: 1.2, color: C.text, opacity: rule, transform: `translateY(${(1 - rule) * 10}px)` }}>
        <div>
          <span style={{ color: C.cyanSoft }}>{S03_LABELS.pipeRule[0]}</span>
          <span style={{ color: C.faint }}> ·</span>
        </div>
        <div style={{ color: '#fcd34d' }}>{S03_LABELS.pipeRule[1]}</div>
      </div>
    </div>
  );
}

/** Exam name (violet, upper case) with its Spanish gloss under it. */
function ExamName({ en, es, p, dim, top }: { en: string; es: string; p: number; dim: number; top: number }) {
  if (p <= 0.001) return null;
  const show = Math.min(1, p * 1.4);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top,
        fontFamily: FONT.sans,
        whiteSpace: 'nowrap',
        opacity: show * (1 - dim),
        transform: `scale(${0.88 + 0.12 * Math.min(1.04, p)})`,
        transformOrigin: 'left center',
      }}
    >
      <div style={{ fontSize: 50, fontWeight: 900, letterSpacing: 1.5, lineHeight: 1.05, color: '#c4b5fd', textShadow: `0 0 26px ${alpha(C.violet, 0.45)}` }}>{en}</div>
      <div style={{ marginTop: 6, fontSize: 34, fontWeight: 700, color: C.text }}>{es}</div>
    </div>
  );
}

/** «lo que lleva escrito» / «lo que hace»: the chapter's wrap, one per half. */
function WrapLabel({ text, p, glow, top, left = 0 }: { text: string; p: number; glow: number; top: number; left?: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top,
        fontFamily: FONT.sans,
        fontSize: 46,
        fontWeight: 850,
        color: C.textStrong,
        whiteSpace: 'nowrap',
        opacity: p,
        transform: `translateX(${(1 - p) * 18}px)`,
        textShadow: glow > 0 ? `0 0 ${Math.round(22 * glow)}px ${alpha(C.cyan, 0.5 * glow)}` : undefined,
      }}
    >
      {text}
    </div>
  );
}
