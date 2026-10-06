import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, mix, windowWeight } from '../../../engine/src/ui';
import { S02, SHOWCERTS_CMD } from '../data/s02-cadena';
import { S03 } from '../data/s03-arreglo';
import { AnchorChain, anchorChainPoints, anchorChainSize } from './parts/AnchorChain';
import { ChainTag, Leader } from './parts/s02-cadena/ChainBits';
import { SslConsole, type Lens, type SslRow } from './parts/s02-cadena/SslConsole';
import { BlankCert, FileCard, LockToken, RootCard, Strip } from './parts/s03-arreglo/Cards';
import { PartyBadge } from './parts/s03-arreglo/Parties';
import { Road, Shadow, shadowHeight } from './parts/s03-arreglo/Road';
import { Stage, segment, wordFrame } from './kit';

const S = 's03-arreglo';
const W = 1728;

// ---- 1: the chain as s02 left it (middle), then small at the bottom-left under the question.
/** Must match s02's last layout (CHAIN_C in S02Cadena.tsx) so the cross-dissolve lines up. */
const CHAIN_START = { cx: 800, top: 36, h: 548 } as const;
const CHAIN_SIDE = { cx: 196, top: 300, h: 340 } as const;
const TAG_GAP = 58;
// ---- 2: V11's road (port left, shipping company right) under the intercept card and its pill.
const PORT = { x: 180, y: 385, w: 150 } as const;
const NAV = { x: 1548, y: 385, w: 150 } as const;
const ROAD = { x: 262, y: 420, w: 1204, h: 80 } as const;
const SHADOW = { x: 864, w: 130 } as const;
const PILL_TOP = 246;
// ---- 3: the two files and the portal.
const FILE_W = 186;
const FILES_TOP = 206;
const FILE_X = { cert: 540, chain: 860 } as const;
const PORTAL = { x: 1270, y: 222, w: 210 } as const;
// ---- 4/5: the console on the left, the chain (then the root card) in the right column.
const CON = { x: 0, y: 60, w: 1180, rowH: 25, outSize: 21 } as const;
const CHAIN_RIGHT = { cx: 1474, top: 112, h: 440 } as const;
const CARD = { x: 1200, y: 120, w: 524, h: 320 } as const;
// ---- 6: the chain left, glowing; the answer and the connection on the right.
const CHAIN_END = { cx: 300, top: 46, h: 520 } as const;
const END_ROAD = { x: 700, y: 330, w: 760, h: 70 } as const;
const END_BADGE = 132;

/**
 * s03-arreglo «El eslabón del medio».
 *   start      the chain as s02 left it: anchor aboard, INTERMEDIATE CA «Issuing CA 3 · no ha llegado».
 *   fix        the tags go, the chain steps down-left, «¿Cómo se arregla?» in the middle; on «NULL CIPHER»
 *              the rose pill «Vuelve NULL CIPHER» under the engine's intercept card (top centre kept clear).
 *   mitm       V11's road, port left, shipping company right; the shadow steps onto the road on «cuele» and
 *              holds up its own blank certificate on «enseña».
 *   with-whom  the shipping company's padlock rides the road — to the shadow, not the port: «cifrado, sí ·
 *              ¿con quién?».
 *   s03-03     «se arregla la cadena, no el aviso»; `two-files`: «la CA entrega dos ficheros…» with the two
 *              files and the portal; `installed`: the certificate goes into the portal, the chain file stays
 *              out (dashed), «se instaló uno», «de los despistes más comunes».
 *   rerun      the strip «09:10 · Infraestructura instala la intermedia», the chain on the right gets its
 *              middle link (it flies in, solid), the same command; `depths` the three depth lines boxed (and
 *              the three chain pieces lit in turn); `ok` the `Verify return code: 0 (ok)` lens, emerald.
 *   root       entries 0 and 1 boxed, «el servidor manda dos»; the root card grows out of the anchor:
 *              Subject = Issuer, the CA's seal pressed on «sella», «Subject = Issuer · se firma a sí misma»;
 *              «la tienes tú» on the `depth=2` line.
 *   anchor-full the card goes back into the anchor, the full chain moves left and glows emerald: «la raíz no
 *              hace falta mandarla: ya la tienes»; `wrap` the road again, and the shipping company's padlock
 *              reaches the port: «la naviera conecta». Holds.
 */
export function S03Arreglo(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const fixAt = props.cue('fix');
  const mitmAt = props.cue('mitm');
  const withWhomAt = props.cue('with-whom');
  const twoFilesAt = props.cue('two-files');
  const installedAt = props.cue('installed');
  const rerunAt = props.cue('rerun');
  const depthsAt = props.cue('depths');
  const okAt = props.cue('ok');
  const rootAt = props.cue('root');
  const fullAt = props.cue('anchor-full');
  const wrapAt = props.cue('wrap');
  const s0302 = segment(props, 's03-02');
  const s0303 = segment(props, 's03-03');

  // ---------------- 1: the question ----------------
  const tagsOut = progress(frame, fixAt, 14);
  const toSide = progress(frame, fixAt + 2, 28, EASE.inOut);
  const questionIn = progress(frame, fixAt + 6, 16) * (1 - progress(frame, mitmAt - 10, 14, EASE.inOut));
  const pill = progress(frame, w('s03-01', 'NULL') - 2, 12) * (1 - progress(frame, s0302.to - 12, 12, EASE.inOut));
  const phase1Out = progress(frame, mitmAt - 10, 16, EASE.inOut);

  // ---------------- 2: the man in the middle ----------------
  const roadIn = progress(frame, mitmAt - 4, 22, EASE.inOut);
  const badgesIn = progress(frame, mitmAt - 6, 14);
  const shadowIn = progress(frame, w('s03-02', 'cuele') - 8, 16);
  const eye = progress(frame, w('s03-02', 'cuele') + 4, 12);
  const certIn = progress(frame, w('s03-02', 'enseña') - 6, 14);
  const lockT = progress(frame, w('s03-02', 'cifra') - 4, 30, EASE.inOut);
  const lockIn = progress(frame, Math.max(withWhomAt, w('s03-02', 'cifra') - 12), 8);
  const yesIn = progress(frame, w('s03-02', 'cifra') - 2, 14);
  const whoIn = progress(frame, w('s03-02', 'con') - 6, 14);
  const phase2Out = progress(frame, s0302.to - 6, 16, EASE.inOut);

  // ---------------- 3: the two files ----------------
  const ruleIn = progress(frame, w('s03-03', 'Se') - 4, 14);
  const leadIn = progress(frame, twoFilesAt - 4, 14);
  const filesIn = progress(frame, twoFilesAt + 2, 14);
  const portalIn = progress(frame, twoFilesAt + 6, 14);
  const install = progress(frame, installedAt + 4, 26, EASE.inOut);
  const chainFileAbsent = progress(frame, installedAt + 20, 12);
  const installedIn = progress(frame, w('s03-03', 'instaló') - 6, 12);
  const commonIn = progress(frame, w('s03-03', 'uno') + 4, 14);
  const phase3Out = progress(frame, Math.min(rerunAt - 6, s0303.to - 6), 16, EASE.inOut);

  // ---------------- 4: the rerun ----------------
  const stripIn = progress(frame, rerunAt, 14);
  const conIn = progress(frame, rerunAt + 8, 16);
  const typeAt = w('s03-04', 'repites') - 6;
  const printFrom = Math.max(typeAt + 14, depthsAt - 14);
  const typeFrames = Math.max(12, Math.min(30, printFrom - 2 - typeAt));
  const step = Math.max(1, Math.min(3, Math.floor((okAt - 8 - printFrom) / S03.rows.length)));
  const rows: SslRow[] = S03.rows.map((r, i) => ({ ...r, at: printFrom + i * step }));
  const arrive = progress(frame, w('s03-04', 'intermedia') - 8, 22, EASE.out);
  const depthsBox = windowWeight(frame, depthsAt, okAt, { ramp: 8, lead: 2 });
  const okLens = windowWeight(frame, okAt, rootAt - 2, { ramp: 8, lead: 3 });
  const okLit = progress(frame, okAt - 2, 10);
  const halo = (start: number) => windowWeight(frame, start, start + 26, { ramp: 6, lead: 0 });

  // ---------------- 5: the root ----------------
  const twoBox = windowWeight(frame, rootAt, fullAt - 4, { ramp: 10, lead: 3 });
  const twoTag = progress(frame, rootAt + 6, 12) * (1 - progress(frame, fullAt - 6, 12));
  const zoom = progress(frame, w('s03-05', 'raíz') - 6, 22, EASE.inOut);
  const unzoom = progress(frame, fullAt - 4, 22, EASE.inOut);
  const cardZoom = zoom * (1 - unzoom);
  const sealPress = progress(frame, w('s03-05', 'sella') - 2, 12, EASE.out);
  const sameMark = progress(frame, w('s03-05', 'sola') - 4, 12);
  const verdictIn = progress(frame, w('s03-05', 'autofirmada') - 8, 14);
  const youTag = progress(frame, w('s03-05', 'tienes') - 8, 12) * (1 - progress(frame, fullAt - 6, 12));
  const conOut = progress(frame, fullAt - 6, 18, EASE.inOut);
  const stripOut = conOut;

  // ---------------- 6: the full chain ----------------
  const toEnd = progress(frame, fullAt + 2, 30, EASE.inOut);
  const glow = progress(frame, w('s03-06', 'falta') - 4, 20);
  const noNeedIn = progress(frame, w('s03-06', 'falta') - 2, 16);
  const endRoadIn = progress(frame, wrapAt - 4, 20, EASE.inOut);
  const endLockT = progress(frame, w('s03-06', 'naviera') - 10, 26, EASE.inOut);
  const endLockIn = progress(frame, w('s03-06', 'naviera') - 14, 8);
  const connectsIn = progress(frame, w('s03-06', 'conecta') - 6, 14);
  const connectGlow = progress(frame, w('s03-06', 'conecta') - 2, 14);

  // ---------------- The chain's place, scene-wide ----------------
  // 1: start → side; 4–5: right column; 6: end. Hidden during 2–3.
  const chainBlock1 = { cx: mix(CHAIN_START.cx, CHAIN_SIDE.cx, toSide), top: mix(CHAIN_START.top, CHAIN_SIDE.top, toSide), h: mix(CHAIN_START.h, CHAIN_SIDE.h, toSide) };
  const chainBlock2 = { cx: mix(CHAIN_RIGHT.cx, CHAIN_END.cx, toEnd), top: mix(CHAIN_RIGHT.top, CHAIN_END.top, toEnd), h: mix(CHAIN_RIGHT.h, CHAIN_END.h, toEnd) };
  const late = frame >= rerunAt - 10;
  const ch = late ? chainBlock2 : chainBlock1;
  const chainShow = late ? progress(frame, rerunAt - 2, 16) * (1 - cardZoom) : 1 - phase1Out;
  const middle = late ? arrive : 0;
  const size = anchorChainSize(ch.h);
  const chainLeft = ch.cx - size.width / 2;
  const pts = anchorChainPoints(ch.h);
  const tagX = chainLeft + pts.anchor.right + TAG_GAP;
  const yA = ch.top + pts.anchor.y;
  const yM = ch.top + pts.middle.y;

  // Root card: grows out of the anchor (in the right column), and goes back into it.
  const anchorPt = { x: ch.cx, y: yA };
  const cardCentre = { x: CARD.x + CARD.w / 2, y: CARD.y + CARD.h / 2 };
  const cardDx = (anchorPt.x - cardCentre.x) * (1 - cardZoom);
  const cardDy = (anchorPt.y - cardCentre.y) * (1 - cardZoom);

  // Shadow on the road
  const shH = shadowHeight(SHADOW.w);
  const shTop = ROAD.y + ROAD.h / 2 + 30 - shH;
  // The padlock: from the ship to the shadow's certificate
  const lockFromX = NAV.x - NAV.w / 2 - 40;
  const lockToX = SHADOW.x + 160;
  const lockX = mix(lockFromX, lockToX, lockT);
  // The end padlock: from the ship to the port
  const endPort = { x: END_ROAD.x - 20, y: END_ROAD.y + END_ROAD.h / 2 };
  const endShip = { x: END_ROAD.x + END_ROAD.w + 20, y: END_ROAD.y + END_ROAD.h / 2 };
  const endLockX = mix(endShip.x - END_BADGE / 2 - 40, endPort.x + END_BADGE / 2 + 40, endLockT);

  const lenses: Lens[] = [
    { row: 'd2', rows: ['d1', 'd0'], p: depthsBox, tone: C.sky, scale: 1.55 },
    { row: 'code0', p: okLens, tone: C.emerald, scale: 1.6, grow: 'up' },
  ];
  const lit: Record<string, number> = {
    d2: Math.max(depthsBox, youTag),
    d1: depthsBox,
    d0: depthsBox,
    code0: okLit,
    chain: twoBox,
    s0: twoBox,
    s1: twoBox,
  };

  return (
    <Stage>
      {/* ================= 1: the chain as s02 left it; the question ================= */}
      {!late && chainShow > 0.001 ? (
        <>
          <div style={{ position: 'absolute', left: chainLeft, top: ch.top }}>
            <AnchorChain height={ch.h} show={chainShow} anchor={1} middle={0} leaf={1} deck={1} />
          </div>
          {tagsOut < 1 ? (
            <div style={{ position: 'absolute', inset: 0, opacity: 1 - tagsOut }}>
              <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={W} height={660}>
                <Leader x1={chainLeft + pts.middle.right + 10} x2={tagX - 14} y={yM} tone={C.sky} p={1} dashed />
                <Leader x1={chainLeft + pts.anchor.right + 6} x2={tagX - 14} y={yA} tone={C.sky} p={1} />
              </svg>
              <div style={{ position: 'absolute', left: tagX, top: yA }}>
                <ChainTag main={<span style={{ color: '#7dd3fc' }}>{S02.anchorTag.name}</span>} sub={S02.anchorTag.sub} subShow={1} />
              </div>
              <div style={{ position: 'absolute', left: tagX, top: yM }}>
                <ChainTag
                  main={
                    <span>
                      <span style={{ color: '#7dd3fc' }}>{S02.middleTag.name}</span>
                      <span style={{ color: C.faint }}> · </span>
                      <span style={{ color: '#fde68a' }}>{S02.middleTag.missing}</span>
                    </span>
                  }
                  term={S02.middleTag.term}
                  termShow={1}
                />
              </div>
            </div>
          ) : null}
        </>
      ) : null}
      {questionIn > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: W,
            top: 372,
            textAlign: 'center',
            fontFamily: FONT.sans,
            fontSize: 66,
            fontWeight: 850,
            color: C.textStrong,
            opacity: questionIn,
            transform: `translateY(${(1 - questionIn) * 14}px)`,
          }}
        >
          {S03.question}
        </div>
      ) : null}

      {/* ================= 2: the road, the shadow, the padlock ================= */}
      {roadIn > 0.001 && phase2Out < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - phase2Out }}>
          <div style={{ position: 'absolute', left: ROAD.x, top: ROAD.y }}>
            <Road width={ROAD.w} height={ROAD.h} draw={roadIn} />
          </div>
          <div style={{ position: 'absolute', left: PORT.x, top: PORT.y, transform: 'translateX(-50%)' }}>
            <PartyBadge who="port" size={PORT.w} show={badgesIn} />
          </div>
          <div style={{ position: 'absolute', left: NAV.x, top: NAV.y, transform: 'translateX(-50%)' }}>
            <PartyBadge who="naviera" size={NAV.w} show={badgesIn} glow={0.4 * lockIn} />
          </div>
          {/* The padlock's trail and the padlock itself */}
          {lockIn > 0.001 ? (
            <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={W} height={660}>
              <line x1={lockFromX} y1={ROAD.y + ROAD.h / 2} x2={lockX} y2={ROAD.y + ROAD.h / 2} stroke={alpha(C.emerald, 0.75)} strokeWidth={5} strokeDasharray="14 10" strokeLinecap="round" opacity={lockIn} />
            </svg>
          ) : null}
          <div style={{ position: 'absolute', left: SHADOW.x - SHADOW.w / 2, top: shTop, transform: `translateY(${(1 - shadowIn) * 36}px)` }}>
            <Shadow width={SHADOW.w} show={shadowIn} eye={eye} />
          </div>
          <div style={{ position: 'absolute', left: SHADOW.x + 58, top: shTop - 4 }}>
            <BlankCert width={100} show={certIn} tilt={8} />
          </div>
          {lockIn > 0.001 ? (
            <div style={{ position: 'absolute', left: lockX - 34, top: ROAD.y + ROAD.h / 2 - 34 }}>
              <LockToken size={68} show={lockIn} />
            </div>
          ) : null}
          {/* «cifrado, sí · ¿con quién?» */}
          {yesIn > 0.001 ? (
            <div style={{ position: 'absolute', left: 0, width: W, top: 584, textAlign: 'center', fontFamily: FONT.sans, fontSize: 44, fontWeight: 850, whiteSpace: 'nowrap' }}>
              <span style={{ color: '#6ee7b7', opacity: yesIn }}>{S03.withWhom.yes}</span>
              <span style={{ color: C.faint, opacity: whoIn }}> · </span>
              <span style={{ color: '#fde68a', opacity: whoIn }}>{S03.withWhom.who}</span>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* NULL CIPHER's pill, under the engine's intercept card (as V11's S02Familias) */}
      {pill > 0.001 ? (
        <div style={{ position: 'absolute', left: W / 2, top: PILL_TOP, transform: `translateX(-50%) translateY(${(1 - pill) * 10}px)`, opacity: pill }}>
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
            {S03.nullCipher}
          </span>
        </div>
      ) : null}

      {/* ================= 3: the rule and the two files ================= */}
      {ruleIn > 0.001 && phase3Out < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - phase3Out, fontFamily: FONT.sans }}>
          <div style={{ position: 'absolute', left: 0, width: W, top: 14, textAlign: 'center', fontSize: 54, fontWeight: 880, color: C.textStrong, opacity: ruleIn, transform: `translateY(${(1 - ruleIn) * 10}px)`, whiteSpace: 'nowrap' }}>
            {S03.rule}
          </div>
          {leadIn > 0.001 ? (
            <div style={{ position: 'absolute', left: 0, width: W, top: 108, textAlign: 'center', fontSize: 36, fontWeight: 720, color: C.text, whiteSpace: 'nowrap' }}>
              <span style={{ opacity: leadIn }}>{S03.twoFiles.lead}</span>
              <span style={{ opacity: installedIn, color: C.faint }}> · </span>
              <span style={{ opacity: installedIn, color: '#fde68a', fontWeight: 820 }}>{S03.twoFiles.installed}</span>
            </div>
          ) : null}
          {/* The chain file stays out */}
          <div style={{ position: 'absolute', left: FILE_X.chain - FILE_W / 2 - 40, width: FILE_W + 80, top: FILES_TOP }}>
            <FileCard kind="chain" label={S03.files.chain} tone={C.sky} show={filesIn} absent={chainFileAbsent} width={FILE_W} />
          </div>
          {/* The portal */}
          <div style={{ position: 'absolute', left: PORTAL.x, top: PORTAL.y, transform: 'translateX(-50%)' }}>
            <PartyBadge who="port" size={PORTAL.w} show={portalIn} glow={0.5 * progress(frame, installedAt + 22, 12)} />
          </div>
          {/* The certificate file goes into the portal */}
          <div
            style={{
              position: 'absolute',
              left: mix(FILE_X.cert, PORTAL.x + PORTAL.w * 0.36, install) - (FILE_W + 80) / 2,
              width: FILE_W + 80,
              top: mix(FILES_TOP, PORTAL.y + PORTAL.w * 0.42, install),
              transform: `scale(${mix(1, 0.42, install)})`,
              transformOrigin: '50% 0',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <FileCard kind="cert" label={S03.files.cert} tone={C.cyan} show={filesIn} width={FILE_W} labelSize={mix(36, 0.1, install)} />
          </div>
          {/* «de los despistes más comunes» */}
          {commonIn > 0.001 ? (
            <div style={{ position: 'absolute', left: 0, width: W, top: 552, textAlign: 'center', fontSize: 34, fontWeight: 650, fontStyle: 'italic', color: C.muted, opacity: commonIn, transform: `translateY(${(1 - commonIn) * 8}px)` }}>
              {S03.common}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ================= 4–5: the rerun console ================= */}
      {stripIn > 0.001 && stripOut < 1 ? (
        <div style={{ position: 'absolute', left: CON.x, top: 0, opacity: 1 - stripOut }}>
          <Strip time={S03.strip.time} what={S03.strip.what} show={stripIn} size={32} />
        </div>
      ) : null}
      {conIn > 0.001 && conOut < 1 ? (
        <div style={{ position: 'absolute', left: CON.x, top: CON.y, opacity: conIn * (1 - conOut), transform: `translateY(${(1 - conIn) * 14}px)` }}>
          <SslConsole
            width={CON.w}
            stamp={S03.stamp}
            cmd={SHOWCERTS_CMD}
            typeAt={typeAt}
            typeFrames={typeFrames}
            rows={rows}
            frame={frame}
            rowH={CON.rowH}
            outSize={CON.outSize}
            lit={lit}
            dimRest={Math.max(depthsBox, okLens, twoBox, youTag) * 0.85}
            lenses={lenses}
            boxes={[
              { from: 's0', to: 'v1', p: twoBox, tone: C.cyan, width: 1010 },
            ]}
            tags={[
              { row: 'chain', text: S03.sendsTwo, tone: C.cyan, p: twoTag, x: 640 },
              { row: 'd2', text: S03.youHaveIt, tone: C.emerald, p: youTag },
            ]}
          />
        </div>
      ) : null}

      {/* ================= The chain (right column, then left and glowing) ================= */}
      {late && chainShow > 0.001 ? (
        <div style={{ position: 'absolute', left: chainLeft, top: ch.top }}>
          <AnchorChain
            height={ch.h}
            show={chainShow}
            anchor={1}
            middle={middle}
            middleShift={{ x: 200 * (1 - arrive), y: -70 * (1 - arrive) }}
            middleTilt={-26 * (1 - arrive)}
            leaf={1}
            deck={1}
            validated={glow}
            blink={{
              anchor: Math.max(halo(depthsAt), 0.8 * youTag),
              middle: Math.max(halo(depthsAt + 6), twoBox),
              leaf: Math.max(halo(depthsAt + 12), twoBox),
            }}
          />
        </div>
      ) : null}

      {/* The root card, grown out of the anchor */}
      {cardZoom > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: CARD.x,
            top: CARD.y,
            opacity: Math.min(1, cardZoom * 1.6),
            transform: `translate(${cardDx}px, ${cardDy}px) scale(${mix(0.22, 1, cardZoom)})`,
            transformOrigin: '50% 50%',
          }}
        >
          <RootCard width={CARD.w} subject={S03.rootCard.subject} issuer={S03.rootCard.issuer} verdict={S03.rootCard.verdict} verdictIn={verdictIn} seal={sealPress} sameMark={sameMark} />
        </div>
      ) : null}

      {/* ================= 6: «ya la tienes», and the shipping company connects ================= */}
      {noNeedIn > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: END_ROAD.x - 120,
            width: END_ROAD.w + 240,
            top: 72,
            textAlign: 'center',
            fontFamily: FONT.sans,
            fontSize: 42,
            fontWeight: 850,
            color: C.textStrong,
            whiteSpace: 'nowrap',
            opacity: noNeedIn,
            transform: `translateY(${(1 - noNeedIn) * 10}px)`,
          }}
        >
          {S03.noNeed}
        </div>
      ) : null}
      {endRoadIn > 0.001 ? (
        <div style={{ position: 'absolute', inset: 0 }}>
          <div style={{ position: 'absolute', left: END_ROAD.x, top: END_ROAD.y }}>
            <Road width={END_ROAD.w} height={END_ROAD.h} draw={endRoadIn} glow={0.6 * connectGlow} />
          </div>
          <div style={{ position: 'absolute', left: endPort.x, top: endPort.y - END_BADGE / 2, transform: 'translateX(-50%)' }}>
            <PartyBadge who="port" size={END_BADGE} show={progress(frame, wrapAt - 6, 14)} glow={0.6 * connectGlow} />
          </div>
          <div style={{ position: 'absolute', left: endShip.x, top: endShip.y - END_BADGE / 2, transform: 'translateX(-50%)' }}>
            <PartyBadge who="naviera" size={END_BADGE} show={progress(frame, wrapAt - 6, 14)} glow={0.6 * connectGlow} />
          </div>
          {endLockIn > 0.001 ? (
            <>
              <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={W} height={660}>
                <line x1={endShip.x - END_BADGE / 2 - 40} y1={endShip.y} x2={endLockX} y2={endShip.y} stroke={alpha(C.emerald, 0.8)} strokeWidth={5} strokeDasharray="14 10" strokeLinecap="round" opacity={endLockIn} />
              </svg>
              <div style={{ position: 'absolute', left: endLockX - 32, top: endShip.y - 32 }}>
                <LockToken size={64} show={endLockIn} />
              </div>
            </>
          ) : null}
          {connectsIn > 0.001 ? (
            <div style={{ position: 'absolute', left: END_ROAD.x - 120, width: END_ROAD.w + 240, top: 486, display: 'flex', justifyContent: 'center', opacity: connectsIn, transform: `translateY(${(1 - connectsIn) * 10}px)` }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 16, padding: '10px 28px', borderRadius: RADIUS.pill, border: `3px solid ${alpha(C.emerald, 0.8)}`, background: alpha(C.emerald, 0.12), fontFamily: FONT.sans, fontSize: 44, fontWeight: 850, color: '#6ee7b7', whiteSpace: 'nowrap' }}>
                <Icon name="check" size={44} color={C.emerald} strokeWidth={3} />
                {S03.connects}
              </span>
            </div>
          ) : null}
        </div>
      ) : null}
    </Stage>
  );
}
