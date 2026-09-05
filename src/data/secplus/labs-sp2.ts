import type { ClassifyData, LabMeta, SelectData } from '../labs';

// ---------------------------------------------------------------------------
// Security+ (SY0-701) Domain 2 labs — Halden Port Authority scenario
// ---------------------------------------------------------------------------

export const SP2_LABS: LabMeta[] = [
  {
    id: 'spl2a',
    sectionId: 'sp2',
    title: 'Threat Actor Lineup',
    icon: '🎭',
    minutes: 10,
    xp: 100,
    kind: 'classify',
    brief:
      'Doce incidentes en la Autoridad Portuaria de Halden. Identifica al actor de amenaza más probable en cada uno: nation-state, organized crime, hacktivist, insider, unskilled attacker o shadow IT. Necesitas ≥80%.',
    mission: {
      n: 2,
      briefing:
        'Primera semana con el SOC del puerto en marcha y ya hay doce incidentes abiertos. El CISO quiere saber a quién se enfrenta el puerto antes de pedir presupuesto: no se defiende igual de un adolescente con un kit descargado que de un servicio de inteligencia. Atribuye cada incidente al actor más probable por sus motivaciones, recursos y sofisticación.',
    },
  },
  {
    id: 'spl2b',
    sectionId: 'sp2',
    title: 'Vector Triage',
    icon: '🎣',
    minutes: 10,
    xp: 100,
    kind: 'classify',
    brief:
      'Clasifica 12 intentos de ingeniería social por técnica: phishing, smishing, vishing, BEC, pretexting, watering hole, typosquatting o impersonation. Necesitas ≥80%.',
  },
  {
    id: 'spl2c',
    sectionId: 'sp2',
    title: 'Mitigation Picker',
    icon: '🛠️',
    minutes: 8,
    xp: 75,
    kind: 'select',
    brief:
      'Tras un incidente de movimiento lateral, elige las 4 mitigaciones que atacan la causa raíz. Cada elección viene con feedback.',
  },
];

// ---------------------------------------------------------------------------
// Classify labs
// ---------------------------------------------------------------------------

export const SP2_CLASSIFY_DATA: Record<string, ClassifyData> = {
  spl2a: {
    passPct: 80,
    categories: [
      { id: 'nation', label: 'Nation-state' },
      { id: 'crime', label: 'Organized crime' },
      { id: 'hacktivist', label: 'Hacktivist' },
      { id: 'insider', label: 'Insider threat' },
      { id: 'unskilled', label: 'Unskilled attacker' },
      { id: 'shadow', label: 'Shadow IT' },
    ],
    items: [
      {
        text: 'A previously unknown zero-day in the vessel traffic management software is used to sit silently inside the network for 14 months, exfiltrating ship manifests for naval cargo only',
        answer: 'nation',
        why: 'Zero-day propio, persistencia de más de un año sin ruido y objetivo puramente de inteligencia militar: recursos y paciencia de un servicio estatal. No hay motivación económica ni mensaje público.',
      },
      {
        text: 'Custom malware never seen by any vendor targets the port’s ICS controllers; the campaign coincides with a diplomatic dispute over shipping lanes',
        answer: 'nation',
        why: 'Malware a medida contra sistemas de control industrial y sincronizado con un conflicto geopolítico: sabotaje o disrupción estratégica. Solo un estado combina esos recursos con ese motivo.',
      },
      {
        text: 'Ransomware encrypts the terminal operating system and a professional leak-site page counts down to publication unless 2.4 million euros in cryptocurrency is paid',
        answer: 'crime',
        why: 'Ransomware con doble extorsión, cifra en cripto y portal de negociación «profesional»: modelo de negocio del crimen organizado. La motivación es dinero.',
      },
      {
        text: 'Well-crafted invoice-fraud emails from a criminal affiliate network redirect three payments from shipping lines to mule accounts',
        answer: 'crime',
        why: 'Fraude financiero estructurado con red de afiliados y cuentas mula: operación de crimen organizado con beneficio económico como único fin.',
      },
      {
        text: 'The public port website is defaced overnight with a banner protesting the arrival of a liquefied natural gas tanker',
        answer: 'hacktivist',
        why: 'Deface con mensaje político o social visible es la firma del hacktivista: busca atención y protesta, no dinero ni datos.',
      },
      {
        text: 'A loosely organized online collective floods the ferry-booking portal with a DDoS after the port bans an environmental protest flotilla',
        answer: 'hacktivist',
        why: 'DDoS como respuesta a una decisión que el grupo considera injusta, coordinado por un colectivo sin ánimo de lucro: motivación ideológica, actor hacktivista.',
      },
      {
        text: 'A logistics planner who was passed over for promotion copies the customer pricing database to a personal USB drive on his last day',
        answer: 'insider',
        why: 'Acceso legítimo usado para llevarse datos, con un motivo personal (resentimiento): amenaza interna. La clave es que ya estaba dentro y autorizado.',
      },
      {
        text: 'A crane-maintenance contractor with valid VPN credentials disables safety alarms after a pay dispute with the port',
        answer: 'insider',
        why: 'Un contratista con credenciales válidas también es insider: usa el acceso que se le concedió para causar daño. La motivación es revancha, no espionaje ni dinero.',
      },
      {
        text: 'A teenager runs a downloaded scanner against the port’s public IP range and tries the default password on a customs kiosk; the noisy scan trips every IDS rule',
        answer: 'unskilled',
        why: 'Herramientas descargadas, sin adaptar, mucho ruido y contraseñas por defecto: perfil de script kiddie o atacante sin habilidad. Poca sofisticación y pocos recursos.',
      },
      {
        text: 'Someone copies a public exploit script line by line from a forum and runs it against a server version it does not even affect, crashing nothing but filling the logs',
        answer: 'unskilled',
        why: 'Copiar un exploit sin entender contra qué funciona es el rasgo definitorio del unskilled attacker: motivación de curiosidad o notoriedad, sin recursos ni conocimiento.',
      },
      {
        text: 'The HR team stores candidate files in a free consumer cloud account they set up themselves because the official file share is "too slow"',
        answer: 'shadow',
        why: 'Sin malicia: empleados que despliegan tecnología no aprobada para trabajar mejor. Es shadow IT y el riesgo es la falta de control, no la intención.',
      },
      {
        text: 'The operations manager plugs an unregistered Wi-Fi router into the yard network so his team can use tablets; IT only finds it during a wireless survey',
        answer: 'shadow',
        why: 'Un dispositivo conectado a la red sin pasar por IT para «facilitar el trabajo» es shadow IT: sortea los controles pero no hay adversario detrás.',
      },
    ],
  },

  spl2b: {
    passPct: 80,
    categories: [
      { id: 'phishing', label: 'Phishing' },
      { id: 'smishing', label: 'Smishing' },
      { id: 'vishing', label: 'Vishing' },
      { id: 'bec', label: 'BEC' },
      { id: 'pretexting', label: 'Pretexting' },
      { id: 'watering', label: 'Watering hole' },
      { id: 'typosquat', label: 'Typosquatting' },
      { id: 'impersonation', label: 'Impersonation' },
    ],
    items: [
      {
        text: 'Two hundred port employees receive an email titled "Your payslip is ready" with a link to a fake HR login page harvesting credentials',
        answer: 'phishing',
        why: 'Correo masivo con enlace a una página falsa para robar credenciales: phishing clásico. El canal (email) y el cebo genérico son la pista.',
      },
      {
        text: 'An email pretending to be from the customs agency asks the import desk to open an attached "declaration form" that drops malware',
        answer: 'phishing',
        why: 'Sigue siendo phishing por email: el adjunto malicioso es el payload. No es BEC porque no hay buzón ejecutivo comprometido ni petición de pago.',
      },
      {
        text: 'Dock workers get a text message: "Your parcel could not be delivered, confirm your address here" with a shortened link',
        answer: 'smishing',
        why: 'Phishing por SMS = smishing. El canal decide la categoría: mensaje de texto con enlace acortado.',
      },
      {
        text: 'A caller claiming to be from the bank\'s fraud department asks the accounts clerk to read out the one-time code she just received',
        answer: 'vishing',
        why: 'Ingeniería social por llamada de voz para obtener un código OTP: vishing. La pista es el teléfono como canal.',
      },
      {
        text: 'A message from the CEO\'s real mailbox, sent while she is travelling, tells finance to wire 180,000 euros urgently to a "new supplier" and keep it confidential',
        answer: 'bec',
        why: 'Buzón ejecutivo comprometido (o suplantado) pidiendo un pago urgente y confidencial: Business Email Compromise. Dinero + autoridad + urgencia.',
      },
      {
        text: 'An email that spoofs the CFO\'s display name asks payroll to change the bank details of five senior managers before the next pay run',
        answer: 'bec',
        why: 'Suplantación de un directivo por email para desviar pagos (cambio de cuenta bancaria): BEC. Ataca el proceso financiero, no las credenciales.',
      },
      {
        text: 'A man phones the helpdesk saying he is the new IT auditor, gives a plausible audit reference number and asks for a list of admin accounts to "cross-check"',
        answer: 'pretexting',
        why: 'Construye una historia creíble (auditoría, número de referencia) para justificar la petición: pretexting. La pista decisiva es el escenario fabricado.',
      },
      {
        text: 'Someone emails the port\'s recruitment inbox claims to be running a university study on shift patterns, describes the project in detail and asks for the crew rota "for the study"',
        answer: 'pretexting',
        why: 'El pretexto (una investigación académica) es la palanca para sacar información: pretexting. No pide dinero ni credenciales, pide datos con una excusa.',
      },
      {
        text: 'The maritime-pilots association website, visited daily by port staff, is compromised to serve an exploit kit only to visitors from the port\'s IP range',
        answer: 'watering',
        why: 'Comprometer un sitio legítimo que el grupo objetivo visita habitualmente y esperar a que caigan: watering hole. No hay correo ni llamada, la víctima acude sola.',
      },
      {
        text: 'Staff who mistype the intranet address land on haldenp0rt.com, a pixel-perfect copy that captures their SSO password',
        answer: 'typosquat',
        why: 'Dominio parecido que explota errores al teclear (0 por o): typosquatting. La pista es el nombre de dominio, no el mensaje.',
      },
      {
        text: 'A man in a high-visibility vest with a printed badge says he is the elevator technician and asks the receptionist to hold the server-room door open',
        answer: 'impersonation',
        why: 'Se hace pasar físicamente por un rol concreto (el técnico) para obtener acceso: impersonation. Aquí no hay historia elaborada, solo la identidad falsa.',
      },
      {
        text: 'A voice message on Teams from a profile named after the real IT manager asks a new hire to install a "remote support tool" from a link',
        answer: 'impersonation',
        why: 'Suplantar a una persona concreta y conocida (el responsable de IT) para que la víctima obedezca: impersonation. El canal es secundario; lo decisivo es la identidad usurpada.',
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Select labs
// ---------------------------------------------------------------------------

export const SP2_SELECT_DATA: Record<string, SelectData> = {
  spl2c: {
    pickN: 4,
    prompt:
      'Incidente cerrado: un atacante hizo phishing a una usuaria que era administradora local de su estación de trabajo, volcó la contraseña de administrador local (idéntica en todos los PCs del puerto) y con ella saltó al servidor de ficheros, que está en la misma red plana. Allí ejecutó una herramienta sin firmar que el EDR no bloqueó. El CISO te pide las 4 mitigaciones que atacan la causa raíz, no los síntomas.',
    options: [
      {
        text: 'Segment the network so workstations cannot reach servers directly (VLANs + firewall rules between zones)',
        good: true,
        why: '✅ El salto de un PC al servidor solo fue posible porque la red es plana. La segmentación limita el movimiento lateral aunque una estación caiga.',
      },
      {
        text: 'Deploy unique, automatically rotated local administrator passwords on every endpoint (LAPS-style)',
        good: true,
        why: '✅ La contraseña de admin local compartida convirtió una máquina comprometida en todas. Con credenciales únicas y rotadas, el secreto robado solo abre ese PC.',
      },
      {
        text: 'Enforce an application allow list so only approved, signed executables can run on servers',
        good: true,
        why: '✅ La herramienta sin firmar se ejecutó porque nada lo impedía. Una lista de permitidos bloquea por defecto lo desconocido, justo donde el EDR falló.',
      },
      {
        text: 'Remove local admin rights from standard users and apply least privilege to daily accounts',
        good: true,
        why: '✅ Si la cuenta phisheada no hubiera tenido privilegios de administrador, el atacante no habría podido volcar la contraseña local. Mínimo privilegio corta la cadena al principio.',
      },
      {
        text: 'Buy a larger next-generation firewall appliance for the Internet perimeter',
        good: false,
        why: '❌ El movimiento lateral fue interno; el perímetro nunca lo vio. Un firewall más grande en la frontera no cambia nada de la cadena de este incidente.',
      },
      {
        text: 'Force all employees to change their passwords every 30 days',
        good: false,
        why: '❌ La rotación forzada de usuarios no toca la contraseña de admin local compartida, que es la que se abusó, y genera contraseñas más débiles y predecibles.',
      },
      {
        text: 'Block all USB devices on every workstation',
        good: false,
        why: '❌ Control útil para otro riesgo, pero en este incidente no intervino ningún USB: el acceso inicial fue phishing. No ataca la causa raíz.',
      },
      {
        text: 'Migrate the file server to a cloud storage provider',
        good: false,
        why: '❌ Mover el servidor no elimina la contraseña compartida, los privilegios excesivos ni la ejecución sin control: el atacante llegaría igual con las mismas credenciales.',
      },
    ],
  },
};
