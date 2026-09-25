/// <reference types="vite/client" />
import { useEffect, useRef, useState } from 'react';
import type { Block, CheckQ } from '../lib/types';
import { md } from '../lib/md';
import { useStore } from '../lib/store';

const CALLOUT_STYLE: Record<
  string,
  { border: string; bg: string; icon: string; label: string }
> = {
  tip: { border: 'border-cyan-500/40', bg: 'bg-cyan-950/30', icon: '💡', label: 'Tip' },
  warn: { border: 'border-amber-500/40', bg: 'bg-amber-950/30', icon: '⚠️', label: 'Cuidado' },
  example: { border: 'border-slate-500/40', bg: 'bg-ink-850', icon: '🧩', label: 'Ejemplo' },
  exam: { border: 'border-violet-500/40', bg: 'bg-violet-950/30', icon: '🎓', label: 'Nota de examen' },
  story: { border: 'border-emerald-500/40', bg: 'bg-emerald-950/30', icon: '🎖️', label: 'Operación VELVET CICADA' },
};

/** Public asset paths in lesson data are relative to Vite's deployment base. */
function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}

type CaptionCue = { start: number; end: number; text: string };

function vttTime(value: string): number {
  const parts = value.split(':').map(Number);
  if ((parts.length !== 2 && parts.length !== 3) || parts.some((part) => !Number.isFinite(part))) {
    return NaN;
  }
  return parts.reduce((seconds, part) => seconds * 60 + part, 0);
}

function parseVtt(source: string): CaptionCue[] {
  return source
    .replace(/^\uFEFF/, '')
    .replace(/\r/g, '')
    .split(/\n\s*\n/)
    .flatMap((section) => {
      const lines = section.split('\n');
      const timingIndex = lines.findIndex((line) => line.includes('-->'));
      if (timingIndex < 0) return [];
      const [startText, endAndSettings] = lines[timingIndex].trim().split(/\s+-->\s+/);
      const start = vttTime(startText);
      const end = vttTime(endAndSettings?.split(/\s+/)[0] ?? '');
      const text = lines.slice(timingIndex + 1).join('\n').replace(/<[^>]*>/g, '').trim();
      return Number.isFinite(start) && Number.isFinite(end) && end > start && text
        ? [{ start, end, text }]
        : [];
    });
}

function VideoBlock({ block }: { block: Extract<Block, { t: 'video' }> }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [cues, setCues] = useState<CaptionCue[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [captionsError, setCaptionsError] = useState(false);
  const [transcriptStatus, setTranscriptStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [transcriptText, setTranscriptText] = useState('');
  const videoSrc = assetUrl(block.src);
  const transcriptSrc = assetUrl(block.transcript);
  const captionsSrc = assetUrl(block.captions);
  const activeCaption = cues.find((cue) => currentTime >= cue.start && currentTime < cue.end)?.text ?? '';
  const canFullscreen = typeof document !== 'undefined' && document.fullscreenEnabled;

  useEffect(() => {
    const controller = new AbortController();
    fetch(captionsSrc, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then((source) => setCues(parseVtt(source)))
      .catch(() => {
        if (!controller.signal.aborted) setCaptionsError(true);
      });
    return () => controller.abort();
  }, [captionsSrc]);

  const openFullscreen = async () => {
    try {
      await videoRef.current?.requestFullscreen();
    } catch {
      // Native video controls still offer fullscreen where the browser supports it.
    }
  };

  const loadTranscript = async (open: boolean) => {
    if (!open || transcriptStatus !== 'idle') return;
    setTranscriptStatus('loading');
    try {
      const response = await fetch(transcriptSrc);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setTranscriptText(await response.text());
      setTranscriptStatus('ready');
    } catch {
      setTranscriptStatus('error');
    }
  };

  return (
    <section className="my-6 overflow-hidden rounded-xl border border-cyan-500/30 bg-ink-900">
      <div className="border-b border-ink-700 px-4 py-3">
        <h3 className="text-base font-semibold text-slate-100">{block.title}</h3>
      </div>
      {videoError ? (
        <p role="alert" className="px-4 pt-4 text-sm text-amber-200">
          No se pudo cargar el video. Puedes descargarlo y reproducirlo fuera de la página.
        </p>
      ) : null}
      <video
        ref={videoRef}
        className="aspect-video w-full bg-ink-950"
        controls
        preload="metadata"
        playsInline
        poster={assetUrl(block.poster)}
        onError={() => setVideoError(true)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onSeeked={(event) => setCurrentTime(event.currentTarget.currentTime)}
      >
        <source src={videoSrc} type="video/mp4" />
        <track kind="captions" src={captionsSrc} srcLang="es" label="Español" />
        Tu navegador no admite la reproducción de video.
      </video>
      <div className="min-h-20 border-t border-ink-700 bg-ink-950 px-4 py-3 text-center" aria-label="Subtítulos" aria-live="off">
        <p className="mx-auto max-w-2xl whitespace-pre-line break-words text-base font-medium leading-relaxed text-slate-100 sm:text-lg">
          {captionsError ? 'Subtítulos no disponibles. Puedes leer la transcripción.' : activeCaption || '\u00a0'}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 text-sm">
        <a className="font-medium text-cyan-300 underline underline-offset-2 hover:text-cyan-200" href={videoSrc} download>
          Descargar MP4
        </a>
        {canFullscreen ? (
          <button type="button" className="font-medium text-cyan-300 underline underline-offset-2 hover:text-cyan-200" onClick={() => void openFullscreen()}>
            Pantalla completa
          </button>
        ) : null}
        <details
          className="w-full rounded-lg border border-ink-700 bg-ink-850 px-3 py-2 text-slate-300"
          onToggle={(event) => void loadTranscript(event.currentTarget.open)}
        >
          <summary className="cursor-pointer font-medium text-cyan-300">Leer transcripción</summary>
          {transcriptStatus === 'loading' ? <p role="status" className="mt-3">Cargando transcripción…</p> : null}
          {transcriptStatus === 'ready' ? (
            <p className="mt-3 whitespace-pre-wrap leading-relaxed">{transcriptText}</p>
          ) : null}
          {transcriptStatus === 'error' ? (
            <p role="alert" className="mt-3 text-amber-200">No se pudo cargar la transcripción.</p>
          ) : null}
          <a className="mt-3 inline-block text-cyan-300 underline underline-offset-2 hover:text-cyan-200" href={transcriptSrc}>
            Abrir archivo de transcripción
          </a>
        </details>
      </div>
    </section>
  );
}

function CheckBlock({
  q,
  rewardEnabled,
  onAnswered,
}: {
  q: CheckQ;
  rewardEnabled: boolean;
  onAnswered: () => void;
}) {
  const [chosen, setChosen] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const awardCheckpoint = useStore((s) => s.awardCheckpoint);

  const submit = () => {
    if (chosen === null || submitted) return;
    setSubmitted(true);
    if (chosen === q.answer && rewardEnabled) awardCheckpoint();
    onAnswered();
  };

  return (
    <div className="my-5 rounded-xl border border-cyan-500/30 bg-ink-900 p-4">
      <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400">
        ⚡ Checkpoint
      </div>
      <p className="mb-3 font-medium text-slate-100">{q.q}</p>
      <div className="flex flex-col gap-2">
        {q.choices.map((c, i) => {
          let cls =
            'rounded-lg border px-3 py-2 text-left text-sm transition-colors ';
          if (!submitted) {
            cls +=
              chosen === i
                ? 'border-cyan-400 bg-cyan-950/40 text-slate-100'
                : 'border-ink-600 bg-ink-850 text-slate-300 hover:border-ink-500 hover:bg-ink-800';
          } else if (i === q.answer) {
            cls += 'border-emerald-500 bg-emerald-950/40 text-emerald-200';
          } else if (i === chosen) {
            cls += 'border-rose-500 bg-rose-950/40 text-rose-200';
          } else {
            cls += 'border-ink-700 bg-ink-900 text-slate-500';
          }
          return (
            <button
              key={i}
              className={cls}
              disabled={submitted}
              onClick={() => setChosen(i)}
            >
              {c}
            </button>
          );
        })}
      </div>
      {!submitted ? (
        <button
          onClick={submit}
          disabled={chosen === null}
          className="mt-3 rounded-lg bg-cyan-500 px-4 py-1.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-ink-700 disabled:text-slate-500"
        >
          Comprobar
        </button>
      ) : (
        <div
          className={`animate-pop-in mt-3 rounded-lg border px-3 py-2 text-sm ${
            chosen === q.answer
              ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-200'
              : 'border-rose-500/40 bg-rose-950/30 text-rose-200'
          }`}
        >
          <span className="font-semibold">
            {chosen === q.answer ? '✓ Correcto.' : '✗ No exactamente.'}
          </span>{' '}
          <span className="text-slate-300">{q.explain}</span>
        </div>
      )}
    </div>
  );
}

export default function BlockRenderer({
  blocks,
  focusedBlock,
  rewardEnabled,
  onCheckAnswered,
}: {
  blocks: Block[];
  focusedBlock?: number | null;
  rewardEnabled: boolean;
  onCheckAnswered: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusedBlock === null || focusedBlock === undefined) return;
    const target = rootRef.current?.children.item(focusedBlock);
    if (!(target instanceof HTMLElement)) return;
    target.classList.add('search-target');
    const frame = requestAnimationFrame(() => target.scrollIntoView({ block: 'center' }));
    return () => {
      cancelAnimationFrame(frame);
      target.classList.remove('search-target');
    };
  }, [focusedBlock, blocks]);

  return (
    <div ref={rootRef} className="space-y-1">
      {blocks.map((b, i) => {
        switch (b.t) {
          case 'p':
            return (
              <p key={i} className="my-4 leading-relaxed text-slate-300">
                {md(b.md)}
              </p>
            );
          case 'h':
            return (
              <h2
                key={i}
                className="mb-2 mt-8 border-l-2 border-cyan-400 pl-3 text-lg font-bold text-slate-50"
              >
                {b.text}
              </h2>
            );
          case 'list':
            return b.ordered ? (
              <ol
                key={i}
                className="my-4 list-decimal space-y-2 pl-6 text-slate-300 marker:font-semibold marker:text-cyan-400"
              >
                {b.items.map((it, j) => (
                  <li key={j} className="leading-relaxed">
                    {md(it)}
                  </li>
                ))}
              </ol>
            ) : (
              <ul
                key={i}
                className="my-4 list-disc space-y-2 pl-6 text-slate-300 marker:text-cyan-400"
              >
                {b.items.map((it, j) => (
                  <li key={j} className="leading-relaxed">
                    {md(it)}
                  </li>
                ))}
              </ul>
            );
          case 'table':
            return (
              <div
                key={i}
                className="my-5 overflow-x-auto rounded-xl border border-ink-700"
              >
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-ink-800">
                      {b.headers.map((h, j) => (
                        <th
                          key={j}
                          className="px-3 py-2 text-left font-semibold text-slate-200"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, j) => (
                      <tr
                        key={j}
                        className={j % 2 ? 'bg-ink-850' : 'bg-ink-900'}
                      >
                        {row.map((cell, k) => (
                          <td
                            key={k}
                            className="px-3 py-2 align-top text-slate-300"
                          >
                            {md(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case 'code':
            return (
              <div
                key={i}
                className="my-5 overflow-hidden rounded-xl border border-ink-700 bg-ink-950"
              >
                {(b.title || b.lang) && (
                  <div className="flex items-center justify-between gap-3 border-b border-ink-700 bg-ink-900 px-4 py-2">
                    <span className="text-xs font-semibold text-slate-300">
                      {b.title}
                    </span>
                    {b.lang && (
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400">
                        {b.lang}
                      </span>
                    )}
                  </div>
                )}
                <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-slate-300">
                  <code>{b.text}</code>
                </pre>
              </div>
            );
          case 'video':
            return <VideoBlock key={i} block={b} />;
          case 'callout': {
            const s = CALLOUT_STYLE[b.kind];
            return (
              <div
                key={i}
                className={`my-5 rounded-xl border ${s.border} ${s.bg} p-4`}
              >
                <div className="mb-1 text-sm font-semibold text-slate-100">
                  {s.icon} {b.title ?? s.label}
                </div>
                <p className="text-sm leading-relaxed text-slate-300">
                  {md(b.md)}
                </p>
              </div>
            );
          }
          case 'quote':
            return (
              <blockquote
                key={i}
                className="my-5 border-l-2 border-slate-500 pl-4 italic text-slate-400"
              >
                {md(b.md)}
                {b.by && (
                  <div className="mt-1 text-xs not-italic text-slate-500">
                    — {b.by}
                  </div>
                )}
              </blockquote>
            );
          case 'check':
            return (
              <CheckBlock
                key={i}
                q={b.q}
                rewardEnabled={rewardEnabled}
                onAnswered={onCheckAnswered}
              />
            );
          default: {
            const _exhaustive: never = b;
            return _exhaustive;
          }
        }
      })}
    </div>
  );
}
