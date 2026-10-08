import { C, FONT, alpha } from '../../../../../engine/src/theme/tokens';
import { EASE } from '../../../../../engine/src/theme/motion';
import { clamp01, cubicPoint, type Point } from '../../../../../engine/src/ui';
import { OFFER } from '../../../data/s09-linea';
import { OfferSheet, offerSheetSize } from '../Fingerprint';
import { HOUSE_KEY_BASE, HouseKey, HouseLock, Mailbox, mailboxHeight, mailboxPoint } from '../Mailbox';

export const INSET = { width: 1300, height: 452 } as const;

const SHEET_W = 250;
const SHEET = { x: 140, y: 104 };
const LOCK_W = 74;
const MB_W = 150;
const MB = { x: 1040 - MB_W / 2, y: 92 };
const KEY_W = 118;
const LABEL_Y = 330;

/** The key's flight: from the lock on the sheet, over the top, into the slot of her mailbox. */
function flight(): [Point, Point, Point, Point] {
  const size = offerSheetSize(SHEET_W);
  const from = { x: SHEET.x + size.w + 30, y: SHEET.y + size.h - 40 };
  const slot = mailboxPoint(MB_W, 'slot');
  const to = { x: MB.x + slot.x, y: MB.y + slot.y };
  return [from, { x: from.x + 220, y: 40 }, { x: to.x - 260, y: 10 }, to];
}

function Label({ x, lines, color, show }: { x: number; lines: readonly string[]; color: string; show: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 260,
        top: LABEL_Y,
        width: 520,
        textAlign: 'center',
        fontFamily: FONT.sans,
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
        opacity: clamp01(show),
      }}
    >
      {lines.map((l, i) => (
        <div key={l} style={{ fontSize: i === 0 ? 36 : 32, fontWeight: i === 0 ? 800 : 700, color: i === 0 ? C.textStrong : color }}>
          {l}
        </div>
      ))}
    </div>
  );
}

/**
 * s09's «la oferta, igual»: the offer of s03 is closed with a symmetric key
 * (the house key's padlock on the sheet), and that key travels through the
 * slot of the shipping company's mailbox (her public key). Not positioned;
 * INSET.width × INSET.height. Weights: `show` (panel), `lock` (the padlock
 * closes), `fly` (the key's trip), `slot` (the slot lights as it goes in).
 */
export function OfferInset({ show, lock, fly, slot }: { show: number; lock: number; fly: number; slot: number }) {
  const p = clamp01(show);
  if (p <= 0) return null;
  const f = clamp01(fly);
  const curve = flight();
  const t = EASE.inOut(f);
  const at = cubicPoint(curve, t);
  const keyScale = 1 - 0.65 * clamp01((t - 0.75) / 0.25);
  // The key waits beside the closed padlock, then flies and goes in through the slot.
  const keyOpacity = f <= 0 ? clamp01((clamp01(lock) - 0.5) * 2) : 1 - clamp01((t - 0.9) / 0.1);
  const d = `M${curve[0].x},${curve[0].y} C${curve[1].x},${curve[1].y} ${curve[2].x},${curve[2].y} ${curve[3].x},${curve[3].y}`;
  const keyH = (KEY_W * HOUSE_KEY_BASE.h) / HOUSE_KEY_BASE.w;
  return (
    <div
      style={{
        position: 'relative',
        width: INSET.width,
        height: INSET.height,
        boxSizing: 'border-box',
        borderRadius: 30,
        border: `2px solid ${C.ink600}`,
        background: `linear-gradient(180deg, ${alpha(C.ink850, 0.98)} 0%, ${alpha(C.ink900, 0.98)} 100%)`,
        boxShadow: `0 40px 90px ${alpha('#000000', 0.55)}`,
        fontFamily: FONT.sans,
        opacity: Math.min(1, p * 1.4),
        transform: `scale(${0.95 + 0.05 * Math.min(1, p)})`,
      }}
    >
      <div style={{ position: 'absolute', left: 36, top: 24, fontSize: 42, fontWeight: 850, letterSpacing: -0.5, color: C.textStrong, whiteSpace: 'nowrap' }}>{OFFER.title}</div>

      {/* The offer, closed with a symmetric key */}
      <div style={{ position: 'absolute', left: SHEET.x, top: SHEET.y }}>
        <OfferSheet width={SHEET_W} stamp={<HouseLock width={LOCK_W} closed={lock} glow={0.6 * clamp01(lock)} />} />
      </div>
      <Label x={SHEET.x + SHEET_W / 2} lines={OFFER.doc} color={C.text} show={0.3 + 0.7 * clamp01(lock)} />

      {/* Her mailbox */}
      <div style={{ position: 'absolute', left: MB.x, top: MB.y, height: mailboxHeight(MB_W) }}>
        <Mailbox width={MB_W} slotGlow={clamp01(slot)} glow={0.4 * clamp01(slot)} />
      </div>
      <Label x={MB.x + MB_W / 2} lines={OFFER.key} color="#6ee7b7" show={0.3 + 0.7 * clamp01(slot)} />

      {/* The key's trip */}
      <svg width={INSET.width} height={INSET.height} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <path d={d} fill="none" stroke={alpha(C.text, 0.35 * Math.min(1, f * 3))} strokeWidth={3} strokeDasharray="10 12" />
      </svg>
      {keyOpacity > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: at.x - KEY_W / 2,
            top: at.y - keyH / 2,
            opacity: keyOpacity,
            transform: `scale(${keyScale})`,
          }}
        >
          <HouseKey width={KEY_W} flip glow={0.6} />
        </div>
      ) : null}
    </div>
  );
}
