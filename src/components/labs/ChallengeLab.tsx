import type { ChallengeAnswer, ChallengeCase, Evidence, LogCase, PivotCase } from '../../lib/labChallenge';
import { emptyChallengeAnswer, evaluateChallenge, filterLogs, queryEvidence, readyToSubmit, RUBRIC, WRITING_FIELDS } from '../../lib/labChallenge';
import { downloadLabFile } from '../../lib/labWorkspace';
import { labButton, labInput, useLabSession, useLabState } from './LabWorkspace';

function References({ evidence, selected, onChange, label }: {
  evidence: Evidence[]; selected: string[]; onChange: (ids: string[]) => void; label: string;
}) {
  return <fieldset className="mt-3">
    <legend className="mb-2 text-xs font-semibold text-slate-400">{label}</legend>
    <div className="flex flex-wrap gap-2">{evidence.map((e) => <label key={e.id} className="flex cursor-pointer items-center gap-2 rounded border border-ink-600 bg-ink-950 px-2 py-1.5 text-xs text-slate-200" title={e.source}>
      <input type="checkbox" checked={selected.includes(e.id)} className="accent-cyan-400"
        onChange={(event) => onChange(event.target.checked ? [...selected, e.id] : selected.filter((id) => id !== e.id))} />
      {e.id}
    </label>)}</div>
  </fieldset>;
}

function EvidenceCard({ item }: { item: Evidence }) {
  return <article className="rounded-lg border border-ink-700 bg-ink-950 p-4">
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <h3 className="text-sm font-semibold text-slate-100"><span className="mr-2 font-mono text-cyan-300">{item.id}</span>{item.source}</h3>
      <span className="font-mono text-[11px] text-slate-400">{item.at}</span>
    </div>
    <p className="mt-2 text-sm leading-relaxed text-slate-300">{item.text}</p>
  </article>;
}

function PivotExplorer({ data, opened, onOpen }: { data: PivotCase; opened: string[]; onOpen: (id: string) => void }) {
  const spent = data.evidence.filter((e) => opened.includes(e.id)).reduce((s, e) => s + (e.cost ?? 0), 0);
  return <section aria-label="Colección de evidencias" className="space-y-3">
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-700 pb-3">
      <h2 className="font-semibold text-slate-100">Bitácora de pivotes</h2>
      <span className="font-mono text-sm text-cyan-300">{data.budget - spent}/{data.budget} queries disponibles</span>
    </div>
    <p className="text-xs text-slate-400">Consulta desde las evidencias abiertas. Los registros no vienen etiquetados como activos o ruido.</p>
    {data.evidence.map((e) => opened.includes(e.id) ? <EvidenceCard key={e.id} item={e} /> : <div key={e.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed border-ink-600 px-4 py-3">
      <div><span className="mr-2 font-mono text-xs text-cyan-300">{e.id}</span><span className="text-sm text-slate-300">{e.source}</span>
        <p className="mt-1 text-xs text-slate-400">{e.requires && !opened.includes(e.requires) ? `Requiere abrir ${e.requires}` : 'Registro disponible para consulta'}</p></div>
      <button className={labButton} disabled={spent + (e.cost ?? 0) > data.budget || !!(e.requires && !opened.includes(e.requires))}
        onClick={() => onOpen(e.id)}>Consultar {e.id} · {e.cost ?? 0} {e.cost === 1 ? 'query' : 'queries'}</button>
    </div>)}
  </section>;
}

function LogExplorer({ data, timeline, onTimeline }: { data: LogCase; timeline: string[]; onTimeline: (ids: string[]) => void }) {
  const [query, setQuery] = useLabState('log-query', '');
  const [source, setSource] = useLabState('log-source', 'all');
  const [field, setField] = useLabState<'all' | 'host' | 'user' | 'event'>('log-field', 'all');
  const [from, setFrom] = useLabState('log-from', '');
  const [to, setTo] = useLabState('log-to', '');
  const [descending, setDescending] = useLabState('log-descending', false);
  const records = filterLogs(data.records, query, source, field, from, to, descending);
  return <section aria-label="Explorador de registros" className="space-y-4">
    <h2 className="font-semibold text-slate-100">Consola de evidencias · UTC</h2>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <label className="text-xs text-slate-300">Buscar en registros<input className={`${labInput} mt-1`} value={query} onChange={(e) => setQuery(e.target.value)} /></label>
      <label className="text-xs text-slate-300">Campo<select className={`${labInput} mt-1`} value={field} onChange={(e) => setField(e.target.value as typeof field)}>
        <option value="all">Todos los campos</option><option value="host">Equipo</option><option value="user">Cuenta</option><option value="event">Evento</option>
      </select></label>
      <label className="text-xs text-slate-300">Fuente<select className={`${labInput} mt-1`} value={source} onChange={(e) => setSource(e.target.value)}>
        <option value="all">Todas las fuentes</option><option value="auth">Autenticación</option><option value="endpoint">Endpoint</option><option value="firewall">Firewall</option>
      </select></label>
      <label className="text-xs text-slate-300">Desde (UTC)<input className={`${labInput} mt-1`} type="time" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
      <label className="text-xs text-slate-300">Hasta (UTC)<input className={`${labInput} mt-1`} type="time" value={to} onChange={(e) => setTo(e.target.value)} /></label>
      <button className={`${labButton} self-end`} onClick={() => setDescending((v) => !v)}>Hora: {descending ? 'más reciente primero' : 'más antigua primero'}</button>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
      <p role="status">{records.length}/{data.records.length} registros · {timeline.length}/{data.timeline.length} eventos en tu cronología</p>
      <button className="text-cyan-300 underline" onClick={() => { setQuery(''); setSource('all'); setField('all'); setFrom(''); setTo(''); }}>Limpiar filtros</button>
    </div>
    <div tabIndex={0} role="region" aria-label="Registros filtrados, desplazamiento horizontal" className="max-h-[32rem] overflow-auto rounded-xl border border-ink-700 focus-visible:outline-2 focus-visible:outline-cyan-400">
      <table className="w-full min-w-[650px] text-left text-xs">
        <caption className="sr-only">Registros sintéticos. Añade cinco eventos en orden temporal a la cronología.</caption>
        <thead className="sticky top-0 bg-ink-800 text-slate-200"><tr>{['Evento', 'Hora UTC', 'Fuente', 'Equipo / cuenta', 'Registro', 'Cronología'].map((h) => <th key={h} scope="col" className="p-3 font-semibold">{h}</th>)}</tr></thead>
        <tbody>{records.map((r) => <tr key={r.id} className="border-t border-ink-700 align-top">
          <th scope="row" className="p-3 font-mono text-cyan-300">{r.id}</th>
          <td className="whitespace-nowrap p-3 font-mono text-slate-400">{r.at.slice(11, 19)}</td><td className="p-3 text-slate-400">{r.source}</td>
          <td className="p-3 font-mono text-slate-200">{r.host}<br />{r.user}</td>
          <td className="min-w-64 p-3 leading-relaxed text-slate-300"><code className="text-slate-100">{r.event}</code><br />{r.detail}</td>
          <td className="p-3"><button className={labButton} aria-label={`${timeline.includes(r.id) ? 'Quitar' : 'Añadir'} evento ${r.id}`}
            disabled={!timeline.includes(r.id) && timeline.length >= data.timeline.length}
            onClick={() => onTimeline(timeline.includes(r.id) ? timeline.filter((id) => id !== r.id) : [...timeline, r.id])}>{timeline.includes(r.id) ? 'Quitar' : 'Añadir'}</button></td>
        </tr>)}</tbody>
      </table>
      {!records.length && <p className="p-5 text-sm text-slate-400">Sin coincidencias. Amplía el filtro o la ventana temporal.</p>}
    </div>
    <fieldset className="rounded-lg border border-ink-600 p-4">
      <legend className="px-1 text-sm font-semibold text-slate-100">Tu cronología · orden de incorporación</legend>
      <p className="mb-3 text-xs text-slate-400">Añade los eventos en orden temporal. Puedes moverlos con los botones o quitarlos sin perder el resto.</p>
      <ol className="space-y-2">{timeline.map((id, i) => {
        const record = data.records.find((r) => r.id === id)!;
        const move = (toIndex: number) => { const next = [...timeline]; [next[i], next[toIndex]] = [next[toIndex], next[i]]; onTimeline(next); };
        return <li key={id} className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
          <span className="flex-1 font-mono">{i + 1}. {id} · {record.at.slice(11, 19)} · {record.event}</span>
          <button className={labButton} aria-label={`Subir ${id}`} disabled={i === 0} onClick={() => move(i - 1)}>↑</button>
          <button className={labButton} aria-label={`Bajar ${id}`} disabled={i === timeline.length - 1} onClick={() => move(i + 1)}>↓</button>
          <button className={labButton} aria-label={`Quitar ${id} de cronología`} onClick={() => onTimeline(timeline.filter((x) => x !== id))}>Quitar</button>
        </li>;
      })}</ol>
    </fieldset>
  </section>;
}

export default function ChallengeLab({ data }: { data: ChallengeCase }) {
  const session = useLabSession();
  const [answer, setAnswer] = useLabState<ChallengeAnswer>('answer', emptyChallengeAnswer);
  const [opened, setOpened] = useLabState<string[]>('opened', () => data.kind === 'pivot' ? data.evidence.filter((e) => !e.cost).map((e) => e.id) : []);
  const [submitted, setSubmitted] = useLabState('submitted', false);
  const [hintOpen, setHintOpen] = useLabState('hintOpen', false);
  const [solutionOpen, setSolutionOpen] = useLabState('solutionOpen', false);
  const [rubric, setRubric] = useLabState<Record<string, number>>('rubric', {});
  const checks = evaluateChallenge(data, answer);
  const ready = readyToSubmit(data, answer, opened);
  const update = (next: ChallengeAnswer) => { setAnswer(next); setSubmitted(false); };
  const setDecision = (id: string, value: string) => update({ ...answer, decisions: { ...answer.decisions, [id]: value } });
  const setText = (id: string, value: string) => update({ ...answer, text: { ...answer.text, [id]: value } });
  const setReferences = (id: string, value: string[]) => update({ ...answer, references: { ...answer.references, [id]: value } });
  const exportMarkdown = () => {
    const lines = [`# ${data.title}`, '', data.brief, '', '## Respuestas estructuradas', '',
      ...Object.entries(answer.decisions).map(([key, value]) => `- ${key}: ${value}`),
      ...Object.entries(answer.references).map(([key, value]) => `- Evidencias ${key}: ${value.join(', ')}`),
      ...(answer.timeline.length ? [`- Cronología: ${answer.timeline.join(' → ')}`] : []), '',
      ...Object.entries(answer.text).flatMap(([key, value]) => [`## ${WRITING_FIELDS[data.kind].find((f) => f.id === key)?.label ?? key}`, '', value, '']),
      '## Autoevaluación (no es corrección automática)', '', ...RUBRIC.map((r) => `- ${r.title}: ${rubric[r.id] ?? 'sin evaluar'}/2`), '',
      `Estado: ${submitted ? 'entregado' : 'borrador'}. Pista consultada: ${hintOpen ? 'sí' : 'no'}. Solución consultada: ${solutionOpen ? 'sí' : 'no'}.`,
    ];
    downloadLabFile(`${data.id}-entrega.md`, lines.join('\n'), 'text/markdown;charset=utf-8');
  };
  return <div className="space-y-6">
    <section className="border-l-2 border-cyan-400 bg-cyan-950/20 p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300">Dossier sintético · {data.minutes} minutos orientativos</p>
      <h2 className="mt-2 text-xl font-bold text-slate-50">{data.title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-300">{data.brief}</p>
      <p className="mt-3 text-xs text-slate-400">Práctica opcional, sin XP ni efecto sobre tu preparación de examen. «Entregado» indica que has presentado tu trabajo; el razonamiento escrito requiere autoevaluación.</p>
    </section>

    {data.kind === 'pivot' ? <PivotExplorer data={data} opened={opened} onOpen={(id) => setOpened(queryEvidence(data, opened, id))} />
      : data.kind === 'logs' ? <LogExplorer data={data} timeline={answer.timeline} onTimeline={(timeline) => update({ ...answer, timeline })} />
        : <section aria-label="Dossier de evidencias" className="space-y-3">{data.evidence.map((item) => <EvidenceCard key={item.id} item={item} />)}</section>}

    <section aria-label="Tu entrega" className="space-y-4 rounded-xl border border-ink-700 bg-ink-900 p-5">
      <h2 className="font-semibold text-slate-100">Tu entrega</h2>
      {data.kind === 'pivot' && data.candidates.map((c) => <fieldset key={c.id} className="rounded-lg border border-ink-600 p-4">
        <legend className="break-all px-1 font-mono text-sm text-cyan-200">{c.label}</legend>
        <label className="text-xs text-slate-300">Valoración de {c.label}
          <select className={`${labInput} mt-2`} value={answer.decisions[c.id] ?? ''} onChange={(e) => setDecision(c.id, e.target.value)}>
            <option value="" disabled>Elegir valoración</option><option value="linked">Vinculado al caso</option><option value="unrelated">Relación descartada en este expediente</option><option value="uncertain">Evidencia insuficiente</option>
          </select>
        </label>
        <References label={`Evidencias consultadas que sostienen tu valoración de ${c.label}`} evidence={data.evidence.filter((e) => opened.includes(e.id))}
          selected={answer.references[c.id] ?? []} onChange={(ids) => setReferences(c.id, ids)} />
      </fieldset>)}
      {data.kind === 'report' && <>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="text-xs text-slate-300">Alcance demostrado<select className={`${labInput} mt-2`} value={answer.decisions.assessment ?? ''} onChange={(e) => setDecision('assessment', e.target.value)}>
            <option value="" disabled>Elegir juicio</option><option value="exfiltration">Exfiltración confirmada</option><option value="access">Acceso confirmado, exfiltración no demostrada</option><option value="attempt">Intento bloqueado, sin acceso demostrado</option>
          </select></label>
          <label className="text-xs text-slate-300">Confianza en ese juicio<select className={`${labInput} mt-2`} value={answer.decisions.confidence ?? ''} onChange={(e) => setDecision('confidence', e.target.value)}>
            <option value="" disabled>Elegir confianza</option><option value="low">Baja</option><option value="moderate">Moderada</option><option value="high">Alta</option>
          </select></label>
          <label className="text-xs text-slate-300">Marca de distribución<select className={`${labInput} mt-2`} value={answer.decisions.tlp ?? ''} onChange={(e) => setDecision('tlp', e.target.value)}>
            <option value="" disabled>Elegir TLP</option>{['TLP:RED', 'TLP:AMBER+STRICT', 'TLP:AMBER', 'TLP:GREEN', 'TLP:CLEAR'].map((t) => <option key={t}>{t}</option>)}
          </select></label>
        </div>
        <References label="Fuentes que sostienen tu juicio principal (al menos dos)" evidence={data.evidence} selected={answer.references.report ?? []} onChange={(ids) => setReferences('report', ids)} />
      </>}
      {data.kind === 'logs' && <div className="grid gap-3 sm:grid-cols-2">{[{ id: 'host', label: 'Equipo afectado' }, { id: 'account', label: 'Cuenta afectada' }].map((f) =>
        <label key={f.id} className="text-xs text-slate-300">{f.label}<input className={`${labInput} mt-2`} value={answer.text[f.id] ?? ''} onChange={(e) => setText(f.id, e.target.value)} /></label>)}</div>}
      {WRITING_FIELDS[data.kind].map((field) => <label key={field.id} className="block text-sm font-semibold text-slate-200">{field.label}
        <span className="mt-1 block text-xs font-normal leading-relaxed text-slate-400">{field.prompt}</span>
        <textarea className={`${labInput} mt-2 min-h-28 font-normal leading-relaxed`} value={answer.text[field.id] ?? ''} onChange={(e) => setText(field.id, e.target.value)} />
      </label>)}
      <div className="flex flex-wrap gap-3">
        <button className="rounded-lg bg-cyan-400 px-5 py-2.5 text-sm font-bold text-ink-950 hover:bg-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400 disabled:bg-ink-700 disabled:text-slate-400"
          disabled={!ready || submitted} onClick={() => {
            if (!ready || submitted) return;
            session.record({ step: 'challenge', title: 'Comprobaciones del reto (texto excluido)', correct: checks.filter((c) => c.ok).length,
              total: checks.length, passed: checks.every((c) => c.ok), mistakes: checks.filter((c) => !c.ok).map((c) => `${c.label}: ${c.explanation}`) });
            setSubmitted(true);
          }}>{submitted ? 'Entregado' : 'Entregar y comprobar datos'}</button>
        <button className={labButton} onClick={exportMarkdown}>Descargar entrega (.md)</button>
        <button className={labButton} aria-expanded={hintOpen} onClick={() => { session.revealHelp(); setHintOpen(true); }}>Consultar pista</button>
      </div>
      {!ready && <p className="text-xs text-slate-400">Completa todos los campos. {data.kind === 'pivot' ? 'Valora cada candidato y cita al menos una evidencia abierta para cada uno.' : data.kind === 'report' ? 'Selecciona el juicio, la confianza, el TLP y al menos dos fuentes.' : 'Añade exactamente cinco eventos a tu cronología, además del equipo y la cuenta.'}</p>}
      {hintOpen && <aside className="rounded-lg border border-amber-500/30 p-4 text-sm text-amber-200">Pista consultada: {data.hint}</aside>}
    </section>

    {submitted && <section aria-label="Resultado del reto" className="space-y-4 rounded-xl border border-cyan-500/40 bg-ink-900 p-5">
      <div role="status"><h2 className="font-bold text-cyan-200">Entregado · {checks.filter((c) => c.ok).length}/{checks.length} comprobaciones de datos</h2>
        <p className="mt-1 text-sm text-slate-400">Estas comprobaciones no evalúan la calidad de tu redacción ni acreditan dominio profesional.</p></div>
      <ul className="space-y-3">{checks.map((c) => <li key={c.id} className="text-sm">
        <strong className={c.ok ? 'text-emerald-300' : 'text-amber-300'}>{c.ok ? '✓' : '↻'} {c.label}</strong>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">{c.explanation}</p>
      </li>)}</ul>
      <h3 className="border-t border-ink-700 pt-4 font-semibold text-slate-100">Autoevaluación del texto · rúbrica</h3>
      <p className="text-xs text-slate-400">Selecciona el ejemplo que mejor describe tu entrega. Puedes contrastarla con la solución comentada; la aplicación no puntúa automáticamente el texto.</p>
      <div className="grid gap-4 md:grid-cols-2">{RUBRIC.map((criterion) => <fieldset key={criterion.id} className="rounded-lg border border-ink-600 p-3">
        <legend className="px-1 text-sm font-semibold text-slate-100">{criterion.title}</legend>
        <div className="space-y-2">{criterion.levels.map((description, score) => <label key={score} className="flex cursor-pointer items-start gap-2 text-xs leading-relaxed text-slate-300">
          <input className="mt-0.5 accent-cyan-400" type="radio" name={`${data.id}-${criterion.id}`} checked={rubric[criterion.id] === score} onChange={() => setRubric((old) => ({ ...old, [criterion.id]: score }))} />
          <span>{score} · {description}</span>
        </label>)}</div>
      </fieldset>)}</div>
      <p className="text-sm text-cyan-200">{Object.keys(rubric).length === 4 ? `Autoevaluación: ${Object.values(rubric).reduce((s, n) => s + n, 0)}/8 (declarada por ti)` : `Autoevaluación: ${Object.keys(rubric).length}/4 criterios revisados`}</p>
      <button className={labButton} aria-expanded={solutionOpen} onClick={() => { session.revealHelp(); setSolutionOpen(true); }}>Ver solución comentada</button>
      {solutionOpen && <div className="border-l-2 border-amber-400 pl-4 text-sm leading-relaxed text-slate-300"><h3 className="mb-2 font-semibold text-amber-200">Una entrega defendible</h3>{data.solution}</div>}
    </section>}
  </div>;
}
