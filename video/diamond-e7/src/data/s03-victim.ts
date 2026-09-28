/**
 * Raw EDR telemetry from ENG-WS-041 on the night of E7 (fictional data, VELVET
 * CICADA canon). Each line is plain monospace text; `drag` marks the substring
 * the analyst drags into the diamond in S03.
 */
export type LogDrag = {
  /** Substring of the line that is picked up. */
  token: string;
  /** Label of the chip that flies to the vertex. */
  chip: string;
  to: 'vic' | 'cap';
  /** Which drag this is, in order. */
  key: 'host' | 'org' | 'hash' | 'pipe';
};

export type LogLine = { text: string; kind: 'comment' | 'head' | 'detail'; drag?: LogDrag };

export const EDR_LOG: LogLine[] = [
  {
    text: '# tenant: Meridian Dynamics · sensor EDR',
    kind: 'comment',
    drag: { token: 'Meridian Dynamics', chip: 'Meridian Dynamics', to: 'vic', key: 'org' },
  },
  {
    text: '2026-03-05T02:11:47Z ENG-WS-041 PROC_START',
    kind: 'head',
    drag: { token: 'ENG-WS-041', chip: 'ENG-WS-041', to: 'vic', key: 'host' },
  },
  { text: '  image=C:\\ProgramData\\UpdSvc\\updsvc.exe', kind: 'detail' },
  { text: '2026-03-05T02:11:47Z ENG-WS-041 FILE_HASH', kind: 'head' },
  {
    text: '  sha256=9f3a...e1  signed=false',
    kind: 'detail',
    drag: { token: '9f3a...e1', chip: 'SHA-256 9f3a...e1', to: 'cap', key: 'hash' },
  },
  { text: '2026-03-05T02:11:49Z ENG-WS-041 PIPE_CREATE', kind: 'head' },
  {
    text: '  \\\\.\\pipe\\vc_pipe_3a7f09c1',
    kind: 'detail',
    drag: { token: 'vc_pipe_3a7f09c1', chip: 'vc_pipe_%08x', to: 'cap', key: 'pipe' },
  },
  { text: '2026-03-05T02:13:02Z ENG-WS-041 NET_CONN', kind: 'head' },
  { text: '  dst=update-svc-cdn.com:443  HTTPS', kind: 'detail' },
  { text: '2026-03-05T02:14:01Z ENG-WS-041 NET_CONN', kind: 'head' },
  { text: '  dst=update-svc-cdn.com:443  HTTPS', kind: 'detail' },
];
