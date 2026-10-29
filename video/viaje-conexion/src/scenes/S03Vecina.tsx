import type { ReactNode } from 'react';
import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, STAGE } from '../../../engine/src/theme/tokens';
import { EASE, enter, progress, pulse } from '../../../engine/src/theme/motion';
import { Chip } from '../../../engine/src/ui/Chip';
import { Stage, wordFrame } from './kit';
import { Addr, addrLayout } from './parts/Addr';
import { Calle } from './parts/Calle';
import { LAPTOP, PRINTER, PRIVATE_RANGES, SERVER } from './parts/data';
import { DeviceTile, Parcel } from './parts/Glyphs';
import { CaseStamp, ImageTag, Line } from './parts/Marks';
import type { Accent } from '../../../engine/src/theme/tokens';

const S = 's03-vecina';
const W = STAGE.width;
const ROW0 = 252;
const ROW_STEP = 132;
const SIZE = 50;
const ADDR_X = 620;
const LAY = addrLayout(LAPTOP.ip, SIZE, LAPTOP.prefix);
const STREET_W = 500;

type Tints = (Accent | null)[];

function Row({ y, show, kind, name, ip, tints, glow = 0, children, below }: { y: number; show: number; kind: 'laptop' | 'printer' | 'server'; name: string; ip: string; tints: Tints; glow?: number; children?: ReactNode; below?: ReactNode }) {
  return (
    <div style={{ position: 'absolute', left: 0, top: y, width: 1150, height: ROW_STEP - 10, opacity: show, transform: `translateY(${Math.round((1 - show) * 18)}px)` }}>
      <DeviceTile kind={kind} tile={84} glow={glow} style={{ position: 'absolute', left: 0, top: 10 }} />
      <div style={{ position: 'absolute', left: 106, top: 6, fontFamily: FONT.sans, fontSize: 36, fontWeight: 750, color: C.textStrong, whiteSpace: 'nowrap' }}>{name}</div>
      <div style={{ position: 'absolute', left: 106, top: 58, display: 'flex', gap: 12, alignItems: 'center' }}>{children}</div>
      <div style={{ position: 'absolute', left: ADDR_X, top: 14 }}>
        <Addr ip={ip} prefix={24} size={SIZE} tints={tints} />
      </div>
      {below}
    </div>
  );
}

/** A caption under a run of cells of the address (stage-local to the row). */
function Under({ a, b, color, text, p }: { a: number; b: number; color: string; text: string; p: number }) {
  const x0 = ADDR_X + LAY.cells[a].x;
  const x1 = ADDR_X + LAY.cells[b].x + LAY.cells[b].w;
  return (
    <div style={{ position: 'absolute', left: x0, width: x1 - x0, top: 82, opacity: p, textAlign: 'center' }}>
      <div style={{ borderTop: `4px solid ${color}`, borderRadius: 2 }} />
      <div style={{ marginTop: 4, fontFamily: FONT.sans, fontSize: 28, fontWeight: 750, color, whiteSpace: 'nowrap' }}>{text}</div>
    </div>
  );
}

/**
 * s03-vecina «¿Vecina o no?». Three rows keep the three first numbers aligned: the laptop, the printer
 * (same three numbers: chip «misma red» and a parcel handed over directly, no router) and the file server
 * (two numbers match, the third differs). The think pause keeps the top-centre band clear: «Sí» / «No»
 * sit at the top-right, the server's «¿misma red?» blinks in its row. On `answer` the street splits in two;
 * on `rule` the rule line comes in; on `private` the chip, the three ranges and «dentro sí · por Internet no».
 */
export function S03Vecina(props: SceneProps) {
  const frame = useCurrentFrame();
  const printerAt = props.cue('printer');
  const directAt = props.cue('direct');
  const serverAt = props.cue('server');
  const answerAt = props.cue('answer');
  const ruleAt = props.cue('rule');
  const privateAt = props.cue('private');

  const row1 = progress(frame, printerAt - 4, 16);
  const row2 = progress(frame, serverAt - 4, 16);
  const sameAt = wordFrame(S, 's03-01', 'mismos') - 4;
  const same = progress(frame, sameAt, 12);
  const tintsLaptop: Tints = [same > 0.5 ? 'cyan' : null, same > 0.5 ? 'cyan' : null, same > 0.5 ? 'cyan' : null, null];
  const tintsPrinter: Tints = [same > 0.5 ? 'cyan' : null, same > 0.5 ? 'cyan' : null, same > 0.5 ? 'cyan' : null, null];
  const firstTwoAt = wordFrame(S, 's03-03', 'primeros') - 4;
  const firstTwo = progress(frame, firstTwoAt, 12);
  const thirdAt = wordFrame(S, 's03-04', 'tercero') - 4;
  const third = progress(frame, thirdAt, 12);
  const tintsServer: Tints = [firstTwo > 0.5 ? 'cyan' : null, firstTwo > 0.5 ? 'cyan' : null, third > 0.5 ? 'amber' : null, null];

  // the parcel handed over directly (a short hop down the left gutter, no router)
  const handY = 346 + 46 * progress(frame, directAt - 2, 30, EASE.inOut);
  const hand = progress(frame, directAt - 6, 8) * (1 - progress(frame, directAt + 52, 12));
  const sameChip = progress(frame, sameAt + 6, 12);
  const directChip = progress(frame, directAt + 8, 12);

  // the think pause: options at the top right, the server blinks «¿misma red?»
  const optAt = wordFrame(S, 's03-03', 'red') - 2;
  const opts = progress(frame, optAt, 12) * (1 - progress(frame, answerAt - 4, 10));
  const blink = 0.55 + 0.45 * pulse(frame, 30, 0.8);
  const askChip = progress(frame, serverAt + 6, 12) * (1 - progress(frame, answerAt, 10));

  // street, rule, private
  const split = progress(frame, answerAt + 12, 44, EASE.inOut);
  const streetIn = progress(frame, printerAt - 10, 18);
  const ruleIn = enter(frame, ruleAt - 2, { distance: 16 });
  const ruleOut = 1 - progress(frame, privateAt - 8, 12);
  const privIn = enter(frame, privateAt - 2, { distance: 16 });
  const rangesIn = progress(frame, privateAt + 14, 14);
  const insideIn = progress(frame, wordFrame(S, 's03-06', 'Internet') - 6, 14);

  return (
    <>
      <Stage>
        {/* rows */}
        <Row y={ROW0} show={1} kind="laptop" name={LAPTOP.name} ip={LAPTOP.ip} tints={tintsLaptop} />
        <Row
          y={ROW0 + ROW_STEP}
          show={row1}
          kind="printer"
          name={PRINTER.name}
          ip={PRINTER.ip}
          tints={tintsPrinter}
          glow={same * 0.5}
        >
          <div style={{ opacity: sameChip }}>
            <Chip accent="cyan" icon="check" size={28}>
              misma red
            </Chip>
          </div>
          <div style={{ opacity: directChip }}>
            <Chip accent="emerald" size={26}>
              entrega directa
            </Chip>
          </div>
        </Row>
        <Row
          y={ROW0 + ROW_STEP * 2}
          show={row2}
          kind="server"
          name={SERVER.name}
          ip={SERVER.ip}
          tints={tintsServer}
          glow={askChip * 0.6}
          below={
            <>
              <Under a={0} b={1} color={C.cyan} text="coinciden" p={firstTwo} />
              <Under a={2} b={2} color={C.amber} text="distinto" p={third} />
            </>
          }
        >
          <div style={{ opacity: askChip * blink }}>
            <Chip accent="amber" size={30}>
              ¿misma red?
            </Chip>
          </div>
        </Row>
        {/* the parcel between laptop and printer */}
        {hand > 0.01 ? (
          <div style={{ position: 'absolute', left: 42 - 22, top: handY, opacity: hand }}>
            <Parcel width={44} glow={0.5} />
          </div>
        ) : null}

        {/* Sí / No while the card asks */}
        {opts > 0.01 ? (
          <div style={{ position: 'absolute', left: 1370, top: 168, display: 'flex', gap: 18, opacity: opts }}>
            <Chip accent="emerald" size={44} style={{ minWidth: 120, justifyContent: 'center' }}>
              Sí
            </Chip>
            <Chip accent="amber" size={44} style={{ minWidth: 120, justifyContent: 'center' }}>
              No
            </Chip>
          </div>
        ) : null}

        {/* the street */}
        <div style={{ position: 'absolute', left: W - STREET_W, top: ROW0 - 4, opacity: streetIn }}>
          <Calle split={split} width={STREET_W} streetLit={0.6} />
          <div style={{ marginTop: 4 }}>
            <ImageTag />
          </div>
        </div>

        {/* rule, then private addresses (top band; clear during the think pause) */}
        {frame >= ruleAt - 4 ? (
          <div style={{ position: 'absolute', left: 0, top: 24, ...ruleIn, opacity: ruleIn.opacity * ruleOut }}>
            <Line size={50} weight={800}>
              si coincide el prefijo <span style={{ color: C.cyan }}>entero</span>, es tu red
            </Line>
            <Line size={50} weight={800} style={{ marginTop: 6 }}>
              y entregas tú
            </Line>
          </div>
        ) : null}
        {frame >= privateAt - 4 ? (
          <div style={{ position: 'absolute', left: 0, top: 10, ...privIn }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <Chip accent="cyan" icon="network" size={40}>
                direcciones privadas
              </Chip>
              <div style={{ opacity: insideIn }}>
                <Line size={46} color={C.amber} weight={800}>
                  dentro sí · por Internet no
                </Line>
              </div>
            </div>
            <div style={{ marginTop: 22, display: 'flex', gap: 34, opacity: rangesIn, fontFamily: FONT.mono, fontSize: 38, fontWeight: 700, color: C.text }}>
              {PRIVATE_RANGES.map((r) => (
                <span key={r}>{r}</span>
              ))}
            </div>
          </div>
        ) : null}
      </Stage>
      <CaseStamp scene={S} />
    </>
  );
}
