import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, clamp01, mix, windowWeight, type IconName } from '../../../engine/src/ui';
import { S06 } from '../data/s06-ah-esp';
import { SealBag, SealedBox, sealBagSize, sealedBoxSize } from './parts/Shipment';
import { ConfigConsole } from './parts/s06-ah-esp/ConfigConsole';
import { RoundBadge, TermCard } from './parts/s06-ah-esp/marks';
import { IpPacket, LoadFit, RouteGlyph, packetWidth, type BlockSpec } from './parts/s06-ah-esp/packet';
import { Stage, segment, wordFrame } from './kit';

const S = 's06-ah-esp';
const W = 1728;

// ---- Phase 1: the console, full size, then the IPSec row under it
const CON = { x: 204, y: 52, w: 1320, compactW: 470 } as const;
const CON_COMPACT_X = (W - CON.compactW) / 2;
const IPSEC = { x: 60, y: 404 } as const;
const MINI = { x: 880, y: 428, gap: 34, h: 104 } as const;

// ---- Phase 2–3: the protocol menu (two options), one column each
const COL = [W / 4, (3 * W) / 4] as const;
const TILE_W = 820;
const TILE_Y = 116;
const BRACKET_Y = 98;
const PKT_Y = 356;
const PKT_H = 190;
/** Bottom of the option cards: nothing under them shows above this line. */
const TILE_BOTTOM = 268;
const BAG_W = 340;
const BOX_W = 380;
/** Bag and box stand on the same floor line. */
const FLOOR_Y = 652;

/** The two blocks of the explaining packet under each option. */
const pktBlocks = (o: { headerCheck: number; payloadCheck: number; cipher: number; glowPayload?: number }): BlockSpec[] => [
  { width: 270, content: (w, h) => <RouteGlyph width={w} height={h} />, check: o.headerCheck, fill: C.ink800 },
  { width: 390, content: (w, h) => <LoadFit width={w} height={h} />, check: o.payloadCheck, cipher: o.cipher, glow: o.glowPayload ?? 0, glowTone: C.amber },
];
const PKT_W = packetWidth(pktBlocks({ headerCheck: 0, payloadCheck: 0, cipher: 0 }));

/** The «any IP packet» row: the same packet shape carrying different things. */
const MINI_CONTENT: IconName[] = ['mail', 'file', 'globe'];

/**
 * s06-ah-esp «Precinto o caja cerrada».
 *   config      the tunnel's configuration as a console: three lines type in («protocolo: ESP»,
 *               «modo: túnel», «extremos: pasarela de la sede, pasarela de la terminal»), each lit as
 *               the voice names it.
 *   layer3      IPSec (violet term) «capa de red · cualquier paquete IP» under the console; three IP
 *               packets carrying different things (mail, a file, the web) get its cyan outline on
 *               «lleven».
 *   ah          the console folds into its protocol line with a dropdown caret; the menu opens below:
 *               two options, AH (left) and ESP (right). Under AH, a packet: its payload ticked on
 *               «nadie» (integrity), its header on «viene» (origin); «integridad y origen» on
 *               «integridad», «· sin cifrar» on «cifra» with an amber eye on the readable load.
 *   seal        the packet becomes the transparent bag with its seal; the seal snaps on «abren»
 *               (back on «pero»); amber eyes look at it on «ve».
 *   s06-06      focus moves to ESP: its packet ticked on «comprueba», ciphered on «cifra».
 *   esp         «además, confidencialidad»; the packet gives way to an open box; the same load
 *               drops in and the lid shuts at the end of the sentence.
 *   box         the seal clicks on the cue (sfx «lock»); «· el que se usa» on «usa» while the
 *               console's ESP lights. Holds: bag and box side by side.
 */
export function S06AhEsp(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const configAt = props.cue('config');
  const layer3At = props.cue('layer3');
  const ahAt = props.cue('ah');
  const sealAt = props.cue('seal');
  const espAt = props.cue('esp');
  const boxAt = props.cue('box');
  const s06 = segment(props, 's06-06');

  const at = {
    protocolo: w('s06-01', 'protocolo'),
    modo: w('s06-01', 'modo'),
    extremos: w('s06-01', 'extremos'),
    ipsec: w('s06-02', 'IPSec'),
    capa: w('s06-02', 'capa'),
    paquetes: w('s06-02', 'paquetes'),
    lleven: w('s06-02', 'lleven'),
    primera: w('s06-03', 'primera'),
    nadie: w('s06-03', 'nadie'),
    viene: w('s06-03', 'viene'),
    integridad: w('s06-04', 'integridad'),
    cifra: w('s06-04', 'cifra'),
    ahName: w('s06-04', 'AH'),
    abren: w('s06-05', 'abren'),
    pero: w('s06-05', 'pero'),
    ve: w('s06-05', 've'),
    segunda: w('s06-06', 'segunda'),
    comprueba: w('s06-06', 'comprueba'),
    cifra2: w('s06-06', 'cifra'),
    usa: w('s06-07', 'usa'),
  };

  // ---------------- Phase 1: the console
  const panelIn = progress(frame, 0, 14);
  // The file is open from the start: its three lines print in quickly, then light as the voice names them.
  const lineAt = [Math.min(6, configAt), Math.min(20, configAt + 14), Math.min(34, configAt + 28)];
  const appear = [progress(frame, lineAt[0], 12, EASE.linear), progress(frame, lineAt[1], 10, EASE.linear), progress(frame, lineAt[2], 26, EASE.linear)];
  const lineFocus = [
    windowWeight(frame, at.protocolo, at.modo, { ramp: 8 }),
    windowWeight(frame, at.modo, at.extremos, { ramp: 8 }),
    windowWeight(frame, at.extremos, layer3At + 6, { ramp: 8 }),
  ];
  const collapse = progress(frame, ahAt - 4, 22, EASE.inOut);
  const conX = mix(CON.x, CON_COMPACT_X, collapse);
  const conY = mix(CON.y, 0, collapse);
  const caret = progress(frame, ahAt + 12, 10);
  const valueGlow = windowWeight(frame, ahAt + 4, ahAt + 50, { ramp: 10 }) + windowWeight(frame, at.usa - 4, at.usa + 70, { ramp: 10 });

  // IPSec row
  const rowOut = 1 - progress(frame, ahAt - 10, 14, EASE.inOut);
  const ipsecCard = progress(frame, at.ipsec - 4, 16) * rowOut;
  const ipsecLine = progress(frame, at.capa - 4, 14);
  const minis = MINI_CONTENT.map((_, i) => progress(frame, at.paquetes - 4 + i * 6, 14) * rowOut);
  const shield = progress(frame, at.lleven - 4, 16);

  // ---------------- Phase 2: the menu
  const bracket = progress(frame, ahAt + 6, 16, EASE.inOut);
  const tiles = progress(frame, ahAt + 10, 16);
  const espFocus = progress(frame, s06.from - 4, 16, EASE.inOut);
  const ahDim = 0.55 * espFocus * (1 - progress(frame, boxAt + 20, 20, EASE.inOut));
  const ahPart1 = progress(frame, at.integridad - 4, 14);
  const ahPart2 = progress(frame, at.cifra - 4, 14);
  const ahNameGlow = windowWeight(frame, at.ahName - 4, at.ahName + 40, { ramp: 8 });
  const espPart1 = progress(frame, espAt - 4, 14);
  const espPart2 = progress(frame, at.usa - 4, 14);
  const espGlow = windowWeight(frame, espAt - 4, espAt + 44, { ramp: 8 }) + 0.7 * windowWeight(frame, at.usa - 4, at.usa + 80, { ramp: 10 });

  // AH's packet (phase 2) → the bag (phase 3)
  const ahPkt = progress(frame, at.primera - 4, 16) * (1 - progress(frame, sealAt - 6, 14, EASE.inOut));
  const ahChecks = { payload: progress(frame, at.nadie - 2, 12), header: progress(frame, at.viene - 2, 12) };
  const ahEye = progress(frame, at.cifra - 2, 12) * (1 - progress(frame, sealAt - 6, 14, EASE.inOut));
  const bagShow = progress(frame, sealAt - 2, 16);
  const bagLoad = progress(frame, sealAt + 4, 24, EASE.inOut);
  const bagSeal = progress(frame, sealAt + 28, 10);
  const bagBroken = windowWeight(frame, at.abren, at.pero, { ramp: 6, lead: 2 });
  const eyes = progress(frame, at.ve - 4, 14);

  // ESP's packet (s06-06) → the box (esp → box)
  // The box must be loaded before its lid shuts on `box`, however close the real voice puts esp and box.
  const espPkt = progress(frame, at.segunda - 4, 16) * (1 - progress(frame, Math.min(espAt + 26, boxAt - 60), 14, EASE.inOut));
  const espChecks = progress(frame, at.comprueba - 2, 12);
  const espCipher = progress(frame, at.cifra2 - 2, 18, EASE.inOut);
  const boxShow = progress(frame, Math.min(espAt + 30, boxAt - 56), 16);
  const boxLoad = progress(frame, Math.min(Math.max(espAt + 46, boxAt - 40), boxAt - 38), 22, EASE.inOut);
  const boxLid = progress(frame, boxAt - 14, 14, EASE.inOut);
  const boxSeal = progress(frame, boxAt, 8);

  const bag = sealBagSize(BAG_W);
  const box = sealedBoxSize(BOX_W);
  const minisW = packetWidth([{ width: 104 }, { width: 120 }]);

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      {/* ================= Phase 1: IPSec under the console ================= */}
      {ipsecCard > 0.001 ? (
        <div style={{ position: 'absolute', left: IPSEC.x, top: IPSEC.y }}>
          <TermCard term={S06.ipsec.term} p={ipsecCard} size={54} lines={[{ text: S06.ipsec.line, p: ipsecLine, size: 38, color: C.textStrong }]} />
        </div>
      ) : null}
      {MINI_CONTENT.map((icon, i) =>
        minis[i] > 0.001 ? (
          <div key={icon} style={{ position: 'absolute', left: MINI.x + i * (minisW + MINI.gap), top: MINI.y }}>
            <IpPacket
              height={MINI.h}
              show={minis[i]}
              glow={shield}
              gap={6}
              blocks={[
                { width: 104, content: (cw, ch) => <RouteGlyph width={cw} height={ch} />, fill: C.ink800 },
                { width: 120, content: <IconTile icon={icon} /> },
              ]}
            />
          </div>
        ) : null,
      )}

      {/* ================= Phase 2–3: under each option (drawn before the menu, so a load dropping in
          comes out from behind its option) ================= */}
      {/* AH: the packet, then the bag */}
      {ahPkt > 0.001 ? (
        <div style={{ position: 'absolute', left: COL[0] - PKT_W / 2, top: PKT_Y, transform: `scale(${0.9 + 0.1 * ahPkt})`, transformOrigin: '50% 50%' }}>
          <IpPacket height={PKT_H} show={ahPkt} blocks={pktBlocks({ headerCheck: ahChecks.header, payloadCheck: ahChecks.payload, cipher: 0, glowPayload: ahEye })} />
          <RoundBadge icon="eye" tone={C.amber} p={ahEye} size={64} style={{ position: 'absolute', left: PKT_W - 40, top: PKT_H - 26 }} />
        </div>
      ) : null}
      {bagShow > 0.001 ? (
        <div style={{ position: 'absolute', left: COL[0] - bag.w / 2, top: FLOOR_Y - bag.h, transform: `scale(${0.92 + 0.08 * bagShow})`, transformOrigin: '50% 100%' }}>
          <SealBag width={BAG_W} show={bagShow} load={bagLoad} seal={bagSeal} broken={bagBroken} dim={ahDim} glow={0.4 * windowWeight(frame, at.ve - 4, s06.from, { ramp: 10 })} />
          {/* «todo el mundo ve lo que lleva» */}
          <RoundBadge icon="eye" tone={C.amber} p={eyes} size={66} style={{ position: 'absolute', left: -118, top: bag.h * 0.56 }} />
          <RoundBadge icon="eye" tone={C.amber} p={progress(frame, at.ve + 2, 14)} size={66} style={{ position: 'absolute', left: bag.w + 52, top: bag.h * 0.56 }} />
          <RoundBadge icon="eye" tone={C.amber} p={progress(frame, at.ve + 8, 14)} size={66} style={{ position: 'absolute', left: bag.w + 18, top: bag.h * 0.2 }} />
        </div>
      ) : null}

      {/* ESP: the packet, then the box */}
      {espPkt > 0.001 ? (
        <div style={{ position: 'absolute', left: COL[1] - PKT_W / 2, top: PKT_Y, transform: `scale(${0.9 + 0.1 * espPkt})`, transformOrigin: '50% 50%' }}>
          <IpPacket height={PKT_H} show={espPkt} blocks={pktBlocks({ headerCheck: espChecks, payloadCheck: espChecks, cipher: espCipher })} />
        </div>
      ) : null}
      {boxShow > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: COL[1] - box.w / 2,
            top: FLOOR_Y - box.h,
            transform: `scale(${0.92 + 0.08 * boxShow})`,
            transformOrigin: '50% 100%',
            // The load drops in from under the ESP card, never through it.
            clipPath: `inset(${TILE_BOTTOM - (FLOOR_Y - box.h)}px -200px -60px -200px)`,
          }}
        >
          <SealedBox width={BOX_W} show={boxShow} load={boxLoad} lid={boxLid} seal={boxSeal} glow={0.5 * windowWeight(frame, boxAt, boxAt + 50, { ramp: 8 }) + 0.4 * windowWeight(frame, at.usa - 4, at.usa + 80, { ramp: 10 })} />
        </div>
      ) : null}

      {/* ================= Phase 2–3: the protocol menu, over the objects ================= */}
      {bracket > 0.001 ? (
        <svg width={W} height={TILE_Y + 4} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <path
            d={`M ${W / 2} 80 L ${W / 2} ${BRACKET_Y} M ${COL[0]} ${TILE_Y + 2} L ${COL[0]} ${BRACKET_Y} L ${COL[1]} ${BRACKET_Y} L ${COL[1]} ${TILE_Y + 2}`}
            fill="none"
            stroke={alpha(C.cyan, 0.75)}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - bracket}
          />
        </svg>
      ) : null}
      {tiles > 0.001 ? (
        <>
          <div style={{ position: 'absolute', left: COL[0] - TILE_W / 2, top: TILE_Y }}>
            <TermCard
              term={S06.ah.term}
              p={tiles}
              size={58}
              width={TILE_W}
              glow={Math.max(ahNameGlow, 0.5 * windowWeight(frame, ahAt + 10, s06.from, { ramp: 12 }))}
              dim={ahDim}
              lines={[
                {
                  p: ahPart1,
                  size: 36,
                  color: C.textStrong,
                  text: (
                    <>
                      {S06.ah.parts[0]}
                      <span style={{ opacity: ahPart2, color: '#fcd34d' }}>
                        {S06.sep}
                        {S06.ah.parts[1]}
                      </span>
                    </>
                  ),
                },
              ]}
            />
          </div>
          <div style={{ position: 'absolute', left: COL[1] - TILE_W / 2, top: TILE_Y }}>
            <TermCard
              term={S06.esp.term}
              p={tiles}
              size={58}
              width={TILE_W}
              glow={Math.max(espGlow, 0.5 * espFocus)}
              dim={0.45 * (1 - espFocus)}
              lines={[
                {
                  p: espPart1,
                  size: 36,
                  color: C.textStrong,
                  text: (
                    <>
                      {S06.esp.parts[0]}
                      <span style={{ opacity: espPart2, color: '#6ee7b7' }}>
                        {S06.sep}
                        {S06.esp.parts[1]}
                      </span>
                    </>
                  ),
                },
              ]}
            />
          </div>
        </>
      ) : null}

      {/* ================= The console (on top: it folds into the menu's head) ================= */}
      <div style={{ position: 'absolute', left: conX, top: conY, opacity: panelIn }}>
        <ConfigConsole
          title={S06.consoleTitle}
          lines={S06.config}
          appear={appear}
          focus={lineFocus}
          collapse={collapse}
          caret={caret}
          width={CON.w}
          compactWidth={CON.compactW}
          size={36}
          glow={0.6 * windowWeight(frame, configAt, at.protocolo, { ramp: 10 }) + 0.5 * windowWeight(frame, ahAt, ahAt + 40, { ramp: 10 })}
          valueGlow={clamp01(valueGlow)}
        />
      </div>
    </Stage>
  );
}

/** A payload's content in the «any IP packet» row: what it carries (mail, a file, the web). */
function IconTile({ icon }: { icon: IconName }) {
  return <Icon name={icon} size={54} color={C.text} strokeWidth={2} />;
}
