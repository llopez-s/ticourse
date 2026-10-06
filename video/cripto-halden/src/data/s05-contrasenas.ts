/**
 * s05-contrasenas «Cómo se guarda una contraseña» — on-screen strings (canon: out/scene-brief.md).
 * The accounts are the shipping companies' portal accounts (never the port's identity provider),
 * shown with no readable user name and masked passwords. The table is an EXAMPLE («así no»), not
 * the portal's data. Hashes and salts are invented; `7c1d…a4b0`, `2f9e…11c3` and `b80a…6d57` are
 * the storyboard's; `c2f7…8e15` (the login flow) is new and matches nothing in the registry.
 * Anti-spoiler: the two tricks carry no names before the think prompt; SALT shows only at `salt`,
 * KEY STRETCHING only at `stretch`.
 */

export const S05 = {
  login: {
    host: 'reservas.haldenport.example',
    title: 'Portal de reservas',
    zone: 'zona de navieras',
    user: 'usuario',
    pass: 'contraseña',
    button: 'entrar',
  },
  compare: ['el portal no necesita leer tu contraseña:', 'solo comprobarla'] as const,
  flow: {
    print: 'c2f7…8e15',
    stores: 'el portal guarda',
    storesWhat: 'su huella',
    notThis: 'la contraseña cifrada',
    match: 'coinciden: entra',
  },
  tricks: [
    { lines: ['a cada contraseña, un dato al azar', 'antes de sacar la huella'], button: 'un dato al azar' },
    { lines: ['sacar la huella miles de veces seguidas,', 'para que cada intento cueste'], button: 'miles de veces' },
  ] as const,
  table: {
    tag: 'ejemplo · así no',
    tagAfter: 'ejemplo · con sal',
    cols: { account: 'cuenta', pass: 'contraseña', salt: 'sal', print: 'huella' },
    rows: ['cuenta 1', 'cuenta 2'] as const,
    twin: '7c1d…a4b0',
    salts: ['k9Tz', 'R2wq'] as const,
    salted: ['2f9e…11c3', 'b80a…6d57'] as const,
    same: 'la misma',
    samePrint: ['la misma', 'huella'] as const,
    diffPrint: ['huellas', 'distintas'] as const,
  },
  salt: { term: 'SALT', sub: 'la sal: distinta en cada cuenta, guardada junto a su huella' },
  catalog: { title: 'huellas ya calculadas', rows: 5, term: 'RAINBOW TABLES' },
  rounds: { caption: 'miles de veces seguidas', count: 10000, countLabel: 'vueltas' },
  clocks: [
    { who: 'quien entra:', what: 'milisegundos, ni lo nota' },
    { who: 'quien prueba mil millones:', what: 'una muralla' },
  ] as const,
  stretch: { term: 'KEY STRETCHING', sub: 'bcrypt · PBKDF2 · Argon2' },
  notLonger: { struck: 'SHA-512 a secas', rest: ': más larga, casi igual de rápida' },
  wrap: {
    lead: 'las contraseñas se guardan',
    items: ['como huellas', 'con sal', 'y despacio'] as const,
  },
} as const;
