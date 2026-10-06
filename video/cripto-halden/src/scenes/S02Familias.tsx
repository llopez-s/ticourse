import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, pulse } from '../../../engine/src/theme/motion';
import { Icon, clamp01, mix } from '../../../engine/src/ui';
import { ASYM, FAMILIES, NULL_CIPHER_INTRO, PARTIES, SPEED, SYM, TRUE_HALF } from '../data/s02-familias';
import { HouseKey, HouseLock, Mailbox, houseKeyTip, houseLockKeyhole, mailboxPoint, type MailboxLetter } from './parts/Mailbox';
import { TermTag, flight, type Pt } from './parts/s02-familias/Marks';
import { PartyBadge } from './parts/s02-familias/Parties';
import { Road, Shadow, shadowHeight } from './parts/s02-familias/Road';
import { Stage, segment, wordFrame } from './kit';

const S = 's02-familias';
const W = 1728;

/** One element's place in each layout: A (symmetric, full stage), B/D (split), C (speed race, intercept). */
type Place = { x: number; y: number; w: number };
const at3 = (A: Place, B: Place, Cc: Place, a: number, c: number): Place => {
  const ab = { x: mix(A.x, B.x, a), y: mix(A.y, B.y, a), w: mix(A.w, B.w, a) };
  return { x: mix(ab.x, Cc.x, c), y: mix(ab.y, Cc.y, c), w: mix(ab.w, Cc.w, c) };
};

// ---- Layout A: the house key, full stage ---------------------------------------
// x = centre, y = top, w = width
const LOCK = { A: { x: 864, y: 22, w: 112 }, B: { x: 390, y: 104, w: 92 }, C: { x: 200, y: 280, w: 110 } } as const;
const PORT = { A: { x: 180, y: 365, w: 150 }, B: { x: 110, y: 310, w: 124 }, C: { x: 110, y: 310, w: 124 } } as const;
const NAV = { A: { x: 1548, y: 365, w: 150 }, B: { x: 670, y: 310, w: 124 }, C: { x: 670, y: 310, w: 124 } } as const;
// The two copies (x = centre, y = top)
const COPY_P = { A: { x: 180, y: 300, w: 124 }, B: { x: 110, y: 258, w: 100 }, C: { x: 145, y: 432, w: 96 } } as const;
const COPY_N = { A: { x: 1548, y: 300, w: 124 }, B: { x: 670, y: 258, w: 100 }, C: { x: 262, y: 432, w: 96 } } as const;
const ROAD = { x: 262, y: 400, w: 1204, h: 80 } as const;
const SHADOW = { x: 990, y: 488, w: 104 } as const;

// ---- Layout B/D: the mailbox on the right ----------------------------------------
const MBOX = { B: { x: 1010, y: 150, w: 250 }, C: { x: 1470, y: 250, w: 200 } } as const;
const SENDERS = [
  { dx: -210, tone: C.sky, tilt: -16 },
  { dx: -130, tone: '#cbd5e1', tilt: 10 },
  { dx: -50, tone: '#fcd9b6', tilt: -6 },
] as const;
const R_LABEL_X = 1360;

// ---- Layout C: the speed race (centre) --------------------------------------------
const RACE = { nameX: 372, trackX: 490, trackW: 600, rowY: [316, 448], h: 44 } as const;

/**
 * s02-familias «Una llave para dos, o un buzón». A: the house key — one key
 * closes and opens the padlock, two copies fly to the port and the shipping
 * company; «rápida: discos, bases de datos, tráfico», SYMMETRIC · AES; the
 * road with a shadow beside it and the copy's open question. B: the stage
 * splits — on the right the shipping company's mailbox: anyone drops letters
 * through the slot (public key), only its owner opens it with her key
 * (private key); «lo que cierra una, solo lo abre la otra», ASYMMETRIC · RSA,
 * ECC. C: on «más lento» both images step aside for the speed race (AES full
 * at once, RSA crawling) under NULL CIPHER's message and its presentation
 * label; the answer: «es verdad…», but against «unos gigas» RSA falls short.
 * D: both images come back with their roles: «simétrica: el volumen» ·
 * «asimétrica: acordar claves y firmar».
 */
export function S02Familias(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const oneKeyAt = props.cue('one-key');
  const copiesAt = props.cue('copies');
  const fastAt = props.cue('fast');
  const roadAt = props.cue('road');
  const mailboxAt = props.cue('mailbox');
  const slotAt = props.cue('slot');
  const ownerAt = props.cue('owner');
  const pairAt = props.cue('pair');
  const slowAt = props.cue('slow');
  const familiesAt = props.cue('families');
  const rolesAt = props.cue('roles');
  const s06 = segment(props, 's02-06');
  const s08 = segment(props, 's02-08');
  // NULL CIPHER's card: from the end of s02-06 (its silent lead) to the end of s02-07.
  const icFrom = s06.to;

  // ---- Phase weights ------------------------------------------------------------
  const a = progress(frame, mailboxAt - 14, 22, EASE.inOut);
  const cStart = Math.min(slowAt - 10, icFrom - 28);
  const c = progress(frame, cStart, 18, EASE.inOut);
  const dD = progress(frame, familiesAt - 14, 22, EASE.inOut);
  const cw = c * (1 - dD);

  // ---- A: the key closes and opens ---------------------------------------------------
  const intro = progress(frame, 0, 12);
  const wCierra = wordFrame(S, 's02-01', 'cierra');
  const wAbre = wordFrame(S, 's02-01', 'abre');
  const keyIn = progress(frame, oneKeyAt + 2, Math.max(10, Math.min(18, wCierra - oneKeyAt - 6)), EASE.inOut);
  const closed = progress(frame, wCierra - 2, 8, EASE.out) * (1 - progress(frame, wAbre - 2, 8, EASE.out));
  const sameKeyIn = progress(frame, wAbre + 2, 14);
  const copyDur = Math.max(14, Math.min(24, fastAt - copiesAt - 2));
  const copiesP = progress(frame, copiesAt, copyDur, EASE.inOut);
  const fastIn = progress(frame, fastAt + 2, 14);
  const wSim = wordFrame(S, 's02-02', 'simétrico');
  const wAes = wordFrame(S, 's02-02', 'AES');
  const roadIn = progress(frame, roadAt - 2, 20, EASE.inOut);
  const shadowIn = progress(frame, roadAt + 10, 14);
  const eye = progress(frame, wordFrame(S, 's02-03', 'nadie') - 6, 12);
  const ghostDur = Math.max(30, Math.min(80, mailboxAt - roadAt - 24));
  const ghostT = progress(frame, roadAt + 8, ghostDur, EASE.inOut);
  const roadQIn = progress(frame, roadAt + 4, 14);
  const navDashed = progress(frame, roadAt, 10);

  // ---- B: the mailbox ------------------------------------------------------------------
  const mbIn = progress(frame, mailboxAt - 2, 16);
  const step = Math.max(8, Math.min(16, (ownerAt - slotAt - 18) / 3));
  const letters: MailboxLetter[] = SENDERS.map((s, i) => ({
    p: progress(frame, slotAt + i * step, 16, EASE.inOut),
    opacity: progress(frame, slotAt + i * step - 8, 8),
    edge: s.tone,
    tilt: s.tilt,
    dx: s.dx,
  }));
  const sendersIn = progress(frame, slotAt - 8, 10) * (1 - progress(frame, pairAt + 10, 14));
  const ownerIn = progress(frame, ownerAt - 4, 10);
  const keyInBox = progress(frame, ownerAt, 10, EASE.inOut);
  const keyTurn = progress(frame, ownerAt + 10, 6);
  const doorOpen = progress(frame, ownerAt + 14, 12, EASE.inOut) * (1 - progress(frame, pairAt + 40, 14, EASE.inOut));
  const wPub = wordFrame(S, 's02-05', 'pública');
  const wPriv = wordFrame(S, 's02-05', 'privada');
  const wRule = wordFrame(S, 's02-05', 'cierra');
  const pubIn = progress(frame, wPub - 4, 12);
  const privIn = progress(frame, wPriv - 4, 12);
  const ruleIn = progress(frame, wRule - 4, 14);
  const pairGlow = progress(frame, pairAt - 2, 10) * (1 - progress(frame, wPub + 30, 14));
  const slotGlow = Math.max(progress(frame, slotAt - 4, 10) * (1 - progress(frame, ownerAt, 10)), pairGlow, pubIn * (1 - progress(frame, wPriv - 4, 10)));
  const keyholeGlow = Math.max(progress(frame, ownerAt - 2, 10) * (1 - progress(frame, pairAt, 10)), pairGlow, privIn * (1 - progress(frame, wRule - 4, 10)));
  const wAsym = wordFrame(S, 's02-06', 'asimétrico');
  const wRsa = wordFrame(S, 's02-06', 'RSA');

  // ---- C: the race and the intercept ---------------------------------------------------
  const raceIn = progress(frame, slowAt - 2, 14) * (1 - dD);
  const aesFill = progress(frame, slowAt + 6, 14, EASE.out);
  const rsaFill = 0.015 + 0.055 * progress(frame, slowAt + 6, Math.max(60, familiesAt - slowAt - 30), EASE.linear);
  const nullIn = progress(frame, wordFrame(S, 's02-07', 'NULL') - 2, 12) * (1 - dD);
  const wVerdad = wordFrame(S, 's02-08', 'verdad');
  const trueIn = progress(frame, wVerdad - 4, 12) * (1 - dD);
  const gigasIn = progress(frame, s08.from + 2, 14);
  const wLento = wordFrame(S, 's02-08', 'lento');
  const shortIn = progress(frame, wLento - 4, 12);
  const gigasPulse = gigasIn * (0.5 + 0.5 * pulse(frame - s08.from, fps, 0.6)) * (1 - dD);

  // ---- D: the roles --------------------------------------------------------------------
  const famSymIn = progress(frame, wordFrame(S, 's02-09', 'simétrica') - 4, 12);
  const famAsymIn = progress(frame, wordFrame(S, 's02-09', 'asimétrica') - 4, 12);
  const rolesIn = progress(frame, rolesAt - 2, 14);

  // ---- Places ----------------------------------------------------------------------------
  const lock = at3(LOCK.A, LOCK.B, LOCK.C, a, cw);
  const port = at3(PORT.A, PORT.B, PORT.C, a, cw);
  const nav = at3(NAV.A, NAV.B, NAV.C, a, cw);
  const cpP = at3(COPY_P.A, COPY_P.B, COPY_P.C, a, cw);
  const cpN = at3(COPY_N.A, COPY_N.B, COPY_N.C, a, cw);
  const mb = { x: mix(MBOX.B.x, MBOX.C.x, cw), y: mix(MBOX.B.y, MBOX.C.y, cw), w: mix(MBOX.B.w, MBOX.C.w, cw) };
  const badgeVis = 1 - cw;
  const labelVis = 1 - c;

  // The single key at the lock (before the copies split from it)
  const lockLeft = lock.x - lock.w / 2;
  const hole = houseLockKeyhole(lock.w);
  const keyW = 130 * (lock.w / LOCK.A.w);
  const tip = houseKeyTip(keyW);
  const keyAtLock: Pt = { x: lockLeft + hole.x - tip.x + (1 - keyIn) * 150, y: lock.y + hole.y - tip.y };
  const singleKeyVis = keyIn > 0 ? 1 - progress(frame, copiesAt, 4) : 0;
  const copyP = copiesP > 0 ? flight(frame, copiesAt, copyDur, { x: keyAtLock.x, y: keyAtLock.y }, { x: cpP.x - cpP.w / 2, y: cpP.y }, 70) : null;
  const copyN = copiesP > 0 ? flight(frame, copiesAt, copyDur, { x: keyAtLock.x, y: keyAtLock.y }, { x: cpN.x - cpN.w / 2, y: cpN.y }, 70) : null;
  const copyWP = mix(keyW, cpP.w, copiesP);
  const copyWN = mix(keyW, cpN.w, copiesP);

  // The ghost copy travelling the road
  const ghostX = ROAD.x + ROAD.w * mix(0.08, 0.82, ghostT) - 75;
  const ghostVis = roadIn * (1 - a) * (ghostT < 1 ? 1 : 1 - progress(frame, roadAt + 8 + ghostDur, 10));

  // The mailbox anchors
  const slot = mailboxPoint(mb.w, 'slot');
  const keyhole = mailboxPoint(mb.w, 'keyhole');

  return (
    <Stage>
      {/* ================= A: road, shadow and its question ================= */}
      {roadIn > 0.001 && a < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - a }}>
          <div style={{ position: 'absolute', left: ROAD.x, top: ROAD.y }}>
            <Road width={ROAD.w} height={ROAD.h} draw={roadIn} />
          </div>
          <div style={{ position: 'absolute', left: SHADOW.x, top: SHADOW.y, transform: `translateY(${(1 - shadowIn) * 16}px)` }}>
            <Shadow width={SHADOW.w} show={shadowIn} eye={eye} />
          </div>
          {/* Eye line to the travelling copy */}
          {eye > 0.01 && ghostVis > 0.01 ? (
            <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={W} height={660}>
              <line
                x1={SHADOW.x + SHADOW.w / 2}
                y1={SHADOW.y + shadowHeight(SHADOW.w) * 0.28}
                x2={ghostX + 75}
                y2={ROAD.y + ROAD.h / 2}
                stroke={alpha('#e2e8f0', 0.35 * eye)}
                strokeWidth={2.5}
                strokeDasharray="6 8"
              />
            </svg>
          ) : null}
          {ghostVis > 0.001 ? (
            <div style={{ position: 'absolute', left: ghostX, top: ROAD.y + ROAD.h / 2 - 30, opacity: ghostVis }}>
              <HouseKey width={150} dashed color="#f8fafc" glow={0.8} glowColor="#e2e8f0" />
            </div>
          ) : null}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 610,
              width: W,
              textAlign: 'center',
              fontFamily: FONT.sans,
              fontSize: 38,
              fontWeight: 800,
              color: '#fde68a',
              opacity: roadQIn,
              transform: `translateY(${(1 - roadQIn) * 10}px)`,
              whiteSpace: 'nowrap',
            }}
          >
            {SYM.road}
          </div>
        </div>
      ) : null}

      {/* ================= The two sides ================= */}
      {badgeVis > 0.001 ? (
        <>
          <div style={{ position: 'absolute', left: port.x, top: port.y, transform: 'translateX(-50%)' }}>
            <PartyBadge who="port" size={port.w} label={PARTIES.port} labelSize={mix(36, 32, a)} show={intro * badgeVis} />
          </div>
          <div style={{ position: 'absolute', left: nav.x, top: nav.y, transform: 'translateX(-50%)' }}>
            <PartyBadge who="naviera" size={nav.w} label={PARTIES.naviera} labelSize={mix(36, 32, a)} show={intro * badgeVis} />
          </div>
        </>
      ) : null}

      {/* ================= The padlock and the key ================= */}
      <div style={{ position: 'absolute', left: lockLeft, top: lock.y, opacity: intro }}>
        <HouseLock width={lock.w} closed={closed} glow={0.6 * closed * (1 - a)} glowColor="#e2e8f0" />
      </div>
      {singleKeyVis > 0.001 ? (
        <div style={{ position: 'absolute', left: keyAtLock.x, top: keyAtLock.y, opacity: Math.min(1, keyIn * 2) * singleKeyVis }}>
          <HouseKey width={keyW} glow={0.4} />
        </div>
      ) : null}
      {copyP ? (
        <div style={{ position: 'absolute', left: copyP.x, top: copyP.y }}>
          <HouseKey width={copyWP} flip glow={0.35 * (1 - a)} glowColor={C.cyan} />
        </div>
      ) : null}
      {copyN ? (
        <div style={{ position: 'absolute', left: copyN.x, top: copyN.y }}>
          {/* Solid until the road's question; then a ghost: how did it get here? */}
          {navDashed < 0.999 ? (
            <div style={{ position: 'absolute', left: 0, top: 0, opacity: 1 - navDashed }}>
              <HouseKey width={copyWN} glow={0.35 * (1 - a)} glowColor={C.emerald} />
            </div>
          ) : null}
          {navDashed > 0.001 ? (
            <div style={{ position: 'absolute', left: 0, top: 0, opacity: navDashed }}>
              <HouseKey width={copyWN} dashed color="#e2e8f0" />
            </div>
          ) : null}
        </div>
      ) : null}

      {/* «la misma clave cierra y abre» */}
      {sameKeyIn * labelVis > 0.001 ? (
        <CentredText x={mix(864, 390, a)} y={mix(178, 224, a)} size={mix(40, 32, a)} weight={800} color={C.textStrong} opacity={sameKeyIn * labelVis}>
          {SYM.sameKey}
        </CentredText>
      ) : null}
      {/* «rápida: discos, bases de datos, tráfico» */}
      {fastIn * labelVis > 0.001 ? (
        <div style={{ position: 'absolute', left: mix(864, 390, a), top: mix(240, 486, a), transform: `translateX(-50%) translateY(${(1 - fastIn) * 10}px)`, opacity: fastIn * labelVis }}>
          <FactChip icon="bolt" size={mix(34, 32, a)} tone={C.sky}>
            {SYM.fast}
          </FactChip>
        </div>
      ) : null}

      {/* SYMMETRIC · AES: under the chip in A, top-left in B/D */}
      <div
        style={{
          position: 'absolute',
          left: mix(864, 0, a),
          top: mix(300, 0, a),
          transform: `translateX(${-50 * (1 - a)}%)`,
          opacity: 1 - cw,
        }}
      >
        <TermTag frame={frame} fps={fps} at={wSim - 2} size={mix(48, 44, a)} term={<TermLine term={SYM.term} algo={SYM.algo} algoIn={progress(frame, wAes - 4, 10)} />} />
      </div>

      {/* ================= B: the mailbox ================= */}
      {mbIn > 0.001 ? (
        <>
          {/* Senders: different people, one letter each */}
          {sendersIn > 0.001
            ? SENDERS.map((s, i) => {
                const sx = mb.x + (120 + s.dx) * (mb.w / 240);
                return (
                  <div key={i} style={{ position: 'absolute', left: sx - 32, top: -4, opacity: sendersIn * (1 - progress(frame, slotAt + i * step + 10, 10) * 0.5) }}>
                    <Icon name="user" size={64} color={s.tone} strokeWidth={2.2} />
                  </div>
                );
              })
            : null}
          <div style={{ position: 'absolute', left: mb.x, top: mb.y, transform: `translateY(${(1 - mbIn) * 24}px)` }}>
            <Mailbox
              width={mb.w}
              show={mbIn}
              slotGlow={slotGlow * (1 - cw) + 0.6 * famAsymIn}
              keyholeGlow={keyholeGlow * (1 - cw)}
              keyIn={keyInBox}
              keyTurn={keyTurn}
              doorOpen={doorOpen}
              letters={letters}
              inside={3}
              glow={0.3 * famAsymIn}
            />
          </div>
          {/* Owner */}
          {ownerIn * labelVis > 0.001 ? (
            <div style={{ position: 'absolute', left: mb.x + keyhole.x + 54, top: mb.y + keyhole.y + 20, opacity: ownerIn * labelVis }}>
              <Icon name="user" size={60} color={C.emerald} strokeWidth={2.4} />
            </div>
          ) : null}
          {/* Leaders + labels: public at the slot, private at the keyhole */}
          {(pubIn + privIn) * labelVis > 0.001 ? (
            <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={W} height={660}>
              {pubIn > 0.001 ? (
                <line x1={mb.x + slot.x + 62 * (mb.w / 240)} y1={mb.y + slot.y} x2={R_LABEL_X - 12} y2={mb.y + slot.y} stroke={alpha(C.emerald, 0.8)} strokeWidth={3} opacity={pubIn * labelVis} />
              ) : null}
              {privIn > 0.001 ? (
                <line x1={mb.x + keyhole.x + 128 * (mb.w / 240)} y1={mb.y + keyhole.y - 4} x2={R_LABEL_X - 12} y2={mb.y + keyhole.y - 4} stroke={alpha(C.emerald, 0.8)} strokeWidth={3} opacity={privIn * labelVis} />
              ) : null}
            </svg>
          ) : null}
          <KeyLabel x={R_LABEL_X} y={mb.y + slot.y - 44} title={ASYM.publicKey} sub={ASYM.publicSub} show={pubIn * labelVis} />
          <KeyLabel x={R_LABEL_X} y={mb.y + keyhole.y - 48} title={ASYM.privateKey} sub={ASYM.privateSub} show={privIn * labelVis} />
          {ruleIn * labelVis > 0.001 ? (
            <CentredText x={1300} y={546} size={36} weight={800} color={C.textStrong} opacity={ruleIn * labelVis}>
              {ASYM.rule}
            </CentredText>
          ) : null}
          {/* ASYMMETRIC · RSA, ECC, top-right */}
          <div style={{ position: 'absolute', left: W, top: 0, transform: 'translateX(-100%)', opacity: 1 - cw }}>
            <TermTag frame={frame} fps={fps} at={wAsym - 2} size={44} term={<TermLine term={ASYM.term} algo={ASYM.algo} algoIn={progress(frame, wRsa - 4, 10)} />} />
          </div>
        </>
      ) : null}

      {/* ================= C: NULL CIPHER's label and the race ================= */}
      {nullIn > 0.001 ? (
        <div style={{ position: 'absolute', left: 864, top: 246, transform: `translateX(-50%) translateY(${(1 - nullIn) * 10}px)`, opacity: nullIn }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              padding: '8px 22px',
              borderRadius: RADIUS.pill,
              border: `2px solid ${alpha(C.rose, 0.7)}`,
              background: alpha(C.roseDeep, 0.6),
              fontFamily: FONT.sans,
              fontSize: 34,
              fontWeight: 800,
              color: C.roseSoft,
              whiteSpace: 'nowrap',
            }}
          >
            {NULL_CIPHER_INTRO}
          </span>
        </div>
      ) : null}
      {raceIn > 0.001 ? (
        <SpeedRace show={raceIn} aes={aesFill} rsa={rsaFill} gigas={gigasIn} gigasPulse={gigasPulse} short={shortIn} slowLabel={progress(frame, slowAt + 4, 12)} />
      ) : null}
      {trueIn > 0.001 ? (
        <div style={{ position: 'absolute', left: 864, top: 576, transform: `translateX(-50%) translateY(${(1 - trueIn) * 10}px)`, opacity: trueIn }}>
          <FactChip icon="check" size={34} tone={C.emerald}>
            {TRUE_HALF}
          </FactChip>
        </div>
      ) : null}

      {/* ================= D: the roles ================= */}
      {famSymIn > 0.001 ? (
        <div style={{ position: 'absolute', left: 390, top: 540, transform: `translateX(-50%) translateY(${(1 - famSymIn) * 12}px)`, opacity: famSymIn }}>
          <RoleChip size={38}>{FAMILIES.sym}</RoleChip>
        </div>
      ) : null}
      {famAsymIn > 0.001 ? (
        <div style={{ position: 'absolute', left: 1300, top: 540, transform: `translateX(-50%) translateY(${(1 - famAsymIn) * 12}px)`, opacity: famAsymIn }}>
          <RoleChip size={38}>{FAMILIES.asym}</RoleChip>
        </div>
      ) : null}
      {rolesIn > 0.001 ? (
        <>
          <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={W} height={660}>
            <path
              d={`M 390 606 Q 390 636 452 636 L 1238 636 Q 1300 636 1300 606`}
              fill="none"
              stroke={alpha(C.muted, 0.6)}
              strokeWidth={3}
              strokeDasharray="10 9"
              opacity={rolesIn}
            />
          </svg>
          <div style={{ position: 'absolute', left: 845, top: 614, transform: 'translateX(-50%)', opacity: rolesIn }}>
            <span style={{ display: 'inline-block', padding: '4px 20px', background: C.ink950, fontFamily: FONT.sans, fontSize: 32, fontWeight: 700, fontStyle: 'italic', color: C.text, whiteSpace: 'nowrap' }}>
              {FAMILIES.roles}
            </span>
          </div>
        </>
      ) : null}
    </Stage>
  );
}

// ---------------------------------------------------------------------------

function TermLine({ term, algo, algoIn }: { term: string; algo: string; algoIn: number }) {
  return (
    <span style={{ whiteSpace: 'nowrap' }}>
      {term}
      <span style={{ color: C.text, fontWeight: 750, opacity: clamp01(algoIn) }}> · {algo}</span>
    </span>
  );
}

function CentredText({
  x,
  y,
  size,
  weight,
  color,
  opacity,
  children,
}: {
  x: number;
  y: number;
  size: number;
  weight: number;
  color: string;
  opacity: number;
  children: string;
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translateX(-50%) translateY(${(1 - clamp01(opacity)) * 10}px)`,
        opacity,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: weight,
        color,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </div>
  );
}

function FactChip({ icon, size, tone, children }: { icon: 'bolt' | 'check'; size: number; tone: string; children: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: Math.round(size * 0.4),
        padding: `${Math.round(size * 0.28)}px ${Math.round(size * 0.65)}px`,
        borderRadius: RADIUS.pill,
        border: `2px solid ${alpha(tone, 0.6)}`,
        background: `linear-gradient(180deg, ${alpha(tone, 0.14)} 0%, ${alpha(C.ink900, 0.95)} 100%)`,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 750,
        color: C.textStrong,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name={icon} size={Math.round(size * 1.05)} color={tone} strokeWidth={2.4} />
      {children}
    </span>
  );
}

function RoleChip({ size, children }: { size: number; children: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: `${Math.round(size * 0.3)}px ${Math.round(size * 0.7)}px`,
        borderRadius: RADIUS.md,
        border: `2px solid ${alpha(C.text, 0.45)}`,
        background: alpha(C.ink850, 0.96),
        boxShadow: `0 14px 32px ${alpha('#000000', 0.4)}`,
        fontFamily: FONT.sans,
        fontSize: size,
        fontWeight: 800,
        color: C.textStrong,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  );
}

/** Two-line key label (title 40 px, sub 32 px), emerald: the shipping company's keys. */
function KeyLabel({ x, y, title, sub, show }: { x: number; y: number; title: string; sub: string; show: number }) {
  if (show <= 0.001) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, opacity: show, transform: `translateX(${(1 - show) * 14}px)`, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
      <div style={{ fontSize: 40, fontWeight: 850, color: '#6ee7b7', lineHeight: 1.12 }}>{title}</div>
      <div style={{ fontSize: 32, fontWeight: 700, color: C.text, lineHeight: 1.2 }}>{sub}</div>
    </div>
  );
}

/** AES against RSA: two bars racing to «unos gigas». */
function SpeedRace({
  show,
  aes,
  rsa,
  gigas,
  gigasPulse,
  short,
  slowLabel,
}: {
  show: number;
  aes: number;
  rsa: number;
  gigas: number;
  gigasPulse: number;
  short: number;
  slowLabel: number;
}) {
  const rows = [
    { name: SPEED.aes.name, label: SPEED.aes.label, fill: aes, color: C.sky, labelIn: aes },
    { name: SPEED.rsa.name, label: SPEED.rsa.label, fill: rsa, color: C.amber, labelIn: slowLabel },
  ];
  const finishX = RACE.trackX + RACE.trackW;
  return (
    <div style={{ position: 'absolute', inset: 0, opacity: show, transform: `translateY(${(1 - show) * 16}px)`, fontFamily: FONT.sans }}>
      {rows.map((r, i) => {
        const y = RACE.rowY[i];
        return (
          <div key={r.name}>
            <div style={{ position: 'absolute', left: RACE.nameX, top: y - 6, fontFamily: FONT.mono, fontSize: 42, fontWeight: 850, color: C.textStrong, lineHeight: 1 }}>{r.name}</div>
            <div
              style={{
                position: 'absolute',
                left: RACE.trackX,
                top: y,
                width: RACE.trackW,
                height: RACE.h,
                boxSizing: 'border-box',
                borderRadius: RADIUS.pill,
                border: `2px solid ${alpha(C.muted, 0.45)}`,
                background: alpha(C.ink950, 0.8),
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${clamp01(r.fill) * 100}%`,
                  height: '100%',
                  borderRadius: RADIUS.pill,
                  background: `linear-gradient(90deg, ${alpha(r.color, 0.55)} 0%, ${r.color} 100%)`,
                  boxShadow: `0 0 18px ${alpha(r.color, 0.5)}`,
                }}
              />
            </div>
            <div style={{ position: 'absolute', left: RACE.trackX, top: y + RACE.h + 8, fontSize: 32, fontWeight: 750, color: i === 0 ? '#7dd3fc' : '#fde68a', opacity: clamp01(r.labelIn), whiteSpace: 'nowrap' }}>
              {r.label}
            </div>
          </div>
        );
      })}
      {/* «se queda corta», on the RSA track */}
      {short > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: RACE.trackX + RACE.trackW * 0.2,
            top: RACE.rowY[1] - 2,
            fontSize: 32,
            fontWeight: 850,
            color: C.amber,
            opacity: short,
            whiteSpace: 'nowrap',
            lineHeight: `${RACE.h + 4}px`,
          }}
        >
          {SPEED.short}
        </div>
      ) : null}
      {/* The finish line: «unos gigas» */}
      {gigas > 0.001 ? (
        <>
          <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={W} height={660}>
            <line x1={finishX} y1={296} x2={finishX} y2={RACE.rowY[1] + RACE.h + 22} stroke={alpha(C.textStrong, 0.7 * gigas)} strokeWidth={4} strokeDasharray="10 8" />
          </svg>
          <div style={{ position: 'absolute', left: finishX + 22, top: (RACE.rowY[0] + RACE.rowY[1] + RACE.h) / 2 - 30, opacity: gigas, transform: `translateX(${(1 - gigas) * 12}px)` }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 20px',
                borderRadius: RADIUS.md,
                border: `2px solid ${alpha(C.textStrong, 0.5 + 0.4 * gigasPulse)}`,
                background: alpha(C.ink850, 0.96),
                boxShadow: `0 0 ${Math.round(20 * gigasPulse)}px ${alpha(C.textStrong, 0.25 * gigasPulse)}`,
                fontSize: 34,
                fontWeight: 800,
                color: C.textStrong,
                whiteSpace: 'nowrap',
              }}
            >
              <Icon name="database" size={36} color={C.textStrong} strokeWidth={2.2} />
              {SPEED.load}
            </span>
          </div>
        </>
      ) : null}
    </div>
  );
}
