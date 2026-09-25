import type { CSSProperties, ReactElement } from 'react';

/**
 * Stroke icon set (24×24 grid, 1.8 px stroke) so the video never depends on
 * emoji or font glyphs outside the latin subset (no →, ✓, ≠ in text).
 */
export type IconName =
  | 'server'
  | 'laptop'
  | 'desktop'
  | 'cloud'
  | 'firewall'
  | 'router'
  | 'database'
  | 'app'
  | 'shield'
  | 'user'
  | 'users'
  | 'clock'
  | 'lock'
  | 'unlock'
  | 'search'
  | 'bell'
  | 'check'
  | 'x'
  | 'arrowRight'
  | 'arrowDown'
  | 'arrowUp'
  | 'funnel'
  | 'globe'
  | 'key'
  | 'file'
  | 'gear'
  | 'bolt'
  | 'eye'
  | 'eyeOff'
  | 'network'
  | 'chart'
  | 'mortarboard'
  | 'flag'
  | 'power'
  | 'record'
  | 'link'
  | 'layers'
  | 'play'
  | 'pause'
  | 'alert'
  | 'radar'
  | 'archive'
  | 'mail'
  | 'terminal'
  | 'target'
  | 'split'
  | 'merge'
  | 'plug'
  | 'unplug'
  | 'brain'
  | 'cursor';

const PATHS: Record<IconName, ReactElement> = {
  server: (
    <>
      <rect x="3.5" y="3.5" width="17" height="7" rx="1.8" />
      <rect x="3.5" y="13.5" width="17" height="7" rx="1.8" />
      <path d="M7 7h.01M7 17h.01M11 7h6M11 17h6" />
    </>
  ),
  laptop: (
    <>
      <rect x="4.5" y="4.5" width="15" height="10.5" rx="1.5" />
      <path d="M2.5 19h19" />
    </>
  ),
  desktop: (
    <>
      <rect x="3" y="3.5" width="18" height="12.5" rx="1.5" />
      <path d="M9 20.5h6M12 16v4.5" />
    </>
  ),
  cloud: <path d="M7 18.5h10a4.5 4.5 0 0 0 .6-8.96A6 6 0 0 0 6.1 9.1 4.7 4.7 0 0 0 7 18.5Z" />,
  firewall: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <path d="M3 9.3h18M3 14.6h18M9 4v5.3M15 9.3v5.3M9 14.6V20" />
    </>
  ),
  router: (
    <>
      <rect x="3" y="12.5" width="18" height="7" rx="1.8" />
      <path d="M7 16h.01M10.5 16h.01M8 9a6 6 0 0 1 8 0M5.5 6.5a9.5 9.5 0 0 1 13 0" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" />
      <path d="M4.5 5.5v13c0 1.55 3.36 2.8 7.5 2.8s7.5-1.25 7.5-2.8v-13M4.5 12c0 1.55 3.36 2.8 7.5 2.8s7.5-1.25 7.5-2.8" />
    </>
  ),
  app: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 8.5h18M6.5 6.3h.01M9 6.3h.01M7 12.5h10M7 16h6" />
    </>
  ),
  shield: <path d="M12 3 4.5 6v5.5c0 4.6 3.2 8 7.5 9.5 4.3-1.5 7.5-4.9 7.5-9.5V6L12 3Z" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 5.2a3.5 3.5 0 0 1 0 6.6M18 14.2a6.5 6.5 0 0 1 3.5 5.8" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </>
  ),
  unlock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 7.6-1.7" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </>
  ),
  bell: <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15l1.5-2ZM10 20.5a2 2 0 0 0 4 0" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  arrowRight: <path d="M4 12h15M13.5 6.5 19 12l-5.5 5.5" />,
  arrowDown: <path d="M12 4v15M6.5 13.5 12 19l5.5-5.5" />,
  arrowUp: <path d="M12 20V5M6.5 10.5 12 5l5.5 5.5" />,
  funnel: <path d="M3.5 4.5h17l-6.5 8v6l-4 2v-8l-6.5-8Z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.4 3.5 5.2 3.5 8.5s-1.1 6.1-3.5 8.5c-2.4-2.4-3.5-5.2-3.5-8.5S9.6 5.9 12 3.5Z" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="m11 12 8.5-8.5M16.5 6.5l2.5 2.5M14.5 8.5l2 2" />
    </>
  ),
  file: (
    <>
      <path d="M6 3h8l4.5 4.5V21H6V3Z" />
      <path d="M14 3v4.5h4.5M9 12.5h6M9 16h6" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2.8v2.4M12 18.8v2.4M21.2 12h-2.4M5.2 12H2.8M18.5 5.5l-1.7 1.7M7.2 16.8l-1.7 1.7M18.5 18.5l-1.7-1.7M7.2 7.2 5.5 5.5" />
    </>
  ),
  bolt: <path d="M13 2.5 4.5 13.5h6.5l-1 8 8.5-11h-6.5l1-8Z" />,
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M4 4l16 16M9.9 5.8A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.6 3.4M6.3 7.4A16.5 16.5 0 0 0 2.5 12S6 18.5 12 18.5c1.6 0 3-.4 4.2-1" />
    </>
  ),
  network: (
    <>
      <rect x="9.5" y="2.5" width="5" height="5" rx="1" />
      <rect x="2.5" y="16.5" width="5" height="5" rx="1" />
      <rect x="16.5" y="16.5" width="5" height="5" rx="1" />
      <path d="M12 7.5v4.5M5 16.5V12h14v4.5" />
    </>
  ),
  chart: <path d="M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6" />,
  mortarboard: (
    <>
      <path d="M2 9.5 12 5l10 4.5-10 4.5L2 9.5Z" />
      <path d="M6 11.5V16c1.8 1.6 3.8 2.4 6 2.4s4.2-.8 6-2.4v-4.5M21 10v5" />
    </>
  ),
  flag: <path d="M5 21V4M5 4.5h11l-2 4 2 4H5" />,
  power: <path d="M12 3v8M7 6.3a7.5 7.5 0 1 0 10 0" />,
  record: <circle cx="12" cy="12" r="6" fill="currentColor" />,
  link: <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" />,
  layers: <path d="m12 3 9 4.5-9 4.5-9-4.5L12 3ZM3 12l9 4.5 9-4.5M3 16.5 12 21l9-4.5" />,
  play: <path d="M7 4.5v15l12-7.5-12-7.5Z" />,
  pause: <path d="M8 5v14M16 5v14" />,
  alert: (
    <>
      <path d="M12 3.5 2.5 20h19L12 3.5Z" />
      <path d="M12 10v4.5M12 17.2h.01" />
    </>
  ),
  radar: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 12 18 6" />
    </>
  ),
  archive: (
    <>
      <rect x="3" y="4" width="18" height="4.5" rx="1" />
      <path d="M4.5 8.5V20h15V8.5M10 12.5h4" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </>
  ),
  terminal: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="m7 9 3 3-3 3M12.5 15.5H17" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  split: <path d="M4 12h6l5-6h5M10 12l5 6h5M17 3.5 20 6l-3 2.5M17 15.5l3 2.5-3 2.5" />,
  merge: <path d="M4 6h5l5 6h6M4 18h5l5-6M17 9.5l3 2.5-3 2.5" />,
  plug: <path d="M9 3v5M15 3v5M6.5 8h11v3.5a5.5 5.5 0 0 1-11 0V8ZM12 17v4" />,
  unplug: <path d="M9 3v5M15 3v5M6.5 8h11v3.5a5.5 5.5 0 0 1-11 0V8ZM12 17v4M3 3l18 18" />,
  brain: (
    <path d="M9.5 4.5a3 3 0 0 0-3 3 3 3 0 0 0-2 5.2 3 3 0 0 0 2 5.3 3 3 0 0 0 5 1.5V5.8a2.5 2.5 0 0 0-2-1.3ZM14.5 4.5a3 3 0 0 1 3 3 3 3 0 0 1 2 5.2 3 3 0 0 1-2 5.3 3 3 0 0 1-5 1.5" />
  ),
  cursor: <path d="M5 3l14 7.5-6.2 1.7L10 18.5 5 3Z" fill="currentColor" />,
};

export function Icon({
  name,
  size = 40,
  color = 'currentColor',
  strokeWidth = 1.8,
  style,
}: {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color, flexShrink: 0, display: 'block', ...style }}
      aria-hidden
    >
      {PATHS[name]}
    </svg>
  );
}
