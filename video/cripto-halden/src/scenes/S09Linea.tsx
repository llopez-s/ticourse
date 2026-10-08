import type { ReactNode } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse } from '../../../engine/src/theme/motion';
import { Icon, curveBetweenV, cubicPath, cubicLength, focusWeights, mix, tone as toneOf } from '../../../engine/src/ui';
import { CARDS, CERT, QUESTION, type CardPart } from '../data/s09-linea';
import { FingerprintGlyph } from './parts/Fingerprint';
import { PaintIcon, PaintKey } from './parts/PaintMix';
import { SealPattern, WaxSeal } from './parts/WaxSeal';
import { TLS_TONES, TlsLine, tlsLayout, type TlsChipId, type TlsPart } from './parts/TlsLine';
import { CARD, PieceCard } from './parts/s09-linea/PieceCard';
import { HybridBar } from './parts/s09-linea/HybridBar';
import { INSET, OfferInset } from './parts/s09-linea/OfferInset';
import { Stage, segment, wordFrame } from './kit';

const S = 's09-linea';
const W = STAGE.width;

// ---- The line (shared part): 1660 × 86 at size 46, back at the top of the stage once it is read.
const LINE_SIZE = 46;
const L = tlsLayout({ size: LINE_SIZE });
const LINE_X = Math.round((W - L.width) / 2);
const LINE_TOP = 6;
/** First frame: centred, half-lit and with its «?», as s01 left it. */
const LINE_START_TOP = Math.round((STAGE.height - L.chipH) / 2) - 20;

// ---- Four cards under it, one per piece, in reading order.
const CARD_TOP = 150;
const CARD_GAP = (W - 4 * CARD.width) / 3;
const cardX = (i: number) => Math.round(i * (CARD.width + CARD_GAP));
const BAR_TOP = 528;

// ---- The question: s01's certificate lines under the key chip, then the question.
const CERT_W = 900;
const CERT_X = W - LINE_X - CERT_W;
const CERT_TOP = 150;
const Q_TOP = 330;
const NEXT_TOP = 500;

/** Each card's image: the same drawing the video gave that idea. */
function cardImage(part: CardPart, k: { draw: number; press: number; glow: number }): ReactNode {
  switch (part) {
    case 'x25519':
      return <PaintIcon size={100} glow={0.6 * k.glow} />;
    case 'aes':
      return <PaintKey width={176} side="naviera" glow={0.6 * k.glow} />;
    case 'sha':
      return <FingerprintGlyph size={100} draw={k.draw} glow={0.5 * k.glow} />;
    case 'eckey':
      // The seal's design (the port's public key, what id-ecPublicKey is) waits; the wax lands on «sella».
      return (
        <div style={{ position: 'relative', width: 104, height: 104 }}>
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', opacity: 1 - 0.85 * k.press }}>
            <SealPattern size={92} glow={0.5 * k.glow} />
          </div>
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
            <WaxSeal size={100} press={k.press} glow={0.4 * k.glow} />
          </div>
        </div>
      );
  }
}

/** The connector from a piece of the line down to its card, drawn as the card arrives. */
function Wire({ part, i, draw, color, opacity }: { part: TlsPart; i: number; draw: number; color: string; opacity: number }) {
  const r = L.parts[part];
  const a = { x: LINE_X + r.x + r.width / 2, y: LINE_TOP + L.chipH + 8 };
  const b = { x: cardX(i) + CARD.width / 2, y: CARD_TOP - 6 };
  const curve = curveBetweenV(a, b, 0.55);
  const len = cubicLength(curve);
  return (
    <g opacity={opacity}>
      <path d={cubicPath(curve)} fill="none" stroke={alpha(color, 0.75)} strokeWidth={4} strokeLinecap="round" strokeDasharray={`${len} ${len}`} strokeDashoffset={len * (1 - draw)} />
      {draw > 0.98 ? <circle cx={b.x} cy={b.y} r={6} fill={color} /> : null}
    </g>
  );
}

/**
 * s09-linea «La línea, entera». The line of s01 comes back half-lit with its
 * four «?» and rises to the top on `line-back`; four dashed slots wait under
 * it. Each piece lights as the voice reads it — X25519 with the paint
 * («acuerdan la clave de sesión», asimétrica · ECDH), AES_256_GCM with the
 * house key in the paint's colour («cifra todo el tráfico con esa clave»),
 * SHA384 with the fingerprint («comprueba que nadie ha tocado el saludo»),
 * id-ecPublicKey with the port's seal («sella el saludo con su privada»; on
 * «mezclas», «mezclas con el dueño de esa clave») — its «?» popping as it
 * lights and a wire running down to its card. On s09-05 the HYBRID bar: a
 * short asymmetric start on «asimétrica», a long symmetric rest on
 * «simétrica», the exam name and TLS 1.3 lit on `hybrid`. On `offer-too` the
 * offer of s03, a moment: closed with a symmetric key, and that key through
 * her mailbox's slot. On `question` the cards go; s01's issuer and verify
 * lines light under the key chip (never the expiry) and the question holds
 * to the last frame with «siguiente vídeo».
 */
export function S09Linea(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lineBackAt = props.cue('line-back');
  const cueAt = CARDS.map((c) => props.cue(c.cue));
  const hybridSentence = segment(props, 's09-05').from;
  const hybridAt = props.cue('hybrid');
  const offerAt = props.cue('offer-too');
  const questionAt = props.cue('question');

  // ---- The line comes back and rises; the slots appear on «leer».
  // It holds in the middle while «Vuelve la línea» is said, and rises on «principio» with the slots behind it.
  const riseAt = Math.max(lineBackAt + 6, wordFrame(S, 's09-01', 'principio') - 6);
  const rise = progress(frame, riseAt, 24, EASE.inOut);
  const lineTop = mix(LINE_START_TOP, LINE_TOP, rise);
  const slotsAt = riseAt + 14;
  const slots = progress(frame, slotsAt, 16);

  // ---- Pieces light on their cues; TLS 1.3 on «TLS».
  const litAt: Record<TlsPart, number> = {
    x25519: cueAt[0] - 4,
    aes: Math.max(cueAt[1] - 4, wordFrame(S, 's09-02', 'AES') - 6),
    sha: cueAt[2] - 4,
    eckey: cueAt[3] - 4,
    tls: wordFrame(S, 's09-05', 'TLS') - 6,
  };
  const qRest = progress(frame, questionAt - 6, 16, EASE.inOut);
  const keyPulse = 0.85 + 0.15 * pulse(frame, fps, 0.5);
  const light = Object.fromEntries(
    (Object.keys(litAt) as TlsPart[]).map((p) => {
      const on = progress(frame, litAt[p], 12);
      return [p, p === 'eckey' ? on * mix(1, keyPulse, qRest) : on * (1 - 0.5 * qRest)];
    }),
  ) as Record<TlsPart, number>;
  const ask: Record<TlsChipId, number> = {
    tls: 1 - progress(frame, litAt.tls, 8),
    x25519: 1 - progress(frame, litAt.x25519, 8),
    suite: 1 - progress(frame, litAt.aes, 8),
    eckey: 1 - progress(frame, litAt.eckey, 8),
  };

  // ---- Cards: in focus from their cue to the next; all step back for the HYBRID bar, the offer and the question.
  const { weights, dims } = focusWeights(frame, cueAt, { end: hybridSentence });
  const startAt = wordFrame(S, 's09-05', 'asimétrica') - 6;
  const restAt = wordFrame(S, 's09-05', 'simétrica') - 6;
  const hybridDim = 0.45 * progress(frame, hybridSentence - 4, 14, EASE.inOut);
  const offerIn = progress(frame, offerAt - 6, 16);
  const offerOut = progress(frame, questionAt - 12, 12, EASE.inOut);
  const offerDim = offerIn * (1 - offerOut);
  const boardOut = progress(frame, questionAt - 10, 16, EASE.inOut);
  const tagStart = progress(frame, startAt, 12) * (1 - offerIn);
  const tagRest = progress(frame, restAt, 12) * (1 - offerIn);
  const sealPress = progress(frame, wordFrame(S, 's09-04', 'sella') - 6, 14, EASE.out);
  const outcome = progress(frame, wordFrame(S, 's09-04', 'mezclas') - 4, 12);

  // ---- The question.
  const certIn = progress(frame, questionAt + 2, 14);
  const qAt = wordFrame(S, 's09-07', 'Cómo') - 6;
  const nextAt = wordFrame(S, 's09-07', 'siguiente') - 6;

  return (
    <Stage>
      {/* Wires and the waiting slots */}
      {boardOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: (1 - boardOut) * (1 - 0.8 * offerDim) }}>
          {CARDS.map((c, i) =>
            progress(frame, cueAt[i] - 6, 10) < 1 ? (
              <div
                key={c.part}
                style={{
                  position: 'absolute',
                  left: cardX(i),
                  top: CARD_TOP,
                  width: CARD.width,
                  height: CARD.height,
                  boxSizing: 'border-box',
                  borderRadius: RADIUS.lg,
                  border: `2px dashed ${C.ink600}`,
                  opacity: slots * (1 - progress(frame, cueAt[i] - 6, 10)),
                  transform: `translateY(${(1 - slots) * 14}px)`,
                }}
              />
            ) : null,
          )}
          <svg width={W} height={STAGE.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {CARDS.map((c, i) => (
              <Wire key={c.part} part={c.part} i={i} draw={progress(frame, cueAt[i] - 4, 16, EASE.inOut)} color={toneOf(TLS_TONES[c.part]).fg} opacity={1 - 0.5 * Math.max(dims[i], hybridDim)} />
            ))}
          </svg>
          {CARDS.map((c, i) => {
            const show = progress(frame, cueAt[i] - 2, 16);
            const draw = progress(frame, cueAt[i], 22, EASE.inOut);
            return (
              <div key={c.part} style={{ position: 'absolute', left: cardX(i), top: CARD_TOP }}>
                <PieceCard
                  card={c}
                  tone={TLS_TONES[c.part]}
                  image={cardImage(c.part, { draw, press: c.part === 'eckey' ? sealPress : 1, glow: weights[i] })}
                  show={show}
                  hot={weights[i]}
                  dim={Math.max(0.55 * dims[i], hybridDim)}
                  tagGlow={c.family === 'asym' ? tagStart : c.family === 'sym' ? tagRest : 0}
                  outcome={outcome}
                />
              </div>
            );
          })}
          <div style={{ position: 'absolute', left: 0, top: BAR_TOP }}>
            <HybridBar width={W} start={progress(frame, startAt, 18)} rest={progress(frame, restAt, 18)} name={progress(frame, hybridAt - 4, 14)} />
          </div>
        </div>
      ) : null}

      {/* «la oferta, igual» */}
      {offerDim > 0 ? (
        <div style={{ position: 'absolute', left: (W - INSET.width) / 2, top: 126, opacity: 1 - offerOut }}>
          <OfferInset
            show={offerIn}
            lock={progress(frame, wordFrame(S, 's09-06', 'simétrica') - 8, 14)}
            fly={progress(frame, wordFrame(S, 's09-06', 'viaja') - 8, 30, EASE.linear)}
            slot={progress(frame, wordFrame(S, 's09-06', 'buzón') - 2, 12)}
          />
        </div>
      ) : null}

      {/* The question: s01's certificate lines, under the key chip */}
      {certIn > 0 ? (
        <>
          <svg width={W} height={STAGE.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: certIn }}>
            <path
              d={`M${LINE_X + L.chips.eckey.x + L.chips.eckey.width / 2},${LINE_TOP + L.chipH + 8} L${LINE_X + L.chips.eckey.x + L.chips.eckey.width / 2},${CERT_TOP - 4}`}
              stroke={alpha(C.cyan, 0.7)}
              strokeWidth={4}
              strokeDasharray="10 10"
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              left: CERT_X,
              top: CERT_TOP,
              width: CERT_W,
              boxSizing: 'border-box',
              padding: '16px 24px',
              borderRadius: RADIUS.md,
              border: `2px solid ${alpha(C.cyan, 0.5)}`,
              background: alpha(C.ink850, 0.96),
              boxShadow: `0 0 30px ${alpha(C.cyan, 0.15)}`,
              fontFamily: FONT.mono,
              fontSize: 30,
              fontWeight: 650,
              lineHeight: 1.45,
              whiteSpace: 'pre',
              ...enter(frame, questionAt + 2, { distance: 14 }),
            }}
          >
            <div style={{ color: C.cyanSoft }}>{CERT.issuer}</div>
            <div style={{ color: '#6ee7b7' }}>{CERT.verify}</div>
          </div>
        </>
      ) : null}

      {frame >= qAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: Q_TOP, width: W, textAlign: 'center', fontFamily: FONT.sans, ...enter(frame, qAt, { distance: 20 }) }}>
          {QUESTION.lines.map((l) => (
            <div key={l} style={{ fontSize: 60, fontWeight: 850, letterSpacing: -1.2, lineHeight: 1.12, color: C.textStrong, whiteSpace: 'nowrap' }}>
              {l}
            </div>
          ))}
        </div>
      ) : null}

      {frame >= nextAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: NEXT_TOP, width: W, display: 'flex', justifyContent: 'center', ...enter(frame, nextAt, { distance: 16 }) }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 14,
              height: 70,
              padding: '0 30px 0 22px',
              boxSizing: 'border-box',
              borderRadius: RADIUS.pill,
              border: `3px solid ${alpha(C.cyan, 0.75)}`,
              background: alpha(C.cyan, 0.1),
              boxShadow: `0 0 30px ${alpha(C.cyan, 0.22)}`,
              fontFamily: FONT.sans,
              fontSize: 38,
              fontWeight: 800,
              color: C.cyanSoft,
              whiteSpace: 'nowrap',
            }}
          >
            <Icon name="play" size={36} color={C.cyan} strokeWidth={2} />
            {QUESTION.next}
          </span>
        </div>
      ) : null}

      {/* The line */}
      <div style={{ position: 'absolute', left: LINE_X, top: lineTop }}>
        <TlsLine size={LINE_SIZE} split={1} ask={ask} light={light} frame={frame} />
      </div>
    </Stage>
  );
}

