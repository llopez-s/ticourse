import type { CSSProperties } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { clamp01, mix, windowWeight } from '../../../engine/src/ui';
import { S08 } from '../data/s08-hotel';
import { Launch, launchSize } from './parts/Sites';
import { mixHex } from './parts/glyphs';
import { ChoiceButton, TermCard } from './parts/s06-ah-esp/marks';
import { HOTEL_GEO as G, HotelMap } from './parts/s08-hotel/HotelMap';
import { Stage, segment, wordFrame } from './kit';

const S = 's08-hotel';
const W = 1728;

// ---- The port's remote access (a card with the launch), centred on `remote`, then on the right
const CARD = { w: 532, y: 196, x: W - 532 } as const;
const CARD_X0 = (W - CARD.w) / 2;
const CARD_CX = CARD.x + CARD.w / 2;
const LAUNCH_W = 250;
const LAUNCH_H = launchSize(LAUNCH_W).h;

// ---- The think prompt's two options, under the port's card (far from every door)
const BTN_W = 230;
const BTN_GAP = 30;
const BTN_Y = 516;

// ---- IPSec, struck, next to the door it knocks on
const IPSEC = { x: 822, y: 198 } as const;

/** Positions (0–1) of tokens that leave every `period` frames from `start`, each taking `travel` frames. */
function stream(frame: number, start: number, period: number, travel: number, max = 4): number[] {
  if (frame < start) return [];
  const out: number[] = [];
  const n = Math.floor((frame - start) / period);
  for (let k = Math.max(0, n - max); k <= n; k++) {
    const t = (frame - start - k * period) / travel;
    if (t > 0 && t < 1) out.push(t);
  }
  return out;
}

/**
 * s08-hotel «Desde un hotel».
 *   remote      «Acceso remoto del puerto» (no server name) on a card, centred, with the launch
 *               (one person, the laptop, «cliente») on «lancha».
 *   hotel       the card moves right; the hotel from above (slate: not the port's), the traveller's
 *               room lit: a person and the port's laptop, «alguien del puerto de viaje».
 *   web-only    one of the three exits opens, with a proxy right outside it; web traffic leaves
 *               through both towards the Internet; «solo deja salir web, y por un proxy» on «solo»;
 *               the open door lights on «puerta».
 *   s08-04      the laptop lights; on «Cuál» two identical buttons, «IPSec» and «TLS», under the port's
 *               card, far from every door. Hold: both glow alike; the top band stays empty; nothing
 *               says TLS, 443 or web next to either option.
 *   tls         «TLS» chosen; the tunnel leaves through the web's door and the proxy and reaches the
 *               port's card, which gains «VPN sobre TLS» (on TLS) and «· 443/tcp» (on «443», with
 *               «443» on that door); the door lights on «puerta».
 *   ipsec-blk   IPSec goes to another door and hits it on the cue (sfx «error»): rose, a cross;
 *               «IPSec» struck through by that door, with «ESP · protocolo 50» and «IKE · UDP 500 y
 *               4500» small on «protocolos». The IPSec button leaves; TLS moves to the centre.
 *   why         the web-only rule lights; the other closed door turns rose too («corta»); on «TLS» the
 *               button becomes the term TLS VPN. s08-08: the card's «VPN sobre TLS» lights on «TLS».
 *               Never «NAT».
 */
export function S08Hotel(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const remoteAt = props.cue('remote');
  const hotelAt = props.cue('hotel');
  const webAt = props.cue('web-only');
  const tlsAt = props.cue('tls');
  const blockedAt = props.cue('ipsec-blocked');
  const whyAt = props.cue('why');
  const s04 = segment(props, 's08-04');

  const at = {
    lancha: w('s08-01', 'lancha'),
    solo: w('s08-03', 'solo'),
    web: w('s08-03', 'web'),
    proxy: w('s08-03', 'proxy'),
    puerta: w('s08-03', 'puerta'),
    cual: w('s08-04', 'Cuál'),
    sirve: w('s08-04', 'sirve'),
    p443: w('s08-05', '443'),
    puerta2: w('s08-05', 'puerta'),
    protocolos: w('s08-06', 'protocolos'),
    cerrada: w('s08-06', 'cerrada'),
    solo3: w('s08-07', 'solo'),
    corta: w('s08-07', 'corta'),
    protocolos3: w('s08-07', 'protocolos'),
    tls3: w('s08-07', 'TLS'),
    tls4: w('s08-08', 'TLS'),
  };

  // ---------------- The port's card
  const card = progress(frame, Math.min(2, remoteAt), 16);
  const cardMove = progress(frame, hotelAt - 2, 30, EASE.inOut);
  const cardX = mix(CARD_X0, CARD.x, cardMove);
  // Alone at the start, the card is drawn larger; it settles to its size as it moves right.
  const cardScale = mix(1.3, 1, cardMove);
  const launch = progress(frame, at.lancha - 8, 16);
  const tlsLead = progress(frame, tlsAt + 2, 14);
  const tlsPort = progress(frame, at.p443 - 4, 12);
  const tlsRow = progress(frame, tlsAt, 16, EASE.inOut);
  const cardGlow = Math.max(windowWeight(frame, tlsAt + 40, blockedAt, { ramp: 10 }) * 0.6, windowWeight(frame, at.tls4 - 6, at.tls4 + 60, { ramp: 10 }));

  // ---------------- The hotel
  const hotel = progress(frame, hotelAt - 2, 20);
  const room = progress(frame, hotelAt + 8, 16);
  const traveller = progress(frame, hotelAt + 12, 14);
  const webOpen = progress(frame, webAt + 2, 18, EASE.inOut);
  const proxy = progress(frame, webAt + 10, 14);
  const globe = progress(frame, webAt + 16, 14);
  const webStart = Math.max(webAt + 20, at.web - 16);
  const web = stream(frame, webStart, 46, 110);
  const proxyPulse = windowWeight(frame, at.proxy - 4, at.proxy + 30, { ramp: 8 });
  const webOnly = progress(frame, at.solo - 4, 14);
  const webOnlyGlow = windowWeight(frame, Math.max(whyAt, at.solo3 - 6), at.tls3 - 20, { ramp: 10 });
  const doorGlowB = Math.max(windowWeight(frame, at.puerta - 4, s04.from + 10, { ramp: 10 }), windowWeight(frame, at.puerta2 - 6, blockedAt - 10, { ramp: 10 }));
  const laptopGlow = windowWeight(frame, s04.from, tlsAt + 30, { ramp: 12 });

  // ---------------- The question
  const buttons = progress(frame, at.cual - 6, 14);
  const holdGlow = windowWeight(frame, at.sirve + 16, s04.to, { ramp: 10 });
  const chosen = progress(frame, tlsAt, 12);
  const ipsecBtnOut = progress(frame, blockedAt + 2, 14, EASE.inOut);
  const tlsToCentre = progress(frame, blockedAt + 8, 20, EASE.inOut);
  const termIn = progress(frame, at.tls3 - 4, 16);

  // ---------------- The answer: TLS through the web's door
  // The tunnel's route draws behind its first packet.
  const tlsLine = progress(frame, tlsAt + 6, 84, EASE.linear);
  const tls = stream(frame, tlsAt + 6, 80, 84);
  const chip443 = progress(frame, at.p443 - 4, 12);

  // ---------------- IPSec: another door, closed
  const ipsecGo = progress(frame, blockedAt - 28, 28, EASE.in);
  const ipsecHit = progress(frame, blockedAt, 12, EASE.out);
  const ipsecFade = 1 - progress(frame, blockedAt + 40, 20);
  const ipsecPos = frame >= blockedAt - 28 && frame < blockedAt + 62 ? ipsecGo : undefined;
  const blockA = progress(frame, blockedAt, 8);
  const doorAGlow = windowWeight(frame, at.cerrada - 4, at.cerrada + 36, { ramp: 8 });
  const crossA = progress(frame, blockedAt + 2, 12);
  const blockC = progress(frame, at.corta - 4, 14);
  const ipsecLabel = progress(frame, blockedAt + 4, 14);
  const strike = progress(frame, blockedAt + 12, 14, EASE.inOut);
  const needs = progress(frame, at.protocolos - 4, 14);
  const needsGlow = windowWeight(frame, at.protocolos3 - 6, at.tls3 - 10, { ramp: 10 });

  const btnL = CARD_CX - BTN_GAP / 2 - BTN_W;
  const btnR = CARD_CX + BTN_GAP / 2;

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      {/* ================= The hotel (slate), its doors, the proxy, the Internet ================= */}
      {hotel > 0.001 ? (
        <HotelMap
          draw={hotel}
          room={room}
          webOpen={webOpen}
          proxy={proxy}
          proxyPulse={proxyPulse}
          globe={globe}
          web={web}
          tlsLine={tlsLine}
          tls={tls}
          ipsec={ipsecPos}
          ipsecHit={ipsecHit}
          ipsecFade={ipsecFade}
          blockA={blockA}
          crossPulse={doorAGlow}
          blockC={blockC}
          crossA={crossA}
          doorGlowB={doorGlowB}
          laptopGlow={laptopGlow}
        />
      ) : null}
      {hotel > 0.001 ? (
        <>
          <Text x={G.box.x + 28} y={G.box.y + 14} size={44} weight={860} color={C.text} p={hotel}>
            {S08.hotel}
          </Text>
          <Text x={G.room.x} y={G.room.y + G.room.h + 10} size={34} weight={800} color={C.textStrong} p={traveller}>
            {S08.traveller}
          </Text>
          <Text
            x={G.box.x + 24}
            y={G.box.y + G.box.h - 58}
            size={34}
            weight={800}
            color={mixHex(C.textStrong, '#fcd34d', webOnlyGlow)}
            p={webOnly}
            style={{ textShadow: webOnlyGlow > 0.01 ? `0 0 ${Math.round(16 * webOnlyGlow)}px ${alpha(C.amber, 0.7 * webOnlyGlow)}` : undefined }}
          >
            {S08.webOnly}
          </Text>
          <Text x={G.proxy.x} y={G.proxy.y + G.proxy.size / 2 + 12} size={32} weight={800} color={'#fcd34d'} p={proxy} anchor="center">
            {S08.proxy}
          </Text>
          <Text x={G.globe.x} y={G.globe.y + 54} size={32} weight={760} color={C.muted} p={globe} anchor="center">
            {S08.internet}
          </Text>
          {/* «443» on the web's door, inside the hotel, only once the voice says it */}
          {chip443 > 0.001 ? (
            <div
              style={{
                position: 'absolute',
                left: G.wallX - 18,
                top: G.doors.b + G.doorH / 2 + 12,
                transform: `translateX(-100%) scale(${0.9 + 0.1 * chip443})`,
                transformOrigin: '100% 0',
                opacity: chip443,
                padding: '2px 14px 4px',
                borderRadius: RADIUS.pill,
                border: `3px solid ${C.cyan}`,
                background: C.ink900,
                fontFamily: FONT.mono,
                fontSize: 32,
                fontWeight: 800,
                color: C.cyanSoft,
                whiteSpace: 'nowrap',
              }}
            >
              {S08.webPort}
            </div>
          ) : null}
        </>
      ) : null}

      {/* ================= IPSec, struck, by the closed door ================= */}
      {ipsecLabel > 0.001 ? (
        <div style={{ position: 'absolute', left: IPSEC.x, top: IPSEC.y, opacity: ipsecLabel, transform: `translateY(${(1 - ipsecLabel) * 10}px)` }}>
          <div style={{ position: 'relative', display: 'inline-block', fontSize: 52, fontWeight: 860, lineHeight: 1.1, color: C.roseSoft, whiteSpace: 'nowrap' }}>
            {S08.ipsec.term}
            <div style={{ position: 'absolute', left: -6, top: '54%', height: 6, width: `calc(${(strike * 100).toFixed(1)}% + 12px)`, background: C.rose, borderRadius: 3, boxShadow: `0 0 12px ${alpha(C.rose, 0.6)}` }} />
          </div>
          {S08.ipsec.needs.map((l) => (
            <div
              key={l}
              style={{
                marginTop: 4,
                fontSize: 32,
                fontWeight: 760,
                lineHeight: 1.18,
                color: mixHex(C.text, C.roseSoft, needsGlow),
                whiteSpace: 'nowrap',
                opacity: needs,
                transform: `translateY(${(1 - needs) * 6}px)`,
              }}
            >
              {l}
            </div>
          ))}
        </div>
      ) : null}

      {/* ================= The port's remote access ================= */}
      <div
        style={{
          position: 'absolute',
          left: cardX,
          top: CARD.y,
          width: CARD.w,
          boxSizing: 'border-box',
          padding: '16px 24px 14px',
          borderRadius: RADIUS.lg,
          border: `3px solid ${alpha(C.cyan, 0.6 + 0.4 * cardGlow)}`,
          background: `linear-gradient(180deg, ${alpha(C.cyan, 0.12)} 0%, ${alpha(C.ink900, 0.97)} 100%)`,
          boxShadow: `0 0 ${Math.round(24 + 30 * cardGlow)}px ${alpha(C.cyan, 0.2 + 0.35 * cardGlow)}`,
          opacity: card,
          transform: `translateY(${(1 - card) * 12}px) scale(${cardScale})`,
          transformOrigin: '50% 0',
        }}
      >
        <div style={{ fontSize: 36, fontWeight: 860, lineHeight: 1.15, color: C.cyanSoft, whiteSpace: 'nowrap' }}>{S08.remote}</div>
        <div style={{ height: 50 * tlsRow, overflow: 'hidden' }}>
          <div style={{ paddingTop: 6, fontSize: 34, fontWeight: 800, lineHeight: 1.15, color: C.textStrong, whiteSpace: 'nowrap', opacity: tlsLead }}>
            {S08.overTls.lead}
            <span style={{ opacity: tlsPort }}>
              {S08.sep}
              <span style={{ fontFamily: FONT.mono, fontWeight: 800, color: C.cyanSoft }}>{S08.overTls.port}</span>
            </span>
          </div>
        </div>
        {/* The launch: its row opens on «lancha», so the card is never an empty box */}
        <div style={{ height: (LAUNCH_H + 10) * launch, overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}>
            <Launch width={LAUNCH_W} show={launch} wake={0} />
          </div>
        </div>
      </div>

      {/* ================= The question: two identical options ================= */}
      <div style={{ position: 'absolute', left: btnL, top: BTN_Y, opacity: 1 - ipsecBtnOut }}>
        <ChoiceButton label={S08.choices.ipsec} show={buttons} state={-chosen} glow={holdGlow} width={BTN_W} />
      </div>
      <div style={{ position: 'absolute', left: mix(btnR, CARD_CX - BTN_W / 2, tlsToCentre), top: BTN_Y, opacity: 1 - termIn }}>
        <ChoiceButton label={S08.choices.tls} show={buttons} state={chosen} glow={holdGlow} width={BTN_W} />
      </div>
      {termIn > 0.001 ? (
        <div style={{ position: 'absolute', left: CARD_CX, top: BTN_Y - 10, transform: 'translateX(-50%)' }}>
          <TermCard term={S08.term} p={termIn} size={50} align="center" glow={windowWeight(frame, at.tls3 - 4, at.tls3 + 50, { ramp: 10 })} />
        </div>
      ) : null}
    </Stage>
  );
}

function Text({
  x,
  y,
  size,
  weight,
  color,
  p,
  anchor = 'left',
  children,
  style,
}: {
  x: number;
  y: number;
  size: number;
  weight: number;
  color: string;
  p: number;
  anchor?: 'left' | 'center';
  children: string;
  style?: CSSProperties;
}) {
  const v = clamp01(p);
  if (v <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(${anchor === 'center' ? '-50%' : '0'}, ${(1 - v) * 6}px)`,
        opacity: v,
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1.15,
        color,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
