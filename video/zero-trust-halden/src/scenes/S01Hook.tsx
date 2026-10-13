import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, dimStyle, mix, windowWeight } from '../../../engine/src/ui';
import { BLIND, PROMISE, STAMP, TITLE } from '../data/s01-hook';
import { RuleCard, ruleCardSize } from './parts/RuleCard';
import { AdversaryTag } from './parts/s01-hook/AdversaryTag';
import { BLIND_COL, BlindColumn, blindColumnHeight, blindItemY } from './parts/s01-hook/Blind';
import { Stage, wordFrame } from './kit';

const S = 's01-hook';
const W = STAGE.width;
const H = STAGE.height;

// ---- Today's picture: the stamp over the rule card, and beside it what the rule does not look at.
const CARD_W = 1080;
const CARD = ruleCardSize(CARD_W);
const STAMP_H = 58;
const STAMP_GAP = 14;
const COL_GAP = 72;
const COL_W = 500;
const GROUP_W = CARD_W + COL_GAP + COL_W;
const GROUP_X = Math.round((W - GROUP_W) / 2);
const COL_H = blindColumnHeight();
const STACK_H = STAMP_H + STAMP_GAP + CARD.h;
const GROUP_H = Math.max(STACK_H, COL_H);
/** Left stack (stamp + card) and column, each centred on the group's height. */
const STACK_Y = Math.round((GROUP_H - STACK_H) / 2);
const COL_Y = Math.round((GROUP_H - COL_H) / 2);
const COL_X = CARD_W + COL_GAP;
const CARD_Y = STACK_Y + STAMP_H + STAMP_GAP;
/** Centred on the stage until the title lands; then it drops under the title block. */
const GROUP_Y_A = Math.round((H - GROUP_H) / 2);
const GROUP_Y_B = H - GROUP_H - 30;

// ---- Title block (from `title`): the title and, under it, the promise as a short list.
const TITLE_SIZE = 84;
const CHIPS_TOP = 102;
const CHIP_H = 56;
const CHIP_GAP = 12;
/** The block is centred on the stage; it steps left when NULL CIPHER's tag takes the right. */
const BLOCK_CX = W / 2;
const BLOCK_CX_ADV = 520;

/**
 * s01-hook «Basta con estar en Operaciones». The empty rule card settles from the first frame; on
 * `rule` Friday's stamp («13-11 · viernes · acceso al ERP · diseño y simulación») lands over it and
 * the one row writes itself: «Operaciones» · «a erp.local» · «tcp/443» · «permitir», each field
 * brightening as the voice says the rule in plain words. Beside it, dim, what the rule does not
 * look at («no mira»: «quién eres» · «cómo está tu portátil» · «desde dónde y cuándo»); on `blind`
 * they turn amber. Before 12 s (`title`) «Zero Trust» lands at the top and today's picture drops
 * and steps back; the promise follows as three chips, each lit on its words. On `adversary` the
 * title block moves left and NULL CIPHER's tag («NULL CIPHER · sección 1» / «célula de acceso
 * inicial», a «null» mark) enters on the right, above the three things nobody looks at; on
 * «hueco» those light once more. The last frame: title and promise dimmed, the tag, the rule.
 */
export function S01Hook(props: SceneProps) {
  const frame = useCurrentFrame();
  const ruleAt = props.cue('rule');
  const blindAt = props.cue('blind');
  const advAt = props.cue('adversary');
  // Title before 12 s, whatever the voice does.
  const titleAt = Math.min(props.cue('title') - 6, 12 * 30 - 22);
  const w1 = (word: string) => wordFrame(S, 's01-01', word);

  // ---- The rule: an empty card from frame 0, written on `rule`, read field by field.
  const settle = progress(frame, -10, 22);
  const write = progress(frame, ruleAt - 2, 26, EASE.linear);
  const stampIn = enter(frame, ruleAt - 4, { distance: 14, duration: 16 });
  const lit = {
    title: windowWeight(frame, w1('regla'), w1('deja') - 2, { ramp: 10 }),
    act: windowWeight(frame, w1('deja'), w1('ERP') - 4, { ramp: 10 }),
    dst: windowWeight(frame, w1('ERP'), w1('portátil') - 2, { ramp: 10 }),
    svc: windowWeight(frame, w1('ERP') + 6, w1('portátil') - 2, { ramp: 10 }),
    src: windowWeight(frame, w1('Operaciones'), blindAt - 6, { ramp: 10 }),
  };

  // ---- What it does not look at: dim beside the rule, amber on `blind`.
  // The card sits alone in the middle of the stage until its column needs the room.
  const aside = progress(frame, ruleAt + 22, 24, EASE.inOut);
  const groupX = GROUP_X + (1 - aside) * Math.round((GROUP_W - CARD_W) / 2);
  const headShow = progress(frame, ruleAt + 38, 14);
  const show = BLIND.items.map((_, i) => progress(frame, ruleAt + 46 + i * 7, 14));
  const headLit = progress(frame, blindAt - 4, 12);
  const whoAt = w1('quién') - 4;
  const blindLit = BLIND.items.map((_, i) => progress(frame, Math.min(whoAt + i * 9, titleAt - 22 + i * 4), 12));

  // ---- Title and promise; today's picture drops and steps back under them.
  const titleIn = enter(frame, titleAt, { distance: 22, duration: 18 });
  const drop = progress(frame, titleAt - 8, 24, EASE.inOut);
  const groupY = mix(GROUP_Y_A, GROUP_Y_B, drop);
  const chipAt = PROMISE.map((p) => wordFrame(S, 's01-02', p.parts[0].word) - 6);

  // ---- NULL CIPHER: the title block steps left and back, the tag takes the right.
  const toAdv = progress(frame, advAt - 14, 24, EASE.inOut);
  const blockCx = mix(BLOCK_CX, BLOCK_CX_ADV, toAdv);
  const blockDim = 0.55 * progress(frame, advAt - 8, 16, EASE.inOut);
  const tagIn = enter(frame, advAt - 2, { distance: 26, duration: 18, axis: 'x' });
  const gapAt = wordFrame(S, 's01-03', 'hueco') - 6;
  const gapGlow = windowWeight(frame, gapAt, Number.POSITIVE_INFINITY, { ramp: 14 });
  const groupDim = 0.5 * progress(frame, titleAt - 4, 18, EASE.inOut) * (1 - 0.7 * progress(frame, advAt + 2, 20, EASE.inOut));

  const railLit = headLit;
  const railY0 = COL_Y + blindItemY(0);
  const railY1 = COL_Y + blindItemY(BLIND.items.length - 1);
  const railX = COL_X - BLIND_COL.rail;
  const stubY = CARD_Y + CARD.h - Math.round((CARD.h - 62) / 2);

  return (
    <Stage>
      {/* Today's picture: stamp, rule card, and what the rule does not look at */}
      <div style={{ position: 'absolute', left: groupX, top: groupY, width: GROUP_W, height: GROUP_H, ...dimStyle(groupDim) }}>
        {/* Friday 13-11: design and simulation */}
        {frame >= ruleAt - 6 ? (
          <div style={{ position: 'absolute', left: 0, top: STACK_Y, ...stampIn }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 14,
                height: STAMP_H,
                padding: '0 26px 0 16px',
                boxSizing: 'border-box',
                borderRadius: RADIUS.md,
                border: `2px solid ${alpha(C.cyan, 0.7)}`,
                background: alpha(C.cyan, 0.1),
                fontFamily: FONT.sans,
                fontSize: 34,
                whiteSpace: 'nowrap',
              }}
            >
              <Icon name="clock" size={34} color={C.cyan} />
              <span style={{ fontFamily: FONT.mono, fontWeight: 800, color: C.cyanSoft }}>{STAMP.day}</span>
              <Dot />
              <span style={{ fontWeight: 700, color: C.text }}>{STAMP.weekday}</span>
              <Dot />
              <span style={{ fontWeight: 800, color: C.textStrong }}>{STAMP.what}</span>
              <Dot />
              <span style={{ fontWeight: 750, color: C.cyanSoft }}>{STAMP.mode}</span>
            </div>
          </div>
        ) : null}

        {/* The firewall rule */}
        <div style={{ position: 'absolute', left: 0, top: CARD_Y, opacity: settle, transform: `scale(${0.985 + 0.015 * settle})`, transformOrigin: '50% 50%' }}>
          <RuleCard width={CARD_W} write={write} lit={lit} />
        </div>

        {/* From the rule to what it leaves out */}
        {headShow > 0.001 ? (
          <svg style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }} width={GROUP_W} height={GROUP_H} opacity={headShow}>
            {[alpha(C.faint, 0.9 * (1 - railLit)), alpha(C.amber, 0.8 * railLit)].map((stroke, k) => (
              <g key={k} fill="none" stroke={stroke} strokeWidth={3} strokeLinecap="round" strokeDasharray="3 9">
                <path d={`M ${CARD_W + 6} ${stubY} H ${railX}`} />
                <path d={`M ${railX} ${railY0} V ${railY1}`} />
                {BLIND.items.map((item, i) => (
                  <path key={item.text} d={`M ${railX} ${COL_Y + blindItemY(i)} H ${COL_X - 6}`} opacity={show[i]} />
                ))}
              </g>
            ))}
          </svg>
        ) : null}
        <div style={{ position: 'absolute', left: COL_X, top: COL_Y }}>
          <BlindColumn headShow={headShow} headLit={headLit} show={show} lit={blindLit} glow={gapGlow} />
        </div>
      </div>

      {/* Title and promise */}
      {frame >= titleAt - 2 ? (
        <div style={{ position: 'absolute', left: blockCx - W / 2, top: 0, width: W, fontFamily: FONT.sans, ...dimStyle(blockDim) }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: W, textAlign: 'center', ...titleIn }}>
            <span
              style={{
                fontSize: TITLE_SIZE,
                fontWeight: 900,
                letterSpacing: -1.6,
                lineHeight: 1,
                color: C.cyan,
                textShadow: `0 0 34px ${alpha(C.cyan, 0.28)}`,
                whiteSpace: 'nowrap',
              }}
            >
              {TITLE}
            </span>
          </div>

          {PROMISE.map((p, i) => {
            if (frame < chipAt[i] - 2) return null;
            const e = enter(frame, chipAt[i], { distance: 16 });
            const on = progress(frame, chipAt[i], 10) * (1 - 0.55 * progress(frame, (chipAt[i + 1] ?? advAt - 6) - 2, 12, EASE.inOut));
            return (
              <div key={p.icon} style={{ position: 'absolute', left: 0, top: CHIPS_TOP + i * (CHIP_H + CHIP_GAP), width: W, display: 'flex', justifyContent: 'center', ...e }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 12,
                    height: CHIP_H,
                    padding: '0 26px 0 18px',
                    boxSizing: 'border-box',
                    borderRadius: RADIUS.pill,
                    border: `2px solid ${alpha(C.cyan, 0.4 + 0.5 * on)}`,
                    background: alpha(C.cyan, 0.06 + 0.12 * on),
                    boxShadow: on > 0.02 ? `0 0 ${Math.round(22 * on)}px ${alpha(C.cyan, 0.3 * on)}` : undefined,
                    fontSize: 34,
                    fontWeight: 750,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Icon name={p.icon} size={32} color={C.cyan} />
                  <span style={{ whiteSpace: 'pre' }}>
                    {p.parts.map((part, k) => {
                      // Each piece is there with the chip and brightens on its own word.
                      const said = k === 0 ? 1 : progress(frame, wordFrame(S, 's01-02', part.word) - 4, 10);
                      return (
                        <span key={part.text} style={{ color: alpha(C.textStrong, 0.45 + 0.55 * said) }}>
                          {k ? ` ${part.text}` : part.text}
                        </span>
                      );
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* NULL CIPHER: an initial-access cell */}
      {frame >= advAt - 4 ? (
        <div style={{ position: 'absolute', right: 16, top: 10, ...tagIn }}>
          <AdversaryTag glow={gapGlow} />
        </div>
      ) : null}
    </Stage>
  );
}

function Dot() {
  return <span style={{ fontWeight: 700, color: C.faint }}>·</span>;
}
