import type { ReactNode } from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { C, FONT, TYPE } from '../theme/tokens';
import { progress } from '../theme/motion';
import { Backdrop } from '../ui/Backdrop';
import { Chip } from '../ui/Chip';
import { Icon } from '../ui/Icon';
import { NodeCard } from '../ui/NodeCard';
import {
  Building,
  Focus,
  House,
  KeyBadge,
  NoticeBoard,
  RecordCard,
  Redacted,
  RuleCards,
  StageTimeline,
  Terminal,
  useFocus,
  type Notice,
} from '../ui';

/**
 * Dev-only QA sheet for the scene kit (src/ui/CATALOG.md), one page per
 * component group, 120 frames each; every timing is relative to its page's
 * Sequence. Sample data is generic (*.example, RFC 5737 IPs). Frames of interest:
 *   60  Terminal: 1st result in focus, 2nd command typing · Focus: card 2
 *   100 Terminal: phishing result in focus, redacted rows · Focus: card 3
 *   135 Building/House rising, lights coming on          210 settled, suspect window lit
 *   280 notices being pinned                             340 redacted notice in focus + tags
 *   390 RecordCard: domain in focus, redaction sweeping   460 older version slid out, e-mail in focus
 *   525 StageTimeline: stage 3 in focus                  592 all lit, focus released
 *   655 RuleCards: rule 2 in focus                       685 rule 3 · 712 all stepped back
 */
export const UI_GALLERY_DURATION = 720;
const PAGE = 120;

export function UiGallery() {
  const pages: [string, ReactNode][] = [
    ['Terminal · Focus', <TerminalPage />],
    ['Building · House · KeyBadge · Redacted', <TenantsPage />],
    ['NoticeBoard', <BoardPage />],
    ['RecordCard', <RecordPage />],
    ['StageTimeline', <TimelinePage />],
    ['RuleCards', <RulesPage />],
  ];
  return (
    <AbsoluteFill style={{ background: C.ink950 }}>
      <Backdrop />
      {pages.map(([name, page], i) => (
        <Sequence key={name} from={i * PAGE} durationInFrames={PAGE}>
          <PageLabel n={i + 1} total={pages.length} name={name} />
          {page}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}

function PageLabel({ n, total, name }: { n: number; total: number; name: string }) {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', left: 96, top: 60, fontFamily: FONT.sans, fontSize: TYPE.label, fontWeight: 700, color: C.muted }}>
      UiGallery · {n}/{total} · <span style={{ color: C.textStrong }}>{name}</span>
      <span style={{ marginLeft: 24, fontFamily: FONT.mono, fontSize: TYPE.small, color: C.faint }}>f{frame}</span>
    </div>
  );
}

function At({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return <div style={{ position: 'absolute', left: x, top: y }}>{children}</div>;
}

// --------------------------------------------------------------------------- 1

function TerminalPage() {
  const { weights, dims } = useFocus([10, 45, 80], { end: 112 });
  return (
    <>
      <At x={96} y={200}>
        <Terminal
          title="passive DNS"
          chip={{ text: 'el listín con memoria', icon: 'clock' }}
          width={1060}
          height={600}
          lines={[
            { kind: 'cmd', at: 6, promptAt: 0, text: [{ t: 'pdns lookup ' }, { t: 'cdn-sync.example', c: C.roseSoft, bold: true }] },
            { kind: 'out', at: 28, text: 'first seen 2026-02-11 · last seen 2026-03-07' },
            { kind: 'result', at: 34, text: '203.0.113.47', icon: 'server', tone: 'sky', tag: { text: 'hosting', accent: 'muted' }, focus: [38, 78] },
            { kind: 'gap', at: 40, height: 10 },
            { kind: 'cmd', at: 50, text: [{ t: 'pdns ip ' }, { t: '203.0.113.47', c: C.sky, bold: true }] },
            {
              kind: 'result',
              at: 72,
              text: 'portal-login.example',
              icon: 'globe',
              tone: 'rose',
              tag: { text: 'phishing', accent: 'rose', solid: true },
              note: 'portal falso de login',
              focus: [80, 200],
            },
            { kind: 'redacted', at: 80, width: 240, tag: { text: 'Lab 3A', accent: 'cyan', icon: 'flag' } },
            { kind: 'redacted', at: 84, width: 190, tag: { text: 'Lab 3A', accent: 'cyan', icon: 'flag' } },
          ]}
        />
      </At>
      <At x={1220} y={220}>
        <div style={{ display: 'grid', gap: 36, width: 560 }}>
          {[
            { icon: 'server' as const, label: 'evidencia', sub: 'el log que se explica' },
            { icon: 'search' as const, label: 'lectura', sub: 'qué significa' },
            { icon: 'flag' as const, label: 'regla', sub: 'lo que hay que recordar' },
          ].map((c, i) => (
            <Focus key={c.label} focus={weights[i]} dim={dims[i]} scale={1.1} origin="left center">
              <NodeCard icon={c.icon} label={c.label} sublabel={c.sub} state={weights[i] > 0.5 ? 'active' : 'normal'} width={520} />
            </Focus>
          ))}
        </div>
      </At>
    </>
  );
}

// --------------------------------------------------------------------------- 2

function TenantsPage() {
  const frame = useCurrentFrame();
  return (
    <>
      <At x={150} y={210}>
        <Building
          width={300}
          height={420}
          tone="amber"
          glow={0.35}
          highlight={{ col: 5, row: 7, at: 34 }}
          label="14.000 inquilinos"
          sub="IP compartida"
          at={0}
        />
      </At>
      <At x={640} y={470}>
        <House width={300} label="un inquilino" sub="recurso dedicado" at={10} glow={progress(frame, 60, 20) * 0.8} />
      </At>
      <At x={1100} y={220}>
        <KeyBadge at={20} glow={0.6} label="autofirmado" sub="CN=example-svc" />
      </At>
      <At x={1100} y={420}>
        <KeyBadge at={40} size={64} shape="tile" label="la misma llave" labelSize={40} />
      </At>
      <At x={1100} y={560}>
        <div style={{ display: 'grid', gap: 26, fontFamily: FONT.sans, fontSize: TYPE.small, color: C.muted }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Redacted width={260} /> <span>barra</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Redacted width={200} tld={60} strike={progress(frame, 60, 14)} /> <span>dominio · tachado</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Redacted label="REDACTED FOR PRIVACY" sweep={progress(frame, 30, 24)} /> <span>barrido</span>
          </div>
        </div>
      </At>
    </>
  );
}

// --------------------------------------------------------------------------- 3

const NOTICES: Notice[] = [
  { slot: 0, title: 'tienda.example', meta: 'emisor: CA pública', code: 'SHA1 3f:a2:91…', at: 4 },
  { slot: 2, title: 'correo.example', meta: 'emisor: CA pública', code: 'SHA1 b1:6d:40…', at: 10 },
  { slot: 7, title: 'mapas.example', meta: 'emisor: CA pública', code: 'SHA1 e6:12:7d…', at: 16 },
  { slot: 1, title: 'blog.example', meta: 'emisor: CA pública', code: 'SHA1 7c:05:e8…', at: 22 },
  { slot: 9, title: 'radio.example', meta: 'emisor: CA gratuita', code: 'SHA1 91:7f:a3…', at: 28, grey: 1 },
  { slot: 4, title: 'fotos.example', meta: 'emisor: CA pública', code: 'SHA1 58:f3:1b…', at: 34 },
  { slot: 11, title: 'agenda.example', meta: 'emisor: CA pública', code: 'SHA1 6a:d0:f9…', at: 40 },
  { slot: 6, title: 'wiki.example', meta: 'emisor: CA pública', code: 'SHA1 a9:44:0e…', at: 44 },
  { slot: 3, title: 'api.example', meta: 'emisor: CA pública', code: 'SHA1 2e:9a:c7…', at: 48 },
  { slot: 8, title: 'foro.example', meta: 'emisor: CA pública', code: 'SHA1 0d:b8:5c…', at: 52 },
  { slot: 10, title: 'cine.example', meta: 'emisor: CA pública', code: 'SHA1 c4:2b:66…', at: 56 },
  {
    slot: 5,
    title: null,
    meta: 'emisor: CA pública',
    code: 'SHA1 f2:8c:37…',
    at: 62,
    tone: 'rose',
    badge: 'hoy',
    focus: [70, 400],
    tags: [
      { text: 'imita a una marca', solid: true, at: 78 },
      { text: 'recién emitido', at: 70 },
    ],
  },
];

function BoardPage() {
  return (
    <At x={351} y={190}>
      <NoticeBoard title="Certificate Transparency · CT logs" chip={{ text: 'lo lee cualquiera', icon: 'users' }} notices={NOTICES} width={1218} height={640} at={0} />
    </At>
  );
}

// --------------------------------------------------------------------------- 4

function RecordPage() {
  const frame = useCurrentFrame();
  return (
    <At x={96} y={220}>
      <RecordCard
        width={840}
        title="WHOIS · ficha de registro"
        right={
          <Chip accent="cyan" size={TYPE.small}>
            hoy
          </Chip>
        }
        rows={[
          { label: 'dominio', value: 'cdn-sync.example', typed: true, at: 4, color: C.roseSoft, focus: [8, 40] },
          { label: 'registrante', redacted: true, redactAt: 18, redactedLabel: 'REDACTED FOR PRIVACY' },
          { label: 'e-mail', redacted: true, redactAt: 26, redactedLabel: 'REDACTED FOR PRIVACY' },
          { label: 'creado', value: '2025-11-18', at: 12 },
          {
            label: 'registrador',
            value: 'Registrar Uno',
            at: 12,
            focus: [40, 70],
            tag: (
              <Chip accent="cyan" icon="app" size={TYPE.small}>
                la tienda
              </Chip>
            ),
          },
        ]}
        footer={
          <>
            <Icon name="lock" size={34} color={C.amber} strokeWidth={2.2} />
            <span style={{ color: '#fcd34d' }}>protección de privacidad activada</span>
          </>
        }
        dim={progress(frame, 80, 16)}
        older={{
          title: 'WHOIS histórico · 2025',
          at: 48,
          slide: progress(frame, 58, 30),
          rows: [
            { label: 'dominio', value: 'cdn-sync.example', color: C.roseSoft },
            { label: 'registrante', value: 'no consta', color: C.faint },
            { label: 'e-mail', value: 'alias@correo.example', color: C.textStrong, focus: [80, 400], tone: 'emerald' },
            { label: 'creado', value: '2025-11-18' },
            { label: 'registrador', value: 'Registrar Uno' },
          ],
          footer: (
            <>
              <Icon name="clock" size={30} color={C.muted} />
              <span>de antes de la privacidad</span>
            </>
          ),
        }}
      />
    </At>
  );
}

// --------------------------------------------------------------------------- 5

function TimelinePage() {
  return (
    <At x={96} y={210}>
      <StageTimeline
        focusEnd={110}
        stages={[
          { title: 'registro', sub: 'en lote', icon: 'globe', tone: 'sky', at: 10, above: <Stack /> },
          { title: 'dormido', sub: 'semanas o meses', icon: 'clock', tone: 'sky', at: 25 },
          { title: 'activación', sub: 'el DNS apunta', icon: 'power', tone: 'rose', at: 40 },
          { title: 'uso', sub: 'en la campaña', icon: 'mail', tone: 'rose', at: 55 },
          {
            title: 'quemado',
            sub: 'detectado',
            icon: 'x',
            tone: 'rose',
            at: 70,
            above: <Redacted width={150} tld={50} tone="rose" strike={1} />,
          },
          { title: 'abandono', sub: 'o reventa', icon: 'archive', tone: 'muted', dashed: true, at: 85 },
        ]}
      />
    </At>
  );
}

function Stack() {
  return (
    <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
      {[150, 118, 164].map((w) => (
        <Redacted key={w} width={w} tld={44} height={24} />
      ))}
    </div>
  );
}

// --------------------------------------------------------------------------- 6

function RulesPage() {
  return (
    <At x={96} y={250}>
      <RuleCards
        dimFrom={104}
        rules={[
          {
            title: ['Cuenta los', 'inquilinos'],
            sub: [<span style={{ color: C.amber }}>compartido contamina</span>, <span style={{ color: C.emerald }}>dedicado discrimina</span>],
            art: (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 40 }}>
                <Building width={96} height={100} cols={4} rows={6} tone="amber" antenna={false} at={10} />
                <House width={150} at={14} />
              </div>
            ),
            at: 10,
          },
          { title: ['Busca lo que', 'es solo suyo'], sub: ['un certificado', <span style={{ color: C.emerald }}>hecho a mano</span>], art: <KeyBadge size={130} at={40} />, at: 40 },
          { title: ['Mira siempre', 'en pasivo'], sub: ['que el actor no sepa', <span style={{ color: C.emerald }}>que vas detrás</span>], icon: 'eyeOff', tone: 'emerald', at: 70 },
        ]}
      />
    </At>
  );
}
