import type { Module } from '../../lib/types';

// ---------------------------------------------------------------------------
// sp1m6 — Criptografía (objective 1.4)
// ---------------------------------------------------------------------------
const sp1m6: Module = {
  id: 'sp1m6',
  sectionId: 'sp1',
  title: 'Criptografía: simétrica, asimétrica, hashing, firmas y más',
  minutes: 14,
  objectives: [
    'Distinguir cifrado symmetric y asymmetric, y saber cuándo se usa cada uno',
    'Explicar el key exchange (Diffie-Hellman/ECDH) y el papel de la key length',
    'Situar los niveles de cifrado: full-disk, partition, volume, file, database, record y transport',
    'Aplicar hashing, salting, key stretching y digital signatures al problema correcto',
    'Reconocer steganography, tokenization, data masking y el open public ledger (blockchain)',
  ],
  blocks: [
    {
      t: 'p',
      md: 'La criptografía no es «cifrar cosas»: es una caja de herramientas donde cada primitiva resuelve **un** problema concreto. El examen SY0-701 rara vez pregunta matemáticas; pregunta *qué herramienta encaja con qué necesidad*. Como analista, tu trabajo es leer el escenario, identificar la necesidad (**confidentiality**, **integrity**, **authentication**, **non-repudiation**) y elegir la primitiva que la cubre sin gastar de más.',
    },
    { t: 'h', text: 'Simétrica y asimétrica: dos familias, dos problemas' },
    {
      t: 'p',
      md: 'El cifrado **symmetric** usa **una sola clave compartida** para cifrar y descifrar. Es rápido y eficiente para grandes volúmenes (discos, bases de datos, tráfico TLS ya negociado); el estándar es **AES** (128/192/256 bits). Su talón de Aquiles es la **key distribution**: ¿cómo entregas la clave a la otra parte sin que nadie la intercepte? El cifrado **asymmetric** responde a eso con un **par de claves**: la **public key** se publica libremente y la **private key** nunca sale de su dueña. Lo que cifra una solo lo descifra la otra. Algoritmos: **RSA** y **ECC** (Elliptic Curve). Es mucho más lento, así que nunca se usa para cifrar gigabytes: se usa para **intercambiar claves** y para **firmar**.',
    },
    {
      t: 'table',
      headers: ['Necesidad', 'Primitiva', 'Ejemplo'],
      rows: [
        ['Confidencialidad de datos en volumen', 'Symmetric encryption', 'AES-256 en un disco cifrado o en la sesión TLS'],
        ['Distribuir o acordar una clave con un desconocido', 'Asymmetric / key exchange', 'RSA, Diffie-Hellman, ECDH'],
        ['Integridad (¿ha cambiado el fichero?)', 'Hash', 'SHA-256 del instalador publicado por el vendor'],
        ['Autenticidad + non-repudiation', 'Digital signature', 'Firmar un contrato o un paquete de software'],
        ['Almacenar contraseñas', 'Salted + stretched hash', 'bcrypt, PBKDF2, Argon2'],
        ['Ocultar un dato sensible pero conservar su formato', 'Tokenization / masking', 'PAN de tarjeta sustituido por un token (PCI DSS)'],
      ],
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen',
      md: 'Regla que resuelve la mitad de las preguntas de asimétrica: **cifras con la PUBLIC key del destinatario** (solo su private key descifra → confidencialidad) y **firmas con TU PRIVATE key** (cualquiera verifica con tu public key → autenticidad y non-repudiation). Si una opción dice «encrypt with the sender\'s private key» para dar confidencialidad, es un distractor: cualquiera con la clave pública lo leería.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Quién usa qué clave',
      text: `FIRMAR (integridad + autenticidad + non-repudiation)
  Ana:   hash = SHA-256(mensaje)
         firma = ENCRYPT(hash, Ana.private)
         envía  mensaje + firma
  Berta: hash1 = SHA-256(mensaje)
         hash2 = DECRYPT(firma, Ana.public)
         hash1 == hash2  ->  el mensaje es de Ana y no fue alterado

CIFRAR PARA ALGUIEN (confidencialidad)
  Ana:   c = ENCRYPT(mensaje, Berta.public)
  Berta: mensaje = DECRYPT(c, Berta.private)
         nadie más tiene Berta.private -> nadie más lo lee

HÍBRIDO (lo que hace TLS en la práctica)
  1. asimétrica / ECDH  -> acordar una session key
  2. simétrica (AES)    -> cifrar todo el tráfico con esa session key`,
    },
    {
      t: 'check',
      q: {
        q: 'A developer wants to send a confidential file to a partner so that ONLY the partner can read it. Which key should be used to encrypt the file?',
        choices: [
          'The developer\'s private key',
          'The developer\'s public key',
          'The partner\'s public key',
          'The partner\'s private key',
        ],
        answer: 2,
        explain:
          'Confidentiality means only the recipient can decrypt, so you encrypt with the recipient\'s public key; only the matching private key (held by the partner) can decrypt. Encrypting with the developer\'s private key would let anyone with the public key read it — that is a signature, not confidentiality.',
      },
    },
    {
      t: 'p',
      md: 'El **key exchange** es el puente entre las dos familias. **Diffie-Hellman** (DH) y su versión en curvas elípticas **ECDH** permiten que dos partes acuerden un secreto compartido sobre un canal público sin haberlo transmitido nunca; ese secreto se convierte en la **session key** simétrica. Esto es el modelo **hybrid** que usa TLS: asimétrica para negociar, simétrica para transportar. Sobre **key length**: más bits = más resistencia a fuerza bruta pero más coste de CPU. Y la comparación favorita del examen: **ECC logra la misma fortaleza con claves mucho más cortas que RSA** (ECC-256 ≈ RSA-3072), por eso domina en móviles e IoT donde la batería y el procesador mandan. En simétrica, AES-256 es hoy el estándar de referencia y AES-128 sigue siendo seguro. La segunda gran pregunta es **dónde** cifrar: el examen distingue niveles, y cada nivel protege contra una amenaza distinta.',
    },
    {
      t: 'list',
      items: [
        '**Full-disk encryption (FDE)** — cifra todo el disco (BitLocker, FileVault). Protege los datos **at rest** si roban el portátil apagado; una vez arrancado y con sesión abierta, no protege nada.',
        '**Partition / volume** — solo una partición o volumen lógico; útil para separar datos sensibles del sistema operativo.',
        '**File-level** — ficheros concretos (EFS, GPG). Sobrevive a que el fichero se copie a otro sitio.',
        '**Database** — toda la base de datos cifrada de forma transparente (TDE). Protege el fichero de la BD, pero el DBA con acceso a la aplicación sigue viendo los datos.',
        '**Record / column / field-level** — solo campos concretos (el número de tarjeta, no el nombre). Es lo que exige PCI DSS y lo que impide que un DBA curioso lea lo sensible.',
        '**Transport / communication** — datos **in transit**: TLS, IPsec, VPN. No protege nada una vez que los datos llegan al destino y se almacenan.',
      ],
    },
    {
      t: 'check',
      q: {
        q: 'A regulation requires that database administrators be unable to read customer credit card numbers, while still being able to manage the database. Which encryption level BEST meets this requirement?',
        choices: [
          'Full-disk encryption on the database server',
          'Transparent database-level encryption',
          'Record/field-level encryption of the card number column',
          'TLS between the application and the database',
        ],
        answer: 2,
        explain:
          'Field-level encryption protects specific sensitive columns with keys the DBA does not hold, so the administrator can operate the database without reading the card numbers. Full-disk and database-level encryption are transparent to anyone who can query the running database, so a DBA would still see the values in clear text.',
      },
    },
    { t: 'h', text: 'Hashing, firmas y contraseñas' },
    {
      t: 'p',
      md: 'Un **hash** es una función **one-way** que convierte cualquier entrada en una salida de **longitud fija** (SHA-256 → 256 bits). No es cifrado: no hay clave y no se «deshace». Sirve para **integrity**: si un bit cambia, el hash cambia por completo. Una **collision** es cuando dos entradas producen el mismo hash; **MD5** y **SHA-1** tienen colisiones prácticas y el examen los considera **deprecated**: la respuesta moderna es siempre la familia **SHA-2** (SHA-256/512) o SHA-3.',
    },
    {
      t: 'list',
      items: [
        '**Salting** — antes de hashear una contraseña se le añade un valor aleatorio único (**salt**) que se guarda junto al hash. Dos usuarias con la misma contraseña tienen hashes distintos, y las **rainbow tables** precalculadas dejan de servir.',
        '**Key stretching** — hashear miles de veces a propósito (**PBKDF2**, **bcrypt**, **Argon2**) para que cada intento de fuerza bruta cueste milisegundos en vez de nanosegundos. Para la usuaria legítima es imperceptible; para quien prueba mil millones de contraseñas, es una muralla.',
        '**Digital signature** — hash del mensaje **cifrado con la private key** de quien firma. Quien verifica recalcula el hash y descifra la firma con la **public key**. Aporta **integrity** (el hash coincide), **authentication** (solo esa private key pudo firmarlo) y **non-repudiation** (la firmante no puede negar que firmó).',
      ],
    },
    {
      t: 'check',
      q: {
        q: 'After a breach, an auditor finds that two users with the same password had identical hashes in the credential database. Which control was MOST likely missing?',
        choices: ['Key stretching', 'Salting', 'Transport encryption', 'Tokenization'],
        answer: 1,
        explain:
          'A unique per-user salt guarantees that identical passwords produce different hashes; identical hashes are the signature of unsalted storage. Key stretching slows down cracking but, without a salt, equal passwords still hash to the same value.',
      },
    },
    {
      t: 'list',
      items: [
        '**Steganography** — esconder datos dentro de otro contenido (una imagen, un audio, un vídeo) de modo que ni siquiera se sepa que hay un mensaje. Es **obfuscation**, no cifrado: si se descubre, se lee.',
        '**Tokenization** — sustituir el dato sensible por un **token** sin valor propio; una bóveda (**token vault**) guarda la correspondencia. El sistema de pagos trabaja con tokens y el PAN real solo vive en la bóveda. Clásico de **PCI DSS**.',
        '**Data masking** — mostrar solo parte del dato (`**** **** **** 1234`) o sustituirlo por valores ficticios en entornos de prueba. Protege lo que se **ve**, no lo que se almacena.',
        '**Blockchain / open public ledger** — un registro **distribuido** donde cada bloque incluye el **hash del bloque anterior**; alterar un bloque antiguo rompe la cadena y todos los nodos lo detectan. Da **integridad e inmutabilidad**, no confidencialidad: el libro es público.',
      ],
    },
    {
      t: 'p',
      md: 'Ya sabes qué hace cada primitiva. Queda la pregunta incómoda: cuando recibes una **public key**, ¿cómo sabes que pertenece a quien dice? Esa confianza no la da la matemática, la da la **PKI** — certificados, autoridades y raíces de confianza — que es el tema de la siguiente lección.',
    },
  ],
  quiz: [
    {
      id: 'sp1m6q1',
      domain: 'General Security Concepts',
      prompt:
        'A company needs to encrypt several terabytes of backup data every night with minimal CPU overhead. Which type of encryption is the BEST choice for the bulk data?',
      choices: [
        'RSA-4096 asymmetric encryption',
        'AES-256 symmetric encryption',
        'SHA-256 hashing',
        'ECC-based digital signatures',
      ],
      answer: 1,
      explain:
        'Symmetric algorithms such as AES are fast and designed for bulk data; a single shared key encrypts and decrypts efficiently. RSA is orders of magnitude slower and is reserved for key exchange and signatures, while hashing and signatures provide integrity, not confidentiality.',
    },
    {
      id: 'sp1m6q2',
      domain: 'General Security Concepts',
      prompt:
        'Two systems that have never communicated before must agree on a shared secret over an untrusted network without transmitting the secret itself. Which mechanism accomplishes this?',
      choices: [
        'Diffie-Hellman key exchange',
        'AES-GCM',
        'Salted SHA-256',
        'Full-disk encryption',
      ],
      answer: 0,
      explain:
        'Diffie-Hellman (and ECDH) lets both parties derive the same secret from exchanged public values without ever sending the secret, which is exactly the key-distribution problem asymmetric techniques solve. AES-GCM needs the shared key to already exist, and hashing or FDE do not establish keys at all.',
    },
    {
      id: 'sp1m6q3',
      domain: 'General Security Concepts',
      prompt:
        'A software vendor wants customers to verify that a downloaded installer is authentic and has not been modified, and wants to be unable to later deny having released it. What should the vendor do?',
      choices: [
        'Encrypt the installer with the customer\'s public key',
        'Publish the MD5 hash of the installer on the download page',
        'Sign the installer with the vendor\'s private key',
        'Compress the installer with a password',
      ],
      answer: 2,
      explain:
        'A digital signature made with the vendor\'s private key gives integrity, authentication and non-repudiation, and anyone can verify it with the public key. A published hash only proves integrity (and MD5 is deprecated), because an attacker who replaces the file could also replace the hash on the page.',
    },
    {
      id: 'sp1m6q4',
      domain: 'General Security Concepts',
      prompt:
        'A laptop containing sensitive spreadsheets is stolen while powered off. Which control would MOST effectively have prevented the thief from reading the data?',
      choices: [
        'TLS on the corporate VPN',
        'Data masking in the spreadsheet application',
        'A strong BIOS password',
        'Full-disk encryption',
      ],
      answer: 3,
      explain:
        'Full-disk encryption protects data at rest, so a powered-off stolen device yields only ciphertext without the key. TLS only protects data in transit, and a BIOS password can be bypassed by removing the drive and mounting it elsewhere.',
    },
    {
      id: 'sp1m6q5',
      domain: 'General Security Concepts',
      prompt:
        'Which of the following BEST explains why an organization deploying certificates to battery-powered IoT sensors would choose ECC over RSA?',
      choices: [
        'ECC provides confidentiality while RSA only provides integrity',
        'ECC keys are not subject to key length requirements',
        'ECC achieves equivalent security with much shorter keys and less computation',
        'ECC does not require a private key to be stored on the device',
      ],
      answer: 2,
      explain:
        'Elliptic-curve cryptography reaches the strength of a 3072-bit RSA key with a 256-bit key, so signing and key agreement cost far less CPU and power on constrained devices. Both algorithms provide the same asymmetric capabilities and both still require a protected private key.',
    },
    {
      id: 'sp1m6q6',
      domain: 'General Security Concepts',
      prompt:
        'A web application stores passwords using a single SHA-256 pass. A penetration tester cracks most of them within hours using GPU hardware. Which change would MOST slow down future offline attacks?',
      choices: [
        'Switch to SHA-512 to produce a longer hash',
        'Apply key stretching with bcrypt or PBKDF2 and a per-user salt',
        'Encrypt the hashes with the web server\'s public key',
        'Enforce TLS 1.3 on the login page',
      ],
      answer: 1,
      explain:
        'Key stretching deliberately makes each hash computation expensive, cutting the attacker\'s guesses per second by orders of magnitude, and the salt defeats precomputed tables. SHA-512 is still a fast hash, so GPUs would crack it almost as quickly, and TLS protects the password only in transit, not the stored database.',
    },
    {
      id: 'sp1m6q7',
      domain: 'General Security Concepts',
      prompt:
        'A retailer must reduce its PCI DSS scope by ensuring that its e-commerce servers never store real card numbers, while still being able to process refunds later. Which technique is MOST appropriate?',
      choices: [
        'Steganography',
        'Data masking on the receipt',
        'Tokenization with a secure token vault',
        'Hashing the card number with SHA-256',
      ],
      answer: 2,
      explain:
        'Tokenization replaces the PAN with a meaningless token and keeps the mapping in a separate vault, so the servers hold nothing of value but the retailer can still reference the original card for refunds. A hash cannot be reversed to process a refund, and masking only changes what is displayed, not what is stored.',
    },
    {
      id: 'sp1m6q8',
      domain: 'General Security Concepts',
      prompt:
        'An investigator suspects that an insider is exfiltrating confidential documents hidden inside ordinary vacation photos posted to social media. Which technique is the insider MOST likely using?',
      choices: [
        'Asymmetric encryption',
        'Steganography',
        'Tokenization',
        'Key escrow',
      ],
      answer: 1,
      explain:
        'Steganography conceals data inside other media so that the existence of the hidden content is not apparent, which is exactly what embedding documents in photos describes. Encryption would produce obviously unreadable files rather than innocent-looking images, and tokenization or key escrow are unrelated to hiding data.',
    },
  ],
};

// ---------------------------------------------------------------------------
// sp1m7 — PKI, certificados y raíces de confianza en hardware (objective 1.4)
// ---------------------------------------------------------------------------
const sp1m7: Module = {
  id: 'sp1m7',
  sectionId: 'sp1',
  title: 'PKI, certificados y raíces de confianza en hardware',
  minutes: 13,
  objectives: [
    'Describir los componentes de una PKI: CA, RA, CSR, certificado y cadena de confianza',
    'Distinguir certificados self-signed, third-party y wildcard, y saber cuándo usar cada uno',
    'Comparar CRL y OCSP (con stapling) como mecanismos de revocación',
    'Explicar el key escrow y los fundamentos del key management',
    'Comparar TPM, HSM, KMS y secure enclave como raíces de confianza en hardware',
  ],
  blocks: [
    {
      t: 'p',
      md: 'La lección anterior terminó con una pregunta: si cualquiera puede publicar una **public key**, ¿cómo sabes que la clave de «banco.com» es realmente del banco? La respuesta es la **PKI (Public Key Infrastructure)**: un sistema de organizaciones, procesos y ficheros firmados que **vincula una identidad a una clave pública**. El objeto central es el **digital certificate**, un documento que dice «esta clave pública pertenece a este sujeto» y que está **firmado** por alguien en quien tu navegador ya confía.',
    },
    {
      t: 'p',
      md: 'Los actores son pocos, analista, y hay que tenerlos claros. La **Certificate Authority (CA)** es quien **emite y firma** certificados; su firma es lo que da valor al documento. La **Registration Authority (RA)** es la ventanilla que **verifica la identidad** de quien pide un certificado antes de que la CA lo firme (en muchas PKIs, CA y RA son la misma entidad). El proceso empieza cuando la solicitante genera su par de claves y crea un **Certificate Signing Request (CSR)**: contiene su **public key** y sus datos de identidad (CN, organización, SANs) y va firmado con su private key para demostrar que la posee. **La private key nunca viaja en el CSR** ni sale de su dueña. La CA valida, firma y devuelve el certificado.',
    },
    {
      t: 'code',
      lang: 'text',
      title: 'Cadena de confianza (chain of trust)',
      text: `[ROOT CA]  "Confianza Global Root"        <- root of trust
   Subject : CN=Confianza Global Root
   Issuer  : CN=Confianza Global Root       (self-signed: subject == issuer)
   Validity: 2020 -> 2045
   Key     : RSA 4096 / stored in HSM, kept OFFLINE
   Signed by: itself
        |
        | signs
        v
[INTERMEDIATE CA]  "Confianza Global TLS Issuing CA 3"
   Subject : CN=Confianza Global TLS Issuing CA 3
   Issuer  : CN=Confianza Global Root
   Validity: 2023 -> 2033
   Key     : ECC P-384 / HSM, ONLINE
   Signed by: Root CA private key
        |
        | signs
        v
[LEAF / END-ENTITY]  "www.ejemplo.com"
   Subject : CN=www.ejemplo.com
   SAN     : DNS:www.ejemplo.com, DNS:ejemplo.com
   Issuer  : CN=Confianza Global TLS Issuing CA 3
   Validity: 2026-01-10 -> 2027-01-10
   Key     : ECC P-256 (public key of the web server)
   OCSP    : http://ocsp.confianza.example
   CRL     : http://crl.confianza.example/issuing3.crl
   Signed by: Intermediate CA private key

El navegador valida de abajo arriba: leaf -> intermediate -> root.
El root ya está en el trust store del sistema; por eso la cadena "cierra".`,
    },
    {
      t: 'callout',
      kind: 'exam',
      title: 'Nota de examen',
      md: 'Tres patrones que se repiten: **«issuer unknown / not trusted» en el navegador** → certificado **self-signed** o falta el **intermediate** en la cadena que sirve el servidor. **«Verify revocation status quickly / in real time»** → **OCSP** (y **OCSP stapling** si además piden reducir carga o latencia). **«Protect the CA\'s private keys»** → **HSM**. Y recuerda: el **root CA** es **self-signed** por definición y se mantiene **offline**; el trabajo diario lo hacen las intermedias.',
    },
    {
      t: 'check',
      q: {
        q: 'A web administrator installs a certificate purchased from a public CA, but visitors receive a browser warning that the certificate issuer is unknown. The certificate itself is valid and not expired. What is the MOST likely cause?',
        choices: [
          'The certificate was self-signed by the administrator',
          'The server is not sending the intermediate CA certificate in the chain',
          'The CRL has not been downloaded by the browser',
          'The private key was included in the CSR',
        ],
        answer: 1,
        explain:
          'Browsers trust the root but usually need the server to present the intermediate certificate to complete the chain; without it the issuer cannot be linked to a trusted root. The certificate is not self-signed because it came from a public CA, and a missing CRL would cause a revocation error, not an unknown-issuer warning.',
      },
    },
    {
      t: 'list',
      items: [
        '**Third-party (public CA)** — emitido por una CA cuyo root ya está en los trust stores de navegadores y sistemas (DigiCert, Let\'s Encrypt…). Es lo que necesitas para cualquier servicio expuesto al público.',
        '**Self-signed** — el sujeto se firma a sí mismo; no hay tercero que avale la identidad, así que todo cliente mostrará advertencia salvo que lo importes manualmente. Válido para laboratorios, pruebas y sistemas internos donde controlas los clientes. Los **root CA** son self-signed, pero ahí la confianza se establece distribuyéndolos al trust store.',
        '**Wildcard** — `*.ejemplo.com` cubre `www`, `mail`, `vpn`… pero **un solo nivel**: no cubre `ejemplo.com` a secas ni `a.b.ejemplo.com`. Menos gestión, pero si se compromete la clave, caen todos los subdominios.',
        '**SAN (Subject Alternative Name)** — un certificado con varios nombres explícitos; hoy los navegadores ignoran el CN y solo miran las SAN.',
        '**Campos que debes reconocer** — **Subject** (a quién identifica), **Issuer** (quién lo firmó), **Validity** (not before / not after), **Public key**, **Serial number**, **Signature** de la CA y las **extensiones** (SAN, Key Usage, puntos de CRL y OCSP).',
      ],
    },
    {
      t: 'p',
      md: 'Un certificado puede dejar de ser fiable antes de caducar: la private key se filtra, el dominio cambia de dueño, la empleada deja la empresa. Para eso existe la **revocation**. La **Certificate Revocation List (CRL)** es un fichero firmado por la CA con los números de serie revocados que el cliente descarga periódicamente; es simple pero puede estar **desactualizada** horas o días y crece con el tiempo. El **Online Certificate Status Protocol (OCSP)** permite preguntar a la CA **en tiempo real** por un certificado concreto: respuesta fresca, pero añade latencia, carga en la CA y revela a la CA qué sitios visitas. **OCSP stapling** resuelve ambos problemas: el propio servidor web obtiene periódicamente la respuesta OCSP firmada y la «grapa» al handshake TLS, así el cliente no tiene que consultar a nadie.',
    },
    {
      t: 'check',
      q: {
        q: 'A security team must ensure that a compromised server certificate is rejected by clients within minutes of revocation, without adding a round trip from every client to the CA. Which solution BEST meets both requirements?',
        choices: [
          'Publish an updated CRL every 24 hours',
          'Enable OCSP stapling on the web server',
          'Replace the certificate with a self-signed one',
          'Shorten the certificate validity period to one year',
        ],
        answer: 1,
        explain:
          'OCSP stapling gives clients a fresh, CA-signed status attached to the TLS handshake, so revocation is reflected quickly and clients never contact the CA themselves. A daily CRL can leave a revoked certificate trusted for up to a day, and a shorter validity period does nothing for a key compromised today.',
      },
    },
    {
      t: 'p',
      md: 'Dos conceptos de gestión cierran la parte de PKI. **Key escrow**: una copia de la **private key** (o de la clave de cifrado) se deposita en un tercero de confianza o en un sistema controlado por la organización, de modo que se pueda **recuperar** si la usuaria pierde la clave, deja la empresa, o si hay una orden legal. Es imprescindible para claves de **cifrado** (si se pierde, se pierden los datos) y debe evitarse para claves de **firma** (si otra persona puede firmar en tu nombre, adiós non-repudiation). **Key management** es el ciclo de vida completo: generación con entropía adecuada, almacenamiento protegido, distribución, **rotation** periódica, revocación y destrucción segura. La mayor parte de los incidentes criptográficos reales no son de algoritmos rotos, sino de claves mal gestionadas: en repositorios de código, en scripts, sin rotar en años.',
    },
    { t: 'h', text: 'Raíces de confianza en hardware' },
    {
      t: 'p',
      md: 'Toda cadena de confianza acaba en algo que hay que proteger físicamente: el **root of trust**. Si la private key se guarda en un fichero del disco, cualquier malware con privilegios la copia. Por eso existen componentes de hardware diseñados para que las claves **nunca salgan** de ellos: se generan dentro, se usan dentro y solo entran y salen los datos a firmar o descifrar.',
    },
    {
      t: 'table',
      headers: ['Componente', 'Dónde vive', 'Alcance', 'Uso típico'],
      rows: [
        [
          'TPM (Trusted Platform Module)',
          'Chip en la placa base (o firmware fTPM) de un equipo concreto',
          'Un dispositivo: sus claves y mediciones de arranque',
          'BitLocker sin PIN, Measured/Secure Boot, attestation de que el equipo no fue manipulado, Windows Hello',
        ],
        [
          'HSM (Hardware Security Module)',
          'Appliance dedicado tamper-resistant (rack, PCIe o USB)',
          'Toda la organización: claves de CA, firma de código, cifrado de BD',
          'Custodiar la private key de la CA, firmar certificados y código a alto rendimiento, cumplir FIPS 140',
        ],
        [
          'KMS (Key Management System / Service)',
          'Servicio, normalmente en la nube (AWS KMS, Azure Key Vault, Cloud KMS)',
          'Ciclo de vida centralizado de claves para muchas aplicaciones',
          'Crear, rotar, auditar y revocar claves que cifran buckets, discos y bases de datos; respaldado por HSMs del proveedor',
        ],
        [
          'Secure enclave',
          'Área aislada dentro del procesador de un dispositivo (Apple Secure Enclave, ARM TrustZone, Intel SGX)',
          'Un dispositivo: secretos y biometría de la usuaria',
          'Proteger la plantilla de huella o cara, claves de pago y de cifrado del móvil; ni el sistema operativo las puede leer',
        ],
      ],
    },
    {
      t: 'callout',
      kind: 'tip',
      title: 'Cómo distinguirlos en un escenario',
      md: 'Pregúntate **dónde** y **para quién**: *un portátil concreto, arranque verificado, BitLocker* → **TPM**. *Un teléfono, biometría, «ni siquiera el SO puede leerla»* → **secure enclave**. *Claves de la CA, firma de código, appliance certificado FIPS* → **HSM**. *Muchas apps en la nube, rotación centralizada, auditoría de uso* → **KMS**. TPM y enclave protegen *un dispositivo*; HSM y KMS sirven a *toda la organización*.',
    },
    {
      t: 'check',
      q: {
        q: 'An organization is building an internal certificate authority and wants to ensure that the CA\'s private key cannot be extracted even by an administrator with full access to the server. Which component BEST meets this requirement?',
        choices: [
          'A TPM on the CA server motherboard',
          'A hardware security module',
          'A cloud key management service',
          'Full-disk encryption on the CA server',
        ],
        answer: 1,
        explain:
          'An HSM is a tamper-resistant appliance built to generate and hold enterprise keys such as a CA\'s signing key and perform operations without ever exporting it, which is the standard for CA deployments. A TPM protects a single machine\'s keys and boot state rather than serving as a high-assurance CA key store, and FDE is transparent to an administrator on the running server.',
      },
    },
    {
      t: 'p',
      md: 'Con esto cierras el objetivo 1.4 y el Dominio 1 completo: controles, CIA/AAA, Zero Trust, seguridad física, gestión de cambios y criptografía con su infraestructura de confianza. A partir de aquí, el Dominio 2 cambia de perspectiva: dejas de construir defensas y pasas a estudiar a quien las ataca — **threat actors**, vectores y vulnerabilidades — para entender contra qué exactamente estabas cifrando y firmando.',
    },
  ],
  quiz: [
    {
      id: 'sp1m7q1',
      domain: 'General Security Concepts',
      prompt:
        'A systems administrator is requesting a TLS certificate from a public CA. Which of the following MUST be generated and sent to the CA?',
      choices: [
        'The server\'s private key and hostname',
        'A self-signed root certificate',
        'The current certificate revocation list',
        'A certificate signing request containing the public key and identity information',
      ],
      answer: 3,
      explain:
        'The CSR carries the public key and subject details and is signed with the private key to prove possession; the CA validates it and returns the signed certificate. The private key must never be sent to anyone, so an answer that transmits it is always wrong.',
    },
    {
      id: 'sp1m7q2',
      domain: 'General Security Concepts',
      prompt:
        'A company needs a single certificate to secure mail.corp.com, vpn.corp.com and portal.corp.com, and expects to add more subdomains at the same level over the next year. Which certificate type is the MOST efficient choice?',
      choices: [
        'A separate self-signed certificate for each host',
        'A wildcard certificate for *.corp.com',
        'A root CA certificate',
        'An extended validation certificate for corp.com only',
      ],
      answer: 1,
      explain:
        'A wildcard certificate covers every hostname at one level below corp.com, including subdomains created after issuance, so new hosts need no new certificate. Self-signed certificates would trigger warnings on every client, and a certificate for corp.com alone does not match the subdomains.',
    },
    {
      id: 'sp1m7q3',
      domain: 'General Security Concepts',
      prompt:
        'Which of the following BEST describes a root CA certificate in a properly designed PKI?',
      choices: [
        'It is issued by an intermediate CA and rotated every year',
        'It is requested through a CSR sent to a public third-party CA',
        'It is self-signed, distributed in trust stores, and its private key is kept offline',
        'It must be revoked through OCSP whenever a leaf certificate is compromised',
      ],
      answer: 2,
      explain:
        'The root sits at the top of the chain, so nothing above it can sign it: it signs itself, is pre-installed in trust stores, and its key stays offline while intermediates do the daily signing. Nobody issues a root to a root, and compromising a leaf is handled by revoking that leaf, not the root.',
    },
    {
      id: 'sp1m7q4',
      domain: 'General Security Concepts',
      prompt:
        'An auditor notes that clients may continue to trust a revoked certificate for up to 48 hours. Which revocation mechanism is the organization MOST likely relying on?',
      choices: [
        'OCSP with stapling',
        'A periodically published CRL',
        'Certificate pinning',
        'Key escrow',
      ],
      answer: 1,
      explain:
        'A CRL is a list published on a schedule and cached by clients, so a revocation only takes effect when the next list is downloaded, which explains a multi-hour window. OCSP queries status in near real time, and key escrow is about recovering keys, not revoking certificates.',
    },
    {
      id: 'sp1m7q5',
      domain: 'General Security Concepts',
      prompt:
        'A developer sets up a test web server in an isolated lab and needs HTTPS without paying a CA or exposing the server to the internet. Which certificate type is MOST appropriate?',
      choices: [
        'A self-signed certificate',
        'A wildcard certificate from a public CA',
        'An OCSP-stapled certificate',
        'A certificate with key escrow',
      ],
      answer: 0,
      explain:
        'A self-signed certificate provides encryption immediately with no third party and is acceptable where the administrator controls the clients, such as an isolated lab. A public wildcard certificate requires domain validation and cost that the scenario explicitly rules out.',
    },
    {
      id: 'sp1m7q6',
      domain: 'General Security Concepts',
      prompt:
        'A company encrypts its file server with certificates issued to individual employees. Management is concerned that data will become unrecoverable if an employee leaves or loses a smart card. Which practice BEST addresses this concern?',
      choices: [
        'OCSP stapling',
        'Switching to a wildcard certificate',
        'Storing user private keys in the file server\'s TPM',
        'Key escrow of the encryption private keys',
      ],
      answer: 3,
      explain:
        'Key escrow keeps a protected copy of each encryption private key with a trusted party so the organization can decrypt data when the original key holder is unavailable. Escrow is appropriate for encryption keys; it would undermine non-repudiation if applied to signing keys, and a TPM protects one machine rather than providing organization-wide recovery.',
    },
    {
      id: 'sp1m7q7',
      domain: 'General Security Concepts',
      prompt:
        'A laptop policy requires that the drive be encrypted, that the encryption key be released only if the boot process has not been tampered with, and that the user not have to enter an additional password at startup. Which hardware component enables this?',
      choices: [
        'A hardware security module',
        'A cloud key management service',
        'A Trusted Platform Module',
        'A smart card reader',
      ],
      answer: 2,
      explain:
        'The TPM on the motherboard stores the disk encryption key and measures each stage of boot, releasing the key only when the measurements match the expected state, which is how BitLocker works transparently. An HSM is an enterprise appliance for CA and application keys, not a per-laptop boot integrity chip.',
    },
    {
      id: 'sp1m7q8',
      domain: 'General Security Concepts',
      prompt:
        'A cloud architect must provide dozens of applications with centralized key generation, automatic rotation and an audit trail of every key use, without each team managing its own hardware. Which solution BEST fits?',
      choices: [
        'A key management service',
        'A secure enclave on each application server',
        'A TPM on each virtual machine host',
        'A certificate revocation list',
      ],
      answer: 0,
      explain:
        'A KMS centralizes the full key lifecycle for many workloads, handles rotation and logs every use, and is backed by the provider\'s HSMs. A secure enclave or TPM protects secrets on a single device and offers no centralized lifecycle or audit, and a CRL deals with certificate revocation rather than key management.',
    },
  ],
};

export const SP1_PART4: Module[] = [sp1m6, sp1m7];
