import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress, pulse } from '../../../engine/src/theme/motion';
import { mix, windowWeight } from '../../../engine/src/ui';
import { HOST, S02, SHOWCERTS_CMD } from '../data/s02-cadena';
import { AnchorChain, anchorChainPoints, anchorChainSize } from './parts/AnchorChain';
import { ChainTag, Leader, OptionCard, TermLabel } from './parts/s02-cadena/ChainBits';
import { SslConsole, type Lens, type SslRow } from './parts/s02-cadena/SslConsole';
import { Stage, segment, wordFrame } from './kit';

const S = 's02-cadena';
const W = 1728;

// ---- A: the console, full height, centred. B: folded to its evidence, bottom-left.
const CON_A = { x: 264, y: 4, w: 1200 } as const;
const CON_B = { x: 0, y: 370, w: 1064 } as const;
const KEEP_SCALE = 1.32;

// ---- The two options: under the think card's slot (its bottom edge is at stage y ≈ 170).
const OPT_Y = 246;

// ---- The chain: on the right, clear of the think card's right edge (stage x ≈ 1456) (B); in the middle with
// its tags (C), the deck overhanging both sides.
const CHAIN_B = { cx: 1586, top: 40, h: 590 } as const;
const CHAIN_C = { cx: 800, top: 36, h: 548 } as const;
const TAG_GAP = 58;

/**
 * s02-cadena «Un solo eslabón». Tuesday 10-11, 08:40: a console types `openssl s_client … -showcerts` and
 * OpenSSL 3 prints its verification and the certificate chain. Where to look, step by step, the rest dimmed:
 * on `one-link` the chain list with its single entry `0` (the portal's, cyan lens, the list boxed); on
 * `issuer` the `i:` line, «emisor» (sky); on `error-20` the warning, «no encuentro al emisor» (amber). In
 * s02-03 the console folds to that evidence (bottom-left) and two plain cards appear as the voice names them,
 * «raíz» and «intermedia», free under the think card's slot; on `anchor` the anchor chain appears on the right
 * with no labels and nothing decided: the leaf solid, the middle link and the anchor both dashed and equally
 * dim. On `choice` the two blink together and the cards become the think prompt's buttons; the top centre is
 * empty for the card. On `intermediate` «intermedia» lights, the cards and the console go, the chain moves to
 * the middle: INTERMEDIATE CA «Issuing CA 3 · no ha llegado» on the dashed middle link; the anchor turns solid,
 * «raíz · Confianza Global Root», the deck slides in under it on «bordo» and «ya está en tu equipo». On
 * `names`: ROOT CA, LEAF (with the portal's name), CHAIN OF TRUST and, on «trust», TRUST STORE on the deck.
 */
export function S02Cadena(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const terminalAt = props.cue('terminal');
  const chainListAt = props.cue('chain-list');
  const oneLinkAt = props.cue('one-link');
  const issuerAt = props.cue('issuer');
  const err20At = props.cue('error-20');
  const anchorAt = props.cue('anchor');
  const choiceAt = props.cue('choice');
  const answerAt = props.cue('intermediate');
  const namesAt = props.cue('names');
  const s03 = segment(props, 's02-03');

  // ---------------- The console ----------------
  const typeFrames = Math.max(24, Math.min(46, chainListAt - terminalAt - 4));
  const printFrom = chainListAt + 2;
  const step = Math.max(2, Math.min(4, Math.floor((oneLinkAt - 8 - printFrom) / S02.rows.length)));
  const rows: SslRow[] = S02.rows.map((r, i) => ({ ...r, at: printFrom + i * step }));
  const shellIn = progress(frame, 0, 12);

  const lensOne = windowWeight(frame, oneLinkAt, issuerAt, { ramp: 10, lead: 3 });
  const lensIssuer = windowWeight(frame, issuerAt, err20At, { ramp: 10, lead: 3 });
  const lensErr = windowWeight(frame, err20At, s03.from - 4, { ramp: 10, lead: 3 });
  const dimRest = progress(frame, oneLinkAt - 4, 12);
  const fold = progress(frame, s03.from, 28, EASE.inOut);
  const conOut = progress(frame, answerAt + 6, 18, EASE.inOut);

  const lenses: Lens[] = [
    { row: 's0', p: lensOne, tone: C.cyan, scale: 1.5 },
    { row: 'i0', p: lensIssuer, tone: C.sky, scale: 1.5, tag: { text: S02.tags.issuer, tone: C.sky, p: progress(frame, issuerAt + 4, 12) } },
    {
      row: 'err20',
      p: lensErr,
      tone: C.amber,
      scale: 1.5,
      tag: { text: S02.tags.error20, tone: C.amber, p: progress(frame, Math.min(w('s02-02', 'dice'), err20At + 14), 12), place: 'below' },
    },
  ];
  const lit = {
    chain: Math.max(lensOne, fold),
    s0: Math.max(lensOne, fold),
    i0: progress(frame, issuerAt, 10),
    err20: progress(frame, err20At, 10),
    err21: 0.4 * progress(frame, err20At, 10),
    code21: 0.5 * progress(frame, err20At, 10),
  };
  const conX = mix(CON_A.x, CON_B.x, fold);
  const conY = mix(CON_A.y, CON_B.y, fold);
  const conW = mix(CON_A.w, CON_B.w, fold);

  // ---------------- The two options ----------------
  const rootIn = progress(frame, w('s02-03', 'raíz') - 8, 14);
  const intIn = progress(frame, w('s02-03', 'intermedia') - 8, 14);
  const buttonMode = progress(frame, choiceAt - 4, 14);
  const choiceGlow = windowWeight(frame, choiceAt, answerAt, { ramp: 12, lead: 2 });
  const chosen = progress(frame, answerAt - 2, 12);
  const optOut = progress(frame, answerAt + 14, 14, EASE.inOut);

  // ---------------- The chain ----------------
  const chainIn = progress(frame, anchorAt - 6, 18);
  const blink = windowWeight(frame, choiceAt, answerAt, { ramp: 10, lead: 2 }) * pulse(frame - choiceAt, fps, 0.8);
  const move = progress(frame, answerAt + 6, 30, EASE.inOut);
  const anchorSolid = progress(frame, w('s02-05', 'ancla') - 4, 16);
  const deckIn = progress(frame, w('s02-05', 'bordo') - 10, 18);
  const middleTagIn = progress(frame, answerAt + 26, 14);
  const anchorTagIn = progress(frame, w('s02-05', 'raíz') - 4, 14);
  const anchorSubIn = progress(frame, w('s02-05', 'almacén') - 6, 14);
  const middlePulse = windowWeight(frame, w('s02-06', 'intermedia') - 4, w('s02-06', 'selló') - 4, { ramp: 8, lead: 0 });
  const rootTerm = progress(frame, namesAt, 14);
  const leafTerm = progress(frame, namesAt + 8, 14);
  const chainTerm = progress(frame, namesAt + 16, 14);
  const storeTerm = progress(frame, w('s02-06', 'trust') - 8, 14);

  const ch = { cx: mix(CHAIN_B.cx, CHAIN_C.cx, move), top: mix(CHAIN_B.top, CHAIN_C.top, move), h: mix(CHAIN_B.h, CHAIN_C.h, move) };
  const size = anchorChainSize(ch.h);
  const chainLeft = ch.cx - size.width / 2;
  const pts = anchorChainPoints(ch.h);
  const tagX = chainLeft + pts.anchor.right + TAG_GAP;
  const y = { anchor: ch.top + pts.anchor.y, deck: ch.top + pts.deck.y, middle: ch.top + pts.middle.y, leaf: ch.top + pts.leaf.y };

  return (
    <Stage>
      {/* ================= The console ================= */}
      {conOut < 1 ? (
        <div style={{ position: 'absolute', left: conX, top: conY, opacity: shellIn * (1 - conOut) }}>
          <SslConsole
            width={conW}
            stamp={S02.stamp}
            cmd={SHOWCERTS_CMD}
            typeAt={terminalAt}
            typeFrames={typeFrames}
            rows={rows}
            frame={frame}
            fold={fold}
            keep={S02.keep}
            keepScale={KEEP_SCALE}
            cmdScale={mix(1, 0.8, fold)}
            lit={lit}
            dimRest={dimRest}
            lenses={lenses}
            boxes={[{ from: 'chain', to: 'pemC', p: lensOne * (1 - fold), tone: C.cyan, dashed: true, width: 1060 }]}
            tags={[{ row: 'i0', text: S02.tags.issuer, tone: C.sky, p: fold }]}
          />
        </div>
      ) : null}

      {/* ================= The two options (free cards, then the think prompt's buttons) ================= */}
      {optOut < 1 ? (
        <div style={{ position: 'absolute', left: 0, width: W, top: OPT_Y, display: 'flex', justifyContent: 'center', gap: 64, opacity: 1 - optOut }}>
          <OptionCard label={S02.options.root} show={rootIn} button={buttonMode} glow={choiceGlow} chosen={-chosen} />
          <OptionCard label={S02.options.intermediate} show={intIn} button={buttonMode} glow={choiceGlow} chosen={chosen} />
        </div>
      ) : null}

      {/* ================= The anchor chain ================= */}
      {chainIn > 0.001 ? (
        <div style={{ position: 'absolute', left: chainLeft, top: ch.top + (1 - chainIn) * 20 }}>
          <AnchorChain
            height={ch.h}
            show={chainIn}
            anchor={anchorSolid}
            middle={0}
            leaf={1}
            deck={deckIn}
            blink={{ anchor: blink, middle: blink }}
          />
        </div>
      ) : null}

      {/* ================= Tags (only from the answer on) ================= */}
      {middleTagIn > 0.001 ? (
        <>
          <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={W} height={660}>
            <Leader x1={chainLeft + pts.middle.right + 10} x2={tagX - 14} y={y.middle} tone={C.sky} p={middleTagIn} dashed />
            <Leader x1={chainLeft + pts.anchor.right + 6} x2={tagX - 14} y={y.anchor} tone={C.sky} p={anchorTagIn} />
            <Leader x1={chainLeft + pts.leaf.right + 10} x2={tagX - 14} y={y.leaf} tone={C.cyan} p={leafTerm} />
            <Leader x1={chainLeft + pts.deck.left + 6} x2={chainLeft + pts.deck.left - 22} y={y.deck} tone={C.violet} p={storeTerm} />
          </svg>
          <div style={{ position: 'absolute', left: tagX, top: y.anchor }}>
            <ChainTag
              main={<span style={{ color: '#7dd3fc' }}>{S02.anchorTag.name}</span>}
              mainShow={anchorTagIn}
              sub={S02.anchorTag.sub}
              subShow={anchorSubIn}
              term={S02.names.root}
              termShow={rootTerm}
            />
          </div>
          <div style={{ position: 'absolute', left: tagX, top: y.middle }}>
            <ChainTag
              main={
                <span>
                  <span style={{ color: '#7dd3fc' }}>{S02.middleTag.name}</span>
                  <span style={{ color: C.faint }}> · </span>
                  <span style={{ color: '#fde68a' }}>{S02.middleTag.missing}</span>
                </span>
              }
              mainShow={middleTagIn}
              term={S02.middleTag.term}
              termShow={middleTagIn}
              glow={middlePulse}
              glowTone={C.amber}
            />
          </div>
          <div style={{ position: 'absolute', left: tagX, top: y.leaf }}>
            <ChainTag main={<span style={{ fontFamily: FONT.mono, fontSize: 30, color: C.cyanSoft }}>{HOST}</span>} mainShow={leafTerm} term={S02.names.leaf} termShow={leafTerm} />
          </div>
          {/* TRUST STORE on the deck, left */}
          <div style={{ position: 'absolute', left: chainLeft + pts.deck.left - 30, top: y.deck, transform: 'translate(-100%, -50%)' }}>
            <TermLabel term={S02.names.store} show={storeTerm} />
          </div>
          {/* CHAIN OF TRUST under the chain */}
          <div style={{ position: 'absolute', left: ch.cx, top: ch.top + ch.h + 16, transform: 'translateX(-50%)' }}>
            <TermLabel term={S02.names.chain} show={chainTerm} size={38} />
          </div>
          {/* A rule above CHAIN OF TRUST, as wide as the chain's deck */}
          {chainTerm > 0.001 ? (
            <div
              style={{
                position: 'absolute',
                left: chainLeft,
                top: ch.top + ch.h + 6,
                width: size.width * chainTerm,
                height: 3,
                borderRadius: 2,
                background: alpha(C.violet, 0.7),
              }}
            />
          ) : null}
        </>
      ) : null}
    </Stage>
  );
}
