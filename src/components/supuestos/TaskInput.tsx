import { md } from '../../lib/md';
import type { DossierDoc, Task } from '../../lib/supuesto';
import type { TaskAnswer } from '../../lib/supuestoGrade';
import { labInput } from '../labs/LabWorkspace';
import { docIcon } from './Dossier';

const asList = (v: TaskAnswer): string[] => (Array.isArray(v) ? v : []);
const asRecord = (v: TaskAnswer): Record<string, string> =>
  v && typeof v === 'object' && !Array.isArray(v) ? v : {};
const asText = (v: TaskAnswer): string => (typeof v === 'string' ? v : typeof v === 'number' ? String(v) : '');

const countWords = (s: string) => (s.trim() === '' ? 0 : s.trim().split(/\s+/).length);

const optionRow = 'flex cursor-pointer items-start gap-2 rounded-lg border border-ink-600 bg-ink-850 px-3 py-2 text-sm text-slate-200 hover:border-cyan-400 has-[:checked]:border-cyan-400 has-[:checked]:bg-cyan-950/40 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-cyan-400';
const smallBtn = 'rounded-md border border-ink-600 bg-ink-850 px-2 py-1 text-xs font-semibold text-slate-200 hover:border-cyan-400 focus-visible:outline-2 focus-visible:outline-cyan-400 disabled:opacity-40';

export default function TaskInput({ task, value, onChange, docs, disabled }: {
  task: Task;
  value: TaskAnswer;
  onChange: (v: TaskAnswer) => void;
  docs: DossierDoc[];
  disabled: boolean;
}) {
  const label = md(task.prompt);
  const legend = <legend className="mb-2 text-sm font-medium text-slate-100">{label}</legend>;

  switch (task.kind) {
    case 'choice':
      return (
        <fieldset disabled={disabled}>
          {legend}
          <div className="space-y-2">
            {task.options.map((o) => (
              <label key={o.id} className={optionRow}>
                <input type="radio" name={task.id} checked={value === o.id} onChange={() => onChange(o.id)} className="mt-0.5 accent-cyan-400" />
                <span>{o.text}</span>
              </label>
            ))}
          </div>
        </fieldset>
      );

    case 'multi': {
      const sel = asList(value);
      const toggle = (id: string) => onChange(sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]);
      return (
        <fieldset disabled={disabled}>
          {legend}
          <p className="mb-2 text-xs text-slate-400">Marca todas las que correspondan. Una marcada de más resta.</p>
          <div className="space-y-2">
            {task.options.map((o) => (
              <label key={o.id} className={optionRow}>
                <input type="checkbox" checked={sel.includes(o.id)} onChange={() => toggle(o.id)} className="mt-0.5 accent-cyan-400" />
                <span>{o.text}</span>
              </label>
            ))}
          </div>
        </fieldset>
      );
    }

    case 'numeric': {
      const id = task.id + '-num';
      return (
        <div>
          <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-100">{label}</label>
          <div className="flex items-center gap-2">
            <input
              id={id}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              disabled={disabled}
              value={asText(value)}
              onChange={(e) => onChange(e.target.value)}
              className={labInput + ' max-w-48'}
            />
            {task.unit && <span className="text-sm text-slate-400">{task.unit}</span>}
          </div>
          <p className="mt-1 text-xs text-slate-400">Puedes usar coma o punto para los decimales.</p>
        </div>
      );
    }

    case 'table': {
      const a = asRecord(value);
      const set = (key: string, v: string) => onChange({ ...a, [key]: v });
      return (
        <fieldset disabled={disabled}>
          {legend}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[28rem] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="p-2 text-left text-xs font-semibold text-slate-400" scope="col"><span className="sr-only">Elemento</span></th>
                  {task.fields.map((f) => (
                    <th key={f.id} scope="col" className="p-2 text-left text-xs font-semibold text-slate-300">{f.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {task.rows.map((r) => (
                  <tr key={r.id} className="border-t border-ink-700">
                    <th scope="row" className="p-2 text-left font-medium text-slate-100">{r.label}</th>
                    {task.fields.map((f) => {
                      const key = r.id + '.' + f.id;
                      return (
                        <td key={f.id} className="p-2">
                          <select
                            aria-label={r.label + ': ' + f.label}
                            value={a[key] ?? ''}
                            onChange={(e) => set(key, e.target.value)}
                            className={labInput}
                          >
                            <option value="">— elige —</option>
                            {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </fieldset>
      );
    }

    case 'order': {
      const ids = task.items.map((i) => i.id);
      const current = Array.isArray(value) && value.length === ids.length ? value : ids;
      const move = (i: number, d: -1 | 1) => {
        const next = [...current];
        [next[i], next[i + d]] = [next[i + d], next[i]];
        onChange(next);
      };
      return (
        <fieldset disabled={disabled}>
          {legend}
          <p className="mb-2 text-xs text-slate-400">Usa los botones para subir o bajar cada paso.</p>
          <ol className="space-y-2">
            {current.map((id, i) => {
              const text = task.items.find((x) => x.id === id)?.text ?? id;
              return (
                <li key={id} className="flex items-center gap-2 rounded-lg border border-ink-600 bg-ink-850 px-3 py-2 text-sm text-slate-200">
                  <span className="w-5 text-xs font-bold text-slate-500" aria-hidden="true">{i + 1}</span>
                  <span className="flex-1">{text}</span>
                  <button type="button" className={smallBtn} disabled={i === 0} onClick={() => move(i, -1)} aria-label={'Subir: ' + text}>↑</button>
                  <button type="button" className={smallBtn} disabled={i === current.length - 1} onClick={() => move(i, 1)} aria-label={'Bajar: ' + text}>↓</button>
                </li>
              );
            })}
          </ol>
        </fieldset>
      );
    }

    case 'match': {
      const a = asRecord(value);
      return (
        <fieldset disabled={disabled}>
          {legend}
          <div className="space-y-2">
            {task.left.map((l) => {
              const id = task.id + '-' + l.id;
              return (
                <div key={l.id} className="grid items-center gap-2 sm:grid-cols-2">
                  <label htmlFor={id} className="text-sm text-slate-200">{l.text}</label>
                  <select id={id} value={a[l.id] ?? ''} onChange={(e) => onChange({ ...a, [l.id]: e.target.value })} className={labInput}>
                    <option value="">— elige —</option>
                    {task.right.map((r) => <option key={r.id} value={r.id}>{r.text}</option>)}
                  </select>
                </div>
              );
            })}
          </div>
        </fieldset>
      );
    }

    case 'cite': {
      const sel = asList(value);
      const toggle = (id: string) => onChange(sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]);
      return (
        <fieldset disabled={disabled}>
          {legend}
          <p className="mb-2 text-xs text-slate-400">Marca los documentos del expediente que respaldan tu respuesta.</p>
          <div className="space-y-2">
            {docs.map((d) => (
              <label key={d.id} className={optionRow}>
                <input type="checkbox" checked={sel.includes(d.id)} onChange={() => toggle(d.id)} className="mt-0.5 accent-cyan-400" />
                <span><span aria-hidden="true">{docIcon(d.kind)} </span>{d.title}</span>
              </label>
            ))}
          </div>
        </fieldset>
      );
    }

    case 'written': {
      const id = task.id + '-text';
      const text = asText(value);
      const words = countWords(text);
      const over = task.words !== undefined && words > task.words;
      return (
        <div>
          <label htmlFor={id} className="mb-2 block text-sm font-medium text-slate-100">{label}</label>
          <textarea
            id={id}
            rows={7}
            disabled={disabled}
            value={text}
            onChange={(e) => onChange(e.target.value)}
            aria-describedby={id + '-count'}
            className={labInput + ' resize-y'}
          />
          <p id={id + '-count'} className={'mt-1 text-xs ' + (over ? 'text-amber-300' : 'text-slate-400')}>
            {words} {words === 1 ? 'palabra' : 'palabras'}
            {task.words !== undefined && ' · límite orientativo: ' + task.words}
          </p>
        </div>
      );
    }
  }
}
