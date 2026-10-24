import { C, alpha } from '../../../../engine/src/theme/tokens';
import { Icon } from '../../../../engine/src/ui';
import { BEHAVIOUR_TONE } from '../../data/canon';
import { Face } from './Face';

/** The three faces of s02, small: the icon of rule 1. */
export function FacesArt() {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
      <Face size={72} tone={BEHAVIOUR_TONE.risky} mood="knowing" idSuffix="-r1" />
      <Face size={72} tone={BEHAVIOUR_TONE.unexpected} mood="puzzled" idSuffix="-r2" />
      <Face size={72} tone={BEHAVIOUR_TONE.unintentional} mood="oops" idSuffix="-r3" />
    </div>
  );
}

/** The report button in the mail, a cursor on it: the icon of rule 2. */
export function ButtonArt() {
  return (
    <div style={{ position: 'relative', width: 190, height: 74 }}>
      <div style={{ position: 'absolute', left: 0, top: 6, width: 150, height: 62, borderRadius: 16, background: alpha(C.cyan, 0.16), border: `3px solid ${C.cyan}`, boxShadow: `0 0 22px ${alpha(C.cyan, 0.4)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <Icon name="mail" size={32} color={C.cyan} />
        <Icon name="bell" size={32} color={C.cyan} />
      </div>
      <div style={{ position: 'absolute', left: 112, top: 34 }}>
        <Icon name="cursor" size={44} color={C.textStrong} />
      </div>
    </div>
  );
}

/** A year line with its big first dot and the small ones along it: the icon of rule 3. */
export function YearArt() {
  return (
    <svg width={230} height={74} viewBox="0 0 230 74">
      <line x1={8} y1={37} x2={220} y2={37} stroke={alpha(C.sky, 0.75)} strokeWidth={5} strokeLinecap="round" />
      <circle cx={24} cy={37} r={17} fill={C.cyan} stroke={C.cyanSoft} strokeWidth={3} />
      {[70, 104, 138, 172, 206].map((x) => (
        <circle key={x} cx={x} cy={37} r={8} fill={C.emerald} stroke="#6ee7b7" strokeWidth={2.5} />
      ))}
    </svg>
  );
}
