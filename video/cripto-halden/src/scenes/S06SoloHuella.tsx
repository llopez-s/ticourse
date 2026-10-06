import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { ANYONE, ATTACHED, DOUBTS, EXAMPLE, FAKE, NOTE, RULE } from '../data/s06-solo-huella';
import { S04 } from '../data/s04-huella';
import { FingerprintMachine, HashLine, OfferSheet, machineAnchors, offerSheetSize } from './parts/Fingerprint';
import { Letter, Mailbox, type MailboxLetter } from './parts/Mailbox';
import { MarkStamp, flight } from './parts/s02-familias/Marks';
import { Stage, segment, wordFrame } from './kit';

const S = 's06-solo-huella';

// ---- Phase 1–2: the opened offer, the doubts, NULL CIPHER's proposal (band-safe: y ≥ 236 or x < 400)
const MB1 = { x: 110, y: 236, w: 220 } as const;
const SHEET1 = { x: 440, y: 246, w: 360 } as const;
const Q_X = 880;
const Q_Y = [276, 396] as const;
const SENDERS = [
  { dx: -170, tone: C.sky, tilt: -14 },
  { dx: -60, tone: '#cbd5e1', tilt: 8 },
  { dx: 50, tone: '#fcd9b6', tilt: -6 },
] as const;

// ---- Phase 3: the hypothetical, framed
const FRAME = { x: 16, y: 40, w: 1696, h: 492 } as const;
const FAKE_SHEET = { x: 56, y: 140, w: 300 } as const;
const MACHINE = { x: 396, y: 156, w: 330 } as const;
const MB3 = { x: 1012, y: 150, w: 206 } as const;
const RECEIVED = { x: 1250, y: 100, w: 300 } as const;
const RECOMPUTED = { x: 1250, y: 402 } as const;
const PRINT_SIZE = 34;

/**
 * s06-solo-huella «La huella sola no basta». The shipping company has opened
 * the offer (it came out of her mailbox) and two doubts stand beside it:
 * «¿es del puerto?» · «¿la ha tocado alguien?». While NULL CIPHER's message is
 * up, its proposal is drawn as it sounds: the fingerprint stuck to the offer
 * («hash adjunto»). «Hasta que te acuerdas del buzón»: different hands drop
 * letters through the slot. Then the hypothetical, framed amber as «ejemplo ·
 * así no · lo que propone NULL CIPHER» and with no portal behind it: someone
 * writes a forged offer (rose), takes its fingerprint in the machine, sticks
 * it on and drops it through the slot; the shipping company recomputes it and
 * it matches — «encaja, y es falsa» (sfx on `both-match`). The rule: «la
 * huella dice que no cambió · no dice quién la hizo», and the small note that
 * locking it for her says nothing about the author either.
 */
export function S06SoloHuella(props: SceneProps) {
  const frame = useCurrentFrame();

  const doubtsAt = props.cue('doubts');
  const slotAgainAt = props.cue('slot-again');
  const fakeAt = props.cue('fake');
  const bothAt = props.cue('both-match');
  const whoAt = props.cue('who');
  const s01 = segment(props, 's06-01');
  // NULL CIPHER's card: from the end of s06-01 (its silent lead) to the end of s06-02.
  const icFrom = s01.to;

  // ---- Phase 1: opened, two doubts ----------------------------------------------------------
  const mbIn = progress(frame, 0, 14);
  const sheetOut = progress(frame, doubtsAt + 4, 18, EASE.inOut);
  const q1In = progress(frame, wordFrame(S, 's06-01', 'puerto') - 8, 12);
  const q2In = progress(frame, wordFrame(S, 's06-01', 'tocado') - 8, 12);

  // ---- Phase 2: the proposal, then the slot ---------------------------------------------------
  const attachP = progress(frame, icFrom + 26, 14);
  const attachedTagIn = progress(frame, icFrom + 34, 12);
  const step = 9;
  const sendersIn = progress(frame, slotAgainAt - 10, 10);
  const letters2: MailboxLetter[] = SENDERS.map((s, i) => ({
    p: progress(frame, slotAgainAt + 6 + i * step, 16, EASE.inOut),
    opacity: sendersIn,
    edge: s.tone,
    tilt: s.tilt,
    dx: s.dx,
  }));
  const anyoneIn = progress(frame, slotAgainAt + 8, 12);

  // ---- Phase 3: the hypothetical ----------------------------------------------------------------
  const p3 = progress(frame, fakeAt - 12, 18, EASE.inOut);
  const frameIn = progress(frame, fakeAt - 4, 14);
  const wEscribe = wordFrame(S, 's06-03', 'escribe');
  const wSaca = wordFrame(S, 's06-03', 'saca');
  const wHuella = wordFrame(S, 's06-03', 'huella');
  const wEcha = wordFrame(S, 's06-03', 'echa');
  const wComprueba = wordFrame(S, 's06-03', 'comprueba');
  const wHuella2 = wordFrame(S, 's06-03', 'huella', 1);
  const fakeIn = progress(frame, Math.min(wEscribe - 4, fakeAt + 10), 14);
  const run = progress(frame, wSaca - 6, 8) * (1 - progress(frame, wEcha, 10));
  const docIn = progress(frame, wSaca - 6, Math.max(8, wHuella - wSaca), EASE.inOut);
  const lineOut = progress(frame, wHuella - 4, 10);
  const attachFake = progress(frame, Math.max(wHuella + 4, wEcha - 20), 8);
  const lineGone = attachFake;
  // The forged offer goes as a letter into her slot: flight, then drop
  const flyFrom = wEcha - 4;
  const flyDur = Math.max(10, Math.min(18, wComprueba - wEcha - 22));
  const dropAt = flyFrom + flyDur;
  const dropP = progress(frame, dropAt, 10, EASE.in);
  const sheetToLetter = progress(frame, flyFrom - 4, 6);
  const doorOpen3 = progress(frame, dropAt + 10, 10, EASE.inOut);
  const receivedIn = progress(frame, dropAt + 12, 12);
  const recomputeIn = progress(frame, wComprueba - 4, Math.max(8, wHuella2 - wComprueba + 4));
  const matchIn = progress(frame, wHuella2 + 2, 10);
  const stampAt = bothAt;

  // ---- Phase 4: the rule ------------------------------------------------------------------------
  const whoIn = progress(frame, whoAt - 2, 14);
  const ruleBIn = progress(frame, wordFrame(S, 's06-04', 'quién') - 6, 12);
  const noteIn = progress(frame, wordFrame(S, 's06-04', 'oferta') + 4, 14);
  const exampleDim = 0.55 * progress(frame, whoAt - 2, 14);

  // ---- Places -----------------------------------------------------------------------------------
  const mb = { x: mix(MB1.x, MB3.x, p3), y: mix(MB1.y, MB3.y, p3), w: mix(MB1.w, MB3.w, p3) };
  const mbS = mb.w / 240;
  const sheet1H = offerSheetSize(SHEET1.w, true).h;
  // Phase 1: the offer comes out of the open mailbox to its place
  const sheetFrom = { x: MB1.x + 40, y: MB1.y + 90, w: 140 };
  const sh1 = { x: mix(sheetFrom.x, SHEET1.x, sheetOut), y: mix(sheetFrom.y, SHEET1.y, sheetOut), w: mix(sheetFrom.w, SHEET1.w, sheetOut) };
  const phase12 = 1 - p3;

  const m = machineAnchors(MACHINE.w);
  const outlet = { x: MACHINE.x + m.outlet.x, y: MACHINE.y + m.outlet.y };
  const inlet = { x: MACHINE.x + m.inlet.x, y: MACHINE.y + m.inlet.y };
  const letterW = 92 * mbS;
  const letterStart = { x: MB3.x + (120 - 46) * (MB3.w / 240), y: MB3.y - 96 * (MB3.w / 240) };
  const fl = flight(frame, flyFrom, flyDur, { x: FAKE_SHEET.x + FAKE_SHEET.w / 2 - 60, y: FAKE_SHEET.y + 80 }, letterStart, 10);

  return (
    <Stage>
      {/* ================= Phase 3 frame: the hypothetical ================= */}
      {frameIn > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: FRAME.x,
            top: FRAME.y,
            width: FRAME.w,
            height: FRAME.h,
            boxSizing: 'border-box',
            borderRadius: RADIUS.lg,
            border: `3px dashed ${alpha(C.amber, 0.65)}`,
            background: `linear-gradient(180deg, ${alpha(C.amber, 0.05)} 0%, ${alpha(C.ink900, 0.35)} 100%)`,
            opacity: frameIn * (1 - 0.4 * exampleDim),
          }}
        >
          <div style={{ position: 'absolute', left: 24, top: -24, padding: '2px 16px', background: C.ink950, fontFamily: FONT.sans, fontSize: 34, fontWeight: 850, color: '#fde68a', whiteSpace: 'nowrap' }}>
            {EXAMPLE}
          </div>
        </div>
      ) : null}

      {/* ================= The shipping company's mailbox ================= */}
      {sendersIn * phase12 > 0.001
        ? SENDERS.map((s, i) => {
            const sx = mb.x + (120 + s.dx) * mbS;
            return (
              <div key={i} style={{ position: 'absolute', left: sx - 30, top: mb.y - 154 * mbS, opacity: sendersIn * phase12 * (1 - 0.6 * progress(frame, slotAgainAt + 22 + i * step, 12)) }}>
                <Icon name="user" size={60} color={s.tone} strokeWidth={2.2} />
              </div>
            );
          })
        : null}
      <div style={{ position: 'absolute', left: mb.x, top: mb.y, opacity: mbIn * (1 - exampleDim) }}>
        <Mailbox
          width={mb.w}
          doorOpen={Math.max(1 - progress(frame, doubtsAt + 26, 14, EASE.inOut), doorOpen3)}
          inside={doorOpen3 > 0 ? 1 : 0}
          slotGlow={Math.max(progress(frame, slotAgainAt - 6, 10) * (1 - p3), progress(frame, dropAt - 8, 8) * (1 - progress(frame, dropAt + 14, 10)))}
          letters={p3 < 0.5 ? letters2 : [{ p: dropP, opacity: frame >= dropAt ? 1 : 0, edge: C.rose }]}
        />
      </div>
      {anyoneIn * phase12 > 0.001 ? (
        <div style={{ position: 'absolute', left: MB1.x + MB1.w / 2, top: MB1.y + 340, transform: 'translateX(-50%)', fontFamily: FONT.sans, fontSize: 36, fontWeight: 800, color: C.text, whiteSpace: 'nowrap', opacity: anyoneIn * phase12 }}>
          {ANYONE}
        </div>
      ) : null}

      {/* ================= Phase 1–2: the opened offer and the doubts ================= */}
      {phase12 > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: phase12 }}>
          <div style={{ position: 'absolute', left: sh1.x, top: sh1.y, opacity: mbIn }}>
            <OfferSheet width={sh1.w} attached={{ value: S04.print, p: attachP }} glow={0.3 * sheetOut} />
          </div>
          {attachedTagIn > 0.001 ? (
            <div
              style={{
                position: 'absolute',
                left: SHEET1.x + SHEET1.w + 18,
                top: SHEET1.y + sheet1H - 64,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: FONT.sans,
                fontSize: 32,
                fontWeight: 800,
                color: C.roseSoft,
                whiteSpace: 'nowrap',
                opacity: attachedTagIn,
                transform: `translateX(${(1 - attachedTagIn) * 12}px)`,
              }}
            >
              <svg width={34} height={20} style={{ overflow: 'visible' }}>
                <path d="M 32 10 L 4 10 M 14 2 L 4 10 L 14 18" fill="none" stroke={C.roseSoft} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {ATTACHED}
            </div>
          ) : null}
          {DOUBTS.map((q, i) => {
            const p = i === 0 ? q1In : q2In;
            if (p <= 0.001) return null;
            return (
              <div key={q} style={{ position: 'absolute', left: Q_X, top: Q_Y[i], opacity: p, transform: `translateX(${(1 - p) * 16}px)` }}>
                <DoubtBubble text={q} />
              </div>
            );
          })}
        </div>
      ) : null}

      {/* ================= Phase 3: the forged offer, its print, the slot ================= */}
      {p3 > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: p3 * (1 - exampleDim) }}>
          {/* «oferta falsa» */}
          <div style={{ position: 'absolute', left: FAKE_SHEET.x, top: FAKE_SHEET.y - 46, fontFamily: FONT.sans, fontSize: 34, fontWeight: 850, color: C.roseSoft, whiteSpace: 'nowrap', opacity: fakeIn * (1 - sheetToLetter) }}>
            {FAKE.label}
          </div>
          {frame < flyFrom + 2 ? (
            <div style={{ position: 'absolute', left: FAKE_SHEET.x, top: FAKE_SHEET.y, opacity: fakeIn * (1 - sheetToLetter), transform: `translateY(${(1 - fakeIn) * 14}px)` }}>
              <OfferSheet width={FAKE_SHEET.w} tone={C.rose} rows={FAKE.rows} attached={{ value: FAKE.print, p: attachFake }} attachedTone={C.rose} />
            </div>
          ) : null}
          {/* The machine takes its fingerprint */}
          <div style={{ position: 'absolute', left: MACHINE.x, top: MACHINE.y, opacity: fakeIn }}>
            <FingerprintMachine width={MACHINE.w} label={S04.machine} run={run} frame={frame} />
          </div>
          {docIn > 0.001 && docIn < 1 ? (
            <div style={{ position: 'absolute', left: mix(FAKE_SHEET.x + FAKE_SHEET.w - 30, inlet.x - 24, docIn), top: inlet.y - 24, opacity: 1 - docIn * 0.7 }}>
              <Icon name="file" size={48} color={C.roseSoft} strokeWidth={2.2} />
            </div>
          ) : null}
          {lineOut * (1 - lineGone) > 0.001 ? (
            <div style={{ position: 'absolute', left: outlet.x + 20, top: outlet.y - 30, opacity: 1 - lineGone }}>
              <HashLine value={FAKE.print} size={PRINT_SIZE} tone={C.rose} reveal={lineOut} />
            </div>
          ) : null}
          {/* The letter on its way to the slot */}
          {frame >= flyFrom - 4 && frame < dropAt ? (
            <div style={{ position: 'absolute', left: fl.x, top: fl.y }}>
              <Letter width={mix(120, letterW, fl.p)} edge={C.rose} glow={0.5} glowColor={C.rose} />
            </div>
          ) : null}
          {/* What she receives, and her own fingerprint of it */}
          {receivedIn > 0.001 ? (
            <>
              <div style={{ position: 'absolute', left: RECEIVED.x, top: RECEIVED.y - 46, fontFamily: FONT.sans, fontSize: 32, fontWeight: 800, color: '#6ee7b7', whiteSpace: 'nowrap', opacity: receivedIn }}>
                {FAKE.received}
              </div>
              <div style={{ position: 'absolute', left: RECEIVED.x, top: RECEIVED.y, opacity: receivedIn, transform: `translateX(${(1 - receivedIn) * -24}px)` }}>
                <OfferSheet width={RECEIVED.w} tone={C.rose} rows={FAKE.rows} attached={{ value: FAKE.print, p: 1 }} attachedTone={C.rose} attachedMark={matchIn} />
              </div>
            </>
          ) : null}
          {recomputeIn > 0.001 ? (
            <>
              <div style={{ position: 'absolute', left: RECOMPUTED.x, top: RECOMPUTED.y }}>
                <HashLine value={FAKE.print} size={PRINT_SIZE} tone={C.emerald} reveal={recomputeIn} mark={matchIn} markTone={C.emerald} />
              </div>
              <div style={{ position: 'absolute', left: RECOMPUTED.x, top: RECOMPUTED.y + 70, fontFamily: FONT.sans, fontSize: 32, fontWeight: 780, color: '#6ee7b7', whiteSpace: 'nowrap', opacity: recomputeIn }}>
                {FAKE.recomputed}
              </div>
            </>
          ) : null}
          {matchIn > 0.001 ? (
            <div style={{ position: 'absolute', left: RECOMPUTED.x + 280, top: RECOMPUTED.y + 8, display: 'flex', alignItems: 'center', gap: 8, fontFamily: FONT.sans, fontSize: 36, fontWeight: 850, color: '#6ee7b7', opacity: matchIn, whiteSpace: 'nowrap' }}>
              <Icon name="check" size={38} color={C.emerald} strokeWidth={2.8} />
              {FAKE.match}
            </div>
          ) : null}
          {frame >= stampAt ? (
            <div style={{ position: 'absolute', left: RECEIVED.x + RECEIVED.w / 2 + 30, top: RECEIVED.y + 150, transform: 'translate(-50%, -50%)' }}>
              <MarkStamp frame={frame} at={stampAt} tone="rose" icon="alert" size={38} rotate={-8}>
                {FAKE.stamp}
              </MarkStamp>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ================= Phase 4: the rule ================= */}
      {whoIn > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: 864,
            top: 548,
            transform: `translateX(-50%) translateY(${(1 - whoIn) * 12}px)`,
            display: 'flex',
            alignItems: 'baseline',
            gap: 22,
            fontFamily: FONT.sans,
            fontSize: 46,
            fontWeight: 850,
            whiteSpace: 'nowrap',
            opacity: whoIn,
          }}
        >
          <span style={{ color: C.textStrong }}>{RULE.a}</span>
          <span style={{ color: C.faint, opacity: ruleBIn }}>·</span>
          <span style={{ color: C.roseSoft, opacity: ruleBIn }}>{RULE.b}</span>
        </div>
      ) : null}
      {noteIn > 0.001 ? (
        <div style={{ position: 'absolute', left: 864, top: 616, transform: 'translateX(-50%)', fontFamily: FONT.sans, fontSize: 30, fontWeight: 650, fontStyle: 'italic', color: C.muted, whiteSpace: 'nowrap', opacity: noteIn }}>
          {NOTE}
        </div>
      ) : null}
    </Stage>
  );
}

function DoubtBubble({ text }: { text: string }) {
  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 16,
        padding: '16px 30px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.emerald, 0.55)}`,
        background: `linear-gradient(180deg, ${alpha(C.emerald, 0.1)} 0%, ${alpha(C.ink900, 0.96)} 100%)`,
        boxShadow: `0 16px 36px ${alpha('#000000', 0.4)}`,
        fontFamily: FONT.sans,
        fontSize: 50,
        fontWeight: 850,
        color: C.textStrong,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ display: 'inline-flex', width: 50, height: 50, borderRadius: RADIUS.pill, background: alpha(C.emerald, 0.2), border: `2px solid ${C.emerald}`, alignItems: 'center', justifyContent: 'center', fontSize: 34, color: '#6ee7b7' }}>?</span>
      {text}
    </div>
  );
}

