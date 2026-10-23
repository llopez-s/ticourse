import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { BrandMark } from '../../../engine/src/overlay/ChapterRail';
import { isElevenLabsVoice } from '../../../engine/src/timeline/voice';
import { C, FONT, RADIUS, STAGE, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { Chip, Icon, RuleCards, type RuleCardDef } from '../../../engine/src/ui';
import { TIMELINE } from '../timeline/load';
import { Card, Disc, Pop, Tick } from './parts/bits';
import { CoatRack } from './parts/CoatRack';
import { Dossier } from './parts/Dossier';
import { KeyRing } from './parts/KeyRing';
import { Notebook } from './parts/Notebook';
import { Stage } from './kit';

const W = STAGE.width;
const CARDS_TOP = 96;
const CARDS_H = 430;
const NEXT_TOP = 552;
const CISO_Q = '¿Esto ya ha pasado antes?';
const CISO_A = 'sí, y cada vez dejó una lección';
const NEXT = 'Tu turno: las preguntas de la lección';
const DISCLAIMER =
  'Casos reales resumidos de la lección; las atribuciones son las que hicieron públicamente los informes y gobiernos citados · Meridian y VELVET CICADA son ficticios · material independiente, no afiliado a SANS/GIAC.';

const CARD_W = 1560;
const ART_W = 560;

/**
 * s11-cierre «Para el examen». On `recap` the CISO's bar returns on top («¿Esto ya ha pasado antes?») and
 * three rule cards light one at a time with their picture: `rule-1` the group's notebook («el actor persiste:
 * apúntalo todo»), `rule-2` the evidence file that thickens («atribuir es pesar evidencia, también la de un
 * gobierno»), `rule-3` the coat rack with two coats and the key ring («misma víctima no es mismo grupo · tus
 * proveedores están en tu perímetro»). On `next` the cards step back for the one next step, «Tu turno: las
 * preguntas de la lección»; on `endcard` the ALERTÓPOLIS end card: the CISO's question with the answer «sí, y
 * cada vez dejó una lección», the title, the call to action and the disclaimer written by hand (real cases
 * summarised from the lesson; the attributions are the ones the cited reports and governments made in
 * public; Meridian and VELVET CICADA are fictional) — not the engine's «datos ficticios». It holds to the
 * last frame. No lab is mentioned.
 */
export function S11Cierre(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const recap = props.cue('recap');
  const ruleAt = [props.cue('rule-1'), props.cue('rule-2'), props.cue('rule-3')];
  const next = props.cue('next');
  const endcard = props.cue('endcard');
  const boardOut = progress(frame, endcard - 14, 14, EASE.inOut);

  const rules: RuleCardDef[] = [
    {
      title: ['El actor persiste:', 'apúntalo todo'],
      sub: ['más que la memoria', 'del defensor'],
      tone: 'cyan',
      at: ruleAt[0],
      art: <Notebook w={190} h={150} label="" tabs={3 * progress(frame, ruleAt[0], 40)} tabSize={26} />,
    },
    {
      title: ['Atribuir es', 'pesar evidencia'],
      sub: ['también la', 'de un gobierno'],
      tone: 'emerald',
      at: ruleAt[1],
      art: <Dossier w={230} h={150} sheets={5 + 6 * progress(frame, ruleAt[1], 40)} heavy={progress(frame, ruleAt[1] + 20, 20)} label="" />,
    },
    {
      title: ['Misma víctima', 'no es mismo grupo'],
      sub: ['tus proveedores están', 'en tu perímetro'],
      tone: 'amber',
      at: ruleAt[2],
      art: (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 26 }}>
          <CoatRack scale={0.33} />
          <KeyRing scale={0.5} keys={5} />
        </div>
      ),
    },
  ];

  return (
    <Stage>
      {boardOut < 1 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - boardOut, fontFamily: FONT.sans }}>
          <Pop at={recap - 4} frame={frame} x={(W - 1100) / 2} y={4} w={1100} h={72} distance={16}>
            <Card tone="cyan" pad={0} radius={RADIUS.pill} style={{ display: 'flex', alignItems: 'center', gap: 22, padding: '0 22px' }}>
              <Disc icon="user" size={50} />
              <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: 2, color: C.cyanSoft, whiteSpace: 'nowrap' }}>CISO</span>
              <span style={{ fontSize: 44, fontWeight: 900, color: C.textStrong, letterSpacing: -0.6, whiteSpace: 'nowrap' }}>{CISO_Q}</span>
            </Card>
          </Pop>
          <RuleCards rules={rules} width={W} height={CARDS_H} gap={24} slotAt={recap} dimFrom={next} subSize={32} artHeight={160} frame={frame} fps={fps} style={{ position: 'absolute', left: 0, top: CARDS_TOP }} />
          <NextAction frame={frame} fps={fps} at={next} />
        </div>
      ) : null}
      <EndCard frame={frame} fps={fps} at={endcard} />
    </Stage>
  );
}

function NextAction({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 6) return null;
  const p = springIn(frame, fps, at - 4, { damping: 16 });
  return (
    <div style={{ position: 'absolute', left: 0, top: NEXT_TOP, width: W, display: 'flex', justifyContent: 'center', opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - Math.min(1, p)) * 18}px)` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, padding: '16px 40px 16px 30px', borderRadius: 32, background: alpha(C.cyan, 0.08), border: `3px solid ${alpha(C.cyan, 0.7)}`, boxShadow: `0 0 34px ${alpha(C.cyan, 0.22)}` }}>
        <Icon name="play" size={46} color={C.cyan} strokeWidth={2} />
        <span style={{ fontSize: 50, fontWeight: 850, color: C.textStrong, whiteSpace: 'nowrap' }}>{NEXT}</span>
      </div>
    </div>
  );
}

/** Closing card: the CISO's question and its answer, ALERTÓPOLIS, title, call to action, objective, disclaimer. */
function EndCard({ frame, fps, at }: { frame: number; fps: number; at: number }) {
  if (frame < at - 8) return null;
  const cardIn = springIn(frame, fps, at - 6, { damping: 18 });
  const q = enter(frame, at, { distance: 20 });
  const a = enter(frame, at + 14, { distance: 20 });
  const brand = enter(frame, at - 2, { distance: 16 });
  const title = enter(frame, at + 2, { distance: 24 });
  const sub = enter(frame, at + 8, { distance: 18 });
  const chips = enter(frame, at + 12, { distance: 18 });
  const ruleDraw = progress(frame, at + 12, 18);
  const disclaimer = enter(frame, at + 18, { distance: 12 });
  return (
    <div
      style={{
        position: 'absolute',
        left: (W - CARD_W) / 2,
        top: 10,
        width: CARD_W,
        height: STAGE.height - 20,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 56,
        padding: '0 60px',
        borderRadius: 36,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        border: `2px solid ${C.ink700}`,
        boxShadow: `0 40px 90px ${alpha('#000000', 0.45)}, inset 0 1px 0 ${alpha('#ffffff', 0.05)}`,
        fontFamily: FONT.sans,
        opacity: Math.min(1, cardIn * 1.4),
        transform: `scale(${0.94 + 0.06 * cardIn})`,
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 4, background: `linear-gradient(90deg, transparent 0%, ${C.cyan} 50%, transparent 100%)`, opacity: 0.8 }} />
      {/* The exchange with the CISO */}
      <div style={{ flexShrink: 0, width: ART_W, display: 'flex', flexDirection: 'column', gap: 26 }}>
        <div style={{ ...q, alignSelf: 'flex-start', width: 500, boxSizing: 'border-box', padding: '20px 26px', borderRadius: '26px 26px 26px 6px', border: `3px solid ${alpha(C.cyan, 0.7)}`, background: alpha(C.cyan, 0.1) }}>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: 3, color: C.cyanSoft }}>CISO</div>
          <div style={{ marginTop: 6, fontSize: 40, fontWeight: 900, lineHeight: 1.1, color: C.textStrong }}>{CISO_Q}</div>
        </div>
        <div style={{ ...a, alignSelf: 'flex-end', width: 500, boxSizing: 'border-box', padding: '20px 26px', borderRadius: '26px 26px 6px 26px', border: `3px solid ${alpha(C.emerald, 0.8)}`, background: alpha(C.emerald, 0.12), display: 'flex', alignItems: 'center', gap: 18 }}>
          <Tick size={50} />
          <div style={{ fontSize: 38, fontWeight: 900, lineHeight: 1.12, color: C.textStrong }}>{CISO_A}</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, ...brand }}>
          <BrandMark size={34} />
          <span style={{ fontSize: TYPE.small, fontWeight: 800, letterSpacing: 5, color: C.cyanSoft }}>ALERTÓPOLIS</span>
        </div>
        <div style={{ marginTop: 16, fontSize: 56, fontWeight: 850, letterSpacing: -1.5, lineHeight: 1.06, color: C.textStrong, whiteSpace: 'nowrap', ...title }}>
          <div>
            <span style={{ color: C.cyan }}>Cinco</span> casos históricos
          </div>
          <div>y lo que enseñó cada uno</div>
        </div>
        <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 14, fontSize: 40, fontWeight: 800, color: C.cyanSoft, whiteSpace: 'nowrap', ...sub }}>
          <Icon name="play" size={36} color={C.cyan} strokeWidth={2} />
          {NEXT}
        </div>
        <div style={{ marginTop: 18, ...chips }}>
          <Chip accent="violet" icon="mortarboard" size={TYPE.label}>
            GIAC GCTI · Dissemination
          </Chip>
        </div>
        <div style={{ marginTop: 18, width: 640 * ruleDraw, height: 2, background: C.ink700 }} />
        <div style={{ marginTop: 14, width: 820, fontSize: TYPE.small, fontWeight: 550, color: C.muted, lineHeight: 1.34, ...disclaimer }}>
          {DISCLAIMER}
          {isElevenLabsVoice(TIMELINE.voice) ? (
            <>
              <br />
              Voz: ElevenLabs.
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
