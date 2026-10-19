import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon, type IconName } from '../../../engine/src/ui/Icon';
import { InfoCard, Pill, Reveal, Tag, WHO } from './parts/bits';
import { Stage, segment } from './kit';

// The intercepted-message card owns the first 170 px of the stage while it lasts: the line starts below it.
const LINE_Y = 250;
const BELOW = 404;

function Stop({ frame, at, x, icon, title, sub, tone }: { frame: number; at: number; x: number; icon: IconName; title: string; sub: string; tone: string }) {
  const p = progress(frame, at, 16);
  return (
    <div style={{ position: 'absolute', left: x - 180, top: LINE_Y - 44, width: 360, opacity: p, transform: `translateY(${(1 - p) * 14}px)`, textAlign: 'center', fontFamily: FONT.sans }}>
      <div style={{ margin: '0 auto', width: 88, height: 88, borderRadius: 44, display: 'grid', placeItems: 'center', background: alpha(tone, 0.14), border: `3px solid ${alpha(tone, 0.85)}`, boxShadow: `0 0 28px ${alpha(tone, 0.25)}` }}>
        <Icon name={icon} size={46} color={tone} />
      </div>
      <div style={{ marginTop: 12, fontSize: 36, fontWeight: 800, color: C.textStrong, lineHeight: 1.1, whiteSpace: 'nowrap' }}>{title}</div>
      <div style={{ marginTop: 4, fontSize: 28, fontWeight: 560, color: C.muted }}>{sub}</div>
    </div>
  );
}

/**
 * s07-caso «Después de la comprobación». A line of moments: second factor, token issued, token used. A
 * hypothetical theft sits AFTER the factor, apart from any proof of use. Below the line, in turn: bearer and
 * the reading contract, the controls a token still has to pass, what a stolen token may fail on, and finally
 * the two conclusions that must not be merged.
 */
export function S07Caso(props: SceneProps) {
  const frame = useCurrentFrame();
  const at = (id: string) => segment(props, id).from;
  const lineP = progress(frame, at('s07-01') + 20, 40);
  const theft = at('s07-02') + 30;
  const bearer = at('s07-03');
  const ctl = at('s07-04');
  const fails = at('s07-05');
  const split = at('s07-06');
  const xs = [200, 830, 1460];

  return (
    <Stage>
      <svg width={1728} height={660} style={{ position: 'absolute', left: 0, top: 0 }}>
        <line x1={xs[0] + 60} y1={LINE_Y} x2={xs[0] + 60 + (xs[2] - xs[0] - 120) * lineP} y2={LINE_Y} stroke={alpha(C.cyan, 0.6)} strokeWidth={5} strokeLinecap="round" />
      </svg>
      <Stop frame={frame} at={at('s07-01')} x={xs[0]} icon="lock" title="Segundo factor" sub="al inicio" tone={C.emerald} />
      <Stop frame={frame} at={at('s07-01') + 50} x={xs[1]} icon="key" title="Se emite el token" sub="de acceso" tone={WHO.idp} />
      <Stop frame={frame} at={at('s07-02') - 10} x={xs[2]} icon="mail" title="Se usa el token" sub="ante Graph" tone={WHO.graph} />

      {/* hypothetical theft: after the factor, never proof of use */}
      <Reveal frame={frame} at={theft} x={1145 - 250} y={LINE_Y - 100} w={500}>
        <div style={{ textAlign: 'center' }}>
          <Pill icon="unplug" tone="rose" size={32}>robo posterior (hipótesis)</Pill>
        </div>
      </Reveal>

      <Reveal frame={frame} at={bearer} outAt={fails} x={xs[2] - 330} y={BELOW} w={660}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14 }}>
          <Tag tone="sky" size={30}>bearer</Tag>
          <Pill tone="muted" size={28}>basta con tenerlo</Pill>
        </div>
      </Reveal>
      <Reveal frame={frame} at={bearer + 40} outAt={fails} x={xs[2] - 330} y={BELOW + 76} w={660}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <InfoCard icon="eye" title="Contrato de lectura" sub="buzón de Ana · solo leer" tone={WHO.graph} w={500} h={104} titleSize={34} subSize={28} />
        </div>
      </Reveal>

      <Reveal frame={frame} at={ctl} outAt={fails} x={0} y={BELOW} w={900}>
        <div style={{ display: 'grid', gap: 14, justifyItems: 'start' }}>
          <Pill icon="clock" tone="amber" size={30}>sigue válido</Pill>
          <Pill icon="shield" tone="amber" size={30}>supera los controles aplicables</Pill>
        </div>
      </Reveal>

      {/* what a stolen token may fail on */}
      <Reveal frame={frame} at={fails} outAt={split} x={0} y={BELOW} w={1728}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Pill icon="x" tone="amber" size={32}>caducado</Pill>
          <Pill icon="x" tone="amber" size={32}>revocado</Pill>
          <Pill icon="x" tone="amber" size={32}>limitado de otra manera</Pill>
        </div>
      </Reveal>
      <Reveal frame={frame} at={fails + 90} outAt={split} x={0} y={BELOW + 76} w={1728}>
        <Pill icon="search" tone="muted" size={30}>tampoco prueba que alguien lo usara</Pill>
      </Reveal>

      {/* two conclusions */}
      <Reveal frame={frame} at={split} x={0} y={BELOW + 40} w={1728}>
        <div style={{ display: 'flex', gap: 48 }}>
          <InfoCard icon="alert" title="Riesgo de acceso" sub="un token pudo exponerse" tone="amber" w={840} h={120} titleSize={40} />
          <InfoCard icon="search" title="Evidencia de uso" sub="alguien lo presentó" tone="cyan" w={840} h={120} titleSize={40} />
        </div>
      </Reveal>
    </Stage>
  );
}
