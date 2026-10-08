import { C } from '../../../../engine/src/theme/tokens';
import {
  EDR_ROWS,
  EDR_TITLE,
  LogPanel,
  logPanelHeight,
  logRowAnchor,
  logSpanAnchor,
  type EdrLineId,
  type LogPanelProps,
  type LogSpanId,
} from './LessonLog';

/**
 * The EDR process chain of the lesson's reconstruction (s2m1,
 * `src/data/s2.ts:77-83`), on ENG-WS-041 «mismo día», drawn as a log panel
 * titled «host ENG-WS-041 · mismo día». Rows, in order (`EDR_ROWS`):
 *
 *   explorer    09:44:12  explorer.exe
 *   open                     (drawn elbow) abre CV_Ingeniero.pdf.lnk
 *   powershell  09:44:13  powershell.exe -nop -w hidden -enc SQBFAFgAKA...
 *   drop        09:44:19  escribe C:\ProgramData\winhlp.exe
 *   schtasks    09:44:20  schtasks /create /tn WindowsUpdateCheck
 *   schtasksTr               /tr C:\ProgramData\winhlp.exe /sc onlogon
 *   beacon      09:45:02  winhlp.exe (drawn connector) TLS update-svc-cdn.com:443 (beacon 60s)
 *
 * No `[fase]` tag in any state: a phase is named by its vignette, when the
 * voice says it. Spans: `openLnk`, `powershell`, `dropPath`, `taskName`,
 * `beaconExe`, `beaconDomain`. Props are those of `LogPanel` (./LessonLog):
 * `width`, `draw`, `show`, `focus`, `dim`, `rowDim`, `highlight`,
 * `highlightTone`, `focusTone`, `tags`, `connector` (0–1 draw of the drawn
 * arrow), `beat` (0–1 pulse travelling it), `headerDim`, `style`.
 * Anchors in px from the panel's top-left: `edrHeight(width)`,
 * `edrRowAnchor(id, width, focus)`, `edrSpanAnchor(span, width, focus)`.
 */
export type ProcessTreeProps = Omit<LogPanelProps, 'rows' | 'title' | 'icon' | 'iconTone'>;

export function ProcessTree(props: ProcessTreeProps) {
  return <LogPanel rows={EDR_ROWS} title={EDR_TITLE} icon="desktop" iconTone={C.cyan} {...props} />;
}

export { EDR_ROWS, type EdrLineId };

export const edrHeight = (width: number) => logPanelHeight(EDR_ROWS, width);
export const edrRowAnchor = (id: EdrLineId, width: number, focus = 0) => logRowAnchor(EDR_ROWS, id, width, focus);
export const edrSpanAnchor = (span: LogSpanId, width: number, focus = 0) => logSpanAnchor(EDR_ROWS, span, width, focus);
