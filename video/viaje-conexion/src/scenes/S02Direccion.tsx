import type { ReactElement } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui/Icon';
import { dimStyle } from '../../../engine/src/ui';
import { Stage, wordFrame } from './kit';
import { Addr, addrLayout } from './parts/Addr';
import { Calle, CALLE_W } from './parts/Calle';
import { LAPTOP } from './parts/data';
import { DeviceTile, Parcel } from './parts/Glyphs';
import { Label } from './parts/Label';
import { CaseStamp, ImageTag, Line } from './parts/Marks';

const S = 's02-direccion';
const W = STAGE.width;
const SIZE = 88;
const ADDR_Y = 56;
const LAY = addrLayout(LAPTOP.ip, SIZE, LAPTOP.prefix);
const ROW_TICKS = 322;
const TICK_H = 46;

/** 32 bits as four groups of eight ticks under the four numbers; the first 24 light cyan, the last 8 amber. */
function Bits({ show, lit, host }: { show: number; lit: number; host: number }) {
  const out: ReactElement[] = [];
  LAY.cells.forEach((cell, g) => {
    const x0 = cell.x + 8;
    const step = (cell.w - 16) / 8;
    for (let b = 0; b < 8; b++) {
      const idx = g * 8 + b;
      const net = idx < 24;
      const on = net ? progress(lit * 24, idx, 1) : host;
      const col = net ? C.cyan : C.amber;
      out.push(
        <rect
          key={idx}
          x={x0 + b * step + step * 0.18}
          y={0}
          width={step * 0.64}
          height={TICK_H}
          rx={4}
          fill={on > 0.02 ? alpha(col, 0.35 + 0.65 * on) : alpha(C.ink500, 0.8)}
          style={{ filter: on > 0.5 ? `drop-shadow(0 0 6px ${alpha(col, 0.7)})` : undefined }}
        />,
      );
    }
  });
  return (
    <svg width={LAY.cells[3].x + LAY.cells[3].w} height={TICK_H} style={{ position: 'absolute', left: 0, top: ROW_TICKS, opacity: show, overflow: 'visible' }}>
      {out}
    </svg>
  );
}

/** A bracket under cells [a..b] with a caption below it. */
function Bracket({ a, b, color, text, p, size = 36 }: { a: number; b: number; color: string; text: string; p: number; size?: number }) {
  const x0 = LAY.cells[a].x;
  const x1 = LAY.cells[b].x + LAY.cells[b].w;
  return (
    <div style={{ position: 'absolute', left: x0, width: x1 - x0, top: 0, opacity: p, transform: `translateY(${Math.round((1 - p) * 10)}px)` }}>
      <div style={{ height: 10, borderLeft: `4px solid ${color}`, borderRight: `4px solid ${color}`, borderBottom: `4px solid ${color}`, borderRadius: '0 0 8px 8px' }} />
      <div style={{ marginTop: 6, fontFamily: FONT.sans, fontSize: size, fontWeight: 750, color, whiteSpace: 'nowrap', textAlign: a === b ? 'left' : 'center' }}>{text}</div>
    </div>
  );
}

/**
 * s02-direccion «Una dirección con dos partes». The laptop's address in big cells; on `nums` each number gets
 * its frame, on `parts` the three first numbers turn cyan («la red · la calle») and the last amber («el
 * equipo · el número») while the street on the right lights its name and one house; on `prefix` the ruler
 * «/24 = 24 bits = 3 números × 8 bits» comes in; on `bits` 32 ticks show in four groups of eight and on
 * `network` the first 24 light; on `packet` a parcel leaves the laptop and the empty five-box label draws
 * itself for the first time (always drawn the same).
 */
export function S02Direccion(props: SceneProps) {
  const frame = useCurrentFrame();
  const addressAt = props.cue('address');
  const numsAt = props.cue('nums');
  const partsAt = props.cue('parts');
  const prefixAt = props.cue('prefix');
  const bitsAt = props.cue('bits');
  const packetAt = props.cue('packet');

  const addrIn = enter(frame, addressAt - 2, { distance: 22, duration: 22 });
  // numbers framed one by one, frames fade as the tints take over
  const framed = [0, 1, 2, 3].map((i) => progress(frame, numsAt + 2 + i * 17, 8) * (1 - progress(frame, partsAt - 4, 12)));
  const netAt = wordFrame(S, 's02-03', 'Una') - 2;
  const hostAt = wordFrame(S, 's02-03', 'otra') - 2;
  const net = progress(frame, netAt, 12);
  const host = progress(frame, hostAt, 12);
  const streetLit = progress(frame, wordFrame(S, 's02-03', 'calle') - 6, 12);
  const houseLit = progress(frame, wordFrame(S, 's02-03', 'edificio') - 6, 12);
  const prefixFrame = progress(frame, prefixAt - 2, 10);
  const ruler = enter(frame, prefixAt + 4, { distance: 18 });
  const bitsShow = progress(frame, bitsAt - 2, 16);
  const litAt = wordFrame(S, 's02-06', 'veinticuatro') - 2;
  const lit = progress(frame, litAt, 36, EASE.linear);
  const hostBits = progress(frame, litAt + 44, 12);
  const redP = progress(frame, litAt + 36, 12);
  const lastP = progress(frame, wordFrame(S, 's02-06', 'último') - 4, 12);

  // the packet leaves: the rest steps back
  const back = progress(frame, packetAt - 6, 16) * 0.62;
  const parcelX = 20 + 150 * progress(frame, packetAt, 26, EASE.inOut);
  const labelAt = wordFrame(S, 's02-07', 'etiqueta') - 6;
  const labelP = progress(frame, labelAt, 16);

  return (
    <>
      <Stage>
        <div style={dimStyle(back)}>
          {/* whose address it is */}
          <div style={{ position: 'absolute', left: 0, top: 0, display: 'flex', alignItems: 'center', gap: 14, opacity: progress(frame, addressAt - 4, 14) }}>
            <Icon name="laptop" size={44} color={C.cyan} />
            <Line size={34} color={C.muted} weight={650}>
              dirección IP de tu portátil
            </Line>
          </div>
          {/* the address */}
          <div style={{ position: 'absolute', left: 0, top: ADDR_Y, ...addrIn }}>
            <Addr ip={LAPTOP.ip} prefix={LAPTOP.prefix} size={SIZE} frame={framed} tints={[net > 0.5 ? 'cyan' : null, net > 0.5 ? 'cyan' : null, net > 0.5 ? 'cyan' : null, host > 0.5 ? 'amber' : null]} prefixFrame={prefixFrame} />
          </div>
          {/* the two parts */}
          <div style={{ position: 'absolute', left: 0, top: ADDR_Y + SIZE * 1.18 + 10 }}>
            <Bracket a={0} b={2} color={C.cyan} text="la red · la calle" p={net} />
            <Bracket a={3} b={3} color={C.amber} text="el equipo · el número" p={host} size={34} />
          </div>
          {/* prefix ruler */}
          {frame >= prefixAt ? (
            <div style={{ position: 'absolute', left: 0, top: 262, ...ruler }}>
              <Line size={44} color={C.text} weight={750} style={{ fontFamily: FONT.mono }}>
                /24 = 24 bits = 3 números × 8 bits
              </Line>
            </div>
          ) : null}
          {/* the bits */}
          <Bits show={bitsShow} lit={lit} host={hostBits} />
          <div style={{ position: 'absolute', left: 0, top: ROW_TICKS + TICK_H + 8 }}>
            <Bracket a={0} b={2} color={C.cyan} text="esa es la red" p={redP} />
            <Bracket a={3} b={3} color={C.amber} text="el último, tu portátil" p={lastP} size={34} />
          </div>
        </div>

        {/* the street */}
        <div style={{ position: 'absolute', left: W - CALLE_W, top: 40, ...dimStyle(back, progress(frame, partsAt - 12, 16)) }}>
          <Calle streetLit={streetLit} houseLit={houseLit} />
          <div style={{ marginTop: 6 }}>
            <ImageTag />
          </div>
        </div>

        {/* the packet and its empty label */}
        {frame >= packetAt - 2 ? (
          <>
            <div style={{ position: 'absolute', left: 0, top: 494, opacity: progress(frame, packetAt - 6, 12) }}>
              <DeviceTile kind="laptop" tile={92} name="portátil" nameSize={28} />
            </div>
            <div style={{ position: 'absolute', left: parcelX, top: 504, opacity: progress(frame, packetAt, 10) }}>
              <Parcel width={104} glow={0.3} />
            </div>
            <div style={{ position: 'absolute', left: 300, top: 478, opacity: labelP, transform: `translateX(${Math.round((1 - labelP) * -26)}px)` }}>
              <Label scale={0.96} reveal={0} />
            </div>
          </>
        ) : null}
      </Stage>
      <CaseStamp scene={S} />
    </>
  );
}
