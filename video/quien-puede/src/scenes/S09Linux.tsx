import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { Link } from './parts/Link';
import { curveBetween, curveBetweenV } from '../../../engine/src/ui/geometry';
import { Stage, wordFrame } from './kit';
import { AccountCard } from './parts/AccountCard';
import { Rotulo, SceneStamp } from './parts/Bits';
import { LINUX_CLASSES, LINUX_PARTS, OPS_GROUP } from './parts/data';
import { FolderGlyph } from './parts/FolderAcl';
import { GateBar } from './parts/Gate';
import { Pill, SoftTag, TermPill } from './parts/Labels';
import { ClassCard, DecisionSteps, LsLine, STEPS, lsBlockSpan } from './parts/Linux';
import { win } from './parts/timing';

const S = 's09-linux';
const W = STAGE.width;
const H = STAGE.height;
const LINE_SIZE = 56;
const CARD_W = 520;
const CARD_X = [0, 604, 1208] as const;
const CARD_Y = 262;
const STATES = [
  [true, true, false],
  [true, false, false],
  [false, false, false],
] as const;

/** s09's first picture: a Linux server with a copy of the partes (folder `partes/`, file `grua-04.txt`). */
function CopyHeader({ show }: { show: number }) {
  return (
    <div style={{ position: 'absolute', left: 0, top: 86, display: 'flex', alignItems: 'center', gap: 28, fontFamily: FONT.sans, opacity: show, transform: `translateY(${(1 - show) * 16}px)` }}>
      <Icon name="server" size={84} color={C.sky} strokeWidth={1.7} />
      <TermPill text="Linux" size={56} />
      <Icon name="arrowRight" size={48} color={C.faint} strokeWidth={2.4} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <FolderGlyph width={96} />
        <span style={{ fontFamily: FONT.mono, fontSize: 42, fontWeight: 800, color: C.textStrong }}>partes/</span>
      </div>
      <Icon name="arrowRight" size={48} color={C.faint} strokeWidth={2.4} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Icon name="file" size={64} color={C.cyan} strokeWidth={1.8} />
        <span style={{ fontFamily: FONT.mono, fontSize: 42, fontWeight: 800, color: C.textStrong }}>grua-04.txt</span>
      </div>
    </div>
  );
}

/** A grey entry of an extended list (the case names none of them). */
function GreyEntry({ show, bar }: { show: number; bar: number }) {
  return (
    <div style={{ width: 760, height: 76, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 18, padding: '0 22px', borderRadius: RADIUS.md, border: `2px solid ${C.ink600}`, background: alpha(C.ink850, 0.9), opacity: show, transform: `translateX(${(1 - show) * 30}px)` }}>
      <Icon name="users" size={44} color={C.cyan} />
      <div style={{ width: bar, height: 18, borderRadius: 9, background: alpha(C.muted, 0.35) }} />
      <span style={{ flex: 1 }} />
      <div style={{ width: 130, height: 40, borderRadius: 20, border: `2px solid ${alpha(C.emerald, 0.6)}`, background: alpha(C.emerald, 0.14) }} />
    </div>
  );
}

/**
 * s09-linux «Linux: dueño, grupo y el resto». Layers, each on its cues:
 *  1. `copy`, `classes`, `boxes`, `letters`: a copy of the partes on a Linux server and three class cards (dueño, grupo,
 *     resto), each with its three boxes (leer, escribir, ejecutar) that become r, w, x.
 *  2. `line`, `owner`, `group`, `rest`, `nosum`: the `ls -l` line, its three blocks opened and tied to their card, «Linux no suma».
 *  3. `steps`, `rest-hit`, `first-fit`: the three questions, walked by a token from «otra cuenta del puerto»; it stops at the first yes.
 *  4. `counter`: the owner has `---`, the group `r--`, the owner is also in the group and still does not read.
 *  5. `x-bit`, `posix`, `root`: the folder line with its x lit («entrar»), the POSIX ACL (more entries) and root.
 *  6. `compare`: Windows adds entries, Linux picks one class.
 */
export function S09Linux(props: SceneProps) {
  const frame = useCurrentFrame();
  const copyAt = props.cue('copy');
  const classesAt = props.cue('classes');
  const boxesAt = props.cue('boxes');
  const lettersAt = props.cue('letters');
  const lineAt = props.cue('line');
  const ownerAt = props.cue('owner');
  const groupAt = props.cue('group');
  const restAt = props.cue('rest');
  const nosumAt = props.cue('nosum');
  const stepsAt = props.cue('steps');
  const restHitAt = props.cue('rest-hit');
  const firstFitAt = props.cue('first-fit');
  const counterAt = props.cue('counter');
  const xbitAt = props.cue('x-bit');
  const posixAt = props.cue('posix');
  const rootAt = props.cue('root');
  const compareAt = props.cue('compare');

  const wCopy = 1 - progress(frame, lineAt - 8, 12, EASE.inOut);
  const toSteps = 1 - progress(frame, stepsAt - 8, 12, EASE.inOut);
  const wCards = progress(frame, classesAt - 4, 16) * toSteps;
  const wLine = progress(frame, lineAt - 4, 16) * toSteps;
  const wSteps = win(frame, stepsAt - 4, counterAt - 6, 14);
  const wCounter = win(frame, counterAt - 6, xbitAt - 2, 10);
  const wX = win(frame, xbitAt - 2, rootAt - 8, 12);
  const wRoot = win(frame, rootAt - 4, compareAt - 8, 12);
  const wCompare = progress(frame, compareAt - 4, 16);

  // --- layer 1/2: the cards and the line
  const cardCues = [ownerAt, groupAt, restAt];
  const stateOn = cardCues.map((c) => progress(frame, c, 14));
  const spread = progress(frame, ownerAt - 6, 30, EASE.inOut);
  const lit = cardCues.map((c, i) => {
    const next = i < 2 ? cardCues[i + 1] : nosumAt;
    return Math.max(win(frame, c - 2, next, 10), 0.35 * progress(frame, c, 12));
  });
  const lineLit = { owner: lit[0], group: lit[1], rest: lit[2] };
  const cardsOn = cardCues.map((c, i) => {
    const next = i < 2 ? cardCues[i + 1] : nosumAt;
    return win(frame, c - 2, next, 10);
  });
  const lineY = 86;

  // --- layer 3: the steps
  const s2At = Math.max(stepsAt + 30, wordFrame(S, 's09-05', 'grupo') - 10);
  const stepShow = [progress(frame, stepsAt, 14), progress(frame, s2At, 14), progress(frame, restHitAt, 14)] as const;
  const stepNo = [progress(frame, s2At - 6, 12), progress(frame, restHitAt - 6, 12)] as const;
  const token = progress(frame, s2At, 20, EASE.inOut) + progress(frame, restHitAt, 20, EASE.inOut);
  const hit = progress(frame, restHitAt + 18, 14);
  const result = progress(frame, restHitAt + 36, 14);

  // --- layer 4: the counter-example
  const c1 = progress(frame, counterAt, 14);
  const c2 = progress(frame, counterAt + 12, 14);
  const c3 = progress(frame, counterAt + 26, 14);

  // --- layer 5: folder, x and POSIX
  const xOn = progress(frame, xbitAt + 4, 14);
  const posix = progress(frame, posixAt, 16);

  // --- layer 6: root
  const rootIn = progress(frame, rootAt, 16);
  const comfort = progress(frame, Math.max(rootAt + 40, wordFrame(S, 's09-08', 'comodidad') - 24), 16);

  return (
    <Stage>
      <SceneStamp frame={frame} />

      {/* ---------- layer 1/2: a copy of the partes, the three classes and the line ---------- */}
      {wCopy > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: wCopy }}>
          <CopyHeader show={progress(frame, 4, 16)} />
          <Rotulo weight={progress(frame, copyAt + 4, 14)} size={36} style={{ position: 'absolute', left: 0, top: 206 }}>
            <span style={{ color: C.muted, fontWeight: 700 }}>una copia de los partes</span>
          </Rotulo>
        </div>
      ) : null}

      {wLine > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: wLine }}>
          <div style={{ position: 'absolute', left: 0, top: lineY, transform: `translateY(${(1 - progress(frame, lineAt, 16)) * 14}px)` }}>
            <LsLine parts={LINUX_PARTS.file} size={LINE_SIZE} lit={lineLit} spread={spread} tailOn={1 - 0.5 * progress(frame, ownerAt, 14)} />
          </div>
          <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
            {[0, 1, 2].map((i) => {
              const sp = lsBlockSpan(LINE_SIZE, spread, i);
              const from = { x: sp.left + sp.width / 2, y: lineY + 74 };
              const to = { x: CARD_X[i] + CARD_W / 2, y: CARD_Y - 6 };
              return <Link key={i} head curve={curveBetweenV(from, to, 0.5)} color={i === 2 ? C.rose : C.cyan} width={5} draw={progress(frame, cardCues[i], 18)} opacity={0.35 + 0.65 * cardsOn[i]} />;
            })}
          </svg>
          <Rotulo weight={win(frame, nosumAt, stepsAt - 8, 14)} size={64} style={{ position: 'absolute', left: 0, right: 0, top: 588, textAlign: 'center' }}>
            Linux <span style={{ color: C.amber }}>no suma</span>
          </Rotulo>
        </div>
      ) : null}

      {wCards > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: wCards }}>
          {LINUX_CLASSES.map((c, i) => (
            <div key={c.id} style={{ position: 'absolute', left: CARD_X[i], top: CARD_Y }}>
              <ClassCard
                kind={c.id}
                word={c.word}
                sub={c.sub}
                width={CARD_W}
                show={progress(frame, classesAt + i * 8, 14)}
                boxes={progress(frame, boxesAt + i * 6, 14)}
                letters={progress(frame, lettersAt + i * 6, 14)}
                state={STATES[i]}
                stateOn={stateOn[i]}
                on={cardsOn[i]}
                tone={c.id === 'rest' && stateOn[i] > 0.5 ? C.rose : C.cyan}
              />
            </div>
          ))}
        </div>
      ) : null}

      {/* ---------- layer 3: three questions, the first yes wins ---------- */}
      {wSteps > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: wSteps }}>
          <div style={{ position: 'absolute', left: (W - STEPS.width) / 2, top: 100 }}>
            <DecisionSteps parts={LINUX_PARTS.file} show={stepShow} no={stepNo} hit={hit} result={result} token={Math.min(2, token)} tokenOn={progress(frame, stepsAt, 14)} tokenLabel={OPS_GROUP} />
          </div>
          <Rotulo weight={progress(frame, firstFitAt, 16)} size={56} style={{ position: 'absolute', left: 0, right: 0, top: 560, textAlign: 'center' }}>
            se queda con <span style={{ color: C.amber }}>la primera que encaja</span>
          </Rotulo>
        </div>
      ) : null}

      {/* ---------- layer 4: owner `---`, group `r--`: the owner does not read ---------- */}
      {wCounter > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: wCounter }}>
          <div style={{ position: 'absolute', left: 0, top: 86, opacity: c1 }}>
            <LsLine parts={LINUX_PARTS.counter} size={LINE_SIZE} lit={{ owner: c1, group: c1 * 0.7 }} spread={1} tailOn={0.5} />
          </div>
          <div style={{ position: 'absolute', left: 0, top: 282, opacity: c1, transform: `translateY(${(1 - c1) * 14}px)` }}>
            <AccountCard compact label="mant" width={330} on={c2} />
            <div style={{ marginTop: 18, fontFamily: FONT.sans, fontSize: 36, fontWeight: 750, color: C.text, whiteSpace: 'nowrap' }}>es el dueño</div>
            <div style={{ fontFamily: FONT.sans, fontSize: 36, fontWeight: 750, color: C.muted, whiteSpace: 'nowrap' }}>y también del grupo</div>
          </div>
          <div style={{ position: 'absolute', left: 430, top: 262 }}>
            <ClassCard kind="owner" word="dueño" sub="mant" width={CARD_W} show={c1} boxes={1} letters={1} state={[false, false, false]} stateOn={1} on={c2} tone={C.rose} />
          </div>
          <div style={{ position: 'absolute', left: 1000, top: 262 }}>
            <ClassCard kind="group" word="grupo" sub="mantenimiento" width={CARD_W} show={c1} boxes={1} letters={1} state={[true, false, false]} stateOn={1} dim={c3 * 0.75} />
          </div>
          <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
            <Link head curve={curveBetween({ x: 340, y: 326 }, { x: 422, y: 326 }, 0.3)} color={C.cyan} width={6} draw={c2} />
            <path d="M165 274 C 165 200, 1260 200, 1260 256" stroke={alpha(C.muted, 0.7)} strokeWidth={4} strokeDasharray="10 12" fill="none" strokeLinecap="round" opacity={c3} />
          </svg>
          <div style={{ position: 'absolute', left: 1000, top: 580, fontFamily: FONT.sans, fontSize: 36, fontWeight: 750, color: C.muted, opacity: c3, whiteSpace: 'nowrap' }}>ni se mira</div>
          <div style={{ position: 'absolute', left: 430, top: 580, opacity: c2 }}>
            <Pill text="aun así, no lee" tone={C.rose} icon="x" size={42} height={76} on={c2} />
          </div>
        </div>
      ) : null}

      {/* ---------- layer 5: the x of a folder, POSIX ACLs ---------- */}
      {wX > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: wX }}>
          <div style={{ position: 'absolute', left: 0, top: 86, ...enter(frame, xbitAt, { distance: 14, duration: 14 }) }}>
            <LsLine parts={LINUX_PARTS.dir} size={LINE_SIZE} x={xOn} lit={{}} spread={0.4} tailOn={1} />
          </div>
          <div style={{ position: 'absolute', left: 0, top: 226, opacity: xOn, transform: `translateY(${(1 - xOn) * 16}px)`, display: 'flex', alignItems: 'center', gap: 26 }}>
            <FolderGlyph width={150} tone={C.amber} glow={xOn * 0.5} />
            <div style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontFamily: FONT.mono, fontSize: 40, fontWeight: 800, color: C.textStrong }}>partes/</span>
              <span style={{ fontFamily: FONT.sans, fontSize: 58, fontWeight: 850, letterSpacing: -1, color: C.textStrong }}>
                en una carpeta, la <span style={{ fontFamily: FONT.mono, color: C.amber }}>x</span> es <span style={{ color: C.amber }}>entrar</span>
              </span>
            </div>
          </div>
          {/* more entries when one group is not enough */}
          <div style={{ position: 'absolute', left: 0, top: 440, opacity: posix, transform: `translateY(${(1 - posix) * 16}px)` }}>
            <Pill text="ACL de POSIX" tone={C.sky} icon="layers" size={44} height={72} on={posix} />
            <Rotulo weight={posix} size={46} style={{ marginTop: 18 }}>
              más entradas, <span style={{ color: C.emerald }}>cuando hace falta</span>
            </Rotulo>
          </div>
          <div style={{ position: 'absolute', left: 968, top: 426, display: 'grid', gap: 12 }}>
            <GreyEntry show={progress(frame, posixAt + 8, 14)} bar={300} />
            <GreyEntry show={progress(frame, posixAt + 20, 14)} bar={220} />
            <GreyEntry show={progress(frame, posixAt + 32, 14)} bar={260} />
          </div>
        </div>
      ) : null}

      {/* ---------- layer 6: root ---------- */}
      {wRoot > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: wRoot }}>
          <div style={{ position: 'absolute', left: 0, top: 150, opacity: rootIn, transform: `translateY(${(1 - rootIn) * 18}px)` }}>
            <div style={{ width: 640, boxSizing: 'border-box', padding: '26px 34px', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.amber, 0.85)}`, background: `linear-gradient(180deg, ${alpha(C.amber, 0.14)}, ${alpha(C.ink900, 0.96)} 70%)`, boxShadow: `0 0 ${Math.round(36 * rootIn)}px ${alpha(C.amber, 0.3)}`, fontFamily: FONT.sans }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
                <div style={{ width: 84, height: 84, borderRadius: 42, display: 'grid', placeItems: 'center', background: alpha(C.amber, 0.16), border: `3px solid ${alpha(C.amber, 0.85)}` }}>
                  <Icon name="shield" size={50} color={C.amber} strokeWidth={2} />
                </div>
                <span style={{ fontFamily: FONT.mono, fontSize: 76, fontWeight: 850, color: C.textStrong, letterSpacing: -2 }}>root</span>
              </div>
              <div style={{ marginTop: 14, fontSize: 38, fontWeight: 700, color: C.muted }}>el administrador de Linux</div>
            </div>
          </div>
          {/* three checks, jumped */}
          <div style={{ position: 'absolute', left: 760, top: 190, display: 'flex', gap: 56 }}>
            {['dueño', 'grupo', 'resto'].map((w, i) => {
              const o = progress(frame, rootAt + 14 + i * 10, 14);
              return (
                <div key={w} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: o, fontFamily: FONT.sans }}>
                  <GateBar width={150} open={o} tone={C.amber} />
                  <span style={{ fontSize: 34, fontWeight: 750, color: C.muted }}>{w}</span>
                </div>
              );
            })}
          </div>
          <Rotulo weight={progress(frame, rootAt + 30, 16)} size={64} style={{ position: 'absolute', left: 0, top: 410 }}>
            se salta <span style={{ color: C.amber }}>casi todo</span>
          </Rotulo>
          <div style={{ position: 'absolute', left: 0, top: 530, opacity: comfort, transform: `translateY(${(1 - comfort) * 14}px)` }}>
            <SoftTag text="no se trabaja como root por comodidad" tone={C.rose} size={40} />
          </div>
        </div>
      ) : null}

      {/* ---------- layer 7: compare ---------- */}
      {wCompare > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: wCompare }}>
          <div style={{ position: 'absolute', left: 0, top: 130, transform: `translateY(${(1 - wCompare) * 20}px)` }}>
            <div style={{ width: 820, height: 400, boxSizing: 'border-box', padding: '28px 36px', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.emerald, 0.7)}`, background: `linear-gradient(180deg, ${alpha(C.emerald, 0.08)}, ${alpha(C.ink900, 0.95)} 75%)`, fontFamily: FONT.sans }}>
              <TermPill text="Windows" size={50} />
              <div style={{ marginTop: 24, fontSize: 66, fontWeight: 850, letterSpacing: -1.5, color: C.textStrong }}>
                <span style={{ color: C.emerald }}>suma</span> entradas
              </div>
              <div style={{ marginTop: 30, display: 'flex', alignItems: 'center', gap: 16 }}>
                <Pill text="Lectura" tone={C.emerald} icon="eye" size={36} />
                <span style={{ fontSize: 46, fontWeight: 850, color: C.muted }}>+</span>
                <Pill text="Escritura" tone={C.emerald} size={36} />
              </div>
            </div>
          </div>
          <div style={{ position: 'absolute', left: 908, top: 130, transform: `translateY(${(1 - wCompare) * 20}px)` }}>
            <div style={{ width: 820, height: 400, boxSizing: 'border-box', padding: '28px 36px', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.cyan, 0.7)}`, background: `linear-gradient(180deg, ${alpha(C.cyan, 0.08)}, ${alpha(C.ink900, 0.95)} 75%)`, fontFamily: FONT.sans }}>
              <TermPill text="Linux" size={50} />
              <div style={{ marginTop: 24, fontSize: 66, fontWeight: 850, letterSpacing: -1.5, color: C.textStrong, whiteSpace: 'nowrap' }}>
                <span style={{ color: C.cyan }}>una sola</span> clase
              </div>
              <div style={{ marginTop: 30, display: 'flex', alignItems: 'center', gap: 16 }}>
                <Pill text="dueño" tone={C.muted} size={36} on={0} />
                <Pill text="grupo" tone={C.cyan} size={36} on={1} />
                <Pill text="resto" tone={C.muted} size={36} on={0} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </Stage>
  );
}
