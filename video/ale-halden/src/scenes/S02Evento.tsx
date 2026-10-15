import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, springIn } from '../../../engine/src/theme/motion';
import { dimStyle, mix, windowWeight } from '../../../engine/src/ui';
import { EF, PHONE } from '../data/s02-evento';
import { AssetBlock, BLOCK_H, BLOCK_W, QUARTER } from './parts/s02-evento/AssetBlock';
import { AdversaryTag, Equation, RiskStrip, STRIP_H } from './parts/s02-evento/Bits';
import { Phone } from './parts/Phone';
import { Stage, wordFrame } from './kit';

const S = 's02-evento';
const W = STAGE.width;

// ---- The left group (risk line + asset block). It starts centred and settles low and to the left, under the
// band where the intercepted message lives (stage y 10–190).
const GROUP_GAP = 20;
const GROUP_H = STRIP_H + GROUP_GAP + BLOCK_H;
const GROUP_X0 = Math.round((W - BLOCK_W) / 2);
const GROUP_Y0 = Math.round((STAGE.height - GROUP_H) / 2);
const GROUP_Y1 = 215;
const BLOCK_Y = STRIP_H + GROUP_GAP; // inside the group
// ---- The right column (stage coordinates).
const COL_X = 908;
const SLICE_X = 960;
const SLICE_DX = SLICE_X - 3 * QUARTER;
const SLICE_Y = GROUP_Y1 + BLOCK_Y;
const EF_X = SLICE_X + QUARTER + 36;
const PHONE_W = 80;
const PHONE_X = SLICE_X + QUARTER / 2 - Math.round((PHONE_W * 1.32) / 2);

/**
 * s02-evento «Cuánto cuesta un evento». From the first frame R-014's risk line sits centred over an empty slot;
 * on `asset` the block «AV · 400.000 €» fills it («servidor + licencias + datos operativos»). The group then
 * drops and glides left (the intercepted message will own the top-centre band) and, on `adversary`,
 * PAPER GOVERNOR's tag comes in on the right. Through the intercept the whole block turns rose — his hypothesis,
 * «lo perdieras entero» — and on `ef` the quarters show; on `bite` the last quarter turns rose and leaves the
 * block to the right with «EF · 0,25 · el 25 % del valor, en un solo evento». On `sle` the equation takes the top
 * and the piece that left carries «100.000 €»; on `phone` the 400 € phone replaces the tag and its screen cracks.
 */
export function S02Evento(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const assetAt = props.cue('asset');
  const advAt = props.cue('adversary');
  const efAt = props.cue('ef');
  const biteAt = props.cue('bite');
  const sleAt = props.cue('sle');
  const phoneAt = props.cue('phone');
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);

  // ---- Risk line, block, and the group's move.
  const stripIn = progress(frame, 0, 14);
  const blockIn = progress(frame, assetAt - 10, 16);
  const move = progress(frame, advAt - 12, 28, EASE.inOut);
  const groupX = mix(GROUP_X0, 0, move);
  const groupY = mix(GROUP_Y0, GROUP_Y1, move);

  // ---- Adversary tag: in on `adversary`, steps back after the intercept, out as the phone arrives.
  const tagIn = enter(frame, advAt - 2, { distance: 26, duration: 18, axis: 'x' });
  const tagBack = 0.6 * progress(frame, sleAt, 20, EASE.inOut);
  const tagOut = progress(frame, phoneAt - 8, 14, EASE.inOut);

  // ---- The hypothesis (whole block lost), then the quarters and the bite.
  const full = windowWeight(frame, w('s02-03', 'perdieras') - 8, efAt - 2, { ramp: 12, lead: 0 });
  const marks = progress(frame, efAt, 14);
  const hot = progress(frame, biteAt - 6, 12);
  const travel = progress(frame, biteAt - 2, 28, EASE.inOut);
  const efLabelAt = Math.min(w('s02-03', 'EF') - 6, biteAt - 4);
  const efIn = enter(frame, efLabelAt, { distance: 22, duration: 16 });
  const efSub = enter(frame, biteAt + 6, { distance: 16, duration: 16 });

  // ---- SLE: the equation in three beats, the caption on «solo», the value on the piece.
  const g1 = progress(frame, sleAt, 14);
  const g2 = progress(frame, w('s02-04', 'valor') - 6, 14);
  const g3 = progress(frame, w('s02-04', 'salen') - 4, 14);
  const cap = progress(frame, w('s02-04', 'solo') - 8, 14);
  const value = progress(frame, w('s02-04', '100.000') - 4, 14);

  // ---- The phone: arrives intact, the piece pulses on «trozo», the screen cracks on «rompe».
  const phoneIn = springIn(frame, fps, phoneAt, { damping: 15 });
  const crack = progress(frame, w('s02-05', 'rompe') - 6, 22, EASE.inOut);
  const trozoAt = w('s02-05', 'trozo');
  const pieceGlow = progress(frame, trozoAt - 8, 12) * (1 - progress(frame, w('s02-05', 'pantalla') + 20, 20));
  const priceIn = enter(frame, w('s02-05', '400') - 8, { distance: 16, duration: 14 });
  const noteIn = enter(frame, w('s02-05', 'se') - 4, { distance: 14, duration: 14 });

  return (
    <Stage>
      {/* Equation, top band (from `sle`, once the intercepted message has gone) */}
      {frame >= sleAt - 2 ? (
        <div style={{ position: 'absolute', left: 0, top: 4, width: W }}>
          <Equation groups={[g1, g2, g3]} caption={cap} />
        </div>
      ) : null}

      {/* Risk line and asset block */}
      <div style={{ position: 'absolute', left: groupX, top: groupY, width: BLOCK_W, height: GROUP_H }}>
        <div style={{ position: 'absolute', left: 0, top: 0, opacity: stripIn }}>
          <RiskStrip show={stripIn} />
        </div>
        <div style={{ position: 'absolute', left: 0, top: BLOCK_Y }}>
          {blockIn < 1 ? (
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: BLOCK_W,
                height: BLOCK_H,
                boxSizing: 'border-box',
                borderRadius: 20,
                border: `3px dashed ${C.ink600}`,
                opacity: stripIn * (1 - blockIn),
              }}
            />
          ) : null}
          <AssetBlock show={blockIn} full={full} marks={marks} hot={hot} travel={travel} dx={SLICE_DX} value={value} glow={pieceGlow} />
        </div>
      </div>

      {/* PAPER GOVERNOR */}
      {frame >= advAt - 4 && tagOut < 1 ? (
        <div style={{ position: 'absolute', left: COL_X, top: GROUP_Y1, ...tagIn, ...dimStyle(tagBack, tagIn.opacity * (1 - tagOut)) }}>
          <AdversaryTag glow={full} />
        </div>
      ) : null}

      {/* The exposure factor, beside the piece that left */}
      {frame >= efLabelAt - 2 ? (
        <div style={{ position: 'absolute', left: EF_X, top: SLICE_Y, width: W - EF_X, fontFamily: FONT.sans }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, whiteSpace: 'nowrap', ...efIn }}>
            <span style={{ fontSize: 64, fontWeight: 900, letterSpacing: -1, color: '#c4b5fd' }}>EF</span>
            <span style={{ fontSize: 40, fontWeight: 700, color: C.faint }}>·</span>
            <span style={{ fontSize: 64, fontWeight: 900, letterSpacing: -1, color: C.textStrong }}>{EF.label.split('· ')[1]}</span>
          </div>
          <div style={{ marginTop: 10, fontSize: 36, fontWeight: 700, lineHeight: 1.25, color: C.text, whiteSpace: 'nowrap', ...efSub }}>
            {EF.lines.map((l) => (
              <div key={l}>{l}</div>
            ))}
          </div>
        </div>
      ) : null}

      {/* The 400 € phone: a piece of a thing, not the whole thing */}
      {phoneIn > 0.01 ? (
        <div style={{ position: 'absolute', left: PHONE_X, top: GROUP_Y1, opacity: Math.min(1, phoneIn * 1.4), transform: `translateY(${(1 - Math.min(1, phoneIn)) * 22}px)` }}>
          <Phone width={PHONE_W} crack={crack} glow={0} />
        </div>
      ) : null}
      {frame >= w('s02-05', '400') - 10 ? (
        <div style={{ position: 'absolute', left: SLICE_X + QUARTER + 36, top: GROUP_Y1 + 28, fontFamily: FONT.sans, whiteSpace: 'nowrap' }}>
          <div style={{ fontSize: 64, fontWeight: 900, letterSpacing: -1, color: C.textStrong, ...priceIn }}>
            móvil <span style={{ color: C.cyan }}>{PHONE.price}</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 36, fontWeight: 700, color: C.roseSoft, ...noteIn }}>{PHONE.note}</div>
        </div>
      ) : null}
    </Stage>
  );
}
