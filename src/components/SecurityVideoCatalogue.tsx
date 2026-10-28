import { Link } from 'react-router-dom';
import { VIDEO_INVENTORY } from '../data/security/video-inventory';
import { Panel } from './Bits';

const PROFESSIONAL:Record<string,string>={
  'feeds-requisito':'Requisitos CTI y evaluación de fuentes',
  'muestra-candidatos':'Hashes, pivotes y límites de atribución',
  'yara-condicion':'Sintaxis YARA y corpus de prueba',
  'yara-prueba-entrega':'Condiciones YARA y validación de positivos y negativos',
  'stealers-metricas':'Sesiones, sesgo de fuentes y análisis CTI',
};
export function SecurityVideoCatalogue(){
 const videos=VIDEO_INVENTORY.filter(v=>v.track==='secplus'||PROFESSIONAL[v.id]);
 const security=VIDEO_INVENTORY.filter(v=>v.track==='secplus');
 const integrated=security.filter(v=>v.status==='integrated'&&!v.lessonId.startsWith('sp7')).length;
 return <><Panel className="mb-4"><p className="text-sm leading-relaxed text-slate-300">{security.length} vídeos Security+ localizados: {integrated} integrados en el recorrido SY0-701 y {security.length-integrated} ampliaciones complementarias, conservadas en sus lecciones. Los vídeos del recorrido tienen capítulos, transcripción y dos actividades posteriores. Las ampliaciones conservan sus conocimientos previos.</p><p className="mt-3 text-xs leading-relaxed text-slate-400">{security.filter(v=>v.youtube).length} tienen enlace de YouTube registrado y {security.filter(v=>v.src).length} usan archivos locales. El inventario distingue la integración didáctica de la publicación; disponer de un enlace no verifica su visibilidad actual.</p></Panel><div className="space-y-3">{videos.map(v=><Panel key={v.id}>
   <div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="font-semibold text-slate-100">{v.title}</h2><span className={`font-mono text-xs ${v.status==='integrated'?'text-emerald-300':'text-amber-200'}`}>{({integrated:'Integrado',finished:'Terminado · ampliación disponible',recorded:'Grabado · pendiente de montaje',scripted:'Guion revisado'})[v.status]}</span></div>
   <p className="my-2 text-xs text-slate-400">{v.lessonId} · {v.role==='complementary'?'Ampliación complementaria':v.role==='review'?'Repaso final':'Lección principal'}{v.durationSeconds?` · ${Math.floor(v.durationSeconds/60)}:${String(v.durationSeconds%60).padStart(2,'0')}`:''}</p>
   {PROFESSIONAL[v.id]?<p className="mb-2 text-sm text-slate-300">Antes de empezar: {PROFESSIONAL[v.id]}. Ampliación profesional opcional, posterior a los fundamentos.</p>:null}
   {v.lessonId.startsWith('sp7')?<p className="mb-2 text-sm text-slate-300">Ampliación de otra versión. Requiere completar los dominios relacionados de SY0-701 y no forma parte de sus evaluaciones.</p>:null}
   {v.status==='integrated'?<Link className="text-sm text-cyan-300 underline" to={`/learn/${v.lessonId}?video=${v.id}&start=0`}>Estudiar con este vídeo</Link>:<div className="flex flex-wrap gap-4 text-sm">{v.transcript?<a className="text-cyan-300 underline" href={`${import.meta.env.BASE_URL}${v.transcript}`} target="_blank" rel="noreferrer">Leer transcripción final</a>:null}{v.youtube?<a className="text-cyan-300 underline" href={`https://www.youtube.com/watch?v=${v.youtube}`} target="_blank" rel="noreferrer">Ver ampliación</a>:null}<p className="w-full text-xs text-slate-400">Producción documentada · {v.evidence}</p></div>}
 </Panel>)}</div></>;
}
