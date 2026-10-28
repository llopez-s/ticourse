import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui';
import { Link } from './parts/Link';
import { curveBetween } from '../../../engine/src/ui/geometry';
import { Stage } from './kit';
import { AccountCard } from './parts/AccountCard';
import { Rotulo, SceneStamp } from './parts/Bits';
import { FOLDER_NAME, PARTES, SERVER, SUBFOLDER_NAME, type AclId } from './parts/data';
import { AclRow, FolderAcl, aclHeight, type RowFx } from './parts/FolderAcl';
import { Pill, TermPill } from './parts/Labels';
import { EntryRow, WinFrame } from './parts/Windows';
import { win } from './parts/timing';

const W = STAGE.width;
const H = STAGE.height;
const RX = 900;
const ROW_IDS: AclId[] = ['staff', 'maint', 'ops', 'svc'];

/** A card of the opening pair: «la idea» / «la forma». */
function IdeaCard({ kicker, main, tone, show, fill, children }: { kicker: string; main: string; tone: string; show: number; fill: number; children: ReactNode }) {
  return (
    <div
      style={{
        width: 820,
        height: 360,
        boxSizing: 'border-box',
        padding: '30px 38px',
        borderRadius: RADIUS.lg,
        border: `3px ${fill > 0.3 ? 'solid' : 'dashed'} ${alpha(tone, 0.35 + 0.5 * fill)}`,
        background: `linear-gradient(180deg, ${alpha(tone, 0.04 + 0.1 * fill)}, ${alpha(C.ink900, 0.9)} 75%)`,
        boxShadow: fill > 0.3 ? `0 0 ${Math.round(34 * fill)}px ${alpha(tone, 0.26 * fill)}` : undefined,
        fontFamily: FONT.sans,
        opacity: show,
      }}
    >
      <div style={{ opacity: fill, transform: `translateY(${(1 - fill) * 16}px)` }}>
        <div style={{ fontSize: 40, fontWeight: 750, color: C.muted }}>{kicker}</div>
        <div style={{ marginTop: 10, fontSize: 64, fontWeight: 850, letterSpacing: -1.5, lineHeight: 1.08, color: C.textStrong }}>{main}</div>
        <div style={{ marginTop: 34, display: 'flex', gap: 18, flexWrap: 'wrap' }}>{children}</div>
      </div>
    </div>
  );
}

/**
 * s08-windows «Windows: una lista que suma». Four layers:
 *  1. `idea` / `way`: two cards, «la idea: igual en todos los sistemas» and «la forma: depende del sistema».
 *  2. `server` .. `each`: the security window of the folder on srv-fich02 (Windows names: Modificar, Lectura; unverified
 *     on a real machine), the ACL name on the right (`acl`; the exam card sits in the top band), the list of entries
 *     (`entries`) and the anatomy of one entry (`each`).
 *  3. `two-groups` .. `heavier`: an account in two groups (generic «un grupo» / «otro grupo»: the case invents no
 *     departments) whose rows merge into a bar that adds (`sum`, `both`); then a rose «Denegar · escribir» row that weighs more.
 *  4. `sub` / `inherit`: the subfolder «2026» with the same list in grey, «heredada».
 */
export function S08Windows(props: SceneProps) {
  const frame = useCurrentFrame();
  const ideaAt = props.cue('idea');
  const wayAt = props.cue('way');
  const serverAt = props.cue('server');
  const aclAt = props.cue('acl');
  const entriesAt = props.cue('entries');
  const eachAt = props.cue('each');
  const twoAt = props.cue('two-groups');
  const sumAt = props.cue('sum');
  const bothAt = props.cue('both');
  const denyAt = props.cue('deny');
  const heavierAt = props.cue('heavier');
  const subAt = props.cue('sub');
  const inheritAt = props.cue('inherit');

  const l1 = 1 - progress(frame, serverAt - 8, 12, EASE.inOut);
  const l2 = win(frame, serverAt - 4, twoAt - 8, 14);
  const l3 = win(frame, twoAt - 4, subAt - 8, 14);
  const l4 = progress(frame, subAt - 4, 16);

  // --- layer 2
  const srvBlock = win(frame, serverAt, aclAt - 6, 10);
  const aclBlock = progress(frame, aclAt, 14);
  const entriesBlock = progress(frame, entriesAt, 14);
  const anatomy = progress(frame, eachAt, 16);
  const fx: Partial<Record<AclId, RowFx>> = {};
  ROW_IDS.forEach((id, i) => {
    const f = win(frame, entriesAt + i * 14, entriesAt + i * 14 + 44, 8);
    fx[id] = { focus: id === 'maint' ? Math.max(f, anatomy) : f * 0.8 };
  });

  // --- layer 3
  const r1 = progress(frame, twoAt + 4, 14);
  const r2 = progress(frame, twoAt + 34, 14);
  const acc = progress(frame, twoAt - 2, 14);
  const merge = progress(frame, sumAt, 24, EASE.inOut);
  const bar = progress(frame, sumAt + 8, 16);
  const result = progress(frame, bothAt, 16);
  const r3 = progress(frame, denyAt, 16);
  const heavy = progress(frame, heavierAt, 16);
  const rowY = [236, 330, 430] as const;
  const barCenter = { x: 1000, y: 321 };

  // --- layer 4
  const sub = progress(frame, subAt, 18);
  const arrow = progress(frame, subAt + 6, 18, EASE.inOut);
  const inherit = progress(frame, inheritAt, 16);

  return (
    <Stage>
      <SceneStamp frame={frame} />

      {/* ---------- layer 1: the idea and the way ---------- */}
      {l1 > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: l1 }}>
          <div style={{ position: 'absolute', left: 0, top: 150 }}>
            <IdeaCard kicker="la idea" main="igual en todos los sistemas" tone={C.cyan} show={progress(frame, 4, 12)} fill={progress(frame, ideaAt - 4, 16)}>
              <Pill text="mínimo privilegio" tone={C.cyan} size={34} />
              <Pill text="permisos a grupos" tone={C.cyan} size={34} />
            </IdeaCard>
          </div>
          <div style={{ position: 'absolute', left: 908, top: 150 }}>
            <IdeaCard kicker="la forma" main="depende del sistema" tone={C.amber} show={progress(frame, 8, 12)} fill={progress(frame, wayAt - 4, 16)}>
              <TermPill text="Windows" size={36} />
              <TermPill text="Linux" size={36} />
            </IdeaCard>
          </div>
          <div style={{ position: 'absolute', left: 864, top: 170, height: 320, borderLeft: `3px dashed ${alpha(C.muted, 0.4)}`, opacity: progress(frame, wayAt, 14) }} />
        </div>
      ) : null}

      {/* ---------- layer 2: the window and the ACL ---------- */}
      {l2 > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: l2 }}>
          <div style={{ position: 'absolute', left: 0, top: 92, ...enter(frame, serverAt, { distance: 20, duration: 16 }) }}>
            <WinFrame width={840} height={56 + 12 + aclHeight(4, false) + 12} title="Seguridad" tab="Windows" glow={win(frame, serverAt, serverAt + 40, 10)}>
              <FolderAcl entries={PARTES} server={SERVER} naming="windows" rest={false} width={800} fx={fx} style={{ position: 'relative' }} />
            </WinFrame>
          </div>

          {/* the server of files is Windows */}
          <div style={{ position: 'absolute', left: RX, top: 112, opacity: srvBlock, transform: `translateY(${(1 - srvBlock) * 14}px)`, fontFamily: FONT.sans }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
              <Icon name="server" size={72} color={C.sky} strokeWidth={1.8} />
              <TermPill text="Windows" size={64} />
            </div>
            <div style={{ marginTop: 18, fontSize: 46, fontWeight: 750, color: C.text, whiteSpace: 'nowrap' }}>el servidor de ficheros del puerto</div>
          </div>

          {/* ACL */}
          <div style={{ position: 'absolute', left: RX, top: 96, opacity: aclBlock, transform: `translateY(${(1 - aclBlock) * 14}px)` }}>
            <TermPill text="ACL" size={64} on={aclBlock} />
          </div>
          <Rotulo weight={aclBlock} size={46} style={{ position: 'absolute', left: RX, top: 218 }}>
            lista de <span style={{ color: C.cyan }}>control de acceso</span>
          </Rotulo>

          {/* a list of entries */}
          <Rotulo weight={entriesBlock} size={50} style={{ position: 'absolute', left: RX, top: 314 }}>
            una lista de <span style={{ color: C.emerald }}>entradas</span>
          </Rotulo>

          {/* the anatomy of one entry */}
          <div style={{ position: 'absolute', left: RX, top: 400, opacity: anatomy, transform: `translateY(${(1 - anatomy) * 16}px)` }}>
            <AclRow entry={PARTES[1]} width={828} naming="windows" fx={{ focus: 0.7 }} />
            <svg width={828} height={110} style={{ position: 'absolute', left: 0, top: 84, overflow: 'visible' }} aria-hidden>
              <path d="M2 8 V20 H356 V8" stroke={alpha(C.cyan, 0.9)} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M520 8 V20 H826 V8" stroke={alpha(C.emerald, 0.9)} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div style={{ position: 'absolute', left: 0, top: 124, fontFamily: FONT.sans, fontSize: 38, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap' }}>cuenta o grupo</div>
            <div style={{ position: 'absolute', right: 0, top: 124, fontFamily: FONT.sans, fontSize: 38, fontWeight: 800, color: '#6ee7b7', whiteSpace: 'nowrap' }}>lo que puede hacer</div>
          </div>
        </div>
      ) : null}

      {/* ---------- layer 3: two groups add up, a denial weighs more ---------- */}
      {l3 > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: l3 }}>
          <div style={{ position: 'absolute', left: 0, top: 96, opacity: acc, transform: `translateY(${(1 - acc) * 14}px)` }}>
            <AccountCard compact />
          </div>
          <div style={{ position: 'absolute', left: 120, top: rowY[0] }}>
            <EntryRow who="un grupo" chips={[{ text: 'Lectura', icon: 'eye' }]} width={760} show={r1} focus={merge * 0.7} />
          </div>
          <div style={{ position: 'absolute', left: 120, top: rowY[1] }}>
            <EntryRow who="otro grupo" chips={[{ text: 'Escritura', icon: 'pencil' }]} width={760} show={r2} focus={merge * 0.7} />
          </div>
          <div style={{ position: 'absolute', left: 120, top: rowY[2] }}>
            <EntryRow who="un grupo" chips={[{ text: 'Denegar · escribir', icon: 'x', tone: C.rose }]} width={760} tone={C.rose} show={r3} focus={heavy} />
          </div>
          <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
            {/* the account is in both groups */}
            <path d={`M60 196 V${rowY[0] + 38} H114`} stroke={alpha(C.cyan, 0.8)} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={r1} />
            <path d={`M60 ${rowY[0] + 38} V${rowY[1] + 38} H114`} stroke={alpha(C.cyan, 0.8)} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={r2} />
            {/* the rows merge into the bar that adds */}
            <Link head curve={curveBetween({ x: 886, y: rowY[0] + 38 }, barCenter, 0.5)} color={C.emerald} width={5} draw={merge} />
            <Link head curve={curveBetween({ x: 886, y: rowY[1] + 38 }, barCenter, 0.5)} color={C.emerald} width={5} draw={merge} />
            <Link head curve={curveBetween({ x: 886, y: rowY[2] + 38 }, { x: barCenter.x, y: barCenter.y + 50 }, 0.5)} color={C.rose} width={5} draw={r3} />
          </svg>
          {/* the bar that adds */}
          <div
            style={{
              position: 'absolute',
              left: 1000,
              top: 271,
              width: 728,
              height: 100,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 22,
              borderRadius: RADIUS.lg,
              border: `3px solid ${alpha(C.emerald, 0.85)}`,
              background: alpha(C.emerald, 0.12),
              boxShadow: `0 0 ${Math.round(30 * bar)}px ${alpha(C.emerald, 0.3 * bar)}`,
              fontFamily: FONT.sans,
              opacity: bar,
              transform: `scale(${0.94 + 0.06 * bar})`,
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: 42, fontWeight: 850, color: '#6ee7b7' }}>
              <Icon name="eye" size={42} color={C.emerald} />
              Lectura
            </span>
            <span style={{ fontSize: 52, fontWeight: 850, color: C.muted }}>+</span>
            <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: 42, fontWeight: 850, color: heavy > 0.4 ? C.faint : '#6ee7b7' }}>
              Escritura
              {heavy > 0.01 ? <span style={{ position: 'absolute', left: -6, top: '52%', height: 5, width: `calc(${heavy * 100}% + 12px)`, background: C.rose, borderRadius: 3, boxShadow: `0 0 10px ${alpha(C.rose, 0.6)}` }} /> : null}
            </span>
          </div>
          <Rotulo weight={result * (1 - heavy)} size={68} style={{ position: 'absolute', left: 1000, top: 402 }}>
            <span style={{ color: C.emerald }}>lee y escribe</span>
          </Rotulo>
          <Rotulo weight={heavy} size={68} style={{ position: 'absolute', left: 1000, top: 402 }}>
            <span style={{ color: C.roseSoft }}>lee, pero no escribe</span>
          </Rotulo>
          <Rotulo weight={heavy} size={46} style={{ position: 'absolute', left: 1000, top: 512, whiteSpace: 'normal', width: 728 }}>
            en general, la denegación explícita <span style={{ color: C.rose }}>pesa más</span>
          </Rotulo>
        </div>
      ) : null}

      {/* ---------- layer 4: the subfolder inherits ---------- */}
      {l4 > 0.01 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: l4 }}>
          <div style={{ position: 'absolute', left: 0, top: 84 }}>
            <FolderAcl entries={PARTES} width={760} naming="windows" rest={false} server={SERVER} />
          </div>
          <div style={{ position: 'absolute', left: 968, top: 84, opacity: sub, transform: `translateY(${(1 - sub) * 18}px)` }}>
            <FolderAcl entries={PARTES} name={SUBFOLDER_NAME} width={760} naming="windows" rest={false} server={`${FOLDER_NAME}\\${SUBFOLDER_NAME}`} greyAll />
          </div>
          <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} aria-hidden>
            <Link curve={curveBetween({ x: 776, y: 136 }, { x: 950, y: 136 }, 0.3)} color={C.sky} width={6} draw={arrow} />
            <path d="M936 118 L954 136 L936 154" stroke={alpha(C.sky, 0.9 * arrow)} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <Rotulo weight={inherit} size={60} tone={C.sky} style={{ position: 'absolute', left: 968, top: 530 }}>
            heredada
          </Rotulo>
          <Rotulo weight={inherit} size={34} style={{ position: 'absolute', left: 968, top: 602 }}>
            <span style={{ color: C.muted, fontWeight: 700 }}>la misma lista, hacia dentro</span>
          </Rotulo>
        </div>
      ) : null}
    </Stage>
  );
}
