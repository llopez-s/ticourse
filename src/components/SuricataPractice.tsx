/// <reference types="vite/client" />
import { useId, useMemo, useState } from 'react';
import { LabResultSummary, LabWorkbookBar, LabWorkspaceProvider, labButton, useLabSession, useLabState, useLabWorkspace } from './labs/LabWorkspace';
import { downloadLabFile } from '../lib/labWorkspace';
import { evaluate, loadRules, outcomeOf, parseHomeNet, type Outcome, type SensorMode, type SimAlert, type SimEvent } from '../lib/suricataSim';
import corpus from '../../public/labs/suricata-practice/corpus.json';
import missionData from '../../public/labs/suricata-practice/missions.json';
import parity from '../data/suricata-parity.json';
import reference from '../../public/labs/suricata-practice/reference.rules?raw';

const EVENTS = corpus.events as SimEvent[];
const HOME = parseHomeNet(corpus.homeNet);
const MISSIONS = missionData.missions.map((m) => ({ ...m, mode: m.mode as SensorMode, expect: m.expect as Record<string, Outcome> }));
type Mission = (typeof MISSIONS)[number];

const BRIEF: Record<string, { goal: string; hints: string[]; solution: string[] }> = {
  m1: {
    goal: 'El informe de inteligencia nombra harbor-sync.example. Alerta con cada consulta DNS a ese dominio o a sus subdominios (d1–d3), sin alertar con los dominios parecidos (d4, d5) ni con el portal de Halden (d6).',
    hints: [
      'El resolver es 10.20.0.53, una dirección interna: una regla hacia $EXTERNAL_NET no vería ninguna consulta.',
      'd3 escribe el dominio con mayúsculas mezcladas.',
      'evilharbor-sync.example también termina en «harbor-sync.example». ¿Qué transformación añade el punto que falta?',
    ],
    solution: ['sid:1000101'],
  },
  m2: {
    goal: 'Un equipo envía datos con un POST a /collect-demo. Detecta h1 y h2 sin alertar con la página de documentación (GET), la subida de una imagen ni la API legítima del portal.',
    hints: [
      'h1 usa el puerto 8081 y h2 ni siquiera tiene nombre de host: no ates la regla a la IP, al puerto ni al Host.',
      'La imagen /static/collect-demo.png contiene el patrón, pero no empieza por él.',
    ],
    solution: ['sid:1000102'],
  },
  m3: {
    goal: 'El EDR ve a 10.20.4.17 enviar datos por HTTPS, y tu regla HTTP no dice nada. Detecta las conexiones TLS al dominio del informe (t1, t2) sin alertar con el parecido (t3) ni con el portal (t4).',
    hints: [
      'Con TLS el sensor no ve la URI ni el cuerpo. Lo que viaja legible es el nombre del servidor del saludo (SNI).',
      'El problema del dominio parecido es el mismo que en la misión 1.',
    ],
    solution: ['sid:1000103'],
  },
  m4: {
    goal: 'El sensor pasa a estar en línea (IPS). Dirección pide bloquear el canal cifrado (t1, t2) y dejar DNS y HTTP solo en alerta. Además, el servidor de enriquecimiento del SOC (10.20.9.5, d7) consulta el dominio a propósito y no debe generar alertas. Aquí cuentan las dieciséis conexiones.',
    hints: [
      'drop solo descarta en un sensor en línea; en las misiones 1 a 3 la misma regla habría salido como allowed.',
      'pass gana a drop y a alert, aunque esté escrita después. Acótala a esa IP y a ese dominio: una excepción amplia es un agujero.',
    ],
    solution: ['sid:1000103', 'sid:1000104'],
  },
};

const STARTER = `# local.rules · tus reglas para la captura de Halden
# Formato: acción protocolo origen puerto -> destino puerto (opciones;)
# Ejemplo que carga pero no detecta nada útil:
alert dns $HOME_NET any -> any any (msg:"MI PRIMERA REGLA"; dns.query; content:"ejemplo"; sid:1000001; rev:1;)
`;

const OUTCOME_LABEL: Record<Outcome, string> = { allowed: 'alerta (allowed)', blocked: 'bloqueo (blocked)', none: 'sin alerta' };

function visible(event: SimEvent) {
  if (event.dns) return `DNS · ${event.dns.query}`;
  if (event.http) return `${event.http.method} ${event.http.uri} · Host: ${event.http.host}`;
  return `TLS · SNI ${event.tls!.sni}`;
}

function verdict(want: Outcome, got: Outcome) {
  if (want === got) return { ok: true, text: want === 'none' ? 'Acierto (sin alerta)' : 'Acierto' };
  if (want === 'none') return { ok: false, text: 'Falso positivo' };
  if (got === 'none') return { ok: false, text: 'Falso negativo' };
  return { ok: false, text: 'Acción distinta' };
}

function eveLine(alert: SimAlert, event: SimEvent, index: number) {
  return JSON.stringify({
    timestamp: `2026-10-14T09:00:${String(index).padStart(2, '0')}.000000+0200`, event_type: 'alert',
    src_ip: event.src, src_port: alert.srcPort, dest_ip: event.dst, dest_port: event.dport,
    proto: event.proto === 'dns' ? 'UDP' : 'TCP', app_proto: event.proto,
    alert: { action: alert.action, signature_id: alert.sid, rev: alert.rev, signature: alert.signature },
  });
}

export default function SuricataPractice() {
  return <LabWorkspaceProvider identity="sp4m7/suricata/v1"><LabWorkbookBar /><SuricataLab /><LabResultSummary reviewLinks={[]} /></LabWorkspaceProvider>;
}

interface Run { missionId: string; rulesText: string }

function SuricataLab() {
  const editorId = useId();
  const session = useLabSession();
  const workspace = useLabWorkspace();
  const [rulesText, setRulesText] = useLabState('rules', STARTER);
  const [missionId, setMissionId] = useLabState('mission', 'm1');
  const [run, setRun] = useState<Run | null>(null);
  const mission = MISSIONS.find((m) => m.id === missionId) ?? MISSIONS[0];
  const brief = BRIEF[mission.id];
  const scope = mission.scope.map((id) => EVENTS.find((e) => e.id === id)!);

  const result = useMemo(() => {
    if (!run) return null;
    const m = MISSIONS.find((x) => x.id === run.missionId)!;
    const loaded = loadRules(run.rulesText);
    const alerts = evaluate(loaded.rules, EVENTS, m.mode, HOME);
    const rows = m.scope.map((id) => {
      const want = m.expect[id] ?? 'none';
      const got = outcomeOf(alerts, id);
      return { id, want, got, ...verdict(want, got) };
    });
    return { mission: m, loaded, alerts, rows };
  }, [run]);

  const execute = () => {
    const loaded = loadRules(rulesText);
    const alerts = evaluate(loaded.rules, EVENTS, mission.mode, HOME);
    const misses = mission.scope.filter((id) => outcomeOf(alerts, id) !== (mission.expect[id] ?? 'none'));
    const mistakes = [
      ...loaded.issues.map((i) => `Línea ${i.line}: ${i.message}`),
      ...misses.map((id) => `${id}: ${verdict(mission.expect[id] ?? 'none', outcomeOf(alerts, id)).text}`),
    ];
    session.record({
      step: mission.id, title: `Misión ${mission.id.slice(1)} · ${mission.title}`,
      passed: loaded.issues.length === 0 && misses.length === 0,
      correct: mission.scope.length - misses.length, total: mission.scope.length, mistakes,
    }, false);
    setRun({ missionId: mission.id, rulesText });
  };

  const solution = reference.split('\n').filter((line) => brief.solution.some((sid) => line.includes(sid))).join('\n\n');
  const shown = result && result.mission.id === mission.id ? result : null;

  return (
    <section className="my-6 space-y-5 rounded-xl border border-cyan-500/40 bg-ink-900 p-4" aria-label="Laboratorio de Suricata">
      <header className="space-y-2">
        <h3 className="font-bold text-slate-100">Laboratorio · Reglas de Suricata sobre una captura de Halden</h3>
        <p className="text-sm text-slate-300">
          Escribe reglas y ejecútalas sobre dieciséis conexiones ficticias de una mañana en el puerto. El simulador corre en tu
          navegador y entiende un subconjunto del lenguaje: dns.query, http.method, http.uri, http.host y tls.sni con content,
          nocase, startswith, endswith y dotprefix, más flow, direcciones, puertos y las acciones alert, drop, reject y pass.
          Su comportamiento se ha comparado con Suricata {parity.suricata.replace(/^.*version\s+/i, '').replace(/\s+RELEASE$/, '')} en {parity.cases.length} casos.
          Lo que queda fuera del subconjunto se señala como tal, no se adivina. Práctica opcional, sin efecto en el examen.
        </p>
      </header>

      <div role="group" aria-label="Misiones" className="flex flex-wrap gap-2">
        {MISSIONS.map((m) => {
          const done = workspace.current.results[m.id]?.latest.passed;
          return <button key={m.id} type="button" className={labButton} aria-pressed={m.id === mission.id} onClick={() => setMissionId(m.id)}>
            {done ? '✓ ' : ''}Misión {m.id.slice(1)}
          </button>;
        })}
      </div>

      <div className="space-y-2 rounded-lg border border-ink-700 p-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h4 className="font-semibold text-slate-100">{mission.title}</h4>
          <span className="rounded-full border border-ink-600 px-2 py-0.5 text-xs text-slate-300">
            Sensor {mission.mode === 'ips' ? 'en línea (IPS): drop descarta' : 'en un puerto SPAN (IDS): solo ve una copia'}
          </span>
        </div>
        <p className="text-sm text-slate-300">{brief.goal}</p>
        <details className="text-sm text-slate-300">
          <summary className="cursor-pointer text-cyan-300">Pistas</summary>
          <ul className="mt-2 list-inside list-disc space-y-1">{brief.hints.map((h) => <li key={h}>{h}</li>)}</ul>
        </details>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <caption className="mb-1 text-left text-xs text-slate-400">Conexiones de esta misión. HOME_NET = 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16.</caption>
          <thead><tr className="border-b border-ink-700 text-slate-400">
            <th className="py-1 pr-3">Id</th><th className="py-1 pr-3">Origen → destino</th><th className="py-1 pr-3">Lo que ve el sensor</th>
            <th className="py-1 pr-3">Contexto</th><th className="py-1">Objetivo</th>
          </tr></thead>
          <tbody>{scope.map((e) => <tr key={e.id} className="border-b border-ink-800 align-top">
            <td className="py-1 pr-3 font-mono">{e.id}</td>
            <td className="py-1 pr-3 font-mono">{e.src} → {e.dst}:{e.dport}</td>
            <td className="py-1 pr-3 font-mono break-all">{visible(e)}</td>
            <td className="py-1 pr-3">{e.note}</td>
            <td className="py-1">{OUTCOME_LABEL[mission.expect[e.id] ?? 'none']}</td>
          </tr>)}</tbody>
        </table>
      </div>

      <div className="space-y-2">
        <label htmlFor={editorId} className="block text-sm font-semibold text-slate-100">local.rules · un solo archivo para las cuatro misiones (borrador local)</label>
        <textarea id={editorId} value={rulesText} onChange={(event) => setRulesText(event.target.value)} spellCheck={false}
          className="min-h-56 w-full rounded-lg border border-ink-600 bg-ink-950 p-3 font-mono text-xs [font-variant-ligatures:none] text-slate-200 focus-visible:outline-2 focus-visible:outline-cyan-400" />
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={execute} className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-ink-950 hover:bg-cyan-400">
            Ejecutar sobre la captura
          </button>
          <button type="button" className={labButton} onClick={() => downloadLabFile('local.rules', rulesText, 'text/plain;charset=utf-8')}>
            Descargar local.rules
          </button>
        </div>
      </div>

      {shown && <Results result={shown} />}

      <details className="rounded-lg border border-ink-700 p-3" onToggle={(event) => { if (event.currentTarget.open) session.revealHelp(); }}>
        <summary className="cursor-pointer font-semibold text-cyan-300">Ver la solución de esta misión</summary>
        <p className="my-2 text-sm text-slate-300">Abrirla marca las misiones que valides después como resueltas con ayuda. El archivo completo, con comentarios, está en el ZIP.</p>
        <pre className="overflow-x-auto whitespace-pre-wrap text-xs text-slate-300 [font-variant-ligatures:none]"><code>{solution}</code></pre>
      </details>

      <div className="space-y-2 text-sm text-slate-300">
        <p>Con Suricata instalado, comprueba tus reglas con el motor real. El ZIP trae la captura, las misiones y un verificador:</p>
        <a className="inline-block text-cyan-300 underline" download href={`${import.meta.env.BASE_URL}labs/suricata-practice.zip`}>
          Descargar captura, misiones y verificador (ZIP)
        </a>
        <pre className="overflow-x-auto rounded-lg bg-ink-950 p-3 text-xs text-cyan-300">{'python verify.py --rules local.rules\npython verify.py --rules local.rules --mission m4'}</pre>
      </div>
    </section>
  );
}

function Results({ result }: { result: { mission: Mission; loaded: ReturnType<typeof loadRules>; alerts: SimAlert[]; rows: { id: string; want: Outcome; got: Outcome; ok: boolean; text: string }[] } }) {
  const { mission, loaded, alerts, rows } = result;
  const passed = loaded.issues.length === 0 && rows.every((r) => r.ok);
  const inScope = alerts.filter((a) => mission.scope.includes(a.event));
  return (
    <div className="space-y-3" aria-live="polite">
      <p role="status" className={`rounded-lg border p-3 text-sm ${passed ? 'border-emerald-500/50 text-emerald-200' : 'border-amber-500/50 text-amber-200'}`}>
        {passed ? 'Misión cumplida: cada conexión da el resultado esperado y todas las reglas cargan.'
          : `${rows.filter((r) => r.ok).length}/${rows.length} conexiones correctas${loaded.issues.length ? ` · ${loaded.issues.length} ${loaded.issues.length === 1 ? 'línea no carga' : 'líneas no cargan'}` : ''}.`}
        {' '}{loaded.rules.length} {loaded.rules.length === 1 ? 'regla cargada' : 'reglas cargadas'}.
      </p>
      {loaded.issues.length > 0 && <ul className="space-y-1 text-xs">
        {loaded.issues.map((issue) => <li key={`${issue.line}-${issue.message}`} className={issue.kind === 'error' ? 'text-rose-300' : 'text-amber-300'}>
          <strong>Línea {issue.line} · {issue.kind === 'error' ? 'Suricata no cargaría esta regla' : 'Fuera del simulador'}:</strong> {issue.message}
        </li>)}
      </ul>}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead><tr className="border-b border-ink-700 text-slate-400">
            <th className="py-1 pr-3">Id</th><th className="py-1 pr-3">Esperado</th><th className="py-1 pr-3">Obtenido</th><th className="py-1">Resultado</th>
          </tr></thead>
          <tbody>{rows.map((r) => <tr key={r.id} className="border-b border-ink-800">
            <td className="py-1 pr-3 font-mono">{r.id}</td><td className="py-1 pr-3">{OUTCOME_LABEL[r.want]}</td>
            <td className="py-1 pr-3">{OUTCOME_LABEL[r.got]}</td>
            <td className={`py-1 ${r.ok ? 'text-emerald-300' : 'text-rose-300'}`}>{r.ok ? '✓' : '✗'} {r.text}</td>
          </tr>)}</tbody>
        </table>
      </div>
      <details open={inScope.length > 0 && inScope.length <= 8}>
        <summary className="cursor-pointer text-sm text-cyan-300">eve.json simplificado ({inScope.length} {inScope.length === 1 ? 'alerta' : 'alertas'})</summary>
        <pre className="mt-2 overflow-x-auto rounded-lg bg-ink-950 p-3 text-[11px] text-slate-300">
          {inScope.length ? inScope.map((a) => eveLine(a, EVENTS.find((e) => e.id === a.event)!, EVENTS.findIndex((e) => e.id === a.event))).join('\n') : '(sin alertas)'}
        </pre>
      </details>
    </div>
  );
}
