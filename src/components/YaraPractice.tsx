/// <reference types="vite/client" />
import { useId, useState } from 'react';
import reference from '../../public/labs/yara-practice/reference.yar?raw';

const STARTER = `rule MiRegla {
  meta:
    scope = "synthetic v1, not real malware"
  strings:
    // Define los patrones y sus variantes de codificación.
  condition:
    false // Sustituye por tu hipótesis de detección.
}
`;

export default function YaraPractice() {
  const id = useId();
  const [draft, setDraft] = useState(STARTER);
  const download = () => {
    const url = URL.createObjectURL(new Blob([draft], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mi-regla.yar';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <section className="my-6 space-y-4 rounded-xl border border-cyan-500/40 bg-ink-900 p-4">
      <h3 className="font-bold text-slate-100">Escritura libre · YARA real fuera del navegador</h3>
      <p className="text-sm text-slate-300">
        Escribe una regla que detecte A, B y C del corpus inerte, con cero coincidencias
        en los controles v1. Este editor no compila ni ejecuta YARA. El borrador se
        pierde al salir: descárgalo para conservarlo. Práctica opcional, sin efecto en el examen.
      </p>
      <a className="inline-block text-cyan-300 underline" download href={`${import.meta.env.BASE_URL}labs/yara-practice.zip`}>
        Descargar corpus inerte y verificador (ZIP)
      </a>
      <div className="text-sm text-slate-300">
        <p>A: cabecera ALRTDEMO al inicio; marcador cicada-demo-v1; ruta route=/collect-demo; bytes 41 4C 52 54 22 7F.</p>
        <p>B: mismo marcador en mayúsculas y texto con bytes 00 intercalados; misma ruta. C: marcador original, ruta distinta y bytes 41 4C 52 54 99 7F.</p>
        <p>Controles: ruta sola, marcador solo, hex solo, manual que copia todo sin cabecera al inicio, cadenas comunes y archivos fuera del tamaño pactado (&lt;4096 bytes).</p>
      </div>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-100">Tu regla YARA (borrador local)</label>
      <textarea id={id} value={draft} onChange={(event) => setDraft(event.target.value)} spellCheck={false}
        className="min-h-72 w-full rounded-lg border border-ink-600 bg-ink-950 p-3 font-mono text-sm text-slate-200 focus-visible:outline-2 focus-visible:outline-cyan-400" />
      <button type="button" onClick={download} className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-ink-950 hover:bg-cyan-400">
        Descargar mi-regla.yar
      </button>
      <p className="text-sm text-slate-300">Tras descomprimir el ZIP, sigue README.txt y ejecuta en tu entorno local:</p>
      <pre className="overflow-x-auto rounded-lg bg-ink-950 p-3 text-xs text-cyan-300">{'python verify.py --rule mi-regla.yar --name MiRegla\npython verify.py'}</pre>
      <details className="rounded-lg border border-ink-700 p-3">
        <summary className="cursor-pointer font-semibold text-cyan-300">Ver solución comentada</summary>
        <p className="my-3 text-sm text-slate-300">La familia exige marcador y (ruta o hex), con cabecera al inicio y tamaño acotado. La ruta sola colisiona; exigir todo pierde C. ASCII y wide cubren A/B; nocase admite mayúsculas. La regla de muestra pierde variantes y la de hunting incluye controles para revisión. El archivo README explica cada decisión y los falsos negativos conocidos.</p>
        <pre className="overflow-x-auto text-xs text-slate-300"><code>{reference}</code></pre>
      </details>
    </section>
  );
}
