// End-to-end verification with an isolated browser. No user profile or external service is touched.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,readFile} from 'node:fs/promises';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const {preview}=await import('vite');
const port=Number(process.env.SECURITY_PREVIEW_PORT||5175);
const server=await preview({preview:{host:'127.0.0.1',port,strictPort:true}});
const {build}=await import('esbuild');
const compiled=await build({stdin:{contents:"export * from './src/data/security/practicals.ts'; export * from './src/data/security/exams.ts'; export * from './src/data/security/foundations.ts';",resolveDir:process.cwd()},bundle:true,platform:'node',format:'esm',write:false});
const fixtures=await import('data:text/javascript;base64,'+Buffer.from(compiled.outputFiles[0].text).toString('base64'));
const base=`http://127.0.0.1:${port}/ticourse/`;const out='node_modules/.cache/security-browser';await mkdir(out,{recursive:true});
let browser;
try {
 browser=await chromium.launch({channel:'chrome',headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true});
 await context.route('**/*',r=>new URL(r.request().url()).origin===new URL(base).origin?r.continue():r.abort());
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const go=async path=>{await page.goto(base+'#'+path,{waitUntil:'domcontentloaded',timeout:60000});};
 const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('alertopolis-security-learning-v1')||'{}'));
 await go('/security/study');await page.getByRole('heading',{name:'Tu recorrido, con vídeos',exact:true}).waitFor();
 await page.waitForFunction(()=>localStorage.getItem('intelforge-v1'));
 await page.getByRole('tab',{name:'🛡️ Security+',exact:true}).first().waitFor();
 assert.equal(await page.getByRole('tab',{name:'🛡️ Security+',exact:true}).first().getAttribute('aria-selected'),'true');
 const legacy=await page.evaluate(()=>JSON.parse(localStorage.getItem('intelforge-v1')));
 assert.equal(await page.getByText(/^SEMANA \d/).count(),24);
 await page.screenshot({path:out+'/route-desktop.png',fullPage:false});
 await go('/security/foundation/f06');await page.getByRole('button',{name:'Marcar lectura estudiada'}).click();await page.reload();await page.getByRole('button',{name:'✓ Lectura estudiada'}).waitFor();
 await go('/security/practice/foundation-network');await page.getByRole('heading',{name:'Mapa de red',exact:true}).waitFor();
 await page.getByLabel('Vecino local de A',{exact:true}).selectOption('1');await page.getByLabel('Siguiente salto hacia C',{exact:true}).selectOption('1');
 await page.getByRole('button',{name:'Comprobar mi decisión'}).click();assert.match(await page.getByRole('region',{name:'Corrección explicada'}).textContent(),/0%/);
 await page.getByLabel('Vecino local de A',{exact:true}).selectOption('0');await page.getByLabel('Siguiente salto hacia C',{exact:true}).selectOption('0');await page.getByRole('button',{name:'Comprobar mi decisión'}).click();await page.reload();
 await page.getByText(/Primer resultado: 0% · Último: 100%/).waitFor();
 console.log('PASS route, foundations, practice correction, draft persistence');
 for(const family of [1,2,3,4,5,6]){
  await go(`/security/practice/practice-${family}-b`);
  const data=fixtures.PRACTICE_CASES.find(c=>c.id===`practice-${family}-b`);
  for(const c of data.criteria)await page.getByLabel(c.label.es,{exact:true}).selectOption(c.accepted.at(-1));
  await page.getByRole('button',{name:'Comprobar mi decisión'}).click();assert.match(await page.getByRole('region',{name:'Corrección explicada'}).textContent(),/100%/);
 }
 console.log('PASS six autonomous practical families and equivalent outcomes');
 await go('/learn/sp1m1');await page.getByRole('region',{name:/Aprender con/}).waitFor();
 assert.equal(await page.getByRole('heading',{name:'Aplica lo aprendido a otra situación'}).count(),1);
 const chapter=page.getByRole('navigation',{name:/Capítulos de/}).getByRole('link').nth(1);await chapter.click();
 assert.match(page.url(),/video=controles-halden&start=93/);
 assert.equal(await page.locator('iframe').count(),0);
 await page.getByRole('button',{name:/Reproducir «Un control/}).click();
 assert.match(await page.locator('iframe').getAttribute('src'),/start=93/);
 await page.getByText('Leer transcripción',{exact:true}).click();await page.getByText(/Esta es una cerradura/).first().waitFor();
 await page.screenshot({path:out+'/video-learning-desktop.png',fullPage:false});
 console.log('PASS video prerequisites, verified chapters, click-to-load, transcript alternative');
 const forms=[fixtures.FOUNDATION_EXIT,fixtures.EXAM_FORMS[0]];
 for(const form of forms){
  await go(`/security/assessment/${form.id}`);await page.getByRole('button',{name:'Comenzar evaluación',exact:true}).click();
  const deadline=(await state()).attempts.at(-1).deadline;
  for(let i=0;i<form.items.length;i++){
   const item=form.items[i];
   if(item.kind==='pbq')for(const c of item.criteria)await page.getByLabel(c.label[form.id==='foundation-exit'?'es':'en'],{exact:true}).selectOption(c.accepted.at(-1));
   else for(const id of item.correct)await page.locator(`input[value="${id}"]`).check();
   if(i===0){await page.getByRole('button',{name:'Marcar para revisar',exact:true}).click();await page.reload();await page.getByRole('button',{name:'Quitar marca',exact:true}).waitFor();assert.equal((await state()).attempts.at(-1).deadline,deadline);assert.ok((await state()).attempts.at(-1).answers[item.id]);}
   assert.equal(await page.getByRole('region',{name:'Corrección explicada'}).count(),0);
   if(i+1<form.items.length)await page.getByRole('button',{name:'Siguiente',exact:true}).click();
  }
  await page.getByRole('button',{name:'Preparar entrega'}).click();await page.getByRole('button',{name:'Entregar y ver corrección'}).click();await page.getByRole('button',{name:'Repetir para practicar'}).waitFor();
  assert.equal((await state()).attempts.at(-1).overall,100);
  console.log(`PASS ${form.id}: complete UI flow, reload deadline, bookmarks, scoring and delayed feedback`);
 }
 await page.getByRole('button',{name:'Repetir para practicar'}).click();assert.equal((await state()).attempts.at(-1).exposedBefore,true);
 const reference=await context.newPage();await reference.goto(base+'#/learn/sp5m1?video=documentos-halden&start=0');
 const recovered=reference.getByRole('region',{name:'Aprender con Cuatro papeles: qué obliga y qué solo aconseja',exact:true});await recovered.waitFor();
 assert.equal(await recovered.getByRole('button',{name:'Comprobar mi decisión'}).count(),2);
 assert.ok(await recovered.evaluate(el=>el.getBoundingClientRect().top>=0&&el.getBoundingClientRect().top<200));
 await page.bringToFront();await page.getByRole('button',{name:'Ayuda registrada',exact:true}).waitFor();
 await page.getByRole('button',{name:'Marcar para revisar',exact:true}).click();
 assert.ok((await state()).attempts.at(-1).helps.includes('study-material'));await reference.close();
 console.log('PASS recovered published video, direct chapter access and help retained across tabs');
 await go('/learn/sp1m6');await page.getByRole('heading',{name:/Criptografía:/}).first().waitFor();assert.ok((await state()).attempts.at(-1).helps.includes('study-material'));
 await go('/security/assessment/form-A');
 await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('alertopolis-security-learning-v1'));s.attempts.at(-1).deadline=Date.now()+1000;localStorage.setItem('alertopolis-security-learning-v1',JSON.stringify(s));});
 await page.reload();await page.getByRole('button',{name:'Repetir para practicar'}).waitFor();assert.equal((await state()).attempts.at(-1).overall,0);
 console.log('PASS repeat exposure, study help detection, expiry after reload');
 await go('/security/study?view=workbook');const saved=page.waitForEvent('download');await page.getByRole('button',{name:'Exportar cuaderno JSON',exact:true}).click();const download=await saved;const raw=await readFile(await download.path(),'utf8');assert.equal(JSON.parse(raw).version,1);
 await page.getByLabel('Importar cuaderno',{exact:false}).setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{"version":99}')});await page.getByRole('status').filter({hasText:'Formato de cuaderno no válido.'}).waitFor();
 const other=await browser.newContext();const importedPage=await other.newPage();await importedPage.goto(base+'#/security/study?view=workbook');await importedPage.getByLabel('Importar cuaderno',{exact:false}).setInputFiles({name:'workbook.json',mimeType:'application/json',buffer:Buffer.from(raw)});await importedPage.getByText('Historial importado como práctica.',{exact:true}).waitFor();
 assert.equal(await importedPage.evaluate(()=>JSON.parse(localStorage.getItem('alertopolis-security-learning-v1')).attempts.every(a=>a.imported)),true);await other.close();
 const current=await page.evaluate(()=>JSON.parse(localStorage.getItem('intelforge-v1')));assert.deepEqual(current,legacy);
 await page.setViewportSize({width:390,height:844});await go('/security/study?view=videos');await page.getByRole('heading',{name:'Tu recorrido, con vídeos',exact:true}).waitFor();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));await page.screenshot({path:out+'/videos-mobile.png',fullPage:false});
 await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>document.activeElement!==document.body));
 await go('/security/practice/practice-1-a');await page.getByRole('heading',{name:/Firewall y segmentación/}).first().waitFor();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));await page.screenshot({path:out+'/practical-mobile.png',fullPage:false});
 assert.deepEqual(errors,[]);console.log('PASS export/import, legacy progress untouched, mobile and keyboard');
 console.log('Security+ browser verification complete');await context.close();
} finally {await browser?.close();await new Promise(resolve=>server.httpServer.close(resolve));}
