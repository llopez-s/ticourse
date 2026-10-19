import { useCurrentFrame } from 'remotion';
import type { SceneProps } from '../../../engine/src/timeline/types';
import { C, FONT, RADIUS, alpha } from '../../../engine/src/theme/tokens';
import { progress } from '../../../engine/src/theme/motion';
import { Icon } from '../../../engine/src/ui/Icon';
import { Terminal, type TerminalLine } from '../../../engine/src/ui/Terminal';
import { InfoCard, LearningCard, Pill, Reveal, Tag } from './parts/bits';
import { Stage, audioEnd, wordFrame } from './kit';

const S = 's02-caso';

function Arrow({ frame, at, x, y }: { frame: number; at: number; x: number; y: number }) {
  return (
    <Reveal frame={frame} at={at} x={x} y={y} distance={0}>
      <Icon name="arrowRight" size={56} color={C.muted} strokeWidth={2.6} />
    </Reveal>
  );
}

function Fact({ frame, at, label, value }: { frame: number; at: number; label: string; value: string }) {
  const p = progress(frame, at, 14);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, height: 68, padding: '0 24px', borderBottom: `2px solid ${C.ink700}`, opacity: p, transform: `translateX(${(1 - p) * 16}px)` }}>
      <span style={{ width: 130, fontSize: 26, fontWeight: 700, letterSpacing: 1, color: C.faint, textTransform: 'uppercase', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 32, fontWeight: 800, color: C.textStrong, whiteSpace: 'nowrap' }}>{value}</span>
    </div>
  );
}

function Exit({ frame, at, lit, code, tone, title, sub }: { frame: number; at: number; lit: number; code: string; tone: string; title: string; sub: string }) {
  return (
    <Reveal frame={frame} at={at} x={0} y={0}>
      <div style={{ boxSizing: 'border-box', width: 768, height: 128, display: 'flex', alignItems: 'center', gap: 22, padding: '0 22px', borderRadius: RADIUS.md, background: lit > 0 ? alpha(tone, 0.1) : C.ink850, border: `2px solid ${alpha(tone, 0.35 + 0.5 * lit)}`, boxShadow: lit > 0 ? `0 0 ${20 + 24 * lit}px ${alpha(tone, 0.26 * lit)}` : 'none', fontFamily: FONT.sans }}>
        <Tag tone={tone} size={34} solid={lit > 0.5}>{code}</Tag>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 38, fontWeight: 800, color: C.textStrong, lineHeight: 1.12 }}>{title}</div>
          <div style={{ marginTop: 4, fontSize: 28, fontWeight: 560, color: alpha(tone, 1), lineHeight: 1.15 }}>{sub}</div>
        </div>
      </div>
    </Reveal>
  );
}

/**
 * s02-caso «El motor y el archivo importan». Pipeline mi-regla.yar → verify.py → corpus as the voice names each
 * piece, with the console printing a REAL capture (verify.py, YARA 4.5.4): the reference run first, then the
 * student's rule with a syntax error (exit 2) and with an unanchored header (exit 1). A record card of what to
 * log (engine, rule, corpus) and «changed = other test» sits on the right until the exit-code cards replace it.
 * Then the learning card.
 */
export function S02Motor(props: SceneProps) {
  const frame = useCurrentFrame();
  const w = (seg: string, word: string, nth = 0) => wordFrame(S, seg, word, nth);
  const cue = props.cue('s02-c');
  const cardAt = audioEnd(S, 's02-06') + 6;

  const tRef = w('s02-02', 'compila') - 4;
  const tErr = w('s02-05', 'error') - 12;
  const tFail = w('s02-05', 'una', 1) - 52;
  const tOut = w('s02-05', 'discrepancia');
  const lines: TerminalLine[] = [
    { kind: 'cmd', at: tRef, text: 'python verify.py', cps: 30 },
    { kind: 'out', at: tRef + 34, text: 'YARA 4.5.4: 12/12 casos conformes al alcance declarado', color: C.emerald },
    { kind: 'out', at: tErr, text: '# mi-regla.yar con un error de sintaxis', color: C.faint },
    { kind: 'cmd', at: tErr + 8, text: 'python verify.py --rule mi-regla.yar --name MiRegla', cps: 60 },
    { kind: 'out', at: tErr + 52, text: 'ERROR de compilacion/ejecucion:', color: '#fda4af' },
    { kind: 'out', at: tErr + 52, text: 'mi-regla.yar(1): syntax error, unexpected <and>', color: '#fda4af' },
    { kind: 'out', at: tFail, text: '# mi-regla.yar sin anclar la cabecera', color: C.faint },
    { kind: 'cmd', at: tFail + 8, text: 'python verify.py --rule mi-regla.yar --name MiRegla', cps: 60 },
    { kind: 'out', at: tOut, text: "FAIL benign-manual.dat [training]: ['MiRegla'] | …", color: '#fcd34d' },
    { kind: 'out', at: tOut + 6, text: 'YARA 4.5.4: 11/12 casos conformes al alcance declarado', color: '#fcd34d' },
  ];

  const factsOut = progress(frame, cue - 8, 14);
  const lit2 = progress(frame, w('s02-05', 'error'), 12) * (1 - progress(frame, tOut - 6, 12));
  const lit1 = progress(frame, tOut - 6, 12);

  return (
    <Stage>
      {/* pipeline */}
      <Reveal frame={frame} at={w('s02-01', 'descargas') - 10} x={0} y={0}>
        <InfoCard icon="file" title="mi-regla.yar" sub="tu regla, descargada" tone="cyan" w={520} h={104} />
      </Reveal>
      <Arrow frame={frame} at={w('s02-02', 'verificador') - 6} x={532} y={24} />
      <Reveal frame={frame} at={w('s02-02', 'verificador') - 10} x={604} y={0}>
        <InfoCard icon="gear" title="verify.py" sub="compila y ejecuta con YARA" tone="emerald" w={520} h={104} />
      </Reveal>
      <Arrow frame={frame} at={w('s02-02', 'corpus') - 10} x={1136} y={24} />
      <Reveal frame={frame} at={w('s02-02', 'corpus') - 14} x={1208} y={0}>
        <InfoCard icon="archive" title="corpus" sub="12 archivos de prueba" tone="sky" w={520} h={104} />
      </Reveal>
      <Reveal frame={frame} at={w('s02-01', 'editor') - 6} x={0} y={116}>
        <Pill icon="x" tone="amber" size={28}>el editor del navegador no la ejecuta</Pill>
      </Reveal>

      <Terminal
        title="verify.py · YARA real"
        chip={{ text: 'captura real · extracto', accent: 'emerald', icon: 'record' }}
        at={tRef - 10}
        width={900}
        height={470}
        size={26}
        outSize={26}
        lines={lines}
        style={{ position: 'absolute', left: 0, top: 186 }}
      />

      {/* what to log, until the exit codes take over */}
      <div style={{ position: 'absolute', left: 960, top: 186, width: 768, opacity: 1 - factsOut, pointerEvents: 'none' }}>
        <Reveal frame={frame} at={w('s02-03', 'motor') - 10} x={0} y={0} w={768}>
          <div style={{ boxSizing: 'border-box', width: 768, borderRadius: RADIUS.lg, border: `2px solid ${C.ink700}`, background: C.ink900, fontFamily: FONT.sans, overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 56, padding: '0 24px', background: alpha(C.ink800, 0.9), borderBottom: `2px solid ${C.ink700}` }}>
              <Icon name="record" size={28} color={C.cyan} />
              <span style={{ fontSize: 30, fontWeight: 800, color: C.textStrong }}>Qué registras</span>
            </div>
            <Fact frame={frame} at={w('s02-03', 'motor')} label="Motor" value="YARA 4.5.4 · el de esta captura" />
            <Fact frame={frame} at={w('s02-03', 'regla')} label="Regla" value="versión de mi-regla.yar" />
            <Fact frame={frame} at={w('s02-03', 'archivos')} label="Corpus" value="los 12 archivos de prueba" />
          </div>
        </Reveal>
        <Reveal frame={frame} at={w('s02-04', 'regla')} x={0} y={282}>
          <Pill icon="split" tone="amber" size={28}>regla distinta = otra prueba</Pill>
        </Reveal>
        <Reveal frame={frame} at={w('s02-04', 'corpus')} x={0} y={344}>
          <Pill icon="split" tone="amber" size={28}>corpus distinto = otra prueba</Pill>
        </Reveal>
        <Reveal frame={frame} at={w('s02-04', 'evidencia')} x={0} y={406}>
          <Pill icon="clock" tone="muted" size={28}>la evidencia anterior no cubre el cambio</Pill>
        </Reveal>
      </div>

      {/* exit codes */}
      <div style={{ position: 'absolute', left: 960, top: 186, display: 'grid', gap: 20 }}>
        <div style={{ position: 'relative', height: 128 }}>
          <Exit frame={frame} at={w('s02-05', 'error')} lit={lit2} code="exit 2" tone={C.rose} title="Error de compilación" sub="la regla no llegó a evaluarse" />
        </div>
        <div style={{ position: 'relative', height: 128 }}>
          <Exit frame={frame} at={tOut - 6} lit={lit1} code="exit 1" tone={C.amber} title="Discrepancia" sub="se evaluó; no coincide lo esperado" />
        </div>
        <div style={{ position: 'relative', height: 128 }}>
          <Exit frame={frame} at={tOut + 24} lit={0} code="exit 0" tone={C.emerald} title="Conformidad" sub="coincide con lo esperado" />
        </div>
      </div>
      <LearningCard frame={frame} at={cardAt} text="Compilar valida sintaxis; ejecutar contrasta coincidencias" />
    </Stage>
  );
}
