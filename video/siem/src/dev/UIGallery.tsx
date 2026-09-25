import { AbsoluteFill, Composition, registerRoot, useCurrentFrame } from 'remotion';
import { ensureFonts } from '../theme/fonts';
import { C, TYPE } from '../theme/tokens';
import {
  Backdrop,
  CaseStrip,
  Checklist,
  Chip,
  Connector,
  Counter,
  Cursor,
  ExamBadge,
  MonoLine,
  NodeCard,
  Packet,
  Panel,
  PipelineSpine,
  SeverityBadge,
  Stamp,
  Toggle,
  curveBetween,
} from '../ui';

ensureFonts();

/** Dev-only sheet showing every shared primitive, for visual QA of the design system. */
function UIGallery() {
  const frame = useCurrentFrame();
  const curve = curveBetween({ x: 40, y: 60 }, { x: 520, y: 200 });
  return (
    <AbsoluteFill>
      <Backdrop />
      <div style={{ position: 'absolute', left: 96, top: 40 }}>
        <PipelineSpine active={2} />
      </div>
      <div style={{ position: 'absolute', left: 96, top: 140 }}>
        <CaseStrip
          status="EN TRIAJE"
          markers={[
            { time: '01:52', label: 'logon svc', accent: 'rose', reveal: 1 },
            { time: '02:00', label: 'inicio flujo', accent: 'amber', reveal: 1 },
            { time: '04:30', label: 'fin flujo', reveal: 0 },
          ]}
        />
      </div>
      <div style={{ position: 'absolute', left: 96, top: 260, display: 'flex', gap: 28 }}>
        <Panel title="Consola SIEM · cola de alertas" icon="bell" style={{ width: 820, height: 380 }} glow={0.6}>
          <div style={{ padding: 28, display: 'grid', gap: 18 }}>
            <MonoLine
              tokens={[
                { t: '2026-03-14T01:52:07Z ', c: C.muted },
                { t: 'EventID=', c: C.faint },
                { t: '4624', c: C.cyanSoft, bold: true },
                { t: ' user=', c: C.faint },
                { t: 'svc_tosreport', c: C.amber, bg: 'rgba(251,191,36,0.12)' },
                { t: ' src=10.20.4.17', c: C.text },
              ]}
            />
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Chip>cian</Chip>
              <Chip accent="amber" icon="alert">ruido</Chip>
              <Chip accent="rose" solid>atacante</Chip>
              <Chip accent="emerald" icon="check">validado</Chip>
              <SeverityBadge level="BAJA" />
              <SeverityBadge level="ALTA" />
              <ExamBadge objective="4.4" />
            </div>
            <div style={{ display: 'flex', gap: 30, alignItems: 'center' }}>
              <Counter value={6000} unit="/ día" caption="alertas en la cola" size={TYPE.h1} />
              <Toggle on={1} label="Regla ACTIVA" />
            </div>
          </div>
        </Panel>
        <div style={{ display: 'grid', gap: 16, width: 520 }}>
          <NodeCard icon="server" label="srv-tc-app03" sublabel="10.20.8.31 · terminal" state="alert" />
          <NodeCard icon="firewall" label="Firewall perimetral" sublabel="syslog 6514" state="active" />
          <NodeCard icon="laptop" label="portátil-lab" sublabel="criticidad baja" state="idle" />
          <Checklist
            frame={frame}
            items={[
              { label: '¿Qué ha pasado?', at: 10 },
              { label: '¿Dónde?', at: 20 },
              { label: '¿Qué hago?', at: 999 },
            ]}
          />
        </div>
      </div>
      <svg style={{ position: 'absolute', left: 1480, top: 300 }} width={560} height={260}>
        <Connector curve={curve} flow={frame / 30} />
        <Packet curve={curve} t={0.55} />
      </svg>
      <div style={{ position: 'absolute', left: 1500, top: 620 }}>
        <Stamp frame={frame} at={30} accent="amber">Cerradas sin abrir</Stamp>
      </div>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080 }}>
        <Cursor frame={frame} path={[{ x: 1100, y: 720, at: 0 }, { x: 1300, y: 780, at: 40, click: true }]} />
      </div>
    </AbsoluteFill>
  );
}

registerRoot(() => (
  <Composition id="UIGallery" component={UIGallery} durationInFrames={90} fps={30} width={1920} height={1080} />
));
