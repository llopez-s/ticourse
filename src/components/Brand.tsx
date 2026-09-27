import { WORDMARK_PARTS } from '../lib/brand';

/**
 * The app's diamond: same geometry as the favicon and the videos' BrandMark
 * (video/engine/src/overlay/ChapterRail.tsx). Takes its colour from `color`.
 */
export function BrandMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="14.6 14.6 70.8 70.8" className={`shrink-0 ${className}`} aria-hidden="true" focusable="false">
      <rect x="25" y="25" width="50" height="50" rx="8" transform="rotate(45 50 50)" fill="currentColor" />
    </svg>
  );
}

/** ALERT in white, ÓPOLIS in cyan: the lockup of the channel banner. */
export function Wordmark({ className = '' }: { className?: string }) {
  const [plain, accent] = WORDMARK_PARTS;
  return (
    <span className={`whitespace-nowrap font-extrabold tracking-tight text-slate-50 ${className}`}>
      {plain}
      <span className="text-cyan-400">{accent}</span>
    </span>
  );
}
