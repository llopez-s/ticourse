import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, springIn } from '../../../engine/src/theme/motion';
import { Icon, clamp01, dimStyle, mix } from '../../../engine/src/ui';
import { CLOSE, FATIGUE, KEY, PHONE, SMS } from '../data/s08-fatigue';
import { MarkStamp, TermTag } from './parts/Marks';
import { Stage, segment, wordFrame } from './kit';

const S = 's08-fatigue';
const W = 1728;

// Phase 1: the phone and what surrounds it.
const PHONE_BOX = { x: 70, y: 0, w: 500, h: 656 };
const SCREEN_INSET = 18;
const STACK_TOP = 262; // first notification, inside the phone

// Phase 2: the two answers.
const OPT = { y: 300, h: 168 }; // the think-prompt option cards (low: the prompt owns the top-centre)
const COL = { sms: { x: 0, w: 790 }, key: { x: 850, w: 878 }, headH: 96 };
const BROWSER = { y: 252, w: 430, h: 216 };
const CLOSE_Y = 578;

/**
 * s08-fatigue «Avisos sin parar». A simulated phone at 00:04 («simulación ·
 * sin fecha»): someone already has your password; approval requests pile up
 * (1, 10, 20) until a thumb taps «Aprobar» — MFA FATIGUE · push bombing.
 * Think prompt: SMS codes or a FIDO2 key? SMS is struck (diverted by SIM
 * swapping, typed into a fake site); the key must be touched where you sign in
 * and only signs for the real site — on the look-alike haldenp0rt.example it
 * does not («no firma», on the cue, with the block sound): phishing-resistant.
 */
export function S08Fatigue(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const premise = props.cue('premise');
  const pushes = props.cue('pushes');
  const fatigue = props.cue('fatigue');
  const sms = props.cue('sms');
  const key = props.cue('key');
  const origin = props.cue('origin');
  const s04 = segment(props, 's08-04');
  const s08 = segment(props, 's08-08');

  const wAlguien = wordFrame(S, 's08-01', 'Alguien');
  const wDiez = wordFrame(S, 's08-02', 'diez');
  const wVeinte = wordFrame(S, 's08-02', 'veinte');
  const wCansancio = wordFrame(S, 's08-02', 'cansancio');
  const wAprobar = wordFrame(S, 's08-02', 'aprobar');
  const wSmsQ = wordFrame(S, 's08-04', 'SMS');
  const wFidoQ = wordFrame(S, 's08-04', 'FIDO2');
  const wDesvia = wordFrame(S, 's08-05', 'desvía');
  const wTeclea = wordFrame(S, 's08-05', 'teclea');
  const wCambia = wordFrame(S, 's08-05', 'cambia');
  const wTocarla = wordFrame(S, 's08-06', 'tocarla');
  const wFirma = wordFrame(S, 's08-06', 'firma');
  const wResiste = wordFrame(S, 's08-07', 'resiste');
  const wAprueba = wordFrame(S, 's08-08', 'aprueba');
  const wSirve = wordFrame(S, 's08-08', 'sirve');

  // ---- Phase 1 ----------------------------------------------------------------
  const phase1Out = progress(frame, s04.from - 6, 16, EASE.inOut);
  // Requests: the first lands ON the cue (alarm), then 10 and 20 with the words.
  const count = frame < pushes ? 0 : frame < wDiez - 8 ? 1 : frame < wVeinte - 8 ? Math.round(mix(1, 10, progress(frame, wDiez - 8, 10, EASE.linear))) : Math.round(mix(10, 20, progress(frame, wVeinte - 8, 10, EASE.linear)));
  const thumb = progress(frame, wCansancio - 4, Math.max(12, wAprobar - (wCansancio - 4)), EASE.inOut);
  const tap = progress(frame, wAprobar, 12);
  const stripIn = progress(frame, wAlguien - 6, 14);

  // ---- Phase 2 ----------------------------------------------------------------
  const smsOpt = springIn(frame, fps, wSmsQ - 6, { damping: 16 });
  const keyOpt = springIn(frame, fps, wFidoQ - 6, { damping: 16 });
  const toTop = progress(frame, sms - 4, 20, EASE.inOut);
  const smsStrike = progress(frame, wCambia - 2, 14, EASE.inOut);
  const smsDim = progress(frame, key - 4, 16);
  const realIn = progress(frame, wFirma - 10, 14);
  const fakeIn = progress(frame, origin - 16, 14);
  const closeIn = progress(frame, s08.from - 2, 16);

  return (
    <Stage>
      {/* ===== Phase 1: the phone at 00:04 ===== */}
      {phase1Out < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - phase1Out }}>
          <Phone frame={frame} fps={fps} count={count} firstAt={pushes} tap={tap} premise={premise} />
          {thumb > 0 ? (
            <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: 660, overflow: 'hidden' }}>
              <Thumb p={thumb} tap={tap} />
            </div>
          ) : null}

          {/* «alguien ya tiene tu contraseña» */}
          {stripIn > 0 ? (
            <div style={{ position: 'absolute', left: 640, top: 34, opacity: stripIn, transform: `translateX(${(1 - stripIn) * 24}px)` }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  padding: '16px 30px',
                  borderRadius: RADIUS.lg,
                  border: `2px solid ${alpha(C.rose, 0.7)}`,
                  background: `linear-gradient(90deg, ${alpha(C.rose, 0.18)} 0%, ${alpha(C.ink900, 0.95)} 70%)`,
                  fontFamily: FONT.sans,
                  fontSize: 46,
                  fontWeight: 850,
                  color: C.textStrong,
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon name="key" size={48} color={C.rose} strokeWidth={2.2} />
                {PHONE.strip}
              </div>
            </div>
          ) : null}

          {/* The counter */}
          {count > 0 ? (
            <div style={{ position: 'absolute', left: 650, top: 210, fontFamily: FONT.sans, opacity: progress(frame, pushes, 6) }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
                <span style={{ fontSize: 176, fontWeight: 850, lineHeight: 1, color: count >= 10 ? C.amber : C.textStrong, fontVariantNumeric: 'tabular-nums', letterSpacing: -4 }}>{count}</span>
                <span style={{ fontSize: 44, fontWeight: 750, color: C.muted }}>{count === 1 ? PHONE.counterOne : PHONE.counter}</span>
              </div>
            </div>
          ) : null}

          {/* MFA FATIGUE · push bombing */}
          <div style={{ position: 'absolute', left: 1090, top: 300 }}>
            <TermTag frame={frame} fps={fps} at={fatigue} term={FATIGUE.term} sub={FATIGUE.sub} subAt={wordFrame(S, 's08-03', 'push') - 4} size={60} subSize={44} />
          </div>
        </div>
      ) : null}

      {/* ===== Phase 2: the answer ===== */}
      {smsOpt > 0.001 ? (
        <AnswerHead
          p={smsOpt}
          toTop={toTop}
          from={{ x: 150, y: OPT.y, w: 660, h: OPT.h }}
          to={{ x: COL.sms.x, y: 0, w: COL.sms.w, h: COL.headH }}
          art={<SmsArt size={mix(92, 70, toTop)} />}
          label={SMS.title}
          strike={smsStrike}
          dim={smsDim}
          tone={C.sky}
        />
      ) : null}
      {keyOpt > 0.001 ? (
        <AnswerHead
          p={keyOpt}
          toTop={toTop}
          from={{ x: 918, y: OPT.y, w: 660, h: OPT.h }}
          to={{ x: COL.key.x, y: 0, w: COL.key.w, h: COL.headH }}
          art={<KeyArt width={mix(150, 118, toTop)} touch={progress(frame, wTocarla - 2, 10) * (1 - progress(frame, wTocarla + 26, 12))} />}
          label={toTop > 0.5 ? KEY.title : 'llave FIDO2'}
          strike={0}
          dim={0}
          tone={C.cyan}
          glow={progress(frame, key - 4, 14)}
        />
      ) : null}
      {smsOpt > 0.001 && toTop < 1 ? (
        <div style={{ position: 'absolute', left: 810, top: OPT.y, width: 108, height: OPT.h, display: 'grid', placeItems: 'center', fontFamily: FONT.sans, fontSize: 52, fontWeight: 800, color: C.muted, opacity: Math.min(smsOpt, keyOpt) * (1 - toTop) }}>
          o
        </div>
      ) : null}

      {/* SMS column */}
      <div style={{ position: 'absolute', left: COL.sms.x, top: 0, width: COL.sms.w, height: 560, ...dimStyle(smsDim) }}>
        <Line at={wDesvia - 6} frame={frame} top={120} icon="split" tone={C.rose}>
          {SMS.swap}
        </Line>
        <Line at={wTeclea - 6} frame={frame} top={192} icon="globe" tone={C.rose}>
          {SMS.fake}
        </Line>
        <div style={{ position: 'absolute', left: 0, top: 272, opacity: progress(frame, wCambia - 4, 12), transform: `translateY(${(1 - progress(frame, wCambia - 4, 12)) * 10}px)` }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '10px 26px', borderRadius: RADIUS.pill, border: `3px solid ${C.rose}`, background: alpha(C.rose, 0.14), fontFamily: FONT.sans, fontSize: 40, fontWeight: 850, color: C.roseSoft, whiteSpace: 'nowrap' }}>
            <Icon name="x" size={40} color={C.rose} strokeWidth={2.8} />
            {SMS.verdict}
          </span>
        </div>
        <SimSwap frame={frame} at={wDesvia - 2} top={370} />
      </div>

      {/* Key column */}
      <div style={{ position: 'absolute', left: COL.key.x, top: 0, width: COL.key.w, height: 580 }}>
        <Line at={wTocarla - 8} frame={frame} top={120} icon="target" tone={C.cyan}>
          {KEY.touch}
        </Line>
        <Line at={wFirma - 10} frame={frame} top={192} icon="check" tone={C.emerald}>
          {KEY.origin}
        </Line>
        {/* the real site and the look-alike */}
        {realIn > 0 ? (
          <div style={{ position: 'absolute', left: 0, top: BROWSER.y, opacity: realIn, transform: `translateY(${(1 - realIn) * 16}px)` }}>
            <Browser kind="real" />
            <div style={{ position: 'absolute', left: 0, top: 84, width: BROWSER.w, display: 'flex', justifyContent: 'center' }}>
              <MarkStamp frame={frame} at={wFirma - 2} tone="emerald" icon="key" size={40} rotate={-5}>
                {KEY.signs}
              </MarkStamp>
            </div>
          </div>
        ) : null}
        {fakeIn > 0 ? (
          <div style={{ position: 'absolute', left: COL.key.w - BROWSER.w, top: BROWSER.y, opacity: fakeIn, transform: `translateX(${(1 - fakeIn) * 30}px)` }}>
            <Browser kind="fake" />
            <div style={{ position: 'absolute', left: 0, top: 84, width: BROWSER.w, display: 'flex', justifyContent: 'center' }}>
              <MarkStamp frame={frame} at={origin} tone="rose" icon="key" size={40} rotate={5}>
                {KEY.noSign}
              </MarkStamp>
            </div>
          </div>
        ) : null}
        {/* resistente al phishing */}
        <div style={{ position: 'absolute', left: 0, top: BROWSER.y + BROWSER.h + 18, width: COL.key.w, display: 'flex', justifyContent: 'center', opacity: progress(frame, wResiste - 6, 14) }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '10px 28px', borderRadius: RADIUS.pill, border: `3px solid ${C.emerald}`, background: alpha(C.emerald, 0.14), fontFamily: FONT.sans, fontSize: 40, fontWeight: 850, color: '#6ee7b7', whiteSpace: 'nowrap' }}>
            <Icon name="shield" size={42} color={C.emerald} strokeWidth={2.4} />
            {KEY.resist}
          </span>
        </div>
      </div>

      {/* Chapter close: the two ideas */}
      {closeIn > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: CLOSE_Y, width: W, display: 'flex', justifyContent: 'center', opacity: closeIn, transform: `translateY(${(1 - closeIn) * 14}px)` }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 22,
              padding: '12px 34px',
              borderRadius: RADIUS.lg,
              border: `2px solid ${alpha(C.emerald, 0.75)}`,
              background: `linear-gradient(180deg, ${alpha(C.emerald, 0.14)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
              boxShadow: `0 0 30px ${alpha(C.emerald, 0.2)}`,
              fontFamily: FONT.sans,
              fontSize: 42,
              fontWeight: 850,
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ color: frame >= wAprueba - 4 ? C.textStrong : C.muted }}>{CLOSE[0]}</span>
            <span style={{ color: C.faint, fontWeight: 400 }}>·</span>
            <span style={{ color: frame >= wSirve - 4 ? C.textStrong : C.muted }}>{CLOSE[1]}</span>
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

// ---------------------------------------------------------------------------
// Phase 1
// ---------------------------------------------------------------------------

function Phone({ frame, fps, count, firstAt, tap, premise }: { frame: number; fps: number; count: number; firstAt: number; tap: number; premise: number }) {
  const sw = PHONE_BOX.w - 2 * SCREEN_INSET;
  const show = progress(frame, Math.min(0, premise - 20), 12);
  // The stack thickens as the count climbs (1 card, then one more edge every 3 requests): no strobing.
  const visible = count === 0 ? 0 : Math.min(6, 1 + Math.floor((count - 1) / 3));
  return (
    <div style={{ position: 'absolute', left: PHONE_BOX.x, top: PHONE_BOX.y, width: PHONE_BOX.w, height: PHONE_BOX.h, opacity: show, isolation: 'isolate' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 56,
          background: C.ink800,
          border: `4px solid ${C.ink600}`,
          boxShadow: `0 40px 80px ${alpha('#000000', 0.5)}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: SCREEN_INSET,
          top: SCREEN_INSET,
          width: sw,
          height: PHONE_BOX.h - 2 * SCREEN_INSET,
          borderRadius: 42,
          overflow: 'hidden',
          background: `linear-gradient(180deg, ${C.ink900} 0%, ${C.ink950} 100%)`,
          fontFamily: FONT.sans,
        }}
      >
        {/* Notch */}
        <div style={{ position: 'absolute', left: sw / 2 - 60, top: 12, width: 120, height: 28, borderRadius: 14, background: C.ink800 }} />
        {/* Lock-screen clock */}
        <div style={{ position: 'absolute', left: 0, top: 58, width: sw, textAlign: 'center', fontSize: 112, fontWeight: 300, color: C.textStrong, letterSpacing: -2, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
          {PHONE.clock}
        </div>
        <div style={{ position: 'absolute', left: 0, top: 186, width: sw, display: 'flex', justifyContent: 'center' }}>
          <span style={{ padding: '6px 18px', borderRadius: RADIUS.pill, border: `2px solid ${alpha(C.amber, 0.7)}`, background: alpha(C.amber, 0.12), fontSize: 26, fontWeight: 750, color: '#fcd34d', whiteSpace: 'nowrap' }}>
            {PHONE.sim}
          </span>
        </div>
        {/* Stacked requests: the newest on top, the older ones behind it */}
        {Array.from({ length: visible }, (_, k) => {
          const depth = visible - 1 - k; // 0 = newest
          const newest = depth === 0;
          // Only the first request slides in (on the cue, with the alarm); later ones just thicken the stack.
          const land = newest && count === 1 ? springIn(frame, fps, firstAt, { damping: 15 }) : 1;
          const y = STACK_TOP + depth * 16;
          const scale = 1 - depth * 0.04;
          return (
            <div
              key={k}
              style={{
                position: 'absolute',
                left: 10,
                top: y,
                width: sw - 20,
                transform: `translateY(${(1 - Math.min(1, land)) * -40}px) scale(${scale})`,
                transformOrigin: 'top center',
                opacity: newest ? Math.min(1, land * 1.4) : 1 - depth * 0.12,
                zIndex: 10 - depth,
              }}
            >
              <PushCard newest={newest} tap={newest ? tap : 0} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PushCard({ newest, tap }: { newest: boolean; tap: number }) {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        borderRadius: 22,
        padding: '16px 18px 18px',
        background: newest ? alpha(C.ink700, 0.98) : alpha(C.ink800, 0.98),
        border: `2px solid ${newest ? alpha(C.cyan, 0.5) : C.ink600}`,
        boxShadow: `0 14px 30px ${alpha('#000000', 0.45)}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Icon name="shield" size={30} color={C.cyan} />
        <span style={{ fontSize: 29, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap', letterSpacing: -0.4 }}>{PHONE.push}</span>
      </div>
      <div style={{ marginTop: 14, display: 'flex', gap: 12 }}>
        <span
          style={{
            flex: 1,
            textAlign: 'center',
            padding: '10px 0',
            borderRadius: 14,
            background: tap > 0.3 ? C.amber : alpha(C.cyan, 0.85),
            color: C.ink950,
            fontSize: 28,
            fontWeight: 850,
            boxShadow: tap > 0 ? `0 0 ${24 * tap}px ${alpha(C.amber, 0.6 * tap)}` : undefined,
          }}
        >
          {PHONE.approve}
        </span>
        <span style={{ flex: 1, textAlign: 'center', padding: '10px 0', borderRadius: 14, border: `2px solid ${C.ink500}`, color: C.text, fontSize: 28, fontWeight: 750 }}>{PHONE.reject}</span>
      </div>
    </div>
  );
}

/** A thumb that comes up from below the phone and taps «Aprobar». */
function Thumb({ p, tap }: { p: number; tap: number }) {
  // «Aprobar» of the newest card, in stage coordinates.
  const target = { x: PHONE_BOX.x + SCREEN_INSET + 10 + 100, y: PHONE_BOX.y + SCREEN_INSET + STACK_TOP + 92 };
  const start = { x: target.x + 300, y: target.y + 460 };
  const x = mix(start.x, target.x, p);
  const y = mix(start.y, target.y, p) + tap * 6;
  // The fingertip (the top of the rounded tip) sits on (x, y); the finger runs down-right out of frame.
  return (
    <svg width={10} height={10} style={{ position: 'absolute', left: x, top: y, overflow: 'visible', pointerEvents: 'none' }}>
      {tap > 0 && tap < 1 ? <circle cx={0} cy={0} r={18 + 44 * tap} fill="none" stroke={alpha(C.amber, 1 - tap)} strokeWidth={4} /> : null}
      <g transform="rotate(-38) translate(0 44)">
        <path d="M -44 0 A 44 44 0 0 1 44 0 L 50 330 L -50 330 Z" fill="#cfa98f" stroke="#7d5f4c" strokeWidth={3} strokeLinejoin="round" />
        <ellipse cx={0} cy={-6} rx={26} ry={32} fill="#ecd6c6" stroke="#a88672" strokeWidth={2} />
        <path d="M -40 120 Q 0 132 40 120" fill="none" stroke="#9c7a64" strokeWidth={2.5} strokeLinecap="round" />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Phase 2
// ---------------------------------------------------------------------------

type Box = { x: number; y: number; w: number; h: number };

function AnswerHead({
  p,
  toTop,
  from,
  to,
  art,
  label,
  strike,
  dim,
  tone,
  glow = 0,
}: {
  p: number;
  toTop: number;
  from: Box;
  to: Box;
  art: ReactNode;
  label: string;
  strike: number;
  dim: number;
  tone: string;
  glow?: number;
}) {
  const x = mix(from.x, to.x, toTop);
  const y = mix(from.y, to.y, toTop);
  const w = mix(from.w, to.w, toTop);
  const h = mix(from.h, to.h, toTop);
  const fs = mix(52, 46, toTop);
  const g = clamp01(glow);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + (1 - Math.min(1, p)) * 20,
        width: w,
        height: h,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        padding: '0 26px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(tone, 0.5 + 0.4 * g)}`,
        background: `linear-gradient(180deg, ${alpha(tone, 0.12 + 0.08 * g)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        boxShadow: g > 0.02 ? `0 0 ${Math.round(34 * g)}px ${alpha(tone, 0.3 * g)}` : `0 24px 50px ${alpha('#000000', 0.35)}`,
        fontFamily: FONT.sans,
        ...dimStyle(dim, Math.min(1, p * 1.3)),
      }}
    >
      {art}
      <span style={{ position: 'relative', fontSize: fs, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap', letterSpacing: -0.5 }}>
        {label}
        {strike > 0 ? <span style={{ position: 'absolute', left: -6, top: '54%', height: 6, width: `calc(${strike * 100}% + 12px)`, borderRadius: 3, background: C.rose }} /> : null}
      </span>
    </div>
  );
}

function Line({ at, frame, top, icon, tone, children }: { at: number; frame: number; top: number; icon: 'split' | 'globe' | 'target' | 'check'; tone: string; children: ReactNode }) {
  const p = progress(frame, at, 14);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: 6, top, height: 56, display: 'flex', alignItems: 'center', gap: 16, opacity: p, transform: `translateX(${(1 - p) * 18}px)`, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
      <Icon name={icon} size={38} color={tone} strokeWidth={2.2} />
      <span style={{ fontSize: 35, fontWeight: 750, color: C.textStrong }}>{children}</span>
    </div>
  );
}

function SmsArt({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ flexShrink: 0 }}>
      <rect x={14} y={4} width={30} height={56} rx={6} fill={C.ink800} stroke={C.sky} strokeWidth={3} />
      <rect x={30} y={14} width={30} height={20} rx={6} fill={alpha(C.sky, 0.9)} />
      <path d="M 36 34 L 34 40 L 42 34 Z" fill={alpha(C.sky, 0.9)} />
      <path d="M 36 21 L 54 21 M 36 27 L 48 27" stroke={C.ink950} strokeWidth={3} strokeLinecap="round" />
    </svg>
  );
}

/** A FIDO2 security key (USB) with its touch disc; `touch` 0–1 lights the disc. */
function KeyArt({ width, touch = 0 }: { width: number; touch?: number }) {
  const h = width * 0.42;
  const t = clamp01(touch);
  return (
    <svg width={width} height={h} viewBox="0 0 150 63" style={{ flexShrink: 0, overflow: 'visible' }}>
      <rect x={2} y={18} width={34} height={27} rx={3} fill={METAL} stroke={C.ink600} strokeWidth={2} />
      <rect x={8} y={24} width={8} height={5} fill={C.ink700} />
      <rect x={20} y={24} width={8} height={5} fill={C.ink700} />
      <rect x={34} y={6} width={112} height={51} rx={14} fill={C.ink700} stroke={C.cyan} strokeWidth={3} />
      <circle cx={96} cy={31} r={14} fill={t > 0.05 ? C.amber : alpha(C.amber, 0.55)} stroke="#fde68a" strokeWidth={2} />
      {t > 0 ? <circle cx={96} cy={31} r={14 + 16 * t} fill="none" stroke={alpha(C.amber, 0.8 * (1 - t * 0.6))} strokeWidth={3} /> : null}
      <circle cx={132} cy={31} r={5} fill="none" stroke={alpha(C.cyan, 0.8)} strokeWidth={2.5} />
    </svg>
  );
}
const METAL = '#cbd5e1';

/** The SMS code diverted to another phone (SIM swapping), drawn small under the SMS lines. */
function SimSwap({ frame, at, top }: { frame: number; at: number; top: number }) {
  const p = progress(frame, at, 14);
  if (p <= 0.001) return null;
  const travel = progress(frame, at + 8, 26, EASE.inOut);
  const bx = mix(150, 560, travel);
  const by = 70 - Math.sin(travel * Math.PI) * 50;
  return (
    <svg width={760} height={170} viewBox="0 0 760 170" style={{ position: 'absolute', left: 0, top, opacity: p, overflow: 'visible' }}>
      {/* your phone */}
      <rect x={90} y={30} width={70} height={124} rx={12} fill={C.ink800} stroke={alpha(C.cyan, 0.6)} strokeWidth={3} />
      <path d="M 112 44 L 138 44" stroke={alpha(C.cyan, 0.6)} strokeWidth={3} strokeLinecap="round" />
      {/* the other phone */}
      <rect x={560} y={30} width={70} height={124} rx={12} fill={C.ink800} stroke={C.rose} strokeWidth={3} />
      <path d="M 582 44 L 608 44" stroke={C.rose} strokeWidth={3} strokeLinecap="round" />
      {/* the route */}
      <path d="M 170 70 Q 360 0 550 70" fill="none" stroke={alpha(C.rose, 0.6)} strokeWidth={4} strokeDasharray="10 10" />
      <path d="M 536 58 L 552 72 L 534 82" fill="none" stroke={alpha(C.rose, 0.8)} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      {/* the SMS in transit */}
      <g transform={`translate(${bx - 26}, ${by - 16})`}>
        <rect x={0} y={0} width={52} height={32} rx={8} fill={C.sky} />
        <path d="M 10 12 L 42 12 M 10 20 L 32 20" stroke={C.ink950} strokeWidth={3} strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** A browser window with a login page; the look-alike is identical but for its address. */
function Browser({ kind }: { kind: 'real' | 'fake' }) {
  const fake = kind === 'fake';
  const edge = fake ? C.rose : C.emerald;
  return (
    <div
      style={{
        width: BROWSER.w,
        height: BROWSER.h,
        boxSizing: 'border-box',
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(edge, 0.6)}`,
        background: C.ink900,
        overflow: 'hidden',
        fontFamily: FONT.sans,
        boxShadow: `0 20px 44px ${alpha('#000000', 0.4)}`,
      }}
    >
      <div style={{ height: 58, display: 'flex', alignItems: 'center', padding: '0 10px', background: C.ink800, borderBottom: `2px solid ${C.ink700}` }}>
        <div style={{ flex: 1, height: 40, borderRadius: 20, background: C.ink950, display: 'flex', alignItems: 'center', gap: 8, padding: '0 14px', whiteSpace: 'nowrap', overflow: 'hidden' }}>
          <Icon name="lock" size={22} color={C.muted} />
          {fake ? (
            <span style={{ fontFamily: FONT.mono, fontSize: 30, fontWeight: 750 }}>
              {KEY.fakeHost.split('').map((ch, i) => (
                <span key={i} style={{ color: i === KEY.fakeIndex ? C.rose : C.text }}>
                  {ch}
                </span>
              ))}
            </span>
          ) : (
            <span style={{ fontSize: 30, fontWeight: 750, color: '#6ee7b7' }}>{KEY.real}</span>
          )}
        </div>
      </div>
      {/* The same login page in both */}
      <div style={{ padding: '14px 26px' }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: C.text }}>{KEY.login}</div>
        <div style={{ marginTop: 10, height: 26, borderRadius: 6, background: C.ink800, border: `2px solid ${C.ink600}` }} />
        <div style={{ marginTop: 10, height: 26, borderRadius: 6, background: C.ink800, border: `2px solid ${C.ink600}` }} />
        <div style={{ marginTop: 12, width: 120, height: 30, borderRadius: 6, background: alpha(C.cyan, 0.8) }} />
      </div>
    </div>
  );
}

