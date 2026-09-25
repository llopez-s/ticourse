import type { CSSProperties, ReactNode } from 'react';
import {
  AbsoluteFill,
  Html5Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import timeline from './timeline.json';

type Scene = 'intro' | 'telemetry' | 'alert' | 'triage' | 'scope' | 'contain' | 'close';

const C = {
  bg: '#070d19',
  panel: '#101b2c',
  panel2: '#142239',
  border: '#28415b',
  cyan: '#37d7e8',
  teal: '#42e2ae',
  amber: '#ffc66d',
  red: '#ff717e',
  white: '#eef8ff',
  muted: '#99aec5',
};

const sceneMeta: Record<Scene, { chapter: string; title: string; accent: string }> = {
  intro: { chapter: '01 / CONCEPTO', title: '¿Qué es un EDR?', accent: C.cyan },
  telemetry: { chapter: '02 / SENSOR', title: 'La actividad deja señales', accent: C.cyan },
  alert: { chapter: '03 / DETECCIÓN', title: 'Una alerta inicia el análisis', accent: C.amber },
  triage: { chapter: '04 / TRIAJE', title: 'Reconstruir lo sucedido', accent: C.cyan },
  scope: { chapter: '05 / ALCANCE', title: 'Buscar en toda la flota', accent: C.teal },
  contain: { chapter: '06 / RESPUESTA', title: 'Contener con criterio', accent: C.amber },
  close: { chapter: '07 / SEGUIMIENTO', title: 'Corregir y verificar', accent: C.teal },
};

const panel: CSSProperties = {
  background: C.panel,
  border: `1px solid ${C.border}`,
  borderRadius: 20,
  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.22)',
};

const label: CSSProperties = {
  color: C.muted,
  fontSize: 20,
  fontWeight: 700,
  letterSpacing: 2.5,
  textTransform: 'uppercase',
};

function fade(frame: number, start = 0, duration = 14) {
  return interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

function rise(frame: number, start = 0, distance = 24) {
  return interpolate(frame, [start, start + 18], [distance, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

function Tag({ children, color = C.cyan }: { children: ReactNode; color?: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        border: `1px solid ${color}70`,
        color,
        borderRadius: 100,
        padding: '7px 13px',
        background: `${color}12`,
        fontSize: 20,
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  );
}

function Dot({ color = C.cyan, size = 10 }: { color?: string; size?: number }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 16px ${color}aa`,
        flexShrink: 0,
      }}
    />
  );
}

function Window({
  title,
  children,
  style,
}: {
  title: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div style={{ ...panel, overflow: 'hidden', ...style }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          height: 48,
          padding: '0 22px',
          borderBottom: `1px solid ${C.border}`,
          background: '#142238',
          color: C.muted,
          fontSize: 19,
          fontWeight: 700,
        }}
      >
        <Dot size={8} />
        {title}
      </div>
      {children}
    </div>
  );
}

function EventRow({
  name,
  detail,
  color = C.cyan,
  active = false,
  compact = false,
}: {
  name: string;
  detail: string;
  color?: string;
  active?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: compact ? '7px 12px' : '10px 14px',
        background: active ? `${color}18` : '#0d1727',
        border: `1px solid ${active ? `${color}90` : C.border}`,
        borderRadius: 12,
      }}
    >
      <Dot color={color} />
      <div style={{ minWidth: 0 }}>
        <div style={{ color: C.white, fontSize: compact ? 22 : 25, fontWeight: 750 }}>{name}</div>
        <div style={{ color: C.muted, fontSize: compact ? 17 : 18, marginTop: 2 }}>{detail}</div>
      </div>
    </div>
  );
}

function Intro({ frame }: { frame: number }) {
  const pulse = 1 + Math.sin(frame / 11) * 0.035;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 35, height: '100%' }}>
      <Window title="Endpoints supervisados" style={{ width: 445, height: 345, opacity: fade(frame) }}>
        <div style={{ display: 'grid', gap: 12, padding: 22 }}>
          <EventRow name="Alerta nueva" detail="HAL-WS-042 · portátil de Lucía" color={C.amber} active />
          <EventRow name="Estación de trabajo" detail="HAL-WS-104 · sensor activo" />
          <EventRow name="Servidor" detail="HAL-SRV-008 · sensor activo" />
        </div>
      </Window>
      <div style={{ position: 'relative', width: 145, height: 145, flexShrink: 0 }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: `2px solid ${C.cyan}`,
            boxShadow: `0 0 40px ${C.cyan}44, inset 0 0 32px ${C.cyan}22`,
            transform: `scale(${pulse})`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 19,
            display: 'grid',
            placeItems: 'center',
            borderRadius: '50%',
            background: '#143449',
            color: C.white,
            textAlign: 'center',
            fontSize: 21,
            fontWeight: 800,
          }}
        >
          SENSOR
          <br />
          EDR
        </div>
      </div>
      <Window title="Consola Blue Team" style={{ flex: 1, height: 345, opacity: fade(frame, 14) }}>
        <div style={{ padding: 25 }}>
          <div style={{ fontSize: 40, color: C.white, fontWeight: 850, lineHeight: 1.13 }}>
            Detectar.
            <br />
            Investigar.
            <br />
            Responder.
          </div>
          <div style={{ marginTop: 22 }}>
            <Tag>Endpoint Detection &amp; Response</Tag>
          </div>
        </div>
      </Window>
    </div>
  );
}

function Telemetry({ frame }: { frame: number }) {
  const rows = [
    { name: 'Proceso', detail: 'WINWORD.EXE inicia otro proceso', color: C.cyan },
    { name: 'Archivo', detail: 'Se crea un archivo en el equipo', color: C.teal },
    { name: 'Conexión', detail: 'Tráfico hacia una IP externa', color: C.amber },
  ];
  return (
    <div style={{ display: 'flex', gap: 30, height: '100%', alignItems: 'center' }}>
      <Window title="HAL-WS-042 · sensor activo" style={{ width: 390, height: 350, opacity: fade(frame) }}>
        <div style={{ padding: 25, display: 'grid', gap: 16 }}>
          <div style={{ fontSize: 25, color: C.white, fontWeight: 800 }}>Equipo de operaciones</div>
          <div
            style={{
              height: 115,
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              background: '#0b1524',
              display: 'grid',
              placeItems: 'center',
              color: C.cyan,
              fontSize: 53,
            }}
          >
            ⌘
          </div>
          <Tag color={C.teal}>Telemetría en curso</Tag>
        </div>
      </Window>
      <div style={{ flex: 1, display: 'grid', gap: 14 }}>
        {rows.map((row, index) => (
          <div
            key={row.name}
            style={{
              opacity: fade(frame, 10 + index * 16),
              transform: `translateY(${rise(frame, 10 + index * 16)}px)`,
            }}
          >
            <EventRow {...row} />
          </div>
        ))}
        <div style={{ color: C.muted, fontSize: 19, paddingLeft: 10, opacity: fade(frame, 60) }}>
          El contexto permite relacionar eventos, no solo contar alertas.
        </div>
      </div>
    </div>
  );
}

function Alert({ frame }: { frame: number }) {
  return (
    <div style={{ display: 'flex', gap: 30, height: '100%', alignItems: 'center' }}>
      <Window title="Árbol de procesos · HAL-WS-042" style={{ width: 565, height: 350, opacity: fade(frame) }}>
        <div style={{ padding: 23, display: 'grid', gap: 13 }}>
          <EventRow name="WINWORD.EXE" detail="Documento abierto por la usuaria" />
          <div style={{ marginLeft: 35, borderLeft: `2px solid ${C.border}`, paddingLeft: 14 }}>
            <EventRow name="powershell.exe" detail="Proceso hijo inesperado" color={C.amber} active />
          </div>
          <div style={{ marginLeft: 70, borderLeft: `2px solid ${C.border}`, paddingLeft: 14 }}>
            <EventRow name="Conexión saliente" detail="Dominio externo inusual" color={C.amber} />
          </div>
        </div>
      </Window>
      <Window title="Alerta EDR" style={{ flex: 1, height: 350, opacity: fade(frame, 18) }}>
        <div style={{ padding: 26 }}>
          <Tag color={C.amber}>Actividad sospechosa</Tag>
          <div style={{ fontSize: 32, color: C.white, fontWeight: 820, marginTop: 25, lineHeight: 1.16 }}>
            Documento → proceso → red
          </div>
          <div style={{ color: C.muted, fontSize: 20, marginTop: 17, lineHeight: 1.3 }}>
            Señal para investigar.
            <br />
            Aún no confirma un incidente.
          </div>
          <div
            style={{
              marginTop: 19,
              height: 7,
              borderRadius: 100,
              background: C.border,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${Math.min(100, (frame / 55) * 100)}%`,
                height: '100%',
                background: C.amber,
              }}
            />
          </div>
        </div>
      </Window>
    </div>
  );
}

function Triage({ frame }: { frame: number }) {
  const focus = Math.floor(frame / 55) % 3;
  return (
    <Window title="Caso #EDR-042 · Investigación" style={{ height: 375, opacity: fade(frame) }}>
      <div style={{ display: 'flex', height: 325 }}>
        <div style={{ width: 315, borderRight: `1px solid ${C.border}`, padding: 22 }}>
          <div style={label}>Contexto</div>
          <div style={{ display: 'grid', gap: 9, marginTop: 16 }}>
            <EventRow name="Equipo" detail="HAL-WS-042" active={focus === 0} compact />
            <EventRow name="Usuario" detail="Lucía · operaciones" active={focus === 1} compact />
            <EventRow name="Hora" detail="09:42 → 09:44" active={focus === 2} compact />
          </div>
        </div>
        <div style={{ flex: 1, padding: 18 }}>
          <div style={label}>Cronología correlacionada</div>
          <div style={{ display: 'grid', gap: 9, marginTop: 16 }}>
            <EventRow name="09:42 · Documento abierto" detail="Inicio normal de la secuencia" compact />
            <EventRow name="09:43 · Proceso hijo" detail="Validar origen, firma y propósito" color={C.amber} active compact />
            <EventRow name="09:44 · Conexión externa" detail="Comparar destino y comportamiento" color={C.amber} compact />
          </div>
        </div>
        <div style={{ width: 220, padding: 22, background: '#0e1d2b' }}>
          <div style={label}>Pregunta</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.white, marginTop: 22, lineHeight: 1.22 }}>
            ¿Hay una explicación legítima?
          </div>
          <div style={{ color: C.muted, fontSize: 17, marginTop: 25, lineHeight: 1.3 }}>
            Contrastar con el usuario y otras fuentes.
          </div>
        </div>
      </div>
    </Window>
  );
}

function Scope({ frame }: { frame: number }) {
  const scopeStart = timeline.segments.find((segment) => segment.scene === 'scope')?.startFrame ?? 0;
  const findingStart = (timeline.segments.find((segment) => segment.id === '11-scope')?.startFrame ?? scopeStart) - scopeStart;
  const matchesFound = frame > findingStart + 28;
  return (
    <Window title="Búsqueda de alcance · todos los endpoints" style={{ height: 375, opacity: fade(frame) }}>
      <div style={{ padding: 23 }}>
        <div
          style={{
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            background: '#0a1524',
            padding: '15px 19px',
            color: C.white,
            fontSize: 20,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>Buscar: archivo + dominio + patrón de procesos</span>
          <span style={{ color: C.cyan }}>⌕</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 13, marginTop: 24 }}>
          {Array.from({ length: 12 }, (_, index) => {
            const matching = index === 2 || index === 9;
            const found = matching && frame > findingStart + (index === 2 ? 8 : 28);
            return (
              <div
                key={index}
                style={{
                  background: found ? `${C.amber}22` : '#0c1728',
                  border: `1px solid ${found ? C.amber : C.border}`,
                  borderRadius: 12,
                  height: 69,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  opacity: fade(frame, 12 + index * 3),
                  color: found ? C.amber : C.muted,
                  fontWeight: 800,
                  fontSize: 23,
                }}
              >
                <Dot color={found ? C.amber : C.teal} size={9} />
                WS-{String(index + 31).padStart(3, '0')}
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
          <Tag color={matchesFound ? C.amber : C.cyan}>
            {matchesFound ? '2 coincidencias por revisar' : 'Búsqueda en curso'}
          </Tag>
          <div style={{ color: C.muted, fontSize: 19, alignSelf: 'center' }}>
            Una coincidencia requiere contexto.
          </div>
        </div>
      </div>
    </Window>
  );
}

function Contain({ frame }: { frame: number }) {
  const isolated = frame > 42;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 28, height: '100%' }}>
      <Window title="Decisión del analista" style={{ width: 440, height: 350, opacity: fade(frame) }}>
        <div style={{ padding: 24 }}>
          <Tag color={C.amber}>Decisión documentada</Tag>
          <div style={{ fontSize: 29, fontWeight: 850, color: C.white, marginTop: 20, lineHeight: 1.18 }}>
            Aislar según el plan
          </div>
          <div style={{ display: 'grid', gap: 9, marginTop: 18 }}>
            <EventRow name="Preservar" detail="Evidencias y cronología" color={C.cyan} compact />
            <EventRow name="Coordinar" detail="Equipo de respuesta" color={C.teal} compact />
          </div>
        </div>
      </Window>
      <Window title="Aislamiento de equipos" style={{ flex: 1, height: 350, opacity: fade(frame, 12) }}>
        <div style={{ padding: 23 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 27, fontWeight: 800, color: C.white }}>Equipos afectados</div>
            <Tag color={isolated ? C.amber : C.muted}>{isolated ? '3 aislados' : 'En evaluación'}</Tag>
          </div>
          <div style={{ display: 'grid', gap: 9, marginTop: 22 }}>
            {['HAL-WS-042', 'HAL-WS-033', 'HAL-WS-040'].map((host) => (
              <div key={host} style={{ ...panel, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: C.white, fontSize: 23, fontWeight: 800 }}>{host}</span>
                <span style={{ color: isolated ? C.red : C.muted, fontSize: 19, fontWeight: 750 }}>
                  {isolated ? 'Aislado de la red' : 'En evaluación'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Window>
    </div>
  );
}

function Close({ frame }: { frame: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 28, height: '100%' }}>
      <Window title="Respuesta y seguimiento" style={{ width: 580, height: 350, opacity: fade(frame) }}>
        <div style={{ display: 'grid', gap: 13, padding: 23 }}>
          <EventRow name="1 · Corregir" detail="Eliminar persistencia y causa raíz" color={C.amber} active={frame > 18} />
          <EventRow name="2 · Recuperar" detail="Validar el equipo antes de devolverlo" color={C.cyan} active={frame > 48} />
          <EventRow name="3 · Vigilar" detail="Comprobar que la actividad no reaparece" color={C.teal} active={frame > 78} />
        </div>
      </Window>
      <Window title="Visibilidad del EDR" style={{ flex: 1, height: 350, opacity: fade(frame, 15) }}>
        <div style={{ padding: 26 }}>
          <div style={{ fontSize: 31, fontWeight: 850, color: C.white, lineHeight: 1.17 }}>
            El sensor debe estar instalado y sano.
          </div>
          <div style={{ display: 'grid', gap: 13, marginTop: 30 }}>
            <EventRow name="Cubiertos" detail="Telemetría disponible" color={C.teal} />
            <EventRow name="Sin sensor" detail="Punto ciego a investigar" color={C.amber} />
          </div>
        </div>
      </Window>
    </div>
  );
}

function SceneVisual({ scene, frame }: { scene: Scene; frame: number }) {
  switch (scene) {
    case 'intro':
      return <Intro frame={frame} />;
    case 'telemetry':
      return <Telemetry frame={frame} />;
    case 'alert':
      return <Alert frame={frame} />;
    case 'triage':
      return <Triage frame={frame} />;
    case 'scope':
      return <Scope frame={frame} />;
    case 'contain':
      return <Contain frame={frame} />;
    case 'close':
      return <Close frame={frame} />;
  }
}

export function EDRVideo() {
  const frame = useCurrentFrame();
  const segments = timeline.segments;
  const active = segments.find((segment) => frame >= segment.startFrame && frame < segment.startFrame + segment.durationFrames)
    ?? segments[segments.length - 1];
  const scene = active.scene as Scene;
  const first = segments.find((segment) => segment.scene === scene);
  const sceneFrame = frame - (first?.startFrame ?? 0);
  const meta = sceneMeta[scene];
  const captionFrame = frame - active.startFrame;
  const captionOpacity = Math.min(
    fade(captionFrame, 1, 8),
    interpolate(captionFrame, [active.durationFrames - 10, active.durationFrames - 2], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 75% 10%, #11304a 0%, ${C.bg} 55%)`,
        color: C.white,
        fontFamily: 'Segoe UI, Arial, sans-serif',
      }}
    >
      <AbsoluteFill
        style={{
          opacity: 0.17,
          backgroundImage: 'linear-gradient(#26506a 1px, transparent 1px), linear-gradient(90deg, #26506a 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      <div style={{ position: 'absolute', top: 28, left: 55, right: 55, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 20, fontWeight: 850, letterSpacing: 1.2 }}>
          <Dot color={C.cyan} size={13} />
          INTELFORGE <span style={{ color: C.cyan }}>//</span> BLUE TEAM
        </div>
        <div style={{ ...label, fontSize: 14 }}>SIMULACIÓN EDUCATIVA</div>
      </div>

      <div style={{ position: 'absolute', top: 80, left: 55, right: 55, display: 'flex', alignItems: 'end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ ...label, color: meta.accent, fontSize: 15 }}>{meta.chapter}</div>
          <div style={{ marginTop: 5, color: C.white, fontSize: 42, fontWeight: 880, lineHeight: 1.1 }}>{meta.title}</div>
        </div>
        <div style={{ display: 'flex', gap: 7, marginBottom: 4 }}>
          {(Object.keys(sceneMeta) as Scene[]).map((key) => (
            <div key={key} style={{ width: 29, height: 5, borderRadius: 100, background: key === scene ? meta.accent : C.border }} />
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', top: 146, left: 55, right: 55, height: 397 }}>
        <SceneVisual scene={scene} frame={sceneFrame} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 55,
          right: 55,
          bottom: 35,
          minHeight: 105,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          border: `1px solid ${C.border}`,
          borderLeft: `5px solid ${meta.accent}`,
          borderRadius: 15,
          padding: '15px 24px',
          background: 'rgba(8, 18, 33, 0.93)',
          boxShadow: '0 18px 45px rgba(0, 0, 0, 0.26)',
          opacity: captionOpacity,
        }}
      >
        <div style={{ color: C.white, fontSize: 34, fontWeight: 680, lineHeight: 1.22 }}>{active.text}</div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 5, background: C.border }}>
        <div style={{ width: `${((frame + 1) / timeline.durationFrames) * 100}%`, height: '100%', background: C.cyan }} />
      </div>

      {segments.map((segment) => (
        <Sequence key={segment.id} from={segment.startFrame} durationInFrames={segment.audioFrames}>
          <Html5Audio src={staticFile(segment.audio.replace(/^\/+/, ''))} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}
