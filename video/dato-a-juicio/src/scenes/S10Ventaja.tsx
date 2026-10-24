import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { BREAK_AFTER, CHAIN_W, Chain, NODES, NODE_H, nodeCenter } from './parts/Chain';
import { Stage, wordFrame } from './kit';

const S = 's10-ventaja';
const W = STAGE.width;
const CHAIN_X = (W - CHAIN_W) / 2;
const CHAIN_TOP = 188;

/**
 * s10-ventaja «Muchos pasos en tu terreno». The grey phrase «el atacante solo necesita acertar una vez» with a doubt mark opens
 * it (`myth`; the mark pulses on «truco»). On `steps` the lesson's chain builds node by node — delivery · ejecución · persistencia ·
 * C2 · movimiento lateral — with an eye of «rastro» under each, a rose dot (the attacker, nothing concrete) walking it. On
 * `advantage` the label «defender's advantage» lands; on `break` the link after «persistencia» snaps, the chain parts and the dot
 * stops: «intrusión frustrada». On `s2` a bridge chip points to section 2 (Kill Chain and the Courses of Action matrix).
 */
export function S10Ventaja(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const myth = props.cue('myth');
  const steps = props.cue('steps');
  const advantage = props.cue('advantage');
  const brk = props.cue('break');
  const s2 = props.cue('s2');

  // ---- Myth.
  const mythIn = enter(frame, myth, { distance: 18 });
  const truckAt = wordFrame(S, 's10-01', 'truco') - 6;
  const mythBack = progress(frame, steps, 16);
  const doubt = progress(frame, wordFrame(S, 's10-01', 'fatal') - 6, 12);

  // ---- Chain: nodes enter on the voice, eyes follow, the dot walks it.
  const nodeAt = [steps - 2, steps + 22, steps + 44, steps + 66, steps + 88];
  const show = nodeAt.map((a) => progress(frame, a, 14));
  const rastroAt = wordFrame(S, 's10-02', 'rastro') - 8;
  const eyes = nodeAt.map((a, i) => progress(frame, Math.max(a + 10, rastroAt + i * 7), 12));
  const walkFrom = steps + 18;
  const walkTo = brk - 18;
  const walkP = progress(frame, walkFrom, Math.max(30, walkTo - walkFrom), EASE.inOut);
  const stopX = nodeCenter(BREAK_AFTER) + NODES[BREAK_AFTER].w / 2 + 12;
  const dotX = CHAIN_X + mix(nodeCenter(0) - 60, stopX, walkP);
  const broken = progress(frame, brk, 14);
  const dotOut = 0.5 * progress(frame, brk + 28, 16);

  // ---- Labels.
  const advIn = progress(frame, advantage, 16);
  const frustAt = wordFrame(S, 's10-03', 'frustrar') - 10;
  const frust = progress(frame, frustAt, 14);
  const bridge = progress(frame, s2 - 4, 18);

  return (
    <Stage>
      {/* The grey myth */}
      <div style={{ position: 'absolute', left: 0, top: mix(238, 0, mythBack), width: W, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 26, fontFamily: FONT.sans, opacity: mythIn.opacity * (1 - 0.62 * mythBack), transform: `${mythIn.transform} scale(${mix(1.12, 0.72, mythBack)})`, transformOrigin: '50% 0' }}>
        <span style={{ fontSize: 62, fontWeight: 800, letterSpacing: -1, color: C.muted, whiteSpace: 'nowrap' }}>el atacante solo necesita acertar una vez</span>
        <span
          style={{
            display: 'grid',
            placeItems: 'center',
            width: 74,
            height: 74,
            borderRadius: 37,
            border: `4px solid ${alpha(C.amber, 0.9)}`,
            background: alpha(C.amber, 0.12),
            fontSize: 54,
            fontWeight: 850,
            color: C.amber,
            opacity: 0.35 + 0.65 * doubt,
            transform: `scale(${1 + 0.18 * (progress(frame, truckAt, 8) * (1 - progress(frame, truckAt + 14, 14)))})`,
          }}
        >
          ?
        </span>
      </div>

      {/* The chain, with its eyes */}
      {show[0] > 0 ? (
        <div style={{ position: 'absolute', left: CHAIN_X, top: CHAIN_TOP }}>
          <Chain show={show} eyes={eyes} broken={broken} />
        </div>
      ) : null}

      {/* «rastro» legend */}
      {eyes[0] > 0.5 ? (
        <div style={{ position: 'absolute', left: 0, top: CHAIN_TOP + NODE_H + 94, width: W, textAlign: 'center', fontFamily: FONT.sans, fontSize: 38, fontWeight: 750, color: C.cyanSoft, opacity: progress(frame, rastroAt, 14) }}>
          cada paso puede dejar rastro
        </div>
      ) : null}

      {/* The attacker: a rose dot that walks the chain and stops at the break */}
      {walkP > 0 ? (
        <div style={{ position: 'absolute', left: dotX - 24, top: CHAIN_TOP - 46, opacity: 1 - dotOut, fontFamily: FONT.sans }}>
          <div style={{ width: 48, height: 48, borderRadius: 24, background: C.rose, boxShadow: `0 0 ${Math.round(22 + 10 * pulse(frame, fps, 0.8))}px ${alpha(C.rose, 0.8)}` }} />
        </div>
      ) : null}
      {progress(frame, steps + 18, 12) > 0 ? (
        <div style={{ position: 'absolute', left: dotX - 80, top: CHAIN_TOP - 96, width: 160, textAlign: 'center', fontFamily: FONT.sans, fontSize: 28, fontWeight: 800, color: C.roseSoft, opacity: (1 - dotOut) * progress(frame, steps + 18, 12) }}>atacante</div>
      ) : null}
      {broken > 0.2 ? (
        <div style={{ position: 'absolute', left: CHAIN_X + stopX - 36, top: CHAIN_TOP - 16 + 110 * 0, width: 72, height: 72, display: 'grid', placeItems: 'center', opacity: broken, transform: 'translateY(-44px)' }}>
          <Icon name="x" size={72} color={C.amber} strokeWidth={3} />
        </div>
      ) : null}

      {/* defender's advantage */}
      {advIn > 0.001 ? (
        <div style={{ position: 'absolute', left: 0, top: 428, width: W, display: 'flex', justifyContent: 'center', gap: 28, alignItems: 'center', fontFamily: FONT.sans, opacity: advIn, transform: `translateY(${(1 - advIn) * 14}px)` }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 20, padding: '12px 46px 12px 30px', borderRadius: 999, border: `4px solid ${alpha(C.emerald, 0.9)}`, background: alpha(C.emerald, 0.14), boxShadow: `0 0 40px ${alpha(C.emerald, 0.25)}`, fontSize: 62, fontWeight: 850, letterSpacing: -0.5, color: C.textStrong, whiteSpace: 'nowrap' }}>
            <Icon name="shield" size={64} color={C.emerald} strokeWidth={2.2} />
            defender&apos;s advantage
          </span>
          {frust > 0.01 ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 16, padding: '12px 34px 12px 24px', borderRadius: 999, border: `3px solid ${alpha(C.emerald, 0.7)}`, background: alpha(C.ink900, 0.9), fontSize: 44, fontWeight: 800, color: '#d1fae5', whiteSpace: 'nowrap', opacity: frust, transform: `translateX(${(1 - frust) * 24}px)` }}>
              <Icon name="check" size={46} color={C.emerald} strokeWidth={2.6} />
              intrusión frustrada
            </span>
          ) : null}
        </div>
      ) : null}

      {/* Bridge to section 2 */}
      {bridge > 0.001 ? (
        <div style={{ position: 'absolute', left: (W - 1380) / 2, top: 550, width: 1380, boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 28, padding: '18px 38px', borderRadius: RADIUS.lg, border: `3px solid ${alpha(C.sky, 0.8)}`, background: `linear-gradient(90deg, ${alpha(C.sky, 0.14)}, ${alpha(C.ink900, 0.96)})`, fontFamily: FONT.sans, opacity: bridge, transform: `translateY(${(1 - bridge) * 22}px)` }}>
          <Icon name="link" size={58} color={C.sky} strokeWidth={2.2} />
          <div style={{ lineHeight: 1.22 }}>
            <div style={{ fontSize: 44, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>
              sección 2: <span style={{ color: '#7dd3fc' }}>Kill Chain</span> <span style={{ color: C.muted, fontWeight: 650 }}>(la cadena de un ataque)</span>
            </div>
            <div style={{ fontSize: 40, fontWeight: 750, color: C.text, whiteSpace: 'nowrap' }}>y matriz de Courses of Action</div>
          </div>
        </div>
      ) : null}
    </Stage>
  );
}
