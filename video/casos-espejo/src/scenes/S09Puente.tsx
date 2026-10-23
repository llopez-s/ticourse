import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui';
import { Arrow, Card, Disc, Pop, Tick, VcStamp } from './parts/bits';
import { Block, KeyRing } from './parts/KeyRing';
import { Stage, interceptWindow, segment, wordFrame } from './kit';

const S = 's09-puente';
const W = STAGE.width;
const CLIENTS = 6;
const CLIENT_X = (i: number) => 24 + i * 128;
const MSP = { x: 130, y: 170, w: 520, h: 120 } as const;

const STEPS: readonly { icon: IconName; text: string; word: string }[] = [
  { icon: 'eye', text: 'vigilar su acceso', word: 'Vigilar' },
  { icon: 'lock', text: 'limitarlo', word: 'limitarlo' },
  { icon: 'file', text: 'regularlo por contrato', word: 'regulado' },
];

/**
 * s09-puente «El proveedor como puente». On `hop-case` the label «APT10 / Cloud Hopper»; as the voice says
 * «empresas» a small company appears, the managed service provider (MSP). On `hop` six client networks hang
 * from it (no names) and, on «entró» / «saltó», the campaign (rose) enters the provider and hops to each
 * client under «docenas de clientes finales · varios países». On `keys` the property manager's big key ring
 * with five buildings; on `hop-scale` the rule «un proveedor abre la puerta a toda su cartera». On the next
 * sentence all that leaves for the lesson's strip (a joint public-private investigation · afterwards a formal
 * US indictment), kept below the top 176 px for VELVET CICADA's message. On `hop-reply` three empty slots wait
 * and «regularlo por contrato» fills first; «vigilar su acceso» and «limitarlo» follow. On `hop-mirror`
 * Meridian's perimeter is drawn with the providers' accesses INSIDE it, the note «el grupo que te ataca también
 * ataca a tus proveedores» and «tus requisitos de inteligencia lo cubren». No real provider, no Orbital.
 */
export function S09Puente(props: SceneProps) {
  const frame = useCurrentFrame();
  const hopCase = props.cue('hop-case');
  const hop = props.cue('hop');
  const keys = props.cue('keys');
  const scale = props.cue('hop-scale');
  const reply = props.cue('hop-reply');
  const mirror = props.cue('hop-mirror');
  const icp = interceptWindow(S, 's09-06');
  const stripAt = segment(props, 's09-05').from;

  const mspAt = Math.max(hopCase + 20, wordFrame(S, 's09-01', 'empresas') - 8);
  const enterAt = wordFrame(S, 's09-02', 'entró') - 6;
  const jumpAt = wordFrame(S, 's09-02', 'saltó') - 4;
  const scaleLabelAt = wordFrame(S, 's09-02', 'docenas') - 8;
  const p1Out = progress(frame, stripAt - 8, 14, EASE.inOut);
  const p2Out = progress(frame, mirror - 10, 14, EASE.inOut);
  const stripDim = progress(frame, segment(props, 's09-07').from, 14);
  const stepAt = STEPS.map((s) => wordFrame(S, 's09-07', s.word) - 6);
  const slotAt = Math.max(reply - 4, icp.from + 30);
  const mixY = 230 - 226 * progress(frame, mspAt - 8, 26, EASE.inOut);
  const hopP = progress(frame, jumpAt, 50, EASE.inOut);
  const intoMsp = progress(frame, enterAt, 24, EASE.inOut);
  const perim = progress(frame, mirror - 4, 20, EASE.out);
  const noteAt = wordFrame(S, 's09-08', 'ataca') - 8;
  const reqAt = wordFrame(S, 's09-08', 'requisitos') - 8;

  return (
    <Stage>
      <Pop at={hopCase} frame={frame} x={0} y={mixY} out={p2Out} distance={22}>
        <div style={{ fontFamily: FONT.sans, opacity: 1 - p1Out }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 26, fontWeight: 800, letterSpacing: 4, color: C.muted }}>
            <Icon name="archive" size={30} color={C.muted} strokeWidth={2} />
            CASO 5
          </div>
          <div style={{ marginTop: 4, fontSize: 84, fontWeight: 900, letterSpacing: -2, color: C.textStrong, whiteSpace: 'nowrap' }}>
            <span style={{ color: C.rose }}>APT10</span> / Cloud Hopper
          </div>
        </div>
      </Pop>

      {/* P1: the provider, its clients, the key ring */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: STAGE.height, opacity: 1 - p1Out, display: p1Out >= 1 ? 'none' : 'block' }}>
        <Pop at={mspAt} frame={frame} x={MSP.x} y={MSP.y} w={MSP.w} h={MSP.h} distance={24}>
          <Card tone="sky" glow={intoMsp * 0.6} pad={0} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '0 24px' }}>
            <Disc icon="cloud" size={70} tone="sky" />
            <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.15, color: C.textStrong }}>
              proveedor de servicios gestionados <span style={{ color: C.sky }}>(MSP)</span>
            </div>
          </Card>
        </Pop>
        {/* lines from the MSP to the clients */}
        <svg width={1} height={1} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          {Array.from({ length: CLIENTS }).map((_, i) => {
            const e = progress(frame, hop + i * 5, 14);
            const hot = progress(frame, jumpAt + i * 7, 16) * (hopP > 0 ? 1 : 0);
            const x2 = CLIENT_X(i) + 50;
            return e > 0 ? (
              <g key={i}>
                <line x1={MSP.x + MSP.w / 2} y1={MSP.y + MSP.h} x2={x2} y2={400} stroke={alpha(C.cyan, 0.5)} strokeWidth={4} opacity={e} />
                {hot > 0 ? <line x1={MSP.x + MSP.w / 2} y1={MSP.y + MSP.h} x2={MSP.x + MSP.w / 2 + (x2 - MSP.x - MSP.w / 2) * hot} y2={MSP.y + MSP.h + (400 - MSP.y - MSP.h) * hot} stroke={C.rose} strokeWidth={6} strokeLinecap="round" /> : null}
              </g>
            ) : null;
          })}
        </svg>
        {Array.from({ length: CLIENTS }).map((_, i) => (
          <Pop key={i} at={hop + i * 5} frame={frame} x={CLIENT_X(i)} y={400} distance={18}>
            <Block w={100} h={112} tone={progress(frame, jumpAt + i * 7 + 14, 8) > 0.5 ? C.rose : C.cyan} glow={progress(frame, jumpAt + i * 7 + 14, 8) * 0.4} />
          </Pop>
        ))}
        <Pop at={scaleLabelAt} frame={frame} x={0} y={530} distance={12}>
          <div style={{ fontFamily: FONT.sans, fontSize: 32, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>
            <span style={{ color: C.cyanSoft }}>docenas de clientes finales</span> · varios países
          </div>
        </Pop>
        {/* the campaign, entering the provider */}
        {intoMsp > 0 && hopP < 0.3 ? (
          <div style={{ position: 'absolute', left: -60 + intoMsp * (MSP.x + 30), top: MSP.y + MSP.h / 2 - 22, display: 'flex', alignItems: 'center', gap: 10, opacity: Math.min(1, intoMsp * 2) * (1 - hopP / 0.3) }}>
            <Icon name="radar" size={44} color={C.rose} strokeWidth={2.2} />
            <Arrow x1={44} y1={22} x2={90} y2={22} color={C.rose} width={6} />
          </div>
        ) : null}

        <Pop at={keys} frame={frame} x={880} y={60} distance={22}>
          <KeyRing keys={5} show={progress(frame, keys, 36, EASE.out)} hot={progress(frame, scale, 12)} />
        </Pop>
        <svg width={1} height={1} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          {Array.from({ length: 5 }).map((_, i) => {
            const e = progress(frame, keys + 30 + i * 6, 14);
            return e > 0 ? <line key={i} x1={1060} y1={340} x2={880 + i * 168 + 45} y2={420} stroke={alpha(i === 0 && false ? C.rose : C.amber, 0.5)} strokeWidth={3} strokeDasharray="6 8" opacity={e} /> : null;
          })}
        </svg>
        {Array.from({ length: 5 }).map((_, i) => (
          <Pop key={i} at={keys + 30 + i * 6} frame={frame} x={880 + i * 168} y={420} distance={16}>
            <Block w={90} h={110} tone={progress(frame, scale, 12) > 0.5 ? C.rose : C.amber} lit={0.9} glow={progress(frame, scale, 12) * 0.35} />
          </Pop>
        ))}
        <Pop at={keys + 10} frame={frame} x={1240} y={120} w={470} distance={14}>
          <div style={{ fontFamily: FONT.sans, fontSize: 34, fontWeight: 800, lineHeight: 1.2, color: C.textStrong }}>
            el administrador de fincas
            <div style={{ fontSize: 30, fontWeight: 650, color: C.muted, marginTop: 6 }}>un llavero, muchos edificios</div>
          </div>
        </Pop>
        <Pop at={scale} frame={frame} x={0} y={592} w={W} h={64} distance={16}>
          <Card tone="amber" glow={0.5} pad={0} radius={RADIUS.pill} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 22 }}>
            <Icon name="key" size={42} color={C.amber} strokeWidth={2} />
            <span style={{ fontSize: 40, fontWeight: 900, color: C.textStrong }}>
              un proveedor abre la puerta a <span style={{ color: C.amber }}>toda su cartera</span>
            </span>
          </Card>
        </Pop>
      </div>

      {/* P2 + P3: the strip, then the three measures */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: STAGE.height, opacity: 1 - p2Out, display: p2Out >= 1 ? 'none' : 'block' }}>
        <Pop at={stripAt} frame={frame} x={60} y={228} w={800} h={150} dim={stripDim} axis="x" distance={-60}>
          <Card tone="sky" pad={0} style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '0 26px' }}>
            <Disc icon="users" size={80} tone="sky" />
            <span style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.18, color: C.textStrong }}>lo destapó una investigación conjunta público-privada</span>
          </Card>
        </Pop>
        <div style={{ position: 'absolute', left: 0, top: 0, opacity: 1 - 0.6 * stripDim }}>
          <Arrow x1={872} y1={303} x2={930} y2={303} p={progress(frame, stripAt + 40, 16)} color={C.muted} width={6} />
        </div>
        <Pop at={stripAt + 50} frame={frame} x={944} y={228} w={724} h={150} dim={stripDim} axis="x" distance={60}>
          <Card tone="rose" pad={0} style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '0 26px' }}>
            <Disc icon="alert" size={80} tone="rose" />
            <span style={{ fontSize: 36, fontWeight: 800, lineHeight: 1.18, color: C.textStrong }}>después, acusación formal de EE. UU.</span>
          </Card>
        </Pop>

        {STEPS.map((s, i) => {
          const order = [2, 0, 1][i]; // the contract fills first, then the other two
          const filledAt = i === 2 ? Math.max(reply + 8, wordFrame(S, 's09-06', 'contrato') - 6) : stepAt[i];
          const slot = progress(frame, slotAt + order * 5, 14);
          const on = progress(frame, filledAt, 14, EASE.inOut);
          return (
            <div key={s.text} style={{ position: 'absolute', left: i * 580, top: 452, width: 568, height: 120, opacity: slot, transform: `translateY(${(1 - slot) * 16}px)` }}>
              <Card tone={on > 0.5 ? 'emerald' : 'cyan'} dashed={on < 0.05} glow={on * 0.5} pad={0} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '0 24px' }}>
                {on > 0.3 ? <Disc icon={s.icon} size={68} tone="emerald" glow={on} /> : <span style={{ width: 68, height: 68, borderRadius: 34, border: `3px dashed ${alpha(C.muted, 0.6)}`, flexShrink: 0 }} />}
                <span style={{ fontSize: 40, fontWeight: 850, color: on > 0.05 ? C.textStrong : alpha(C.muted, 0.0), opacity: on }}>{s.text}</span>
              </Card>
            </div>
          );
        })}
      </div>

      {/* P4: Meridian's perimeter, with the providers' accesses inside it */}
      {perim > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: W, height: STAGE.height, opacity: perim }}>
          <div style={{ position: 'absolute', left: 20, top: 40, width: 980, height: 520, boxSizing: 'border-box', borderRadius: 30, border: `4px dashed ${alpha(C.cyan, 0.7)}`, background: alpha(C.cyan, 0.04) }}>
            <div style={{ position: 'absolute', left: 30, top: 18, fontFamily: FONT.sans, fontSize: 40, fontWeight: 850, color: C.cyanSoft }}>perímetro de Meridian</div>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ position: 'absolute', left: 50 + i * 150, top: 170 + (i % 2) * 40, opacity: progress(frame, mirror + 10 + i * 6, 12) }}>
                <Block w={116} h={150} tone={C.cyan} />
              </div>
            ))}
            {[0, 1, 2].map((i) => {
              const at = mirror + 24 + i * 12;
              const e = progress(frame, at, 14);
              return (
                <div key={i} style={{ position: 'absolute', left: 520, top: 96 + i * 136, width: 420, height: 108, opacity: e, transform: `translateX(${(1 - e) * 60}px)` }}>
                  <Card tone="amber" pad={0} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '0 20px' }}>
                    <Icon name="plug" size={48} color={C.amber} strokeWidth={2} />
                    <div style={{ fontSize: 31, fontWeight: 800, lineHeight: 1.12, color: C.textStrong, whiteSpace: 'nowrap' }}>
                      acceso de proveedor
                      <div style={{ fontSize: 27, fontWeight: 650, color: C.muted }}>dentro de tu perímetro</div>
                    </div>
                  </Card>
                </div>
              );
            })}
            <svg width={1} height={1} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              {[0, 1, 2].map((i) => (
                <line key={i} x1={166 + i * 150} y1={250 + (i % 2) * 40} x2={520} y2={150 + i * 136} stroke={alpha(C.amber, 0.55)} strokeWidth={4} strokeDasharray="4 12" opacity={progress(frame, mirror + 30 + i * 12, 14)} />
              ))}
            </svg>
          </div>
          <Pop at={noteAt} frame={frame} x={1040} y={60} w={W - 1040} distance={20}>
            <div style={{ fontFamily: FONT.sans }}>
              <VcStamp size={28} />
              <div style={{ marginTop: 20, fontSize: 50, fontWeight: 900, lineHeight: 1.12, letterSpacing: -0.5, color: C.textStrong }}>
                el grupo que te ataca <span style={{ color: C.rose }}>también ataca a tus proveedores</span>
              </div>
            </div>
          </Pop>
          <Pop at={reqAt} frame={frame} x={1040} y={380} w={W - 1040} h={140} distance={20}>
            <Card tone="emerald" glow={0.4} pad={0} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '0 26px' }}>
              <Tick size={60} />
              <span style={{ fontSize: 40, fontWeight: 850, lineHeight: 1.15, color: C.textStrong }}>tus requisitos de inteligencia lo cubren</span>
            </Card>
          </Pop>
        </div>
      ) : null}
    </Stage>
  );
}
