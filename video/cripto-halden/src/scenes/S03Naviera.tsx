import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, clamp01, mix } from '../../../engine/src/ui';
import {
  COMPETITION,
  LATER,
  NOTE,
  CONFIDENTIAL,
  PROPOSAL,
  QUESTION,
  RIGHT,
  RULE,
  TERM,
  TILES,
  TRUE_HALF,
  WRONG,
} from '../data/s03-naviera';
import { OfferSheet, offerSheetSize } from './parts/Fingerprint';
import { LETTER_BASE, Letter, Mailbox, PrivateKey, SlotGlyph, mailboxPoint } from './parts/Mailbox';
import { MarkStamp, TermTag, flight } from './parts/s02-familias/Marks';
import { KeyTile } from './parts/s03-naviera/KeyTile';
import { Stage, segment, wordFrame } from './kit';

const S = 's03-naviera';
const W = 1728;

// ---- Places (stage-local) ------------------------------------------------------------
const SHEET1 = { x: 594, y: 64, w: 540 } as const;
const SHEET2 = { x: 60, y: 250, w: 380 } as const;
const SHEET4 = { x: 65, y: 304, w: 260 } as const;
const PANEL = { x: 30, y: 250, w: 330, h: 330 } as const;
const TILE_W = 320;
const TILE_A = { x: 640, y: 294 } as const;
const TILE_B = { x: 1060, y: 294 } as const;
const UNDER_TILES_Y = 556;
/** Her mailbox: centre stage while the offer goes in, then steps right for the rule. */
const MB_C = { x: 740, y: 190, w: 260 } as const;
const MB_R = { x: 1150, y: 190, w: 260 } as const;
const LETTER_FROM = { x: 420, y: 330 } as const;
/** Labels start this far right of the mailbox's left edge. */
const R_LABEL_DX = 334;
const CROWD = 8;

/**
 * s03-naviera «Solo para la naviera». The offer («Oferta comercial 2027 · para
 * una naviera · confidencial»: prices the competition must not see). Two keys
 * at hand as cards — «pública de la naviera» (her slot, emerald) and «privada
 * del puerto» (the port's key, cyan) — and «¿con cuál la cierras?». While
 * NULL CIPHER's message is up, the port's private card is ringed in rose as
 * «lo que propone NULL CIPHER», and «nadie más la tiene: es verdad». Step by
 * step: the port's key locks the offer, «la pública del puerto» opens it, and
 * a crowd holds that slot: «la abre cualquiera» (sfx on `anyone`). Redone:
 * the wrong path folds into an amber «así no» panel; the offer goes as a
 * letter through the shipping company's slot («su pública», lands on `drop`)
 * and only her key opens it («su privada»). «cifras con SU pública»,
 * CONFIDENTIALITY, the small TLS note, and the footer that returns in s07.
 */
export function S03Naviera(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const twoKeysAt = props.cue('two-keys');
  const wrongAt = props.cue('wrong');
  const anyoneAt = props.cue('anyone');
  const dropAt = props.cue('drop');
  const onlyHerAt = props.cue('only-her');
  const ruleAt = props.cue('rule');
  const confidentialAt = props.cue('confidential');
  const laterAt = props.cue('later');

  // ---- Phase 1: the offer -------------------------------------------------------------
  const sheetIn = progress(frame, 0, 14);
  const compIn = progress(frame, wordFrame(S, 's03-01', 'competencia') - 4, 12) * (1 - progress(frame, twoKeysAt - 8, 10));

  // ---- Phase 2: two keys at hand ----------------------------------------------------------
  const t2 = progress(frame, twoKeysAt - 6, 20, EASE.inOut);
  const tileAIn = progress(frame, twoKeysAt + 2, 12);
  const tileBIn = progress(frame, twoKeysAt + 8, 12);
  const tileAGlow = progress(frame, wordFrame(S, 's03-02', 'pública') - 6, 10) * (1 - progress(frame, wordFrame(S, 's03-02', 'privada') - 6, 10));
  const tileBGlow = progress(frame, wordFrame(S, 's03-02', 'privada') - 6, 10) * (1 - progress(frame, wordFrame(S, 's03-02', 'cuál') - 6, 10));
  const questionIn = progress(frame, wordFrame(S, 's03-02', 'cuál') - 6, 12) * (1 - progress(frame, wrongAt - 6, 10));
  const proposal = progress(frame, wrongAt - 2, 12);
  const trueIn = progress(frame, wordFrame(S, 's03-03', 'acierta') - 4, 12);

  // ---- Phase 3: the wrong path ---------------------------------------------------------------
  const wCierras = wordFrame(S, 's03-04', 'cierras');
  const wAbre = wordFrame(S, 's03-04', 'abre');
  const keyFly = Math.max(10, Math.min(18, wAbre - wCierras - 6));
  const keyP = progress(frame, wCierras - 2, keyFly, EASE.inOut);
  const lockIn = progress(frame, wCierras - 2 + keyFly - 2, 8);
  const unlocked = progress(frame, wAbre - 2, 6);
  const closedLabelIn = progress(frame, wCierras + 4, 12);
  const tileCIn = progress(frame, wAbre - 6, 12);
  const crowdIn = (i: number) => progress(frame, anyoneAt - 8 + i * 3, 10);
  const trueOut = progress(frame, segment(props, 's03-04').from - 6, 10);
  const tileBDim = progress(frame, anyoneAt - 4, 12);

  // ---- Phase 4: the right path ----------------------------------------------------------------
  const wBuena = wordFrame(S, 's03-05', 'buena');
  const t4 = progress(frame, wBuena - 8, 22, EASE.inOut);
  const wrongOut = progress(frame, wBuena - 8, 14);
  const panelIn = progress(frame, wBuena + 6, 14);
  const mbIn = progress(frame, wBuena - 2, 16);
  const letterAppear = Math.min(dropAt - 30, wBuena + 6);
  const flyFrom = Math.max(letterAppear + 4, dropAt - 26);
  const flyTo = dropAt - 10;
  const letterIn = progress(frame, letterAppear, 10);
  const letterDrop = progress(frame, flyTo, 12, EASE.in); // lands on `drop` + 2: the sfx «mail» fires on the cue
  const slotLabelIn = progress(frame, wordFrame(S, 's03-05', 'pública') - 6, 12);
  const keyIn = progress(frame, onlyHerAt - 2, 10, EASE.inOut);
  const keyTurn = progress(frame, onlyHerAt + 8, 6);
  const doorOpen = progress(frame, onlyHerAt + 12, 12, EASE.inOut);
  const keyLabelIn = progress(frame, onlyHerAt + 2, 12);

  // ---- Phase 5–6: the rule ---------------------------------------------------------------------
  const ruleIn = progress(frame, ruleAt - 2, 14);
  const mbShift = progress(frame, ruleAt - 14, 20, EASE.inOut);
  const MB = { x: mix(MB_C.x, MB_R.x, mbShift), y: MB_C.y, w: MB_C.w };
  const R_LABEL_X = MB.x + R_LABEL_DX;
  const wSu = wordFrame(S, 's03-06', 'su');
  const suGlow = progress(frame, wSu - 4, 10);
  const noteIn = progress(frame, confidentialAt + 20, 16);
  const laterIn = progress(frame, laterAt - 2, 14);

  // ---- Sheet place ------------------------------------------------------------------------------
  const sh12 = { x: mix(SHEET1.x, SHEET2.x, t2), y: mix(SHEET1.y, SHEET2.y, t2), w: mix(SHEET1.w, SHEET2.w, t2) };
  const sheet = { x: mix(sh12.x, SHEET4.x, t4), y: mix(sh12.y, SHEET4.y, t4), w: mix(sh12.w, SHEET4.w, t4) };
  const sheetH = offerSheetSize(sheet.w).h;
  const k = sheet.w / SHEET2.w;
  const lockBadge = { x: sheet.x + sheet.w - 34 * k, y: sheet.y - 30 * k };

  // The port's key flying from its card to the sheet
  const tileBCentre = { x: TILE_B.x + TILE_W / 2 - 74, y: TILE_B.y + 50 };
  const keyFlight = flight(frame, wCierras - 2, keyFly, tileBCentre, { x: SHEET2.x + SHEET2.w - 34 - 4, y: SHEET2.y - 30 + 32 - 22 }, 90);
  const keyFlightVis = keyP > 0 && keyP < 1 ? 1 : 0;

  // The letter: from the centre to the slot, then through it
  const s = MB.w / 240;
  const letterW = 92 * s;
  const letterStart = { x: MB_C.x + (120 - 46) * s, y: MB_C.y - 96 * s };
  const fl = flight(frame, flyFrom, Math.max(8, flyTo - flyFrom), LETTER_FROM, letterStart, 60);
  const letterFlyW = mix(110, letterW, fl.p);
  const slot = mailboxPoint(MB.w, 'slot');
  const keyhole = mailboxPoint(MB.w, 'keyhole');

  return (
    <Stage>
      {/* ================= The wrong path's panel («así no») ================= */}
      {panelIn > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: PANEL.x,
            top: PANEL.y,
            width: PANEL.w,
            height: PANEL.h,
            boxSizing: 'border-box',
            borderRadius: RADIUS.lg,
            border: `3px dashed ${alpha(C.amber, 0.6)}`,
            background: `linear-gradient(180deg, ${alpha(C.amber, 0.06)} 0%, ${alpha(C.ink900, 0.5)} 100%)`,
            opacity: panelIn,
          }}
        >
          <div style={{ position: 'absolute', left: 18, top: -22, padding: '2px 14px', background: C.ink950, fontFamily: FONT.sans, fontSize: 32, fontWeight: 850, color: '#fde68a', whiteSpace: 'nowrap' }}>
            {WRONG.panel}
          </div>
        </div>
      ) : null}

      {/* ================= The offer ================= */}
      <div style={{ position: 'absolute', left: sheet.x, top: sheet.y, opacity: sheetIn * (1 - 0.35 * panelIn), transform: `translateY(${(1 - sheetIn) * 18}px)` }}>
        <OfferSheet width={sheet.w} glow={0.4 * (1 - t2)} />
        {/* «confidencial», tagged on the sheet's top-right corner */}
        <div style={{ position: 'absolute', left: sheet.w + 6 * k, top: -42 * k, transform: 'translateX(-100%)', opacity: 1 - lockIn }}>
          <div style={{ transform: `scale(${k})`, transformOrigin: '100% 0' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '6px 18px',
                borderRadius: RADIUS.pill,
                border: `2px solid ${alpha(C.cyan, 0.75)}`,
                background: C.ink900,
                fontFamily: FONT.sans,
                fontSize: 32,
                fontWeight: 850,
                color: C.cyanSoft,
                whiteSpace: 'nowrap',
                transform: 'rotate(-4deg)',
              }}
            >
              <Icon name="eyeOff" size={32} color={C.cyan} strokeWidth={2.4} />
              {CONFIDENTIAL}
            </span>
          </div>
        </div>
        {/* «la abre cualquiera» */}
        {frame >= anyoneAt ? (
          <div style={{ position: 'absolute', left: sheet.w / 2, top: sheetH * 0.55, transform: 'translate(-50%, -50%)' }}>
            <div style={{ transform: `scale(${k})` }}>
              <MarkStamp frame={frame} at={anyoneAt} tone="amber" icon="eye" size={40} rotate={-8}>
                {WRONG.anyone}
              </MarkStamp>
            </div>
          </div>
        ) : null}
      </div>
      {/* The lock badge: closed with the port's private key, opened by its public one */}
      {lockIn > 0.001 ? (
        <div style={{ position: 'absolute', left: lockBadge.x - 32 * k, top: lockBadge.y, opacity: lockIn * (1 - 0.35 * panelIn) }}>
          <div
            style={{
              width: 64 * k,
              height: 64 * k,
              borderRadius: RADIUS.pill,
              background: C.ink900,
              border: `${3 * k}px solid ${C.cyan}`,
              boxShadow: `0 0 ${Math.round(18 * k)}px ${alpha(C.cyan, 0.45)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${1.25 - 0.25 * lockIn})`,
            }}
          >
            <Icon name={unlocked > 0.5 ? 'unlock' : 'lock'} size={Math.round(36 * k)} color={C.cyanSoft} strokeWidth={2.4} />
          </div>
        </div>
      ) : null}
      {/* «se abre con su pública»: the port's public card reaches the lock */}
      {tileCIn * (1 - wrongOut) > 0.001 ? (
        <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={W} height={660}>
          <path
            d={`M ${TILE_A.x - 8} ${TILE_A.y + 70} C ${TILE_A.x - 90} ${TILE_A.y + 70}, ${lockBadge.x + 40} ${lockBadge.y + 32}, ${lockBadge.x + 34} ${lockBadge.y + 32}`}
            fill="none"
            stroke={alpha(C.cyan, 0.8)}
            strokeWidth={4}
            strokeDasharray="10 8"
            opacity={tileCIn * (1 - wrongOut)}
          />
        </svg>
      ) : null}
      {keyFlightVis ? (
        <div style={{ position: 'absolute', left: keyFlight.x, top: keyFlight.y }}>
          <PrivateKey width={120} color={C.cyan} glow={0.6} />
        </div>
      ) : null}
      {closedLabelIn * (1 - wrongOut) > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: SHEET2.x,
            top: SHEET2.y + offerSheetSize(SHEET2.w).h + 14,
            fontFamily: FONT.sans,
            fontSize: 32,
            fontWeight: 750,
            color: C.cyanSoft,
            whiteSpace: 'nowrap',
            opacity: closedLabelIn * (1 - wrongOut),
          }}
        >
          {WRONG.closedWith}
        </div>
      ) : null}
      {compIn > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: 864,
            top: SHEET1.y + offerSheetSize(SHEET1.w).h + 34,
            transform: `translateX(-50%) translateY(${(1 - compIn) * 10}px)`,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontFamily: FONT.sans,
            fontSize: 38,
            fontWeight: 800,
            color: C.text,
            whiteSpace: 'nowrap',
            opacity: compIn,
          }}
        >
          <Icon name="eyeOff" size={42} color={C.amber} strokeWidth={2.4} />
          {COMPETITION}
        </div>
      ) : null}

      {/* ================= The two keys at hand ================= */}
      {wrongOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - wrongOut }}>
          {/* Tile A: her public key, then (on «se abre con su pública») the port's public key */}
          <div style={{ position: 'absolute', left: TILE_A.x, top: TILE_A.y, transform: `translateY(${(1 - tileAIn) * 16}px)` }}>
            <KeyTile kind="public" owner="naviera" title={TILES.navieraPublic.title} sub={TILES.navieraPublic.sub} width={TILE_W} show={tileAIn * (1 - tileCIn)} glow={tileAGlow} />
          </div>
          {tileCIn > 0.001 ? (
            <div style={{ position: 'absolute', left: TILE_A.x, top: TILE_A.y }}>
              <KeyTile kind="public" owner="port" title={TILES.portPublic.title} sub={TILES.portPublic.sub} width={TILE_W} show={tileCIn} glow={0.5 * crowdIn(0)} />
            </div>
          ) : null}
          {/* Tile B: the port's private key */}
          <div style={{ position: 'absolute', left: TILE_B.x, top: TILE_B.y, transform: `translateY(${(1 - tileBIn) * 16}px)` }}>
            <KeyTile kind="private" owner="port" title={TILES.portPrivate.title} sub={TILES.portPrivate.sub} width={TILE_W} show={tileBIn} glow={tileBGlow} ring={proposal * (1 - tileBDim)} dim={tileBDim} />
          </div>
          {/* «lo que propone NULL CIPHER» (the proposal is NULL CIPHER's, not the key) */}
          {proposal * (1 - tileBDim) > 0.001 ? (
            <div
              style={{
                position: 'absolute',
                left: TILE_B.x + TILE_W / 2,
                top: TILE_B.y - 54,
                transform: 'translateX(-50%)',
                fontFamily: FONT.sans,
                fontSize: 32,
                fontWeight: 800,
                color: C.roseSoft,
                whiteSpace: 'nowrap',
                opacity: proposal * (1 - tileBDim),
              }}
            >
              {PROPOSAL}
            </div>
          ) : null}
          {/* Under the cards: the question, then the half NULL CIPHER gets right */}
          {questionIn > 0.001 ? (
            <div style={{ position: 'absolute', left: (TILE_A.x + TILE_B.x + TILE_W) / 2, top: UNDER_TILES_Y, transform: 'translateX(-50%)', fontFamily: FONT.sans, fontSize: 46, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap', opacity: questionIn }}>
              {QUESTION}
            </div>
          ) : null}
          {trueIn * (1 - trueOut) > 0.001 ? (
            <div style={{ position: 'absolute', left: TILE_B.x + TILE_W / 2, top: UNDER_TILES_Y, transform: 'translateX(-50%)', opacity: trueIn * (1 - trueOut) }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '8px 22px',
                  borderRadius: RADIUS.pill,
                  border: `2px solid ${alpha(C.emerald, 0.6)}`,
                  background: alpha(C.emeraldDeep, 0.45),
                  fontFamily: FONT.sans,
                  fontSize: 34,
                  fontWeight: 780,
                  color: C.textStrong,
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon name="check" size={36} color={C.emerald} strokeWidth={2.6} />
                {TRUE_HALF}
              </span>
            </div>
          ) : null}
          {/* The crowd: everyone has the port's public key */}
          {Array.from({ length: CROWD }, (_, i) => {
            const p = crowdIn(i);
            if (p <= 0.001) return null;
            const x = 560 + i * 112;
            return (
              <div key={i} style={{ position: 'absolute', left: x, top: UNDER_TILES_Y + 4, display: 'flex', alignItems: 'center', gap: 2, opacity: p, transform: `translateY(${(1 - p) * 14}px)` }}>
                <Icon name="user" size={54} color={i % 3 === 0 ? C.sky : i % 3 === 1 ? '#cbd5e1' : '#fcd9b6'} strokeWidth={2.2} />
                <SlotGlyph width={52} color={C.cyan} letter={false} />
              </div>
            );
          })}
        </div>
      ) : null}

      {/* ================= The right path: her mailbox ================= */}
      {mbIn > 0.001 ? (
        <>
          <div style={{ position: 'absolute', left: MB.x, top: MB.y, transform: `translateY(${(1 - mbIn) * 22}px)` }}>
            <Mailbox
              width={MB.w}
              show={mbIn}
              slotGlow={Math.max(progress(frame, dropAt - 12, 10) * (1 - progress(frame, onlyHerAt, 12)), 0.5 * suGlow)}
              keyholeGlow={progress(frame, onlyHerAt - 4, 10)}
              keyIn={keyIn}
              keyTurn={keyTurn}
              doorOpen={doorOpen}
              inside={1}
              letters={[{ p: letterDrop, opacity: frame >= flyTo ? 1 : 0, edge: C.cyan }]}
            />
          </div>
          {/* The letter flying in from the centre */}
          {letterIn > 0.001 && frame < flyTo ? (
            <div style={{ position: 'absolute', left: fl.p > 0 ? fl.x : LETTER_FROM.x, top: fl.p > 0 ? fl.y : LETTER_FROM.y, opacity: letterIn }}>
              <Letter width={letterFlyW} edge={C.cyan} glow={0.5} glowColor={C.cyan} />
              <div
                style={{
                  position: 'absolute',
                  left: letterFlyW / 2,
                  top: (letterFlyW * LETTER_BASE.h) / LETTER_BASE.w + 10,
                  transform: 'translateX(-50%)',
                  fontFamily: FONT.sans,
                  fontSize: 32,
                  fontWeight: 780,
                  color: C.text,
                  whiteSpace: 'nowrap',
                  opacity: 1 - fl.p,
                }}
              >
                {RIGHT.letter}
              </div>
            </div>
          ) : null}
          {/* Leaders and labels */}
          <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={W} height={660}>
            {slotLabelIn > 0.001 ? (
              <line x1={MB.x + slot.x + 58} y1={MB.y + slot.y} x2={R_LABEL_X - 14} y2={MB.y + slot.y} stroke={alpha(C.emerald, 0.8)} strokeWidth={3} opacity={slotLabelIn} />
            ) : null}
            {keyLabelIn > 0.001 ? (
              <line x1={MB.x + keyhole.x + 90} y1={MB.y + keyhole.y - 4} x2={R_LABEL_X - 14} y2={MB.y + keyhole.y - 4} stroke={alpha(C.emerald, 0.8)} strokeWidth={3} opacity={keyLabelIn} />
            ) : null}
          </svg>
          <SideLabel x={R_LABEL_X} y={MB.y + slot.y - 26} show={slotLabelIn} text={RIGHT.slot} />
          <SideLabel x={R_LABEL_X} y={MB.y + keyhole.y - 30} show={keyLabelIn} text={RIGHT.key} />
        </>
      ) : null}

      {/* ================= The rule ================= */}
      {ruleIn > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: 864,
            top: 18,
            transform: `translateX(-50%) translateY(${(1 - ruleIn) * 12}px)`,
            fontFamily: FONT.sans,
            fontSize: 62,
            fontWeight: 850,
            color: C.textStrong,
            whiteSpace: 'nowrap',
            opacity: ruleIn,
          }}
        >
          {RULE.before}
          <span style={{ color: '#6ee7b7', textShadow: `0 0 ${Math.round(22 * suGlow)}px ${alpha(C.emerald, 0.7 * suGlow)}` }}>{RULE.strong}</span>
          {RULE.after}
        </div>
      ) : null}
      <div style={{ position: 'absolute', left: 780, top: 118, transform: 'translateX(-50%)' }}>
        <TermTag frame={frame} fps={fps} at={confidentialAt - 2} term={TERM} size={50} />
      </div>
      {noteIn > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: 760,
            top: 268,
            transform: `translateX(-50%) translateY(${(1 - noteIn) * 8}px)`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            fontFamily: FONT.sans,
            fontSize: 30,
            fontWeight: 650,
            fontStyle: 'italic',
            color: C.muted,
            whiteSpace: 'nowrap',
            opacity: noteIn,
          }}
        >
          <span>{NOTE[0]}</span>
          <span>{NOTE[1]}</span>
        </div>
      ) : null}
      {laterIn > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: 864,
            top: 598,
            transform: `translateX(-50%) translateY(${(1 - laterIn) * 10}px)`,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            padding: '6px 26px',
            borderRadius: RADIUS.pill,
            border: `2px solid ${alpha(C.cyan, 0.45)}`,
            background: alpha(C.ink900, 0.92),
            fontFamily: FONT.sans,
            fontSize: 34,
            fontWeight: 780,
            color: C.text,
            whiteSpace: 'nowrap',
            opacity: laterIn,
          }}
        >
          <PrivateKey width={74} color={C.cyan} glow={0.4} />
          {LATER}
        </div>
      ) : null}
    </Stage>
  );
}

function SideLabel({ x, y, text, show }: { x: number; y: number; text: string; show: number }) {
  if (show <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        opacity: clamp01(show),
        transform: `translateX(${(1 - clamp01(show)) * 14}px)`,
        fontFamily: FONT.sans,
        fontSize: 42,
        fontWeight: 850,
        color: '#6ee7b7',
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
}
