import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, clamp01, type IconName } from '../../../engine/src/ui';
import { AGENT, CENTRAL, DOCTOR, INSIDE, MONTHLY, OUTSIDE, PRIVILEGED, SERVER_LABEL } from '../data/s02-escaneo';
import { Pill, TermChip } from './parts/Bits';
import { ConsultaTile } from './parts/Consulta';
import { ImageTag } from './parts/Tags';
import { Stage, wordFrame } from './kit';

const S = 's02-escaneo';
const W = STAGE.width;

// ---- Phase A (stage coordinates): two column cards, the server between them, the doctor minis under it.
const CARD_W = 620;
const CARD_H = 556;
const LEFT_X = 0;
const RIGHT_X = W - CARD_W;
const MID_X = CARD_W;
const MID_W = W - 2 * CARD_W;
const SERVER = { x: MID_X + (MID_W - 300) / 2, y: 30, w: 300, h: 210 } as const;
const MINI_W = 216;
const MINI_GAP = 24;
const MINI_Y = 290;
const MINI_X0 = MID_X + (MID_W - 2 * MINI_W - MINI_GAP) / 2;
const MINI_H = MINI_W * 0.75;
const ROW_Y0 = 204;
const ROW_STEP = 50;
const MONTHLY_Y = 570;
const NOTE_Y = 626;

// ---- Phase B: two panels, where the scan looks from.
const PANEL_W = 840;
const B_RIGHT_X = W - PANEL_W;

/**
 * s02-escaneo «Un servidor, dos escaneos». Phase A — one office server, schematic and unnamed (`server`), scanned twice.
 * On `outside` the left card lights, «Sin cuenta · desde la red»: what anyone sees from outside (open ports, what each
 * service announces) and rows tagged «posible», with the verb «deduce» on its word. On `inside` the right card lights,
 * «Con cuenta de escaneo»: what is installed and the missing patches, more rows, all «confirmado», verb «lee». On
 * `doctor` la consulta in miniature (labelled «imagen · no es del puerto»): the doctor at the door who guesses, then the
 * blood test. The English names land on their words (`names`): non-credentialed, then credentialed (`monthly`), and
 * with that word the chip «escaneo mensual del puerto · credentialed» and its small note. Phase B (`central`): where it
 * looks from — a central server reaches only what is on and connected (two machines it cannot see: one off, one away),
 * like the consulting room that only sees who walks in; on `agent` a laptop weeks away from the office carries a scanning
 * agent that reports from wherever it is, like a heart-rate band; agent-based and agentless land on their words.
 */
export function S02Escaneo(props: SceneProps) {
  const frame = useCurrentFrame();
  const serverAt = props.cue('server');
  const outsideAt = props.cue('outside');
  const insideAt = props.cue('inside');
  const doctorAt = props.cue('doctor');
  const centralAt = props.cue('central');
  const agentAt = props.cue('agent');
  const deduceAt = wordFrame(S, 's02-02', 'deduce') - 6;
  const leeAt = wordFrame(S, 's02-03', 'lee') - 6;
  const labAt = wordFrame(S, 's02-04', 'analítica') - 8;
  const nonCredAt = wordFrame(S, 's02-04', 'non-credentialed') - 6;
  const credAt = Math.min(props.cue('monthly'), wordFrame(S, 's02-04', 'credentialed') - 6);
  const monthlyAt = credAt + 8;
  const offAt = wordFrame(S, 's02-05', 'encendido') - 6;
  const consultaAt = wordFrame(S, 's02-05', 'consulta') - 8;
  const awayAt = wordFrame(S, 's02-06', 'semanas') - 6;
  const reportAt = wordFrame(S, 's02-06', 'informa') - 6;
  const bandAt = wordFrame(S, 's02-06', 'pulsómetro') - 8;
  const agentBasedAt = wordFrame(S, 's02-06', 'agent-based') - 6;
  const agentlessAt = wordFrame(S, 's02-06', 'agentless') - 6;

  // ---- Phase A → B.
  const aOut = progress(frame, centralAt - 12, 18, EASE.inOut);
  const bIn = progress(frame, centralAt - 2, 18);

  // ---- Phase A focus: left on `outside`, right on `inside`; both back to equal on `doctor`.
  const serverIn = enter(frame, Math.min(serverAt, 0) - 4, { distance: 14, duration: 16 });
  const leftIn = progress(frame, outsideAt - 6, 16);
  const rightIn = progress(frame, insideAt - 6, 16);
  const toEqual = progress(frame, doctorAt - 4, 16, EASE.inOut);
  const leftDim = progress(frame, insideAt - 6, 14) * (1 - toEqual) * 0.6;
  const rightWait = 1 - rightIn;

  // ---- Phase B focus.
  const leftB = progress(frame, centralAt + 4, 16);
  const rightB = progress(frame, agentAt - 6, 16);
  const leftBDim = rightB * (1 - progress(frame, agentlessAt - 4, 14)) * 0.55;

  return (
    <Stage>
      {aOut < 0.999 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - aOut }}>
          {/* the server, and how each scan reaches it */}
          <svg width={W} height={CARD_H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <path
              d={`M ${CARD_W} 150 L ${SERVER.x} 120`}
              stroke={alpha(C.amber, 0.8)}
              strokeWidth={5}
              strokeDasharray="12 10"
              opacity={leftIn}
              strokeDashoffset={-frame * 0.6}
            />
            <path d={`M ${SERVER.x + SERVER.w} 120 L ${RIGHT_X} 150`} stroke={alpha(C.emerald, 0.85)} strokeWidth={6} opacity={rightIn} />
          </svg>
          <div style={{ position: 'absolute', left: SERVER.x, top: SERVER.y, width: SERVER.w, ...serverIn }}>
            <ServerBox label={SERVER_LABEL} />
          </div>

          <ScanCard
            x={LEFT_X}
            data={OUTSIDE}
            tone={C.amber}
            seenIcon="eye"
            show={leftIn}
            dim={leftDim}
            frame={frame}
            rowsAt={outsideAt + 30}
            verbAt={deduceAt}
            termAt={nonCredAt}
          />
          <ScanCard
            x={RIGHT_X}
            data={INSIDE}
            tone={C.emerald}
            seenIcon="file"
            show={rightIn}
            dim={0.5 * rightWait * leftIn}
            frame={frame}
            rowsAt={wordFrame(S, 's02-03', 'parches') - 4}
            verbAt={leeAt}
            termAt={credAt}
          />

          {/* la consulta in miniature: the doctor at the door, then the blood test */}
          {frame >= doctorAt - 8 ? (
            <>
              <MiniWithCaption x={MINI_X0} at={doctorAt} frame={frame} caption={DOCTOR.door} tone={C.amber}>
                <ConsultaTile kind="puerta" width={MINI_W} glow={progress(frame, doctorAt, 12) * (1 - 0.6 * progress(frame, labAt, 12))} />
              </MiniWithCaption>
              <MiniWithCaption x={MINI_X0 + MINI_W + MINI_GAP} at={labAt} frame={frame} caption={DOCTOR.lab} tone={C.emerald}>
                <ConsultaTile kind="analitica" width={MINI_W} glow={progress(frame, labAt, 12)} />
              </MiniWithCaption>
              <div style={{ position: 'absolute', left: MID_X, width: MID_W, top: MINI_Y + MINI_H + 58, display: 'flex', justifyContent: 'center', ...enter(frame, doctorAt + 4, { distance: 10 }) }}>
                <ImageTag />
              </div>
            </>
          ) : null}

          {/* the port's monthly scan, and the small note under it */}
          {frame >= monthlyAt - 2 ? (
            <>
              <div style={{ position: 'absolute', right: 0, top: MONTHLY_Y, ...enter(frame, monthlyAt, { distance: 14 }) }}>
                <Pill text={MONTHLY} tone={C.cyan} icon="clock" size={30} />
              </div>
              <div
                style={{
                  position: 'absolute',
                  right: 6,
                  top: NOTE_Y,
                  fontFamily: FONT.sans,
                  fontSize: 26,
                  fontWeight: 650,
                  color: C.muted,
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  ...enter(frame, monthlyAt + 12, { distance: 10 }),
                }}
              >
                <Icon name="key" size={26} color={C.amber} />
                {PRIVILEGED}
              </div>
            </>
          ) : null}
        </div>
      ) : null}

      {bIn > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: bIn }}>
          <CentralPanel frame={frame} show={leftB} dim={leftBDim} offAt={offAt} />
          <AgentPanel frame={frame} show={rightB} awayAt={awayAt} reportAt={reportAt} agentAt={agentAt} />

          {/* minis: the consulting room, the heart-rate band */}
          <div style={{ position: 'absolute', left: PANEL_W - 170, top: 486 }}>
            <ConsultaTile kind="consulta" width={160} show={progress(frame, consultaAt, 14)} glow={progress(frame, consultaAt, 12) * (1 - rightB)} dim={leftBDim} />
          </div>
          <div style={{ position: 'absolute', left: B_RIGHT_X + 10, top: 486 }}>
            <ConsultaTile kind="pulsometro" width={160} show={progress(frame, bandAt, 14)} glow={progress(frame, bandAt, 12)} />
          </div>
          {frame >= consultaAt - 4 ? (
            <div style={{ position: 'absolute', left: 0, width: W, top: 618, display: 'flex', justifyContent: 'center', ...enter(frame, consultaAt + 4, { distance: 8 }) }}>
              <ImageTag size={24} />
            </div>
          ) : null}

          {/* the English names on their words */}
          {frame >= agentlessAt - 2 ? (
            <div style={{ position: 'absolute', left: 0, top: 520, ...enter(frame, agentlessAt, { distance: 14 }) }}>
              <TermChip text={CENTRAL.term} size={40} on={progress(frame, agentlessAt, 12)} />
            </div>
          ) : null}
          {frame >= agentBasedAt - 2 ? (
            <div style={{ position: 'absolute', right: 0, top: 520, ...enter(frame, agentBasedAt, { distance: 14 }) }}>
              <TermChip text={AGENT.term} size={40} on={1 - 0.4 * progress(frame, agentlessAt, 12)} />
            </div>
          ) : null}
        </div>
      ) : null}
    </Stage>
  );
}

/** The office server, in schematic: a rack box with drive bays and its label. */
function ServerBox({ label }: { label: string }) {
  return (
    <div
      style={{
        width: SERVER.w,
        height: SERVER.h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(C.sky, 0.7)}`,
        background: alpha(C.sky, 0.08),
        boxShadow: `0 0 30px ${alpha(C.sky, 0.2)}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        fontFamily: FONT.sans,
      }}
    >
      <Icon name="server" size={110} color={C.sky} strokeWidth={1.6} />
      <span style={{ fontSize: 30, fontWeight: 750, color: C.text, whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  );
}

type ScanData = typeof OUTSIDE | typeof INSIDE;

/** One scan's column: header, what it sees, its rows (texture + tag), then its verb and English name. */
function ScanCard({
  x,
  data,
  tone,
  seenIcon,
  show,
  dim,
  frame,
  rowsAt,
  verbAt,
  termAt,
}: {
  x: number;
  data: ScanData;
  tone: string;
  seenIcon: IconName;
  show: number;
  dim: number;
  frame: number;
  rowsAt: number;
  verbAt: number;
  termAt: number;
}) {
  const s = clamp01(show);
  const d = clamp01(dim);
  const verbIn = progress(frame, verbAt, 12);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 0,
        width: CARD_W,
        height: CARD_H,
        boxSizing: 'border-box',
        padding: '20px 26px',
        borderRadius: RADIUS.lg,
        border: `3px solid ${alpha(tone, 0.25 + 0.5 * s)}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        boxShadow: s > 0.02 ? `0 0 ${Math.round(28 * s * (1 - d))}px ${alpha(tone, 0.18)}` : undefined,
        fontFamily: FONT.sans,
        opacity: 0.35 + 0.65 * s,
        filter: d > 0.01 ? `saturate(${1 - 0.5 * d}) brightness(${1 - 0.45 * d})` : undefined,
      }}
    >
      <div style={{ fontSize: 40, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>{data.head}</div>
      {data.seen.map((t, k) => (
        <div
          key={t}
          style={{
            marginTop: k === 0 ? 14 : 6,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 32,
            fontWeight: 700,
            color: C.text,
            whiteSpace: 'nowrap',
            opacity: progress(frame, rowsAt - 30 + k * 12, 12),
          }}
        >
          <Icon name={seenIcon} size={32} color={tone} />
          {t}
        </div>
      ))}
      <div style={{ position: 'absolute', left: 26, right: 26, top: ROW_Y0 - 18, height: 2, background: C.ink700 }} />
      {Array.from({ length: data.rows }, (_, k) => {
        const at = rowsAt + 6 + k * 10;
        return (
          <div
            key={k}
            style={{
              position: 'absolute',
              left: 26,
              right: 26,
              top: ROW_Y0 + k * ROW_STEP,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              ...enter(frame, at, { distance: 12, duration: 14, axis: 'x' }),
            }}
          >
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, background: alpha(tone, 0.8) }} />
              <div style={{ width: 120 + ((k * 53) % 70), height: 12, borderRadius: 6, background: alpha(C.text, 0.32) }} />
              <div style={{ width: 50 + ((k * 31) % 40), height: 12, borderRadius: 6, background: alpha(C.text, 0.18) }} />
            </div>
            <span
              style={{
                padding: '4px 16px',
                borderRadius: RADIUS.pill,
                border: `2px ${tone === C.amber ? 'dashed' : 'solid'} ${alpha(tone, 0.8)}`,
                background: alpha(tone, 0.12),
                fontSize: 30,
                fontWeight: 750,
                color: tone,
                whiteSpace: 'nowrap',
              }}
            >
              {data.tag}
            </span>
          </div>
        );
      })}
      {/* the verb and, on its word, the English name */}
      <div style={{ position: 'absolute', left: 26, top: 408, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10 }}>
        {frame >= verbAt - 2 ? (
          <div style={{ opacity: verbIn, transform: `scale(${0.9 + 0.1 * verbIn})`, transformOrigin: 'left center' }}>
            <Pill text={data.verb} tone={tone} icon={tone === C.amber ? 'search' : 'check'} size={38} />
          </div>
        ) : null}
        {frame >= termAt - 2 ? (
          <div style={{ ...enter(frame, termAt, { distance: 14, axis: 'x' }) }}>
            <TermChip text={data.term} size={34} on={progress(frame, termAt, 12)} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** A mini image with its one-word caption under it. */
function MiniWithCaption({ x, at, frame, caption, tone, children }: { x: number; at: number; frame: number; caption: string; tone: string; children: ReactNode }) {
  if (frame < at - 6) return null;
  const e = enter(frame, at, { distance: 14 });
  return (
    <div style={{ position: 'absolute', left: x, top: MINI_Y, width: MINI_W, ...e }}>
      {children}
      <div style={{ marginTop: 8, textAlign: 'center', fontFamily: FONT.sans, fontSize: 32, fontWeight: 800, color: tone, whiteSpace: 'nowrap' }}>{caption}</div>
    </div>
  );
}

// ---- Phase B pieces.

const NET = { x: 300, y: 90, w: 520, h: 330 } as const;
const DEVICES: { icon: IconName; state: 'on' | 'off' | 'away' }[] = [
  { icon: 'desktop', state: 'on' },
  { icon: 'server', state: 'on' },
  { icon: 'desktop', state: 'off' },
  { icon: 'laptop', state: 'on' },
  { icon: 'laptop', state: 'away' },
  { icon: 'desktop', state: 'on' },
];
const DEV_COLS = 3;
const devCenter = (i: number) => ({
  x: NET.x + 40 + (i % DEV_COLS) * ((NET.w - 80) / (DEV_COLS - 1)),
  y: NET.y + 110 + Math.floor(i / DEV_COLS) * 150,
});
const HUB = { x: 110, y: 270 } as const;

/** agentless: a central server reaches what is on and connected; one machine off, one away, stay unseen. */
function CentralPanel({ frame, show, dim, offAt }: { frame: number; show: number; dim: number; offAt: number }) {
  const d = clamp01(dim);
  const s = clamp01(show);
  const offIn = progress(frame, offAt, 14);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: PANEL_W, height: 500, fontFamily: FONT.sans, opacity: 0.4 + 0.6 * s, filter: d > 0.01 ? `saturate(${1 - 0.5 * d}) brightness(${1 - 0.45 * d})` : undefined }}>
      <div style={{ fontSize: 40, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>{CENTRAL.head}</div>
      <svg width={PANEL_W} height={460} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <rect x={NET.x} y={NET.y} width={NET.w} height={NET.h} rx={22} fill={alpha(C.sky, 0.04)} stroke={alpha(C.sky, 0.35)} strokeWidth={3} strokeDasharray="10 8" />
        {DEVICES.map((dv, i) => {
          const c = devCenter(i);
          const reach = progress(frame, offAt - 40 + i * 5, 16);
          if (dv.state === 'on') {
            return <line key={i} x1={HUB.x + 70} y1={HUB.y} x2={HUB.x + 70 + (c.x - 40 - HUB.x - 70) * reach} y2={HUB.y + (c.y - HUB.y) * reach} stroke={alpha(C.sky, 0.8)} strokeWidth={4} />;
          }
          // the scan heads for it and stops halfway: nothing answers
          const half = 0.55 * offIn;
          return <line key={i} x1={HUB.x + 70} y1={HUB.y} x2={HUB.x + 70 + (c.x - 40 - HUB.x - 70) * half} y2={HUB.y + (c.y - HUB.y) * half} stroke={alpha(C.muted, 0.6)} strokeWidth={4} strokeDasharray="8 8" />;
        })}
      </svg>
      {/* the central server */}
      <div style={{ position: 'absolute', left: HUB.x - 80, top: HUB.y - 80, width: 160, height: 160, borderRadius: 30, border: `3px solid ${alpha(C.sky, 0.8)}`, background: alpha(C.sky, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="server" size={96} color={C.sky} />
      </div>
      {DEVICES.map((dv, i) => {
        const c = devCenter(i);
        const on = dv.state === 'on';
        const label = dv.state === 'off' ? CENTRAL.off : dv.state === 'away' ? CENTRAL.away : '';
        return (
          <div key={i} style={{ position: 'absolute', left: c.x - 60, top: c.y - 50, width: 120, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: 20,
                border: `3px ${on ? 'solid' : 'dashed'} ${alpha(on ? C.sky : C.muted, on ? 0.7 : 0.5)}`,
                background: on ? alpha(C.sky, 0.08 + 0.1 * progress(frame, offAt - 30 + i * 5, 12)) : alpha(C.ink950, 0.6),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: on ? 1 : 1 - 0.45 * offIn,
              }}
            >
              <Icon name={dv.state === 'off' ? 'power' : dv.icon} size={60} color={on ? C.sky : C.faint} />
            </div>
            {label ? (
              <div style={{ marginTop: 6, fontSize: 30, fontWeight: 750, color: C.muted, whiteSpace: 'nowrap', opacity: offIn }}>{label}</div>
            ) : null}
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: 0, top: 440, fontSize: 34, fontWeight: 750, color: C.text, whiteSpace: 'nowrap', opacity: offIn }}>{CENTRAL.sub}</div>
    </div>
  );
}

/** agent-based: a laptop weeks away from the office, a scanning agent on it reporting back from wherever it is. */
function AgentPanel({ frame, show, awayAt, reportAt, agentAt }: { frame: number; show: number; awayAt: number; reportAt: number; agentAt: number }) {
  const s = clamp01(show);
  const awayIn = progress(frame, awayAt, 16);
  const badgeIn = progress(frame, agentAt + 40, 14);
  const report = progress(frame, reportAt, 30, EASE.inOut);
  const OFFICE = { x: 40, y: 150 };
  const LAPTOP = { x: 520, y: 120 };
  return (
    <div style={{ position: 'absolute', left: B_RIGHT_X, top: 0, width: PANEL_W, height: 500, fontFamily: FONT.sans, opacity: s }}>
      <div style={{ fontSize: 40, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>{AGENT.head}</div>
      <svg width={PANEL_W} height={460} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {/* the road between the office and wherever the laptop is */}
        <path d={`M ${OFFICE.x + 170} 360 Q 380 420 ${LAPTOP.x + 40} 360`} fill="none" stroke={alpha(C.muted, 0.35)} strokeWidth={10} strokeLinecap="round" strokeDasharray="2 22" />
        {/* the report, from the laptop back to the office */}
        <path
          d={`M ${LAPTOP.x + 20} ${LAPTOP.y + 60} Q 380 ${LAPTOP.y - 60} ${OFFICE.x + 150} ${OFFICE.y + 40}`}
          fill="none"
          stroke={alpha(C.emerald, 0.85)}
          strokeWidth={5}
          strokeDasharray="14 10"
          strokeDashoffset={frame * 1.2}
          pathLength={1000}
          opacity={report}
        />
      </svg>
      {/* the office */}
      <div style={{ position: 'absolute', left: OFFICE.x, top: OFFICE.y, width: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <svg width={150} height={150} viewBox="0 0 150 150">
          <rect x={20} y={30} width={110} height={116} rx={6} fill={C.ink800} stroke={alpha(C.sky, 0.6)} strokeWidth={4} />
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => <rect key={`${r}-${c}`} x={36 + c * 30} y={46 + r * 30} width={18} height={18} rx={3} fill={alpha(C.sky, 0.3)} />),
          )}
          <rect x={62} y={124} width={26} height={22} fill={C.ink950} />
        </svg>
        <div style={{ fontSize: 30, fontWeight: 750, color: C.muted, whiteSpace: 'nowrap' }}>{AGENT.office}</div>
      </div>
      {/* the laptop, far away */}
      <div style={{ position: 'absolute', left: LAPTOP.x - 60, top: LAPTOP.y - 50, width: 340, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontSize: 30, fontWeight: 750, color: C.amber, whiteSpace: 'nowrap', opacity: awayIn, marginBottom: 8 }}>{AGENT.away}</div>
        <div style={{ position: 'relative' }}>
          <Icon name="laptop" size={170} color={C.cyan} strokeWidth={1.5} />
          {/* signal arcs while it reports */}
          <svg width={80} height={60} style={{ position: 'absolute', right: -40, top: -10, opacity: report }}>
            {[14, 26, 38].map((r) => (
              <path key={r} d={`M ${10} ${54 - r} A ${r} ${r} 0 0 1 ${10 + r} ${54}`} fill="none" stroke={C.emerald} strokeWidth={4} strokeLinecap="round" />
            ))}
          </svg>
        </div>
        <div style={{ marginTop: 4, opacity: badgeIn, transform: `translateY(${(1 - badgeIn) * 10}px)` }}>
          <Pill text={AGENT.badge} tone={C.emerald} icon="shield" size={30} />
        </div>
      </div>
      <div style={{ position: 'absolute', right: 0, top: 440, fontSize: 34, fontWeight: 750, color: C.text, whiteSpace: 'nowrap', opacity: report }}>{AGENT.sub}</div>
    </div>
  );
}
