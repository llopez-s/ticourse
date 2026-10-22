import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, dimStyle } from '../../../engine/src/ui';
import { ADVERSARY, ASSISTANT, PLAQUE, PROMISE, RIBBON, TITLE } from '../data/s01-hook';
import { ChatWindow, Folder, VoiceTag } from './parts/Bits';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;

/** The assistant group (chat + folder), full size in phase A; scaled into the left column in phase B. */
const GROUP = { x: 200, y: 96, w: 1300, h: 470, lowX: 30, lowY: 250, lowScale: 0.6 };
const CHAT = { w: 820, h: 440 };
const FOLDER_X = 1040;
const RIBBON_H = 52;
const TITLE_TOP = 70;
const RIGHT_X = 900;

/**
 * s01-hook «El asistente nuevo». A ribbon says it is an example (Halden, no
 * date). `assistant`: the chat window with the generic waves logo and two
 * bubbles of gray bars, and the folder of internal documents it can read.
 * `title`: «Una orden escondida en un documento» while the group steps into
 * the left column. `promise`: two chips. `voice`: BORROWED VOICE's insignia
 * (a quoted voice, never a portrait). The plaque «SY0-801 · borrador» sits
 * bottom right from the title on.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const assistant = props.cue('assistant');
  const title = props.cue('title');
  const promise = props.cue('promise');
  const voice = props.cue('voice');
  const documentos = wordFrame(S, 's01-01', 'documentos.');
  const ajenas = wordFrame(S, 's01-03', 'ajenas.');

  const ribbon = enter(frame, 2, { distance: 12 });
  const chatIn = springIn(frame, fps, assistant - 4, { damping: 16 });
  const ask = progress(frame, assistant + 10, 14);
  const answer = progress(frame, assistant + 26, 16);
  const folderIn = springIn(frame, fps, documentos - 8, { damping: 15 });
  const link = progress(frame, documentos + 2, 18, EASE.inOut);

  const down = progress(frame, title - 6, 22, EASE.inOut);
  const titleIn = springIn(frame, fps, title - 2, { damping: 17 });
  const plaque = enter(frame, title + 14, { distance: 12 });

  const gx = GROUP.x + (GROUP.lowX - GROUP.x) * down;
  const gy = GROUP.y + (GROUP.lowY - GROUP.y) * down;
  const gs = 1 - (1 - GROUP.lowScale) * down;
  const groupDim = 0.35 * progress(frame, voice - 4, 14);

  const tagIn = springIn(frame, fps, voice - 2, { damping: 15 });
  const tagGlow = progress(frame, ajenas - 4, 12) * (1 - progress(frame, ajenas + 30, 20));

  return (
    <Stage>
      {/* ribbon: an example, outside the campaign */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: RIBBON_H, display: 'flex', justifyContent: 'center', opacity: ribbon.opacity * (1 - 0.5 * down), transform: ribbon.transform }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '0 28px',
            borderRadius: RADIUS.pill,
            border: `2px solid ${C.ink600}`,
            background: alpha(C.ink850, 0.92),
            fontFamily: FONT.sans,
            fontSize: 30,
            fontWeight: 700,
            color: C.text,
            whiteSpace: 'nowrap',
          }}
        >
          <Icon name="flag" size={30} color={C.muted} />
          {RIBBON}
        </div>
      </div>

      {/* the assistant: chat window + the folder it reads */}
      {chatIn > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: gx,
            top: gy,
            width: GROUP.w,
            height: GROUP.h,
            transform: `scale(${gs})`,
            transformOrigin: 'top left',
            ...dimStyle(groupDim),
          }}
        >
          <div style={{ position: 'absolute', left: 0, top: 0, opacity: Math.min(1, chatIn * 1.3), transform: `translateY(${(1 - Math.min(1, chatIn)) * 24}px)` }}>
            <ChatWindow width={CHAT.w} height={CHAT.h} title={ASSISTANT.window} ask={ask} answer={answer} glow={0.3 * answer * (1 - down)} />
          </div>
          {/* dashed link: the assistant reads the folder */}
          <svg width={GROUP.w} height={GROUP.h} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <line x1={FOLDER_X - 30} y1={220} x2={FOLDER_X - 30 - (FOLDER_X - 30 - CHAT.w - 16) * link} y2={220} stroke={alpha(C.cyan, 0.8)} strokeWidth={5} strokeDasharray="12 10" strokeLinecap="round" />
            {link > 0.9 ? <path d={`M ${CHAT.w + 36} 204 L ${CHAT.w + 18} 220 L ${CHAT.w + 36} 236`} fill="none" stroke={C.cyan} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={progress(link, 0.9, 0.1)} /> : null}
          </svg>
          {folderIn > 0.001 ? (
            <div style={{ position: 'absolute', left: FOLDER_X, top: 110, width: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: Math.min(1, folderIn * 1.3), transform: `scale(${0.8 + 0.2 * Math.min(1, folderIn)})` }}>
              <div style={{ position: 'relative' }}>
                <Folder size={190} glow={link} />
                <div style={{ position: 'absolute', right: -18, bottom: -10, width: 58, height: 58, borderRadius: 29, display: 'grid', placeItems: 'center', background: C.ink900, border: `2px solid ${alpha(C.cyan, 0.7)}` }}>
                  <Icon name="eye" size={34} color={C.cyan} />
                </div>
              </div>
              <span style={{ fontFamily: FONT.sans, fontSize: 38, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>{ASSISTANT.folder}</span>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* title */}
      {frame >= title - 4 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: TITLE_TOP,
            width: W,
            textAlign: 'center',
            fontFamily: FONT.sans,
            fontSize: 96,
            fontWeight: 850,
            letterSpacing: -2.4,
            lineHeight: 1.05,
            color: C.textStrong,
            whiteSpace: 'nowrap',
            opacity: Math.min(1, titleIn * 1.4),
            transform: `translateY(${(1 - titleIn) * 26}px) scale(${0.96 + 0.04 * Math.min(1, titleIn)})`,
          }}
        >
          {TITLE.lead} <span style={{ color: C.cyan }}>{TITLE.tail}</span>
        </div>
      ) : null}

      {/* the promise, right column */}
      <div style={{ position: 'absolute', left: RIGHT_X, top: 250, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 22 }}>
        {PROMISE.map((p, i) => {
          const at = promise - 2 + i * 10;
          if (frame < at - 2) return null;
          const e = enter(frame, at, { distance: 22, axis: 'x' });
          return (
            <div key={p} style={{ ...e, opacity: e.opacity * (1 - 0.35 * progress(frame, voice - 4, 14)) }}>
              <Chip accent={i === 0 ? 'rose' : 'emerald'} icon={i === 0 ? 'file' : 'shield'} size={44}>
                {p}
              </Chip>
            </div>
          );
        })}
      </div>

      {/* BORROWED VOICE, named */}
      {tagIn > 0.001 ? (
        <div style={{ position: 'absolute', left: RIGHT_X, top: 440, opacity: Math.min(1, tagIn * 1.3), transform: `translateY(${(1 - Math.min(1, tagIn)) * 20}px)` }}>
          <VoiceTag name={ADVERSARY.name} line={ADVERSARY.line} glow={tagGlow} />
        </div>
      ) : null}

      {/* the exam plaque */}
      {frame >= title + 10 ? (
        <div style={{ position: 'absolute', right: 0, top: 0, ...plaque }}>
          <Chip accent="violet" icon="mortarboard" size={28}>
            {PLAQUE}
          </Chip>
        </div>
      ) : null}
    </Stage>
  );
}
