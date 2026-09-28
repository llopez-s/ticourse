import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, fadeIn, progress, pulse } from '../../../engine/src/theme/motion';
import { Caps, CANON, KEY_COLOR } from './parts/s05-cert/bits';
import { C2Node, CERT_H, CERT_KEY_TILE, CERT_SHA1_POS, CertCard, COL_W, NODE_DOMAIN_POS, NODE_H } from './parts/s05-cert/CertCard';
import { KeyDoors } from './parts/s05-cert/Doors';
import { PHISH_POS, PdnsConsole, CONSOLE_Y } from './parts/s05-cert/PdnsConsole';
import { BAR_H, BAR_VALUE_X, RIGHT_X, ResultTiles, ScanField, SearchBar, TILE_H, TILE_W, TILES_MID, TILES_Y, tileX, type TileState } from './parts/s05-cert/Scan';
import { SameKey } from './parts/s05-cert/SameKey';
import { Stage, segment, wordFrame } from './kit';

const SCENE = 's05-cert';

// Docked layout: the C2 column on the left (kept left of the intercept card's band).
const NODE_DOCK = { x: 0, y: 172 };
const CERT_DOCK = { x: 0, y: NODE_DOCK.y + NODE_H + 12 };
// Hero layout for s05-01: the C2 presents its certificate, centred and larger.
const HERO_SCALE = 1.15;
const HERO_MID_Y = 330;
const CERT_HERO = { x: 984, y: HERO_MID_Y - Math.round((CERT_H * HERO_SCALE) / 2) };
const NODE_HERO = { x: 238, y: HERO_MID_Y - Math.round((NODE_H * HERO_SCALE) / 2) };

/**
 * s05-cert «La llave hecha a mano». The C2 presents a self-signed certificate
 * made to measure (CN=updatesvc, no CA). Like a hand-made key, it gives the
 * actor away: its fingerprint, searched over Internet scan data, shows up on
 * three IPs — the shared block, a server of his own (141.98.6.10) and one kept
 * redacted. Passive DNS of that server shows the phishing portal against
 * Meridian: C2 and phishing share the same key, a strong clue of one owner.
 * The two other neighbours stay redacted for Lab 3A.
 */
export function S05Cert(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s1 = segment(props, 's05-01');
  const s2 = segment(props, 's05-02');
  const s4 = segment(props, 's05-04');
  const s5 = segment(props, 's05-05');
  const s6 = segment(props, 's05-06');

  const fp = props.cue('fp');
  const scan = props.cue('scan');
  const hits = props.cue('hits');
  const dedicated = props.cue('dedicated-ip');
  const phish = props.cue('phish-link');
  const redacted = props.cue('redacted');

  const wAuto = wordFrame(SCENE, 's05-01', 'autofirmado');
  const wAuthority = wordFrame(SCENE, 's05-01', 'autoridad');
  const wGives = wordFrame(SCENE, 's05-02', 'delata');
  const wKey = wordFrame(SCENE, 's05-02', 'llave');
  const wOther = wordFrame(SCENE, 's05-02', 'otra');
  const wAlmost = wordFrame(SCENE, 's05-02', 'casi');
  const wPrint = wordFrame(SCENE, 's05-03', 'huella');
  const wCode = wordFrame(SCENE, 's05-03', 'código');
  const wScans = wordFrame(SCENE, 's05-03', 'escaneos');
  const wAsk = wordFrame(SCENE, 's05-05', 'preguntas');
  const wPhishing = wordFrame(SCENE, 's05-05', 'phishing');
  const wSameKey = wordFrame(SCENE, 's05-06', 'llave');
  const wClue = wordFrame(SCENE, 's05-06', 'pista');

  const nodeIn = progress(frame, 0, 18);
  // Hero, then docked to the left before the intercept card arrives at the end of s05-01.
  const dock = progress(frame, s1.to - 26, 22, EASE.inOut);
  const lerp2 = (a: { x: number; y: number }, b: { x: number; y: number }) => ({ x: a.x + (b.x - a.x) * dock, y: a.y + (b.y - a.y) * dock });
  const nodePos = lerp2(NODE_HERO, NODE_DOCK);
  const certPos = lerp2(CERT_HERO, CERT_DOCK);
  const scale = HERO_SCALE + (1 - HERO_SCALE) * dock;

  // Doors (s05-02) — the key leaves its tile while they are on screen.
  const doorsOut = s2.to - 14;
  const keyAway = frame >= wKey && frame < doorsOut + 12;

  // Emphasis on the certificate.
  const certIn = progress(frame, fp, 14);
  const autoP = progress(frame, wAuto, 10);
  const noCaP = progress(frame, wAuthority - 4, 10);
  const noCaGlow = progress(frame, wAuthority, 10) * (1 - progress(frame, s1.to, 24));
  const keyGlow = Math.max(
    progress(frame, wGives, 10) * (1 - progress(frame, wKey, 10)) * (0.6 + 0.4 * pulse(frame, fps, 0.7)),
    progress(frame, hits + 8, 10) * (1 - progress(frame, hits + 40, 30)),
    progress(frame, wSameKey - 16, 10) * (1 - progress(frame, wSameKey + 40, 30)),
  );
  const huella = progress(frame, scan + 4, 12) * (1 - 0.55 * progress(frame, hits + 20, 30));
  const certGlow = progress(frame, fp, 12) * (1 - progress(frame, s1.to - 10, 30));
  const nodeGlow = Math.max(
    fadeIn(frame, 0, 18) * 0.3 * (1 - dock),
    progress(frame, s6.from, 10) * (1 - progress(frame, s6.from + 40, 30)),
  );

  // Scan search (s05-03).
  const barOpacity = fadeIn(frame, scan, 12) * (1 - progress(frame, s6.from, 12, EASE.inOut));
  const huellaGlow = progress(frame, wPrint - 4, 10) * (1 - 0.6 * progress(frame, hits, 20));
  const defP = progress(frame, wCode, 12);
  const status: 0 | 1 | 2 = frame < wScans ? 0 : frame < hits ? 1 : 2;
  const printFly = progress(frame, wPrint, 24, EASE.inOut);
  const printFrom = { x: CERT_DOCK.x + CERT_SHA1_POS.x, y: CERT_DOCK.y + CERT_SHA1_POS.y };
  const printTo = { x: RIGHT_X + BAR_VALUE_X, y: (BAR_H - 4 - 42) / 2 };

  // Hits (s05-03/04).
  const tileP = (i: number) => progress(frame, hits + i * 4, 12);
  const rise = progress(frame, s5.from - 4, 18, EASE.inOut);
  const tilesY = TILES_MID + (TILES_Y - TILES_MID) * rise;
  const keysGlow = Math.max(progress(frame, hits + 8, 10) * (1 - progress(frame, hits + 40, 30)), progress(frame, wSameKey - 16, 10) * (1 - progress(frame, wSameKey + 40, 30)));
  const late = 0.35 * progress(frame, s6.from, 20);
  const tiles: [TileState, TileState, TileState] = [
    {
      p: tileP(0),
      hl: progress(frame, s4.from, 12) * (1 - 0.65 * progress(frame, dedicated, 16)),
      dim: Math.max(0.55 * progress(frame, dedicated, 16), late),
      keyGlow: keysGlow,
      tagP: progress(frame, hits + 4, 10),
    },
    {
      p: tileP(1),
      hl: progress(frame, dedicated, 12) * (1 - 0.45 * progress(frame, s6.from, 20)),
      dim: late,
      keyGlow: keysGlow,
      tagP: progress(frame, dedicated, 12),
    },
    {
      p: tileP(2),
      hl: 0,
      dim: Math.max(0.35 * progress(frame, dedicated, 16), late),
      keyGlow: keysGlow,
      tagP: tileP(2),
    },
  ];

  // Passive DNS (s05-05) and the shared key (s05-06).
  const phishGlow = Math.max(
    0.55 * progress(frame, phish, 12),
    progress(frame, wPhishing, 8) * (1 - progress(frame, wPhishing + 20, 20)),
    progress(frame, s6.from, 10) * (1 - progress(frame, s6.from + 40, 30)),
  );
  const askLink = progress(frame, s5.from + 14, 12, EASE.inOut);
  const vpsX = tileX(1) + TILE_W / 2;

  return (
    <Stage>
      {/* s05-01 hero: the C2 presents its certificate. */}
      {dock < 1 ? (
        <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: (1 - dock) * certIn }}>
          <line
            x1={NODE_HERO.x + COL_W * HERO_SCALE + 8}
            y1={HERO_MID_Y}
            x2={NODE_HERO.x + COL_W * HERO_SCALE + 8 + (CERT_HERO.x - NODE_HERO.x - COL_W * HERO_SCALE - 16) * certIn}
            y2={HERO_MID_Y}
            stroke={alpha(C.sky, 0.8)}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray="12 10"
            strokeDashoffset={-frame * 0.8}
          />
        </svg>
      ) : null}
      {dock < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: NODE_HERO.x + COL_W * HERO_SCALE,
            width: CERT_HERO.x - NODE_HERO.x - COL_W * HERO_SCALE,
            top: HERO_MID_Y - 48,
            display: 'flex',
            justifyContent: 'center',
            opacity: (1 - dock) * fadeIn(frame, fp + 8, 12),
          }}
        >
          <Caps color={C.sky}>presenta</Caps>
        </div>
      ) : null}

      <div style={{ position: 'absolute', left: nodePos.x, top: nodePos.y, transform: `translateY(${(1 - nodeIn) * 18}px) scale(${scale})`, transformOrigin: '0 0', opacity: nodeIn }}>
        <C2Node glow={nodeGlow} />
      </div>
      {frame >= fp ? (
        <div
          style={{
            position: 'absolute',
            left: certPos.x,
            top: certPos.y,
            transform: `translateX(${(1 - certIn) * -40}px) scale(${scale})`,
            transformOrigin: '0 0',
            opacity: certIn,
          }}
        >
          <CertCard glow={certGlow} keyGlow={keyGlow} autoP={autoP} noCaP={noCaP} noCaGlow={noCaGlow} huella={huella} hideKey={keyAway} />
        </div>
      ) : null}

      {/* s05-02: the key metaphor, below the intercept card. */}
      <KeyDoors
        frame={frame}
        t={{ doorsAt: s2.from + 16, keyAt: wKey, openA: wKey + 22, moveAt: wOther - 4, ownerAt: wAlmost, outAt: doorsOut }}
        keyFrom={{ x: CERT_DOCK.x + CERT_KEY_TILE.x + CERT_KEY_TILE.size / 2, y: CERT_DOCK.y + CERT_KEY_TILE.y + CERT_KEY_TILE.size / 2 }}
      />

      {/* s05-03: search the fingerprint over Internet scan data. */}
      {frame >= scan ? <SearchBar opacity={barOpacity} huellaGlow={huellaGlow} defP={defP} status={status} /> : null}
      {frame >= wPrint && barOpacity > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: printFrom.x + (printTo.x - printFrom.x) * printFly,
            top: printFrom.y + (printTo.y - printFrom.y) * printFly - Math.sin(Math.PI * printFly) * 40,
            fontFamily: FONT.mono,
            fontSize: 32,
            fontWeight: 700,
            lineHeight: 1.3,
            color: '#6ee7b7',
            whiteSpace: 'nowrap',
            opacity: Math.min(fadeIn(frame, wPrint, 6), printFly >= 1 ? barOpacity : 1),
            textShadow: printFly < 1 ? `0 0 18px ${alpha(KEY_COLOR, 0.7)}` : undefined,
          }}
        >
          {CANON.sha1}
        </div>
      ) : null}
      <ScanField frame={frame} showAt={scan + 20} sweepAt={wScans} hits={hits} />
      <ResultTiles frame={frame} y={tilesY} states={tiles} />

      {/* s05-05: ask the listín about the dedicated server. */}
      <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        {askLink > 0 ? (
          <line
            x1={vpsX}
            y1={tilesY + TILE_H + 2}
            x2={vpsX}
            y2={tilesY + TILE_H + 2 + (CONSOLE_Y - tilesY - TILE_H - 2) * askLink}
            stroke={C.emerald}
            strokeWidth={4}
            strokeLinecap="round"
          />
        ) : null}
      </svg>
      <PdnsConsole frame={frame} fps={fps} t={{ openAt: s5.from + 10, cmdAt: wAsk, resultAt: phish, lockAt: redacted }} phishGlow={phishGlow} />

      {/* s05-06: same key, strong clue of one owner. */}
      <SameKey
        frame={frame}
        t={{ liftAt: s6.from + 4, keyAt: wSameKey, clueAt: wClue }}
        c2From={{ x: NODE_DOCK.x + NODE_DOMAIN_POS.x, y: NODE_DOCK.y + NODE_DOMAIN_POS.y }}
        phishFrom={PHISH_POS}
        keyFrom={{ x: CERT_DOCK.x + CERT_KEY_TILE.x + CERT_KEY_TILE.size / 2, y: CERT_DOCK.y + CERT_KEY_TILE.y + CERT_KEY_TILE.size / 2 }}
      />
    </Stage>
  );
}
