import type { GlossaryEntry } from '../../lib/types';
import { SP2_GLOSSARY } from './sp2-cards';
import { SP3_GLOSSARY } from './sp3-cards';
import { SP4_GLOSSARY } from './sp4-cards';
import { SP5_GLOSSARY } from './sp5-cards';

/** Glosario Security+ SY0-701: término en inglés (como el examen), definición breve en español. */
export const SP_GLOSSARY: GlossaryEntry[] = [
  // ---- SP1: General Security Concepts (1.1–1.4) ---------------------------
  { sectionId: 'sp1', term: 'Control categories', def: 'Technical (lo aplica un sistema), Managerial (políticas y supervisión), Operational (lo ejecutan personas a diario), Physical (barreras del mundo real).' },
  { sectionId: 'sp1', term: 'Control types', def: 'Preventive, Deterrent, Detective, Corrective, Compensating y Directive: qué efecto tiene el control sobre el evento.' },
  { sectionId: 'sp1', term: 'Compensating control', def: 'Control sustitutivo que mitiga el mismo riesgo cuando el control principal no es viable.' },
  { sectionId: 'sp1', term: 'CIA triad', def: 'Confidentiality (solo autorizados leen), Integrity (sin alterar), Availability (accesible cuando se necesita).' },
  { sectionId: 'sp1', term: 'Non-repudiation', def: 'El autor de una acción o mensaje no puede negarla después; se logra con firma digital y registros.' },
  { sectionId: 'sp1', term: 'AAA', def: 'Authentication (quién eres), Authorization (qué puedes hacer), Accounting (qué hiciste). Aplica a personas y sistemas.' },
  { sectionId: 'sp1', term: 'Gap analysis', def: 'Comparar la postura actual con el estado deseado (marco, norma, baseline) para identificar y priorizar las carencias.' },
  { sectionId: 'sp1', term: 'Zero Trust', def: 'Modelo «nunca confíes, verifica siempre»: cada petición se autentica y autoriza con contexto, sin zona de confianza por defecto.' },
  { sectionId: 'sp1', term: 'Policy Engine / Policy Administrator', def: 'Plano de control: el engine decide conceder o denegar; el administrator crea o revoca la sesión e instruye al PEP. Juntos forman el PDP.' },
  { sectionId: 'sp1', term: 'Policy Enforcement Point (PEP)', def: 'Componente del plano de datos que abre, vigila y cierra la conexión según lo que ordena el Policy Administrator. Ejecuta, no decide.' },
  { sectionId: 'sp1', term: 'Implicit trust zone', def: 'Área a la que el sujeto accede una vez autorizado por el PDP; en Zero Trust se reduce al mínimo (threat scope reduction).' },
  { sectionId: 'sp1', term: 'Bollard', def: 'Poste o bolardo fijo que impide el paso de vehículos hacia entradas o zonas sensibles. Control físico preventivo.' },
  { sectionId: 'sp1', term: 'Access control vestibule', def: 'Dos puertas enclavadas que dejan pasar a una sola persona verificada; evita tailgating. Antes llamado mantrap.' },
  { sectionId: 'sp1', term: 'Sensors (IR / pressure / microwave / ultrasonic)', def: 'Detectan presencia por calor corporal, peso, ondas de radio reflejadas u ondas de sonido reflejadas, respectivamente.' },
  { sectionId: 'sp1', term: 'Honeypot / Honeynet', def: 'Sistema señuelo aislado para observar atacantes; honeynet = red completa de señuelos.' },
  { sectionId: 'sp1', term: 'Honeyfile / Honeytoken', def: 'Archivo cebo que alerta al abrirse / dato falso (credencial, clave API, registro) cuyo uso delata una intrusión.' },
  { sectionId: 'sp1', term: 'Change Advisory Board (CAB)', def: 'Comité que revisa, aprueba o rechaza las solicitudes de cambio valorando riesgo e impacto en el negocio.' },
  { sectionId: 'sp1', term: 'Backout plan', def: 'Pasos documentados y probados para revertir un cambio fallido y volver al estado anterior; se prepara antes de implementar.' },
  { sectionId: 'sp1', term: 'Maintenance window', def: 'Franja acordada de baja actividad en la que se ejecutan los cambios aprobados para minimizar el impacto.' },
  { sectionId: 'sp1', term: 'Standard operating procedure (SOP)', def: 'Procedimiento escrito paso a paso que garantiza que una tarea se ejecute igual y de forma segura cada vez.' },
  { sectionId: 'sp1', term: 'Impact analysis', def: 'Evaluación previa de qué sistemas, dependencias y usuarios afecta un cambio y qué ocurre si falla. Alimenta la decisión del CAB.' },
  { sectionId: 'sp1', term: 'Version control', def: 'Registro histórico de cada versión de configuraciones, código y documentos; permite auditar y volver atrás.' },
  { sectionId: 'sp1', term: 'Symmetric / Asymmetric encryption', def: 'Una clave compartida, rápida, para volumen (AES) / par público-privado, lenta, para intercambio de claves y firmas (RSA, ECC).' },
  { sectionId: 'sp1', term: 'Key exchange', def: 'Acordar una clave simétrica de sesión entre partes sin canal previo seguro, normalmente con criptografía asimétrica (Diffie-Hellman, RSA).' },
  { sectionId: 'sp1', term: 'Hashing', def: 'Función unidireccional que genera un digest de longitud fija (SHA-256). Da integridad, no confidencialidad; no es reversible.' },
  { sectionId: 'sp1', term: 'Salting', def: 'Añadir un valor aleatorio único a cada contraseña antes del hash; anula rainbow tables y hashes repetidos.' },
  { sectionId: 'sp1', term: 'Key stretching', def: 'Iterar miles de veces el hash de una contraseña (PBKDF2, bcrypt) para encarecer cada intento de fuerza bruta.' },
  { sectionId: 'sp1', term: 'Digital signature', def: 'Hash del mensaje cifrado con la clave PRIVADA del emisor y verificado con su clave pública. Integridad, autenticidad y no repudio.' },
  { sectionId: 'sp1', term: 'Steganography', def: 'Ocultar la existencia misma del mensaje dentro de otro archivo (imagen, audio, vídeo), a diferencia del cifrado, que oculta el contenido.' },
  { sectionId: 'sp1', term: 'Tokenization / Data masking', def: 'Sustituir un dato sensible por un token sin valor propio (reversible vía bóveda) / ocultar parte del dato al mostrarlo (****1234).' },
  { sectionId: 'sp1', term: 'Blockchain', def: 'Libro mayor distribuido de bloques enlazados por hash; alterar uno invalida los siguientes, lo que da integridad sin autoridad central.' },
  { sectionId: 'sp1', term: 'Public Key Infrastructure (PKI)', def: 'Conjunto de CAs, certificados, políticas y procesos que vinculan claves públicas a identidades y gestionan su ciclo de vida.' },
  { sectionId: 'sp1', term: 'Certificate Authority (CA)', def: 'Entidad de confianza que verifica identidades y emite, firma y revoca certificados digitales.' },
  { sectionId: 'sp1', term: 'Certificate Signing Request (CSR)', def: 'Solicitud enviada a la CA con la clave pública y los datos de identidad del solicitante; la clave privada nunca sale del solicitante.' },
  { sectionId: 'sp1', term: 'CRL / OCSP', def: 'Lista periódica de certificados revocados que se descarga completa (puede estar desactualizada) / consulta en tiempo real del estado de un certificado.' },
  { sectionId: 'sp1', term: 'Wildcard / Self-signed certificate', def: 'Certificado *.dominio.com que cubre todos los hosts de UN solo nivel de subdominio / certificado firmado por su propio emisor sin CA, no confiable por defecto en navegadores.' },
  { sectionId: 'sp1', term: 'Key escrow', def: 'Depósito de copias de claves privadas en un tercero o custodio de confianza para recuperar datos o permitir acceso legal.' },
  { sectionId: 'sp1', term: 'Trusted Platform Module (TPM)', def: 'Chip en la placa base que guarda claves y mediciones de arranque para un único equipo (BitLocker, secure boot, atestación).' },
  { sectionId: 'sp1', term: 'HSM / KMS', def: 'Appliance dedicado resistente a manipulación que genera y custodia claves para muchos sistemas / servicio que gestiona el ciclo de vida de las claves.' },
  { sectionId: 'sp1', term: 'Secure enclave', def: 'Zona aislada dentro del procesador que procesa datos sensibles (biometría, claves) sin que el sistema operativo principal pueda leerlos.' },

  // ---- SP2 ----------------------------------------------------------------
  ...SP2_GLOSSARY,

  // ---- SP3 ----------------------------------------------------------------
  ...SP3_GLOSSARY,

  // ---- SP4 ----------------------------------------------------------------
  ...SP4_GLOSSARY,

  // ---- SP5 ----------------------------------------------------------------
  ...SP5_GLOSSARY,
];
