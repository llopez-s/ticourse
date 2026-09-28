import type { ReactNode } from 'react';
import { interpolate, interpolateColors, useCurrentFrame, useVideoConfig } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, TYPE, alpha } from '../../../engine/src/theme/tokens';
import { EASE, enter, fadeIn, progress, pulse } from '../../../engine/src/theme/motion';
import { Chip, Counter, Icon, MonoLine, Packet, Panel, type MonoToken } from '../../../engine/src/ui';
import { Stage, segment, wordFrame } from './kit';

const SCENE = 's03-pdns';

// ---------------------------------------------------------------------------
// Phase A: the phone book («listín») and its memory. Generic filler only:
// *.example names and RFC 5737 documentation IPs, never canon actor data.
// ---------------------------------------------------------------------------

const BOOK_W = 800;
const BOOK_H = 640;
const BOOK_TOP = 10;
const BOOK_CENTER_X = (1728 - BOOK_W) / 2;
const SPINE_W = 40;

const BOOK_ROWS = [
  { name: 'academia-baile.example', num: '192.0.2.18' },
  { name: 'blog-recetas.example', num: '198.51.100.7' },
  { name: 'club-ajedrez.example', num: '192.0.2.41' },
  { name: 'taller-bicis.example', num: '198.51.100.63' },
  { name: 'tienda-flores.example', num: '198.51.100.90' },
  { name: 'vivero-sur.example', num: '203.0.113.90' },
];
const TARGET = 4;
const LOOKUP_NAME = BOOK_ROWS[TARGET].name;
const ROW_H = 52;

const MEM_X = 860;
const MEM_W = 1728 - MEM_X;
const SENSOR_H = 84;
const LEDGER_TOP = 130;
const LEDGER_ROW_H = 54;

const SENSORS = [
  { region: 'Europa', x: 0 },
  { region: 'América', x: 296 },
  { region: 'Asia', x: 592 },
];
const SENSOR_W = 276;

/** Answers the sensors saw, oldest first; the newest lands on top of the stack. */
const MEMORY = [
  { date: '2025-06-02', name: 'tienda-flores.example', num: '203.0.113.24' },
  { date: '2025-08-19', name: 'blog-recetas.example', num: '198.51.100.7' },
  { date: '2025-10-05', name: 'tienda-flores.example', num: '203.0.113.24' },
  { date: '2025-12-11', name: 'club-ajedrez.example', num: '192.0.2.41' },
  { date: '2026-01-23', name: 'tienda-flores.example', num: '198.51.100.90' },
  { date: '2026-02-14', name: 'vivero-sur.example', num: '203.0.113.90' },
  { date: '2026-03-01', name: 'tienda-flores.example', num: '198.51.100.90' },
];
const MEMORY_STEP = 12;

// ---------------------------------------------------------------------------
// Phase B: the passive DNS console («el listín con memoria»).
// ---------------------------------------------------------------------------

const C2_DOMAIN = 'update-svc-cdn.com';
const C2_IP = '185.220.x.x';
const FIRST_SEEN = '2026-02-11';
const LAST_SEEN = '2026-03-07';
const E7_DATE = '2026-03-05';

const Q_TOP = 40;
const Q_H = 150;
const CONSOLE_TOP = 250;
const CONSOLE_W = 1000;
const RIGHT_X = 1040;
const RIGHT_W = 1728 - RIGHT_X;
const LOWER_H = 660 - CONSOLE_TOP;

const CMD_SIZE = TYPE.label;
const CMD_LH = Math.round(CMD_SIZE * 1.45);
const IP_SIZE = 44;
const IP_LH = 60;
/** Height of the first query block (command + answer), scrolled away when the flood starts. */
const BLOCK1_H = CMD_LH + 10 + IP_LH + CMD_LH + 18;

const STREAM_SIZE = 24;
const STREAM_LH = 34;
const STREAM_ROWS = 420;
const FILLER_A = ['tienda', 'blog', 'foro', 'hotel', 'academia', 'taller', 'viajes', 'fotos', 'club', 'agencia', 'granja', 'radio', 'museo', 'libreria', 'panaderia', 'clinica', 'gimnasio', 'estudio', 'escuela'];
const FILLER_B = ['flores', 'sol', 'norte', 'centro', 'mar', 'verde', 'azul', 'rio', 'luna', 'sur', 'roble', 'nube', 'faro'];

/** Deterministic generic co-hosted domain for stream row `i` (never an actor domain). */
function filler(i: number): { name: string; date: string } {
  const a = FILLER_A[(i * 7 + 3) % FILLER_A.length];
  const b = FILLER_B[(i * 5 + 1) % FILLER_B.length];
  const n = (i * 13) % 5 === 0 ? `-${(i * 29) % 90 + 10}` : '';
  const month = String(((i * 5) % 12) + 1).padStart(2, '0');
  const day = String(((i * 11) % 28) + 1).padStart(2, '0');
  const year = 2021 + ((i * 3) % 5);
  return { name: `${a}-${b}${n}.example`, date: `${year}-${month}-${day}` };
}

/**
 * s03-pdns «El listín con memoria»: DNS is a phone book (name in, number
 * out); passive DNS is that book with a memory — sensors all over the
 * Internet note every answer they see, with its date. Then the console demo:
 * query 1 by domain (the C2 of E7 pointed to 185.220.x.x, first seen weeks
 * before E7, last seen days after); query 2 the other way round (who else
 * lived on that IP?) floods the terminal while a counter races to 14.000.
 * The think prompt lands in the empty top band at the end.
 */
export function S03Pdns(props: SceneProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phonebook = props.cue('phonebook');
  const qDomain = props.cue('q-domain');
  const history = props.cue('history');
  const qIp = props.cue('q-ip');
  const count = props.cue('count-14000');

  const seg2 = segment(props, 's03-02').from;
  const seg3 = segment(props, 's03-03').from;
  const nameAt = wordFrame(SCENE, 's03-01', 'nombre');
  const numberAt = wordFrame(SCENE, 's03-01', 'número');
  const memoryAt = wordFrame(SCENE, 's03-02', 'memoria');
  const sensorsAt = wordFrame(SCENE, 's03-02', 'sensores');
  const notesAt = wordFrame(SCENE, 's03-02', 'apuntando');
  const dateAt = wordFrame(SCENE, 's03-02', 'fecha');
  const ipWord = wordFrame(SCENE, 's03-04', 'IP');
  const weeksAt = wordFrame(SCENE, 's03-04', 'semanas');
  const e7At = wordFrame(SCENE, 's03-04', 'E7');
  const daysAt = wordFrame(SCENE, 's03-04', 'días');

  // Counter keyframes follow the voice: «Mil, cinco mil… catorce mil dominios».
  const k1 = Math.max(count + 1, wordFrame(SCENE, 's03-06', 'mil', 0) + 4);
  const k2 = Math.max(k1 + 1, wordFrame(SCENE, 's03-06', 'cinco') + 10);
  const doneAt = Math.max(k2 + 1, wordFrame(SCENE, 's03-06', 'dominios'));
  const qOut = Math.min(wordFrame(SCENE, 's03-06', 'catorce') - 6, doneAt - 12);

  // Phase A leaves as the console arrives («le puedes preguntar dos cosas»).
  const phaseA = 1 - progress(frame, seg3 - 4, 14, EASE.inOut);

  return (
    <Stage>
      {phaseA > 0 ? (
        <div style={{ position: 'absolute', inset: 0, opacity: phaseA, transform: `translateY(${(1 - phaseA) * -16}px)` }}>
          <PhoneBook
            frame={frame}
            fps={fps}
            x={BOOK_CENTER_X * (1 - progress(frame, seg2, 26, EASE.inOut))}
            phonebook={phonebook}
            nameAt={nameAt}
            numberAt={numberAt}
            memoryAt={memoryAt}
          />
          <Memory frame={frame} enterAt={seg2 + 12} sensorsAt={sensorsAt} notesAt={notesAt} dateAt={dateAt} leaveAt={seg3} />
        </div>
      ) : null}

      {frame >= seg3 - 4 ? (
        <>
          <QuestionCard
            frame={frame}
            n={1}
            label="Por dominio"
            text="¿A qué apuntaba el dominio?"
            x={0}
            w={CONSOLE_W}
            inAt={seg3 + 4}
            onAt={qDomain}
            offAt={qIp}
            outAt={qOut}
          />
          <QuestionCard
            frame={frame}
            n={2}
            label="Al revés · por IP"
            text="¿Quién más vive en esa IP?"
            x={RIGHT_X}
            w={RIGHT_W}
            inAt={seg3 + 12}
            onAt={qIp}
            outAt={qOut}
          />
          <div style={{ position: 'absolute', left: 0, top: CONSOLE_TOP, width: CONSOLE_W, height: LOWER_H, ...enter(frame, seg3 + 10, { distance: 22 }) }}>
            <Console
              frame={frame}
              fps={fps}
              t={{ seg3, qDomain, history, ipWord, qIp, count, k1, k2, doneAt }}
            />
          </div>
          <SeenTimeline frame={frame} pendingAt={qDomain + 20} history={history} weeksAt={weeksAt} e7At={e7At} daysAt={daysAt} count={count} />
          <TenantCounter frame={frame} count={count} k1={k1} k2={k2} doneAt={doneAt} />
        </>
      ) : null}
    </Stage>
  );
}

// ---------------------------------------------------------------------------
// Phase A components
// ---------------------------------------------------------------------------

function PhoneBook({
  frame,
  fps,
  x,
  phonebook,
  nameAt,
  numberAt,
  memoryAt,
}: {
  frame: number;
  fps: number;
  x: number;
  phonebook: number;
  nameAt: number;
  numberAt: number;
  memoryAt: number;
}) {
  const bookIn = enter(frame, 2, { distance: 20 });
  const glow = progress(frame, phonebook, 14) * (1 - 0.6 * progress(frame, numberAt + 30, 30));

  // Name typed at 60 cps, then the finger runs down the rows to the target.
  const typed = Math.min(LOOKUP_NAME.length, Math.max(0, Math.floor(((frame - nameAt) / fps) * 60)));
  const typing = frame >= nameAt && typed < LOOKUP_NAME.length;
  const sweepFrom = nameAt + Math.ceil((LOOKUP_NAME.length / 60) * fps) + 2;
  const sweepTo = Math.max(sweepFrom + 8, numberAt - 2);
  const sweep = progress(frame, sweepFrom, sweepTo - sweepFrom, EASE.inOut);
  const fingerOn = fadeIn(frame, sweepFrom - 4, 6);
  const found = progress(frame, numberAt, 10);
  const answerIn = enter(frame, numberAt + 2, { distance: 12 });

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: BOOK_TOP,
        width: BOOK_W,
        height: BOOK_H,
        boxSizing: 'border-box',
        borderRadius: RADIUS.lg,
        border: `2px solid ${glow > 0 ? alpha(C.sky, 0.35 + 0.45 * glow) : C.ink700}`,
        background: `linear-gradient(180deg, ${C.ink850} 0%, ${C.ink900} 100%)`,
        boxShadow: `0 30px 70px ${alpha('#000000', 0.35)}${glow > 0 ? `, 0 0 ${30 * glow}px ${alpha(C.sky, 0.3 * glow)}` : ''}`,
        overflow: 'hidden',
        ...bookIn,
      }}
    >
      {/* Spine with ring holes: it reads as a book at a glance. */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: SPINE_W,
          height: '100%',
          background: alpha(C.sky, 0.1),
          borderRight: `2px solid ${alpha(C.sky, 0.22)}`,
        }}
      >
        {Array.from({ length: 7 }, (_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: SPINE_W / 2 - 8,
              top: 50 + i * 88,
              width: 16,
              height: 16,
              borderRadius: 8,
              background: C.ink950,
              border: `2px solid ${alpha(C.sky, 0.4)}`,
            }}
          />
        ))}
      </div>

      <div style={{ position: 'absolute', left: SPINE_W, right: 0, top: 0, bottom: 0, padding: '18px 28px', boxSizing: 'border-box', fontFamily: FONT.sans }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 44 }}>
          <Icon name="file" size={34} color={C.sky} />
          <div style={{ fontSize: TYPE.label, fontWeight: 850, letterSpacing: 3, color: C.textStrong }}>LISTÍN</div>
          <div style={{ fontSize: TYPE.small, fontWeight: 600, color: C.muted, whiteSpace: 'nowrap' }}>· DNS</div>
          <div style={{ flex: 1 }} />
          <div style={{ ...enter(frame, memoryAt, { distance: 10, axis: 'x' }) }}>
            <Chip accent="cyan" icon="clock" size={TYPE.small} solid={frame >= memoryAt + 6}>
              con memoria
            </Chip>
          </div>
        </div>

        {/* Search bar: the name you give */}
        <div
          style={{
            marginTop: 16,
            height: 64,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '0 20px',
            borderRadius: RADIUS.md,
            border: `2px solid ${frame >= nameAt ? alpha(C.sky, 0.6) : C.ink700}`,
            background: alpha(C.ink950, 0.6),
          }}
        >
          <Icon name="search" size={30} color={frame >= nameAt ? C.sky : C.faint} />
          <div style={{ fontFamily: FONT.sans, fontSize: TYPE.small, fontWeight: 650, color: C.muted, whiteSpace: 'nowrap' }}>nombre</div>
          {frame >= nameAt ? (
            <MonoLine tokens={[{ t: LOOKUP_NAME, c: C.textStrong, bold: true }]} size={TYPE.label} visibleChars={typed} caret={typing} />
          ) : (
            <MonoLine tokens={[{ t: '…', c: C.faint }]} size={TYPE.label} />
          )}
        </div>

        {/* Column header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 18,
            height: 30,
            fontSize: TYPE.micro,
            fontWeight: 750,
            letterSpacing: 2,
            color: C.faint,
          }}
        >
          <span>NOMBRE</span>
          <span>NÚMERO</span>
        </div>

        {/* Rows */}
        <div style={{ position: 'relative', marginTop: 8, height: BOOK_ROWS.length * ROW_H }}>
          {/* The finger that runs down the page */}
          {fingerOn > 0 ? (
            <div
              style={{
                position: 'absolute',
                left: -12,
                right: -12,
                top: sweep * TARGET * ROW_H + 4,
                height: ROW_H - 8,
                borderRadius: 10,
                background: alpha(C.sky, 0.1 + 0.08 * found),
                border: `2px solid ${alpha(C.sky, 0.35 + 0.5 * found)}`,
                opacity: fingerOn,
              }}
            />
          ) : null}
          {BOOK_ROWS.map((row, i) => {
            const hit = i === TARGET ? found : 0;
            return (
              <div key={row.name} style={{ position: 'absolute', left: 0, right: 0, top: i * ROW_H, height: ROW_H, display: 'flex', alignItems: 'center' }}>
                <MonoLine tokens={[{ t: row.name, c: hit > 0 ? C.textStrong : C.text }]} size={30} />
                <div style={{ flex: 1, margin: '0 14px', height: 0, borderBottom: `3px dotted ${C.ink600}`, transform: 'translateY(8px)' }} />
                <MonoLine tokens={[{ t: row.num, c: hit > 0.5 ? C.cyanSoft : C.muted, bold: hit > 0.5 }]} size={30} />
              </div>
            );
          })}
        </div>

        {/* The number you get back */}
        <div
          style={{
            marginTop: 16,
            height: 64,
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '0 20px',
            borderRadius: RADIUS.md,
            border: `2px solid ${alpha(C.cyan, 0.55)}`,
            background: alpha(C.cyan, 0.08),
            ...answerIn,
          }}
        >
          <Icon name="check" size={30} color={C.cyan} />
          <div style={{ fontFamily: FONT.sans, fontSize: TYPE.small, fontWeight: 650, color: C.muted }}>número</div>
          <MonoLine tokens={[{ t: BOOK_ROWS[TARGET].num, c: C.cyanSoft, bold: true }]} size={36} />
        </div>
      </div>
    </div>
  );
}

function Memory({ frame, enterAt, sensorsAt, notesAt, dateAt, leaveAt }: { frame: number; enterAt: number; sensorsAt: number; notesAt: number; dateAt: number; leaveAt: number }) {
  if (frame < enterAt - 2) return null;
  const panelIn = enter(frame, enterAt, { distance: 26, axis: 'x' });
  // All entries must land before Phase A leaves, however fast the real recording is.
  const step = Math.max(4, Math.min(MEMORY_STEP, Math.floor((leaveAt - 16 - notesAt) / MEMORY.length)));
  const at = MEMORY.map((_, k) => notesAt + k * step);
  const dateHl = progress(frame, dateAt, 12);

  // Newest entry on top; each one grows into place and pushes the rest down.
  const shown = MEMORY.map((m, k) => ({ m, k, h: progress(frame, at[k], 10, EASE.out) })).filter((e) => e.h > 0).reverse();
  let y = 0;
  const placed = shown.map((e) => {
    const top = y;
    y += e.h * LEDGER_ROW_H;
    return { ...e, top };
  });

  return (
    <div style={{ position: 'absolute', left: MEM_X, top: 0, width: MEM_W, height: 660, ...panelIn }}>
      {/* Sensors all over the Internet */}
      {SENSORS.map((s, i) => {
        const sIn = enter(frame, sensorsAt + i * 6, { distance: 12 });
        const lastHit = at.filter((a, k) => k % SENSORS.length === i && frame >= a - 10).pop();
        const ping = lastHit !== undefined ? 1 - progress(frame, lastHit, 18) : 0;
        return (
          <div
            key={s.region}
            style={{
              position: 'absolute',
              left: s.x,
              top: 0,
              width: SENSOR_W,
              height: SENSOR_H,
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '0 18px',
              borderRadius: RADIUS.md,
              border: `2px solid ${alpha(C.cyan, 0.3 + 0.5 * ping)}`,
              background: alpha(C.ink850, 0.95),
              boxShadow: ping > 0 ? `0 0 ${24 * ping}px ${alpha(C.cyan, 0.35 * ping)}` : 'none',
              fontFamily: FONT.sans,
              ...sIn,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                display: 'grid',
                placeItems: 'center',
                background: alpha(C.cyan, 0.12 + 0.12 * ping),
                border: `2px solid ${alpha(C.cyan, 0.45)}`,
                flexShrink: 0,
              }}
            >
              <Icon name="radar" size={30} color={C.cyan} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: TYPE.micro, fontWeight: 650, color: C.muted, lineHeight: 1.1 }}>sensor</div>
              <div style={{ fontSize: TYPE.small, fontWeight: 750, color: C.textStrong, lineHeight: 1.2, whiteSpace: 'nowrap' }}>{s.region}</div>
            </div>
          </div>
        );
      })}

      {/* Answers travelling from a sensor into the memory */}
      <svg width={MEM_W} height={LEDGER_TOP + 10} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {SENSORS.map((s, i) => {
          const cx = s.x + SENSOR_W / 2;
          return (
            <line
              key={s.region}
              x1={cx}
              y1={SENSOR_H + 4}
              x2={cx}
              y2={LEDGER_TOP - 4}
              stroke={alpha(C.cyan, 0.35 * fadeIn(frame, sensorsAt + i * 6, 12))}
              strokeWidth={3}
              strokeDasharray="6 8"
            />
          );
        })}
        {at.map((a, k) => {
          const s = SENSORS[k % SENSORS.length];
          const cx = s.x + SENSOR_W / 2;
          const t = progress(frame, a - 10, 10, EASE.inOut);
          return (
            <Packet
              key={k}
              curve={[
                { x: cx, y: SENSOR_H + 4 },
                { x: cx, y: SENSOR_H + 20 },
                { x: cx, y: LEDGER_TOP - 20 },
                { x: cx, y: LEDGER_TOP - 2 },
              ]}
              t={t}
              color={C.cyan}
              radius={7}
            />
          );
        })}
      </svg>

      {/* The memory itself */}
      <div style={{ position: 'absolute', left: 0, top: LEDGER_TOP, width: MEM_W, height: 660 - LEDGER_TOP - 10 }}>
        <Panel
          title="Memoria · lo que vieron pasar"
          icon="clock"
          accent="cyan"
          glow={dateHl * 0.6}
          right={
            <span style={{ ...enter(frame, dateAt, { distance: 8 }) }}>
              <Chip accent="cyan" size={TYPE.micro}>
                con fecha
              </Chip>
            </span>
          }
          style={{ height: '100%' }}
          bodyStyle={{ padding: '14px 26px', overflow: 'hidden' }}
        >
          <div style={{ position: 'relative', height: '100%' }}>
            {placed.map(({ m, k, h, top }) => (
              // The slot grows with the entry, so the new row drops in from above without overlapping.
              <div key={k} style={{ position: 'absolute', left: 0, right: 0, top, height: h * LEDGER_ROW_H, overflow: 'hidden' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: LEDGER_ROW_H,
                    display: 'flex',
                    alignItems: 'center',
                    opacity: h,
                    borderBottom: `1px solid ${alpha(C.ink600, 0.6)}`,
                  }}
                >
                  <MonoLine
                    tokens={[
                      { t: m.date, c: dateHl > 0.3 ? C.ink950 : C.cyanSoft, bg: dateHl > 0.3 ? alpha(C.cyan, 0.4 + 0.5 * dateHl) : undefined, bold: true },
                      { t: '  ' },
                      { t: m.name, c: C.text },
                      { t: '  ' },
                      { t: m.num, c: C.sky },
                    ]}
                    size={TYPE.small}
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Phase B components
// ---------------------------------------------------------------------------

function QuestionCard({
  frame,
  n,
  label,
  text,
  x,
  w,
  inAt,
  onAt,
  offAt,
  outAt,
}: {
  frame: number;
  n: number;
  label: string;
  text: string;
  x: number;
  w: number;
  inAt: number;
  onAt: number;
  offAt?: number;
  outAt: number;
}) {
  const cardIn = enter(frame, inAt, { distance: 16 });
  const out = 1 - progress(frame, outAt, 12, EASE.inOut);
  if (out <= 0) return null;
  const off = offAt === undefined ? 0 : progress(frame, offAt, 14);
  const on = progress(frame, onAt, 12) * (1 - off);
  // Waiting: a little dim; asked: full; answered: dimmer.
  const level = (0.72 + 0.28 * progress(frame, onAt, 12)) * (1 - 0.45 * off);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: Q_TOP,
        width: w,
        height: Q_H,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: '0 30px',
        borderRadius: RADIUS.lg,
        border: `2px solid ${alpha(C.cyan, 0.25 + 0.6 * on)}`,
        background: `linear-gradient(180deg, ${alpha(C.cyan, 0.04 + 0.08 * on)} 0%, ${alpha(C.ink900, 0.95)} 100%)`,
        boxShadow: on > 0 ? `0 0 ${34 * on}px ${alpha(C.cyan, 0.28 * on)}` : 'none',
        fontFamily: FONT.sans,
        opacity: cardIn.opacity * out * level,
        transform: cardIn.transform,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          flexShrink: 0,
          display: 'grid',
          placeItems: 'center',
          background: on > 0.5 ? C.cyan : alpha(C.cyan, 0.12),
          border: `2px solid ${alpha(C.cyan, 0.6)}`,
          color: on > 0.5 ? C.ink950 : C.cyanSoft,
          fontSize: TYPE.label,
          fontWeight: 850,
        }}
      >
        {n}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: TYPE.micro, fontWeight: 750, letterSpacing: 2, textTransform: 'uppercase', color: C.muted, whiteSpace: 'nowrap' }}>{label}</div>
        <div style={{ marginTop: 6, fontSize: TYPE.label + 4, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>{text}</div>
      </div>
    </div>
  );
}

type ConsoleTiming = {
  seg3: number;
  qDomain: number;
  history: number;
  ipWord: number;
  qIp: number;
  count: number;
  k1: number;
  k2: number;
  doneAt: number;
};

const PROMPT: MonoToken = { t: '$ ', c: C.emerald, bold: true };

function typedChars(frame: number, at: number, fps: number, len: number, cps = 42): number {
  return Math.min(len, Math.max(0, Math.floor(((frame - at) / fps) * cps)));
}

function Console({ frame, fps, t }: { frame: number; fps: number; t: ConsoleTiming }) {
  const cmd1: MonoToken[] = [PROMPT, { t: 'pdns lookup ' }, { t: C2_DOMAIN, c: C.roseSoft, bold: true }];
  const cmd2: MonoToken[] = [PROMPT, { t: 'pdns ip ' }, { t: C2_IP, c: C.sky, bold: true }];
  const len1 = cmd1.reduce((s, x) => s + x.t.length, 0);
  const len2 = cmd2.reduce((s, x) => s + x.t.length, 0);
  const vis1 = typedChars(frame, t.qDomain, fps, len1);
  const vis2 = typedChars(frame, t.qIp, fps, len2);

  const ipIn = enter(frame, t.history, { distance: 10 });
  const datesIn = enter(frame, t.history + 10, { distance: 10 });
  const ipGlow = progress(frame, t.ipWord - 4, 10) * (1 - progress(frame, t.ipWord + 40, 30));
  const scroll = progress(frame, t.count, 18, EASE.inOut) * BLOCK1_H;

  return (
    <Panel
      title="passive DNS · el listín con memoria"
      icon="terminal"
      accent="cyan"
      style={{ height: '100%' }}
      bodyStyle={{ padding: '18px 26px', overflow: 'hidden' }}
    >
      <div style={{ transform: `translateY(${-scroll}px)` }}>
        {/* Query 1: by domain */}
        <div style={{ height: CMD_LH }}>
          {frame < t.qDomain ? (
            <MonoLine tokens={[PROMPT]} size={CMD_SIZE} caret />
          ) : (
            <MonoLine tokens={cmd1} size={CMD_SIZE} visibleChars={vis1} caret={vis1 < len1} />
          )}
        </div>
        <div style={{ height: 10 }} />
        <div style={{ height: IP_LH, display: 'flex', alignItems: 'center', gap: 20, ...ipIn }}>
          {frame >= t.history ? (
            <>
              <span
                style={{
                  fontFamily: FONT.mono,
                  fontSize: IP_SIZE,
                  fontWeight: 800,
                  color: C.sky,
                  padding: '0 12px',
                  borderRadius: 10,
                  background: alpha(C.sky, 0.1 + 0.12 * ipGlow),
                  boxShadow: ipGlow > 0 ? `0 0 ${26 * ipGlow}px ${alpha(C.sky, 0.4 * ipGlow)}` : 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {C2_IP}
              </span>
              <Chip accent="muted" icon="server" size={TYPE.small}>
                IP de hosting
              </Chip>
            </>
          ) : null}
        </div>
        <div style={{ height: CMD_LH, ...datesIn }}>
          {frame >= t.history ? (
            <MonoLine
              tokens={[
                { t: 'first seen ', c: C.muted },
                { t: FIRST_SEEN, c: C.cyanSoft, bold: true },
                { t: ' · ', c: C.faint },
                { t: 'last seen ', c: C.muted },
                { t: LAST_SEEN, c: C.cyanSoft, bold: true },
              ]}
              size={CMD_SIZE}
            />
          ) : null}
        </div>
        <div style={{ height: 18 }} />

        {/* Query 2: the other way round, by IP */}
        <div style={{ height: CMD_LH }}>
          {frame < t.history + 20 ? null : frame < t.qIp ? (
            <MonoLine tokens={[PROMPT]} size={CMD_SIZE} caret />
          ) : (
            <MonoLine tokens={cmd2} size={CMD_SIZE} visibleChars={vis2} caret={vis2 < len2} />
          )}
        </div>
        {frame >= t.count ? <Flood frame={frame} t={t} /> : null}
      </div>
    </Panel>
  );
}

/** Rows printed so far (float) — paced by the same keyframes as the counter. */
function printedRows(frame: number, t: ConsoleTiming): number {
  return interpolate(frame, [t.count, t.k1, t.k2, t.doneAt], [0, 20, 120, STREAM_ROWS], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE.linear,
  });
}

/** The pdns ip output: thousands of generic co-hosted domains scrolling past, blurred by speed. */
function Flood({ frame, t }: { frame: number; t: ConsoleTiming }) {
  const VISIBLE = 7;
  const printed = printedRows(frame, t);
  const speed = (printed - printedRows(frame - 1, t)) * STREAM_LH; // px per frame
  const blur = Math.min(2.4, speed / 40);
  const shift = Math.max(0, printed - VISIBLE);
  const first = Math.max(0, Math.floor(shift) - 1);
  const last = Math.min(STREAM_ROWS, Math.ceil(printed));
  const rows: ReactNode[] = [];
  for (let i = first; i < last; i++) {
    const y = (i - shift) * STREAM_LH;
    if (y < -STREAM_LH || y > VISIBLE * STREAM_LH) continue;
    const f = filler(i);
    rows.push(
      <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: y, height: STREAM_LH, display: 'flex', alignItems: 'center', gap: 28 }}>
        <MonoLine tokens={[{ t: f.date, c: C.faint }]} size={STREAM_SIZE} />
        <MonoLine tokens={[{ t: f.name, c: C.muted }]} size={STREAM_SIZE} />
      </div>,
    );
  }
  return (
    <div
      style={{
        position: 'relative',
        marginTop: 8,
        height: VISIBLE * STREAM_LH,
        overflow: 'hidden',
        filter: blur > 0.15 ? `blur(${blur.toFixed(2)}px)` : undefined,
        opacity: 0.6 + 0.3 * (1 - Math.min(1, speed / 60)),
      }}
    >
      {rows}
    </div>
  );
}

function SeenTimeline({
  frame,
  pendingAt,
  history,
  weeksAt,
  e7At,
  daysAt,
  count,
}: {
  frame: number;
  pendingAt: number;
  history: number;
  weeksAt: number;
  e7At: number;
  daysAt: number;
  count: number;
}) {
  const out = 1 - progress(frame, count, 12, EASE.inOut);
  if (frame < pendingAt - 2 || out <= 0) return null;
  // The card opens while the query runs (dates pending) and fills in when the answer arrives.
  const cardIn = enter(frame, pendingAt, { distance: 24, axis: 'x' });
  const pending = frame < history;
  const line = progress(frame, history + 14, 20, EASE.inOut);

  const ROW1 = 6;
  const ROW2 = 146;
  const ROW3 = 246;
  const DOT_X = 18;

  return (
    <div style={{ position: 'absolute', left: RIGHT_X, top: CONSOLE_TOP, width: RIGHT_W, height: LOWER_H, opacity: cardIn.opacity * out, transform: cardIn.transform }}>
      <Panel
        title={`Memoria de ${C2_DOMAIN}`}
        icon="clock"
        accent="cyan"
        glow={progress(frame, history, 10) * (1 - progress(frame, history + 30, 30)) * 0.8}
        style={{ height: '100%' }}
        bodyStyle={{ padding: '22px 30px' }}
      >
        <div style={{ position: 'relative', height: '100%' }}>
          {/* While the query runs */}
          {pending ? (
            <div
              style={{
                position: 'absolute',
                left: 78,
                top: ROW1 + 100,
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontFamily: FONT.sans,
                fontSize: TYPE.small,
                fontWeight: 650,
                color: C.faint,
                opacity: fadeIn(frame, pendingAt + 6, 10),
              }}
            >
              <Icon name="search" size={28} color={C.faint} />
              consultando el listín…
            </div>
          ) : null}
          <svg width={60} height={320} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <line x1={DOT_X + 12} y1={ROW1 + 22} x2={DOT_X + 12} y2={ROW1 + 22 + (ROW3 - ROW1) * line} stroke={alpha(C.cyan, 0.5)} strokeWidth={4} strokeLinecap="round" />
          </svg>
          <SeenRow top={ROW1} dotColor={C.cyan} date={FIRST_SEEN} label="first seen" opacity={1} frame={frame} revealAt={history + 8} />
          <GapLabel top={ROW1 + 58} height={ROW2 - ROW1 - 58} text="semanas antes de E7" opacity={fadeIn(frame, weeksAt, 12)} />
          <SeenRow top={ROW2} dotColor={C.rose} date={E7_DATE} label="E7 · beacon" labelColor={C.roseSoft} dateColor={C.roseSoft} opacity={fadeIn(frame, e7At - 2, 10)} frame={frame} revealAt={e7At - 2} diamond />
          <GapLabel top={ROW2 + 50} height={ROW3 - ROW2 - 50} text="días después" opacity={fadeIn(frame, daysAt, 12)} />
          <SeenRow top={ROW3} dotColor={C.cyan} date={LAST_SEEN} label="last seen" opacity={1} frame={frame} revealAt={history + 14} />
        </div>
      </Panel>
    </div>
  );
}

function SeenRow({
  top,
  dotColor,
  date,
  label,
  labelColor = C.muted,
  dateColor = C.cyanSoft,
  opacity,
  frame,
  revealAt,
  diamond = false,
}: {
  top: number;
  dotColor: string;
  date: string;
  label: string;
  labelColor?: string;
  dateColor?: string;
  opacity: number;
  frame: number;
  revealAt: number;
  diamond?: boolean;
}) {
  const r = progress(frame, revealAt, 10);
  return (
    <div style={{ position: 'absolute', left: 0, top, height: 44, display: 'flex', alignItems: 'center', gap: 22, opacity: opacity * (0.55 + 0.45 * r) }}>
      <div
        style={{
          width: 24,
          height: 24,
          marginLeft: 18,
          borderRadius: diamond ? 4 : 12,
          transform: diamond ? 'rotate(45deg)' : undefined,
          background: r > 0.5 ? dotColor : alpha(dotColor, 0.3),
          boxShadow: r > 0 ? `0 0 ${Math.round(16 * r)}px ${alpha(dotColor, 0.6)}` : 'none',
          flexShrink: 0,
        }}
      />
      <span style={{ fontFamily: FONT.mono, fontSize: TYPE.label, fontWeight: 800, color: r > 0.5 ? dateColor : C.faint, whiteSpace: 'nowrap' }}>
        {r > 0.5 ? date : '····-··-··'}
      </span>
      <span style={{ fontFamily: FONT.sans, fontSize: TYPE.small, fontWeight: 650, color: labelColor, whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  );
}

function GapLabel({ top, height, text, opacity }: { top: number; height: number; text: string; opacity: number }) {
  return (
    <div style={{ position: 'absolute', left: 78, top, height, display: 'flex', alignItems: 'center', gap: 12, opacity }}>
      <div style={{ width: 14, height: Math.max(10, height - 16), borderLeft: `3px solid ${alpha(C.muted, 0.5)}`, borderTop: `3px solid ${alpha(C.muted, 0.5)}`, borderBottom: `3px solid ${alpha(C.muted, 0.5)}`, borderRadius: '6px 0 0 6px' }} />
      <span style={{ fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 650, fontStyle: 'italic', color: C.text, whiteSpace: 'nowrap' }}>{text}</span>
    </div>
  );
}

function TenantCounter({ frame, count, k1, k2, doneAt }: { frame: number; count: number; k1: number; k2: number; doneAt: number }) {
  if (frame < count) return null;
  const cardIn = enter(frame, count + 4, { distance: 24, axis: 'x' });
  const value = interpolate(frame, [count, k1, k2, doneAt], [0, 1000, 5000, 14000], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const done = progress(frame, doneAt, 14);
  const color = interpolateColors(value, [0, 5000, 14000], [C.textStrong, C.amber, C.amber]);
  const glow = done * (0.7 + 0.3 * pulse(frame, 30, 0.5));
  const scale = 1 + 0.08 * done;
  return (
    <div style={{ position: 'absolute', left: RIGHT_X, top: CONSOLE_TOP, width: RIGHT_W, height: LOWER_H, ...cardIn }}>
      <Panel title={`Dominios en ${C2_IP}`} icon="globe" accent="amber" glow={glow} style={{ height: '100%' }} bodyStyle={{ padding: '0 36px' }}>
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 22 }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}>
            <Counter value={value} size={TYPE.hero + 24} color={color} style={{ textShadow: done > 0 ? `0 0 ${30 * done}px ${alpha(C.amber, 0.5 * done)}` : undefined }} />
          </div>
          <div style={{ fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 650, color: C.text, whiteSpace: 'nowrap' }}>dominios han vivido en esta IP</div>
          {/* Fill bar: how far the list has run */}
          <div style={{ width: '82%', height: 10, borderRadius: 5, background: C.ink700, overflow: 'hidden' }}>
            <div style={{ width: `${(value / 14000) * 100}%`, height: '100%', background: color, boxShadow: `0 0 12px ${alpha(C.amber, 0.6)}` }} />
          </div>
        </div>
      </Panel>
    </div>
  );
}
