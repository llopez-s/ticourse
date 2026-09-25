import { curveBetween, type Point } from '../../../../../engine/src/ui';
import type { GroupId, InputId, LinkId } from '../../../data/s02-collect';

/** Stage-local geometry of scene 02 (stage = 1728 x 660, origin at STAGE.left/top). */
export const L = {
  spineY: 0,
  /** Source column. */
  srcX: 0,
  srcW: 736,
  cardPad: 22,
  /** Text column inside a card (after the icon tile). */
  textX: 92,
  line1: 44,
  line2: 98,
  /** Collector + central store column. */
  colX: 1176,
  colW: 552,
  collectorY: 96,
  collectorH: 296,
  storeY: 404,
  storeH: 256,
  /** Input rows inside the collector (panel-relative centres). */
  inputRow0: 141,
  inputStep: 42,
  /** Store rows (panel-relative top of the first row, and row pitch). */
  storeRow0: 64,
  storeStep: 31,
} as const;

export const CARD: Record<GroupId, { y: number; h: number }> = {
  sys: { y: 96, h: 142 },
  app: { y: 250, h: 142 },
  inf: { y: 404, h: 256 },
};

/** Infrastructure device rows (card-relative centres). */
export const INFRA_ROW_Y = [101, 151, 201] as const;

export function inputY(id: InputId): number {
  const index = ['agent', 'syslog', 'api', 'netflow'].indexOf(id);
  return L.collectorY + L.inputRow0 + index * L.inputStep;
}

/** Exit point of each link on the right edge of its source card. */
export const PORT: Record<LinkId, Point> = {
  sys: { x: L.srcW, y: CARD.sys.y + L.line2 },
  app: { x: L.srcW, y: CARD.app.y + L.line2 },
  fw: { x: L.srcW, y: CARD.inf.y + INFRA_ROW_Y[0] },
  cloud: { x: L.srcW, y: CARD.inf.y + INFRA_ROW_Y[1] },
  router: { x: L.srcW, y: CARD.inf.y + INFRA_ROW_Y[2] },
};

/** Where each link lands on the collector's left edge. */
export const LANDING: Record<LinkId, InputId> = {
  sys: 'agent',
  app: 'agent',
  fw: 'syslog',
  cloud: 'api',
  router: 'netflow',
};

export const LINK_IDS: LinkId[] = ['sys', 'app', 'fw', 'cloud', 'router'];

export function linkCurve(id: LinkId): [Point, Point, Point, Point] {
  return curveBetween(PORT[id], { x: L.colX, y: inputY(LANDING[id]) }, 0.5);
}
