import type { CSSProperties, ReactNode } from 'react';
import { C, FONT, RADIUS, alpha } from '../../../../engine/src/theme/tokens';
import { Icon, clamp01 } from '../../../../engine/src/ui';

/**
 * The shipping company's office in F1's plan, left to right: office (laptop, printer, file server) · router ·
 * cloud «Internet» · portal «Autoridad Portuaria de Halden · portal de reservas». Same order and same labels as F1;
 * F2 only shows it once (s01 `office`, «Acabas de encender el portátil») and never repeats F1's walk through it.
 * `PLAN_W × PLAN_H` is the box. `show` = per block 0–1; `power` 0–1 lights the laptop (the power-up).
 * Nothing in the port's internal network is drawn. Not positioned.
 */
export const PLAN_W = 1280;
export const PLAN_H = 470;

type Blocks = { office?: number; router?: number; cloud?: number; portal?: number };

function Block({ x, y, w, h, show = 1, children, style }: { x: number; y: number; w: number; h: number; show?: number; children: ReactNode; style?: CSSProperties }) {
  const s = clamp01(show);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, opacity: s, transform: `translateY(${(1 - s) * 14}px)`, ...style }}>{children}</div>
  );
}

const Label = ({ children, size = 28, color = C.text }: { children: ReactNode; size?: number; color?: string }) => (
  <div style={{ fontFamily: FONT.sans, fontSize: size, fontWeight: 700, color, textAlign: 'center', lineHeight: 1.15 }}>{children}</div>
);

function PrinterGlyph({ size = 60, color = C.muted }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x={6.5} y={3} width={11} height={5.5} rx={1} />
      <rect x={3} y={8.5} width={18} height={8} rx={2} />
      <rect x={7} y={14} width={10} height={7} rx={1} />
    </svg>
  );
}

export function OfficePlan({ show = {}, power = 0, style }: { show?: Blocks; power?: number; style?: CSSProperties }) {
  const o = show.office ?? 1;
  const r = show.router ?? 1;
  const c = show.cloud ?? 1;
  const p = show.portal ?? 1;
  const pw = clamp01(power);
  const line = (x1: number, x2: number, on: number) => (
    <svg width={PLAN_W} height={PLAN_H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: clamp01(on) }}>
      <line x1={x1} y1={200} x2={x2} y2={200} stroke={C.ink500} strokeWidth={4} strokeDasharray="4 10" strokeLinecap="round" />
    </svg>
  );
  return (
    <div style={{ position: 'relative', width: PLAN_W, height: PLAN_H, fontFamily: FONT.sans, ...style }}>
      {line(430, 520, Math.min(o, r))}
      {line(640, 760, Math.min(r, c))}
      {line(1020, 1110, Math.min(c, p))}

      {/* office */}
      <Block x={0} y={0} w={430} h={430} show={o}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: RADIUS.lg, border: `3px dashed ${alpha(C.cyan, 0.55)}`, background: alpha(C.cyan, 0.04) }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 30, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ filter: pw > 0.01 ? `drop-shadow(0 0 ${Math.round(24 * pw)}px ${alpha(C.cyan, 0.8 * pw)})` : undefined }}>
            <Icon name="laptop" size={150} color={pw > 0.3 ? C.cyan : C.muted} strokeWidth={1.5} />
          </div>
          <Label color={C.cyanSoft} size={32}>
            portátil
          </Label>
        </div>
        <div style={{ position: 'absolute', left: 36, bottom: 62, width: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <PrinterGlyph size={70} />
          <Label size={26} color={C.muted}>
            impresora
          </Label>
        </div>
        <div style={{ position: 'absolute', right: 26, bottom: 62, width: 190, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <Icon name="server" size={70} color={C.muted} />
          <Label size={26} color={C.muted}>
            servidor de ficheros
          </Label>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: -52, textAlign: 'center' }}>
          <Label size={32}>oficina de la naviera</Label>
        </div>
      </Block>

      {/* router */}
      <Block x={520} y={130} w={120} h={170} show={r}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <Icon name="router" size={104} color={C.sky} strokeWidth={1.6} />
          <Label>router</Label>
        </div>
      </Block>

      {/* cloud */}
      <Block x={760} y={90} w={260} h={250} show={c}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <Icon name="cloud" size={190} color={C.sky} strokeWidth={1.3} />
          <Label color={C.cyanSoft} size={32}>
            Internet
          </Label>
        </div>
      </Block>

      {/* portal */}
      <Block x={1110} y={110} w={170} h={330} show={p}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <Icon name="server" size={110} color={C.sky} strokeWidth={1.5} />
          <Label size={28}>portal de reservas</Label>
          <Label size={24} color={C.muted}>
            Autoridad Portuaria de Halden
          </Label>
        </div>
      </Block>
    </div>
  );
}
