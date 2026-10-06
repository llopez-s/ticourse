import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, mix, windowWeight } from '../../../engine/src/ui';
import { S05 } from '../data/s05-contrasenas';
import { FingerprintGlyph, FingerprintMachine, HashLine, RoundsGlyph, SaltGrain, hashLineSize, machineAnchors } from './parts/Fingerprint';
import { CrossBadge, LookTag, StruckNote, TermTag } from './parts/s04-huella/marks';
import { CATALOG_H, CATALOG_W, CLOCK_W, Catalog, ClockCard, TRICK_W, TrickButton, TrickCard, WrapItem } from './parts/s05-contrasenas/Bits';
import { LoginCard, PasswordDots } from './parts/s05-contrasenas/Login';
import { TWINS_COL, TWINS_DOTS_W, TWINS_HEADER_H, TWINS_ROW_H, TwinsTable, twinsTableWidth } from './parts/s05-contrasenas/TwinsTable';
import { Stage, segment, wordFrame } from './kit';

const S = 's05-contrasenas';
const W = 1728;

// ---- Phase A: sign-in (left), «solo comprobarla» and what the portal keeps (right)
const LOGIN = { x: 0, y: 110 } as const;
const FLOW_M = { x: 780, y: 200, w: 360 } as const;
const FMA = machineAnchors(FLOW_M.w);
const FLOW_INLET = { x: FLOW_M.x + FMA.inlet.x, y: FLOW_M.y + FMA.inlet.y };
const FLOW_LINE_SIZE = 40;
const FLOW_LINE = hashLineSize(S05.flow.print, FLOW_LINE_SIZE);
const FLOW_OUT = { x: 1190, y: FLOW_INLET.y - FLOW_LINE.h / 2 } as const;
const DOTS = { x: 570, y: FLOW_INLET.y - 30 } as const;
const STORE = { x: 1090, y: 432, w: 638, h: 210 } as const;
const STORED = { x: STORE.x + 26, y: STORE.y + 64 } as const;

// ---- Phase B: the two tricks
const TRICK_Y = 104;
const TRICK_X = [(W - 2 * TRICK_W - 40) / 2, (W - 2 * TRICK_W - 40) / 2 + TRICK_W + 40] as const;

// ---- Phase C: the table, low enough for the think prompt; the two buttons at the bottom
const TABLE_Y = 292;
const BUTTONS_Y = 576;

// ---- Phase D: the rounds machine (left), the two clocks (right)
const ROUNDS_M = { x: 40, y: 92, w: 420 } as const;
const CLOCKS_X = [W - 2 * CLOCK_W - 30, W - CLOCK_W] as const;
const CLOCKS_Y = 60;

/**
 * s05-contrasenas «Cómo se guarda una contraseña».
 *   login       the shipping company's sign-in screen on the portal (no readable user; the password
 *               types out as dots).
 *   compare     «el portal no necesita leer tu contraseña: solo comprobarla». s05-02: the dots go
 *               through the machine (no algorithm plate: SHA-512 is struck later); «el portal
 *               guarda: su huella», «la contraseña cifrada» struck (on «cifrada»); on «compara» a
 *               new attempt gives the same line: «coinciden: entra».
 *   tricks      «dos trucos», told in plain words with their drawings and NO names: the hopper («a
 *               cada contraseña, un dato al azar…», on «Uno») and the loop («sacar la huella miles
 *               de veces…», on «Otro»).
 *   twins       the cards become two neutral buttons; the example table «ejemplo · así no»: two
 *               accounts, the same password («la misma»), the same `7c1d…a4b0` (ringed amber).
 *   choice      the buttons glow alike. The think prompt finds the top centre empty (the table
 *               starts at y 272).
 *   salt        «un dato al azar» lights emerald; a «sal» column opens (one value per account,
 *               next to its fingerprint) and the fingerprints flip to `2f9e…11c3` / `b80a…6d57`;
 *               SALT «la sal: distinta en cada cuenta, guardada junto a su huella».
 *   catalog     the table steps left; the catalog «huellas ya calculadas» is struck: RAINBOW TABLES.
 *   clocks      the machine with its loop and counter («miles de veces seguidas») and two clocks:
 *               «quien entra: milisegundos, ni lo nota» · «quien prueba mil millones: una muralla».
 *   stretch     KEY STRETCHING · bcrypt · PBKDF2 · Argon2; not-longer: «SHA-512 a secas» struck,
 *               «más larga, casi igual de rápida».
 *   wrap        «las contraseñas se guardan» · como huellas · con sal · y despacio. Holds.
 */
export function S05Contrasenas(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  const loginAt = props.cue('login');
  const compareAt = props.cue('compare');
  const tricksAt = props.cue('tricks');
  const twinsAt = props.cue('twins');
  const choiceAt = props.cue('choice');
  const saltAt = props.cue('salt');
  const catalogAt = props.cue('catalog');
  const clocksAt = props.cue('clocks');
  const stretchAt = props.cue('stretch');
  const notLongerAt = props.cue('not-longer');
  const wrapAt = props.cue('wrap');
  const s05 = segment(props, 's05-05');

  const at = {
    contrasena: w('s05-01', 'contraseña'),
    guarda: w('s05-02', 'guarda'),
    huella: w('s05-02', 'huella'),
    cifrada: w('s05-02', 'cifrada'),
    compara: w('s05-02', 'compara'),
    entra: w('s05-02', 'entra'),
    uno: w('s05-03', 'Uno'),
    otro: w('s05-03', 'Otro'),
    mismaPass: w('s05-04', 'misma', 0),
    mismaPrint: w('s05-04', 'misma', 1),
    dato: w('s05-06', 'dato'),
    azar: w('s05-06', 'azar'),
    deja: w('s05-06', 'deja'),
    distintas: w('s05-06', 'distintas'),
    saltWord: w('s05-06', 'salt'),
    antemano: w('s05-07', 'antemano'),
    rainbow: w('s05-07', 'rainbow'),
    intento: w('s05-08', 'intento'),
    frena: w('s05-09', 'frena'),
    contrasenas: w('s05-10', 'contraseñas'),
    como: w('s05-10', 'como'),
    sal: w('s05-10', 'sal'),
    despacio: w('s05-10', 'despacio'),
  };

  // ---------------- Phase A ----------------
  const aOut = progress(frame, tricksAt - 8, 16, EASE.inOut);
  const loginIn = progress(frame, Math.min(loginAt, 6), 16);
  const typed = progress(frame, at.contrasena - 4, 18, EASE.linear);
  const press = windowWeight(frame, compareAt - 6, compareAt + 10, { ramp: 6, lead: 0 }) + windowWeight(frame, at.compara - 6, at.compara + 8, { ramp: 6, lead: 0 });
  const compareIn = progress(frame, compareAt, 16);

  // The dots go into the machine (twice: when it stores, when it compares).
  const pass1 = progress(frame, at.guarda - 10, 22, EASE.inOut);
  const pass2 = progress(frame, at.compara - 4, 18, EASE.inOut);
  const flowIn = progress(frame, at.guarda - 16, 14);
  const run = Math.max(windowWeight(frame, at.guarda + 2, at.huella + 24, { ramp: 6 }), windowWeight(frame, at.compara + 8, at.entra, { ramp: 6 }));
  const lineOut1 = progress(frame, at.huella - 8, 14);
  const toStore = progress(frame, at.huella + 6, 20, EASE.inOut);
  const lineOut2 = progress(frame, at.compara + 14, 12);
  const storeIn = progress(frame, at.huella - 2, 14);
  const notThis = progress(frame, at.cifrada - 8, 14);
  const notThisStrike = progress(frame, at.cifrada + 2, 14);
  const match = progress(frame, at.compara + 24, 12);

  // ---------------- Phase B ----------------
  const header = progress(frame, tricksAt, 14) * (1 - progress(frame, twinsAt - 12, 12));
  const slots = progress(frame, tricksAt + 6, 16);
  const card1 = progress(frame, at.uno - 10, 18);
  const card2 = progress(frame, at.otro - 10, 18);
  const cardsOut = progress(frame, twinsAt - 10, 16, EASE.inOut);

  // ---------------- Phase C ----------------
  const tableIn = progress(frame, twinsAt - 2, 16);
  const buttonsIn = progress(frame, twinsAt + 4, 16);
  const passMark = progress(frame, at.mismaPass - 2, 12);
  const printMark = progress(frame, twinsAt + 10, 12);
  const choiceGlow = windowWeight(frame, choiceAt, s05.to, { ramp: 12 });
  const salt = progress(frame, at.azar - 2, 26, EASE.inOut);
  const answer = progress(frame, at.deja - 4, 26, EASE.linear);
  const answerMark = progress(frame, at.distintas - 4, 12);
  const chosen = progress(frame, Math.max(saltAt, at.dato - 8), 14);
  const buttonsOut = progress(frame, catalogAt - 4, 16, EASE.inOut);

  // Table framing: centred (twins) → wider (salt) → stepped left and smaller (catalog).
  const aside = progress(frame, catalogAt - 2, 22, EASE.inOut);
  const tableW = twinsTableWidth(salt);
  const tableScale = mix(1, 0.8, aside);
  const tableX = mix((W - tableW) / 2, 24, aside);
  const tableY = mix(TABLE_Y, 300, aside);
  const tagX = tableX + 26 * tableScale;
  const tagY = tableY - 50 * tableScale;

  // ---------------- Phase D ----------------
  const cOut = progress(frame, clocksAt + 2, 16, EASE.inOut);
  const dIn = progress(frame, clocksAt + 8, 18);
  const dOut = progress(frame, wrapAt - 6, 16, EASE.inOut);
  const rounds = progress(frame, clocksAt + 4, 60, EASE.inOut);
  const clock1 = progress(frame, clocksAt + 10, 16);
  const clock2 = progress(frame, at.intento - 12, 16);

  // ---------------- Phase E ----------------
  const leadIn = progress(frame, Math.min(at.contrasenas, wrapAt + 12), 16);

  return (
    <Stage style={{ fontFamily: FONT.sans }}>
      {/* ================= Phase A ================= */}
      {aOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - aOut }}>
          <div style={{ position: 'absolute', left: LOGIN.x, top: LOGIN.y }}>
            <LoginCard show={loginIn} typed={typed} press={press} />
          </div>

          {/* «el portal no necesita leer tu contraseña: solo comprobarla» */}
          {compareIn > 0.001 ? (
            <div style={{ position: 'absolute', left: 580, top: 12, opacity: compareIn, transform: `translateY(${(1 - compareIn) * 10}px)` }}>
              <div style={{ fontSize: 40, fontWeight: 780, color: C.textStrong, whiteSpace: 'nowrap' }}>{S05.compare[0]}</div>
              <div style={{ fontSize: 54, fontWeight: 880, color: '#6ee7b7', whiteSpace: 'nowrap', marginTop: 2 }}>{S05.compare[1]}</div>
            </div>
          ) : null}

          {/* The flow: dots → machine → line → what the portal keeps */}
          {flowIn > 0.001 ? (
            <div style={{ position: 'absolute', inset: 0, opacity: flowIn }}>
              <div style={{ position: 'absolute', left: FLOW_M.x, top: FLOW_M.y }}>
                <FingerprintMachine width={FLOW_M.w} label={null} run={run} frame={frame} />
              </div>
              {/* The dots slide into the inlet (clipped there) */}
              <div style={{ position: 'absolute', left: 0, top: 0, width: FLOW_INLET.x, height: 660, overflow: 'hidden' }}>
                {[pass1, pass2].map((p, i) =>
                  p < 1 && (i === 0 || p > 0.001) ? (
                    <div key={i} style={{ position: 'absolute', left: mix(DOTS.x, FLOW_INLET.x + 8, p), top: DOTS.y, opacity: i === 1 ? Math.min(1, p * 4) : 1 }}>
                      <PasswordDots n={8} size={13} />
                    </div>
                  ) : null,
                )}
              </div>
              {/* The line at the outlet: first pass, then the new attempt */}
              {lineOut1 > 0.001 && toStore < 1 ? (
                <div style={{ position: 'absolute', left: mix(FLOW_OUT.x, STORED.x, toStore), top: mix(FLOW_OUT.y, STORED.y, toStore) - Math.sin(Math.PI * toStore) * 30, opacity: lineOut1 }}>
                  <HashLine value={S05.flow.print} size={FLOW_LINE_SIZE} />
                </div>
              ) : null}
              {lineOut2 > 0.001 ? (
                <div style={{ position: 'absolute', left: FLOW_OUT.x, top: FLOW_OUT.y, opacity: lineOut2, transform: `translateX(${(1 - lineOut2) * -30}px)` }}>
                  <HashLine value={S05.flow.print} size={FLOW_LINE_SIZE} mark={match} markTone={C.emerald} />
                </div>
              ) : null}

              {/* What the portal keeps */}
              {storeIn > 0.001 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: STORE.x,
                    top: STORE.y,
                    width: STORE.w,
                    height: STORE.h,
                    boxSizing: 'border-box',
                    borderRadius: RADIUS.lg,
                    border: `3px solid ${alpha(C.cyan, 0.5)}`,
                    background: alpha(C.ink900, 0.95),
                    opacity: storeIn,
                  }}
                >
                  <div style={{ position: 'absolute', left: 24, top: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Icon name="database" size={36} color={C.cyan} strokeWidth={2.2} />
                    <span style={{ fontSize: 32, fontWeight: 760, color: C.text, whiteSpace: 'nowrap' }}>{S05.flow.stores}</span>
                  </div>
                  {toStore >= 1 ? (
                    <div style={{ position: 'absolute', left: STORED.x - STORE.x, top: STORED.y - STORE.y }}>
                      <HashLine value={S05.flow.print} size={FLOW_LINE_SIZE} mark={match} markTone={C.emerald} />
                    </div>
                  ) : null}
                  <div style={{ position: 'absolute', left: STORED.x - STORE.x + FLOW_LINE.w + 18, top: STORED.y - STORE.y + 14, fontSize: 36, fontWeight: 850, color: C.cyanSoft, whiteSpace: 'nowrap', opacity: progress(frame, at.huella + 20, 12) }}>
                    {S05.flow.storesWhat}
                  </div>
                  <div style={{ position: 'absolute', left: 26, bottom: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
                    <CrossBadge size={44} p={notThisStrike} tone={C.amber} />
                    <StruckNote struck={S05.flow.notThis} p={notThis} strike={notThisStrike} size={34} />
                  </div>
                </div>
              ) : null}

              {/* «coinciden: entra» between the two lines */}
              {match > 0.001 ? (
                <div style={{ position: 'absolute', left: FLOW_OUT.x + FLOW_LINE.w + 14, top: FLOW_OUT.y + 6, opacity: match, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 26, display: 'grid', placeItems: 'center', background: alpha(C.emeraldDeep, 0.9), border: `3px solid ${C.emerald}` }}>
                    <Icon name="check" size={32} color={C.emerald} strokeWidth={3} />
                  </div>
                </div>
              ) : null}
              {match > 0.001 ? (
                <div style={{ position: 'absolute', left: FLOW_OUT.x, width: FLOW_LINE.w + 80, top: FLOW_OUT.y + FLOW_LINE.h + 12, textAlign: 'center', opacity: match, fontSize: 34, fontWeight: 820, color: '#6ee7b7', whiteSpace: 'nowrap' }}>
                  {S05.flow.match}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ================= Phase B: two tricks, no names ================= */}
      {header > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, width: W, top: 18, textAlign: 'center', opacity: header }}>
          <span style={{ fontSize: 48, fontWeight: 850, color: C.textStrong }}>dos trucos</span>
        </div>
      ) : null}
      {cardsOut < 1 ? (
        <>
          <div style={{ position: 'absolute', left: TRICK_X[0], top: TRICK_Y, opacity: 1 - cardsOut, transform: `scale(${1 - 0.15 * cardsOut})`, transformOrigin: '50% 100%' }}>
            <CardSlot n={1} show={slots * (1 - card1)} />
            <TrickCard kind="salt" lines={S05.tricks[0].lines} show={card1} frame={frame} />
          </div>
          <div style={{ position: 'absolute', left: TRICK_X[1], top: TRICK_Y, opacity: 1 - cardsOut, transform: `scale(${1 - 0.15 * cardsOut})`, transformOrigin: '50% 100%' }}>
            <CardSlot n={2} show={slots * (1 - card2)} />
            <TrickCard kind="rounds" lines={S05.tricks[1].lines} show={card2} frame={frame} />
          </div>
        </>
      ) : null}

      {/* ================= Phase C: the example table, the buttons ================= */}
      {tableIn > 0.001 && cOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - cOut }}>
          <div style={{ position: 'absolute', left: tableX, top: tableY, transform: `scale(${tableScale})`, transformOrigin: '0 0' }}>
            <TwinsTable show={tableIn} salt={salt} passMark={passMark * (1 - answer)} printMark={printMark} answer={answer} answerMark={answerMark} />
          </div>
          {/* «la misma» beside the passwords, while they are the point */}
          {passMark > 0.001 && answer < 1 ? (
            <div style={{ position: 'absolute', left: tableX + (TWINS_COL.account + 10 + TWINS_DOTS_W + 12) * tableScale, top: tableY + (TWINS_HEADER_H + TWINS_ROW_H - 22) * tableScale, opacity: passMark * (1 - answer) }}>
              <span style={{ padding: '4px 12px', borderRadius: RADIUS.sm, background: C.ink950, border: `2px solid ${C.amber}`, fontSize: 30, fontWeight: 800, color: '#fde68a', whiteSpace: 'nowrap' }}>{S05.table.same}</span>
            </div>
          ) : null}
          {/* Beside the fingerprints: «la misma huella», then «huellas distintas» */}
          {printMark > 0.001 && aside < 1 ? (
            <div style={{ position: 'absolute', left: tableX + tableW * tableScale + 14, top: tableY + (TWINS_HEADER_H + TWINS_ROW_H / 2) * tableScale, opacity: printMark * (1 - aside) }}>
              <svg width={30} height={TWINS_ROW_H} style={{ display: 'block' }}>
                <path d={`M 2 2 L 20 2 L 20 ${TWINS_ROW_H - 2} L 2 ${TWINS_ROW_H - 2}`} fill="none" stroke={answerMark > 0.5 ? C.emerald : C.amber} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', left: 34, top: TWINS_ROW_H / 2 - 40, fontSize: 32, fontWeight: 820, lineHeight: 1.15, color: answerMark > 0.5 ? '#6ee7b7' : '#fde68a', whiteSpace: 'nowrap' }}>
                <div>{answerMark > 0.5 ? S05.table.diffPrint[0] : S05.table.samePrint[0]}</div>
                <div>{answerMark > 0.5 ? S05.table.diffPrint[1] : S05.table.samePrint[1]}</div>
              </div>
            </div>
          ) : null}
          {/* The table's tag: «ejemplo · así no», then «ejemplo · con sal» */}
          <div style={{ position: 'absolute', left: tagX, top: tagY }}>
            <LookTag
              text={answer > 0.5 ? S05.table.tagAfter : S05.table.tag}
              tone={answer > 0.5 ? C.emerald : C.amber}
              p={tableIn}
              icon={answer > 0.5 ? 'check' : 'alert'}
              size={32}
            />
          </div>

          {/* The two buttons (neutral until the answer) */}
          {buttonsIn > 0.001 && buttonsOut < 1 ? (
            <div style={{ position: 'absolute', left: 0, width: W, top: BUTTONS_Y, display: 'flex', justifyContent: 'center', gap: 60, opacity: 1 - buttonsOut }}>
              <TrickButton kind="salt" label={S05.tricks[0].button} show={buttonsIn} state={chosen} glow={choiceGlow} />
              <TrickButton kind="rounds" label={S05.tricks[1].button} show={buttonsIn} state={-chosen} glow={choiceGlow} />
            </div>
          ) : null}

          {/* SALT */}
          <div style={{ position: 'absolute', left: Math.max(24, (W - twinsTableWidth(1)) / 2), top: 14 }}>
            <TermTag frame={frame} fps={fps} at={at.saltWord - 4} term={S05.salt.term} sub={S05.salt.sub} size={54} subSize={32} />
          </div>

          {/* The catalog, struck: RAINBOW TABLES */}
          {aside > 0.001 ? (
            <div style={{ position: 'absolute', left: W - CATALOG_W - 60, top: 222, opacity: aside }}>
              <Catalog title={S05.catalog.title} show={progress(frame, catalogAt + 2, 16)} strike={progress(frame, at.antemano - 6, 18, EASE.inOut)} />
              <div style={{ position: 'absolute', left: 0, width: CATALOG_W, top: CATALOG_H + 18, display: 'flex', justifyContent: 'center' }}>
                <TermTag frame={frame} fps={fps} at={at.rainbow - 4} term={S05.catalog.term} size={44} />
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* ================= Phase D: miles de veces ================= */}
      {dIn > 0.001 && dOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: dIn * (1 - dOut) }}>
          <div style={{ position: 'absolute', left: ROUNDS_M.x, top: 0, width: ROUNDS_M.w, display: 'flex', justifyContent: 'center' }}>
            <LookTag text={S05.rounds.caption} tone={C.emerald} p={dIn} glyph={<RoundsGlyph size={40} />} size={32} />
          </div>
          <div style={{ position: 'absolute', left: ROUNDS_M.x, top: ROUNDS_M.y }}>
            <FingerprintMachine width={ROUNDS_M.w} label={null} run={0.9} frame={frame} rounds={rounds} count={S05.rounds.count} countLabel={S05.rounds.countLabel} />
          </div>
          <div style={{ position: 'absolute', left: CLOCKS_X[0], top: CLOCKS_Y }}>
            <ClockCard who={S05.clocks[0].who} what={S05.clocks[0].what} tone={C.emerald} show={clock1} sweep={0.04 * progress(frame, clocksAt + 16, 20)} />
          </div>
          <div style={{ position: 'absolute', left: CLOCKS_X[1], top: CLOCKS_Y }}>
            <ClockCard who={S05.clocks[1].who} what={S05.clocks[1].what} tone={C.amber} show={clock2} sweep={Math.max(0, frame - (at.intento - 6)) / 22} wall />
          </div>
          <div style={{ position: 'absolute', left: ROUNDS_M.x, top: 432 }}>
            <TermTag frame={frame} fps={fps} at={stretchAt - 2} term={S05.stretch.term} sub={S05.stretch.sub} subAt={stretchAt + 14} size={54} subSize={36} />
          </div>
          <div style={{ position: 'absolute', left: 790, top: 462 }}>
            <StruckNote struck={S05.notLonger.struck} rest={S05.notLonger.rest} p={progress(frame, notLongerAt + 4, 14)} strike={progress(frame, at.frena - 6, 16, EASE.inOut)} size={36} />
          </div>
        </div>
      ) : null}

      {/* ================= Phase E: the wrap ================= */}
      {leadIn > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, width: W, top: 170, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 46 }}>
          <div style={{ fontSize: 52, fontWeight: 850, color: C.textStrong, opacity: leadIn, transform: `translateY(${(1 - leadIn) * 10}px)` }}>{S05.wrap.lead}</div>
          <div style={{ display: 'flex', gap: 120 }}>
            <WrapItem icon={<FingerprintGlyph size={74} tone={C.emerald} />} label={S05.wrap.items[0]} show={progress(frame, at.como - 6, 14)} />
            <WrapItem icon={<SaltGrain size={74} />} label={S05.wrap.items[1]} show={progress(frame, at.sal - 6, 14)} />
            <WrapItem icon={<Icon name="clock" size={70} color={C.emerald} strokeWidth={2} />} label={S05.wrap.items[2]} show={progress(frame, at.despacio - 6, 14)} />
          </div>
        </div>
      ) : null}
    </Stage>
  );
}

/** The empty slot of a trick card, numbered, before the voice tells it. */
function CardSlot({ n, show }: { n: number; show: number }) {
  if (show <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: TRICK_W,
        height: 420,
        boxSizing: 'border-box',
        borderRadius: 24,
        border: `3px dashed ${alpha(C.cyan, 0.4)}`,
        display: 'grid',
        placeItems: 'center',
        opacity: show,
        fontSize: 120,
        fontWeight: 850,
        color: alpha(C.cyan, 0.35),
      }}
    >
      {n}
    </div>
  );
}
