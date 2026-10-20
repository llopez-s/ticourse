import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon, mix } from '../../../engine/src/ui';
import { CHANNEL, COMPARE, DRIFT, EXITS, GUIDE, NEVER, NOTE, SERVERS_LABEL, TRY, VERBS } from '../data/s02-ciclo';
import { BaselineSheet, sheetBarY, sheetHeight } from './parts/BaselineSheet';
import { ImageTag, Pill } from './parts/Labels';
import { GUIDE_H, GUIDE_W, GuideCard, MINI_W, MiniPage, SLAB_H, SLAB_W, ServerSlab } from './parts/s02-ciclo/Rack';
import { SHOP_H, SHOP_W, Shopfront } from './parts/Shopfront';
import { Stage, wordFrame } from './kit';

const S = 's02-ciclo';
const W = 1728;

// ---- The server story, group-local coordinates.
const GW = 1180;
const GUIDE_POS = { x: 0, y: 76 } as const;
const SHEET_W = 320;
const SHEET = { x: 300, y: 104, h: sheetHeight(SHEET_W, 2) } as const;
const NOTE_POS = { x: 300, y: 414 } as const;
const SLABS_X = 880;
const SLABS_Y = 124;
const SLAB_STEP = SLAB_H + 12;
const N_SLABS = 5;
const DRIFT_SLAB = 2;
const MINI_X = SLABS_X + SLAB_W + 10;
const FAN_FROM = { x: SHEET.x + SHEET_W + 4, y: SHEET.y + SHEET.h / 2 } as const;
const VERB_X = [SHEET.x + SHEET_W / 2, (FAN_FROM.x + SLABS_X) / 2, SLABS_X + SLAB_W / 2];
const ROW2_Y = 414;
const GROUP_X0 = Math.round((W - GW) / 2);
/** After the glide the guide has gone and the sheet sits on the stage's left edge. */
const GROUP_X1 = -SHEET.x;
// ---- The shop window on the right (stage coordinates), the exits and «never» across the bottom.
const SHOP_X = 968;
const SHOP_WIDTH = W - SHOP_X;
const SHOP_Y = 56;
const EXIT_Y = 512;
const EXIT_GAP = 24;
const EXIT_W = (W - EXIT_GAP) / 2;
const NEVER_Y = 618;
/** Everything sits this much lower until the exits arrive, so the stage is balanced before they do. */
const DROP = 88;

/**
 * s02-ciclo «Escribirlo, imponerlo y que siga ahí». On `guide` a public guide comes in with «CIS Benchmark» and
 * «STIG»; on `adapt` the port's baseline sheet copies it and two of its lines are struck, with the note «rompería una
 * aplicación del puerto · escrito por qué»; «Establish» lands on its word. On `push` the sheet reaches every Windows
 * server at once along a fan labelled «Group Policy» (all packets arrive together) → «Deploy». On `compare` a weekly
 * comparison sweeps the servers, a mini sheet with a tick beside each → «Maintain» (the exam card comes after). On
 * `drift` one server, unnamed, switches on a service «solo para probar»; on «diferencia» its mini sheet turns amber
 * and «configuration drift» is named. On `shop` the guide steps out, the server story glides left and the shop window
 * («imagen · no es del puerto») comes in on the right: the central's photo, three identical windows, the third with a
 * moved mannequin. On `two-ways` the stage lifts and the two exits land side by side (each with its shop version, and
 * its ghost in the window or the photo); on `never` «la diferencia, viva y sin dueño» is struck in rose.
 */
export function S02Ciclo(props: SceneProps) {
  const frame = useCurrentFrame();
  const guideAt = props.cue('guide') - 4;
  const adaptAt = props.cue('adapt');
  const noteAt = wordFrame(S, 's02-01', 'rompería') - 6;
  const verbAt = VERBS.map((v) => wordFrame(S, v.seg, v.word) - 6);
  const pushAt = props.cue('push');
  const fanAt = wordFrame(S, 's02-02', 'todos') - 8;
  const compareAt = props.cue('compare');
  const driftAt = props.cue('drift');
  const onAt = wordFrame(S, 's02-04', 'enciende') - 4;
  const tryAt = wordFrame(S, 's02-04', 'probar') - 8;
  const diffAt = wordFrame(S, 's02-04', 'diferencia') - 4;
  const nameAt = wordFrame(S, 's02-04', 'configuration') - 6;
  const shopAt = props.cue('shop');
  const movedAt = wordFrame(S, 's02-05', 'movido') - 6;
  const mismatchAt = wordFrame(S, 's02-05', 'cuadra') - 4;
  const photoAt = wordFrame(S, 's02-05', 'foto') - 4;
  const twoAt = props.cue('two-ways');
  const exitAt = EXITS.map((e) => wordFrame(S, e.seg, e.word) - 6);
  const neverAt = props.cue('never');
  const strikeAt = wordFrame(S, 's02-06', 'sin') - 4;

  // ---- Group placement: the glide on `shop`, the lift on `two-ways`.
  const glide = progress(frame, shopAt - 18, 30, EASE.inOut);
  const lift = progress(frame, twoAt - 16, 24, EASE.inOut);
  const dy = DROP * (1 - lift);
  const groupX = mix(GROUP_X0, GROUP_X1, glide);

  // ---- Establish.
  const guideIn = enter(frame, guideAt, { distance: 22 });
  const chipsIn = progress(frame, wordFrame(S, 's02-01', 'CIS') - 8, 16);
  const sheetIn = enter(frame, adaptAt - 2, { distance: 18, axis: 'x' });
  const struck = [progress(frame, adaptAt + 26, 16), progress(frame, adaptAt + 40, 16)];
  const noteIn = progress(frame, noteAt, 14);
  const noteDim = progress(frame, pushAt, 20);
  const arrowIn = progress(frame, adaptAt - 4, 14);

  // ---- Deploy: the fan and its packets, all arriving together.
  const fanDraw = progress(frame, fanAt, 18);
  const packet = progress(frame, fanAt + 12, 26, EASE.inOut);
  const arrived = progress(frame, fanAt + 36, 10) * (1 - progress(frame, fanAt + 60, 20));
  const channelIn = progress(frame, wordFrame(S, 's02-02', 'Group') - 8, 14);

  // ---- Maintain: the weekly comparison.
  const sweep = progress(frame, compareAt + 4, 44, EASE.inOut);
  const miniIn = Array.from({ length: N_SLABS }, (_, i) => progress(frame, compareAt + 8 + i * 8, 10));
  const compareIn = progress(frame, compareAt, 14) * (1 - progress(frame, nameAt - 4, 12));

  // ---- Drift.
  const lightOn = progress(frame, onAt, 8);
  const tryIn = progress(frame, tryAt, 12) * (1 - progress(frame, nameAt + 30, 14));
  const flagged = progress(frame, diffAt, 12);
  const nameIn = progress(frame, nameAt, 16);

  // ---- The shop window.
  const shopIn = progress(frame, shopAt - 6, 18);
  const windowsIn = [0, 1, 2].map((i) => progress(frame, shopAt + 6 + i * 6, 14));
  const moved = progress(frame, movedAt, 18, EASE.inOut);
  const mismatch = progress(frame, mismatchAt, 12);
  const photoGlow = progress(frame, photoAt, 10) * (1 - progress(frame, photoAt + 30, 16));
  const ghostBack = progress(frame, exitAt[0] + 10, 14);
  const ghostPhoto = progress(frame, exitAt[1] + 10, 14);

  // ---- Exits and «never».
  const exitIn = exitAt.map((a) => progress(frame, a, 16));
  const exitOn = exitAt.map((a, i) => progress(frame, a, 10) * (1 - 0.5 * progress(frame, (exitAt[i + 1] ?? neverAt) - 2, 12)));
  const neverIn = progress(frame, neverAt - 2, 14);
  const strike = progress(frame, strikeAt, 16);

  const slabY = (i: number) => SLABS_Y + i * SLAB_STEP;

  return (
    <Stage>
      {/* ---------------- the server story ---------------- */}
      <div style={{ position: 'absolute', left: groupX, top: dy, width: GW, height: 500, fontFamily: FONT.sans }}>
        {/* the three verbs, over their objects */}
        {VERBS.map((v, i) => {
          if (frame < verbAt[i] - 2) return null;
          const p = progress(frame, verbAt[i], 14);
          const on = p * (1 - 0.45 * progress(frame, (verbAt[i + 1] ?? driftAt) - 2, 14));
          return (
            <div key={v.text} style={{ position: 'absolute', left: VERB_X[i], top: 0, transform: `translateX(-50%) translateY(${(1 - p) * 12}px)`, opacity: p }}>
              <Pill text={v.text} tone={C.violet} on={on} size={36} height={56} weight={850} />
            </div>
          );
        })}

        {/* the public guide */}
        {frame >= guideAt - 2 ? (
          <div style={{ position: 'absolute', left: GUIDE_POS.x, top: GUIDE_POS.y, opacity: guideIn.opacity * (1 - glide), transform: guideIn.transform }}>
            <GuideCard title={GUIDE.title} chips={GUIDE.chips} chipsIn={chipsIn} dim={progress(frame, adaptAt + 20, 20)} />
          </div>
        ) : null}

        <svg width={GW} height={500} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          {/* guide → sheet */}
          {arrowIn > 0.01 ? (
            <g opacity={arrowIn * (1 - glide)} stroke={C.sky} strokeWidth={4} strokeLinecap="round" fill="none">
              <line x1={GUIDE_W + 8} y1={GUIDE_POS.y + GUIDE_H / 2} x2={SHEET.x - 12} y2={GUIDE_POS.y + GUIDE_H / 2} />
              <path d={`M ${SHEET.x - 24} ${GUIDE_POS.y + GUIDE_H / 2 - 11} L ${SHEET.x - 12} ${GUIDE_POS.y + GUIDE_H / 2} L ${SHEET.x - 24} ${GUIDE_POS.y + GUIDE_H / 2 + 11}`} />
            </g>
          ) : null}
          {/* the note's leader to the struck lines */}
          {noteIn > 0.01 ? (
            <line
              x1={SHEET.x + 26}
              y1={SHEET.y + sheetBarY(SHEET_W, 1) + 16}
              x2={SHEET.x + 26}
              y2={NOTE_POS.y}
              stroke={alpha(C.amber, 0.7 * (1 - 0.5 * noteDim))}
              strokeWidth={3}
              strokeDasharray="5 6"
              opacity={noteIn}
            />
          ) : null}
          {/* the Group Policy fan: one line per server, all at once */}
          {fanDraw > 0.01
            ? Array.from({ length: N_SLABS }, (_, i) => {
                const to = { x: SLABS_X - 6, y: slabY(i) + SLAB_H / 2 };
                const cx = (FAN_FROM.x + to.x) / 2;
                const d = `M ${FAN_FROM.x} ${FAN_FROM.y} C ${cx} ${FAN_FROM.y}, ${cx} ${to.y}, ${to.x} ${to.y}`;
                // A packet on the same cubic, at parameter `packet`.
                const t = packet;
                const bx = (1 - t) ** 3 * FAN_FROM.x + 3 * (1 - t) ** 2 * t * cx + 3 * (1 - t) * t ** 2 * cx + t ** 3 * to.x;
                const by = (1 - t) ** 3 * FAN_FROM.y + 3 * (1 - t) ** 2 * t * FAN_FROM.y + 3 * (1 - t) * t ** 2 * to.y + t ** 3 * to.y;
                return (
                  <g key={i}>
                    <path d={d} fill="none" stroke={alpha(C.sky, 0.6)} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - fanDraw} />
                    {packet > 0.01 && packet < 0.999 ? <rect x={bx - 13} y={by - 16} width={26} height={32} rx={4} fill="#dbe4f0" stroke={C.cyan} strokeWidth={2.5} /> : null}
                  </g>
                );
              })
            : null}
          {/* the weekly comparison's sweep */}
          {sweep > 0.01 && sweep < 0.999 ? (
            <rect x={SLABS_X - 10} y={SLABS_Y - 10 + sweep * (N_SLABS * SLAB_STEP)} width={SLAB_W + MINI_W + 30} height={6} rx={3} fill={C.emerald} opacity={0.8} />
          ) : null}
        </svg>

        {/* the port's baseline sheet */}
        {frame >= adaptAt - 4 ? (
          <div style={{ position: 'absolute', left: SHEET.x, top: SHEET.y, ...sheetIn }}>
            <BaselineSheet width={SHEET_W} bars={2} struck={struck} glow={0.25 + 0.6 * arrived} />
          </div>
        ) : null}

        {/* the note: why two lines went */}
        {noteIn > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: NOTE_POS.x,
              top: NOTE_POS.y,
              padding: '6px 20px',
              borderRadius: RADIUS.md,
              borderLeft: `5px solid ${C.amber}`,
              background: alpha(C.amber, 0.1),
              fontSize: 32,
              fontWeight: 700,
              lineHeight: 1.18,
              color: C.textStrong,
              whiteSpace: 'nowrap',
              opacity: noteIn * (1 - 0.45 * noteDim) * (1 - 0.6 * lift),
              transform: `translateY(${(1 - noteIn) * 10}px)`,
            }}
          >
            {NOTE.map((l) => (
              <div key={l}>{l}</div>
            ))}
          </div>
        ) : null}

        {/* the channel's name */}
        {channelIn > 0.01 ? (
          <div style={{ position: 'absolute', left: VERB_X[1], top: 66, transform: 'translateX(-50%)', opacity: channelIn }}>
            <Pill text={CHANNEL} tone={C.sky} size={28} height={46} on={0.6 + 0.4 * arrived} style={{ padding: '0 20px' }} />
          </div>
        ) : null}

        {/* the Windows servers */}
        {frame >= pushAt - 8 ? (
          <div style={{ position: 'absolute', left: SLABS_X, top: SLABS_Y - 44, fontSize: 30, fontWeight: 750, color: C.cyanSoft, whiteSpace: 'nowrap', opacity: progress(frame, pushAt - 6, 14) }}>
            {SERVERS_LABEL}
          </div>
        ) : null}
        {Array.from({ length: N_SLABS }, (_, i) => {
          const at = pushAt - 6 + i * 3;
          if (frame < at - 2) return null;
          const p = progress(frame, at, 14);
          const isDrift = i === DRIFT_SLAB;
          const tone = isDrift && flagged > 0.5 ? C.amber : C.cyan;
          const light = isDrift && lightOn > 0.5 ? C.amber : miniIn[i] > 0.5 ? C.emerald : alpha(C.cyan, 0.6);
          return (
            <div key={i} style={{ position: 'absolute', left: SLABS_X, top: slabY(i), opacity: p, transform: `translateX(${(1 - p) * 16}px)` }}>
              <ServerSlab tone={tone} light={light} lit={isDrift ? Math.max(arrived, flagged) : arrived} />
            </div>
          );
        })}
        {/* each server beside its paper */}
        {Array.from({ length: N_SLABS }, (_, i) => (
          <div key={i} style={{ position: 'absolute', left: MINI_X, top: slabY(i) }}>
            <MiniPage verdict={i === DRIFT_SLAB && flagged > 0.5 ? 'drift' : 'ok'} show={miniIn[i]} />
          </div>
        ))}
        {/* «solo para probar», on the drifting server */}
        {tryIn > 0.01 ? (
          <div style={{ position: 'absolute', left: SLABS_X + SLAB_W / 2, top: slabY(DRIFT_SLAB) + SLAB_H / 2, transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * tryIn})`, opacity: tryIn }}>
            <Pill text={TRY} tone={C.amber} icon="power" size={28} height={46} on={1} style={{ background: alpha(C.ink900, 0.94) }} />
          </div>
        ) : null}
        {/* the weekly comparison's name, then the drift's */}
        {compareIn > 0.01 ? (
          <div style={{ position: 'absolute', left: SLABS_X, top: ROW2_Y, opacity: compareIn }}>
            <Pill text={COMPARE} tone={C.emerald} icon="search" size={30} height={48} on={0.6} />
          </div>
        ) : null}
        {nameIn > 0.01 ? (
          <div
            style={{
              position: 'absolute',
              left: SLABS_X - 30,
              top: ROW2_Y - 4,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              fontSize: 40,
              fontWeight: 850,
              color: C.amber,
              whiteSpace: 'nowrap',
              opacity: nameIn,
              transform: `translateY(${(1 - nameIn) * 12}px)`,
              textShadow: `0 0 24px ${alpha(C.amber, 0.35)}`,
            }}
          >
            <Icon name="alert" size={40} color={C.amber} strokeWidth={2.4} />
            {DRIFT}
          </div>
        ) : null}
      </div>

      {/* ---------------- the shop window ---------------- */}
      {shopIn > 0.01 ? (
        <div style={{ position: 'absolute', left: SHOP_X, top: dy, opacity: shopIn, transform: `translateX(${(1 - shopIn) * 30}px)` }}>
          <ImageTag />
          <div style={{ position: 'absolute', left: 0, top: SHOP_Y, width: SHOP_WIDTH, height: (SHOP_H * SHOP_WIDTH) / SHOP_W, filter: photoGlow > 0.01 ? `drop-shadow(0 0 ${16 * photoGlow}px ${alpha(C.violet, 0.5)})` : undefined }}>
            <Shopfront width={SHOP_WIDTH} windowsIn={windowsIn} moved={moved} mismatch={mismatch} ghostBack={ghostBack} ghostPhoto={ghostPhoto} />
          </div>
        </div>
      ) : null}

      {/* ---------------- the two exits ---------------- */}
      {EXITS.map((e, i) => {
        if (exitIn[i] < 0.01) return null;
        const tone = i === 0 ? C.emerald : C.violet;
        return (
          <div
            key={e.title}
            style={{
              position: 'absolute',
              left: i * (EXIT_W + EXIT_GAP),
              top: EXIT_Y,
              width: EXIT_W,
              height: 92,
              boxSizing: 'border-box',
              padding: '8px 24px',
              borderRadius: RADIUS.lg,
              border: `${exitOn[i] > 0.5 ? 3 : 2}px solid ${alpha(tone, 0.4 + 0.5 * exitOn[i])}`,
              background: alpha(tone, 0.06 + 0.08 * exitOn[i]),
              boxShadow: exitOn[i] > 0.05 ? `0 0 ${Math.round(26 * exitOn[i])}px ${alpha(tone, 0.25 * exitOn[i])}` : undefined,
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              fontFamily: FONT.sans,
              opacity: exitIn[i],
              transform: `translateY(${(1 - exitIn[i]) * 16}px)`,
            }}
          >
            <div style={{ width: 52, height: 52, borderRadius: 26, display: 'grid', placeItems: 'center', background: alpha(tone, 0.18), border: `2px solid ${tone}`, flexShrink: 0 }}>
              <Icon name={i === 0 ? 'server' : 'file'} size={30} color={tone} />
            </div>
            <div style={{ whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.12, color: C.textStrong }}>{e.title}</div>
              <div style={{ fontSize: 28, fontWeight: 650, lineHeight: 1.2, color: i === 0 ? '#6ee7b7' : '#c4b5fd' }}>{e.sub}</div>
            </div>
          </div>
        );
      })}

      {/* ---------------- what never counts ---------------- */}
      {neverIn > 0.01 ? (
        <div style={{ position: 'absolute', left: 0, top: NEVER_Y, width: W, display: 'flex', justifyContent: 'center', opacity: neverIn, transform: `translateY(${(1 - neverIn) * 10}px)` }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT.sans, fontSize: 36, fontWeight: 800, color: C.roseSoft, whiteSpace: 'nowrap' }}>
            <Icon name="x" size={36} color={C.rose} strokeWidth={2.6} />
            <span style={{ position: 'relative' }}>
              {NEVER}
              <span style={{ position: 'absolute', left: -6, top: '52%', height: 5, width: `calc(${strike * 100}% + 12px)`, borderRadius: 3, background: C.rose }} />
            </span>
          </div>
        </div>
      ) : null}
    </Stage>
  );
}
