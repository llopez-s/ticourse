import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, pulse } from '../../../engine/src/theme/motion';
import { Icon, clamp01, mix, windowWeight } from '../../../engine/src/ui';
import { CAR, LOOKUP, OWN_SANDBOX, REPLY, SERVICE } from '../data/s02-hash';
import { CarVignette, carNotebookLine, carVignetteHeight } from './parts/CarVignette';
import { SampleCard, SandboxBox, sampleCardHeight, sandboxSlot } from './parts/SampleBox';
import { Stage, wordFrame } from './kit';

const SCENE = 's02-hash';
const W = 1728;

// Phase A (intercept + reply): the public service on the left, below the top-centre band; the eye and its chain
// on the right. Everything sits at stage y ≥ 236 while the intercepted message is up.
const PANEL_A = { x: 0, y: 236, w: 880, h: 404 } as const;
const REPLY_X = 936;
// Phase B: the car vignette, full width. Phase C: it becomes a thumbnail top-left and the search opens.
const CAR_FULL = { x: 0, y: 108, w: 1728 } as const;
const CAR_THUMB = { x: 0, y: 0, w: 700 } as const;
const PANEL_C = { x: 284, y: 214, w: 1160, h: 420 } as const;
const HEADER_H = 66;
const FIELD = { dx: 36, dy: HEADER_H + 34, w: 640, h: 96 } as const;
const VALUE_DX = 272;
const VALUE_SIZE = 44;
// Phase D: the box of s01, now lit, with its label on the right (s03 opens on the same box).
export const S02_BOX = { x: 430, y: 116, w: 390 } as const;
const LABEL_X = 880;

/**
 * s02-hash «Antes de abrirla». A generic public analysis service with a beating «Subir muestra» is up from the first
 * frame; the intercepted message types over it (top-centre band kept clear). `reply`: an eye beside the button,
 * «también puede mirar el atacante», and the chain «si la ve · puede saber que lo has descubierto · cambia de
 * dominios». `car`: the odd car in your street — the notebook with the plate, the struck note on the windscreen.
 * `lookup`: the notebook's line becomes the search «buscar · 9f3a2c...e1» («no sube el fichero»); `no-hits`:
 * «sin resultados», and the lesson's other reason, small and grey. `own-sandbox`: s01's box lights — «sandbox
 * interno de Meridian · máquina aislada, de usar y tirar» — and the sample card drops into it.
 */
export function S02Hash(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const replyAt = props.cue('reply');
  const carAt = props.cue('car');
  const lookupAt = props.cue('lookup');
  const noHitsAt = props.cue('no-hits');
  const ownAt = props.cue('own-sandbox');

  const wSuyos = wordFrame(SCENE, 's02-01', 'suyos');
  const wVen = wordFrame(SCENE, 's02-01', 'ven');
  const wSaber = wordFrame(SCENE, 's02-01', 'saber');
  const wCambiar = wordFrame(SCENE, 's02-01', 'cambiar');
  const wEncarga = wordFrame(SCENE, 's02-01', 'encarga');
  const wMatricula = wordFrame(SCENE, 's02-02', 'matrícula');
  const wNota = wordFrame(SCENE, 's02-02', 'nota');
  const wParabrisas = wordFrame(SCENE, 's02-02', 'parabrisas');
  const wSubirlo = wordFrame(SCENE, 's02-03', 'subirlo');
  const wSubido = wordFrame(SCENE, 's02-04', 'subido');
  const wSandbox = wordFrame(SCENE, 's02-05', 'sandbox');
  const wAislada = wordFrame(SCENE, 's02-05', 'aislada');

  // ---------------------------------------------------------------- phase A: the service + the reply
  const aOut = progress(frame, carAt - 10, 14, EASE.inOut);
  const aIn = progress(frame, 0, 12);
  const eyeIn = progress(frame, replyAt - 4, 16);
  const eyeGlow = windowWeight(frame, wSuyos - 6, wVen - 4, { ramp: 10 });
  const step = [progress(frame, wVen - 6, 14), progress(frame, wSaber - 6, 14), progress(frame, wCambiar - 6, 14)];
  const ironyGlow = windowWeight(frame, wEncarga - 6, carAt, { ramp: 12 });

  // ---------------------------------------------------------------- phase B: the car
  const carIn = progress(frame, carAt - 4, 18);
  const nbIn = progress(frame, wMatricula - 8, 16);
  const noteIn = progress(frame, wNota - 6, 14);
  const strike = progress(frame, wParabrisas + 4, 14, EASE.inOut);
  const toThumb = progress(frame, lookupAt - 8, 20, EASE.inOut);

  // ---------------------------------------------------------------- phase C: the search
  const dOut = progress(frame, ownAt - 8, 16, EASE.inOut);
  const searchIn = progress(frame, lookupAt + 10, 14);
  const fly = progress(frame, lookupAt + 14, 22, EASE.inOut);
  const verbIn = progress(frame, lookupAt + 18, 12);
  const chipIn = progress(frame, wSubirlo - 6, 14);
  const resultIn = progress(frame, noHitsAt - 2, 14);
  const alsoIn = progress(frame, wSubido - 4, 16);

  const carW = mix(CAR_FULL.w, CAR_THUMB.w, toThumb);
  const carX = mix(CAR_FULL.x, CAR_THUMB.x, toThumb);
  const carY = mix(CAR_FULL.y, CAR_THUMB.y, toThumb);
  const carShow = carIn * (1 - dOut);

  // The notebook's line flies from the thumbnail into the search field and becomes the hash search.
  const nbLine = carNotebookLine(CAR_THUMB.w);
  const from = { x: CAR_THUMB.x + nbLine.x, y: CAR_THUMB.y + nbLine.y + nbLine.h / 2, size: nbLine.size };
  const fieldX = PANEL_C.x + FIELD.dx;
  const fieldY = PANEL_C.y + FIELD.dy;
  const to = { x: fieldX + VALUE_DX, y: fieldY + FIELD.h / 2, size: VALUE_SIZE };
  const flyX = mix(from.x, to.x, fly);
  const flyY = mix(from.y, to.y, fly) - Math.sin(Math.PI * fly) * 40;
  const flySize = mix(from.size, to.size, fly);
  const swap = progress(frame, lookupAt + 22, 10);

  // ---------------------------------------------------------------- phase D: the own sandbox
  const boxIn = progress(frame, ownAt - 4, 20);
  const litAt = Math.max(wSandbox - 4, ownAt + 46);
  const lit = progress(frame, litAt, 16);
  const flash = windowWeight(frame, wordFrame(SCENE, 's02-05', 'hace') - 6, wordFrame(SCENE, 's02-05', 'hace') + 24, { ramp: 8 });
  const labelIn = progress(frame, litAt + 6, 16);
  const subIn = progress(frame, Math.max(wAislada - 6, litAt + 14), 16);
  const slot = sandboxSlot(S02_BOX.w);
  const cardStart = { x: 20, y: 330, w: 380 };
  const cardAbove = { x: S02_BOX.x + slot.x - slot.w / 2, y: S02_BOX.y + slot.y - sampleCardHeight(slot.w) - 2, w: slot.w };
  const cardIn = progress(frame, ownAt + 2, 12);
  const cardFly = progress(frame, ownAt + 14, 20, EASE.inOut);
  const cardDrop = progress(frame, ownAt + 34, 10, EASE.in);
  const card = {
    x: mix(cardStart.x, cardAbove.x, cardFly),
    y: mix(cardStart.y, cardAbove.y, cardFly) + cardDrop * (sampleCardHeight(slot.w) + 8) - Math.sin(Math.PI * cardFly) * 60,
    w: mix(cardStart.w, cardAbove.w, cardFly),
  };
  const cardShow = cardIn * (1 - progress(frame, ownAt + 40, 6));
  const holding = progress(frame, ownAt + 42, 12);

  const btnPulse = pulse(frame, fps, 0.8);

  return (
    <Stage>
      {/* ---------- Phase A ---------- */}
      {aOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: aIn * (1 - aOut), transform: `translateX(${-60 * aOut}px)` }}>
          <ServicePanel x={PANEL_A.x} y={PANEL_A.y} w={PANEL_A.w} h={PANEL_A.h}>
            <AvRow width={PANEL_A.w - 72} />
            <div style={{ position: 'absolute', left: 0, top: 140, width: PANEL_A.w, display: 'flex', justifyContent: 'center' }}>
              <UploadButton glow={0.45 + 0.55 * btnPulse} />
            </div>
          </ServicePanel>

          {/* The eye beside the button, and its chain */}
          {eyeIn > 0 ? (
            <>
              <svg width={W} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: eyeIn }}>
                <path d={`M ${PANEL_A.x + 712} ${PANEL_A.y + 196} C ${PANEL_A.x + 800} ${PANEL_A.y + 196}, ${REPLY_X - 40} 300, ${REPLY_X - 6} 300`} fill="none" stroke={alpha(C.rose, 0.55)} strokeWidth={3} strokeDasharray="8 9" />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  left: REPLY_X,
                  top: 256,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  opacity: eyeIn,
                  transform: `translateX(${(1 - eyeIn) * 24}px)`,
                  fontFamily: FONT.sans,
                  whiteSpace: 'nowrap',
                }}
              >
                <div
                  style={{
                    width: 86,
                    height: 86,
                    borderRadius: 43,
                    display: 'grid',
                    placeItems: 'center',
                    background: alpha(C.rose, 0.12 + 0.12 * eyeGlow),
                    border: `3px solid ${alpha(C.rose, 0.7 + 0.3 * eyeGlow)}`,
                    boxShadow: eyeGlow > 0 ? `0 0 ${Math.round(30 * eyeGlow)}px ${alpha(C.rose, 0.45 * eyeGlow)}` : undefined,
                  }}
                >
                  <Icon name="eye" size={52} color={C.rose} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: 40, fontWeight: 800, color: C.roseSoft }}>{REPLY.eye}</span>
              </div>
            </>
          ) : null}
          <Chain x={REPLY_X + 20} y={378} steps={step} irony={ironyGlow} />
        </div>
      ) : null}

      {/* ---------- Phase B/C: the car (full, then thumbnail) ---------- */}
      {carShow > 0.001 ? (
        <div style={{ position: 'absolute', left: carX, top: carY, opacity: carShow }}>
          <CarVignette width={carW} street={1} notebook={nbIn} note={noteIn} strike={strike} lift={fly > 0 ? 1 : 0} glowNotebook={windowWeight(frame, wMatricula - 6, wNota - 4)} />
          {toThumb > 0.02 ? (
            <div style={{ position: 'absolute', left: 0, top: 0, width: carW, height: carVignetteHeight(carW), borderRadius: 18, boxShadow: `inset 0 0 0 2px ${alpha(C.ink600, toThumb)}` }} />
          ) : null}
        </div>
      ) : null}

      {/* ---------- Phase C: the search ---------- */}
      {searchIn > 0 && dOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: searchIn * (1 - dOut), transform: `translateX(${-60 * dOut}px)` }}>
          <ServicePanel x={PANEL_C.x} y={PANEL_C.y} w={PANEL_C.w} h={PANEL_C.h}>
            {/* the search field */}
            <div
              style={{
                position: 'absolute',
                left: FIELD.dx,
                top: FIELD.dy - HEADER_H,
                width: FIELD.w,
                height: FIELD.h,
                boxSizing: 'border-box',
                borderRadius: 20,
                background: alpha(C.cyan, 0.06),
                border: `3px solid ${alpha(C.cyan, 0.75)}`,
                boxShadow: `0 0 26px ${alpha(C.cyan, 0.18)}`,
              }}
            >
              <div style={{ position: 'absolute', left: 28, top: 0, height: FIELD.h - 6, display: 'flex', alignItems: 'center' }}>
                <Icon name="search" size={46} color={C.cyan} strokeWidth={2.2} />
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: 92,
                  top: 0,
                  height: FIELD.h - 6,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  fontFamily: FONT.sans,
                  fontSize: 38,
                  fontWeight: 700,
                  color: C.muted,
                  opacity: verbIn,
                  whiteSpace: 'nowrap',
                }}
              >
                {LOOKUP.verb}
                <span style={{ color: C.faint }}>·</span>
              </div>
            </div>
            {/* «no sube el fichero» */}
            <div style={{ position: 'absolute', left: FIELD.dx + FIELD.w + 22, top: FIELD.dy - HEADER_H + (FIELD.h - 66) / 2, opacity: chipIn, transform: `translateX(${(1 - chipIn) * 16}px)` }}>
              <GreenChip icon="check">{LOOKUP.chip}</GreenChip>
            </div>
            {/* the result */}
            <div
              style={{
                position: 'absolute',
                left: FIELD.dx + 6,
                top: FIELD.dy - HEADER_H + FIELD.h + 34,
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                opacity: resultIn,
                transform: `translateY(${(1 - resultIn) * 14}px)`,
                fontFamily: FONT.sans,
                whiteSpace: 'nowrap',
              }}
            >
              <div style={{ width: 70, height: 70, borderRadius: 35, display: 'grid', placeItems: 'center', background: alpha(C.emerald, 0.14), border: `3px solid ${alpha(C.emerald, 0.8)}` }}>
                <Icon name="check" size={44} color={C.emerald} strokeWidth={2.6} />
              </div>
              <span style={{ fontSize: 60, fontWeight: 850, color: C.emerald, letterSpacing: -0.5 }}>{LOOKUP.result}</span>
            </div>
            <div
              style={{
                position: 'absolute',
                left: FIELD.dx + 8,
                top: FIELD.dy - HEADER_H + FIELD.h + 140,
                fontFamily: FONT.sans,
                fontSize: 30,
                fontWeight: 600,
                color: C.faint,
                whiteSpace: 'nowrap',
                opacity: alsoIn,
              }}
            >
              {LOOKUP.also}
            </div>
          </ServicePanel>
        </div>
      ) : null}

      {/* The notebook's line, flying and landing as the search value */}
      {fly > 0 && dOut < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: flyX,
            top: flyY,
            transform: 'translateY(-50%)',
            fontFamily: FONT.mono, fontVariantLigatures: 'none', fontFeatureSettings: '"liga" 0, "calt" 0',
            fontSize: flySize,
            fontWeight: 800,
            whiteSpace: 'nowrap',
            opacity: 1 - dOut,
            lineHeight: 1,
          }}
        >
          <span style={{ position: 'absolute', left: 0, top: 0, color: C.cyanSoft, opacity: 1 - swap }}>{CAR.plate}</span>
          <span style={{ color: C.cyanSoft, opacity: swap }}>{LOOKUP.hash}</span>
        </div>
      ) : null}

      {/* ---------- Phase D: the own sandbox ---------- */}
      {boxIn > 0 ? (
        <>
          {cardShow > 0.001 ? (
            <div style={{ position: 'absolute', left: card.x, top: card.y }}>
              <SampleCard width={card.w} show={cardShow} />
            </div>
          ) : null}
          <div style={{ position: 'absolute', left: S02_BOX.x, top: S02_BOX.y, opacity: boxIn, transform: `translateX(${(1 - boxIn) * 160}px)` }}>
            <SandboxBox width={S02_BOX.w} lit={clamp01(lit + 0.25 * flash)} holding={holding} pulse={pulse(frame, fps, 0.5)} />
          </div>
          <div style={{ position: 'absolute', left: LABEL_X, top: 236, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
            <div style={{ fontSize: 54, fontWeight: 850, color: C.cyan, letterSpacing: -0.5, opacity: labelIn, transform: `translateY(${(1 - labelIn) * 14}px)`, textShadow: `0 0 24px ${alpha(C.cyan, 0.35 * labelIn)}` }}>
              {OWN_SANDBOX.title}
            </div>
            <div style={{ marginTop: 14, fontSize: 40, fontWeight: 700, color: C.text, opacity: subIn, transform: `translateY(${(1 - subIn) * 12}px)` }}>{OWN_SANDBOX.sub}</div>
          </div>
        </>
      ) : null}
    </Stage>
  );
}

/** The generic public service: a panel with a globe and its plain description. No brand. */
function ServicePanel({ x, y, w, h, children }: { x: number; y: number; w: number; h: number; children: ReactNode }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        boxSizing: 'border-box',
        borderRadius: 24,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        border: `2px solid ${alpha(C.sky, 0.45)}`,
        boxShadow: `0 30px 70px ${alpha('#000000', 0.35)}`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: HEADER_H,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '0 28px',
          borderBottom: `2px solid ${C.ink700}`,
          background: alpha(C.ink800, 0.9),
          fontFamily: FONT.sans,
          fontSize: 34,
          fontWeight: 750,
          color: '#7dd3fc',
          whiteSpace: 'nowrap',
        }}
      >
        <Icon name="globe" size={38} color={C.sky} />
        {SERVICE.title}
      </div>
      <div style={{ position: 'relative', height: h - HEADER_H }}>{children}</div>
    </div>
  );
}

/** «decenas de antivirus», drawn: a row of plain grey shields (no names, no counts). */
function AvRow({ width }: { width: number }) {
  const n = 14;
  return (
    <div style={{ position: 'absolute', left: 36, top: 34, width, display: 'flex', justifyContent: 'space-between' }}>
      {Array.from({ length: n }, (_, i) => (
        <Icon key={i} name="shield" size={40} color={alpha(C.sky, 0.45)} strokeWidth={1.8} />
      ))}
    </div>
  );
}

/** «Subir muestra»: the beating amber button (cheap and risky). */
function UploadButton({ glow }: { glow: number }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        height: 112,
        padding: '0 54px 0 42px',
        borderRadius: 26,
        background: `linear-gradient(180deg, ${C.amber} 0%, #f59e0b 100%)`,
        boxShadow: `0 0 ${Math.round(24 + 40 * glow)}px ${alpha(C.amber, 0.25 + 0.35 * glow)}, inset 0 2px 0 ${alpha('#ffffff', 0.35)}`,
        transform: `scale(${1 + 0.025 * glow})`,
        fontFamily: FONT.sans,
        fontSize: 54,
        fontWeight: 850,
        color: C.ink950,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name="arrowUp" size={56} color={C.ink950} strokeWidth={2.6} />
      {SERVICE.upload}
    </div>
  );
}

/** «si la ve · puede saber que lo has descubierto · cambia de dominios», one step per line, joined by drawn arrows. */
function Chain({ x, y, steps, irony }: { x: number; y: number; steps: number[]; irony: number }) {
  const ROW = 100;
  return (
    <div style={{ position: 'absolute', left: x, top: y, fontFamily: FONT.sans }}>
      {REPLY.chain.map((text, i) => {
        const p = steps[i];
        const last = i === REPLY.chain.length - 1;
        const hot = last ? irony : 0;
        return (
          <div key={i}>
            {i > 0 ? (
              <svg width={40} height={30} style={{ position: 'absolute', left: 20, top: i * ROW - 30, overflow: 'visible', opacity: p }}>
                <path d="M 20 0 L 20 22" stroke={alpha(C.rose, 0.7)} strokeWidth={3} strokeLinecap="round" />
                <path d="M 12 16 L 20 26 L 28 16" fill="none" stroke={alpha(C.rose, 0.7)} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : null}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: i * ROW,
                height: 58,
                display: 'flex',
                alignItems: 'center',
                padding: '0 24px',
                borderRadius: 16,
                border: `2px solid ${alpha(C.rose, 0.35 + 0.5 * hot)}`,
                background: alpha(C.rose, 0.06 + 0.12 * hot),
                boxShadow: hot > 0 ? `0 0 ${Math.round(26 * hot)}px ${alpha(C.rose, 0.35 * hot)}` : undefined,
                fontSize: 36,
                fontWeight: 750,
                color: last ? C.roseSoft : C.text,
                whiteSpace: 'nowrap',
                opacity: p,
                transform: `translateY(${(1 - p) * 12}px)`,
              }}
            >
              {text}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GreenChip({ icon, children }: { icon: 'check'; children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        height: 66,
        padding: '0 26px 0 20px',
        borderRadius: 999,
        border: `2px solid ${alpha(C.emerald, 0.7)}`,
        background: alpha(C.emerald, 0.12),
        fontFamily: FONT.sans,
        fontSize: 34,
        fontWeight: 750,
        color: '#6ee7b7',
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name={icon} size={34} color={C.emerald} strokeWidth={2.6} />
      {children}
    </div>
  );
}
