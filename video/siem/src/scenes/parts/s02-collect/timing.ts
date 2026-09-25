import type { SceneProps } from '../../../timeline/types';
import type { LinkId } from '../../../data/s02-collect';
import { progress } from '../../../theme/motion';

/** Every beat of scene 02 in LOCAL frames, derived from cues (never hard-coded). */
export interface S02Timing {
  /** "Primero, recoger: log aggregation" (segment start). */
  intro: number;
  sys: number;
  app: number;
  inf: number;
  agent: number;
  syslog: number;
  api: number;
  netflow: number;
  /** "Todo converge en un punto central" (segment start). */
  converge: number;
  ntp: number;
  /** "Si un intruso borra el registro local..." (segment start). */
  wipeIn: number;
  wipe: number;
}

export function buildTiming({ cue, segments }: SceneProps): S02Timing {
  const seg = (id: string, fallback: number) => segments.find((s) => s.id === id)?.from ?? fallback;
  const ntp = cue('ntp');
  return {
    intro: seg('s02-01', cue('src-systems') - 110),
    sys: cue('src-systems'),
    app: cue('src-apps'),
    inf: cue('src-infra'),
    agent: cue('m-agent'),
    syslog: cue('m-syslog'),
    api: cue('m-api'),
    netflow: cue('m-netflow'),
    converge: seg('s02-03', ntp - 100),
    ntp,
    wipeIn: seg('s02-04', cue('wipe') - 27),
    wipe: cue('wipe'),
  };
}

/** Frames a connector takes to draw itself. */
export const DRAW = 16;
/** Packet travel time along a connector, in frames. */
export const TRAVEL = 34;

/** Frame at which a link lights up. */
export function linkLitAt(T: S02Timing, id: LinkId): number {
  switch (id) {
    case 'sys':
      return T.agent;
    case 'app':
      return T.converge;
    case 'fw':
      return T.syslog;
    case 'cloud':
      return T.api;
    case 'router':
      return T.netflow;
  }
}

/**
 * Frame at which the voice starts naming the device behind a link
 * ("Servidores y estaciones", "firewalls y switches", "la nube", "los routers"),
 * so the device row lights just before its connector.
 */
export function linkNamedAt(T: S02Timing, id: LinkId): number {
  switch (id) {
    case 'sys':
      return T.agent - 55;
    case 'app':
      return T.converge;
    case 'fw':
      return T.syslog - 47;
    case 'cloud':
      return T.api - 15;
    case 'router':
      return T.netflow - 27;
  }
}

/** Frame at which packet `k` of a link first reaches the collector. */
export function packetArrival(T: S02Timing, id: LinkId, k: number): number {
  return linkLitAt(T, id) + DRAW + k * (TRAVEL / 2) + TRAVEL;
}

/** 0..1 focus of the scene's closing beat (the intruder wipes the local log). */
export function wipeFocus(frame: number, T: S02Timing): number {
  return progress(frame, T.wipeIn, 14);
}

/** Highlight of a device row: on when the voice names it, off a little after its connector lights. */
export function rowFocus(frame: number, T: S02Timing, id: LinkId): number {
  const on = progress(frame, linkNamedAt(T, id), 10);
  const off = progress(frame, linkLitAt(T, id) + 44, 16);
  return on * (1 - off);
}
