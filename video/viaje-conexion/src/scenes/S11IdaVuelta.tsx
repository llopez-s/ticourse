import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Chip } from '../../../engine/src/ui/Chip';
import { Icon } from '../../../engine/src/ui/Icon';
import { Stage, wordFrame } from './kit';
import { STAGES } from './parts/data';
import { Cronometro } from './parts/Cronometro';
import { Parcel } from './parts/Glyphs';
import { Label, LABEL_W, type BoxKey } from './parts/Label';
import { CaseStamp } from './parts/Marks';
import { PLANO, Plano, routeFraction, routePoint } from './parts/Plano';

const S = 's11-ida-vuelta';
const K = 0.7;
const VIEW = { x: Math.round((1728 - PLANO.w * K) / 2), y: 0, k: K };
const LABEL_X = Math.round((1728 - LABEL_W) / 2);
const LABEL_Y = 456;
const F_ROUTER = routeFraction('router');
const F_ISP = routeFraction('isp');
const HOPS = [routeFraction('hop1'), routeFraction('hop2'), routeFraction('hop3'), routeFraction('hop4')];
const near = (t: number, f: number, span = 0.04) => Math.max(0, 1 - Math.abs(t - f) / span);
const sp = (v: string): [string, string] => {
  const i = v.lastIndexOf(':');
  return [v.slice(0, i), v.slice(i + 1)];
};
const [OFFICE_A, OFFICE_P] = sp(STAGES.office.src);
const [OFFICE_DA, OFFICE_DP] = sp(STAGES.office.dst);
const [PUB_A, PUB_P] = sp(STAGES.router.src);

const CHIPS = ['gateway', 'regla', 'NAT', 'routing', 'puerto efímero'] as const;

/**
 * s11-ida-vuelta «Ida y vuelta». The whole plan (k = 0.7, on top) with a single packet; under it the label is
 * enlarged, one stage at a time: «en la oficina» (private address and ephemeral port to the portal's 443),
 * «tras el router» (the public address and port, written in amber), «en el portal» (the same), and on the way
 * back the label turned around, its destination going private again when the router's table undoes the
 * translation. A chip lights at each stop (gateway, regla, NAT, routing, puerto efímero); on `time` the stopwatch
 * of s01 stops again on «0,4 s».
 */
export function S11IdaVuelta(props: SceneProps) {
  const frame = useCurrentFrame();
  const startAt = props.cue('start');
  const gateAt = props.cue('gate');
  const ruleAt = props.cue('rule');
  const translateAt = props.cue('translate');
  const tripAt = props.cue('trip');
  const undoAt = props.cue('undo');
  const timeAt = props.cue('time');
  const wf = (seg: string, w: string, n = 0) => wordFrame(S, seg, w, n);
  const arriveAt = wf('s11-04', 'llega');
  const tablaAt = wf('s11-05', 'tabla');
  const ephAt = wf('s11-05', 'efímero');
  const navAt = wf('s11-05', 'navegador');

  // ---- the packet along the route (out, then back) ----
  const e = (p: number) => EASE.inOut(p);
  const dur1 = Math.max(50, tablaAt - undoAt);
  const dur2 = Math.max(60, navAt - tablaAt + 10);
  let t = 0;
  if (frame < tripAt) t = F_ROUTER * e(progress(frame, gateAt, 70, EASE.linear));
  else if (frame < undoAt) t = F_ROUTER + (1 - F_ROUTER) * e(progress(frame, tripAt, 110, EASE.linear));
  else if (frame < tablaAt) t = 1 - (1 - F_ROUTER) * e(progress(frame, undoAt, dur1, EASE.linear));
  else t = F_ROUTER * (1 - e(progress(frame, tablaAt, dur2, EASE.linear)));
  const back = frame >= undoAt;
  const p = routePoint(Math.min(0.999, Math.max(0.001, t)));
  const appear = progress(frame, 0, 14);

  // ---- glows on the plan ----
  const routerGlow = Math.max(near(t, F_ROUTER, 0.05) * (frame >= gateAt ? 1 : 0), progress(frame, ruleAt, 10) * (1 - progress(frame, tripAt, 14)) * 0.8);
  const portalGlow = progress(frame, arriveAt, 12) * (1 - progress(frame, undoAt + 20, 14)) * 0.9;
  const laptopGlow = Math.max((1 - progress(frame, gateAt, 14)) * 0.7, progress(frame, navAt, 10) * 0.9);
  const hopLit = HOPS.map((f) => (t > F_ISP - 0.01 ? near(t, f) : 0));

  // ---- label stage ----
  const phase: 'office' | 'out' | 'back' = frame < translateAt ? 'office' : frame < undoAt ? 'out' : 'back';
  const isPriv = frame >= tablaAt;
  const typeOut = progress(frame, translateAt, 24, EASE.linear);
  const typeBack = progress(frame, undoAt, 22, EASE.linear);
  const typePriv = progress(frame, tablaAt, 22, EASE.linear);
  const wAt = (w: string, n = 0) => wf('s11-01', w, n);
  const focus: BoxKey | null =
    phase !== 'office'
      ? null
      : frame >= wAt('443') - 2 && frame < gateAt
        ? 'dPort'
        : frame >= wAt('efímero') - 2
          ? 'oPort'
          : frame >= wAt('privada') - 2
            ? 'oAddr'
            : null;
  const values =
    phase === 'office'
      ? { oAddr: OFFICE_A, oPort: OFFICE_P, dAddr: OFFICE_DA, dPort: OFFICE_DP, proto: 'TCP' }
      : phase === 'out'
        ? { oAddr: PUB_A, oPort: PUB_P, dAddr: OFFICE_DA, dPort: OFFICE_DP, proto: 'TCP' }
        : { oAddr: OFFICE_DA, oPort: OFFICE_DP, dAddr: isPriv ? OFFICE_A : PUB_A, dPort: isPriv ? OFFICE_P : PUB_P, proto: 'TCP' };
  const reveal: Partial<Record<BoxKey, number>> =
    phase === 'office'
      ? { oAddr: 1, oPort: 1, dAddr: 1, dPort: 1, proto: 1 }
      : phase === 'out'
        ? { oAddr: typeOut, oPort: typeOut, dAddr: 1, dPort: 1, proto: 1 }
        : { oAddr: typeBack, oPort: typeBack, dAddr: isPriv ? typePriv : typeBack, dPort: isPriv ? typePriv : typeBack, proto: 1 };
  const tones = phase === 'office' ? undefined : phase === 'out' ? { oAddr: 'amber' as const, oPort: 'amber' as const } : { dAddr: 'amber' as const, dPort: 'amber' as const };
  const dwell: BoxKey[] | null = frame >= navAt ? ['dAddr', 'dPort'] : null;

  // ---- the title of the stage on the left of the label ----
  const titles: { at: number; text: string }[] = [
    { at: 0, text: STAGES.office.title },
    { at: translateAt, text: STAGES.router.title },
    { at: arriveAt, text: STAGES.portal.title },
    { at: undoAt, text: 'la vuelta' },
  ];
  const cur = [...titles].reverse().find((x) => frame >= x.at) ?? titles[0];
  const titleIn = enter(frame, cur.at, { distance: 14 });

  // ---- chips ----
  const chipAt = [gateAt, ruleAt, translateAt, tripAt, ephAt];
  const chipsIn = progress(frame, 0, 16);

  // ---- the little pills at the router ----
  const permitIn = progress(frame, ruleAt + 6, 12) * (1 - progress(frame, translateAt, 10));
  const noteIn = progress(frame, translateAt + 10, 12) * (1 - progress(frame, tripAt + 20, 10));
  const tableIn = progress(frame, tablaAt - 4, 12) * (1 - progress(frame, navAt - 10, 10));
  const routerStageX = VIEW.x + PLANO.router.x * K;

  // ---- the stopwatch ----
  const watch = progress(frame, timeAt - 2, 12);
  const count = progress(frame, timeAt + 4, 40, EASE.inOut);

  return (
    <>
      <Stage>
        {/* ---- the plan, one packet ---- */}
        <Plano view={VIEW} dashed={1} glow={{ laptop: laptopGlow, router: routerGlow, portal: portalGlow }} hops={hopLit} addrs={0}>
          <div style={{ position: 'absolute', left: p.x - 58, top: p.y - 44, opacity: appear }}>
            <Parcel width={116} tone={back ? 'emerald' : 'cyan'} glow={0.7} />
          </div>
        </Plano>
        {/* pills at the router */}
        <div style={{ position: 'absolute', left: routerStageX - 100, top: 86, width: 200, display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', opacity: permitIn }}>
            <Chip accent="emerald" icon="check" size={30}>
              permitir
            </Chip>
          </div>
          <div style={{ position: 'absolute', opacity: noteIn }}>
            <Chip accent="amber" size={30}>
              apuntado
            </Chip>
          </div>
          <div style={{ position: 'absolute', opacity: tableIn }}>
            <Chip accent="cyan" size={30}>
              la tabla la devuelve
            </Chip>
          </div>
        </div>

        {/* ---- the five concepts ---- */}
        <div style={{ position: 'absolute', left: 0, top: 392, width: 1728, display: 'flex', justifyContent: 'center', gap: 16, opacity: chipsIn }}>
          {CHIPS.map((c, i) => {
            const lit = progress(frame, chipAt[i], 10);
            const isCur = frame >= chipAt[i] && (i === CHIPS.length - 1 || frame < chipAt[i + 1]);
            return (
              <div key={c} style={{ opacity: 0.32 + 0.68 * lit * (isCur ? 1 : 0.75) }}>
                <Chip accent="cyan" size={32} solid={isCur && lit > 0.5}>
                  {c}
                </Chip>
              </div>
            );
          })}
        </div>

        {/* ---- the label, enlarged under the plan ---- */}
        {frame >= startAt - 6 ? (
          <div style={{ position: 'absolute', left: LABEL_X, top: LABEL_Y, opacity: progress(frame, startAt - 6, 14) }}>
            <Label values={values} reveal={reveal} focus={focus ?? dwell} tones={tones} />
          </div>
        ) : null}
        <div style={{ position: 'absolute', left: 0, top: LABEL_Y + 54, width: LABEL_X - 20, textAlign: 'right', fontFamily: FONT.sans, fontSize: 54, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap', ...titleIn }} key={cur.text}>
          {cur.text}
        </div>

        {/* ---- the stopwatch ---- */}
        {watch > 0.01 ? (
          <div style={{ position: 'absolute', left: LABEL_X + LABEL_W + 40, top: LABEL_Y + 32, opacity: watch, transform: `translateX(${Math.round((1 - watch) * 24)}px)` }}>
            <Cronometro p={count} size={56} />
          </div>
        ) : null}
        {watch > 0.01 && count >= 1 ? (
          <div style={{ position: 'absolute', left: LABEL_X + LABEL_W + 40, top: LABEL_Y + 156, display: 'flex', alignItems: 'center', gap: 10, fontFamily: FONT.sans, fontSize: 30, fontWeight: 750, color: C.emerald, whiteSpace: 'nowrap' }}>
            <Icon name="check" size={30} color={C.emerald} strokeWidth={3.2} />
            ida y vuelta
          </div>
        ) : null}
      </Stage>
      <CaseStamp scene={S} />
    </>
  );
}

