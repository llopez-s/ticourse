import type { ReactNode } from 'react';
import { C, FONT, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../engine/src/ui';
import { CHECKS, REQUEST, type StampKind } from '../../data/canon';
import { CheckBox, ReqStamp } from './Marks';

/** The sheet's own units; `width` scales it. */
export const SHEET = { w: 640, h: 440 } as const;

/** A grey bar standing in for a word (mini mode: no readable text). */
function Bar({ w, h = 18, tone = C.muted, o = 0.45 }: { w: number; h?: number; tone?: string; o?: number }) {
  return <span style={{ display: 'block', width: w, height: h, borderRadius: h / 2, background: alpha(tone, o) }} />;
}

/** Text in full mode, a bar of about the same width in mini mode. */
function T({ mini, w, h, children, tone }: { mini: boolean; w: number; h?: number; children: ReactNode; tone?: string }) {
  return mini ? <Bar w={w} h={h} tone={tone} /> : <>{children}</>;
}

/**
 * The change request, the video's thread: «PETICIÓN DE CAMBIO», its title «Poner al día las carpetas compartidas de las
 * oficinas», the owner row, the three boxes (IMPACT ANALYSIS · PRUEBAS · BACKOUT PLAN) that take a tick — never a
 * padlock — and the stamp («sin firmar», «CAB · firmado», «comprobado», «cerrado»). `mini` swaps every word for a bar,
 * for the question backgrounds and small icons.
 */
export function RequestSheet({
  width = SHEET.w,
  mini = false,
  owner = 0,
  checks = [0, 0, 0],
  focus = -1,
  stamp,
  stampDrop = 1,
  glow = 0,
}: {
  width?: number;
  mini?: boolean;
  /** 0–1: the owner row is filled in («Sistemas»). */
  owner?: number;
  checks?: readonly [number, number, number];
  /** Index of the box the voice is on (its row glows). */
  focus?: number;
  stamp?: StampKind;
  stampDrop?: number;
  /** 0–1 cyan glow around the whole sheet. */
  glow?: number;
}) {
  const k = width / SHEET.w;
  const g = clamp01(glow);
  return (
    <div style={{ position: 'relative', width, height: SHEET.h * k }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: SHEET.w,
          height: SHEET.h,
          transform: `scale(${k})`,
          transformOrigin: '0 0',
          boxSizing: 'border-box',
          padding: '26px 32px',
          borderRadius: 24,
          background: `linear-gradient(180deg, ${C.ink800} 0%, ${C.ink850} 100%)`,
          border: `3px solid ${alpha(C.cyan, 0.45 + 0.4 * g)}`,
          boxShadow: `0 24px 60px ${alpha('#000000', 0.4)}, 0 0 ${Math.round(40 * g)}px ${alpha(C.cyan, 0.25 * g)}`,
          fontFamily: FONT.sans,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 30 }}>
          <Icon name="file" size={28} color={C.cyan} />
          <T mini={mini} w={250} h={16} tone={C.cyan}>
            <span style={{ fontSize: 23, fontWeight: 850, letterSpacing: 4, color: C.cyanSoft }}>{REQUEST.kicker}</span>
          </T>
        </div>
        <div style={{ marginTop: 16, height: 84, display: 'flex', flexDirection: 'column', gap: mini ? 16 : 0, justifyContent: 'center' }}>
          {REQUEST.title.map((line, i) => (
            <T key={line} mini={mini} w={i === 0 ? 460 : 500} h={24} tone={C.text}>
              <div style={{ fontSize: 35, fontWeight: 850, lineHeight: 1.18, color: C.textStrong, whiteSpace: 'nowrap', letterSpacing: -0.5 }}>{line}</div>
            </T>
          ))}
        </div>
        <div style={{ marginTop: 16, height: 2, background: alpha(C.cyan, 0.25) }} />
        <div style={{ marginTop: 16, height: 40, display: 'flex', alignItems: 'center', gap: 14 }}>
          <T mini={mini} w={190} h={16}>
            <span style={{ fontSize: 25, fontWeight: 650, color: C.muted, whiteSpace: 'nowrap' }}>{REQUEST.owner}</span>
          </T>
          <div style={{ position: 'relative', flex: 1, height: 40, borderBottom: `2px dashed ${alpha(C.muted, 0.5)}` }}>
            <div style={{ position: 'absolute', left: 8, top: 2, display: 'flex', alignItems: 'center', gap: 10, opacity: clamp01(owner) }}>
              <Icon name="user" size={30} color={C.cyan} />
              <T mini={mini} w={110} h={16} tone={C.cyan}>
                <span style={{ fontSize: 27, fontWeight: 800, color: C.cyanSoft }}>{REQUEST.ownerArea}</span>
              </T>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CHECKS.map((c, i) => (
            <div key={c.term} style={{ display: 'flex', alignItems: 'center', gap: 16, height: 44, opacity: focus >= 0 && focus !== i ? 0.6 : 1 }}>
              <CheckBox size={40} tick={checks[i]} glow={focus === i ? 1 : 0} />
              <T mini={mini} w={[230, 140, 200][i]} h={18} tone="#c4b5fd">
                <span style={{ fontSize: 27, fontWeight: 850, letterSpacing: 1, color: '#c4b5fd', whiteSpace: 'nowrap' }}>{c.term}</span>
              </T>
            </div>
          ))}
        </div>
        {stamp ? (
          <div style={{ position: 'absolute', right: 26, bottom: 40 }}>
            <ReqStamp kind={stamp} drop={stampDrop} size={30} mini={mini} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
