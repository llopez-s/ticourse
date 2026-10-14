import { fmtInt } from '../../../engine/src/theme/motion';

/**
 * s03-apreton «El apretón de manos» — on-screen strings (canon: out/scene-brief.md, «Canon strings» › s03)
 * and the scene's fixed geometry (stage-local, 1728 × 660).
 */
export const S03 = {
  /** The fixed lab label, in its four parts (joined by «·» on screen). */
  strip: ['prueba autorizada', 'punto de acceso de pruebas', 'misma configuración que HALDEN-OPS', 'clave de prueba, corriente a propósito'],
  protoWpa2: 'WPA2-PSK',
  protoWpa3: 'WPA3 personal',
  protoSae: 'SAE',
  tablet: 'tableta de pruebas',
  ap: 'punto de acceso',
  laptop: 'portátil de pruebas',
  laptopHost: 'ptl-pruebas-02',
  handshake: 'apretón de manos',
  handshakeExam: 'FOUR-WAY HANDSHAKE',
  sae: 'SAE',
  saeLong: 'SIMULTANEOUS AUTHENTICATION OF EQUALS',
  capture: 'captura',
  captured: 'captura · 1 handshake',
  home: 'a casa',
  offline: 'sin conexión con la red',
  offlineExam: 'OFFLINE',
  tried: 'claves probadas',
  /** The counter arrives in uneven jumps on arbitrary words: nobody can read a speed out of it. */
  triedSteps: [fmtInt(2_000_000), fmtInt(17_000_000), fmtInt(38_000_000)],
  received: 'intentos recibidos',
  oneByOne: ['cada intento, contra el punto de acceso', 'uno a uno y a la vista'],
  tape: 'tráfico grabado ayer',
  tapeWpa2: ['si averiguas la clave,', 'la abre'],
  tapeSae: 'sigue cerrada',
  wpa2: 'WPA2',
  forward: 'FORWARD SECRECY',
  shared: 'Sigue siendo una clave para todos',
} as const;

/** Exam names on screen (canon: violet). */
export const EXAM_TEXT = '#c4b5fd';

/** Fixed geometry. Everything is stage-local. */
export const G = {
  w: 1728,
  h: 660,
  strip: { h: 76, font: 26, big: 1.32 },
  tablet: { x: 105, y: 300, h: 220 },
  /** The access point sits on the dock locker; the padlock gets bolted to the locker's front. */
  ap: { x: 880, y: 166, h: 96 },
  locker: { x: 785, y: 194, w: 190, h: 240 },
  mount: { x: 880, y: 334, h: 156 },
  lanes: { x0: 206, x1: 768, ys: [196, 256, 316, 376] },
  title: { x: 488, y: 84 },
  /** The test laptop's place in the lab, and where it sits once it has been carried «a casa». */
  laptop: { x: 470, y: 503, h: 100 },
  laptopHome: { x: 1164, y: 166, h: 76 },
  panel: { x: 1090, y: 108, w: 638, h: 462 },
  /** The padlock in the «a casa» panel. */
  home: { x: 1409, y: 356, h: 164 },
  band: { y: 592, h: 68 },
} as const;
