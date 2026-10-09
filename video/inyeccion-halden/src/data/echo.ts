/**
 * The search box's echo (s04, s05). ON SCREEN ONLY: the voice never reads them. `enviar(...)` does not exist and
 * there is no host, domain or address anywhere: the text is an illustrative input, not a working script.
 */
export const SCRIPT = '<script>enviar(document.cookie)</script>';
/** The same text after output encoding (the characters that matter turned into harmless text). */
export const SCRIPT_ENCODED = '&lt;script&gt;enviar(document.cookie)&lt;/script&gt;';

/** The test copy's search address: a path only, no domain (the copy's place in the network is not shown). */
export const URL_PATH = '/buscar?matricula=';

/** A plate that belongs to no one: the box the voice replaces with a script. */
export const PLATE = '4821 KLM';
