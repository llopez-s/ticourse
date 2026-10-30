// Derive chapters from the audio montage and verify its duration against shipped captions.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { build } from 'esbuild';
const recovered = JSON.parse(fs.readFileSync('src/data/security/produced-videos.json','utf8'));
for (const video of recovered) for (const [asset, hash] of Object.entries(video.production.assets)) {
  if (crypto.createHash('sha256').update(/\.(txt|vtt)$/.test(asset)?fs.readFileSync(`public/${asset}`,'utf8').replace(/\r\n/g,'\n'):fs.readFileSync(`public/${asset}`)).digest('hex') !== hash) throw new Error(`Changed final asset: ${asset}`);
}
const blocks = recovered.filter(v=>v.status==='integrated'&&v.youtube).map(v=>({lessonId:v.lessonId,block:{t:'video',title:v.title,youtube:v.youtube,poster:v.poster,transcript:v.transcript}}));
const blockSource = `// Generated from the verified production snapshot. Append to preserve existing block links.\nimport type {Module,YouTubeVideoBlock} from '../../lib/types';\nconst PRODUCED: {lessonId:string;block:YouTubeVideoBlock}[] = ${JSON.stringify(blocks,null,2)};\nexport function withProducedVideos(module:Module):Module {\n  const videos=PRODUCED.filter(v=>v.lessonId===module.id&&!module.blocks.some(b=>b.t==='video'&&b.transcript===v.block.transcript));\n  return videos.length?{...module,blocks:[...module.blocks,...videos.map(v=>v.block)]}:module;\n}\n`;
const blockTarget='src/data/security/produced-video-blocks.ts';
if(process.argv.includes('--check')) {if(!fs.existsSync(blockTarget)||fs.readFileSync(blockTarget,'utf8').replace(/\r\n/g,'\n')!==blockSource)throw Error('Produced video blocks are stale');}
else fs.writeFileSync(blockTarget,blockSource);
const result = await build({entryPoints:['src/data/tracks.ts'], bundle:true, platform:'node', format:'esm', write:false});
const { TRACKS } = await import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const projects = fs.readdirSync('video', {withFileTypes:true}).filter(d => d.isDirectory() && fs.existsSync(`video/${d.name}/video.json`)).map(d => ({folder:d.name, ...read(`video/${d.name}/video.json`)}));
const seconds = t => t.split(':').reduce((n, x) => n * 60 + Number(x), 0);
const inventory = [];
for (const [track, value] of Object.entries(TRACKS)) for (const m of value.modules) for (const b of m.blocks.filter(b => b.t === 'video')) {
  const slug = path.basename(b.transcript).replace('-transcript.txt', '');
  const project = projects.find(p => (p.output ?? p.slug) === slug);
  const captions = `videos/${slug}-captions.vtt`;
  const vtt = fs.readFileSync(`public/${captions}`, 'utf8');
  const ends = [...vtt.matchAll(/-->\s*(\d\d:\d\d:\d\d\.\d+)/g)].map(x => seconds(x[1]));
  const lastCaption = Math.max(...ends);
  const timelinePath = project ? `video/${project.folder}/src/timeline.json` : '';
  const timeline = timelinePath && fs.existsSync(timelinePath) ? read(timelinePath) : undefined;
  const produced = recovered.find(v=>v.id===slug);
  if (produced) {
    if(Math.abs(produced.durationSeconds-lastCaption)>8)throw Error(`Unverified recovered captions: ${slug}`);
    const {production:_,...resource}=produced;
    inventory.push({...resource,title:b.title,lessonId:m.id});
    continue;
  }
  const duration = timeline?.mode === 'audio' ? timeline.durationInFrames / timeline.fps : lastCaption;
  if (track === 'secplus' && (!timeline || timeline.mode !== 'audio' || Math.abs(duration - lastCaption) > 8)) throw new Error(`Unverified final montage: ${slug}`);
  const chapters = timeline?.scenes?.filter((s, i, a) => !i || s.chapter !== a[i-1].chapter).map(s => ({title:s.chapterTitle || s.title, start:Math.floor(s.from/timeline.fps)})) ?? [{title:'Caso completo',start:0}];
  inventory.push({id:slug, track, lessonId:m.id, title:b.title, status:'integrated', role:'principal',
    youtube:b.youtube, src:b.src, poster:b.poster, transcript:b.transcript, captions,
    durationSeconds:Math.ceil(duration), verifiedAgainst:captions, chapters});
}
for (const {production:_,...resource} of recovered) if(!inventory.some(v=>v.id===resource.id))inventory.push(resource);
// Scripts not yet tied to a lesson (the fundamentals videos) stay out until they get one.
for (const p of projects.filter(p => p.lesson && !inventory.some(v => v.id === (p.output ?? p.slug)))) {
  const output = `video/${p.folder}/out`;
  const rendered = fs.existsSync(output) && fs.readdirSync(output).some(f => f.endsWith('.mp4'));
  inventory.push({id:p.output ?? p.slug, track:p.track, lessonId:p.lesson, title:p.tags?.[1] ?? p.slug,
    status:rendered?'finished':'scripted', role:'complementary', evidence:`video/${p.folder}/video.json`,chapters:[]});
}
for (const [id,lessonId,title] of [['documentos-halden','sp5m1','Políticas, estándares, procedimientos y guidelines'],['roles-halden','sp5m2','Gobernanza y roles'],['proveedores-halden','sp5m5','Evaluación y acuerdos con proveedores']]) {
  if (!inventory.some(v=>v.id===id)) inventory.push({id,track:'secplus',lessonId,title,status:'recorded',role:'principal',evidence:'docs/reviews/2026-10-23-grabado-vs-main.md',chapters:[]});
}
inventory.sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0);
const body = '// Generated by scripts/build-security-inventory.mjs; do not invent publication status.\nexport interface VideoResource { id:string; track:string; lessonId:string; title:string; status:"integrated"|"finished"|"recorded"|"scripted"; role:string; youtube?:string; src?:string; poster?:string; transcript?:string; captions?:string; durationSeconds?:number; verifiedAgainst?:string; evidence?:string; chapters:{title:string;start:number}[] }\nexport const VIDEO_INVENTORY: VideoResource[] = ' + JSON.stringify(inventory,null,2) + ';\n';
const target = 'src/data/security/video-inventory.ts';
if (process.argv.includes('--check')) {
  if (!fs.existsSync(target) || fs.readFileSync(target,'utf8').replace(/\r\n/g,'\n') !== body) throw new Error('Video inventory is stale');
} else fs.writeFileSync(target,body);
console.log(`${inventory.length} resources; ${inventory.filter(v=>v.track==='secplus'&&v.status==='integrated').length} Security+ videos with verified montage chapters`);
