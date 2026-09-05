import type { ReactNode } from 'react';
import { clamp } from '../lib/util';

export function Panel({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-ink-700 bg-ink-900 p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export function PageTitle({
  kicker,
  title,
  sub,
}: {
  kicker?: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-6">
      {kicker && (
        <div className="mb-1 font-mono text-xs uppercase tracking-[0.2em] text-cyan-400">
          {kicker}
        </div>
      )}
      <h1 className="text-2xl font-bold text-slate-50">{title}</h1>
      {sub && <p className="mt-1 text-sm text-slate-400">{sub}</p>}
    </div>
  );
}

export function Bar({
  value,
  color = 'bg-cyan-400',
  className = 'h-2',
}: {
  value: number; // 0-100
  color?: string;
  className?: string;
}) {
  return (
    <div className={`w-full overflow-hidden rounded-full bg-ink-700 ${className}`}>
      <div
        className={`transition-bar h-full rounded-full ${color}`}
        style={{ width: `${clamp(value, 0, 100)}%` }}
      />
    </div>
  );
}

export function Ring({
  value,
  size = 64,
  stroke = 6,
  label,
  color = '#22d3ee',
}: {
  value: number; // 0-100
  size?: number;
  stroke?: number;
  label?: ReactNode;
  color?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (clamp(value, 0, 100) / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-ink-700)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="absolute text-center text-xs font-semibold text-slate-200">
        {label ?? `${Math.round(value)}%`}
      </div>
    </div>
  );
}

export function Chip({
  children,
  className = '',
  title,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1.5 rounded-full border border-ink-600 bg-ink-800 px-2.5 py-1 text-xs font-medium text-slate-300 ${className}`}
    >
      {children}
    </span>
  );
}

export function StatBox({
  icon,
  value,
  label,
}: {
  icon: string;
  value: ReactNode;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-ink-700 bg-ink-900 p-4 text-center">
      <div className="text-xl">{icon}</div>
      <div className="mt-1 text-xl font-bold text-slate-50">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}
